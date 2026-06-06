# Foundations Accessibility Redesign

## Objective

Reduce conceptual redundancy inside the Aetheris Foundations area without
changing its primary route, global visual system, or existing external links.

The internal navigation becomes:

1. Diretrizes - Pilares e princípios
2. Acessibilidade - Qualidade transversal
3. Padrões - Lógica de interação
4. Tokens - Primitivas de design

## Compatibility Decision

The implementation reuses the existing internal identifiers:

- `manifesto` remains the internal focus ID for the visible Diretrizes tab.
- `foundations` remains the internal focus ID for the visible Acessibilidade tab.

Therefore:

- `/foundations` continues to open the first tab, now labeled Diretrizes.
- `/foundations?focus=manifesto` continues to work and opens Diretrizes.
- `/foundations?focus=foundations` continues to work and opens Acessibilidade.
- `/guidelines` may continue redirecting to
  `/foundations?focus=manifesto`.

This intentionally favors URL compatibility over semantic slug renaming. No
new `accessibility` focus slug is required.

## Content Architecture

### Diretrizes

The current `GuidelinesPage` content remains the normative source for:

- 6 strategic pillars;
- 12 design principles;
- 48 operational rules;
- clarity and hierarchy;
- human-centered guidance;
- explainability and trust;
- ambiguity reduction;
- decision support.

Visible references to Manifesto become:

- tab label: `Diretrizes`;
- tab role: `Pilares e princípios`;
- internal document title: `Guia de Diretrizes`;
- introduction: a concise explanation that the page formalizes the Aetheris
  guideline architecture.

The page must remain operational and normative, not inspirational marketing
copy.

### Acessibilidade

`FoundationsPage.tsx` is retained but its visual-foundations content is fully
replaced by a transversal accessibility contract. The exported component name
may remain `FoundationsPage` to minimize import churn.

The page contains:

1. Introduction: accessibility as a system contract.
2. Four summary contracts:
   - Contraste - `AA como base`;
   - Foco - `Sempre visível`;
   - Alvo mínimo - `44px`;
   - Feedback - `Nunca só por cor`.
3. Contraste e legibilidade.
4. Foco e navegação por teclado.
5. Alvo mínimo e densidade.
6. Estados acessíveis.
7. Leitores de tela e semântica.
8. Feedback não apenas por cor.
9. Movimento seguro.
10. Checklist de prontidão acessível.

The checklist is structured data in the source so it can be rendered
consistently and extracted into the RAG corpus.

### Boundaries

Accessibility may reference semantic contracts such as `focus-ring`,
`target-size-min`, `text-primary`, `border-focus`, `feedback-error`, and
`state-disabled`, but it does not reproduce the token catalog.

It may mention Button, Input, Select, Modal, Tabs, Command Palette, Toast,
Tooltip, Confidence Badge, Source Attribution, and Audit Panel as application
examples, but it does not become component documentation.

Patterns and Tokens remain unchanged in purpose:

- Padrões contains interaction blueprints, flows, and interaction logic.
- Tokens contains primitive, semantic, XAI, alias, and coverage documentation.

## Visual Design

The new Accessibility content uses the existing Aetheris page language:

- dark surfaces;
- existing glass panel utilities;
- soft borders;
- restrained purple glow;
- current typography and spacing tokens;
- responsive grids;
- semantic headings and lists.

No global colors, typography, tokens, or layout primitives are changed.

The accessibility page should use a clear editorial hierarchy:

- one hero and introductory contract;
- a four-card summary row;
- readable thematic sections;
- compact examples or token references;
- a final readiness checklist.

## RAG Indexing

`rag/extract_docs.py` must stop treating `FoundationsPage.tsx` as visual
foundation principles and extract the new accessibility contracts instead.

The recommended source structure is an exported or top-level array of
accessibility sections with stable fields such as:

- `id`;
- `title`;
- `description`;
- `requirements`;
- `appliesTo`;
- `tokenReferences`;
- `ragRelation`.

The extractor creates `accessibility` chunks for the thematic contracts and
one readiness-checklist chunk. Generated dump files are refreshed only through
the repository's extraction command.

## Files Expected To Change

- `src/components/FoundationsHubPage.tsx`
  - update visible tab labels through i18n;
  - continue rendering `FoundationsPage.tsx` for `focus=foundations`;
  - preserve active-tab behavior.
- `src/components/FoundationsPage.tsx`
  - replace visual-foundations content with the accessibility contract.
- `src/components/GuidelinesPage.tsx`
  - update visible document naming and introductory copy from Manifesto to
    Diretrizes without removing pillars, principles, or rules.
- `src/i18n/translations.ts`
  - update all supported locales for tab labels, roles, hero copy, and
    accessibility content as needed.
- `rag/extract_docs.py`
  - extract the accessibility contracts and readiness checklist.
- `rag/aetheris-docs-dump.json`
  - regenerated corpus output.
- `rag/aetheris-docs-dump.md`
  - regenerated readable corpus output.
- `scripts/test_navigation_components.py`
  - replace the Manifesto assertion and verify all four internal tabs.
- A focused accessibility navigation/content test may be added if extending
  the existing navigation test would make it too broad.

`src/App.tsx` should not need route changes because the selected approach keeps
the legacy focus IDs.

## Validation

Automated and manual validation must confirm:

- Diretrizes replaces Manifesto visibly.
- Acessibilidade replaces Fundamentos visibly.
- `/foundations?focus=foundations` opens Acessibilidade.
- Padrões and Tokens still render and preserve active state.
- the accessibility page includes contrast, focus, keyboard, target size,
  states, semantics, non-color feedback, motion, and readiness checklist.
- Tokens are referenced but not duplicated.
- component documentation remains under Components.
- keyboard focus and semantic heading order remain usable.
- no runtime or console errors occur while switching tabs.
- the RAG dump contains accessibility chunks and no obsolete visual-foundation
  chunks from `FoundationsPage.tsx`.
- the production build and focused Playwright checks pass.

## Out Of Scope

- Renaming the primary `/foundations` route.
- Adding a new top-level Accessibility route.
- Changing global design tokens or typography.
- Moving Components into Foundations.
- Rebuilding Patterns or Tokens.
- Creating a complete WCAG reference manual.

## Manual Decisions Remaining

None. The user selected reuse of `FoundationsPage.tsx` and preservation of
`/foundations?focus=foundations`.
