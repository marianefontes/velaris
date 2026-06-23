"""BGE-M3 sparse lexical cache and reciprocal-rank fusion helpers."""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any

try:
    from rag.chroma_config import chroma_db_path
    from rag.embedding_provider import LocalBGEM3Provider, lexical_weights
    from rag.index_sync import validate_chunks
except ImportError:  # pragma: no cover - rag/ script imports
    from chroma_config import chroma_db_path
    from embedding_provider import LocalBGEM3Provider, lexical_weights
    from index_sync import validate_chunks

CACHE_FILENAME = "sparse_lexical_cache.json"
_ENCODE_BATCH = 8


@dataclass(frozen=True)
class SparseLexicalCache:
    corpus_version: str
    chunk_ids: list[str]
    page_types: list[str]
    lexical_weights: list[dict[str, float]]

    def fingerprint(self) -> frozenset[str]:
        return frozenset(self.chunk_ids)


def sparse_cache_path() -> Path:
    return chroma_db_path() / CACHE_FILENAME


def sparse_retrieval_available(embedder: Any | None) -> bool:
    return isinstance(embedder, LocalBGEM3Provider)


def serialize_lexical_weights(weights: dict[str, Any]) -> dict[str, float]:
    return {str(token): float(value) for token, value in weights.items()}


def reciprocal_rank_fusion(
    ranked_lists: list[list[str]],
    *,
    k: int = 60,
) -> list[tuple[str, float]]:
    scores: dict[str, float] = {}
    for ranked in ranked_lists:
        for rank, chunk_id in enumerate(ranked, start=1):
            scores[chunk_id] = scores.get(chunk_id, 0.0) + (1.0 / (k + rank))
    return sorted(scores.items(), key=lambda item: item[1], reverse=True)


def load_sparse_cache() -> SparseLexicalCache | None:
    path = sparse_cache_path()
    if not path.exists():
        return None
    payload = json.loads(path.read_text(encoding="utf-8"))
    return SparseLexicalCache(
        corpus_version=str(payload.get("corpus_version", "")),
        chunk_ids=list(payload.get("chunk_ids", [])),
        page_types=list(payload.get("page_types", [])),
        lexical_weights=list(payload.get("lexical_weights", [])),
    )


def save_sparse_cache(cache: SparseLexicalCache) -> Path:
    path = sparse_cache_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(
            {
                "corpus_version": cache.corpus_version,
                "chunk_ids": cache.chunk_ids,
                "page_types": cache.page_types,
                "lexical_weights": cache.lexical_weights,
            },
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )
    return path


def build_sparse_cache(
    embedder: Any,
    chunks: list[dict[str, Any]],
    *,
    corpus_version: str,
    batch_size: int = _ENCODE_BATCH,
) -> SparseLexicalCache:
    if not sparse_retrieval_available(embedder):
        raise RuntimeError("Sparse cache build requires local BGE-M3 (FlagEmbedding).")

    valid, rejected = validate_chunks(chunks)
    if rejected:
        reasons = ", ".join(f"{item.chunk_id}:{item.reason}" for item in rejected[:5])
        raise RuntimeError(f"Cannot build sparse cache with rejected chunks: {reasons}")

    texts = [chunk["text"] for chunk in valid]
    encoded = embedder._model.encode_corpus(
        texts,
        batch_size=max(1, batch_size),
        max_length=512,
        return_dense=False,
        return_sparse=True,
        return_colbert_vecs=False,
    )
    weights = [
        serialize_lexical_weights(item)
        for item in lexical_weights(encoded)
    ]
    if len(weights) != len(valid):
        raise RuntimeError(
            f"Sparse cache build mismatch: {len(weights)} weights for {len(valid)} chunks"
        )

    return SparseLexicalCache(
        corpus_version=corpus_version,
        chunk_ids=[chunk["id"] for chunk in valid],
        page_types=[str(chunk["page_type"]) for chunk in valid],
        lexical_weights=weights,
    )


def ensure_sparse_cache(
    embedder: Any,
    chunks: list[dict[str, Any]],
    *,
    corpus_version: str,
    batch_size: int = _ENCODE_BATCH,
) -> SparseLexicalCache | None:
    if not sparse_retrieval_available(embedder):
        return None
    valid, _rejected = validate_chunks(chunks)
    cache = load_sparse_cache()
    if (
        cache is not None
        and cache.corpus_version == corpus_version
        and cache_matches_corpus(cache, valid)
    ):
        return cache
    return rebuild_sparse_cache_if_supported(
        embedder,
        valid,
        corpus_version=corpus_version,
        batch_size=batch_size,
    )


def rebuild_sparse_cache_if_supported(
    embedder: Any,
    chunks: list[dict[str, Any]],
    *,
    corpus_version: str,
    batch_size: int = _ENCODE_BATCH,
) -> SparseLexicalCache | None:
    if not sparse_retrieval_available(embedder):
        return None
    cache = build_sparse_cache(
        embedder,
        chunks,
        corpus_version=corpus_version,
        batch_size=batch_size,
    )
    path = save_sparse_cache(cache)
    print(
        f"[sparse-index] lexical cache rebuilt: {len(cache.chunk_ids)} chunks → {path}"
    )
    return cache


def cache_matches_corpus(cache: SparseLexicalCache, chunks: list[dict[str, Any]]) -> bool:
    valid, _rejected = validate_chunks(chunks)
    return cache.fingerprint() == {chunk["id"] for chunk in valid}


def encode_query_lexical_weights(embedder: Any, query: str) -> dict[str, float]:
    encoded = embedder._model.encode_queries(
        [query],
        max_length=512,
        return_dense=False,
        return_sparse=True,
        return_colbert_vecs=False,
    )
    weights = lexical_weights(encoded)
    if not weights:
        return {}
    return serialize_lexical_weights(weights[0])


def rank_sparse_chunks(
    embedder: Any,
    *,
    query: str,
    cache: SparseLexicalCache,
    page_types: list[str],
    limit: int,
) -> list[tuple[str, float]]:
    indices = [
        index
        for index, page_type in enumerate(cache.page_types)
        if not page_types or page_type in page_types
    ]
    if not indices:
        return []

    query_weights = encode_query_lexical_weights(embedder, query)
    doc_weights = [cache.lexical_weights[index] for index in indices]
    doc_ids = [cache.chunk_ids[index] for index in indices]
    scores_matrix = embedder._model.compute_lexical_matching_score(
        [query_weights],
        doc_weights,
    )
    scores = [float(value) for value in scores_matrix[0]]
    ranked = sorted(zip(doc_ids, scores), key=lambda item: item[1], reverse=True)
    return ranked[:limit]
