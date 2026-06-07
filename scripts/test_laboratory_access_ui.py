import json
import os
import urllib.request

from playwright.sync_api import sync_playwright


API_BASE = os.environ.get("LAB_UI_API_BASE", "http://127.0.0.1:3333/api")
APP_BASE = os.environ.get("LAB_UI_APP_BASE", "http://127.0.0.1:5173")
ADMIN_KEY = os.environ.get("RESEARCH_ADMIN_KEY", "laboratory-ui-test")


def api_request(path: str, *, method: str = "GET", body: dict | None = None, admin: bool = False) -> dict:
    headers = {"Content-Type": "application/json"}
    if admin:
        headers["X-Research-Key"] = ADMIN_KEY
    request = urllib.request.Request(
        f"{API_BASE}{path}",
        data=json.dumps(body).encode() if body is not None else None,
        headers=headers,
        method=method,
    )
    with urllib.request.urlopen(request) as response:
        return json.load(response)


def create_participant() -> tuple[str, dict]:
    invite = api_request(
        "/research/invites",
        method="POST",
        body={"expires_in_days": 7},
        admin=True,
    )
    token = invite["token"]
    enrollment = api_request(
        f"/study/invites/{token}/enroll",
        method="POST",
        body={
            "full_name": "Laboratory Access Test",
            "role_title": "Product Designer",
            "primary_area": "design",
            "experience_range": "3-5",
            "design_system_experience": "intermediate",
            "design_system_frequency": "weekly",
            "company_disclosure": False,
            "company_name": None,
            "confirms_adult": True,
            "consent_academic_use": True,
            "consent_interaction_recording": True,
            "consent_voluntary": True,
        },
    )
    return token, enrollment


def main() -> None:
    token, enrollment = create_participant()
    api_request(
        "/laboratory/notifications/read",
        method="POST",
        body={"ids": []},
        admin=True,
    )
    api_request(
        "/laboratory/automation/pause",
        method="POST",
        body={"reason": "Teste visual de notificação interna"},
        admin=True,
    )
    api_request(
        "/laboratory/automation/resume",
        method="POST",
        admin=True,
    )
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1000})
        page.on("console", lambda message: print(f"BROWSER [{message.type}]: {message.text}"))
        page.on("pageerror", lambda error: print(f"BROWSER ERROR: {error}"))

        page.goto(f"{APP_BASE}/main")
        page.wait_for_load_state("networkidle")
        laboratory_link = page.locator('nav a[href="/laboratory"]')
        assert laboratory_link.count() == 1

        boxes = page.locator('header nav a[href^="/"]').evaluate_all(
            """links => links.map(link => {
              const box = link.getBoundingClientRect();
              return { href: link.getAttribute('href'), x: box.x, y: box.y, width: box.width };
            })"""
        )
        assert len(boxes) == 9, boxes
        assert max(box["y"] for box in boxes) - min(box["y"] for box in boxes) < 2, boxes
        assert all(box["width"] > 80 for box in boxes), boxes

        page.goto(f"{APP_BASE}/laboratory")
        page.wait_for_load_state("networkidle")
        page.get_by_label("Research admin key").fill(ADMIN_KEY)
        page.get_by_role("button", name="Entrar").click()
        page.get_by_text("Nova execução", exact=True).wait_for()
        page.get_by_text("Notificações internas", exact=True).wait_for()
        mark_notifications = page.get_by_role(
            "button",
            name="Marcar 1 como lida(s)",
        )
        mark_notifications.click()
        page.get_by_text("Tudo lido", exact=True).wait_for()
        page.get_by_role("button", name="Recomendações").click()
        page.get_by_text("Central de revisões", exact=True).wait_for()
        page.get_by_role("button", name="Execuções").click()
        page.screenshot(path="/tmp/aetheris-laboratory.png", full_page=True)

        credential = {
            "inviteToken": token,
            "sessionId": enrollment["session_id"],
            "accessToken": enrollment["access_token"],
            "participantCode": enrollment["participant_code"],
            "createdAt": "2026-06-06T00:00:00Z",
        }
        page.evaluate(
            """({ token, credential }) => {
              localStorage.setItem('aetheris.study.sessions', JSON.stringify({ [token]: credential }));
              localStorage.setItem('aetheris.study.activeSession', token);
            }""",
            {"token": token, "credential": credential},
        )
        page.goto(f"{APP_BASE}/main")
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(300)
        assert page.locator('nav a[href="/laboratory"]').count() == 0

        page.goto(f"{APP_BASE}/laboratory")
        page.wait_for_url(f"{APP_BASE}/main")
        assert page.locator('nav a[href="/laboratory"]').count() == 0

        page.goto(f"{APP_BASE}/results")
        page.wait_for_load_state("networkidle")
        assert page.get_by_text("Resultados do laboratório", exact=True).count() == 0

        page.evaluate("localStorage.removeItem('aetheris.study.activeSession')")
        page.goto(f"{APP_BASE}/results")
        page.wait_for_load_state("networkidle")
        page.get_by_text("Resultados do laboratório", exact=True).wait_for()
        page.screenshot(path="/tmp/aetheris-results-sections.png", full_page=True)

        browser.close()
    print("Laboratory UI access checks passed.")


if __name__ == "__main__":
    main()
