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


def _disclosable_skills(activations: list[StrategyActivation]) -> list[tuple[str, str]]:
    """Top reasoning skills that may be named to the user (label, focus)."""
    disclosable: list[tuple[str, str]] = []
    for activation in activations:
        label = skill_display_name(activation.id)
        if label is None:
            continue
        disclosable.append((label, STRATEGIES[activation.id].natural_focus))
        if len(disclosable) == 3:
            break
    return disclosable


def _disclosure_directive(activations: list[StrategyActivation]) -> str:
    skills = _disclosable_skills(activations)
    if not skills:
        return ""
    pairs = "; ".join(f"{label} ({focus})" for label, focus in skills)
    return (
        "Transparent skill disclosure (required):\n"
        f"- Active reasoning skills, in order of weight: {pairs}.\n"
        "- Open your answer with ONE short, natural sentence, in the user's language, "
        "that names the skill or skills you are using and briefly why "
        '(e.g. "Estou usando Architecture Analysis porque sua pergunta envolve '
        'dependências estruturais."). Name at most the top two skills.\n'
        "- Keep it conversational — never a bullet list, log, or list of internal labels.\n"
        "- Name only the cognitive skills above. Never expose retrieval mechanics, "
        "chunk names, files, vector scores or internal orchestration fields."
    )


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
hidden, but the *names* of the active reasoning skills may be disclosed to the
user as described below — this is an explainability feature, not a leak.

selection_mode: {override_state}
complexity: overall={complexity.overall}, scope={complexity.scope}, depth={complexity.depth}
ambiguity: score={ambiguity.score}, guidance={assumptions}

{_disclosure_directive(activations)}

Reasoning emphasis:
{chr(10).join(emphasis_lines)}

Composition rules:
- Combine the active cognitive lenses instead of treating them as isolated modes.
- Use the strongest lenses first, but allow secondary lenses to correct blind spots.
- Disclose which skills you are using per the directive above, then answer; do not
  keep narrating the skills throughout the response.
- Never expose weights, intensities, confidence numbers or retrieval mechanics.

{chr(10).join(lens_blocks)}
""".strip()
