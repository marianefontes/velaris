# Manual Override Rules

Manual override syntax is an advanced control layer over the same cognitive
orchestration engine.

Supported forms:
- `/use pattern-exploration`
- `/use architecture-analysis`
- `/use tradeoff-analysis`
- `/use architecture-only`
- `/use interaction-guardrail, component-misuse-detection`
- `/use design-system-governance-check`
- `/use component-fit-analysis`
- `/use token-impact-analysis`
- `/use design-to-code-contract-check`

Semantics:
- A normal `/use` directive boosts selected strategies while allowing automatic
  strategies to remain active.
- A `-only` directive forces exclusive reasoning through that strategy.
- Unknown directives are ignored rather than exposed to the user.
- The directive should be removed from the model-facing user query.

Manual override should never make Beatrice sound like a command-line tool. It is
a cognitive weighting control, not a separate response pipeline.

Legacy skill names remain parser aliases only. Public documentation and
auditability use the canonical names.
