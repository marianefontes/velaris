# Patterns Page Editorial Redesign

Date: 2026-06-06  
Status: Approved for implementation planning

## Objective

Redesign the Aetheris Patterns page as a premium internal product document that
combines:

- 70% editorial manifesto: deliberate hierarchy, controlled whitespace,
  restrained purple atmosphere, cinematic depth, and institutional authority;
- 30% structured design-system documentation: continuous numbering, aligned
  content layers, strong scanning, and explicit usage guidance.

The redesign must make the library inspiring and consultable without turning it
into a marketing landing page or a grid of disconnected cards.

## Approved Direction

The page uses one continuous editorial axis.

All eleven patterns are numbered from `01` to `11`. Dashboard and Multi-step
Form remain foundational patterns with moderately deeper treatment. The other
nine patterns are complementary chapters with a more compact presentation, but
all eleven use the same taxonomy and visual grammar.

The existing data content remains the source of truth. The redesign changes
composition, hierarchy, localization quality, and presentation rather than
inventing new patterns.

## Information Architecture

The page follows this sequence:

1. Compact editorial hero.
2. Pattern-library summary and thesis.
3. How to read this library.
4. `01–02` Foundational patterns.
5. `03–11` Complementary patterns.
6. Editorial closing statement.

The Foundations hero and four-section navigation remain outside `PatternsPage`.
Patterns continues to render only when selected inside Foundations.

## Hero

The hero establishes the library as a strategic framework while retaining the
scale of an internal Aetheris page.

It contains:

- a small eyebrow describing interaction logic;
- a 48 to 56 pixel title on desktop;
- one concise introductory paragraph;
- an aligned summary ledger;
- the pattern thesis as a short editorial statement.

The summary communicates:

- 11 documented patterns;
- two foundational patterns;
- nine complementary patterns;
- one cognitive objective: clarity;
- the number of documented decision fields.

The hero uses a restrained purple ambient gradient. It has no dominant image,
CTA, visible link, or large marketing panel.

## How To Read This Library

A compact prose-led block explains the shared pattern anatomy:

- structure describes the spatial and component arrangement;
- logic explains the behavioral or cognitive mechanism;
- context identifies appropriate use;
- when not to use establishes boundaries;
- trade-offs expose meaningful costs;
- Aetheris Insight captures the strategic principle.

This block shares the main editorial axis and must not become a feature-card
grid.

## Foundational Patterns

Patterns `01` and `02` are:

1. Dashboard;
2. Multi-step Form.

They receive a more expansive chapter composition because they establish broad
application frameworks. The treatment includes:

- number and category;
- title and concise summary;
- small supporting icon;
- structure and logic in an aligned two-column editorial region;
- context and contraindication as distinct, quiet surfaces;
- trade-offs when available;
- Aetheris Insight as the closing statement.

The emphasis comes from depth and whitespace, not oversized typography or
larger decorative cards.

## Complementary Patterns

Patterns `03` through `11` are:

3. Onboarding;
4. Data Explorer;
5. Empty States;
6. Settings and Configuration;
7. Command Center;
8. Focus Mode;
9. Collaboration;
10. Timeline;
11. Entity Picker.

Each pattern is a horizontal editorial chapter rather than a card in a
two-column grid.

The chapter includes all available fields. Missing optional fields are omitted
without leaving empty columns or placeholder labels. Trade-offs remain visible
for every complementary pattern.

Tags such as attention, multiplayer, audit, and selection appear as restrained
metadata text rather than pills.

## Pattern Anatomy

Every pattern uses a consistent content order:

1. number;
2. category or tag;
3. title;
4. summary;
5. structure;
6. logic;
7. context of use;
8. when not to use;
9. trade-offs;
10. Aetheris Insight.

Primary patterns currently lack an explicit trade-off field. Their existing
boundary guidance and insight remain intact; no invented trade-off copy is
required unless it can be derived without changing meaning.

## Visual System

### Scale

- page title: 48 to 56 pixels desktop and approximately 40 pixels mobile;
- pattern title: 30 to 32 pixels desktop and 24 to 26 pixels mobile;
- group or field title: 10 to 12 pixel tracked metadata;
- body copy: 14 to 16 pixels with controlled line length;
- pattern number: visually strong but subordinate to the page title.

The page must not use a scale larger than the normalized Manifesto or Tokens
pages.

### Layout

- use the existing Foundations container with a 1280 pixel maximum width;
- maintain one continuous vertical flow;
- keep a fixed number column on desktop;
- align every pattern title to the same content start line;
- use two-column editorial detail regions only when both fields contain useful
  content;
- stack all detail regions in reading order on mobile;
- avoid artificial equal heights.

### Surface And Color

- off-black Aetheris canvas;
- restrained purple ambient gradient;
- subtle borders and low-contrast surfaces;
- context, contraindication, and insight may receive distinct quiet surfaces;
- contraindication uses a restrained error tint, not a warning card;
- insight uses a restrained purple tint, not a decorative quote card;
- no nested cards or glass-panel grid.

### Iconography

The existing pattern icons remain available as supporting orientation. They are
small, use one stroke vocabulary, and never occupy large decorative containers.

### Closing

The current closing idea remains as an editorial statement:

> The best interface is a mental model made visible.

The two non-functional buttons, Download Spec and View Prototypes, are removed.
The closing uses typography and whitespace only.

## Internationalization

The page provides distinct content for:

- English;
- Brazilian Portuguese;
- European Portuguese.

Localization must cover:

- hero, thesis, summary, and reading guide;
- category and tag labels;
- structure, logic, context, contraindication, trade-offs, and insight;
- every pattern description;
- closing statement.

Canonical English pattern names may remain where they are established product
terms, but Portuguese titles should use the current localized names
consistently. Brazilian and European Portuguese differ where spelling,
vocabulary, or grammar requires it.

Known copy inconsistencies such as mixed regional language, awkward phrasing,
and incorrect constructions must be corrected without changing the underlying
pattern recommendation.

## Component Architecture

Implementation remains in the existing React and Tailwind stack. The current
content model may be normalized into one common pattern type so all eleven
patterns can share presentation components.

Recommended components:

- `PatternSummary`;
- `PatternGuide`;
- `PatternChapter`;
- `PatternField`;
- `PatternContextStudy`;
- `PatternInsight`;
- `PatternClosing`.

These components receive localized data and do not duplicate pattern text.

## Data Flow

1. `getPatternsContent(locale)` remains the localized source of truth.
2. Foundational and complementary arrays are combined into one ordered list.
3. The first two items retain foundational status.
4. Derived metrics calculate total, foundational, complementary, cognitive
   objective, and documented field coverage.
5. Shared chapter components render available fields in a fixed semantic order.

No new pattern is added and no existing pattern is removed.

## RAG Compatibility

The existing extraction pipeline reads the pattern arrays from
`PatternsPage.tsx`. The implementation must preserve recognizable
`primaryPatterns` and `compactPatterns` arrays, or update the extractor in the
same change if their structure changes.

Visible headings and field labels remain semantic text in the DOM so Beatrice
can retrieve:

- pattern structure;
- behavioral logic;
- context of use;
- contraindications;
- trade-offs;
- strategic insight.

## Accessibility And Responsive Behavior

- preserve semantic heading order;
- retain natural DOM reading order;
- do not use color alone to identify contraindications or insight;
- ensure body and metadata contrast meet WCAG AA where required;
- avoid horizontal page overflow at 390 pixels;
- stack detail fields rather than shrinking type;
- keep decorative icons hidden from assistive technology;
- add no decorative animation that conflicts with reduced-motion preferences.

## Files In Scope

Expected implementation changes:

- `src/components/PatternsPage.tsx`;
- `rag/extract_docs.py` only if the data structure requires an extractor update;
- focused validation scripts when useful.

Global Foundations layout, token definitions, and unrelated pages remain out of
scope.

## Validation

Implementation is complete when:

- production build succeeds;
- exactly 11 patterns render in order from `01` to `11`;
- Dashboard and Multi-step Form are marked as foundational;
- nine complementary patterns render with the shared anatomy;
- English, Brazilian Portuguese, and European Portuguese contain localized
  narrative content;
- no Download Spec or View Prototypes button remains;
- pattern title alignment is consistent across all chapters;
- desktop and 390 pixel mobile layouts have no page overflow;
- the RAG extractor still indexes all 11 patterns and their available fields;
- the final page feels 70% premium editorial and 30% structured design-system
  documentation while remaining an internal Aetheris surface.

## Resolved Decisions

- 70/30 premium editorial and structured documentation balance selected.
- Continuous numbering from `01` to `11` selected.
- Moderate foundational emphasis for the first two patterns selected.
- Horizontal editorial chapters for complementary patterns selected.
- Compact internal-page scale selected.
- No dominant hero image selected.
- Existing pattern inventory selected.
- Full localization selected.
- Non-functional closing CTAs removed.

No unresolved product or visual decision remains.
