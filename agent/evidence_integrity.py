"""Final evidence integrity gate before any response reaches the user."""

from __future__ import annotations

import re

from .claims import build_claims_for_context
from .models import (
    CatalogEntityResolution,
    Claim,
    ComponentSelection,
    EvidenceIntegrityResult,
    EvidenceIntegrityViolationType,
    EvidenceItem,
    QueryUnderstanding,
)
from .operational_responses import catalog_unknown_evidence_message
from .ui_leak_guard import contains_internal_audit_leak
from .response_validation import (
    deterministic_component_response,
    deterministic_token_response,
)


_RECOMMENDATION_MARKERS = (
    r"componente recomendado\s*:",
    r"recommended component\s*:",
    r"recomendo\s+",
    r"i recommend\s+",
    r"melhor escolha\s+(?:é|e)\s+",
    r"the best choice is\s+",
    r"\buse\s+[A-Z]",
)


def _has_recommendation_language(response_text: str) -> bool:
    return any(
        re.search(pattern, response_text, flags=re.IGNORECASE)
        for pattern in _RECOMMENDATION_MARKERS
    )


def _unknown_entity_blocked(
    resolution: CatalogEntityResolution | None,
    response_text: str,
) -> bool:
    if resolution is None or resolution.entity_status != "unknown":
        return False
    if not resolution.entity_label:
        return False
    if not _has_recommendation_language(response_text):
        return False
    unknown_msg = catalog_unknown_evidence_message(
        english=False,
        entity_label=resolution.entity_label,
    )
    unknown_msg_en = catalog_unknown_evidence_message(
        english=True,
        entity_label=resolution.entity_label,
    )
    return unknown_msg not in response_text and unknown_msg_en not in response_text


def _claims_without_evidence(claims: list[Claim]) -> list[str]:
    blocked: list[str] = []
    for claim in claims:
        if claim.confidence == "absent" and claim.id.startswith(
            ("recommendation", "when_to_use", "dont", "edge_case", "accessibility")
        ):
            blocked.append(claim.id)
    return blocked


def _confidence_without_source(claims: list[Claim]) -> list[str]:
    return [
        claim.id
        for claim in claims
        if claim.confidence in {"strong", "medium"}
        and not (claim.evidence_source or "").strip()
    ]


DETERMINISTIC_EVIDENCE_EXEMPT_WORKFLOWS = frozenset({
    "greeting",
    "navigation_query",
    "semantic_navigation_query",
    "perspective_lookup",
    "entity_lookup",
    "unsupported_entity_lookup",
    "unsupported_entity_recommendation",
    "unknown_entity_lookup",
    "direct_entity_guidance",
    "concept_query",
    "legacy_name_query",
    "out_of_scope",
    "small_talk",
    "help_request",
    "single_choice_recommendation",
    "decision_rule_recommendation",
    "comparison_rule",
    "documentation_help",
    "design_audit",
    "design_decision",
    "accessibility_guidance",
    "decision_analysis",
    "migration_advisor",
    "page_recommendation",
})


def _pretrained_only_recommendation(
    *,
    response_text: str,
    claims: list[Claim],
    has_evidence: bool,
    workflow: str,
) -> bool:
    if workflow in DETERMINISTIC_EVIDENCE_EXEMPT_WORKFLOWS:
        return False
    if not _has_recommendation_language(response_text):
        return False
    sourced = [
        claim
        for claim in claims
        if claim.confidence in {"strong", "medium"}
        and (claim.evidence_source or "").strip()
    ]
    return not has_evidence and not sourced


class EvidenceIntegrityValidator:
    """Five-check gate: entity, claim, audit leak, confidence, pretrained."""

    def validate(
        self,
        *,
        response_text: str,
        workflow: str,
        understanding: QueryUnderstanding,
        component_selection: ComponentSelection | None,
        evidence: list[EvidenceItem],
        claims: list[Claim] | None = None,
        english: bool = False,
    ) -> EvidenceIntegrityResult:
        resolution = understanding.catalog_entity_resolution
        built_claims = claims or build_claims_for_context(
            workflow=workflow,
            component_selection=component_selection,
            evidence=evidence,
            catalog_resolution=resolution,
            english=english,
        )
        violations: list[EvidenceIntegrityViolationType] = []
        audit_warnings: list[str] = []
        blocked_claim_ids: list[str] = []

        if _unknown_entity_blocked(resolution, response_text):
            violations.append("unknown_entity_inference")

        absent_claims = _claims_without_evidence(built_claims)
        if absent_claims:
            violations.append("claim_without_evidence")
            blocked_claim_ids.extend(absent_claims)
            audit_warnings.extend(
                f"Claim blocked (no evidence): {claim_id}"
                for claim_id in absent_claims
            )

        if contains_internal_audit_leak(response_text):
            violations.append("internal_audit_leak")

        unsourced = _confidence_without_source(built_claims)
        if unsourced:
            violations.append("confidence_without_source")
            audit_warnings.extend(
                f"Confidence without source: {claim_id}"
                for claim_id in unsourced
            )

        has_evidence = bool(evidence) or (
            component_selection is not None
            and component_selection.recommended is not None
        )
        if _pretrained_only_recommendation(
            response_text=response_text,
            claims=built_claims,
            has_evidence=has_evidence,
            workflow=workflow,
        ):
            violations.append("pretrained_only_recommendation")

        if resolution and resolution.entity_status == "partial":
            audit_warnings.append(
                f"Partial catalog documentation for {resolution.entity_label}"
            )
        if component_selection and component_selection.recommended:
            missing = component_selection.recommended.missing_fields
            if missing:
                audit_warnings.append(
                    f"Missing catalog fields: {', '.join(missing)}"
                )

        if not violations:
            return EvidenceIntegrityResult(
                status="pass",
                audit_warnings=audit_warnings,
            )

        fallback_reason = (
            "Evidence integrity validation blocked the response: "
            + ", ".join(violations)
        )
        return EvidenceIntegrityResult(
            status="blocked",
            violations=violations,
            blocked_claim_ids=blocked_claim_ids,
            audit_warnings=audit_warnings,
            fallback_used=True,
            fallback_reason=fallback_reason,
        )


def integrity_fallback_response(
    *,
    workflow: str,
    component_selection: ComponentSelection | None,
    evidence: list[EvidenceItem],
    english: bool = False,
) -> str:
    if workflow == "component_decision" and component_selection is not None:
        return deterministic_component_response(
            component_selection,
            english=english,
        )
    if workflow == "token_lookup":
        return deterministic_token_response(evidence, english=english)
    if english:
        return (
            "I did not find sufficient catalog evidence to answer safely. "
            "I cannot infer or complete missing documentation."
        )
    return (
        "Não encontrei evidência suficiente no catálogo para responder com segurança. "
        "Não posso inferir nem completar documentação ausente."
    )
