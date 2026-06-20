"""Decision Intelligence — memory, tradeoffs, system impact, and analysis mode."""

from __future__ import annotations

import re
import unicodedata
from typing import TYPE_CHECKING

from .models import (
    ComponentSelection,
    DecisionMemoryContext,
    DecisionMemoryEntry,
    ExtractedEntities,
    ImpactLevel,
    SystemImpactAnalysis,
    TradeoffAnalysis,
)

if TYPE_CHECKING:
    from .executor import PlanExecution
    from .store import AgentStore

_DECISION_ANALYSIS_TERMS = (
    "devemos usar",
    "should we use",
    "vale a pena",
    "worth it",
    "worth using",
    "worth migrating",
    "substituir",
    "replace",
    "migrar",
    "migrate",
    "remover",
    "remove",
    "adoptar",
    "adopt",
    "trocar por",
    "switch to",
    "switch from",
    "investir em",
    "invest in",
    "faz sentido usar",
    "faz sentido trocar",
    "faz sentido substituir",
    "faz sentido migrar",
    "does it make sense to use",
    "does it make sense to replace",
    "does it make sense to migrate",
)

_SIGNIFICANT_CHANGE_TERMS = (
    "substituir",
    "replace",
    "migrar",
    "migrate",
    "remover",
    "remove",
    "trocar",
    "switch",
    "adotar",
    "adopt",
    "deprecar",
    "deprecate",
    "breaking",
    "breaking change",
)

_IMPACT_AREA_KEYWORDS: dict[str, tuple[str, ...]] = {
    "components": ("component", "componente", "dialog", "button", "modal", "drawer"),
    "tokens": ("token", "cor", "color", "spacing", "tipografia", "typography"),
    "guidelines": ("guideline", "diretriz", "principio", "princípio", "manifesto"),
    "accessibility": ("acessibilidade", "accessibility", "wcag", "aria", "keyboard"),
    "tests": ("teste", "test", "spec", "e2e", "unit test"),
    "documentation": ("documentacao", "documentação", "docs", "catalogo", "catálogo"),
    "analytics": ("analytics", "metricas", "métricas", "tracking", "evento"),
    "flows": ("fluxo", "flow", "jornada", "journey", "onboarding"),
    "apis": ("api", "endpoint", "contrato", "contract", "props"),
    "design_system": ("design system", "sistema de design", "velaris", "aetheris"),
}

_BENEFIT_MARKERS = (
    "beneficio",
    "benefício",
    "benefit",
    "vantagem",
    "advantage",
    "ganho",
    "gain",
    "foco",
    "focus",
    "reduz",
    "reduce",
    "melhora",
    "improve",
)

_COST_MARKERS = (
    "custo",
    "cost",
    "trade-off",
    "tradeoff",
    "desvantagem",
    "downside",
    "interrompe",
    "interrupt",
    "atrito",
    "friction",
    "sobrecarga",
    "overload",
)

_RISK_MARKERS = (
    "risco",
    "risk",
    "fadiga",
    "fatigue",
    "excesso",
    "excessive",
    "regressao",
    "regressão",
    "regression",
)


def _normalize(value: str) -> str:
    decomposed = unicodedata.normalize("NFD", value.lower())
    return "".join(
        character
        for character in decomposed
        if unicodedata.category(character) != "Mn"
    )


def detect_decision_analysis_mode(query: str) -> bool:
    normalized = _normalize(query)
    return any(term in normalized for term in _DECISION_ANALYSIS_TERMS)


def is_significant_change(query: str) -> bool:
    normalized = _normalize(query)
    return any(term in normalized for term in _SIGNIFICANT_CHANGE_TERMS)


def resolve_decision_memory(
    store: AgentStore,
    *,
    project_id: str,
    session_id: str,
    query: str,
    entities: ExtractedEntities,
    limit: int = 5,
) -> DecisionMemoryContext:
    seen: set[str] = set()
    entries: list[DecisionMemoryEntry] = []

    def add_entry(record: dict[str, object], relevance: str) -> None:
        decision_id = str(record.get("decision_id", ""))
        if not decision_id or decision_id in seen:
            return
        seen.add(decision_id)
        entries.append(DecisionMemoryEntry(
            decision_id=decision_id,
            decision_code=record.get("decision_code"),  # type: ignore[arg-type]
            title=str(record.get("title") or record.get("user_query", ""))[:200],
            recommended_option=str(
                record.get("recommended_option")
                or record.get("recommendation", "")
            )[:300],
            rejected_options=list(record.get("rejected_options") or []),
            status=record.get("status", "draft"),  # type: ignore[arg-type]
            relevance=relevance,
        ))

    session = store.get_session_memory(session_id) or {}
    project = store.get_project_memory(project_id) or {}
    for decision_id in (
        session.get("recent_decisions", [])
        + project.get("recent_decisions", [])
    ):
        record = store.get_decision(str(decision_id))
        if record:
            add_entry(record, "recent")

    search_terms = _memory_search_terms(query, entities)
    if search_terms:
        for record in store.search_decisions(
            project_id=project_id,
            terms=search_terms,
            status="confirmed",
            limit=limit,
        ):
            add_entry(record, "related")

    return DecisionMemoryContext(related_decisions=entries[:limit])


def _memory_search_terms(query: str, entities: ExtractedEntities) -> list[str]:
    terms: list[str] = []
    terms.extend(entities.components)
    terms.extend(entities.patterns)
    terms.extend(entities.tokens[:3])
    for token in re.findall(r"[a-z]{4,}", _normalize(query)):
        if token not in {
            "devemos", "should", "qual", "which", "what", "como", "how",
            "para", "para", "usar", "use", "vale", "pena", "worth",
        }:
            terms.append(token)
    return list(dict.fromkeys(terms))[:8]


def build_tradeoff_analysis(
    *,
    query: str,
    execution: PlanExecution | None,
    component_selection: ComponentSelection | None,
) -> TradeoffAnalysis:
    benefits: list[str] = []
    costs: list[str] = []
    risks: list[str] = []
    debts: list[str] = []
    alternatives: list[str] = []
    recommendation = ""

    if component_selection and component_selection.recommended:
        component = component_selection.recommended.component
        recommendation = component.name
        for rule in component_selection.recommended.selected_do_rules[:3]:
            benefits.append(rule.text)
        for rule in component_selection.recommended.selected_when_to_use[:3]:
            if rule.text not in benefits:
                benefits.append(rule.text)
        for rule in component_selection.recommended.selected_dont_rules[:2]:
            costs.append(rule.text)
        for rule in component_selection.recommended.selected_when_not_to_use[:2]:
            if rule.text not in costs:
                costs.append(rule.text)
        for rule in component_selection.recommended.selected_anti_pattern_rules[:2]:
            risks.append(rule.text)
        if component_selection.recommended.context_fit:
            for violation in component_selection.recommended.context_fit.violations[:2]:
                risks.append(violation.text)
        for candidate in component_selection.alternative_components[:3]:
            alternatives.append(candidate.name)

    if execution:
        for result in execution.results:
            output = result.output or {}
            for item in output.get("tradeoff_signals", []):
                text = str(item.get("text", "")).strip()
                if not text:
                    continue
                normalized = _normalize(text)
                if any(marker in normalized for marker in _RISK_MARKERS):
                    risks.append(text)
                elif any(marker in normalized for marker in _COST_MARKERS):
                    costs.append(text)
                elif any(marker in normalized for marker in _BENEFIT_MARKERS):
                    benefits.append(text)
                else:
                    costs.append(text)
            for item in output.get("possible_violations", []):
                text = str(item.get("text", "")).strip()
                if text:
                    risks.append(text)
            for item in output.get("recommendations", []):
                text = str(item.get("text", "")).strip()
                if text and "debt" in _normalize(text):
                    debts.append(text)
            for key in ("option_a_evidence", "option_b_evidence"):
                for item in output.get(key, []):
                    title = str(item.get("title", "")).strip()
                    if title and title not in alternatives:
                        alternatives.append(title)

    if not recommendation and alternatives:
        recommendation = alternatives[0]

    if not benefits and recommendation:
        benefits.append(
            f"Grounded evidence supports {recommendation} for this context."
        )
    if not costs:
        costs.append("Every design choice carries UX friction or maintenance cost.")
    if not risks and is_significant_change(query):
        risks.append("Unvalidated migration may regress existing flows.")

    return TradeoffAnalysis(
        recommendation=recommendation,
        benefits=_dedupe(benefits, 5),
        costs=_dedupe(costs, 5),
        risks=_dedupe(risks, 4),
        debts=_dedupe(debts, 3),
        alternatives=_dedupe(alternatives, 5),
    )


def analyze_system_impact(
    *,
    query: str,
    execution: PlanExecution | None,
    entities: ExtractedEntities,
) -> SystemImpactAnalysis:
    affected_areas: list[str] = []
    required_changes: list[str] = []
    affected_entities: list[str] = []
    normalized = _normalize(query)

    for area, keywords in _IMPACT_AREA_KEYWORDS.items():
        if any(keyword in normalized for keyword in keywords):
            affected_areas.append(area)

    affected_entities.extend(entities.components)
    affected_entities.extend(entities.patterns)
    affected_entities.extend(entities.tokens[:5])

    if execution:
        for result in execution.results:
            output = result.output or {}
            for key in (
                "relevant_components",
                "relevant_patterns",
                "relevant_tokens",
                "relevant_guidelines",
            ):
                for item in output.get(key, []):
                    title = str(item.get("title", "")).strip()
                    if title:
                        affected_entities.append(title)
            for item in output.get("recommendations", []):
                text = str(item.get("text", "")).strip()
                if text:
                    required_changes.append(text)

    affected_entities = _dedupe(affected_entities, 10)
    affected_areas = _dedupe(affected_areas, 10)

    if not affected_areas:
        affected_areas = ["design_system"]

    level = _impact_level(query, affected_areas, affected_entities)

    if level in {"medium", "high", "critical"} and not required_changes:
        required_changes.extend([
            "Review catalog examples and usage guidance.",
            "Validate accessibility and test coverage.",
        ])

    return SystemImpactAnalysis(
        level=level,
        affected_areas=affected_areas,
        required_changes=_dedupe(required_changes, 6),
        affected_entities=affected_entities,
    )


def _impact_level(
    query: str,
    affected_areas: list[str],
    affected_entities: list[str],
) -> ImpactLevel:
    normalized = _normalize(query)
    if any(
        term in normalized
        for term in ("breaking", "critical", "remover", "remove", "deprecar")
    ):
        return "critical"
    if is_significant_change(query) and len(affected_areas) >= 3:
        return "high"
    if is_significant_change(query) or len(affected_entities) >= 2:
        return "medium"
    return "low"


def build_decision_analysis_contract(
    *,
    tradeoff: TradeoffAnalysis,
    impact: SystemImpactAnalysis,
    memory: DecisionMemoryContext,
    significant_change: bool,
    english: bool,
) -> dict[str, object]:
    if english:
        sections = [
            "Recommendation",
            "Motivation",
            "Benefits",
            "Costs",
            "Risks",
            "System Impact",
            "Alternatives",
            "Confidence",
        ]
        rules = [
            "Never present benefits without corresponding costs.",
            "Every recommendation has tradeoffs — state them explicitly.",
            "Reference related historical decisions when available.",
        ]
    else:
        sections = [
            "Recomendação",
            "Motivação",
            "Benefícios",
            "Custos",
            "Riscos",
            "Impacto Sistêmico",
            "Alternativas",
            "Confiança",
        ]
        rules = [
            "Nunca apresente benefícios sem custos correspondentes.",
            "Toda recomendação possui tradeoffs — explicite-os.",
            "Referencie decisões históricas relevantes quando existirem.",
        ]

    return {
        "mode": "decision_analysis",
        "required_sections": sections,
        "rules": rules,
        "tradeoff_analysis": tradeoff.model_dump(mode="json"),
        "system_impact": impact.model_dump(mode="json"),
        "related_decisions": [
            entry.model_dump(mode="json")
            for entry in memory.related_decisions
        ],
        "significant_change": significant_change,
        "reference_format": "DEC-NNN or decision_code from related_decisions",
    }


def _dedupe(values: list[str], limit: int) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for value in values:
        normalized = _normalize(value)
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        result.append(value.strip())
        if len(result) >= limit:
            break
    return result
