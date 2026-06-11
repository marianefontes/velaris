from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from agent.external_reference_registry import is_trusted_external_url
from agent.models import CatalogEntityResolution
from agent.planner import build_agent_plan
from agent.runtime import AgentRuntime
from agent.store import AgentStore
from agent.understanding import analyze_query
from agent.unsupported_entity_detection import (
    match_unsupported_entity,
    resolve_blocked_comparison,
    resolve_catalog_entity,
    validated_internal_alternatives,
)
from agent.unsupported_entities_registry import UNSUPPORTED_ENTITIES_REGISTRY
from prompts.intent_router import route_query
from tests.agent.test_runtime import build_registry


class UnsupportedEntityRegistryTests(unittest.TestCase):
    def test_side_drawer_is_registered_as_unsupported(self) -> None:
        entry = UNSUPPORTED_ENTITIES_REGISTRY["side-drawer"]
        self.assertFalse(entry.entity_key in {"button", "modal-dialog"})
        self.assertIn("side drawer", entry.aliases)

    def test_closest_alternatives_only_include_catalog_entities(self) -> None:
        entry = UNSUPPORTED_ENTITIES_REGISTRY["side-drawer"]
        alternatives = validated_internal_alternatives(entry)
        self.assertEqual(len(alternatives), 1)
        self.assertEqual(alternatives[0].entity_id, "modal-dialog")
        self.assertNotIn("drawer", [item.entity_id for item in alternatives])


class UnsupportedEntityIntentTests(unittest.TestCase):
    LOOKUP_QUERIES = (
        "tem Side Drawer?",
        "onde fica Side Drawer?",
        "me mostra Side Drawer",
        "quando usar Side Drawer?",
        "vocês têm Side Drawer?",
    )

    def test_lookup_queries_route_to_unsupported_entity_lookup(self) -> None:
        for query in self.LOOKUP_QUERIES:
            with self.subTest(query=query):
                understanding = analyze_query(query)
                self.assertEqual(
                    understanding.user_intent,
                    "unsupported_entity_lookup",
                )
                self.assertNotEqual(understanding.user_intent, "out_of_scope")
                resolution = understanding.catalog_entity_resolution
                self.assertIsNotNone(resolution)
                assert resolution is not None
                self.assertEqual(resolution.entity_status, "unknown")
                self.assertEqual(resolution.entity_label, "Side Drawer")

    def test_recommendation_query_routes_to_unsupported_entity_recommendation(self) -> None:
        understanding = analyze_query("qual componente uso para side drawer?")
        self.assertEqual(
            understanding.user_intent,
            "unsupported_entity_recommendation",
        )

    def test_lateral_panel_query_routes_to_unsupported_recommendation(self) -> None:
        understanding = analyze_query("quero usar um painel lateral")
        self.assertEqual(
            understanding.user_intent,
            "unsupported_entity_recommendation",
        )

    def test_combobox_and_breadcrumb_are_unsupported(self) -> None:
        for query in ("tem Combobox?", "existe Breadcrumb?"):
            with self.subTest(query=query):
                understanding = analyze_query(query)
                self.assertEqual(
                    understanding.user_intent,
                    "unsupported_entity_lookup",
                )

    def test_tabs_still_resolve_as_existing_entity_lookup(self) -> None:
        understanding = analyze_query("tem Tabs?")
        self.assertEqual(understanding.user_intent, "entity_lookup")
        resolution = understanding.catalog_entity_resolution
        self.assertIsNotNone(resolution)
        assert resolution is not None
        self.assertEqual(resolution.entity_status, "supported")


class UnsupportedEntityRuntimeTests(unittest.TestCase):
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
            raise AssertionError("unsupported entity must not execute retrieval")

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
            session_id="session_unsupported",
            project_id="project_a",
            preferred_detail_level="concise",
            understanding=route.understanding,
        )

    def test_side_drawer_lookup_is_deterministic_without_rag(self) -> None:
        context = self.prepare("tem Side Drawer?")
        self.assertEqual(context.plan.workflow, "unsupported_entity_lookup")
        self.assertEqual(self.retrieval_calls, [])
        self.assertFalse(context.should_compose)
        response = context.deterministic_response or ""
        self.assertIn("evidência", response.lower())
        self.assertIn("side drawer", response.lower())
        self.assertNotIn("fora do escopo", response.lower())
        self.assertNotIn("fora do âmbito", response.lower())

    def test_side_drawer_does_not_invent_component(self) -> None:
        context = self.prepare("me mostra Side Drawer")
        response = (context.deterministic_response or "").lower()
        self.assertIn("evidência", response)
        self.assertNotIn("sim. o velaris possui", response)

    def test_modal_dialog_alternative_action_when_catalog_exists(self) -> None:
        context = self.prepare("tem Side Drawer?")
        action = context.navigation_action
        self.assertIsNotNone(action)
        assert action is not None
        self.assertIn("modal", action.label.lower())
        self.assertTrue(action.href.startswith("/components"))

    def test_external_reference_action_comes_from_registry(self) -> None:
        context = self.prepare("tem Side Drawer?")
        actions = [
            *( [context.navigation_action] if context.navigation_action else [] ),
            *context.secondary_navigation_actions,
        ]
        external = next(
            (action for action in actions if action.metadata.get("external_reference")),
            None,
        )
        self.assertIsNotNone(external)
        assert external is not None
        self.assertTrue(is_trusted_external_url(external.href))
        self.assertIn("material.io", external.href)

    def test_design_system_gap_in_audit_metadata(self) -> None:
        context = self.prepare("tem Side Drawer?")
        audit = context.audit_metadata(execution_status="completed")
        self.assertIsNotNone(audit.design_system_gap)
        assert audit.design_system_gap is not None
        self.assertEqual(audit.design_system_gap.entity_label, "Side Drawer")
        self.assertEqual(audit.entity_status, "unknown")

    def test_when_to_use_side_drawer_suggests_real_alternative(self) -> None:
        context = self.prepare("quando usar Side Drawer?")
        response = context.deterministic_response or ""
        self.assertIn("Modal/Dialog", response)
        self.assertNotIn("Drawer", response.replace("Side Drawer", ""))

    def test_recommendation_for_side_drawer_mentions_catalog_gap(self) -> None:
        context = self.prepare("quero usar um painel lateral")
        self.assertEqual(context.plan.workflow, "unsupported_entity_recommendation")
        response = context.deterministic_response or ""
        self.assertIn("lacuna", response.lower())


class UnsupportedEntitySecurityTests(unittest.TestCase):
    def test_unsupported_entity_has_no_recommended_component(self) -> None:
        temp_dir = tempfile.TemporaryDirectory()
        store = AgentStore(Path(temp_dir.name) / "agent.sqlite3")
        store.initialize()
        runtime = AgentRuntime(
            registry=build_registry(store),
            store=store,
            model="test-model",
        )
        try:
            route = route_query("tem Side Drawer?")
            context = runtime.prepare(
                query="tem Side Drawer?",
                profile="designer",
                routed_intent=route.response_intent,
                command_mode=None,
                session_id="session_security",
                project_id="project_a",
                preferred_detail_level="concise",
                understanding=route.understanding,
            )
            audit = context.audit_metadata(execution_status="completed")
            self.assertIsNone(audit.recommended_component)
            self.assertIsNone(audit.recommended_component_id)
            if context.navigation_action is not None:
                self.assertTrue(
                    context.navigation_action.metadata.get("internal")
                    or context.navigation_action.metadata.get("external_reference")
                )
        finally:
            temp_dir.cleanup()

    def test_external_url_must_be_in_registry(self) -> None:
        self.assertTrue(
            is_trusted_external_url(
                "https://m3.material.io/components/navigation-drawer/overview"
            )
        )
        self.assertFalse(is_trusted_external_url("https://example.com/side-drawer"))


class UnsupportedEntityDetectionUnitTests(unittest.TestCase):
    def test_match_prefers_longest_alias(self) -> None:
        matched = match_unsupported_entity("quero side drawer lateral")
        self.assertIsNotNone(matched)
        assert matched is not None
        self.assertEqual(matched[0].entity_key, "side-drawer")

    def test_resolve_catalog_entity_marks_existing_component(self) -> None:
        resolution = resolve_catalog_entity("tem button?")
        self.assertEqual(resolution.entity_status, "supported")
        self.assertEqual(resolution.entity_label, "Button")

    def test_unknown_entity_lookup_requests_clarification(self) -> None:
        understanding = analyze_query("tem o componente zorbulator?")
        self.assertEqual(understanding.user_intent, "unknown_entity_lookup")

    def test_modal_or_side_drawer_allows_comparison(self) -> None:
        understanding = analyze_query("Modal ou SideDrawer?")
        self.assertEqual(understanding.user_intent, "component_comparison")
        blocked = resolve_blocked_comparison("Modal ou SideDrawer?")
        self.assertIsNone(blocked)

    def test_resolve_blocked_comparison_allows_modal_vs_side_drawer(self) -> None:
        blocked = resolve_blocked_comparison("Modal ou SideDrawer?")
        self.assertIsNone(blocked)


if __name__ == "__main__":
    unittest.main()
