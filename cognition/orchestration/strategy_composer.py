"""Compose selected cognitive strategies into a concise internal prompt layer."""

from pathlib import Path

from cognition.orchestration.ambiguity_detector import AmbiguitySignals
from cognition.orchestration.complexity_analyzer import ComplexitySignals
from cognition.orchestration.orchestration_weights import STRATEGIES, skill_display_name
from cognition.orchestration.strategy_selector import StrategyActivation
from cognition.overrides.manual_override_parser import ManualOverride

COGNITION_ROOT = Path(__file__).resolve().parents[1]


def _load_strategy_body(strategy_id: str) -> str:
    definition = STRATEGIES[strategy_id]
    path = COGNITION_ROOT / definition.prompt_path
    if not path.exists():
        return ""
    lines = path.read_text(encoding="utf-8").strip().splitlines()
    return "\n".join(line for line in lines[1:] if line.strip()).strip()


def _intensity(weight: float) -> str:
    if weight >= 0.8:
        return "high"
    if weight >= 0.55:
        return "medium"
    return "light"


def compose_strategy_context(
    *,
    activations: list[StrategyActivation],
    complexity: ComplexitySignals,
    ambiguity: AmbiguitySignals,
    manual_override: ManualOverride,
) -> str:
    if not activations:
        return ""

    emphasis_lines = []
    lens_blocks = []
    for activation in activations:
        definition = STRATEGIES[activation.id]
        emphasis_lines.append(
            f"- {definition.natural_focus}: intensity={_intensity(activation.weight)}, "
            f"confidence={_intensity(activation.confidence)}, trigger={activation.reason}"
        )
        body = _load_strategy_body(activation.id)
        if body:
            lens_blocks.append(f"## Cognitive Lens\nfocus: {definition.natural_focus}\n{body}")

    override_state = "manual override applied" if manual_override.active else "automatic selection"
    assumptions = "state assumptions briefly if needed" if ambiguity.should_state_assumptions else "do not over-explain assumptions"

    return f"""
# Cognitive Orchestration Context

This layer guides adaptive reasoning. The internal weighting machinery stays
hidden. The runtime may disclose only skills whose operational effect is
observable in the final response.

selection_mode: {override_state}
complexity: overall={complexity.overall}, scope={complexity.scope}, depth={complexity.depth}
ambiguity: score={ambiguity.score}, guidance={assumptions}

Reasoning emphasis:
{chr(10).join(emphasis_lines)}

Composition rules:
- Combine the active cognitive lenses instead of treating them as isolated modes.
- Use the strongest lenses first, but allow secondary lenses to correct blind spots.
- Every selected skill must materially change at least one recommendation, risk,
  guardrail, implementation detail or validation criterion. Naming a skill without
  applying its operational heuristics does not satisfy this contract.
- Do not announce skill names inside the answer. The runtime performs
  post-response validation and discloses only skills with observable application.
- Never expose weights, intensities, confidence numbers or retrieval mechanics.

{chr(10).join(lens_blocks)}
""".strip()
