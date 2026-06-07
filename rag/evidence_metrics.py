"""Deterministic evidence metrics for XAI engines.

The Explainability Audit and Knowledge Gap engines must report Evidence,
Coverage, Consistency and Confidence scores grounded in *actual* retrieval
results — never numbers invented by the LLM. This module derives those scores
from the chunks produced by ``rag.retrieval`` (which already expose
``similarity`` and ``weighted_score``) and renders a prompt block the engine
contract can quote verbatim.
"""

from statistics import pstdev
from typing import Any

from rag.context_builder import evidence_strength, semantic_source_label


def _mean(values: list[float]) -> float:
    return sum(values) / len(values) if values else 0.0


def compute_evidence_metrics(chunks: list[dict[str, Any]], *, top_k: int) -> dict[str, Any]:
    """Compute grounded XAI scores from retrieved chunks. Scores are 0..1.

    - evidence:    mean semantic similarity of retrieved records.
    - coverage:    how much of the requested depth was filled, blended with
                   how many distinct semantic areas were touched.
    - consistency: agreement among the evidence (1 - dispersion of similarity).
    - confidence:  weighted composite (evidence 0.45, coverage 0.25,
                   consistency 0.30).
    """
    similarities = [float(chunk.get("similarity", 0.0)) for chunk in chunks]
    n = len(chunks)

    if n == 0:
        return {
            "evidence": 0.0,
            "coverage": 0.0,
            "consistency": 0.0,
            "confidence": 0.0,
            "count": 0,
            "distinct_areas": 0,
            "top_similarity": 0.0,
            "areas": [],
        }

    evidence = _mean(similarities)
    top_similarity = max(similarities)

    areas: dict[str, int] = {}
    for chunk in chunks:
        label = semantic_source_label(chunk.get("page_type", ""))
        areas[label] = areas.get(label, 0) + 1
    distinct_areas = len(areas)

    depth_ratio = min(1.0, n / max(1, top_k))
    diversity = min(1.0, distinct_areas / 3.0)  # 3+ distinct areas == broad coverage
    coverage = round(0.6 * depth_ratio + 0.4 * diversity, 3)

    dispersion = pstdev(similarities) if n > 1 else 0.0
    consistency = round(max(0.0, 1.0 - 2.0 * dispersion), 3)

    confidence = round(0.45 * evidence + 0.25 * coverage + 0.30 * consistency, 3)

    return {
        "evidence": round(evidence, 3),
        "coverage": coverage,
        "consistency": consistency,
        "confidence": confidence,
        "count": n,
        "distinct_areas": distinct_areas,
        "top_similarity": round(top_similarity, 3),
        "areas": [
            {"area": area, "records": count, "share": round(count / n, 3)}
            for area, count in sorted(areas.items(), key=lambda item: item[1], reverse=True)
        ],
    }


def _pct(value: float) -> str:
    return f"{round(value * 100)}%"


def build_evidence_metrics_block(metrics: dict[str, Any]) -> str:
    """Render computed metrics as a prompt block the engine must quote, not invent."""
    if metrics.get("count", 0) == 0:
        return """
# Retrieval Evidence Metrics (computed — quote these, do not invent)

No semantic evidence was retrieved for this request. Report all scores as 0%,
declare the evidence base empty, and treat every conclusion as an assumption
requiring manual validation.
""".strip()

    area_rows = "\n".join(
        f"- {area['area']}: {area['records']} record(s) ({_pct(area['share'])})"
        for area in metrics["areas"]
    )

    return f"""
# Retrieval Evidence Metrics (computed — quote these, do not invent)

These scores are computed deterministically from the retrieved evidence. Use
them verbatim for the audit's score table. Do NOT fabricate or round differently.

- Evidence Score: {_pct(metrics['evidence'])} (mean semantic similarity, {metrics['count']} records, top {metrics['top_similarity']})
- Coverage Score: {_pct(metrics['coverage'])} ({metrics['distinct_areas']} distinct semantic area(s))
- Consistency Score: {_pct(metrics['consistency'])} (agreement across retrieved evidence)
- Confidence Score: {_pct(metrics['confidence'])} (weighted composite)

Semantic areas covered:
{area_rows}

If any score is below 60%, you MUST flag it and explain which evidence is missing.
""".strip()
