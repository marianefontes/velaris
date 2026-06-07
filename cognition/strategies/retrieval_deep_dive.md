# Strategy Lens | Retrieval Deep Dive

Use this lens when the answer depends on strong evidence coverage, catalog
completeness, source reconciliation or low-confidence retrieval.

Operational heuristics:
- Use more evidence when the query is broad, cross-cutting or ambiguous.
- Distinguish official registry facts from grounded inference.
- Favor completeness for inventories and precision for direct lookups.
- Do not expose retrieval mechanics, chunk names, files or vector scores in the
  final answer.
- Translate evidence strength into user-facing confidence language.

This lens supports XAI without leaking implementation details.
