"""Semantic navigation and controlled fuzzy matching for Velaris internals."""

from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass
from difflib import SequenceMatcher

from agent.perspective_registry import PerspectiveMatch, resolve_perspective_match
from agent.route_map import CANONICAL_ROUTES, RouteResolution, resolve_navigation_route
from agent.understanding import normalize_text


@dataclass(frozen=True)
class SemanticNavigationMatch:
    kind: str  # section | perspective | concept
    section_key: str | None
    route: str | None
    label_pt: str
    label_en: str
    confidence: str  # exact | partial
    perspective: PerspectiveMatch | None = None
    concept_key: str | None = None


_LOCATION_SEEKING_TERMS: tuple[str, ...] = (
    "onde acho",
    "onde posso achar",
    "onde posso encontrar",
    "onde encontro",
    "onde vejo",
    "onde ficam",
    "onde fica",
    "onde esta",
    "onde está",
    "onde mudo",
    "onde mudar",
    "onde fica a parte",
    "onde fica a secao",
    "onde fica a seção",
    "cade",
    "cadê",
    "quero ver",
    "quero achar",
    "quero encontrar",
    "como acesso",
    "como acedo",
    "como chego",
    "como abro",
    "como mudo",
    "como mudar",
    "mudar para",
    "mudo para",
    "switch to",
    "where can i find",
    "where do i find",
    "where is",
    "where are",
    "how do i access",
    "how do i get to",
    "how do i open",
    "em qual pagina",
    "em que pagina",
    "qual pagina tem",
    "qual página tem",
)

_INTERNAL_VOCABULARY: dict[str, tuple[str, ...]] = {
    "tokens": ("token", "tokens", "tipografia", "typography", "spacing", "paleta"),
    "components": ("componente", "componentes", "component", "components"),
    "patterns": ("padrao", "padrão", "padroes", "padrões", "pattern", "patterns"),
    "decisions": ("decisao", "decisão", "decisoes", "decisões", "decision"),
    "foundations": ("fundamento", "fundamentos", "foundation", "foundations"),
    "guidelines": ("diretriz", "diretrizes", "guideline", "guidelines", "manifesto"),
    "accessibility": ("acessibilidade", "accessibility", "wcag", "a11y"),
    "reasoning": ("raciocinio", "raciocínio", "reasoning", "explicabilidade", "xai"),
    "oracle": ("abraxos", "beatrice", "oraculo", "oráculo", "oracle", "chat completo"),
    "perspectives": ("perspectiva", "perspectivas", "perspective", "perspectives"),
    "architecture": ("arquitetura", "architecture", "integracao", "integração"),
    "evaluation": ("avaliacao", "avaliação", "evaluation"),
}

_FUZZY_SECTION_THRESHOLD = 0.82
_FUZZY_TOKEN_MIN_LENGTH = 4


def is_location_seeking_query(query: str) -> bool:
    normalized = normalize_text(query)
    return any(term in normalized for term in _LOCATION_SEEKING_TERMS)


def _fold(value: str) -> str:
    decomposed = unicodedata.normalize("NFD", value.lower())
    return "".join(
        character
        for character in decomposed
        if unicodedata.category(character) != "Mn"
    )


def _term_present(normalized: str, alias: str) -> bool:
    alias_norm = normalize_text(alias)
    if not alias_norm:
        return False
    return bool(
        re.search(
            rf"(?<![a-z0-9]){re.escape(alias_norm)}(?![a-z0-9])",
            normalized,
        )
    )


def resolve_section_from_text(query: str) -> RouteResolution | None:
    return resolve_navigation_route(query)


def resolve_semantic_navigation(query: str) -> SemanticNavigationMatch | None:
    normalized = normalize_text(query)
    location_seeking = is_location_seeking_query(query)

    perspective = resolve_perspective_match(
        query,
        require_context=not location_seeking,
    )
    if perspective is not None and (
        location_seeking
        or _has_perspective_signal(normalized)
        or perspective.confidence == "exact"
    ):
        entry = perspective.entry
        return SemanticNavigationMatch(
            kind="perspective",
            section_key="perspectives",
            route=entry.route,
            label_pt=entry.label,
            label_en=entry.label_en,
            confidence=perspective.confidence,
            perspective=perspective,
        )

    route = resolve_navigation_route(query)
    if route is not None and location_seeking:
        return SemanticNavigationMatch(
            kind="section",
            section_key=route.section_key,
            route=route.route,
            label_pt=route.label_pt,
            label_en=route.label_en,
            confidence="exact",
        )

    if location_seeking:
        fuzzy = _fuzzy_section_match(normalized)
        if fuzzy is not None:
            section_key, score = fuzzy
            route = CANONICAL_ROUTES[section_key]
            return SemanticNavigationMatch(
                kind="section",
                section_key=section_key,
                route=route.route,
                label_pt=route.label_pt,
                label_en=route.label_en,
                confidence="partial" if score < 0.95 else "exact",
            )

    return None


def _has_perspective_signal(normalized: str) -> bool:
    markers = (
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
    return any(marker in normalized for marker in markers)


def _fuzzy_section_match(normalized: str) -> tuple[str, float] | None:
    tokens = [
        token
        for token in normalized.split()
        if len(token) >= _FUZZY_TOKEN_MIN_LENGTH
    ]
    if not tokens:
        return None

    best_key: str | None = None
    best_score = 0.0
    for section_key, aliases in _INTERNAL_VOCABULARY.items():
        for alias in aliases:
            alias_norm = normalize_text(alias)
            for token in tokens:
                score = SequenceMatcher(None, token, alias_norm).ratio()
                if score > best_score:
                    best_score = score
                    best_key = section_key
            if _term_present(normalized, alias):
                return section_key, 1.0

    if best_key is None or best_score < _FUZZY_SECTION_THRESHOLD:
        return None
    return best_key, best_score
