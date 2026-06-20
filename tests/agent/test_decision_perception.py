"""Tests for institutional decision perception layer."""

from __future__ import annotations

import unittest

from agent.decision_perception import (
    append_perception_if_needed,
    build_evidence_gap_explanation,
    build_perception_intelligence,
    build_relevant_alternatives,
    format_decision_reasoning_brief,
    format_evidence_gap_response,
    reasoning_already_present,
    should_build_perception,
    should_deliver_institutional_reasoning_only,
)
from agent.evidence import build_component_selection, evidence_from_chunks
from agent.models import TradeoffAnalysis
from agent.understanding import analyze_query
from component_metadata import component_registry


BUTTON_CHUNK = [{
    "title": "Button",
    "source": "ComponentsPage",
    "page_type": "component",
    "component_id": "button",
    "status": "stable",
    "text": "Button | aciona uma tarefa clara.",
    "similarity": 0.82,
    "retrieval_weight": 1.0,
    "weighted_score": 0.82,
    "when_to_use": [],
    "when_not_to_use": [],
    "accessibility": None,
    "component_metadata": component_registry()["button"].model_dump(mode="json"),
}]


class DecisionPerceptionTests(unittest.TestCase):
    def test_should_build_perception_for_component_decision(self) -> None:
        items = evidence_from_chunks(BUTTON_CHUNK)
        selection = build_component_selection(
            items,
            query="qual componente usar para ação primária?",
            profile="designer",
            named_components=["Button"],
        )
        self.assertTrue(
            should_build_perception(
                "component_decision",
                component_selection=selection,
                tradeoff=None,
            )
        )
        self.assertFalse(
            should_build_perception(
                "greeting",
                component_selection=selection,
                tradeoff=None,
            )
        )

    def test_drawer_dialog_uses_institutional_reasoning_only(self) -> None:
        query = "Devo usar Drawer ou Dialog para configurações?"
        understanding = analyze_query(query)
        perception = build_perception_intelligence(
            query=query,
            workflow="component_decision",
            understanding=understanding,
            component_selection=None,
            execution=None,
            tradeoff=TradeoffAnalysis(
                recommendation="Modal Dialog",
                alternatives=["Drawer"],
            ),
            impact=None,
            profile="ux_specialist",
            english=False,
        )
        self.assertIsNotNone(perception)
        assert perception is not None
        self.assertTrue(
            should_deliver_institutional_reasoning_only(
                workflow="component_decision",
                understanding=understanding,
                query=query,
                perception=perception,
            )
        )
        card = (
            "Componente encontrado: Modal/Dialog\n\n"
            "Motivo\nStatus: stable."
        )
        resolved = append_perception_if_needed(
            card,
            perception,
            english=False,
            workflow="component_decision",
            understanding=understanding,
            query=query,
        )
        self.assertNotIn("Componente encontrado", resolved)
        self.assertIn("## Recomendação", resolved)
        self.assertNotIn("100%", resolved)

    def test_relevant_alternatives_exclude_unrelated_components(self) -> None:
        dialog = component_registry()["modal-dialog"]
        query = "Devo usar Drawer ou Dialog para configurações?"
        alternatives = build_relevant_alternatives(
            recommended=dialog,
            tradeoff=TradeoffAnalysis(recommendation="Modal Dialog", alternatives=["Drawer"]),
            evidence=[],
            catalog_gaps=[],
            english=False,
            query=query,
        )
        names = {alt.name.lower() for alt in alternatives}
        self.assertNotIn("button", names)
        self.assertNotIn("form field", names)

    def test_reasoning_brief_has_required_sections(self) -> None:
        query = "Devo usar Drawer ou Dialog para configurações?"
        understanding = analyze_query(query)
        perception = build_perception_intelligence(
            query=query,
            workflow="compare_options",
            understanding=understanding,
            component_selection=None,
            execution=None,
            tradeoff=TradeoffAnalysis(recommendation="Modal Dialog"),
            impact=None,
            profile="designer",
            english=False,
        )
        self.assertIsNotNone(perception)
        text = format_decision_reasoning_brief(perception, english=False)
        self.assertIn("## Recomendação", text)
        self.assertIn("## Justificativa", text)
        self.assertIn("## Limitações", text)
        self.assertIn("Condições de aceite", text)
        self.assertIn("Riscos residuais", text)

    def test_evidence_gap_explainer_is_actionable(self) -> None:
        understanding = analyze_query("como devo estruturar esta tela?")
        explanation = build_evidence_gap_explanation(
            query=understanding.retrieval_query,
            understanding=understanding,
            execution=None,
            workflow="component_decision",
            english=False,
        )
        response = format_evidence_gap_response(explanation, english=False)
        self.assertIn("Evidência Insuficiente", response)
        self.assertIn("Lacunas identificadas", response)

    def test_reasoning_marker_detection(self) -> None:
        self.assertTrue(
            reasoning_already_present("Resposta\n\n## Recomendação\n")
        )
        self.assertFalse(reasoning_already_present("Componente encontrado: Dialog"))


if __name__ == "__main__":
    unittest.main()
