import os

from playwright.sync_api import sync_playwright


ROUTES = [
    "/main",
    "/oracle",
    "/reasoning",
    "/perspectives",
    "/foundations",
    "/components",
    "/architecture",
    "/evaluation",
    "/results",
    "/laboratory",
]

LOCALES = ["pt-BR", "pt-PT", "en-US"]
BASE_URL = os.environ.get("AETHERIS_BASE_URL", "http://127.0.0.1:5173")
VIEWPORTS = {
    "desktop": {"width": 1280, "height": 800},
    "mobile": {"width": 390, "height": 844},
}


def main() -> None:
    failures: list[str] = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport=VIEWPORTS["desktop"])
        page.on("pageerror", lambda error: failures.append(f"pageerror: {error}"))

        for viewport_name, viewport in VIEWPORTS.items():
            page.set_viewport_size(viewport)
            for locale in LOCALES:
                page.goto(f"{BASE_URL}/main", wait_until="domcontentloaded")
                page.evaluate(
                    "(locale) => localStorage.setItem('aetheris.locale', locale)",
                    locale,
                )

                for route in ROUTES:
                    response = page.goto(
                        f"{BASE_URL}{route}",
                        wait_until="networkidle",
                        timeout=30_000,
                    )
                    prefix = f"{viewport_name} {locale} {route}"
                    if response is None or response.status >= 400:
                        failures.append(f"{prefix}: navigation failed")
                        continue

                    page.locator("main, #root").first.wait_for(state="visible")
                    if len(page.locator("body").inner_text().strip()) < 40:
                        failures.append(f"{prefix}: page body is unexpectedly empty")

                    document_locale = page.locator("html").get_attribute("lang")
                    if document_locale != locale:
                        failures.append(
                            f"{prefix}: document lang is {document_locale!r}"
                        )

        browser.close()

    if failures:
        raise SystemExit("\n".join(failures))

    print(
        "Frontend smoke passed: "
        f"{len(ROUTES)} routes x {len(LOCALES)} locales x {len(VIEWPORTS)} viewports"
    )


if __name__ == "__main__":
    main()
