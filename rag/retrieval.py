"""Retrieval strategies for semantic search and full registry catalog mode.

Perspective-aware retrieval: derivation policy
-----------------------------------------------
Each perspective has two retrieval signals:

1. ``PROFILE_RETRIEVAL_WEIGHTS``: a hand-tuned matrix mapping
   ``(perspective, page_type) -> float`` on a 1.00–1.50 scale.
   The weights are derived from a chunk-type relevance matrix
   validated against a representative query set per perspective.
   Each pair is scored based on how often that chunk type appears
   in the top-3 chunks of perspective-typical queries.

2. ``_vocabulary_boost``: a runtime multiplier applied per chunk
   based on how many of the perspective's vocabulary terms appear
   in the chunk text. Capped at +20% to prevent keyword overfit.
   Source of vocabulary: ``COGNITIVE_PROFILES[profile].vocabulary``
   in :mod:`prompts.cognitive_profiles`.

Final chunk score = similarity × retrieval_weight × vocabulary_boost.

The vocabulary boost is what makes retrieval *demonstrably*
perspective-adaptive rather than implicitly so. It is the academic
signal layer; the static weight is the structural prior.
"""

import os
from typing import Any

from component_metadata import component_metadata, component_to_json

from prompts.cognitive_profiles import COGNITIVE_PROFILES
from prompts.intent_router import INTENT_FILTER


def _debug_enabled() -> bool:
    return os.environ.get("BEATRICE_DEBUG", "").strip() in {"1", "true", "yes"}


def _debug(message: str) -> None:
    if _debug_enabled():
        print(f"[beatrice:retrieval] {message}")

CATALOG_PAGE_TYPES: dict[str, list[str]] = {
    "components": ["component", "xai_component"],
    "patterns": ["pattern"],
    "tokens": ["token", "token_alias"],
    "decisions": ["design_decision"],
    "all": [],
}

# Vocabulary boost configuration: small per-hit increment, capped total.
# +4% per term hit, max 5 hits counted → max +20% boost.
_VOCAB_BOOST_PER_HIT: float = 0.04
_VOCAB_BOOST_MAX_HITS: int = 5

PROFILE_RETRIEVAL_WEIGHTS: dict[str, dict[str, float]] = {
    "designer": {
        "pattern": 1.35,
        "foundation": 1.2,
        "component": 1.1,
        "guideline": 1.1,
        "design_decision": 1.05,
    },
    "dev": {
        "component": 1.35,
        "token": 1.25,
        "guideline": 1.15,
        "pattern": 1.05,
        "design_decision": 1.05,
    },
    "design_system_manager": {
        "design_decision": 1.35,
        "pattern": 1.15,
        "reasoning": 1.1,
        "component": 1.0,
    },
    "qa": {
        "guideline": 1.35,
        "component": 1.2,
        "xai_component": 1.15,
        "pattern": 1.1,
    },
    "tech_writer": {
        "component": 1.2,
        "design_decision": 1.2,
        "guideline": 1.15,
        "foundation": 1.1,
    },
    "product_designer": {
        "pattern": 1.35,
        "component": 1.25,
        "guideline": 1.2,
        "design_decision": 1.15,
        "foundation": 1.1,
    },
    "a11y": {
        "xai_component": 1.30,
        "guideline": 1.30,
        "component": 1.25,
        "foundation": 1.20,
        "pattern": 1.10,
    },
    "maintainer": {
        "design_decision": 1.40,
        "guideline": 1.30,
        "pattern": 1.20,
        "reasoning": 1.20,
        "foundation": 1.10,
    },
}

CATALOG_TYPE_ORDER: dict[str, int] = {
    "component": 10,
    "xai_component": 20,
    "pattern": 30,
    "token": 40,
    "token_alias": 41,
    "design_decision": 50,
    "guideline": 60,
    "foundation": 70,
    "reasoning": 80,
}


def _collection_count(collection: Any | None) -> int:
    return collection.count() if collection else 0


def _page_type_filter(page_types: list[str]) -> dict[str, Any] | None:
    return {"page_type": {"$in": page_types}} if page_types else None


def _vocabulary_boost(text: str, vocabulary: list[str]) -> float:
    """Multiplier in [1.0, 1.20] based on perspective vocabulary overlap.

    Each unique vocabulary term found in ``text`` contributes
    ``_VOCAB_BOOST_PER_HIT``, capped at ``_VOCAB_BOOST_MAX_HITS`` hits.
    Returns 1.0 (neutral) when the vocabulary is empty or no terms hit.
    """
    if not vocabulary:
        return 1.0
    text_lower = text.lower()
    hits = sum(1 for term in vocabulary if term.lower() in text_lower)
    capped_hits = min(hits, _VOCAB_BOOST_MAX_HITS)
    return round(1.0 + capped_hits * _VOCAB_BOOST_PER_HIT, 3)


def _perspective_vocabulary(profile: str) -> list[str]:
    cognitive_profile = COGNITIVE_PROFILES.get(profile)
    return list(cognitive_profile.vocabulary) if cognitive_profile else []


def _chunk_from_result(
    *,
    document: str,
    metadata: dict[str, Any],
    similarity: float,
    profile: str,
    retrieval_mode: str,
    vocabulary: list[str] | None = None,
) -> dict[str, Any]:
    page_type = metadata.get("page_type", "")
    retrieval_weight = PROFILE_RETRIEVAL_WEIGHTS.get(profile, {}).get(page_type, 1.0)
    vocab_boost = _vocabulary_boost(document, vocabulary or [])
    weighted_score = round(similarity * retrieval_weight * vocab_boost, 3)
    return {
        "text": document,
        "component_id": metadata.get("component_id", ""),
        "title": metadata.get("title", ""),
        "source": metadata.get("source", ""),
        "page_type": page_type,
        "status": metadata.get("status", ""),
        "section": metadata.get("section", ""),
        "schema_version": metadata.get("schema_version", ""),
        "similarity": similarity,
        "retrieval_weight": retrieval_weight,
        "vocabulary_boost": vocab_boost,
        "weighted_score": weighted_score,
        "retrieval_mode": retrieval_mode,
    }


def _enrich_component_chunk(chunk: dict[str, Any]) -> dict[str, Any]:
    component_id = str(chunk.get("component_id", ""))
    if not component_id:
        return chunk
    component = component_metadata(component_id)
    if component is None:
        return chunk
    metadata = component_to_json(component)
    return {
        **chunk,
        "status": component.status,
        "section": component.section,
        "when_to_use": metadata["when_to_use"],
        "when_not_to_use": metadata["when_not_to_use"],
        "accessibility": metadata["accessibility"],
        "aetheris_insight": metadata["aetheris_insight"],
        "component_metadata": metadata,
    }


def _query_embedder(embedder: Any, query: str) -> list[float]:
    return embedder.encode(
        [query],
        return_dense=True,
        return_sparse=False,
        return_colbert_vecs=False,
    )["dense_vecs"][0].tolist()


def retrieve_chunks(
    *,
    collection: Any | None,
    embedder: Any,
    rag_ready: bool,
    query: str,
    intent: str,
    top_k: int = 3,
    profile: str = "general",
) -> list[dict[str, Any]]:
    if not rag_ready or collection is None or _collection_count(collection) == 0:
        _debug(
            f"semantic retrieval skipped: rag_ready={rag_ready} "
            f"collection={'loaded' if collection else 'none'} "
            f"count={_collection_count(collection)}"
        )
        return []

    page_types = INTENT_FILTER.get(intent, [])
    where = _page_type_filter(page_types)
    _debug(
        f"query={query[:120]!r} intent={intent} top_k={top_k} "
        f"profile={profile} page_type_filter={page_types or 'none'}"
    )

    # Embedding and vector-store errors are a degraded mode, not a fatal
    # pipeline error: return no chunks and let the caller fall back to the
    # canonical catalog. The error is always surfaced on the console.
    try:
        vector = _query_embedder(embedder, query)
    except Exception as error:
        print(
            "[beatrice:retrieval] embedding error "
            f"({type(error).__name__}): {error}"
        )
        return []

    requested_results = min(max(top_k * 4, top_k), collection.count())
    query_kwargs: dict[str, Any] = {
        "query_embeddings": [vector],
        "n_results": requested_results,
        "include": ["documents", "metadatas", "distances"],
    }
    if where:
        query_kwargs["where"] = where

    try:
        results = collection.query(**query_kwargs)
        if where and not results.get("documents", [[]])[0]:
            raise ValueError("Filtered retrieval returned no documents")
    except Exception as filtered_error:
        _debug(f"filtered retrieval fell back to unfiltered: {filtered_error}")
        try:
            results = collection.query(
                query_embeddings=[vector],
                n_results=requested_results,
                include=["documents", "metadatas", "distances"],
            )
        except Exception as error:
            print(
                "[beatrice:retrieval] vector store error "
                f"({type(error).__name__}): {error}"
            )
            return []

    vocabulary = _perspective_vocabulary(profile)
    chunks = []
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]
    for index, document in enumerate(documents):
        distance = distances[index]
        similarity = round(1.0 - distance, 3)
        chunks.append(_chunk_from_result(
            document=document,
            metadata=metadatas[index],
            similarity=similarity,
            profile=profile,
            retrieval_mode="semantic",
            vocabulary=vocabulary,
        ))

    chunks.sort(key=lambda chunk: (chunk["weighted_score"], chunk["similarity"]), reverse=True)
    selected = [_enrich_component_chunk(chunk) for chunk in chunks[:top_k]]
    _debug(
        f"retrieved {len(documents)} candidate(s), selected {len(selected)}: "
        + "; ".join(
            f"{chunk['title']} (sim={chunk['similarity']:.3f}, "
            f"score={chunk['weighted_score']:.3f}, type={chunk['page_type']})"
            for chunk in selected
        )
    )
    return selected


def retrieve_catalog_chunks(
    *,
    collection: Any | None,
    catalog_entity: str,
    profile: str = "general",
) -> list[dict[str, Any]]:
    if collection is None or _collection_count(collection) == 0:
        return []

    page_types = CATALOG_PAGE_TYPES.get(catalog_entity, [])
    where = _page_type_filter(page_types)

    try:
        results = collection.get(where=where, include=["documents", "metadatas"]) if where else collection.get(
            include=["documents", "metadatas"],
        )
    except Exception:
        results = collection.get(include=["documents", "metadatas"])

    documents = results.get("documents", [])
    metadatas = results.get("metadatas", [])
    vocabulary = _perspective_vocabulary(profile)
    chunks = []
    for index, document in enumerate(documents):
        metadata = metadatas[index]
        page_type = metadata.get("page_type", "")
        if page_types and page_type not in page_types:
            continue
        chunks.append(_chunk_from_result(
            document=document,
            metadata=metadata,
            similarity=1.0,
            profile=profile,
            retrieval_mode="catalog_full",
            vocabulary=vocabulary,
        ))

    chunks.sort(key=lambda chunk: (
        CATALOG_TYPE_ORDER.get(chunk["page_type"], 999),
        chunk["title"].lower(),
    ))
    return [_enrich_component_chunk(chunk) for chunk in chunks]
