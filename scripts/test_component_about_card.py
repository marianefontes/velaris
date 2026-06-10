import os
from pathlib import Path

from playwright.sync_api import Page, expect, sync_playwright


APP_BASE = os.environ.get("APP_BASE", "http://127.0.0.1:5173")
SCREENSHOT_DIR = Path("/tmp/aetheris-component-about")
COMPONENTS = [
    ("button", "Button"),
    ("toggle-switch", "Toggle/Switch"),
    ("checkbox", "Checkbox"),
    ("radio-button", "Radio Button"),
    ("selectable-chip", "Selectable Chip / Badge"),
]


def select_component(page: Page, title: str) -> None:
    page.locator("section").last.get_by_role(
        "button",
        name=title,
        exact=True,
    ).click()


def assert_card_contract(page: Page, component_id: str) -> str:
    card = page.locator(f'[data-component-about="{component_id}"]')
    expect(card).to_be_visible()
    expect(card.locator("h3")).to_have_count(1)
    expect(card.locator("h4")).to_have_count(4)
    expect(card.locator("[data-about-feature]")).to_have_count(3)
    common_uses = card.locator("[data-common-use]")
    assert 4 <= common_uses.count() <= 6
    assert card.locator("[data-about-feature] svg[aria-hidden]").count() == 3
    assert card.locator("button, a").count() == 0
    assert card.evaluate("(element) => getComputedStyle(element).minHeight") == "0px"

    card_box = card.bounding_box()
    last_use_box = common_uses.last.bounding_box()
    assert card_box and last_use_box
    assert last_use_box["x"] + last_use_box["width"] <= card_box["x"] + card_box["width"] + 1
    assert last_use_box["y"] + last_use_box["height"] <= card_box["y"] + card_box["height"] + 1

    about = card.locator("p").first.inner_text()
    assert len(about) > 80
    return about


def feature_positions(page: Page, component_id: str) -> list[dict]:
    return page.locator(
        f'[data-component-about="{component_id}"] [data-about-feature]'
    ).evaluate_all(
        """(nodes) => nodes.map((node) => {
          const rect = node.getBoundingClientRect();
          return { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width) };
        })"""
    )


def assert_no_overflow(page: Page) -> None:
    assert page.locator("body").evaluate(
        "(element) => element.scrollWidth <= window.innerWidth"
    )


def main() -> None:
    SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 1000})
        page = context.new_page()
        errors: list[str] = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(f"{APP_BASE}/components")
        page.wait_for_load_state("networkidle")

        about_texts: set[str] = set()
        for component_id, title in COMPONENTS:
            select_component(page, title)
            about_texts.add(assert_card_contract(page, component_id))
            positions = feature_positions(page, component_id)
            assert len({position["y"] for position in positions}) == 1
            page.locator(f'[data-component-about="{component_id}"]').screenshot(
                path=str(SCREENSHOT_DIR / f"{component_id}-desktop.png")
            )

        assert len(about_texts) == len(COMPONENTS)
        assert_no_overflow(page)

        tablet = context.new_page()
        tablet.set_viewport_size({"width": 768, "height": 900})
        tablet.goto(f"{APP_BASE}/components")
        tablet.wait_for_load_state("networkidle")
        tablet_positions = feature_positions(tablet, "button")
        assert tablet_positions[0]["y"] == tablet_positions[1]["y"]
        assert tablet_positions[2]["y"] > tablet_positions[1]["y"]
        assert tablet_positions[2]["width"] > tablet_positions[0]["width"]
        assert_card_contract(tablet, "button")
        assert_no_overflow(tablet)
        tablet.locator('[data-component-about="button"]').screenshot(
            path=str(SCREENSHOT_DIR / "button-tablet.png")
        )

        mobile = context.new_page()
        mobile.set_viewport_size({"width": 390, "height": 844})
        mobile.goto(f"{APP_BASE}/components")
        mobile.wait_for_load_state("networkidle")
        mobile_positions = feature_positions(mobile, "button")
        assert len({position["y"] for position in mobile_positions}) == 3
        assert_card_contract(mobile, "button")
        assert_no_overflow(mobile)
        mobile.locator('[data-component-about="button"]').screenshot(
            path=str(SCREENSHOT_DIR / "button-mobile.png")
        )

        assert not errors, errors
        context.close()
        browser.close()

    print("Component about card visual checks passed.")


if __name__ == "__main__":
    main()
