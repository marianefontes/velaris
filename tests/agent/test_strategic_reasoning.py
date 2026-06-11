from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from agent.decision_intelligence import build_tradeoff_analysis, resolve_decision_memory
from agent.models import (
    CreateDecisionRecordInput,
    DecisionMemoryContext,
    DecisionMemoryEntry,
    ExtractedEntities,
    SystemImpactAnalysis,
    TradeoffAnalysis,
)
from agent.store import AgentStore
from agent.strategic_reasoning import (
    build_perspective_divergence,
    build_scenario_analysis,
    build_second_order_effects,
    build_strategic_reasoning,
    detect_architect_review_mode,
    simulate_consequences,
)


class StrategicReasoningTests(unittest.TestCase):
    def test_detects_architect_review_mode(self) -> None:
        self.assertTrue(
            detect_architect_review_mode("E se substituirmos Dialog por Drawer?")
        )
        self.assertTrue(
            detect_architect_review_mode("What if we remove Dialog?")
        )
        self.assertTrue(
            detect_architect_review_mode("Quais consequências de migrar para Drawer?")
        )
        self.assertFalse(detect_architect_review_mode("O que é um token?"))
        self.assertTrue(
            detect_architect_review_mode("/simulate substituir Modal por Drawer")
        )

    def test_consequence_simulation_groups_by_probability(self) -> None:
        impact = SystemImpactAnalysis(
            level="high",
            affected_areas=["documentation", "tests", "accessibility"],
        )
        tradeoff = TradeoffAnalysis(
            recommendation="Drawer",
            alternatives=["Dialog"],
            risks=["Regressão de foco"],
        )
        simulation = simulate_consequences(
            query="E se substituirmos Dialog por Drawer?",
            tradeoff=tradeoff,
            impact=impact,
            entities=ExtractedEntities(components=["Dialog", "Drawer"]),
            english=False,
        )
        self.assertTrue(simulation.consequences)
        levels = {c.probability for c in simulation.consequences}
        self.assertIn("high", levels)

    def test_perspective_divergence_produces_multiple_opinions(self) -> None:
        divergence = build_perspective_divergence(
            query="Dialog ou Drawer?",
            tradeoff=TradeoffAnalysis(
                recommendation="Dialog",
                alternatives=["Drawer"],
            ),
            impact=SystemImpactAnalysis(level="medium"),
            english=False,
        )
        self.assertGreaterEqual(len(divergence.opinions), 5)
        self.assertIn(divergence.consensus, {
            "consensus", "partial_consensus", "conflict",
        })
        self.assertTrue(divergence.synthesis)

    def test_scenario_analysis_includes_three_cases(self) -> None:
        scenarios = build_scenario_analysis(
            tradeoff=TradeoffAnalysis(recommendation="Drawer"),
            impact=SystemImpactAnalysis(level="medium"),
            english=False,
        )
        case_types = {s.case_type for s in scenarios.scenarios}
        self.assertEqual(case_types, {"best", "expected", "worst"})

    def test_second_order_effects_separates_direct_and_indirect(self) -> None:
        effects = build_second_order_effects(
            impact=SystemImpactAnalysis(
                level="high",
                affected_areas=["components", "documentation"],
                affected_entities=["Dialog"],
            ),
            tradeoff=TradeoffAnalysis(recommendation="Drawer"),
            english=False,
        )
        self.assertTrue(effects.direct)
        self.assertTrue(effects.indirect)

    def test_build_strategic_reasoning_includes_timeline_from_memory(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            store = AgentStore(Path(temp_dir) / "agent.sqlite3")
            store.initialize()
            created = store.create_decision(
                CreateDecisionRecordInput(
                    request_id="req_1",
                    session_id="session_a",
                    project_id="project_a",
                    user_query="Dialog para confirmação crítica",
                    profile="designer",
                    workflow="decision_analysis",
                    recommendation="Use Dialog.",
                    title="Dialog para confirmação",
                    recommended_option="Dialog",
                    rejected_options=["Drawer"],
                    alternatives_considered=["Drawer"],
                    tradeoffs=["Dialog interrompe fluxo."],
                    top_similarity=0.8,
                    evidence_tier="strong",
                    model="test",
                )
            )
            store.update_decision_status(created["decision_id"], "confirmed")
            memory = resolve_decision_memory(
                store,
                project_id="project_a",
                session_id="session_a",
                query="E se substituirmos Dialog por Drawer?",
                entities=ExtractedEntities(components=["Dialog", "Drawer"]),
            )
            tradeoff = build_tradeoff_analysis(
                query="E se substituirmos Dialog por Drawer?",
                execution=None,
                component_selection=None,
            )
            tradeoff = TradeoffAnalysis(
                recommendation="Drawer",
                alternatives=["Dialog"],
                costs=["Interrompe fluxo"],
                risks=["Regressão de acessibilidade"],
            )
            impact = SystemImpactAnalysis(
                level="high",
                affected_areas=["components", "documentation", "tests"],
                affected_entities=["Dialog", "Drawer"],
            )
            analysis = build_strategic_reasoning(
                query="E se substituirmos Dialog por Drawer?",
                tradeoff=tradeoff,
                impact=impact,
                memory=memory,
                entities=ExtractedEntities(components=["Dialog", "Drawer"]),
                store=store,
                project_id="project_a",
                english=False,
            )
            self.assertTrue(analysis.architect_review_mode)
            self.assertTrue(analysis.consequence_simulation.consequences)
            self.assertGreaterEqual(len(analysis.perspective_divergence.opinions), 4)
            self.assertEqual(len(analysis.scenario_analysis.scenarios), 3)


if __name__ == "__main__":
    unittest.main()
