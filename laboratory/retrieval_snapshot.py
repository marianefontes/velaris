"""Capture RAG retrieval configuration for reproducible laboratory runs."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from rag.index_sync import corpus_available, load_corpus_chunks
from rag.retrieval_config import (
    RETRIEVAL_MODE_DENSE,
    RETRIEVAL_MODE_HYBRID,
    resolve_retrieval_mode,
    retrieval_mode,
    rrf_k,
)
from rag.sparse_index import load_sparse_cache, sparse_retrieval_available


def _collection_count(collection: Any | None) -> int:
    if collection is None:
        return 0
    try:
        return int(collection.count())
    except Exception:
        return 0


def capture_retrieval_snapshot(
    *,
    collection: Any | None,
    embedder: Any | None,
    retrieval_mode_override: str | None = None,
) -> dict[str, Any]:
    """Record corpus/index state and the retrieval mode used for a laboratory run."""
    chunks: list[dict[str, Any]] = []
    meta: dict[str, Any] = {}
    if corpus_available():
        chunks, meta = load_corpus_chunks()

    corpus_version = (
        str(meta.get("version") or meta.get("extractor_version") or "unknown")
    )
    env_mode = retrieval_mode()
    effective_mode = resolve_retrieval_mode(retrieval_mode_override)
    sparse_cache = load_sparse_cache()
    sparse_available = sparse_retrieval_available(embedder)
    hybrid_effective = (
        effective_mode == RETRIEVAL_MODE_HYBRID
        and sparse_available
        and sparse_cache is not None
    )

    return {
        "captured_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "retrieval_mode": effective_mode,
        "retrieval_mode_override": retrieval_mode_override,
        "env_retrieval_mode": env_mode,
        "rrf_k": rrf_k(),
        "corpus_version": corpus_version,
        "corpus_chunk_count": len(chunks),
        "indexed_chunk_count": _collection_count(collection),
        "sparse_cache_available": sparse_cache is not None,
        "sparse_cache_corpus_version": (
            sparse_cache.corpus_version if sparse_cache is not None else None
        ),
        "sparse_retrieval_supported": sparse_available,
        "hybrid_effective": hybrid_effective,
        "hybrid_fallback_reason": (
            None
            if hybrid_effective or effective_mode != RETRIEVAL_MODE_HYBRID
            else (
                "sparse_unavailable_in_api_embedding_mode"
                if not sparse_available
                else "sparse_lexical_cache_missing"
            )
        ),
    }


def snapshot_label(snapshot: dict[str, Any] | None) -> str:
    if not snapshot:
        return RETRIEVAL_MODE_DENSE
    return str(snapshot.get("retrieval_mode") or RETRIEVAL_MODE_DENSE)
