"""Deterministic responses for navigation_query, entity_lookup and social intents."""

from __future__ import annotations

import re

from agent.models import CatalogEntityResolution, InternalAlternative
from agent.perspective_registry import PerspectiveMatch, get_perspective_entry
from component_metadata import ComponentMetadata, localized_text

from .response_dedup import _dedupe_lines, _split_sentences, dedupe_response
from .route_map import RouteResolution
from .navigation_actions import page_destination_label
from .understanding import normalize_query, normalize_text


_SIMPLE_EXISTENCE_MARKERS = (
    "tem ",
    "existe ",
    "have ",
    "has ",
    "do you have",
    "você tem",
    "voce tem",
    "voce tem",
    "is there a",
    "is there ",
    "ha um",
    "há um",
    "hay un",
    "hay ",
    "tienen ",
    "tiene ",
    "existe o",
    "existe a",
    "possui ",
)


def is_simple_existence_query(query: str) -> bool:
    """True when the user only asks whether a catalog entity exists."""
    normalized = normalize_query(query)
    if len(normalized.split()) > 10:
        return False
    if any(
        marker in normalized
        for marker in (
            "como ",
            "how ",
            "why ",
            "por que ",
            "porque ",
            "quando ",
            "when ",
            "migrar",
            "migrate",
            "implement",
            "implementar",
        )
    ):
        return False
    return any(marker in normalized for marker in _SIMPLE_EXISTENCE_MARKERS)


def _entity_type_label(entity_type: str | None, *, english: bool) -> str:
    mapping = {
        "component": ("componente", "component"),
        "component_or_pattern": ("componente ou padrão", "component or pattern"),
        "pattern": ("padrão", "pattern"),
        "token": ("token", "token"),
        "state": ("estado", "state"),
        "variant": ("variante", "variant"),
        "guideline": ("guideline", "guideline"),
        "accessibility_rule": ("regra de acessibilidade", "accessibility rule"),
        "concept": ("conceito", "concept"),
        "decision": ("decisão", "decision"),
    }
    labels = mapping.get(entity_type or "component", ("entidade", "entity"))
    return labels[1 if english else 0]


def _is_comparison_query_text(query: str) -> bool:
    normalized = normalize_text(query)
    comparison_terms = (
        " vs ",
        " versus ",
        "compare",
        "comparar",
        "comparacao",
        "comparação",
        "diferenca entre",
        "diferença entre",
        "em vez de",
        "instead of",
    )
    if any(term in normalized for term in comparison_terms):
        return True
    return bool(re.search(r"\b(?:ou|or)\b", normalized))


def catalog_unknown_evidence_message(
    *,
    english: bool = False,
    entity_label: str | None = None,
) -> str:
    if entity_label:
        if english:
            return f"I did not find evidence of {entity_label} in the current catalog."
        return f"Não encontrei evidência de {entity_label} no catálogo atual."
    if english:
        return "I did not find evidence of this entity in the current catalog."
    return "Não encontrei evidência desta entidade no catálogo atual."


def catalog_partial_evidence_message(*, english: bool = False) -> str:
    if english:
        return "The concept exists, but the available documentation is partial."
    return "O conceito existe, mas a documentação disponível é parcial."


def blocked_catalog_comparison_response(
    resolution: CatalogEntityResolution,
    *,
    english: bool = False,
) -> str:
    from agent.comparison_entity_validator import blocked_comparison_message

    return dedupe_response(blocked_comparison_message(english=english))


def _alternative_phrase(
    alternative: InternalAlternative,
    *,
    english: bool,
) -> str:
    if alternative.target_type == "pattern":
        return alternative.name
    return alternative.name


def unsupported_entity_lookup_response(
    resolution: CatalogEntityResolution,
    query: str,
    *,
    english: bool = False,
) -> str:
    if _is_comparison_query_text(query):
        return blocked_catalog_comparison_response(resolution, english=english)

    label = resolution.entity_label or "this entity"
    normalized = normalize_text(query)
    guidance_mode = any(
        marker in normalized
        for marker in (
            "quando usar",
            "when to use",
            "quando nao usar",
            "quando não usar",
            "when not to use",
            "como usar",
            "how to use",
        )
    )

    opening = catalog_unknown_evidence_message(english=english, entity_label=label)
    parts = [opening]
    alternatives = resolution.internal_alternatives

    if alternatives:
        primary = alternatives[0]
        alt_name = _alternative_phrase(primary, english=english)
        if guidance_mode:
            if english:
                parts.append(
                    f"For close cases, check {alt_name}"
                    + (
                        f" if the goal is {primary.use_case}."
                        if primary.use_case
                        else "."
                    )
                )
            else:
                parts.append(
                    f"Para casos próximos, verifica {alt_name}"
                    + (
                        f" se o objetivo for {primary.use_case}."
                        if primary.use_case
                        else "."
                    )
                )
        else:
            if english:
                parts.append(
                    f"The closest item in the catalog is {alt_name}"
                    + (
                        f" when the goal is {primary.use_case}."
                        if primary.use_case
                        else "."
                    )
                )
            else:
                parts.append(
                    f"O mais próximo no catálogo é {alt_name}"
                    + (
                        f" se o objetivo for {primary.use_case}."
                        if primary.use_case
                        else "."
                    )
                )
        if len(alternatives) > 1:
            extra = ", ".join(
                _alternative_phrase(item, english=english)
                for item in alternatives[1:2]
            )
            if english:
                parts.append(f"You can also review {extra}.")
            else:
                parts.append(f"Também podes rever {extra}.")
    elif guidance_mode:
        if english:
            parts.append(
                "I did not find an equivalent component documented in the current catalog."
            )
        else:
            parts.append(
                "Não encontrei um componente equivalente no catálogo atual."
            )

    if resolution.entity_key == "side-drawer" and guidance_mode:
        if english:
            parts.append(
                "If the intent is lateral editing while keeping context visible, "
                "there is still no documented canonical equivalent."
            )
        else:
            parts.append(
                "Se a intenção for edição lateral mantendo contexto, "
                "ainda não há um componente canônico equivalente documentado."
            )

    external = resolution.external_reference
    if external is not None:
        if english:
            parts.append(
                f"For an external reference about the pattern, see {external.label}."
            )
        else:
            parts.append(
                f"Para referência externa sobre o padrão, podes consultar "
                f"{external.label}."
            )

    return dedupe_response("\n\n".join(parts))


def unsupported_entity_recommendation_response(
    resolution: CatalogEntityResolution,
    *,
    english: bool = False,
) -> str:
    label = resolution.entity_label or "this entity"
    alternatives = resolution.internal_alternatives

    parts = [catalog_unknown_evidence_message(english=english, entity_label=label)]
    if alternatives:
        primary = alternatives[0]
        alt_name = _alternative_phrase(primary, english=english)
        if english:
            parts.append(
                f"If the goal is {primary.use_case or 'a close documented case'}, "
                f"use {alt_name}."
            )
        else:
            parts.append(
                f"Se o objetivo for {primary.use_case or 'um caso documentado próximo'}, "
                f"usa {alt_name}."
            )
        if len(alternatives) > 1:
            secondary = alternatives[1]
            secondary_name = _alternative_phrase(secondary, english=english)
            if english:
                parts.append(
                    f"If the goal is {secondary.use_case or 'another documented case'}, "
                    f"consider {secondary_name}."
                )
            else:
                parts.append(
                    f"Se o objetivo for {secondary.use_case or 'outro caso documentado'}, "
                    f"considera {secondary_name}."
                )
    else:
        if english:
            parts.append(
                "I did not find a documented internal equivalent in the current catalog."
            )
        else:
            parts.append(
                "Não encontrei um equivalente interno documentado no catálogo atual."
            )

    if resolution.entity_key in {"side-drawer", "drawer"}:
        if english:
            parts.append(
                "If the goal is lateral editing while keeping context visible, "
                "this looks like a current catalog gap."
            )
        else:
            parts.append(
                "Se o objetivo for edição lateral mantendo contexto, "
                "isso parece uma lacuna do catálogo atual."
            )

    external = resolution.external_reference
    if external is not None:
        if english:
            parts.append(f"External reference: {external.label}.")
        else:
            parts.append(f"Referência externa: {external.label}.")

    return dedupe_response("\n\n".join(parts))


def unknown_entity_lookup_response(
    query: str,
    *,
    english: bool = False,
    entity_label: str | None = None,
) -> str:
    del query
    return dedupe_response(
        catalog_unknown_evidence_message(english=english, entity_label=entity_label)
    )


def partial_entity_lookup_response(
    component: ComponentMetadata,
    *,
    english: bool = False,
) -> str:
    about = localized_text(component.about, "en" if english else "pt")
    opening = catalog_partial_evidence_message(english=english)
    if english:
        return dedupe_response(
            f"{opening} {component.name} is marked as {component.status} in Velaris.\n\n{about}"
        )
    return dedupe_response(
        f"{opening} {component.name} está marcado como {component.status} no Velaris.\n\n{about}"
    )


def deprecated_entity_lookup_response(
    component: ComponentMetadata,
    *,
    english: bool = False,
) -> str:
    return partial_entity_lookup_response(component, english=english)


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
    compact: bool = False,
) -> str:
    if compact:
        if english:
            return (
                f"Yes. {component.name} is a canonical Velaris component."
            )
        return f"Sim. {component.name} é um componente canônico do Velaris."
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
