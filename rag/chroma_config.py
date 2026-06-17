"""Shared ChromaDB path configuration for Velaris RAG."""

from __future__ import annotations

import os
from pathlib import Path

RAG_DIR = Path(__file__).resolve().parent
DEFAULT_CHROMA_DB_PATH = RAG_DIR / "chroma_db"
RENDER_DISK_MOUNT = Path("/var/data")
RENDER_DISK_CHROMA_DB_PATH = RENDER_DISK_MOUNT / "chroma_db"


def _directory_writable(path: Path) -> bool:
    """Return True when path (or its missing parents) can be created and written."""
    target = path
    probe = target
    while not probe.exists():
        parent = probe.parent
        if parent == probe:
            return False
        probe = parent
    if not probe.is_dir() or not os.access(probe, os.W_OK):
        return False
    try:
        target.mkdir(parents=True, exist_ok=True)
        test_file = target / ".write_probe"
        test_file.write_text("")
        test_file.unlink()
        return True
    except OSError:
        return False


def _render_disk_available() -> bool:
    return RENDER_DISK_MOUNT.is_dir() and os.access(RENDER_DISK_MOUNT, os.W_OK)


def chroma_db_path() -> Path:
    configured = os.environ.get("CHROMA_DB_PATH", "").strip()
    if configured:
        candidate = Path(configured).expanduser()
        if _directory_writable(candidate):
            return candidate
    elif _render_disk_available() and _directory_writable(RENDER_DISK_CHROMA_DB_PATH):
        return RENDER_DISK_CHROMA_DB_PATH
    return DEFAULT_CHROMA_DB_PATH


def chroma_db_path_source() -> str:
    configured = os.environ.get("CHROMA_DB_PATH", "").strip()
    if configured:
        candidate = Path(configured).expanduser()
        if _directory_writable(candidate):
            return "env:CHROMA_DB_PATH"
        return "env:CHROMA_DB_PATH→default"
    if _render_disk_available() and _directory_writable(RENDER_DISK_CHROMA_DB_PATH):
        return "render-disk:/var/data"
    return "default"


def chroma_runtime_paths() -> dict[str, str | None]:
    path = chroma_db_path()
    return {
        "db_path": str(path),
        "chroma_db_path": os.environ.get("CHROMA_DB_PATH") or None,
        "chroma_db_path_resolved": str(path),
        "chroma_db_path_source": chroma_db_path_source(),
        "default_chroma_db_path": str(DEFAULT_CHROMA_DB_PATH),
        "render_disk_chroma_db_path": str(RENDER_DISK_CHROMA_DB_PATH),
        "render_disk_available": _render_disk_available(),
    }
