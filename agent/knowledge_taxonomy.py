"""Explicit knowledge-state taxonomy for anti-hallucination routing."""

from __future__ import annotations

from typing import Literal

from .entity_resolution import resolve_exact_entity_matches
from .models import CatalogEntityResolution, QueryUnderstanding
from .understanding import normalize_query
from .unsupported_entity_detection import match_unsupported_entity


KnowledgeState = Literal[
    "canonical",
    "not_in_catalog",
    "external_concept",
    "future_extension",
    "needs_human_validation",
    "out_of_scope",
]

KNOWLEDGE_STATE_LABELS: dict[KnowledgeState, dict[str, str]] = {
    "canonical": {
        "en": "Canonical in Velaris",
        "pt": "Canônico no Velaris",
    },
    "not_in_catalog": {
        "en": "Known UI concept not in the Velaris catalog",
        "pt": "Conceito conhecido ausente do catálogo Velaris",
    },
    "external_concept": {
        "en": "External or general UI concept",
        "pt": "Conceito externo ou geral de interface",
    },
    "future_extension": {
        "en": "Possible future Velaris extension",
        "pt": "Possível extensão futura do Velaris",
    },
    "needs_human_validation": {
        "en": "Needs human validation",
        "pt": "Necessita validação humana",
    },
    "out_of_scope": {
        "en": "Out of scope",
        "pt": "Fora de escopo",
    },
}


def classify_knowledge_state(
    query: str,
    understanding: QueryUnderstanding,
    *,
    evidence_tier: str = "insufficient",
) -> KnowledgeState:
    """Classify the query into an explicit knowledge state."""
    if understanding.user_intent == "out_of_scope":
        return "out_of_scope"

    resolution = understanding.catalog_entity_resolution
    if resolution is not None:
        if resolution.entity_status == "supported":
            return "canonical"
        if resolution.design_system_gap is not None:
            return "not_in_catalog"
        if resolution.entity_status == "unknown" and resolution.entity_label:
            normalized = normalize_query(query)
            if match_unsupported_entity(normalized):
                return "not_in_catalog"
            return "needs_human_validation"

    if understanding.exact_entity_matches:
        return "canonical"

    normalized = normalize_query(query)
    if resolve_exact_entity_matches(normalized):
        return "canonical"

    if understanding.user_intent in {
        "unsupported_entity_lookup",
        "unsupported_entity_recommendation",
    }:
        return "not_in_catalog"

    if understanding.user_intent == "unknown_entity_lookup":
        return "needs_human_validation"

    if evidence_tier == "insufficient" and understanding.user_intent in {
        "component_recommendation",
        "design_decision",
        "component_comparison",
    }:
        return "needs_human_validation"

    if understanding.user_intent in {
        "general_design_system",
        "help_request",
        "concept_query",
        "agent_capability",
        "roadmap_capability",
    }:
        return "canonical"

    return "needs_human_validation"


def knowledge_state_payload(
    state: KnowledgeState,
    *,
    resolution: CatalogEntityResolution | None = None,
    english: bool = False,
) -> dict[str, str | None]:
    locale = "en" if english else "pt"
    payload: dict[str, str | None] = {
        "state": state,
        "label": KNOWLEDGE_STATE_LABELS[state][locale],
        "response_policy": _response_policy(state, english=english),
    }
    if resolution is not None:
        payload["entity_label"] = resolution.entity_label
        payload["entity_status"] = resolution.entity_status
    return payload


def _response_policy(state: KnowledgeState, *, english: bool) -> str:
    policies = {
        "canonical": (
            "Answer as authoritative when catalog evidence exists. "
            "Keep canonical names unchanged."
        ),
        "not_in_catalog": (
            "State clearly the concept is not in the Velaris catalog. "
            "Offer the closest documented alternative. "
            "Do not invent APIs, props or usage."
        ),
        "external_concept": (
            "Explain as general UI knowledge, separated from Velaris rules."
        ),
        "future_extension": (
            "Frame as a documentation recommendation, not an existing rule."
        ),
        "needs_human_validation": (
            "State evidence is insufficient. Request clarification or "
            "validation with design-system owners. No firm recommendations."
        ),
        "out_of_scope": (
            "State the boundary kindly and steer back to Velaris topics."
        ),
    }
    if english:
        return policies[state]
    return policies[state]
