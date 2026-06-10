"""Regression tests for the chat recovery fixes.

Covers the mandatory scenarios from the Abraxos/Beatrice blocking bug:
help questions must not fall into out_of_scope, documented components must
never return "insufficient" or the generic governed-retrieval failure, and
technical retrieval errors must degrade to the canonical catalog instead of
blocking every answer.
"""

from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from agent.registry import ToolRegistry
from agent.runtime import AgentRuntime
from agent.store import AgentStore
from agent.understanding import analyze_query
from agent.planner import build_agent_plan
from tests.agent.test_runtime import build_registry
from tests.agent.fixtures import fixture_retrieve


GENERIC_FAILURE_PT = "recuperação governada"
GENERIC_FAILURE_EN = "governed evidence retrieval"


def broken_retrieve(query: str, intent: str, top_k: int, profile: str) -> list[dict]:
    raise RuntimeError("simulated embedding failure")


def empty_retrieve(query: str, intent: str, top_k: int, profile: str) -> list[dict]:
    return []


class RuntimeHarness(unittest.TestCase):
    retrieve = staticmethod(fixture_retrieve)

    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.store = AgentStore(Path(self.temp_dir.name) / "agent.sqlite3")
        self.store.initialize()
        self.runtime = AgentRuntime(
            registry=build_registry(self.store, retrieve=self.retrieve),
            store=self.store,
            model="test-model",
        )

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def prepare(self, query: str, routed_intent: str = "general"):
        return self.runtime.prepare(
            query=query,
            profile="dev",
            routed_intent=routed_intent,
            command_mode=None,
            session_id="session_a",
            project_id="project_a",
            preferred_detail_level="balanced",
        )


class HelpRequestTests(RuntimeHarness):
    HELP_QUERIES = (
        "você pode me ajudar com o que?",
        "o que você faz?",
        "como você pode me ajudar?",
        "quais perguntas posso fazer?",
        "what can you help me with?",
    )

    def test_help_questions_are_not_out_of_scope(self) -> None:
        for query in self.HELP_QUERIES:
            with self.subTest(query=query):
                understanding = analyze_query(query)
                self.assertEqual(understanding.user_intent, "help_request")
                self.assertEqual(
                    understanding.answer_strategy, "documentation_help"
                )

    def test_help_question_gets_capabilities_response(self) -> None:
        context = self.prepare("você pode me ajudar com o que?")
        self.assertFalse(context.should_compose)
        self.assertIsNotNone(context.deterministic_response)
        response = context.deterministic_response
        for capability in ("omponente", "okens", "atterns", "cessibilidade"):
            self.assertIn(capability, response)
        self.assertNotIn(GENERIC_FAILURE_PT, response)
        run = self.store.get_run(context.request_id)
        self.assertEqual(run["status"], "completed")

    def test_help_does_not_execute_retrieval_or_require_evidence(self) -> None:
        retrieval_calls: list[str] = []

        def forbidden_retrieve(
            query: str,
            intent: str,
            top_k: int,
            profile: str,
        ) -> list[dict]:
            del intent, top_k, profile
            retrieval_calls.append(query)
            raise AssertionError("help_request must not execute retrieval")

        runtime = AgentRuntime(
            registry=build_registry(self.store, retrieve=forbidden_retrieve),
            store=self.store,
            model="test-model",
        )
        context = runtime.prepare(
            query="você pode me ajudar com o que?",
            profile="dev",
            routed_intent="general",
            command_mode=None,
            session_id="session_help",
            project_id="project_a",
            preferred_detail_level="balanced",
        )

        self.assertEqual(retrieval_calls, [])
        self.assertIsNone(context.execution)
        self.assertEqual(context.audit_metadata().evidence_tier, "not_required")

    def test_help_with_named_component_still_resolves_component(self) -> None:
        understanding = analyze_query("pode me ajudar com o button?")
        self.assertEqual(understanding.user_intent, "component_recommendation")
        self.assertIn("Button", understanding.entities.components)


class GreetingTests(RuntimeHarness):
    GREETINGS = (
        "oi",
        "oie",
        "oii",
        "olá",
        "ola",
        "hey",
        "hello",
        "bom dia",
        "boa tarde",
        "boa noite",
    )

    def test_greetings_have_explicit_intent(self) -> None:
        for query in self.GREETINGS:
            with self.subTest(query=query):
                understanding = analyze_query(query)
                self.assertEqual(understanding.user_intent, "greeting")
                self.assertNotEqual(understanding.user_intent, "out_of_scope")

    def test_greeting_is_deterministic_without_retrieval(self) -> None:
        retrieval_calls: list[str] = []

        def forbidden_retrieve(
            query: str,
            intent: str,
            top_k: int,
            profile: str,
        ) -> list[dict]:
            del intent, top_k, profile
            retrieval_calls.append(query)
            raise AssertionError("greeting must not execute retrieval")

        runtime = AgentRuntime(
            registry=build_registry(self.store, retrieve=forbidden_retrieve),
            store=self.store,
            model="test-model",
        )
        context = runtime.prepare(
            query="oi",
            profile="dev",
            routed_intent="general",
            command_mode=None,
            session_id="session_greeting",
            project_id="project_a",
            preferred_detail_level="balanced",
        )

        self.assertEqual(retrieval_calls, [])
        self.assertEqual(context.plan.workflow, "greeting")
        self.assertFalse(context.should_compose)
        self.assertIsNone(context.execution)
        self.assertEqual(
            context.deterministic_response,
            "Olá. Posso ajudar com componentes, tokens, padrões, perspectivas, "
            "acessibilidade, auditorias e decisões do Velaris.",
        )
        audit = context.audit_metadata(execution_status="completed")
        self.assertEqual(audit.evidence_tier, "not_required")
        self.assertEqual(audit.tools_used, [])
        self.assertEqual(audit.sources, [])


class ComponentResolutionTests(RuntimeHarness):
    DIRECT_GUIDANCE_QUERIES = (
        "como usar o button?",
        "me diga como usar o button",
        "quando usar botão?",
    )
    RECOMMENDATION_QUERIES = (
        "qual botão devo usar?",
        "button usage",
    )

    def test_button_guidance_queries_use_direct_entity_guidance(self) -> None:
        for query in self.DIRECT_GUIDANCE_QUERIES:
            with self.subTest(query=query):
                understanding = analyze_query(query)
                self.assertIn("Button", understanding.entities.components)
                plan = build_agent_plan(query, understanding=understanding)
                self.assertEqual(plan.workflow, "direct_entity_guidance")

    def test_button_recommendation_queries_use_component_decision(self) -> None:
        for query in self.RECOMMENDATION_QUERIES:
            with self.subTest(query=query):
                understanding = analyze_query(query)
                self.assertIn("Button", understanding.entities.components)
                plan = build_agent_plan(query, understanding=understanding)
                self.assertEqual(plan.workflow, "component_decision")

    def test_alias_normalization_pt_en(self) -> None:
        cases = {
            "quando usar botões?": "Button",
            "como uso o diálogo?": "Modal/Dialog",
            "notificação de sucesso": "Toast/Notification",
            "campo de texto obrigatório": "Input / Text Input",
            "text field with mask": "Input / Text Input",
        }
        for query, expected in cases.items():
            with self.subTest(query=query):
                understanding = analyze_query(query)
                self.assertIn(expected, understanding.entities.components)


class CatalogFallbackTests(RuntimeHarness):
    retrieve = staticmethod(empty_retrieve)

    def test_button_answers_from_catalog_when_rag_empty(self) -> None:
        context = self.prepare("me diga como usar o button")
        self.assertFalse(context.should_compose)
        response = context.deterministic_response or ""
        self.assertIn("Button", response)
        self.assertNotIn(GENERIC_FAILURE_PT, response)

    def test_when_not_to_use_button_resolves_limits(self) -> None:
        context = self.prepare("quando não usar button?")
        self.assertFalse(context.should_compose)
        response = context.deterministic_response or ""
        self.assertIn("Button", response)
        self.assertNotIn(GENERIC_FAILURE_PT, response)

    def test_nonexistent_component_gets_not_found_message(self) -> None:
        context = self.prepare("qual componente uso para confirmação?")
        self.assertFalse(context.should_compose)
        response = context.deterministic_response
        self.assertIn("catálogo", response)
        self.assertNotIn(GENERIC_FAILURE_PT, response)

    def test_audit_metadata_never_insufficient_with_catalog_match(self) -> None:
        context = self.prepare("me diga como usar o button")
        audit = context.audit_metadata()
        self.assertEqual(audit.evidence_tier, "not_required")

    def test_modal_vs_drawer_composes_from_catalog_when_rag_empty(self) -> None:
        context = self.prepare(
            "me explique a diferença entre modal e drawer",
            routed_intent="comparison_query",
        )
        self.assertTrue(context.should_compose)
        selection = context.component_selection
        self.assertIsNotNone(selection)
        self.assertEqual(
            selection.recommended.component.name, "Modal/Dialog"
        )
        self.assertEqual(
            selection.recommended.evidence_source, "canonical_catalog"
        )


class TechnicalFailureTests(RuntimeHarness):
    retrieve = staticmethod(broken_retrieve)

    def test_broken_rag_still_answers_button_from_catalog(self) -> None:
        context = self.prepare("me diga como usar o button")
        self.assertFalse(context.should_compose)
        response = context.deterministic_response or ""
        self.assertIn("Button", response)
        self.assertNotIn(GENERIC_FAILURE_PT, response)

    def test_broken_rag_non_component_returns_technical_message(self) -> None:
        context = self.prepare("qual padrão usar para onboarding?")
        self.assertFalse(context.should_compose)
        response = context.deterministic_response
        self.assertIn("base de evidências", response)
        self.assertNotIn(GENERIC_FAILURE_PT, response)
        self.assertNotIn(GENERIC_FAILURE_EN, response)

    def test_generic_governed_message_never_returned(self) -> None:
        for query in (
            "me diga como usar o button",
            "qual token de cor primária?",
            "qual padrão usar para onboarding?",
            "me explique a diferença entre modal e drawer",
        ):
            with self.subTest(query=query):
                context = self.prepare(query)
                response = context.deterministic_response or ""
                self.assertNotIn(GENERIC_FAILURE_PT, response)
                self.assertNotIn(GENERIC_FAILURE_EN, response)


class MandatoryRoutingTests(RuntimeHarness):
    def test_primary_action_recommendation(self) -> None:
        understanding = analyze_query("qual componente uso para ação principal?")
        self.assertEqual(
            understanding.user_intent, "component_recommendation"
        )
        context = self.prepare("qual componente uso para ação principal?")
        self.assertEqual(context.plan.workflow, "component_decision")
        self.assertTrue(context.should_compose)
        self.assertIsNotNone(context.component_selection.recommended)

    def test_primary_color_token_routes_to_token_lookup(self) -> None:
        understanding = analyze_query("qual token de cor primária?")
        self.assertEqual(understanding.user_intent, "token_lookup")
        context = self.prepare("qual token de cor primária?")
        self.assertEqual(context.plan.workflow, "token_lookup")
        self.assertTrue(context.should_compose)

    def test_modal_vs_drawer_compares_without_blocking(self) -> None:
        query = "me explique a diferença entre modal e drawer"
        understanding = analyze_query(query)
        self.assertEqual(understanding.user_intent, "component_comparison")
        context = self.prepare(query, routed_intent="comparison_query")
        self.assertEqual(context.plan.workflow, "compare_options")
        self.assertTrue(context.should_compose)

    def test_capital_of_france_is_out_of_scope(self) -> None:
        understanding = analyze_query("qual a capital da França?")
        self.assertEqual(understanding.user_intent, "out_of_scope")
        context = self.prepare("qual a capital da França?")
        self.assertFalse(context.should_compose)
        self.assertIn("escopo do Velaris", context.deterministic_response or "")
        self.assertEqual(context.audit_metadata().evidence_tier, "not_required")
        run = self.store.get_run(context.request_id)
        self.assertEqual(run["status"], "blocked")


if __name__ == "__main__":
    unittest.main()
