"""Structured claim builder — one evidence origin per assertion."""

from __future__ import annotations

from component_metadata import localized_rules, localized_text

from .models import (
    CatalogEntityResolution,
    Claim,
    ClaimConfidence,
    ComponentEvidence,
    ComponentSelection,
    EvidenceItem,
    EvidenceTier,
)


def _tier_to_confidence(tier: EvidenceTier) -> ClaimConfidence:
    mapping: dict[EvidenceTier, ClaimConfidence] = {
        "strong": "strong",
        "partial": "medium",
        "weak": "weak",
        "insufficient": "absent",
        "not_required": "absent",
    }
    return mapping.get(tier, "absent")


def _firmness_to_confidence(firmness: str) -> ClaimConfidence:
    if firmness == "firm":
        return "strong"
    if firmness == "partial_match":
        return "medium"
    return "absent"


def build_claims_from_selection(
    selection: ComponentSelection,
    *,
    english: bool = False,
) -> list[Claim]:
    claims: list[Claim] = []
    recommended = selection.recommended
    if recommended is None:
        claims.append(Claim(
            id="recommendation",
            claim=(
                "Insufficient corpus evidence for a safe recommendation."
                if english
                else "Evidência insuficiente para recomendação segura."
            ),
            evidence_source=None,
            evidence_strength=0.0,
            confidence="absent",
        ))
        return claims

    component = recommended.component
    firmness = selection.recommendation_firmness
    rec_confidence = _firmness_to_confidence(firmness)
    if rec_confidence == "absent":
        rec_confidence = _tier_to_confidence(recommended.evidence_tier)

    claims.append(Claim(
        id="recommendation",
        claim=component.name,
        evidence_source="component-metadata.json",
        evidence_strength=recommended.similarity,
        confidence=rec_confidence,
    ))

    if component.intent:
        intent_text = localized_text(component.intent.label, "en" if english else "pt")
        claims.append(Claim(
            id="intent",
            claim=intent_text,
            evidence_source=f"component-metadata.json#{component.component_id}.intent",
            evidence_strength=1.0,
            confidence="strong",
        ))

    if recommended.component.accessibility:
        accessibility = recommended.component.accessibility
        locale = "en" if english else "pt"
        keyboard_rules = localized_rules(accessibility.keyboard, locale) or []
        if keyboard_rules:
            claims.append(Claim(
                id="accessibility.keyboard",
                claim=keyboard_rules[0],
                evidence_source="accessibility.keyboard",
                evidence_strength=1.0,
                confidence="strong",
            ))
        if accessibility.aria:
            aria_rule = accessibility.aria[0]
            aria_text = localized_text(aria_rule.text, locale)
            if aria_text:
                claims.append(Claim(
                    id="accessibility.aria",
                    claim=aria_text,
                    evidence_source="accessibility.aria",
                    evidence_strength=1.0,
                    confidence="strong",
                ))

    for index, rule in enumerate(recommended.selected_when_to_use[:3]):
        claims.append(Claim(
            id=f"when_to_use.{index}",
            claim=rule.text,
            evidence_source=rule.sources[0] if rule.sources else "when_to_use",
            evidence_strength=rule.rule_similarity,
            confidence=_tier_to_confidence(
                "strong" if rule.rule_similarity >= 0.75 else "partial"
            ),
        ))

    for index, rule in enumerate(recommended.selected_dont_rules[:3]):
        claims.append(Claim(
            id=f"dont.{index}",
            claim=rule.text,
            evidence_source=rule.sources[0] if rule.sources else "dont",
            evidence_strength=rule.rule_similarity,
            confidence=_tier_to_confidence(
                "strong" if rule.rule_similarity >= 0.75 else "partial"
            ),
        ))

    for index, edge_case in enumerate((component.edge_cases or [])[:2]):
        text = localized_text(edge_case.text, "en" if english else "pt")
        if text:
            claims.append(Claim(
                id=f"edge_case.{index}",
                claim=text,
                evidence_source=f"component-metadata.json#{component.component_id}.edge_cases",
                evidence_strength=0.7,
                confidence="medium",
            ))

    for field in recommended.missing_fields:
        claims.append(Claim(
            id=f"missing.{field}",
            claim=f"Field not documented: {field}",
            evidence_source=None,
            evidence_strength=0.0,
            confidence="absent",
        ))

    return claims


def build_claims_from_evidence(
    evidence: list[EvidenceItem],
    *,
    english: bool = False,
) -> list[Claim]:
    claims: list[Claim] = []
    for index, item in enumerate(evidence[:5]):
        tier = (
            "strong" if item.similarity >= 0.75
            else "partial" if item.similarity >= 0.50
            else "weak"
        )
        claims.append(Claim(
            id=f"retrieval.{index}",
            claim=item.excerpt,
            evidence_source=item.source or item.title,
            evidence_strength=item.similarity,
            confidence=_tier_to_confidence(tier),
        ))
    if not claims:
        claims.append(Claim(
            id="retrieval",
            claim=(
                "No official corpus evidence recovered."
                if english
                else "Nenhuma evidência oficial do corpus recuperada."
            ),
            evidence_source=None,
            evidence_strength=0.0,
            confidence="absent",
        ))
    return claims


def build_claims_from_catalog_resolution(
    resolution: CatalogEntityResolution,
    *,
    english: bool = False,
) -> list[Claim]:
    label = resolution.entity_label or "entity"
    status = resolution.entity_status
    if status == "unknown":
        message = (
            f"No catalog evidence for {label}."
            if english
            else f"Sem evidência de catálogo para {label}."
        )
        return [Claim(
            id="entity.absent",
            claim=message,
            evidence_source="catalog_registries",
            evidence_strength=1.0,
            confidence="strong",
        )]
    if status == "partial":
        return [Claim(
            id="entity.partial",
            claim=(
                f"{label} exists but documentation is partial."
                if english
                else f"{label} existe, mas a documentação é parcial."
            ),
            evidence_source="catalog_registries",
            evidence_strength=0.5,
            confidence="medium",
        )]
    return [Claim(
        id="entity.supported",
        claim=label,
        evidence_source="catalog_registries",
        evidence_strength=1.0,
        confidence="strong",
    )]


def build_claims_for_context(
    *,
    workflow: str,
    component_selection: ComponentSelection | None,
    evidence: list[EvidenceItem],
    catalog_resolution: CatalogEntityResolution | None,
    english: bool = False,
) -> list[Claim]:
    if workflow in {
        "unsupported_entity_lookup",
        "unsupported_entity_recommendation",
        "unknown_entity_lookup",
    }:
        if catalog_resolution:
            return build_claims_from_catalog_resolution(
                catalog_resolution,
                english=english,
            )
        return [Claim(
            id="entity.absent",
            claim=(
                "No catalog evidence for this entity."
                if english
                else "Sem evidência de catálogo para esta entidade."
            ),
            evidence_source="catalog_registries",
            evidence_strength=1.0,
            confidence="strong",
        )]

    if component_selection is not None:
        return build_claims_from_selection(component_selection, english=english)

    if evidence:
        return build_claims_from_evidence(evidence, english=english)

    return []
