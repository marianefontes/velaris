"""Structured component comparisons grounded in design decisions and catalog rules."""

from __future__ import annotations

import re

from component_metadata import component_registry, localized_rules, localized_text

from .models import ComponentComparisonBrief, ComparisonSideBrief
from .understanding import normalize_text


_DESIGN_DECISION_ID = "side_drawer_vs_modal"
_DESIGN_DECISION_LOGIC_PT = (
    "Side Drawer preserva contexto espacial — use quando o usuário precisa "
    "referenciar o conteúdo atrás. Modal Overlay exige atenção total — use "
    "para confirmações, fluxos de criação e alertas críticos."
)
_DESIGN_DECISION_LOGIC_EN = (
    "Side Drawer preserves spatial context — use when the user needs to "
    "reference content behind the panel. Modal Overlay demands full attention "
    "— use for confirmations, creation flows and critical alerts."
)
_DRAWER_USE_PT = (
    "Conteúdo denso, contexto persistente, integração com formulários sem "
    "perder a página de fundo."
)
_DRAWER_USE_EN = (
    "Dense content, persistent context, form steps while keeping the page visible."
)
_MODAL_USE_PT = (
    "Ações que exigem foco indivisível, confirmações bloqueantes e decisões "
    "críticas de curta duração."
)
_MODAL_USE_EN = (
    "Actions requiring undivided focus, blocking confirmations and short "
    "critical decisions."
)
_TRADEOFF_PT = (
    "Drawer: oclusão visual parcial. Modal: perda de contexto e maior interrupção."
)
_TRADEOFF_EN = (
    "Drawer: partial visual occlusion. Modal: context loss and stronger interruption."
)


def _comparison_pair(normalized: str) -> tuple[str, str] | None:
    match = re.search(
        r"(.+?)\s+(?:vs\.?|versus|ou|or|em vez de|instead of)\s+(.+)",
        normalized,
        re.I,
    )
    if match:
        return match.group(1).strip(), match.group(2).strip()
    match = re.search(
        r"(?:diferenca|diferença|difference|comparar|compare|explicar)"
        r"\s+(?:entre|between)\s+(.+?)\s+(?:e|and)\s+(.+)",
        normalized,
        re.I,
    )
    if match:
        return match.group(1).strip(), match.group(2).strip()
    return None


def _mentions_modal_drawer(normalized: str) -> bool:
    has_drawer = any(
        term in normalized
        for term in ("drawer", "gaveta", "side drawer")
    )
    has_modal = any(
        term in normalized
        for term in ("modal", "dialog", "dialogo", "diálogo")
    )
    return has_drawer and has_modal


def is_modal_drawer_comparison_query(query: str) -> bool:
    normalized = normalize_text(query)
    pair = _comparison_pair(normalized)
    if pair is not None:
        left, right = pair
        combined = f"{normalize_text(left)} {normalize_text(right)}"
        if _mentions_modal_drawer(combined):
            return True
    return _mentions_modal_drawer(normalized)


def _modal_rules() -> tuple[list[str], list[str], list[str], list[str]]:
    component = component_registry().get("modal-dialog")
    if component is None:
        return [], [], [], []
    do_rules = localized_rules(component.do) or []
    dont_rules = localized_rules(component.dont) or []
    when_to_use = localized_rules(component.when_to_use) or []
    when_not_to_use = localized_rules(component.when_not_to_use) or []
    return do_rules, dont_rules, when_to_use, when_not_to_use


def build_modal_drawer_comparison(
    query: str,
    *,
    english: bool = False,
) -> ComponentComparisonBrief | None:
    if not is_modal_drawer_comparison_query(query):
        return None

    do_rules, dont_rules, when_to_use, when_not_to_use = _modal_rules()
    normalized = normalize_text(query)
    prefers_context = any(
        term in normalized
        for term in (
            "contexto",
            "context",
            "referenc",
            "fundo",
            "pagina",
            "página",
            "behind",
            "dens",
        )
    )
    prefers_focus = any(
        term in normalized
        for term in (
            "confirm",
            "critico",
            "crítico",
            "critical",
            "bloque",
            "blocking",
            "destrutiv",
        )
    )

    if prefers_context and not prefers_focus:
        recommended = "Side Drawer (padrão conceitual — não catalogado como componente)"
        if english:
            recommended = "Side Drawer (conceptual pattern — not a cataloged component)"
    elif prefers_focus and not prefers_context:
        recommended = "Modal/Dialog"
    else:
        recommended = (
            "Depende do foco: Drawer preserva contexto; Modal isola a decisão."
            if not english
            else "Depends on focus: Drawer preserves context; Modal isolates the decision."
        )

    modal_component = component_registry().get("modal-dialog")
    modal_purpose = (
        localized_text(modal_component.about, "en" if english else "pt")
        if modal_component is not None
        else (
            "Interrupts flow for a short, focused decision."
            if english
            else "Interrompe o fluxo para uma decisão curta e focada."
        )
    )
    modal_side = ComparisonSideBrief(
        name="Modal/Dialog",
        catalog_status="cataloged",
        purpose=modal_purpose,
        use_when=(when_to_use[:3] or [_MODAL_USE_PT if not english else _MODAL_USE_EN]),
        avoid_when=(when_not_to_use[:3] or dont_rules[:3]),
        risks=(
            [
                "Perda de contexto da página e interrupção mais forte.",
                "Não adequado para jornadas longas ou navegação interna.",
            ]
            if not english
            else [
                "Page context loss and stronger interruption.",
                "Not suitable for long journeys or internal navigation.",
            ]
        ),
        supporting_rules=do_rules[:3],
    )
    drawer_side = ComparisonSideBrief(
        name="Side Drawer",
        catalog_status="not_cataloged",
        purpose=(
            "Painel lateral que mantém a página visível enquanto o usuário "
            "executa uma tarefa complementar."
            if not english
            else "Side panel that keeps the page visible while the user completes a complementary task."
        ),
        use_when=[_DRAWER_USE_PT if not english else _DRAWER_USE_EN],
        avoid_when=(
            [
                "Confirmações críticas que exigem bloqueio total.",
                "Alertas que não podem ser ignorados sem decisão explícita.",
            ]
            if not english
            else [
                "Critical confirmations that require total blocking.",
                "Alerts that cannot be dismissed without an explicit decision.",
            ]
        ),
        risks=(
            [
                "Oclusão parcial da página e competição visual com o conteúdo de fundo.",
            ]
            if not english
            else [
                "Partial page occlusion and visual competition with background content.",
            ]
        ),
        supporting_rules=[],
    )

    return ComponentComparisonBrief(
        rule_id="modal_vs_drawer",
        title="Modal/Dialog vs Side Drawer",
        objective=(
            "Escolher entre interromper o fluxo com foco total ou preservar "
            "contexto espacial."
            if not english
            else "Choose between interrupting the flow with total focus or preserving spatial context."
        ),
        recommended_choice=recommended,
        rationale=(
            _DESIGN_DECISION_LOGIC_PT
            if not english
            else _DESIGN_DECISION_LOGIC_EN
        ),
        tradeoffs=[_TRADEOFF_PT if not english else _TRADEOFF_EN],
        design_decision_id=_DESIGN_DECISION_ID,
        sides=[drawer_side, modal_side],
        institutional_evidence=[
            "Design decision: Side Drawer vs Modal Overlay",
            "Component catalog: Modal/Dialog do/dont/when_not_to_use",
        ],
    )


def format_component_comparison_response(
    comparison: ComponentComparisonBrief,
    *,
    english: bool = False,
) -> str:
    if english:
        lines = [
            f"## Comparison · {comparison.title}",
            "",
            "### Objective",
            comparison.objective,
            "",
            "### Recommended choice",
            comparison.recommended_choice,
            "",
            "### Rationale",
            comparison.rationale,
        ]
    else:
        lines = [
            f"## Comparação · {comparison.title}",
            "",
            "### Objetivo",
            comparison.objective,
            "",
            "### Melhor escolha",
            comparison.recommended_choice,
            "",
            "### Motivo",
            comparison.rationale,
        ]

    for side in comparison.sides:
        if english:
            lines.extend([
                "",
                f"### {side.name}",
                f"Catalog status: {side.catalog_status}",
                "",
                "**Purpose**",
                side.purpose,
                "",
                "**Use when**",
            ])
        else:
            lines.extend([
                "",
                f"### {side.name}",
                f"Status no catálogo: {side.catalog_status}",
                "",
                "**Propósito**",
                side.purpose,
                "",
                "**Quando usar**",
            ])
        lines.extend(f"- {item}" for item in side.use_when)
        avoid_label = "**Avoid when**" if english else "**Quando evitar**"
        lines.extend(["", avoid_label])
        lines.extend(f"- {item}" for item in side.avoid_when)
        risk_label = "**Risks**" if english else "**Riscos**"
        lines.extend(["", risk_label])
        lines.extend(f"- {item}" for item in side.risks)

    if comparison.tradeoffs:
        label = "### Trade-offs" if english else "### Trade-offs"
        lines.extend(["", label])
        lines.extend(f"- {item}" for item in comparison.tradeoffs)

    if comparison.institutional_evidence:
        label = "### Evidence" if english else "### Evidências"
        lines.extend(["", label])
        lines.extend(f"- {item}" for item in comparison.institutional_evidence)

    return "\n".join(lines)
