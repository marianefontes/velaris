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
    "button": ("button", "botao", "botão", "botoes", "botões", "buttons"),
    "toggle-switch": (
        "toggle switch",
        "toggle",
        "toggles",
        "switch",
        "switches",
        "interruptor",
    ),
    "checkbox": (
        "checkbox",
        "checkboxes",
        "check box",
        "caixa de selecao",
        "caixa de seleção",
        "caixas de selecao",
    ),
    "radio-button": (
        "radio button",
        "radio buttons",
        "radio",
        "botao de opcao",
        "botão de opção",
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
    ),
    "text-area": (
        "text area",
        "textarea",
        "textareas",
        "area de texto",
        "área de texto",
    ),
    "select-dropdown": (
        "select dropdown",
        "select",
        "selects",
        "dropdown",
        "dropdowns",
        "lista suspensa",
    ),
    "date-picker": (
        "date picker",
        "date pickers",
        "datepicker",
        "seletor de data",
        "seletor de datas",
        "calendario",
        "calendário",
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
    "link": ("link", "links", "hyperlink"),
    "tabs": ("tabs", "tab", "abas", "aba"),
    "card": ("card", "cards", "cartao", "cartão", "cartoes", "cartões"),
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
    ),
    "data-table": (
        "data table",
        "data tables",
        "table",
        "tables",
        "tabela",
        "tabelas",
    ),
    "alert": ("alert", "alerts", "alerta", "alertas", "banner"),
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
    "typography": ("typography", "tipografia"),
    "icon": ("icon", "icons", "icone", "ícone", "icones", "ícones", "icon button"),
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
