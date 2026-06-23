from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from component_metadata import component_catalog

from rag.component_chunking import DEFAULT_MAX_CHUNK_CHARS, build_component_section_chunks


def test_component_chunks_respect_size_budget() -> None:
    catalog = component_catalog()
    oversized: list[tuple[str, str, int]] = []
    for component in catalog.components:
        chunks = build_component_section_chunks(
            component,
            page_type="component",
            schema_version=catalog.schema_version,
            product_name="Velaris",
        )
        assert chunks, component.component_id
        assert chunks[0]["chunk_section"].startswith("overview"), component.component_id
        for chunk in chunks:
            size = chunk["char_count"]
            if size > DEFAULT_MAX_CHUNK_CHARS:
                oversized.append((component.component_id, chunk["chunk_section"], size))
    assert not oversized, oversized[:5]


def test_large_component_splits_into_multiple_sections() -> None:
    catalog = component_catalog()
    toggle = next(
        component
        for component in catalog.components
        if component.component_id == "toggle-switch"
    )
    chunks = build_component_section_chunks(
        toggle,
        page_type="component",
        schema_version=catalog.schema_version,
        product_name="Velaris",
    )
    sections = {chunk["chunk_section"] for chunk in chunks}
    assert len(chunks) >= 4
    assert "overview" in sections
    assert "usage" in sections or any(section.startswith("usage") for section in sections)


def test_overview_chunk_preserves_about_signals() -> None:
    catalog = component_catalog()
    button = next(
        component
        for component in catalog.components
        if component.component_id == "button"
    )
    overview = build_component_section_chunks(
        button,
        page_type="component",
        schema_version=catalog.schema_version,
        product_name="Velaris",
    )[0]
    assert "About:" in overview["text"]
    assert "About Features:" in overview["text"]
    assert "Common Uses:" in overview["text"]
