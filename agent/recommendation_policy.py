"""Conditional recommendation responses for ambiguous component selection."""

from __future__ import annotations

from agent.understanding import normalize_text


_SINGLE_CHOICE_TERMS = (
    "apenas uma opcao",
    "apenas uma opção",
    "escolher apenas uma",
    "escolha unica",
    "escolha única",
    "uma opcao entre",
    "uma opção entre",
    "single choice",
    "opcao unica",
    "opção única",
    "mutuamente exclusiv",
)

_RECOMMENDATION_SIGNALS = (
    "qual componente",
    "que componente",
    "which component",
    "devo usar",
    "should i use",
    "uso para",
    "use for",
)


def is_single_choice_recommendation_query(query: str) -> bool:
    normalized = normalize_text(query)
    if not any(term in normalized for term in _RECOMMENDATION_SIGNALS):
        return False
    return any(term in normalized for term in _SINGLE_CHOICE_TERMS)


def single_choice_recommendation_response(*, english: bool = False) -> str:
    if english:
        return (
            "It depends on how many options you need to show.\n\n"
            "Use Radio Button when there are few options, usually two to five, "
            "and visible side-by-side comparison helps the decision.\n\n"
            "Use Select/Dropdown when the list is medium or long, or when showing "
            "every option would take too much space.\n\n"
            "Do not use Checkbox for single choice because it supports multiple "
            "selection. Button is for actions, not for choosing one option from a set."
        )
    return (
        "Depende da quantidade de opções que você precisa mostrar.\n\n"
        "Use Radio Button quando forem poucas opções, normalmente duas a cinco, "
        "e a comparação visual ajudar na decisão.\n\n"
        "Use Select/Dropdown quando a lista for média ou longa, ou quando exibir "
        "todas as opções ocupar espaço demais.\n\n"
        "Não use Checkbox para escolha única, pois ele serve para seleção múltipla. "
        "Button é para ações, não para escolher uma opção dentro de um conjunto."
    )
