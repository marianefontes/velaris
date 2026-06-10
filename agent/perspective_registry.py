"""Canonical perspective registry for Velaris/Abraxos lookup and navigation."""

from __future__ import annotations

import re
from dataclasses import dataclass

from agent.understanding import normalize_text


@dataclass(frozen=True)
class PerspectiveEntry:
    key: str
    label: str
    label_en: str
    profile_id: str
    route: str
    description_pt: str
    description_en: str
    aliases: tuple[str, ...]
    secondary_profile_id: str | None = None


@dataclass(frozen=True)
class PerspectiveMatch:
    entry: PerspectiveEntry
    matched_alias: str
    confidence: str  # exact | partial


PERSPECTIVE_REGISTRY: dict[str, PerspectiveEntry] = {
    "designer": PerspectiveEntry(
        key="designer",
        label="Designer",
        label_en="Designer",
        profile_id="designer",
        route="/perspectives?profile=designer",
        description_pt=(
            "Foca hierarquia visual, composição, intenção visual, affordance "
            "e coerência da experiência."
        ),
        description_en=(
            "Focuses on visual hierarchy, composition, visual intent, "
            "affordance and experience coherence."
        ),
        aliases=(
            "design",
            "designer",
            "perspectiva de design",
            "visao de design",
            "visão de design",
            "parte de design",
            "olhar de design",
            "olhar visual",
        ),
        secondary_profile_id="product_designer",
    ),
    "product_designer": PerspectiveEntry(
        key="product_designer",
        label="Product Designer",
        label_en="Product Designer",
        profile_id="product_designer",
        route="/perspectives?profile=product_designer",
        description_pt=(
            "Foca fluxo, usabilidade, pesquisa com usuário, contexto de uso "
            "e decisões de produto."
        ),
        description_en=(
            "Focuses on flow, usability, user research, context of use "
            "and product decisions."
        ),
        aliases=(
            "product designer",
            "perspectiva de produto",
            "design de produto",
            "visao de produto",
            "visão de produto",
            "ux research",
            "pesquisa com usuario",
            "pesquisa com usuário",
            "fluxo de produto",
            "produto",
        ),
    ),
    "a11y": PerspectiveEntry(
        key="a11y",
        label="Acessibilidade",
        label_en="Accessibility",
        profile_id="a11y",
        route="/perspectives?profile=a11y",
        description_pt=(
            "Foca WCAG, teclado, foco, ARIA, leitores de tela, contraste "
            "e inclusão."
        ),
        description_en=(
            "Focuses on WCAG, keyboard, focus, ARIA, screen readers, "
            "contrast and inclusion."
        ),
        aliases=(
            "acessibilidade",
            "accessibility",
            "a11y",
            "perspectiva de acessibilidade",
            "visao de acessibilidade",
            "visão de acessibilidade",
            "inclusao",
            "inclusão",
            "leitor de tela",
            "aria",
        ),
    ),
    "dev": PerspectiveEntry(
        key="dev",
        label="Developer",
        label_en="Developer",
        profile_id="dev",
        route="/perspectives?profile=dev",
        description_pt=(
            "Foca implementação, contratos, integração, arquitetura "
            "e reuso técnico."
        ),
        description_en=(
            "Focuses on implementation, contracts, integration, architecture "
            "and technical reuse."
        ),
        aliases=(
            "developer",
            "dev",
            "desenvolvimento",
            "programador",
            "frontend",
            "implementacao",
            "implementação",
            "perspectiva tecnica",
            "perspectiva técnica",
        ),
    ),
    "qa": PerspectiveEntry(
        key="qa",
        label="QA",
        label_en="QA",
        profile_id="qa",
        route="/perspectives?profile=qa",
        description_pt=(
            "Foca critérios de aceitação, regressão, estados de erro "
            "e validação operacional."
        ),
        description_en=(
            "Focuses on acceptance criteria, regression, error states "
            "and operational validation."
        ),
        aliases=(
            "qa",
            "qualidade",
            "teste",
            "testes",
            "validacao",
            "validação",
            "regressao",
            "regressão",
            "parte de qa",
        ),
    ),
    "tech_writer": PerspectiveEntry(
        key="tech_writer",
        label="Tech Writer",
        label_en="Tech Writer",
        profile_id="tech_writer",
        route="/perspectives?profile=tech_writer",
        description_pt=(
            "Foca documentação, nomenclatura, exemplos, microcopy "
            "e conhecimento descobrível."
        ),
        description_en=(
            "Focuses on documentation, naming, examples, microcopy "
            "and discoverable knowledge."
        ),
        aliases=(
            "writer",
            "tech writer",
            "documentacao",
            "documentação",
            "escrita tecnica",
            "escrita técnica",
            "microcopy",
            "conteudo",
            "conteúdo",
        ),
    ),
    "design_system_manager": PerspectiveEntry(
        key="design_system_manager",
        label="Design System Manager",
        label_en="Design System Manager",
        profile_id="design_system_manager",
        route="/perspectives?profile=design_system_manager",
        description_pt=(
            "Foca governança, adoção, roadmap, priorização "
            "e impacto organizacional do design system."
        ),
        description_en=(
            "Focuses on governance, adoption, roadmap, prioritization "
            "and organizational design-system impact."
        ),
        aliases=(
            "design system manager",
            "governanca",
            "governança",
            "adoção",
            "adocao",
            "gestao do design system",
            "gestão do design system",
            "manager",
            "dsm",
        ),
    ),
    "maintainer": PerspectiveEntry(
        key="maintainer",
        label="Maintainer",
        label_en="Maintainer",
        profile_id="maintainer",
        route="/perspectives?profile=maintainer",
        description_pt=(
            "Foca manutenção, simplicidade, dívida técnica, ownership "
            "e estabilidade evolutiva."
        ),
        description_en=(
            "Focuses on maintenance, simplicity, technical debt, ownership "
            "and evolutionary stability."
        ),
        aliases=(
            "maintainer",
            "manutencao",
            "manutenção",
            "ownership",
            "versionamento",
            "estabilidade",
        ),
    ),
}

_PERSPECTIVE_CONTEXT_TERMS = (
    "perspectiva",
    "perspectivas",
    "perspective",
    "perspectives",
    "visao",
    "visão",
    "olhar",
    "lente",
    "lentes",
    "parte de",
    "mudo para",
    "mudar para",
    "switch to",
    "perfil",
    "profile",
)


def perspective_route(profile_id: str) -> str:
    return f"/perspectives?profile={profile_id}"


def get_perspective_entry(profile_id: str) -> PerspectiveEntry | None:
    return PERSPECTIVE_REGISTRY.get(profile_id)


def _alias_present(normalized: str, alias: str) -> bool:
    normalized_alias = normalize_text(alias)
    if not normalized_alias:
        return False
    return bool(
        re.search(
            rf"(?<![a-z0-9]){re.escape(normalized_alias)}(?![a-z0-9])",
            normalized,
        )
    )


def _has_perspective_context(normalized: str) -> bool:
    return any(_alias_present(normalized, term) for term in _PERSPECTIVE_CONTEXT_TERMS)


def resolve_perspective_match(
    query: str,
    *,
    require_context: bool = False,
) -> PerspectiveMatch | None:
    normalized = normalize_text(query)
    matches: list[tuple[int, PerspectiveMatch]] = []

    for entry in PERSPECTIVE_REGISTRY.values():
        for alias in entry.aliases:
            if not _alias_present(normalized, alias):
                continue
            alias_norm = normalize_text(alias)
            confidence = "exact" if alias_norm == normalized else "partial"
            if require_context and not _has_perspective_context(normalized):
                if alias_norm not in {
                    normalize_text(item)
                    for item in (
                        "design",
                        "produto",
                        "qa",
                        "dev",
                        "writer",
                        "manager",
                        "maintainer",
                    )
                }:
                    continue
            matches.append((
                len(alias_norm),
                PerspectiveMatch(
                    entry=entry,
                    matched_alias=alias,
                    confidence=confidence,
                ),
            ))
            break

    if not matches:
        return None

    matches.sort(key=lambda item: item[0], reverse=True)
    best_length, best_match = matches[0]

    ambiguous = [
        match
        for length, match in matches
        if length == best_length and match.entry.key != best_match.entry.key
    ]
    if ambiguous:
        priority = ("product_designer", "designer", "design_system_manager")
        for key in priority:
            for candidate in (best_match, *ambiguous):
                if candidate.entry.key == key:
                    return candidate

    return best_match
