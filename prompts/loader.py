"""Prompt file loader for Beatrice's modular orchestration layer."""

from functools import lru_cache
from pathlib import Path

PROMPT_ROOT = Path(__file__).resolve().parent


class PromptNotFoundError(FileNotFoundError):
    """Raised when a required prompt layer is missing."""


def _safe_prompt_path(relative_path: str) -> Path:
    path = (PROMPT_ROOT / relative_path).resolve()
    try:
        path.relative_to(PROMPT_ROOT)
    except ValueError as exc:
        raise ValueError(f"Prompt path escapes prompt root: {relative_path}") from exc
    return path


@lru_cache(maxsize=128)
def load_prompt(relative_path: str, required: bool = True) -> str:
    path = _safe_prompt_path(relative_path)
    if not path.exists():
        if required:
            raise PromptNotFoundError(f"Prompt file not found: {relative_path}")
        return ""
    return path.read_text(encoding="utf-8").strip()


def load_prompt_sequence(relative_paths: list[str]) -> list[str]:
    return [prompt for path in relative_paths if (prompt := load_prompt(path))]


def clear_prompt_cache() -> None:
    load_prompt.cache_clear()
