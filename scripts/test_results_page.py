import json
import os
import urllib.request

from playwright.sync_api import sync_playwright


API_BASE = os.environ.get("STUDY_TEST_API_BASE", "http://127.0.0.1:3334/api")
APP_BASE = os.environ.get("STUDY_TEST_APP_BASE", "http://127.0.0.1:5174")
ADMIN_KEY = os.environ.get("RESEARCH_ADMIN_KEY", "test-research-key")


def request_json(path: str, payload: dict | None = None, headers: dict | None = None) -> dict:
    request = urllib.request.Request(
        f"{API_BASE}{path}",
        data=json.dumps(payload).encode() if payload is not None else None,
        headers={"Content-Type": "application/json", **(headers or {})},
        method="POST" if payload is not None else "GET",
    )
    with urllib.request.urlopen(request) as response:
        return json.load(response)


def seed_results() -> None:
    invite = request_json(
        "/research/invites",
        {"expires_in_days": 7},
        {"X-Research-Key": ADMIN_KEY},
    )
    session = request_json(
        f"/study/invites/{invite['token']}/enroll",
        {
            "full_name": "Pessoa que não pode aparecer",
            "role_title": "Product Designer",
            "primary_area": "design",
            "experience_range": "3-5",
            "design_system_experience": "intermediate",
            "design_system_frequency": "weekly",
            "company_disclosure": True,
            "company_name": "Empresa que não pode aparecer",
            "confirms_adult": True,
            "consent_academic_use": True,
            "consent_interaction_recording": True,
            "consent_voluntary": True,
        },
    )
    event_headers = {"Authorization": f"Bearer {session['access_token']}"}
    for event_type in (
        "page_view",
        "page_view",
        "prompt_submitted",
        "response_completed",
        "perspective_changed",
    ):
        request_json(
            f"/study/sessions/{session['session_id']}/events",
            {"event_type": event_type, "path": "/oracle", "metadata": {}},
            event_headers,
        )


def main() -> None:
    seed_results()
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1000})
        page.goto(f"{APP_BASE}/results")
        page.wait_for_load_state("networkidle")
        page.get_by_role("heading", name="O que o uso real revelou.").wait_for()
        page.get_by_text("Como o Aetheris foi utilizado").wait_for()
        page.get_by_text("Resultados", exact=True).first.wait_for()
        assert "Pessoa que não pode aparecer" not in page.content()
        assert "Empresa que não pode aparecer" not in page.content()
        page.screenshot(path="/tmp/aetheris-study-results.png", full_page=True)
        browser.close()


if __name__ == "__main__":
    main()
