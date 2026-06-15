# Response Template | Component Guidance

For a component recommendation:

1. Start with: "Use [Component]..." or "Para esse caso, use [Component]..."
2. Explain why this component fits the user's context.
3. Add "Trade-offs" with one or two concrete costs.
4. Add "Não use quando" or "Avoid when" with explicit exclusion criteria.
5. Add related components or patterns only when they help the decision.

For a component implementation query (how to implement, which intents, which states):

1. Start with the component name and a one-line purpose.
2. List available intents with a short description of each use case.
3. List available states and their behavioral meaning.
4. Cover accessibility essentials specific to this component:
   - keyboard behavior (focus, Enter, Space, Tab);
   - aria requirements (aria-label for icon-only, role, aria-disabled);
   - loading and disabled behavior;
   - contrast and visual focus requirements.
5. Provide a minimal code example using only documented intents, states and
   props from the component catalog. This applies to ALL profiles when the query
   explicitly asks for implementation, code, examples or "how to use". Developer
   profile adds typed props and async state handling on top of the base snippet.
   - If import path is not documented: omit import or add: "Ajuste o import
     conforme a estrutura real do projeto."
   - Mark partial evidence: "Exemplo baseado no catálogo do componente.
     Verifique as props antes de adotar."
6. Cite at least one specific do rule and one specific dont rule from the
   component catalog as operational guidance. Use them as evidence, not as
   decoration. Format: "Boa pratica: [do text]" and "Evitar: [dont text]".
   When a dont directly applies to the query context, lead with it.
7. Add 2-3 common mistakes to avoid, grounded in the documented dont rules.
8. Confidence and limitation section:
   - State evidence level (direct catalog / partial).
   - List any fields not covered by the documentation.

For an audit query (is this correct?, does this make sense?):

1. Identify the problem clearly.
2. Explain the risk citing the specific dont rule from the component catalog.
   Quote it directly when it captures the problem precisely.
3. Recommend the correct alternative, citing the matching do rule when available.
4. Cover accessibility impact if relevant.
5. Provide a corrected example when helpful.

For a full component catalog:

1. Start with: "O Velaris possui atualmente [N] componentes oficiais..."
2. List every component returned by the registry.
3. Group by semantic category.
4. For each component, include:
   - role in the system;
   - cognitive problem solved;
   - trade-off or cost;
   - when not to use, if known.

Never use "por exemplo" to replace a complete list.
Never invent props, intents, states or events not present in the component catalog.
