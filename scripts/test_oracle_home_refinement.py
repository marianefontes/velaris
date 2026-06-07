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
    "pt-BR": "Transforme documentação de design system em decisões explicáveis.",
    "pt-PT": "Transforme documentação de design system em decisões explicáveis.",
    "en-US": "Turn design system documentation into explainable decisions.",
}


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)

    for name, viewport in VIEWPORTS.items():
        page = browser.new_page(viewport=viewport)
        console_errors = []
        page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
        page.goto("http://127.0.0.1:5173/main")
        page.wait_for_load_state("networkidle")

        assert page.locator("h1").inner_text() == EXPECTED_H1["pt-BR"]
        assert page.get_by_role("heading", name="Como a Beatrice responde").is_visible()
        assert page.locator('section[aria-labelledby="beatrice-response-flow-title"] li').count() == 5
        assert page.get_by_text("ÚLTIMAS CONSULTAS").count() == 0
        assert page.get_by_role("list", name="Exemplos de perguntas").locator("li").count() == 4
        assert page.get_by_role("link", name="Perguntar à Beatrice").first.get_attribute("href") == "/oracle"
        assert page.get_by_role("link", name="Entender o funcionamento").get_attribute("href") == "/reasoning"

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
            alignment = page.evaluate(
                """() => {
                    const rail = document.querySelector('[data-testid="home-context-rail"]');
                    const start = document.querySelector('[data-testid="start-here-section"]');
                    const flow = document.querySelector('[aria-labelledby="beatrice-response-flow-title"]');
                    const flowTitle = document.querySelector('#beatrice-response-flow-title');
                    const startTitle = document.querySelector('#start-here-title');

                    return {
                        bottomDifference: Math.abs(
                            (rail?.getBoundingClientRect().bottom ?? 0) -
                            (start?.getBoundingClientRect().bottom ?? 0)
                        ),
                        flowBackground: flow ? getComputedStyle(flow).backgroundColor : "",
                        flowTitleSize: flowTitle ? parseFloat(getComputedStyle(flowTitle).fontSize) : 0,
                        startTitleSize: startTitle ? parseFloat(getComputedStyle(startTitle).fontSize) : 0,
                    };
                }"""
            )
            assert alignment["bottomDifference"] <= 2, alignment
            assert alignment["startTitleSize"] > alignment["flowTitleSize"], alignment

            expected_focus = {"Perguntar à Beatrice", "Entender o funcionamento"}
            observed_focus = set()

            for _ in range(30):
                page.keyboard.press("Tab")
                focused = page.evaluate(
                    """() => ({
                        text: (document.activeElement?.textContent ?? "").replace(/\\s+/g, " ").trim(),
                        visible: document.activeElement?.matches(":focus-visible") ?? false,
                    })"""
                )
                if focused["text"] in expected_focus:
                    assert focused["visible"]
                    observed_focus.add(focused["text"])

            assert observed_focus == expected_focus, observed_focus

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
        assert locale_page.locator("h1").inner_text() == expected_h1

    locale_page.close()

    route_page = browser.new_page(viewport=VIEWPORTS["desktop"])
    route_page.goto("http://127.0.0.1:5173/main")
    route_page.wait_for_load_state("networkidle")
    route_page.get_by_role("link", name="Entender o funcionamento").click()
    route_page.wait_for_url("**/reasoning")
    assert route_page.url.endswith("/reasoning")

    route_page.goto("http://127.0.0.1:5173/main")
    route_page.wait_for_load_state("networkidle")
    route_page.get_by_role("link", name="Perguntar à Beatrice").first.click()
    route_page.wait_for_url("**/oracle")
    assert route_page.url.endswith("/oracle")

    route_page.close()
    browser.close()
