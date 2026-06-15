"""Canonical entity aliases for Velaris component lookup."""

from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache

from component_metadata import ComponentMetadata, component_registry


@dataclass(frozen=True)
class EntityAliasEntry:
    component_id: str
    name: str
    aliases: tuple[str, ...]
    route: str
    target_type: str
    status: str


COMPONENT_ALIASES: dict[str, tuple[str, ...]] = {
    "button": (
        "button", "botao", "botão", "botoes", "botões", "buttons",
        # Spanish / French
        "boton", "botón", "botones", "bouton", "boutons",
    ),
    "toggle-switch": (
        "toggle switch",
        "toggle",
        "toggles",
        "switch",
        "switches",
        "interruptor",
        # Spanish / French
        "conmutador",
        "interrupteur",
    ),
    "checkbox": (
        "checkbox",
        "checkboxes",
        "check box",
        "caixa de selecao",
        "caixa de seleção",
        "caixas de selecao",
        # Spanish / French
        "casilla",
        "casilla de verificacion",
        "casilla de verificación",
        "case a cocher",
        "case à cocher",
    ),
    "radio-button": (
        "radio button",
        "radio buttons",
        "radio",
        "botao de opcao",
        "botão de opção",
        # Spanish / French
        "boton de opcion",
        "botón de opción",
        "bouton radio",
    ),
    "selectable-chip": (
        "selectable chip",
        "chip",
        "badge selecionavel",
        "badge selecionável",
        "chips",
    ),
    "text-input": (
        "text input",
        "text field",
        "textfield",
        "input",
        "inputs",
        "campo de texto",
        "campo",
        # Spanish / French
        "entrada de texto",
        "champ de texte",
    ),
    "text-area": (
        "text area",
        "textarea",
        "textareas",
        "area de texto",
        "área de texto",
        # Spanish / French
        "zona de texto",
        "zone de texte",
    ),
    "select-dropdown": (
        "select dropdown",
        "select",
        "selects",
        "dropdown",
        "dropdowns",
        "lista suspensa",
        # Spanish / French
        "lista desplegable",
        "menu desplegable",
        "menú desplegable",
        "liste deroulante",
        "liste déroulante",
    ),
    "date-picker": (
        "date picker",
        "date pickers",
        "datepicker",
        "seletor de data",
        "seletor de datas",
        "calendario",
        "calendário",
        # Spanish / French
        "selector de fecha",
        "selecteur de date",
        "sélecteur de date",
        "calendrier",
    ),
    "form-field": (
        "form field",
        "campo de formulario",
        "campo de formulário",
        "campos de formulario",
        "inline error",
        "erro de campo",
        "erro em campo",
        "field error",
    ),
    "link": ("link", "links", "hyperlink", "enlace", "enlaces", "lien", "liens"),
    "tabs": ("tabs", "tab", "abas", "aba", "pestanas", "pestañas", "onglets"),
    "card": (
        "card", "cards", "cartao", "cartão", "cartoes", "cartões",
        "tarjeta", "tarjetas", "carte", "cartes",
    ),
    "modal-dialog": (
        "modal dialog",
        "modal",
        "modais",
        "modals",
        "dialog",
        "dialogs",
        "dialogo",
        "diálogo",
        "dialogos",
        "janela modal",
        # Spanish / French
        "ventana modal",
        "cuadro de dialogo",
        "cuadro de diálogo",
        "boite de dialogue",
        "boîte de dialogue",
        "fenetre modale",
        "fenêtre modale",
    ),
    "data-table": (
        "data table",
        "data tables",
        "table",
        "tables",
        "tabela",
        "tabelas",
        # Spanish / French
        "tabla",
        "tabla de datos",
        "tableau",
        "tableau de donnees",
    ),
    "alert": ("alert", "alerts", "alerta", "alertas", "banner", "aviso", "alerte"),
    "toast": (
        "toast notification",
        "toast",
        "toasts",
        "notification",
        "notifications",
        "notificacao",
        "notificação",
        "notificacoes",
        "notificações",
    ),
    "skeleton-loader": ("skeleton loader", "skeleton", "skeletons"),
    "explanation-tooltip": (
        "explanation tooltip",
        "tooltip",
        "tooltips",
        "explanation bubble",
        # Spanish / French
        "informacion sobre herramienta",
        "información sobre herramienta",
        "infobulle",
    ),
    "confidence-badge": (
        "confidence badge",
        "confidence level",
        "medidor de confianca",
        "medidor de confiança",
        "nivel de confianca",
        "nível de confiança",
    ),
    "command-palette": ("command palette", "barra de comandos"),
    "source-attribution": (
        "source attribution",
        "atribuicao de fonte",
        "atribuição de fonte",
    ),
    "audit-panel": ("audit panel", "painel de auditoria"),
    "typography": ("typography", "tipografia", "tipografía", "typographie"),
    "icon": (
        "icon", "icons", "icone", "ícone", "icones", "ícones", "icon button",
        "icono", "iconos", "icône", "icônes",
    ),
}

PATTERN_ENTITY_ALIASES: dict[str, tuple[str, ...]] = {
    "side-drawer": (
        "drawer",
        "side drawer",
        "side-drawer",
        "gaveta",
        "gavetas",
        "painel lateral",
    ),
}


def component_href(component_id: str) -> str:
    return f"/components?component={component_id}"


@lru_cache(maxsize=1)
def entity_alias_registry() -> dict[str, EntityAliasEntry]:
    registry = component_registry()
    entries: dict[str, EntityAliasEntry] = {}
    for component_id, aliases in COMPONENT_ALIASES.items():
        component = registry.get(component_id)
        if component is None:
            continue
        entries[component_id] = EntityAliasEntry(
            component_id=component.component_id,
            name=component.name,
            aliases=aliases,
            route=component_href(component.component_id),
            target_type="component",
            status=component.status,
        )
    return entries


def aliases_for_component(component_id: str) -> tuple[str, ...]:
    entry = entity_alias_registry().get(component_id)
    if entry is None:
        return ()
    return entry.aliases


def registry_entry(component_id: str) -> EntityAliasEntry | None:
    return entity_alias_registry().get(component_id)


def component_for_name(name: str) -> ComponentMetadata | None:
    registry = component_registry()
    for component in registry.values():
        if component.name == name:
            return component
    return None
