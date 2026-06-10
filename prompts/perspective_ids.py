"""Canonical perspective identifiers and legacy input normalization."""

from __future__ import annotations

CANONICAL_PERSPECTIVE_IDS = (
    "dev",
    "designer",
    "product_designer",
    "qa",
    "tech_writer",
    "a11y",
    "maintainer",
    "design_system_manager",
)

INTERNAL_PROFILE_IDS = ("general", *CANONICAL_PERSPECTIVE_IDS)

LEGACY_PERSPECTIVE_ALIASES = {
    "pm": "design_system_manager",
    "writer": "tech_writer",
}


def normalize_profile_id(value: object, default: str = "general") -> str:
    if not isinstance(value, str):
        return default
    normalized = LEGACY_PERSPECTIVE_ALIASES.get(value.strip(), value.strip())
    return normalized if normalized in INTERNAL_PROFILE_IDS else default

