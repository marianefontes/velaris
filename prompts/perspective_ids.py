"""Canonical perspective identifiers and legacy input normalization."""

from __future__ import annotations

# Order drives the /perspectives 3x3 grid (3 rows of 3 on desktop).
CANONICAL_PERSPECTIVE_IDS = (
    "designer",
    "ux_specialist",
    "dev",
    "solution_architect",
    "qa",
    "a11y",
    "maintainer",
    "tech_writer",
    "design_system_manager",
)

INTERNAL_PROFILE_IDS = ("general", *CANONICAL_PERSPECTIVE_IDS)

LEGACY_PERSPECTIVE_ALIASES = {
    "pm": "design_system_manager",
    "writer": "tech_writer",
    # Product Designer was reframed as the UX Specialist lens; keep the old id
    # resolvable so stored sessions, prompts and deep links never break.
    "product_designer": "ux_specialist",
}


def normalize_profile_id(value: object, default: str = "general") -> str:
    if not isinstance(value, str):
        return default
    normalized = LEGACY_PERSPECTIVE_ALIASES.get(value.strip(), value.strip())
    return normalized if normalized in INTERNAL_PROFILE_IDS else default

