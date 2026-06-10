from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from agent.navigation_actions import navigation_action_for_perspective
from agent.perspective_registry import PERSPECTIVE_REGISTRY, resolve_perspective_match
from agent.runtime import AgentRuntime
from agent.store import AgentStore
from agent.understanding import analyze_query
from prompts.intent_router import route_query
from tests.agent.test_runtime import build_registry


class PerspectiveRegistryTests(unittest.TestCase):
    def test_registry_covers_all_eight_perspectives(self) -> None:
        expected = {
            "designer",
            "product_designer",
            "a11y",
            "dev",
            "qa",
            "tech_writer",
            "design_system_manager",
            "maintainer",
        }
        self.assertEqual(set(PERSPECTIVE_REGISTRY.keys()), expected)

    def test_design_alias_resolves_to_designer(self) -> None:
        match = resolve_perspective_match("design")
        self.assertIsNotNone(match)
        assert match is not None
        self.assertEqual(match.entry.profile_id, "designer")


class PerspectiveIntentTests(unittest.TestCase):
    CASES = (
        ("onde posso achar a perspectiva de design", "designer"),
        ("onde fica a parte de design", "designer"),
        ("onde mudo para designer", "designer"),
        ("quero ver a visão de acessibilidade", "a11y"),
        ("cadê a parte de QA", "qa"),
        ("onde encontro governança", "design_system_manager"),
        ("onde vejo manutenção", "maintainer"),
        ("perspectiva de produto", "product_designer"),
    )

    def test_perspective_queries_never_fall_into_out_of_scope(self) -> None:
        for query, profile_id in self.CASES:
            with self.subTest(query=query):
                understanding = analyze_query(query)
                self.assertEqual(understanding.user_intent, "perspective_lookup")
                self.assertNotEqual(understanding.user_intent, "out_of_scope")
                self.assertEqual(understanding.resolved_perspective_id, profile_id)

    def test_designer_query_returns_navigation_action(self) -> None:
        temp_dir = tempfile.TemporaryDirectory()
        store = AgentStore(Path(temp_dir.name) / "agent.sqlite3")
        store.initialize()
        runtime = AgentRuntime(
            registry=build_registry(store),
            store=store,
            model="test-model",
        )
        try:
            query = "onde posso achar a perspectiva de design"
            route = route_query(query)
            context = runtime.prepare(
                query=query,
                profile="designer",
                routed_intent=route.response_intent,
                command_mode=None,
                session_id="session_perspective",
                project_id="project_a",
                preferred_detail_level="balanced",
                understanding=route.understanding,
            )
            self.assertEqual(context.plan.workflow, "perspective_lookup")
            self.assertFalse(context.should_compose)
            response = context.deterministic_response or ""
            self.assertIn("perspectiva Designer", response)
            self.assertNotIn("fora do escopo", response.lower())
            self.assertNotIn("/perspectives?profile=designer", response)
            self.assertIsNotNone(context.navigation_action)
            assert context.navigation_action is not None
            self.assertEqual(
                context.navigation_action.metadata.get("profileId"),
                "designer",
            )
            self.assertEqual(
                context.navigation_action.href,
                "/perspectives?profile=designer",
            )
            self.assertEqual(context.navigation_action.target_type, "perspective")
            self.assertEqual(context.navigation_action.source, "perspective_registry")
        finally:
            temp_dir.cleanup()


class SemanticNavigationIntentTests(unittest.TestCase):
    def test_tokens_query_uses_semantic_or_navigation_without_out_of_scope(self) -> None:
        understanding = analyze_query("onde vejo tokens")
        self.assertIn(
            understanding.user_intent,
            {"navigation_query", "semantic_navigation_query"},
        )
        self.assertNotEqual(understanding.user_intent, "out_of_scope")
        self.assertEqual(understanding.resolved_route, "/foundations?focus=tokens")

    def test_components_query_resolves_canonical_route(self) -> None:
        understanding = analyze_query("onde estão os componentes")
        self.assertEqual(understanding.user_intent, "navigation_query")
        self.assertEqual(understanding.resolved_route, "/components")


class PerspectiveActionBuilderTests(unittest.TestCase):
    def test_designer_action_supports_profile_switch(self) -> None:
        match = resolve_perspective_match("perspectiva de design")
        self.assertIsNotNone(match)
        assert match is not None
        primary, secondary = navigation_action_for_perspective(match, english=False)
        self.assertEqual(primary.metadata.get("action_type"), "set_profile")
        self.assertEqual(primary.metadata.get("profileId"), "designer")
        self.assertTrue(any(
            action.metadata.get("profileId") == "product_designer"
            for action in secondary
        ))


if __name__ == "__main__":
    unittest.main()
