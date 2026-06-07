from playwright.sync_api import sync_playwright


APP_BASE = "http://127.0.0.1:4173"


def expect_path(page, path: str) -> None:
    page.wait_for_url(f"{APP_BASE}{path}")
    assert page.url == f"{APP_BASE}{path}", page.url


def main() -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1000})
        page_errors: list[str] = []
        page.on("pageerror", lambda error: page_errors.append(str(error)))

        page.goto(f"{APP_BASE}/")
        page.wait_for_load_state("networkidle")
        expect_path(page, "/main")

        primary_links = page.locator("header nav a")
        assert primary_links.count() == 8
        primary_labels = primary_links.all_inner_texts()
        assert primary_labels == [
            "INÍCIO",
            "FUNDAMENTOS",
            "COMPONENTES",
            "RACIOCÍNIO",
            "PERSPECTIVAS",
            "ARQUITETURA",
            "AVALIAÇÃO",
            "RESULTADOS",
        ], primary_labels
        architecture_icon = page.locator('header nav a[href="/architecture"] svg')
        assert architecture_icon.count() == 1
        assert architecture_icon.is_visible()
        assert "lucide-workflow" in architecture_icon.get_attribute("class")
        icon_box = architecture_icon.bounding_box()
        assert icon_box and icon_box["width"] > 0 and icon_box["height"] > 0
        assert page.locator('header nav a[href="/oracle"]').count() == 0
        assert page.locator('header nav a[href="/main"]').count() == 1
        assert "bg-primary" in page.locator('header nav a[href="/main"]').get_attribute("class")

        page.get_by_role("link", name="Chat da Beatrice").click()
        page.wait_for_load_state("networkidle")
        expect_path(page, "/oracle")
        assert page.locator('header nav a[class*="bg-primary"]').count() == 0
        page.wait_for_selector("textarea", state="visible")

        page.goto(f"{APP_BASE}/foundations")
        page.wait_for_load_state("networkidle")
        assert page.get_by_role("heading", name="Workbench de Componentes").count() == 0
        assert page.get_by_role("button", name="Diretrizes Pilares e princípios").count() == 1

        page.goto(f"{APP_BASE}/components")
        page.wait_for_load_state("networkidle")
        assert page.get_by_role("heading", name="Workbench de Componentes").count() == 1
        assert page.get_by_text("25 componentes principais", exact=True).count() >= 1

        for section in [
            "Ações e Controles",
            "Inputs e Formulários",
            "Navegação e Estrutura",
            "Feedback e Estados",
            "Inteligência, XAI e Auditabilidade",
        ]:
            assert page.get_by_role("button", name=f"{section} 5").count() == 1

        page.get_by_role("button", name="Feedback e Estados 5").click()
        page.get_by_role("button", name="Confidence Badge", exact=True).first.click()
        assert page.get_by_role("heading", name="Confidence Badge", exact=True).count() == 1
        assert page.get_by_text("Acessibilidade", exact=True).count() >= 1
        assert page.get_by_text("Beatrice / RAG / XAI", exact=True).count() == 1
        assert page.locator('input[type="range"]').count() == 1
        page.screenshot(path="/tmp/aetheris-components-workbench.png", full_page=True)

        page.goto(f"{APP_BASE}/system?focus=components")
        page.wait_for_load_state("networkidle")
        expect_path(page, "/components")

        page.goto(f"{APP_BASE}/oracle/chat")
        page.wait_for_load_state("networkidle")
        expect_path(page, "/oracle")

        page.goto(f"{APP_BASE}/dashboard")
        page.wait_for_load_state("networkidle")
        expect_path(page, "/main")

        for legacy_path in ["/developers", "/dev-integration"]:
            page.goto(f"{APP_BASE}{legacy_path}")
            page.wait_for_load_state("networkidle")
            expect_path(page, "/architecture")

        for path in [
            "/main",
            "/reasoning",
            "/perspectives",
            "/foundations",
            "/components",
            "/architecture",
            "/evaluation",
            "/results",
        ]:
            page.goto(f"{APP_BASE}{path}")
            page.wait_for_load_state("networkidle")
            active_link = page.locator(f'header nav a[href="{path}"]')
            assert active_link.count() == 1
            assert "bg-primary" in active_link.get_attribute("class")

        assert not page_errors, page_errors
        browser.close()

    print("Navigation and Components Workbench checks passed.")


if __name__ == "__main__":
    main()
