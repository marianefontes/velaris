"""Playwright smoke test for the public Beatrice capability documentation."""

from playwright.sync_api import sync_playwright


BASE_URL = "http://127.0.0.1:5173"


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    console_errors: list[str] = []
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)

    page.goto(f"{BASE_URL}/reasoning?focus=skills")
    page.wait_for_load_state("networkidle")
    assert page.get_by_text("Habilidades da Beatrice", exact=True).first.is_visible()
    assert page.get_by_text("Ativação automática", exact=True).first.is_visible()
    assert page.get_by_text("A Beatrice ativa estas habilidades automaticamente", exact=False).is_visible()
    assert page.get_by_text("Component Fit Analysis", exact=True).is_visible()
    assert page.get_by_text("Component Misuse Detection", exact=True).is_visible()
    assert page.get_by_text("Accessibility & Interaction Guardrail", exact=True).is_visible()
    assert page.locator("article").count() == 12
    assert page.locator("article code").count() == 0

    page.goto(f"{BASE_URL}/reasoning?focus=commands")
    page.wait_for_load_state("networkidle")
    assert page.get_by_text("Comandos do Oráculo", exact=True).first.is_visible()
    assert page.get_by_text("Ações e modos acionáveis", exact=True).first.is_visible()
    assert page.get_by_text("Como acionar um comando", exact=True).is_visible()
    for command in ("/enforce", "/migrate", "/capture", "/memory", "/decision", "/perspectives", "/audit"):
        assert page.get_by_text(command, exact=True).first.is_visible()
    assert page.get_by_text("Ação operacional", exact=True).first.is_visible()
    assert page.get_by_text("Modo investigativo", exact=True).first.is_visible()
    assert page.get_by_text("/token-impact", exact=True).is_visible()
    assert page.get_by_text("/contract-check", exact=True).is_visible()
    assert page.get_by_text("/feedback-review", exact=True).is_visible()
    assert page.locator("article").count() == 16
    assert page.locator("article", has_text="/learn").count() == 0
    assert page.get_by_text("Oracle Engines", exact=True).count() == 0
    assert page.get_by_text("Operational Commands", exact=True).count() == 0

    visual_contract = page.locator('[data-testid="command-how-to"]').evaluate(
        """element => {
          const body = getComputedStyle(document.body);
          const panel = getComputedStyle(element);
          return {
            bodyBackground: body.backgroundColor,
            panelBackground: panel.backgroundImage,
            panelRadius: panel.borderRadius,
            panelShadow: panel.boxShadow,
          };
        }"""
    )
    assert visual_contract["bodyBackground"] not in {"rgb(255, 255, 255)", "rgba(0, 0, 0, 0)"}
    assert "linear-gradient" in visual_contract["panelBackground"]
    assert visual_contract["panelRadius"] != "0px"
    assert visual_contract["panelShadow"] != "none"

    page.goto(f"{BASE_URL}/reasoning?focus=engines")
    page.wait_for_load_state("networkidle")
    assert page.get_by_text("Comandos do Oráculo", exact=True).first.is_visible()

    page.set_viewport_size({"width": 390, "height": 844})
    page.goto(f"{BASE_URL}/reasoning?focus=skills")
    page.wait_for_load_state("networkidle")
    has_horizontal_overflow = page.evaluate(
        "document.documentElement.scrollWidth > document.documentElement.clientWidth"
    )
    assert not has_horizontal_overflow

    assert not console_errors, f"browser console errors: {console_errors}"
    browser.close()

print("Reasoning capability UI checks passed.")
