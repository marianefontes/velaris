import os
from pathlib import Path

from playwright.sync_api import Page, expect, sync_playwright


APP_BASE = os.environ.get("APP_BASE", "http://127.0.0.1:5173")
SCREENSHOT_DIR = Path("/tmp/aetheris-component-side-panel")
PRIORITY_COMPONENTS = [
    ("button", "Button"),
    ("toggle-switch", "Toggle/Switch"),
    ("checkbox", "Checkbox"),
    ("radio-button", "Radio Button"),
    ("selectable-chip", "Selectable Chip / Badge"),
]


def select_component(page: Page, title: str) -> None:
    page.get_by_role("button", name=title, exact=True).first.click()


def validate_panel(page: Page, component_id: str, title: str, mobile: bool) -> None:
    select_component(page, title)
    controls = page.locator(f'[data-component-controls="{component_id}"]')
    guidance = page.locator(f'[data-component-guidance="{component_id}"]')
    expect(controls).to_be_visible()
    expect(guidance).to_be_visible()
    assert guidance.locator("[data-accessibility-criterion]").count() >= 5
    assert guidance.locator("[data-ai-recommendation]").count() == 1
    assert page.locator(
        f'[data-component-snippet="{component_id}"] .component-code-highlight .code-token-component'
    ).count() > 0
    assert page.get_by_label("Editar code snippet do componente").count() == 1

    control_groups = controls.locator(":scope > div > div")
    assert control_groups.count() == 2
    first_box = control_groups.nth(0).bounding_box()
    second_box = control_groups.nth(1).bounding_box()
    assert first_box and second_box
    if mobile:
        assert second_box["y"] > first_box["y"] + first_box["height"] - 2
    else:
        assert abs(second_box["y"] - first_box["y"]) < 4, (
            component_id,
            first_box,
            second_box,
        )
        assert second_box["x"] > first_box["x"]

    snippet = page.locator(f'[data-component-snippet="{component_id}"]')
    expect(snippet).to_be_visible()
    detail_body = page.locator(".component-detail-body")
    detail_box = detail_body.bounding_box()
    editor_box = snippet.locator(".component-code-editor").bounding_box()
    assert detail_box and editor_box
    if mobile:
        assert editor_box["width"] <= detail_box["width"] + 1
    else:
        assert editor_box["width"] >= detail_box["width"] * 0.88

    state_button = controls.locator('button[aria-label^="States:"]').first
    intent_button = controls.locator('button[aria-label^="Intents:"]').first
    state = state_button.get_attribute("aria-label").split(": ", 1)[1]
    intent = intent_button.get_attribute("aria-label").split(": ", 1)[1]
    state_button.click()
    intent_button.click()
    recommendation = guidance.locator(".component-ai-recommendation").inner_text().lower()
    assert state.lower() in recommendation
    assert intent.lower() in recommendation

    suffix = "mobile" if mobile else "desktop"
    page.locator(f'[data-component-detail="{component_id}"]').screenshot(
        path=str(SCREENSHOT_DIR / f"{component_id}-{suffix}.png"),
    )


def main() -> None:
    SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)

        desktop = browser.new_page(viewport={"width": 1440, "height": 1100})
        desktop.goto(f"{APP_BASE}/components")
        desktop.wait_for_load_state("networkidle")
        for component_id, title in PRIORITY_COMPONENTS:
            validate_panel(desktop, component_id, title, mobile=False)

        mobile = browser.new_page(viewport={"width": 390, "height": 844})
        mobile.goto(f"{APP_BASE}/components")
        mobile.wait_for_load_state("networkidle")
        for component_id, title in PRIORITY_COMPONENTS:
            validate_panel(mobile, component_id, title, mobile=True)
        assert mobile.locator("body").evaluate(
            "(element) => element.scrollWidth <= window.innerWidth"
        )

        browser.close()

    print(f"Component side panel visual checks passed. Screenshots: {SCREENSHOT_DIR}")


if __name__ == "__main__":
    main()
