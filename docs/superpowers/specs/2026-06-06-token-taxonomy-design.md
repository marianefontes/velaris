# Aetheris Token Taxonomy Design

Date: 2026-06-06
Status: Approved

## Objective

Expand the Aetheris token documentation from its 37-token prototype baseline into a
complete but restrained taxonomy that supports the 25 primary components, their
states and intents, accessibility, RAG evidence, XAI confidence, source attribution,
and auditability.

The page will document 88 canonical tokens and 16 derived aliases. Aliases are visible
contracts but do not inflate the canonical total.

## Constraints

- Preserve all 37 existing documented tokens.
- Remove every visible `v3` reference from the token page.
- Keep the existing dark theme, typography, glass surfaces, borders, and purple glow.
- Do not change global color values or global typography.
- Keep the canonical total between 75 and 90.
- Prefer semantic aliases over duplicate values and one-off state tokens.
- Keep token documentation extractable by the RAG pipeline.

## Canonical Count

| Category | Count |
| --- | ---: |
| Primitive color | 15 |
| Existing semantic color | 5 |
| Existing system | 17 |
| New semantic general | 47 |
| New canonical XAI | 4 |
| **Canonical total** | **88** |
| Derived aliases | 16 |

The 20 canonical color tokens are the existing 15 primitive colors plus the five
existing semantic color contracts. The page also calculates unique literal color
values from every canonical token with a concrete color value.

## Preserved Tokens

The existing 37 tokens remain unchanged:

- 8 primary scale colors;
- 7 surface colors;
- 5 semantic colors;
- 4 typography tokens;
- 5 spacing tokens;
- 3 radius tokens;
- `shadow-glow`;
- 3 motion duration tokens;
- `easing-signature`.

## New Canonical Tokens

### Text: 5

- `text-primary`
- `text-secondary`
- `text-muted`
- `text-disabled`
- `text-inverse`

### Border: 4

- `border-subtle`
- `border-default`
- `border-strong`
- `border-focus`

### Interaction: 6

- `state-hover-bg`
- `state-hover-border`
- `state-pressed-bg`
- `state-selected-bg`
- `state-disabled-bg`
- `focus-ring`

### Feedback: 10

Canonical feedback contracts:

- `feedback-info-bg`
- `feedback-info-border`
- `feedback-success-bg`
- `feedback-success-border`
- `feedback-warning-bg`
- `feedback-warning-border`
- `feedback-error-bg`
- `feedback-error-border`
- `feedback-info-icon`
- `feedback-error-icon`

The remaining requested feedback foreground and icon names are derived aliases.

### Specialized Surfaces: 4

- `surface-overlay`
- `surface-skeleton`
- `surface-row-selected`
- `overlay-backdrop`

`surface-dialog` and `surface-popover` are documented derived aliases of existing
surface primitives.

### Elevation: 3

- `shadow-sm`
- `shadow-md`
- `shadow-lg`

### Layering: 4

- `z-tooltip`
- `z-toast`
- `z-modal`
- `z-command`

### Dimensions: 7

- `control-height-sm`
- `control-height-md`
- `control-height-lg`
- `target-size-min`
- `icon-size-sm`
- `icon-size-md`
- `icon-size-lg`

### Complementary Typography: 4

- `heading-md`
- `body-sm`
- `caption`
- `code-sm`

### Canonical XAI: 4

- `xai-source-bg`
- `xai-source-border`
- `xai-evidence-highlight`
- `xai-audit-running`

The requested confidence and audit outcome names are aliases to existing semantic
success, warning, and error contracts.

## Derived Aliases

The page documents these 16 aliases without counting them as independent canonical
tokens:

1. `state-selected-border` -> `border-focus`
2. `state-disabled-text` -> `text-disabled`
3. `state-disabled-border` -> `border-subtle`
4. `feedback-info-text` -> `feedback-info-icon`
5. `feedback-success-text` -> `--aetheris-color-success`
6. `feedback-success-icon` -> `--aetheris-color-success`
7. `feedback-warning-text` -> `--aetheris-color-warning`
8. `feedback-warning-icon` -> `--aetheris-color-warning`
9. `feedback-error-text` -> `feedback-error-icon`
10. `xai-confidence-high` -> `--aetheris-color-success`
11. `xai-confidence-medium` -> `--aetheris-color-warning`
12. `xai-confidence-low` -> `--aetheris-color-error`
13. `xai-audit-complete` -> `--aetheris-color-success`
14. `xai-audit-conflict` -> `--aetheris-color-error`
15. `surface-dialog` -> value contract of `surface-container-high`
16. `surface-popover` -> value contract of `surface-container-highest`

The last two establish distinct semantic usage contracts while resolving directly to
existing surface primitives, so they remain aliases rather than canonical values.

## Data Model

`TokensPage.tsx` will use typed token records with:

- token name;
- category;
- value or alias target;
- resolved preview value where needed;
- description;
- component coverage;
- canonical or alias status.

All summary counts are derived from these arrays. No total, category count, unique
color count, or alias count is hardcoded into the rendered metrics.

## Page Structure

1. Hero and calculated summary.
2. Existing primitive and semantic color scales.
3. Semantic contracts grouped by text, border, and interaction.
4. Full feedback contracts.
5. Specialized surfaces, elevation, and layering.
6. Typography, spacing, radius, motion, and dimensions.
7. XAI and auditability contracts.
8. `Aliases e contratos semânticos`.
9. `Cobertura por componente`.

The current visual language remains intact. New sections reuse existing glass panels,
compact metadata labels, mono token names, soft borders, and purple accents.

## Component Coverage

The coverage table groups components rather than creating per-intent tokens:

- Button and controls: color, text, interaction, focus, dimensions, radius, motion.
- Inputs and forms: text, border, focus, disabled, feedback, spacing, dimensions.
- Navigation and structure: text, selected state, borders, surfaces, elevation.
- Modal and popovers: specialized surfaces, backdrop, z-index, shadow, motion.
- Feedback components: feedback contracts, typography, z-index, elevation.
- Command Palette: popover, backdrop, selected state, focus, command z-index.
- Confidence Badge: confidence aliases, feedback, radius, typography.
- Source Attribution: source background/border, evidence highlight, text.
- Audit Panel: audit status, surfaces, borders, typography, feedback.

## RAG Extraction

`rag/extract_docs.py` will extract the expanded token groups and aliases into
semantically meaningful chunks. The generated dump and ChromaDB index will be rebuilt
so Beatrice can retrieve the new contracts.

## Files

Expected modifications:

- `src/components/TokensPage.tsx`
- `rag/extract_docs.py`
- `rag/aetheris-docs-dump.json`
- `rag/aetheris-docs-dump.md`
- `rag/chroma_db/*` through the existing index command
- a focused Playwright/static validation script under `scripts/`

No global palette or typography configuration is changed.

## Validation

- No visible or source copy in `TokensPage.tsx` contains `v3`.
- Exactly 88 canonical tokens and 16 aliases are derived by code.
- All 37 previous tokens remain present with unchanged values.
- The summary displays total, color, system, semantic, XAI, unique color, and alias
  counts derived from the data source.
- Every requested semantic area is represented either canonically or by an explicit
  alias.
- Alias and component coverage sections render.
- Production build succeeds.
- Responsive Playwright checks pass at desktop and mobile widths.
- RAG extraction and ChromaDB reindexing succeed.

## Manual Decisions

No unresolved product decision remains. The user approved consolidation at 88
canonical tokens plus 16 documented derived aliases.
