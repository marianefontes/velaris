from playwright.sync_api import sync_playwright


PROFESSIONAL_NAMES = (
    "Developer",
    "Designer",
    "Product Designer",
    "QA",
    "Tech Writer",
    "Accessibility Specialist",
    "Maintainer",
    "Design System Manager",
)

FICTIONAL_NAMES = (
    "Adrian Vale",
    "Elena Voss",
    "Sofia Mercer",
    "Maya Sterling",
    "Lucien Ward",
    "Iris Holloway",
    "Kai Renner",
)


def main() -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1000})
        page.goto("http://127.0.0.1:4173/perspectives")
        page.wait_for_load_state("networkidle")

        selector = page.get_by_role(
            "radiogroup",
            name="Perspectivas profissionais disponíveis",
        )
        selector.wait_for()
        assert selector.get_by_role("radio").count() == len(PROFESSIONAL_NAMES)

        for name in PROFESSIONAL_NAMES:
            assert selector.get_by_text(name, exact=True).count() == 1, name

        body_text = page.locator("body").inner_text()
        for name in FICTIONAL_NAMES:
            assert name not in body_text, name

        browser.close()


if __name__ == "__main__":
    main()
    print("Rendered perspectives UI checks passed.")
