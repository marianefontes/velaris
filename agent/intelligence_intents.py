"""Signal detection for Velaris/Abraxos intelligence-layer user intents."""

from __future__ import annotations

import re

from agent.understanding import normalize_text

_SYSTEM_HEALTH_TERMS = (
    "health do sistema",
    "system health",
    "overall design system health",
    "rag health",
    "catalog health",
    "governance health",
    "source attribution health",
    "perspective coverage",
    "response validation",
    "unknown component handling",
    "confidence calibration",
    "evidence gaps",
    "accessibility checks",
    "o que mede o health",
    "what does health measure",
    "onde fica o health",
    "where is health",
    "health metric",
    "health do sistema mede",
    "diagnostico de confiabilidade",
    "reliability diagnostics",
    "como o sistema mede alucinacao",
    "como o sistema mede alucinação",
    "hallucination resistance",
    "resistencia a alucinacao",
    "resistência a alucinação",
)

_AGENT_IDENTITY_TERMS = (
    "agente cognitivo",
    "cognitive agent",
    "chatbot",
    "chat bot",
    "o abraxos e um chatbot",
    "o abraxos é um chatbot",
    "is abraxos a chatbot",
    "diferenca entre oraculo e agente",
    "diferença entre oráculo e agente",
    "diferenca entre chatbot e oraculo",
    "diferença entre chatbot e oráculo",
    "oraculo vs agente",
    "oráculo vs agente",
    "por que beatrice virou abraxos",
    "why did beatrice become abraxos",
    "o que era beatrice",
    "what was beatrice",
)

_GOVERNANCE_ANALYSIS_TERMS = (
    "governance agent",
    "agente de governanca",
    "agente de governança",
    "problemas de governanca",
    "problemas de governança",
    "componentes duplicados",
    "duplicate components",
    "tokens orfaos",
    "tokens órfãos",
    "orphan tokens",
    "governance alerts",
    "alertas de governanca",
    "alertas de governança",
    "governance analysis",
    "analise de governanca",
    "análise de governança",
)

_SIMULATION_TERMS = (
    "simule ",
    "simular ",
    "simulate ",
    "simulation engine",
    "motor de simulacao",
    "motor de simulação",
    "o que acontece se remover",
    "what happens if we remove",
    "substituir modal por drawer",
    "replace modal with drawer",
    "substituir modal por drawer",
    "impacto de remover",
)

_MULTI_AGENT_TERMS = (
    "oracle council",
    "conselho do oraculo",
    "conselho do oráculo",
    "perspectivas discordam",
    "perspectives disagree",
    "multi agent",
    "multi-agent",
    "deliberacao entre perspectivas",
    "deliberação entre perspectivas",
    "devemos usar modal ou drawer",
    "should we use modal or drawer",
)

_COMMAND_HEALTH = re.compile(
    r"(?:/health\b|comando\s+/health|command\s+/health|existe\s+comando\s+/health)",
    re.I,
)
_COMMAND_GOVERNANCE = re.compile(
    r"(?:/governance\b|comando\s+/governance|o que.*comando.*/governance)",
    re.I,
)
_COMMAND_SIMULATE = re.compile(
    r"(?:/simulate\b|comando\s+/simulate|o que.*comando.*/simulate)",
    re.I,
)

_ROADMAP_CAPABILITY_RE = re.compile(
    r"(?:"
    r"aceita(?:r)?\s+(?:imagem|imagens|screenshot|screenshots|arquivo|arquivos)"
    r"|(?:analisa|analisar|interpreta|interpretar)\s+"
    r"(?:imagem|imagens|screenshot|screenshots|tela|telas|interface|interfaces)"
    r"|(?:le|ler|read)\s+(?:figma|arquivo(?:s)?\s+do\s+figma)"
    r"|(?:integra(?:cao|cão)|integration)\s+(?:com\s+)?figma"
    r"|(?:upload|enviar)\s+(?:de\s+)?(?:imagem|imagens|screenshot)"
    r")",
    re.I,
)


def _contains_any(value: str, terms: tuple[str, ...]) -> bool:
    return any(term in value for term in terms)


def resolve_intelligence_intent(query: str, normalized: str) -> str | None:
    """Return intelligence-layer intent id or None."""
    from agent.capability_responses import (
        is_agent_capability_query,
        is_roadmap_capability_query,
    )

    if _ROADMAP_CAPABILITY_RE.search(normalized) or is_roadmap_capability_query(
        normalized
    ):
        return "roadmap_capability"
    if is_agent_capability_query(normalized):
        return "agent_capability"
    if _COMMAND_HEALTH.search(query) or _contains_any(normalized, _SYSTEM_HEALTH_TERMS):
        return "system_health"
    if _COMMAND_GOVERNANCE.search(query) or _contains_any(normalized, _GOVERNANCE_ANALYSIS_TERMS):
        return "governance_analysis"
    if _COMMAND_SIMULATE.search(query) or _contains_any(normalized, _SIMULATION_TERMS):
        return "simulation"
    if _contains_any(normalized, _MULTI_AGENT_TERMS):
        return "multi_agent_reasoning"
    if _contains_any(normalized, _AGENT_IDENTITY_TERMS):
        return "agent_identity"
    return None
