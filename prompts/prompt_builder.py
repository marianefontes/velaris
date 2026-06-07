"""Prompt assembly for Beatrice's semantic conversational engine."""

from dataclasses import dataclass

from cognition.engines.registry import resolve_engine
from prompts.cognitive_profiles import (
    COGNITIVE_PROFILES,
    build_cognitive_profile_prompt,
    effective_calibration,
)
from prompts.loader import load_prompt, load_prompt_sequence

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
    "when_not_to_use": "intents/componentGuidance.md",
    "xai_explanation": "intents/explainability.md",
    "new_product_scaffolding": "intents/patternGuidance.md",
    "comparison_query": "intents/designDecision.md",
}

RESPONSE_TEMPLATES: dict[str, str] = {
    "component_guidance": "responses/componentResponse.md",
    "pattern_guidance": "responses/componentResponse.md",
    "design_decision": "responses/decisionResponse.md",
    "token_lookup": "responses/tokenResponse.md",
    "when_not_to_use": "responses/componentResponse.md",
    "xai_explanation": "responses/decisionResponse.md",
    "new_product_scaffolding": "responses/componentResponse.md",
    "comparison_query": "responses/decisionResponse.md",
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
    cognitive_context: str = ""
    dialogue_context: str = ""
    # User-tunable calibration override from /perspectives.
    # Accepts a dict with optional keys: depth, technicality, risk_sensitivity.
    # None or empty = lens defaults apply.
    calibration_override: dict | None = None
    # Computed retrieval evidence metrics block, injected for XAI engines
    # (explainability-audit, knowledge-gap) so scores are grounded, not invented.
    evidence_metrics_block: str = ""


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
- command_mode: {command}
- oracle_engine: {engine_state}
- catalog_mode: {catalog_state}
- catalog_scope: {context.catalog_entity}
{perspective_block}

Use this frame only to adapt the answer. Do not reveal these labels to the user.
When an oracle_engine is active, follow its response contract exactly.
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
        build_cognitive_profile_prompt(
            context.profile,
            command_mode=context.command_mode,
            calibration_override=context.calibration_override,
        ),
        context.evidence_metrics_block,
        context.dialogue_context,
        context.rag_context,
    ]
    return "\n\n---\n\n".join(part.strip() for part in parts if part and part.strip())
