import json
import os
import urllib.request

from playwright.sync_api import sync_playwright


API_BASE = os.environ.get("STUDY_TEST_API_BASE", "http://127.0.0.1:3333/api")
APP_BASE = os.environ.get("STUDY_TEST_APP_BASE", "http://127.0.0.1:5173")
ADMIN_KEY = os.environ.get("RESEARCH_ADMIN_KEY", "test-research-key")


def create_invite() -> str:
    request = urllib.request.Request(
        f"{API_BASE}/research/invites",
        data=json.dumps({"expires_in_days": 7}).encode(),
        headers={
            "Content-Type": "application/json",
            "X-Research-Key": ADMIN_KEY,
        },
        method="POST",
    )
    with urllib.request.urlopen(request) as response:
        return json.load(response)["token"]


def list_invites() -> list[dict]:
    request = urllib.request.Request(
        f"{API_BASE}/research/invites",
        headers={"X-Research-Key": ADMIN_KEY},
    )
    with urllib.request.urlopen(request) as response:
        return json.load(response)["invites"]


def main() -> None:
    token = create_invite()
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1000})
        page.on("console", lambda message: print(f"BROWSER CONSOLE [{message.type}]: {message.text}"))
        page.on("pageerror", lambda error: print(f"BROWSER ERROR: {error}"))
        page.goto(f"{APP_BASE}/study/{token}")
        page.wait_for_load_state("networkidle")
        page.screenshot(path="/tmp/aetheris-study-form.png", full_page=True)

        page.get_by_label("Nome completo").fill("Participante de Teste")
        page.get_by_label("Cargo ou função atual").fill("Product Designer")
        page.get_by_label("Principal área de atuação").select_option("design")
        page.get_by_label("Tempo de experiência profissional").select_option("3-5")
        page.get_by_label("Experiência com design systems").select_option("intermediate")
        page.get_by_label("Frequência de uso de design systems").select_option("weekly")
        page.get_by_text("Sim, desejo informar").click()
        page.get_by_label("Nome da empresa").fill("Empresa de Teste")

        for label in [
            "Confirmo que tenho 18 anos ou mais.",
            "Autorizo o uso dos dados informados exclusivamente para finalidades acadêmicas e estudantis relacionadas a esta pesquisa.",
            "Estou ciente de que minha navegação, perguntas, respostas e resultados das tarefas serão registrados para análise.",
            "Entendo que minha participação é voluntária e que minha identidade e empresa não serão divulgadas nos resultados.",
        ]:
            page.get_by_text(label, exact=True).click()

        page.get_by_role("button", name="Concordar e participar").click()
        page.get_by_text("Cadastro concluído. Sua sessão está pronta.").wait_for()
        page.screenshot(path="/tmp/aetheris-study-success.png", full_page=True)

        page.get_by_role("button", name="Começar experiência").click()
        page.wait_for_url(f"{APP_BASE}/main")
        page.wait_for_load_state("networkidle")
        page.screenshot(path="/tmp/aetheris-oracle-after-study.png", full_page=True)
        page.locator("textarea").fill("Qual componente devo usar para confirmar uma ação destrutiva?")
        page.locator("textarea").press("Enter")
        page.wait_for_timeout(800)

        stored = page.evaluate("JSON.parse(localStorage.getItem('aetheris.study.sessions'))")
        assert token in stored
        assert stored[token]["participantCode"].startswith("P")

        tracked_invite = next(item for item in list_invites() if item["participant_code"] == stored[token]["participantCode"])
        assert tracked_invite["event_count"] >= 4

        page.goto(f"{APP_BASE}/research")
        page.get_by_label("Chave administrativa").fill(ADMIN_KEY)
        page.get_by_label("Atualizar convites").click()
        page.get_by_text("Participante de Teste").wait_for()
        page.get_by_label("Código do participante").fill("P099")
        page.get_by_role("button", name="Gerar link personalizado").click()
        page.get_by_text("Link criado").wait_for()
        page.screenshot(path="/tmp/aetheris-research-admin.png", full_page=True)
        page.get_by_text("Participante de Teste").click()
        page.get_by_text("Linha do tempo da sessão").wait_for()
        page.get_by_text("Página acessada").wait_for()
        page.screenshot(path="/tmp/aetheris-research-session.png", full_page=True)
        browser.close()


if __name__ == "__main__":
    main()
