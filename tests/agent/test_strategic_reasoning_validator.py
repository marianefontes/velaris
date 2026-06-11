from __future__ import annotations

import unittest

from agent.models import (
    ConsequenceSimulation,
    DecisionMemoryContext,
    PerspectiveDivergenceAnalysis,
    PerspectiveOpinion,
    PredictedConsequence,
    ScenarioAnalysis,
    ScenarioCase,
    SecondOrderEffects,
    StrategicReasoningAnalysis,
    SystemImpactAnalysis,
    TradeoffAnalysis,
)
from agent.strategic_reasoning_validator import (
    deterministic_strategic_reasoning_response,
    validate_strategic_reasoning_response,
)


def _sample_analysis() -> StrategicReasoningAnalysis:
    return StrategicReasoningAnalysis(
        architect_review_mode=True,
        consequence_simulation=ConsequenceSimulation(
            consequences=[
                PredictedConsequence(
                    description="Revisão de documentação",
                    probability="high",
                ),
                PredictedConsequence(
                    description="Inconsistências temporárias",
                    probability="medium",
                ),
            ],
            future_risks=["Regressão de acessibilidade"],
        ),
        perspective_divergence=PerspectiveDivergenceAnalysis(
            opinions=[
                PerspectiveOpinion(
                    perspective="dev",
                    perspective_label="Developer",
                    preferred_option="Dialog",
                    rationale="Simplicidade.",
                ),
                PerspectiveOpinion(
                    perspective="designer",
                    perspective_label="Designer",
                    preferred_option="Drawer",
                    rationale="Continuidade de fluxo.",
                ),
            ],
            synthesis="Há consenso parcial.",
            consensus="partial_consensus",
        ),
        scenario_analysis=ScenarioAnalysis(scenarios=[
            ScenarioCase(case_type="best", outcomes=["Simplificação"]),
            ScenarioCase(case_type="expected", outcomes=["Esforço moderado"]),
            ScenarioCase(case_type="worst", outcomes=["Regressões"]),
        ]),
        second_order_effects=SecondOrderEffects(
            direct=["Componente Dialog"],
            indirect=["Documentação", "Onboarding"],
        ),
        confidence_rationale="média — baseada em evidência recuperada",
    )


class StrategicReasoningValidatorTests(unittest.TestCase):
    def test_complete_response_passes(self) -> None:
        analysis = _sample_analysis()
        text = (
            "**Recomendação:** Use Dialog.\n\n"
            "**Benefícios:**\n- foco total\n\n"
            "**Custos:**\n- interrompe fluxo (trade-off)\n\n"
            "**Impactos Diretos:**\n- componente\n\n"
            "**Impactos Indiretos (segunda ordem):**\n- documentação\n\n"
            "**Perspectivas:**\n"
            "- Developer prefere Dialog\n"
            "- Designer prefere Drawer\n\n"
            "**Consenso:** consenso parcial\n"
            "Há consenso parcial.\n\n"
            "**Consequências Previstas:**\n"
            "- Alta probabilidade: revisão\n"
            "- Média probabilidade: inconsistências\n\n"
            "**Cenários:**\n"
            "- Melhor cenário: simplificação\n"
            "- Cenário esperado: esforço moderado\n"
            "- Pior cenário: regressões\n\n"
            "**Riscos:**\n- regressão\n\n"
            "**Confiança:** média"
        )
        validation = validate_strategic_reasoning_response(
            text,
            query="E se substituirmos Dialog por Drawer?",
            tradeoff=TradeoffAnalysis(
                recommendation="Dialog",
                alternatives=["Drawer"],
                benefits=["foco"],
                costs=["interrompe fluxo"],
                risks=["fadiga"],
            ),
            impact=SystemImpactAnalysis(level="medium"),
            memory=None,
            analysis=analysis,
            requires_alternatives=True,
        )
        self.assertEqual(validation.status, "pass")

    def test_missing_consequences_triggers_fallback(self) -> None:
        analysis = _sample_analysis()
        validation = validate_strategic_reasoning_response(
            "**Recomendação:** Use Dialog.\n"
            "**Benefícios:** foco\n**Custos:** atrito\n"
            "**Impactos Diretos:** x\n**Impactos Indiretos:** y\n"
            "**Perspectivas:** dev\n**Consenso:** parcial\n"
            "**Cenários:** melhor caso",
            query="E se substituirmos Dialog por Drawer?",
            tradeoff=TradeoffAnalysis(
                recommendation="Dialog",
                costs=["atrito"],
                benefits=["foco"],
            ),
            impact=SystemImpactAnalysis(level="medium"),
            memory=None,
            analysis=analysis,
            requires_alternatives=False,
        )
        self.assertEqual(validation.status, "fallback")
        self.assertIn("missing_consequence_prediction", validation.violations)

    def test_deterministic_fallback_includes_strategic_sections(self) -> None:
        analysis = _sample_analysis()
        response = deterministic_strategic_reasoning_response(
            query="E se substituirmos Dialog por Drawer?",
            tradeoff=TradeoffAnalysis(
                recommendation="Dialog",
                alternatives=["Drawer"],
            ),
            impact=SystemImpactAnalysis(level="high"),
            memory=DecisionMemoryContext(),
            analysis=analysis,
            english=False,
        )
        self.assertIn("Recomendação", response)
        self.assertIn("Impactos Indiretos", response)
        self.assertIn("Perspectivas", response)
        self.assertIn("Consequências Previstas", response)
        self.assertIn("Cenários", response)


if __name__ == "__main__":
    unittest.main()
