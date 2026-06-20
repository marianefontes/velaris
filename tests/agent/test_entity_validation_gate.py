from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from agent.entity_validation_gate import (
    entity_clarification_response,
    validate_entity_for_capability,
)
from agent.migration_advisor import build_migration_advisor_contract
from agent.planner import build_agent_plan
from agent.runtime import AgentRuntime
from agent.store import AgentStore
from agent.understanding import analyze_query
from tests.agent.test_professional_intent import build_registry


CLARIFICATION_MARKERS = (
    "Não consigo gerar um plano de migração",
    "não foi informado",
    "nome do componente",
)


class EntityValidationGateTests(unittest.TestCase):
    CLARIFICATION_QUERIES = (
        "gere um plano de migração",
        "Gere um caminho de migração para este componente legado",
        "migre este componente legado",
        "como migrar isso?",
    )

    MIGRATION_QUERIES = (
        "como migrar o LegacyModal?",
        "como migrar o OldButton?",
        "Como migrar um botão legado?",
    )

    def test_clarification_queries_need_entity(self) -> None:
        for query in self.CLARIFICATION_QUERIES:
            with self.subTest(query=query):
                understanding = analyze_query(query)
                plan = build_agent_plan(query, understanding=understanding)
                result = validate_entity_for_capability(
                    query,
                    understanding,
                    workflow=plan.workflow,
                )
                self.assertEqual(result.status, "needs_clarification", result)

    def test_named_legacy_queries_validate(self) -> None:
        for query in self.MIGRATION_QUERIES:
            with self.subTest(query=query):
                understanding = analyze_query(query)
                plan = build_agent_plan(query, understanding=understanding)
                result = validate_entity_for_capability(
                    query,
                    understanding,
                    workflow=plan.workflow,
                )
                self.assertEqual(result.status, "validated", result)
                self.assertGreaterEqual(result.confidence, 0.75)

    def test_clarification_response_copy(self) -> None:
        response = entity_clarification_response(
            english=False,
            workflow="migration_advisor",
        )
        for marker in CLARIFICATION_MARKERS:
            self.assertIn(marker, response)
        self.assertIn("Legacy Modal", response)
        self.assertIn("plano de migração", response)
        self.assertIn("não aceita imagens", response)
        self.assertNotIn("screenshot", response.lower())

    def test_migration_contract_forbids_invention_without_entity(self) -> None:
        understanding = analyze_query(
            "Gere um caminho de migração para este componente legado"
        )
        validation = validate_entity_for_capability(
            "Gere um caminho de migração para este componente legado",
            understanding,
            workflow="migration_advisor",
        )
        contract = build_migration_advisor_contract(
            query="Gere um caminho de migração para este componente legado",
            understanding=understanding,
            profile="designer",
            english=False,
            entity_validation=validation,
        )
        self.assertEqual(contract["entity_validation"]["status"], "needs_clarification")
        self.assertIn("Do not recommend a specific catalog component", contract["response_policy"])
        self.assertIsNone(contract.get("recommended_component_id"))


class EntityValidationRuntimeTests(unittest.TestCase):
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

    def test_unspecified_legacy_migration_returns_clarification(self) -> None:
        query = "Gere um caminho de migração para este componente legado"
        context = self.runtime.prepare(
            query=query,
            profile="designer",
            routed_intent="migration_advisor",
            command_mode="migrate",
            session_id="session_gate",
            project_id="project_a",
            preferred_detail_level="balanced",
        )
        self.assertFalse(context.should_compose)
        response = context.deterministic_response or ""
        for marker in CLARIFICATION_MARKERS:
            self.assertIn(marker, response)
        self.assertNotIn("Modal/Dialog", response)

    def test_legacy_modal_migration_is_composable(self) -> None:
        query = "como migrar o LegacyModal?"
        context = self.runtime.prepare(
            query=query,
            profile="designer",
            routed_intent="migration_advisor",
            command_mode=None,
            session_id="session_legacy_modal",
            project_id="project_a",
            preferred_detail_level="balanced",
        )
        self.assertTrue(context.should_compose)
        self.assertIsNotNone(context.entity_validation)
        assert context.entity_validation is not None
        self.assertEqual(context.entity_validation.status, "validated")
        self.assertEqual(context.entity_validation.entity_label, "LegacyModal")
        contract = build_migration_advisor_contract(
            query=query,
            understanding=context.plan.understanding,
            profile="designer",
            english=False,
            entity_validation=context.entity_validation,
        )
        self.assertEqual(contract["recommended_component"], "Modal/Dialog")


if __name__ == "__main__":
    unittest.main()
