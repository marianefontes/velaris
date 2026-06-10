import asyncio
import sqlite3
import sys
import tempfile
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from laboratory.automation import LaboratoryAutomation
from laboratory.calibration import (
    build_proposal,
    evaluate_guardrails,
    merge_profile_calibration,
    source_calibration,
    validate_calibration,
)
from laboratory.runner import LaboratoryRunner
from laboratory.store import LaboratoryStore


def test_calibration_domain() -> None:
    defaults = source_calibration()
    proposal = build_proposal(
        active=defaults,
        metrics_by_perspective={
            "designer": {"perspective_signal": 0.2, "observed_correctness": 0.8},
            "dev": {"perspective_signal": 0.4, "observed_correctness": 0.8},
            "qa": {"perspective_signal": 0.9, "observed_correctness": 0.9},
        },
        experiment_index=0,
    )
    assert len(proposal["changes"]) == 2
    assert {change["profile"] for change in proposal["changes"]} == {"designer", "dev"}
    assert all(abs(change["to"] - change["from"]) <= 0.05 + 1e-9 for change in proposal["changes"])
    validate_calibration(proposal["calibration"])

    merged = merge_profile_calibration(
        "designer",
        proposal["calibration"],
        {"technicality": 0.77, "depth": "high"},
    )
    assert merged
    assert merged["technicality"] == 0.77
    assert merged["depth"] == "high"
    assert merged["_source"] == "user-calibrated"

    try:
        validate_calibration({
            **defaults,
            "designer": {**defaults["designer"], "technicality": 0.9},
        })
    except ValueError:
        pass
    else:
        raise AssertionError("Excessive default drift was accepted")


def test_guardrails() -> None:
    metrics = {
        "observed_correctness": {"value": 0.8},
        "required_fact_coverage": {"value": 0.8},
        "forbidden_claim_avoidance": {"value": 1.0},
        "source_coverage": {"value": 0.8},
        "abstention": {"value": 1.0},
        "factual_convergence": {"value": 0.7},
        "principled_divergence": {"value": 0.7},
    }
    control = {
        "status": "completed",
        "failed_items": 0,
        "metrics": metrics,
        "targeted_objective_delta": 0.0,
        "perspective_objective_deltas": {"designer": 0.0},
    }
    experiment = {
        **control,
        "targeted_objective_delta": 0.02,
        "perspective_objective_deltas": {"designer": 0.02},
    }
    validation = {
        **control,
        "metrics": {
            **metrics,
            "observed_correctness": {"value": 0.81},
            "source_coverage": {"value": 0.81},
        },
        "targeted_objective_delta": 0.03,
        "perspective_objective_deltas": {"designer": 0.03},
    }
    passed = evaluate_guardrails(
        control=control,
        experiment=experiment,
        validation=validation,
        proposal_matches=True,
        proposal_valid=True,
    )
    assert passed["passed"], passed

    failed = evaluate_guardrails(
        control=control,
        experiment=experiment,
        validation={
            **validation,
            "metrics": {
                **validation["metrics"],
                "forbidden_claim_avoidance": {"value": 0.5},
            },
        },
        proposal_matches=True,
        proposal_valid=True,
    )
    assert not failed["passed"]
    assert "forbidden_claim_avoidance_delta" in failed["failed"]


def test_store_migration() -> None:
    with tempfile.TemporaryDirectory() as directory:
        path = Path(directory) / "legacy.sqlite3"
        with sqlite3.connect(path) as connection:
            connection.execute(
                """
                CREATE TABLE laboratory_runs (
                    id TEXT PRIMARY KEY,
                    case_set_id TEXT NOT NULL,
                    dataset_version TEXT NOT NULL,
                    dataset_fingerprint TEXT NOT NULL,
                    version_label TEXT NOT NULL,
                    profiles_json TEXT NOT NULL,
                    repetitions INTEGER NOT NULL,
                    status TEXT NOT NULL,
                    total_items INTEGER NOT NULL,
                    completed_items INTEGER NOT NULL DEFAULT 0,
                    failed_items INTEGER NOT NULL DEFAULT 0,
                    model TEXT NOT NULL,
                    prompt_fingerprint TEXT NOT NULL,
                    aggregate_json TEXT NOT NULL DEFAULT '{}',
                    created_at TEXT NOT NULL,
                    started_at TEXT,
                    completed_at TEXT,
                    cancel_requested_at TEXT,
                    is_baseline INTEGER NOT NULL DEFAULT 0,
                    approved_at TEXT
                )
                """
            )
        store = LaboratoryStore(path)
        store.initialize()
        store.initialize()
        with sqlite3.connect(path) as connection:
            columns = {row[1] for row in connection.execute("PRAGMA table_info(laboratory_runs)")}
            assert "origin" in columns
            assert "calibration_snapshot_json" in columns
            assert "prompt_tokens" in columns
        assert store.active_calibration()["id"] == "source-defaults"


async def wait_for_runner(runner: LaboratoryRunner) -> None:
    for _ in range(1000):
        if not runner._tasks:
            return
        await asyncio.sleep(0.01)
    raise AssertionError("Laboratory runner did not finish")


def test_daily_funnel() -> None:
    async def scenario() -> None:
        with tempfile.TemporaryDirectory() as directory:
            store = LaboratoryStore(Path(directory) / "automation.sqlite3")
            store.initialize()

            async def generate(item: dict) -> dict:
                profile_terms = {
                    "dev": "contrato",
                    "designer": "hierarquia",
                    "product_designer": "usabilidade validacao",
                    "qa": "teste",
                    "tech_writer": "terminologia",
                    "a11y": "foco teclado",
                    "maintainer": "manutencao acoplamento",
                    "design_system_manager": "governanca roadmap",
                }
                return {
                    "answer_text": (
                        "Recomendação com token, implementação, evidência, foco, "
                        "contexto e trade-off. "
                        + profile_terms[item["profile"]]
                    ),
                    "intent": "component_guidance",
                    "cognitive_skills": [],
                    "sources": [{
                        "title": "Aetheris",
                        "source": "Component Registry",
                        "page_type": "component",
                        "similarity": 0.8,
                        "retrieval_weight": 1.0,
                        "weighted_score": 0.8,
                    }],
                    "evidence_metrics": {"confidence": 0.8},
                    "prompt_tokens": 10,
                    "completion_tokens": 20,
                }

            runner = LaboratoryRunner(store, generate)
            current = {"value": datetime(2026, 6, 7, 0, 0, tzinfo=ZoneInfo("Europe/Lisbon"))}
            automation = LaboratoryAutomation(
                store=store,
                runner=runner,
                prompt_fingerprint=lambda: "prompt-test",
                model="fake-model",
                credentials_ready=lambda: True,
                enabled=True,
                timezone_name="Europe/Lisbon",
                clock=lambda: current["value"],
                poll_seconds=999,
            )
            runner.on_finalized = automation.on_run_finalized

            first = await automation.tick()
            assert first and first["version_label"] == "candidate1-2026-06-07"
            assert first["repetitions"] == 1
            await wait_for_runner(runner)
            assert store.proposal_for_date("2026-06-07")
            assert await automation.tick() is None

            current["value"] = datetime(2026, 6, 7, 8, 0, tzinfo=ZoneInfo("Europe/Lisbon"))
            second = await automation.tick()
            assert second and second["version_label"] == "candidate2-2026-06-07"
            assert second["repetitions"] == 1
            await wait_for_runner(runner)

            current["value"] = datetime(2026, 6, 7, 16, 0, tzinfo=ZoneInfo("Europe/Lisbon"))
            third = await automation.tick()
            assert third and third["version_label"] == "candidate3-2026-06-07"
            assert third["repetitions"] == 1
            assert third["calibration_version_id"] == second["calibration_version_id"]
            await wait_for_runner(runner)

            slots = store.list_schedule_slots("2026-06-07")
            assert [slot["status"] for slot in slots] == ["completed", "completed", "completed"]
            assert store.snapshot(schedule_date="2026-06-07")["revision"] > 0
            assert store.list_recommendations()
            assert store.current_revision() == store.snapshot()["revision"]

    asyncio.run(scenario())


def test_post_promotion_rollback() -> None:
    metrics = {
        name: {"value": 0.8}
        for name in (
            "observed_correctness",
            "required_fact_coverage",
            "forbidden_claim_avoidance",
            "source_coverage",
            "abstention",
            "factual_convergence",
            "principled_divergence",
        )
    }

    class RollbackStore:
        def __init__(self) -> None:
            self.rolled_back = False
            self.proposal_status = ""
            self.notification = {}

        def active_calibration(self) -> dict:
            return {
                "id": "promoted-version",
                "origin": "scheduled-proposal",
                "proposal_id": "proposal-1",
            }

        def get_proposal(self, proposal_id: str) -> dict:
            assert proposal_id == "proposal-1"
            return {
                "id": proposal_id,
                "status": "promoted",
                "base_version_id": "source-defaults",
                "control_run_id": "control-run",
                "targeted_perspectives": ["designer"],
                "changes": [{"profile": "designer", "field": "technicality"}],
                "guardrails": {"passed": True},
            }

        def get_run(self, run_id: str, include_items: bool = False) -> dict:
            assert run_id == "control-run"
            return {
                "id": run_id,
                "status": "completed",
                "failed_items": 0,
                "aggregate": {"metrics": metrics},
            }

        def metrics_by_perspective(self, run_id: str) -> dict:
            score = 0.9 if run_id == "control-run" else 0.4
            return {"designer": {"perspective_signal": score}}

        def rollback_calibration(self, **kwargs) -> dict:
            assert kwargs["target_version_id"] == "source-defaults"
            self.rolled_back = True
            return {"id": "source-defaults", "label": "Source defaults"}

        def update_proposal(self, proposal_id: str, **kwargs) -> bool:
            assert proposal_id == "proposal-1"
            self.proposal_status = kwargs["status"]
            return True

        def create_recommendation(self, **kwargs) -> dict:
            return {"id": "recommendation-1", **kwargs}

        def create_notification(self, **kwargs) -> dict:
            self.notification = kwargs
            return kwargs

    store = RollbackStore()
    automation = LaboratoryAutomation(
        store=store,  # type: ignore[arg-type]
        runner=object(),  # type: ignore[arg-type]
        prompt_fingerprint=lambda: "prompt-test",
        model="fake-model",
        credentials_ready=lambda: True,
    )
    rolled_back = automation._rollback_unhealthy_promotion({
        "id": "health-run",
        "version_label": "candidate1-2026-06-08",
        "status": "completed",
        "failed_items": 0,
        "aggregate": {
            "metrics": {
                **metrics,
                "forbidden_claim_avoidance": {"value": 0.6},
            },
        },
    })
    assert rolled_back is True
    assert store.rolled_back is True
    assert store.proposal_status == "reverted"
    assert store.notification["event_type"] == "calibration_rolled_back"


if __name__ == "__main__":
    test_calibration_domain()
    test_guardrails()
    test_store_migration()
    test_daily_funnel()
    test_post_promotion_rollback()
    print("Laboratory automation checks passed.")
