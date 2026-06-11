"""Reliability gates — required checks before shipping new AI capabilities."""

from __future__ import annotations

from typing import Any

from agent.intelligence_lab import run_adversarial_suite, run_catalog_sanity_checks
from agent.knowledge_health import MIN_COMPLETE_COVERAGE, build_knowledge_health_dashboard

MIN_KNOWLEDGE_COVERAGE = MIN_COMPLETE_COVERAGE
MIN_EVIDENCE_RELIABILITY = 0.65
MIN_HALLUCINATION_RESISTANCE = 0.75
MIN_ADVERSARIAL_PASS_RATE = 0.85


def _gate_result(*, passed: bool, message: str, details: dict[str, Any]) -> dict[str, Any]:
    return {
        "passed": passed,
        "message": message,
        "details": details,
    }


def run_reliability_gates(collection: Any | None = None) -> dict[str, Any]:
    dashboard = build_knowledge_health_dashboard(collection)
    adversarial = run_adversarial_suite()
    catalog_sanity = run_catalog_sanity_checks()
    scores = dashboard["intelligence_scores"]

    knowledge_gate = _gate_result(
        passed=scores["knowledge_coverage"] / 100.0 >= MIN_KNOWLEDGE_COVERAGE,
        message=(
            f"Knowledge coverage {scores['knowledge_coverage']}% "
            f"(minimum {int(MIN_KNOWLEDGE_COVERAGE * 100)}%)"
        ),
        details={
            "score": scores["knowledge_coverage"],
            "minimum": int(MIN_KNOWLEDGE_COVERAGE * 100),
            "gaps_total": dashboard["knowledge_gaps_total"],
            "critical_entity_count": dashboard["critical_entity_count"],
            "complete_entity_count": dashboard["complete_entity_count"],
        },
    )

    hallucination_gate = _gate_result(
        passed=adversarial["pass_rate_percent"] / 100.0 >= MIN_ADVERSARIAL_PASS_RATE,
        message=(
            f"Adversarial pass rate {adversarial['pass_rate_percent']}% "
            f"(minimum {int(MIN_ADVERSARIAL_PASS_RATE * 100)}%)"
        ),
        details={
            "pass_rate_percent": adversarial["pass_rate_percent"],
            "minimum": int(MIN_ADVERSARIAL_PASS_RATE * 100),
            "failed_cases": [
                result["id"]
                for result in adversarial["results"]
                if not result["passed"]
            ],
        },
    )

    evidence_gate = _gate_result(
        passed=scores["evidence_reliability"] / 100.0 >= MIN_EVIDENCE_RELIABILITY,
        message=(
            f"Evidence reliability {scores['evidence_reliability']}% "
            f"(minimum {int(MIN_EVIDENCE_RELIABILITY * 100)}%)"
        ),
        details={
            "score": scores["evidence_reliability"],
            "minimum": int(MIN_EVIDENCE_RELIABILITY * 100),
            "distribution": dashboard["evidence_health"]["percentages"],
        },
    )

    entity_gate = _gate_result(
        passed=catalog_sanity["passed"],
        message=(
            "Entity validation checks passed"
            if catalog_sanity["passed"]
            else "Entity validation checks failed"
        ),
        details=catalog_sanity["checks"],
    )

    gates = {
        "knowledge_coverage_check": knowledge_gate,
        "hallucination_check": hallucination_gate,
        "evidence_integrity_check": evidence_gate,
        "entity_validation_check": entity_gate,
    }

    return {
        "passed": all(gate["passed"] for gate in gates.values()),
        "hallucination_resistance_score": scores["hallucination_resistance"],
        "minimum_hallucination_resistance": int(MIN_HALLUCINATION_RESISTANCE * 100),
        "gates": gates,
        "intelligence_scores": scores,
    }
