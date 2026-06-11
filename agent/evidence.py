from __future__ import annotations

import math
import re
import unicodedata
from collections.abc import Callable
from typing import Any, Iterable

from component_metadata import ComponentMetadata, LocalizedRule, localized_text

from .entity_resolution import exact_match_supersedes_semantic
from .models import (
    ComponentCandidate,
    ComponentEvidence,
    ComponentSelection,
    EvidenceItem,
    EvidenceTier,
    ExactEntityMatch,
    PerspectiveCoverage,
    RejectedComponent,
    RecommendationFirmness,
    SelectedRule,
)


RuleScorer = Callable[[str, list[str]], list[float]]
ALTERNATIVE_THRESHOLD = 0.03
ALTERNATIVE_LIMIT = 3
SELECTION_POLICY = (
    "highest_weighted_score_among_active_candidates_with_partial_or_strong_evidence"
)


def evidence_tier(top_similarity: float | None, *, has_results: bool) -> EvidenceTier:
    if not has_results or top_similarity is None:
        return "insufficient"
    if top_similarity >= 0.75:
        return "strong"
    if top_similarity >= 0.50:
        return "partial"
    return "weak"


EVIDENCE_BASIS_BY_TIER: dict[str, str] = {
    "strong": "direct",
    "partial": "partial",
    "weak": "inferred",
    "insufficient": "absent",
}

EVIDENCE_BASIS_GUIDANCE: dict[str, str] = {
    "direct": (
        "Canonical component data or strong retrieved evidence confirms the "
        "answer. Respond firmly and cite the fields used."
    ),
    "partial": (
        "Useful fields or chunks exist but do not cover every requested "
        "detail. Respond with the available data and add a short limitation "
        "section. Never refuse to answer about a documented component."
    ),
    "inferred": (
        "The answer is derived from general design-system or accessibility "
        "rules without direct component confirmation. Label the inference "
        "explicitly and keep confidence low."
    ),
    "absent": (
        "There is no sufficient basis to answer without inventing. State the "
        "boundary and suggest a related question within the design system."
    ),
}


def evidence_basis(tier: EvidenceTier | str) -> str:
    """Map a retrieval tier to the governed evidence basis vocabulary.

    The basis distinguishes direct, partial, inferred and absent evidence so
    the composer and the validator can calibrate firmness without blocking
    answerable questions about documented components.
    """
    return EVIDENCE_BASIS_BY_TIER.get(str(tier), "absent")


def _excerpt(text: str, max_length: int = 360) -> str:
    normalized = re.sub(r"\s+", " ", text).strip()
    if len(normalized) <= max_length:
        return normalized
    return normalized[: max_length - 3].rstrip() + "..."


def evidence_from_chunks(chunks: Iterable[dict[str, Any]]) -> list[EvidenceItem]:
    items: list[EvidenceItem] = []
    seen: set[tuple[str, str, str]] = set()

    for chunk in chunks:
        semantic_text = str(chunk.get("semantic_text") or chunk.get("text", ""))
        excerpt = _excerpt(semantic_text)
        key = (
            str(chunk.get("source", "")).strip().lower(),
            str(chunk.get("title", "")).strip().lower(),
            str(chunk.get("component_id", "")).strip().lower() or excerpt.lower(),
        )
        if key in seen:
            continue
        seen.add(key)
        similarity = max(0.0, min(1.0, float(chunk.get("similarity", 0.0) or 0.0)))
        items.append(EvidenceItem(
            title=str(chunk.get("title", "")),
            source=str(chunk.get("source", "")),
            page_type=str(chunk.get("page_type", "")),
            excerpt=excerpt,
            semantic_text=semantic_text,
            component_id=str(chunk.get("component_id", "")).strip() or None,
            status=chunk.get("status") or None,
            section=str(chunk.get("section", "")).strip() or None,
            when_to_use=chunk.get("when_to_use"),
            when_not_to_use=chunk.get("when_not_to_use"),
            accessibility=chunk.get("accessibility"),
            aetheris_insight=chunk.get("aetheris_insight"),
            component_metadata=chunk.get("component_metadata"),
            similarity=similarity,
            retrieval_weight=max(0.0, float(chunk.get("retrieval_weight", 1.0) or 1.0)),
            weighted_score=float(chunk.get("weighted_score", similarity) or similarity),
        ))

    items.sort(key=lambda item: (item.weighted_score, item.similarity), reverse=True)
    return items


def top_similarity(items: list[EvidenceItem]) -> float:
    return max((item.similarity for item in items), default=0.0)


def evidence_item_to_chunk(item: EvidenceItem) -> dict[str, Any]:
    return {
        "title": item.title,
        "source": item.source,
        "page_type": item.page_type,
        "text": item.semantic_text,
        "component_id": item.component_id,
        "status": item.status,
        "section": item.section,
        "when_to_use": [
            rule.model_dump(mode="json")
            for rule in item.when_to_use
        ] if item.when_to_use is not None else None,
        "when_not_to_use": [
            rule.model_dump(mode="json")
            for rule in item.when_not_to_use
        ] if item.when_not_to_use is not None else None,
        "accessibility": (
            item.accessibility.model_dump(mode="json")
            if item.accessibility else None
        ),
        "aetheris_insight": item.aetheris_insight,
        "component_metadata": (
            item.component_metadata.model_dump(mode="json")
            if item.component_metadata else None
        ),
        "similarity": item.similarity,
        "retrieval_weight": item.retrieval_weight,
        "weighted_score": item.weighted_score,
    }


def _normalize_tokens(value: str) -> set[str]:
    normalized = unicodedata.normalize("NFD", value.lower())
    ascii_text = "".join(
        character
        for character in normalized
        if unicodedata.category(character) != "Mn"
    )
    return {
        token
        for token in re.findall(r"[a-z0-9]+", ascii_text)
        if len(token) > 2
    }


def _lexical_rule_scores(query: str, texts: list[str]) -> list[float]:
    query_tokens = _normalize_tokens(query)
    scores: list[float] = []
    for text in texts:
        text_tokens = _normalize_tokens(text)
        if not query_tokens or not text_tokens:
            scores.append(0.0)
            continue
        overlap = len(query_tokens & text_tokens)
        union = len(query_tokens | text_tokens)
        coverage = overlap / len(query_tokens)
        jaccard = overlap / union if union else 0.0
        scores.append(round(min(1.0, coverage * 0.7 + jaccard * 0.3), 6))
    return scores


def _rule_text(rule: LocalizedRule) -> str:
    return " ".join(
        part for part in (rule.text.pt, rule.text.en or "") if part
    )


def _select_rules(
    *,
    query: str,
    component: ComponentMetadata,
    field: str,
    rules: list[LocalizedRule] | None,
    scorer: RuleScorer | None,
    limit: int = 3,
) -> list[SelectedRule]:
    if not rules:
        return []
    texts = [_rule_text(rule) for rule in rules]
    scores = scorer(query, texts) if scorer else _lexical_rule_scores(query, texts)
    if len(scores) != len(rules) or any(not math.isfinite(score) for score in scores):
        scores = _lexical_rule_scores(query, texts)
    ranked = sorted(
        zip(rules, scores, strict=True),
        key=lambda pair: pair[1],
        reverse=True,
    )
    selected: list[SelectedRule] = []
    for rule, score in ranked[:limit]:
        sources = (
            component.provenance.get(f"{field}.{rule.id}")
            or component.provenance.get(field, [])
        )
        selected.append(SelectedRule(
            id=rule.id,
            field=field,
            text=localized_text(rule.text),
            rule_similarity=max(0.0, min(1.0, float(score))),
            sources=sources,
        ))
    return selected


def _field_presence(component: ComponentMetadata) -> tuple[list[str], list[str], list[str]]:
    payload = component.model_dump(mode="json")
    present: list[str] = []
    missing: list[str] = []
    empty: list[str] = []

    def visit(value: Any, path: str) -> None:
        if value is None:
            missing.append(path)
            return
        if isinstance(value, list):
            if not value:
                empty.append(path)
                return
            present.append(path)
            return
        if isinstance(value, dict):
            present.append(path)
            if set(value) == {"pt", "en"}:
                return
            for key, child in value.items():
                if path == "provenance":
                    break
                visit(child, f"{path}.{key}" if path else key)
            return
        present.append(path)

    for field, value in payload.items():
        if field in {"provenance"}:
            continue
        visit(value, field)
    return (
        sorted(set(present)),
        sorted(set(missing)),
        sorted(set(empty)),
    )


def _coverage(
    component: ComponentMetadata,
    profile: str,
    present_fields: list[str],
) -> PerspectiveCoverage:
    specialized = {
        "dev": [
            "states",
            "variants",
            "edge_cases",
            "accessibility.keyboard",
            "accessibility.aria",
        ],
        "a11y": [
            "accessibility.summary",
            "accessibility.items",
            "accessibility.keyboard",
            "accessibility.aria",
            "states",
            "edge_cases",
        ],
    }
    required = specialized.get(profile, [
        "component_id",
        "status",
        "intent",
        "do",
        "dont",
        "when_to_use",
        "when_not_to_use",
        "accessibility.summary",
    ])
    present = [
        field
        for field in required
        if field in present_fields
        or any(path.startswith(f"{field}.") for path in present_fields)
    ]
    missing = [field for field in required if field not in present]
    ratio = len(present) / len(required) if required else 1.0
    return PerspectiveCoverage(
        profile=profile,
        required_fields=required,
        present_required_fields=present,
        missing_required_fields=missing,
        coverage_ratio=round(ratio, 4),
    )


def component_evidence_from_item(
    item: EvidenceItem,
    *,
    query: str,
    profile: str,
    rule_scorer: RuleScorer | None = None,
) -> ComponentEvidence | None:
    component = item.component_metadata
    if component is None:
        return None
    present, missing, empty = _field_presence(component)
    return ComponentEvidence(
        component=component,
        excerpt=item.excerpt,
        similarity=item.similarity,
        retrieval_weight=item.retrieval_weight,
        weighted_score=item.weighted_score,
        evidence_tier=evidence_tier(item.similarity, has_results=True),
        present_fields=present,
        missing_fields=missing,
        empty_fields=empty,
        field_sources=component.provenance,
        selected_do_rules=_select_rules(
            query=query,
            component=component,
            field="do",
            rules=component.do,
            scorer=rule_scorer,
        ),
        selected_dont_rules=_select_rules(
            query=query,
            component=component,
            field="dont",
            rules=component.dont,
            scorer=rule_scorer,
        ),
        selected_when_to_use=_select_rules(
            query=query,
            component=component,
            field="when_to_use",
            rules=component.when_to_use,
            scorer=rule_scorer,
        ),
        selected_when_not_to_use=_select_rules(
            query=query,
            component=component,
            field="when_not_to_use",
            rules=component.when_not_to_use,
            scorer=rule_scorer,
        ),
        perspective_coverage=_coverage(component, profile, present),
    )


def _catalog_evidence_for_named_components(
    named_components: list[str],
    *,
    query: str,
    profile: str,
    rule_scorer: RuleScorer | None = None,
    already_selected_ids: set[str] | None = None,
) -> list[ComponentEvidence]:
    """Direct catalog lookup for explicitly named components.

    Returns partial evidence (similarity=0.65) for components that exist in the
    canonical catalog but were not surfaced by semantic retrieval with adequate
    similarity. This prevents blocking on low-similarity queries when the component
    IS documented in the official catalog.

    Only components not already in already_selected_ids are injected.
    """
    from component_metadata import component_registry

    def _normalize_name(value: str) -> str:
        decomposed = unicodedata.normalize("NFD", value.lower().strip())
        return "".join(
            character
            for character in decomposed
            if unicodedata.category(character) != "Mn"
        )

    already_ids = already_selected_ids or set()
    registry = component_registry()
    name_to_component = {
        _normalize_name(component.name): component
        for component in registry.values()
    }
    evidences: list[ComponentEvidence] = []

    for name in named_components:
        component = name_to_component.get(_normalize_name(name))
        if component is None:
            continue
        if component.component_id in already_ids:
            continue
        if component.status in ("deprecated", "legacy"):
            continue

        present, missing, empty = _field_presence(component)
        coverage = _coverage(component, profile, present)
        # Catalog evidence is canonical: when the required fields for the
        # active perspective are fully documented, the lookup is strong.
        catalog_tier: EvidenceTier = (
            "strong" if coverage.coverage_ratio >= 0.999 else "partial"
        )
        evidence = ComponentEvidence(
            component=component,
            excerpt=f"Catalog evidence for {component.name} (direct lookup).",
            similarity=0.65,
            retrieval_weight=1.0,
            weighted_score=0.65,
            evidence_tier=catalog_tier,
            evidence_source="canonical_catalog",
            present_fields=present,
            missing_fields=missing,
            empty_fields=empty,
            field_sources=component.provenance,
            selected_do_rules=_select_rules(
                query=query,
                component=component,
                field="do",
                rules=component.do,
                scorer=rule_scorer,
            ),
            selected_dont_rules=_select_rules(
                query=query,
                component=component,
                field="dont",
                rules=component.dont,
                scorer=rule_scorer,
            ),
            selected_when_to_use=_select_rules(
                query=query,
                component=component,
                field="when_to_use",
                rules=component.when_to_use,
                scorer=rule_scorer,
            ),
            selected_when_not_to_use=_select_rules(
                query=query,
                component=component,
                field="when_not_to_use",
                rules=component.when_not_to_use,
                scorer=rule_scorer,
            ),
            perspective_coverage=coverage,
        )
        evidences.append(evidence)

    return evidences


def _candidate(evidence: ComponentEvidence) -> ComponentCandidate:
    return ComponentCandidate(
        component_id=evidence.component.component_id,
        name=evidence.component.name,
        status=evidence.component.status,
        weighted_score=evidence.weighted_score,
        evidence_similarity=evidence.similarity,
        evidence_tier=evidence.evidence_tier,
    )


def _recommendation_firmness(
    recommended: ComponentEvidence | None,
    *,
    exact_match: ExactEntityMatch | None,
    workflow: str | None = None,
) -> RecommendationFirmness:
    if recommended is None:
        return "insufficient"
    if workflow in {"entity_lookup", "direct_entity_guidance"}:
        return "firm" if exact_match else "partial_match"
    if exact_match and recommended.component.component_id == exact_match.component_id:
        return "firm"
    if recommended.evidence_tier == "strong":
        return "firm"
    if recommended.evidence_tier == "partial":
        return "partial_match"
    return "insufficient"


def build_component_selection(
    items: list[EvidenceItem],
    *,
    query: str,
    profile: str,
    rule_scorer: RuleScorer | None = None,
    named_components: list[str] | None = None,
    exact_entity_matches: list[ExactEntityMatch] | None = None,
    workflow: str | None = None,
) -> ComponentSelection:
    primary_exact = exact_entity_matches[0] if exact_entity_matches else None
    exact_names = [match.name for match in (exact_entity_matches or [])]
    if exact_names:
        named_components = list(dict.fromkeys([*(named_components or []), *exact_names]))

    component_items = [
        item
        for item in items
        if item.page_type in {"component", "xai_component"}
    ]
    evidences: list[ComponentEvidence] = []
    rejected: list[RejectedComponent] = []
    unresolved_items: list[EvidenceItem] = []

    if primary_exact:
        catalog_first = _catalog_evidence_for_named_components(
            [primary_exact.name],
            query=query,
            profile=profile,
            rule_scorer=rule_scorer,
        )
        for evidence in catalog_first:
            evidence.similarity = 1.0
            evidence.weighted_score = 1.0
            evidence.evidence_source = "canonical_catalog"
            evidence.evidence_tier = "strong"
            evidences.append(evidence)

    for item in component_items:
        evidence = component_evidence_from_item(
            item,
            query=query,
            profile=profile,
            rule_scorer=rule_scorer,
        )
        if evidence is None:
            unresolved_items.append(item)
            continue
        evidences.append(evidence)

    evidences.sort(
        key=lambda evidence: (evidence.weighted_score, evidence.similarity),
        reverse=True,
    )
    eligible: list[ComponentEvidence] = []
    for evidence in evidences:
        candidate = _candidate(evidence)
        if (
            primary_exact
            and exact_match_supersedes_semantic(
                primary_exact,
                evidence.component.component_id,
            )
        ):
            rejected.append(
                RejectedComponent(
                    **candidate.model_dump(),
                    reason="superseded_by_exact_match",
                )
            )
            continue
        if evidence.component.status == "deprecated":
            rejected.append(RejectedComponent(**candidate.model_dump(), reason="deprecated_status"))
        elif evidence.component.status == "legacy":
            rejected.append(RejectedComponent(**candidate.model_dump(), reason="legacy_status"))
        elif evidence.evidence_tier == "weak":
            rejected.append(RejectedComponent(**candidate.model_dump(), reason="weak_evidence"))
        elif evidence.evidence_tier == "insufficient":
            rejected.append(RejectedComponent(**candidate.model_dump(), reason="insufficient_evidence"))
        else:
            eligible.append(evidence)

    for item in unresolved_items:
        item_tier = evidence_tier(item.similarity, has_results=True)
        rejected.append(RejectedComponent(
            component_id=item.component_id or "",
            name=item.title,
            status=item.status or "draft",
            weighted_score=item.weighted_score,
            evidence_similarity=item.similarity,
            evidence_tier=item_tier,
            reason="unresolved_component_id",
        ))

    if not eligible and named_components:
        already_ids = {evidence.component.component_id for evidence in evidences}
        catalog_evidences = _catalog_evidence_for_named_components(
            named_components,
            query=query,
            profile=profile,
            rule_scorer=rule_scorer,
            already_selected_ids=already_ids,
        )
        for evidence in catalog_evidences:
            eligible.append(evidence)
            evidences.append(evidence)

    if primary_exact and eligible:
        eligible.sort(
            key=lambda evidence: (
                0 if evidence.component.component_id == primary_exact.component_id else 1,
                -evidence.weighted_score,
                -evidence.similarity,
            ),
        )

    recommended = eligible[0] if eligible else None
    alternatives: list[ComponentCandidate] = []
    if recommended:
        alternatives = [
            _candidate(evidence)
            for evidence in eligible[1:]
            if recommended.weighted_score - evidence.weighted_score
            <= ALTERNATIVE_THRESHOLD + 1e-9
        ][:ALTERNATIVE_LIMIT]

    score_source = recommended or (evidences[0] if evidences else None)
    firmness = _recommendation_firmness(
        recommended,
        exact_match=primary_exact,
        workflow=workflow,
    )
    if recommended and primary_exact and recommended.component.component_id == primary_exact.component_id:
        reason = (
            f"{recommended.component.name} was resolved by exact catalog match "
            f"via alias '{primary_exact.matched_alias}'."
        )
    elif recommended:
        reason = (
            f"{recommended.component.name} has the highest weighted_score "
            "among active component candidates with partial or strong evidence."
        )
    elif evidences:
        reason = (
            "No active component candidate met the selection policy. "
            f"The highest ranked component was {evidences[0].component.name}."
        )
    else:
        reason = "No canonical component candidate was resolved from retrieval."

    return ComponentSelection(
        recommended=recommended,
        alternative_components=alternatives,
        rejected_components=rejected,
        weighted_score=score_source.weighted_score if score_source else 0.0,
        evidence_similarity=score_source.similarity if score_source else 0.0,
        evidence_tier=score_source.evidence_tier if score_source else "insufficient",
        evidence_source=(
            score_source.evidence_source
            if score_source else "semantic_retrieval"
        ),
        exact_entity_match=primary_exact,
        recommendation_firmness=firmness,
        alternative_threshold=ALTERNATIVE_THRESHOLD,
        alternative_limit=ALTERNATIVE_LIMIT,
        selection_reason=reason,
        selection_policy=SELECTION_POLICY,
        status_policy_applied=True,
    )
