from __future__ import annotations

import unittest

from agent.claims import build_claims_for_context, build_claims_from_selection
from agent.evidence_integrity import EvidenceIntegrityValidator
from agent.models import CatalogEntityResolution, Claim, ComponentSelection
from agent.ui_leak_guard import contains_internal_audit_leak, sanitize_assistant_content
from tests.agent.fixtures import fixture_retrieve


class ClaimBuilderTests(unittest.TestCase):
    def test_builds_recommendation_claim_from_selection(self) -> None:
        from agent.evidence import build_component_selection, evidence_from_chunks

        chunks = fixture_retrieve(
            "preciso de um dialog modal",
            "component_guidance",
            5,
            "general",
        )
        selection = build_component_selection(
            evidence_from_chunks(chunks),
            query="preciso de um dialog modal",
            profile="general",
        )
        claims = build_claims_from_selection(selection)
        recommendation = next(
            (claim for claim in claims if claim.id == "recommendation"),
            None,
        )
        self.assertIsNotNone(recommendation)
        assert recommendation is not None
        self.assertEqual(recommendation.evidence_source, "component-metadata.json")
        self.assertIn(recommendation.confidence, {"strong", "medium", "weak"})


class EvidenceIntegrityValidatorTests(unittest.TestCase):
    def setUp(self) -> None:
        self.validator = EvidenceIntegrityValidator()

    def test_blocks_internal_audit_leak(self) -> None:
        polluted = (
            "Use Dialog.\n"
            "Retrieval evidence tier: partial. Evidence similarity: 0.612."
        )
        from agent.understanding import analyze_query

        understanding = analyze_query("Qual componente usar para modal?")
        result = self.validator.validate(
            response_text=polluted,
            workflow="component_decision",
            understanding=understanding,
            component_selection=None,
            evidence=[],
        )
        self.assertEqual(result.status, "blocked")
        self.assertIn("internal_audit_leak", result.violations)

    def test_blocks_pretrained_only_recommendation(self) -> None:
        from agent.understanding import analyze_query

        understanding = analyze_query("Qual componente usar para modal?")
        result = self.validator.validate(
            response_text="Recomendo usar Side Drawer para este caso.",
            workflow="component_decision",
            understanding=understanding,
            component_selection=None,
            evidence=[],
        )
        self.assertEqual(result.status, "blocked")
        self.assertIn("pretrained_only_recommendation", result.violations)

    def test_passes_clean_evidence_framed_response(self) -> None:
        from agent.understanding import analyze_query

        understanding = analyze_query("Existe o componente Side Drawer?")
        resolution = CatalogEntityResolution(
            entity_label="Side Drawer",
            entity_type="component",
            entity_status="unknown",
        )
        understanding.catalog_entity_resolution = resolution
        response = "Não encontrei evidência de Side Drawer no catálogo atual."
        result = self.validator.validate(
            response_text=response,
            workflow="unknown_entity_lookup",
            understanding=understanding,
            component_selection=None,
            evidence=[],
        )
        self.assertEqual(result.status, "pass")

    def test_blocks_absent_claims_presented_as_facts(self) -> None:
        claims = [
            Claim(
                id="recommendation",
                claim="Ghost Button",
                evidence_source=None,
                confidence="absent",
            ),
        ]
        from agent.understanding import analyze_query

        understanding = analyze_query("Qual componente usar?")
        result = self.validator.validate(
            response_text="Componente recomendado: Ghost Button",
            workflow="component_decision",
            understanding=understanding,
            component_selection=ComponentSelection(
                recommended=None,
                alternative_components=[],
                rejected_components=[],
                selection_reason="test",
                selection_policy="test",
            ),
            evidence=[],
            claims=claims,
        )
        self.assertIn("claim_without_evidence", result.violations)


class UiLeakGuardExpansionTests(unittest.TestCase):
    def test_detects_retrieval_tier_leak(self) -> None:
        leak = "Retrieval evidence tier: partial"
        self.assertTrue(contains_internal_audit_leak(leak))

    def test_sanitize_strips_audit_lines(self) -> None:
        polluted = (
            "Componente recomendado: Dialog\n\n"
            "Motivo\nStatus: active.\n\n"
            "Evidência\nRetrieval evidence tier: strong."
        )
        cleaned = sanitize_assistant_content(polluted)
        self.assertNotIn("Retrieval evidence tier", cleaned)
        self.assertIn("Dialog", cleaned)


if __name__ == "__main__":
    unittest.main()
