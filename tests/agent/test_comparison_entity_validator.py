from __future__ import annotations

import unittest

from agent.comparison_entity_validator import (
    blocked_comparison_message,
    validate_comparison_entities,
)
from agent.planner import build_agent_plan
from agent.understanding import analyze_query


class ComparisonEntityValidatorTests(unittest.TestCase):
    def test_blocks_unknown_component_in_comparison(self) -> None:
        result = validate_comparison_entities("Button ou DragonButton?")
        self.assertTrue(result.blocked)
        self.assertIsNotNone(result.resolution)

    def test_blocks_unknown_popover_in_comparison(self) -> None:
        result = validate_comparison_entities("Tooltip vs MagicPopover")
        self.assertTrue(result.blocked)

    def test_allows_canonical_comparison(self) -> None:
        result = validate_comparison_entities("Button ou Link?")
        self.assertFalse(result.blocked)

    def test_routes_blocked_comparison_to_unsupported_lookup(self) -> None:
        understanding = analyze_query("Button ou DragonButton?")
        plan = build_agent_plan("Button ou DragonButton?", understanding=understanding)
        self.assertEqual(understanding.user_intent, "unsupported_entity_lookup")
        self.assertEqual(plan.workflow, "unsupported_entity_lookup")

    def test_blocked_message_pt(self) -> None:
        message = blocked_comparison_message(english=False)
        self.assertIn("evidência suficiente", message.lower())
