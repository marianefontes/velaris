from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from laboratory.cases import CaseSet, EvaluationCase
from laboratory.store import LaboratoryStore


class CompareRunsTests(unittest.TestCase):
    def setUp(self) -> None:
        self.tempdir = tempfile.TemporaryDirectory()
        self.store = LaboratoryStore(Path(self.tempdir.name) / "lab.sqlite3")
        self.store.initialize()
        self.case_set = CaseSet(
            id="beatrice-core-v1",
            version="1.0.0",
            path=Path("evals/cases/beatrice-core-v1.jsonl"),
            fingerprint="abc123",
            cases=(
                EvaluationCase(
                    id="case-1",
                    version="1.0.0",
                    question="When should I use Skeleton Loader?",
                    category="factual",
                    convergence="converge",
                    expected_intent="component_guidance",
                    expected_source_areas=("component",),
                    required_facts=(),
                    forbidden_claims=(),
                    abstention_expected=False,
                    perspective_expectations={},
                    structure_terms=(),
                ),
            ),
        )

    def tearDown(self) -> None:
        self.tempdir.cleanup()

    def _seed_completed_run(self, *, version_label: str, retrieval_mode: str, metrics: dict[str, float]) -> str:
        run = self.store.create_run(
            case_set=self.case_set,
            version_label=version_label,
            profiles=["dev"],
            repetitions=1,
            model="test-model",
            prompt_fingerprint="fp-test",
            retrieval_snapshot={"retrieval_mode": retrieval_mode},
            comparison_group_id="group-1",
        )
        item = self.store.next_queued_item(run["id"])
        assert item is not None
        self.store.complete_item(
            item["id"],
            answer_text="answer",
            intent="component_guidance",
            cognitive_skills=[],
            evidence_metrics={"confidence": metrics.get("evidence_confidence", 0.2)},
            audit_metadata={},
            sources=[],
            metrics={
                name: {
                    "value": value,
                    "status": "measured",
                    "rationale": "test",
                    "evaluator_version": "test",
                }
                for name, value in metrics.items()
            },
            duration_ms=10,
            prompt_tokens=1,
            completion_tokens=1,
        )
        self.store.finalize_run(run["id"])
        return run["id"]

    def test_compare_runs_reports_metric_deltas(self) -> None:
        baseline_id = self._seed_completed_run(
            version_label="candidate-dense",
            retrieval_mode="dense",
            metrics={
                "retrieval_precision": 0.4,
                "source_coverage": 0.2,
                "evidence_confidence": 0.25,
            },
        )
        candidate_id = self._seed_completed_run(
            version_label="candidate-hybrid",
            retrieval_mode="hybrid",
            metrics={
                "retrieval_precision": 0.47,
                "source_coverage": 0.28,
                "evidence_confidence": 0.31,
            },
        )

        comparison = self.store.compare_runs(baseline_id, candidate_id)

        self.assertTrue(comparison["compatible"])
        self.assertEqual(comparison["metrics"]["retrieval_precision"]["baseline"], 0.4)
        self.assertEqual(comparison["metrics"]["retrieval_precision"]["candidate"], 0.47)
        self.assertEqual(comparison["metrics"]["retrieval_precision"]["delta"], 0.07)
        self.assertEqual(comparison["baseline"]["retrieval_snapshot"]["retrieval_mode"], "dense")
        self.assertEqual(comparison["candidate"]["retrieval_snapshot"]["retrieval_mode"], "hybrid")


if __name__ == "__main__":
    unittest.main()
