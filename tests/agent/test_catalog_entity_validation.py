from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from agent.catalog_registries import (
    catalog_registries_health,
    match_accessibility_rule,
    match_guideline,
    match_state,
    match_token,
    match_variant,
    resolve_typed_catalog_entities,
)
from agent.runtime import AgentRuntime
from agent.store import AgentStore
from agent.understanding import analyze_query
from prompts.intent_router import route_query
from tests.agent.test_runtime import build_registry


class CatalogRegistryTests(unittest.TestCase):
    def test_registries_load(self) -> None:
        health = catalog_registries_health()
        self.assertGreater(health["tokens"], 100)
        self.assertGreater(health["patterns"], 10)
        self.assertGreater(health["guidelines"], 10)
        self.assertGreater(health["accessibility_rules"], 15)
        self.assertGreater(health["component_states"], 50)
        self.assertGreater(health["component_variants"], 100)

    def test_known_token_is_supported(self) -> None:
        match = match_token("primary-200")
        self.assertEqual(match.entity_status, "supported")

    def test_unknown_dot_notation_token(self) -> None:
        match = match_token("color.semantic.brand.700")
        self.assertEqual(match.entity_status, "unknown")

    def test_button_loading_state_is_supported(self) -> None:
        match = match_state("loading", component_id="button")
        self.assertEqual(match.entity_status, "supported")

    def test_button_warning_loading_state_is_unknown(self) -> None:
        match = match_state("warning-loading", component_id="button")
        self.assertEqual(match.entity_status, "unknown")

    def test_progressive_disclosure_guideline_is_unknown(self) -> None:
        match = match_guideline("Progressive Disclosure")
        self.assertEqual(match.entity_status, "unknown")

    def test_contrast_legibility_accessibility_rule_is_supported(self) -> None:
        match = match_accessibility_rule("contrast-legibility")
        self.assertEqual(match.entity_status, "supported")
        self.assertEqual(match.entity_label, "Contraste e legibilidade")

    def test_unknown_accessibility_rule(self) -> None:
        match = match_accessibility_rule("focus-trap-invalid")
        self.assertEqual(match.entity_status, "unknown")

    def test_button_ghost_variant_is_unknown(self) -> None:
        match = match_variant("ghost", component_id="button")
        self.assertEqual(match.entity_status, "unknown")


class CatalogEntityIntentTests(unittest.TestCase):
    POLICY_CASES = (
        (
            "Use color.semantic.brand.700",
            "unknown_entity_lookup",
            "token",
        ),
        (
            "Existe o estado warning-loading?",
            "unknown_entity_lookup",
            "state",
        ),
        (
            "Qual guideline define Progressive Disclosure?",
            "unknown_entity_lookup",
            "guideline",
        ),
        (
            "Use o componente WizardStepper",
            "unknown_entity_lookup",
            "component",
        ),
        (
            "Existe a regra focus-trap-invalid?",
            "unknown_entity_lookup",
            "accessibility_rule",
        ),
        (
            "Existe a variante ghost no Button?",
            "unknown_entity_lookup",
            "variant",
        ),
    )

    def test_policy_examples_route_to_catalog_validation(self) -> None:
        for query, expected_intent, expected_type in self.POLICY_CASES:
            with self.subTest(query=query):
                understanding = analyze_query(query)
                self.assertEqual(understanding.user_intent, expected_intent)
                resolution = understanding.catalog_entity_resolution
                self.assertIsNotNone(resolution)
                assert resolution is not None
                self.assertEqual(resolution.entity_status, "unknown")
                if expected_type != "component":
                    self.assertEqual(resolution.entity_type, expected_type)


class CatalogEntityRuntimeTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.store = AgentStore(Path(self.temp_dir.name) / "agent.sqlite3")
        self.store.initialize()
        self.retrieval_calls: list[str] = []

        def forbidden_retrieve(
            query: str,
            intent: str,
            top_k: int,
            profile: str,
        ) -> list[dict]:
            del intent, top_k, profile
            self.retrieval_calls.append(query)
            raise AssertionError("unknown catalog entity must not execute retrieval")

        self.runtime = AgentRuntime(
            registry=build_registry(self.store, retrieve=forbidden_retrieve),
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
            session_id="session_catalog_validation",
            project_id="project_a",
            preferred_detail_level="concise",
            understanding=route.understanding,
        )

    def test_unknown_token_is_deterministic_without_rag(self) -> None:
        context = self.prepare("Use color.semantic.brand.700")
        self.assertEqual(context.plan.workflow, "unknown_entity_lookup")
        self.assertEqual(self.retrieval_calls, [])
        self.assertFalse(context.should_compose)
        response = context.deterministic_response or ""
        self.assertIn("evidência", response.lower())
        self.assertIn("color.semantic.brand.700", response)

    def test_unknown_state_is_deterministic_without_rag(self) -> None:
        context = self.prepare("Existe o estado warning-loading?")
        self.assertEqual(context.plan.workflow, "unknown_entity_lookup")
        self.assertFalse(context.should_compose)
        response = context.deterministic_response or ""
        self.assertIn("warning-loading", response.lower())

    def test_resolve_typed_catalog_entities_finds_unknown_token(self) -> None:
        resolution = resolve_typed_catalog_entities("Use color.semantic.brand.700")
        self.assertIsNotNone(resolution)
        assert resolution is not None
        self.assertEqual(resolution.entity_type, "token")
        self.assertEqual(resolution.entity_status, "unknown")


if __name__ == "__main__":
    unittest.main()
