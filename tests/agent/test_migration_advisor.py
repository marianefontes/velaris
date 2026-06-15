from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from agent.migration_advisor import (
    build_migration_advisor_contract,
    contains_migration_intent,
)
from agent.planner import build_agent_plan
from agent.registry import ToolRegistry
from agent.runtime import AgentRuntime
from agent.store import AgentStore
from agent.understanding import analyze_query
from tests.agent.test_professional_intent import build_registry


MIGRATION_ACCEPTANCE_CASES = [
  (
      "Como migrar um botão legado?",
      "MIGRATION_ADVISOR",
      "migration_advisor",
  ),
  (
      "Quero substituir componentes customizados pelos componentes do Velaris.",
      "MIGRATION_ADVISOR",
      "migration_advisor",
  ),
  (
      "Como modernizar nossa interface?",
      "MIGRATION_ADVISOR",
      "migration_advisor",
  ),
  (
      "Gere um caminho de migração para este componente legado.",
      "MIGRATION_ADVISOR",
      "migration_advisor",
  ),
]


class MigrationAdvisorClassificationTests(unittest.TestCase):
    def test_migration_markers(self) -> None:
        self.assertTrue(contains_migration_intent("Como migrar um botão legado?"))
        self.assertTrue(contains_migration_intent("Replace custom buttons with Velaris"))

    def test_acceptance_cases(self) -> None:
        for query, category, workflow in MIGRATION_ACCEPTANCE_CASES:
            with self.subTest(query=query):
                understanding = analyze_query(query)
                plan = build_agent_plan(query, understanding=understanding)
                self.assertEqual(understanding.professional_category, category)
                self.assertEqual(plan.workflow, workflow)
                self.assertEqual(plan.tools, [])


class MigrationAdvisorContractTests(unittest.TestCase):
    def test_named_legacy_button_builds_target_plan(self) -> None:
        understanding = analyze_query("Como migrar deste botão legado para Button?")
        contract = build_migration_advisor_contract(
            query="Como migrar deste botão legado para Button?",
            understanding=understanding,
            profile="designer",
            english=False,
        )
        self.assertEqual(contract["capability"], "MIGRATION_ADVISOR")
        self.assertEqual(contract["recommended_component"], "Button")
        self.assertEqual(contract["recommended_component_id"], "button")
        self.assertGreaterEqual(len(contract["migration_steps"]), 5)
        self.assertIn("Diagnóstico", contract["required_sections"])
        self.assertIn("Caminho de migração", contract["required_sections"])

    def test_generic_custom_migration_has_strategy_without_target(self) -> None:
        understanding = analyze_query(
            "Como migrar um controle customizado para o design system?"
        )
        contract = build_migration_advisor_contract(
            query="Como migrar um controle customizado para o design system?",
            understanding=understanding,
            profile="dev",
            english=False,
        )
        self.assertTrue(contract["legacy_source_detected"])
        self.assertIsNone(contract["recommended_component"])
        self.assertGreaterEqual(len(contract["reasons"]), 3)

    def test_perspective_focus_varies_by_profile(self) -> None:
        query = "Como modernizar nossa interface?"
        understanding = analyze_query(query)
        designer = build_migration_advisor_contract(
            query=query,
            understanding=understanding,
            profile="designer",
            english=False,
        )
        qa = build_migration_advisor_contract(
            query=query,
            understanding=understanding,
            profile="qa",
            english=False,
        )
        self.assertNotEqual(designer["perspective_focus"], qa["perspective_focus"])


class MigrationAdvisorRuntimeTests(unittest.TestCase):
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

    def test_migration_query_is_composable_without_corpus(self) -> None:
        context = self.runtime.prepare(
            query="Como migrar um botão legado?",
            profile="designer",
            routed_intent="migration_advisor",
            command_mode=None,
            session_id="session_migration",
            project_id="project_a",
            preferred_detail_level="balanced",
        )
        self.assertTrue(context.should_compose)
        self.assertIsNone(context.deterministic_response)
        structured = self.runtime.structured_context(context)
        self.assertIn("migration_advisor_contract", structured)
        self.assertIn("Button", structured)


if __name__ == "__main__":
    unittest.main()
