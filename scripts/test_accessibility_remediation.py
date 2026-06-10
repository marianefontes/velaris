import json
import os
import re
import ssl
import urllib.request

from playwright.sync_api import Page, sync_playwright


APP_BASE = os.environ.get("APP_BASE", "http://127.0.0.1:4173")
AXE_URL = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.3/axe.min.js"

ROUTES = [
    "/main",
    "/components",
    "/foundations",
    "/foundations?focus=foundations",
    "/foundations?focus=patterns",
    "/foundations?focus=tokens",
    "/architecture",
    "/oracle",
    "/perspectives",
]

AXE_ROUTES = [
    "/main",
    "/components",
    "/foundations",
    "/foundations?focus=foundations",
    "/foundations?focus=patterns",
    "/foundations?focus=tokens",
    "/architecture",
    "/oracle",
    "/perspectives",
]

VIEWPORTS = [
    {"width": 320, "height": 720},
    {"width": 390, "height": 844},
    {"width": 768, "height": 900},
    {"width": 1280, "height": 800},
    {"width": 1440, "height": 900},
]


def open_route(page: Page, route: str) -> None:
    page.goto(f"{APP_BASE}{route}", wait_until="domcontentloaded")
    page.wait_for_selector("#main-content")
    page.wait_for_selector("h1")
    page.wait_for_timeout(350)


def assert_page_structure(page: Page, route: str) -> None:
    main_count = page.locator("main").count()
    h1_count = page.locator("h1").count()
    assert main_count == 1, f"{route}: expected one main, found {main_count}"
    assert h1_count == 1, f"{route}: expected one h1, found {h1_count}"


def assert_no_root_overflow(page: Page, route: str, width: int) -> None:
    metrics = page.evaluate(
        """() => ({
          documentClient: document.documentElement.clientWidth,
          documentScroll: document.documentElement.scrollWidth,
          bodyClient: document.body.clientWidth,
          bodyScroll: document.body.scrollWidth,
        })"""
    )
    if metrics["documentScroll"] > metrics["documentClient"] + 1:
        offenders = page.evaluate(
            """() => {
              const isClipped = (element) => {
                let ancestor = element.parentElement;
                while (ancestor && ancestor !== document.body) {
                  const overflowX = getComputedStyle(ancestor).overflowX;
                  if (overflowX === "auto" || overflowX === "scroll" || overflowX === "hidden") {
                    return true;
                  }
                  ancestor = ancestor.parentElement;
                }
                return false;
              };
              return Array.from(document.querySelectorAll("*"))
              .map((element) => {
                const rect = element.getBoundingClientRect();
                return {
                  tag: element.tagName,
                  className: String(element.className).slice(0, 180),
                  left: Math.round(rect.left),
                  right: Math.round(rect.right),
                  width: Math.round(rect.width),
                  scrollWidth: element.scrollWidth,
                  clientWidth: element.clientWidth,
                  ancestors: Array.from({ length: 5 }).reduce((items, _, index) => {
                    const ancestor = index === 0
                      ? element.parentElement
                      : items[index - 1]?.node?.parentElement;
                    if (!ancestor) return items;
                    const ancestorRect = ancestor.getBoundingClientRect();
                    return [...items, {
                      node: ancestor,
                      tag: ancestor.tagName,
                      className: String(ancestor.className).slice(0, 100),
                      left: Math.round(ancestorRect.left),
                      right: Math.round(ancestorRect.right),
                      width: Math.round(ancestorRect.width),
                      overflowX: getComputedStyle(ancestor).overflowX,
                    }];
                  }, []).map(({ node, ...item }) => item),
                };
              })
              .filter((item, index) => {
                const element = document.querySelectorAll("*")[index];
                return item.right > document.documentElement.clientWidth + 1 && !isClipped(element);
              })
              .slice(0, 4);
            }"""
        )
        raise AssertionError(
            f"{route} at {width}px: document overflow {metrics}; offenders={offenders}"
        )
    assert metrics["bodyScroll"] <= metrics["bodyClient"] + 1, (
        f"{route} at {width}px: body overflow {metrics}"
    )


def assert_skip_link(page: Page) -> None:
    open_route(page, "/main")
    page.evaluate(
        """() => {
          document.body.setAttribute("tabindex", "-1");
          document.body.focus();
          document.body.removeAttribute("tabindex");
        }"""
    )
    page.keyboard.press("Tab")
    focused = page.evaluate(
        """() => ({
          text: document.activeElement?.textContent?.trim(),
          href: document.activeElement?.getAttribute("href"),
        })"""
    )
    assert focused["href"] == "#main-content", f"skip link was not first: {focused}"
    page.keyboard.press("Enter")
    assert page.evaluate("document.activeElement?.id") == "main-content"


def assert_critical_labels(page: Page) -> None:
    page.set_viewport_size({"width": 390, "height": 844})
    open_route(page, "/main")
    profile_trigger = page.get_by_role("button", name=re.compile("perspectiva", re.IGNORECASE))
    assert profile_trigger.count() >= 1, "persona profile trigger has no accessible name"
    assert profile_trigger.first.get_attribute("aria-expanded") == "false"

    open_route(page, "/perspectives")
    assert page.get_by_role("slider", name="Tecnicalidade").count() == 1
    assert page.get_by_role("slider", name="Sensibilidade a risco").count() == 1

    open_route(page, "/oracle")
    assert page.get_by_role("textbox", name="Pergunta para a Beatrice").count() == 1
    send = page.get_by_role("button", name="Enviar pergunta à Beatrice")
    assert send.count() == 1
    assert send.is_disabled()


def assert_reduced_motion(browser) -> None:
    context = browser.new_context(
        viewport={"width": 1280, "height": 800},
        reduced_motion="reduce",
    )
    page = context.new_page()
    open_route(page, "/main")
    animation_names = page.locator(".mesh-blob").evaluate_all(
        "(nodes) => nodes.map((node) => getComputedStyle(node).animationName)"
    )
    assert animation_names and all(name == "none" for name in animation_names), animation_names

    open_route(page, "/oracle")
    continuous = page.locator(".animate-pulse, .animate-spin, .animate-ping").evaluate_all(
        "(nodes) => nodes.map((node) => getComputedStyle(node).animationName)"
    )
    assert all(name == "none" for name in continuous), continuous
    context.close()


def load_axe_source() -> str | None:
    try:
        context = ssl._create_unverified_context()
        with urllib.request.urlopen(AXE_URL, timeout=15, context=context) as response:
            return response.read().decode("utf-8")
    except Exception as error:
        print(f"AXE_SKIPPED {error}")
        return None


def run_axe(page: Page, axe_source: str) -> list[dict]:
    page.add_script_tag(content=axe_source)
    return page.evaluate(
        """async () => {
          const result = await axe.run(document, {
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
          });
          return result.violations
            .filter((violation) => ["critical", "serious"].includes(violation.impact))
            .map((violation) => ({
              id: violation.id,
              impact: violation.impact,
              help: violation.help,
              targets: violation.nodes.flatMap((node) => node.target),
            }));
        }"""
    )


def main() -> None:
    axe_source = load_axe_source()
    axe_failures: dict[str, list[dict]] = {}

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(viewport=VIEWPORTS[0])
        page = context.new_page()

        assert_skip_link(page)
        assert_critical_labels(page)

        for viewport in VIEWPORTS:
            page.set_viewport_size(viewport)
            for route in ROUTES:
                open_route(page, route)
                assert_page_structure(page, route)
                assert_no_root_overflow(page, route, viewport["width"])

        assert_reduced_motion(browser)

        if axe_source:
            page.set_viewport_size({"width": 1280, "height": 800})
            for route in AXE_ROUTES:
                open_route(page, route)
                violations = run_axe(page, axe_source)
                if violations:
                    axe_failures[route] = violations

        context.close()
        browser.close()

    if axe_failures:
        print("AXE_FAILURES")
        print(json.dumps(axe_failures, indent=2, ensure_ascii=False))
        raise AssertionError("Axe found critical or serious violations")

    print("ACCESSIBILITY_REMEDIATION_OK")


if __name__ == "__main__":
    main()
