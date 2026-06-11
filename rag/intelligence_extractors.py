"""Phase 1 intelligence-layer extractors for the Velaris/Abraxos RAG corpus."""

from __future__ import annotations

import re
from pathlib import Path

PRODUCT_NAME = "Velaris"

BASE_DIR = Path(__file__).parent.parent
SRC_COMPONENTS = BASE_DIR / "src" / "components"
SRC_BEATRICE = BASE_DIR / "src" / "beatrice"
PROMPTS_DIR = BASE_DIR / "prompts"
ENGINES_DIR = PROMPTS_DIR / "engines"

# Mock scores from SystemHealthSection.tsx (UI mock — not live API data)
HEALTH_METRIC_SCORES: dict[str, dict[str, object]] = {
    "rag": {"score": 88, "status": "healthy"},
    "catalog": {"score": 79, "status": "attention"},
    "attribution": {"score": 91, "status": "healthy"},
    "perspectives": {"score": 72, "status": "attention"},
    "validation": {"score": 68, "status": "evolving"},
    "unknownComponents": {"score": 86, "status": "healthy"},
    "calibration": {"score": 74, "status": "attention"},
    "evidenceGaps": {"score": 65, "status": "critical"},
    "governance": {"score": 82, "status": "evolving"},
    "accessibility": {"score": 77, "status": "attention"},
}

HEALTH_METRICS_EN: dict[str, dict[str, str]] = {
    "rag": {
        "label": "RAG Health",
        "description": "Semantic retrieval, page_type relevance and indexed corpus coverage.",
    },
    "catalog": {
        "label": "Catalog Health",
        "description": "Consistency between canonical catalog, metadata and component surface in the frontend.",
    },
    "attribution": {
        "label": "Source Attribution Health",
        "description": "Traceability between claims, retrieved chunks and explained decisions.",
    },
    "perspectives": {
        "label": "Perspective Coverage",
        "description": "Depth and parity of Abraxos's seven professional perspectives.",
    },
    "validation": {
        "label": "Response Validation",
        "description": "Validation gates, deduplication and integrity before the final response.",
    },
    "unknownComponents": {
        "label": "Unknown Component Handling",
        "description": "Detection and containment of recommendations for nonexistent or uncatalogued components.",
    },
    "calibration": {
        "label": "Confidence Calibration",
        "description": "Alignment between displayed confidence and actual retrieved evidence strength.",
    },
    "evidenceGaps": {
        "label": "Evidence Gaps",
        "description": "Strong evidence gaps, undocumented trade-offs and orphan decisions.",
    },
    "governance": {
        "label": "Governance Health",
        "description": "Governance alerts, duplications, orphan tokens and adoption readiness.",
    },
    "accessibility": {
        "label": "Accessibility Checks",
        "description": "Coverage of accessibility rules, focus states and contrast in components.",
    },
}

COMMAND_ROUTES: dict[str, str] = {
    "health": "/evaluation?focus=health#health",
    "governance": "/governance",
    "governance-impact": "/reasoning?focus=commands",
    "simulate": "/reasoning?focus=commands",
    "oracle-council": "/reasoning?focus=commands",
    "knowledge-gap": "/knowledge-health",
    "memory": "/reasoning?focus=commands",
    "decision": "/reasoning?focus=commands",
    "audit": "/reasoning?focus=commands",
    "perspectives": "/perspectives",
}

COMMAND_ENGINE_NOTES: dict[str, str] = {
    "health": "Navigation/diagnostic command — directs to Evaluation Health section. No dedicated engine in registry (Phase 1). UI scores are mock data pending Knowledge Health API integration.",
    "governance": "Investigative mode — governance engine with pre-computed alerts injected at prompt time via governance_agent.py.",
    "simulate": "Investigative mode — simulate engine (strategic_reasoning.py) projects consequences before changes.",
    "oracle-council": "Experimental investigative mode — multi_agent_council.py deliberation across five perspectives.",
}


def read_project_file(relative_path: str) -> str:
    path = BASE_DIR / relative_path
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8")


def make_id(source_file: str, slug: str) -> str:
    clean = re.sub(r"[^a-z0-9]+", "_", slug.lower()).strip("_")
    base = source_file.replace(".tsx", "").replace(".ts", "").replace("/", "_").lower()
    return f"{base} :: {clean}"


def append_chunk(
    chunks: list[dict],
    *,
    source: str,
    page_type: str,
    title: str,
    text: str,
    chunk_id: str | None = None,
    kind: str = "",
    section: str = "",
    command: str = "",
    capability: str = "",
    route: str = "",
    status: str = "Stable",
    tags: list[str] | None = None,
    **fields,
) -> None:
    """Append a chunk with Phase 1 standardized metadata."""
    tag_list = tags or []
    chunk = {
        "id": chunk_id or make_id(source, title),
        "source": source,
        "page_type": page_type,
        "title": title,
        "status": status,
        "kind": kind,
        "section": section,
        "command": command,
        "capability": capability,
        "route": route,
        "tags": ",".join(tag_list),
        "structure": fields.get("structure", ""),
        "logic": fields.get("logic", ""),
        "context_of_use": fields.get("context_of_use", ""),
        "when_to_use": fields.get("when_to_use", ""),
        "when_not_to_use": fields.get("when_not_to_use", ""),
        "trade_offs": fields.get("trade_offs", ""),
        "accessibility": fields.get("accessibility", ""),
        "rag_relation": fields.get("rag_relation", ""),
        "aetheris_insight": fields.get("aetheris_insight", ""),
        "text": text,
        "char_count": len(text),
    }
    chunks.append(chunk)


def _en_us_block(source: str, start_marker: str = 'if (locale === "en-US")') -> str:
    start = source.find(start_marker)
    if start < 0:
        return source
    end = source.find('if (locale === "pt-BR")', start + len(start_marker))
    if end < 0:
        end = len(source)
    return source[start:end]


def extract_guidelines(chunks: list) -> None:
    """GuidelinesPage.tsx → pillars, principles and operational rules (en-US source)."""
    src = read_project_file("src/components/GuidelinesPage.tsx")
    if not src:
        return

    block = _en_us_block(src)
    append_chunk(
        chunks,
        source="GuidelinesPage.tsx",
        page_type="guideline",
        title="Velaris Guideline Architecture",
        kind="overview",
        section="guidelines",
        route="/foundations?focus=manifesto",
        tags=["guidelines", "principles", "velaris"],
        text=(
            f"{PRODUCT_NAME.upper()} GUIDELINE: Velaris Guideline Architecture | "
            "Six strategic pillars, twelve design principles and forty-eight operational rules "
            "for trustworthy, explainable and human-centered product experiences. "
            "Route: /foundations?focus=manifesto. Abraxos uses these guidelines for principle "
            "conflict resolution and governance readiness checks."
        ),
        logic="Formal guideline architecture for the Velaris design system.",
        context_of_use="Foundations hub, governance analysis, principle conflict mode.",
    )

    for match in re.finditer(
        r'id:\s*"([^"]+)"\s*,\s*title:\s*"([^"]+)"\s*,\s*summary:\s*"([^"]+)"',
        block,
    ):
        pillar_id, title, summary = match.groups()
        append_chunk(
            chunks,
            source="GuidelinesPage.tsx",
            page_type="guideline",
            title=title,
            kind="pillar",
            section="guidelines",
            route="/foundations?focus=manifesto",
            tags=["guideline", "pillar", pillar_id],
            text=(
                f"{PRODUCT_NAME.upper()} GUIDELINE PILLAR: {title} | "
                f"Summary: {summary} | Pillar ID: {pillar_id} | "
                "Part of the Velaris guideline architecture used by Abraxos for design decisions."
            ),
            logic=summary,
            context_of_use="Design principles, governance and explainable recommendations.",
        )

    for match in re.finditer(
        r'id:\s*"([^"]+)"\s*,\s*title:\s*"([^"]+)"\s*,\s*description:\s*"([^"]+)"',
        block,
    ):
        principle_id, title, description = match.groups()
        if principle_id.startswith(("C", "E", "F", "L", "A", "G", "S")):
            append_chunk(
                chunks,
                source="GuidelinesPage.tsx",
                page_type="guideline",
                title=title,
                kind="principle",
                section="guidelines",
                route="/foundations?focus=manifesto",
                tags=["guideline", "principle", principle_id],
                text=(
                    f"{PRODUCT_NAME.upper()} DESIGN PRINCIPLE: {title} | "
                    f"Description: {description} | Principle ID: {principle_id} | "
                    "Abraxos may reference this principle in trade-off and conflict analysis."
                ),
                logic=description,
            )


def extract_reasoning(chunks: list) -> None:
    """ReasoningPage + reasoningPage i18n → cognitive architecture, flow and commands."""
    reasoning_src = read_project_file("src/components/ReasoningPage.tsx")
    i18n_src = read_project_file("src/i18n/pages/reasoningPage.ts")

    append_chunk(
        chunks,
        source="ReasoningPage.tsx",
        page_type="reasoning",
        title="Abraxos Explainable Reasoning",
        kind="overview",
        section="overview",
        route="/reasoning",
        tags=["reasoning", "abraxos", "xai"],
        text=(
            f"{PRODUCT_NAME.upper()} REASONING: Abraxos Explainable Reasoning | "
            "Abraxos combines internal capabilities, actionable Oracle commands, and the "
            "Evidence Weaver to turn questions into grounded answers with sources, confidence, "
            "and explicit limits. Route: /reasoning. Five sections: overview, Evidence Weaver, "
            "automatic skills, Oracle commands, and verifiable pipeline."
        ),
        logic="Central surface for Abraxos cognitive architecture documentation.",
        context_of_use="Users learning how Abraxos reasons differently from a generic LLM.",
    )

    flow_ids = re.findall(r'"([a-z]+)"', reasoning_src[reasoning_src.find("FLOW_IDS"):reasoning_src.find("FLOW_IDS") + 200]) if "FLOW_IDS" in reasoning_src else []
    if not flow_ids:
        flow_ids = ["question", "intent", "skill", "evidence", "response", "confidence"]

    flow_labels = {
        "question": ("Question ingestion", "User query enters the Abraxos pipeline."),
        "intent": ("Intent classification", "Abraxos classifies retrieval and response intent."),
        "skill": ("Skill activation", "Automatic cognitive skills activate based on context."),
        "evidence": ("Evidence retrieval", "RAG retrieves typed chunks from the Velaris corpus."),
        "response": ("Response composition", "Abraxos composes a grounded, explainable answer."),
        "confidence": ("Confidence calibration", "Evidence strength calibrates displayed confidence."),
    }
    for step_id in flow_ids:
        label, detail = flow_labels.get(step_id, (step_id.title(), f"Pipeline step: {step_id}"))
        append_chunk(
            chunks,
            source="ReasoningPage.tsx",
            page_type="reasoning",
            title=f"Cognitive Flow — {label}",
            kind="pipeline_step",
            section="overview",
            route="/reasoning?focus=overview",
            tags=["reasoning", "pipeline", step_id],
            text=(
                f"{PRODUCT_NAME.upper()} REASONING STEP: {label} | "
                f"Detail: {detail} | Step ID: {step_id} | "
                "Part of the Abraxos cognitive flow on the Reasoning page."
            ),
            logic=detail,
            context_of_use="Beatrice/Abraxos XAI reasoning pipeline.",
        )

    sections = [
        ("overview", "Overview", "Abraxos cognition — how questions become explainable answers."),
        ("weaver", "Evidence Weaver", "Evidence orchestration layer organizing intent, entities, sources and catalog."),
        ("skills", "Abraxos Skills", "Fifteen automatic skills activated without manual slash commands."),
        ("commands", "Oracle Commands", "Twelve user-triggered operational and investigative slash commands."),
        ("pipeline", "Verifiable Pipeline", "Nine verifiable stages from query ingestion to confidence calibration."),
    ]
    for section_id, label, desc in sections:
        append_chunk(
            chunks,
            source="ReasoningPage.tsx",
            page_type="reasoning",
            title=f"Reasoning Section — {label}",
            kind="section",
            section=section_id,
            route=f"/reasoning?focus={section_id}",
            tags=["reasoning", "section", section_id],
            text=(
                f"{PRODUCT_NAME.upper()} REASONING SECTION: {label} | "
                f"Description: {desc} | Route: /reasoning?focus={section_id}"
            ),
            logic=desc,
        )

    if i18n_src:
        append_chunk(
            chunks,
            source="src/i18n/pages/reasoningPage.ts",
            page_type="reasoning",
            title="Evidence Weaver",
            kind="weaver",
            section="weaver",
            route="/reasoning?focus=weaver",
            tags=["reasoning", "evidence-weaver", "tecela"],
            text=(
                f"{PRODUCT_NAME.upper()} REASONING: Evidence Weaver (Tecelã de Evidências) | "
                "The cognitive layer that organizes intent, entities, sources, catalog, patterns, "
                "tokens and decisions before the final answer. It does not retrieve knowledge or "
                "produce the answer: it structures context, assesses evidence quality and coverage, "
                "and prepares the foundation for Abraxos to reason with traceability."
            ),
            logic="Evidence orchestration before LLM composition.",
            aetheris_insight="The Weaver organizes available knowledge; Abraxos interprets it; the Pipeline proves the path.",
        )


def extract_perspectives(chunks: list) -> None:
    """PerspectivesPage + lenses.ts → professional perspective chunks."""
    lenses_src = read_project_file("src/beatrice/domain/perspective/lenses.ts")
    if not lenses_src:
        return

    append_chunk(
        chunks,
        source="PerspectivesPage.tsx",
        page_type="perspective",
        title="Velaris Professional Perspectives",
        kind="overview",
        section="identity",
        route="/perspectives",
        tags=["perspectives", "abraxos", "lenses"],
        text=(
            f"{PRODUCT_NAME.upper()} PERSPECTIVE: Professional Perspectives | "
            "Abraxos adapts depth, vocabulary and risk sensitivity through professional lenses. "
            "Route: /perspectives. Sections: identity gallery and cognition instrumentation. "
            "Eight professional perspectives: dev, designer, product_designer, design_system_manager, "
            "qa, tech_writer, a11y, maintainer."
        ),
        logic="Multi-stakeholder analysis through calibrated professional lenses.",
        context_of_use="Perspective synthesis, Oracle Council, retrieval weighting.",
    )

    profile_pattern = re.compile(
        r"(dev|designer|product_designer|design_system_manager|qa|tech_writer|a11y|maintainer):\s*\{[^}]*?"
        r'title:\s*"([^"]+)"[^}]*?'
        r'specialty:\s*"([^"]+)"[^}]*?'
        r'primaryResponsibility:\s*"([^"]+)"[^}]*?'
        r'primaryPain:\s*"([^"]+)"',
        re.DOTALL,
    )
    for match in profile_pattern.finditer(lenses_src):
        profile_id, title, specialty, responsibility, pain = match.groups()
        use_cases = {
            "a11y": "Use the a11y perspective to review accessibility, WCAG, keyboard, focus and contrast.",
            "tech_writer": "Use the tech_writer perspective for technical documentation, naming and microcopy.",
            "qa": "Use the qa perspective for edge cases, regression and release risk.",
            "dev": "Use the dev perspective for implementation, architecture and contracts.",
            "designer": "Use the designer perspective for visual hierarchy, tokens and composition.",
            "product_designer": "Use the product_designer perspective for usability and flow validation.",
            "design_system_manager": "Use the design_system_manager perspective for governance and adoption.",
            "maintainer": "Use the maintainer perspective for maintenance cost and technical debt.",
        }
        append_chunk(
            chunks,
            source="src/beatrice/domain/perspective/lenses.ts",
            page_type="perspective",
            title=f"Perspective — {title}",
            kind="professional_lens",
            section="identity",
            capability=profile_id,
            route=f"/perspectives?profile={profile_id}",
            tags=["perspective", profile_id, "lens"],
            text=(
                f"{PRODUCT_NAME.upper()} PERSPECTIVE: {title} ({profile_id}) | "
                f"Specialty: {specialty} | Primary responsibility: {responsibility} | "
                f"Primary pain: {pain} | {use_cases.get(profile_id, '')} | "
                "Abraxos adjusts retrieval weights and response depth for this lens."
            ),
            logic=responsibility,
            context_of_use=specialty,
            when_to_use=use_cases.get(profile_id, ""),
        )


def extract_cognition(chunks: list) -> None:
    """PerspectivesCognitionSection + lensInstrumentation → cognition calibration chunks."""
    instr_src = read_project_file("src/beatrice/domain/perspective/lensInstrumentation.ts")
    if not instr_src:
        return

    append_chunk(
        chunks,
        source="PerspectivesCognitionSection.tsx",
        page_type="cognition",
        title="Perspective Cognition Instrumentation",
        kind="overview",
        section="cognition",
        route="/perspectives?focus=cognition",
        tags=["cognition", "calibration", "perspectives"],
        text=(
            f"{PRODUCT_NAME.upper()} COGNITION: Perspective Cognition Instrumentation | "
            "The cognition section on /perspectives?focus=cognition lets maintainers calibrate "
            "depth, technicality and risk sensitivity per professional lens. Calibration persists "
            "per lens and flows to /api/chat as payload fields. Abraxos uses calibration to adapt "
            "response depth and evidence presentation."
        ),
        logic="Lens instrumentation controls how Abraxos thinks per perspective.",
        context_of_use="Perspective trials, cognitive radar, calibration sliders.",
    )

    inst_pattern = re.compile(
        r"(designer|product_designer|dev|design_system_manager|qa|tech_writer|a11y|maintainer):\s*\{[^}]*?"
        r'depth:\s*"([^"]+)"[^}]*?'
        r'technicality:\s*([0-9.]+)[^}]*?'
        r'riskSensitivity:\s*([0-9.]+)[^}]*?'
        r'trustStyle:\s*"([^"]+)"',
        re.DOTALL,
    )
    for match in inst_pattern.finditer(instr_src):
        profile_id, depth, technicality, risk, trust = match.groups()
        append_chunk(
            chunks,
            source="src/beatrice/domain/perspective/lensInstrumentation.ts",
            page_type="cognition",
            title=f"Cognition Calibration — {profile_id}",
            kind="calibration",
            section="cognition",
            capability=profile_id,
            route="/perspectives?focus=cognition",
            tags=["cognition", "calibration", profile_id],
            text=(
                f"{PRODUCT_NAME.upper()} COGNITION: {profile_id} calibration | "
                f"Depth: {depth} | Technicality: {technicality} | "
                f"Risk sensitivity: {risk} | Trust style: {trust} | "
                "How this lens influences Abraxos response structure and evidence presentation."
            ),
            logic=f"Default calibration for the {profile_id} lens.",
        )


def extract_system_health(chunks: list) -> None:
    """SystemHealthSection + evaluationHealth.ts → per-metric health chunks."""
    append_chunk(
        chunks,
        source="SystemHealthSection.tsx",
        page_type="system_health",
        title="Overall Design System Health",
        kind="overview",
        section="health",
        route="/evaluation?focus=health#health",
        command="/health",
        tags=["health", "evaluation", "overall"],
        status="Mock UI data — not live API",
        text=(
            f"{PRODUCT_NAME.upper()} SYSTEM HEALTH: Overall Design System Health | "
            "Reliability diagnostics for the Velaris ecosystem and the Abraxos agent. "
            "Route: /evaluation?focus=health (fifth section in Evaluation, not a primary menu item). "
            "Command: /health directs maintainers to this section. "
            "Overall mock score: 84% (evolving, improving). "
            "NOTE: Scores in the Evaluation UI are mock data; live diagnostics live at "
            "/knowledge-health (admin) and /api/health (RAG corpus status)."
        ),
        logic="Consolidated maturity view across knowledge, catalog, RAG and governance dimensions.",
        aetheris_insight="Mock scores pending integration with knowledge_health.py and reliability gates.",
    )

    for metric_id, meta in HEALTH_METRICS_EN.items():
        scores = HEALTH_METRIC_SCORES.get(metric_id, {})
        score = scores.get("score", "n/a")
        status = scores.get("status", "unknown")
        append_chunk(
            chunks,
            source="src/i18n/pages/evaluationHealth.ts",
            page_type="system_health",
            title=meta["label"],
            kind="metric",
            section="health",
            capability=metric_id,
            route="/evaluation?focus=health#health",
            command="/health",
            tags=["health", "metric", metric_id],
            status=f"Mock {score}% — {status}",
            text=(
                f"{PRODUCT_NAME.upper()} SYSTEM HEALTH METRIC: {meta['label']} | "
                f"What it measures: {meta['description']} | "
                f"Mock score: {score}% ({status}) | "
                "Location: Evaluation page, section 5 — Health do Sistema (/evaluation?focus=health). "
                "Related command: /health. "
                "Data note: UI scores are mock; not wired to live Knowledge Health API yet."
            ),
            logic=meta["description"],
            context_of_use="Abraxos system reliability diagnostics for maintainers.",
        )

    measures = {
        "knowledge": "Whether design system knowledge is covered sufficiently to answer safely.",
        "rag": "Whether RAG retrieves relevant sources for the intent and active perspective.",
        "catalog": "Whether the canonical catalog is consistent with documentation and implementation.",
        "hallucination": "Whether Abraxos avoids recommending nonexistent or off-catalog components.",
        "perspectives": "Whether professional perspectives have sufficient coverage and depth.",
        "traceability": "Whether there is traceability between response, source and recorded decision.",
        "confidence": "Whether displayed confidence is calibrated to evidence strength.",
    }
    for measure_id, description in measures.items():
        append_chunk(
            chunks,
            source="src/i18n/pages/evaluationHealth.ts",
            page_type="system_health",
            title=f"What Health Measures — {measure_id}",
            kind="measure",
            section="health",
            route="/evaluation?focus=health#health",
            tags=["health", "measure", measure_id],
            status="Conceptual — not a numeric metric",
            text=(
                f"{PRODUCT_NAME.upper()} SYSTEM HEALTH MEASURE: {measure_id} | "
                f"Question answered: {description} | "
                "Part of 'What this Health measures' on the Evaluation Health section."
            ),
            logic=description,
        )


def extract_evaluation(chunks: list) -> None:
    """EvaluationPage → five academic validation sections."""
    sections = [
        ("methodology", "Metodologia", "Evaluation structure and ten research dimensions."),
        ("instruments", "Instrumentos & Alvos", "SUS, clarity rubric, ECE bins, precision and satisfaction instruments."),
        ("baseline", "Comparação baseline", "Abraxos vs generic LLM comparison matrix."),
        ("status", "Status", "Pending data collection status for TCC validation metrics."),
        ("health", "Health do Sistema", "System reliability diagnostics — fifth Evaluation section."),
    ]
    for section_id, label, desc in sections:
        append_chunk(
            chunks,
            source="EvaluationPage.tsx",
            page_type="evaluation",
            title=f"Evaluation — {label}",
            kind="section",
            section=section_id,
            route=f"/evaluation?focus={section_id}",
            tags=["evaluation", section_id],
            text=(
                f"{PRODUCT_NAME.upper()} EVALUATION: {label} | "
                f"Description: {desc} | Route: /evaluation?focus={section_id} | "
                "Academic validation surface for the Velaris/Abraxos system."
            ),
            logic=desc,
        )


def extract_governance_page(chunks: list) -> None:
    """GovernancePage → governance alert model and categories."""
    categories = {
        "duplicate_components": "Duplicate components in the canonical catalog.",
        "overlapping_components": "Overlapping components with similar responsibilities.",
        "orphan_tokens": "Tokens without consumers in the registry.",
        "guidelines_without_reference": "Guidelines lacking component or pattern references.",
        "components_without_examples": "Components missing usage examples.",
        "components_without_edge_cases": "Components missing edge-case documentation.",
        "components_without_accessibility": "Components missing accessibility metadata.",
        "inconsistent_documentation": "Documentation inconsistencies across surfaces.",
        "conflicting_aliases": "Conflicting aliases in the entity registry.",
        "low_coverage": "Entities with low documentation coverage.",
    }
    append_chunk(
        chunks,
        source="GovernancePage.tsx",
        page_type="governance",
        title="Governance Agent — Alert Dashboard",
        kind="overview",
        section="governance",
        route="/governance",
        command="/governance",
        capability="governance",
        tags=["governance", "alerts", "catalog"],
        text=(
            f"{PRODUCT_NAME.upper()} GOVERNANCE: Governance Agent Alert Dashboard | "
            "Route: /governance (utility route, linked from Reasoning /governance command). "
            "Command: /governance triggers governance engine with pre-computed alerts. "
            "Live data from /api/governance/alerts. Severity levels: critical, high, medium, low. "
            "The Governance Agent scans component-metadata.json, tokens and corpus for catalog problems."
        ),
        logic="Continuous catalog auditing for maintainers.",
        context_of_use="/governance command and GovernancePage dashboard.",
    )
    for cat_id, description in categories.items():
        append_chunk(
            chunks,
            source="GovernancePage.tsx",
            page_type="governance",
            title=f"Governance Alert Category — {cat_id}",
            kind="alert_category",
            section="governance",
            command="/governance",
            tags=["governance", "alert", cat_id],
            text=(
                f"{PRODUCT_NAME.upper()} GOVERNANCE ALERT: {cat_id} | "
                f"Description: {description} | "
                "Detected by governance_agent.py and surfaced on /governance."
            ),
            logic=description,
        )


def extract_knowledge_health(chunks: list) -> None:
    """KnowledgeHealthPage → knowledge debt and coverage dimensions."""
    dimensions = {
        "description": "Component description coverage",
        "variants": "Variant documentation",
        "states": "Interactive state documentation",
        "accessibility": "Accessibility metadata",
        "edge_cases": "Edge case documentation",
        "examples": "Usage examples",
        "guidelines": "Guideline references",
        "when_to_use": "When-to-use guidance",
        "when_not_to_use": "When-not-to-use guidance",
        "contracts": "Design-to-code contracts",
    }
    append_chunk(
        chunks,
        source="KnowledgeHealthPage.tsx",
        page_type="knowledge_health",
        title="Knowledge Health Dashboard",
        kind="overview",
        section="knowledge_health",
        route="/knowledge-health",
        tags=["knowledge-health", "coverage", "admin"],
        text=(
            f"{PRODUCT_NAME.upper()} KNOWLEDGE HEALTH: Dashboard | "
            "Route: /knowledge-health (admin-gated research surface). "
            "Live API: /api/knowledge/health/dashboard. "
            "Sections: entities catalogued, intelligence scores, reliability gates, "
            "component coverage, perspective coverage, knowledge debt backlog, knowledge gaps, "
            "evidence health, decision health. Computed by knowledge_health.py at runtime."
        ),
        logic="Operational knowledge coverage audit for maintainers.",
    )
    for dim_id, label in dimensions.items():
        append_chunk(
            chunks,
            source="KnowledgeHealthPage.tsx",
            page_type="knowledge_health",
            title=f"Knowledge Coverage Dimension — {label}",
            kind="coverage_dimension",
            section="knowledge_health",
            tags=["knowledge-health", "coverage", dim_id],
            text=(
                f"{PRODUCT_NAME.upper()} KNOWLEDGE HEALTH: {label} | "
                f"Dimension ID: {dim_id} | "
                "Tracked in the Knowledge Health Dashboard component coverage matrix."
            ),
            logic=label,
        )


def extract_intelligence_lab(chunks: list) -> None:
    """IntelligenceLabPage → adversarial test categories."""
    categories = {
        "unknown_components": "Tests blocking recommendations for nonexistent components.",
        "unknown_tokens": "Tests blocking nonexistent token references.",
        "unknown_states": "Tests blocking undocumented component states.",
        "unknown_guidelines": "Tests for missing guideline coverage.",
        "invalid_comparisons": "Tests blocking comparisons with unsupported entities.",
        "hallucination_detection": "Adversarial cases for hallucination resistance.",
    }
    append_chunk(
        chunks,
        source="IntelligenceLabPage.tsx",
        page_type="intelligence_lab",
        title="Intelligence Lab — Adversarial Test Suite",
        kind="overview",
        section="intelligence_lab",
        route="/intelligence-lab",
        tags=["intelligence-lab", "adversarial", "admin"],
        text=(
            f"{PRODUCT_NAME.upper()} INTELLIGENCE LAB: Adversarial Test Suite | "
            "Route: /intelligence-lab (admin-gated). "
            "Runs catalog adversarial cases, suite pass rate and per-category results. "
            "Validates hallucination resistance and entity blocking for Abraxos."
        ),
        logic="Adversarial validation of Abraxos intelligence reliability.",
    )
    for cat_id, description in categories.items():
        append_chunk(
            chunks,
            source="IntelligenceLabPage.tsx",
            page_type="intelligence_lab",
            title=f"Adversarial Category — {cat_id}",
            kind="test_category",
            section="intelligence_lab",
            tags=["intelligence-lab", cat_id],
            text=(
                f"{PRODUCT_NAME.upper()} INTELLIGENCE LAB: {cat_id} | "
                f"Description: {description}"
            ),
            logic=description,
        )


def extract_developers_architecture(chunks: list) -> None:
    """DevelopersPage → RAG pipeline and corpus architecture."""
    phases = [
        ("extract", "rag/extract_docs.py", "Walks TSX and TS sources, produces typed JSON chunks."),
        ("embed", "rag/setup_vectordb.py", "Embeds chunks with BAAI/bge-m3 into ChromaDB."),
        ("watch", "rag/watch.py", "Debounced auto-reindex on source saves (npm run watch-rag)."),
        ("serve", "rag/retrieval.py", "Query-time vector retrieval with intent filters and perspective weights."),
    ]
    append_chunk(
        chunks,
        source="DevelopersPage.tsx",
        page_type="developer_architecture",
        title="Velaris RAG Architecture",
        kind="overview",
        section="architecture",
        route="/architecture",
        tags=["architecture", "rag", "corpus"],
        text=(
            f"{PRODUCT_NAME.upper()} ARCHITECTURE: RAG Pipeline | "
            "Abraxos recovers evidence through a four-stage pipeline: extract → embed → watch → serve. "
            "Collection: aetheris_design_system in rag/chroma_db/. "
            "Embedding: BAAI/bge-m3 (1024 dim, cosine HNSW). "
            "Live status: /api/health. Route: /architecture (Developers page)."
        ),
        logic="How Abraxos grounds answers in the Velaris corpus.",
    )
    for phase, artefact, description in phases:
        append_chunk(
            chunks,
            source="DevelopersPage.tsx",
            page_type="developer_architecture",
            title=f"RAG Pipeline — {phase}",
            kind="pipeline_phase",
            section="architecture",
            route="/architecture",
            tags=["architecture", "rag", phase],
            text=(
                f"{PRODUCT_NAME.upper()} RAG PHASE: {phase} | "
                f"Artefact: {artefact} | {description}"
            ),
            logic=description,
        )

    append_chunk(
        chunks,
        source="DevelopersPage.tsx",
        page_type="developer_architecture",
        title="Corpus, Chunk and Source — Definitions",
        kind="concept",
        section="corpus",
        route="/architecture",
        tags=["architecture", "corpus", "chunk", "source"],
        text=(
            f"{PRODUCT_NAME.upper()} ARCHITECTURE: Corpus vs Chunk vs Source | "
            "Corpus: the full indexed knowledge base in ChromaDB (all chunks). "
            "Chunk: one typed, embeddable unit with page_type, title, text and metadata. "
            "Source: the originating file or artefact (e.g. TokensPage.tsx, capabilities.ts). "
            "Abraxos retrieves chunks and attributes them as sources in SSE responses."
        ),
        logic="Terminology for RAG evidence attribution.",
    )


def extract_engine_contracts(chunks: list) -> None:
    """prompts/engines/*.md → engine_contract chunks."""
    priority = {
        "governanceAgent.md": "governance",
        "simulate.md": "simulate",
        "oracleCouncil.md": "oracle-council",
        "knowledgeGap.md": "knowledge-gap",
        "explainabilityAudit.md": "audit",
        "organizationalMemory.md": "memory",
        "decisionArchaeology.md": "decision",
    }
    for filename, command in priority.items():
        path = ENGINES_DIR / filename
        if not path.exists():
            continue
        body = path.read_text(encoding="utf-8").strip()
        title_match = re.search(r"^#\s+(.+)$", body, re.MULTILINE)
        title = title_match.group(1).strip() if title_match else filename.replace(".md", "")
        slug = filename.replace(".md", "")
        append_chunk(
            chunks,
            source=f"prompts/engines/{filename}",
            page_type="engine_contract",
            title=title,
            kind="engine_contract",
            section="engines",
            command=f"/{command}",
            capability=slug,
            route="/reasoning?focus=commands",
            tags=["engine", command, "contract"],
            text=(
                f"{PRODUCT_NAME.upper()} ENGINE CONTRACT: {title} | "
                f"Command: /{command} | "
                f"Contract file: prompts/engines/{filename} | "
                f"{body[:1200]}"
            ),
            logic=body[:500],
            context_of_use=f"Runtime prompt contract for /{command} engine.",
        )


def enrich_oracle_command_chunks(chunks: list) -> None:
    """Add route, command and engine notes to oracle_command chunks from capabilities.ts."""
    for chunk in chunks:
        if chunk.get("page_type") != "oracle_command":
            continue
        chunk_id = chunk.get("id", "")
        capability_id = chunk_id.split("::")[-1].strip() if "::" in chunk_id else ""
        command_slug = capability_id.replace("_", "-")
        if command_slug in COMMAND_ROUTES:
            chunk["route"] = COMMAND_ROUTES[command_slug]
        if command_slug.startswith("/"):
            command_slug = command_slug[1:]
        cmd_text = chunk.get("text", "")
        if "/health" in cmd_text or capability_id == "health":
            chunk["command"] = "/health"
            chunk["route"] = COMMAND_ROUTES["health"]
            chunk["kind"] = "oracle_command"
            chunk["tags"] = "oracle_command,health,system_health"
        elif capability_id == "governance":
            chunk["command"] = "/governance"
            chunk["route"] = COMMAND_ROUTES["governance"]
            chunk["kind"] = "oracle_command"
            chunk["tags"] = "oracle_command,governance"
        elif capability_id == "simulate":
            chunk["command"] = "/simulate"
            chunk["route"] = COMMAND_ROUTES["simulate"]
            chunk["kind"] = "oracle_command"
            chunk["tags"] = "oracle_command,simulation"
        elif command_slug in COMMAND_ENGINE_NOTES:
            note = COMMAND_ENGINE_NOTES[command_slug]
            chunk["text"] = chunk["text"] + f" | Engine note: {note}"
            chunk["char_count"] = len(chunk["text"])
        if not chunk.get("command"):
            m = re.search(r"Command:\s*(/[\w-]+)", chunk.get("text", ""))
            if m:
                chunk["command"] = m.group(1)
        if not chunk.get("kind"):
            chunk["kind"] = "oracle_command"
        if not chunk.get("capability"):
            chunk["capability"] = capability_id


def run_intelligence_extractors(chunks: list) -> None:
    """Run all Phase 1 intelligence-layer extractors."""
    extract_guidelines(chunks)
    extract_reasoning(chunks)
    extract_perspectives(chunks)
    extract_cognition(chunks)
    extract_system_health(chunks)
    extract_evaluation(chunks)
    extract_governance_page(chunks)
    extract_knowledge_health(chunks)
    extract_intelligence_lab(chunks)
    extract_developers_architecture(chunks)
    extract_engine_contracts(chunks)
    enrich_oracle_command_chunks(chunks)
