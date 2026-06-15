from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from agent.planner import build_agent_plan
from agent.professional_intent import (
    classify_professional_category,
    knowledge_source_for_category,
    requires_institutional_evidence,
    requires_mandatory_rag,
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
from agent.understanding import analyze_query
from tests.agent.fixtures import fixture_retrieve


def build_registry(store: AgentStore, retrieve=fixture_retrieve) -> ToolRegistry:
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


ACCEPTANCE_CASES = [
    (
        "Explique o racional visual e como defendê-lo",
        "DESIGN_RATIONALE",
        "professional_knowledge",
        False,
    ),
    (
        "Audite este fluxo por hierarquia e carga cognitiva",
        "DESIGN_AUDIT",
        "analytical_capability",
        False,
    ),
    (
        "Como justificar esta decisão de UX?",
        "DESIGN_RATIONALE",
        "professional_knowledge",
        False,
    ),
    (
        "Quais critérios usar para avaliar esta interface?",
        "KNOWLEDGE_EXPLANATION",
        "professional_knowledge",
        False,
    ),
    (
        "Explique os princípios de acessibilidade envolvidos",
        "ACCESSIBILITY_REVIEW",
        "professional_knowledge",
        False,
    ),
    (
        "Existe SideDrawer?",
        "ENTITY_LOOKUP",
        "institutional_knowledge",
        True,
    ),
]


class ProfessionalIntentClassificationTests(unittest.TestCase):
    def test_acceptance_categories(self) -> None:
        for query, expected_category, expected_source, mandatory_rag in ACCEPTANCE_CASES:
            with self.subTest(query=query):
                understanding = analyze_query(query)
                self.assertEqual(understanding.professional_category, expected_category)
                self.assertEqual(
                    knowledge_source_for_category(understanding.professional_category),
                    expected_source,
                )
                self.assertEqual(requires_mandatory_rag(understanding), mandatory_rag)
                self.assertEqual(
                    requires_institutional_evidence(understanding),
                    mandatory_rag,
                )

    def test_classify_design_audit_before_generic_explain(self) -> None:
        category = classify_professional_category(
            "Audite este fluxo por hierarquia e carga cognitiva",
            user_intent="general_design_system",
            entities=analyze_query(
                "Audite este fluxo por hierarquia e carga cognitiva"
            ).entities,
        )
        self.assertEqual(category, "DESIGN_AUDIT")


class ProfessionalRoutingPlannerTests(unittest.TestCase):
    def test_professional_queries_skip_mandatory_tools(self) -> None:
        plan = build_agent_plan("Explique o racional visual e como defendê-lo")
        self.assertEqual(plan.tools, [])
        self.assertEqual(plan.understanding.professional_category, "DESIGN_RATIONALE")

    def test_entity_lookup_keeps_catalog_path(self) -> None:
        plan = build_agent_plan("Existe SideDrawer?")
        self.assertEqual(plan.understanding.professional_category, "ENTITY_LOOKUP")
        self.assertTrue(requires_mandatory_rag(plan.understanding))


class ProfessionalRuntimeEvidenceGateTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.store = AgentStore(Path(self.temp_dir.name) / "agent.sqlite3")
        self.store.initialize()
        registry = build_registry(self.store)
        self.runtime = AgentRuntime(
            registry=registry,
            store=self.store,
            model="test-model",
        )

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_professional_query_not_blocked_without_corpus(self) -> None:
        runtime = AgentRuntime(
            registry=ToolRegistry(),
            store=self.store,
            model="test-model",
        )
        context = runtime.prepare(
            query="Quais critérios usar para avaliar esta interface?",
            profile="designer",
            routed_intent="knowledge_explanation",
            command_mode=None,
            session_id="session_professional",
            project_id="project_a",
            preferred_detail_level="balanced",
        )
        self.assertTrue(context.should_compose)
        self.assertIsNone(context.deterministic_response)

    def test_institutional_query_still_blocks_without_evidence(self) -> None:
        runtime = AgentRuntime(
            registry=build_registry(self.store, lambda *args, **kwargs: []),
            store=self.store,
            model="test-model",
        )
        context = runtime.prepare(
            query="Qual componente usar para confirmação?",
            profile="designer",
            routed_intent="component_guidance",
            command_mode=None,
            session_id="session_institutional",
            project_id="project_a",
            preferred_detail_level="balanced",
        )
        self.assertFalse(context.should_compose)
        response = (context.deterministic_response or "").lower()
        self.assertTrue(
            "corpus oficial" in response or "catálogo" in response or "catalogo" in response
        )


if __name__ == "__main__":
    unittest.main()
