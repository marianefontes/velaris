import os
from pathlib import Path

from playwright.sync_api import Page, sync_playwright


APP_BASE = os.environ.get("APP_BASE", "http://127.0.0.1:5173")
SCREENSHOT_DIR = Path("/tmp")


def preview_button(page: Page):
    return page.locator('button[data-intent][data-state]')


def state_control(page: Page, state: str):
    return page.get_by_role("button", name=f"States: {state}")


def intent_control(page: Page, intent: str):
    return page.get_by_role("button", name=f"Intents: {intent}")


def assert_button_workbench(page: Page) -> None:
    page.goto(f"{APP_BASE}/components")
    page.wait_for_load_state("networkidle")

    editor = page.get_by_label("Editar code snippet do componente")
    preview = preview_button(page)

    assert preview.count() == 1
    assert preview.get_attribute("data-intent") == "primary"
    assert preview.get_attribute("data-state") == "default"
    assert preview.text_content().strip() == "Gerar análise"
    assert '<Button intent="primary">' in editor.input_value()
    assert preview.bounding_box()["height"] >= 44

    intent_control(page, "Secondary").click()
    assert preview.get_attribute("data-intent") == "secondary"
    assert 'intent="secondary"' in editor.input_value()
    assert intent_control(page, "Secondary").get_attribute("aria-pressed") == "true"

    intent_control(page, "Positive").click()
    assert preview.get_attribute("data-intent") == "positive"
    assert 'intent="positive"' in editor.input_value()

    intent_control(page, "Negative").click()
    assert preview.get_attribute("data-intent") == "negative"
    assert 'intent="negative"' in editor.input_value()

    state_control(page, "Hover").click()
    assert preview.get_attribute("data-state") == "hover"
    assert "previewState" not in editor.input_value()
    assert "loading" not in editor.input_value()

    state_control(page, "Focus").click()
    assert preview.get_attribute("data-state") == "focus"
    assert "autoFocus" in editor.input_value()
    assert preview.evaluate("(element) => document.activeElement === element")
    assert preview.evaluate("(element) => getComputedStyle(element).boxShadow") != "none"

    state_control(page, "Loading").click()
    assert preview.get_attribute("data-state") == "loading"
    assert preview.is_disabled()
    assert preview.get_attribute("aria-busy") == "true"
    assert "loading={true}" in editor.input_value()
    count_before = page.get_by_text("Executado 0x", exact=True).count()
    preview.evaluate("(element) => element.click()")
    assert page.get_by_text("Executado 0x", exact=True).count() == count_before

    state_control(page, "Disabled").click()
    assert preview.get_attribute("data-state") == "disabled"
    assert preview.is_disabled()
    assert " disabled" in editor.input_value()
    assert state_control(page, "Disabled").get_attribute("aria-pressed") == "true"

    valid_snippet = (
        '<Button intent="negative" disabled>\n'
        "  Excluir análise\n"
        "</Button>"
    )
    editor.fill(valid_snippet)
    preview = preview_button(page)
    assert preview.get_attribute("data-intent") == "negative"
    assert preview.get_attribute("data-state") == "disabled"
    assert preview.text_content().strip() == "Excluir análise"
    assert intent_control(page, "Negative").get_attribute("aria-pressed") == "true"
    assert state_control(page, "Disabled").get_attribute("aria-pressed") == "true"

    invalid_snippet = (
        '<Button intent="negative" className="custom">\n'
        "  Não deve substituir o preview\n"
        "</Button>"
    )
    editor.fill(invalid_snippet)
    assert page.get_by_role("alert").count() == 1
    assert "Este editor aceita" in page.get_by_role("alert").inner_text()
    preview = preview_button(page)
    assert preview.get_attribute("data-intent") == "negative"
    assert preview.get_attribute("data-state") == "disabled"
    assert preview.text_content().strip() == "Excluir análise"

    page.get_by_role("button", name="Copiar código").click()
    copied = page.evaluate("navigator.clipboard.readText()")
    assert copied == invalid_snippet

    do_rules = [
        "Use apenas uma ação primária por região visual para manter a hierarquia clara.",
        "Use loading quando a ação disparar uma operação assíncrona.",
        "Use positive para confirmar conclusão, aprovação, restauração ou uma ação benéfica inequívoca.",
        "Use negative apenas para ações críticas, como excluir, cancelar definitivamente ou remover dados.",
        "Mantenha o rótulo textual, curto e orientado à ação; preserve indicador de foco visível para quem navega por teclado ou tecnologia assistiva.",
    ]
    dont_rules = [
        "Não use Button para navegação textual simples; use Link quando a ação for apenas navegar.",
        "Não coloque múltiplos botões primary competindo na mesma área.",
        "Não use disabled sem explicar por que a ação está indisponível.",
        "Não use intents positive ou negative como decoração visual; a aparência deve corresponder à consequência real, e negative exige confirmação quando a ação for difícil de reverter.",
        "Não altere estilos manualmente fora dos tokens do design system.",
    ]
    for rule in do_rules + dont_rules:
        assert page.get_by_text(rule, exact=True).count() == 1, rule

    page.get_by_role("complementary").get_by_role(
        "button", name="Toggle/Switch", exact=True
    ).click()
    assert page.get_by_label("Editar code snippet do componente").count() == 1

    page.get_by_role("complementary").get_by_role(
        "button", name="Button", exact=True
    ).click()
    page.get_by_label("Editar code snippet do componente").fill(
        '<Button intent="primary">\n  Gerar análise\n</Button>'
    )
    page.wait_for_timeout(1700)


def main() -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1440, "height": 1000},
            permissions=["clipboard-read", "clipboard-write"],
        )
        page = context.new_page()
        page_errors: list[str] = []
        page.on("pageerror", lambda error: page_errors.append(str(error)))

        assert_button_workbench(page)
        page.screenshot(
            path=str(SCREENSHOT_DIR / "aetheris-button-documentation.png"),
            full_page=True,
        )

        mobile = context.new_page()
        mobile.set_viewport_size({"width": 390, "height": 844})
        mobile.goto(f"{APP_BASE}/components")
        mobile.wait_for_load_state("networkidle")
        assert mobile.locator("body").evaluate(
            "(element) => element.scrollWidth <= window.innerWidth"
        )
        mobile.screenshot(
            path=str(SCREENSHOT_DIR / "aetheris-button-documentation-mobile.png"),
            full_page=True,
        )

        assert not page_errors, page_errors
        context.close()
        browser.close()

    print("Button documentation synchronization checks passed.")


if __name__ == "__main__":
    main()
