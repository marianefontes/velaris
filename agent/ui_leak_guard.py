"""Server-side guard against UI placeholder and internal audit text leaking into responses."""

from __future__ import annotations

import re
import unicodedata

UI_PROMPT_LEAK_MARKERS = (
    "Pergunta para o Abraxos sobre esta seção",
    "Pergunta para o Abraxos sobre esta secção",
    "Ask Abraxos about this section",
    "Pergunte algo sobre esta seção",
    "Pergunte algo sobre esta secção",
    "Ask something about this section",
    "Pergunte algo sobre esta seção...",
    "Pergunte algo sobre esta secção...",
)

INTERNAL_AUDIT_LEAK_MARKERS = (
    "canonical intent not documented",
    "intent canônico não está documentado",
    "intent canonico nao esta documentado",
    "retrieval degraded",
    "retrieval evidence tier",
    "evidence tier:",
    "evidence tier ",
    "fallback applied",
    "fallback foi aplicado",
    "evidence partial",
    "evidência parcial",
    "evidencia parcial",
    "metadata missing",
    "metadados ausentes",
    "resolver warning",
    "similaridade da evidência",
    "similaridade da evidencia",
    "evidence similarity",
    "campos ausentes",
    "campo ausente",
    "missing fields",
    "catalog mode",
    "modo catálogo",
    "modo catalogo",
    "not documented in the catalog",
    "não documentado no catálogo",
    "nao documentado no catalogo",
    "alguns campos complementares ainda não estão documentados",
    "some complementary fields are not yet documented",
    "retrieval relevance, not answer confidence",
    "relevância de retrieval, não confiança",
    "relevancia de retrieval, nao confianca",
)


def _normalize(value: str) -> str:
    decomposed = unicodedata.normalize("NFD", value.lower())
    return "".join(
        character
        for character in decomposed
        if unicodedata.category(character) != "Mn"
    )


def contains_ui_prompt_leak(content: str) -> bool:
    trimmed = content.strip()
    if not trimmed:
        return False
    return any(marker in trimmed for marker in UI_PROMPT_LEAK_MARKERS)


def contains_internal_audit_leak(content: str) -> bool:
    trimmed = content.strip()
    if not trimmed:
        return False
    normalized = _normalize(trimmed)
    return any(_normalize(marker) in normalized for marker in INTERNAL_AUDIT_LEAK_MARKERS)


def _line_has_leak(line: str) -> bool:
    return contains_ui_prompt_leak(line) or contains_internal_audit_leak(line)


def _strip_audit_sections(content: str) -> str:
    """Remove entire sections headed by audit-only labels."""
    audit_section_headers = re.compile(
        r"^(?:Evidência|Evidence|Documentação|Documentation|Evidence tier)\s*$",
        re.IGNORECASE | re.MULTILINE,
    )
    parts = audit_section_headers.split(content)
    if len(parts) <= 1:
        return content
    return parts[0].strip()


def sanitize_assistant_content(content: str) -> str:
    if not content.strip():
        return content
    if not contains_ui_prompt_leak(content) and not contains_internal_audit_leak(content):
        return content
    cleaned_lines = [
        line
        for line in content.splitlines()
        if not _line_has_leak(line)
    ]
    cleaned = "\n".join(cleaned_lines).strip()
    return _strip_audit_sections(cleaned)
