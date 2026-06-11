from __future__ import annotations

import unittest

from agent.ui_leak_guard import (
    contains_internal_audit_leak,
    contains_ui_prompt_leak,
    sanitize_assistant_content,
)


class UiLeakGuardTests(unittest.TestCase):
    def test_detects_placeholder_leak(self) -> None:
        leak = "Pergunta para o Abraxos sobre esta seção"
        self.assertTrue(contains_ui_prompt_leak(leak))

    def test_sanitize_removes_leak_lines(self) -> None:
        polluted = (
            "Use Radio Button para poucas opções.\n"
            "Pergunta para o Abraxos sobre esta seção\n"
            "Veja também Select."
        )
        cleaned = sanitize_assistant_content(polluted)
        self.assertNotIn("Pergunta para o Abraxos", cleaned)
        self.assertIn("Radio Button", cleaned)

    def test_detects_canonical_intent_audit_leak(self) -> None:
        leak = "Limitação: o intent canônico não está documentado."
        self.assertTrue(contains_internal_audit_leak(leak))

    def test_sanitize_removes_internal_audit_lines(self) -> None:
        polluted = (
            "Componente recomendado: Dialog\n\n"
            "Motivo\nStatus: active.\n\n"
            "Evidência\nRetrieval evidence tier: strong."
        )
        cleaned = sanitize_assistant_content(polluted)
        self.assertNotIn("Retrieval evidence tier", cleaned)
        self.assertIn("Dialog", cleaned)


if __name__ == "__main__":
    unittest.main()
