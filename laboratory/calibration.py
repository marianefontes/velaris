from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from prompts.cognitive_profiles import COGNITIVE_PROFILES


CALIBRATION_FIELDS = ("technicality", "risk_sensitivity")
CALIBRATION_STEP = 0.05
MAX_DEFAULT_DRIFT = 0.15
MAX_TARGETED_PERSPECTIVES = 2

OBJECTIVE_METRICS = (
    "perspective_adherence",
    "perspective_signal",
    "observed_correctness",
    "source_coverage",
    "retrieval_precision",
    "abstention",
)


@dataclass(frozen=True)
class GuardrailCheck:
    id: str
    passed: bool
    observed: float | str | bool | None
    threshold: float | str | bool
    rationale: str

    def as_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "passed": self.passed,
            "observed": self.observed,
            "threshold": self.threshold,
            "rationale": self.rationale,
        }


def source_calibration() -> dict[str, dict[str, float]]:
    return {
        profile_id: {
            "technicality": round(profile.technicality_level, 3),
            "risk_sensitivity": round(profile.risk_sensitivity, 3),
        }
        for profile_id, profile in COGNITIVE_PROFILES.items()
    }


def validate_calibration(
    calibration: Any,
    *,
    defaults: dict[str, dict[str, float]] | None = None,
) -> dict[str, dict[str, float]]:
    if not isinstance(calibration, dict):
        raise ValueError("Calibration must be an object")

    source = defaults or source_calibration()
    unknown_profiles = sorted(set(calibration) - set(source))
    if unknown_profiles:
        raise ValueError(f"Unknown calibration profiles: {', '.join(unknown_profiles)}")

    result = {profile: dict(values) for profile, values in source.items()}
    for profile, values in calibration.items():
        if not isinstance(values, dict):
            raise ValueError(f"Calibration for {profile} must be an object")
        unknown_fields = sorted(set(values) - set(CALIBRATION_FIELDS))
        if unknown_fields:
            raise ValueError(
                f"Unsupported calibration fields for {profile}: {', '.join(unknown_fields)}"
            )
        for field, raw_value in values.items():
            if isinstance(raw_value, bool) or not isinstance(raw_value, (int, float)):
                raise ValueError(f"Calibration {profile}.{field} must be numeric")
            value = round(float(raw_value), 3)
            if value < 0 or value > 1:
                raise ValueError(f"Calibration {profile}.{field} must be between 0 and 1")
            if abs(value - source[profile][field]) > MAX_DEFAULT_DRIFT + 1e-9:
                raise ValueError(
                    f"Calibration {profile}.{field} exceeds the {MAX_DEFAULT_DRIFT:.2f} default drift"
                )
            result[profile][field] = value
    return result


def merge_profile_calibration(
    profile: str,
    active: dict[str, dict[str, float]] | None,
    explicit: dict[str, Any] | None,
) -> dict[str, Any] | None:
    default_profile = COGNITIVE_PROFILES.get(profile)
    if default_profile is None:
        return explicit or None

    merged: dict[str, Any] = {
        "technicality": default_profile.technicality_level,
        "risk_sensitivity": default_profile.risk_sensitivity,
        "_source": "lens-default",
    }
    active_values = (active or {}).get(profile, {})
    if active_values:
        for field in CALIBRATION_FIELDS:
            if field in active_values:
                merged[field] = active_values[field]
        merged["_source"] = "automatic-calibration"

    if explicit:
        if explicit.get("depth") in ("low", "medium", "high"):
            merged["depth"] = explicit["depth"]
        for field in CALIBRATION_FIELDS:
            value = explicit.get(field)
            if isinstance(value, (int, float)) and not isinstance(value, bool):
                merged[field] = max(0.0, min(1.0, float(value)))
        if any(field in explicit for field in ("depth", *CALIBRATION_FIELDS)):
            merged["_source"] = "user-calibrated"
    return merged


def perspective_objectives(
    metrics_by_perspective: dict[str, dict[str, float]],
) -> dict[str, float]:
    objectives: dict[str, float] = {}
    for profile, metrics in metrics_by_perspective.items():
        values = [
            float(metrics[name])
            for name in OBJECTIVE_METRICS
            if metrics.get(name) is not None
        ]
        if values:
            objectives[profile] = round(sum(values) / len(values), 3)
    return objectives


def build_proposal(
    *,
    active: dict[str, dict[str, float]],
    metrics_by_perspective: dict[str, dict[str, float]],
    prior_directions: dict[str, dict[str, int]] | None = None,
    experiment_index: int = 0,
) -> dict[str, Any]:
    defaults = source_calibration()
    validated_active = validate_calibration(active, defaults=defaults)
    objectives = perspective_objectives(metrics_by_perspective)
    ranked = sorted(objectives, key=lambda profile: (objectives[profile], profile))
    targets = ranked[:MAX_TARGETED_PERSPECTIVES]
    next_calibration = {profile: dict(values) for profile, values in validated_active.items()}
    changes: list[dict[str, Any]] = []

    for target_index, profile in enumerate(targets):
        field = CALIBRATION_FIELDS[(experiment_index + target_index) % len(CALIBRATION_FIELDS)]
        prior = (prior_directions or {}).get(profile, {}).get(field)
        direction = prior if prior in (-1, 1) else (1 if (experiment_index + target_index) % 2 == 0 else -1)
        current = next_calibration[profile][field]
        lower = max(0.0, defaults[profile][field] - MAX_DEFAULT_DRIFT)
        upper = min(1.0, defaults[profile][field] + MAX_DEFAULT_DRIFT)
        proposed = round(max(lower, min(upper, current + (direction * CALIBRATION_STEP))), 3)
        if proposed == current:
            direction *= -1
            proposed = round(max(lower, min(upper, current + (direction * CALIBRATION_STEP))), 3)
        if proposed == current:
            continue
        next_calibration[profile][field] = proposed
        changes.append({
            "profile": profile,
            "field": field,
            "from": current,
            "to": proposed,
            "direction": direction,
            "objective": objectives[profile],
            "reason": f"{profile} had objective score {objectives[profile]:.3f}",
        })

    return {
        "calibration": validate_calibration(next_calibration, defaults=defaults),
        "changes": changes,
        "targeted_perspectives": [change["profile"] for change in changes],
        "rationale": (
            "Bounded deterministic adjustment for the lowest-scoring perspectives"
            if changes
            else "No eligible bounded calibration change was available"
        ),
    }


def _metric(run: dict[str, Any], name: str) -> float | None:
    raw = run.get("metrics", {}).get(name)
    if isinstance(raw, dict):
        raw = raw.get("value")
    return float(raw) if isinstance(raw, (int, float)) else None


def _delta(current: dict[str, Any], control: dict[str, Any], name: str) -> float | None:
    current_value = _metric(current, name)
    control_value = _metric(control, name)
    if current_value is None or control_value is None:
        return None
    return round(current_value - control_value, 3)


def evaluate_guardrails(
    *,
    control: dict[str, Any],
    experiment: dict[str, Any],
    validation: dict[str, Any],
    proposal_matches: bool,
    proposal_valid: bool,
) -> dict[str, Any]:
    checks: list[GuardrailCheck] = []

    def add(
        check_id: str,
        passed: bool,
        observed: float | str | bool | None,
        threshold: float | str | bool,
        rationale: str,
    ) -> None:
        checks.append(GuardrailCheck(check_id, passed, observed, threshold, rationale))

    add(
        "same_proposal",
        proposal_matches,
        proposal_matches,
        True,
        "Candidate 2 and candidate 3 must use the same proposal",
    )
    add(
        "proposal_bounds",
        proposal_valid,
        proposal_valid,
        True,
        "All calibration changes must respect field, step and drift limits",
    )
    for label, run in (("candidate2", experiment), ("candidate3", validation)):
        status = run.get("status")
        failed = int(run.get("failed_items", 0) or 0)
        add(
            f"{label}_completed",
            status == "completed" and failed == 0,
            f"{status}:{failed}",
            "completed:0",
            f"{label} must complete without failed items",
        )

    experiment_objective = float(experiment.get("targeted_objective_delta", 0.0) or 0.0)
    validation_objective = float(validation.get("targeted_objective_delta", 0.0) or 0.0)
    add(
        "candidate2_objective_improves",
        experiment_objective > 0,
        experiment_objective,
        "> 0",
        "Candidate 2 targeted objective must improve over candidate 1",
    )
    add(
        "candidate3_objective_minimum",
        validation_objective >= 0.02,
        validation_objective,
        0.02,
        "Candidate 3 targeted objective must improve by at least 0.02",
    )
    add(
        "consistent_direction",
        experiment_objective > 0 and validation_objective > 0,
        f"{experiment_objective:.3f}/{validation_objective:.3f}",
        "both positive",
        "Candidate 2 and candidate 3 improvements must agree",
    )

    thresholds = {
        "observed_correctness": -0.01,
        "required_fact_coverage": 0.0,
        "forbidden_claim_avoidance": 0.0,
        "source_coverage": -0.01,
        "abstention": 0.0,
        "factual_convergence": -0.02,
        "principled_divergence": -0.02,
    }
    for metric_name, minimum in thresholds.items():
        delta = _delta(validation, control, metric_name)
        passed = delta is not None and delta >= minimum
        add(
            f"{metric_name}_delta",
            passed,
            delta,
            minimum,
            f"{metric_name} must not regress beyond {minimum:+.2f}",
        )

    perspective_deltas = validation.get("perspective_objective_deltas", {})
    worst_perspective = (
        min((float(value) for value in perspective_deltas.values()), default=None)
        if isinstance(perspective_deltas, dict)
        else None
    )
    add(
        "individual_perspective_floor",
        worst_perspective is not None and worst_perspective >= -0.03,
        worst_perspective,
        -0.03,
        "No individual perspective may regress by more than 0.03",
    )

    serialized = [check.as_dict() for check in checks]
    return {
        "passed": all(check["passed"] for check in serialized),
        "checks": serialized,
        "failed": [check["id"] for check in serialized if not check["passed"]],
    }
