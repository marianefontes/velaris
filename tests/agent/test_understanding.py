from __future__ import annotations

import unittest

from agent.planner import build_agent_plan, parse_comparison_options
from agent.understanding import analyze_query
from prompts.intent_router import INTENT_FILTER, route_query


class QueryUnderstandingTests(unittest.TestCase):
    def test_required_intelligence_queries_route_to_specific_workflows(self) -> None:
        cases = {
            "Qual componente devo usar para mostrar o nível de confiança de uma resposta da IA?": (
                "component_recommendation",
                "component_decision",
            ),
            "Quando eu não devo usar modal?": (
                "component_recommendation",
                "component_decision",
            ),
            "Qual padrão devo usar para estruturar um onboarding?": (
                "pattern_guidance",
                "pattern_guidance",
            ),
            "Qual token de cor devo usar para destaque da marca?": (
                "token_lookup",
                "token_lookup",
            ),
            "Por que a Beatrice recomendou esse componente?": (
                "xai_explanation",
                "xai_explanation",
            ),
            "Qual a diferença entre usar a Beatrice e um ChatGPT genérico?": (
                "xai_explanation",
                "xai_explanation",
            ),
            "Me recomende um componente que não existe no Velaris.": (
                "out_of_scope",
                "out_of_scope",
            ),
            "Checkbox ou radio para escolher apenas uma opção?": (
                "component_comparison",
                "compare_options",
            ),
            "Quando uso switch em vez de checkbox?": (
                "component_comparison",
                "compare_options",
            ),
            "Como deixo um botão destrutivo acessível?": (
                "component_recommendation",
                "component_decision",
            ),
            "O Velaris tem date picker?": (
                "entity_lookup",
                "entity_lookup",
            ),
            "onde acho os tokens?": (
                "navigation_query",
                "navigation_query",
            ),
            "você tem o componente button?": (
                "entity_lookup",
                "entity_lookup",
            ),
            "Qual componente uso para seleção compacta de filtros?": (
                "component_recommendation",
                "component_decision",
            ),
        }
        for query, (expected_intent, expected_workflow) in cases.items():
            with self.subTest(query=query):
                route = route_query(query)
                plan = build_agent_plan(
                    query,
                    routed_intent=route.response_intent,
                    catalog_mode=route.catalog_mode,
                    understanding=route.understanding,
                )
                self.assertEqual(route.understanding.user_intent, expected_intent)
                self.assertEqual(plan.workflow, expected_workflow)

    def test_extracts_component_context_risk_and_accessibility_entities(self) -> None:
        understanding = analyze_query(
            "Num formulário, uso Button primary ou negative para excluir "
            "um item com foco visível?"
        )
        self.assertIn("Button", understanding.entities.components)
        self.assertIn("form", understanding.entities.contexts)
        self.assertIn("destructive", understanding.entities.interaction_intents)
        self.assertIn("focus", understanding.entities.accessibility_constraints)
        self.assertIn("destructive_action", understanding.entities.risks)

    def test_extracts_canonical_comparison_options_from_or_question(self) -> None:
        self.assertEqual(
            parse_comparison_options(
                "Checkbox ou radio para escolher apenas uma opção?"
            ),
            ("Checkbox", "Radio Button"),
        )

    def test_language_detection_covers_pt_br_pt_pt_and_english(self) -> None:
        cases = {
            "Explique em português.": "pt-BR",
            "Explica isto em PT-PT.": "pt-PT",
            "Explain in English.": "en",
            "how do I make this accessible?": "en",
        }
        for query, expected in cases.items():
            with self.subTest(query=query):
                self.assertEqual(analyze_query(query).language, expected)

    def test_retrieval_query_contains_structured_entities(self) -> None:
        understanding = analyze_query(
            "Checkbox ou radio para escolher apenas uma opção?"
        )
        self.assertIn("components: Checkbox, Radio Button", understanding.retrieval_query)
        self.assertIn("user goal: compare_component_fit", understanding.retrieval_query)

    def test_token_retrieval_includes_semantic_aliases(self) -> None:
        self.assertIn("token_alias", INTENT_FILTER["token_lookup"])


if __name__ == "__main__":
    unittest.main()
