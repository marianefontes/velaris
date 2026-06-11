"""Canonical catalogs for multi-entity validation (tokens, patterns, states, guidelines, decisions)."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from component_metadata import component_registry

BASE_DIR = Path(__file__).resolve().parents[1]
DUMP_PATH = BASE_DIR / "rag" / "aetheris-docs-dump.json"
GUIDELINES_PATH = BASE_DIR / "src" / "components" / "GuidelinesPage.tsx"
FOUNDATIONS_PATH = BASE_DIR / "src" / "components" / "FoundationsPage.tsx"

PATTERN_ALIASES: dict[str, tuple[str, ...]] = {
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

DOT_TOKEN_PATTERN = re.compile(
    r"(?<![\w.])(?:color|spacing|typography|motion|radius|shadow|semantic|brand|text|surface)"
    r"(?:\.[a-z0-9-]+){2,}(?![\w.])",
    re.I,
)

STATE_CITATION_PATTERN = re.compile(
    r"\b(?:estado|state|states|estados)\s+(?:[\w/-]+\s+)?"
    r"(?:(?:do|da|de|of|for)\s+)?([a-z][a-z0-9-]*)",
    re.I,
)

GUIDELINE_CITATION_PATTERN = re.compile(
    r"\b(?:guideline|guidelines|diretriz|diretrizes|principio|princípio|principle|regra)\s+"
    r"(?:[\w-]+\s+)?(?:define|definem|defines|sobre|about|for)?\s*"
    r"([A-Za-z][\w\s-]{2,40})",
    re.I,
)

VARIANT_CITATION_PATTERN = re.compile(
    r"\b(?:variante|variant|variants|variantes)\s+([a-z][a-z0-9-]*(?:-[a-z0-9]+)*)",
    re.I,
)

ACCESSIBILITY_RULE_CITATION_PATTERN = re.compile(
    r"\b(?:regra|rule|contrato|contract)\s+(?:de\s+|of\s+|a11y\s+)?"
    r"([a-z]+(?:-[a-z0-9]+)+)",
    re.I,
)

_ACCESSIBILITY_QUERY_MARKERS = (
    "acessibilidade",
    "accessibility",
    "wcag",
    "a11y",
    "contrato acess",
    "accessibility contract",
    "regra de acess",
    "accessibility rule",
)

COMPONENT_CITATION_PATTERN = re.compile(
    r"\b(?:componente|component)\s+(?:o\s+|a\s+|the\s+)?"
    r"([A-Z][A-Za-z0-9/-]*(?:\s*/?\s*[A-Z][A-Za-z0-9/-]*)*)",
)

_COMPONENT_CITATION_STOPWORDS = frozenset({
    "usar",
    "uso",
    "devo",
    "deve",
    "para",
    "mostrar",
    "escolher",
    "the",
    "use",
    "for",
})


@dataclass(frozen=True)
class CatalogEntityMatch:
    entity_key: str
    entity_label: str
    entity_type: str
    entity_status: str
    matched_alias: str | None = None
    parent_entity_key: str | None = None


def _normalize_key(value: str) -> str:
    return re.sub(r"\s+", " ", value.strip().lower())


@lru_cache(maxsize=1)
def _rag_chunks() -> tuple[dict, ...]:
    if not DUMP_PATH.exists():
        return ()
    payload = json.loads(DUMP_PATH.read_text(encoding="utf-8"))
    return tuple(payload.get("chunks", []))


@lru_cache(maxsize=1)
def token_catalog() -> frozenset[str]:
    names = {
        str(chunk.get("title", "")).lower()
        for chunk in _rag_chunks()
        if chunk.get("page_type") in {"token", "token_alias"}
    }
    return frozenset(name for name in names if name)


@lru_cache(maxsize=1)
def pattern_catalog() -> dict[str, str]:
    titles = {
        str(chunk.get("title", ""))
        for chunk in _rag_chunks()
        if chunk.get("page_type") == "pattern"
    }
    index: dict[str, str] = {}
    for title in titles:
        if not title:
            continue
        index[_normalize_key(title)] = title
    for canonical, aliases in PATTERN_ALIASES.items():
        index[_normalize_key(canonical)] = canonical
        for alias in aliases:
            index[_normalize_key(alias)] = canonical
    return index


@lru_cache(maxsize=1)
def decision_catalog() -> dict[str, str]:
    index: dict[str, str] = {}
    for chunk in _rag_chunks():
        if chunk.get("page_type") != "design_decision":
            continue
        title = str(chunk.get("title", "")).strip()
        if title:
            index[_normalize_key(title)] = title
    return index


def _slice_tsx_array(source: str, array_name: str) -> str:
    match = re.search(
        rf"(?:export\s+const\s+)?{re.escape(array_name)}(?:\s*:\s*[^=]+)?\s*=\s*\[",
        source,
    )
    if not match:
        return ""
    start = match.end()
    depth = 1
    index = start
    while index < len(source) and depth:
        char = source[index]
        if char == "[":
            depth += 1
        elif char == "]":
            depth -= 1
        index += 1
    return source[start : index - 1]


def _objects_from_tsx_section(section: str) -> list[str]:
    objects: list[str] = []
    depth = 0
    obj_start: int | None = None
    for index, char in enumerate(section):
        if char == "{":
            if depth == 0:
                obj_start = index
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0 and obj_start is not None:
                objects.append(section[obj_start : index + 1])
                obj_start = None
    return objects


@lru_cache(maxsize=1)
def accessibility_rule_catalog() -> dict[str, str]:
    catalog: dict[str, str] = {}
    if FOUNDATIONS_PATH.exists():
        src = FOUNDATIONS_PATH.read_text(encoding="utf-8")
        for array_name in (
            "ACCESSIBILITY_CONTRACTS",
            "ACCESSIBILITY_READINESS_CHECKLIST",
        ):
            for obj in _objects_from_tsx_section(_slice_tsx_array(src, array_name)):
                rule_id = re.search(r'id:\s*"([^"]+)"', obj)
                if rule_id is None:
                    continue
                label_match = re.search(r'(?:title|text):\s*"([^"]+)"', obj)
                catalog[rule_id.group(1)] = (
                    label_match.group(1) if label_match else rule_id.group(1)
                )
    for chunk in _rag_chunks():
        if chunk.get("page_type") != "accessibility":
            continue
        title = str(chunk.get("title", "")).strip()
        if title:
            catalog[_normalize_key(title)] = title
    return catalog


@lru_cache(maxsize=1)
def accessibility_catalog() -> dict[str, str]:
    return accessibility_rule_catalog()


@lru_cache(maxsize=1)
def guideline_catalog() -> dict[str, str]:
    index: dict[str, str] = {}
    if GUIDELINES_PATH.exists():
        src = GUIDELINES_PATH.read_text(encoding="utf-8")
        for field in ("id", "title"):
            for match in re.finditer(rf'{field}:\s*"([^"]+)"', src):
                value = match.group(1).strip()
                if value:
                    index[_normalize_key(value)] = value
    return index


@lru_cache(maxsize=1)
def component_variant_index() -> dict[tuple[str, str], str]:
    index: dict[tuple[str, str], str] = {}
    for component in component_registry().values():
        for variant in component.variants or []:
            index[(component.component_id, variant.id.lower())] = variant.id
            for label in (variant.label.pt, variant.label.en):
                if label:
                    index[(component.component_id, _normalize_key(label))] = variant.id
    return index


@lru_cache(maxsize=1)
def global_variant_ids() -> frozenset[str]:
    ids: set[str] = set()
    for (_, variant_key), variant_id in component_variant_index().items():
        del variant_key
        ids.add(variant_id.lower())
    return frozenset(ids)


@lru_cache(maxsize=1)
def component_state_index() -> dict[tuple[str, str], str]:
    index: dict[tuple[str, str], str] = {}
    for component in component_registry().values():
        for state in component.states or []:
            index[(component.component_id, state.id.lower())] = state.id
            for label in (state.label.pt, state.label.en):
                if label:
                    index[(component.component_id, _normalize_key(label))] = state.id
    return index


@lru_cache(maxsize=1)
def global_state_ids() -> frozenset[str]:
    ids: set[str] = set()
    for (component_id, state_key), state_id in component_state_index().items():
        del component_id
        ids.add(state_key)
        ids.add(state_id.lower())
    return frozenset(ids)


def extract_dot_notation_tokens(text: str) -> list[str]:
    return list(dict.fromkeys(DOT_TOKEN_PATTERN.findall(text)))


def extract_state_citations(text: str) -> list[str]:
    normalized = text.lower()
    listing_markers = (
        "quais estados",
        "which states",
        "estados do ",
        "states of ",
        "estados de ",
        "states for ",
    )
    if any(marker in normalized for marker in listing_markers):
        return []

    citations: list[str] = []
    for match in STATE_CITATION_PATTERN.finditer(text):
        candidate = match.group(1).strip().lower()
        if candidate and candidate not in {"o", "a", "the", "do", "da", "de", "of", "for"}:
            citations.append(candidate)
    for candidate in re.findall(r"\b[a-z]+(?:-[a-z0-9]+)+\b", text.lower()):
        if any(
            marker in text.lower()
            for marker in ("estado", "state", "states", "estados")
        ):
            citations.append(candidate)
    return list(dict.fromkeys(citations))


def extract_cited_component_names(text: str) -> list[str]:
    names: list[str] = []
    for match in COMPONENT_CITATION_PATTERN.finditer(text):
        name = match.group(1).strip()
        if not name or name.lower() in _COMPONENT_CITATION_STOPWORDS:
            continue
        if not name[0].isupper():
            continue
        names.append(name)
    return list(dict.fromkeys(names))


def extract_guideline_citations(text: str) -> list[str]:
    citations: list[str] = []
    for match in GUIDELINE_CITATION_PATTERN.finditer(text):
        candidate = match.group(1).strip()
        if candidate:
            citations.append(candidate)
    for marker in ("guideline", "diretriz", "principle", "princípio", "principio"):
        if marker in text.lower():
            for token in re.findall(r"\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b", text):
                citations.append(token.strip())
    return list(dict.fromkeys(citations))


def extract_variant_citations(text: str) -> list[str]:
    citations: list[str] = []
    for match in VARIANT_CITATION_PATTERN.finditer(text):
        candidate = match.group(1).strip().lower()
        if candidate and candidate not in {"o", "a", "the", "do", "da", "de", "of", "for"}:
            citations.append(candidate)
    if any(marker in text.lower() for marker in ("variante", "variant", "variantes", "variants")):
        for candidate in re.findall(r"\b[a-z]+(?:-[a-z0-9]+)+\b", text.lower()):
            citations.append(candidate)
    return list(dict.fromkeys(citations))


def extract_accessibility_rule_citations(text: str) -> list[str]:
    citations: list[str] = []
    for match in ACCESSIBILITY_RULE_CITATION_PATTERN.finditer(text):
        citations.append(match.group(1).strip().lower())
    if citations:
        return list(dict.fromkeys(citations))

    lowered = text.lower()
    if not any(marker in lowered for marker in _ACCESSIBILITY_QUERY_MARKERS):
        return []

    catalog = accessibility_rule_catalog()
    for rule_id in catalog:
        if "-" in rule_id and rule_id in lowered:
            citations.append(rule_id)
    return list(dict.fromkeys(citations))


    return list(dict.fromkeys(citations))


def match_token(token: str) -> CatalogEntityMatch:
    normalized = token.lower().strip()
    if normalized in token_catalog():
        return CatalogEntityMatch(
            entity_key=normalized,
            entity_label=token,
            entity_type="token",
            entity_status="supported",
            matched_alias=token,
        )
    return CatalogEntityMatch(
        entity_key=normalized,
        entity_label=token,
        entity_type="token",
        entity_status="unknown",
        matched_alias=token,
    )


def match_pattern(name: str) -> CatalogEntityMatch:
    normalized = _normalize_key(name)
    canonical = pattern_catalog().get(normalized)
    if canonical is not None:
        return CatalogEntityMatch(
            entity_key=_normalize_key(canonical).replace(" ", "-"),
            entity_label=canonical,
            entity_type="pattern",
            entity_status="supported",
            matched_alias=name,
        )
    return CatalogEntityMatch(
        entity_key=normalized.replace(" ", "-"),
        entity_label=name.strip(),
        entity_type="pattern",
        entity_status="unknown",
        matched_alias=name,
    )


def match_decision(title: str) -> CatalogEntityMatch:
    normalized = _normalize_key(title)
    canonical = decision_catalog().get(normalized)
    if canonical is not None:
        return CatalogEntityMatch(
            entity_key=_normalize_key(canonical).replace(" ", "-"),
            entity_label=canonical,
            entity_type="decision",
            entity_status="supported",
            matched_alias=title,
        )
    return CatalogEntityMatch(
        entity_key=normalized.replace(" ", "-"),
        entity_label=title.strip(),
        entity_type="decision",
        entity_status="unknown",
        matched_alias=title,
    )


def match_guideline(name: str) -> CatalogEntityMatch:
    normalized = _normalize_key(name)
    canonical = guideline_catalog().get(normalized)
    if canonical is not None:
        return CatalogEntityMatch(
            entity_key=normalized.replace(" ", "-"),
            entity_label=canonical,
            entity_type="guideline",
            entity_status="supported",
            matched_alias=name,
        )
    return CatalogEntityMatch(
        entity_key=normalized.replace(" ", "-"),
        entity_label=name.strip(),
        entity_type="guideline",
        entity_status="unknown",
        matched_alias=name,
    )


def match_state(
    state_id: str,
    *,
    component_id: str | None = None,
) -> CatalogEntityMatch:
    normalized = state_id.lower().strip()
    if component_id is not None:
        index = component_state_index()
        resolved = index.get((component_id, normalized))
        if resolved is not None:
            return CatalogEntityMatch(
                entity_key=f"{component_id}.{resolved}",
                entity_label=resolved,
                entity_type="state",
                entity_status="supported",
                matched_alias=state_id,
                parent_entity_key=component_id,
            )
        return CatalogEntityMatch(
            entity_key=f"{component_id}.{normalized}",
            entity_label=state_id,
            entity_type="state",
            entity_status="unknown",
            matched_alias=state_id,
            parent_entity_key=component_id,
        )

    if normalized in global_state_ids():
        return CatalogEntityMatch(
            entity_key=normalized,
            entity_label=state_id,
            entity_type="state",
            entity_status="partial",
            matched_alias=state_id,
        )
    return CatalogEntityMatch(
        entity_key=normalized,
        entity_label=state_id,
        entity_type="state",
        entity_status="unknown",
        matched_alias=state_id,
    )


def match_variant(
    variant_id: str,
    *,
    component_id: str | None = None,
) -> CatalogEntityMatch:
    normalized = variant_id.lower().strip()
    if component_id is not None:
        index = component_variant_index()
        resolved = index.get((component_id, normalized))
        if resolved is not None:
            return CatalogEntityMatch(
                entity_key=f"{component_id}.{resolved}",
                entity_label=resolved,
                entity_type="variant",
                entity_status="supported",
                matched_alias=variant_id,
                parent_entity_key=component_id,
            )
        return CatalogEntityMatch(
            entity_key=f"{component_id}.{normalized}",
            entity_label=variant_id,
            entity_type="variant",
            entity_status="unknown",
            matched_alias=variant_id,
            parent_entity_key=component_id,
        )

    if normalized in global_variant_ids():
        return CatalogEntityMatch(
            entity_key=normalized,
            entity_label=variant_id,
            entity_type="variant",
            entity_status="partial",
            matched_alias=variant_id,
        )
    return CatalogEntityMatch(
        entity_key=normalized,
        entity_label=variant_id,
        entity_type="variant",
        entity_status="unknown",
        matched_alias=variant_id,
    )


def match_accessibility_rule(rule_id: str) -> CatalogEntityMatch:
    normalized = rule_id.lower().strip()
    catalog = accessibility_rule_catalog()
    if normalized in catalog:
        return CatalogEntityMatch(
            entity_key=normalized,
            entity_label=catalog[normalized],
            entity_type="accessibility_rule",
            entity_status="supported",
            matched_alias=rule_id,
        )
    canonical = catalog.get(_normalize_key(rule_id))
    if canonical is not None:
        return CatalogEntityMatch(
            entity_key=normalized.replace(" ", "-"),
            entity_label=canonical,
            entity_type="accessibility_rule",
            entity_status="supported",
            matched_alias=rule_id,
        )
    return CatalogEntityMatch(
        entity_key=normalized.replace(" ", "-"),
        entity_label=rule_id.strip(),
        entity_type="accessibility_rule",
        entity_status="unknown",
        matched_alias=rule_id,
    )


def _catalog_match_to_resolution(match: CatalogEntityMatch) -> "CatalogEntityResolution":
    from agent.models import CatalogEntityResolution

    return CatalogEntityResolution(
        entity_key=match.entity_key,
        entity_label=match.entity_label,
        entity_type=match.entity_type,  # type: ignore[arg-type]
        entity_status=match.entity_status,  # type: ignore[arg-type]
        matched_alias=match.matched_alias,
    )


def resolve_typed_catalog_entities(
    query: str,
    *,
    normalized_query: str | None = None,
    entities: "ExtractedEntities | None" = None,
) -> "CatalogEntityResolution | None":
    """Validate cited tokens, states, patterns, guidelines and decisions."""
    from agent.entity_resolution import resolve_exact_entity_matches
    from agent.models import CatalogEntityResolution
    from agent.understanding import normalize_query, normalize_text

    del normalized_query
    normalized = normalize_text(query)
    component_id: str | None = None
    exact = resolve_exact_entity_matches(normalize_query(query))
    if exact:
        component_id = exact[0].component_id
    elif entities and entities.components:
        registry = component_registry()
        for name in entities.components:
            for component in registry.values():
                if component.name == name:
                    component_id = component.component_id
                    break

    unknown_matches: list[CatalogEntityMatch] = []
    partial_matches: list[CatalogEntityMatch] = []

    for rule_id in extract_accessibility_rule_citations(query):
        match = match_accessibility_rule(rule_id)
        if match.entity_status == "unknown":
            unknown_matches.append(match)

    if any(marker in normalized for marker in ("variante", "variant", "variantes", "variants")):
        for variant in extract_variant_citations(query):
            match = match_variant(variant, component_id=component_id)
            if match.entity_status == "unknown":
                unknown_matches.append(match)
            elif match.entity_status == "partial":
                partial_matches.append(match)

    for token in list(dict.fromkeys([
        *(entities.tokens if entities else []),
        *extract_dot_notation_tokens(query),
    ])):
        match = match_token(token)
        if match.entity_status == "unknown":
            unknown_matches.append(match)
        elif match.entity_status == "partial":
            partial_matches.append(match)

    for pattern in entities.patterns if entities else []:
        match = match_pattern(pattern)
        if match.entity_status == "unknown":
            unknown_matches.append(match)

    for state in list(dict.fromkeys([
        *(entities.states if entities else []),
        *extract_state_citations(query),
    ])):
        match = match_state(state, component_id=component_id)
        if match.entity_status == "unknown":
            unknown_matches.append(match)
        elif match.entity_status == "partial":
            partial_matches.append(match)

    for guideline in extract_guideline_citations(query):
        match = match_guideline(guideline)
        if match.entity_status == "unknown":
            unknown_matches.append(match)

    if unknown_matches:
        return _catalog_match_to_resolution(unknown_matches[0])
    if partial_matches:
        return _catalog_match_to_resolution(partial_matches[0])
    return None


def catalog_registries_health() -> dict:
    return {
        "tokens": len(token_catalog()),
        "patterns": len({v for v in pattern_catalog().values()}),
        "decisions": len(decision_catalog()),
        "guidelines": len(guideline_catalog()),
        "accessibility_rules": len(accessibility_rule_catalog()),
        "component_states": len(component_state_index()),
        "component_variants": len(component_variant_index()),
    }
