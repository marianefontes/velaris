"""Final response deduplication before delivery."""

from __future__ import annotations

import re
import unicodedata


def _normalize_line(value: str) -> str:
    decomposed = unicodedata.normalize("NFD", value.lower().strip())
    folded = "".join(
        character
        for character in decomposed
        if unicodedata.category(character) != "Mn"
    )
    return re.sub(r"[^a-z0-9]+", " ", folded).strip()


def _split_sentences(value: str) -> list[str]:
    parts = re.split(r"(?<=[.!?])\s+", value.strip())
    return [part.strip() for part in parts if part.strip()]


def _line_is_subsumed(candidate: str, existing: str) -> bool:
    candidate_norm = _normalize_line(candidate)
    existing_norm = _normalize_line(existing)
    if not candidate_norm or not existing_norm:
        return False
    if candidate_norm == existing_norm:
        return True
    if len(candidate_norm) >= 24 and candidate_norm in existing_norm:
        return True
    if len(existing_norm) >= 24 and existing_norm in candidate_norm:
        return True
    return False


def _dedupe_lines(lines: list[str]) -> list[str]:
    deduped: list[str] = []
    seen: set[str] = set()
    for line in lines:
        normalized = _normalize_line(line)
        if not normalized:
            continue
        if normalized in seen:
            continue
        if any(_line_is_subsumed(line, kept) for kept in deduped):
            continue
        deduped = [kept for kept in deduped if not _line_is_subsumed(kept, line)]
        seen = {_normalize_line(kept) for kept in deduped}
        seen.add(normalized)
        deduped.append(line)
    return deduped


def _dedupe_paragraph(paragraph: str) -> str:
    lines = [line.strip() for line in paragraph.splitlines() if line.strip()]
    if not lines:
        return ""
    if len(lines) == 1:
        sentences = _split_sentences(lines[0])
        deduped_sentences = _dedupe_lines(sentences)
        return " ".join(deduped_sentences)
    return "\n".join(_dedupe_lines(lines))


def dedupe_response(text: str) -> str:
    if not text.strip():
        return text

    paragraphs = re.split(r"\n\s*\n", text.strip())
    deduped_paragraphs: list[str] = []
    seen_paragraphs: set[str] = set()

    for paragraph in paragraphs:
        cleaned = _dedupe_paragraph(paragraph)
        if not cleaned:
            continue
        paragraph_key = _normalize_line(cleaned)
        if paragraph_key in seen_paragraphs:
            continue
        if any(
            _line_is_subsumed(cleaned, kept)
            for kept in deduped_paragraphs
        ):
            continue
        deduped_paragraphs = [
            kept
            for kept in deduped_paragraphs
            if not _line_is_subsumed(kept, cleaned)
        ]
        seen_paragraphs = {_normalize_line(kept) for kept in deduped_paragraphs}
        seen_paragraphs.add(paragraph_key)
        deduped_paragraphs.append(cleaned)

    return "\n\n".join(deduped_paragraphs)
