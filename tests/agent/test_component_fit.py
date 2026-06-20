from __future__ import annotations

import unittest

from component_metadata import component_document_text, component_metadata
from agent.component_fit import (
    detect_context_violations,
    score_context_fit,
    should_hard_reject,
)
from agent.evidence import build_component_selection, evidence_from_chunks


def component_chunk(
    component_id: str,
    *,
    similarity: float,
    weighted_score: float,
) -> dict:
    component = component_metadata(component_id)
    if component is None:
        raise AssertionError(f"Missing fixture component {component_id}")
    payload = component.model_dump(mode="json")
    return {
        "title": component.name,
        "source": "data/component-metadata.json",
        "page_type": "component",
        "component_id": component.component_id,
        "status": component.status,
        "section": component.section,
        "text": component_document_text(component),
        "when_to_use": payload["when_to_use"],
        "when_not_to_use": payload["when_not_to_use"],
        "accessibility": payload["accessibility"],
        "aetheris_insight": payload["aetheris_insight"],
        "component_metadata": payload,
        "similarity": similarity,
        "retrieval_weight": 1.0,
        "weighted_score": weighted_score,
    }


class ComponentFitTests(unittest.TestCase):
    def test_modal_violates_multi_step_onboarding_query(self) -> None:
        query = (
            "Tenho um fluxo de onboarding em 5 passos. "
            "Posso usar Dialog aqui?"
        )
        component = component_metadata("modal-dialog")
        self.assertIsNotNone(component)
        violations = detect_context_violations(query, component)
        self.assertTrue(violations)
        self.assertEqual(violations[0].field, "dont")

    def test_modal_scores_well_for_destructive_confirmation(self) -> None:
        query = (
            "Qual componente devo usar para uma ação destrutiva, "
            "como excluir um item importante?"
        )
        component = component_metadata("modal-dialog")
        self.assertIsNotNone(component)
        assessment = score_context_fit(query, component)
        self.assertGreater(assessment.positive_signal, 0.1)
        self.assertEqual(assessment.violations, [])

    def test_onboarding_query_rejects_dialog_and_prefers_card(self) -> None:
        query = (
            "Tenho um fluxo de onboarding em 5 passos. "
            "Posso usar Dialog aqui?"
        )
        selection = build_component_selection(
            evidence_from_chunks([
                component_chunk(
                    "modal-dialog",
                    similarity=0.82,
                    weighted_score=0.84,
                ),
                component_chunk(
                    "card",
                    similarity=0.58,
                    weighted_score=0.60,
                ),
                component_chunk(
                    "form-field",
                    similarity=0.55,
                    weighted_score=0.57,
                ),
            ]),
            query=query,
            profile="designer",
            workflow="component_decision",
        )
        self.assertIsNotNone(selection.recommended)
        self.assertNotEqual(
            selection.recommended.component.component_id,
            "modal-dialog",
        )
        rejected = [
            item for item in selection.rejected_components
            if item.component_id == "modal-dialog"
        ]
        self.assertEqual(len(rejected), 1)
        self.assertEqual(rejected[0].reason, "dont_rule_violation")

    def test_toast_violates_critical_error_query(self) -> None:
        query = "Posso usar Toast para um erro crítico de pagamento?"
        component = component_metadata("toast")
        self.assertIsNotNone(component)
        violations = detect_context_violations(query, component)
        self.assertTrue(violations)
        assessment = score_context_fit(query, component)
        self.assertTrue(
            should_hard_reject(assessment, workflow="component_decision")
        )

    def test_entity_lookup_does_not_hard_reject_dialog(self) -> None:
        query = (
            "Tenho um fluxo de onboarding em 5 passos. "
            "Posso usar Dialog aqui?"
        )
        component = component_metadata("modal-dialog")
        self.assertIsNotNone(component)
        assessment = score_context_fit(query, component)
        self.assertTrue(assessment.violations)
        self.assertFalse(
            should_hard_reject(assessment, workflow="entity_lookup")
        )


if __name__ == "__main__":
    unittest.main()
