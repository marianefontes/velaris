from __future__ import annotations

import unittest

from agent.intelligence_lab import (
    ADVERSARIAL_CASES,
    list_adversarial_cases,
    run_catalog_sanity_checks,
)
from agent.knowledge_health import build_knowledge_health_dashboard
from agent.reliability_gates import run_reliability_gates


class KnowledgeHealthDashboardTests(unittest.TestCase):
    def test_dashboard_payload_shape(self) -> None:
        payload = build_knowledge_health_dashboard()
        self.assertIn("knowledge_health_score", payload)
        self.assertIn("entities_catalogued", payload)
        self.assertIn("component_coverage", payload)
        self.assertIn("perspective_coverage", payload)
        self.assertIn("knowledge_gaps", payload)
        self.assertIn("evidence_health", payload)
        self.assertIn("decision_health", payload)
        self.assertIn("intelligence_scores", payload)
        self.assertIn("knowledge_debt_backlog", payload)
        self.assertGreater(payload["entities_catalogued"]["components"], 0)
        self.assertEqual(len(payload["perspective_coverage"]), 8)

    def test_component_coverage_dimensions(self) -> None:
        from component_metadata import component_catalog

        component_catalog.cache_clear()
        payload = build_knowledge_health_dashboard()
        sample = payload["component_coverage"][0]
        expected = {
            "description",
            "variants",
            "states",
            "accessibility",
            "when_to_use",
            "when_not_to_use",
            "edge_cases",
            "examples",
            "guidelines",
            "related_components",
            "limitations",
        }
        self.assertEqual(set(sample["dimensions"]), expected)
        self.assertGreaterEqual(payload["intelligence_scores"]["knowledge_coverage"], 80)
        self.assertEqual(payload["critical_entity_count"], 0)


class IntelligenceLabTests(unittest.TestCase):
    def test_adversarial_cases_registered(self) -> None:
        cases = list_adversarial_cases()
        self.assertEqual(len(cases), len(ADVERSARIAL_CASES))
        categories = {case["category"] for case in cases}
        self.assertIn("unknown_components", categories)
        self.assertIn("invalid_comparisons", categories)
        self.assertIn("hallucination_detection", categories)

    def test_catalog_sanity_checks(self) -> None:
        sanity = run_catalog_sanity_checks()
        self.assertTrue(sanity["checks"]["unknown_token_brand_999"])
        self.assertTrue(sanity["checks"]["side_drawer_unsupported"])


class ReliabilityGatesTests(unittest.TestCase):
    def test_gates_payload(self) -> None:
        payload = run_reliability_gates()
        self.assertIn("gates", payload)
        self.assertEqual(
            set(payload["gates"]),
            {
                "knowledge_coverage_check",
                "hallucination_check",
                "evidence_integrity_check",
                "entity_validation_check",
            },
        )
