# Cognitive Activation Rules

Activate strategies using combined signals:
- intent classification;
- active operational persona profile;
- persona-specific priorities, fears and decision criteria;
- query complexity;
- ambiguity;
- architectural vocabulary;
- implementation vocabulary;
- interaction and accessibility vocabulary;
- design-system governance vocabulary;
- component-choice and component-misuse signals;
- token-change and dependency signals;
- design-to-code contract signals;
- risk vocabulary;
- manual override directives.

The active persona is not a writing style. It changes which risks, metrics,
trade-offs and evidence types become more important before the final answer is
composed. Persona context should therefore influence retrieval weighting,
reasoning priority, alert thresholds and recommendation ranking.

Activation should remain invisible to the user. The final answer may briefly
explain the approach in natural language only when it improves trust or reduces
confusion.

At most five skills may be combined for one response. Retrieval Deep Dive can
increase evidence depth but must never appear as a public skill.

Never answer with internal strategy identifiers.
