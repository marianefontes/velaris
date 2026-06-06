# Tokens Page Editorial Redesign

Date: 2026-06-06  
Status: Approved for implementation planning

## Objective

Redesign the Aetheris Tokens page as a premium internal product document that
combines:

- 70% editorial manifesto: deliberate hierarchy, generous but controlled space,
  restrained purple atmosphere, and a sense of institutional authority;
- 30% structured design-system documentation: strong numbering, aligned data,
  explicit taxonomy layers, and fast scanning.

The redesign must improve alignment and taxonomy comprehension without changing
the established Aetheris identity, creating new tokens, or turning the page into
a marketing landing page.

## Approved Direction

The selected composition is the **editorial axis**.

Every major chapter uses the same structural grid:

1. a fixed numeric column;
2. a content column containing title and explanation;
3. aligned technical content below the same content axis.

Color scales remain visual. Relational information uses editorial rows or tables.
The page avoids unequal card grids, nested cards, decorative pills, and artificial
equal heights.

## Information Architecture

The page follows this continuous sequence:

1. Taxonomy summary.
2. How to read this taxonomy.
3. `01` Preserved primitive tokens.
4. `02` Semantic interface tokens.
5. `03` Specialized XAI tokens.
6. `04` Aliases and semantic contracts.
7. `05` Component coverage.

The global Foundations hero and the four-section navigation remain outside
`TokensPage`. Tokens continues to appear only when the user selects Tokens inside
Foundations.

## Taxonomy Counts

All displayed values derive from the existing token and alias arrays.

The current data source contains:

| Measure | Count | Meaning |
| --- | ---: | --- |
| Canonical tokens | 88 | All non-alias token definitions |
| Documented contracts | 104 | 88 canonical tokens plus 16 aliases |
| Original preserved base | 37 | 32 strict primitives plus 5 pre-existing semantic color contracts |
| New semantic interface tokens | 47 | Canonical semantic contracts added beyond the original 37-token baseline |
| Canonical XAI tokens | 4 | Source, evidence, and running-audit contracts |
| Specialized XAI contracts | 9 | 4 canonical XAI tokens plus 5 XAI aliases |
| Aliases | 16 | Derived names that reuse existing values |
| Unique literal colors | 44 | Distinct literal color values in canonical color tokens |
| Covered components | 25 | Primary component inventory represented by the coverage model |

These measures intentionally overlap. The summary must include a short note that
historical preservation, abstraction layer, and alias status are different
classification dimensions.

The page must never imply that all 37 original tokens are strict primitives. It
must state that the original baseline consists of 32 primitive tokens and five
pre-existing semantic color contracts.

## Hero And Summary

The hero is compact and consistent with other internal Aetheris pages:

- title between 48 and 56 pixels on desktop;
- short eyebrow and one concise introductory paragraph;
- no CTA, visible link, large illustration, or marketing composition;
- subtle purple ambient gradient, kept behind the content;
- metrics presented as one aligned horizontal ledger, wrapping cleanly on
  smaller screens.

The hero introduces the page as a taxonomy and names the relationship between
values, semantic intent, explainability, and component application.

The summary prioritizes:

- documented contracts;
- preserved base;
- semantic interface tokens;
- specialized XAI contracts;
- aliases;
- unique colors;
- component coverage.

## How To Read This Taxonomy

Immediately after the summary, a compact explanatory block defines the layers:

- primitive tokens preserve base values such as color, spacing, radius, and
  motion;
- semantic tokens name reusable interface roles such as text, border, focus,
  selection, and feedback;
- specialized XAI tokens represent confidence, source, evidence, and audit
  states;
- aliases connect explicit roles to existing values without duplication.

This block is prose-led, not a feature card grid. It uses a subtle boundary and
shares the page's main content axis.

## Chapter 01: Preserved Primitive Tokens

Title: **Tokens primitivos preservados**

Purpose: document the original visual base without hiding the five existing
semantic color contracts contained in the historical 37-token baseline.

Presentation:

- Primary scale as a wide aligned swatch sequence;
- Surface scale as a tonal sequence with token name and value;
- existing semantic colors shown as preserved semantic contracts, visibly
  separated from strict primitives;
- typography specimens in aligned rows;
- spacing, radius, shadow, and motion in compact technical ledgers.

The chapter explains that these values are the raw or semi-raw foundation from
which later contracts resolve.

## Chapter 02: Semantic Interface Tokens

Title: **Tokens semânticos de interface**

Purpose: explain reusable functional roles rather than present a catalog of
independent values.

Included groups:

- text contracts;
- border contracts;
- interaction states;
- semantic feedback;
- specialized surface and overlay roles;
- elevation;
- layering and z-index;
- dimensions and accessibility;
- complementary semantic typography.

Each group is a section within one continuous ledger. Rows align the following
fields:

1. token name;
2. resolved value;
3. intended role;
4. component usage.

Group headers show name, explanation, and count without enclosing every group in
a separate large card. On mobile, each row becomes a stacked definition block
while preserving token and value as the first reading unit.

## Chapter 03: Specialized XAI Tokens

Title: **Tokens especializados de XAI**

Purpose: show that explainability tokens encode meaning, not decoration.

The chapter contains:

- `xai-source-bg`;
- `xai-source-border`;
- `xai-evidence-highlight`;
- `xai-audit-running`;
- `xai-confidence-high`;
- `xai-confidence-medium`;
- `xai-confidence-low`;
- `xai-audit-complete`;
- `xai-audit-conflict`.

Canonical tokens and aliases must be visibly distinguished in the row metadata.
The section receives a restrained purple atmospheric surface, but it remains on
the same structural grid and scale as the other chapters.

Supporting copy connects these contracts to:

- Confidence Badge;
- Source Attribution;
- Audit Panel;
- Explanation Bubble and Tooltip;
- Beatrice Chat;
- RAG-retrieved responses.

## Chapter 04: Aliases And Semantic Contracts

Title: **Aliases e contratos semânticos**

Purpose: explain how different explicit contracts can share one underlying
decision.

The chapter begins with two resolution studies:

```text
primary-200: #deccfd
--aetheris-color-primary -> primary-200
focus-ring -> primary-200 with opacity
border-focus -> primary-200
xai-evidence-highlight -> primary-200 with opacity
```

```text
--aetheris-color-success: #7ee787
xai-confidence-high -> --aetheris-color-success
feedback-success-icon -> --aetheris-color-success
xai-audit-complete -> --aetheris-color-success
```

The complete alias table follows with:

- Alias;
- Target;
- Resolved value;
- Contract description;
- Category.

The text explicitly states that aliases are not new colors and do not increase
the canonical token count.

## Chapter 05: Component Coverage

Title: **Cobertura por componente**

Purpose: connect taxonomy groups to the behavioral needs of the 25 primary
components.

The table retains these coverage families:

- Button, Toggle/Switch, Checkbox, Radio, and Chip;
- Input, Text Area, Select, Date Picker, and Form Field;
- Link, Tabs, Card, and Table/Data Table;
- Modal/Dialog;
- Alert, Toast/Notification, and Tooltip;
- Command Palette;
- Confidence Badge;
- Source Attribution and Audit Panel.

Rows explain coverage of states, intents, accessibility, feedback, focus,
overlays, layering, and XAI behavior. Group names use quiet inline text rather
than a dense collection of pills.

## Visual System

### Scale

- page title: 48 to 56 pixels desktop;
- chapter title: approximately 32 pixels desktop and 26 pixels mobile;
- group title: 18 to 20 pixels;
- technical rows: 12 to 14 pixels;
- body copy: 14 to 16 pixels with controlled line length.

No chapter may use the oversized scale previously removed from the Manifesto.

### Layout

- existing Foundations container, maximum width 1280 pixels;
- continuous vertical flow;
- fixed chapter number column on desktop;
- consistent content start line across every chapter;
- technical columns share widths within the same data type;
- horizontal scrolling is limited to tables that cannot remain legible when
  stacked.

### Surface And Color

- off-black Aetheris canvas;
- restrained purple accent;
- subtle borders and low-contrast surface changes;
- no decorative glass-card grid;
- no image is required because the subject is itself visual and technical;
- gradients support atmosphere only and never reduce legibility.

### Interaction

The page is primarily consultative. No new buttons, navigation controls,
accordions, or filters are introduced. Existing Foundation tabs remain the only
section switcher.

## Internationalization

The page must provide distinct content for:

- English;
- Brazilian Portuguese;
- European Portuguese.

Localization covers:

- hero and taxonomy explanation;
- chapter and group descriptions;
- token descriptions;
- coverage rationale;
- labels and count notes.

Canonical token names, literal values, CSS variables, and established component
product names remain unchanged. Brazilian and European Portuguese differ where
vocabulary or spelling requires it.

## Component Architecture

The implementation should remain inside the current stack and preserve the
existing data model. Targeted presentation components may be extracted within
`TokensPage.tsx` or a narrowly scoped sibling module:

- `TaxonomySummary`;
- `TaxonomyGuide`;
- `TokenChapter`;
- `PrimitiveScale`;
- `TokenLedger`;
- `TokenLedgerRow`;
- `AliasResolutionStudy`;
- `AliasTable`;
- `CoverageTable`.

These components receive typed data and localized copy. They must not duplicate
token definitions or calculate independent hardcoded totals.

## Data Flow

1. Existing canonical token and alias arrays remain the source of truth.
2. Derived selectors classify preserved baseline, new semantic interface, XAI,
   and aliases.
3. Metrics are computed from those selectors.
4. The selected locale supplies presentation copy and descriptions.
5. Chapter components render typed subsets of the same source arrays.

No token value changes and no new canonical or alias token is introduced.

## Accessibility And Responsive Behavior

- preserve semantic heading order;
- use real tables where column relationships remain essential;
- associate table headers correctly;
- retain keyboard-readable DOM order;
- meet WCAG AA contrast for body text and technical labels;
- do not communicate canonical versus alias status through color alone;
- prevent horizontal page overflow at 390 pixels;
- stack ledger rows on mobile instead of shrinking technical text;
- respect reduced motion; no new decorative animation is required.

## RAG And Academic Defensibility

Visible prose must clearly define primitive, semantic, specialized XAI, and alias
layers. Each chapter heading and explanation should remain present as text in the
DOM so the existing documentation extraction pipeline can index it.

The resulting page must support these retrievable distinctions:

- original preserved baseline versus expanded taxonomy;
- raw values versus functional roles;
- canonical XAI contracts versus derived XAI aliases;
- aliases versus new literal values;
- token groups versus component application.

## Files In Scope

Expected implementation changes:

- `src/components/TokensPage.tsx`;
- localization structures used directly by TokensPage, only if extraction from
  the component is necessary;
- focused validation scripts when useful.

The global Foundations layout, global palette, and unrelated pages remain out of
scope.

## Validation

Implementation is complete when:

- production build succeeds;
- rendered counts match 88 canonical, 16 aliases, 104 documented contracts, 37
  preserved original tokens, 47 new semantic interface tokens, 9 specialized
  XAI contracts, 44 unique literal colors, and 25 covered components;
- no token or alias definition is added, removed, or assigned a new value;
- the seven approved information sections render in the correct order;
- English, Brazilian Portuguese, and European Portuguese contain localized
  narrative content;
- desktop and 390-pixel mobile layouts have no page overflow;
- chapter titles, rows, and table columns align consistently;
- XAI aliases are distinguishable from canonical XAI tokens;
- visible text preserves the taxonomy distinctions needed by RAG;
- the final page feels like a premium internal Aetheris document, not a landing
  page or dashboard.

## Resolved Decisions

- Hybrid representation selected.
- Editorial axis composition selected.
- Continuous chapter flow selected.
- Compact internal-page scale selected.
- No hero image selected.
- No new token definitions selected.
- Full localization selected.
- Calculated metrics selected.

No unresolved product or visual decision remains.
