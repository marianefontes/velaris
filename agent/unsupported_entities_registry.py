"""Known UI entities that may be requested but are absent from the Velaris catalog."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal


EntityKind = Literal[
    "component",
    "component_or_pattern",
    "pattern",
    "token",
    "concept",
    "decision",
]


@dataclass(frozen=True)
class UnsupportedEntityEntry:
    entity_key: str
    label: str
    entity_type: EntityKind
    aliases: tuple[str, ...]
    closest_internal_alternatives: tuple[str, ...]
    external_reference_ids: tuple[str, ...]
    response_guidance: str
    gap_reason: str
    gap_suggested_action: str
    blocking_use_case: str | None = None
    contextual_use_case: str | None = None


UNSUPPORTED_ENTITIES_REGISTRY: dict[str, UnsupportedEntityEntry] = {
    "side-drawer": UnsupportedEntityEntry(
        entity_key="side-drawer",
        label="Side Drawer",
        entity_type="component_or_pattern",
        aliases=(
            "side drawer",
            "side-drawer",
            "sidedrawer",
            "drawer lateral",
            "painel lateral",
            "painel lateral deslizante",
            "gaveta lateral",
            # Spanish / French
            "cajon lateral",
            "cajón lateral",
            "panel lateral deslizante",
            "tiroir lateral",
            "tiroir latéral",
        ),
        closest_internal_alternatives=("modal-dialog",),
        external_reference_ids=("material-navigation-drawer", "carbon-side-panel"),
        response_guidance=(
            "Explain that Side Drawer is not a canonical Velaris component. "
            "Suggest Modal/Dialog only for blocking decisions. "
            "State the lateral editing gap when context must stay visible."
        ),
        gap_reason=(
            "Common UI pattern requested but not present in canonical catalog"
        ),
        gap_suggested_action=(
            "Review whether Velaris should document a Drawer or Side Panel pattern"
        ),
        blocking_use_case="blocking decision or confirmation flow",
        contextual_use_case="lateral editing while keeping page context visible",
    ),
    "combobox": UnsupportedEntityEntry(
        entity_key="combobox",
        label="Combobox",
        entity_type="component",
        aliases=(
            "combobox",
            "combo box",
            "caixa combinada",
            "autocomplete field",
            "campo autocomplete",
            # Spanish / French
            "cuadro combinado",
            "campo de autocompletado",
            "zone de liste deroulante",
            "champ a saisie semi-automatique",
        ),
        closest_internal_alternatives=("select-dropdown", "text-input"),
        external_reference_ids=("material-combobox", "wai-aria-combobox"),
        response_guidance=(
            "Explain that Combobox is not a canonical Velaris component. "
            "Suggest Select Dropdown for fixed option lists and Text Input "
            "when free text is acceptable."
        ),
        gap_reason="Autocomplete combobox requested but not in canonical catalog",
        gap_suggested_action="Review whether Velaris needs a Combobox component",
        blocking_use_case="fixed list with search inside a dropdown",
        contextual_use_case="typeahead with free text and suggestions",
    ),
    "date-range-picker": UnsupportedEntityEntry(
        entity_key="date-range-picker",
        label="Date Range Picker",
        entity_type="component",
        aliases=(
            "date range picker",
            "date range",
            "intervalo de datas",
            "seletor de intervalo",
            "range de datas",
        ),
        closest_internal_alternatives=("date-picker",),
        external_reference_ids=("material-date-range",),
        response_guidance=(
            "Explain that Date Range Picker is not canonical in Velaris. "
            "Suggest Date Picker for single date selection."
        ),
        gap_reason="Date range selection requested but only single Date Picker exists",
        gap_suggested_action="Review whether Velaris needs a Date Range Picker",
        blocking_use_case="single date selection",
        contextual_use_case="start and end date range selection",
    ),
    "breadcrumb": UnsupportedEntityEntry(
        entity_key="breadcrumb",
        label="Breadcrumb",
        entity_type="component_or_pattern",
        aliases=(
            "breadcrumb",
            "breadcrumbs",
            "migalhas de pao",
            "migalhas de pão",
            "migalha de pao",
            "migalha de pão",
            # Spanish / French
            "migas de pan",
            "ruta de navegacion",
            "ruta de navegación",
            "fil d'ariane",
        ),
        closest_internal_alternatives=("link",),
        external_reference_ids=("carbon-breadcrumb",),
        response_guidance=(
            "Explain that Breadcrumb is not a canonical Velaris component. "
            "Suggest Link for simple navigation trails when hierarchy is shallow."
        ),
        gap_reason="Breadcrumb navigation requested but not in canonical catalog",
        gap_suggested_action="Review whether Velaris should document a Breadcrumb pattern",
        blocking_use_case="simple inline navigation between related pages",
        contextual_use_case="hierarchical location trail across deep navigation",
    ),
    "stepper": UnsupportedEntityEntry(
        entity_key="stepper",
        label="Stepper",
        entity_type="component_or_pattern",
        aliases=(
            "stepper",
            "steppers",
            "wizard steps",
            "passo a passo",
            "indicador de etapas",
            # Spanish / French
            "asistente de pasos",
            "indicador de pasos",
            "indicateur d'etapes",
        ),
        closest_internal_alternatives=(),
        external_reference_ids=("material-stepper",),
        response_guidance=(
            "Explain that Stepper is not a canonical Velaris component or pattern. "
            "Do not invent an internal equivalent."
        ),
        gap_reason="Multi-step progress indicator requested but not in catalog",
        gap_suggested_action="Review whether Velaris should document a Stepper pattern",
        blocking_use_case=None,
        contextual_use_case="multi-step flow with visible progress",
    ),
    "popover": UnsupportedEntityEntry(
        entity_key="popover",
        label="Popover",
        entity_type="component_or_pattern",
        aliases=(
            "popover",
            "pop over",
            "pop-over",
            # Spanish / French
            "ventana emergente",
            "globo emergente",
            "fenetre contextuelle",
            "fenêtre contextuelle",
        ),
        closest_internal_alternatives=("explanation-tooltip", "modal-dialog"),
        external_reference_ids=(),
        response_guidance=(
            "Explain that Popover is not canonical in Velaris. "
            "Suggest Explanation Tooltip for lightweight hints "
            "or Modal/Dialog when the content needs focus."
        ),
        gap_reason="Popover overlay requested but not in canonical catalog",
        gap_suggested_action="Review whether Velaris should document a Popover component",
        blocking_use_case="lightweight contextual hint",
        contextual_use_case="rich contextual panel anchored to a trigger",
    ),
    "drawer": UnsupportedEntityEntry(
        entity_key="drawer",
        label="Drawer",
        entity_type="component_or_pattern",
        aliases=("drawer", "gaveta", "painel deslizante"),
        closest_internal_alternatives=("modal-dialog",),
        external_reference_ids=("material-navigation-drawer",),
        response_guidance=(
            "Explain that Drawer is not a canonical Velaris component. "
            "Do not treat Drawer as an existing internal component."
        ),
        gap_reason="Drawer pattern requested but not in canonical catalog",
        gap_suggested_action="Review whether Velaris should document a Drawer pattern",
        blocking_use_case="blocking overlay decision",
        contextual_use_case="lateral panel without leaving the page",
    ),
    "dragon-button": UnsupportedEntityEntry(
        entity_key="dragon-button",
        label="DragonButton",
        entity_type="component",
        aliases=("dragonbutton", "dragon button", "dragon-button"),
        closest_internal_alternatives=("button",),
        external_reference_ids=(),
        response_guidance=(
            "Explain that DragonButton is not a canonical Velaris component. "
            "Do not invent props, states or usage guidance for it."
        ),
        gap_reason="Invented adversarial component name — not in catalog",
        gap_suggested_action="Use Button for primary actions in Velaris",
        blocking_use_case="primary action",
        contextual_use_case=None,
    ),
    "magic-popover": UnsupportedEntityEntry(
        entity_key="magic-popover",
        label="MagicPopover",
        entity_type="component_or_pattern",
        aliases=("magicpopover", "magic popover", "magic-popover"),
        closest_internal_alternatives=("explanation-tooltip", "modal-dialog"),
        external_reference_ids=(),
        response_guidance=(
            "Explain that MagicPopover is not a canonical Velaris component. "
            "Suggest Explanation Tooltip or Modal/Dialog when appropriate."
        ),
        gap_reason="Invented adversarial overlay name — not in catalog",
        gap_suggested_action="Review Popover gap documentation",
        blocking_use_case="lightweight hint",
        contextual_use_case="rich anchored panel",
    ),
    "mega-wizard": UnsupportedEntityEntry(
        entity_key="mega-wizard",
        label="MegaWizard",
        entity_type="component_or_pattern",
        aliases=("megawizard", "mega wizard", "mega-wizard"),
        closest_internal_alternatives=(),
        external_reference_ids=(),
        response_guidance=(
            "Explain that MegaWizard is not a canonical Velaris component or pattern. "
            "Do not invent an internal equivalent."
        ),
        gap_reason="Invented adversarial multi-step pattern — not in catalog",
        gap_suggested_action="Review whether Velaris needs a Stepper pattern",
        blocking_use_case=None,
        contextual_use_case="multi-step flow with visible progress",
    ),
}


def unsupported_entity_keys() -> tuple[str, ...]:
    return tuple(UNSUPPORTED_ENTITIES_REGISTRY.keys())


def entry_for_key(entity_key: str) -> UnsupportedEntityEntry | None:
    return UNSUPPORTED_ENTITIES_REGISTRY.get(entity_key)
