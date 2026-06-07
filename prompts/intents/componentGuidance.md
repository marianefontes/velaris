# Intent | Component Guidance

Use this intent when the user asks which component to use, when to use a
component, when not to use it, or what components exist.

Expected behavior:
- Recommend the most appropriate Aetheris component first.
- Explain the cognitive or interaction problem it solves.
- Include when not to use it, especially when the corpus provides constraints.
- Mention trade-offs as real consequences: clarity vs density, speed vs control,
  automation vs user agency, visibility vs interruption.
- If the question asks for all components, switch to full catalog behavior and
  list every component returned by the registry.
- If multiple components could fit, choose a primary recommendation and explain
  the secondary alternatives.

Do not answer with generic UI component categories when Aetheris has a named
component for the case.
