"""Pending intent resolution for conversational follow-ups."""

from __future__ import annotations

import re
from typing import Literal

from .entity_resolution import resolve_exact_entity_matches
from .migration_advisor import contains_migration_intent
from .models import QueryUnderstanding, StrictModel
from .professional_intent import (
    ProfessionalIntentCategory,
    knowledge_source_for_category,
    workflow_for_category,
)
from .understanding import analyze_query, normalize_query


PendingAction = Literal[
    "generate_migration_path",
    "compare_components",
    "run_contract_check",
    "run_governance_scan",
    "simulate_change",
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
    "option_choice",
    "confirmation",
    "unspecified",
]

PendingWorkflow = Literal[
    "migration_advisor",
    "component_decision",
    "compare_options",
    "contract_check",
    "governance",
    "simulate",
    "accessibility_guidance",
]

PENDING_CLARIFICATION_EXPIRES_AFTER = 2

_WORKFLOW_TO_ACTION: dict[str, PendingAction] = {
    "migration_advisor": "generate_migration_path",
    "compare_options": "compare_components",
    "comparison_rule": "compare_components",
    "contract_check": "run_contract_check",
    "governance": "run_governance_scan",
    "governance_analysis": "run_governance_scan",
    "simulate": "simulate_change",
    "simulation": "simulate_change",
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

_PENDING_WORKFLOW_TO_RUNTIME: dict[PendingWorkflow, str] = {
    "migration_advisor": "migration_advisor",
    "component_decision": "component_decision",
    "compare_options": "compare_options",
    "contract_check": "component_decision",
    "governance": "governance_analysis",
    "simulate": "simulation",
    "accessibility_guidance": "accessibility_guidance",
}

_PENDING_WORKFLOW_TO_RETRIEVAL: dict[PendingWorkflow, str] = {
    "migration_advisor": "migration_advisor",
    "component_decision": "component_guidance",
    "compare_options": "comparison_query",
    "contract_check": "component_guidance",
    "governance": "general",
    "simulate": "design_decision",
    "accessibility_guidance": "accessibility_guidance",
}

_PENDING_WORKFLOW_TO_CATEGORY: dict[PendingWorkflow, ProfessionalIntentCategory] = {
    "migration_advisor": "MIGRATION_ADVISOR",
    "component_decision": "ENTITY_LOOKUP",
    "compare_options": "ENTITY_LOOKUP",
    "contract_check": "DESIGN_AUDIT",
    "governance": "KNOWLEDGE_EXPLANATION",
    "simulate": "ARCHITECTURE_REVIEW",
    "accessibility_guidance": "ACCESSIBILITY_REVIEW",
}

_PENDING_WORKFLOW_TO_USER_INTENT: dict[PendingWorkflow, str] = {
    "component_decision": "component_recommendation",
    "compare_options": "component_comparison",
    "contract_check": "component_recommendation",
    "governance": "governance_analysis",
    "simulate": "simulation",
    "accessibility_guidance": "accessibility_guidance",
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
    (re.compile(r"quais componentes|which components|what components", re.I), "comparison_target"),
    (re.compile(r"qual componente|which component|what component|que componente", re.I), "component_name"),
    (re.compile(r"nome do componente|component name|source component|componente de origem", re.I), "component_name"),
    (re.compile(r"qual token|which token|que token", re.I), "token_name"),
    (re.compile(r"qual (?:tela|fluxo|screen|flow|interface)", re.I), "artifact_context"),
    (re.compile(r"mudanca proposta|mudança proposta|proposed change|scenario|cenario|cenário", re.I), "artifact_context"),
    (re.compile(r"qual contexto|which context|em qual contexto", re.I), "usage_context"),
    (re.compile(r"qual (?:opcao|opção|alternative)|which option", re.I), "option_choice"),
    (re.compile(r"sim ou nao|sim ou não|yes or no", re.I), "confirmation"),
    (re.compile(r"preciso saber qual|pode (?:me )?dizer qual|me diga qual", re.I), "unspecified"),
)

_COMMAND_PATTERN = re.compile(
    r"^/(memory|decision|perspectives|audit|organizational-memory|"
    r"decision-archaeology|perspective-synthesis|explainability-audit|"
    r"knowledge-gap|governance|governance-impact|principle-conflict|"
    r"adoption-friction|health|oracle-council|enforce|migrate|"
    r"token-impact|contract-check|feedback-review|capture|document|"
    r"history|why|tradeoff|score|simulate|learn)\b",
    re.I,
)

_NATURAL_COMMAND_PATTERNS: tuple[tuple[re.Pattern[str], str], ...] = (
    (re.compile(r"\bcontract[- ]check\b|\bchecagem de contrato\b|\bvalidar contrato\b", re.I), "contract-check"),
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
    command_mode: str | None = None
    clarification: "PendingClarification | None" = None

    def apply_to_understanding(self, understanding: QueryUnderstanding) -> QueryUnderstanding:
        entities = understanding.entities.model_copy(deep=True)
        exact_matches = list(understanding.exact_entity_matches)
        normalized_resolution = normalize_query(self.resolution_value)

        if self.missing_field in {"component_name", "comparison_target"}:
            resolution_understanding = analyze_query(self.resolution_value)
            matches = resolve_exact_entity_matches(normalized_resolution)
            if matches:
                exact_matches = matches
            elif resolution_understanding.exact_entity_matches:
                exact_matches = list(resolution_understanding.exact_entity_matches)

            components = list(entities.components)
            for match in exact_matches:
                if match.name not in components:
                    components.append(match.name)
            for component in resolution_understanding.entities.components:
                if component not in components:
                    components.append(component)
            if not components and self.resolution_value.strip():
                components.append(self.resolution_value.strip())

            patterns = list(entities.patterns)
            for pattern in resolution_understanding.entities.patterns:
                if pattern not in patterns:
                    patterns.append(pattern)

            entities = entities.model_copy(
                update={
                    "components": components,
                    "patterns": patterns,
                },
            )

        if self.missing_field == "token_name" and self.resolution_value.strip():
            tokens = list(entities.tokens)
            if self.resolution_value.strip() not in tokens:
                tokens.append(self.resolution_value.strip())
            entities = entities.model_copy(update={"tokens": tokens})

        update = {
            "entities": entities,
            "exact_entity_matches": exact_matches,
            "professional_category": self.professional_category,
            "knowledge_source": knowledge_source_for_category(
                self.professional_category
            ),
            "retrieval_query": self.resolved_query,
        }
        if self.clarification is not None:
            user_intent = _PENDING_WORKFLOW_TO_USER_INTENT.get(
                self.clarification.workflow
            )
            if user_intent is not None:
                update["user_intent"] = user_intent
                update["operational_intent"] = user_intent
                update["answer_strategy"] = user_intent
        return understanding.model_copy(update=update)


class PendingClarification(StrictModel):
    workflow: PendingWorkflow
    awaiting: MissingField
    expires_after: int = PENDING_CLARIFICATION_EXPIRES_AFTER
    turns_since_asked: int = 0
    original_query: str
    question: str = ""
    action: PendingAction
    runtime_workflow: str
    professional_category: ProfessionalIntentCategory
    retrieval_intent: str
    command_mode: str | None = None


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
    normalized = normalize_query(text)
    if "?" not in str(text) and not any(
        marker in normalized
        for marker in (
            "qual componente",
            "quais componentes",
            "which component",
            "which components",
            "component name",
            "nome do componente",
            "componente de origem",
            "source component",
            "preciso saber",
            "preciso do nome",
            "nao consigo gerar um plano de migracao",
            "cannot generate a migration plan",
            "me diga qual",
            "pode especificar",
            "please provide",
            "informe",
            "name a documented",
        )
    ):
        return False
    return any(pattern.search(normalized) for pattern, _ in _CLARIFICATION_PATTERNS)


def detect_missing_field(text: str) -> MissingField:
    normalized = normalize_query(text)
    for pattern, field in _CLARIFICATION_PATTERNS:
        if pattern.search(normalized):
            return field
    return "unspecified"


def clean_resolution_answer(text: str) -> str:
    value = str(text).strip().strip(" \t\n\r:;,.!?")
    value = re.sub(
        r"^(?:é|e|eh|is|it is|it's)\s+(?:o|a|the)?\s*",
        "",
        value,
        flags=re.I,
    ).strip()
    value = re.sub(r"^(?:o|a|the)\s+", "", value, flags=re.I).strip()
    return value or str(text).strip()


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


def infer_command_mode_from_query(query: str) -> str | None:
    stripped = str(query).strip()
    command = _COMMAND_PATTERN.search(stripped)
    if command is not None:
        return command.group(1).lower()
    normalized = normalize_query(stripped)
    for pattern, command_mode in _NATURAL_COMMAND_PATTERNS:
        if pattern.search(normalized):
            return command_mode
    return None


def _pending_workflow_for(
    *,
    plan_workflow: str,
    category: ProfessionalIntentCategory,
    command_mode: str | None,
) -> PendingWorkflow:
    if command_mode == "contract-check":
        return "contract_check"
    if command_mode == "governance" or plan_workflow == "governance_analysis":
        return "governance"
    if command_mode == "simulate" or plan_workflow == "simulation":
        return "simulate"
    if category == "MIGRATION_ADVISOR" or plan_workflow == "migration_advisor":
        return "migration_advisor"
    if plan_workflow in {"compare_options", "comparison_rule"}:
        return "compare_options"
    if category == "ACCESSIBILITY_REVIEW" or plan_workflow == "accessibility_guidance":
        return "accessibility_guidance"
    return "component_decision"


def _awaiting_for_workflow(
    workflow: PendingWorkflow,
    detected: MissingField,
) -> MissingField:
    if detected != "unspecified":
        if workflow == "compare_options" and detected == "component_name":
            return "comparison_target"
        return detected
    return {
        "migration_advisor": "component_name",
        "component_decision": "component_name",
        "compare_options": "comparison_target",
        "contract_check": "component_name",
        "governance": "usage_context",
        "simulate": "artifact_context",
        "accessibility_guidance": "component_name",
    }[workflow]


def _build_pending_clarification(
    *,
    original_query: str,
    assistant_text: str,
    turns_since_asked: int = 0,
) -> PendingClarification:
    from .planner import build_agent_plan

    command_mode = infer_command_mode_from_query(original_query)
    understanding = analyze_query(original_query)
    routed_intent = (
        "component_guidance"
        if command_mode == "contract-check"
        else "design_decision"
        if command_mode == "simulate"
        else "general"
    )
    plan = build_agent_plan(
        original_query,
        routed_intent=routed_intent,
        command_mode=command_mode,
        understanding=understanding,
    )
    workflow = _pending_workflow_for(
        plan_workflow=plan.workflow,
        category=understanding.professional_category,
        command_mode=command_mode,
    )
    action = _WORKFLOW_TO_ACTION.get(
        workflow,
        _CATEGORY_TO_ACTION.get(understanding.professional_category, "general_guidance"),
    )
    category = _PENDING_WORKFLOW_TO_CATEGORY.get(
        workflow,
        understanding.professional_category,
    )
    return PendingClarification(
        workflow=workflow,
        awaiting=_awaiting_for_workflow(workflow, detect_missing_field(assistant_text)),
        turns_since_asked=turns_since_asked,
        original_query=original_query,
        question=assistant_text,
        action=action,
        runtime_workflow=_PENDING_WORKFLOW_TO_RUNTIME[workflow],
        professional_category=category,
        retrieval_intent=_PENDING_WORKFLOW_TO_RETRIEVAL[workflow],
        command_mode=command_mode,
    )


def build_resolved_query(
    *,
    original_query: str,
    missing_field: MissingField,
    resolution_value: str,
    action: PendingAction,
) -> str:
    clean_original = original_query.strip().rstrip("?.!")
    clean_resolution = clean_resolution_answer(resolution_value).rstrip("?.!")
    if missing_field == "component_name":
        if action == "generate_migration_path":
            return (
                f"{clean_original}. Componente informado para migração: "
                f"{clean_resolution}."
            )
        if action == "run_contract_check":
            return f"{clean_original}. Componente informado para contract check: {clean_resolution}."
        if action == "recommend_component":
            return f"{clean_original} — componente: {clean_resolution}."
        return f"{clean_original} — componente informado: {clean_resolution}."
    if missing_field == "token_name":
        return f"{clean_original} — token informado: {clean_resolution}."
    if missing_field == "artifact_context":
        if action == "simulate_change":
            return f"{clean_original} — mudança ou cenário informado: {clean_resolution}."
        return f"{clean_original} — artefato/fluxo informado: {clean_resolution}."
    if missing_field == "usage_context":
        if action == "run_governance_scan":
            return f"{clean_original} — escopo de governança informado: {clean_resolution}."
        return f"{clean_original} — contexto informado: {clean_resolution}."
    if missing_field == "comparison_target":
        if action == "compare_components":
            return f"{clean_original} — componentes informados para comparação: {clean_resolution}."
        return f"{clean_original} — alvo de comparação informado: {clean_resolution}."
    if missing_field == "option_choice":
        return f"{clean_original} — opção informada: {clean_resolution}."
    if missing_field == "confirmation":
        return f"{clean_original} — confirmação informada: {clean_resolution}."
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
    clean_resolution = clean_resolution_answer(resolution_value)

    if not original_query or not resolution_value:
        return None
    if not is_clarification_question(assistant_text):
        return None
    if not is_resolution_answer(resolution_value):
        return None

    clarification = _build_pending_clarification(
        original_query=original_query,
        assistant_text=assistant_text,
    )
    missing_field = clarification.awaiting
    action = clarification.action
    workflow = clarification.runtime_workflow
    category = clarification.professional_category
    retrieval_intent = clarification.retrieval_intent

    if contains_migration_intent(normalize_query(original_query)):
        workflow = workflow_for_category("MIGRATION_ADVISOR")

    resolved_query = build_resolved_query(
        original_query=original_query,
        missing_field=missing_field,
        resolution_value=clean_resolution,
        action=action,
    )

    return PendingIntentResolution(
        action=action,
        missing_field=missing_field,
        original_query=original_query,
        resolution_value=clean_resolution,
        resolved_query=resolved_query,
        workflow=workflow,
        professional_category=category,
        retrieval_intent=retrieval_intent,
        command_mode=clarification.command_mode,
        clarification=clarification,
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
