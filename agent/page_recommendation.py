"""Page-level component recommendation, architecture and discovery intents."""

from __future__ import annotations

import re
from typing import Any, Literal

from component_metadata import component_registry

from .models import ExtractedEntities, QueryUnderstanding, UserIntent
from .understanding import normalize_query


PageType = Literal[
    "homepage",
    "landing_page",
    "dashboard",
    "form",
    "checkout",
    "settings",
    "onboarding",
    "modal",
    "wizard",
    "generic_page",
]

DiscoveryCapability = Literal[
    "navigation",
    "feedback",
    "loading",
    "data_display",
    "input",
    "confirmation",
    "generic",
]


class PageRecommendationResolution:
    __slots__ = ("intent", "page_type", "discovery_capability")

    def __init__(
        self,
        *,
        intent: UserIntent,
        page_type: PageType = "generic_page",
        discovery_capability: DiscoveryCapability = "generic",
    ) -> None:
        self.intent = intent
        self.page_type = page_type
        self.discovery_capability = discovery_capability


_PAGE_TYPE_MARKERS: dict[PageType, tuple[str, ...]] = {
    "homepage": (
        "home page",
        "homepage",
        "home screen",
        "pagina inicial",
        "página inicial",
        "tela inicial",
        "ecra inicial",
        "ecrã inicial",
    ),
    "landing_page": ("landing page", "landing", "pagina de destino", "página de destino"),
    "dashboard": ("dashboard", "painel", "painel de controle", "painel de controlo"),
    "form": ("formulario", "formulário", "form page", "data entry", "cadastro"),
    "checkout": ("checkout", "finalizar compra", "pagamento", "payment flow"),
    "settings": (
        "settings page",
        "pagina de configuracoes",
        "página de configurações",
        "pagina de definicoes",
        "página de definições",
        "configuracoes",
        "configurações",
        "definicoes",
        "definições",
    ),
    "onboarding": ("onboarding", "primeiro acesso", "first run", "getting started"),
    "modal": ("modal flow", "fluxo modal", "dialog flow", "fluxo de dialogo", "fluxo de diálogo"),
    "wizard": (
        "wizard",
        "assistente",
        "fluxo guiado",
        "guided flow",
        "step by step",
        "passo a passo",
        "multi step",
        "multi-step",
    ),
}

_COMPONENT_RECOMMENDATION_MARKERS = (
    "which components should",
    "what components should",
    "which component should",
    "what component should",
    "quais componentes devo",
    "que componentes devo",
    "quais componentes usar",
    "que componentes usar",
    "quais componentes utilizar",
    "que componentes utilizar",
    "what should i use for",
    "what should i use to",
    "o que devo usar para",
    "o que devo utilizar para",
    "help me to build",
    "help me build",
    "help me create",
    "help me to create",
    "me ajude a criar",
    "me ajude a construir",
    "ajuda me a criar",
    "ajuda-me a criar",
    "ajuda me a construir",
    "ajuda-me a construir",
    "build a home",
    "build a landing",
    "build a dashboard",
    "build a form",
    "build a checkout",
    "build a settings",
    "create a home",
    "create a landing",
    "create a dashboard",
    "create a form",
    "create a checkout",
    "create a settings",
    "criar uma pagina",
    "criar uma página",
    "criar um dashboard",
    "criar um formulario",
    "criar um formulário",
    "criar um checkout",
    "criar uma landing",
)

_PAGE_ARCHITECTURE_MARKERS = (
    "design a checkout",
    "design a settings",
    "design a dashboard",
    "design onboarding",
    "build a settings page",
    "create onboarding",
    "projetar um checkout",
    "projetar uma pagina",
    "projetar uma página",
    "criar uma pagina de configuracoes",
    "criar uma página de configurações",
    "criar uma pagina de definicoes",
    "criar uma página de definições",
    "criar um fluxo de onboarding",
    "conceber um checkout",
    "conceber uma pagina",
    "conceber uma página",
    "estruturar uma pagina",
    "estruturar uma página",
    "estruturar um fluxo",
    "structure a page",
    "structure a flow",
)

_COMPONENT_DISCOVERY_MARKERS = (
    "need something for navigation",
    "need something for feedback",
    "need a feedback component",
    "need a loading pattern",
    "need a navigation component",
    "preciso de algo para navegacao",
    "preciso de algo para navegação",
    "preciso de um componente de feedback",
    "preciso de um padrao de carregamento",
    "preciso de um padrão de carregamento",
    "preciso de algo para feedback",
    "preciso de algo para carregamento",
)

_DISCOVERY_CAPABILITY_MARKERS: dict[DiscoveryCapability, tuple[str, ...]] = {
    "navigation": ("navegacao", "navegação", "navigation", "menu", "tabs"),
    "feedback": ("feedback", "notificacao", "notificação", "toast", "alerta", "alert"),
    "loading": ("carregamento", "loading", "skeleton", "spinner"),
    "data_display": ("tabela", "table", "lista", "list", "dados", "data display"),
    "input": ("entrada", "input", "campo", "field", "selecao", "seleção"),
    "confirmation": ("confirmacao", "confirmação", "confirmation", "destructive"),
}

_ENTITY_LOOKUP_BLOCKERS = (
    "tem ",
    "existe ",
    "have ",
    "has ",
    "where is ",
    "onde fica ",
    "onde esta ",
    "onde está ",
    "when to use ",
    "quando usar ",
    "quando devo usar ",
)

_PAGE_BLUEPRINTS: dict[PageType, dict[str, Any]] = {
    "homepage": {
        "label": "Homepage",
        "primary_components": ["Button", "Card", "Link", "Typography", "Icon"],
        "supporting_components": ["Tabs", "Alert", "Skeleton Loader"],
        "structure": [
            "Hero with primary CTA",
            "Value proposition or feature highlights",
            "Supporting content blocks",
            "Persistent navigation and footer links",
        ],
        "practices": [
            "Keep one primary action above the fold.",
            "Use Card for scannable feature groupings.",
            "Reserve Skeleton Loader for async sections.",
        ],
    },
    "landing_page": {
        "label": "Landing page",
        "primary_components": ["Button", "Card", "Typography", "Link"],
        "supporting_components": ["Alert", "Form Field", "Input / Text Input"],
        "structure": [
            "Hero with value proposition",
            "Proof or benefits section",
            "Conversion CTA block",
            "Optional lead-capture form",
        ],
        "practices": [
            "Use a single dominant CTA per viewport.",
            "Keep form fields minimal in the first conversion step.",
        ],
    },
    "dashboard": {
        "label": "Dashboard",
        "primary_components": ["Card", "Table/Data Table", "Tabs", "Button"],
        "supporting_components": ["Alert", "Select/Dropdown", "Skeleton Loader"],
        "structure": [
            "Summary metrics or KPI cards",
            "Primary data table or chart area",
            "Filters and secondary actions",
            "Detail drawer or modal for drill-down",
        ],
        "practices": [
            "Prioritize scanability with Card summaries before dense tables.",
            "Use Tabs to separate operational views without page reload.",
        ],
    },
    "form": {
        "label": "Form",
        "primary_components": [
            "Form Field",
            "Input / Text Input",
            "Button",
            "Select/Dropdown",
        ],
        "supporting_components": [
            "Checkbox",
            "Radio Button",
            "Date Picker",
            "Text Area",
            "Alert",
        ],
        "structure": [
            "Sectioned field groups",
            "Inline validation and helper text",
            "Primary submit and secondary cancel actions",
            "Success or error feedback region",
        ],
        "practices": [
            "Wrap every control in Form Field for label, error and helper consistency.",
            "Use Alert or Toast/Notification for submission feedback.",
        ],
    },
    "checkout": {
        "label": "Checkout",
        "primary_components": ["Card", "Form Field", "Input / Text Input", "Button"],
        "supporting_components": ["Alert", "Modal/Dialog", "Radio Button"],
        "structure": [
            "Order summary",
            "Payment and shipping steps",
            "Confirmation and review",
            "Error recovery and trust signals",
        ],
        "practices": [
            "Keep progressive disclosure with a wizard or stepped Card layout.",
            "Use Modal/Dialog only for irreversible confirmation.",
        ],
    },
    "settings": {
        "label": "Settings page",
        "primary_components": ["Tabs", "Form Field", "Toggle/Switch", "Button"],
        "supporting_components": ["Select/Dropdown", "Alert", "Card"],
        "structure": [
            "Settings categories via Tabs",
            "Grouped preference controls",
            "Save / reset actions",
            "Inline confirmation for risky changes",
        ],
        "practices": [
            "Prefer Toggle/Switch for binary preferences.",
            "Use Alert for destructive-setting warnings.",
        ],
    },
    "onboarding": {
        "label": "Onboarding",
        "primary_components": ["Card", "Button", "Typography", "Tabs"],
        "supporting_components": ["Modal/Dialog", "Form Field", "Progress indicators"],
        "structure": [
            "Welcome step",
            "Guided setup tasks",
            "Completion or success state",
            "Optional skip path",
        ],
        "practices": [
            "Limit each step to one decision.",
            "Use Card to frame each onboarding task.",
        ],
    },
    "modal": {
        "label": "Modal flow",
        "primary_components": ["Modal/Dialog", "Button", "Form Field"],
        "supporting_components": ["Alert", "Input / Text Input", "Checkbox"],
        "structure": [
            "Trigger action",
            "Focused modal content",
            "Primary and dismissive actions",
            "Post-close feedback",
        ],
        "practices": [
            "Keep modal tasks short; move long flows to a dedicated page.",
            "Always provide an explicit dismiss action.",
        ],
    },
    "wizard": {
        "label": "Wizard / guided flow",
        "primary_components": ["Button", "Form Field", "Card", "Tabs"],
        "supporting_components": ["Input / Text Input", "Select/Dropdown", "Alert"],
        "structure": [
            "Step indicator",
            "Step content panel",
            "Back / next navigation",
            "Review and confirm step",
        ],
        "practices": [
            "Persist entered data between steps.",
            "Disable the primary action until the current step is valid.",
        ],
    },
    "generic_page": {
        "label": "Product page",
        "primary_components": ["Card", "Button", "Typography", "Link"],
        "supporting_components": ["Tabs", "Form Field", "Alert"],
        "structure": [
            "Page header and context",
            "Primary content area",
            "Supporting actions",
            "Feedback or empty states",
        ],
        "practices": [
            "Start from the user goal, then map components to each region.",
            "Prefer documented Velaris components over custom markup.",
        ],
    },
}

_DISCOVERY_BLUEPRINTS: dict[DiscoveryCapability, dict[str, Any]] = {
    "navigation": {
        "label": "Navigation",
        "recommended_components": ["Tabs", "Link", "Command Palette / Barra de Comandos"],
        "patterns": ["Primary navigation", "Section switching", "Command-driven jump"],
    },
    "feedback": {
        "label": "Feedback",
        "recommended_components": ["Toast/Notification", "Alert", "Explanation Bubble / Tooltip"],
        "patterns": ["Transient success", "Blocking warning", "Contextual help"],
    },
    "loading": {
        "label": "Loading",
        "recommended_components": ["Skeleton Loader"],
        "patterns": ["Content placeholder", "Perceived performance"],
    },
    "data_display": {
        "label": "Data display",
        "recommended_components": ["Table/Data Table", "Card"],
        "patterns": ["Dense collections", "Scannable summaries"],
    },
    "input": {
        "label": "Input",
        "recommended_components": [
            "Form Field",
            "Input / Text Input",
            "Select/Dropdown",
            "Text Area",
        ],
        "patterns": ["Single field capture", "Choice selection", "Long-form entry"],
    },
    "confirmation": {
        "label": "Confirmation",
        "recommended_components": ["Modal/Dialog", "Button", "Alert"],
        "patterns": ["Destructive confirmation", "Irreversible action guard"],
    },
    "generic": {
        "label": "Capability discovery",
        "recommended_components": ["Card", "Button", "Link"],
        "patterns": ["Start from the interaction goal", "Map to catalog components"],
    },
}


def _contains_any(normalized: str, terms: tuple[str, ...]) -> bool:
    return any(term in normalized for term in terms)


def _looks_like_entity_lookup(normalized: str) -> bool:
    return _contains_any(normalized, _ENTITY_LOOKUP_BLOCKERS)


def detect_page_type(normalized: str) -> PageType:
    for page_type, markers in _PAGE_TYPE_MARKERS.items():
        if _contains_any(normalized, markers):
            return page_type
    if _contains_any(normalized, ("build a page", "create a page", "criar uma pagina", "criar uma página")):
        return "generic_page"
    return "generic_page"


def detect_discovery_capability(normalized: str) -> DiscoveryCapability:
    for capability, markers in _DISCOVERY_CAPABILITY_MARKERS.items():
        if _contains_any(normalized, markers):
            return capability
    return "generic"


def _has_named_catalog_component(entities: ExtractedEntities) -> bool:
    return bool(entities.components)


def resolve_page_recommendation_intent(
    query: str,
    *,
    normalized_query: str | None = None,
    entities: ExtractedEntities | None = None,
) -> PageRecommendationResolution | None:
    """Return a page-level recommendation intent when the query is not entity lookup."""
    normalized = normalized_query or normalize_query(query)
    entities = entities or ExtractedEntities()

    if _looks_like_entity_lookup(normalized):
        return None
    if _has_named_catalog_component(entities):
        return None

    page_type = detect_page_type(normalized)

    if _contains_any(normalized, _COMPONENT_DISCOVERY_MARKERS):
        return PageRecommendationResolution(
            intent="component_discovery",
            page_type=page_type,
            discovery_capability=detect_discovery_capability(normalized),
        )

    if _contains_any(normalized, _PAGE_ARCHITECTURE_MARKERS):
        return PageRecommendationResolution(
            intent="page_architecture",
            page_type=page_type,
        )

    if _contains_any(normalized, _COMPONENT_RECOMMENDATION_MARKERS):
        return PageRecommendationResolution(
            intent="component_recommendation",
            page_type=page_type,
        )

    build_markers = (
        "build a ",
        "create a ",
        "criar um ",
        "criar uma ",
        "me ajude a criar",
        "ajuda-me a criar",
        "help me to build",
        "help me build",
        "help me create",
    )
    page_markers = tuple(
        marker
        for markers in _PAGE_TYPE_MARKERS.values()
        for marker in markers
    ) + ("pagina", "página", "page", "screen", "tela", "ecra", "ecrã")

    if _contains_any(normalized, build_markers) and _contains_any(normalized, page_markers):
        return PageRecommendationResolution(
            intent="component_recommendation",
            page_type=page_type,
        )

    return None


def is_page_level_recommendation(understanding: QueryUnderstanding) -> bool:
    if understanding.user_intent in {"page_architecture", "component_discovery"}:
        return True
    return (
        understanding.user_intent == "component_recommendation"
        and bool(understanding.page_type)
        and not understanding.entities.components
        and not understanding.exact_entity_matches
    )


def _resolve_catalog_components(names: list[str]) -> list[dict[str, str]]:
    registry = component_registry()
    resolved: list[dict[str, str]] = []
    for name in names:
        for component in registry.values():
            if component.name == name:
                resolved.append(
                    {
                        "component_id": component.component_id,
                        "name": component.name,
                        "status": component.status,
                    }
                )
                break
    return resolved


def build_page_recommendation_contract(
    *,
    query: str,
    understanding: QueryUnderstanding,
    profile: str,
    english: bool = False,
) -> dict[str, Any]:
    page_type = understanding.page_type or "generic_page"
    intent = understanding.user_intent

    if intent == "component_discovery":
        capability = understanding.discovery_capability or "generic"
        blueprint = _DISCOVERY_BLUEPRINTS.get(capability, _DISCOVERY_BLUEPRINTS["generic"])
        components = _resolve_catalog_components(blueprint["recommended_components"])
        return {
            "intent": intent,
            "discovery_capability": capability,
            "label": blueprint["label"],
            "recommended_components": components,
            "patterns": blueprint["patterns"],
            "response_requirements": [
                "Recommend documented Velaris components for the requested capability.",
                "Explain when to use each option and the main trade-off.",
                "Suggest a simple composition pattern.",
                "Do not claim a named component exists if it is absent from the catalog.",
            ],
            "profile": profile,
            "english": english,
            "query": query,
        }

    blueprint = _PAGE_BLUEPRINTS.get(page_type, _PAGE_BLUEPRINTS["generic_page"])
    primary = _resolve_catalog_components(blueprint["primary_components"])
    supporting = _resolve_catalog_components(blueprint["supporting_components"])

    requirements = [
        "Recommend components from the Velaris catalog for the requested page goal.",
        "Propose a page structure with clear sections.",
        "Justify each component choice with the user goal in mind.",
        "Include practical best practices grounded in the design system.",
        "Never answer with 'component not found' for a page-building request.",
    ]
    if intent == "page_architecture":
        requirements.insert(1, "Focus on information architecture and flow before micro-details.")

    return {
        "intent": intent,
        "page_type": page_type,
        "label": blueprint["label"],
        "primary_components": primary,
        "supporting_components": supporting,
        "structure": blueprint["structure"],
        "practices": blueprint["practices"],
        "response_requirements": requirements,
        "profile": profile,
        "english": english,
        "query": query,
    }
