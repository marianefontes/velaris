"""Top-level adaptive cognitive orchestration for Beatrice."""

from dataclasses import dataclass, field
from typing import Any

from cognition.orchestration.ambiguity_detector import AmbiguitySignals, detect_ambiguity
from cognition.orchestration.complexity_analyzer import ComplexitySignals, analyze_complexity
from cognition.orchestration.orchestration_weights import STRATEGIES, skill_display_name
from cognition.orchestration.strategy_composer import compose_strategy_context
from cognition.orchestration.strategy_selector import StrategyActivation, select_strategies
from cognition.overrides.manual_override_parser import ManualOverride, parse_manual_override


@dataclass(frozen=True)
class CognitiveOrchestrationResult:
    clean_query: str
    complexity: ComplexitySignals
    ambiguity: AmbiguitySignals
    activations: tuple[StrategyActivation, ...] = field(default_factory=tuple)
    manual_override: ManualOverride = field(default_factory=ManualOverride)
    prompt_context: str = ""
    retrieval_top_k: int = 3
    # Serializable, user-facing skill disclosure (XAI signal for the frontend).
    active_skills: tuple[dict[str, Any], ...] = field(default_factory=tuple)


def _intensity(weight: float) -> str:
    if weight >= 0.8:
        return "high"
    if weight >= 0.55:
        return "medium"
    return "light"


def _serialize_skills(activations: list[StrategyActivation]) -> tuple[dict[str, Any], ...]:
    """Expose only disclosable reasoning skills, never retrieval mechanics."""
    skills: list[dict[str, Any]] = []
    for activation in activations:
        label = skill_display_name(activation.id)
        if label is None:
            continue
        skills.append({
            "id": activation.id,
            "label": label,
            "reason": STRATEGIES[activation.id].natural_focus,
            "confidence": activation.confidence,
            "intensity": _intensity(activation.weight),
        })
    return tuple(skills)


def _retrieval_depth(base_top_k: int, activations: list[StrategyActivation], complexity: ComplexitySignals) -> int:
    active_ids = {activation.id for activation in activations}
    depth = base_top_k
    if "retrieval_deep_dive" in active_ids:
        depth = max(depth, 5)
    if complexity.overall >= 0.65 or "systems_thinking" in active_ids:
        depth = max(depth, 5)
    if complexity.overall >= 0.82:
        depth = max(depth, 7)
    return min(depth, 8)


def build_cognitive_orchestration(
    *,
    query: str,
    route: Any,
    messages: list[dict[str, Any]] | None = None,
    manual_override: ManualOverride | None = None,
) -> CognitiveOrchestrationResult:
    override = manual_override or parse_manual_override(query)
    clean_query = override.clean_query.strip() or query.strip()

    complexity = analyze_complexity(
        clean_query,
        intent=route.response_intent,
        catalog_mode=route.catalog_mode,
        command_mode=route.active_command_mode,
    )
    ambiguity = detect_ambiguity(clean_query)
    activations = select_strategies(
        query=clean_query,
        intent=route.response_intent,
        complexity=complexity,
        ambiguity=ambiguity,
        manual_override=override,
    )
    prompt_context = compose_strategy_context(
        activations=activations,
        complexity=complexity,
        ambiguity=ambiguity,
        manual_override=override,
    )

    return CognitiveOrchestrationResult(
        clean_query=clean_query,
        complexity=complexity,
        ambiguity=ambiguity,
        activations=tuple(activations),
        manual_override=override,
        prompt_context=prompt_context,
        retrieval_top_k=_retrieval_depth(route.top_k, activations, complexity),
        active_skills=_serialize_skills(activations),
    )
