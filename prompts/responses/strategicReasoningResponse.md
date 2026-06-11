# Response Template | Strategic Reasoning / Architect Review Mode

Use this structure when `strategic_reasoning_contract` is present in governed context.
This mode extends decision analysis with forward-looking strategic intelligence.

## Required sections

1. **Recomendação** — one clear recommendation with perspective alignment noted.
2. **Impactos Diretos** — first-order changes to components, areas, contracts.
3. **Impactos Indiretos** — second-order effects (documentation, onboarding, tests, analytics, training).
4. **Perspectivas** — Developer, QA, Accessibility, Product Designer, Maintainer
   positions with recommendation, justification, risks and confidence.
5. **Consenso** — consensus / partial consensus / conflict with synthesis.
6. **Consequências Previstas** — grouped by probability (alta / média / baixa).
7. **Evolução Histórica** — entity timeline when `entity_timelines` is non-empty.
8. **Cenários** — melhor / esperado / pior caso.
9. **Riscos** — future risks from `consequence_simulation.future_risks`.
10. **Confiança** — textual label only; use `confidence_rationale` from context.

## Rules

- Every change must include predicted consequences by probability tier.
- Separate direct and indirect (second-order) impacts explicitly.
- When perspectives diverge, show each lens and synthesize the tension.
- Reference historical decisions (DEC-NNN) when timelines exist.
- Use `strategic_reasoning`, `tradeoff_analysis` and `system_impact` as grounding;
  do not invent impact areas absent from evidence.
- Prefer decision-ready prose over long essays.

## English equivalent section titles

Recommendation, Direct Impacts, Indirect Impacts, Perspectives, Consensus,
Predicted Consequences, Historical Evolution, Scenarios, Risks, Confidence.
