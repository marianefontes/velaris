"""Decision perception — institutional reasoning surfaced after recommendations.

Prioritizes design-system judgment over artificial metrics: direct answer,
justification, catalog gaps, relevant alternatives, acceptance conditions and
residual risks. Respects the active perspective lens when one is selected.
"""

from __future__ import annotations

import re
import unicodedata
from typing import TYPE_CHECKING

from component_metadata import ComponentMetadata, component_registry, localized_text
from prompts.cognitive_profiles import COGNITIVE_PROFILES
from prompts.perspective_ids import normalize_profile_id

from .decision_intelligence import _dedupe, _normalize, build_tradeoff_analysis
from .evidence import _normalize_tokens
from .models import (
    CatalogGapNote,
    ComponentSelection,
    DecisionReasoningBrief,
    EvidenceGapExplanation,
    EvidenceItem,
    MissingEvidenceItem,
    PerceptionIntelligence,
    RelevantAlternative,
    TradeoffAnalysis,
    WorkflowName,
)
from .unsupported_entity_detection import match_unsupported_entity
from .understanding import normalize_query

if TYPE_CHECKING:
    from .executor import PlanExecution
    from .models import QueryUnderstanding, SystemImpactAnalysis

PERCEPTION_WORKFLOWS: frozenset[WorkflowName] = frozenset({
    "component_decision",
    "compare_options",
    "decision_analysis",
})

_OVERLAY_SECTIONS = frozenset({"overlay", "navigation"})
_SETTINGS_MARKERS = (
    "configur", "settings", "preferenc", "ajuste", "opcao", "opção",
)

_REASONING_MARKERS = (
    "## recomendacao",
    "## recomendação",
    "## recommendation",
)

_ALTERNATIVE_LIMIT = 4


def should_build_perception(
    workflow: WorkflowName,
    *,
    component_selection: ComponentSelection | None,
    tradeoff: TradeoffAnalysis | None,
) -> bool:
    if workflow not in PERCEPTION_WORKFLOWS:
        return False
    if component_selection and component_selection.recommended:
        return True
    if tradeoff and tradeoff.recommendation.strip():
        return True
    return False


def is_specific_perspective(profile: str) -> bool:
    return normalize_profile_id(profile) != "general"


def build_perception_intelligence(
    *,
    query: str,
    workflow: WorkflowName,
    understanding: QueryUnderstanding,
    component_selection: ComponentSelection | None,
    execution: PlanExecution | None,
    tradeoff: TradeoffAnalysis | None,
    impact: SystemImpactAnalysis | None,
    profile: str,
    english: bool,
) -> PerceptionIntelligence | None:
    if not should_build_perception(
        workflow,
        component_selection=component_selection,
        tradeoff=tradeoff,
    ):
        return None

    resolved_tradeoff = tradeoff or build_tradeoff_analysis(
        query=query,
        execution=execution,
        component_selection=component_selection,
    )
    recommendation = _resolve_recommendation(component_selection, resolved_tradeoff)
    if not recommendation:
        return None

    recommended_component = (
        component_selection.recommended.component
        if component_selection and component_selection.recommended
        else None
    )
    catalog_gaps = _collect_catalog_gaps(query, understanding, english=english)
    if recommended_component is None and catalog_gaps:
        recommended_component = _component_from_gap(catalog_gaps[0])

    reasoning = build_decision_reasoning_brief(
        query=query,
        recommendation=recommendation,
        component=recommended_component,
        tradeoff=resolved_tradeoff,
        component_selection=component_selection,
        execution=execution,
        catalog_gaps=catalog_gaps,
        profile=profile,
        english=english,
    )

    return PerceptionIntelligence(
        recommendation=recommendation,
        reasoning=reasoning,
        active_perspective=profile if is_specific_perspective(profile) else None,
    )


def build_decision_reasoning_brief(
    *,
    query: str,
    recommendation: str,
    component: ComponentMetadata | None,
    tradeoff: TradeoffAnalysis,
    component_selection: ComponentSelection | None,
    execution: PlanExecution | None,
    catalog_gaps: list[CatalogGapNote],
    profile: str,
    english: bool,
) -> DecisionReasoningBrief:
    norm_query = _normalize(query)
    settings_context = _settings_context(query)
    specific_lens = is_specific_perspective(profile)

    direct_answer = _build_direct_answer(
        recommendation=recommendation,
        component=component,
        catalog_gaps=catalog_gaps,
        settings_context=settings_context,
        tradeoff=tradeoff,
        english=english,
    )
    justification = _build_justification(
        query=query,
        component=component,
        tradeoff=tradeoff,
        catalog_gaps=catalog_gaps,
        settings_context=settings_context,
        profile=profile,
        specific_lens=specific_lens,
        english=english,
    )
    institutional = _build_institutional_evidence(component, english)
    limitations = _build_limitations(
        component=component,
        component_selection=component_selection,
        catalog_gaps=catalog_gaps,
        settings_context=settings_context,
        profile=profile,
        specific_lens=specific_lens,
        english=english,
    )
    alternatives = build_relevant_alternatives(
        recommended=component,
        tradeoff=tradeoff,
        evidence=execution.evidence if execution else [],
        catalog_gaps=catalog_gaps,
        english=english,
        query=query,
    )
    use_when, avoid_when = _build_usage_guidance(
        component=component,
        catalog_gaps=catalog_gaps,
        settings_context=settings_context,
        english=english,
    )
    acceptance = _acceptance_conditions(
        component,
        tradeoff,
        profile,
        english,
        settings_context=settings_context,
    )
    risks = _residual_risks(tradeoff, component, catalog_gaps, settings_context, english)
    conclusion = _build_conclusion(
        recommendation=recommendation,
        component=component,
        catalog_gaps=catalog_gaps,
        settings_context=settings_context,
        english=english,
    )

    return DecisionReasoningBrief(
        direct_answer=direct_answer,
        justification_paragraphs=justification,
        institutional_evidence=institutional,
        limitations=limitations,
        alternatives=alternatives,
        use_when=use_when,
        avoid_when=avoid_when,
        acceptance_conditions=acceptance,
        residual_risks=risks,
        conclusion=conclusion,
        catalog_gaps=catalog_gaps,
    )


def build_relevant_alternatives(
    *,
    recommended: ComponentMetadata | None,
    tradeoff: TradeoffAnalysis,
    evidence: list[EvidenceItem],
    catalog_gaps: list[CatalogGapNote],
    english: bool,
    query: str = "",
) -> list[RelevantAlternative]:
    if recommended is None:
        return _alternatives_from_tradeoff(tradeoff, english)

    registry = component_registry()
    seen: set[str] = {recommended.component_id}
    entries: list[RelevantAlternative] = []
    ranked_ids = _rank_alternative_ids(recommended, evidence, tradeoff)
    institutional = bool(catalog_gaps) or is_comparison_query(query)

    for component_id in ranked_ids:
        if component_id in seen:
            continue
        candidate = registry.get(component_id)
        if candidate is None or candidate.status in {"deprecated", "legacy", "draft"}:
            continue
        if institutional and not _is_decision_relevant_alternative(
            recommended,
            candidate,
            tradeoff=tradeoff,
        ):
            continue
        seen.add(component_id)
        entries.append(_alternative_entry(recommended, candidate, english))
        if len(entries) >= _ALTERNATIVE_LIMIT:
            break

    for gap in catalog_gaps:
        if gap.closest_alternative_id and gap.closest_alternative_id not in seen:
            candidate = registry.get(gap.closest_alternative_id)
            if candidate is not None:
                entries.insert(
                    0,
                    _alternative_entry(
                        recommended or candidate,
                        candidate,
                        english,
                        gap=gap,
                    ),
                )
                seen.add(candidate.component_id)

    if institutional and _settings_context(query) and catalog_gaps:
        entries.append(RelevantAlternative(
            component_id="dedicated-page",
            name="Página dedicada" if not english else "Dedicated page",
            why_alternative=(
                "When configuration is extensive and no canonical Drawer exists."
                if english
                else "Quando a configuração é extensa e não existe Drawer canônico."
            ),
            key_differences=(
                "Preserves full context without overlay constraints."
                if english
                else "Preserva contexto completo sem restrições de overlay."
            ),
            when_to_choose=(
                "Multi-step settings, comparison across sections, or frequent back-and-forth."
                if english
                else "Configurações multi-etapa, comparação entre seções ou ida-e-volta frequente."
            ),
        ))

    return entries[:_ALTERNATIVE_LIMIT]


def build_evidence_gap_explanation(
    *,
    query: str,
    understanding: QueryUnderstanding,
    execution: PlanExecution | None,
    workflow: WorkflowName,
    english: bool,
) -> EvidenceGapExplanation:
    missing: list[MissingEvidenceItem] = []
    needed: list[str] = []

    has_component = bool(understanding.entities.components)
    has_context = bool(understanding.entities.contexts)

    if execution is None or not execution.evidence:
        missing.append(MissingEvidenceItem(
            code="no_retrieval",
            label=(
                "Nenhuma evidência recuperada do corpus"
                if not english
                else "No evidence retrieved from corpus"
            ),
        ))
    elif execution.evidence_tier in {"weak", "insufficient"}:
        missing.append(MissingEvidenceItem(
            code="weak_similarity",
            label=(
                "Evidência documental insuficiente para esta pergunta"
                if not english
                else "Insufficient documented evidence for this question"
            ),
        ))

    if workflow in {"component_decision", "compare_options", "design_audit"}:
        if not has_component:
            missing.append(MissingEvidenceItem(
                code="no_named_component",
                label=(
                    "Componente não identificado na pergunta"
                    if not english
                    else "Component not identified in the question"
                ),
            ))
        if not has_context:
            missing.append(MissingEvidenceItem(
                code="no_usage_context",
                label=(
                    "Contexto de uso não especificado"
                    if not english
                    else "Usage context not specified"
                ),
            ))

    if workflow == "compare_options" and len(understanding.entities.components) < 2:
        missing.append(MissingEvidenceItem(
            code="incomplete_comparison",
            label=(
                "Comparação requer duas opções nomeadas"
                if not english
                else "Comparison requires two named options"
            ),
        ))

    if not has_component and workflow not in {"token_lookup"}:
        needed.append("componente" if not english else "component")
    if not has_context:
        needed.append("contexto de uso" if not english else "usage context")
    if workflow in {"design_decision", "decision_analysis"}:
        needed.append("fluxo ou cenário" if not english else "flow or scenario")
    if workflow == "compare_options":
        needed.append("segunda alternativa" if not english else "second alternative")
    needed.append("responsável ou squad" if not english else "owner or squad")
    needed = list(dict.fromkeys(needed))[:5]

    reason = (
        "O corpus oficial não cobre esta pergunta com evidência suficiente "
        "para uma recomendação fundamentada."
        if not english
        else "The official corpus does not cover this question with enough "
        "evidence for a grounded recommendation."
    )

    return EvidenceGapExplanation(
        reason=reason,
        missing_items=missing,
        needed_inputs=needed,
        workflow=workflow,
        query=query,
    )


def format_evidence_gap_response(
    explanation: EvidenceGapExplanation,
    *,
    english: bool,
) -> str:
    lines: list[str] = []
    if english:
        lines.extend([
            "## Insufficient Evidence",
            "",
            "I could not find enough official evidence to answer without speculation.",
            "",
            "**Why:**",
            explanation.reason,
            "",
            "**Gaps identified:**",
        ])
    else:
        lines.extend([
            "## Evidência Insuficiente",
            "",
            "Não encontrei evidência suficiente para responder sem especulação.",
            "",
            "**Motivo:**",
            explanation.reason,
            "",
            "**Lacunas identificadas:**",
        ])

    for item in explanation.missing_items:
        lines.append(f"- ✗ {item.label}")

    if english:
        lines.extend(["", "**To answer with confidence I need:**"])
    else:
        lines.extend(["", "**Para responder com confiança preciso de:**"])
    for needed in explanation.needed_inputs:
        lines.append(f"- {needed}")

    if english:
        lines.append(
            "\nTry naming a specific Velaris component, pattern or documented "
            "decision, and describe the usage context."
        )
    else:
        lines.append(
            "\nTente citar um componente, padrão ou decisão documentada do "
            "Velaris e descrever o contexto de uso."
        )
    return "\n".join(lines)


def format_decision_reasoning_brief(
    perception: PerceptionIntelligence,
    *,
    english: bool,
) -> str:
    brief = perception.reasoning
    lines: list[str] = []

    header = "## Recommendation" if english else "## Recomendação"
    lines.append(header)
    lines.append("")
    lines.append(brief.direct_answer)

    if brief.justification_paragraphs:
        lines.extend(["", "## Justification" if english else "## Justificativa", ""])
        lines.extend(brief.justification_paragraphs)

    if brief.institutional_evidence:
        title = (
            "## What the Velaris catalog indicates"
            if english
            else "## O que o catálogo do Velaris indica"
        )
        lines.extend(["", title, ""])
        for item in brief.institutional_evidence:
            lines.append(f"- {item}")

    if brief.limitations:
        lines.extend(["", "## Limitations" if english else "## Limitações", ""])
        for item in brief.limitations:
            lines.append(f"- {item}")

    if brief.alternatives:
        lines.extend([
            "",
            "## Relevant alternatives" if english else "## Alternativas relevantes",
            "",
        ])
        for alt in brief.alternatives:
            lines.append(f"### {alt.name}")
            why = "Why it is an alternative" if english else "Por que é alternativa"
            diff = "How it differs" if english else "Em que difere"
            when = "When to choose" if english else "Quando escolher"
            lines.extend([
                f"- **{why}:** {alt.why_alternative}",
                f"- **{diff}:** {alt.key_differences}",
                f"- **{when}:** {alt.when_to_choose}",
                "",
            ])

    if brief.use_when or brief.avoid_when:
        title = (
            "## Recommended approach with the current catalog"
            if english
            else "## Solução recomendada com o catálogo atual"
        )
        lines.extend(["", title, ""])
        if brief.use_when:
            sub = "### Use when" if english else "### Use quando"
            lines.extend([sub, ""])
            lines.extend(f"- {item}" for item in brief.use_when)
        if brief.avoid_when:
            sub = "### Avoid when" if english else "### Evite quando"
            lines.extend(["", sub, ""])
            lines.extend(f"- {item}" for item in brief.avoid_when)

    if brief.acceptance_conditions:
        title = "Acceptance conditions" if english else "Condições de aceite"
        lines.extend(["", f"## {title}", ""])
        lines.extend(f"- {item}" for item in brief.acceptance_conditions)

    if brief.residual_risks:
        title = "Residual risks" if english else "Riscos residuais"
        lines.extend(["", f"## {title}", ""])
        lines.extend(f"- {item}" for item in brief.residual_risks)

    if brief.conclusion:
        lines.extend(["", "## Conclusion" if english else "## Conclusão", ""])
        lines.append(brief.conclusion)

    return "\n".join(lines).strip()


def reasoning_already_present(response_text: str) -> bool:
    normalized = _normalize(response_text)
    return any(marker in normalized for marker in _REASONING_MARKERS)


def is_comparison_query(query: str) -> bool:
    normalized = normalize_query(query)
    return bool(
        re.search(
            r"\b(?:vs\.?|versus|ou|or|em vez de|instead of)\b",
            normalized,
            re.I,
        )
    )


def should_deliver_institutional_reasoning_only(
    *,
    workflow: WorkflowName,
    understanding: QueryUnderstanding,
    query: str,
    perception: PerceptionIntelligence | None,
) -> bool:
    """Decision comparisons and catalog-gap dilemmas ship as reasoning-only."""
    if perception is None:
        return False
    if workflow in {"compare_options", "decision_analysis"}:
        return True
    if understanding.user_intent == "component_comparison":
        return True
    if understanding.decision_analysis_mode:
        return True
    if perception.reasoning.catalog_gaps:
        return True
    if is_comparison_query(query):
        return True
    return False


def _structured_comparison_delivered(response_text: str) -> bool:
    normalized = response_text.lstrip().lower()
    return normalized.startswith("## comparação") or normalized.startswith("## comparison")


def resolve_perception_response(
    response_text: str,
    perception: PerceptionIntelligence | None,
    *,
    workflow: WorkflowName,
    understanding: QueryUnderstanding,
    query: str,
    english: bool,
) -> str:
    if perception is None:
        return response_text
    if _structured_comparison_delivered(response_text):
        return response_text
    if should_deliver_institutional_reasoning_only(
        workflow=workflow,
        understanding=understanding,
        query=query,
        perception=perception,
    ):
        return format_decision_reasoning_brief(perception, english=english)
    if reasoning_already_present(response_text):
        return response_text
    return response_text


def append_perception_if_needed(
    response_text: str,
    perception: PerceptionIntelligence | None,
    *,
    english: bool,
    workflow: WorkflowName = "component_decision",
    understanding: QueryUnderstanding | None = None,
    query: str = "",
) -> str:
    if perception is None or understanding is None:
        return response_text
    return resolve_perception_response(
        response_text,
        perception,
        workflow=workflow,
        understanding=understanding,
        query=query or "",
        english=english,
    )


def _resolve_recommendation(
    selection: ComponentSelection | None,
    tradeoff: TradeoffAnalysis,
) -> str:
    if selection and selection.recommended:
        return selection.recommended.component.name
    return tradeoff.recommendation.strip()


def _collect_catalog_gaps(
    query: str,
    understanding: QueryUnderstanding,
    *,
    english: bool,
) -> list[CatalogGapNote]:
    gaps: list[CatalogGapNote] = []
    seen: set[str] = set()
    normalized_query = normalize_query(query)

    fragments: list[str] = list(understanding.entities.components)
    pair = re.search(
        r"(.+?)\s+(?:vs\.?|versus|ou|or|em vez de|instead of)\s+(.+)",
        normalized_query,
        re.I,
    )
    if pair:
        fragments.extend([pair.group(1).strip(), pair.group(2).strip()])

    search_targets = [normalize_query(fragment) for fragment in fragments]
    search_targets.append(normalized_query)

    for fragment_norm in search_targets:
        match = match_unsupported_entity(fragment_norm)
        if match is None:
            continue
        entry, _alias = match
        if entry.entity_key in seen:
            continue
        seen.add(entry.entity_key)
        closest_name, closest_id = _closest_catalog_name(entry.closest_internal_alternatives)
        gaps.append(CatalogGapNote(
            entity_label=entry.label,
            closest_alternative_name=closest_name,
            closest_alternative_id=closest_id,
            explanation=_gap_explanation(entry, closest_name, english=english),
        ))

    return gaps


def _closest_catalog_name(
    component_ids: tuple[str, ...],
) -> tuple[str | None, str | None]:
    registry = component_registry()
    for component_id in component_ids:
        component = registry.get(component_id)
        if component is not None:
            return component.name, component.component_id
    return None, None


def _component_from_gap(gap: CatalogGapNote) -> ComponentMetadata | None:
    if not gap.closest_alternative_id:
        return None
    return component_registry().get(gap.closest_alternative_id)


def _gap_explanation(
    entry,
    closest_name: str | None,
    *,
    english: bool,
) -> str:
    if english:
        base = f"Velaris does not have a canonical {entry.label}."
        if closest_name:
            return f"{base} The closest documented alternative is {closest_name}."
        return base
    base = f"O Velaris não possui um {entry.label} canônico."
    if closest_name:
        return f"{base} O componente mais próximo documentado é {closest_name}."
    return base


def _build_direct_answer(
    *,
    recommendation: str,
    component: ComponentMetadata | None,
    catalog_gaps: list[CatalogGapNote],
    settings_context: bool,
    tradeoff: TradeoffAnalysis,
    english: bool,
) -> str:
    parts: list[str] = []

    for gap in catalog_gaps:
        parts.append(gap.explanation)

    if catalog_gaps and component is not None:
        if settings_context:
            parts.append(
                (
                    f"For settings flows, the closest available alternative in the "
                    f"catalog is **{component.name}**."
                )
                if english
                else (
                    f"Para fluxos de configuração, a alternativa disponível mais "
                    f"próxima no catálogo é **{component.name}**."
                )
            )
            parts.append(
                (
                    f"I would use {component.name} only when settings are simple, "
                    "focused and require immediate user attention."
                )
                if english
                else (
                    f"Dito isso, eu utilizaria {component.name} apenas quando as "
                    "configurações forem simples, pontuais e exigirem foco imediato "
                    "do usuário."
                )
            )
            if catalog_gaps:
                parts.append(
                    (
                        "If the flow involves multiple options, comparison or frequent "
                        "adjustments, a Drawer would be conceptually more appropriate "
                        "— but it is not available in the current catalog."
                    )
                    if english
                    else (
                        "Se o fluxo envolver múltiplas opções, comparação de "
                        "informações ou ajustes frequentes, um Drawer seria "
                        "conceitualmente mais adequado — mas não está disponível no "
                        "catálogo atual."
                    )
                )
        else:
            parts.append(
                (
                    f"With the current catalog, I recommend **{component.name}** "
                    f"for this context."
                )
                if english
                else (
                    f"Com o catálogo atual, recomendo **{component.name}** "
                    f"para este contexto."
                )
            )
    elif component is not None:
        parts.append(
            (
                f"I recommend **{component.name}** for this decision."
            )
            if english
            else f"Recomendo **{component.name}** para esta decisão."
        )
    elif recommendation:
        parts.append(
            f"I recommend **{recommendation}** for this decision."
            if english
            else f"Recomendo **{recommendation}** para esta decisão."
        )

    if not parts and tradeoff.recommendation:
        parts.append(tradeoff.recommendation)

    return "\n\n".join(parts)


def _build_justification(
    *,
    query: str,
    component: ComponentMetadata | None,
    tradeoff: TradeoffAnalysis,
    catalog_gaps: list[CatalogGapNote],
    settings_context: bool,
    profile: str,
    specific_lens: bool,
    english: bool,
) -> list[str]:
    paragraphs: list[str] = []

    if settings_context and catalog_gaps:
        paragraphs.append(
            (
                "Settings flows are often exploratory. Users frequently need to "
                "consult the underlying screen, compare states, make several "
                "adjustments and go back without losing context."
            )
            if english
            else (
                "Configurações costumam representar uma atividade exploratória. "
                "O usuário frequentemente precisa consultar informações da tela "
                "principal, comparar estados, realizar múltiplos ajustes e voltar "
                "atrás sem perder contexto."
            )
        )
        if component and component.section in _OVERLAY_SECTIONS:
            paragraphs.append(
                (
                    f"{component.name} was designed for quick decisions, confirmations "
                    "and controlled interruptions — not for advanced configuration "
                    "exploration."
                )
                if english
                else (
                    f"{component.name} foi projetado para decisões rápidas, "
                    "confirmações e interrupções controladas — não para exploração "
                    "avançada de configuração."
                )
            )

    if specific_lens:
        profile_id = _effective_reasoning_profile(profile, settings_context=settings_context)
        profile_data = COGNITIVE_PROFILES.get(profile_id)
        if profile_data and profile_data.heuristics:
            paragraphs.append(profile_data.heuristics[0])

    for benefit in tradeoff.benefits[:1]:
        if component and component.when_to_use:
            first_use = localized_text(component.when_to_use[0].text)
            if _normalize(benefit) == _normalize(first_use):
                continue
        paragraphs.append(benefit)

    if component and component.when_to_use and not settings_context:
        paragraphs.append(localized_text(component.when_to_use[0].text))

    if not paragraphs and component:
        paragraphs.append(
            (
                f"Catalog evidence supports {component.name} for the described context."
            )
            if english
            else (
                f"A evidência do catálogo sustenta {component.name} para o contexto "
                "descrito."
            )
        )

    return _dedupe(paragraphs, 4)


def _build_institutional_evidence(
    component: ComponentMetadata | None,
    english: bool,
) -> list[str]:
    if component is None:
        return []
    items: list[str] = []
    for rule in (component.when_to_use or [])[:3]:
        items.append(localized_text(rule.text))
    for rule in (component.when_not_to_use or [])[:2]:
        prefix = "Avoid when" if english else "Evitar quando"
        items.append(f"{prefix}: {localized_text(rule.text)}")
    return _dedupe(items, 5)


def _build_limitations(
    *,
    component: ComponentMetadata | None,
    component_selection: ComponentSelection | None,
    catalog_gaps: list[CatalogGapNote],
    settings_context: bool,
    profile: str,
    specific_lens: bool,
    english: bool,
) -> list[str]:
    items: list[str] = []

    for gap in catalog_gaps:
        if settings_context:
            items.append(
                (
                    f"The absence of a canonical {gap.entity_label} is a known "
                    "catalog limitation for exploratory flows."
                )
                if english
                else (
                    f"A ausência de um {gap.entity_label} canônico é uma limitação "
                    "conhecida do catálogo para fluxos exploratórios."
                )
            )

    if component_selection and component_selection.recommended:
        for field_name in component_selection.recommended.missing_fields[:3]:
            items.append(
                f"Field '{field_name}' is not fully documented in the catalog."
                if english
                else f"O campo '{field_name}' não está totalmente documentado no catálogo."
            )

    if specific_lens:
        profile_id = _effective_reasoning_profile(profile, settings_context=settings_context)
        profile_data = COGNITIVE_PROFILES.get(profile_id)
        if profile_data and profile_data.fears:
            items.append(profile_data.fears[0])

    if component and component.when_not_to_use:
        items.append(localized_text(component.when_not_to_use[0].text))

    return _dedupe(items, 5)


def _build_usage_guidance(
    *,
    component: ComponentMetadata | None,
    catalog_gaps: list[CatalogGapNote],
    settings_context: bool,
    english: bool,
) -> tuple[list[str], list[str]]:
    use_when: list[str] = []
    avoid_when: list[str] = []

    if settings_context and component:
        use_when.extend([
            "there are few settings",
            "the impact is local",
            "the user only needs to confirm or adjust something simple",
        ] if english else [
            "existirem poucas configurações",
            "o impacto for local",
            "o usuário precisar apenas confirmar ou ajustar algo simples",
        ])
        avoid_when.extend([
            "there are many options",
            "the user must consult underlying content",
            "the task requires exploration or comparison",
        ] if english else [
            "houver muitas opções",
            "o usuário precisar consultar o conteúdo subjacente",
            "a tarefa exigir exploração ou comparação",
        ])
        if catalog_gaps:
            avoid_when.append(
                "a canonical Drawer or dedicated page would be the ideal pattern"
                if english
                else "o padrão ideal seria um Drawer canônico ou uma página dedicada"
            )
    elif component:
        for rule in (component.when_to_use or [])[:2]:
            use_when.append(localized_text(rule.text))
        for rule in (component.when_not_to_use or [])[:2]:
            avoid_when.append(localized_text(rule.text))

    return _dedupe(use_when, 4), _dedupe(avoid_when, 4)


def _acceptance_conditions(
    component: ComponentMetadata | None,
    tradeoff: TradeoffAnalysis,
    profile: str,
    english: bool,
    *,
    settings_context: bool = False,
) -> list[str]:
    conditions: list[str] = []
    if component:
        for rule in (component.do or [])[:2]:
            conditions.append(localized_text(rule.text))
        if component.accessibility and component.accessibility.items:
            item = component.accessibility.items[0]
            conditions.append(
                f"{localized_text(item.title)}: {localized_text(item.description)}"
            )
        if component.accessibility and component.accessibility.keyboard:
            conditions.append(localized_text(component.accessibility.keyboard[0].text))

    if is_specific_perspective(profile):
        profile_id = _effective_reasoning_profile(profile, settings_context=settings_context)
        profile_data = COGNITIVE_PROFILES.get(profile_id)
        if profile_data and profile_data.decision_criteria:
            conditions.append(profile_data.decision_criteria[0])

    for benefit in tradeoff.benefits[:1]:
        conditions.append(benefit)

    if not conditions:
        conditions.append(
            "Validate with the owning squad before production rollout."
            if english
            else "Validar com o squad responsável antes do rollout em produção."
        )
    return _dedupe(conditions, 6)


def _residual_risks(
    tradeoff: TradeoffAnalysis,
    component: ComponentMetadata | None,
    catalog_gaps: list[CatalogGapNote],
    settings_context: bool,
    english: bool,
) -> list[str]:
    risks = list(tradeoff.risks)
    if component and component.when_not_to_use:
        for rule in component.when_not_to_use[:2]:
            risks.append(localized_text(rule.text))
    if settings_context and component and component.section in _OVERLAY_SECTIONS:
        risks.extend([
            "gradual content growth until the overlay becomes overly complex",
            "increased cognitive load",
            "loss of context during configuration",
            "accessibility regressions related to focus and keyboard navigation",
        ] if english else [
            "crescimento gradual do conteúdo até o overlay se tornar excessivamente complexo",
            "aumento da carga cognitiva",
            "perda de contexto durante a configuração",
            "regressões de acessibilidade relacionadas a foco e navegação por teclado",
        ])
    if catalog_gaps and not risks:
        risks.append(
            "Adopting a substitute without documenting the catalog gap may hide a systemic pattern need."
            if english
            else "Adotar um substituto sem documentar a lacuna do catálogo pode ocultar uma necessidade sistêmica de padrão."
        )
    return _dedupe(risks, 6)


def _build_conclusion(
    *,
    recommendation: str,
    component: ComponentMetadata | None,
    catalog_gaps: list[CatalogGapNote],
    settings_context: bool,
    english: bool,
) -> str:
    name = component.name if component else recommendation
    if settings_context and catalog_gaps:
        return (
            f"With the current Velaris catalog, I would use {name} for simple settings. "
            f"For extensive or exploratory configuration, the absence of a canonical "
            f"{catalog_gaps[0].entity_label} is a known limitation — evaluate creating "
            "that pattern or moving the flow to a dedicated page."
        ) if english else (
            f"Com o catálogo atual do Velaris, eu utilizaria {name} para configurações simples. "
            f"Para configurações extensas ou exploratórias, a ausência de um "
            f"{catalog_gaps[0].entity_label} canônico representa uma limitação conhecida "
            "do sistema — avalie criar esse padrão ou migrar o fluxo para uma página dedicada."
        )
    if component:
        return (
            f"I recommend {name} for this decision, grounded in catalog evidence and "
            "documented trade-offs."
        ) if english else (
            f"Recomendo {name} para esta decisão, com base na evidência do catálogo "
            "e nos trade-offs documentados."
        )
    return ""


def _rank_alternative_ids(
    recommended: ComponentMetadata,
    evidence: list[EvidenceItem],
    tradeoff: TradeoffAnalysis,
) -> list[str]:
    registry = component_registry()
    scores: dict[str, float] = {}

    for related_id in recommended.related_components or []:
        scores[related_id] = scores.get(related_id, 0.0) + 1.0

    for item in evidence:
        if item.component_id and item.component_id != recommended.component_id:
            scores[item.component_id] = scores.get(item.component_id, 0.0) + item.weighted_score

    for alt_name in tradeoff.alternatives:
        for candidate in registry.values():
            if _normalize(candidate.name) == _normalize(alt_name):
                scores[candidate.component_id] = scores.get(candidate.component_id, 0.0) + 0.8

    for candidate in registry.values():
        if candidate.component_id == recommended.component_id:
            continue
        if candidate.status in {"deprecated", "legacy", "draft"}:
            continue
        score, _ = _similarity_rank(recommended, candidate)
        if score >= 0.55:
            scores[candidate.component_id] = max(
                scores.get(candidate.component_id, 0.0),
                score,
            )

    return [
        component_id
        for component_id, _score in sorted(
            scores.items(),
            key=lambda pair: pair[1],
            reverse=True,
        )
    ]


def _alternative_entry(
    recommended: ComponentMetadata,
    candidate: ComponentMetadata,
    english: bool,
    *,
    gap: CatalogGapNote | None = None,
) -> RelevantAlternative:
    when_rule = candidate.when_to_use[0] if candidate.when_to_use else None
    not_when_rule = candidate.when_not_to_use[0] if candidate.when_not_to_use else None
    if gap:
        why = (
            f"Closest documented alternative because {gap.entity_label} is not canonical."
            if english
            else f"Alternativa documentada mais próxima porque {gap.entity_label} não é canônico."
        )
    else:
        why = (
            f"Related option in the same catalog family as {recommended.name}."
            if english
            else f"Opção relacionada na mesma família de catálogo que {recommended.name}."
        )
    differences = _describe_differences(recommended, candidate, english)
    when_to_choose = (
        localized_text(when_rule.text) if when_rule else (
            "When the documented use case matches this alternative."
            if english
            else "Quando o caso de uso documentado corresponder a esta alternativa."
        )
    )
    if not_when_rule:
        when_to_choose += (
            f" Avoid when: {localized_text(not_when_rule.text)}."
            if english
            else f" Evitar quando: {localized_text(not_when_rule.text)}."
        )
    return RelevantAlternative(
        component_id=candidate.component_id,
        name=candidate.name,
        why_alternative=why,
        key_differences=differences,
        when_to_choose=when_to_choose,
    )


def _describe_differences(
    recommended: ComponentMetadata,
    candidate: ComponentMetadata,
    english: bool,
) -> str:
    parts: list[str] = []
    if recommended.section != candidate.section:
        parts.append(
            f"section: {candidate.section or 'n/a'}"
            if english
            else f"seção: {candidate.section or 'n/d'}"
        )
    if recommended.intent and candidate.intent:
        if recommended.intent.id != candidate.intent.id:
            parts.append(
                (
                    f"intent: {localized_text(candidate.intent.label)}"
                )
            )
    if candidate.section in _OVERLAY_SECTIONS:
        parts.append(
            "overlay and focus management" if english else "overlay e gestão de foco"
        )
    if not parts:
        parts.append(
            "contract scope and documented use cases"
            if english
            else "escopo de contrato e casos de uso documentados"
        )
    return "; ".join(parts)


def _alternatives_from_tradeoff(
    tradeoff: TradeoffAnalysis,
    english: bool,
) -> list[RelevantAlternative]:
    registry = component_registry()
    entries: list[RelevantAlternative] = []
    for alt_name in tradeoff.alternatives[:_ALTERNATIVE_LIMIT]:
        for candidate in registry.values():
            if _normalize(candidate.name) != _normalize(alt_name):
                continue
            entries.append(RelevantAlternative(
                component_id=candidate.component_id,
                name=candidate.name,
                why_alternative=(
                    "Named alternative in this decision."
                    if english
                    else "Alternativa citada nesta decisão."
                ),
                key_differences=(
                    "Compare documented when_to_use and when_not_to_use rules."
                    if english
                    else "Compare as regras documentadas de when_to_use e when_not_to_use."
                ),
                when_to_choose=(
                    localized_text(candidate.when_to_use[0].text)
                    if candidate.when_to_use
                    else alt_name
                ),
            ))
            break
    return entries


def _settings_context(query: str) -> bool:
    norm_query = _normalize(query)
    return any(marker in norm_query for marker in _SETTINGS_MARKERS)


def _effective_reasoning_profile(profile: str, *, settings_context: bool) -> str:
    profile_id = normalize_profile_id(profile)
    if settings_context and profile_id in {
        "dev",
        "qa",
        "maintainer",
        "tech_writer",
        "design_system_manager",
    }:
        return "product_designer"
    if profile_id == "ux_specialist":
        return "product_designer"
    return profile_id


def _is_decision_relevant_alternative(
    recommended: ComponentMetadata,
    candidate: ComponentMetadata,
    *,
    tradeoff: TradeoffAnalysis,
) -> bool:
    candidate_norm = _normalize(candidate.name)
    for alt in tradeoff.alternatives:
        alt_norm = _normalize(alt)
        if alt_norm == candidate_norm or alt_norm in candidate_norm:
            return True
    if recommended.section in _OVERLAY_SECTIONS:
        return candidate.section in _OVERLAY_SECTIONS
    if candidate.component_id in (recommended.related_components or []):
        return candidate.section == recommended.section
    return candidate.section == recommended.section


def _similarity_rank(
    recommended: ComponentMetadata,
    candidate: ComponentMetadata,
) -> tuple[float, list[str]]:
    if candidate.component_id in (recommended.related_components or []):
        return 0.9, []

    score = 0.0
    if recommended.section and recommended.section == candidate.section:
        score += 0.35

    rec_tokens = _component_tokens(recommended)
    cand_tokens = _component_tokens(candidate)
    if rec_tokens and cand_tokens:
        overlap = len(rec_tokens & cand_tokens)
        union = len(rec_tokens | cand_tokens)
        score += 0.35 * (overlap / union if union else 0.0)

    if recommended.intent and candidate.intent:
        if _normalize(recommended.intent.id) == _normalize(candidate.intent.id):
            score += 0.15

    return min(score, 0.98), []


def _component_tokens(component: ComponentMetadata) -> set[str]:
    parts = [
        component.name,
        component.component_id,
        component.section or "",
    ]
    if component.intent:
        parts.append(localized_text(component.intent.label))
    for rule in (component.when_to_use or [])[:4]:
        parts.append(localized_text(rule.text))
    tokens: set[str] = set()
    for part in parts:
        tokens.update(_normalize_tokens(part))
    return tokens
