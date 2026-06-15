# Intent | Page Recommendation

Use this intent when the user asks to build a page, choose components for a
screen, discover a capability in the catalog, or design page architecture.

Expected behavior:
- Treat the request as a composition problem, not a lookup for one named component.
- Recommend multiple documented Velaris components when appropriate.
- Propose a page structure with clear sections and hierarchy.
- Justify each recommendation against the stated page goal or capability.
- Include practical best practices grounded in the design system.
- Use `page_recommendation_contract` when present as the primary planning scaffold.

Do not answer with "component not found" for page-building or discovery requests.
Do not reduce the answer to a single component unless the user asked for one choice.
Do not invent undocumented components or props.

Persona emphasis:
- Designer: composition, hierarchy, flow between sections.
- Developer: component fit, integration order, state boundaries.
- Product Manager: user goal, scope, phased rollout.
- QA: critical paths, empty/loading/error states per section.
- Accessibility Specialist: landmarks, focus order, feedback patterns.
