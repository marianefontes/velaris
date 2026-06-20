"""Welcoming social response pools with controlled rotation for Abraxos."""

from __future__ import annotations

import hashlib
from typing import Literal

from agent.understanding import normalize_query

PortugueseVariant = Literal["pt-BR", "pt-PT"]

GREETING_VARIATIONS: dict[str, tuple[str, ...]] = {
    "pt-BR": (
        "Olá. O que você gostaria de explorar hoje no Velaris?",
        "Olá. Por onde começamos?",
        "Olá. Há alguma decisão, componente ou dúvida que você queira investigar?",
        "Olá. Em que posso ajudar você dentro do universo do Velaris?",
        (
            "Olá. Posso ajudar com componentes, tokens, padrões, perspectivas, "
            "acessibilidade e decisões do Velaris."
        ),
    ),
    "pt-PT": (
        "Olá. O que gostarias de explorar hoje no Velaris?",
        "Olá. Por onde começamos?",
        "Olá. Tens alguma decisão, componente ou dúvida que queiras investigar?",
        "Olá. Em que posso ajudar-te dentro do universo do Velaris?",
        (
            "Olá. Posso ajudar com componentes, tokens, padrões, perspectivas, "
            "acessibilidade e decisões do Velaris."
        ),
    ),
    "en": (
        "Hi. What would you like to explore in Velaris today?",
        "Hi. Where would you like to start?",
        "Hi. Is there any decision, component, or question you'd like to investigate?",
        "Hi. How can I help you within the Velaris ecosystem?",
        (
            "Hi. I can help with components, tokens, patterns, perspectives, "
            "accessibility, and Velaris decisions."
        ),
    ),
}

WELLBEING_VARIATIONS: dict[str, tuple[str, ...]] = {
    "pt-BR": (
        "Tudo bem. O que você gostaria de explorar hoje no Velaris?",
        "Tudo bem por aqui. Como posso ajudar você hoje?",
        "Tudo bem. Há alguma decisão, componente ou dúvida que você queira investigar?",
        "Tudo bem. Em que posso ajudar você dentro do universo do Velaris?",
        "Tudo bem. Por onde começamos?",
    ),
    "pt-PT": (
        "Tudo bem. O que gostarias de explorar hoje no Velaris?",
        "Tudo bem por aqui. Como posso ajudar-te hoje?",
        "Tudo bem. Tens alguma decisão, componente ou dúvida que queiras investigar?",
        "Tudo bem. Em que posso ajudar-te dentro do universo do Velaris?",
        "Tudo bem. Por onde começamos?",
    ),
    "en": (
        "I'm doing well. What would you like to explore in Velaris today?",
        "All good here. How can I help you today?",
        (
            "I'm doing well. Is there any decision, component, or question "
            "you'd like to investigate?"
        ),
        "I'm doing well. How can I help you within the Velaris ecosystem?",
        "I'm doing well. Where would you like to start?",
    ),
}

ONLINE_VARIATIONS: dict[str, tuple[str, ...]] = {
    "pt-BR": (
        "Estou online. Como posso ajudar você hoje no Velaris?",
        "Estou por aqui. O que você gostaria de explorar no Velaris?",
        "Sim, estou disponível. Por onde começamos?",
    ),
    "pt-PT": (
        "Estou online. Como posso ajudar-te hoje no Velaris?",
        "Estou por aqui. O que gostarias de explorar no Velaris?",
        "Sim, estou disponível. Por onde começamos?",
    ),
    "en": (
        "I'm online. How can I help you in Velaris today?",
        "I'm here. What would you like to explore in Velaris?",
        "Yes, I'm available. Where would you like to start?",
    ),
}

HELP_VARIATIONS: dict[str, tuple[str, ...]] = {
    "pt-BR": (
        "Claro. O que você gostaria de investigar no Velaris?",
        "Com certeza. Há algum componente, token ou decisão que você queira explorar?",
        "Posso ajudar. Diga o que você quer entender no Velaris.",
    ),
    "pt-PT": (
        "Claro. O que gostarias de investigar no Velaris?",
        "Com certeza. Há algum componente, token ou decisão que queiras explorar?",
        "Posso ajudar. Diz-me o que queres entender no Velaris.",
    ),
    "en": (
        "Of course. What would you like to investigate in Velaris?",
        (
            "Sure. Is there a component, token, pattern, perspective, or "
            "documented decision you'd like to explore?"
        ),
        "Happy to help. Tell me what you want to understand in Velaris.",
    ),
}

_PT_PT_MARKERS = (
    "estas online",
    "estas bem",
    "ajudas me",
    "ajuda me",
    "queres",
    "connosco",
    "diz me",
    "podes ajudar",
    "gostarias",
    "podes me ajudar",
)


def resolve_portuguese_variant(*, language: str, query: str) -> PortugueseVariant:
    if language == "pt-PT":
        return "pt-PT"
    normalized = normalize_query(query)
    if any(marker in normalized for marker in _PT_PT_MARKERS):
        return "pt-PT"
    return "pt-BR"


def resolve_locale_key(*, english: bool, language: str, query: str) -> str:
    if english:
        return "en"
    return resolve_portuguese_variant(language=language, query=query)


def pick_variation(variations: tuple[str, ...], *, seed: str) -> str:
    if not variations:
        raise ValueError("variation pool must not be empty")
    if len(variations) == 1:
        return variations[0]
    digest = hashlib.sha256(seed.encode("utf-8")).hexdigest()
    index = int(digest[:8], 16) % len(variations)
    return variations[index]
