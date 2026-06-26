"""Shared corpus-to-ChromaDB indexing with validation and orphan cleanup."""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

try:
    from embedding_provider import dense_vectors
except ImportError:  # pragma: no cover - package import from server/tests
    from rag.embedding_provider import dense_vectors

RAG_DIR = Path(__file__).resolve().parent
DUMP_PATH = RAG_DIR / "aetheris-docs-dump.json"

REQUIRED_FIELDS = ("id", "text", "source", "page_type", "title", "status", "char_count")
_ENCODE_BATCH = 8
_UPSERT_BATCH = 50


@dataclass(frozen=True)
class RejectedChunk:
    chunk_id: str
    reason: str
    title: str = ""
    source: str = ""


@dataclass
class IndexSyncResult:
    dump_total: int = 0
    valid_total: int = 0
    already_indexed: int = 0
    indexed: int = 0
    rejected: list[RejectedChunk] = field(default_factory=list)
    orphans_removed: list[str] = field(default_factory=list)
    collection_total_before: int = 0
    collection_total_after: int = 0

    @property
    def missing_before_sync(self) -> int:
        return max(0, self.valid_total - self.already_indexed)

    @property
    def in_sync(self) -> bool:
        return (
            self.missing_before_sync == 0
            and not self.orphans_removed
            and self.collection_total_after == self.valid_total
        )


def corpus_available() -> bool:
    return DUMP_PATH.exists()


def load_corpus_chunks() -> tuple[list[dict[str, Any]], dict[str, Any]]:
    data = json.loads(DUMP_PATH.read_text(encoding="utf-8"))
    return list(data.get("chunks", [])), data.get("meta", {})


def validate_chunks(chunks: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], list[RejectedChunk]]:
    """Return indexable chunks and rejected entries with explicit reasons."""
    valid: list[dict[str, Any]] = []
    rejected: list[RejectedChunk] = []
    seen_ids: set[str] = set()

    for index, chunk in enumerate(chunks):
        chunk_id = str(chunk.get("id", "")).strip()
        title = str(chunk.get("title", ""))
        source = str(chunk.get("source", ""))

        if not chunk_id:
            rejected.append(RejectedChunk(
                chunk_id=f"<missing-id:{index}>",
                reason="missing_id",
                title=title,
                source=source,
            ))
            continue

        if chunk_id in seen_ids:
            rejected.append(RejectedChunk(
                chunk_id=chunk_id,
                reason="duplicate_id_in_dump",
                title=title,
                source=source,
            ))
            continue
        seen_ids.add(chunk_id)

        missing_fields = [name for name in REQUIRED_FIELDS if name not in chunk]
        if missing_fields:
            rejected.append(RejectedChunk(
                chunk_id=chunk_id,
                reason=f"missing_fields:{','.join(missing_fields)}",
                title=title,
                source=source,
            ))
            continue

        text = str(chunk.get("text", "")).strip()
        if not text:
            rejected.append(RejectedChunk(
                chunk_id=chunk_id,
                reason="empty_text",
                title=title,
                source=source,
            ))
            continue

        valid.append(chunk)

    return valid, rejected


def chunk_metadata(chunk: dict[str, Any]) -> dict[str, Any]:
    return {
        "source": chunk["source"],
        "page_type": chunk["page_type"],
        "title": chunk["title"],
        "component_id": chunk.get("component_id", ""),
        "status": chunk["status"],
        "section": chunk.get("section", ""),
        "kind": chunk.get("kind", ""),
        "chunk_section": chunk.get("chunk_section", ""),
        "command": chunk.get("command", ""),
        "capability": chunk.get("capability", ""),
        "route": chunk.get("route", ""),
        "tags": chunk.get("tags", ""),
        "schema_version": chunk.get("schema_version", ""),
        "char_count": chunk["char_count"],
    }


def corpus_out_of_sync(collection: Any | None) -> bool:
    """True when the dump and Chroma collection diverge (missing or orphan ids)."""
    if collection is None or not corpus_available():
        return False
    chunks, _meta = load_corpus_chunks()
    valid, _rejected = validate_chunks(chunks)
    dump_ids = {chunk["id"] for chunk in valid}
    existing_ids = set(collection.get(include=[])["ids"])
    return dump_ids != existing_ids


def log_sync_result(result: IndexSyncResult, *, prefix: str = "") -> None:
    label = f"{prefix} " if prefix else ""
    print(
        f"{label}Corpus sync — dump={result.dump_total} valid={result.valid_total} "
        f"indexed_now={result.indexed} already_indexed={result.already_indexed} "
        f"orphans_removed={len(result.orphans_removed)} "
        f"collection={result.collection_total_before}->{result.collection_total_after}"
    )

    if result.rejected:
        print(f"{label}Rejected chunks ({len(result.rejected)}):")
        for item in result.rejected:
            print(
                f"  - {item.chunk_id} | reason={item.reason} "
                f"| title={item.title or '-'} | source={item.source or '-'}"
            )

    if result.orphans_removed:
        print(f"{label}Orphan ids removed ({len(result.orphans_removed)}):")
        for chunk_id in result.orphans_removed[:20]:
            print(f"  - {chunk_id}")
        if len(result.orphans_removed) > 20:
            print(f"  ... and {len(result.orphans_removed) - 20} more")

    if result.in_sync:
        print(f"{label}Index in sync with corpus ({result.collection_total_after} chunks).")
    elif result.indexed:
        print(f"{label}Indexed {result.indexed} missing chunk(s).")


def sync_corpus_index(
    collection: Any,
    embedder: Any,
    *,
    prune_orphans: bool = True,
    encode_batch: int = _ENCODE_BATCH,
) -> IndexSyncResult:
    """Index missing corpus chunks and optionally remove orphan ids from Chroma."""
    result = IndexSyncResult()
    if collection is None or embedder is None or not corpus_available():
        return result

    chunks, _meta = load_corpus_chunks()
    result.dump_total = len(chunks)
    result.collection_total_before = collection.count()

    valid, rejected = validate_chunks(chunks)
    result.valid_total = len(valid)
    result.rejected = rejected

    valid_ids = {chunk["id"] for chunk in valid}
    existing_ids = set(collection.get(include=[])["ids"])
    to_index = [chunk for chunk in valid if chunk["id"] not in existing_ids]
    result.already_indexed = len(valid) - len(to_index)

    if prune_orphans:
        orphan_ids = sorted(existing_ids - valid_ids)
        if orphan_ids:
            collection.delete(ids=orphan_ids)
            result.orphans_removed = orphan_ids

    if to_index:
        texts = [chunk["text"] for chunk in to_index]
        ids = [chunk["id"] for chunk in to_index]
        metadatas = [chunk_metadata(chunk) for chunk in to_index]

        embeddings: list[list[float]] = []
        batch_size = max(1, encode_batch)
        for start in range(0, len(texts), batch_size):
            batch = texts[start : start + batch_size]
            encoded = embedder.encode(
                batch,
                batch_size=batch_size,
                max_length=512,
                return_dense=True,
                return_sparse=False,
                return_colbert_vecs=False,
            )
            embeddings.extend(dense_vectors(encoded))

        if len(embeddings) != len(ids):
            raise RuntimeError(
                f"Embedding count mismatch: expected {len(ids)}, got {len(embeddings)}"
            )

        for start in range(0, len(ids), _UPSERT_BATCH):
            end = start + _UPSERT_BATCH
            collection.upsert(
                ids=ids[start:end],
                embeddings=embeddings[start:end],
                documents=texts[start:end],
                metadatas=metadatas[start:end],
            )

        result.indexed = len(to_index)

    result.collection_total_after = collection.count()
    if result.collection_total_after != result.valid_total:
        raise RuntimeError(
            "ChromaDB count mismatch after sync: "
            f"db={result.collection_total_after} expected={result.valid_total}"
        )

    _maybe_rebuild_sparse_cache(embedder, valid, _meta, result, encode_batch)
    return result


def _maybe_rebuild_sparse_cache(
    embedder: Any,
    valid: list[dict[str, Any]],
    meta: dict[str, Any],
    result: IndexSyncResult,
    encode_batch: int,
) -> None:
    try:
        from rag.sparse_index import (
            cache_matches_corpus,
            load_sparse_cache,
            rebuild_sparse_cache_if_supported,
            sparse_retrieval_available,
        )
    except ImportError:
        from sparse_index import (
            cache_matches_corpus,
            load_sparse_cache,
            rebuild_sparse_cache_if_supported,
            sparse_retrieval_available,
        )

    if not sparse_retrieval_available(embedder):
        return

    corpus_version = (
        meta.get("version")
        or meta.get("extractor_version")
        or "unknown"
    )
    cache = load_sparse_cache()
    needs_rebuild = (
        result.indexed > 0
        or bool(result.orphans_removed)
        or cache is None
        or cache.corpus_version != corpus_version
        or not cache_matches_corpus(cache, valid)
    )
    if not needs_rebuild:
        return

    try:
        rebuild_sparse_cache_if_supported(
            embedder,
            valid,
            corpus_version=corpus_version,
            batch_size=encode_batch,
        )
    except Exception as error:
        print(
            "[index-sync] sparse lexical cache rebuild failed "
            f"({type(error).__name__}): {error}"
        )
