"""Filter cognitive skills by observable effects in the composed response."""

from __future__ import annotations

import re
import unicodedata
from typing import Any, Iterable


SKILL_APPLICATION_SIGNALS: dict[str, tuple[tuple[str, ...], int]] = {
    "pattern_exploration": (
        ("opcao", "alternativa", "cenario", "condicao", "quando usar"),
        2,
    ),
    "architecture_analysis": (
        ("camada", "contrato", "acoplamento", "fronteira", "arquitetura"),
        2,
    ),
    "interaction_guardrail": (
        ("foco", "teclado", "contraste", "disabled", "prevencao de erro", "loading"),
        2,
    ),
    "design_system_governance_check": (
        ("design system", "padronizado", "governanca", "reuso", "consistente"),
        2,
    ),
    "component_fit_analysis": (
        ("componente", "modal", "dialog", "quando nao usar", "alternativa"),
        2,
    ),
    "component_misuse_detection": (
        ("nao use", "uso indevido", "risco", "alternativa", "gatilho"),
        2,
    ),
    "token_impact_analysis": (
        ("token", "contraste", "foco visivel", "alias", "propagacao"),
        2,
    ),
    "design_to_code_contract_check": (
        ("props", "api", "estado", "documentacao", "implementacao"),
        2,
    ),
    "implementation_planning": (
        ("props", "onconfirm", "loading", "erro", "integracao", "fluxo de estado"),
        3,
    ),
    "tradeoff_analysis": (
        ("trade off", "quando nao usar", "alternativa", "custo", "undo"),
        2,
    ),
    "retrieval_deep_dive": (
        ("fontes", "evidence similarity", "evidence tier", "limitacao", "evidencia"),
        2,
    ),
    "systems_thinking": (
        ("dependencias", "impacto", "camadas", "efeito", "sistema"),
        2,
    ),
    "risk_assessment": (
        ("risco", "edge cases", "falha", "permissao", "duplo", "mitigacao"),
        2,
    ),
}


def filter_applied_skills(
    response_text: str,
    selected_skills: Iterable[dict[str, Any]],
) -> tuple[dict[str, Any], ...]:
    """Return only skills whose operational effect is observable in the answer."""
    normalized = _normalize(response_text)
    applied: list[dict[str, Any]] = []

    for skill in selected_skills:
        skill_id = str(skill.get("id", ""))
        signal_definition = SKILL_APPLICATION_SIGNALS.get(skill_id)
        if not signal_definition:
            continue
        phrases, minimum_matches = signal_definition
        matches = {
            _normalize(phrase)
            for phrase in phrases
            if _normalize(phrase) in normalized
        }
        if len(matches) >= minimum_matches:
            applied.append(dict(skill))

    return tuple(applied)


def _normalize(value: str) -> str:
    decomposed = unicodedata.normalize("NFKD", value)
    ascii_text = "".join(
        character
        for character in decomposed
        if not unicodedata.combining(character)
    )
    return re.sub(
        r"\s+",
        " ",
        re.sub(r"[^a-z0-9]+", " ", ascii_text.lower()),
    ).strip()
