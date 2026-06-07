from __future__ import annotations

import re
import unicodedata
from collections import defaultdict
from typing import Any, Iterable

from .cases import EvaluationCase


ABSTENTION_TERMS = (
    "nao ha evidencia",
    "nao encontrei evidencia",
    "o corpus oficial nao define",
    "o corpus oficial do aetheris nao define",
    "nao posso afirmar",
    "evidencia insuficiente",
    "fora do escopo",
    "no official evidence",
    "insufficient evidence",
    "the official corpus does not define",
    "out of scope",
)


def normalize_text(value: str) -> str:
    decomposed = unicodedata.normalize("NFKD", value)
    ascii_text = "".join(char for char in decomposed if not unicodedata.combining(char))
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9]+", " ", ascii_text.lower())).strip()


def text_tokens(value: str) -> set[str]:
    return {token for token in normalize_text(value).split() if len(token) > 2}


def phrase_present(text: str, phrases: Iterable[str]) -> bool:
    normalized = normalize_text(text)
    return any(normalize_text(phrase) in normalized for phrase in phrases)


def lexical_similarity(left: str, right: str) -> float:
    left_tokens = text_tokens(left)
    right_tokens = text_tokens(right)
    if not left_tokens and not right_tokens:
        return 1.0
    if not left_tokens or not right_tokens:
        return 0.0
    return round(len(left_tokens & right_tokens) / len(left_tokens | right_tokens), 3)


def _group_score(answer: str, groups: Iterable[dict[str, Any]], *, invert: bool = False) -> tuple[float | None, list[str]]:
    groups = list(groups)
    if not groups:
        return None, []
    matched = [
        str(group["id"])
        for group in groups
        if phrase_present(answer, group.get("any_of", []))
    ]
    ratio = len(matched) / len(groups)
    return (round(1.0 - ratio, 3) if invert else round(ratio, 3)), matched


def score_answer(
    case: EvaluationCase,
    *,
    profile: str,
    answer: str,
    sources: list[dict[str, Any]],
    evidence_confidence: float | None,
) -> dict[str, dict[str, Any]]:
    required_score, required_matches = _group_score(answer, case.required_facts)
    forbidden_score, forbidden_matches = _group_score(answer, case.forbidden_claims, invert=True)

    actual_source_areas = {
        str(source.get("page_type", ""))
        for source in sources
        if source.get("page_type")
    }
    expected_sources = set(case.expected_source_areas)
    source_precision = (
        round(len(actual_source_areas & expected_sources) / len(actual_source_areas), 3)
        if actual_source_areas
        else (1.0 if not expected_sources else 0.0)
    )
    source_coverage = (
        round(len(actual_source_areas & expected_sources) / len(expected_sources), 3)
        if expected_sources
        else (1.0 if not actual_source_areas else 0.5)
    )

    abstained = phrase_present(answer, ABSTENTION_TERMS)
    abstention_score = 1.0 if abstained == case.abstention_expected else 0.0

    expectation = case.perspective_expectations.get(profile, {})
    perspective_terms = expectation.get("any_of", [])
    perspective_score = (
        1.0 if phrase_present(answer, perspective_terms) else 0.0
        if perspective_terms
        else None
    )

    structure_hits = [
        term for term in case.structure_terms if phrase_present(answer, [term])
    ]
    structure_score = (
        round(len(structure_hits) / len(case.structure_terms), 3)
        if case.structure_terms
        else (1.0 if len(text_tokens(answer)) >= 20 else 0.0)
    )

    correctness_parts = [
        score
        for score in (required_score, forbidden_score, abstention_score)
        if score is not None
    ]
    correctness = round(sum(correctness_parts) / len(correctness_parts), 3) if correctness_parts else None

    return {
        "required_fact_coverage": {
            "value": required_score,
            "status": "measured" if required_score is not None else "not-applicable",
            "rationale": f"Matched required fact groups: {required_matches or 'none'}",
        },
        "forbidden_claim_avoidance": {
            "value": forbidden_score,
            "status": "measured" if forbidden_score is not None else "not-applicable",
            "rationale": f"Forbidden claim groups present: {forbidden_matches or 'none'}",
        },
        "retrieval_precision": {
            "value": source_precision,
            "status": "measured",
            "rationale": f"Expected areas {sorted(expected_sources)}; received {sorted(actual_source_areas)}",
        },
        "source_coverage": {
            "value": source_coverage,
            "status": "measured",
            "rationale": f"Covered {len(actual_source_areas & expected_sources)} of {len(expected_sources)} expected areas",
        },
        "abstention": {
            "value": abstention_score,
            "status": "measured",
            "rationale": f"Expected abstention={case.abstention_expected}; observed={abstained}",
        },
        "perspective_signal": {
            "value": perspective_score,
            "status": "measured" if perspective_score is not None else "pending-review",
            "rationale": (
                f"Expected profile signals: {perspective_terms}"
                if perspective_terms
                else "Perspective adherence requires human review"
            ),
        },
        "structural_adherence": {
            "value": structure_score,
            "status": "measured",
            "rationale": f"Structure signals present: {structure_hits or 'minimum response length only'}",
        },
        "observed_correctness": {
            "value": correctness,
            "status": "provisional" if correctness is not None else "pending-review",
            "rationale": "Deterministic composite; human review can replace this provisional score",
        },
        "evidence_confidence": {
            "value": evidence_confidence,
            "status": "measured" if evidence_confidence is not None else "insufficient-data",
            "rationale": "Retrieval evidence strength, not answer correctness",
        },
        "factual_correctness": {
            "value": None,
            "status": "pending-review",
            "rationale": "Requires human review in the first laboratory release",
        },
        "source_fidelity": {
            "value": None,
            "status": "pending-review",
            "rationale": "Requires claim-level human review in the first laboratory release",
        },
        "usefulness": {
            "value": None,
            "status": "pending-review",
            "rationale": "Requires human review in the first laboratory release",
        },
    }


def relational_scores(items: list[dict[str, Any]], cases: dict[str, EvaluationCase]) -> list[dict[str, Any]]:
    scores: list[dict[str, Any]] = []
    by_case_profile: dict[tuple[str, str], list[dict[str, Any]]] = defaultdict(list)
    by_case: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for item in items:
        by_case_profile[(item["case_id"], item["profile"])].append(item)
        by_case[item["case_id"]].append(item)

    for (case_id, profile), group in by_case_profile.items():
        if len(group) < 2:
            continue
        similarities = [
            lexical_similarity(group[left]["answer_text"], group[right]["answer_text"])
            for left in range(len(group))
            for right in range(left + 1, len(group))
        ]
        scores.append({
            "case_id": case_id,
            "profile": profile,
            "metric_name": "repeat_stability",
            "value": round(sum(similarities) / len(similarities), 3),
            "status": "measured",
            "rationale": f"{len(similarities)} pairwise repetition comparison(s)",
        })

    for case_id, group in by_case.items():
        profiles: dict[str, str] = {}
        for item in group:
            profiles.setdefault(item["profile"], item["answer_text"])
        if len(profiles) < 2:
            continue
        answers = list(profiles.items())
        similarities = [
            lexical_similarity(answers[left][1], answers[right][1])
            for left in range(len(answers))
            for right in range(left + 1, len(answers))
        ]
        mean_similarity = round(sum(similarities) / len(similarities), 3)
        case = cases[case_id]
        if case.convergence == "diverge":
            metric_name = "principled_divergence"
            value = round(1.0 - mean_similarity, 3)
            status = "provisional"
            rationale = "Lexical divergence detected; human review must confirm it is principled"
        else:
            metric_name = "factual_convergence"
            value = mean_similarity
            status = "measured"
            rationale = f"Mean similarity across {len(profiles)} perspectives"
        scores.append({
            "case_id": case_id,
            "profile": None,
            "metric_name": metric_name,
            "value": value,
            "status": status,
            "rationale": rationale,
        })
    return scores
