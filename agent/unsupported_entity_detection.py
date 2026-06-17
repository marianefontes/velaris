"""Negative catalog intelligence: detect absent entities before RAG."""

from __future__ import annotations

import re

from component_metadata import ComponentMetadata, component_registry

from agent.entity_resolution import primary_exact_match, resolve_exact_entity_matches
from agent.external_reference_registry import (
    ExternalReferenceEntry,
    reference_by_id,
    references_for_topic,
)
from agent.models import (
    CatalogEntityResolution,
    DesignSystemGap,
    ExternalReferenceAction,
    ExtractedEntities,
    InternalAlternative,
)
from agent.understanding import (
    _AUDIT_REQUEST_SIGNALS,
    _DECISION_TERMS,
    _DIRECT_GUIDANCE_TERMS,
    _ENTITY_LOOKUP_BLOCKERS,
    _ENTITY_LOOKUP_TERMS,
    _NATURAL_ENTITY_LOOKUP_MARKERS,
    _NAVIGATION_TERMS,
    _PATTERN_TERMS,
    _RECOMMENDATION_TERMS,
    _TOKEN_TERMS,
    normalize_query,
    normalize_text,
)
from agent.catalog_registries import extract_cited_component_names, resolve_typed_catalog_entities
from agent.unsupported_entities_registry import (
    UnsupportedEntityEntry,
    UNSUPPORTED_ENTITIES_REGISTRY,
)

_PATTERN_ALIASES: dict[str, tuple[str, ...]] = {
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


def _contains_any(value: str, terms: tuple[str, ...]) -> bool:
    return any(normalize_text(term) in value for term in terms)


def match_unsupported_entity(normalized_query: str) -> tuple[UnsupportedEntityEntry, str] | None:
    """Return the best unsupported registry match and the matched alias."""
    best: tuple[UnsupportedEntityEntry, str, int] | None = None
    for entry in UNSUPPORTED_ENTITIES_REGISTRY.values():
        for alias in entry.aliases:
            if not alias or len(alias) < 2:
                continue
            if _term_present(normalized_query, alias):
                alias_len = len(normalize_text(alias))
                if best is None or alias_len > best[2]:
                    best = (entry, alias, alias_len)
    if best is None:
        return None
    return best[0], best[1]


def _catalog_has_component(component_id: str) -> bool:
    return component_registry().get(component_id) is not None


def _catalog_has_pattern(pattern_name: str) -> bool:
    return pattern_name in _PATTERN_ALIASES


def _resolve_internal_alternative(
    alternative_id: str,
    entry: UnsupportedEntityEntry,
) -> InternalAlternative | None:
    registry = component_registry()
    component = registry.get(alternative_id)
    if component is not None:
        use_case = entry.blocking_use_case
        if alternative_id == "text-input":
            use_case = entry.contextual_use_case or use_case
        return InternalAlternative(
            entity_id=component.component_id,
            name=component.name,
            target_type="component",
            use_case=use_case,
        )
    if _catalog_has_pattern(alternative_id):
        return InternalAlternative(
            entity_id=alternative_id,
            name=alternative_id,
            target_type="pattern",
            use_case=entry.contextual_use_case or entry.blocking_use_case,
        )
    return None


def validated_internal_alternatives(
    entry: UnsupportedEntityEntry,
) -> list[InternalAlternative]:
    alternatives: list[InternalAlternative] = []
    seen: set[str] = set()
    for alternative_id in entry.closest_internal_alternatives:
        resolved = _resolve_internal_alternative(alternative_id, entry)
        if resolved is None or resolved.entity_id in seen:
            continue
        seen.add(resolved.entity_id)
        alternatives.append(resolved)
    return alternatives


def _primary_external_reference(entry: UnsupportedEntityEntry) -> ExternalReferenceEntry | None:
    for reference_id in entry.external_reference_ids:
        reference = reference_by_id(reference_id)
        if reference is not None and reference.trusted:
            return reference
    topic_refs = references_for_topic(entry.entity_key)
    if topic_refs:
        return topic_refs[0]
    return None


def _external_action(reference: ExternalReferenceEntry) -> ExternalReferenceAction:
    return ExternalReferenceAction(
        label=reference.label,
        url=reference.url,
        source_type=reference.source_type,
        trusted=reference.trusted,
        reference_id=reference.reference_id,
    )


def _design_system_gap(entry: UnsupportedEntityEntry) -> DesignSystemGap:
    return DesignSystemGap(
        entity_label=entry.label,
        entity_type=entry.entity_type,
        reason=entry.gap_reason,
        suggested_action=entry.gap_suggested_action,
    )


def is_registered_absent_entity(resolution: CatalogEntityResolution) -> bool:
    """True when the entity is a known catalog gap (negative registry entry)."""
    return resolution.design_system_gap is not None


def _status_for_existing_component(component: ComponentMetadata) -> str:
    if component.status in {"deprecated", "legacy", "draft", "experimental"}:
        return "partial"
    return "supported"


def _unsupported_resolution(
    entry: UnsupportedEntityEntry,
    matched_alias: str,
) -> CatalogEntityResolution:
    external = _primary_external_reference(entry)
    return CatalogEntityResolution(
        entity_key=entry.entity_key,
        entity_label=entry.label,
        entity_type=entry.entity_type,
        entity_status="unknown",
        internal_alternatives=validated_internal_alternatives(entry),
        external_reference=_external_action(external) if external else None,
        design_system_gap=_design_system_gap(entry),
        matched_alias=matched_alias,
        response_guidance=entry.response_guidance,
    )


def _extract_comparison_sides(normalized: str) -> tuple[str, str] | None:
    match = re.search(
        r"(.+?)\s+(?:vs\.?|versus|ou|or|em vez de|instead of)\s+(.+)",
        normalized,
        re.I,
    )
    if not match:
        return None
    return match.group(1).strip(), match.group(2).strip()


def resolve_blocked_comparison(
    query: str,
    *,
    normalized_query: str | None = None,
    entities: ExtractedEntities | None = None,
) -> CatalogEntityResolution | None:
    """Return a resolution when a comparison cites an unknown catalog entity."""
    from agent.comparison_entity_validator import blocked_comparison_resolution

    return blocked_comparison_resolution(
        query,
        normalized_query=normalized_query,
        entities=entities,
    )


def resolve_catalog_entity(
    query: str,
    *,
    normalized_query: str | None = None,
    entities: ExtractedEntities | None = None,
) -> CatalogEntityResolution:
    """Resolve entity status against the canonical Velaris catalog."""
    normalized_query = normalized_query or normalize_query(query)
    normalized = normalize_text(query)

    unsupported_match = match_unsupported_entity(normalized_query)
    if unsupported_match is not None:
        entry, matched_alias = unsupported_match
        return _unsupported_resolution(entry, matched_alias)

    typed_resolution = resolve_typed_catalog_entities(
        query,
        normalized_query=normalized_query,
        entities=entities,
    )
    if typed_resolution is not None and typed_resolution.entity_status == "unknown":
        return typed_resolution

    for component_name in extract_cited_component_names(query):
        cited_query = normalize_query(component_name)
        if match_unsupported_entity(cited_query) is not None:
            continue
        if resolve_exact_entity_matches(cited_query):
            continue
        return CatalogEntityResolution(
            entity_label=component_name,
            entity_type="component",
            entity_status="unknown",
            matched_alias=component_name,
        )

    exact_matches = resolve_exact_entity_matches(normalized_query)
    if exact_matches:
        component = component_registry().get(exact_matches[0].component_id)
        if component is not None:
            status = _status_for_existing_component(component)
            return CatalogEntityResolution(
                entity_key=component.component_id,
                entity_label=component.name,
                entity_type="component",
                entity_status=status,  # type: ignore[arg-type]
                matched_alias=exact_matches[0].matched_alias,
            )

    if entities and entities.components:
        registry = component_registry()
        for name in entities.components:
            for component in registry.values():
                if component.name == name:
                    status = _status_for_existing_component(component)
                    return CatalogEntityResolution(
                        entity_key=component.component_id,
                        entity_label=component.name,
                        entity_type="component",
                        entity_status=status,  # type: ignore[arg-type]
                    )

    if _looks_like_entity_query(normalized_query, entities):
        return CatalogEntityResolution(entity_status="unknown")

    return CatalogEntityResolution(entity_status="unknown")


def _looks_like_entity_query(
    normalized_query: str,
    entities: ExtractedEntities | None,
) -> bool:
    if entities and entities.components:
        return True
    markers = (
        *_ENTITY_LOOKUP_TERMS,
        *_NATURAL_ENTITY_LOOKUP_MARKERS,
        *_DIRECT_GUIDANCE_TERMS,
        *_RECOMMENDATION_TERMS,
        "componente ",
        " component ",
        "pattern ",
        "padrao ",
        "padrão ",
    )
    return _contains_any(normalized_query, markers)


def _should_defer_unknown_entity_intent(normalized_query: str) -> bool:
    """Keep navigation, recommendation and guidance queries on their native paths."""
    if _contains_any(normalized_query, _NAVIGATION_TERMS):
        return True
    if _contains_any(normalized_query, _RECOMMENDATION_TERMS):
        return True
    if _contains_any(normalized_query, _ENTITY_LOOKUP_BLOCKERS):
        return True
    if _contains_any(normalized_query, _TOKEN_TERMS):
        return True
    if _contains_any(normalized_query, _PATTERN_TERMS):
        return True
    if _contains_any(normalized_query, _DECISION_TERMS):
        return True
    if _contains_any(normalized_query, _AUDIT_REQUEST_SIGNALS):
        return True
    return False


def is_unsupported_entity_lookup_query(
    normalized_query: str,
    resolution: CatalogEntityResolution,
) -> bool:
    if not is_registered_absent_entity(resolution):
        return False
    if _contains_any(normalized_query, _ENTITY_LOOKUP_BLOCKERS):
        return False
    if _contains_any(normalized_query, _RECOMMENDATION_TERMS):
        return False
    lookup_markers = (
        *_ENTITY_LOOKUP_TERMS,
        *_NATURAL_ENTITY_LOOKUP_MARKERS,
        *_DIRECT_GUIDANCE_TERMS,
        "tem ",
        "possui ",
        "existe ",
        "have ",
        "has ",
        "quero usar",
        "want to use",
        "quero um ",
        "want a ",
    )
    return _contains_any(normalized_query, lookup_markers)


def is_unsupported_entity_recommendation_query(
    normalized_query: str,
    resolution: CatalogEntityResolution,
) -> bool:
    if not is_registered_absent_entity(resolution):
        return False
    if _contains_any(normalized_query, _RECOMMENDATION_TERMS):
        return True
    recommendation_markers = (
        "qual componente",
        "que componente",
        "which component",
        "what component",
        "devo usar",
        "should i use",
        "uso para",
        "use for",
        "recomende",
        "recommend",
        "quero usar",
        "want to use",
        "quero um ",
        "want a ",
    )
    return _contains_any(normalized_query, recommendation_markers)


def _is_comparison_query(normalized_query: str, entities: ExtractedEntities | None) -> bool:
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
    if _contains_any(normalized_query, comparison_terms):
        return True
    if bool(re.search(r"\b(?:ou|or)\b", normalized_query)):
        return True
    return False


def detect_catalog_unknown_intent(
    query: str,
    *,
    normalized_query: str | None = None,
    entities: ExtractedEntities | None = None,
) -> str | None:
    """Route explicit citations of unknown catalog entities before RAG."""
    from agent.entity_validation_gate import is_deictic_artifact_reference

    normalized_query = normalized_query or normalize_query(query)
    if is_deictic_artifact_reference(normalized_query):
        return None
    resolution = resolve_catalog_entity(
        query,
        normalized_query=normalized_query,
        entities=entities,
    )
    if resolution.entity_status != "unknown":
        return None
    if is_registered_absent_entity(resolution):
        return None
    if resolution.entity_type in {
        "component",
        "token",
        "state",
        "pattern",
        "guideline",
        "decision",
        "variant",
        "accessibility_rule",
    }:
        return "unknown_entity_lookup"
    if resolution.entity_status == "unknown" and resolution.entity_label:
        return "unknown_entity_lookup"
    return None


def detect_unsupported_entity_intent(
    query: str,
    *,
    normalized_query: str | None = None,
    entities: ExtractedEntities | None = None,
) -> str | None:
    """Return a specialized intent when the query cites an absent catalog entity."""
    normalized_query = normalized_query or normalize_query(query)
    resolution = resolve_catalog_entity(
        query,
        normalized_query=normalized_query,
        entities=entities,
    )
    if is_registered_absent_entity(resolution):
        from agent.comparison_entity_validator import is_comparison_query

        if is_comparison_query(normalized_query, entities):
            return None
        if is_unsupported_entity_recommendation_query(normalized_query, resolution):
            return "unsupported_entity_recommendation"
        if is_unsupported_entity_lookup_query(normalized_query, resolution):
            return "unsupported_entity_lookup"
        if _contains_any(normalized_query, _ENTITY_LOOKUP_BLOCKERS):
            return "unsupported_entity_recommendation"
        return "unsupported_entity_lookup"
    return None


def cited_entity_label(query: str, *, normalized_query: str | None = None) -> str | None:
    normalized_query = normalized_query or normalize_query(query)
    exact = primary_exact_match(normalized_query)
    if exact is not None:
        return exact.name
    unsupported = match_unsupported_entity(normalized_query)
    if unsupported is not None:
        return unsupported[0].label
    return None
