from pathlib import Path

from playwright.sync_api import Page, sync_playwright


APP_BASE = "http://127.0.0.1:4173"
SCREENSHOT_DIR = Path("/tmp")


def metric_value(page: Page, label: str) -> str:
    label_node = page.get_by_text(label, exact=True).first
    return label_node.locator("xpath=..").locator("p").first.inner_text()


def assert_taxonomy(page: Page) -> None:
    page.goto(f"{APP_BASE}/foundations?focus=tokens")
    page.wait_for_load_state("networkidle")

    body_text = page.locator("body").inner_text()
    assert "v3" not in body_text.lower()
    assert page.get_by_role("heading", name="Design Tokens", exact=True).count() == 1

    expected_metrics = {
        "Total": "88",
        "Cor": "52",
        "Sistema": "36",
        "Primitivos": "32",
        "Semânticos": "52",
        "XAI": "4",
        "Cores únicas": "44",
        "Aliases": "16",
    }
    for label, expected in expected_metrics.items():
        assert metric_value(page, label) == expected, (label, metric_value(page, label))

    preserved_tokens = [
        "primary-50",
        "primary-700",
        "surface-lowest",
        "--aetheris-color-primary",
        "display-xl",
        "space-10",
        "shadow-glow",
        "easing-signature",
    ]
    new_tokens = [
        "text-primary",
        "border-focus",
        "focus-ring",
        "feedback-info-bg",
        "surface-overlay",
        "shadow-lg",
        "z-command",
        "target-size-min",
        "xai-source-bg",
        "heading-md",
    ]
    for token in preserved_tokens + new_tokens:
        assert page.get_by_text(token, exact=True).count() >= 1, token

    assert page.get_by_role(
        "heading", name="Aliases e contratos semânticos", exact=True
    ).count() == 1
    assert page.get_by_text("xai-confidence-high", exact=True).count() == 1
    assert page.get_by_role(
        "heading", name="Cobertura por componente", exact=True
    ).count() == 1
    assert page.get_by_text("Modal/Dialog", exact=True).count() >= 1
    assert page.get_by_text("Source Attribution, Audit Panel", exact=True).count() >= 1


def main() -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page_errors: list[str] = []

        desktop = browser.new_page(viewport={"width": 1440, "height": 1000})
        desktop.on("pageerror", lambda error: page_errors.append(str(error)))
        assert_taxonomy(desktop)
        desktop.screenshot(
            path=str(SCREENSHOT_DIR / "aetheris-tokens-desktop.png"),
            full_page=True,
        )

        mobile = browser.new_page(viewport={"width": 390, "height": 844})
        mobile.on("pageerror", lambda error: page_errors.append(str(error)))
        assert_taxonomy(mobile)
        assert mobile.locator("body").evaluate(
            "(element) => element.scrollWidth <= window.innerWidth"
        )
        mobile.screenshot(
            path=str(SCREENSHOT_DIR / "aetheris-tokens-mobile.png"),
            full_page=True,
        )

        assert not page_errors, page_errors
        browser.close()

    print("Token taxonomy checks passed.")


if __name__ == "__main__":
    main()
