from __future__ import annotations

import unittest

from agent.intelligence_intents import resolve_intelligence_intent
from agent.understanding import analyze_query, normalize_text
from cognition.engines.registry import resolve_engine
from prompts.intent_router import INTENT_FILTER, classify_intent, route_query


class IntelligenceIntentTests(unittest.TestCase):
    def test_system_health_intent(self) -> None:
        query = "o que mede o health do sistema?"
        self.assertEqual(resolve_intelligence_intent(query, normalize_text(query)), "system_health")
        understanding = analyze_query(query)
        self.assertEqual(understanding.user_intent, "system_health")
        self.assertEqual(classify_intent(query), "system_health")

    def test_agent_identity_intent(self) -> None:
        query = "qual a diferença entre chatbot e oráculo?"
        self.assertEqual(resolve_intelligence_intent(query, normalize_text(query)), "agent_identity")
        understanding = analyze_query(query)
        self.assertEqual(understanding.user_intent, "agent_identity")

    def test_roadmap_capability_intent(self) -> None:
        query = "você aceita imagens?"
        self.assertEqual(
            resolve_intelligence_intent(query, normalize_text(query)),
            "roadmap_capability",
        )
        understanding = analyze_query(query)
        self.assertEqual(understanding.user_intent, "roadmap_capability")

    def test_agent_capability_intent(self) -> None:
        query = "quais são suas limitações?"
        self.assertEqual(
            resolve_intelligence_intent(query, normalize_text(query)),
            "agent_capability",
        )
        understanding = analyze_query(query)
        self.assertEqual(understanding.user_intent, "agent_capability")

    def test_governance_analysis_intent(self) -> None:
        query = "quais alertas de governança existem?"
        self.assertEqual(
            resolve_intelligence_intent(query, normalize_text(query)),
            "governance_analysis",
        )

    def test_simulation_intent(self) -> None:
        query = "simule substituir modal por drawer"
        self.assertEqual(resolve_intelligence_intent(query, normalize_text(query)), "simulation")

    def test_multi_agent_intent(self) -> None:
        query = "oracle council: devemos usar modal ou drawer?"
        self.assertEqual(
            resolve_intelligence_intent(query, normalize_text(query)),
            "multi_agent_reasoning",
        )

    def test_comparison_retrieval_filters_to_evidence(self) -> None:
        self.assertEqual(classify_intent("compare Modal e Drawer"), "comparison_query")
        self.assertIn("design_decision", INTENT_FILTER["comparison_query"])
        self.assertNotIn("oracle_command", INTENT_FILTER["comparison_query"])
        self.assertNotIn("automatic_skill", INTENT_FILTER["comparison_query"])

    def test_health_engine_resolves(self) -> None:
        engine = resolve_engine("health")
        self.assertIsNotNone(engine)
        assert engine is not None
        self.assertEqual(engine.id, "health")
        route = route_query("/health", command_mode="health")
        self.assertEqual(route.active_command_mode, "health")
        self.assertEqual(route.retrieval_intent, "system_health")

    def test_dragon_button_routes_to_unsupported_lookup(self) -> None:
        understanding = analyze_query("existe DragonButton?")
        self.assertEqual(understanding.user_intent, "unsupported_entity_lookup")


if __name__ == "__main__":
    unittest.main()
