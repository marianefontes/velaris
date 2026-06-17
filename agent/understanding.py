from __future__ import annotations

import re
import unicodedata
from functools import lru_cache

from component_metadata import component_catalog

from .entity_alias_registry import COMPONENT_ALIASES, PATTERN_ENTITY_ALIASES
from .decision_intelligence import detect_decision_analysis_mode
from .strategic_reasoning import detect_architect_review_mode

from .models import (
    AnswerStrategy,
    ExtractedEntities,
    QueryUnderstanding,
    UserIntent,
    UserLanguage,
)


_PATTERN_ALIASES: dict[str, tuple[str, ...]] = {
    "Side Drawer": PATTERN_ENTITY_ALIASES["side-drawer"],
    "Dashboard": ("dashboard",),
    "Multi-step Form": ("multi step form", "formulario multi etapas", "formulário multi-etapas"),
    "Onboarding": ("onboarding",),
    "Data Explorer": ("data explorer", "explorador de dados"),
    "Empty States": ("empty state", "empty states", "estado vazio", "estados vazios"),
    "Settings & Config": ("settings", "configuracao", "configuração"),
    "Command Center": ("command center", "central de comandos"),
    "Focus Mode": ("focus mode", "modo foco"),
    "Collaboration": ("collaboration", "colaboracao", "colaboração"),
    "Timeline": ("timeline", "linha do tempo"),
    "Entity Picker": ("entity picker", "seletor de entidade"),
}

_STATE_TERMS: dict[str, tuple[str, ...]] = {
    "disabled": ("disabled", "desabilitado", "desativado"),
    "loading": ("loading", "carregando", "a carregar"),
    "error": ("error", "erro"),
    "success": ("success", "sucesso"),
    "focus": ("focus", "foco"),
    "hover": ("hover",),
    "selected": ("selected", "selecionado"),
    "empty": ("empty", "vazio"),
    "expanded": ("expanded", "expandido"),
    "checked": ("checked", "marcado"),
}

_INTERACTION_INTENTS: dict[str, tuple[str, ...]] = {
    "destructive": ("destructive", "destrutivo", "destrutiva", "excluir", "apagar", "delete"),
    "primary": ("primary", "primario", "primário"),
    "secondary": ("secondary", "secundario", "secundário"),
    "positive": ("positive", "positivo", "positiva"),
    "negative": ("negative", "negativo", "negativa"),
    "warning": ("warning", "aviso", "alerta"),
    "info": ("info", "informativo", "informativa"),
    "selection": ("selection", "selecao", "seleção", "escolher", "choose"),
    "feedback": ("feedback", "retorno"),
    "trust": ("trust", "confianca", "confiança"),
    "confirmation": ("confirmation", "confirmacao", "confirmação", "confirmar"),
    "filtering": ("filter", "filters", "filtro", "filtros"),
}

_CONTEXT_TERMS: dict[str, tuple[str, ...]] = {
    "form": ("form", "formulario", "formulário"),
    "onboarding": ("onboarding",),
    "dashboard": ("dashboard",),
    "filters": ("filters", "filtros"),
    "mobile": ("mobile", "movel", "móvel"),
    "ai_response": ("ai response", "resposta da ia", "resposta de ia"),
    "settings": ("settings", "configuracao", "configuração"),
}

_ACCESSIBILITY_TERMS: dict[str, tuple[str, ...]] = {
    "keyboard": ("keyboard", "teclado"),
    "focus": ("focus", "foco"),
    "aria": ("aria",),
    "contrast": ("contrast", "contraste"),
    "screen_reader": ("screen reader", "leitor de tela", "leitor de ecra", "leitor de ecrã"),
    "touch_target": ("touch target", "alvo de toque"),
    "label": ("label", "rotulo", "rótulo"),
    "disabled": ("disabled", "desabilitado", "desativado"),
    "accessible": ("accessible", "accessibility", "acessivel", "acessível", "acessibilidade"),
}

_RISK_TERMS: dict[str, tuple[str, ...]] = {
    "destructive_action": ("destructive", "destrutivo", "destrutiva", "excluir", "apagar", "delete"),
    "irreversible_action": ("irreversible", "irreversivel", "irreversível", "sem volta"),
    "false_certainty": ("false certainty", "falsa certeza"),
    "cognitive_overload": ("cognitive overload", "sobrecarga cognitiva"),
}

_TOKEN_CATEGORIES: dict[str, tuple[str, ...]] = {
    "color": ("color", "cor", "palette", "paleta"),
    "brand": ("brand", "marca", "destaque"),
    "typography": ("typography", "tipografia", "font", "fonte"),
    "spacing": ("spacing", "espacamento", "espaçamento"),
    "radius": ("radius", "raio"),
    "shadow": ("shadow", "sombra"),
    "surface": ("surface", "superficie", "superfície"),
    "motion": ("motion", "movimento", "animacao", "animação"),
    "semantic_state": ("error", "erro", "success", "sucesso", "warning", "aviso", "info"),
}

_TOKEN_PATTERN = re.compile(
    r"(?<![\w-])(?:--[a-z0-9-]+|"
    r"(?:primary|surface|text|border|state|feedback|shadow|motion|space|radius|"
    r"focus|control|target|icon|heading|body|label|caption|code|xai|z)-[a-z0-9-]+)"
)

_CATALOG_TERMS = (
    "liste", "listar", "list all", "list components", "list tokens",
    "show all", "todos os", "todas as",
    "quais existem", "catalogo", "catálogo", "inventory", "inventario", "inventário",
)
_RECOMMENDATION_TERMS = (
    "qual componente", "que componente", "which component", "what component",
    "recomende", "recomenda", "recommend", "devo usar", "should i use",
    "uso para", "use for",
)

_IMPLEMENTATION_SIGNALS: tuple[str, ...] = (
    "implemento", "implementar", "implement",
    "como usar", "how to use", "how do i use", "how do i",
    "como uso", "exemplo de", "me de um exemplo", "give me an example",
    "me mostre", "show an example",
    "codigo", "codigo de", "snippet", "exemplo de codigo",
    "como faço", "como fazer", "how to", "how can i",
    "como integro", "como integrar", "how to integrate",
    "usando os intents", "using the intents", "usando intents",
    "usando os states", "using states", "usando states",
    "usando props", "using props",
)

_AUDIT_REQUEST_SIGNALS: tuple[str, ...] = (
    "isto esta certo", "isso esta certo", "this is correct", "is this correct",
    "tem problema", "has a problem", "ha problema", "tem algum problema",
    "esta certo", "esta errado", "is this wrong", "is this right",
    "pode usar assim", "can i use it this way", "posso usar assim",
    "faz sentido", "makes sense", "does this make sense",
    "como melhoro", "how do i improve", "como melhorar",
    "quais riscos", "what are the risks", "riscos de usar",
    "auditoria", "audit", "validar uso", "validate usage",
    "tenho tres", "tenho 3", "i have three", "i have 3",
    "multiplos", "multiple", "varios", "several",
)
_COMPARISON_TERMS = (
    " vs ", " versus ", "compare", "comparar", "comparacao", "comparação",
    "diferenca entre", "diferença entre", "em vez de", "instead of",
)
_PATTERN_TERMS = (
    "pattern", "padrao", "padrão", "como estruturar", "how to structure",
    "estrutura de tela", "screen structure", "fluxo", "flow",
)
_TOKEN_TERMS = (
    "token", "tokens", "tipografia", "typography", "spacing", "espacamento",
    "espaçamento", "palette", "paleta", "cor ", "color ", "radius", "shadow",
)
_DECISION_TERMS = (
    "por que usar", "por que nao", "por que não", "racional", "rationale",
    "trade off", "trade-off", "decisao", "decisão", "decision",
)
_XAI_TERMS = (
    "como sabe", "how do you know", "qual fonte", "which source",
    "por que a beatrice", "why did beatrice", "beatrice recomendou",
    "beatrice recommended", "chatgpt generico", "chatgpt genérico",
    "source attribution", "rastreabilidade",
)
_LANGUAGE_FOLLOWUP_TERMS = (
    "em portugues", "em português", "in portuguese", "in english",
    "em ingles", "em inglês", "pt-br", "pt-pt", "portuguese",
)
_GREETING_TERMS: frozenset[str] = frozenset({
    "oi",
    "ola",
    "opa",
    "e ai",
    "bom dia",
    "boa tarde",
    "boa noite",
    "salve",
    "hi",
    "hello",
    "hey",
    "good morning",
    "good afternoon",
    "good evening",
})
_SMALL_TALK_TERMS: frozenset[str] = frozenset({
    "tudo bem",
    "como estas",
    "como vai",
    "estas online",
    "voce esta online",
    "ajudas me",
    "ajuda me",
    "me ajuda",
    "preciso de ajuda",
    "podes ajudar",
    "pode me ajudar",
    "help",
    "help me",
    "how are you",
    "how are you doing",
    "are you online",
    "can you help me",
    "could you help me",
})
_ORACLE_NAME_SUFFIXES = ("abraxos", "velaris", "beatrice")
_GREETING_WORD_ALIASES: dict[str, str] = {
    "oie": "oi",
    "oiee": "oi",
    "oieee": "oi",
    "oii": "oi",
    "oiii": "oi",
    "eai": "e ai",
}
_INTERNAL_TYPO_PHRASES: tuple[tuple[str, str], ...] = (
    ("radio buton", "radio button"),
    ("radio boton", "radio button"),
    ("date pickr", "date picker"),
    ("check box", "checkbox"),
)
_INTERNAL_TYPO_WORDS: dict[str, str] = {
    "buton": "button",
    "boton": "button",
    "botao": "button",
    "componete": "componente",
    "componenete": "componente",
    "padrao": "padrao",
    "perspectva": "perspectiva",
}
_EMOJI_PATTERN = re.compile(
    "["
    "\U0001F300-\U0001FAFF"
    "\U00002700-\U000027BF"
    "\U00002600-\U000026FF"
    "\U0001F600-\U0001F64F"
    "]+",
    flags=re.UNICODE,
)
_HELP_REQUEST_TERMS = (
    "pode ajudar com o que",
    "me ajudar com o que", "ajudar com o que", "com o que voce ajuda",
    "como voce pode me ajudar", "como voce ajuda", "como pode ajudar",
    "o que voce faz", "o que voce sabe fazer", "o que sabe fazer",
    "o que voce consegue", "que tipo de ajuda",
    "quais perguntas posso fazer", "que perguntas posso fazer",
    "o que posso perguntar", "o que posso te perguntar",
    "what can you help", "what do you do", "how can you help",
    "what can you do", "what can i ask", "what questions can i ask",
    "help me with what", "what are your capabilities", "suas capacidades",
    "quem e voce", "who are you",
)
_DOMAIN_TERMS = (
    "aetheris", "velaris", "beatrice", "design system", "sistema de design",
    "interface", "ux", "component", "componente", "pattern", "padrao", "padrão",
    "token", "acessibilidade", "accessibility",
)
_EXPLICIT_OUT_OF_SCOPE = (
    "previsao do tempo", "previsão do tempo", "weather forecast",
    "placar do jogo", "sports score", "receita culinaria", "receita culinária",
    "horoscopo", "horóscopo", "cotacao do dolar", "cotação do dólar",
)
_EXPLICIT_NONEXISTENT = (
    "que nao existe", "que não existe", "does not exist", "doesn't exist",
    "inexistente", "inventado", "invented",
)
_NAVIGATION_TERMS = (
    "onde acho", "onde posso achar", "onde posso encontrar", "onde vejo",
    "onde ficam", "onde encontro", "onde esta", "onde está", "onde fica",
    "onde mudo", "onde mudar", "cade", "cadê", "quero ver", "quero achar",
    "quero encontrar", "como acesso", "como acedo", "how do i access",
    "where can i find", "where do i find", "where is", "where are",
    "em qual pagina", "em que pagina", "qual pagina tem", "qual página tem",
    "como abro", "how do i open", "como chego", "how do i get to",
    "como mudo", "como mudar", "mudar para", "mudo para", "switch to",
)
_ENTITY_LOOKUP_TERMS = (
    "voce tem", "você tem", "voces tem", "vocês têm",
    "tem o componente", "tem componente de", "tem componente",
    "possui ", "no catalogo", "no catálogo",
    "existe no catalogo", "existe no catálogo", "esta no catalogo",
    "está no catálogo", "qual e o componente", "qual é o componente",
    "o velaris possui", "o velaris tem", "do you have", "is there a",
    "does velaris have", "button existe", "existe button",
)
_NATURAL_ENTITY_LOOKUP_MARKERS = (
    "me mostra",
    "mostra ",
    "quero ver",
    "onde fica",
    "onde encontro",
    "abrir ",
    "abre ",
    "open ",
    "show me",
    "show ",
)
_DIRECT_GUIDANCE_TERMS = (
    "quando usar", "when to use", "quando nao usar", "quando não usar",
    "when not to use", "para que serve", "what is it for", "como usar",
    "how to use", "como funciona", "how does", "quando devo usar",
    "when should i use",
    "orientacao de uso", "orientação de uso", "usage guidance",
    "anti-pattern", "anti pattern", "antipattern",
    "quais estados", "what states", "estados do", "states of",
    "acessibilidade do", "accessibility of", "a11y do",
)
_ENTITY_LOOKUP_BLOCKERS = (
    "qual componente devo", "qual componente uso", "which component should",
    "devo usar", "should i use", "recomende", "recommend",
    "opcoes mutuamente exclusivas", "opções mutuamente exclusivas",
    "mutually exclusive", "como implemento", "how do i implement",
)
_LEGACY_ORACLE_TERMS = (
    "o que e beatrice", "o que é beatrice", "what is beatrice",
    "quem e beatrice", "quem é beatrice", "o que era beatrice",
    "o que era a beatrice",
)
_LEGACY_SYSTEM_TERMS = (
    "o que e aetheris", "o que é aetheris", "what is aetheris",
    "o que era aetheris", "o que era o aetheris",
)


def normalize_text(value: str) -> str:
    decomposed = unicodedata.normalize("NFKD", value.lower())
    ascii_text = "".join(
        character
        for character in decomposed
        if not unicodedata.combining(character)
    )
    return " ".join(re.sub(r"[^a-z0-9_:/.-]+", " ", ascii_text).split())


def _collapse_repeated_greeting_word(word: str) -> str:
    if re.fullmatch(r"o+i+e*", word):
        return "oi"
    if re.fullmatch(r"o+l+a+", word):
        return "ola"
    if re.fullmatch(r"dia+", word):
        return "dia"
    if re.fullmatch(r"tarde+", word):
        return "tarde"
    if re.fullmatch(r"noite+", word):
        return "noite"
    if re.fullmatch(r"opa+", word):
        return "opa"
    return word


def _strip_oracle_name_suffix(normalized: str) -> str:
    trimmed = normalized.strip()
    for name in _ORACLE_NAME_SUFFIXES:
        suffix = f" {name}"
        if trimmed.endswith(suffix):
            trimmed = trimmed[: -len(suffix)].strip()
    return trimmed


def _apply_greeting_word_aliases(text: str) -> str:
    words = [
        _GREETING_WORD_ALIASES.get(word, word)
        for word in text.split()
    ]
    return " ".join(words)


def _apply_internal_typos(text: str) -> str:
    normalized = text
    for source, target in _INTERNAL_TYPO_PHRASES:
        normalized = normalized.replace(source, target)
    return " ".join(
        _INTERNAL_TYPO_WORDS.get(word, word)
        for word in normalized.split()
    )


def normalize_query(value: str) -> str:
    """Normalize user input for operational intent classification."""
    without_emojis = _EMOJI_PATTERN.sub(" ", value)
    without_smileys = re.sub(r"[:;)(]+", " ", without_emojis)
    normalized = normalize_text(without_smileys)
    normalized = " ".join(normalized.replace("-", " ").split())
    normalized = _apply_internal_typos(normalized)
    normalized = _apply_greeting_word_aliases(normalized)
    normalized = " ".join(
        _collapse_repeated_greeting_word(word)
        for word in normalized.split()
    )
    return _strip_oracle_name_suffix(normalized)


def _matches_greeting(normalized_query: str) -> bool:
    if normalized_query in _GREETING_TERMS:
        return True
    for term in sorted(_GREETING_TERMS, key=len, reverse=True):
        if normalized_query.startswith(f"{term} "):
            return True
    return False


_SHORT_HELP_EXACT: frozenset[str] = frozenset({
    "me ajuda",
    "pode me ajudar",
    "podes ajudar",
    "ajudas me",
    "ajuda me",
    "preciso de ajuda",
    "help",
    "help me",
    "can you help me",
    "could you help me",
})


def _matches_small_talk(normalized_query: str) -> bool:
    if normalized_query in _SMALL_TALK_TERMS:
        return True
    if normalized_query in _SHORT_HELP_EXACT:
        return True
    for term in sorted(_SMALL_TALK_TERMS, key=len, reverse=True):
        if term in _SHORT_HELP_EXACT:
            continue
        if (
            normalized_query == term
            or normalized_query.startswith(f"{term} ")
            or normalized_query.endswith(f" {term}")
        ):
            return True
    return False


def _social_intent(normalized_query: str) -> UserIntent | None:
    if _matches_small_talk(normalized_query):
        return "small_talk"
    return None


def _contains_any(value: str, terms: tuple[str, ...]) -> bool:
    return any(normalize_text(term) in value for term in terms)


def _contains_pattern_terms(normalized: str) -> bool:
    if re.search(r"anti[- ]pattern", normalized):
        return False
    return any(_term_present(normalized, term) for term in _PATTERN_TERMS)


def _references_component(query: str, normalized: str, entities: ExtractedEntities) -> bool:
    from agent.catalog_registries import extract_cited_component_names

    if entities.components:
        return True
    if extract_cited_component_names(query):
        return True
    return _term_present(normalized, "componente") or _term_present(normalized, "component")


def _term_present(normalized: str, alias: str) -> bool:
    # Word-boundary match so short aliases like "aria" do not fire inside
    # unrelated words such as "primaria".
    normalized_alias = normalize_text(alias)
    if not normalized_alias:
        return False
    return bool(re.search(
        rf"(?<![a-z0-9]){re.escape(normalized_alias)}(?![a-z0-9])",
        normalized,
    ))


def _collect_terms(
    normalized: str,
    definitions: dict[str, tuple[str, ...]],
) -> list[str]:
    return [
        key
        for key, aliases in definitions.items()
        if any(_term_present(normalized, alias) for alias in aliases)
    ]


@lru_cache(maxsize=1)
def _component_names() -> dict[str, str]:
    return {
        component.component_id: component.name
        for component in component_catalog().components
    }


def _components(normalized: str) -> list[str]:
    matches: list[tuple[int, str]] = []
    for component_id, aliases in COMPONENT_ALIASES.items():
        for alias in aliases:
            normalized_alias = normalize_text(alias)
            if re.search(rf"(?<![a-z0-9]){re.escape(normalized_alias)}(?![a-z0-9])", normalized):
                matches.append((len(normalized_alias), component_id))
                break
    matches.sort(reverse=True)
    names = _component_names()
    return list(dict.fromkeys(names[component_id] for _, component_id in matches))


def _patterns(normalized: str) -> list[str]:
    return [
        name
        for name, aliases in _PATTERN_ALIASES.items()
        if any(normalize_text(alias) in normalized for alias in aliases)
    ]


# Arabic script (incl. supplement). Unambiguous: presence means Arabic.
_ARABIC_SCRIPT = re.compile(r"[؀-ۿݐ-ݿࢠ-ࣿ]")
# Other non-Latin scripts we can recognize but do not classify in detail.
# Detecting them lets Abraxos still mirror the language instead of refusing.
_OTHER_SCRIPT = re.compile(
    r"[Ѐ-ӿ"   # Cyrillic
    r"Ͱ-Ͽ"    # Greek
    r"֐-׿"    # Hebrew
    r"ऀ-ॿ"    # Devanagari
    r"฀-๿"    # Thai
    r"぀-ヿ"    # Hiragana + Katakana
    r"一-鿿"    # CJK
    r"가-힯]"   # Hangul
)
# High-precision Spanish raw markers (accents and inverted punctuation that
# Portuguese never uses). Any single hit is a strong Spanish signal.
_SPANISH_RAW_STRONG = ("ñ", "¿", "¡", "cómo", "qué", "cuál", "dónde", "cuándo", "por qué")
# Spanish function words that Portuguese does not use the same way. Two or more
# together indicate Spanish without colliding with Portuguese vocabulary.
_SPANISH_WORDS = (
    "tienes", "tiene", "tenes", "puedes", "puede", "necesito", "necesitas",
    "ventana", "una", "hay", "cuales", "ustedes", "vosotros", "gracias",
    "boton",
)
# High-precision French raw markers.
_FRENCH_RAW_STRONG = ("où", "qu'", "c'est", "est-ce", "être", "fenêtre", "français")
# French function words with no Portuguese or Spanish collision.
_FRENCH_WORDS = (
    "vous", "avez", "comment", "pouvez", "votre", "bonjour", "merci",
    "fenetre", "quelle", "je", "bouton",
)
# English-distinctive stopwords (no Portuguese collision). Two or more signal
# English even when the domain markers below are absent (e.g. "do you have a
# drawer component?").
_ENGLISH_WORDS = (
    "you", "the", "is", "are", "have", "does", "can", "with", "this", "that",
    "your", "which", "what", "how", "should", "when", "where", "not", "and",
    "there", "do", "want",
)


def _word_hits(normalized: str, words: tuple[str, ...]) -> int:
    return sum(1 for word in words if _term_present(normalized, word))


def _language(query: str, normalized: str) -> UserLanguage:
    raw = query.lower()
    # Script detection wins: it is unambiguous and lets Abraxos mirror the
    # language rather than fall back to a refusal.
    if _ARABIC_SCRIPT.search(query):
        return "ar"
    if _OTHER_SCRIPT.search(query):
        return "other"

    normalized_query = normalize_query(query)
    english_social_terms = {
        term
        for term in _GREETING_TERMS | _SMALL_TALK_TERMS
        if term.startswith(("hi", "hello", "hey", "good ", "how ", "are ", "can ", "could "))
        or term in {"hi", "hello", "hey"}
    }
    if normalized_query in english_social_terms:
        return "en"
    if any(normalized_query.startswith(f"{term} ") for term in english_social_terms):
        return "en"
    if any(term in normalized for term in ("pt-pt", "portugues de portugal", "portuguese portugal")):
        return "pt-PT"
    if any(term in normalized for term in ("pt-br", "portugues do brasil", "brazilian portuguese")):
        return "pt-BR"

    # Spanish and French detection requires strong evidence so Portuguese is
    # never misread. A single raw accent or punctuation marker is enough; a
    # single function word is not.
    if any(marker in raw for marker in _SPANISH_RAW_STRONG) or _word_hits(normalized, _SPANISH_WORDS) >= 2:
        return "es"
    if any(marker in raw for marker in _FRENCH_RAW_STRONG) or _word_hits(normalized, _FRENCH_WORDS) >= 2:
        return "fr"

    english_hits = sum(
        marker in normalized
        for marker in (
            " which ", " what ", " how ", " should ", " use ", " explain ",
            " accessible", "instead of", "in english",
        )
    )
    portuguese_hits = sum(
        marker in f" {normalized} "
        for marker in (
            " qual ", " como ", " quando ", " devo ", " usar ", " para ",
            " por que ", " explica ", " em portugues ", " tem ", " isto ",
        )
    )
    if english_hits > portuguese_hits and english_hits >= 1:
        return "en"
    if portuguese_hits or re.search(r"[ãõçáéíóúâêô]", raw):
        return "pt-BR"
    # Last resort before giving up: distinctive English stopwords with no
    # Portuguese collision (e.g. "do you have a drawer component?").
    if _word_hits(normalized, _ENGLISH_WORDS) >= 2:
        return "en"
    return "unknown"


def _is_component_comparison(
    normalized: str,
    components: list[str],
    patterns: list[str] | None = None,
) -> bool:
    if _contains_any(normalized, _COMPARISON_TERMS):
        return True
    pattern_count = len(patterns or [])
    if len(components) + pattern_count >= 2 and bool(
        re.search(r"\b(?:ou|or)\b", normalized)
    ):
        return True
    return len(components) >= 1 and pattern_count >= 1 and bool(
        re.search(r"\b(?:ou|or)\b", normalized)
    )


def _is_navigation_query(normalized: str) -> bool:
    return _contains_any(normalized, _NAVIGATION_TERMS)


def _resolve_location_intent(query: str, normalized: str) -> UserIntent | None:
    from agent.perspective_registry import resolve_perspective_match
    from agent.route_map import resolve_navigation_route
    from agent.semantic_navigation import (
        is_location_seeking_query,
        resolve_semantic_navigation,
    )

    location_seeking = is_location_seeking_query(query)
    perspective = resolve_perspective_match(
        query,
        require_context=not location_seeking,
    )
    perspective_context = any(
        marker in normalized
        for marker in (
            "perspectiva",
            "perspectivas",
            "perspective",
            "visao",
            "visão",
            "parte de",
            "mudo para",
            "mudar para",
            "perfil",
            "profile",
            "lente",
        )
    )
    if perspective is not None and (location_seeking or perspective_context):
        return "perspective_lookup"

    if _is_navigation_query(normalized) or location_seeking:
        if resolve_navigation_route(query) is not None:
            return "navigation_query"
        semantic = resolve_semantic_navigation(query)
        if semantic is not None:
            if semantic.kind == "perspective":
                return "perspective_lookup"
            return "semantic_navigation_query"

    if perspective is not None and perspective.confidence == "exact":
        return "perspective_lookup"

    return None


def _is_direct_entity_guidance(
    query: str,
    normalized: str,
    entities: ExtractedEntities,
) -> bool:
    if not _references_component(query, normalized, entities):
        from agent.entity_validation_gate import is_deictic_artifact_reference

        if not is_deictic_artifact_reference(normalized):
            return False
    return _contains_any(normalized, _DIRECT_GUIDANCE_TERMS)


def _is_entity_lookup_query(normalized: str, entities: ExtractedEntities) -> bool:
    if _contains_any(normalized, _DIRECT_GUIDANCE_TERMS):
        return False
    if _contains_any(normalized, _ENTITY_LOOKUP_BLOCKERS):
        return False
    if _contains_any(normalized, _DECISION_TERMS):
        return False
    if not entities.components and not _contains_any(normalized, _ENTITY_LOOKUP_TERMS):
        return False
    if entities.components and _contains_any(
        normalized,
        _NATURAL_ENTITY_LOOKUP_MARKERS,
    ):
        return True
    if _contains_any(normalized, _ENTITY_LOOKUP_TERMS):
        return True
    if entities.components and _contains_any(
        normalized,
        ("tem ", "possui ", "existe ", "existe o ", "have ", "has "),
    ):
        return True
    return False


def _intent(
    query: str,
    normalized: str,
    entities: ExtractedEntities,
    *,
    normalized_query: str | None = None,
) -> UserIntent:
    query_for_social = normalized_query if normalized_query is not None else normalized
    if _matches_greeting(query_for_social):
        return "greeting"
    if _contains_any(normalized, _HELP_REQUEST_TERMS):
        return "help_request"
    social = _social_intent(query_for_social)
    if social is not None:
        return social
    if _contains_any(normalized, _EXPLICIT_OUT_OF_SCOPE):
        return "out_of_scope"
    if _contains_any(normalized, _EXPLICIT_NONEXISTENT):
        return "out_of_scope"
    if _contains_any(normalized, _LEGACY_ORACLE_TERMS):
        return "legacy_name_query"
    if _contains_any(normalized, _LEGACY_SYSTEM_TERMS):
        return "legacy_name_query"
    from agent.page_recommendation import resolve_page_recommendation_intent

    page_resolution = resolve_page_recommendation_intent(
        query,
        normalized_query=normalized_query,
        entities=entities,
    )
    if page_resolution is not None:
        return page_resolution.intent
    from agent.intelligence_intents import resolve_intelligence_intent

    intelligence_intent = resolve_intelligence_intent(query, normalized)
    if intelligence_intent is not None:
        return intelligence_intent  # type: ignore[return-value]
    from agent.concept_map import resolve_concept_key

    if resolve_concept_key(normalized) is not None:
        return "concept_query"
    from agent.unsupported_entity_detection import (
        detect_unsupported_entity_intent,
        match_unsupported_entity,
    )

    if match_unsupported_entity(normalized_query) is not None:
        unsupported_intent = detect_unsupported_entity_intent(
            query,
            normalized_query=normalized_query,
            entities=entities,
        )
        if unsupported_intent is not None:
            return unsupported_intent  # type: ignore[return-value]
    from agent.unsupported_entity_detection import detect_catalog_unknown_intent

    catalog_unknown_intent = detect_catalog_unknown_intent(
        query,
        normalized_query=normalized_query,
        entities=entities,
    )
    if catalog_unknown_intent is not None:
        return catalog_unknown_intent  # type: ignore[return-value]
    if _is_entity_lookup_query(normalized, entities):
        return "entity_lookup"
    location_intent = _resolve_location_intent(query, normalized)
    if location_intent is not None:
        return location_intent
    if (
        _contains_any(normalized, _CATALOG_TERMS)
        and not _contains_any(normalized, _RECOMMENDATION_TERMS)
    ):
        return "catalog"
    if _is_direct_entity_guidance(query, normalized, entities):
        return "direct_entity_guidance"

    from agent.comparison_entity_validator import validate_comparison_entities

    blocked_comparison = validate_comparison_entities(
        query,
        normalized_query=normalized_query,
        entities=entities,
    )
    if blocked_comparison.blocked:
        return "unsupported_entity_lookup"

    from agent.catalog_registries import extract_cited_component_names

    has_component_reference = _references_component(query, normalized, entities)
    has_implementation_signal = _contains_any(normalized, _IMPLEMENTATION_SIGNALS)
    has_component_request = has_component_reference and (
        _contains_any(normalized, _RECOMMENDATION_TERMS)
        or has_implementation_signal
    )

    # When a specific component is named AND the user asks for implementation
    # OR mentions accessibility, component_recommendation takes priority.
    # The component catalog has the accessibility metadata - it's the right source.
    if has_component_reference and (has_implementation_signal or entities.accessibility_constraints):
        return "component_recommendation"

    # Audit requests about specific usage patterns
    if _contains_any(normalized, _AUDIT_REQUEST_SIGNALS) and (
        has_component_reference or _contains_any(normalized, _DOMAIN_TERMS)
    ):
        return "component_recommendation"

    # Pure accessibility guidance only when no specific component is named
    if entities.accessibility_constraints and not has_component_reference:
        return "accessibility_guidance"

    if has_component_request and _contains_any(normalized, _RECOMMENDATION_TERMS):
        return "component_recommendation"
    if _contains_any(normalized, _XAI_TERMS):
        return "xai_explanation"
    if "beatrice" in normalized and "chatgpt" in normalized:
        return "xai_explanation"
    if _is_component_comparison(normalized, entities.components, entities.patterns):
        from agent.unsupported_entity_detection import resolve_blocked_comparison

        if resolve_blocked_comparison(
            query,
            normalized_query=normalized_query,
            entities=entities,
        ) is not None:
            return "unsupported_entity_lookup"
        return "component_comparison"
    if _contains_pattern_terms(normalized) or entities.patterns:
        return "pattern_guidance"
    if _contains_any(normalized, _TOKEN_TERMS) or entities.tokens:
        return "token_lookup"
    if has_component_reference:
        return "component_recommendation"
    if entities.accessibility_constraints:
        return "accessibility_guidance"
    if _contains_any(normalized, _DECISION_TERMS):
        return "design_decision"
    if _contains_any(normalized, _LANGUAGE_FOLLOWUP_TERMS):
        return "language_followup"
    # Meta questions about Beatrice's capabilities. Checked after every
    # concrete entity branch so "pode me ajudar com o button" still resolves
    # to component_recommendation.
    if _contains_any(normalized, _HELP_REQUEST_TERMS):
        return "help_request"
    from agent.semantic_navigation import resolve_semantic_navigation

    semantic = resolve_semantic_navigation(query)
    if semantic is not None:
        if semantic.kind == "perspective":
            return "perspective_lookup"
        return "semantic_navigation_query"
    if _contains_any(normalized, _DOMAIN_TERMS):
        return "general_design_system"
    if _is_entity_lookup_query(normalized, entities):
        from agent.unsupported_entity_detection import _should_defer_unknown_entity_intent

        if not _should_defer_unknown_entity_intent(normalized):
            return "unknown_entity_lookup"
    return "out_of_scope"


def _answer_strategy(intent: UserIntent) -> AnswerStrategy:
    if intent in {"greeting", "small_talk"}:
        return "greeting"
    if intent in {"navigation_query", "semantic_navigation_query", "perspective_lookup"}:
        return "navigation_query"
    if intent in {
        "unsupported_entity_lookup",
        "unsupported_entity_recommendation",
        "unknown_entity_lookup",
    }:
        return intent
    if intent == "language_followup":
        return "documentation_help"
    if intent == "help_request":
        return "documentation_help"
    if intent == "general_design_system":
        return "documentation_help"
    if intent == "legacy_name_query":
        return "legacy_name_query"
    return intent


def _goal(intent: UserIntent) -> str:
    return {
        "greeting": "greet_and_offer_velaris_help",
        "small_talk": "acknowledge_small_talk_and_offer_velaris_help",
        "navigation_query": "resolve_canonical_route",
        "semantic_navigation_query": "resolve_semantic_destination",
        "perspective_lookup": "resolve_professional_perspective",
        "entity_lookup": "confirm_catalog_entity",
        "unsupported_entity_lookup": "confirm_unsupported_catalog_entity",
        "unsupported_entity_recommendation": "recommend_for_unsupported_entity",
        "unknown_entity_lookup": "clarify_unknown_catalog_entity",
        "direct_entity_guidance": "explain_direct_entity_usage",
        "concept_query": "explain_product_concept",
        "legacy_name_query": "explain_legacy_name_migration",
        "system_health": "explain_system_health",
        "agent_identity": "explain_agent_identity",
        "governance_analysis": "analyze_governance_state",
        "simulation": "simulate_design_change",
        "multi_agent_reasoning": "deliberate_across_perspectives",
        "component_recommendation": "select_or_verify_component",
        "page_architecture": "structure_product_flow",
        "component_discovery": "discover_catalog_capability",
        "component_comparison": "compare_component_fit",
        "pattern_guidance": "structure_product_flow",
        "token_lookup": "find_semantic_token",
        "accessibility_guidance": "make_interface_accessible",
        "design_decision": "explain_design_rationale",
        "xai_explanation": "explain_evidence_and_recommendation",
        "catalog": "list_official_entities",
        "language_followup": "adapt_previous_answer_language",
        "help_request": "explain_beatrice_capabilities",
        "general_design_system": "answer_design_system_question",
        "out_of_scope": "state_scope_boundary",
    }[intent]


def _retrieval_query(query: str, entities: ExtractedEntities, goal: str) -> str:
    parts = [query.strip(), f"user goal: {goal}"]
    fields = (
        ("components", entities.components),
        ("patterns", entities.patterns),
        ("tokens", entities.tokens),
        ("token categories", entities.token_categories),
        ("states", entities.states),
        ("interaction intents", entities.interaction_intents),
        ("contexts", entities.contexts),
        ("accessibility", entities.accessibility_constraints),
        ("risks", entities.risks),
    )
    parts.extend(
        f"{label}: {', '.join(values)}"
        for label, values in fields
        if values
    )
    return " | ".join(parts)


def analyze_query(query: str) -> QueryUnderstanding:
    from agent.concept_map import resolve_concept_key
    from agent.entity_resolution import resolve_exact_entity_matches
    from agent.perspective_registry import resolve_perspective_match
    from agent.route_map import resolve_navigation_route
    from agent.semantic_navigation import resolve_semantic_navigation
    from agent.unsupported_entity_detection import (
        match_unsupported_entity,
        resolve_catalog_entity,
    )
    from agent.catalog_registries import extract_dot_notation_tokens

    normalized = normalize_text(query)
    normalized_query = normalize_query(query)
    exact_matches = resolve_exact_entity_matches(normalized_query)
    entities = ExtractedEntities(
        components=_components(normalized_query),
        patterns=_patterns(normalized),
        tokens=list(dict.fromkeys([
            *_TOKEN_PATTERN.findall(normalized),
            *extract_dot_notation_tokens(query),
        ])),
        token_categories=_collect_terms(normalized, _TOKEN_CATEGORIES),
        states=_collect_terms(normalized, _STATE_TERMS),
        interaction_intents=_collect_terms(normalized, _INTERACTION_INTENTS),
        contexts=_collect_terms(normalized, _CONTEXT_TERMS),
        accessibility_constraints=_collect_terms(normalized, _ACCESSIBILITY_TERMS),
        risks=_collect_terms(normalized, _RISK_TERMS),
    )
    if exact_matches and not entities.components:
        entities = entities.model_copy(
            update={"components": [match.name for match in exact_matches]},
        )
    intent = _intent(query, normalized, entities, normalized_query=normalized_query)
    from agent.page_recommendation import resolve_page_recommendation_intent

    page_resolution = resolve_page_recommendation_intent(
        query,
        normalized_query=normalized_query,
        entities=entities,
    )
    page_type = ""
    discovery_capability = ""
    if page_resolution is not None:
        page_type = page_resolution.page_type
        discovery_capability = page_resolution.discovery_capability
    if intent == "concept_query" and resolve_concept_key(query) is None:
        intent = "general_design_system"
    if intent == "entity_lookup" and not exact_matches and not entities.components:
        from agent.unsupported_entity_detection import _should_defer_unknown_entity_intent

        if (
            match_unsupported_entity(normalized_query) is None
            and not _should_defer_unknown_entity_intent(normalized)
        ):
            intent = "unknown_entity_lookup"
    route_resolution = None
    resolved_route: str | None = None
    resolved_section_label: str | None = None
    resolved_perspective_id: str | None = None
    if intent == "navigation_query":
        route_resolution = resolve_navigation_route(query)
        if route_resolution is not None:
            resolved_route = route_resolution.route
            resolved_section_label = route_resolution.label_pt
    elif intent in {"semantic_navigation_query", "perspective_lookup"}:
        semantic = resolve_semantic_navigation(query)
        perspective_match = resolve_perspective_match(query)
        if semantic is not None:
            resolved_route = semantic.route
            resolved_section_label = semantic.label_pt
            if semantic.perspective is not None:
                perspective_match = semantic.perspective
        if perspective_match is not None:
            resolved_perspective_id = perspective_match.entry.profile_id
            if resolved_route is None:
                resolved_route = perspective_match.entry.route
            if resolved_section_label is None:
                resolved_section_label = perspective_match.entry.label
    goal = _goal(intent)
    from agent.comparison_entity_validator import blocked_comparison_resolution

    catalog_resolution = resolve_catalog_entity(
        query,
        normalized_query=normalized_query,
        entities=entities,
    )
    blocked = blocked_comparison_resolution(
        query,
        normalized_query=normalized_query,
        entities=entities,
    )
    if blocked is not None:
        catalog_resolution = blocked
        if intent not in {
            "unsupported_entity_lookup",
            "unsupported_entity_recommendation",
            "unknown_entity_lookup",
        }:
            intent = "unsupported_entity_lookup"
            operational_intent = intent
    from agent.professional_intent import enrich_understanding

    understanding = QueryUnderstanding(
        user_intent=intent,
        operational_intent=intent,
        answer_strategy=_answer_strategy(intent),
        language=_language(query, normalized),
        entities=entities,
        exact_entity_matches=exact_matches,
        catalog_entity_resolution=catalog_resolution,
        resolved_route=resolved_route,
        resolved_section_label=resolved_section_label,
        resolved_perspective_id=resolved_perspective_id,
        goal=goal,
        retrieval_query=_retrieval_query(query, entities, goal),
        decision_analysis_mode=(
            detect_decision_analysis_mode(query)
            or detect_architect_review_mode(query)
        ),
        architect_review_mode=detect_architect_review_mode(query),
        page_type=page_type,
        discovery_capability=discovery_capability,
    )
    return enrich_understanding(understanding, query)
