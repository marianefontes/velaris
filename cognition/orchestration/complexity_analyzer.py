"""Estimate cognitive complexity of a user request."""

from dataclasses import dataclass


ARCHITECTURE_TERMS = {
    "arquitetura", "architecture", "refatorar", "refactor", "modular",
    "escala", "scalable", "escalável", "acoplamento", "coupling",
    "camadas", "layers", "backend", "frontend", "pipeline",
    "reorganizar", "reorganize",
}

IMPLEMENTATION_TERMS = {
    "implementar", "implement", "criar", "create", "migrar", "migrate",
    "refatorar", "refactor", "integrar", "integrate", "deploy", "rollout",
    "reorganizar", "reorganize",
}

UX_TERMS = {
    "ux", "usuário", "user", "onboarding", "fricção", "friction",
    "clareza", "clarity", "acessibilidade", "accessibility",
    "discoverability", "carga cognitiva", "cognitive load",
}

GOVERNANCE_TERMS = {
    "design system", "governança", "governance", "consistência",
    "consistency", "padronização", "standardization", "oficial",
}

RISK_TERMS = {
    "risco", "risk", "regressão", "regression", "quebrar", "break",
    "edge case", "dívida", "debt", "crítico", "critical",
    "destrutiva", "destructive", "excluir", "delete", "confirmar",
    "confirm",
}

BROAD_SCOPE_TERMS = {
    "toda", "todo", "whole", "complete", "completa", "completo",
    "sistema", "system", "arquitetura", "architecture", "camada", "layer",
    "múltiplas", "multiple", "fluxo", "workflow",
}


@dataclass(frozen=True)
class ComplexitySignals:
    overall: float
    scope: float
    depth: float
    entity_count: int
    architecture: float
    implementation: float
    ux: float
    governance: float
    risk: float


def _keyword_score(query: str, terms: set[str], multiplier: float = 0.18) -> float:
    q = query.lower()
    hits = sum(1 for term in terms if term in q)
    return min(1.0, round(hits * multiplier, 3))


def _entity_count(query: str) -> int:
    separators = query.count(",") + query.count(";") + query.lower().count(" vs ")
    conjunctions = query.lower().count(" e ") + query.lower().count(" and ")
    return max(1, min(8, separators + conjunctions + 1))


def analyze_complexity(
    query: str,
    *,
    intent: str,
    catalog_mode: bool = False,
    command_mode: str | None = None,
) -> ComplexitySignals:
    words = query.split()
    word_score = min(1.0, len(words) / 90)
    scope = max(_keyword_score(query, BROAD_SCOPE_TERMS, 0.16), 0.85 if catalog_mode else 0.0)
    architecture = _keyword_score(query, ARCHITECTURE_TERMS)
    implementation = _keyword_score(query, IMPLEMENTATION_TERMS)
    ux = _keyword_score(query, UX_TERMS)
    governance = _keyword_score(query, GOVERNANCE_TERMS)
    risk = _keyword_score(query, RISK_TERMS)
    entities = _entity_count(query)
    entity_score = min(1.0, entities / 5)

    intent_depth = {
        "design_decision": 0.65,
        "pattern_guidance": 0.55,
        "component_guidance": 0.45,
        "xai_explanation": 0.6,
        "comparison_query": 0.65,
        "new_product_scaffolding": 0.75,
        "token_lookup": 0.25,
    }.get(intent, 0.35)
    if command_mode:
        intent_depth = max(intent_depth, 0.75)

    depth = max(intent_depth, word_score, architecture, implementation, risk)
    overall = round(
        min(
            1.0,
            (scope * 0.2)
            + (depth * 0.25)
            + (entity_score * 0.15)
            + (architecture * 0.15)
            + (implementation * 0.1)
            + (ux * 0.05)
            + (governance * 0.05)
            + (risk * 0.05),
        ),
        3,
    )

    return ComplexitySignals(
        overall=overall,
        scope=round(scope, 3),
        depth=round(depth, 3),
        entity_count=entities,
        architecture=round(architecture, 3),
        implementation=round(implementation, 3),
        ux=round(ux, 3),
        governance=round(governance, 3),
        risk=round(risk, 3),
    )
