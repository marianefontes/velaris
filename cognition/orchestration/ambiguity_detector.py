"""Detect ambiguity signals that should shape Beatrice's response depth."""

from dataclasses import dataclass, field


VAGUE_TERMS = {
    "melhorar", "improve", "bom", "better", "legal", "isso", "this",
    "coisa", "thing", "alguma", "some", "ideias", "ideas", "organizar",
    "reorganizar", "arrumar", "fix", "otimizar", "optimize",
}

CONFLICT_MARKERS = {
    "mas", "but", "porém", "porem", "however", "ao mesmo tempo",
    "at the same time", "sem quebrar", "without breaking",
}

MULTI_INTERPRETATION_MARKERS = {
    "ou", "or", "/", "talvez", "maybe", "não sei", "not sure",
}


@dataclass(frozen=True)
class AmbiguitySignals:
    score: float
    reasons: tuple[str, ...] = field(default_factory=tuple)
    interpretation_count: int = 1
    should_state_assumptions: bool = False


def detect_ambiguity(query: str) -> AmbiguitySignals:
    q = query.lower()
    reasons: list[str] = []
    score = 0.0

    if len(query.split()) < 6:
        score += 0.25
        reasons.append("short request")

    vague_hits = [term for term in VAGUE_TERMS if term in q]
    if vague_hits:
        score += min(0.35, len(vague_hits) * 0.08)
        reasons.append("vague goal language")

    if any(marker in q for marker in CONFLICT_MARKERS):
        score += 0.25
        reasons.append("competing constraints")

    interpretation_markers = sum(1 for marker in MULTI_INTERPRETATION_MARKERS if marker in q)
    if interpretation_markers:
        score += min(0.25, interpretation_markers * 0.1)
        reasons.append("multiple possible interpretations")

    interpretation_count = 1 + interpretation_markers + (1 if vague_hits else 0)
    score = min(1.0, round(score, 3))
    return AmbiguitySignals(
        score=score,
        reasons=tuple(reasons),
        interpretation_count=max(1, interpretation_count),
        should_state_assumptions=score >= 0.45,
    )
