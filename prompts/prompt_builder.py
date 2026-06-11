"""Prompt assembly for Beatrice's semantic conversational engine."""

from dataclasses import dataclass

from cognition.engines.registry import resolve_engine
from prompts.cognitive_profiles import (
    COGNITIVE_PROFILES,
    build_cognitive_profile_prompt,
    effective_calibration,
)
from prompts.loader import load_prompt, load_prompt_sequence
from prompts.perspective_contracts import build_perspective_response_contract_prompt

SYSTEM_LAYERS: list[str] = [
    "system/core.md",
    "system/identity.md",
    "system/orchestration.md",
    "retrieval/retrievalPolicy.md",
    "retrieval/chunkingStrategy.md",
    "system/antiPatterns.md",
    "system/responseRules.md",
]

INTENT_PROMPTS: dict[str, str] = {
    "component_guidance": "intents/componentGuidance.md",
    "pattern_guidance": "intents/patternGuidance.md",
    "design_decision": "intents/designDecision.md",
    "token_lookup": "intents/tokenLookup.md",
    "accessibility_guidance": "intents/accessibilityGuidance.md",
    "when_not_to_use": "intents/componentGuidance.md",
    "xai_explanation": "intents/explainability.md",
    "new_product_scaffolding": "intents/patternGuidance.md",
    "comparison_query": "intents/designDecision.md",
}

RESPONSE_TEMPLATES: dict[str, str] = {
    "component_guidance": "responses/componentResponse.md",
    "pattern_guidance": "responses/patternResponse.md",
    "accessibility_guidance": "responses/accessibilityResponse.md",
    "design_decision": "responses/decisionResponse.md",
    "token_lookup": "responses/tokenResponse.md",
    "when_not_to_use": "responses/componentResponse.md",
    "xai_explanation": "responses/xaiResponse.md",
    "new_product_scaffolding": "responses/componentResponse.md",
    "comparison_query": "responses/comparisonResponse.md",
    "out_of_scope": "responses/outOfScope.md",
}

OPERATIONAL_COMMAND_PROMPTS: dict[str, str] = {
    "enforce": "commands/enforce.md",
    "token-impact": "commands/tokenImpact.md",
    "contract-check": "commands/contractCheck.md",
    "feedback-review": "commands/feedbackReview.md",
    "tradeoff": "commands/tradeoff.md",
}


@dataclass(frozen=True)
class PromptBuildContext:
    query: str
    retrieval_intent: str
    response_intent: str
    profile: str
    command_mode: str | None
    catalog_mode: bool
    catalog_entity: str
    rag_context: str
    answer_strategy: str = "documentation_help"
    language: str = "unknown"
    cognitive_context: str = ""
    dialogue_context: str = ""
    agent_context: str = ""
    # User-tunable calibration override from /perspectives.
    # Accepts a dict with optional keys: depth, technicality, risk_sensitivity.
    # None or empty = lens defaults apply.
    calibration_override: dict | None = None
    # Computed retrieval evidence metrics block, injected for XAI engines
    # (explainability-audit, knowledge-gap) so scores are grounded, not invented.
    evidence_metrics_block: str = ""
    # Pre-computed governance alerts for the Governance Agent engine.
    governance_alerts_block: str = ""
    # Exact source similarity and tier values for specialized perspective
    # contracts. This is retrieval relevance, not answer confidence.
    perspective_evidence_block: str = ""
    surface_context_block: str = ""
    decision_analysis_mode: bool = False
    architect_review_mode: bool = False


def build_intent_prompt(intent: str) -> str:
    path = INTENT_PROMPTS.get(intent)
    return load_prompt(path, required=False) if path else ""


def build_response_template(intent: str, catalog_mode: bool = False, command_mode: str | None = None) -> str:
    if command_mode:
        engine = resolve_engine(command_mode)
        if engine is not None:
            return load_prompt(engine.contract_path)
        command_prompt = OPERATIONAL_COMMAND_PROMPTS.get(command_mode)
        if command_prompt is not None:
            return load_prompt(command_prompt)
        return load_prompt("responses/governanceResponse.md")
    if catalog_mode:
        return load_prompt("responses/catalogResponse.md")
    path = RESPONSE_TEMPLATES.get(intent)
    return load_prompt(path, required=False) if path else ""


def build_surface_context_block(surface_context: dict | None) -> str:
    if not surface_context:
        return ""
    lines = [
        f"- {key}: {value}"
        for key, value in surface_context.items()
        if value not in (None, "")
    ]
    if not lines:
        return ""
    return (
        "\n# UI Surface Context\n"
        + "\n".join(lines)
        + "\nUse this context to tailor the answer to the user's current page. "
        "Do not reveal these internal labels unless helpful."
    )


def build_runtime_frame(context: PromptBuildContext) -> str:
    command = context.command_mode or "none"
    catalog_state = "active" if context.catalog_mode else "inactive"
    engine = resolve_engine(context.command_mode)
    engine_state = engine.label if engine is not None else "none"
    perspective_block = _runtime_perspective_block(context.profile, context.calibration_override)
    return f"""
# Runtime Orchestration Frame

- user_profile: {context.profile}
- retrieval_intent: {context.retrieval_intent}
- response_intent: {context.response_intent}
- answer_strategy: {context.answer_strategy}
- required_language: {context.language}
- command_mode: {command}
- oracle_engine: {engine_state}
- catalog_mode: {catalog_state}
- catalog_scope: {context.catalog_entity}
{perspective_block}
{context.surface_context_block}

Use this frame only to adapt the answer. Do not reveal these labels to the user.
When an oracle_engine is active, follow its response contract exactly.
Use the required_language when it is known. For pt-PT, prefer Portuguese from
Portugal vocabulary without caricature or forced regionalisms.
""".strip()


def _runtime_perspective_block(profile: str, calibration_override: dict | None) -> str:
    cognitive_profile = COGNITIVE_PROFILES.get(profile)
    if cognitive_profile is None:
        return (
            "- perspective_depth: medium\n"
            "- perspective_technicality: 50%\n"
            "- perspective_risk_sensitivity: 50%\n"
            "- perspective_trust_style: qualitative\n"
            "- perspective_calibration: lens-default"
        )
    effective = effective_calibration(cognitive_profile, calibration_override)
    return (
        f"- perspective_depth: {effective['depth']}\n"
        f"- perspective_technicality: {effective['technicality']:.0%}\n"
        f"- perspective_risk_sensitivity: {effective['risk_sensitivity']:.0%}\n"
        f"- perspective_trust_style: {cognitive_profile.trust_calibration_style}\n"
        f"- perspective_calibration: {effective['source']}"
    )


def build_system_prompt(context: PromptBuildContext) -> str:
    parts = [
        *load_prompt_sequence(SYSTEM_LAYERS),
        build_runtime_frame(context),
        context.cognitive_context,
        build_intent_prompt(context.response_intent),
        build_response_template(
            context.response_intent,
            catalog_mode=context.catalog_mode,
            command_mode=context.command_mode,
        ),
        (
            ""
            if context.command_mode == "simulate"
            else load_prompt("responses/strategicReasoningResponse.md")
            if context.architect_review_mode
            else load_prompt("responses/multiAgentCouncilResponse.md")
            if context.decision_analysis_mode
            else ""
        ),
        build_cognitive_profile_prompt(
            context.profile,
            command_mode=context.command_mode,
            calibration_override=context.calibration_override,
        ),
        context.evidence_metrics_block,
        context.governance_alerts_block,
        context.dialogue_context,
        context.agent_context,
        context.rag_context,
        build_perspective_response_contract_prompt(
            context.profile,
            context.perspective_evidence_block,
        ),
    ]
    return "\n\n---\n\n".join(part.strip() for part in parts if part and part.strip())
