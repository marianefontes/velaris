"""Semantic section chunking for component catalog records."""

from __future__ import annotations

import re
from typing import Any

from component_metadata import ComponentMetadata, localized_rules, localized_text

SOURCE_FILE = "data/component-metadata.json"
DEFAULT_MAX_CHUNK_CHARS = 1600

SECTION_GROUPS: tuple[tuple[str, tuple[str, ...]], ...] = (
    (
        "overview",
        (
            "Name",
            "Status",
            "Section",
            "Description",
            "About",
            "About Features",
            "Common Uses",
        ),
    ),
    (
        "structure",
        ("Logic", "Structure", "Intent", "Intents", "Variants", "States"),
    ),
    (
        "usage",
        ("Do", "Don't", "When To Use", "When Not To Use"),
    ),
    (
        "accessibility",
        ("Accessibility", "Accessibility Items", "Keyboard", "ARIA"),
    ),
    (
        "governance",
        ("Edge Cases", "Content Guidelines", "Governance Notes", "Anti Patterns"),
    ),
    (
        "reference",
        (
            "Related Components",
            "Examples",
            "Trade Offs",
            "RAG Relation",
            "Aetheris Insight",
        ),
    ),
)

LABEL_TO_FIELD = {
    "Description": "description",
    "Logic": "logic",
    "Structure": "structure",
    "When To Use": "when_to_use",
    "When Not To Use": "when_not_to_use",
    "Accessibility": "accessibility",
    "Trade Offs": "trade_offs",
    "RAG Relation": "rag_relation",
    "Aetheris Insight": "aetheris_insight",
}


def component_field_lines(
    component: ComponentMetadata,
    locale: str = "pt",
) -> list[tuple[str, str]]:
    """Field lines aligned with component_document_text(), omitting empty values."""
    candidates: list[tuple[str, str]] = [
        ("Name", component.name),
        ("Status", component.status),
        ("Section", component.section),
        ("Description", localized_text(component.description, locale)),
        ("About", localized_text(component.about, locale)),
        (
            "About Features",
            "; ".join(
                (
                    f"{localized_text(item.title, locale)}: "
                    f"{localized_text(item.description, locale)}"
                )
                for item in component.about_features
            ),
        ),
        (
            "Common Uses",
            "; ".join(
                localized_text(item, locale)
                for item in component.common_uses
            ),
        ),
        ("Logic", localized_text(component.logic, locale)),
        ("Structure", localized_text(component.structure, locale)),
        (
            "Intent",
            localized_text(component.intent.label, locale) if component.intent else "",
        ),
        (
            "Intents",
            "; ".join(
                localized_text(intent.label, locale)
                for intent in component.intents or []
            ),
        ),
        (
            "Variants",
            "; ".join(
                localized_text(variant.label, locale)
                for variant in component.variants or []
            ),
        ),
        (
            "States",
            "; ".join(
                localized_text(state.label, locale)
                for state in component.states or []
            ),
        ),
        ("Do", "; ".join(localized_rules(component.do, locale) or [])),
        ("Don't", "; ".join(localized_rules(component.dont, locale) or [])),
        (
            "When To Use",
            "; ".join(localized_rules(component.when_to_use, locale) or []),
        ),
        (
            "When Not To Use",
            "; ".join(localized_rules(component.when_not_to_use, locale) or []),
        ),
        (
            "Accessibility",
            localized_text(
                component.accessibility.summary if component.accessibility else None,
                locale,
            ),
        ),
        (
            "Accessibility Items",
            "; ".join(
                (
                    f"{localized_text(item.title, locale)}: "
                    f"{localized_text(item.description, locale)}"
                )
                for item in (
                    component.accessibility.items
                    if component.accessibility
                    and component.accessibility.items is not None
                    else []
                )
            ),
        ),
        (
            "Keyboard",
            "; ".join(
                localized_rules(
                    component.accessibility.keyboard
                    if component.accessibility
                    else None,
                    locale,
                ) or []
            ),
        ),
        (
            "ARIA",
            "; ".join(
                localized_text(rule.text, locale)
                for rule in (
                    component.accessibility.aria
                    if component.accessibility
                    and component.accessibility.aria is not None
                    else []
                )
            ),
        ),
        (
            "Edge Cases",
            "; ".join(localized_rules(component.edge_cases, locale) or []),
        ),
        (
            "Content Guidelines",
            "; ".join(localized_rules(component.content_guidelines, locale) or []),
        ),
        (
            "Governance Notes",
            "; ".join(localized_rules(component.governance_notes, locale) or []),
        ),
        (
            "Related Components",
            "; ".join(component.related_components or []),
        ),
        (
            "Examples",
            "; ".join(
                localized_text(example.text, locale)
                for example in component.examples or []
            ),
        ),
        (
            "Anti Patterns",
            "; ".join(localized_rules(component.anti_patterns, locale) or []),
        ),
        ("Trade Offs", localized_text(component.trade_offs, locale)),
        ("RAG Relation", localized_text(component.rag_relation, locale)),
        ("Aetheris Insight", localized_text(component.aetheris_insight, locale)),
    ]
    return [(label, value.strip()) for label, value in candidates if value and value.strip()]


def make_component_section_id(
    component_id: str,
    section: str,
    *,
    source_file: str = SOURCE_FILE,
) -> str:
    base = source_file.replace(".tsx", "").lower()
    section_slug = re.sub(r"[^a-z0-9]+", "_", section.lower()).strip("_")
    return f"{base} :: {component_id} :: {section_slug}"


def _section_title(component_name: str, section: str) -> str:
    readable = section.replace("_", " ").title()
    return f"{component_name} — {readable}"


def _compose_text(
    *,
    product_name: str,
    page_type: str,
    component_name: str,
    section: str,
    parts: list[tuple[str, str]],
) -> str:
    header = (
        f"{product_name.upper()} {page_type.upper()}: "
        f"{component_name} — {section.replace('_', ' ').title()}"
    )
    body = " | ".join(f"{label}: {value}" for label, value in parts)
    return f"{header} | {body}" if body else header


def _split_list_field(label: str, value: str, max_chars: int) -> list[tuple[str, str]]:
    items = [item.strip() for item in value.split(";") if item.strip()]
    if not items:
        return [(label, value)]

    segments: list[tuple[str, str]] = []
    current: list[str] = []
    current_len = 0
    part_index = 1

    def flush() -> None:
        nonlocal part_index, current, current_len
        if not current:
            return
        suffix = f" ({part_index})" if part_index > 1 or len(items) > 1 else ""
        segments.append((f"{label}{suffix}", "; ".join(current)))
        part_index += 1
        current = []
        current_len = 0

    for item in items:
        projected = current_len + len(item) + (2 if current else 0)
        if current and projected > max_chars:
            flush()
        current.append(item)
        current_len += len(item) + (2 if len(current) > 1 else 0)
    flush()
    return segments


def _split_parts(
    parts: list[tuple[str, str]],
    *,
    max_chars: int,
    product_name: str,
    page_type: str,
    component_name: str,
    section: str,
) -> list[list[tuple[str, str]]]:
    if not parts:
        return []

    expanded: list[tuple[str, str]] = []
    for label, value in parts:
        if len(value) > max_chars and ";" in value:
            expanded.extend(_split_list_field(label, value, max_chars=max_chars // 2))
        else:
            expanded.append((label, value))

    batches: list[list[tuple[str, str]]] = []
    current: list[tuple[str, str]] = []

    for label, value in expanded:
        candidate = [*current, (label, value)]
        text = _compose_text(
            product_name=product_name,
            page_type=page_type,
            component_name=component_name,
            section=section,
            parts=candidate,
        )
        if current and len(text) > max_chars:
            batches.append(current)
            current = [(label, value)]
            continue
        current = candidate

    if current:
        batches.append(current)
    return batches


def _fields_from_parts(parts: list[tuple[str, str]], *, component_section: str) -> dict[str, str]:
    fields: dict[str, str] = {
        "context_of_use": f"Component section: {component_section}",
    }
    for label, value in parts:
        mapped = LABEL_TO_FIELD.get(label)
        if mapped:
            fields[mapped] = value
    return fields


def build_component_section_chunks(
    component: ComponentMetadata,
    *,
    page_type: str,
    schema_version: str,
    product_name: str,
    source_file: str = SOURCE_FILE,
    max_chunk_chars: int = DEFAULT_MAX_CHUNK_CHARS,
    locale: str = "pt",
) -> list[dict[str, Any]]:
    """Split a component record into embed-friendly semantic section chunks."""
    line_by_label = {
        label: value
        for label, value in component_field_lines(component, locale)
    }
    chunks: list[dict[str, Any]] = []

    for group_name, labels in SECTION_GROUPS:
        parts = [
            (label, line_by_label[label])
            for label in labels
            if label in line_by_label
        ]
        if not parts:
            continue

        batches = _split_parts(
            parts,
            max_chars=max_chunk_chars,
            product_name=product_name,
            page_type=page_type,
            component_name=component.name,
            section=group_name,
        )
        for index, batch in enumerate(batches, start=1):
            section_key = group_name if len(batches) == 1 else f"{group_name}_{index}"
            text = _compose_text(
                product_name=product_name,
                page_type=page_type,
                component_name=component.name,
                section=section_key,
                parts=batch,
            )
            fields = _fields_from_parts(batch, component_section=section_key)
            chunk = {
                "id": make_component_section_id(
                    component.component_id,
                    section_key,
                    source_file=source_file,
                ),
                "source": source_file,
                "page_type": page_type,
                "title": _section_title(component.name, section_key),
                "status": component.status,
                "structure": fields.get("structure", ""),
                "logic": fields.get("logic", ""),
                "context_of_use": fields.get("context_of_use", ""),
                "when_to_use": fields.get("when_to_use", ""),
                "when_not_to_use": fields.get("when_not_to_use", ""),
                "trade_offs": fields.get("trade_offs", ""),
                "accessibility": fields.get("accessibility", ""),
                "rag_relation": fields.get("rag_relation", ""),
                "aetheris_insight": fields.get("aetheris_insight", ""),
                "text": text,
                "char_count": len(text),
                "component_id": component.component_id,
                "section": component.section,
                "schema_version": schema_version,
                "chunk_section": section_key,
                "kind": "component_section",
            }
            if fields.get("description"):
                chunk["description"] = fields["description"]
            chunks.append(chunk)

    return chunks
