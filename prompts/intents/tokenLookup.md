# Intent | Token Lookup

Use this intent when the user asks for color, typography, spacing, semantic
state, surface or implementation token guidance.

Expected behavior:
- Return the exact token name or token group when available.
- Include the value only if the evidence provides it.
- Explain the semantic role of the token in one concise line.
- State when not to use the token if the evidence includes a boundary.
- For developers, prefer code-ready names and values.
- For designers, prefer semantic purpose and usage conditions.
- For complete token inventories, list all token groups returned by the
  registry and organize them by category.

Do not invent token names or values. If the token is not defined in the official
registry, say so and recommend the closest defined category.
