import asyncio
import tempfile
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from laboratory.cases import load_case_set
from laboratory.metrics import lexical_similarity, relational_scores, score_answer
from laboratory.runner import LaboratoryRunner, RateLimitError
from laboratory.store import LaboratoryStore


def test_case_set() -> None:
    case_set = load_case_set("beatrice-core-v1")
    assert len(case_set.cases) >= 8
    assert len({case.id for case in case_set.cases}) == len(case_set.cases)
    assert case_set.fingerprint


def test_metrics() -> None:
    case = next(
        case for case in load_case_set("beatrice-core-v1").cases
        if case.id == "outside-corpus-tax-policy"
    )
    metrics = score_answer(
        case,
        profile="general",
        answer="O corpus oficial do Aetheris não define essa política fiscal.",
        sources=[],
        evidence_confidence=0.0,
    )
    assert metrics["abstention"]["value"] == 1.0
    assert metrics["forbidden_claim_avoidance"]["value"] == 1.0
    assert metrics["evidence_confidence"]["value"] == 0.0
    assert lexical_similarity("Modal com foco", "Modal devolve foco") > 0


def test_store_lifecycle() -> None:
    case_set = load_case_set("beatrice-core-v1")
    with tempfile.TemporaryDirectory() as directory:
        store = LaboratoryStore(Path(directory) / "laboratory.sqlite3")
        store.initialize()
        run = store.create_run(
            case_set=case_set,
            version_label="test-candidate",
            profiles=["designer", "dev"],
            repetitions=1,
            model="test-model",
            prompt_fingerprint="prompt-test",
        )
        assert run["status"] == "queued"
        assert run["total_items"] == len(case_set.cases) * 2
        store.start_run(run["id"])
        item = store.next_queued_item(run["id"])
        assert item and item["status"] == "running"
        store.complete_item(
            item["id"],
            answer_text="Resposta com token, implementação e recomendação.",
            intent="token_lookup",
            cognitive_skills=[],
            evidence_metrics={"confidence": 0.8},
            sources=[{
                "title": "Tokens",
                "source": "Token System",
                "page_type": "token",
                "similarity": 0.8,
                "retrieval_weight": 1.0,
                "weighted_score": 0.8,
            }],
            metrics={
                "observed_correctness": {
                    "value": 0.75,
                    "status": "provisional",
                    "rationale": "test",
                },
            },
            duration_ms=25,
        )
        detail = store.get_run(run["id"])
        assert detail and detail["completed_items"] == 1
        assert detail["items"][0]["sources"]
        assert store.request_cancel(run["id"])
        finalized = store.finalize_run(run["id"])
        assert finalized and finalized["status"] == "cancelled"


def test_relational_metrics() -> None:
    case_set = load_case_set("beatrice-core-v1")
    cases = {case.id: case for case in case_set.cases}
    items = [
        {
            "case_id": "destructive-confirmation",
            "profile": "designer",
            "answer_text": "Modal prioriza foco e hierarquia.",
        },
        {
            "case_id": "destructive-confirmation",
            "profile": "designer",
            "answer_text": "Modal preserva foco e reduz competição visual.",
        },
        {
            "case_id": "destructive-confirmation",
            "profile": "dev",
            "answer_text": "Use o contrato com menor custo de estado e migração.",
        },
    ]
    scores = relational_scores(items, cases)
    assert any(score["metric_name"] == "repeat_stability" for score in scores)
    assert any(score["metric_name"] == "principled_divergence" for score in scores)


def test_runner() -> None:
    async def scenario() -> None:
        case_set = load_case_set("beatrice-core-v1")
        with tempfile.TemporaryDirectory() as directory:
            store = LaboratoryStore(Path(directory) / "runner.sqlite3")
            store.initialize()
            run = store.create_run(
                case_set=case_set,
                version_label="runner-test",
                profiles=["designer", "dev"],
                repetitions=2,
                model="fake-model",
                prompt_fingerprint="fake-prompt",
            )

            async def generate(item: dict) -> dict:
                return {
                    "answer_text": (
                        f"Recomendação para {item['profile']}: preservar foco, contexto, "
                        "evidência, contrato, teste, governança e implementação."
                    ),
                    "intent": "general",
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
                }

            runner = LaboratoryRunner(store, generate)
            await runner.process(run["id"])
            completed = store.get_run(run["id"])
            assert completed and completed["status"] == "completed"
            assert completed["completed_items"] == completed["total_items"]
            metrics = completed["aggregate"]["metrics"]
            assert "repeat_stability" in metrics
            assert "principled_divergence" in metrics
            assert "intent_match" in metrics
            for item in completed["items"][:5]:
                assert store.save_review(
                    item["id"],
                    reviewer="Test Reviewer",
                    scores={"factual_correctness": 1.0},
                    notes="Deterministic calibration test",
                )
            reviewed = store.get_run(run["id"])
            assert reviewed
            calibration = reviewed["aggregate"]["confidence_calibration"]
            assert calibration["status"] == "measured"
            assert calibration["samples"] == 5

    asyncio.run(scenario())


def test_runner_retries_rate_limit() -> None:
    async def scenario() -> None:
        case_set = load_case_set("beatrice-core-v1")
        with tempfile.TemporaryDirectory() as directory:
            store = LaboratoryStore(Path(directory) / "retry.sqlite3")
            store.initialize()
            run = store.create_run(
                case_set=case_set,
                version_label="retry-test",
                profiles=["designer"],
                repetitions=1,
                model="fake-model",
                prompt_fingerprint="fake-prompt",
            )
            attempts: dict[str, int] = {}

            async def generate(item: dict) -> dict:
                attempts[item["id"]] = attempts.get(item["id"], 0) + 1
                if attempts[item["id"]] == 1:
                    raise RateLimitError(
                        "Groq rate limit reached",
                        retry_after_seconds=0,
                    )
                return {
                    "answer_text": (
                        "Recomendação com foco, contexto, evidência, contrato, "
                        "implementação, teste e governança."
                    ),
                    "intent": "general",
                    "cognitive_skills": [],
                    "sources": [],
                    "evidence_metrics": {"confidence": 0.8},
                }

            runner = LaboratoryRunner(
                store,
                generate,
                request_interval_seconds=0,
                max_rate_limit_retries=2,
            )
            await runner.process(run["id"])
            completed = store.get_run(run["id"])
            assert completed and completed["status"] == "completed"
            assert completed["failed_items"] == 0
            assert all(item["retry_count"] == 1 for item in completed["items"])
            assert all(item["retry_after"] is None for item in completed["items"])
            assert all(count == 2 for count in attempts.values())

    asyncio.run(scenario())


if __name__ == "__main__":
    test_case_set()
    test_metrics()
    test_store_lifecycle()
    test_relational_metrics()
    test_runner()
    test_runner_retries_rate_limit()
    print("Laboratory core checks passed.")
