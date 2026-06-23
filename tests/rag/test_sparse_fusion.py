from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from rag.sparse_index import reciprocal_rank_fusion


def test_reciprocal_rank_fusion_prefers_shared_hits() -> None:
    fused = reciprocal_rank_fusion(
        [
            ["a", "b", "c"],
            ["b", "a", "d"],
        ],
        k=60,
    )
    assert [chunk_id for chunk_id, _score in fused[:2]] == ["a", "b"]


def test_reciprocal_rank_fusion_boosts_dual_list_hits() -> None:
    fused = reciprocal_rank_fusion([["x", "z"], ["x", "y"]], k=60)
    scores = dict(fused)
    assert scores["x"] > scores["y"]
    assert scores["x"] > scores["z"]
