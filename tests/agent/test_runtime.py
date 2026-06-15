from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from agent.registry import ToolRegistry
from agent.runtime import AgentRuntime
from agent.store import AgentStore
from agent.tools import (
    build_compare_design_options_tool,
    build_create_decision_record_tool,
    build_search_component_tool,
    build_search_design_decision_tool,
    build_search_explainability_tool,
    build_search_pattern_tool,
    build_search_token_tool,
    build_validate_design_system_tool,
)
from tests.agent.fixtures import fixture_retrieve


def build_registry(store: AgentStore, retrieve=fixture_retrieve) -> ToolRegistry:
    registry = ToolRegistry()
    for tool in (
        build_search_component_tool(retrieve),
        build_search_design_decision_tool(retrieve),
        build_search_explainability_tool(retrieve),
        build_search_pattern_tool(retrieve),
        build_search_token_tool(retrieve),
        build_compare_design_options_tool(retrieve),
        build_validate_design_system_tool(retrieve),
        build_create_decision_record_tool(store),
    ):
        registry.register(tool)
    return registry


class AgentFlowEndToEndTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.store = AgentStore(Path(self.temp_dir.name) / "agent.sqlite3")
        self.store.initialize()
        self.runtime = AgentRuntime(
            registry=build_registry(self.store),
            store=self.store,
            model="test-model",
        )

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def prepare(self, query: str, routed_intent: str = "general"):
        return self.runtime.prepare(
            query=query,
            profile="designer",
            routed_intent=routed_intent,
            command_mode=None,
            session_id="session_a",
            project_id="project_a",
            preferred_detail_level="balanced",
        )

    def test_component_decision_creates_draft_after_success(self) -> None:
        context = self.prepare(
            "Qual componente usar para confirmação?",
            "component_guidance",
        )
        self.assertTrue(context.should_compose)
        self.runtime.start_composition(context)
        final = self.runtime.finalize_success(context, "Use Dialog.")
        self.assertEqual(final.workflow, "component_decision")
        self.assertEqual(final.recommended_component, "Modal/Dialog")
        self.assertEqual(final.recommended_component_id, "modal-dialog")
        self.assertEqual(final.component_status, "stable")
        self.assertTrue(final.used_do_rules)
        self.assertTrue(final.used_dont_rules)
        self.assertIn("intent", final.missing_component_fields)
        self.assertEqual(final.decision_status, "draft")
        self.assertIsNotNone(final.decision_id)
        self.assertIn("decision_draft_created", [step.id for step in final.steps])
        self.assertIn("memory_updated", [step.id for step in final.steps])
        self.assertEqual(
            self.store.get_decision(final.decision_id)["recommendation"],
            "Use Dialog.",
        )

    def test_design_audit_uses_validation_tool(self) -> None:
        context = self.prepare(
            "Valide este Button com cor hardcoded e sem foco.",
            "component_guidance",
        )
        self.assertEqual(context.plan.workflow, "design_audit")
        self.assertEqual(context.plan.tools, [])
        self.assertTrue(context.should_compose)

    def test_out_of_scope_never_reaches_composition(self) -> None:
        context = self.prepare("Qual é a previsão do tempo?")
        self.assertFalse(context.should_compose)
        self.assertIn("out_of_scope_blocked", [step.id for step in context.recorder.steps])
        self.assertEqual(self.store.get_run(context.request_id)["status"], "blocked")
        self.assertIsNone(self.store.get_session_memory("session_a"))

    def test_insufficient_evidence_does_not_create_draft_or_memory(self) -> None:
        runtime = AgentRuntime(
            registry=build_registry(self.store, lambda query, intent, top_k, profile: []),
            store=self.store,
            model="test-model",
        )
        context = runtime.prepare(
            query="Qual componente usar?",
            profile="designer",
            routed_intent="component_guidance",
            command_mode=None,
            session_id="session_empty",
            project_id="project_a",
            preferred_detail_level="balanced",
        )
        self.assertFalse(context.should_compose)
        self.assertEqual(context.execution.evidence_tier, "insufficient")
        self.assertEqual(self.store.list_decisions(), [])
        self.assertIsNone(self.store.get_session_memory("session_empty"))

    def test_retrieval_error_does_not_call_composer_or_create_sources(self) -> None:
        def failing_retrieve(query: str, intent: str, top_k: int, profile: str):
            raise RuntimeError("retrieval unavailable")

        runtime = AgentRuntime(
            registry=build_registry(self.store, failing_retrieve),
            store=self.store,
            model="test-model",
        )
        context = runtime.prepare(
            query="Qual componente usar?",
            profile="designer",
            routed_intent="component_guidance",
            command_mode=None,
            session_id="session_error",
            project_id="project_a",
            preferred_detail_level="balanced",
        )
        audit = context.audit_metadata(execution_status="failed")
        self.assertFalse(context.should_compose)
        self.assertEqual(audit.sources, [])
        self.assertIn("tool_execution_failed", [step.id for step in audit.steps])
        self.assertEqual(self.store.list_decisions(), [])

    def test_structured_context_does_not_expose_executable_tools(self) -> None:
        context = self.prepare(
            "Qual componente usar para confirmação?",
            "component_guidance",
        )
        structured = self.runtime.structured_context(context)
        self.assertIn('"tool_results"', structured)
        self.assertNotIn("executor", structured)
        self.assertIn("Do not choose tools", structured)


if __name__ == "__main__":
    unittest.main()
