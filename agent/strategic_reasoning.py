"""Strategic Reasoning — consequence simulation, history, perspectives, scenarios."""

from __future__ import annotations

import unicodedata
from typing import TYPE_CHECKING

from .decision_intelligence import _dedupe, _normalize, is_significant_change
from .multi_agent_council import (
    build_multi_agent_council,
    council_to_perspective_divergence,
)
from .models import (
    ConsequenceSimulation,
    DecisionMemoryContext,
    EntityHistoryEntry,
    EntityTimeline,
    ExtractedEntities,
    PerspectiveDivergenceAnalysis,
    PredictedConsequence,
    RiskForecastLevel,
    ScenarioAnalysis,
    ScenarioCase,
    SecondOrderEffects,
    StrategicReasoningAnalysis,
    SystemImpactAnalysis,
    TradeoffAnalysis,
)

if TYPE_CHECKING:
    from .executor import PlanExecution
    from .store import AgentStore

_ARCHITECT_REVIEW_TERMS = (
    "e se",
    "what if",
    "vale migrar",
    "worth migrating",
    "devemos remover",
    "should we remove",
    "devemos substituir",
    "should we replace",
    "quais consequencias",
    "quais consequências",
    "what consequences",
    "quais riscos",
    "what risks",
    "impacto da mudanca",
    "impacto da mudança",
    "impact of the change",
    "impact of change",
    "consequencias previstas",
    "consequências previstas",
    "predicted consequences",
)

_SECOND_ORDER_MAP: dict[str, tuple[str, ...]] = {
    "components": (
        "documentation updates",
        "onboarding material",
        "test suite coverage",
        "analytics event schemas",
    ),
    "documentation": (
        "onboarding speed",
        "support ticket volume",
        "training sessions",
    ),
    "tests": (
        "release confidence",
        "CI pipeline duration",
        "regression detection latency",
    ),
    "accessibility": (
        "compliance audit readiness",
        "assistive technology compatibility",
        "keyboard navigation patterns",
    ),
    "tokens": (
        "theme migration effort",
        "design tool sync",
        "component variant updates",
    ),
    "guidelines": (
        "design review criteria",
        "pattern adoption rate",
        "governance enforcement",
    ),
    "analytics": (
        "dashboard metric continuity",
        "experiment comparability",
        "reporting schema changes",
    ),
    "flows": (
        "user onboarding friction",
        "conversion funnel tracking",
        "support documentation",
    ),
    "apis": (
        "consumer contract updates",
        "integration test suites",
        "third-party adapter changes",
    ),
    "design_system": (
        "adoption governance",
        "contribution guidelines",
        "versioning policy",
    ),
}

def detect_architect_review_mode(query: str) -> bool:
    stripped = query.strip().lower()
    if stripped.startswith("/simulate"):
        return True
    normalized = _normalize(query)
    return any(term in normalized for term in _ARCHITECT_REVIEW_TERMS)


def build_strategic_reasoning(
    *,
    query: str,
    tradeoff: TradeoffAnalysis,
    impact: SystemImpactAnalysis,
    memory: DecisionMemoryContext,
    entities: ExtractedEntities,
    execution: PlanExecution | None = None,
    store: AgentStore | None = None,
    project_id: str = "",
    english: bool = False,
) -> StrategicReasoningAnalysis:
    consequence = simulate_consequences(
        query=query,
        tradeoff=tradeoff,
        impact=impact,
        entities=entities,
        english=english,
    )
    timelines = build_entity_timelines(
        memory=memory,
        entities=entities,
        store=store,
        project_id=project_id,
    )
    divergence = build_perspective_divergence(
        query=query,
        tradeoff=tradeoff,
        impact=impact,
        english=english,
    )
    scenarios = build_scenario_analysis(
        tradeoff=tradeoff,
        impact=impact,
        english=english,
    )
    second_order = build_second_order_effects(
        impact=impact,
        tradeoff=tradeoff,
        english=english,
    )
    confidence = _confidence_rationale(impact, memory, english)

    return StrategicReasoningAnalysis(
        architect_review_mode=True,
        consequence_simulation=consequence,
        entity_timelines=timelines,
        perspective_divergence=divergence,
        scenario_analysis=scenarios,
        second_order_effects=second_order,
        confidence_rationale=confidence,
    )


def simulate_consequences(
    *,
    query: str,
    tradeoff: TradeoffAnalysis,
    impact: SystemImpactAnalysis,
    entities: ExtractedEntities,
    english: bool,
) -> ConsequenceSimulation:
    change_summary = _change_summary(query, tradeoff, english)
    dependencies = _dependencies(entities, impact)
    impacts = list(impact.required_changes) or [
        f"Affected area: {area}" for area in impact.affected_areas[:4]
    ]
    consequences = _predicted_consequences(impact, tradeoff, english)
    future_risks = _dedupe(
        list(tradeoff.risks) + [
            c.description
            for c in consequences
            if c.probability == "high"
        ],
        5,
    )

    return ConsequenceSimulation(
        change_summary=change_summary,
        dependencies=dependencies,
        impacts=impacts,
        consequences=consequences,
        future_risks=future_risks,
    )


def build_entity_timelines(
    *,
    memory: DecisionMemoryContext,
    entities: ExtractedEntities,
    store: AgentStore | None = None,
    project_id: str = "",
) -> list[EntityTimeline]:
    entity_names = _dedupe(
        entities.components + entities.patterns + entities.tokens[:3],
        5,
    )
    if not entity_names and not memory.related_decisions:
        return []

    timelines: list[EntityTimeline] = []
    for entity in entity_names:
        entries = _timeline_entries_for_entity(
            entity,
            memory=memory,
            store=store,
            project_id=project_id,
        )
        if entries:
            timelines.append(EntityTimeline(entity=entity, entries=entries))

    if not timelines and memory.related_decisions:
        for decision in memory.related_decisions[:2]:
            entries = [
                EntityHistoryEntry(
                    entity=decision.recommended_option or decision.title,
                    version_before="Previous implementation",
                    decision_code=decision.decision_code,
                    change_summary=decision.title,
                    impacts=list(decision.rejected_options),
                )
            ]
            timelines.append(
                EntityTimeline(
                    entity=decision.recommended_option or decision.title,
                    entries=entries,
                )
            )
    return timelines


def build_perspective_divergence(
    *,
    query: str,
    tradeoff: TradeoffAnalysis,
    impact: SystemImpactAnalysis,
    english: bool,
) -> PerspectiveDivergenceAnalysis:
    council = build_multi_agent_council(
        query=query,
        tradeoff=tradeoff,
        impact=impact,
        english=english,
    )
    return council_to_perspective_divergence(council)


def build_scenario_analysis(
    *,
    tradeoff: TradeoffAnalysis,
    impact: SystemImpactAnalysis,
    english: bool,
) -> ScenarioAnalysis:
    recommendation = tradeoff.recommendation or "the proposed change"
    if english:
        best = [
            f"Simplified maintenance for {recommendation}.",
            "Reduced cognitive load for consumers.",
            "Consistent patterns across surfaces.",
        ]
        expected = [
            "Moderate migration effort with localized adjustments.",
            "Temporary inconsistencies during rollout.",
            "Documentation and test updates required.",
        ]
        worst = [
            "Regressions in critical user flows.",
            "Broken contracts for downstream consumers.",
            "Accessibility or validation gaps reaching production.",
        ]
    else:
        best = [
            f"Simplificação de manutenção para {recommendation}.",
            "Redução de carga cognitiva para consumidores.",
            "Padrões consistentes entre superfícies.",
        ]
        expected = [
            "Esforço moderado de migração com ajustes localizados.",
            "Inconsistências temporárias durante o rollout.",
            "Atualização de documentação e testes necessária.",
        ]
        worst = [
            "Regressões em fluxos críticos de usuário.",
            "Quebra de contratos para consumidores downstream.",
            "Lacunas de acessibilidade ou validação chegando à produção.",
        ]

    if impact.level in {"high", "critical"}:
        worst.append(
            "Extended rollback window due to broad system impact."
            if english
            else "Janela de rollback estendida devido ao amplo impacto sistêmico."
        )
    if tradeoff.debts:
        expected.append(tradeoff.debts[0])

    return ScenarioAnalysis(scenarios=[
        ScenarioCase(case_type="best", outcomes=_dedupe(best, 4)),
        ScenarioCase(case_type="expected", outcomes=_dedupe(expected, 4)),
        ScenarioCase(case_type="worst", outcomes=_dedupe(worst, 4)),
    ])


def build_second_order_effects(
    *,
    impact: SystemImpactAnalysis,
    tradeoff: TradeoffAnalysis,
    english: bool,
) -> SecondOrderEffects:
    direct: list[str] = []
    for entity in impact.affected_entities[:5]:
        direct.append(
            f"Component/entity surface: {entity}"
            if english
            else f"Superfície de componente/entidade: {entity}"
        )
    for area in impact.affected_areas[:5]:
        direct.append(
            f"Design system area: {area.replace('_', ' ')}"
            if english
            else f"Área do design system: {area.replace('_', ' ')}"
        )
    if not direct and tradeoff.recommendation:
        direct.append(
            f"Primary change target: {tradeoff.recommendation}"
            if english
            else f"Alvo principal da mudança: {tradeoff.recommendation}"
        )

    indirect: list[str] = []
    seen: set[str] = set()
    for area in impact.affected_areas:
        for effect in _SECOND_ORDER_MAP.get(area, ()):
            normalized = _normalize(effect)
            if normalized not in seen:
                seen.add(normalized)
                indirect.append(effect)

    if is_significant_change(tradeoff.recommendation):
        for extra in (
            "team training and knowledge transfer",
            "design review process updates",
            "release checklist revisions",
        ):
            normalized = _normalize(extra)
            if normalized not in seen:
                seen.add(normalized)
                indirect.append(extra)

    if not indirect:
        indirect = [
            "Documentation and onboarding downstream effects.",
            "Test coverage and CI pipeline adjustments.",
            "Analytics and observability schema updates.",
        ] if english else [
            "Efeitos downstream em documentação e onboarding.",
            "Ajustes em cobertura de testes e pipeline de CI.",
            "Atualizações em schemas de analytics e observabilidade.",
        ]

    return SecondOrderEffects(
        direct=_dedupe(direct, 6),
        indirect=_dedupe(indirect, 6),
    )


def build_strategic_reasoning_contract(
    *,
    analysis: StrategicReasoningAnalysis,
    tradeoff: TradeoffAnalysis,
    impact: SystemImpactAnalysis,
    memory: DecisionMemoryContext,
    english: bool,
) -> dict[str, object]:
    if english:
        sections = [
            "Recommendation",
            "Direct Impacts",
            "Indirect Impacts",
            "Perspectives",
            "Consensus",
            "Predicted Consequences",
            "Historical Evolution",
            "Scenarios",
            "Risks",
            "Confidence",
        ]
        rules = [
            "Every change must include predicted consequences by probability.",
            "State direct and second-order (indirect) impacts separately.",
            "When perspectives diverge, show each lens and synthesize.",
            "Explore best, expected and worst case scenarios.",
            "Reference historical decisions when entity_timelines is non-empty.",
        ]
    else:
        sections = [
            "Recomendação",
            "Impactos Diretos",
            "Impactos Indiretos",
            "Perspectivas",
            "Consenso",
            "Consequências Previstas",
            "Evolução Histórica",
            "Cenários",
            "Riscos",
            "Confiança",
        ]
        rules = [
            "Toda mudança deve incluir consequências previstas por probabilidade.",
            "Separe impactos diretos e de segunda ordem (indiretos).",
            "Quando perspectivas divergirem, mostre cada lente e sintetize.",
            "Explore cenários melhor, esperado e pior caso.",
            "Referencie decisões históricas quando entity_timelines não estiver vazio.",
        ]

    return {
        "mode": "architect_review",
        "required_sections": sections,
        "rules": rules,
        "strategic_reasoning": analysis.model_dump(mode="json"),
        "tradeoff_analysis": tradeoff.model_dump(mode="json"),
        "system_impact": impact.model_dump(mode="json"),
        "related_decisions": [
            entry.model_dump(mode="json")
            for entry in memory.related_decisions
        ],
    }


def _change_summary(
    query: str,
    tradeoff: TradeoffAnalysis,
    english: bool,
) -> str:
    if tradeoff.recommendation and tradeoff.alternatives:
        if english:
            return (
                f"Evaluate changing to {tradeoff.recommendation} "
                f"(alternatives: {', '.join(tradeoff.alternatives[:3])})"
            )
        return (
            f"Avaliar mudança para {tradeoff.recommendation} "
            f"(alternativas: {', '.join(tradeoff.alternatives[:3])})"
        )
    return query.strip()[:200]


def _dependencies(
    entities: ExtractedEntities,
    impact: SystemImpactAnalysis,
) -> list[str]:
    deps: list[str] = []
    deps.extend(entities.components)
    deps.extend(entities.patterns)
    deps.extend(entities.tokens[:3])
    for area in impact.affected_areas:
        if area not in {"design_system"}:
            deps.append(area.replace("_", " "))
    return _dedupe(deps, 8)


def _predicted_consequences(
    impact: SystemImpactAnalysis,
    tradeoff: TradeoffAnalysis,
    english: bool,
) -> list[PredictedConsequence]:
    high: list[str] = []
    medium: list[str] = []
    low: list[str] = []

    area_consequences: dict[str, tuple[str, str, str]] = {
        "documentation": (
            "Documentation review and example updates",
            "Revisão de documentação e exemplos",
            "high",
        ),
        "tests": (
            "Test suite updates and regression validation",
            "Atualização de testes e validação de regressão",
            "high",
        ),
        "components": (
            "Component contract and prop surface changes",
            "Mudanças em contrato e superfície de props",
            "high",
        ),
        "accessibility": (
            "Accessibility regression risk during transition",
            "Risco de regressão de acessibilidade na transição",
            "low",
        ),
        "guidelines": (
            "Guideline and pattern alignment review",
            "Revisão de alinhamento de guidelines e padrões",
            "medium",
        ),
        "tokens": (
            "Token migration and theme consistency checks",
            "Migração de tokens e verificação de consistência",
            "medium",
        ),
        "flows": (
            "Temporary flow inconsistencies during rollout",
            "Inconsistências temporárias de fluxo no rollout",
            "medium",
        ),
        "analytics": (
            "Analytics event schema updates",
            "Atualização de schemas de eventos de analytics",
            "low",
        ),
    }

    for area in impact.affected_areas:
        entry = area_consequences.get(area)
        if entry:
            text = entry[0] if english else entry[1]
            level: RiskForecastLevel = entry[2]  # type: ignore[assignment]
            if level == "high":
                high.append(text)
            elif level == "medium":
                medium.append(text)
            else:
                low.append(text)

    if impact.level in {"high", "critical"}:
        high.append(
            "Cross-team coordination required for safe rollout"
            if english
            else "Coordenação entre times necessária para rollout seguro"
        )

    for risk in tradeoff.risks[:2]:
        medium.append(risk)

    if not high and not medium:
        high.append(
            "Review catalog examples and usage guidance"
            if english
            else "Revisão de exemplos do catálogo e orientações de uso"
        )
        medium.append(
            "Temporary inconsistencies during adoption"
            if english
            else "Inconsistências temporárias durante adoção"
        )
        low.append(
            "Accessibility edge-case regressions"
            if english
            else "Regressões de casos extremos de acessibilidade"
        )

    result: list[PredictedConsequence] = []
    for text in _dedupe(high, 4):
        result.append(PredictedConsequence(description=text, probability="high"))
    for text in _dedupe(medium, 4):
        result.append(PredictedConsequence(description=text, probability="medium"))
    for text in _dedupe(low, 3):
        result.append(PredictedConsequence(description=text, probability="low"))
    return result


def _timeline_entries_for_entity(
    entity: str,
    *,
    memory: DecisionMemoryContext,
    store: AgentStore | None,
    project_id: str,
) -> list[EntityHistoryEntry]:
    entries: list[EntityHistoryEntry] = []
    normalized_entity = _normalize(entity)

    for decision in memory.related_decisions:
        haystack = _normalize(
            f"{decision.title} {decision.recommended_option} "
            f"{' '.join(decision.rejected_options)}"
        )
        if normalized_entity not in haystack and _normalize(entity) not in haystack:
            continue
        entries.append(EntityHistoryEntry(
            entity=entity,
            version_before="Previous implementation",
            decision_code=decision.decision_code,
            change_summary=decision.title or decision.recommended_option,
            impacts=list(decision.rejected_options),
        ))

    if store and project_id:
        for record in store.search_decisions(
            project_id=project_id,
            terms=[entity],
            status="confirmed",
            limit=3,
        ):
            code = str(record.get("decision_code", ""))
            if any(e.decision_code == code for e in entries):
                continue
            entries.append(EntityHistoryEntry(
                entity=entity,
                version_before="Prior state",
                decision_code=code or None,
                decision_date=str(record.get("timestamp", ""))[:10],
                change_summary=str(
                    record.get("title") or record.get("user_query", "")
                )[:200],
                impacts=list(record.get("rejected_options") or []),
            ))

    return entries[:4]


def _confidence_rationale(
    impact: SystemImpactAnalysis,
    memory: DecisionMemoryContext,
    english: bool,
) -> str:
    if impact.level in {"high", "critical"}:
        return (
            "medium — significant system impact requires staged validation"
            if english
            else "média — impacto sistêmico significativo exige validação gradual"
        )
    if memory.related_decisions:
        return (
            "medium-high — grounded in retrieved evidence and historical decisions"
            if english
            else "média-alta — fundamentada em evidência recuperada e decisões históricas"
        )
    return (
        "medium — based on retrieved evidence, not answer certainty"
        if english
        else "média — baseada em evidência recuperada, não certeza da resposta"
    )
