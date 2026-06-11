"""DecisionValidator — enforces decision-analysis response contracts."""

from __future__ import annotations

import re
import unicodedata

from .decision_intelligence import is_significant_change
from .models import (
    DecisionMemoryContext,
    ResponseValidation,
    SystemImpactAnalysis,
    TradeoffAnalysis,
    ValidationViolationType,
)

_RECOMMENDATION_MARKERS = (
    "recomendo",
    "recommend",
    "recomendacao",
    "recomendação",
    "recommendation",
    "melhor escolha",
    "best choice",
    "devemos usar",
    "should use",
    "use ",
    "usar ",
)

_TRADEOFF_MARKERS = (
    "trade-off",
    "tradeoff",
    "trade off",
    "custo",
    "cost",
    "desvantagem",
    "downside",
    "porem",
    "porém",
    "however",
    "mas ",
)

_BENEFIT_SECTION_MARKERS = (
    "beneficio",
    "benefício",
    "benefit",
    "vantagem",
    "advantage",
    "ganho",
    "gain",
)

_COST_SECTION_MARKERS = (
    "custo",
    "cost",
    "atrito",
    "friction",
    "interrompe",
    "interrupt",
    "desvantagem",
    "downside",
)

_IMPACT_MARKERS = (
    "impacto",
    "impact",
    "areas afetadas",
    "áreas afetadas",
    "affected areas",
    "mudancas necessarias",
    "mudanças necessárias",
    "required changes",
)

_ALTERNATIVE_MARKERS = (
    "alternativa",
    "alternative",
    "em vez de",
    "instead of",
    " versus ",
    " vs ",
)

_DECISION_REF_PATTERN = re.compile(
    r"\b(?:DEC-\d{3,4}|dec_[a-f0-9]{8,16})\b",
    re.IGNORECASE,
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


def validate_decision_response(
    response_text: str,
    *,
    query: str,
    tradeoff: TradeoffAnalysis | None,
    impact: SystemImpactAnalysis | None,
    memory: DecisionMemoryContext | None,
    requires_alternatives: bool,
) -> ResponseValidation:
    violations: list[ValidationViolationType] = []
    normalized = _normalize(response_text)

    if not _contains_any(response_text, _RECOMMENDATION_MARKERS):
        violations.append("missing_recommendation")

    if not _contains_any(response_text, _TRADEOFF_MARKERS):
        violations.append("missing_tradeoff")

    if not _contains_any(response_text, _BENEFIT_SECTION_MARKERS):
        violations.append("missing_benefit")

    if not _contains_any(response_text, _COST_SECTION_MARKERS):
        violations.append("missing_cost")

    if is_significant_change(query) and not _contains_any(response_text, _IMPACT_MARKERS):
        violations.append("missing_system_impact")

    if memory and memory.related_decisions:
        known_refs = {
            entry.decision_code
            for entry in memory.related_decisions
            if entry.decision_code
        } | {
            entry.decision_id
            for entry in memory.related_decisions
        }
        has_ref = bool(_DECISION_REF_PATTERN.search(response_text))
        has_alignment = any(
            marker in normalized
            for marker in ("alinhada", "aligned", "decisao", "decision")
        )
        if not has_ref and not has_alignment and known_refs:
            violations.append("missing_decision_reference")

    if requires_alternatives and not _contains_any(response_text, _ALTERNATIVE_MARKERS):
        if tradeoff and len(tradeoff.alternatives) >= 2:
            violations.append("missing_alternatives")

    if violations:
        return ResponseValidation(
            status="fallback",
            violation_type=violations[0],
            violations=violations,
            fallback_used=True,
            fallback_reason="decision_validator",
        )

    return ResponseValidation(status="pass")


def deterministic_decision_response(
    *,
    query: str,
    tradeoff: TradeoffAnalysis,
    impact: SystemImpactAnalysis,
    memory: DecisionMemoryContext,
    english: bool,
) -> str:
    recommendation = tradeoff.recommendation or "See evidence-backed guidance below."
    lines: list[str] = []

    if english:
        lines.extend([
            f"**Recommendation:** {recommendation}",
            "",
            "**Motivation:**",
            f"The query asks for a decision-oriented answer: {query.strip()}",
            "",
            "**Benefits:**",
        ])
        lines.extend(f"- {item}" for item in tradeoff.benefits or ["Grounded corpus support."])
        lines.extend(["", "**Costs:**"])
        lines.extend(f"- {item}" for item in tradeoff.costs)
        lines.extend(["", "**Risks:**"])
        lines.extend(
            f"- {item}"
            for item in (tradeoff.risks or ["Unvalidated change may regress flows."])
        )
        lines.extend([
            "",
            "**System Impact:**",
            f"Level: {impact.level}",
            "Affected areas:",
        ])
        lines.extend(f"- {area}" for area in impact.affected_areas)
        if impact.required_changes:
            lines.append("Required changes:")
            lines.extend(f"- {item}" for item in impact.required_changes)
        if tradeoff.alternatives:
            lines.extend(["", "**Alternatives:**"])
            lines.extend(f"- {item}" for item in tradeoff.alternatives)
        if memory.related_decisions:
            ref = memory.related_decisions[0]
            code = ref.decision_code or ref.decision_id
            lines.extend([
                "",
                f"This recommendation aligns with decision {code}.",
            ])
        lines.extend([
            "",
            "**Confidence:** medium — based on retrieved evidence, not answer certainty.",
        ])
        return "\n".join(lines)

    lines.extend([
        f"**Recomendação:** {recommendation}",
        "",
        "**Motivação:**",
        f"A pergunta pede uma resposta orientada a decisão: {query.strip()}",
        "",
        "**Benefícios:**",
    ])
    lines.extend(f"- {item}" for item in tradeoff.benefits or ["Suporte no corpus oficial."])
    lines.extend(["", "**Custos:**"])
    lines.extend(f"- {item}" for item in tradeoff.costs)
    lines.extend(["", "**Riscos:**"])
    lines.extend(
        f"- {item}"
        for item in (tradeoff.risks or ["Mudança não validada pode regredir fluxos."])
    )
    lines.extend([
        "",
        "**Impacto Sistêmico:**",
        f"Nível: {impact.level}",
        "Áreas afetadas:",
    ])
    lines.extend(f"- {area}" for area in impact.affected_areas)
    if impact.required_changes:
        lines.append("Mudanças necessárias:")
        lines.extend(f"- {item}" for item in impact.required_changes)
    if tradeoff.alternatives:
        lines.extend(["", "**Alternativas:**"])
        lines.extend(f"- {item}" for item in tradeoff.alternatives)
    if memory.related_decisions:
        ref = memory.related_decisions[0]
        code = ref.decision_code or ref.decision_id
        lines.extend([
            "",
            f"Esta recomendação está alinhada à decisão {code}.",
        ])
    lines.extend([
        "",
        "**Confiança:** média — baseada em evidência recuperada, não certeza da resposta.",
    ])
    return "\n".join(lines)
