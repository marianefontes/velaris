"""MultiAgentCouncilValidator — enforces council response contracts."""

from __future__ import annotations

import unicodedata

from .decision_validator import validate_decision_response
from .models import (
    DecisionMemoryContext,
    MultiAgentCouncilAnalysis,
    ResponseValidation,
    SystemImpactAnalysis,
    TradeoffAnalysis,
    ValidationViolationType,
)

_COUNCIL_MARKERS = (
    "developer",
    "desenvolvedor",
    "qa",
    "accessibility",
    "acessibilidade",
    "product designer",
    "maintainer",
    "manutencao",
    "manutenção",
    "conselho",
    "council",
)

_SYNTHESIS_MARKERS = (
    "consenso",
    "consensus",
    "divergencia",
    "divergência",
    "divergence",
    "resumo executivo",
    "executive summary",
    "concordancia",
    "concordância",
    "agreement",
)

_CONSENSUS_CLASS_MARKERS = (
    "consenso parcial",
    "partial consensus",
    "conflito",
    "conflict",
    "%",
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


def validate_council_response(
    response_text: str,
    *,
    query: str,
    tradeoff: TradeoffAnalysis | None,
    impact: SystemImpactAnalysis | None,
    memory: DecisionMemoryContext | None,
    council: MultiAgentCouncilAnalysis | None,
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

    if not _contains_any(response_text, _COUNCIL_MARKERS):
        violations.append("missing_council_perspectives")

    if not _contains_any(response_text, _SYNTHESIS_MARKERS):
        violations.append("missing_council_synthesis")

    if council and council.synthesis.consensus != "consensus":
        if not _contains_any(response_text, _CONSENSUS_CLASS_MARKERS):
            violations.append("missing_consensus_classification")

    if violations:
        return ResponseValidation(
            status="fallback",
            violation_type=violations[0],
            violations=violations,
            fallback_used=True,
            fallback_reason="council_validator",
        )

    return ResponseValidation(status="pass")


def deterministic_council_response(
    *,
    query: str,
    tradeoff: TradeoffAnalysis,
    impact: SystemImpactAnalysis,
    memory: DecisionMemoryContext,
    council: MultiAgentCouncilAnalysis,
    english: bool,
) -> str:
    synthesis = council.synthesis
    lines: list[str] = []

    if english:
        lines.append("## Multi-Agent Council")
        lines.append("")
        for opinion in council.perspectives:
            lines.extend([
                f"### {opinion.perspective_label}",
                f"- **Recommendation:** {opinion.recommendation}",
                f"- **Justification:** {opinion.justification}",
                "- **Risks:**",
            ])
            lines.extend(f"  - {risk}" for risk in opinion.risks)
            lines.append(f"- **Confidence:** {opinion.confidence}")
            lines.append("")

        consensus_label = {
            "consensus": "Consensus",
            "partial_consensus": "Partial Consensus",
            "conflict": "Conflict",
        }[synthesis.consensus]
        lines.extend([
            "---",
            "",
            "## Synthesis",
            f"**Classification:** {consensus_label} ({synthesis.consensus_percent}%)",
            "",
            "**Executive Summary:**",
            synthesis.executive_summary,
            "",
            "**Points of Agreement:**",
        ])
        lines.extend(f"- {point}" for point in synthesis.points_of_agreement)
        lines.extend(["", "**Points of Disagreement:**"])
        if synthesis.points_of_disagreement:
            lines.extend(f"- {point}" for point in synthesis.points_of_disagreement)
        else:
            lines.append("- None.")
        if synthesis.divergence_reason:
            lines.extend([
                "",
                "**Divergence Reason:**",
                synthesis.divergence_reason,
            ])
        lines.extend([
            "",
            "**Final Recommendation:**",
            synthesis.final_recommendation,
            "",
            f"**System Impact:** level {impact.level}",
        ])
    else:
        lines.append("## Conselho Multi-Agente")
        lines.append("")
        for opinion in council.perspectives:
            lines.extend([
                f"### {opinion.perspective_label}",
                f"- **Recomendação:** {opinion.recommendation}",
                f"- **Justificativa:** {opinion.justification}",
                "- **Riscos:**",
            ])
            lines.extend(f"  - {risk}" for risk in opinion.risks)
            lines.append(f"- **Confiança:** {opinion.confidence}")
            lines.append("")

        consensus_label = {
            "consensus": "Consenso",
            "partial_consensus": "Consenso Parcial",
            "conflict": "Conflito",
        }[synthesis.consensus]
        lines.extend([
            "---",
            "",
            "## Síntese",
            f"**Classificação:** {consensus_label} ({synthesis.consensus_percent}%)",
            "",
            "**Resumo Executivo:**",
            synthesis.executive_summary,
            "",
            "**Pontos de Concordância:**",
        ])
        lines.extend(f"- {point}" for point in synthesis.points_of_agreement)
        lines.extend(["", "**Pontos de Divergência:**"])
        if synthesis.points_of_disagreement:
            lines.extend(f"- {point}" for point in synthesis.points_of_disagreement)
        else:
            lines.append("- Nenhum.")
        if synthesis.divergence_reason:
            lines.extend([
                "",
                "**Motivo da divergência:**",
                synthesis.divergence_reason,
            ])
        lines.extend([
            "",
            "**Recomendação Final:**",
            synthesis.final_recommendation,
            "",
            f"**Impacto Sistêmico:** nível {impact.level}",
        ])

    if memory.related_decisions:
        ref = memory.related_decisions[0]
        code = ref.decision_code or ref.decision_id
        if english:
            lines.append(f"Related decision: {code}.")
        else:
            lines.append(f"Decisão relacionada: {code}.")

    return "\n".join(lines)
