import json
from urllib.parse import urlparse

from playwright.sync_api import Route, sync_playwright


APP_BASE = "http://127.0.0.1:5173"


def run_payload() -> dict:
    item = {
        "id": "item-1",
        "run_id": "run-1",
        "case_id": "accessible-dialog-contract",
        "profile": "designer",
        "repetition": 1,
        "question": "Quais contratos de acessibilidade precisam ser verificados?",
        "category": "a11y",
        "convergence_mode": "converge",
        "status": "waiting_rate_limit",
        "answer_text": None,
        "intent": None,
        "cognitive_skills": [],
        "evidence_metrics": {},
        "duration_ms": None,
        "error": "Limite temporário da Groq. Nova tentativa em 42 segundo(s).",
        "error_category": "rate_limit",
        "retry_count": 1,
        "retry_after": "2026-06-06T23:59:00+00:00",
        "sources": [],
        "metrics": [],
        "review": None,
    }
    return {
        "id": "run-1",
        "case_set_id": "beatrice-core-v1",
        "dataset_version": "beatrice-core-v1",
        "dataset_fingerprint": "dataset-test",
        "version_label": "candidate-free-reliable",
        "profiles": ["designer"],
        "repetitions": 1,
        "status": "running",
        "total_items": 1,
        "completed_items": 0,
        "failed_items": 0,
        "model": "meta-llama/llama-4-scout-17b-16e-instruct",
        "prompt_fingerprint": "prompt-test",
        "aggregate": {
            "score": None,
            "metrics": {},
            "confidence_calibration": {
                "status": "insufficient-data",
                "ece": None,
                "reason": "Requires reviewed samples",
            },
        },
        "created_at": "2026-06-06T23:50:00+00:00",
        "started_at": "2026-06-06T23:50:00+00:00",
        "completed_at": None,
        "cancel_requested_at": None,
        "is_baseline": False,
        "approved_at": None,
        "origin": "manual",
        "schedule_date": None,
        "schedule_slot": None,
        "calibration_version_id": "source-defaults",
        "calibration_proposal_id": None,
        "calibration_snapshot": {},
        "control_run_id": None,
        "prompt_tokens": 0,
        "completion_tokens": 0,
        "progress": 0,
        "items": [item],
    }


def main() -> None:
    run = run_payload()
    snapshot = {
        "revision": 7,
        "generated_at": "2026-06-06T23:50:00+00:00",
        "run_count": 1,
        "completed_run_count": 0,
        "pending_reviews": 0,
        "unread_recommendations": 0,
        "recommendation_count": 0,
        "unread_notifications": 0,
        "latest": {key: value for key, value in run.items() if key != "items"},
        "latest_scheduled": None,
        "latest_manual": {key: value for key, value in run.items() if key != "items"},
        "baseline": None,
        "regressions": [],
        "runs": [{key: value for key, value in run.items() if key != "items"}],
        "automation": {
            "enabled": False,
            "paused": False,
            "pause_reason": None,
            "pause_until": None,
            "timezone": "Europe/Lisbon",
            "case_set_id": "beatrice-core-v1",
            "next_slot": None,
            "daily_estimated_calls": 56,
            "active_calibration_version_id": "source-defaults",
            "revision": 7,
        },
        "active_calibration": {
            "id": "source-defaults",
            "label": "Source defaults",
            "calibration": {},
            "origin": "source-defaults",
        },
        "candidates": [],
        "recommendations": [],
        "notifications": [],
        "latest_perspective_metrics": {},
    }

    def handle(route: Route) -> None:
        path = urlparse(route.request.url).path
        if path == "/api/laboratory/auth/verify":
            body = {"authenticated": True}
        elif path == "/api/laboratory/case-sets":
            body = {
                "case_sets": [{
                    "id": "beatrice-core-v1",
                    "version": "beatrice-core-v1",
                    "case_count": 1,
                    "fingerprint": "dataset-test",
                    "categories": {"a11y": 1},
                }]
            }
        elif path == "/api/laboratory/snapshot":
            body = snapshot
        elif path == "/api/laboratory/runs/run-1":
            body = run
        elif path == "/api/laboratory/revision":
            body = {"revision": 7}
        else:
            route.fulfill(status=404, content_type="application/json", body="{}")
            return
        route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps(body),
        )

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1000})
        page.add_init_script(
            "sessionStorage.setItem('aetheris.research.key', 'test-key')"
        )
        page.route("**/api/laboratory/**", handle)
        page.goto(f"{APP_BASE}/laboratory")
        page.wait_for_load_state("networkidle")

        page.get_by_text(
            "Aguardando o limite temporário da Groq liberar.",
            exact=True,
        ).wait_for()
        page.get_by_text("tentativa 2", exact=False).wait_for()
        assert page.get_by_text("Repetições", exact=True).count() == 0
        assert page.get_by_text("2 execuções por combinação", exact=True).count() == 0
        assert page.get_by_text("3 execuções por combinação", exact=True).count() == 0
        assert page.get_by_text("Aguardando resposta persistida.", exact=True).count() == 0
        assert page.get_by_text(
            "meta-llama/llama-4-scout-17b-16e-instruct",
            exact=False,
        ).count() == 1
        page.screenshot(path="/tmp/aetheris-laboratory-rate-limit.png", full_page=True)
        browser.close()

    print("Laboratory rate-limit UI checks passed.")


if __name__ == "__main__":
    main()
