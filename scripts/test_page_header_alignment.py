import os

from playwright.sync_api import sync_playwright


APP_BASE = os.environ.get("APP_BASE", "http://127.0.0.1:4173")
ROUTES = (
    "/reasoning",
    "/foundations",
    "/architecture",
    "/evaluation",
    "/components",
    "/perspectives",
)
VIEWPORTS = (
    {"width": 1440, "height": 1000},
    {"width": 768, "height": 900},
    {"width": 390, "height": 844},
    {"width": 320, "height": 720},
)


def main() -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)

        for viewport in VIEWPORTS:
            page = browser.new_page(viewport=viewport)
            heading_left: dict[str, float] = {}

            for route in ROUTES:
                page.goto(f"{APP_BASE}{route}")
                page.wait_for_load_state("networkidle")

                heading = page.get_by_role("heading", level=1)
                assert heading.count() == 1, f"{route} must render exactly one h1"
                box = heading.bounding_box()
                assert box is not None, f"{route} h1 must be visible"
                heading_left[route] = round(box["x"], 2)

                has_overflow = page.locator("body").evaluate(
                    "(element) => element.scrollWidth > window.innerWidth"
                )
                assert not has_overflow, f"{route} overflows at {viewport['width']}px"

            reference_left = heading_left["/reasoning"]
            for route, left in heading_left.items():
                assert abs(left - reference_left) <= 1, (
                    f"{route} h1 starts at {left}px, expected {reference_left}px "
                    f"at {viewport['width']}px"
                )

            page.close()

        browser.close()


if __name__ == "__main__":
    main()
    print("Page header alignment checks passed.")
