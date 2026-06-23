"""
bootstrap.py
------------
Synchronize the ChromaDB collection with rag/aetheris-docs-dump.json.

Production deploys do not ship rag/chroma_db/ (it is gitignored), so on the
first start the persistent collection has zero chunks. This module indexes
missing chunks, removes orphan IDs, and logs discarded corpus rows.

Used by server.py at startup. The encode flags mirror rag/setup_vectordb.py
(dense-only cosine), so a bootstrapped index is identical to `npm run index`.
"""

from typing import Any

from rag.index_sync import (
    corpus_available,
    corpus_out_of_sync,
    log_sync_result,
    sync_corpus_index,
)


def bootstrap_collection(collection: Any, embedder: Any) -> int:
    """Sync the versioned corpus dump into ``collection``.

    Returns the number of newly indexed chunks. Also removes orphan IDs that
    no longer exist in the dump and logs any discarded corpus rows.
    """
    if collection is None or embedder is None or not corpus_available():
        return 0

    result = sync_corpus_index(collection, embedder)
    if result.indexed or result.orphans_removed or result.rejected:
        log_sync_result(result, prefix="[bootstrap]")
    return result.indexed


def collection_needs_corpus_sync(collection: Any) -> bool:
    return corpus_out_of_sync(collection)
