from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from agent.pending_intent import (
    PendingIntentResolution,
    is_clarification_question,
    is_resolution_answer,
    resolve_conversational_reference,
)
from agent.planner import build_agent_plan
from agent.runtime import AgentRuntime
from agent.store import AgentStore
from tests.agent.test_migration_advisor import build_registry


class PendingIntentResolutionTests(unittest.TestCase):
    def test_detects_clarification_and_short_answer(self) -> None:
        self.assertTrue(is_clarification_question("Qual componente legado você quer migrar?"))
        self.assertTrue(is_resolution_answer("Button"))
        self.assertFalse(is_resolution_answer("Como migrar um botão legado?"))

    def test_migration_follow_up_resumes_original_task(self) -> None:
        messages = [
            {
                "role": "user",
                "content": "Gere um caminho de migração para este componente legado.",
            },
            {
                "role": "assistant",
                "content": "Qual componente legado você quer migrar?",
            },
            {"role": "user", "content": "Button"},
        ]
        resolution = resolve_conversational_reference(messages)
        self.assertIsNotNone(resolution)
        assert resolution is not None
        self.assertEqual(resolution.action, "generate_migration_path")
        self.assertEqual(resolution.missing_field, "component_name")
        self.assertEqual(resolution.resolution_value, "Button")
        self.assertIn("Button", resolution.resolved_query)
        self.assertEqual(resolution.workflow, "migration_advisor")

    def test_button_without_clarification_is_not_resolved(self) -> None:
        messages = [{"role": "user", "content": "Button"}]
        self.assertIsNone(resolve_conversational_reference(messages))

    def test_compare_follow_up_resumes_comparison(self) -> None:
        messages = [
            {
                "role": "user",
                "content": "Compare Modal versus Drawer para um formulário.",
            },
            {
                "role": "assistant",
                "content": "Qual contexto de uso devo considerar?",
            },
            {"role": "user", "content": "formulário de configurações"},
        ]
        resolution = resolve_conversational_reference(messages)
        self.assertIsNotNone(resolution)
        assert resolution is not None
        self.assertEqual(resolution.action, "compare_components")
        self.assertEqual(resolution.missing_field, "usage_context")


class PendingIntentPlannerRuntimeTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.store = AgentStore(Path(self.temp_dir.name) / "agent.sqlite3")
        self.store.initialize()
        self.runtime = AgentRuntime(
            registry=build_registry(self.store, lambda *args, **kwargs: []),
            store=self.store,
            model="test-model",
        )

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_planner_resumes_migration_after_clarification(self) -> None:
        resolution = PendingIntentResolution(
            action="generate_migration_path",
            missing_field="component_name",
            original_query="Gere um caminho de migração para este componente legado.",
            resolution_value="Button",
            resolved_query=(
                "Gere um caminho de migração para este componente legado. "
                "Componente informado para migração: Button."
            ),
            workflow="migration_advisor",
            professional_category="MIGRATION_ADVISOR",
            retrieval_intent="migration_advisor",
        )
        plan = build_agent_plan(
            "Button",
            pending_resolution=resolution,
        )
        self.assertEqual(plan.workflow, "migration_advisor")
        self.assertEqual(plan.understanding.professional_category, "MIGRATION_ADVISOR")
        self.assertTrue(plan.understanding.entities.components)

    def test_runtime_composes_migration_after_pending_resolution(self) -> None:
        resolution = PendingIntentResolution(
            action="generate_migration_path",
            missing_field="component_name",
            original_query="Gere um caminho de migração para este componente legado.",
            resolution_value="Button",
            resolved_query=(
                "Gere um caminho de migração para este componente legado. "
                "Componente informado para migração: Button."
            ),
            workflow="migration_advisor",
            professional_category="MIGRATION_ADVISOR",
            retrieval_intent="migration_advisor",
        )
        context = self.runtime.prepare(
            query=resolution.resolved_query,
            profile="designer",
            routed_intent="migration_advisor",
            command_mode=None,
            session_id="session_pending",
            project_id="project_a",
            preferred_detail_level="balanced",
            pending_resolution=resolution,
        )
        self.assertTrue(context.should_compose)
        self.assertEqual(context.plan.workflow, "migration_advisor")
        structured = self.runtime.structured_context(context)
        self.assertIn("pending_intent_resolution", structured)
        self.assertIn("migration_advisor_contract", structured)
        self.assertIn("Button", structured)


if __name__ == "__main__":
    unittest.main()
