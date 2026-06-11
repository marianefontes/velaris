"""Multi-Agent Council — parallel perspective analysis for decision queries."""

from __future__ import annotations

from collections import Counter

from prompts.cognitive_profiles import COGNITIVE_PROFILES

from .decision_intelligence import _dedupe, _normalize
from .models import (
    ConsensusLevel,
    CouncilPerspectiveOpinion,
    CouncilSynthesis,
    MultiAgentCouncilAnalysis,
    PerspectiveDivergenceAnalysis,
    PerspectiveOpinion,
    SystemImpactAnalysis,
    TradeoffAnalysis,
)

COUNCIL_PERSPECTIVES: tuple[str, ...] = (
    "dev",
    "qa",
    "a11y",
    "product_designer",
    "maintainer",
)

_FLOW_CONTINUITY_COMPONENTS = frozenset({
    "drawer", "sheet", "sidebar", "panel", "slideover",
})

_FOCUS_SAFE_COMPONENTS = frozenset({
    "dialog", "modal", "alertdialog", "alert-dialog",
})

_PROFILE_RISK_TEMPLATES: dict[str, tuple[str, str]] = {
    "dev": (
        "Contract drift during migration.",
        "Deriva de contrato durante migração.",
    ),
    "qa": (
        "Regression in focus management or state transitions.",
        "Regressão em gestão de foco ou transições de estado.",
    ),
    "a11y": (
        "Keyboard trap or AT announcement inconsistency.",
        "Trap de teclado ou inconsistência de anúncio em AT.",
    ),
    "product_designer": (
        "Flow interruption hurting task completion.",
        "Interrupção de fluxo prejudicando conclusão da tarefa.",
    ),
    "maintainer": (
        "Hidden coupling increasing future change cost.",
        "Acoplamento oculto aumentando custo de mudança futura.",
    ),
}


def build_multi_agent_council(
    *,
    query: str,
    tradeoff: TradeoffAnalysis,
    impact: SystemImpactAnalysis,
    english: bool = False,
) -> MultiAgentCouncilAnalysis:
    options = _decision_options(tradeoff)
    recommendation = tradeoff.recommendation or (options[0] if options else "")
    perspectives: list[CouncilPerspectiveOpinion] = []

    for profile_id in COUNCIL_PERSPECTIVES:
        profile = COGNITIVE_PROFILES.get(profile_id)
        if profile is None:
            continue
        preferred, justification = _perspective_preference(
            profile_id=profile_id,
            options=options,
            recommendation=recommendation,
            impact=impact,
            english=english,
        )
        label = profile.title if english else profile.name
        perspectives.append(CouncilPerspectiveOpinion(
            perspective=profile_id,
            perspective_label=label,
            recommendation=preferred,
            justification=justification,
            risks=_perspective_risks(
                profile_id=profile_id,
                tradeoff=tradeoff,
                english=english,
            ),
            confidence=_perspective_confidence(
                profile_id=profile_id,
                preferred=preferred,
                recommendation=recommendation,
            ),
        ))

    synthesis = _build_synthesis(
        perspectives=perspectives,
        tradeoff=tradeoff,
        english=english,
    )
    return MultiAgentCouncilAnalysis(
        perspectives=perspectives,
        synthesis=synthesis,
    )


def council_to_perspective_divergence(
    council: MultiAgentCouncilAnalysis,
) -> PerspectiveDivergenceAnalysis:
    return PerspectiveDivergenceAnalysis(
        opinions=[
            PerspectiveOpinion(
                perspective=opinion.perspective,
                perspective_label=opinion.perspective_label,
                preferred_option=opinion.recommendation,
                rationale=opinion.justification,
            )
            for opinion in council.perspectives
        ],
        synthesis=council.synthesis.executive_summary,
        consensus=council.synthesis.consensus,
    )


def build_multi_agent_council_contract(
    *,
    council: MultiAgentCouncilAnalysis,
    tradeoff: TradeoffAnalysis,
    impact: SystemImpactAnalysis,
    english: bool,
) -> dict[str, object]:
    if english:
        sections = [
            "Council Perspectives",
            "Synthesis",
            "Consensus Classification",
            "Executive Summary",
            "Points of Agreement",
            "Points of Disagreement",
            "Final Recommendation",
            "Confidence",
        ]
        rules = [
            "Run parallel analysis for Developer, QA, Accessibility, "
            "Product Designer and Maintainer — do not use only the active profile.",
            "Each perspective must state recommendation, justification, risks "
            "and confidence.",
            "Classify consensus as Consensus, Partial Consensus or Conflict.",
            "Show consensus_percent from synthesis when perspectives diverge.",
            "Name the divergence reason when options split (e.g. flow continuity "
            "vs focus control).",
            "Ground each perspective in retrieved evidence; do not invent sources.",
        ]
    else:
        sections = [
            "Perspectivas do Conselho",
            "Síntese",
            "Classificação de Consenso",
            "Resumo Executivo",
            "Pontos de Concordância",
            "Pontos de Divergência",
            "Recomendação Final",
            "Confiança",
        ]
        rules = [
            "Execute análise paralela em Developer, QA, Accessibility, "
            "Product Designer e Maintainer — não use apenas a perspectiva ativa.",
            "Cada perspectiva deve apresentar recomendação, justificativa, "
            "riscos e confiança.",
            "Classifique o consenso como Consenso, Consenso Parcial ou Conflito.",
            "Mostre consensus_percent da síntese quando houver divergência.",
            "Nomeie o motivo da divergência quando opções se dividirem "
            "(ex.: continuidade de fluxo vs controle de foco).",
            "Fundamente cada perspectiva em evidência recuperada; "
            "não invente fontes.",
        ]

    return {
        "mode": "multi_agent_council",
        "required_sections": sections,
        "rules": rules,
        "council": council.model_dump(mode="json"),
        "tradeoff_analysis": tradeoff.model_dump(mode="json"),
        "system_impact": impact.model_dump(mode="json"),
    }


def _decision_options(tradeoff: TradeoffAnalysis) -> list[str]:
    options: list[str] = []
    if tradeoff.recommendation:
        options.append(tradeoff.recommendation)
    for alt in tradeoff.alternatives:
        if alt not in options:
            options.append(alt)
    return options[:4]


def _perspective_preference(
    *,
    profile_id: str,
    options: list[str],
    recommendation: str,
    impact: SystemImpactAnalysis,
    english: bool,
) -> tuple[str, str]:
    if len(options) < 2:
        preferred = recommendation or (options[0] if options else "current approach")
        return preferred, _default_justification(profile_id, preferred, english)

    opt_a, opt_b = options[0], options[1]
    norm_a, norm_b = _normalize(opt_a), _normalize(opt_b)

    if profile_id == "product_designer":
        for opt, norm in ((opt_a, norm_a), (opt_b, norm_b)):
            if any(comp in norm for comp in _FLOW_CONTINUITY_COMPONENTS):
                rationale = (
                    "Prefers flow continuity and reduced interruption."
                    if english
                    else "Prefere continuidade de fluxo e menor interrupção."
                )
                return opt, rationale
        return opt_b, (
            "Prioritizes task clarity and user flow over modal interruption."
            if english
            else "Prioriza clareza da tarefa e fluxo do usuário sobre interrupção modal."
        )

    if profile_id == "dev":
        for opt, norm in ((opt_a, norm_a), (opt_b, norm_b)):
            if any(comp in norm for comp in _FOCUS_SAFE_COMPONENTS):
                rationale = (
                    "Prefers simpler implementation and contract stability."
                    if english
                    else "Prefere implementação mais simples e estabilidade de contrato."
                )
                return opt, rationale
        return opt_a, (
            "Prioritizes modularity and migration cost."
            if english
            else "Prioriza modularidade e custo de migração."
        )

    if profile_id == "qa":
        for opt, norm in ((opt_a, norm_a), (opt_b, norm_b)):
            if any(comp in norm for comp in _FOCUS_SAFE_COMPONENTS):
                rationale = (
                    "Prefers predictable focus management and testable states."
                    if english
                    else "Prefere gestão previsível de foco e estados testáveis."
                )
                return opt, rationale
        return opt_b, (
            "Prioritizes regression prevention and validation coverage."
            if english
            else "Prioriza prevenção de regressão e cobertura de validação."
        )

    if profile_id == "a11y":
        for opt, norm in ((opt_a, norm_a), (opt_b, norm_b)):
            if any(comp in norm for comp in _FOCUS_SAFE_COMPONENTS):
                rationale = (
                    "Prefers controlled focus trap and keyboard predictability."
                    if english
                    else "Prefere trap de foco controlado e previsibilidade de teclado."
                )
                return opt, rationale
        return opt_a, (
            "Prioritizes WCAG compliance and assistive technology support."
            if english
            else "Prioriza conformidade WCAG e suporte a tecnologias assistivas."
        )

    if profile_id == "maintainer":
        for opt, norm in ((opt_a, norm_a), (opt_b, norm_b)):
            if any(comp in norm for comp in _FOCUS_SAFE_COMPONENTS):
                rationale = (
                    "Prefers lower coupling and a smaller change surface."
                    if english
                    else "Prefere menor acoplamento e superfície de mudança reduzida."
                )
                return opt, rationale
        return opt_b, (
            "Prioritizes reuse and long-term maintenance cost."
            if english
            else "Prioriza reuso e custo de manutenção de longo prazo."
        )

    return recommendation or opt_a, _default_justification(profile_id, opt_a, english)


def _default_justification(profile_id: str, option: str, english: bool) -> str:
    profile = COGNITIVE_PROFILES.get(profile_id)
    if profile is None:
        return f"Supports {option}." if english else f"Suporta {option}."
    criteria = profile.decision_criteria[0] if profile.decision_criteria else "evidence"
    if english:
        return f"Supports {option} based on {criteria}."
    return f"Suporta {option} com base em {criteria}."


def _perspective_risks(
    *,
    profile_id: str,
    tradeoff: TradeoffAnalysis,
    english: bool,
) -> list[str]:
    template = _PROFILE_RISK_TEMPLATES.get(profile_id)
    risks: list[str] = []
    if template:
        risks.append(template[0] if english else template[1])
    profile = COGNITIVE_PROFILES.get(profile_id)
    if profile and profile.fears:
        fear = profile.fears[0]
        risks.append(fear)
    risks.extend(tradeoff.risks[:1])
    return _dedupe(risks, 3)


def _perspective_confidence(
    *,
    profile_id: str,
    preferred: str,
    recommendation: str,
) -> str:
    profile = COGNITIVE_PROFILES.get(profile_id)
    aligned = (
        _normalize(preferred) == _normalize(recommendation)
        or _normalize(recommendation) in _normalize(preferred)
        or _normalize(preferred) in _normalize(recommendation)
    )
    if profile and profile.risk_sensitivity >= 0.8:
        return "medium-high" if aligned else "medium"
    if aligned:
        return "high"
    return "medium"


def _build_synthesis(
    *,
    perspectives: list[CouncilPerspectiveOpinion],
    tradeoff: TradeoffAnalysis,
    english: bool,
) -> CouncilSynthesis:
    if not perspectives:
        return CouncilSynthesis(
            final_recommendation=tradeoff.recommendation or "",
        )

    votes = Counter(_normalize(op.recommendation) for op in perspectives)
    majority_option, majority_count = votes.most_common(1)[0]
    consensus_percent = round(majority_count / len(perspectives) * 100)
    unique_votes = len(votes)
    consensus = _consensus_level(unique_votes, majority_count, len(perspectives))

    majority_label = next(
        (
            op.recommendation
            for op in perspectives
            if _normalize(op.recommendation) == majority_option
        ),
        tradeoff.recommendation or "",
    )

    agree = [
        op for op in perspectives
        if _normalize(op.recommendation) == majority_option
    ]
    disagree = [op for op in perspectives if op not in agree]

    points_of_agreement = _points_of_agreement(agree, english)
    points_of_disagreement = _points_of_disagreement(disagree, english)
    divergence_reason = _divergence_reason(agree, disagree, english)
    executive_summary = _executive_summary(
        consensus=consensus,
        consensus_percent=consensus_percent,
        majority_label=majority_label,
        divergence_reason=divergence_reason,
        english=english,
    )
    final_recommendation = _final_recommendation(
        consensus=consensus,
        majority_label=majority_label,
        tradeoff=tradeoff,
        disagree=disagree,
        english=english,
    )

    return CouncilSynthesis(
        consensus=consensus,
        consensus_percent=consensus_percent,
        executive_summary=executive_summary,
        points_of_agreement=points_of_agreement,
        points_of_disagreement=points_of_disagreement,
        divergence_reason=divergence_reason,
        final_recommendation=final_recommendation,
    )


def _consensus_level(
    unique_votes: int,
    majority_count: int,
    total: int,
) -> ConsensusLevel:
    if unique_votes == 1:
        return "consensus"
    if majority_count == total:
        return "consensus"
    if majority_count >= total // 2 + 1:
        return "partial_consensus"
    if unique_votes >= 3:
        return "conflict"
    return "partial_consensus"


def _points_of_agreement(
    agree: list[CouncilPerspectiveOpinion],
    english: bool,
) -> list[str]:
    if not agree:
        return []
    labels = ", ".join(op.perspective_label for op in agree)
    option = agree[0].recommendation
    if english:
        return [f"{labels} align on {option}."]
    return [f"{labels} convergem em {option}."]


def _points_of_disagreement(
    disagree: list[CouncilPerspectiveOpinion],
    english: bool,
) -> list[str]:
    return [
        (
            f"{op.perspective_label} favors {op.recommendation}: {op.justification}"
            if english
            else f"{op.perspective_label} favorece {op.recommendation}: {op.justification}"
        )
        for op in disagree
    ]


def _divergence_reason(
    agree: list[CouncilPerspectiveOpinion],
    disagree: list[CouncilPerspectiveOpinion],
    english: bool,
) -> str:
    if not disagree:
        return ""

    agree_norms = {_normalize(op.recommendation) for op in agree}
    disagree_norms = {_normalize(op.recommendation) for op in disagree}

    agree_flow = any(
        any(comp in norm for comp in _FLOW_CONTINUITY_COMPONENTS)
        for norm in disagree_norms
    ) or any(
        any(comp in norm for comp in _FLOW_CONTINUITY_COMPONENTS)
        for norm in agree_norms
    )
    agree_focus = any(
        any(comp in norm for comp in _FOCUS_SAFE_COMPONENTS)
        for norm in agree_norms
    ) or any(
        any(comp in norm for comp in _FOCUS_SAFE_COMPONENTS)
        for norm in disagree_norms
    )

    if agree_flow and agree_focus:
        return (
            "Flow continuity versus focus control."
            if english
            else "Continuidade de fluxo versus controle de foco."
        )

    if english:
        disagree_labels = ", ".join(op.perspective_label for op in disagree)
        return (
            f"Tension between {disagree_labels} and the majority position."
        )
    disagree_labels = ", ".join(op.perspective_label for op in disagree)
    return f"Tensão entre {disagree_labels} e a posição majoritária."


def _executive_summary(
    *,
    consensus: ConsensusLevel,
    consensus_percent: int,
    majority_label: str,
    divergence_reason: str,
    english: bool,
) -> str:
    label = {
        "consensus": ("Consensus" if english else "Consenso"),
        "partial_consensus": (
            "Partial Consensus" if english else "Consenso Parcial"
        ),
        "conflict": ("Conflict" if english else "Conflito"),
    }[consensus]

    if consensus == "consensus":
        if english:
            return f"{label} ({consensus_percent}%) on {majority_label}."
        return f"{label} ({consensus_percent}%) em {majority_label}."

    if divergence_reason:
        if english:
            return (
                f"{label} ({consensus_percent}%) on {majority_label}. "
                f"Divergence reason: {divergence_reason}."
            )
        return (
            f"{label} ({consensus_percent}%) em {majority_label}. "
            f"Motivo da divergência: {divergence_reason}."
        )

    if english:
        return f"{label} ({consensus_percent}%) on {majority_label}."
    return f"{label} ({consensus_percent}%) em {majority_label}."


def _final_recommendation(
    *,
    consensus: ConsensusLevel,
    majority_label: str,
    tradeoff: TradeoffAnalysis,
    disagree: list[CouncilPerspectiveOpinion],
    english: bool,
) -> str:
    if consensus == "consensus":
        return majority_label

    if consensus == "conflict":
        base = tradeoff.recommendation or majority_label
        if english:
            return (
                f"Adopt {base} with explicit validation for dissenting lenses "
                f"({', '.join(op.perspective_label for op in disagree)})."
            )
        return (
            f"Adotar {base} com validação explícita para lentes dissidentes "
            f"({', '.join(op.perspective_label for op in disagree)})."
        )

    if english:
        return (
            f"Recommend {majority_label} as the default; document the "
            f"{disagree[0].perspective_label} exception when flow continuity "
            "dominates."
            if disagree
            else f"Recommend {majority_label}."
        )
    return (
        f"Recomendar {majority_label} como padrão; documentar a exceção "
        f"de {disagree[0].perspective_label} quando continuidade de fluxo "
        "dominar."
        if disagree
        else f"Recomendar {majority_label}."
    )
