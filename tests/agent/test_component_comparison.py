"""Tests for structured Modal vs Drawer comparison."""

from __future__ import annotations

import unittest

from agent.component_comparison import (
    build_modal_drawer_comparison,
    format_component_comparison_response,
    is_modal_drawer_comparison_query,
)


class ModalDrawerComparisonTests(unittest.TestCase):
    def test_detects_entre_pattern(self) -> None:
        query = "me explique a diferença entre modal e drawer"
        self.assertTrue(is_modal_drawer_comparison_query(query))

    def test_detects_vs_pattern(self) -> None:
        self.assertTrue(is_modal_drawer_comparison_query("modal vs drawer"))

    def test_builds_structured_comparison(self) -> None:
        comparison = build_modal_drawer_comparison(
            "me explique a diferença entre modal e drawer"
        )
        self.assertIsNotNone(comparison)
        assert comparison is not None
        self.assertEqual(comparison.rule_id, "modal_vs_drawer")
        self.assertEqual(len(comparison.sides), 2)
        self.assertTrue(comparison.institutional_evidence)

    def test_focus_context_prefers_modal(self) -> None:
        comparison = build_modal_drawer_comparison(
            "modal ou drawer para confirmação crítica bloqueante?",
            english=False,
        )
        self.assertIsNotNone(comparison)
        assert comparison is not None
        self.assertIn("Modal", comparison.recommended_choice)

    def test_format_includes_required_sections(self) -> None:
        comparison = build_modal_drawer_comparison("modal vs drawer")
        self.assertIsNotNone(comparison)
        assert comparison is not None
        text = format_component_comparison_response(comparison, english=False)
        for section in (
            "Objetivo",
            "Melhor escolha",
            "Motivo",
            "Side Drawer",
            "Modal/Dialog",
            "Evidências",
        ):
            self.assertIn(section, text)


if __name__ == "__main__":
    unittest.main()
