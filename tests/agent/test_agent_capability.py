"""Regression tests for agent capability and roadmap capability intents."""

from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from agent.planner import build_agent_plan
from agent.runtime import AgentRuntime
from agent.store import AgentStore
from agent.understanding import analyze_query
from tests.agent.fixtures import fixture_retrieve
from tests.agent.test_runtime import build_registry


OUT_OF_SCOPE_PT = "Não encontrei isso no escopo do Velaris"
OUT_OF_SCOPE_EN = "could not find that in the Velaris scope"


class AgentCapabilityIntentTests(unittest.TestCase):
    ROADMAP_QUERIES = (
        ("você aceita imagens?", "roadmap_capability"),
        ("você analisa screenshot?", "roadmap_capability"),
        ("você consegue ler figma?", "roadmap_capability"),
        ("você consegue analisar uma tela?", "roadmap_capability"),
        ("você consegue interpretar telas?", "roadmap_capability"),
    )

    CAPABILITY_QUERIES = (
        ("quais são suas limitações?", "agent_capability"),
    )

    HELP_QUERIES = (
        ("o que você sabe fazer?", "help_request"),
    )

    def test_mandatory_queries_are_not_out_of_scope(self) -> None:
        for query, expected in (
            *self.ROADMAP_QUERIES,
            *self.CAPABILITY_QUERIES,
            *self.HELP_QUERIES,
        ):
            with self.subTest(query=query):
                understanding = analyze_query(query)
                self.assertEqual(understanding.user_intent, expected)
                self.assertNotEqual(understanding.user_intent, "out_of_scope")
                plan = build_agent_plan(query, understanding=understanding)
                self.assertNotEqual(plan.workflow, "out_of_scope")

    def test_roadmap_queries_use_roadmap_workflow(self) -> None:
        for query, _ in self.ROADMAP_QUERIES:
            with self.subTest(query=query):
                plan = build_agent_plan(query)
                self.assertEqual(plan.workflow, "roadmap_capability")

    def test_limitations_query_uses_agent_capability_workflow(self) -> None:
        plan = build_agent_plan("quais são suas limitações?")
        self.assertEqual(plan.workflow, "agent_capability")


class AgentCapabilityRuntimeTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.store = AgentStore(Path(self.temp_dir.name) / "agent.sqlite3")
        self.store.initialize()
        self.runtime = AgentRuntime(
            registry=build_registry(self.store, retrieve=fixture_retrieve),
            store=self.store,
            model="test-model",
        )

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def prepare(self, query: str):
        return self.runtime.prepare(
            query=query,
            profile="dev",
            routed_intent="general",
            command_mode=None,
            session_id="session_capability",
            project_id="project_a",
            preferred_detail_level="balanced",
        )

    def test_image_question_response(self) -> None:
        context = self.prepare("você aceita imagens?")
        response = context.deterministic_response or ""
        self.assertFalse(context.should_compose)
        self.assertNotIn(OUT_OF_SCOPE_PT, response)
        self.assertIn("imagens", response.lower())
        self.assertIn("futur", response.lower())

    def test_screenshot_question_response(self) -> None:
        context = self.prepare("você analisa screenshot?")
        response = context.deterministic_response or ""
        self.assertNotIn(OUT_OF_SCOPE_PT, response)
        self.assertTrue(
            "screenshot" in response.lower()
            or "imagens" in response.lower()
            or "interfaces visuais" in response.lower()
        )

    def test_figma_question_response(self) -> None:
        context = self.prepare("você consegue ler figma?")
        response = context.deterministic_response or ""
        self.assertNotIn(OUT_OF_SCOPE_PT, response)
        self.assertIn("figma", response.lower())
        self.assertIn("integração", response.lower())

    def test_capabilities_help_response(self) -> None:
        context = self.prepare("o que você sabe fazer?")
        response = context.deterministic_response or ""
        self.assertNotIn(OUT_OF_SCOPE_PT, response)
        for marker in ("componentes", "governança", "acessibilidade", "migra"):
            self.assertIn(marker, response.lower())

    def test_limitations_response(self) -> None:
        context = self.prepare("quais são suas limitações?")
        response = context.deterministic_response or ""
        self.assertNotIn(OUT_OF_SCOPE_PT, response)
        for marker in ("não executa", "não interpreta", "não acessa"):
            self.assertIn(marker, response.lower())

    def test_capability_queries_skip_retrieval(self) -> None:
        retrieval_calls: list[str] = []

        def forbidden_retrieve(
            query: str,
            intent: str,
            top_k: int,
            profile: str,
        ) -> list[dict]:
            del intent, top_k, profile
            retrieval_calls.append(query)
            raise AssertionError("capability intents must not execute retrieval")

        runtime = AgentRuntime(
            registry=build_registry(self.store, retrieve=forbidden_retrieve),
            store=self.store,
            model="test-model",
        )
        for query in (
            "você aceita imagens?",
            "quais são suas limitações?",
        ):
            with self.subTest(query=query):
                retrieval_calls.clear()
                context = runtime.prepare(
                    query=query,
                    profile="dev",
                    routed_intent="general",
                    command_mode=None,
                    session_id="session_capability",
                    project_id="project_a",
                    preferred_detail_level="balanced",
                )
                self.assertEqual(retrieval_calls, [])
                self.assertIsNotNone(context.deterministic_response)
                self.assertEqual(
                    context.audit_metadata().evidence_tier,
                    "not_required",
                )


if __name__ == "__main__":
    unittest.main()
