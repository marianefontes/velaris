"""Select and weight cognitive strategies for a user request."""

from dataclasses import dataclass

from cognition.orchestration.ambiguity_detector import AmbiguitySignals
from cognition.orchestration.complexity_analyzer import ComplexitySignals
from cognition.orchestration.orchestration_weights import (
    BASE_INTENT_WEIGHTS,
    KEYWORD_BOOSTS,
    STRATEGIES,
    clamp_weight,
)
from cognition.overrides.manual_override_parser import ManualOverride


@dataclass(frozen=True)
class StrategyActivation:
    id: str
    weight: float
    confidence: float
    reason: str


def _boost_from_query(strategy_id: str, query: str) -> float:
    q = query.lower()
    boosts = KEYWORD_BOOSTS.get(strategy_id, {})
    return sum(value for keyword, value in boosts.items() if keyword in q)


def _apply_signal_boosts(weights: dict[str, float], complexity: ComplexitySignals, ambiguity: AmbiguitySignals) -> None:
    weights["architecture_analysis"] = weights.get("architecture_analysis", 0.0) + complexity.architecture * 0.8
    weights["implementation_planning"] = weights.get("implementation_planning", 0.0) + complexity.implementation * 0.75
    weights["interaction_guardrail"] = weights.get("interaction_guardrail", 0.0) + complexity.ux * 0.7
    weights["design_system_governance_check"] = (
        weights.get("design_system_governance_check", 0.0) + complexity.governance * 0.7
    )
    weights["risk_assessment"] = weights.get("risk_assessment", 0.0) + complexity.risk * 0.8

    if complexity.scope >= 0.45:
        weights["systems_thinking"] = weights.get("systems_thinking", 0.0) + complexity.scope * 0.7
    if complexity.architecture >= 0.18 and complexity.scope >= 0.25:
        weights["systems_thinking"] = weights.get("systems_thinking", 0.0) + 0.35
        weights["tradeoff_analysis"] = weights.get("tradeoff_analysis", 0.0) + 0.45
        weights["implementation_planning"] = weights.get("implementation_planning", 0.0) + 0.2
    if complexity.overall >= 0.55:
        weights["tradeoff_analysis"] = weights.get("tradeoff_analysis", 0.0) + 0.2
        weights["implementation_planning"] = weights.get("implementation_planning", 0.0) + 0.15
    if ambiguity.score >= 0.35:
        weights["pattern_exploration"] = weights.get("pattern_exploration", 0.0) + ambiguity.score * 0.45
        weights["tradeoff_analysis"] = weights.get("tradeoff_analysis", 0.0) + ambiguity.score * 0.3
    if complexity.entity_count >= 3:
        weights["systems_thinking"] = weights.get("systems_thinking", 0.0) + 0.2


def _apply_manual_override(weights: dict[str, float], manual_override: ManualOverride) -> dict[str, float]:
    if not manual_override.active:
        return weights

    if manual_override.exclusive:
        return {strategy_id: 1.0 for strategy_id in manual_override.boosted_strategies}

    next_weights = dict(weights)
    for strategy_id in manual_override.boosted_strategies:
        next_weights[strategy_id] = max(next_weights.get(strategy_id, 0.0), 0.92)
    for strategy_id in manual_override.blocked_strategies:
        next_weights[strategy_id] = 0.0
    return next_weights


def _activation_reason(
    strategy_id: str,
    *,
    manual_override: ManualOverride,
    complexity: ComplexitySignals,
    ambiguity: AmbiguitySignals,
) -> str:
    if manual_override.active and strategy_id in manual_override.boosted_strategies:
        return "manual priority"
    if strategy_id == "architecture_analysis" and complexity.architecture > 0:
        return "structural vocabulary"
    if strategy_id == "systems_thinking" and complexity.scope >= 0.45:
        return "broad system scope"
    if strategy_id == "implementation_planning" and complexity.implementation > 0:
        return "implementation depth"
    if strategy_id == "interaction_guardrail" and complexity.ux > 0:
        return "interaction or accessibility signal"
    if strategy_id == "design_system_governance_check" and complexity.governance > 0:
        return "design-system governance signal"
    if strategy_id == "risk_assessment" and complexity.risk > 0:
        return "risk signal"
    if strategy_id == "pattern_exploration" and ambiguity.score >= 0.35:
        return "ambiguous design-system choice"
    if strategy_id == "component_fit_analysis":
        return "component choice signal"
    if strategy_id == "component_misuse_detection":
        return "component misuse risk"
    if strategy_id == "token_impact_analysis":
        return "token dependency signal"
    if strategy_id == "design_to_code_contract_check":
        return "design-code contract signal"
    if strategy_id == "feedback_insight_analysis":
        return "feedback or usage signal"
    if strategy_id == "adoption_friction_detection":
        return "adoption friction signal"
    if strategy_id == "governance_impact_analysis":
        return "governance change signal"
    return "intent alignment"


def select_strategies(
    *,
    query: str,
    intent: str,
    complexity: ComplexitySignals,
    ambiguity: AmbiguitySignals,
    manual_override: ManualOverride,
) -> list[StrategyActivation]:
    weights = dict(BASE_INTENT_WEIGHTS.get(intent, BASE_INTENT_WEIGHTS["general"]))

    for strategy_id in STRATEGIES:
        weights[strategy_id] = weights.get(strategy_id, 0.0) + _boost_from_query(strategy_id, query)

    _apply_signal_boosts(weights, complexity, ambiguity)
    weights = _apply_manual_override(weights, manual_override)

    activations = []
    for strategy_id, raw_weight in weights.items():
        if strategy_id not in STRATEGIES:
            continue
        weight = clamp_weight(raw_weight)
        if weight < 0.28:
            continue
        confidence = clamp_weight((weight * 0.75) + (complexity.overall * 0.15) + ((1 - ambiguity.score) * 0.1))
        activations.append(StrategyActivation(
            id=strategy_id,
            weight=weight,
            confidence=confidence,
            reason=_activation_reason(
                strategy_id,
                manual_override=manual_override,
                complexity=complexity,
                ambiguity=ambiguity,
            ),
        ))

    activations.sort(key=lambda activation: (activation.weight, activation.confidence), reverse=True)
    if manual_override.exclusive:
        return activations[:1]
    return activations[:5]
