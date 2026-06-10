from pathlib import Path

from playwright.sync_api import sync_playwright


OUTPUT_DIR = Path("/tmp/aetheris-home-refined")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

VIEWPORTS = {
    "desktop": {"width": 1440, "height": 1100},
    "tablet": {"width": 900, "height": 1100},
    "mobile": {"width": 390, "height": 844},
}

EXPECTED_H1 = {
    "pt-BR": "Conhecimento que se conecta. Decisões que fazem sentido.",
    "pt-PT": "Conhecimento que se conecta. Decisões que fazem sentido.",
    "en-US": "Knowledge that connects. Decisions that make sense.",
}


def normalized_text(locator):
    return " ".join(locator.inner_text().split())


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)

    for name, viewport in VIEWPORTS.items():
        page = browser.new_page(viewport=viewport)
        console_errors = []
        page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
        page.goto("http://127.0.0.1:5173/main")
        page.wait_for_load_state("networkidle")

        assert normalized_text(page.locator("h1")) == EXPECTED_H1["pt-BR"]
        assert page.get_by_role("heading", name="Como Abraxos responde").is_visible()
        assert page.locator('section[aria-labelledby="abraxos-response-flow-title"] li').count() == 5
        assert page.get_by_text("ÚLTIMAS CONSULTAS").count() == 0
        assert page.get_by_role("textbox", name="Consultar Abraxos").is_visible()
        assert page.get_by_role("button", name="Ver outras sugestões").is_visible()
        assert page.get_by_role("link", name="Consultar Abraxos").is_visible()
        assert page.locator('[data-testid="start-here-section"] a').count() == 4
        assert page.get_by_role("link", name="Entender decisões", exact=False).get_attribute("href") == "/reasoning"

        dimensions = page.evaluate(
            """() => ({
                viewport: window.innerWidth,
                document: document.documentElement.scrollWidth,
                mainClient: document.querySelector("main")?.clientWidth ?? 0,
                mainScroll: document.querySelector("main")?.scrollWidth ?? 0,
            })"""
        )
        assert dimensions["mainScroll"] <= dimensions["mainClient"]
        assert not console_errors

        page.screenshot(path=OUTPUT_DIR / f"{name}.png", full_page=True)

        if name == "desktop":
            visual = page.evaluate(
                """() => {
                    const flow = document.querySelector('[aria-labelledby="abraxos-response-flow-title"]');
                    const cta = [...document.querySelectorAll("a")].find(
                        (item) => item.textContent?.trim() === "Consultar Abraxos"
                    );
                    const style = cta ? getComputedStyle(cta) : null;

                    return {
                        flowBackground: flow ? getComputedStyle(flow).backgroundColor : "",
                        ctaBackground: style?.backgroundColor ?? "",
                        ctaBorder: style?.borderColor ?? "",
                        ctaColor: style?.color ?? "",
                    };
                }"""
            )
            assert visual["flowBackground"] not in {"", "rgba(0, 0, 0, 0)"}, visual
            assert visual["ctaBackground"] not in {"", "rgba(0, 0, 0, 0)"}, visual
            assert visual["ctaBorder"] not in {"", "rgba(0, 0, 0, 0)"}, visual
            assert visual["ctaColor"] != "", visual

            oracle_cta = page.get_by_role("link", name="Consultar Abraxos")
            assert oracle_cta.get_attribute("href") == "/oracle"
            oracle_cta.focus()
            assert oracle_cta.evaluate("(element) => element.matches(':focus-visible')")

            decision_link = page.get_by_role("link", name="Entender decisões", exact=False)
            decision_link.focus()
            assert decision_link.evaluate("(element) => element.matches(':focus-visible')")

        print(name, page.locator("body").evaluate("(body) => body.scrollHeight"), dimensions)
        page.close()

    locale_page = browser.new_page(viewport=VIEWPORTS["desktop"])
    for locale, expected_h1 in EXPECTED_H1.items():
        locale_page.goto("http://127.0.0.1:5173/main")
        locale_page.evaluate(
            "(selectedLocale) => localStorage.setItem('aetheris.locale', selectedLocale)",
            locale,
        )
        locale_page.reload()
        locale_page.wait_for_load_state("networkidle")
        assert normalized_text(locale_page.locator("h1")) == expected_h1

    locale_page.close()

    route_page = browser.new_page(viewport=VIEWPORTS["desktop"])
    route_page.goto("http://127.0.0.1:5173/main")
    route_page.wait_for_load_state("networkidle")
    route_page.get_by_role("link", name="Entender decisões", exact=False).click()
    route_page.wait_for_url("**/reasoning")
    assert route_page.url.endswith("/reasoning")

    route_page.goto("http://127.0.0.1:5173/main")
    route_page.wait_for_load_state("networkidle")
    route_page.get_by_role("textbox", name="Consultar Abraxos").fill("Qual componente usar para tabela?")
    route_page.get_by_role("button", name="Enviar pergunta").click()
    route_page.wait_for_url("**/oracle")
    assert route_page.url.endswith("/oracle")
    active_oracle_cta = route_page.get_by_role("link", name="Consultar Abraxos")
    assert active_oracle_cta.get_attribute("aria-current") == "page"
    assert "oracle-cta-active" in (active_oracle_cta.get_attribute("class") or "")
    route_page.screenshot(path=OUTPUT_DIR / "oracle-active.png", full_page=True)

    route_page.close()
    browser.close()
