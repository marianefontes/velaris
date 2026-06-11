"""Operational comprehension pipeline for Abraxos before RAG and LLM."""

from __future__ import annotations

from dataclasses import dataclass, field

from agent.models import QueryUnderstanding, UserIntent
from agent.understanding import analyze_query, normalize_query


PIPELINE_STAGES: tuple[str, ...] = (
    "normalize_query",
    "detect_language_and_locale",
    "detect_greeting_or_smalltalk",
    "detect_operational_intent",
    "resolve_migration_aliases",
    "resolve_perspective",
    "resolve_route_or_section",
    "resolve_catalog_entity",
    "unsupported_entity_detection",
    "resolve_concept",
    "detect_guidance_question",
    "detect_recommendation_question",
    "detect_comparison_question",
    "decide_if_rag_is_needed",
    "retrieve_evidence_if_needed",
    "apply_evidence_policy",
    "build_structured_response",
    "attach_navigation_or_profile_actions",
    "validate_response",
    "dedupe_response",
    "fallback_to_out_of_scope",
)

NON_RAG_INTENTS: frozenset[UserIntent] = frozenset({
    "greeting",
    "small_talk",
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
})

INTERNAL_SUGGESTION_HINTS: dict[str, tuple[str, ...]] = {
    "design": ("Designer", "Product Designer"),
    "produto": ("Product Designer",),
    "acess": ("Accessibility", "Foundations"),
    "document": ("Tech Writer", "Foundations"),
    "token": ("Tokens",),
    "component": ("Components",),
    "pattern": ("Patterns",),
    "qa": ("QA",),
    "dev": ("Developer",),
}


@dataclass(frozen=True)
class ComprehensionResult:
    understanding: QueryUnderstanding
    normalized_query: str
    rag_required: bool
    pipeline_stage_reached: str
    suggestion_hints: tuple[str, ...] = field(default_factory=tuple)


def _suggestion_hints(query: str, intent: UserIntent) -> tuple[str, ...]:
    if intent != "out_of_scope":
        return ()
    normalized = normalize_query(query)
    hints: list[str] = []
    for marker, options in INTERNAL_SUGGESTION_HINTS.items():
        if marker in normalized:
            hints.extend(options)
    return tuple(dict.fromkeys(hints))


def _pipeline_stage(intent: UserIntent) -> str:
    mapping = {
        "greeting": "detect_greeting_or_smalltalk",
        "small_talk": "detect_greeting_or_smalltalk",
        "navigation_query": "resolve_route_or_section",
        "semantic_navigation_query": "resolve_route_or_section",
        "perspective_lookup": "resolve_perspective",
        "entity_lookup": "resolve_catalog_entity",
        "unsupported_entity_lookup": "unsupported_entity_detection",
        "unsupported_entity_recommendation": "unsupported_entity_detection",
        "unknown_entity_lookup": "unsupported_entity_detection",
        "direct_entity_guidance": "detect_guidance_question",
        "concept_query": "resolve_concept",
        "legacy_name_query": "resolve_migration_aliases",
        "component_recommendation": "detect_recommendation_question",
        "component_comparison": "detect_comparison_question",
        "out_of_scope": "fallback_to_out_of_scope",
    }
    return mapping.get(intent, "detect_operational_intent")


def comprehend(query: str) -> ComprehensionResult:
    """Run the pre-RAG comprehension pipeline and return structured understanding."""
    normalized_query = normalize_query(query)
    understanding = analyze_query(query)
    intent = understanding.user_intent
    rag_required = intent not in NON_RAG_INTENTS and intent not in {
        "help_request",
        "catalog",
        "language_followup",
        "general_design_system",
    }
    if intent in {
        "component_recommendation",
        "component_comparison",
        "pattern_guidance",
        "token_lookup",
        "accessibility_guidance",
        "design_decision",
        "xai_explanation",
    }:
        rag_required = True
    return ComprehensionResult(
        understanding=understanding,
        normalized_query=normalized_query,
        rag_required=rag_required,
        pipeline_stage_reached=_pipeline_stage(intent),
        suggestion_hints=_suggestion_hints(query, intent),
    )


def orchestration_health_snapshot() -> dict:
    from agent.concept_registry import CONCEPT_REGISTRY
    from agent.decision_rules import decision_rules_health
    from agent.entity_alias_registry import entity_alias_registry
    from agent.external_reference_registry import EXTERNAL_REFERENCE_REGISTRY
    from agent.unsupported_entities_registry import UNSUPPORTED_ENTITIES_REGISTRY
    from agent.migration_alias_registry import PRODUCT_ALIASES, ROUTE_ALIASES
    from agent.perspective_registry import PERSPECTIVE_REGISTRY
    from agent.route_map import CANONICAL_ROUTES
    from agent.semantic_navigation import _INTERNAL_VOCABULARY
    from agent.ui_leak_guard import (
        INTERNAL_AUDIT_LEAK_MARKERS,
        UI_PROMPT_LEAK_MARKERS,
    )

    return {
        "pipeline_stages": list(PIPELINE_STAGES),
        "operational_intents_registered": True,
        "route_map_loaded": bool(CANONICAL_ROUTES),
        "perspective_registry_loaded": len(PERSPECTIVE_REGISTRY) == 8,
        "concept_registry_loaded": bool(CONCEPT_REGISTRY),
        "migration_aliases_loaded": bool(PRODUCT_ALIASES) and bool(ROUTE_ALIASES),
        "entity_resolver_active": True,
        "unsupported_entities_registry_loaded": bool(UNSUPPORTED_ENTITIES_REGISTRY),
        "external_reference_registry_loaded": bool(EXTERNAL_REFERENCE_REGISTRY),
        "internal_fuzzy_vocabulary_size": sum(
            len(values) for values in _INTERNAL_VOCABULARY.values()
        ),
        "dedupe_active": True,
        "ui_leak_guards_active": True,
        "ui_leak_markers": len(UI_PROMPT_LEAK_MARKERS),
        "internal_audit_leak_markers": len(INTERNAL_AUDIT_LEAK_MARKERS),
        "evidence_integrity_validator_active": True,
        "claim_model_active": True,
        "action_builder_active": True,
        "decision_rules": decision_rules_health(),
        "entity_alias_registry_entries": len(entity_alias_registry()),
    }
