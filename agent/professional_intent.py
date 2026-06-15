"""Professional intent classification and knowledge-source routing for Abraxos.

Separates institutional corpus lookups from professional expertise and
analytical capabilities so RAG is mandatory only when the question depends
on Velaris catalog evidence.
"""

from __future__ import annotations

from typing import Literal

from .migration_advisor import contains_migration_intent
from .models import ExtractedEntities, QueryUnderstanding, UserIntent
from .understanding import normalize_query


ProfessionalIntentCategory = Literal[
    "ENTITY_LOOKUP",
    "KNOWLEDGE_EXPLANATION",
    "DESIGN_AUDIT",
    "DESIGN_RATIONALE",
    "ACCESSIBILITY_REVIEW",
    "ARCHITECTURE_REVIEW",
    "GENERAL_PROFESSIONAL_GUIDANCE",
    "MIGRATION_ADVISOR",
]

KnowledgeSource = Literal[
    "institutional_knowledge",
    "professional_knowledge",
    "analytical_capability",
]

_ENTITY_LOOKUP_MARKERS = (
    "existe ",
    "existe o ",
    "existe a ",
    "tem ",
    "possui ",
    "have ",
    "has ",
    "where can i find",
    "onde encontro",
    "onde acho",
    "qual token",
    "which token",
    "como funciona o ",
    "como funciona a ",
    "how does the ",
    "how does ",
)

_DESIGN_AUDIT_MARKERS = (
    "audite",
    "auditar",
    "audit ",
    "valide ",
    "validar ",
    "validate ",
    "analise esta",
    "analise este",
    "analisar esta",
    "analisar este",
    "analyze this",
    "avaliar o fluxo",
    "evaluate this",
    "review this",
    "revise esta",
    "revise este",
    "revise this",
    "conformidade",
    "compliance",
    "violacao",
    "violação",
    "violation",
)

_DESIGN_RATIONALE_MARKERS = (
    "racional visual",
    "design rationale",
    "defender",
    "defend ",
    "justificar",
    "justify",
    "argumentar",
    "como defender",
    "how to defend",
    "como justificar",
    "how to justify",
    "justificativa",
    "argumentacao",
    "argumentação",
)

_ACCESSIBILITY_REVIEW_MARKERS = (
    "acessibilidade",
    "accessibility",
    "wcag",
    "aria",
    "leitor de tela",
    "screen reader",
    "navegacao por teclado",
    "navegação por teclado",
    "keyboard navigation",
    "contraste",
    "contrast ratio",
    "inclusao",
    "inclusão",
    "inclusion",
)

_ARCHITECTURE_REVIEW_MARKERS = (
    "arquitetura de",
    "architecture of",
    "analise esta arquitetura",
    "analyze this architecture",
    "avaliar esta arquitetura",
    "avaliar esta solucao",
    "avaliar esta solução",
    "evaluate this architecture",
    "evaluate this solution",
    "como melhoraria este sistema",
    "how would you improve this system",
    "system design",
    "arquitetura do sistema",
)

_KNOWLEDGE_EXPLANATION_MARKERS = (
    "explique",
    "explain",
    "o que e ",
    "o que é ",
    "what is ",
    "como funciona ",
    "how does ",
    "quais criterios",
    "quais critérios",
    "what criteria",
    "principios",
    "princípios",
    "principles",
    "heuristica",
    "heurística",
    "heuristic",
    "metodologia",
    "methodology",
    "framework",
    "checklist",
    "progressive disclosure",
    "carga cognitiva",
    "cognitive load",
    "hierarquia visual",
    "visual hierarchy",
    "design critique",
    "critica de design",
    "crítica de design",
)

_PROFESSIONAL_GUIDANCE_MARKERS = (
    "como um product manager",
    "como um qa",
    "como um designer",
    "como uma designer",
    "how would a product manager",
    "how would a qa",
    "how would a designer",
    "perspectiva de ",
    "perspective of ",
    "designer experiente",
    "experienced designer",
)

_DOCUMENTED_DECISION_MARKERS = (
    "esta decisao",
    "esta decisão",
    "this decision",
    "decisao registrada",
    "decisão registrada",
    "documented decision",
    "no velaris",
    "in velaris",
    "por que esta decisao",
    "por que esta decisão",
    "why this decision",
)


def _contains_any(text: str, markers: tuple[str, ...]) -> bool:
    return any(marker in text for marker in markers)


def knowledge_source_for_category(
    category: ProfessionalIntentCategory,
) -> KnowledgeSource:
    if category == "ENTITY_LOOKUP":
        return "institutional_knowledge"
    if category == "DESIGN_AUDIT":
        return "analytical_capability"
    if category == "MIGRATION_ADVISOR":
        return "analytical_capability"
    return "professional_knowledge"


def requires_institutional_evidence(understanding: QueryUnderstanding) -> bool:
    return understanding.knowledge_source == "institutional_knowledge"


def requires_mandatory_rag(understanding: QueryUnderstanding) -> bool:
    return understanding.professional_category == "ENTITY_LOOKUP"


def workflow_for_category(category: ProfessionalIntentCategory) -> str:
    return {
        "ENTITY_LOOKUP": "entity_lookup",
        "KNOWLEDGE_EXPLANATION": "documentation_help",
        "DESIGN_AUDIT": "design_audit",
        "DESIGN_RATIONALE": "design_decision",
        "ACCESSIBILITY_REVIEW": "accessibility_guidance",
        "ARCHITECTURE_REVIEW": "decision_analysis",
        "GENERAL_PROFESSIONAL_GUIDANCE": "documentation_help",
        "MIGRATION_ADVISOR": "migration_advisor",
    }[category]


def retrieval_intent_for_category(category: ProfessionalIntentCategory) -> str:
    return {
        "ENTITY_LOOKUP": "general",
        "KNOWLEDGE_EXPLANATION": "knowledge_explanation",
        "DESIGN_AUDIT": "design_audit",
        "DESIGN_RATIONALE": "design_rationale",
        "ACCESSIBILITY_REVIEW": "accessibility_guidance",
        "ARCHITECTURE_REVIEW": "architecture_review",
        "GENERAL_PROFESSIONAL_GUIDANCE": "professional_guidance",
        "MIGRATION_ADVISOR": "migration_advisor",
    }[category]


def classify_professional_category(
    query: str,
    *,
    user_intent: UserIntent,
    entities: ExtractedEntities,
) -> ProfessionalIntentCategory:
    normalized = normalize_query(query)
    padded = f" {normalized} "

    if user_intent in {
        "system_health",
        "agent_identity",
        "governance_analysis",
        "simulation",
        "multi_agent_reasoning",
    }:
        return "KNOWLEDGE_EXPLANATION"

    if _contains_any(normalized, ("quais criterios", "quais critérios", "what criteria")):
        return "KNOWLEDGE_EXPLANATION"

    if contains_migration_intent(normalized):
        return "MIGRATION_ADVISOR"

    if _contains_any(normalized, _DESIGN_AUDIT_MARKERS):
        return "DESIGN_AUDIT"

    if entities.components and _contains_any(
        normalized,
        (
            "implemento",
            "implementar",
            "implement",
            "como usar",
            "how to use",
            "usando os intents",
            "using the intents",
            "usando intents",
        ),
    ):
        return "ENTITY_LOOKUP"

    if _contains_any(normalized, _DESIGN_RATIONALE_MARKERS):
        return "DESIGN_RATIONALE"

    if (
        "esta decisao" in normalized
        or "esta decisão" in normalized
        or "this decision" in normalized
    ) and not _contains_any(
        normalized,
        ("ux", "experiencia", "experiência", "interface", "usuario", "usuário"),
    ):
        return "ENTITY_LOOKUP"

    if (
        _contains_any(normalized, _ACCESSIBILITY_REVIEW_MARKERS)
        or user_intent == "accessibility_guidance"
    ):
        return "ACCESSIBILITY_REVIEW"

    if _contains_any(normalized, _ARCHITECTURE_REVIEW_MARKERS):
        return "ARCHITECTURE_REVIEW"

    if _contains_any(normalized, _PROFESSIONAL_GUIDANCE_MARKERS):
        return "GENERAL_PROFESSIONAL_GUIDANCE"

    if _contains_any(normalized, _KNOWLEDGE_EXPLANATION_MARKERS):
        return "KNOWLEDGE_EXPLANATION"

    if user_intent in {
        "entity_lookup",
        "catalog",
        "token_lookup",
        "direct_entity_guidance",
        "component_comparison",
        "pattern_guidance",
        "xai_explanation",
    }:
        return "ENTITY_LOOKUP"

    if user_intent in {
        "page_architecture",
        "component_discovery",
    }:
        return "GENERAL_PROFESSIONAL_GUIDANCE"

    if user_intent == "component_recommendation":
        if entities.components:
            return "ENTITY_LOOKUP"
        return "GENERAL_PROFESSIONAL_GUIDANCE"

    if user_intent == "design_decision" and _contains_any(
        normalized,
        _DOCUMENTED_DECISION_MARKERS,
    ):
        return "ENTITY_LOOKUP"

    if user_intent in {"general_design_system", "help_request", "concept_query"}:
        return "KNOWLEDGE_EXPLANATION"

    if user_intent == "design_decision":
        return "DESIGN_RATIONALE"

    if user_intent == "perspective_lookup":
        return "GENERAL_PROFESSIONAL_GUIDANCE"

    if _contains_any(padded, _ENTITY_LOOKUP_MARKERS) and (
        entities.components or entities.tokens or entities.patterns
    ):
        return "ENTITY_LOOKUP"

    if user_intent == "out_of_scope":
        return "KNOWLEDGE_EXPLANATION"

    return "KNOWLEDGE_EXPLANATION"


def enrich_understanding(understanding: QueryUnderstanding, query: str) -> QueryUnderstanding:
    category = classify_professional_category(
        query,
        user_intent=understanding.user_intent,
        entities=understanding.entities,
    )
    source = knowledge_source_for_category(category)
    return understanding.model_copy(
        update={
            "professional_category": category,
            "knowledge_source": source,
        }
    )
