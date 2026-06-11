from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from agent.decision_rules import resolve_comparison_rule, resolve_decision_rule
from agent.planner import build_agent_plan
from agent.runtime import AgentRuntime
from agent.store import AgentStore
from agent.understanding import analyze_query
from prompts.intent_router import route_query
from tests.agent.test_runtime import build_registry


class DecisionRulesTests(unittest.TestCase):
    CASES = (
        (
            "qual componente uso para escolher várias opções?",
            "checkbox",
            "multiple_choice",
        ),
        (
            "qual componente uso para ação destrutiva?",
            "modal-dialog",
            "destructive_action",
        ),
        (
            "qual componente uso para feedback de sucesso?",
            "toast",
            "success_feedback",
        ),
        (
            "qual componente uso para erro em campo?",
            "form-field",
            "field_error",
        ),
        (
            "qual componente uso para lista longa de opções?",
            "select-dropdown",
            "long_option_list",
        ),
    )

    def test_rules_resolve_expected_components(self) -> None:
        for query, component_id, rule_id in self.CASES:
            with self.subTest(query=query):
                rule = resolve_decision_rule(query)
                self.assertIsNotNone(rule)
                assert rule is not None
                self.assertEqual(rule.recommended_component_id, component_id)
                self.assertEqual(rule.rule_id, rule_id)
                self.assertIsNotNone(rule.navigation_action)

    def test_rules_use_deterministic_workflow(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.store = AgentStore(Path(self.temp_dir.name) / "agent.sqlite3")
        self.store.initialize()
        self.runtime = AgentRuntime(
            registry=build_registry(self.store),
            store=self.store,
            model="test-model",
        )

        query = "qual componente uso para escolher várias opções?"
        route = route_query(query)
        context = self.runtime.prepare(
            query=query,
            profile="designer",
            routed_intent=route.response_intent,
            command_mode=None,
            session_id="session_rules",
            project_id="project_rules",
            preferred_detail_level="balanced",
            understanding=route.understanding,
        )
        self.assertEqual(context.plan.workflow, "decision_rule_recommendation")
        self.assertFalse(context.should_compose)
        self.assertIsNotNone(context.navigation_action)
        self.assertIn("Checkbox", context.deterministic_response or "")
        self.temp_dir.cleanup()


class HelpAndEntityLookupTests(unittest.TestCase):
    def test_me_ajuda_is_small_talk(self) -> None:
        understanding = analyze_query("me ajuda?")
        self.assertEqual(understanding.user_intent, "small_talk")
        self.assertNotEqual(understanding.user_intent, "out_of_scope")

    def test_pode_me_ajudar_is_small_talk(self) -> None:
        understanding = analyze_query("pode me ajudar?")
        self.assertIn(understanding.user_intent, {"small_talk", "help_request"})

    def test_ajudas_me_is_small_talk(self) -> None:
        understanding = analyze_query("ajudas-me?")
        self.assertEqual(understanding.user_intent, "small_talk")

    def test_me_mostra_modal_is_entity_lookup(self) -> None:
        understanding = analyze_query("me mostra Modal")
        self.assertEqual(understanding.user_intent, "entity_lookup")

    def test_onde_fica_checkbox_is_entity_lookup(self) -> None:
        understanding = analyze_query("onde fica Checkbox?")
        self.assertEqual(understanding.user_intent, "entity_lookup")

    def test_quero_ver_radio_button_is_entity_lookup(self) -> None:
        understanding = analyze_query("quero ver Radio Button")
        self.assertEqual(understanding.user_intent, "entity_lookup")


class ComparisonRuleTests(unittest.TestCase):
    COMPARISON_CASES = (
        ("Button ou Link?", "button_vs_link"),
        ("Radio Button ou Select?", "radio_vs_select"),
        ("Checkbox ou Switch?", "checkbox_vs_switch"),
    )

    GAP_COMPARISON_CASES = (
        "Modal ou Drawer?",
        "Modal ou SideDrawer?",
    )

    def test_comparison_rules_resolve(self) -> None:
        for query, rule_id in self.COMPARISON_CASES:
            with self.subTest(query=query):
                rule = resolve_comparison_rule(query)
                self.assertIsNotNone(rule)
                assert rule is not None
                self.assertEqual(rule.rule_id, rule_id)
                self.assertIsNotNone(rule.navigation_action)

    def test_modal_vs_drawer_allows_comparison_when_drawer_is_catalog_gap(self) -> None:
        for query in self.GAP_COMPARISON_CASES:
            with self.subTest(query=query):
                self.assertIsNone(resolve_comparison_rule(query))
                understanding = analyze_query(query)
                self.assertEqual(
                    understanding.user_intent,
                    "component_comparison",
                )


class GuidanceIntentTests(unittest.TestCase):
    def test_accessibility_modal_is_direct_guidance(self) -> None:
        understanding = analyze_query("acessibilidade do Modal")
        self.assertEqual(understanding.user_intent, "direct_entity_guidance")

    def test_button_states_is_direct_guidance(self) -> None:
        understanding = analyze_query("quais estados do Button?")
        self.assertEqual(understanding.user_intent, "direct_entity_guidance")


if __name__ == "__main__":
    unittest.main()
