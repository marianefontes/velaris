from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from rag.index_sync import validate_chunks


def test_validate_chunks_rejects_empty_text() -> None:
    _valid, rejected = validate_chunks([
        {
            "id": "x :: y",
            "text": "   ",
            "page_type": "component",
            "title": "X",
            "source": "test.tsx",
            "status": "Stable",
            "char_count": 3,
        },
    ])
    assert rejected and rejected[0].reason == "empty_text"


def test_validate_chunks_dedupes_duplicate_ids() -> None:
    chunks = [
        {
            "id": "same :: id",
            "text": "first",
            "page_type": "component",
            "title": "First",
            "source": "a.tsx",
            "status": "Stable",
            "char_count": 5,
        },
        {
            "id": "same :: id",
            "text": "second",
            "page_type": "component",
            "title": "Second",
            "source": "b.tsx",
            "status": "Stable",
            "char_count": 6,
        },
    ]
    valid, rejected = validate_chunks(chunks)
    assert len(valid) == 1
    assert valid[0]["text"] == "first"
    assert len(rejected) == 1
    assert rejected[0].reason == "duplicate_id_in_dump"


def test_validate_chunks_accepts_valid_chunk() -> None:
    chunk = {
        "id": "ok :: chunk",
        "text": "Velaris component guidance",
        "page_type": "component",
        "title": "Button",
        "source": "data/component-metadata.json",
        "status": "Stable",
        "char_count": 26,
    }
    valid, rejected = validate_chunks([chunk])
    assert valid == [chunk]
    assert rejected == []
