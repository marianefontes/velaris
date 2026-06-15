"""Pending intent resolution for conversational follow-ups."""

from __future__ import annotations

import re
from typing import Literal

from pydantic import Field

from .entity_resolution import resolve_exact_entity_matches
from .migration_advisor import contains_migration_intent
from .models import ExactEntityMatch, QueryUnderstanding, StrictModel
from .professional_intent import (
    ProfessionalIntentCategory,
    knowledge_source_for_category,
    retrieval_intent_for_category,
    workflow_for_category,
)
from .understanding import analyze_query, normalize_query


PendingAction = Literal[
    "generate_migration_path",
    "compare_components",
    "run_design_audit",
    "recommend_component",
    "accessibility_review",
    "explain_design_rationale",
    "explain_documentation",
    "architecture_review",
    "lookup_entity",
    "general_guidance",
]

MissingField = Literal[
    "component_name",
    "token_name",
    "artifact_context",
    "usage_context",
    "comparison_target",
    "unspecified",
]

_WORKFLOW_TO_ACTION: dict[str, PendingAction] = {
    "migration_advisor": "generate_migration_path",
    "compare_options": "compare_components",
    "comparison_rule": "compare_components",
    "design_audit": "run_design_audit",
    "component_decision": "recommend_component",
    "single_choice_recommendation": "recommend_component",
    "accessibility_guidance": "accessibility_review",
    "design_decision": "explain_design_rationale",
    "documentation_help": "explain_documentation",
    "decision_analysis": "architecture_review",
    "entity_lookup": "lookup_entity",
    "direct_entity_guidance": "lookup_entity",
    "pattern_guidance": "general_guidance",
    "page_recommendation": "recommend_component",
    "token_lookup": "lookup_entity",
}

_CATEGORY_TO_ACTION: dict[ProfessionalIntentCategory, PendingAction] = {
    "MIGRATION_ADVISOR": "generate_migration_path",
    "DESIGN_AUDIT": "run_design_audit",
    "DESIGN_RATIONALE": "explain_design_rationale",
    "ACCESSIBILITY_REVIEW": "accessibility_review",
    "ARCHITECTURE_REVIEW": "architecture_review",
    "KNOWLEDGE_EXPLANATION": "explain_documentation",
    "GENERAL_PROFESSIONAL_GUIDANCE": "general_guidance",
    "ENTITY_LOOKUP": "lookup_entity",
}

_CLARIFICATION_PATTERNS: tuple[tuple[re.Pattern[str], MissingField], ...] = (
    (re.compile(r"qual componente|which component|que componente", re.I), "component_name"),
    (re.compile(r"qual token|which token|que token", re.I), "token_name"),
    (re.compile(r"qual (?:tela|fluxo|screen|flow|interface)", re.I), "artifact_context"),
    (re.compile(r"qual contexto|which context|em qual contexto", re.I), "usage_context"),
    (re.compile(r"qual (?:opcao|opção|alternative)|which option", re.I), "comparison_target"),
    (re.compile(r"preciso saber qual|pode (?:me )?dizer qual|me diga qual", re.I), "unspecified"),
)

_QUESTION_STARTERS = (
    "como ",
    "qual ",
    "quais ",
    "por que ",
    "porque ",
    "how ",
    "what ",
    "which ",
    "why ",
    "gere ",
    "generate ",
    "compare ",
    "comparar ",
)


class PendingIntentResolution(StrictModel):
    action: PendingAction
    missing_field: MissingField
    original_query: str
    resolution_value: str
    resolved_query: str
    workflow: str
    professional_category: ProfessionalIntentCategory
    retrieval_intent: str

    def apply_to_understanding(self, understanding: QueryUnderstanding) -> QueryUnderstanding:
        entities = understanding.entities.model_copy(deep=True)
        exact_matches = list(understanding.exact_entity_matches)
        normalized_resolution = normalize_query(self.resolution_value)

        if self.missing_field == "component_name":
            matches = resolve_exact_entity_matches(normalized_resolution)
            if matches:
                exact_matches = matches
                if not entities.components:
                    entities = entities.model_copy(
                        update={"components": [match.name for match in matches]},
                    )
            elif self.resolution_value.strip():
                components = list(entities.components)
                if self.resolution_value.strip() not in components:
                    components.append(self.resolution_value.strip())
                entities = entities.model_copy(update={"components": components})

        if self.missing_field == "token_name" and self.resolution_value.strip():
            tokens = list(entities.tokens)
            if self.resolution_value.strip() not in tokens:
                tokens.append(self.resolution_value.strip())
            entities = entities.model_copy(update={"tokens": tokens})

        return understanding.model_copy(
            update={
                "entities": entities,
                "exact_entity_matches": exact_matches,
                "professional_category": self.professional_category,
                "knowledge_source": knowledge_source_for_category(
                    self.professional_category
                ),
                "retrieval_query": self.resolved_query,
            },
        )


def _last_turns(messages: list[dict]) -> tuple[dict | None, dict | None, dict | None]:
    current_user: dict | None = None
    previous_assistant: dict | None = None
    previous_user: dict | None = None
    for message in reversed(messages):
        role = message.get("role")
        if current_user is None and role == "user":
            current_user = message
            continue
        if current_user is not None and previous_assistant is None and role == "assistant":
            previous_assistant = message
            continue
        if previous_assistant is not None and previous_user is None and role == "user":
            previous_user = message
            break
    return current_user, previous_assistant, previous_user


def is_clarification_question(text: str) -> bool:
    normalized = " ".join(str(text).lower().split())
    if "?" not in normalized and not any(
        marker in normalized
        for marker in (
            "qual componente",
            "which component",
            "preciso saber",
            "me diga qual",
            "pode especificar",
        )
    ):
        return False
    return any(pattern.search(normalized) for pattern, _ in _CLARIFICATION_PATTERNS)


def detect_missing_field(text: str) -> MissingField:
    normalized = " ".join(str(text).lower().split())
    for pattern, field in _CLARIFICATION_PATTERNS:
        if pattern.search(normalized):
            return field
    return "unspecified"


def is_resolution_answer(text: str) -> bool:
    normalized = normalize_query(text)
    if not normalized:
        return False
    if "?" in text:
        return False
    if normalized.startswith(_QUESTION_STARTERS):
        return False
    if len(normalized.split()) > 12:
        return False
    if contains_migration_intent(normalized) and len(normalized.split()) > 3:
        return False
    if any(
        marker in normalized
        for marker in (" versus ", " vs ", "compare ", "comparar ", "audite ", "audit ")
    ) and len(normalized.split()) > 3:
        return False
    return True


def _infer_pending_action(original_query: str) -> tuple[PendingAction, str, ProfessionalIntentCategory, str]:
    from .planner import build_agent_plan

    understanding = analyze_query(original_query)
    plan = build_agent_plan(original_query, understanding=understanding)
    action = _WORKFLOW_TO_ACTION.get(
        plan.workflow,
        _CATEGORY_TO_ACTION.get(
            understanding.professional_category,
            "general_guidance",
        ),
    )
    retrieval_intent = retrieval_intent_for_category(understanding.professional_category)
    if understanding.professional_category == "ENTITY_LOOKUP":
        retrieval_intent = plan.intent
    return action, plan.workflow, understanding.professional_category, retrieval_intent


def build_resolved_query(
    *,
    original_query: str,
    missing_field: MissingField,
    resolution_value: str,
    action: PendingAction,
) -> str:
    clean_original = original_query.strip().rstrip("?.!")
    clean_resolution = resolution_value.strip().rstrip("?.!")
    if missing_field == "component_name":
        if action == "generate_migration_path":
            return (
                f"{clean_original}. Componente informado para migração: "
                f"{clean_resolution}."
            )
        if action == "recommend_component":
            return f"{clean_original} — componente: {clean_resolution}."
        return f"{clean_original} — componente informado: {clean_resolution}."
    if missing_field == "token_name":
        return f"{clean_original} — token informado: {clean_resolution}."
    if missing_field == "artifact_context":
        return f"{clean_original} — artefato/fluxo informado: {clean_resolution}."
    if missing_field == "usage_context":
        return f"{clean_original} — contexto informado: {clean_resolution}."
    if missing_field == "comparison_target":
        return f"{clean_original} — opção informada: {clean_resolution}."
    return f"{clean_original} — detalhe informado: {clean_resolution}."


def resolve_conversational_reference(
    messages: list[dict],
) -> PendingIntentResolution | None:
    current_user, previous_assistant, previous_user = _last_turns(messages)
    if not current_user or not previous_assistant or not previous_user:
        return None

    assistant_text = str(previous_assistant.get("content", ""))
    original_query = str(previous_user.get("content", "")).strip()
    resolution_value = str(current_user.get("content", "")).strip()

    if not original_query or not resolution_value:
        return None
    if not is_clarification_question(assistant_text):
        return None
    if not is_resolution_answer(resolution_value):
        return None

    missing_field = detect_missing_field(assistant_text)
    action, workflow, category, retrieval_intent = _infer_pending_action(original_query)

    if contains_migration_intent(normalize_query(original_query)):
        action = "generate_migration_path"
        workflow = workflow_for_category("MIGRATION_ADVISOR")
        category = "MIGRATION_ADVISOR"
        retrieval_intent = retrieval_intent_for_category("MIGRATION_ADVISOR")

    resolved_query = build_resolved_query(
        original_query=original_query,
        missing_field=missing_field,
        resolution_value=resolution_value,
        action=action,
    )

    return PendingIntentResolution(
        action=action,
        missing_field=missing_field,
        original_query=original_query,
        resolution_value=resolution_value,
        resolved_query=resolved_query,
        workflow=workflow,
        professional_category=category,
        retrieval_intent=retrieval_intent,
    )


def apply_pending_resolution_to_route(
    resolution: PendingIntentResolution,
    *,
    understanding: QueryUnderstanding,
) -> QueryUnderstanding:
    original = analyze_query(resolution.original_query)
    merged = resolution.apply_to_understanding(original)
    replanned = analyze_query(resolution.resolved_query)
    return merged.model_copy(
        update={
            "language": replanned.language,
            "entities": replanned.entities if replanned.entities.components else merged.entities,
            "exact_entity_matches": (
                replanned.exact_entity_matches
                if replanned.exact_entity_matches
                else merged.exact_entity_matches
            ),
        },
    )
