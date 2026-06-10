from __future__ import annotations

import unittest

from agent.navigation_actions import (
    component_href,
    navigation_action_for_component,
    navigation_action_for_route,
    single_choice_navigation_actions,
)
from agent.operational_responses import navigation_response
from agent.route_map import resolve_navigation_route
from agent.runtime import AgentRuntime
from agent.store import AgentStore
from component_metadata import component_registry
from tests.agent.test_runtime import build_registry
import tempfile
from pathlib import Path


class NavigationActionBuilderTests(unittest.TestCase):
    def test_tokens_navigation_action(self) -> None:
        resolution = resolve_navigation_route("onde acho os tokens?")
        self.assertIsNotNone(resolution)
        action = navigation_action_for_route(resolution, english=False)
        self.assertEqual(action.label, "Abrir Tokens")
        self.assertEqual(action.href, "/foundations?focus=tokens")
        self.assertEqual(action.target_type, "section")
        self.assertEqual(action.source, "route_map")
        self.assertEqual(action.confidence, "exact")

    def test_components_navigation_action(self) -> None:
        resolution = resolve_navigation_route("onde vejo os componentes?")
        self.assertIsNotNone(resolution)
        action = navigation_action_for_route(resolution, english=False)
        self.assertEqual(action.label, "Abrir Componentes")
        self.assertEqual(action.href, "/components")

    def test_oracle_navigation_action(self) -> None:
        resolution = resolve_navigation_route("onde fica o chat completo?")
        self.assertIsNotNone(resolution)
        action = navigation_action_for_route(resolution, english=False)
        self.assertEqual(action.label, "Abrir chat completo")
        self.assertEqual(action.href, "/oracle")

    def test_button_component_action(self) -> None:
        component = component_registry()["button"]
        action = navigation_action_for_component(component, english=False)
        self.assertEqual(action.label, "Abrir Button")
        self.assertEqual(action.href, "/components?component=button")
        self.assertEqual(action.target_type, "component")
        self.assertEqual(action.source, "catalog")

    def test_radio_button_component_action(self) -> None:
        component = component_registry()["radio-button"]
        action = navigation_action_for_component(component, english=False, verb="view")
        self.assertEqual(action.label, "Ver Radio Button")
        self.assertEqual(action.href, "/components?component=radio-button")

    def test_select_component_action(self) -> None:
        component = component_registry()["select-dropdown"]
        action = navigation_action_for_component(component, english=False)
        self.assertEqual(action.label, "Abrir Select/Dropdown")
        self.assertEqual(action.href, "/components?component=select-dropdown")

    def test_component_section_href(self) -> None:
        self.assertEqual(
            component_href("button", "accessibility"),
            "/components?component=button&section=accessibility",
        )

    def test_single_choice_recommendation_actions(self) -> None:
        primary, secondary = single_choice_navigation_actions(english=False)
        self.assertEqual(primary.label, "Ver Radio Button")
        self.assertEqual(primary.href, "/components?component=radio-button")
        self.assertEqual(len(secondary), 1)
        self.assertEqual(secondary[0].label, "Ver Select")
        self.assertEqual(secondary[0].href, "/components?component=select-dropdown")

    def test_navigation_response_avoids_raw_path(self) -> None:
        resolution = resolve_navigation_route("onde acho os tokens?")
        self.assertIsNotNone(resolution)
        response = navigation_response(resolution, english=False)
        self.assertIn("Foundations", response)
        self.assertNotIn("/foundations?focus=tokens", response)


class NavigationRuntimeTests(unittest.TestCase):
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
            session_id="session_nav",
            project_id="project_a",
            preferred_detail_level="balanced",
        )

    def test_tokens_query_attaches_navigation_action(self) -> None:
        context = self.prepare("onde acho os tokens?")
        self.assertFalse(context.should_compose)
        self.assertIsNotNone(context.navigation_action)
        assert context.navigation_action is not None
        self.assertEqual(context.navigation_action.label, "Abrir Tokens")
        self.assertEqual(context.navigation_action.href, "/foundations?focus=tokens")
        self.assertNotIn("/foundations?focus=tokens", context.deterministic_response or "")

    def test_button_lookup_attaches_navigation_action(self) -> None:
        context = self.prepare("você tem Button?")
        self.assertIsNotNone(context.navigation_action)
        assert context.navigation_action is not None
        self.assertEqual(context.navigation_action.label, "Abrir Button")
        self.assertEqual(context.navigation_action.href, "/components?component=button")

    def test_radio_button_guidance_attaches_view_action(self) -> None:
        context = self.prepare("quando usar Radio Button?", routed_intent="component_guidance")
        self.assertIsNotNone(context.navigation_action)
        assert context.navigation_action is not None
        self.assertEqual(context.navigation_action.label, "Ver Radio Button")

    def test_single_choice_recommendation_secondary_action(self) -> None:
        query = "qual componente uso para escolher apenas uma opção entre várias?"
        context = self.prepare(query, routed_intent="component_guidance")
        self.assertIsNotNone(context.navigation_action)
        self.assertEqual(len(context.secondary_navigation_actions), 1)
        self.assertEqual(
            context.secondary_navigation_actions[0].label,
            "Ver Select",
        )


if __name__ == "__main__":
    unittest.main()
