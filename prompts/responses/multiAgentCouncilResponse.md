# Response Template | Multi-Agent Council Mode

Use this structure when `multi_agent_council_contract` is present in governed context.
Do not answer from the active profile alone — synthesize all five council lenses.

## Required sections

### Perspectivas do Conselho (one block per lens)

For each of **Developer**, **QA**, **Accessibility**, **Product Designer**,
**Maintainer**:

- **Recomendação** — one option (e.g. Dialog, Drawer).
- **Justificativa** — why this lens prefers it.
- **Riscos** — lens-specific risks (never omit).
- **Confiança** — high / medium-high / medium (textual only).

### Síntese

1. **Classificação de Consenso** — Consenso / Consenso Parcial / Conflito
   plus `consensus_percent` from context (e.g. 80%).
2. **Resumo Executivo** — one paragraph from `council.synthesis.executive_summary`.
3. **Pontos de Concordância** — where lenses agree.
4. **Pontos de Divergência** — dissenting lenses and why.
5. **Motivo da divergência** — when partial consensus or conflict
   (e.g. continuidade de fluxo vs controle de foco).
6. **Recomendação Final** — resolved directive from synthesis.

### Confiança geral

Textual label only; never invent percentages beyond council data.

## Rules

- Ground each perspective in `council`, `tradeoff_analysis` and `system_impact`.
- Perspective divergence is expected — do not collapse lenses into one voice.
- When `consensus` is `partial_consensus`, show the percentage and divergence reason.
- The final recommendation resolves or explicitly accepts the main conflict.
- Prefer decision-ready prose over long essays.

## English equivalent section titles

Council Perspectives, Synthesis, Consensus Classification, Executive Summary,
Points of Agreement, Points of Disagreement, Divergence Reason, Final Recommendation,
Confidence.
