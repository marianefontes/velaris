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


def decision_rules_health() -> dict:
    recommendation_rules = (
        "multiple_choice",
        "destructive_action",
        "success_feedback",
        "field_error",
        "long_option_list",
    )
    comparison_rules = (
        "button_vs_link",
        "checkbox_vs_radio",
        "radio_vs_select",
        "checkbox_vs_switch",
        "generic_component_comparison",
    )
    return {
        "loaded": True,
        "recommendation_rules": list(recommendation_rules),
        "comparison_rules": list(comparison_rules),
        "total_rules": len(recommendation_rules) + len(comparison_rules),
    }


def _comparison_pair(normalized: str) -> tuple[str, str] | None:
    import re

    match = re.search(
        r"(.+?)\s+(?:vs\.?|versus|ou|or|em vez de|instead of)\s+(.+)",
        normalized,
        re.I,
    )
    if not match:
        return None
    return match.group(1).strip(), match.group(2).strip()


def _resolve_side_to_component_id(side: str) -> str | None:
    from agent.entity_resolution import resolve_exact_entity_matches
    from agent.understanding import normalize_query

    matches = resolve_exact_entity_matches(normalize_query(side))
    if matches:
        return matches[0].component_id
    normalized = normalize_text(side)
    if any(term in normalized for term in ("drawer", "gaveta", "side drawer")):
        return None
    return None


def resolve_comparison_rule(query: str, *, english: bool = False) -> DecisionRuleResult | None:
    normalized = normalize_text(query)
    pair = _comparison_pair(normalized)
    if pair is None:
        return None
    left_text, right_text = pair
    left_id = _resolve_side_to_component_id(left_text)
    right_id = _resolve_side_to_component_id(right_text)
    left_norm = normalize_text(left_text)
    right_norm = normalize_text(right_text)

    if ("button" in left_norm or "botao" in left_norm or "botão" in left_norm) and "link" in right_norm:
        actions = _secondary_actions(("button", "link"), english=english)
        if len(actions) < 2:
            return None
        return DecisionRuleResult(
            rule_id="button_vs_link",
            recommended_component_id="button",
            rationale_pt=(
                "Use Button para ações e mudanças de estado na página. "
                "Use Link para navegação entre rotas ou seções sem executar uma ação primária."
            ),
            rationale_en=(
                "Use Button for actions and in-page state changes. "
                "Use Link for navigation between routes or sections without a primary action."
            ),
            conditions=("navigation vs action",),
            alternatives=("link",),
            navigation_action=actions[0],
            secondary_navigation_actions=[actions[1]],
        )

    checkbox_left = "checkbox" in left_norm or "check box" in left_norm
    checkbox_right = "checkbox" in right_norm or "check box" in right_norm
    radio_left = "radio" in left_norm
    radio_right = "radio" in right_norm
    if (checkbox_left and radio_right) or (radio_left and checkbox_right):
        single_choice = _matches_any(
            normalized,
            (
                "apenas uma",
                "somente uma",
                "so uma",
                "uma opcao",
                "uma unica",
                "escolha unica",
                "exclusiva",
                "single option",
                "only one",
                "one option",
                "single choice",
            ),
        )
        multiple_choice = _matches_any(
            normalized,
            (
                "varias",
                "multiplas",
                "mais de uma",
                "multiple",
                "several",
                "multi select",
                "selecao multipla",
            ),
        )
        recommended = "checkbox" if multiple_choice and not single_choice else "radio-button"
        alternative = "checkbox" if recommended == "radio-button" else "radio-button"
        actions = _secondary_actions((recommended, alternative), english=english)
        if len(actions) < 2:
            return None
        return DecisionRuleResult(
            rule_id="checkbox_vs_radio",
            recommended_component_id=recommended,
            rationale_pt=(
                "O critério de decisão é a cardinalidade da escolha. "
                "Use Radio Button quando o usuário escolhe exatamente uma opção "
                "entre alternativas mutuamente exclusivas. "
                "Use Checkbox quando o usuário pode marcar zero, uma ou várias "
                "opções independentes. "
                "Erro comum: usar Checkbox para escolha única, o que permite "
                "estados inválidos e exige validação extra. "
                "Acessibilidade: agrupe as opções com um rótulo de grupo claro e "
                "garanta navegação por teclado entre as opções."
            ),
            rationale_en=(
                "The decision criterion is choice cardinality. "
                "Use Radio Button when the user picks exactly one option among "
                "mutually exclusive alternatives. "
                "Use Checkbox when the user can mark zero, one or several "
                "independent options. "
                "Common mistake: using Checkbox for a single choice, which allows "
                "invalid states and requires extra validation. "
                "Accessibility: group the options under a clear group label and "
                "ensure keyboard navigation across options."
            ),
            conditions=("single vs multiple selection",),
            alternatives=(alternative,),
            navigation_action=actions[0],
            secondary_navigation_actions=[actions[1]],
        )

    if ("radio" in left_norm or "opcao" in left_norm or "opção" in left_norm) and (
        "select" in right_norm or "dropdown" in right_norm
    ):
        actions = _secondary_actions(("radio-button", "select-dropdown"), english=english)
        if len(actions) < 2:
            return None
        return DecisionRuleResult(
            rule_id="radio_vs_select",
            recommended_component_id="radio-button",
            rationale_pt=(
                "Use Radio Button para poucas opções visíveis. "
                "Use Select/Dropdown quando a lista é média ou longa."
            ),
            rationale_en=(
                "Use Radio Button for a small visible set of options. "
                "Use Select/Dropdown when the list is medium or long."
            ),
            conditions=("few vs many options",),
            alternatives=("select-dropdown",),
            navigation_action=actions[0],
            secondary_navigation_actions=[actions[1]],
        )

    if ("checkbox" in left_norm or "check box" in left_norm) and "switch" in right_norm:
        actions = _secondary_actions(("checkbox", "toggle-switch"), english=english)
        if len(actions) < 2:
            return None
        return DecisionRuleResult(
            rule_id="checkbox_vs_switch",
            recommended_component_id="checkbox",
            rationale_pt=(
                "Use Checkbox para seleção múltipla ou consentimento explícito. "
                "Use Switch para alternância binária imediata."
            ),
            rationale_en=(
                "Use Checkbox for multi-select or explicit consent. "
                "Use Switch for immediate binary toggles."
            ),
            conditions=("multi-select vs binary toggle",),
            alternatives=("toggle-switch",),
            navigation_action=actions[0],
            secondary_navigation_actions=[actions[1]],
        )

    drawer_side = "drawer" in left_norm or "gaveta" in left_norm or "drawer" in right_norm or "gaveta" in right_norm
    modal_side = "modal" in left_norm or "dialog" in left_norm or "modal" in right_norm or "dialog" in right_norm
    if drawer_side and modal_side:
        return None

    if left_id and right_id:
        actions = _secondary_actions((left_id, right_id), english=english)
        if len(actions) < 2:
            return None
        rationale_pt, rationale_en = _generic_comparison_rationale(
            left_id,
            right_id,
            left_text,
            right_text,
        )
        return DecisionRuleResult(
            rule_id="generic_component_comparison",
            recommended_component_id=left_id,
            rationale_pt=rationale_pt,
            rationale_en=rationale_en,
            conditions=("named comparison",),
            alternatives=(right_id,),
            confidence="medium",
            navigation_action=actions[0],
            secondary_navigation_actions=[actions[1]],
        )

    return None


def _first_rule_text(component_id: str, *, english: bool = False) -> str | None:
    """First documented when_to_use rule for a component, in the requested language."""
    component = component_registry().get(component_id)
    if component is None or not component.when_to_use:
        return None
    text = component.when_to_use[0].text
    if english:
        return text.en or text.pt
    return text.pt or text.en


def _generic_comparison_rationale(
    left_id: str,
    right_id: str,
    left_text: str,
    right_text: str,
) -> tuple[str, str]:
    """Catalog-grounded comparison criteria instead of a generic sentence.

    Pulls the primary when_to_use rule of each component so the answer gives
    an actual decision criterion. Falls back to the generic phrasing only
    when the catalog has no usable rule for either side.
    """
    left_pt = _first_rule_text(left_id)
    right_pt = _first_rule_text(right_id)
    left_en = _first_rule_text(left_id, english=True)
    right_en = _first_rule_text(right_id, english=True)

    left_name = component_registry()[left_id].name
    right_name = component_registry()[right_id].name

    if left_pt and right_pt:
        rationale_pt = (
            f"Critério de decisão documentado no catálogo. "
            f"{left_name}: {left_pt} "
            f"{right_name}: {right_pt} "
            "Escolha pelo caso de uso que descreve melhor o seu contexto."
        )
    else:
        rationale_pt = (
            f"Compare {left_text} e {right_text} pelo contexto de uso, "
            "affordance e carga cognitiva."
        )

    if left_en and right_en:
        rationale_en = (
            f"Decision criterion documented in the catalog. "
            f"{left_name}: {left_en} "
            f"{right_name}: {right_en} "
            "Choose by the use case that best describes your context."
        )
    else:
        rationale_en = (
            f"Compare {left_text} and {right_text} by usage context, "
            "affordance and cognitive load."
        )

    return rationale_pt, rationale_en
