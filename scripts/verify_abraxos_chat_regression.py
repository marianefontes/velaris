from __future__ import annotations

import os
import sys

from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
from playwright.sync_api import sync_playwright


EXPECTED_GREETING = (
    "Olá. Posso ajudar com componentes, tokens, padrões, perspectivas, acessibilidade, "
    "auditorias e decisões do Velaris."
)


def main() -> None:
    expected_state = sys.argv[1]
    if expected_state not in {"online", "offline"}:
        raise SystemExit("usage: verify_abraxos_chat_regression.py online|offline")

    health_logs: list[str] = []
    frontend_url = os.environ.get("FRONTEND_URL", "http://127.0.0.1:5173")
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page()
        page.on(
            "console",
            lambda message: health_logs.append(message.text)
            if "[abraxos:health]" in message.text
            else None,
        )
        page.goto(f"{frontend_url}/oracle", wait_until="networkidle")
        page.evaluate("window.localStorage.clear()")
        page.reload(wait_until="networkidle")

        composer = page.locator("#beatrice-chat-input")
        composer.fill("oi")
        composer.press("Enter")

        if expected_state == "online":
            page.get_by_text(EXPECTED_GREETING, exact=True).wait_for(
                state="visible",
                timeout=10_000,
            )
            body = page.locator("body").inner_text()
            assert "Greeting" in body
            assert "Out Of Scope" not in body
            assert "evidência: insufficient" not in body
            assert "Abraxos está offline" not in body
        else:
            try:
                page.get_by_text(
                    "Abraxos está offline. Inicie o servidor da API:",
                    exact=False,
                ).wait_for(state="visible", timeout=20_000)
            except PlaywrightTimeoutError:
                print(page.locator("body").inner_text())
                for entry in health_logs:
                    print(entry)
                raise

        print(f"browser_state={expected_state}")
        for entry in health_logs:
            print(entry)
        browser.close()


if __name__ == "__main__":
    main()
