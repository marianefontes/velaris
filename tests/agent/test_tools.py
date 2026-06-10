from __future__ import annotations

import sys
import unittest

from agent.registry import ToolRegistry
from agent.tools import (
    build_compare_design_options_tool,
    build_search_component_tool,
    build_search_design_decision_tool,
    build_search_explainability_tool,
    build_search_pattern_tool,
    build_search_token_tool,
    build_validate_design_system_tool,
)
from tests.agent.fixtures import fixture_retrieve


class AgentToolContractTests(unittest.TestCase):
    def setUp(self) -> None:
        self.registry = ToolRegistry()
        for tool in (
            build_search_component_tool(fixture_retrieve),
            build_search_design_decision_tool(fixture_retrieve),
            build_search_explainability_tool(fixture_retrieve),
            build_search_pattern_tool(fixture_retrieve),
            build_search_token_tool(fixture_retrieve),
            build_compare_design_options_tool(fixture_retrieve),
            build_validate_design_system_tool(fixture_retrieve),
        ):
            self.registry.register(tool)

    def test_unit_tools_do_not_load_bge_m3(self) -> None:
        self.assertNotIn("FlagEmbedding", sys.modules)

    def test_read_only_tools_are_declared_read_only(self) -> None:
        self.assertTrue(all(
            definition.status == "read_only"
            for definition in self.registry.definitions()
        ))

    def test_search_results_only_use_fixture_sources(self) -> None:
        result = self.registry.execute("search_component", {
            "query": "confirmation",
            "profile": "general",
        })
        self.assertEqual(
            {item.source for item in result.items},
            {"data/component-metadata.json"},
        )

    def test_comparison_returns_grounded_tradeoff_signals(self) -> None:
        result = self.registry.execute("compare_design_options", {
            "option_a": "Modal",
            "option_b": "Drawer",
            "context": "form",
            "profile": "designer",
        })
        self.assertTrue(result.tradeoff_signals)
        self.assertEqual(
            result.tradeoff_signals[0].source_titles,
            ["Modal versus Drawer"],
        )

    def test_validation_returns_guideline_backed_candidates(self) -> None:
        result = self.registry.execute("validate_against_design_system", {
            "subject": "Button with hardcoded red and no focus",
            "profile": "dev",
        })
        self.assertTrue(result.possible_violations)
        source_titles = {
            title
            for statement in result.possible_violations
            for title in statement.source_titles
        }
        self.assertIn("Button destructive state", source_titles)

    def test_empty_retrieval_reports_insufficient_evidence(self) -> None:
        empty_registry = ToolRegistry()
        empty_registry.register(build_search_component_tool(
            lambda query, intent, top_k, profile: [],
        ))
        result = empty_registry.execute("search_component", {"query": "Unknown"})
        self.assertEqual(result.evidence_tier, "insufficient")
        self.assertTrue(result.limitations)


if __name__ == "__main__":
    unittest.main()
