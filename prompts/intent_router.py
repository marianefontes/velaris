"""Intent and command routing for Beatrice's semantic prompt pipeline."""

from dataclasses import dataclass

from agent.models import QueryUnderstanding
from agent.understanding import analyze_query, normalize_text
from prompts.perspective_ids import normalize_profile_id

from cognition.engines.registry import resolve_engine


CATALOG_KEYWORDS: list[str] = [
    "liste os componentes", "listar componentes", "mostrar componentes",
    "liste os tokens", "listar tokens", "mostrar tokens",
    "liste os patterns", "listar patterns", "mostrar patterns",
    "liste os padrões", "listar padrões", "mostrar padrões",
    "quais são os componentes", "quais componentes existem",
    "quais primitives", "design primitives", "architectural entities",
    "todos os componentes", "todos os tokens", "todos os patterns",
    "todos os padrões", "catálogo", "catalogo", "inventário", "inventario",
    "todas as entidades", "mostre os componentes", "me mostre os componentes",
    "me liste", "liste tudo", "listar tudo",
    "list components", "list tokens", "list patterns", "all components",
    "all tokens", "all patterns", "component list", "show components",
    "component catalog", "token catalog", "full registry",
    "component inventory", "show all", "list all", "what components",
    "which components", "what are the components", "entities", "registry",
]

CATALOG_ENTITY_KEYWORDS: dict[str, list[str]] = {
    "components": ["component", "componente", "components", "componentes"],
    "tokens": ["token", "tokens", "cor", "color", "tipografia", "typography", "spacing", "espaçamento"],
    "patterns": ["pattern", "patterns", "padrão", "padrões", "padrao", "padroes"],
    "decisions": ["decision", "decisions", "decisão", "decisões", "decisao", "decisoes"],
}

INTENT_FILTER: dict[str, list[str]] = {
    "component_guidance": ["component", "xai_component"],
    "pattern_guidance": ["pattern"],
    "token_lookup": ["token", "token_alias"],
    "accessibility_guidance": [
        "component",
        "xai_component",
        "guideline",
        "foundation",
        "token",
        "token_alias",
    ],
    "design_decision": ["design_decision"],
    "when_not_to_use": ["component", "guideline", "xai_component"],
    "xai_explanation": ["xai_component", "foundation", "reasoning"],
    "new_product_scaffolding": ["pattern", "component", "xai_component", "guideline", "dev_integration"],
    "comparison_query": [],
    "general": [],
}

INTENT_KEYWORDS: dict[str, list[str]] = {
    "component_guidance": [
        "componente", "component", "qual usar", "which component",
        "que componente", "usar para mostrar", "usar para capturar",
    ],
    "pattern_guidance": [
        "padrão", "padrao", "pattern", "tela de", "fluxo de",
        "como estruturar", "como montar", "layout de", "estrutura de",
        "how to structure",
    ],
    "token_lookup": [
        "token", "tipografia", "typography", "espaçamento", "spacing",
        "fonte", "cor de", "color", "paleta", "palette",
    ],
    "design_decision": [
        "por que", "porque", "why", "decisão", "decision", "escolheu",
        "chose", "regra", "rule", "motivo", "razão", "racional",
    ],
    "when_not_to_use": [
        "quando não", "when not", "evitar", "avoid", "não devo usar",
        "nao devo usar", "should not", "não usar", "nao usar",
    ],
    "xai_explanation": [
        "confiança", "confidence", "explicabilidade", "explainability",
        "explicar por que", "explain why", "ia recomendou",
        "por que a ia", "como a ia decidiu", "source attribution",
        "explicar uma recomendação", "explicar recomendação",
        "recomendação da ia", "recomendacao da ia", "rastreabilidade",
    ],
    "new_product_scaffolding": [
        "novo produto", "novo módulo", "novo modulo", "do zero",
        "scaffold", "bootstrap", "new product", "new module",
    ],
    "comparison_query": [
        "diferença entre", "diferenca entre", "vs", "versus",
        "comparar", "compare", "difference between", "em vez de",
        "instead of",
    ],
}

COMMAND_INTENT_OVERRIDE: dict[str, str] = {
    "enforce": "general",
    "migrate": "general",
    "tradeoff": "general",
    "capture": "general",
    "document": "design_decision",
    "feedback-review": "design_decision",
    "token-impact": "token_lookup",
    "contract-check": "component_guidance",
}

COMMAND_ALIASES: dict[str, str] = {
    "learn": "feedback-review",
}


@dataclass(frozen=True)
class RoutingResult:
    retrieval_intent: str
    response_intent: str
    top_k: int
    catalog_mode: bool
    catalog_entity: str
    active_command_mode: str | None
    persona_profile: str
    understanding: QueryUnderstanding


def detect_catalog_mode(query: str) -> bool:
    q = query.lower()
    return any(keyword in q for keyword in CATALOG_KEYWORDS)


def detect_catalog_entity(query: str) -> str:
    q = query.lower()
    for entity, keywords in CATALOG_ENTITY_KEYWORDS.items():
        if any(keyword in q for keyword in keywords):
            return entity
    return "all"


def classify_intent(query: str) -> str:
    understanding = analyze_query(query)
    mapped = {
        "greeting": "general",
        "small_talk": "general",
        "navigation_query": "general",
        "semantic_navigation_query": "general",
        "perspective_lookup": "general",
        "entity_lookup": "general",
        "direct_entity_guidance": "general",
        "concept_query": "general",
        "legacy_name_query": "general",
        "component_recommendation": "component_guidance",
        "component_comparison": "comparison_query",
        "pattern_guidance": "pattern_guidance",
        "token_lookup": "token_lookup",
        "accessibility_guidance": "accessibility_guidance",
        "design_decision": "design_decision",
        "xai_explanation": "xai_explanation",
        "catalog": "general",
        "language_followup": "general",
        "help_request": "general",
        "general_design_system": "general",
        "out_of_scope": "general",
    }
    intent = mapped[understanding.user_intent]
    normalized = normalize_text(query)
    if (
        intent == "component_guidance"
        and any(
            marker in normalized
            for marker in (
                "quando nao",
                "nao devo usar",
                "quando eu nao",
                "when not",
                "avoid",
            )
        )
    ):
        return "when_not_to_use"
    return intent


def response_intent_for_catalog(entity: str) -> str:
    if entity == "components":
        return "component_guidance"
    if entity == "tokens":
        return "token_lookup"
    if entity == "patterns":
        return "pattern_guidance"
    if entity == "decisions":
        return "design_decision"
    return "general"


def route_query(query: str, profile: str = "general", command_mode: str | None = None) -> RoutingResult:
    understanding = analyze_query(query)
    profile = normalize_profile_id(profile)
    legacy_command_mode = (
        profile
        if profile in COMMAND_INTENT_OVERRIDE or profile in COMMAND_ALIASES or resolve_engine(profile)
        else None
    )
    requested_command_mode = command_mode or legacy_command_mode
    active_command_mode = COMMAND_ALIASES.get(requested_command_mode, requested_command_mode)
    persona_profile = "general" if legacy_command_mode else profile

    # Oracle Engines take priority over catalog/intent detection: when the user
    # selects an engine, its retrieval intent and depth govern the request.
    engine = resolve_engine(active_command_mode)
    if engine is not None:
        return RoutingResult(
            retrieval_intent=engine.retrieval_intent,
            response_intent=engine.retrieval_intent,
            top_k=engine.top_k,
            catalog_mode=False,
            catalog_entity="none",
            active_command_mode=engine.id,
            persona_profile=persona_profile,
            understanding=understanding,
        )

    if detect_catalog_mode(query):
        catalog_entity = detect_catalog_entity(query)
        return RoutingResult(
            retrieval_intent="general",
            response_intent=response_intent_for_catalog(catalog_entity),
            top_k=12,
            catalog_mode=True,
            catalog_entity=catalog_entity,
            active_command_mode=active_command_mode,
            persona_profile=persona_profile,
            understanding=understanding,
        )

    if active_command_mode in COMMAND_INTENT_OVERRIDE:
        command_intent = COMMAND_INTENT_OVERRIDE[active_command_mode]
        return RoutingResult(
            retrieval_intent=command_intent,
            response_intent=command_intent,
            top_k=5,
            catalog_mode=False,
            catalog_entity="none",
            active_command_mode=active_command_mode,
            persona_profile=persona_profile,
            understanding=understanding,
        )

    intent = classify_intent(query)
    top_k = {
        "component_guidance": 5,
        "comparison_query": 6,
        "pattern_guidance": 5,
        "token_lookup": 4,
        "accessibility_guidance": 6,
        "design_decision": 5,
        "xai_explanation": 5,
        "when_not_to_use": 5,
    }.get(intent, 4)
    return RoutingResult(
        retrieval_intent=intent,
        response_intent=intent,
        top_k=top_k,
        catalog_mode=False,
        catalog_entity="none",
        active_command_mode=active_command_mode,
        persona_profile=persona_profile,
        understanding=understanding,
    )
