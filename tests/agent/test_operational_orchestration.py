from __future__ import annotations

import unittest

import re
import tempfile
from pathlib import Path

from agent.entity_resolution import primary_exact_match, resolve_exact_entity_matches
from agent.evidence import build_component_selection, evidence_from_chunks
from agent.models import ExactEntityMatch
from agent.planner import build_agent_plan
from agent.response_dedup import dedupe_response
from agent.route_map import canonical_route_for_legacy, resolve_navigation_route
from agent.runtime import AgentRuntime
from agent.operational_responses import legacy_name_response
from agent.store import AgentStore
from agent.understanding import analyze_query, normalize_query, normalize_text
from prompts.intent_router import route_query
from tests.agent.test_component_intelligence import component_chunk
from tests.agent.test_runtime import build_registry


class GreetingNormalizationTests(unittest.TestCase):
    NORMALIZATION_CASES = (
        ("Oi", "oi"),
        ("oii", "oi"),
        ("oiii", "oi"),
        ("oie", "oi"),
        ("olááá", "ola"),
        ("olaaa", "ola"),
        ("opa!", "opa"),
        ("e aí?", "e ai"),
        ("eai", "e ai"),
        ("bom diaaa", "bom dia"),
        ("oie!", "oi"),
        ("oi :)", "oi"),
        ("oii ✨", "oi"),
        ("olá, Abraxos", "ola"),
        ("bom dia, Abraxos", "bom dia"),
    )

    def test_normalize_query_collapses_greeting_variants(self) -> None:
        for raw, expected in self.NORMALIZATION_CASES:
            with self.subTest(raw=raw):
                self.assertEqual(normalize_query(raw), expected)


class GreetingIntentTests(unittest.TestCase):
    GREETING_QUERIES = (
        "oi",
        "oie",
        "oii",
        "oiii",
        "oie!",
        "oi :)",
        "olá",
        "olaaa",
        "opa",
        "e aí?",
        "bom dia",
        "boa tarde",
        "boa noite",
        "hi",
        "hello",
        "hey",
        "good morning",
        "good afternoon",
        "good evening",
        "opa, tudo bem?",
    )

    def test_greeting_queries_are_never_out_of_scope(self) -> None:
        for query in self.GREETING_QUERIES:
            with self.subTest(query=query):
                understanding = analyze_query(query)
                self.assertEqual(understanding.user_intent, "greeting")
                self.assertNotEqual(understanding.user_intent, "out_of_scope")

    def test_oie_skips_rag_and_returns_greeting_response(self) -> None:
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

        temp_dir = tempfile.TemporaryDirectory()
        store = AgentStore(Path(temp_dir.name) / "agent.sqlite3")
        store.initialize()
        runtime = AgentRuntime(
            registry=build_registry(store, retrieve=forbidden_retrieve),
            store=store,
            model="test-model",
        )
        try:
            route = route_query("oie")
            context = runtime.prepare(
                query="oie",
                profile="designer",
                routed_intent=route.response_intent,
                command_mode=None,
                session_id="session_oie",
                project_id="project_a",
                preferred_detail_level="concise",
                understanding=route.understanding,
            )
            self.assertEqual(route.understanding.user_intent, "greeting")
            self.assertEqual(context.plan.workflow, "greeting")
            self.assertEqual(retrieval_calls, [])
            self.assertFalse(context.should_compose)
            response = context.deterministic_response or ""
            self.assertNotIn("fora do escopo", response.lower())
            self.assertNotIn("fora do âmbito", response.lower())
            self.assertIn("Velaris", response)
        finally:
            temp_dir.cleanup()


class SmallTalkIntentTests(unittest.TestCase):
    SMALL_TALK_CASES = (
        ("tudo bem?", "Tudo bem. Diz-me o que queres investigar no Velaris."),
        (
            "estás online?",
            "Estou online. Posso ajudar com componentes, tokens, padrões e decisões do Velaris.",
        ),
        (
            "ajudas-me?",
            "Claro. Diz-me se queres encontrar um componente, token, padrão, perspectiva ou decisão do Velaris.",
        ),
        (
            "how are you?",
            "I'm doing well. Tell me what you want to investigate in Velaris.",
        ),
        (
            "are you online?",
            "I'm online. I can help with components, tokens, patterns, and Velaris decisions.",
        ),
        (
            "can you help me?",
            "Of course. Tell me if you want to find a component, token, pattern, perspective, or documented decision in Velaris.",
        ),
    )

    def test_small_talk_queries_are_classified_correctly(self) -> None:
        for query, _ in self.SMALL_TALK_CASES:
            with self.subTest(query=query):
                understanding = analyze_query(query)
                self.assertEqual(understanding.user_intent, "small_talk")
                self.assertNotEqual(understanding.user_intent, "out_of_scope")

    def test_small_talk_returns_expected_responses(self) -> None:
        temp_dir = tempfile.TemporaryDirectory()
        store = AgentStore(Path(temp_dir.name) / "agent.sqlite3")
        store.initialize()
        runtime = AgentRuntime(
            registry=build_registry(store),
            store=store,
            model="test-model",
        )
        try:
            for query, expected in self.SMALL_TALK_CASES:
                with self.subTest(query=query):
                    route = route_query(query)
                    context = runtime.prepare(
                        query=query,
                        profile="designer",
                        routed_intent=route.response_intent,
                        command_mode=None,
                        session_id="session_small_talk",
                        project_id="project_a",
                        preferred_detail_level="concise",
                        understanding=route.understanding,
                    )
                    self.assertEqual(context.plan.workflow, "greeting")
                    self.assertEqual(context.deterministic_response, expected)
        finally:
            temp_dir.cleanup()


class OperationalIntentTests(unittest.TestCase):
    def test_greeting_skips_rag(self) -> None:
        route = route_query("oi")
        plan = build_agent_plan(
            "oi",
            routed_intent=route.response_intent,
            understanding=route.understanding,
        )
        self.assertEqual(route.understanding.user_intent, "greeting")
        self.assertEqual(plan.workflow, "greeting")
        self.assertEqual(plan.tools, [])

    def test_navigation_tokens_returns_canonical_route(self) -> None:
        understanding = analyze_query("onde acho os tokens?")
        self.assertEqual(understanding.user_intent, "navigation_query")
        self.assertEqual(understanding.resolved_route, "/foundations?focus=tokens")
        plan = build_agent_plan(
            "onde acho os tokens?",
            routed_intent="general",
            understanding=understanding,
        )
        self.assertEqual(plan.workflow, "navigation_query")
        self.assertEqual(plan.tools, [])

    def test_navigation_components_returns_components_route(self) -> None:
        understanding = analyze_query("onde vejo os componentes?")
        self.assertEqual(understanding.user_intent, "navigation_query")
        self.assertEqual(understanding.resolved_route, "/components")

    def test_entity_lookup_button(self) -> None:
        understanding = analyze_query("você tem o componente button?")
        self.assertEqual(understanding.user_intent, "entity_lookup")
        self.assertTrue(understanding.exact_entity_matches)
        self.assertEqual(understanding.exact_entity_matches[0].name, "Button")

    def test_entity_lookup_radio_button(self) -> None:
        understanding = analyze_query("tem Radio Button?")
        self.assertEqual(understanding.user_intent, "entity_lookup")
        self.assertEqual(understanding.exact_entity_matches[0].name, "Radio Button")

    def test_guidance_radio_button_is_direct_entity_guidance(self) -> None:
        understanding = analyze_query("quando usar Radio Button?")
        self.assertEqual(understanding.user_intent, "direct_entity_guidance")
        self.assertTrue(understanding.exact_entity_matches)
        plan = build_agent_plan(
            "quando usar Radio Button?",
            routed_intent="component_guidance",
            understanding=understanding,
        )
        self.assertEqual(plan.workflow, "direct_entity_guidance")
        self.assertEqual(plan.tools, [])

    def test_recommendation_mutually_exclusive(self) -> None:
        understanding = analyze_query(
            "qual componente uso para opções mutuamente exclusivas?"
        )
        self.assertEqual(understanding.user_intent, "component_recommendation")
        plan = build_agent_plan(
            "qual componente uso para opções mutuamente exclusivas?",
            routed_intent="component_guidance",
            understanding=understanding,
        )
        self.assertEqual(plan.workflow, "single_choice_recommendation")


class ExactEntityPriorityTests(unittest.TestCase):
    def test_button_never_resolves_to_radio_button(self) -> None:
        exact = primary_exact_match(normalize_text("você tem Button?"))
        self.assertIsNotNone(exact)
        self.assertEqual(exact.name, "Button")

    def test_radio_button_resolves_distinctly(self) -> None:
        exact = primary_exact_match(normalize_text("tem radio button?"))
        self.assertIsNotNone(exact)
        self.assertEqual(exact.name, "Radio Button")

    def test_exact_match_supersedes_semantic_radio_candidate(self) -> None:
        exact = ExactEntityMatch(
            component_id="button",
            name="Button",
            match_type="alias",
            matched_alias="button",
        )
        selection = build_component_selection(
            evidence_from_chunks([
                component_chunk("radio-button", similarity=0.82, weighted_score=0.82),
                component_chunk("button", similarity=0.55, weighted_score=0.55),
            ]),
            query="você tem Button?",
            profile="designer",
            exact_entity_matches=[exact],
            workflow="entity_lookup",
        )
        self.assertIsNotNone(selection.recommended)
        self.assertEqual(selection.recommended.component.component_id, "button")
        rejected_ids = {
            item.component_id
            for item in selection.rejected_components
            if item.reason == "superseded_by_exact_match"
        }
        self.assertIn("radio-button", rejected_ids)


class RouteMapTests(unittest.TestCase):
    def test_legacy_tokens_redirects_to_canonical(self) -> None:
        self.assertEqual(
            canonical_route_for_legacy("/tokens"),
            "/foundations?focus=tokens",
        )

    def test_navigation_route_resolver(self) -> None:
        resolution = resolve_navigation_route("onde acho os tokens?")
        self.assertIsNotNone(resolution)
        self.assertEqual(resolution.route, "/foundations?focus=tokens")


class EvidencePolicyTests(unittest.TestCase):
    def test_partial_without_exact_match_is_not_firm(self) -> None:
        selection = build_component_selection(
            evidence_from_chunks([
                component_chunk("radio-button", similarity=0.62, weighted_score=0.62),
            ]),
            query="qual componente uso para salvar?",
            profile="designer",
            workflow="component_decision",
        )
        self.assertEqual(selection.recommendation_firmness, "partial_match")

    def test_exact_match_is_firm_for_entity_lookup(self) -> None:
        exact = ExactEntityMatch(
            component_id="button",
            name="Button",
            match_type="alias",
            matched_alias="button",
        )
        selection = build_component_selection(
            [],
            query="você tem Button?",
            profile="designer",
            exact_entity_matches=[exact],
            workflow="entity_lookup",
        )
        self.assertEqual(selection.recommendation_firmness, "firm")


class ResponseDedupTests(unittest.TestCase):
    def test_dedupes_repeated_lines(self) -> None:
        text = "Quando usar\nEvite modal\n\nQuando usar\nEvite modal"
        deduped = dedupe_response(text)
        self.assertEqual(deduped.count("Quando usar"), 1)


def _duplicate_sentences(text: str) -> list[str]:
    sentences = [
        part.strip()
        for part in re.split(r"(?<=[.!?])\s+", text.strip())
        if part.strip()
    ]
    normalized = [normalize_text(sentence) for sentence in sentences]
    return [
        sentences[index]
        for index, key in enumerate(normalized)
        if normalized.count(key) > 1 and normalized.index(key) == index
    ]


class Round2AcceptanceTests(unittest.TestCase):
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
            session_id="session_round2",
            project_id="project_a",
            preferred_detail_level="balanced",
        )

    def test_radio_button_guidance_has_no_partial_header(self) -> None:
        context = self.prepare("quando usar Radio Button?")
        response = context.deterministic_response or ""
        self.assertFalse(context.should_compose)
        self.assertNotIn("Correspondência parcial", response)
        self.assertNotIn("Evidence tier", response)
        self.assertIn("Radio Button", response)

    def test_radio_button_guidance_has_no_duplicate_sentences(self) -> None:
        context = self.prepare("quando usar Radio Button?")
        response = context.deterministic_response or ""
        duplicates = _duplicate_sentences(response)
        self.assertEqual(duplicates, [], msg=f"duplicates: {duplicates}")

    def test_single_choice_recommendation_explains_radio_vs_select(self) -> None:
        query = "qual componente uso para escolher apenas uma opção entre várias?"
        understanding = analyze_query(query)
        plan = build_agent_plan(
            query,
            routed_intent="component_guidance",
            understanding=understanding,
        )
        self.assertEqual(plan.workflow, "single_choice_recommendation")
        context = self.prepare(query, routed_intent="component_guidance")
        response = context.deterministic_response or ""
        self.assertIn("Radio Button", response)
        self.assertIn("Select", response)
        self.assertNotIn("Checkbox", response.replace("Não use Checkbox", ""))
        self.assertNotIn("Correspondência parcial", response)

    def test_abraxos_concept_query_in_scope(self) -> None:
        understanding = analyze_query("o que é Abraxos?")
        self.assertEqual(understanding.user_intent, "concept_query")
        context = self.prepare("o que é Abraxos?")
        response = context.deterministic_response or ""
        self.assertNotIn("fora do escopo", response.lower())
        self.assertIn("oráculo contextual", response)

    def test_aetheris_navigation_legacy_alias(self) -> None:
        understanding = analyze_query("onde fica Aetheris?")
        self.assertEqual(understanding.user_intent, "navigation_query")
        context = self.prepare("onde fica Aetheris?")
        response = context.deterministic_response or ""
        self.assertIn("nome anterior", response)
        self.assertIn("Foundations", response)
        self.assertIsNotNone(context.navigation_action)
        assert context.navigation_action is not None
        self.assertEqual(context.navigation_action.href, "/foundations")

    def test_simple_entity_lookup_is_concise(self) -> None:
        context = self.prepare("você tem Button?")
        response = context.deterministic_response or ""
        self.assertIn("Button", response)
        self.assertNotIn("Evidence tier", response)
        self.assertNotIn("Campos ausentes", response)


class MigrationAliasTests(unittest.TestCase):
    def test_beatrice_legacy_name(self) -> None:
        understanding = analyze_query("o que é Beatrice?")
        self.assertEqual(understanding.user_intent, "legacy_name_query")

    def test_aetheris_legacy_name(self) -> None:
        understanding = analyze_query("o que é Aetheris?")
        self.assertEqual(understanding.user_intent, "legacy_name_query")

    def test_runtime_legacy_response_mentions_abraxos(self) -> None:
        response = legacy_name_response(
            english=False,
            legacy="Beatrice",
            current="Abraxos",
        )
        self.assertIn("Abraxos", response)


if __name__ == "__main__":
    unittest.main()
