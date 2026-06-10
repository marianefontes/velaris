"""Canonical Velaris route map for navigation_query responses."""

from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass

from agent.understanding import normalize_text


@dataclass(frozen=True)
class RouteResolution:
    section_key: str
    route: str
    label_pt: str
    label_en: str
    legacy_routes: tuple[str, ...] = ()


CANONICAL_ROUTES: dict[str, RouteResolution] = {
    "tokens": RouteResolution(
        section_key="tokens",
        route="/foundations?focus=tokens",
        label_pt="tokens de design",
        label_en="design tokens",
        legacy_routes=("/tokens",),
    ),
    "components": RouteResolution(
        section_key="components",
        route="/components",
        label_pt="componentes",
        label_en="components",
    ),
    "patterns": RouteResolution(
        section_key="patterns",
        route="/foundations?focus=patterns",
        label_pt="padrões",
        label_en="patterns",
        legacy_routes=("/patterns",),
    ),
    "decisions": RouteResolution(
        section_key="decisions",
        route="/foundations",
        label_pt="decisões de design",
        label_en="design decisions",
        legacy_routes=("/design-decisions",),
    ),
    "foundations": RouteResolution(
        section_key="foundations",
        route="/foundations",
        label_pt="fundamentos",
        label_en="foundations",
    ),
    "guidelines": RouteResolution(
        section_key="guidelines",
        route="/foundations?focus=manifesto",
        label_pt="diretrizes e manifesto",
        label_en="guidelines and manifesto",
        legacy_routes=("/guidelines",),
    ),
    "accessibility": RouteResolution(
        section_key="accessibility",
        route="/foundations?focus=manifesto",
        label_pt="acessibilidade",
        label_en="accessibility",
    ),
    "reasoning": RouteResolution(
        section_key="reasoning",
        route="/reasoning",
        label_pt="raciocínio e explicabilidade",
        label_en="reasoning and explainability",
        legacy_routes=("/intelligence",),
    ),
    "oracle": RouteResolution(
        section_key="oracle",
        route="/oracle",
        label_pt="chat completo do Abraxos",
        label_en="full Abraxos chat",
        legacy_routes=("/beatrice-chat", "/oracle/chat"),
    ),
    "perspectives": RouteResolution(
        section_key="perspectives",
        route="/perspectives",
        label_pt="perspectivas",
        label_en="perspectives",
        legacy_routes=("/persona",),
    ),
    "architecture": RouteResolution(
        section_key="architecture",
        route="/architecture",
        label_pt="arquitetura e integração",
        label_en="architecture and integration",
        legacy_routes=("/developers", "/dev-integration"),
    ),
    "evaluation": RouteResolution(
        section_key="evaluation",
        route="/evaluation",
        label_pt="avaliação",
        label_en="evaluation",
        legacy_routes=("/system-evaluation", "/comparison"),
    ),
}


_SECTION_ALIASES: dict[str, tuple[str, ...]] = {
    "tokens": (
        "token", "tokens", "design token", "design tokens", "variavel", "variável",
        "variaveis", "variáveis", "tipografia", "typography", "spacing",
        "espacamento", "espaçamento", "paleta", "palette", "cores semanticas",
    ),
    "components": (
        "componente", "componentes", "component", "components", "catalogo de componentes",
        "catálogo de componentes", "biblioteca de componentes",
    ),
    "patterns": (
        "padrao", "padrão", "padroes", "padrões", "pattern", "patterns",
    ),
    "decisions": (
        "decisao", "decisão", "decisoes", "decisões", "decision", "decisions",
        "design decision", "design decisions",
    ),
    "foundations": (
        "fundamento", "fundamentos", "foundation", "foundations", "base do sistema",
    ),
    "guidelines": (
        "guideline", "guidelines", "diretriz", "diretrizes", "manifesto", "principio",
        "princípio", "principios", "princípios",
    ),
    "accessibility": (
        "acessibilidade", "accessibility", "wcag", "a11y",
    ),
    "reasoning": (
        "raciocinio", "raciocínio", "reasoning", "explicabilidade", "explainability",
        "xai", "inteligencia", "inteligência",
    ),
    "oracle": (
        "abraxos", "beatrice", "oraculo", "oráculo", "oracle", "chat completo",
        "chat do abraxos", "chat do beatrice",
    ),
    "perspectives": (
        "perspectiva", "perspectivas", "perspective", "perspectives", "persona",
    ),
    "architecture": (
        "arquitetura", "architecture", "integracao", "integração", "developer",
        "developers",
    ),
    "evaluation": (
        "avaliacao", "avaliação", "evaluation", "baseline", "comparacao", "comparação",
    ),
}


def _fold(value: str) -> str:
    decomposed = unicodedata.normalize("NFD", value.lower())
    return "".join(
        character
        for character in decomposed
        if unicodedata.category(character) != "Mn"
    )


_LEGACY_NAVIGATION_ALIASES: dict[str, str] = {
    "aetheris": "foundations",
    "velaris": "foundations",
    "beatrice": "oracle",
    "abraxos": "oracle",
}


def _legacy_navigation_resolution(normalized: str) -> RouteResolution | None:
    for legacy_name, section_key in _LEGACY_NAVIGATION_ALIASES.items():
        if re.search(
            rf"(?<![a-z0-9]){re.escape(_fold(legacy_name))}(?![a-z0-9])",
            _fold(normalized),
        ):
            return CANONICAL_ROUTES[section_key]
    return None


def resolve_navigation_route(query: str) -> RouteResolution | None:
    normalized = normalize_text(query)
    folded = _fold(normalized)
    legacy = _legacy_navigation_resolution(normalized)
    if legacy is not None:
        return legacy
    for section_key, aliases in _SECTION_ALIASES.items():
        for alias in aliases:
            alias_folded = _fold(alias)
            if re.search(
                rf"(?<![a-z0-9]){re.escape(alias_folded)}(?![a-z0-9])",
                folded,
            ):
                return CANONICAL_ROUTES[section_key]
    return None


def canonical_route_for_legacy(path: str) -> str | None:
    cleaned = path.strip().lower()
    for resolution in CANONICAL_ROUTES.values():
        if cleaned == resolution.route.lower():
            return resolution.route
        if cleaned in resolution.legacy_routes:
            return resolution.route
    return None
