"""Acceptance tests for the Abraxos comprehension pipeline."""

from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from agent.comprehension import NON_RAG_INTENTS, PIPELINE_STAGES, comprehend
from agent.concept_registry import CONCEPT_REGISTRY
from agent.migration_alias_registry import PRODUCT_ALIASES
from agent.perspective_registry import PERSPECTIVE_REGISTRY
from agent.runtime import AgentRuntime
from agent.store import AgentStore
from agent.understanding import analyze_query, normalize_query
from prompts.intent_router import route_query
from tests.agent.test_runtime import build_registry


class PipelineStructureTests(unittest.TestCase):
    def test_pipeline_stages_include_out_of_scope_last(self) -> None:
        self.assertEqual(PIPELINE_STAGES[-1], "fallback_to_out_of_scope")
        self.assertIn("normalize_query", PIPELINE_STAGES)
        self.assertIn("resolve_perspective", PIPELINE_STAGES)

    def test_registries_are_loaded(self) -> None:
        self.assertEqual(len(PERSPECTIVE_REGISTRY), 8)
        self.assertIn("abraxos", CONCEPT_REGISTRY)
        self.assertIn("aetheris", PRODUCT_ALIASES)


class GreetingAcceptanceTests(unittest.TestCase):
    GREETINGS = ("oie", "oieee", "oi :)", "olá, Abraxos", "bom dia", "hello")

    def test_greetings_skip_rag(self) -> None:
        for query in self.GREETINGS:
            with self.subTest(query=query):
                result = comprehend(query)
                self.assertEqual(result.understanding.user_intent, "greeting")
                self.assertFalse(result.rag_required)
                self.assertNotEqual(result.understanding.user_intent, "out_of_scope")


class NavigationAcceptanceTests(unittest.TestCase):
    def test_tokens_navigation(self) -> None:
        result = comprehend("onde acho tokens?")
        self.assertIn(
            result.understanding.user_intent,
            {"navigation_query", "semantic_navigation_query"},
        )
        self.assertFalse(result.rag_required)

    def test_cade_componentes(self) -> None:
        understanding = analyze_query("cadê os componentes")
        self.assertEqual(understanding.user_intent, "navigation_query")
        self.assertEqual(understanding.resolved_route, "/components")


class PerspectiveAcceptanceTests(unittest.TestCase):
    CASES = (
        ("onde posso achar a perspectiva de design?", "designer"),
        ("onde fica a parte de QA", "qa"),
        ("quero ver acessibilidade", "a11y"),
        ("onde encontro governança", "design_system_manager"),
        ("mudar para designer", "designer"),
        ("visão de acessibilidade", "a11y"),
    )

    def test_perspective_queries(self) -> None:
        for query, profile_id in self.CASES:
            with self.subTest(query=query):
                understanding = analyze_query(query)
                self.assertEqual(understanding.user_intent, "perspective_lookup")
                self.assertEqual(understanding.resolved_perspective_id, profile_id)


class EntityAndGuidanceAcceptanceTests(unittest.TestCase):
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

    def prepare(self, query: str):
        route = route_query(query)
        return self.runtime.prepare(
            query=query,
            profile="designer",
            routed_intent=route.response_intent,
            command_mode=None,
            session_id="session_comp",
            project_id="project_a",
            preferred_detail_level="balanced",
            understanding=route.understanding,
        )

    def test_button_lookup(self) -> None:
        context = self.prepare("tem Button?")
        self.assertEqual(context.plan.understanding.user_intent, "entity_lookup")
        self.assertIsNotNone(context.navigation_action)

    def test_radio_button_guidance_is_direct(self) -> None:
        context = self.prepare("quando usar Radio Button?")
        response = context.deterministic_response or ""
        self.assertNotIn("Correspondência parcial", response)
        self.assertIn("Radio Button", response)
        self.assertIsNotNone(context.navigation_action)

    def test_radio_buton_typo_resolves(self) -> None:
        understanding = analyze_query("quando usar radio buton?")
        self.assertEqual(understanding.user_intent, "direct_entity_guidance")
        self.assertTrue(understanding.exact_entity_matches)
        self.assertEqual(understanding.exact_entity_matches[0].name, "Radio Button")

    def test_single_choice_recommendation(self) -> None:
        query = "qual componente uso para escolher apenas uma opção entre várias?"
        context = self.prepare(query)
        response = context.deterministic_response or ""
        self.assertIn("Radio Button", response)
        self.assertIn("Select", response)
        self.assertNotIn("Checkbox", response.replace("Não use Checkbox", ""))


class ConceptAcceptanceTests(unittest.TestCase):
    def test_abraxos_concept(self) -> None:
        understanding = analyze_query("o que é Abraxos?")
        self.assertEqual(understanding.user_intent, "concept_query")
        result = comprehend("o que é Abraxos?")
        self.assertFalse(result.rag_required)

    def test_aetheris_legacy_navigation(self) -> None:
        understanding = analyze_query("onde fica Aetheris?")
        self.assertEqual(understanding.user_intent, "navigation_query")
        self.assertIsNotNone(understanding.resolved_route)


class OutOfScopeAcceptanceTests(unittest.TestCase):
    def test_real_out_of_scope(self) -> None:
        understanding = analyze_query("qual a previsão do tempo?")
        self.assertEqual(understanding.user_intent, "out_of_scope")

    def test_internal_terms_never_out_of_scope(self) -> None:
        for query in (
            "oie",
            "onde posso achar a perspectiva de design",
            "o que é Abraxos?",
            "tem Button?",
        ):
            with self.subTest(query=query):
                self.assertNotEqual(analyze_query(query).user_intent, "out_of_scope")


class NormalizationAcceptanceTests(unittest.TestCase):
    def test_oieee_normalizes_to_greeting(self) -> None:
        self.assertEqual(normalize_query("oieee"), "oi")

    def test_cade_tokens_typo(self) -> None:
        self.assertIn("token", normalize_query("cadê os token?"))


if __name__ == "__main__":
    unittest.main()
