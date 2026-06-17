"""Shared ChromaDB path configuration for Velaris RAG."""

from __future__ import annotations

import os
from pathlib import Path

RAG_DIR = Path(__file__).resolve().parent
DEFAULT_CHROMA_DB_PATH = RAG_DIR / "chroma_db"


def chroma_db_path() -> Path:
    configured = os.environ.get("CHROMA_DB_PATH", "").strip()
    if configured:
        return Path(configured).expanduser()
    return DEFAULT_CHROMA_DB_PATH


def chroma_db_path_source() -> str:
    return "env:CHROMA_DB_PATH" if os.environ.get("CHROMA_DB_PATH", "").strip() else "default"


def chroma_runtime_paths() -> dict[str, str | None]:
    path = chroma_db_path()
    return {
        "db_path": str(path),
        "chroma_db_path": os.environ.get("CHROMA_DB_PATH") or None,
        "chroma_db_path_resolved": str(path),
        "chroma_db_path_source": chroma_db_path_source(),
        "default_chroma_db_path": str(DEFAULT_CHROMA_DB_PATH),
    }
