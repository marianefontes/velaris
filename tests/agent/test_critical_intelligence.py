"""Regression tests for the governed evidence fallback.

These tests lock the critical behavior reported against Beatrice: basic
questions about documented components (such as Button with its intents)
must never be blocked with "insufficient evidence" when canonical catalog
metadata exists. Blocking is only valid when evidence is truly absent
(unknown component, out of scope, no catalog data).
"""

from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from agent.evidence import (
    EVIDENCE_BASIS_BY_TIER,
    EVIDENCE_BASIS_GUIDANCE,
    evidence_basis,
)
from agent.registry import ToolRegistry
from agent.runtime import AgentRuntime
from agent.store import AgentStore
from agent.tools import (
    build_compare_design_options_tool,
    build_create_decision_record_tool,
    build_search_component_tool,
    build_search_design_decision_tool,
    build_search_explainability_tool,
    build_search_pattern_tool,
    build_search_token_tool,
    build_validate_design_system_tool,
)
from prompts.intent_router import route_query


CRITICAL_BUTTON_QUESTION = (
    "Como eu implemento o componente Button usando os intents primary, "
    "secondary, positive e negative sem quebrar acessibilidade?"
)

WEAK_BUTTON_CHUNK = [{
    "title": "Button",
    "source": "ComponentsPage",
    "page_type": "component",
    "component_id": "button",
    "status": "stable",
    "text": "Button | aciona uma tarefa clara.",
    "similarity": 0.42,
    "retrieval_weight": 1.0,
    "weighted_score": 0.42,
}]


def build_registry(store: AgentStore, retrieve) -> ToolRegistry:
    registry = ToolRegistry()
    for tool in (
        build_search_component_tool(retrieve),
        build_search_design_decision_tool(retrieve),
        build_search_explainability_tool(retrieve),
        build_search_pattern_tool(retrieve),
        build_search_token_tool(retrieve),
        build_compare_design_options_tool(retrieve),
        build_validate_design_system_tool(retrieve),
        build_create_decision_record_tool(store),
    ):
        registry.register(tool)
    return registry


class GovernedFallbackTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.store = AgentStore(Path(self.temp_dir.name) / "agent.sqlite3")
        self.store.initialize()

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def prepare(self, query: str, retrieve, profile: str = "developer"):
        route = route_query(query, profile=profile)
        runtime = AgentRuntime(
            registry=build_registry(self.store, retrieve),
            store=self.store,
            model="test-model",
        )
        context = runtime.prepare(
            query=query,
            profile=route.persona_profile,
            routed_intent=route.response_intent,
            command_mode=route.active_command_mode,
            session_id="session_critical",
            project_id="project_critical",
            preferred_detail_level="balanced",
            catalog_mode=route.catalog_mode,
            understanding=route.understanding,
        )
        return runtime, context

    def test_button_intents_question_is_never_blocked_with_empty_retrieval(self) -> None:
        runtime, context = self.prepare(
            CRITICAL_BUTTON_QUESTION,
            lambda query, intent, top_k, profile: [],
        )
        self.assertTrue(context.should_compose)
        self.assertIsNone(context.deterministic_response)
        selection = context.component_selection
        self.assertIsNotNone(selection)
        self.assertIsNotNone(selection.recommended)
        self.assertEqual(selection.recommended.component.component_id, "button")
        self.assertNotEqual(selection.evidence_tier, "insufficient")
        self.assertNotEqual(selection.recommendation_firmness, "insufficient")
        # The recommended Button carries the canonical intents needed for
        # the implementation answer (primary, secondary, positive, negative).
        intent_ids = {
            intent.id for intent in selection.recommended.component.intents or []
        }
        self.assertTrue(
            {"primary", "secondary", "positive", "negative"} <= intent_ids,
            f"Button catalog intents incomplete: {sorted(intent_ids)}",
        )

    def test_button_intents_question_recovers_from_weak_retrieval(self) -> None:
        runtime, context = self.prepare(
            CRITICAL_BUTTON_QUESTION,
            lambda query, intent, top_k, profile: list(WEAK_BUTTON_CHUNK),
        )
        self.assertTrue(context.should_compose)
        selection = context.component_selection
        self.assertIsNotNone(selection)
        self.assertIsNotNone(selection.recommended)
        self.assertEqual(selection.recommended.component.component_id, "button")
        self.assertIn(selection.evidence_tier, ("strong", "partial"))

    def test_button_negative_loading_question_is_composable(self) -> None:
        runtime, context = self.prepare(
            "Como implemento Button com intent negative e loading?",
            lambda query, intent, top_k, profile: [],
        )
        self.assertTrue(context.should_compose)
        selection = context.component_selection
        self.assertIsNotNone(selection)
        self.assertIsNotNone(selection.recommended)
        self.assertEqual(selection.recommended.component.component_id, "button")
        state_ids = {
            state.id for state in selection.recommended.component.states or []
        }
        self.assertIn("loading", state_ids)

    def test_comparison_question_gives_decision_criterion(self) -> None:
        runtime, context = self.prepare(
            "Checkbox ou radio para escolher apenas uma opção?",
            lambda query, intent, top_k, profile: [],
        )
        components = set(context.plan.understanding.entities.components)
        self.assertEqual(components, {"Checkbox", "Radio Button"})
        # The native comparator answers deterministically and must give an
        # actual decision criterion (single vs multiple selection), never a
        # one-line generic comparison and never a block.
        self.assertIsNotNone(context.deterministic_response)
        answer = context.deterministic_response.lower()
        self.assertIn("radio", answer)
        self.assertIn("checkbox", answer)
        self.assertTrue(
            "exatamente uma" in answer or "uma opção" in answer
            or "uma opcao" in answer,
            f"missing single-choice criterion: {answer}",
        )

    def test_generic_comparison_uses_catalog_criteria(self) -> None:
        from agent.decision_rules import resolve_comparison_rule

        rule = resolve_comparison_rule("Tooltip ou Toast?")
        if rule is None:
            self.skipTest("generic comparison did not resolve both components")
        self.assertEqual(rule.rule_id, "generic_component_comparison")
        self.assertIn("catálogo", rule.rationale_pt)

    def test_checkbox_vs_radio_rule_resolves_both_directions(self) -> None:
        from agent.decision_rules import resolve_comparison_rule

        for query, expected in (
            ("Checkbox ou radio para escolher apenas uma opção?", "radio-button"),
            ("Radio ou checkbox para marcar várias opções?", "checkbox"),
            ("Checkbox ou Radio Button?", "radio-button"),
        ):
            with self.subTest(query=query):
                rule = resolve_comparison_rule(query)
                self.assertIsNotNone(rule)
                self.assertEqual(rule.rule_id, "checkbox_vs_radio")
                self.assertEqual(rule.recommended_component_id, expected)

    def test_structured_context_exposes_evidence_basis(self) -> None:
        runtime, context = self.prepare(
            CRITICAL_BUTTON_QUESTION,
            lambda query, intent, top_k, profile: [],
        )
        structured = runtime.structured_context(context)
        payload = json.loads(structured.split("\n\n", 1)[1])
        self.assertIn("evidence_basis", payload)
        self.assertIn(payload["evidence_basis"]["level"], EVIDENCE_BASIS_GUIDANCE)
        # A catalog-backed recommendation must never present an absent basis.
        self.assertNotEqual(payload["evidence_basis"]["level"], "absent")
        self.assertIn("confidence", payload)
        self.assertIn(
            payload["confidence"]["label"],
            ("alta", "média", "media", "baixa", "high", "medium", "low",
             "não determinada", "nao determinada", "not determined"),
        )

    def test_out_of_scope_question_remains_blocked(self) -> None:
        runtime, context = self.prepare(
            "Qual é a previsão do tempo para amanhã?",
            lambda query, intent, top_k, profile: [],
        )
        self.assertFalse(context.should_compose)

    def test_unknown_component_does_not_get_invented_recommendation(self) -> None:
        runtime, context = self.prepare(
            "Como implemento o componente Hyperdrive Carousel?",
            lambda query, intent, top_k, profile: [],
        )
        selection = context.component_selection
        if context.should_compose and selection and selection.recommended:
            # If the pipeline composes, it must not pretend the unknown
            # component exists: the recommendation must come from the
            # canonical catalog, never from the invented name.
            self.assertNotIn(
                "hyperdrive",
                selection.recommended.component.component_id,
            )
        else:
            self.assertFalse(context.should_compose)
            self.assertIsNotNone(context.deterministic_response)


class EvidenceBasisTests(unittest.TestCase):
    def test_tier_to_basis_mapping(self) -> None:
        self.assertEqual(evidence_basis("strong"), "direct")
        self.assertEqual(evidence_basis("partial"), "partial")
        self.assertEqual(evidence_basis("weak"), "inferred")
        self.assertEqual(evidence_basis("insufficient"), "absent")

    def test_unknown_tier_defaults_to_absent(self) -> None:
        self.assertEqual(evidence_basis("nonsense"), "absent")

    def test_every_basis_has_guidance(self) -> None:
        for basis in EVIDENCE_BASIS_BY_TIER.values():
            self.assertIn(basis, EVIDENCE_BASIS_GUIDANCE)


if __name__ == "__main__":
    unittest.main()
