"""Deterministic responses for navigation_query, entity_lookup and social intents."""

from __future__ import annotations

from agent.perspective_registry import PerspectiveMatch, get_perspective_entry
from component_metadata import ComponentMetadata, localized_text

from .response_dedup import _dedupe_lines, _split_sentences, dedupe_response
from .route_map import RouteResolution
from .navigation_actions import page_destination_label
from .understanding import normalize_query, normalize_text


def greeting_response(*, english: bool = False) -> str:
    if english:
        return (
            "Hi. I can help with components, tokens, patterns, perspectives, "
            "accessibility, audits, and Velaris decisions."
        )
    return (
        "Olá. Posso ajudar com componentes, tokens, padrões, perspectivas, "
        "acessibilidade, auditorias e decisões do Velaris."
    )


def small_talk_response(query: str, *, english: bool = False) -> str:
    normalized = normalize_query(query)
    if any(
        marker in normalized
        for marker in ("estas online", "are you online", "voce esta online", "você está online")
    ):
        if english:
            return (
                "I'm online. I can help with components, tokens, patterns, "
                "and Velaris decisions."
            )
        return (
            "Estou online. Posso ajudar com componentes, tokens, padrões "
            "e decisões do Velaris."
        )
    if any(
        marker in normalized
        for marker in (
            "ajudas me",
            "ajuda me",
            "me ajuda",
            "preciso de ajuda",
            "help me",
            "help",
            "can you help me",
            "could you help me",
            "podes ajudar",
            "pode ajudar",
            "pode me ajudar",
        )
    ):
        if english:
            return (
                "Of course. Tell me if you want to find a component, token, "
                "pattern, perspective, or documented decision in Velaris."
            )
        return (
            "Claro. Diz-me se queres encontrar um componente, token, padrão, "
            "perspectiva ou decisão do Velaris."
        )
    if english:
        return (
            "I'm doing well. Tell me what you want to investigate in Velaris."
        )
    return "Tudo bem. Diz-me o que queres investigar no Velaris."


def navigation_response(
    resolution: RouteResolution,
    *,
    english: bool = False,
) -> str:
    destination = page_destination_label(resolution.section_key, english=english)
    if english:
        return (
            f"You can find {resolution.label_en} in {destination}."
        )
    return (
        f"Você encontra {resolution.label_pt} em {destination}."
    )


def perspective_lookup_response(
    match: PerspectiveMatch,
    *,
    english: bool = False,
) -> str:
    entry = match.entry
    description = entry.description_en if english else entry.description_pt
    if english:
        text = (
            f"You are looking for the {entry.label_en} perspective. "
            f"It lives in the Perspectives area of Velaris. {description}"
        )
        if entry.secondary_profile_id and match.matched_alias in {"design", "designer"}:
            product = get_perspective_entry(entry.secondary_profile_id)
            if product is not None:
                text += (
                    f" If your question is more about flow, research or product "
                    f"decisions, the {product.label_en} perspective can also help."
                )
        return dedupe_response(text)

    text = (
        f"Você está procurando a perspectiva {entry.label}. "
        f"Ela fica na área de Perspectivas do Velaris. {description}"
    )
    if entry.secondary_profile_id and match.matched_alias in {
        "design",
        "designer",
        "perspectiva de design",
        "visao de design",
        "visão de design",
        "parte de design",
    }:
        product = get_perspective_entry(entry.secondary_profile_id)
        if product is not None:
            text += (
                f" Se a sua dúvida for mais sobre fluxo, pesquisa ou decisão "
                f"de produto, a perspectiva {product.label} também pode ajudar."
            )
    return dedupe_response(text)


def semantic_navigation_response(
    *,
    label_pt: str,
    label_en: str,
    section_key: str,
    english: bool = False,
) -> str:
    destination = page_destination_label(section_key, english=english)
    if english:
        return (
            f"You can find {label_en} in {destination}."
        )
    return f"Você encontra {label_pt} em {destination}."


def entity_lookup_response(
    component: ComponentMetadata,
    *,
    english: bool = False,
) -> str:
    about = localized_text(component.about, "en" if english else "pt")
    if english:
        return dedupe_response(
            f"Yes. Velaris includes the {component.name} component.\n\n{about}"
        )
    return dedupe_response(
        f"Sim. O Velaris possui o componente {component.name}.\n\n{about}"
    )


def _rule_texts(component: ComponentMetadata, field: str, *, english: bool) -> list[str]:
    locale = "en" if english else "pt"
    rules = getattr(component, field, None) or []
    return [localized_text(rule.text, locale) for rule in rules if localized_text(rule.text, locale)]


def _guidance_sentences(rules: list[str]) -> list[str]:
    sentences: list[str] = []
    for rule in rules:
        sentences.extend(_split_sentences(rule))
    return sentences


def direct_entity_guidance_response(
    component: ComponentMetadata,
    query: str,
    *,
    english: bool = False,
) -> str:
    normalized = normalize_text(query)
    when_not = any(
        marker in normalized
        for marker in (
            "quando nao",
            "quando não",
            "when not",
            "nao devo usar",
            "não devo usar",
            "avoid",
        )
    )
    dos = _rule_texts(component, "do", english=english)
    donts = _rule_texts(component, "dont", english=english)

    if when_not:
        primary_rules = donts
        secondary_rules = dos[:1]
    else:
        primary_rules = dos
        secondary_rules = donts

    sentences = _guidance_sentences(primary_rules[:3])
    sentences.extend(_guidance_sentences(secondary_rules[:3]))

    if not sentences:
        when_to_use = _rule_texts(component, "when_to_use", english=english)
        when_not_to_use = _rule_texts(component, "when_not_to_use", english=english)
        fallback = when_not_to_use if when_not else when_to_use
        sentences = _guidance_sentences(fallback[:1])

    if not sentences:
        about = localized_text(component.about, "en" if english else "pt")
        if english:
            return dedupe_response(
                f"{component.name} is documented in the Velaris catalog. {about}"
            )
        return dedupe_response(
            f"{component.name} está documentado no catálogo do Velaris. {about}"
        )

    deduped = _dedupe_lines(sentences)
    return dedupe_response(" ".join(deduped))


def legacy_navigation_response(
    resolution: RouteResolution,
    *,
    legacy_name: str,
    english: bool = False,
) -> str:
    destination = page_destination_label(resolution.section_key, english=english)
    if legacy_name == "aetheris":
        prefix_pt = (
            "Aetheris é o nome anterior do projeto. No sistema atual, ele corresponde "
            "ao Velaris. Para começar pela base do design system, acesse "
        )
        prefix_en = (
            "Aetheris is the previous project name. In the current system it maps to "
            "Velaris. To start from the design-system foundations, go to "
        )
    elif legacy_name == "beatrice":
        prefix_pt = (
            "Beatrice era o nome anterior do oráculo. No Velaris, ele agora se chama "
            "Abraxos. O chat completo fica em "
        )
        prefix_en = (
            "Beatrice was the previous oracle name. In Velaris it is now called "
            "Abraxos. The full chat lives in "
        )
    else:
        return navigation_response(resolution, english=english)
    if english:
        return dedupe_response(
            f"{prefix_en}{destination}.\n\n"
            f"{navigation_response(resolution, english=True)}"
        )
    return dedupe_response(
        f"{prefix_pt}{destination}.\n\n"
        f"{navigation_response(resolution, english=False)}"
    )


def legacy_name_response(*, english: bool = False, legacy: str, current: str) -> str:
    if english:
        return (
            f"{legacy} was the previous name. In Velaris it is now called {current}."
        )
    return (
        f"{legacy} era o nome anterior. No Velaris, agora se chama {current}."
    )
