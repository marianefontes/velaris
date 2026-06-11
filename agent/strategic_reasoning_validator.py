"""StrategicReasoningValidator — enforces architect-review response contracts."""

from __future__ import annotations

import unicodedata

from .decision_validator import validate_decision_response
from .models import (
    DecisionMemoryContext,
    ResponseValidation,
    StrategicReasoningAnalysis,
    SystemImpactAnalysis,
    TradeoffAnalysis,
    ValidationViolationType,
)

_CONSEQUENCE_MARKERS = (
    "consequencia",
    "consequência",
    "consequence",
    "probabilidade",
    "probability",
    "alta probabilidade",
    "high probability",
    "media probabilidade",
    "média probabilidade",
    "medium probability",
    "baixa probabilidade",
    "low probability",
    "prevista",
    "predicted",
)

_SECOND_ORDER_MARKERS = (
    "indireto",
    "indirect",
    "segunda ordem",
    "second order",
    "second-order",
    "downstream",
)

_PERSPECTIVE_MARKERS = (
    "perspectiva",
    "perspective",
    "developer",
    "designer",
    "qa",
    "acessibilidade",
    "accessibility",
    "diverg",
    "consenso",
    "consensus",
)

_SCENARIO_MARKERS = (
    "cenario",
    "cenário",
    "scenario",
    "melhor caso",
    "best case",
    "pior caso",
    "worst case",
    "caso esperado",
    "expected case",
)

_TIMELINE_MARKERS = (
    "evolucao",
    "evolução",
    "evolution",
    "historico",
    "histórico",
    "historical",
    "timeline",
    "dec-",
    "versao anterior",
    "versão anterior",
    "previous version",
)


def _normalize(value: str) -> str:
    decomposed = unicodedata.normalize("NFD", value.lower())
    return "".join(
        character
        for character in decomposed
        if unicodedata.category(character) != "Mn"
    )


def _contains_any(text: str, markers: tuple[str, ...]) -> bool:
    normalized = _normalize(text)
    return any(marker in normalized for marker in markers)


def validate_strategic_reasoning_response(
    response_text: str,
    *,
    query: str,
    tradeoff: TradeoffAnalysis | None,
    impact: SystemImpactAnalysis | None,
    memory: DecisionMemoryContext | None,
    analysis: StrategicReasoningAnalysis | None,
    requires_alternatives: bool,
) -> ResponseValidation:
    base = validate_decision_response(
        response_text,
        query=query,
        tradeoff=tradeoff,
        impact=impact,
        memory=memory,
        requires_alternatives=requires_alternatives,
    )
    violations: list[ValidationViolationType] = list(base.violations)

    if analysis is None:
        if violations:
            return ResponseValidation(
                status="fallback",
                violation_type=violations[0],
                violations=violations,
                fallback_used=True,
                fallback_reason="strategic_reasoning_validator",
            )
        return base

    if analysis.consequence_simulation.consequences:
        if not _contains_any(response_text, _CONSEQUENCE_MARKERS):
            violations.append("missing_consequence_prediction")

    if analysis.second_order_effects.indirect:
        if not _contains_any(response_text, _SECOND_ORDER_MARKERS):
            violations.append("missing_second_order_effects")

    if len(analysis.perspective_divergence.opinions) >= 2:
        if not _contains_any(response_text, _PERSPECTIVE_MARKERS):
            violations.append("missing_perspective_divergence")

    if analysis.scenario_analysis.scenarios:
        if not _contains_any(response_text, _SCENARIO_MARKERS):
            violations.append("missing_scenario_analysis")

    if analysis.entity_timelines:
        if not _contains_any(response_text, _TIMELINE_MARKERS):
            violations.append("missing_historical_timeline")

    if violations:
        return ResponseValidation(
            status="fallback",
            violation_type=violations[0],
            violations=violations,
            fallback_used=True,
            fallback_reason="strategic_reasoning_validator",
        )

    return ResponseValidation(status="pass")


def deterministic_strategic_reasoning_response(
    *,
    query: str,
    tradeoff: TradeoffAnalysis,
    impact: SystemImpactAnalysis,
    memory: DecisionMemoryContext,
    analysis: StrategicReasoningAnalysis,
    english: bool,
) -> str:
    recommendation = tradeoff.recommendation or "See evidence-backed guidance below."
    lines: list[str] = []

    if english:
        lines.extend([
            f"**Recommendation:** {recommendation}",
            "",
            "**Benefits:**",
        ])
        lines.extend(f"- {item}" for item in tradeoff.benefits or ["Grounded corpus support."])
        lines.extend(["", "**Costs:**"])
        lines.extend(f"- {item}" for item in tradeoff.costs or ["Migration friction."])
        lines.extend(["", "**Direct Impacts:**"])
        lines.extend(f"- {item}" for item in analysis.second_order_effects.direct)
        lines.extend(["", "**Indirect Impacts:**"])
        lines.extend(f"- {item}" for item in analysis.second_order_effects.indirect)
        lines.extend(["", "**Perspectives:**"])
        for op in analysis.perspective_divergence.opinions:
            lines.append(
                f"- **{op.perspective_label}** prefers {op.preferred_option}: "
                f"{op.rationale}"
            )
        lines.extend([
            "",
            f"**Consensus:** {analysis.perspective_divergence.consensus.replace('_', ' ')}",
            analysis.perspective_divergence.synthesis,
            "",
            "**Predicted Consequences:**",
        ])
        for level in ("high", "medium", "low"):
            items = [
                c.description
                for c in analysis.consequence_simulation.consequences
                if c.probability == level
            ]
            if items:
                label = f"{level.capitalize()} probability"
                lines.append(f"- {label}:")
                lines.extend(f"  - {item}" for item in items)
        if analysis.entity_timelines:
            lines.extend(["", "**Historical Evolution:**"])
            for timeline in analysis.entity_timelines[:2]:
                lines.append(f"- {timeline.entity}:")
                for entry in timeline.entries[:2]:
                    code = entry.decision_code or "prior decision"
                    lines.append(
                        f"  - {entry.version_before} → {code}: "
                        f"{entry.change_summary}"
                    )
        lines.extend(["", "**Scenarios:**"])
        for scenario in analysis.scenario_analysis.scenarios:
            label = {
                "best": "Best case",
                "expected": "Expected case",
                "worst": "Worst case",
            }[scenario.case_type]
            lines.append(f"- {label}:")
            lines.extend(f"  - {item}" for item in scenario.outcomes)
        lines.extend(["", "**Risks:**"])
        lines.extend(
            f"- {item}"
            for item in (
                analysis.consequence_simulation.future_risks
                or tradeoff.risks
                or ["Unvalidated change may regress flows."]
            )
        )
        lines.extend([
            "",
            f"**Confidence:** {analysis.confidence_rationale}",
        ])
        return "\n".join(lines)

    lines.extend([
        f"**Recomendação:** {recommendation}",
        "",
        "**Benefícios:**",
    ])
    lines.extend(f"- {item}" for item in tradeoff.benefits or ["Suporte no corpus oficial."])
    lines.extend(["", "**Custos:**"])
    lines.extend(f"- {item}" for item in tradeoff.costs or ["Atrito de migração."])
    lines.extend(["", "**Impactos Diretos:**"])
    lines.extend(f"- {item}" for item in analysis.second_order_effects.direct)
    lines.extend(["", "**Impactos Indiretos:**"])
    lines.extend(f"- {item}" for item in analysis.second_order_effects.indirect)
    lines.extend(["", "**Perspectivas:**"])
    for op in analysis.perspective_divergence.opinions:
        lines.append(
            f"- **{op.perspective_label}** prefere {op.preferred_option}: "
            f"{op.rationale}"
        )
    lines.extend([
        "",
        f"**Consenso:** {analysis.perspective_divergence.consensus.replace('_', ' ')}",
        analysis.perspective_divergence.synthesis,
        "",
        "**Consequências Previstas:**",
    ])
    for level, label in (
        ("high", "Alta probabilidade"),
        ("medium", "Média probabilidade"),
        ("low", "Baixa probabilidade"),
    ):
        items = [
            c.description
            for c in analysis.consequence_simulation.consequences
            if c.probability == level
        ]
        if items:
            lines.append(f"- {label}:")
            lines.extend(f"  - {item}" for item in items)
    if analysis.entity_timelines:
        lines.extend(["", "**Evolução Histórica:**"])
        for timeline in analysis.entity_timelines[:2]:
            lines.append(f"- {timeline.entity}:")
            for entry in timeline.entries[:2]:
                code = entry.decision_code or "decisão anterior"
                lines.append(
                    f"  - {entry.version_before} → {code}: "
                    f"{entry.change_summary}"
                )
    lines.extend(["", "**Cenários:**"])
    for scenario in analysis.scenario_analysis.scenarios:
        label = {
            "best": "Melhor cenário",
            "expected": "Cenário esperado",
            "worst": "Pior cenário",
        }[scenario.case_type]
        lines.append(f"- {label}:")
        lines.extend(f"  - {item}" for item in scenario.outcomes)
    lines.extend(["", "**Riscos:**"])
    lines.extend(
        f"- {item}"
        for item in (
            analysis.consequence_simulation.future_risks
            or tradeoff.risks
            or ["Mudança não validada pode regredir fluxos."]
        )
    )
    lines.extend([
        "",
        f"**Confiança:** {analysis.confidence_rationale}",
    ])
    return "\n".join(lines)
