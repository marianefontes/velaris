"""
bootstrap.py
------------
Rebuild the ChromaDB collection from the in-repo corpus when it is empty.

Production deploys do not ship rag/chroma_db/ (it is gitignored), so on the
first start the persistent collection has zero chunks. This module re-indexes
every chunk from rag/aetheris-docs-dump.json (which IS versioned) using the
already-loaded BGE-M3 embedder, so retrieval works without a separate indexing
step and without depending on a local file that is absent in the cloud.

Used by server.py at startup. The encode flags mirror rag/setup_vectordb.py
(dense-only cosine), so a bootstrapped index is identical to `npm run index`.
"""

import json
from pathlib import Path
from typing import Any

RAG_DIR = Path(__file__).parent
DUMP_PATH = RAG_DIR / "aetheris-docs-dump.json"

_ENCODE_BATCH = 8
_UPSERT_BATCH = 50


def corpus_available() -> bool:
    return DUMP_PATH.exists()


def _chunk_metadata(chunk: dict) -> dict:
    return {
        "source": chunk["source"],
        "page_type": chunk["page_type"],
        "title": chunk["title"],
        "component_id": chunk.get("component_id", ""),
        "status": chunk["status"],
        "section": chunk.get("section", ""),
        "schema_version": chunk.get("schema_version", ""),
        "char_count": chunk["char_count"],
    }


def bootstrap_collection(collection: Any, embedder: Any) -> int:
    """Index missing corpus chunks into ``collection``.

    Returns the number of chunks indexed (0 if nothing was needed or the
    embedder/corpus is unavailable). Safe to call on a non-empty collection:
    only chunks whose id is not already present are embedded.
    """
    if collection is None or embedder is None or not corpus_available():
        return 0

    data = json.loads(DUMP_PATH.read_text(encoding="utf-8"))
    chunks = data.get("chunks", [])
    if not chunks:
        return 0

    existing_ids = set(collection.get(include=[])["ids"])
    to_index = [chunk for chunk in chunks if chunk["id"] not in existing_ids]
    if not to_index:
        return 0

    texts = [chunk["text"] for chunk in to_index]
    ids = [chunk["id"] for chunk in to_index]
    metadatas = [_chunk_metadata(chunk) for chunk in to_index]

    embeddings: list[list[float]] = []
    for start in range(0, len(texts), _ENCODE_BATCH):
        batch = texts[start : start + _ENCODE_BATCH]
        result = embedder.encode(
            batch,
            batch_size=_ENCODE_BATCH,
            max_length=512,
            return_dense=True,
            return_sparse=False,
            return_colbert_vecs=False,
        )
        embeddings.extend(result["dense_vecs"].tolist())

    for start in range(0, len(ids), _UPSERT_BATCH):
        end = start + _UPSERT_BATCH
        collection.upsert(
            ids=ids[start:end],
            embeddings=embeddings[start:end],
            documents=texts[start:end],
            metadatas=metadatas[start:end],
        )

    return len(to_index)
