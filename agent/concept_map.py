"""Conceptual answers for Velaris and Abraxos identity questions."""

from __future__ import annotations

import re

from agent.understanding import normalize_text


_CONCEPT_ALIASES: dict[str, tuple[str, ...]] = {
    "abraxos": ("abraxos",),
    "velaris": ("velaris",),
    "beatrice": ("beatrice",),
    "aetheris": ("aetheris",),
    "tecela": ("tecela", "tecela"),
    "rag": ("rag", "retrieval", "recuperacao", "recuperação"),
    "xai": ("xai", "explicabilidade", "explainability"),
    "evidence_tier": ("evidence tier", "nivel de evidencia", "nível de evidência"),
    "catalogo": ("catalogo canonico", "catálogo canônico", "canonical catalog"),
    "perspectivas": ("perspectivas", "perspectives", "persona", "personas"),
}

_CONCEPT_PROMPT_MARKERS = (
    "o que e ",
    "o que é ",
    "what is ",
    "quem e ",
    "quem é ",
    "who is ",
    "para que serve ",
    "what does ",
)


def resolve_concept_key(query: str) -> str | None:
    normalized = normalize_text(query)
    if not any(marker in normalized for marker in _CONCEPT_PROMPT_MARKERS):
        return None
    for concept_key, aliases in _CONCEPT_ALIASES.items():
        for alias in aliases:
            if re.search(
                rf"(?<![a-z0-9]){re.escape(normalize_text(alias))}(?![a-z0-9])",
                normalized,
            ):
                return concept_key
    return None


def concept_response(concept_key: str, *, english: bool = False) -> str:
    responses = {
        "abraxos": {
            "pt": (
                "Abraxos é o agente cognitivo do Velaris — um oráculo contextual com "
                "recuperação de evidências (RAG), roteamento de intenção, validação "
                "de respostas e engines especializados (/health, /governance, "
                "/simulate). Não é um chatbot genérico: responde apenas com base no "
                "catálogo e nas evidências documentadas."
            ),
            "en": (
                "Abraxos is Velaris's cognitive agent — a contextual oracle with "
                "evidence retrieval (RAG), intent routing, response validation and "
                "specialized engines (/health, /governance, /simulate). It is not a "
                "generic chatbot: it answers only from the catalog and documented "
                "evidence."
            ),
        },
        "velaris": {
            "pt": (
                "Velaris é o design system atual do projeto. Ele organiza componentes, "
                "tokens, padrões, fundamentos, decisões documentadas e orientações de "
                "acessibilidade para produto, design e engenharia."
            ),
            "en": (
                "Velaris is the current design system of the project. It organizes "
                "components, tokens, patterns, foundations, documented decisions and "
                "accessibility guidance for product, design and engineering."
            ),
        },
        "beatrice": {
            "pt": (
                "Beatrice era o nome anterior do oráculo. No Velaris, ele agora se chama "
                "Abraxos. A função continua a mesma: responder com base no catálogo e "
                "nas evidências do design system."
            ),
            "en": (
                "Beatrice was the previous name of the oracle. In Velaris it is now "
                "called Abraxos. The role is the same: answer from the catalog and "
                "design-system evidence."
            ),
        },
        "aetheris": {
            "pt": (
                "Aetheris era o nome anterior do design system. O nome atual é Velaris. "
                "O conteúdo, rotas e catálogo canônico seguem a identidade Velaris."
            ),
            "en": (
                "Aetheris was the previous name of the design system. The current name "
                "is Velaris. Content, routes and the canonical catalog follow the Velaris "
                "identity."
            ),
        },
        "tecela": {
            "pt": (
                "Tecelã é a perspectiva editorial do Velaris voltada a transformar "
                "racional de design system em conhecimento descobrível e canônico."
            ),
            "en": (
                "Tecelã is the editorial perspective of Velaris focused on turning "
                "design-system rationale into discoverable, canonical knowledge."
            ),
        },
        "rag": {
            "pt": (
                "RAG é a camada de recuperação de evidências do Abraxos. Ela consulta "
                "o corpus oficial do Velaris para fundamentar respostas com fontes "
                "documentadas."
            ),
            "en": (
                "RAG is the evidence retrieval layer of Abraxos. It queries the "
                "official Velaris corpus to ground answers in documented sources."
            ),
        },
        "xai": {
            "pt": (
                "XAI, ou explicabilidade, é a camada que torna explícitas as fontes, "
                "limitações e o nível de evidência usado pelo Abraxos em cada resposta."
            ),
            "en": (
                "XAI, or explainability, is the layer that makes sources, limitations "
                "and evidence level explicit in each Abraxos answer."
            ),
        },
        "evidence_tier": {
            "pt": (
                "Evidence tier classifica a força da evidência recuperada. Ele "
                "representa relevância de retrieval, não confiança absoluta da resposta."
            ),
            "en": (
                "Evidence tier classifies the strength of retrieved evidence. It "
                "represents retrieval relevance, not absolute answer confidence."
            ),
        },
        "catalogo": {
            "pt": (
                "O catálogo canônico do Velaris reúne componentes, metadados, regras de "
                "uso, limites e documentação estruturada usada pelo Abraxos antes e "
                "depois da busca semântica."
            ),
            "en": (
                "The Velaris canonical catalog gathers components, metadata, usage "
                "rules, limits and structured documentation used by Abraxos before and "
                "after semantic search."
            ),
        },
        "perspectivas": {
            "pt": (
                "Perspectivas são lentes especializadas do Abraxos para designer, "
                "developer, QA, product designer, tech writer e design system manager."
            ),
            "en": (
                "Perspectives are specialized Abraxos lenses for designer, developer, "
                "QA, product designer, tech writer and design system manager."
            ),
        },
    }
    locale = "en" if english else "pt"
    return responses[concept_key][locale]


def agent_identity_response(*, english: bool = False) -> str:
    if english:
        return (
            "Abraxos is a **cognitive agent**, not a generic chatbot.\n\n"
            "- **Chatbot**: open-domain conversation without a grounded catalog.\n"
            "- **Oracle**: contextual interpreter of Velaris evidence with source "
            "attribution.\n"
            "- **Cognitive agent**: oracle + intent routing, validation gates, "
            "perspectives, governance and specialized engines.\n\n"
            "Beatrice was the previous oracle name; the current identity is Abraxos "
            "inside Velaris (formerly Aetheris)."
        )
    return (
        "Abraxos é um **agente cognitivo**, não um chatbot genérico.\n\n"
        "- **Chatbot**: conversa aberta sem catálogo fundamentado.\n"
        "- **Oráculo**: intérprete contextual das evidências do Velaris com "
        "atribuição de fontes.\n"
        "- **Agente cognitivo**: oráculo + roteamento de intenção, validação, "
        "perspectivas, governança e engines especializados.\n\n"
        "Beatrice era o nome anterior do oráculo; a identidade atual é Abraxos "
        "dentro do Velaris (antes Aetheris)."
    )
