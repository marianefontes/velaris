from __future__ import annotations

import unittest

from agent.evidence import evidence_from_chunks, evidence_tier, top_similarity
from tests.agent.fixtures import FIXTURE_CHUNKS


class AgentEvidenceTests(unittest.TestCase):
    def test_evidence_tier_thresholds(self) -> None:
        self.assertEqual(evidence_tier(0.75, has_results=True), "strong")
        self.assertEqual(evidence_tier(0.50, has_results=True), "partial")
        self.assertEqual(evidence_tier(0.49, has_results=True), "weak")
        self.assertEqual(evidence_tier(None, has_results=False), "insufficient")

    def test_deduplicates_identical_sources(self) -> None:
        chunk = FIXTURE_CHUNKS["component_guidance"][0]
        items = evidence_from_chunks([chunk, dict(chunk)])
        self.assertEqual(len(items), 1)

    def test_preserves_full_semantic_text_separately_from_excerpt(self) -> None:
        items = evidence_from_chunks(FIXTURE_CHUNKS["component_guidance"])
        self.assertEqual(top_similarity(items), 0.82)
        self.assertLessEqual(len(items[0].excerpt), 360)
        self.assertIn("When To Use", items[0].semantic_text)
        self.assertEqual(items[0].component_id, "modal-dialog")
        self.assertIsNotNone(items[0].component_metadata)


if __name__ == "__main__":
    unittest.main()
