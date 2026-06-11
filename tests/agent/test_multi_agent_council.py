from __future__ import annotations

import unittest

from agent.models import DecisionMemoryContext, SystemImpactAnalysis, TradeoffAnalysis
from agent.multi_agent_council import (
    COUNCIL_PERSPECTIVES,
    build_multi_agent_council,
    build_multi_agent_council_contract,
)
from agent.multi_agent_council_validator import deterministic_council_response


class MultiAgentCouncilTests(unittest.TestCase):
    def test_council_includes_five_perspectives(self) -> None:
        council = build_multi_agent_council(
            query="Devemos usar Dialog ou Drawer?",
            tradeoff=TradeoffAnalysis(
                recommendation="Dialog",
                alternatives=["Drawer"],
            ),
            impact=SystemImpactAnalysis(level="medium"),
            english=False,
        )
        self.assertEqual(len(council.perspectives), len(COUNCIL_PERSPECTIVES))
        profile_ids = {op.perspective for op in council.perspectives}
        self.assertEqual(
            profile_ids,
            {
                "dev",
                "qa",
                "a11y",
                "product_designer",
                "maintainer",
            },
        )

    def test_dialog_vs_drawer_partial_consensus(self) -> None:
        council = build_multi_agent_council(
            query="Dialog ou Drawer para confirmação?",
            tradeoff=TradeoffAnalysis(
                recommendation="Dialog",
                alternatives=["Drawer"],
            ),
            impact=SystemImpactAnalysis(level="medium"),
            english=False,
        )
        by_profile = {op.perspective: op.recommendation for op in council.perspectives}
        self.assertEqual(by_profile["dev"], "Dialog")
        self.assertEqual(by_profile["qa"], "Dialog")
        self.assertEqual(by_profile["a11y"], "Dialog")
        self.assertEqual(by_profile["product_designer"], "Drawer")
        self.assertEqual(council.synthesis.consensus, "partial_consensus")
        self.assertEqual(council.synthesis.consensus_percent, 80)
        self.assertIn("fluxo", council.synthesis.divergence_reason.lower())
        self.assertTrue(council.synthesis.final_recommendation)

    def test_each_perspective_has_risks_and_confidence(self) -> None:
        council = build_multi_agent_council(
            query="Devemos usar Dialog?",
            tradeoff=TradeoffAnalysis(
                recommendation="Dialog",
                alternatives=["Drawer"],
                risks=["Regressão de foco"],
            ),
            impact=SystemImpactAnalysis(level="low"),
            english=False,
        )
        for opinion in council.perspectives:
            self.assertTrue(opinion.justification)
            self.assertTrue(opinion.risks)
            self.assertTrue(opinion.confidence)

    def test_contract_declares_multi_agent_mode(self) -> None:
        council = build_multi_agent_council(
            query="Should we use Dialog?",
            tradeoff=TradeoffAnalysis(recommendation="Dialog", alternatives=["Drawer"]),
            impact=SystemImpactAnalysis(level="medium"),
            english=True,
        )
        contract = build_multi_agent_council_contract(
            council=council,
            tradeoff=TradeoffAnalysis(recommendation="Dialog", alternatives=["Drawer"]),
            impact=SystemImpactAnalysis(level="medium"),
            english=True,
        )
        self.assertEqual(contract["mode"], "multi_agent_council")
        self.assertIn("council", contract)

    def test_deterministic_response_includes_synthesis(self) -> None:
        council = build_multi_agent_council(
            query="Dialog ou Drawer?",
            tradeoff=TradeoffAnalysis(
                recommendation="Dialog",
                alternatives=["Drawer"],
            ),
            impact=SystemImpactAnalysis(level="medium"),
            english=False,
        )
        response = deterministic_council_response(
            query="Dialog ou Drawer?",
            tradeoff=TradeoffAnalysis(
                recommendation="Dialog",
                alternatives=["Drawer"],
            ),
            impact=SystemImpactAnalysis(level="medium"),
            memory=DecisionMemoryContext(),
            council=council,
            english=False,
        )
        self.assertIn("Conselho Multi-Agente", response)
        self.assertIn("Síntese", response)
        self.assertIn("Consenso Parcial", response)
        self.assertIn("Recomendação Final", response)
