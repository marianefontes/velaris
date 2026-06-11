from __future__ import annotations

import unittest

from component_metadata import (
    component_document_text,
    component_metadata,
)
from agent.evidence import build_component_selection, evidence_from_chunks
from agent.response_validation import (
    deterministic_component_response,
    validate_component_response,
)


QUERY = (
    "Qual componente devo usar para uma ação destrutiva, "
    "como excluir um item importante?"
)


def component_chunk(
    component_id: str,
    *,
    similarity: float,
    weighted_score: float,
    status: str | None = None,
) -> dict:
    component = component_metadata(component_id)
    if component is None:
        raise AssertionError(f"Missing fixture component {component_id}")
    payload = component.model_dump(mode="json")
    if status is not None:
        payload["status"] = status
    return {
        "title": component.name,
        "source": "data/component-metadata.json",
        "page_type": "component",
        "component_id": component.component_id,
        "status": status or component.status,
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


class ComponentIntelligenceTests(unittest.TestCase):
    def selection(self):
        return build_component_selection(
            evidence_from_chunks([
                component_chunk(
                    "modal-dialog",
                    similarity=0.62,
                    weighted_score=0.68,
                ),
                component_chunk(
                    "alert",
                    similarity=0.61,
                    weighted_score=0.65,
                ),
                component_chunk(
                    "button",
                    similarity=0.60,
                    weighted_score=0.63,
                ),
            ]),
            query=QUERY,
            profile="dev",
        )

    def test_selects_highest_eligible_component_and_near_alternative(self) -> None:
        selection = self.selection()
        self.assertEqual(
            selection.recommended.component.component_id,
            "modal-dialog",
        )
        self.assertEqual(
            [item.component_id for item in selection.alternative_components],
            ["alert"],
        )
        self.assertEqual(selection.alternative_threshold, 0.03)
        self.assertEqual(selection.alternative_limit, 3)
        self.assertNotIn(
            "modal-dialog",
            [item.component_id for item in selection.alternative_components],
        )

    def test_used_rules_mean_deterministically_selected_rules(self) -> None:
        recommended = self.selection().recommended
        self.assertIsNotNone(recommended)
        self.assertTrue(recommended.selected_do_rules)
        self.assertTrue(recommended.selected_dont_rules)
        self.assertTrue(recommended.selected_when_to_use)
        self.assertTrue(recommended.selected_when_not_to_use)
        self.assertTrue(
            all(rule.sources for rule in recommended.selected_when_to_use)
        )
        self.assertIn("intent", recommended.missing_fields)
        self.assertIn("anti_patterns", recommended.missing_fields)
        self.assertEqual(recommended.empty_fields, [])

    def test_developer_and_accessibility_receive_structured_accessibility_fields(self) -> None:
        chunk = component_chunk(
            "modal-dialog",
            similarity=0.62,
            weighted_score=0.68,
        )
        accessibility = chunk["component_metadata"]["accessibility"]
        accessibility["keyboard"] = [{
            "id": "modal-dialog.keyboard.1",
            "text": {
                "pt": "Mantenha o foco dentro do modal.",
                "en": "Keep focus inside the modal.",
            },
        }]
        accessibility["aria"] = [{
            "id": "modal-dialog.aria.1",
            "attribute": "aria-modal",
            "value": "true",
            "text": {
                "pt": "Identifica o conteúdo como modal.",
                "en": "Identifies the content as modal.",
            },
        }]
        chunk["accessibility"] = accessibility

        for profile in ("dev", "a11y"):
            with self.subTest(profile=profile):
                selection = build_component_selection(
                    evidence_from_chunks([chunk]),
                    query=QUERY,
                    profile=profile,
                )
                recommended = selection.recommended
                self.assertIsNotNone(recommended)
                self.assertEqual(recommended.perspective_coverage.profile, profile)
                self.assertIn(
                    "accessibility.keyboard",
                    recommended.perspective_coverage.present_required_fields,
                )
                self.assertIn(
                    "accessibility.aria",
                    recommended.perspective_coverage.present_required_fields,
                )
                self.assertTrue(recommended.component.accessibility.keyboard)
                self.assertTrue(recommended.component.accessibility.aria)

    def test_component_evidence_exposes_about_features_and_common_uses(self) -> None:
        selection = self.selection()
        recommended = selection.recommended
        self.assertIsNotNone(recommended)
        self.assertTrue(recommended.component.about.pt)
        self.assertGreaterEqual(len(recommended.component.about_features), 3)
        self.assertGreaterEqual(len(recommended.component.common_uses), 4)
        self.assertIn("about", recommended.present_fields)
        self.assertIn("about_features", recommended.present_fields)
        self.assertIn("common_uses", recommended.present_fields)

    def test_deprecated_candidate_is_rejected_even_when_top_ranked(self) -> None:
        selection = build_component_selection(
            evidence_from_chunks([
                component_chunk(
                    "modal-dialog",
                    similarity=0.80,
                    weighted_score=0.90,
                    status="deprecated",
                ),
                component_chunk(
                    "alert",
                    similarity=0.65,
                    weighted_score=0.70,
                ),
            ]),
            query=QUERY,
            profile="designer",
        )
        self.assertEqual(selection.recommended.component.component_id, "alert")
        self.assertEqual(selection.rejected_components[0].reason, "deprecated_status")

    def test_weak_candidates_produce_no_recommendation(self) -> None:
        selection = build_component_selection(
            evidence_from_chunks([
                component_chunk(
                    "modal-dialog",
                    similarity=0.49,
                    weighted_score=0.80,
                ),
            ]),
            query=QUERY,
            profile="designer",
        )
        self.assertIsNone(selection.recommended)
        self.assertEqual(selection.alternative_components, [])
        self.assertEqual(selection.rejected_components[0].reason, "weak_evidence")

    def test_promoted_alternative_triggers_deterministic_fallback(self) -> None:
        selection = self.selection()
        validation = validate_component_response(
            "Componente recomendado: Alert\n\nCampos ausentes\nintent.",
            selection,
        )
        self.assertEqual(validation.status, "fallback")
        self.assertEqual(validation.violation_type, "promoted_alternative")
        self.assertEqual(validation.promoted_component_detected, "Alert")
        fallback = deterministic_component_response(selection)
        self.assertIn("Modal/Dialog", fallback)
        self.assertIn("Alert", fallback)
        self.assertNotIn("Retrieval evidence tier", fallback)
        self.assertNotIn("Documentação", fallback)

    def test_valid_response_passes_without_fallback(self) -> None:
        selection = self.selection()
        response = (
            "Componente recomendado: Modal/Dialog\n\n"
            "Motivo\nA confirmação é bloqueante.\n\n"
            "Limites\nNão use para conteúdo longo.\n\n"
            "Campos ausentes\nintent, variants.\n\n"
            "Evidência\nEvidence tier: partial.\n\n"
            "Alternativas\nAlert."
        )
        validation = validate_component_response(response, selection)
        self.assertEqual(validation.status, "pass")
        self.assertFalse(validation.fallback_used)

    def test_invented_confidence_percentage_triggers_fallback(self) -> None:
        selection = self.selection()
        response = (
            "Componente recomendado: Modal/Dialog\n\n"
            "Motivo\nA confirmação é bloqueante.\n\n"
            "Limites\nNão use para conteúdo longo.\n\n"
            "Campos ausentes\nintent, variants.\n\n"
            "Evidência\nConfiança: 92%.\n\n"
            "Alternativas\nAlert."
        )
        validation = validate_component_response(response, selection)
        self.assertEqual(validation.status, "fallback")
        self.assertEqual(validation.violation_type, "invented_confidence")


if __name__ == "__main__":
    unittest.main()
