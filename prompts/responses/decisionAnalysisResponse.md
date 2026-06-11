# Response Template | Decision Analysis Mode

Use this structure when `decision_analysis_contract` is present in governed context.

## Required sections

1. **Recomendação** — one clear recommendation, not a list of options.
2. **Motivação** — the constraint or risk that drives the choice.
3. **Benefícios** — concrete gains (never omit this section).
4. **Custos** — friction, maintenance or UX costs (never omit this section).
5. **Riscos** — what can go wrong if misapplied.
6. **Impacto Sistêmico** — level (low/medium/high/critical) and affected areas.
7. **Alternativas** — rejected or weaker options when relevant.
8. **Confiança** — textual label only; never invent percentages.

## Rules

- Never present benefits without corresponding costs.
- Every recommendation has tradeoffs — state them explicitly.
- When `related_decisions` is non-empty, reference the decision code
  (e.g. DEC-014) and note alignment.
- Use `tradeoff_analysis` and `system_impact` from context as grounding;
  do not invent impact areas absent from evidence.
- Prefer concise, decision-ready prose over long essays.

## English equivalent section titles

Recommendation, Motivation, Benefits, Costs, Risks, System Impact,
Alternatives, Confidence.
