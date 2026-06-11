from __future__ import annotations

import unittest

from agent.models import AgentPlan
from agent.planner import build_agent_plan
from agent.policies import (
    PolicyViolation,
    ToolPolicyContext,
    authorize_tool,
    validate_plan,
)


class AgentPlannerPolicyTests(unittest.TestCase):
    def test_selects_each_primary_workflow(self) -> None:
        cases = {
            "Valide este Button sem foco visível": "design_audit",
            "Compare Modal vs Drawer para um formulário": "compare_options",
            "Qual token de cor usar em erro?": "token_lookup",
            "Qual componente usar para confirmação?": "component_decision",
            "Como estruturar um fluxo de onboarding?": "pattern_guidance",
            "Quais requisitos de WCAG devo seguir para acessibilidade?": "accessibility_guidance",
            "Como deixo este botão acessível?": "component_decision",
            "Por que esta decisão existe?": "design_decision",
            "Por que a Beatrice recomendou isto?": "xai_explanation",
            "Explique o design system Aetheris": "documentation_help",
            "Devemos usar Dialog para confirmação crítica?": "decision_analysis",
            "Qual é a previsão do tempo?": "out_of_scope",
        }
        for query, expected in cases.items():
            with self.subTest(query=query):
                self.assertEqual(build_agent_plan(query).workflow, expected)

    def test_audit_has_priority_over_component_terms(self) -> None:
        plan = build_agent_plan("Audite este componente Button com cor hardcoded")
        self.assertEqual(plan.workflow, "design_audit")
        self.assertEqual(plan.tools, ["validate_against_design_system"])

    def test_comparison_selects_expected_tool(self) -> None:
        plan = build_agent_plan("Compare Modal versus Drawer for a form")
        self.assertEqual(plan.tools, ["compare_design_options"])
        self.assertTrue(plan.creates_decision_draft)

    def test_canonical_comparison_uses_deterministic_rule(self) -> None:
        plan = build_agent_plan("Compare Button versus Link")
        self.assertEqual(plan.workflow, "comparison_rule")
        self.assertEqual(plan.tools, [])
        self.assertFalse(plan.creates_decision_draft)

    def test_drawer_comparison_allows_catalog_gap(self) -> None:
        plan = build_agent_plan("Compare Dialog versus Drawer")
        self.assertEqual(plan.workflow, "compare_options")
        self.assertEqual(plan.tools, ["compare_design_options"])
        self.assertTrue(plan.creates_decision_draft)

    def test_out_of_scope_has_no_tools_and_no_draft(self) -> None:
        plan = build_agent_plan("Qual é a previsão do tempo?")
        self.assertEqual(plan.tools, [])
        self.assertFalse(plan.creates_decision_draft)
        validate_plan(plan, set())

    def test_unknown_tool_is_blocked(self) -> None:
        plan = AgentPlan(
            intent="general",
            workflow="documentation_help",
            tools=["unknown_tool"],
            steps=[],
            needs_confirmation=False,
            rationale="test",
        )
        with self.assertRaises(PolicyViolation):
            validate_plan(plan, {"search_component"})

    def test_read_only_tool_runs_without_confirmation(self) -> None:
        authorize_tool(ToolPolicyContext(
            name="search_component",
            permission="read_only",
            requires_confirmation=False,
        ))

    def test_draft_write_action_is_allowed_without_confirmation(self) -> None:
        authorize_tool(ToolPolicyContext(
            name="create_decision_record",
            permission="write_action",
            requires_confirmation=False,
            requested_status="draft",
        ))

    def test_non_draft_write_action_requires_confirmation(self) -> None:
        with self.assertRaises(PolicyViolation):
            authorize_tool(ToolPolicyContext(
                name="update_decision_record",
                permission="write_action",
                requires_confirmation=True,
            ))


if __name__ == "__main__":
    unittest.main()
