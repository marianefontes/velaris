"""Declarative registry of Beatrice's Core Oracle Engines.

The Oracle Engines are the competitive differentiator of Aetheris: specialized
reasoning capabilities that a generic LLM does not provide out of the box. Unlike
cognitive skills (which Beatrice activates automatically), engines are *selected by
the user* through explicit slash commands. Public engines are surfaced in the
command picker; experimental engines remain typeable but hidden.

Each engine maps a `command_mode` to a strict output contract, a retrieval intent
and a retrieval depth. Legacy aliases remain resolvable but are excluded from
the primary public surface.
"""

from dataclasses import dataclass, field


@dataclass(frozen=True)
class OracleEngine:
    id: str                       # canonical command (kebab) e.g. "decision-archaeology"
    label: str                    # user-facing name
    contract_path: str            # prompt file, relative to prompts root
    retrieval_intent: str         # intent used to filter the RAG corpus
    top_k: int                    # retrieval depth
    theory_base: str              # academic grounding (for /reasoning + docs)
    tier: str = "core"            # "core" | "specialized" | "experimental"
    aliases: tuple[str, ...] = field(default_factory=tuple)
    needs_evidence_metrics: bool = False
    public: bool = True


CORE_ENGINES: tuple[OracleEngine, ...] = (
    OracleEngine(
        id="organizational-memory",
        label="Organizational Memory",
        contract_path="engines/organizationalMemory.md",
        retrieval_intent="design_decision",
        top_k=8,
        theory_base="Organizational Memory Systems · Knowledge Management",
        tier="core",
        aliases=("memory", "history"),
    ),
    OracleEngine(
        id="decision-archaeology",
        label="Decision Archaeology",
        contract_path="engines/decisionArchaeology.md",
        retrieval_intent="design_decision",
        top_k=6,
        theory_base="Design Rationale · Architecture Decision Records (ADR)",
        tier="core",
        aliases=("decision", "why"),
    ),
    OracleEngine(
        id="perspective-synthesis",
        label="Perspective Synthesis",
        contract_path="engines/perspectiveSynthesis.md",
        retrieval_intent="general",
        top_k=8,
        theory_base="Decision Support Systems · Multi-Stakeholder Analysis",
        tier="core",
        aliases=("perspectives",),
    ),
    OracleEngine(
        id="explainability-audit",
        label="Explainability Audit",
        contract_path="engines/explainabilityAudit.md",
        retrieval_intent="xai_explanation",
        top_k=6,
        theory_base="Explainable AI · Human-Centered XAI",
        tier="core",
        aliases=("audit", "score"),
        needs_evidence_metrics=True,
    ),
)

SPECIALIZED_ENGINES: tuple[OracleEngine, ...] = (
    OracleEngine(
        id="knowledge-gap",
        label="Knowledge Gap",
        contract_path="engines/knowledgeGap.md",
        retrieval_intent="general",
        top_k=8,
        theory_base="Knowledge Gap Analysis · Documentation Coverage",
        tier="specialized",
        needs_evidence_metrics=True,
    ),
    OracleEngine(
        id="governance-impact",
        label="Governance Impact",
        contract_path="engines/governanceImpact.md",
        retrieval_intent="design_decision",
        top_k=7,
        theory_base="Systems Thinking · Change Impact Analysis",
        tier="specialized",
        aliases=("simulate",),
    ),
    OracleEngine(
        id="principle-conflict",
        label="Principle Conflict",
        contract_path="engines/principleConflict.md",
        retrieval_intent="xai_explanation",
        top_k=6,
        theory_base="Design Principles · Value Tensions in Design",
        tier="specialized",
    ),
    OracleEngine(
        id="adoption-friction",
        label="Adoption Friction",
        contract_path="engines/adoptionFriction.md",
        retrieval_intent="general",
        top_k=8,
        theory_base="Design System Adoption · Diffusion of Innovations · Documentation Diagnostics",
        tier="specialized",
    ),
)

EXPERIMENTAL_ENGINES: tuple[OracleEngine, ...] = (
    OracleEngine(
        id="oracle-council",
        label="Oracle Council",
        contract_path="engines/oracleCouncil.md",
        retrieval_intent="general",
        top_k=8,
        theory_base="Multi-Agent Deliberation · Argumentation Theory",
        tier="experimental",
        public=False,
    ),
)

PUBLIC_ENGINES: tuple[OracleEngine, ...] = CORE_ENGINES + SPECIALIZED_ENGINES
ALL_ENGINES: tuple[OracleEngine, ...] = PUBLIC_ENGINES + EXPERIMENTAL_ENGINES

# Resolve a command_mode (canonical id OR legacy alias) to its engine.
_ENGINE_BY_COMMAND: dict[str, OracleEngine] = {}
for _engine in ALL_ENGINES:
    _ENGINE_BY_COMMAND[_engine.id] = _engine
    for _alias in _engine.aliases:
        _ENGINE_BY_COMMAND[_alias] = _engine


def resolve_engine(command_mode: str | None) -> OracleEngine | None:
    """Return the engine for a command_mode or legacy alias, else None."""
    if not command_mode:
        return None
    return _ENGINE_BY_COMMAND.get(command_mode.strip().lower())
