"""Deterministic responses for agent capability, limitation and roadmap questions."""

from __future__ import annotations

from agent.understanding import normalize_text

_ROADMAP_CAPABILITY_MARKERS = (
    "imagem",
    "imagens",
    "image",
    "images",
    "screenshot",
    "screenshots",
    "captura de tela",
    "print da tela",
    "figma",
    "sketch",
    "zeplin",
    "adobe xd",
    "analisar tela",
    "analisa tela",
    "analisa uma tela",
    "analisar uma tela",
    "interpretar tela",
    "interpretar telas",
    "interpreta tela",
    "interface visual",
    "artefato visual",
    "artefatos visuais",
    "aceita imagem",
    "aceita imagens",
    "accept image",
    "accept images",
    "multimodal",
    "analise visual",
    "análise visual",
    "visual analysis",
    "ler figma",
    "le figma",
    "read figma",
    "arquivo do figma",
    "arquivos do figma",
    "integracao com figma",
    "integração com figma",
    "figma integration",
    "upload de imagem",
    "enviar imagem",
    "enviar screenshot",
)

_AGENT_CAPABILITY_MARKERS = (
    "limitacoes",
    "limitações",
    "limitations",
    "o que nao faz",
    "o que não faz",
    "what can you not",
    "what can't you",
    "what can not you",
    "suas restricoes",
    "suas restrições",
    "your restrictions",
    "escopo operacional",
    "operational scope",
    "o que voce nao pode",
    "o que você não pode",
    "what are your limits",
    "quais limites",
    "quais sao suas limitacoes",
    "quais são suas limitações",
)


def _contains_any(value: str, terms: tuple[str, ...]) -> bool:
    return any(term in value for term in terms)


def is_roadmap_capability_query(normalized: str) -> bool:
    return _contains_any(normalized, _ROADMAP_CAPABILITY_MARKERS)


def is_agent_capability_query(normalized: str) -> bool:
    return _contains_any(normalized, _AGENT_CAPABILITY_MARKERS)


def roadmap_capability_response(query: str, *, english: bool = False) -> str:
    normalized = normalize_text(query)
    if "figma" in normalized:
        if english:
            return (
                "Not yet.\n\n"
                "Abraxos currently consults structured institutional knowledge in "
                "Velaris but does not have direct integration with design tools "
                "such as Figma.\n\n"
                "That kind of integration represents a plausible future evolution "
                "of the system."
            )
        return (
            "Ainda não.\n\n"
            "Hoje o Abraxos consulta conhecimento institucional do Velaris, mas não "
            "possui integração direta com ferramentas de design como Figma.\n\n"
            "Esse tipo de integração representa uma oportunidade de evolução futura "
            "do sistema."
        )

    if english:
        if any(
            marker in normalized
            for marker in ("tela", "telas", "screen", "screens", "interface")
        ):
            return (
                "Not yet.\n\n"
                "Abraxos currently works over documented institutional knowledge in "
                "Velaris and does not process images or visual interfaces directly.\n\n"
                "That capability may be incorporated in future versions."
            )
        return (
            "Image analysis is not part of Abraxos's current capabilities.\n\n"
            "Right now the agent works over structured institutional knowledge in "
            "Velaris — including components, patterns, accessibility, governance, "
            "migrations, documentation and recorded decisions.\n\n"
            "Interpreting screenshots, interfaces and visual artifacts is a "
            "capability considered for future system evolution."
        )

    if any(
        marker in normalized
        for marker in ("tela", "telas", "screen", "screens", "interface")
    ):
        return (
            "Ainda não.\n\n"
            "Atualmente o Abraxos opera sobre conhecimento institucional documentado "
            "do Velaris e não processa imagens ou interfaces visuais diretamente.\n\n"
            "Essa é uma capacidade que poderá ser incorporada em versões futuras."
        )
    return (
        "A análise de imagens ainda não integra as capacidades atuais do Abraxos.\n\n"
        "Neste momento, o agente atua sobre conhecimento institucional estruturado do "
        "Velaris, incluindo componentes, padrões, acessibilidade, governança, "
        "migrações, documentação e decisões registradas.\n\n"
        "A interpretação de screenshots, interfaces e artefatos visuais é uma "
        "capacidade considerada para evoluções futuras do sistema."
    )


def agent_capability_response(query: str, *, english: bool = False) -> str:
    if english:
        return (
            "These are Abraxos's current operational boundaries:\n\n"
            "- Does not execute code or change systems\n"
            "- Does not interpret images, screenshots or visual interfaces\n"
            "- Does not access external tools such as Figma, Jira or repositories\n"
            "- Answers only from institutional knowledge available in Velaris\n"
            "- Does not invent catalog entities, tokens or undocumented decisions\n\n"
            "Within that scope, I can help with component guidance, documented "
            "decisions, governance, accessibility, migrations, comparisons, audits, "
            "explanations and professional perspectives."
        )
    return (
        "Estas são as limitações operacionais atuais do Abraxos:\n\n"
        "- Não executa código nem altera sistemas\n"
        "- Não interpreta imagens, screenshots ou interfaces visuais\n"
        "- Não acessa ferramentas externas como Figma, Jira ou repositórios\n"
        "- Responde apenas com base no conhecimento institucional disponível no Velaris\n"
        "- Não inventa entidades de catálogo, tokens ou decisões não documentadas\n\n"
        "Dentro desse escopo, posso ajudar com orientação de componentes, decisões "
        "documentadas, governança, acessibilidade, migrações, comparações, auditorias, "
        "explicações e perspectivas profissionais."
    )


def current_capabilities_response(*, english: bool = False) -> str:
    if english:
        return (
            "I am Abraxos, the Velaris design-system oracle. Today I can help with:\n\n"
        "- Component guidance: when to use, when not to use, intents, states and examples\n"
        "- Patterns: screen structure, flows and composition\n"
        "- Tokens: color, typography, spacing and semantic roles\n"
        "- Documented design decisions and trade-offs\n"
            "- Governance, catalog hygiene and operational diagnostics\n"
            "- Accessibility: WCAG, keyboard, ARIA, focus and interaction guardrails\n"
            "- Migrations between legacy patterns and canonical Velaris contracts\n"
            "- Comparisons between documented alternatives\n"
            "- Interface audits against recorded rules\n"
            "- Explanations with source attribution and calibrated confidence\n"
            "- Professional perspectives for designer, developer, QA, product designer, "
            "tech writer and design system manager\n\n"
            "I work from structured institutional knowledge. I do not process images, "
            "screenshots or external design files."
        )
    return (
        "Sou o Abraxos, o oráculo do design system Velaris. Hoje posso ajudar com:\n\n"
        "- Consulta de componentes: quando usar, quando não usar, intents, estados e exemplos\n"
        "- Padrões: estrutura de telas, fluxos e composição\n"
        "- Tokens: cor, tipografia, espaçamento e papéis semânticos\n"
        "- Decisões documentadas e trade-offs registrados\n"
        "- Governança, higiene de catálogo e diagnósticos operacionais\n"
        "- Acessibilidade: WCAG, teclado, ARIA, foco e guardrails de interação\n"
        "- Migrações entre padrões legados e contratos canônicos do Velaris\n"
        "- Comparações entre alternativas documentadas\n"
        "- Auditorias de interface contra regras registradas\n"
        "- Explicações com atribuição de fontes e confiança calibrada\n"
        "- Perspectivas profissionais para designer, developer, QA, product designer, "
        "tech writer e design system manager\n\n"
        "Atuo sobre conhecimento institucional estruturado. Não processo imagens, "
        "screenshots nem arquivos externos de design."
    )
