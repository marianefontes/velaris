# Chunking Strategy | Semantic Units

Velaris uses semantic chunking. Each retrieved record represents a design-system
unit such as a component, pattern, token group, design decision, guideline or
reasoning primitive.

Interpretation rules:
- Treat each record as an architectural entity, not as arbitrary text.
- Preserve the entity name exactly.
- Use fields such as structure, logic, context of use, when to use, when not to
  use, trade-offs and Velaris insight as separate semantic signals.
- When a record contains multiple fields, synthesize them rather than repeating
  them mechanically.
- When listing entities, use the record title as the canonical name.
- When a full catalog is requested, completeness has higher priority than
  brevity.

The retrieved record order can indicate relevance, but catalog mode is not a
ranking task. In catalog mode, include all records provided.
