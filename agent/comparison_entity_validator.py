"""Validate both sides of a design-system comparison before allowing retrieval."""

from __future__ import annotations

import re
from dataclasses import dataclass

from agent.catalog_registries import resolve_typed_catalog_entities
from agent.entity_resolution import resolve_exact_entity_matches
from agent.models import CatalogEntityResolution, ExtractedEntities
from agent.understanding import normalize_query, normalize_text
from agent.unsupported_entities_registry import UNSUPPORTED_ENTITIES_REGISTRY

# Known catalog gaps that may be compared against a supported canonical entity.
_COMPARISON_ALLOWED_GAPS = frozenset({"drawer", "side-drawer"})


_COMPARISON_SPLIT = re.compile(
    r"(.+?)\s+(?:vs\.?|versus|ou|or|em vez de|instead of)\s+(.+)",
    re.I,
)

_COMPONENT_LIKE = re.compile(
    r"\b(?:button|botao|botão|link|modal|dialog|drawer|tooltip|popover|checkbox|switch|"
    r"radio|select|input|table|alert|toast|tab|card|icon|typography|chip|badge|palette|"
    r"form|field|skeleton|audit|command|source|confidence|date|picker|toggle|text|area)\b",
    re.I,
)


@dataclass(frozen=True)
class ComparisonValidationResult:
    blocked: bool
    resolution: CatalogEntityResolution | None = None
    left_label: str | None = None
    right_label: str | None = None


def extract_comparison_pair(query: str) -> tuple[str, str] | None:
    match = _COMPARISON_SPLIT.search(normalize_text(query))
    if not match:
        return None
    return match.group(1).strip(), match.group(2).strip()


def is_comparison_query(
    normalized_query: str,
    entities: ExtractedEntities | None = None,
) -> bool:
    comparison_terms = (
        " vs ",
        " versus ",
        "compare",
        "comparar",
        "comparacao",
        "comparação",
        "diferenca entre",
        "diferença entre",
        "em vez de",
        "instead of",
    )
    if any(term in normalized_query for term in comparison_terms):
        return True
    if re.search(r"\b(?:ou|or)\b", normalized_query):
        return extract_comparison_pair(normalized_query) is not None
    if entities:
        pattern_count = len(entities.patterns)
        if len(entities.components) + pattern_count >= 2:
            return True
    return False


def _side_resolution(side: str) -> CatalogEntityResolution:
    from agent.unsupported_entity_detection import (
        match_unsupported_entity,
        resolve_catalog_entity,
    )

    side_normalized = normalize_query(side)
    unsupported = match_unsupported_entity(side_normalized)
    if unsupported is not None:
        entry, matched_alias = unsupported
        return CatalogEntityResolution(
            entity_key=entry.entity_key,
            entity_label=entry.label,
            entity_type=entry.entity_type,
            entity_status="unknown",
            matched_alias=matched_alias,
            response_guidance=entry.response_guidance,
        )

    typed = resolve_typed_catalog_entities(
        side,
        normalized_query=side_normalized,
    )
    if typed is not None and typed.entity_status == "unknown":
        return typed

    exact = resolve_exact_entity_matches(side_normalized)
    if exact:
        from component_metadata import component_registry

        component = component_registry().get(exact[0].component_id)
        if component is not None:
            return CatalogEntityResolution(
                entity_key=component.component_id,
                entity_label=component.name,
                entity_type="component",
                entity_status="supported",
                matched_alias=exact[0].matched_alias,
            )

    catalog = resolve_catalog_entity(side, normalized_query=side_normalized)
    if catalog.entity_status != "unknown":
        return catalog

    label = side.strip()
    if _COMPONENT_LIKE.search(side) or label[:1].isupper():
        return CatalogEntityResolution(
            entity_label=label,
            entity_type="component",
            entity_status="unknown",
            matched_alias=label,
        )
    return catalog


def validate_comparison_entities(
    query: str,
    *,
    normalized_query: str | None = None,
    entities: ExtractedEntities | None = None,
) -> ComparisonValidationResult:
    normalized_query = normalized_query or normalize_query(query)
    if not is_comparison_query(normalized_query, entities):
        return ComparisonValidationResult(blocked=False)

    pair = extract_comparison_pair(query)
    if pair is None:
        return ComparisonValidationResult(blocked=False)

    left_label, right_label = pair
    left = _side_resolution(left_label)
    right = _side_resolution(right_label)

    def _is_supported(resolution: CatalogEntityResolution) -> bool:
        return resolution.entity_status == "supported"

    def _is_allowed_gap(resolution: CatalogEntityResolution) -> bool:
        return resolution.entity_key in _COMPARISON_ALLOWED_GAPS

    def _is_invented_gap(resolution: CatalogEntityResolution) -> bool:
        if resolution.entity_key is None:
            return False
        return (
            resolution.entity_key in UNSUPPORTED_ENTITIES_REGISTRY
            and resolution.entity_key not in _COMPARISON_ALLOWED_GAPS
        )

    if (_is_supported(left) and _is_allowed_gap(right)) or (
        _is_supported(right) and _is_allowed_gap(left)
    ):
        return ComparisonValidationResult(
            blocked=False,
            left_label=left_label,
            right_label=right_label,
        )

    for side_label, resolution in ((left_label, left), (right_label, right)):
        if _is_supported(resolution):
            continue
        if _is_allowed_gap(resolution):
            continue
        if _is_invented_gap(resolution):
            return ComparisonValidationResult(
                blocked=True,
                resolution=resolution,
                left_label=left_label,
                right_label=right_label,
            )
        if resolution.entity_status != "unknown":
            continue
        if not resolution.entity_label:
            resolution = CatalogEntityResolution(
                entity_label=side_label.strip(),
                entity_type="component",
                entity_status="unknown",
                matched_alias=side_label.strip(),
            )
        return ComparisonValidationResult(
            blocked=True,
            resolution=resolution,
            left_label=left_label,
            right_label=right_label,
        )

    return ComparisonValidationResult(
        blocked=False,
        left_label=left_label,
        right_label=right_label,
    )


def blocked_comparison_resolution(
    query: str,
    *,
    normalized_query: str | None = None,
    entities: ExtractedEntities | None = None,
) -> CatalogEntityResolution | None:
    result = validate_comparison_entities(
        query,
        normalized_query=normalized_query,
        entities=entities,
    )
    return result.resolution if result.blocked else None


def blocked_comparison_message(*, english: bool = False) -> str:
    if english:
        return (
            "I did not find sufficient evidence to compare the requested elements."
        )
    return (
        "Não encontrei evidência suficiente para comparar os elementos solicitados."
    )
