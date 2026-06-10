from __future__ import annotations

import unittest

from pydantic import ValidationError

from agent.models import SearchComponentInput
from agent.registry import ToolRegistry
from agent.tools import build_search_component_tool
from tests.agent.fixtures import fixture_retrieve


class AgentRegistrySchemaTests(unittest.TestCase):
    def test_registers_and_executes_tool_with_validated_output(self) -> None:
        registry = ToolRegistry()
        registry.register(build_search_component_tool(fixture_retrieve))
        result = registry.execute("search_component", {
            "query": "Dialog",
            "profile": "designer",
        })
        self.assertEqual(result.items[0].title, "Dialog")
        self.assertEqual(result.evidence_tier, "strong")

    def test_duplicate_name_is_rejected(self) -> None:
        registry = ToolRegistry()
        tool = build_search_component_tool(fixture_retrieve)
        registry.register(tool)
        with self.assertRaises(ValueError):
            registry.register(tool)

    def test_unknown_input_field_is_rejected(self) -> None:
        with self.assertRaises(ValidationError):
            SearchComponentInput.model_validate({
                "query": "Dialog",
                "invented": True,
            })

    def test_empty_query_is_rejected(self) -> None:
        with self.assertRaises(ValidationError):
            SearchComponentInput.model_validate({"query": ""})


if __name__ == "__main__":
    unittest.main()
