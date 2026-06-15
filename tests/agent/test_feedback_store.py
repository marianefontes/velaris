from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from agent.store import AgentStore


class FeedbackStoreTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.store = AgentStore(Path(self.temp_dir.name) / "agent.sqlite3")
        self.store.initialize()

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_record_and_read_feedback(self) -> None:
        stored = self.store.record_feedback(
            rating="down",
            request_id="req_1",
            reason="invented a component",
            user_query="tem drawer?",
            detected_intent="unsupported_entity_lookup",
            detected_language="pt-BR",
        )
        self.assertEqual(stored["rating"], "down")
        self.assertTrue(stored["feedback_id"])
        fetched = self.store.get_feedback(stored["feedback_id"])
        self.assertIsNotNone(fetched)
        assert fetched is not None
        self.assertEqual(fetched["user_query"], "tem drawer?")
        self.assertEqual(fetched["detected_intent"], "unsupported_entity_lookup")

    def test_rating_is_normalized_and_validated(self) -> None:
        stored = self.store.record_feedback(rating="UP")
        self.assertEqual(stored["rating"], "up")
        with self.assertRaises(ValueError):
            self.store.record_feedback(rating="maybe")

    def test_list_feedback_filters_by_rating(self) -> None:
        self.store.record_feedback(rating="up", user_query="a")
        self.store.record_feedback(rating="down", user_query="b")
        self.store.record_feedback(rating="down", user_query="c")
        self.assertEqual(len(self.store.list_feedback()), 3)
        self.assertEqual(len(self.store.list_feedback(rating="down")), 2)
        self.assertEqual(len(self.store.list_feedback(rating="up")), 1)

    def test_summary_aggregates_intent_language_and_corrections(self) -> None:
        self.store.record_feedback(
            rating="down",
            detected_intent="component_recommendation",
            detected_language="es",
            corrected_intent="unsupported_entity_lookup",
        )
        self.store.record_feedback(
            rating="down",
            detected_intent="component_recommendation",
            detected_language="es",
        )
        self.store.record_feedback(rating="up", detected_intent="entity_lookup")

        summary = self.store.feedback_summary()
        self.assertEqual(summary["total"], 3)
        self.assertEqual(summary["up"], 1)
        self.assertEqual(summary["down"], 2)
        self.assertAlmostEqual(summary["satisfaction_ratio"], round(1 / 3, 4))

        top_down = summary["down_by_intent"][0]
        self.assertEqual(top_down["intent"], "component_recommendation")
        self.assertEqual(top_down["count"], 2)

        corrections = summary["suggested_intent_corrections"]
        self.assertEqual(len(corrections), 1)
        self.assertEqual(corrections[0]["from"], "component_recommendation")
        self.assertEqual(corrections[0]["to"], "unsupported_entity_lookup")

    def test_empty_summary_is_safe(self) -> None:
        summary = self.store.feedback_summary()
        self.assertEqual(summary["total"], 0)
        self.assertEqual(summary["satisfaction_ratio"], 0.0)
        self.assertEqual(summary["down_by_intent"], [])


if __name__ == "__main__":
    unittest.main()
