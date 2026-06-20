from __future__ import annotations

import re
import unicodedata
import json
from functools import lru_cache
from pathlib import Path

from component_metadata import component_catalog, localized_text

from .models import (
    ComponentSelection,
    EvidenceItem,
    ResponseValidation,
    ValidationViolationType,
)
from .response_dedup import dedupe_response


_RECOMMENDATION_PATTERNS = (
    r"componente recomendado\s*:\s*([^\n.]+)",
    r"recommended component\s*:\s*([^\n.]+)",
    r"(?:a )?melhor escolha (?:é|e)\s+([^\n.]+)",
    r"the best choice is\s+([^\n.]+)",
    r"(?:eu )?recomendo\s+([^\n.]+)",
    # "Use ComponentName" pattern - only when followed by a component-name-like
    # token. The first-char uppercase check is applied post-extraction below.
    r"\b[Uu]se\s+([A-Za-z][A-Za-z0-9]*(?:[/ ][A-Za-z][A-Za-z0-9]*)*)\b",
)

_USE_PATTERN_INDEX = len(_RECOMMENDATION_PATTERNS) - 1
_INSUFFICIENT_MARKERS = (
    "evidência do corpus é insuficiente",
    "evidencia do corpus e insuficiente",
    "corpus evidence is insufficient",
    "insufficient corpus evidence",
)
_LIMITATION_MARKERS = (
    "campos ausentes",
    "campo ausente",
    "limitação",
    "limitacao",
    "limitations",
    "missing fields",
    # natural language patterns from implementation responses
    "ajuste o import",
    "ajuste conforme",
    "nao documentado",
    "not documented",
    "nao esta documentado",
    "nao definido",
    "not defined",
    "verifique o import",
    "baseado no catalogo",
    "based on catalog",
    "conceitual",
    "contrato proposto",
    "proposed contract",
    "confirme",
    "verify before",
    "verify props",
    "a documentacao nao",
    "the documentation does not",
    "parcial",
    "partial evidence",
    "evidencia parcial",
    "incomplete evidence",
    "nao cobre",
    "does not cover",
    "nota:",
    "observacao:",
    "importante:",
    "atencao:",
    "nota de implementacao",
    "implementation note",
    "adjust the import",
    "adjust import",
    "verify your import",
    "check your import",
    "check the import",
)
_TOKEN_PATTERN = re.compile(
    r"(?<![\w-])(?:--[a-z0-9-]+|"
    r"(?:primary|surface|text|border|state|feedback|shadow|motion|space|radius|"
    r"focus|control|target|icon|heading|body|label|caption|code|xai|z)-[a-z0-9-]+)",
    re.IGNORECASE,
)


def _normalize(value: str) -> str:
    decomposed = unicodedata.normalize("NFD", value.lower())
    ascii_text = "".join(
        character
        for character in decomposed
        if unicodedata.category(character) != "Mn"
    )
    return re.sub(r"[^a-z0-9]+", " ", ascii_text).strip()


def _aliases(name: str) -> set[str]:
    aliases = {_normalize(name)}
    aliases.update(_normalize(part) for part in name.split("/") if part.strip())
    return aliases


def _extract_primary_candidate(response_text: str) -> str | None:
    for index, pattern in enumerate(_RECOMMENDATION_PATTERNS):
        match = re.search(pattern, response_text, flags=re.IGNORECASE)
        if not match:
            continue
        candidate = match.group(1).strip(" `*_:-")
        if index == _USE_PATTERN_INDEX:
            # "Use X" pattern: require the first character to be truly uppercase
            # so "Use aria-label" and "Use the loading state" are not treated as
            # component references.
            if not candidate or not candidate[0].isupper():
                continue
        return candidate
    return None


def _catalog_match(candidate: str) -> str | None:
    normalized = _normalize(candidate)
    matches: list[tuple[int, str]] = []
    for component in component_catalog().components:
        for alias in _aliases(component.name):
            if alias and (normalized == alias or normalized.startswith(f"{alias} ")):
                matches.append((len(alias), component.name))
    if not matches:
        return None
    matches.sort(reverse=True)
    return matches[0][1]


def _contains_any(response_text: str, markers: tuple[str, ...]) -> bool:
    normalized = _normalize(response_text)
    return any(_normalize(marker) in normalized for marker in markers)


def _invented_confidence_percentage(response_text: str) -> bool:
    decomposed = unicodedata.normalize("NFD", response_text.lower())
    normalized = "".join(
        character
        for character in decomposed
        if unicodedata.category(character) != "Mn"
    )
    for match in re.finditer(
        r"(?:confidence|confianca)[^0-9%]{0,30}(\d{1,3})\s*%",
        normalized,
    ):
        prefix = normalized[max(0, match.start() - 35):match.start()]
        if "evidence similarity" not in prefix and "similaridade da evidencia" not in prefix:
            return True
    return False


@lru_cache(maxsize=1)
def _official_token_names() -> set[str]:
    dump_path = Path(__file__).resolve().parents[1] / "rag" / "aetheris-docs-dump.json"
    if not dump_path.exists():
        return set()
    payload = json.loads(dump_path.read_text(encoding="utf-8"))
    return {
        str(chunk.get("title", "")).lower()
        for chunk in payload.get("chunks", [])
        if chunk.get("page_type") in {"token", "token_alias"}
    }


def _unsupported_structured_claim(
    response_text: str,
    selection: ComponentSelection,
) -> bool:
    recommended = selection.recommended
    if recommended is None:
        return False
    normalized = _normalize(response_text)
    missing = set(recommended.missing_fields)
    checks = {
        "intent": ("intent documentado", "documented intent"),
        "accessibility.keyboard": (
            "comportamento de teclado documentado",
            "documented keyboard behavior",
        ),
        "accessibility.aria": (
            "requisito aria documentado",
            "documented aria requirement",
        ),
        "edge_cases": ("edge cases documentados", "documented edge cases"),
    }
    return any(
        field in missing
        and any(_normalize(marker) in normalized for marker in markers)
        for field, markers in checks.items()
    )


def validate_component_response(
    response_text: str,
    selection: ComponentSelection,
) -> ResponseValidation:
    violations: list[ValidationViolationType] = []
    candidate = _extract_primary_candidate(response_text)
    matched_name = _catalog_match(candidate) if candidate else None
    expected = (
        selection.recommended.component.name
        if selection.recommended else None
    )
    alternatives = {
        alternative.name
        for alternative in selection.alternative_components
    }

    if candidate and matched_name is None:
        violations.append("invented_component")
    elif matched_name in alternatives:
        violations.append("promoted_alternative")
    elif expected and matched_name and matched_name != expected:
        violations.append("contradicted_recommended_component")
    elif expected and candidate is None:
        # Implementation and audit responses often discuss the component without
        # an explicit "Componente recomendado: X" header. Only flag when the
        # expected component name is genuinely absent from the response.
        expected_in_response = _normalize(expected) in _normalize(response_text)
        if not expected_in_response:
            violations.append("contradicted_recommended_component")

    if expected is None and not _contains_any(response_text, _INSUFFICIENT_MARKERS):
        violations.append("missing_required_limitation")

    recommended = selection.recommended
    if (
        recommended
        and recommended.perspective_coverage.missing_required_fields
        and not _contains_any(response_text, _LIMITATION_MARKERS)
    ):
        violations.append("missing_required_limitation")

    if _unsupported_structured_claim(response_text, selection):
        violations.append("unsupported_claim")
    if _invented_confidence_percentage(response_text):
        violations.append("invented_confidence")

    priority: tuple[ValidationViolationType, ...] = (
        "invented_component",
        "invented_confidence",
        "promoted_alternative",
        "contradicted_recommended_component",
        "unsupported_claim",
        "missing_required_limitation",
    )
    ordered = [
        violation
        for violation in priority
        if violation in violations
    ]
    if not ordered:
        return ResponseValidation(
            status="pass",
            expected_recommended_component=expected,
        )
    return ResponseValidation(
        status="fallback",
        violation_type=ordered[0],
        violations=ordered,
        promoted_component_detected=matched_name or candidate,
        expected_recommended_component=expected,
        fallback_used=True,
        fallback_reason=(
            "The generated response did not comply with the deterministic "
            "component selection and structured evidence contract."
        ),
    )


def validate_token_response(
    response_text: str,
    evidence: list[EvidenceItem],
) -> ResponseValidation:
    violations: list[ValidationViolationType] = []
    official = _official_token_names()
    mentioned = {
        candidate.lower()
        for candidate in _TOKEN_PATTERN.findall(response_text)
    }
    invented = sorted(mentioned - official) if official else []
    evidence_titles = {
        item.title.lower()
        for item in evidence
        if item.page_type in {"token", "token_alias"}
    }

    if invented:
        violations.append("invented_token")
    if _invented_confidence_percentage(response_text):
        violations.append("invented_confidence")
    if not evidence_titles and not _contains_any(response_text, _INSUFFICIENT_MARKERS):
        violations.append("missing_required_limitation")

    priority: tuple[ValidationViolationType, ...] = (
        "invented_token",
        "invented_confidence",
        "missing_required_limitation",
    )
    ordered = [violation for violation in priority if violation in violations]
    if not ordered:
        return ResponseValidation(status="pass")
    return ResponseValidation(
        status="fallback",
        violation_type=ordered[0],
        violations=ordered,
        fallback_used=True,
        fallback_reason=(
            "The generated response did not comply with the official token "
            "and confidence contract."
        ),
    )


def deterministic_token_response(
    evidence: list[EvidenceItem],
    *,
    english: bool = False,
) -> str:
    tokens = [
        item
        for item in evidence
        if item.page_type in {"token", "token_alias"}
    ]
    if not tokens:
        if english:
            return (
                "Recommended token: not determined\n\n"
                "The official corpus does not provide enough token evidence "
                "for a safe recommendation."
            )
        return (
            "Token recomendado: não determinado\n\n"
            "O corpus oficial não fornece evidência de token suficiente para "
            "uma recomendação segura."
        )

    primary = tokens[0]
    limitation = (
        "Confirm the semantic role against the implementation context before adoption."
        if english
        else "Confirme o papel semântico no contexto de implementação antes da adoção."
    )
    if english:
        return (
            f"Recommended token: {primary.title}\n\n"
            f"Documented use\n{primary.excerpt}\n\n"
            f"Evidence\nEvidence tier: "
            f"{'strong' if primary.similarity >= 0.75 else 'partial'}. "
            "This is retrieval relevance, not answer confidence.\n\n"
            f"Limitation\n{limitation}"
        )
    return (
        f"Token recomendado: {primary.title}\n\n"
        f"Uso documentado\n{primary.excerpt}\n\n"
        f"Evidência\nEvidence tier: "
        f"{'strong' if primary.similarity >= 0.75 else 'partial'}. "
        "Isto representa relevância de retrieval, não confiança da resposta.\n\n"
        f"Limitação\n{limitation}"
    )


def deterministic_component_response(
    selection: ComponentSelection,
    *,
    english: bool = False,
) -> str:
    recommended = selection.recommended
    if recommended is None:
        if english:
            return (
                "Recommended component: insufficient corpus evidence\n\n"
                "The corpus evidence is insufficient to recommend a component safely.\n\n"
                f"Evidence tier: {selection.evidence_tier}."
            )
        return (
            "Componente recomendado: evidência insuficiente\n\n"
            "A evidência do corpus é insuficiente para recomendar um componente "
            "com segurança.\n\n"
            f"Evidence tier: {selection.evidence_tier}."
        )

    component = recommended.component
    firm = selection.recommendation_firmness
    exact_match = selection.exact_entity_match is not None
    if exact_match and firm == "firm":
        header_en = f"Component found: {component.name}"
        header_pt = f"Componente encontrado: {component.name}"
    elif firm == "firm":
        header_en = f"Recommended component: {component.name}"
        header_pt = f"Componente recomendado: {component.name}"
    else:
        header_en = f"Partial match: {component.name}"
        header_pt = f"Correspondência parcial: {component.name}"
    if firm == "partial_match":
        hedge_en = (
            "This is a partial semantic match and should not be read as a firm "
            "recommendation without confirming the use case."
        )
        hedge_pt = (
            "Esta é uma correspondência parcial e não deve ser lida como "
            "recomendação firme sem confirmar o caso de uso."
        )
    else:
        hedge_en = ""
        hedge_pt = ""
    intent_text = (
        localized_text(component.intent.label, "en" if english else "pt")
        if component.intent else None
    )
    purpose = (
        selection.documented_purpose
        or (
            recommended.context_fit.documented_purpose
            if recommended.context_fit
            else ""
        )
        or localized_text(component.about, "en" if english else "pt")
    )
    reasons = [
        rule.text
        for rule in [
            *recommended.selected_when_to_use,
            *recommended.selected_do_rules,
        ]
    ]
    limits = [
        rule.text
        for rule in [
            *recommended.selected_dont_rules,
            *recommended.selected_when_not_to_use,
        ]
    ]
    missing = recommended.missing_fields
    alternatives = [
        alternative.name
        for alternative in selection.alternative_components
    ]
    if english:
        reason_parts = [f"Status: {component.status}."]
        if purpose:
            reason_parts.append(f"Documented purpose: {purpose}")
        if intent_text:
            reason_parts.append(f"Documented intent: {intent_text}.")
        reason_parts.extend(reasons)
        if hedge_en:
            reason_parts.append(hedge_en)
        sections = [
            header_en,
            "Reason\n" + "\n".join(reason_parts),
            "Limits\n" + ("\n".join(limits) if limits else "No documented limits were selected."),
        ]
        if alternatives:
            sections.append("Alternatives\n" + ", ".join(alternatives))
        return dedupe_response("\n\n".join(sections))

    reason_parts = [f"Status: {component.status}."]
    if purpose:
        reason_parts.append(f"Propósito documentado: {purpose}")
    if intent_text:
        reason_parts.append(f"Intent documentado: {intent_text}.")
    reason_parts.extend(reasons)
    if hedge_pt:
        reason_parts.append(hedge_pt)
    sections = [
        header_pt,
        "Motivo\n" + "\n".join(reason_parts),
        "Limites\n" + ("\n".join(limits) if limits else "Nenhum limite documentado foi selecionado."),
    ]
    if alternatives:
        sections.append("Alternativas\n" + ", ".join(alternatives))
    return dedupe_response("\n\n".join(sections))
