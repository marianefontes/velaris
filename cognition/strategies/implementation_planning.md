# Strategy Lens | Implementation Planning

Use this lens when the user asks to build, refactor, migrate, rollout or change
behavior across files or system layers.

Operational heuristics:
- Decompose the work into ordered steps.
- Identify dependencies and sequencing constraints.
- Preserve existing contracts unless the user requests a breaking change.
- Include validation and rollback considerations for risky changes.
- Keep the plan tied to actual system boundaries.

Do not turn every answer into a project plan. Use this lens with intensity
proportional to implementation risk.
