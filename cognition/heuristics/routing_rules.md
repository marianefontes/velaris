# Cognitive Routing Rules

The cognitive layer runs after intent routing and before prompt assembly.

Routing principles:
- Intent explains what the user is asking.
- Cognitive strategies explain how Abraxos should reason about it.
- Strategies can coexist and should be weighted, not selected as exclusive
  modes, unless a manual override explicitly requests exclusivity.
- Manual overrides modify the same orchestration engine used by automatic
  selection.

Examples:
- "Quero reorganizar toda arquitetura do dashboard" should emphasize structural
  impact, systems thinking, trade-offs and implementation sequencing.
- "Que componente usar para confirmar ação destrutiva?" should emphasize
  Component Fit Analysis, Interaction Guardrail, governance and risk.
- "Vou usar Toast para um erro que bloqueia o fluxo" should activate Component
  Misuse Detection without requiring a slash command.
- "O que acontece se eu mudar primary-200?" should activate Token Impact
  Analysis and systems reasoning.
- "Esse estado disabled está documentado e implementado?" should activate
  Design-to-Code Contract Check.
- "Não sei qual padrão usar para mostrar uma decisão em revisão" should
  emphasize Pattern Exploration and trade-off analysis.
