from playwright.sync_api import sync_playwright


APP_BASE = "http://127.0.0.1:4173"


def main() -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1000})
        page_errors: list[str] = []
        page.on("pageerror", lambda error: page_errors.append(str(error)))

        page.goto(f"{APP_BASE}/foundations")
        page.wait_for_load_state("networkidle")

        expected_tabs = [
            "Diretrizes Pilares e princípios",
            "Acessibilidade Qualidade transversal",
            "Padrões Lógica de interação",
            "Tokens Primitivas de design",
        ]
        for name in expected_tabs:
            assert page.get_by_role("button", name=name).count() == 1, name

        assert page.get_by_role("button", name=expected_tabs[0]).get_attribute("aria-pressed") == "true"
        assert page.get_by_role("heading", name="Guia de Diretrizes").count() == 1

        page.goto(f"{APP_BASE}/foundations?focus=foundations")
        page.wait_for_load_state("networkidle")
        assert page.get_by_role("button", name=expected_tabs[1]).get_attribute("aria-pressed") == "true"
        assert page.get_by_role("heading", name="Guia de Acessibilidade").count() == 1

        required_headings = [
            "Contraste e legibilidade",
            "Foco e navegação por teclado",
            "Alvo mínimo e densidade",
            "Estados acessíveis",
            "Leitores de tela e semântica",
            "Feedback não apenas por cor",
            "Movimento seguro",
            "Checklist de prontidão acessível",
        ]
        for heading in required_headings:
            assert page.get_by_role("heading", name=heading).count() == 1, heading

        assert page.get_by_text("AA como base", exact=True).count() >= 1
        assert page.get_by_text("44px", exact=True).count() == 1
        assert page.get_by_text("Nunca só por cor", exact=True).count() == 1
        assert page.get_by_text("Fundações do Design System", exact=True).count() == 0
        assert page.get_by_text("Papéis bioluminescentes", exact=True).count() == 0
        page.screenshot(path="/tmp/aetheris-foundations-accessibility.png", full_page=True)

        page.get_by_role("button", name=expected_tabs[2]).click()
        page.wait_for_load_state("networkidle")
        assert "focus=patterns" in page.url
        assert page.get_by_role("button", name=expected_tabs[2]).get_attribute("aria-pressed") == "true"

        page.get_by_role("button", name=expected_tabs[3]).click()
        page.wait_for_load_state("networkidle")
        assert "focus=tokens" in page.url
        assert page.get_by_role("button", name=expected_tabs[3]).get_attribute("aria-pressed") == "true"

        assert not page_errors, page_errors

        mobile = browser.new_page(viewport={"width": 390, "height": 844})
        mobile.goto(f"{APP_BASE}/foundations?focus=foundations")
        mobile.wait_for_load_state("networkidle")
        has_horizontal_overflow = mobile.evaluate(
            "document.documentElement.scrollWidth > window.innerWidth + 1"
        )
        assert not has_horizontal_overflow
        assert mobile.get_by_text("44px", exact=True).is_visible()
        mobile.screenshot(path="/tmp/aetheris-foundations-accessibility-mobile.png", full_page=True)

        localized_expectations = [
            (
                "pt-PT",
                "Diretrizes pilares e princípios",
                "Acessibilidade qualidade transversal",
                "Guia de Acessibilidade",
            ),
            (
                "en-US",
                "Guidelines pillars and principles",
                "Accessibility transversal quality",
                "Accessibility Guide",
            ),
        ]
        for locale, guidelines_tab, accessibility_tab, heading in localized_expectations:
            localized_page = browser.new_page(viewport={"width": 1280, "height": 900})
            localized_page.add_init_script(
                f"window.localStorage.setItem('aetheris.locale', '{locale}')"
            )
            localized_page.goto(f"{APP_BASE}/foundations?focus=foundations")
            localized_page.wait_for_load_state("networkidle")
            assert localized_page.get_by_role("button", name=guidelines_tab).count() == 1
            assert localized_page.get_by_role("button", name=accessibility_tab).count() == 1
            assert localized_page.get_by_role("heading", name=heading).count() == 1
            localized_page.close()

        browser.close()

    print("Foundations accessibility checks passed.")


if __name__ == "__main__":
    main()
