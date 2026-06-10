"""Legacy product names and route aliases for Velaris/Abraxos migration."""

from __future__ import annotations

from dataclasses import dataclass

from agent.route_map import CANONICAL_ROUTES, canonical_route_for_legacy


@dataclass(frozen=True)
class ProductAlias:
    legacy: str
    current: str
    current_label_pt: str
    current_label_en: str
    default_section_key: str


@dataclass(frozen=True)
class RouteAlias:
    legacy_path: str
    canonical_route: str
    label_pt: str
    label_en: str


PRODUCT_ALIASES: dict[str, ProductAlias] = {
    "aetheris": ProductAlias(
        legacy="Aetheris",
        current="Velaris",
        current_label_pt="Velaris",
        current_label_en="Velaris",
        default_section_key="foundations",
    ),
    "beatrice": ProductAlias(
        legacy="Beatrice",
        current="Abraxos",
        current_label_pt="Abraxos",
        current_label_en="Abraxos",
        default_section_key="oracle",
    ),
}

ROUTE_ALIASES: dict[str, RouteAlias] = {}
for _section in CANONICAL_ROUTES.values():
    for legacy_path in _section.legacy_routes:
        ROUTE_ALIASES[legacy_path] = RouteAlias(
            legacy_path=legacy_path,
            canonical_route=_section.route,
            label_pt=_section.label_pt,
            label_en=_section.label_en,
        )

LEGACY_ROUTE_REDIRECTS: dict[str, str] = {
    "/persona": "/perspectives",
    "/dashboard": "/main",
    "/beatrice-chat": "/oracle",
    "/oracle/chat": "/oracle",
    "/tokens": "/foundations?focus=tokens",
    "/patterns": "/foundations?focus=patterns",
    "/guidelines": "/foundations?focus=manifesto",
    "/design-decisions": "/foundations",
    "/developers": "/architecture",
    "/dev-integration": "/architecture",
}


def resolve_product_alias(normalized_query: str) -> ProductAlias | None:
    for key, alias in PRODUCT_ALIASES.items():
        if key in normalized_query:
            return alias
    return None


def resolve_canonical_route(path: str) -> str | None:
    cleaned = path.strip().lower()
    if cleaned in LEGACY_ROUTE_REDIRECTS:
        return LEGACY_ROUTE_REDIRECTS[cleaned]
    return canonical_route_for_legacy(path)
