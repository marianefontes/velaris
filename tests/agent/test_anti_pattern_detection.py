"""Tests for catalog-grounded anti-pattern detection."""

from __future__ import annotations

import unittest

from agent.anti_pattern_detection import detect_catalog_anti_patterns


class AntiPatternDetectionTests(unittest.TestCase):
    def test_toast_critical_error(self) -> None:
        hits = detect_catalog_anti_patterns(
            "usar toast para erro crítico de pagamento"
        )
        self.assertTrue(hits)
        self.assertEqual(hits[0].component_id, "toast")
        self.assertIn("Alert", hits[0].recommended_alternative)

    def test_modal_onboarding_flow(self) -> None:
        hits = detect_catalog_anti_patterns(
            "onboarding de 5 passos com dialog"
        )
        self.assertTrue(any(hit.component_id == "modal-dialog" for hit in hits))

    def test_tooltip_essential_instruction(self) -> None:
        hits = detect_catalog_anti_patterns(
            "colocar instrução obrigatória em tooltip"
        )
        self.assertTrue(any(hit.component_id == "explanation-tooltip" for hit in hits))


if __name__ == "__main__":
    unittest.main()
