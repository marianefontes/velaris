"""Deterministic recommendation rules for common Velaris component choices."""

from __future__ import annotations

from dataclasses import dataclass, field

from component_metadata import component_registry

from agent.models import NavigationAction
from agent.navigation_actions import navigation_action_for_component
from agent.recommendation_policy import is_single_choice_recommendation_query
from agent.understanding import normalize_text


@dataclass(frozen=True)
class DecisionRuleResult:
    rule_id: str
    recommended_component_id: str
    rationale_pt: str
    rationale_en: str
    conditions: tuple[str, ...]
    alternatives: tuple[str, ...] = ()
    confidence: str = "high"
    navigation_action: NavigationAction | None = None
    secondary_navigation_actions: list[NavigationAction] = field(default_factory=list)


def _component_action(
    component_id: str,
    *,
    english: bool = False,
    verb: str = "view",
) -> NavigationAction | None:
    component = component_registry().get(component_id)
    if component is None:
        return None
    return navigation_action_for_component(
        component,
        english=english,
        verb=verb,
    )


def _secondary_actions(
    component_ids: tuple[str, ...],
    *,
    english: bool = False,
) -> list[NavigationAction]:
    actions: list[NavigationAction] = []
    for component_id in component_ids:
        action = _component_action(component_id, english=english)
        if action is not None:
            actions.append(action)
    return actions


def _matches_any(normalized: str, terms: tuple[str, ...]) -> bool:
    return any(term in normalized for term in terms)


def resolve_decision_rule(query: str, *, english: bool = False) -> DecisionRuleResult | None:
    normalized = normalize_text(query)

    if is_single_choice_recommendation_query(query):
        return None

    if not _matches_any(
        normalized,
        (
            "qual componente",
            "que componente",
            "which component",
            "what component",
            "devo usar",
            "should i use",
            "uso para",
            "use for",
            "recomende",
            "recommend",
        ),
    ):
        return None

    if _matches_any(
        normalized,
        (
            "escolher varias",
            "escolher várias",
            "varias opcoes",
            "várias opções",
            "multiplas opcoes",
            "múltiplas opções",
            "multiple options",
            "multiple choice",
            "selecao multipla",
            "seleção múltipla",
            "multi select",
        ),
    ):
        primary = _component_action("checkbox", english=english)
        if primary is None:
            return None
        return DecisionRuleResult(
            rule_id="multiple_choice",
            recommended_component_id="checkbox",
            rationale_pt=(
                "Use Checkbox quando o usuário precisa marcar várias opções "
                "independentes dentro de um conjunto."
            ),
            rationale_en=(
                "Use Checkbox when the user needs to select multiple independent "
                "options within a set."
            ),
            conditions=("multiple selection",),
            alternatives=("select-dropdown",),
            confidence="high",
            navigation_action=primary,
            secondary_navigation_actions=_secondary_actions(
                ("select-dropdown",),
                english=english,
            ),
        )

    if _matches_any(
        normalized,
        (
            "acao destrutiva",
            "ação destrutiva",
            "destructive action",
            "destructive",
            "excluir",
            "apagar",
            "delete item",
            "remover item",
        ),
    ):
        primary = _component_action("modal-dialog", english=english)
        if primary is None:
            return None
        return DecisionRuleResult(
            rule_id="destructive_action",
            recommended_component_id="modal-dialog",
            rationale_pt=(
                "Use Modal/Dialog para confirmar uma ação destrutiva antes de "
                "executá-la. O Button negative dispara a ação, mas o fluxo de "
                "confirmação precisa de foco e bloqueio de contexto."
            ),
            rationale_en=(
                "Use Modal/Dialog to confirm a destructive action before executing "
                "it. The negative Button triggers the action, but the confirmation "
                "flow needs focus and context blocking."
            ),
            conditions=("destructive confirmation",),
            alternatives=("button",),
            confidence="high",
            navigation_action=primary,
            secondary_navigation_actions=_secondary_actions(
                ("button",),
                english=english,
            ),
        )

    if _matches_any(
        normalized,
        (
            "feedback de sucesso",
            "success feedback",
            "confirmacao de sucesso",
            "confirmação de sucesso",
            "operacao concluida",
            "operação concluída",
            "acao concluida",
            "ação concluída",
        ),
    ):
        primary = _component_action("toast", english=english)
        if primary is None:
            return None
        return DecisionRuleResult(
            rule_id="success_feedback",
            recommended_component_id="toast",
            rationale_pt=(
                "Use Toast/Notification para feedback breve de sucesso que não "
                "precisa permanecer na tela."
            ),
            rationale_en=(
                "Use Toast/Notification for brief success feedback that does not "
                "need to stay on screen."
            ),
            conditions=("transient success feedback",),
            alternatives=("alert",),
            confidence="high",
            navigation_action=primary,
            secondary_navigation_actions=_secondary_actions(
                ("alert",),
                english=english,
            ),
        )

    if _matches_any(
        normalized,
        (
            "erro em campo",
            "erro no campo",
            "field error",
            "inline error",
            "validacao de campo",
            "validação de campo",
            "mensagem de erro no campo",
        ),
    ):
        primary = _component_action("form-field", english=english)
        if primary is None:
            return None
        return DecisionRuleResult(
            rule_id="field_error",
            recommended_component_id="form-field",
            rationale_pt=(
                "Use Form Field para associar label, valor, ajuda e erro no mesmo "
                "campo. Text Input carrega o valor, mas a mensagem de erro deve "
                "ficar ligada ao campo."
            ),
            rationale_en=(
                "Use Form Field to associate label, value, help and error on the "
                "same field. Text Input holds the value, but the error message must "
                "stay tied to the field."
            ),
            conditions=("inline field validation",),
            alternatives=("text-input", "alert"),
            confidence="high",
            navigation_action=primary,
            secondary_navigation_actions=_secondary_actions(
                ("text-input", "alert"),
                english=english,
            ),
        )

    if _matches_any(
        normalized,
        (
            "lista longa",
            "long list",
            "longa lista",
            "muitas opcoes",
            "muitas opções",
            "many options",
            "large list",
            "lista extensa",
        ),
    ):
        primary = _component_action("select-dropdown", english=english)
        if primary is None:
            return None
        return DecisionRuleResult(
            rule_id="long_option_list",
            recommended_component_id="select-dropdown",
            rationale_pt=(
                "Use Select/Dropdown quando a lista de opções é média ou longa e "
                "exibir todas as opções ocuparia espaço demais."
            ),
            rationale_en=(
                "Use Select/Dropdown when the option list is medium or long and "
                "showing every option would take too much space."
            ),
            conditions=("long option list",),
            alternatives=("radio-button",),
            confidence="high",
            navigation_action=primary,
            secondary_navigation_actions=_secondary_actions(
                ("radio-button",),
                english=english,
            ),
        )

    return None


def decision_rule_response(result: DecisionRuleResult, *, english: bool = False) -> str:
    return result.rationale_en if english else result.rationale_pt
