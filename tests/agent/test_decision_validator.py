from __future__ import annotations

import unittest

from agent.decision_validator import (
    deterministic_decision_response,
    validate_decision_response,
)
from agent.models import (
    DecisionMemoryContext,
    DecisionMemoryEntry,
    SystemImpactAnalysis,
    TradeoffAnalysis,
)


class DecisionValidatorTests(unittest.TestCase):
    def test_complete_response_passes(self) -> None:
        text = (
            "**Recomendação:** Use Dialog.\n\n"
            "**Benefícios:**\n- foco total\n\n"
            "**Custos:**\n- interrompe fluxo\n\n"
            "**Riscos:**\n- fadiga de confirmação\n\n"
            "**Impacto Sistêmico:**\nNível: medium\n"
            "Áreas afetadas:\n- documentation\n\n"
            "**Alternativas:**\n- Drawer\n\n"
            "Esta recomendação está alinhada à decisão DEC-014."
        )
        validation = validate_decision_response(
            text,
            query="Devemos substituir Dialog por Drawer?",
            tradeoff=TradeoffAnalysis(
                recommendation="Dialog",
                alternatives=["Drawer"],
            ),
            impact=SystemImpactAnalysis(level="medium"),
            memory=DecisionMemoryContext(
                related_decisions=[
                    DecisionMemoryEntry(
                        decision_id="dec_abc",
                        decision_code="DEC-014",
                        recommended_option="Dialog",
                        status="confirmed",
                    )
                ]
            ),
            requires_alternatives=True,
        )
        self.assertEqual(validation.status, "pass")

    def test_missing_tradeoff_triggers_fallback(self) -> None:
        validation = validate_decision_response(
            "Use Dialog. Benefícios: foco total.",
            query="Devemos usar Dialog?",
            tradeoff=TradeoffAnalysis(recommendation="Dialog"),
            impact=SystemImpactAnalysis(),
            memory=None,
            requires_alternatives=False,
        )
        self.assertEqual(validation.status, "fallback")
        self.assertIn("missing_cost", validation.violations)

    def test_deterministic_fallback_includes_sections(self) -> None:
        response = deterministic_decision_response(
            query="Devemos usar Dialog?",
            tradeoff=TradeoffAnalysis(
                recommendation="Dialog",
                benefits=["foco total"],
                costs=["interrompe fluxo"],
                risks=["fadiga"],
                alternatives=["Drawer"],
            ),
            impact=SystemImpactAnalysis(
                level="high",
                affected_areas=["documentation", "accessibility"],
            ),
            memory=DecisionMemoryContext(
                related_decisions=[
                    DecisionMemoryEntry(
                        decision_id="dec_1",
                        decision_code="DEC-014",
                        status="confirmed",
                    )
                ]
            ),
            english=False,
        )
        self.assertIn("Recomendação", response)
        self.assertIn("Custos", response)
        self.assertIn("DEC-014", response)


if __name__ == "__main__":
    unittest.main()
