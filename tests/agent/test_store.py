from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from agent.models import CreateDecisionRecordInput, EvidenceItem
from agent.store import AgentStore, DecisionConflictError


class AgentStoreIntegrationTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.store = AgentStore(Path(self.temp_dir.name) / "agent.sqlite3")
        self.store.initialize()

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def decision_payload(self) -> CreateDecisionRecordInput:
        return CreateDecisionRecordInput(
            request_id="req_test",
            session_id="session_a",
            project_id="project_a",
            user_query="Qual componente usar?",
            profile="designer",
            workflow="component_decision",
            recommendation="Use Dialog.",
            alternatives_considered=["Drawer"],
            tradeoffs=["Dialog interrupts continuity."],
            evidence_sources=[
                EvidenceItem(
                    title="Dialog",
                    source="ComponentsPage",
                    page_type="component",
                    excerpt="Use for blocking decisions.",
                    similarity=0.82,
                    retrieval_weight=1.1,
                    weighted_score=0.902,
                ),
            ],
            top_similarity=0.82,
            evidence_tier="strong",
            model="test-model",
        )

    def test_creates_lists_and_reads_decision_draft(self) -> None:
        created = self.store.create_decision(self.decision_payload())
        self.assertEqual(created["status"], "draft")
        self.assertTrue(created["decision_code"].startswith("DEC-"))
        self.assertFalse(created["confirmed_by_user"])
        self.assertEqual(
            self.store.get_decision(created["decision_id"])["recommendation"],
            "Use Dialog.",
        )
        self.assertEqual(len(self.store.list_decisions(project_id="project_a")), 1)

    def test_confirms_decision(self) -> None:
        created = self.store.create_decision(self.decision_payload())
        updated = self.store.update_decision_status(created["decision_id"], "confirmed")
        self.assertEqual(updated["status"], "confirmed")
        self.assertTrue(updated["confirmed_by_user"])

    def test_rejects_decision(self) -> None:
        created = self.store.create_decision(self.decision_payload())
        updated = self.store.update_decision_status(created["decision_id"], "rejected")
        self.assertEqual(updated["status"], "rejected")
        self.assertFalse(updated["confirmed_by_user"])

    def test_conflicting_transition_is_blocked(self) -> None:
        created = self.store.create_decision(self.decision_payload())
        self.store.update_decision_status(created["decision_id"], "confirmed")
        with self.assertRaises(DecisionConflictError):
            self.store.update_decision_status(created["decision_id"], "rejected")

    def test_updates_session_and_project_memory(self) -> None:
        first = self.store.update_memory(
            session_id="session_a",
            project_id="project_a",
            profile="designer",
            intent="component_guidance",
            preferred_detail_level="balanced",
            topics=["dialog", "destructive action"],
            decision_id="dec_1",
        )
        self.store.update_memory(
            session_id="session_b",
            project_id="project_a",
            profile="dev",
            intent="token_lookup",
            preferred_detail_level="detailed",
            topics=["dialog"],
            decision_id="dec_2",
        )
        project = self.store.get_project_memory("project_a")
        self.assertEqual(first["session"]["last_intents"], ["component_guidance"])
        self.assertEqual(project["last_intents"], ["component_guidance", "token_lookup"])
        self.assertEqual(project["recent_decisions"], ["dec_1", "dec_2"])
        self.assertEqual(project["recurring_topics"]["dialog"], 2)
        self.assertEqual(project["preferred_detail_level"], "detailed")

    def test_creates_and_finalizes_agent_run(self) -> None:
        self.store.create_run(
            request_id="req_run",
            session_id="session_a",
            project_id="project_a",
            user_query="Dialog?",
            profile="designer",
            intent="component_guidance",
            workflow="component_decision",
            plan={"tools": ["search_component"]},
            model="test-model",
            steps=[{"id": "request_received", "status": "completed"}],
        )
        finalized = self.store.finalize_run(
            "req_run",
            tools_used=[{"name": "search_component", "status": "completed"}],
            steps=[{"id": "response_completed", "status": "completed"}],
            sources=[{"title": "Dialog"}],
            top_similarity=0.82,
            evidence_tier="strong",
            limitations=[],
            status="completed",
            decision_id="dec_1",
        )
        self.assertEqual(finalized["status"], "completed")
        self.assertEqual(finalized["decision_id"], "dec_1")
        self.assertIsNotNone(finalized["duration_ms"])


if __name__ == "__main__":
    unittest.main()
