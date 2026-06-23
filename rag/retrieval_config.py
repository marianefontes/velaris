"""Runtime retrieval configuration (dense baseline vs hybrid RRF)."""

from __future__ import annotations

import os

RETRIEVAL_MODE_DENSE = "dense"
RETRIEVAL_MODE_HYBRID = "hybrid"
SUPPORTED_RETRIEVAL_MODES = {RETRIEVAL_MODE_DENSE, RETRIEVAL_MODE_HYBRID}


def retrieval_mode() -> str:
    value = os.environ.get("AETHERIS_RETRIEVAL_MODE", RETRIEVAL_MODE_DENSE).strip().lower()
    if value not in SUPPORTED_RETRIEVAL_MODES:
        return RETRIEVAL_MODE_DENSE
    return value


def resolve_retrieval_mode(override: str | None = None) -> str:
    if override:
        normalized = str(override).strip().lower()
        if normalized in SUPPORTED_RETRIEVAL_MODES:
            return normalized
    return retrieval_mode()


def hybrid_retrieval_enabled() -> bool:
    return retrieval_mode() == RETRIEVAL_MODE_HYBRID


def hybrid_retrieval_active(override: str | None = None) -> bool:
    return resolve_retrieval_mode(override) == RETRIEVAL_MODE_HYBRID


def rrf_k() -> int:
    try:
        return max(1, int(os.environ.get("AETHERIS_RRF_K", "60")))
    except ValueError:
        return 60
