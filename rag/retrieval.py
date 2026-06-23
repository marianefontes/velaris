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

Hybrid mode (``AETHERIS_RETRIEVAL_MODE=hybrid``) fuses dense Chroma
results with BGE-M3 sparse lexical scores via reciprocal-rank fusion.
Set ``AETHERIS_RETRIEVAL_MODE=dense`` to reproduce the baseline.
"""

import os
from typing import Any

from rag.embedding_provider import dense_vectors
from rag.retrieval_config import (
    hybrid_retrieval_active,
    hybrid_retrieval_enabled,
    resolve_retrieval_mode,
    retrieval_mode,
    rrf_k,
)
from rag.sparse_index import (
    load_sparse_cache,
    rank_sparse_chunks,
    reciprocal_rank_fusion,
    sparse_retrieval_available,
)

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
    """Multiplier in [1.0, 1.20] based on perspective vocabulary overlap."""
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
    chunk_id: str,
    document: str,
    metadata: dict[str, Any],
    similarity: float,
    profile: str,
    retrieval_mode_name: str,
    vocabulary: list[str] | None = None,
    sparse_score: float | None = None,
    fusion_score: float | None = None,
) -> dict[str, Any]:
    page_type = metadata.get("page_type", "")
    retrieval_weight = PROFILE_RETRIEVAL_WEIGHTS.get(profile, {}).get(page_type, 1.0)
    vocab_boost = _vocabulary_boost(document, vocabulary or [])
    weighted_score = round(similarity * retrieval_weight * vocab_boost, 3)
    chunk = {
        "id": chunk_id,
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
        "retrieval_mode": retrieval_mode_name,
    }
    if sparse_score is not None:
        chunk["sparse_score"] = round(sparse_score, 4)
    if fusion_score is not None:
        chunk["fusion_score"] = round(fusion_score, 6)
    return chunk


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


def _query_dense_vector(embedder: Any, query: str) -> list[float]:
    result = embedder.encode(
        [query],
        return_dense=True,
        return_sparse=False,
        return_colbert_vecs=False,
    )
    vectors = dense_vectors(result)
    return vectors[0] if vectors else []


def _candidate_pool_size(top_k: int, collection_count: int) -> int:
    return min(max(top_k * 4, top_k), collection_count)


def _query_collection(
    *,
    collection: Any,
    vector: list[float],
    requested_results: int,
    where: dict[str, Any] | None,
) -> dict[str, Any]:
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
        return results
    except Exception as filtered_error:
        _debug(f"filtered retrieval fell back to unfiltered: {filtered_error}")
        return collection.query(
            query_embeddings=[vector],
            n_results=requested_results,
            include=["documents", "metadatas", "distances"],
        )


def _dense_candidates(
    *,
    collection: Any,
    embedder: Any,
    query: str,
    page_types: list[str],
    top_k: int,
    profile: str,
    retrieval_mode_name: str,
) -> list[dict[str, Any]]:
    vector = _query_dense_vector(embedder, query)
    requested_results = _candidate_pool_size(top_k, collection.count())
    where = _page_type_filter(page_types)
    results = _query_collection(
        collection=collection,
        vector=vector,
        requested_results=requested_results,
        where=where,
    )

    vocabulary = _perspective_vocabulary(profile)
    chunks: list[dict[str, Any]] = []
    ids = results.get("ids", [[]])[0]
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]
    for index, document in enumerate(documents):
        similarity = round(1.0 - distances[index], 3)
        chunks.append(_chunk_from_result(
            chunk_id=ids[index],
            document=document,
            metadata=metadatas[index],
            similarity=similarity,
            profile=profile,
            retrieval_mode_name=retrieval_mode_name,
            vocabulary=vocabulary,
        ))
    chunks.sort(key=lambda chunk: (chunk["weighted_score"], chunk["similarity"]), reverse=True)
    return chunks


def _retrieve_chunks_hybrid(
    *,
    collection: Any,
    embedder: Any,
    query: str,
    intent: str,
    top_k: int,
    profile: str,
) -> list[dict[str, Any]]:
    page_types = INTENT_FILTER.get(intent, [])
    candidate_k = _candidate_pool_size(top_k, collection.count())
    dense_chunks = _dense_candidates(
        collection=collection,
        embedder=embedder,
        query=query,
        page_types=page_types,
        top_k=candidate_k,
        profile=profile,
        retrieval_mode_name="hybrid",
    )
    cache = load_sparse_cache()
    if cache is None:
        raise RuntimeError("sparse lexical cache is missing")

    sparse_ranked = rank_sparse_chunks(
        embedder,
        query=query,
        cache=cache,
        page_types=page_types,
        limit=candidate_k,
    )
    dense_ranked_ids = [chunk["id"] for chunk in dense_chunks]
    sparse_ranked_ids = [chunk_id for chunk_id, _score in sparse_ranked]
    fused = reciprocal_rank_fusion(
        [dense_ranked_ids, sparse_ranked_ids],
        k=rrf_k(),
    )[:candidate_k]

    dense_by_id = {chunk["id"]: chunk for chunk in dense_chunks}
    sparse_by_id = {chunk_id: score for chunk_id, score in sparse_ranked}
    selected_ids = [chunk_id for chunk_id, _score in fused[:top_k]]

    missing_ids = [chunk_id for chunk_id in selected_ids if chunk_id not in dense_by_id]
    if missing_ids:
        fetched = collection.get(
            ids=missing_ids,
            include=["documents", "metadatas"],
        )
        vocabulary = _perspective_vocabulary(profile)
        for index, chunk_id in enumerate(fetched.get("ids", [])):
            sparse_score = sparse_by_id.get(chunk_id, 0.0)
            dense_by_id[chunk_id] = _chunk_from_result(
                chunk_id=chunk_id,
                document=fetched["documents"][index],
                metadata=fetched["metadatas"][index],
                similarity=round(min(max(sparse_score, 0.0), 1.0), 3),
                profile=profile,
                retrieval_mode_name="hybrid",
                vocabulary=vocabulary,
                sparse_score=sparse_score,
            )

    fusion_scores = {chunk_id: score for chunk_id, score in fused}
    selected: list[dict[str, Any]] = []
    for chunk_id in selected_ids:
        chunk = dict(dense_by_id[chunk_id])
        chunk["sparse_score"] = round(sparse_by_id.get(chunk_id, 0.0), 4)
        chunk["fusion_score"] = round(fusion_scores.get(chunk_id, 0.0), 6)
        selected.append(_enrich_component_chunk(chunk))

    _debug(
        f"hybrid retrieved dense={len(dense_ranked_ids)} sparse={len(sparse_ranked_ids)} "
        f"selected={len(selected)} rrf_k={rrf_k()}: "
        + "; ".join(
            f"{chunk['title']} (sim={chunk['similarity']:.3f}, "
            f"sparse={chunk.get('sparse_score', 0):.3f}, "
            f"fusion={chunk.get('fusion_score', 0):.4f})"
            for chunk in selected
        )
    )
    return selected


def retrieve_chunks(
    *,
    collection: Any | None,
    embedder: Any,
    rag_ready: bool,
    query: str,
    intent: str,
    top_k: int = 3,
    profile: str = "general",
    retrieval_mode_override: str | None = None,
) -> list[dict[str, Any]]:
    if not rag_ready or collection is None or _collection_count(collection) == 0:
        _debug(
            f"semantic retrieval skipped: rag_ready={rag_ready} "
            f"collection={'loaded' if collection else 'none'} "
            f"count={_collection_count(collection)}"
        )
        return []

    page_types = INTENT_FILTER.get(intent, [])
    mode = resolve_retrieval_mode(retrieval_mode_override)
    _debug(
        f"query={query[:120]!r} intent={intent} top_k={top_k} "
        f"profile={profile} retrieval_mode={mode} "
        f"page_type_filter={page_types or 'none'}"
    )

    try:
        if (
            hybrid_retrieval_active(retrieval_mode_override)
            and sparse_retrieval_available(embedder)
            and load_sparse_cache() is not None
        ):
            return _retrieve_chunks_hybrid(
                collection=collection,
                embedder=embedder,
                query=query,
                intent=intent,
                top_k=top_k,
                profile=profile,
            )
        if hybrid_retrieval_active(retrieval_mode_override) and not sparse_retrieval_available(embedder):
            print(
                "[beatrice:retrieval] hybrid mode requested but sparse retrieval is "
                "unavailable in API embedding mode; falling back to dense retrieval"
            )
        elif hybrid_retrieval_active(retrieval_mode_override) and load_sparse_cache() is None:
            print(
                "[beatrice:retrieval] hybrid mode requested but sparse lexical cache "
                "is missing; falling back to dense retrieval"
            )
    except Exception as error:
        print(
            "[beatrice:retrieval] hybrid retrieval failed "
            f"({type(error).__name__}): {error}; falling back to dense retrieval"
        )

    try:
        selected = _dense_candidates(
            collection=collection,
            embedder=embedder,
            query=query,
            page_types=page_types,
            top_k=top_k,
            profile=profile,
            retrieval_mode_name="dense",
        )[:top_k]
    except Exception as error:
        print(
            "[beatrice:retrieval] dense retrieval error "
            f"({type(error).__name__}): {error}"
        )
        return []

    selected = [_enrich_component_chunk(chunk) for chunk in selected]
    _debug(
        f"dense retrieved {len(selected)} chunk(s): "
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
    ids = results.get("ids", [])
    vocabulary = _perspective_vocabulary(profile)
    chunks = []
    for index, document in enumerate(documents):
        metadata = metadatas[index]
        page_type = metadata.get("page_type", "")
        if page_types and page_type not in page_types:
            continue
        chunks.append(_chunk_from_result(
            chunk_id=ids[index] if index < len(ids) else metadata.get("title", ""),
            document=document,
            metadata=metadata,
            similarity=1.0,
            profile=profile,
            retrieval_mode_name="catalog_full",
            vocabulary=vocabulary,
        ))

    chunks.sort(key=lambda chunk: (
        CATALOG_TYPE_ORDER.get(chunk["page_type"], 999),
        chunk["title"].lower(),
    ))
    return [_enrich_component_chunk(chunk) for chunk in chunks]
