"""Verify Velaris RAG persistence and semantic retrieval for a runtime path.

Examples:
  python3 scripts/verify_rag_runtime.py --no-query
  CHROMA_DB_PATH=/var/data/chroma_db AETHERIS_EMBEDDING_MODE=api \
    HF_API_TOKEN=hf_... python3 scripts/verify_rag_runtime.py
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import chromadb

from prompts.intent_router import route_query
from rag.chroma_config import chroma_db_path, chroma_runtime_paths
from rag.embedding_provider import create_embedding_provider, embedder_label
from rag.retrieval import retrieve_chunks

COLLECTION_NAME = "aetheris_design_system"
DEFAULT_QUERIES = [
    "why use a side drawer instead of a modal?",
    "compare Modal e Drawer",
    "qual componente usar para mostrar uma predição da IA com explicação?",
]


def _open_collection() -> Any:
    client = chromadb.PersistentClient(path=str(chroma_db_path()))
    return client.get_or_create_collection(
        COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )


def _query_results(collection: Any, embedder: Any, queries: list[str]) -> list[dict[str, Any]]:
    results = []
    for query in queries:
        route = route_query(query)
        chunks = retrieve_chunks(
            collection=collection,
            embedder=embedder,
            rag_ready=collection.count() > 0,
            query=query,
            intent=route.response_intent,
            top_k=3,
            profile=route.persona_profile,
        )
        results.append(
            {
                "query": query,
                "intent": route.response_intent,
                "profile": route.persona_profile,
                "retrieved_count": len(chunks),
                "top_chunks": [
                    {
                        "title": chunk.get("title", ""),
                        "source": chunk.get("source", ""),
                        "page_type": chunk.get("page_type", ""),
                        "similarity": chunk.get("similarity"),
                        "weighted_score": chunk.get("weighted_score"),
                    }
                    for chunk in chunks
                ],
            }
        )
    return results


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify Velaris RAG runtime state")
    parser.add_argument("--json", action="store_true", help="Emit compact JSON")
    parser.add_argument("--no-query", action="store_true", help="Skip embedding-dependent queries")
    parser.add_argument("--query", action="append", default=[], help="Additional query to verify")
    args = parser.parse_args()

    first_collection = _open_collection()
    first_count = first_collection.count()
    reopened_collection = _open_collection()
    reopened_count = reopened_collection.count()

    payload: dict[str, Any] = {
        "status": "ok",
        **chroma_runtime_paths(),
        "collection": COLLECTION_NAME,
        "initial_count": first_count,
        "reopened_count": reopened_count,
        "persistent_after_reopen": first_count == reopened_count and reopened_count > 0,
        "rag_active": reopened_count > 0,
    }

    if not args.no_query:
        queries = DEFAULT_QUERIES + args.query
        embedder = create_embedding_provider()
        payload["embedder"] = embedder_label(embedder)
        payload["queries"] = _query_results(reopened_collection, embedder, queries)

    text = json.dumps(payload, ensure_ascii=False, indent=None if args.json else 2)
    print(text)
    return 0 if payload["rag_active"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
