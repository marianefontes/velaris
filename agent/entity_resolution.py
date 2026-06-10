"""Exact entity resolution against the canonical component catalog."""

from __future__ import annotations

import re
import unicodedata
from functools import lru_cache

from component_metadata import ComponentMetadata, component_registry

from .entity_alias_registry import COMPONENT_ALIASES
from .models import ExactEntityMatch
from .understanding import normalize_text


def _fold(value: str) -> str:
    decomposed = unicodedata.normalize("NFD", value.lower().strip())
    return "".join(
        character
        for character in decomposed
        if unicodedata.category(character) != "Mn"
    )


def _term_present(normalized: str, alias: str) -> bool:
    normalized_alias = normalize_text(alias)
    if not normalized_alias:
        return False
    return bool(
        re.search(
            rf"(?<![a-z0-9]){re.escape(normalized_alias)}(?![a-z0-9])",
            normalized,
        )
    )


@lru_cache(maxsize=1)
def _catalog_index() -> list[tuple[ComponentMetadata, tuple[str, ...]]]:
    registry = component_registry()
    indexed: list[tuple[ComponentMetadata, tuple[str, ...]]] = []
    for component in registry.values():
        aliases = {_fold(component.name), _fold(component.component_id)}
        aliases.update(
            _fold(alias)
            for alias in COMPONENT_ALIASES.get(component.component_id, ())
        )
        indexed.append((component, tuple(sorted(aliases, key=len, reverse=True))))
    return indexed


def resolve_exact_entity_matches(normalized_query: str) -> list[ExactEntityMatch]:
    matches: list[tuple[int, ExactEntityMatch]] = []
    for component, aliases in _catalog_index():
        for alias in aliases:
            if not alias or len(alias) < 2:
                continue
            if _term_present(normalized_query, alias):
                match_type = "name" if alias == _fold(component.name) else "alias"
                if alias == _fold(component.component_id):
                    match_type = "component_id"
                matches.append(
                    (
                        len(alias),
                        ExactEntityMatch(
                            component_id=component.component_id,
                            name=component.name,
                            match_type=match_type,
                            matched_alias=alias,
                        ),
                    )
                )
                break

    matches.sort(key=lambda item: item[0], reverse=True)
    ordered: list[ExactEntityMatch] = []
    seen_ids: set[str] = set()
    for _, match in matches:
        if match.component_id in seen_ids:
            continue
        seen_ids.add(match.component_id)
        ordered.append(match)
    return ordered


def primary_exact_match(normalized_query: str) -> ExactEntityMatch | None:
    matches = resolve_exact_entity_matches(normalized_query)
    if not matches:
        return None
    return matches[0]


def exact_match_supersedes_semantic(
    exact: ExactEntityMatch | None,
    semantic_component_id: str,
) -> bool:
    if exact is None:
        return False
    if semantic_component_id == exact.component_id:
        return False
    return True
