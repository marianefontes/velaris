from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from agent.decision_intelligence import (
    analyze_system_impact,
    build_tradeoff_analysis,
    detect_decision_analysis_mode,
    resolve_decision_memory,
)
from agent.executor import PlanExecution
from agent.models import CreateDecisionRecordInput, ExtractedEntities
from agent.store import AgentStore


class DecisionIntelligenceTests(unittest.TestCase):
    def test_detects_decision_analysis_mode(self) -> None:
        self.assertTrue(detect_decision_analysis_mode("Devemos usar Dialog ou Drawer?"))
        self.assertTrue(detect_decision_analysis_mode("Is it worth migrating to Drawer?"))
        self.assertFalse(detect_decision_analysis_mode("O que é um token?"))

    def test_tradeoff_analysis_requires_costs(self) -> None:
        tradeoff = build_tradeoff_analysis(
            query="Devemos substituir Dialog por Drawer?",
            execution=None,
            component_selection=None,
        )
        self.assertTrue(tradeoff.costs)
        self.assertTrue(tradeoff.risks)

    def test_system_impact_detects_significant_change(self) -> None:
        impact = analyze_system_impact(
            query="Podemos substituir Dialog por Drawer?",
            execution=None,
            entities=ExtractedEntities(components=["Dialog", "Drawer"]),
        )
        self.assertIn(impact.level, {"medium", "high", "critical"})
        self.assertIn("components", impact.affected_areas)

    def test_decision_memory_resolves_recent_decisions(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            store = AgentStore(Path(temp_dir) / "agent.sqlite3")
            store.initialize()
            created = store.create_decision(
                CreateDecisionRecordInput(
                    request_id="req_1",
                    session_id="session_a",
                    project_id="project_a",
                    user_query="Escolha de Dialog para confirmação crítica",
                    profile="designer",
                    workflow="decision_analysis",
                    recommendation="Use Dialog.",
                    title="Dialog para confirmação",
                    recommended_option="Dialog",
                    rejected_options=["Drawer", "Sheet"],
                    alternatives_considered=["Drawer", "Sheet"],
                    tradeoffs=["Dialog interrompe fluxo."],
                    top_similarity=0.8,
                    evidence_tier="strong",
                    model="test",
                )
            )
            store.update_decision_status(created["decision_id"], "confirmed")
            store.update_memory(
                session_id="session_a",
                project_id="project_a",
                profile="designer",
                intent="decision_analysis",
                preferred_detail_level="balanced",
                topics=["dialog"],
                decision_id=created["decision_id"],
            )
            memory = resolve_decision_memory(
                store,
                project_id="project_a",
                session_id="session_a",
                query="Devemos usar Dialog para confirmação?",
                entities=ExtractedEntities(components=["Dialog"]),
            )
            self.assertTrue(memory.related_decisions)
            self.assertEqual(
                memory.related_decisions[0].decision_code,
                created["decision_code"],
            )


if __name__ == "__main__":
    unittest.main()
