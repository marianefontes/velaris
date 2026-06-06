# Aetheris Navigation and Components Workbench Design

Date: 2026-06-06
Status: Approved

## Objective

Separate the Aetheris home, Beatrice chat, conceptual foundations, and interactive
component documentation into explicit product surfaces. Rebuild the main Components
Workbench around exactly 25 documented components in five sections, with no
experimental components remaining on the page.

The migration must preserve the current visual language, locale support, dark mode,
glass surfaces, global tokens, typography, and the existing Beatrice behavior.

## Current State

- `/oracle` renders `OracleHomePage`, the current landing dashboard.
- `/oracle/chat` renders the Beatrice conversational workspace.
- `/main` redirects to `/oracle`.
- The primary menu labels `/oracle` as `Oráculo`.
- `/foundations` and `/components` already exist as independent primary surfaces.
- `/system` already has a compatibility redirect that distinguishes component and
  foundation-focused links.
- `ComponentsPage.tsx` contains 23 catalog cards across broad groups, including nine
  components that are now out of scope.
- Only five current entries expose the full interactive Workbench contract.

## Route Architecture

### Primary routes

| Surface | Route | Responsibility |
| --- | --- | --- |
| Início | `/main` | Landing dashboard, context, recent queries, operational overview, and entry points |
| Raciocínio | `/reasoning` | Beatrice reasoning, retrieval, classification, synthesis, and confidence |
| Perspectivas | `/perspectives` | Cognitive lenses, profiles, comparison, and adaptation |
| Foundations | `/foundations` | Manifesto, principles, visual foundations, patterns, and tokens |
| Components | `/components` | Interactive design-system component documentation |
| Desenvolvedores | `/developers` | RAG, API, infrastructure, corpus, inspector, and technical decisions |
| Avaliação | `/evaluation` | Methodology, instruments, metrics, comparisons, and evaluation status |

### Secondary route

`/oracle` exclusively renders the Beatrice chat. It is reachable through the
`Chat da Beatrice` header CTA and contextual links, but it is not a primary menu item.

### Compatibility redirects

- `/` -> `/main`
- `/home` -> `/main`
- `/dashboard` -> `/main`
- unknown routes -> `/main`
- `/oracle/chat` -> `/oracle`
- `/beatrice-chat` -> `/oracle`
- `/system` -> `/foundations`
- `/system?focus=components` -> `/components`
- `/system?focus=patterns|tokens|foundations` -> the matching Foundations focus
- Existing redirects for intelligence, principles, patterns, tokens, persona,
  development, comparison, and evaluation remain available.

No compatibility redirect may make `/oracle` behave as the home page.

## Navigation

The primary route configuration contains exactly these seven items, in order:

1. Início
2. Raciocínio
3. Perspectivas
4. Foundations
5. Components
6. Desenvolvedores
7. Avaliação

`Início` uses `/main` and the existing home-oriented translation key. The Aetheris
wordmark links to `/main`. The `Chat da Beatrice` CTA links to `/oracle`.

The current exact-or-descendant active-state rule remains in place. Because `/oracle`
is removed from the primary route array, opening the chat does not incorrectly mark
`Início` active.

## Home and Chat Migration

The current `OracleHomePage` implementation becomes the content rendered at `/main`.
Its useful dashboard content, recent history, component entry points, system status,
and operational overview remain intact. Internal links that open chat history or start
a conversation change from `/oracle/chat` to `/oracle`.

The existing `OraclePage` wrapper remains the chat route element and continues to
render the modular Beatrice workspace. Its canonical route becomes `/oracle`.

Study onboarding and other links that previously used `/oracle` as the landing page
change to `/main`. Links that explicitly start or reopen a Beatrice conversation
change to `/oracle`.

## Foundations Boundary

`FoundationsHubPage.tsx` remains the conceptual container for:

- manifesto and principles;
- visual foundations;
- patterns;
- tokens.

It may mention the component library and link to `/components`, but it does not embed
the interactive Workbench. The existing `/system` redirect preserves old links
without restoring the former combined surface.

## Components Data Model

`ComponentsPage.tsx` remains the operational documentation surface and a source file
for the RAG extraction pipeline. Its catalog is replaced by one typed source of truth.

Each component entry contains:

- stable identifier;
- professional display name;
- section identifier;
- status;
- description and usage guidance;
- when to use;
- when to avoid;
- accessibility guidance;
- Beatrice/RAG/XAI relationship;
- states;
- intents;
- implementation snippet;
- preview kind and icon.

The page derives the section navigation, component navigation, selected documentation,
and total count from this source. No independent duplicate list is maintained.

## Final Component Library

### Ações e Controles

1. Button
2. Toggle/Switch
3. Checkbox
4. Radio Button
5. Selectable Chip / Badge

### Inputs e Formulários

1. Input / Text Input
2. Text Area
3. Select/Dropdown
4. Date Picker
5. Form Field

### Navegação e Estrutura

1. Link
2. Tabs
3. Card
4. Modal/Dialog
5. Table/Data Table

### Feedback e Estados

1. Alert
2. Toast/Notification
3. Skeleton Loader
4. Explanation Bubble / Tooltip
5. Confidence Badge

### Inteligência, XAI e Auditabilidade

1. Command Palette / Barra de Comandos
2. Source Attribution
3. Audit Panel
4. Typography
5. Icon

The page asserts and displays a total of 25 primary components, with five components
per section.

## Removed Components

These components are deleted from `/components` completely and are not rendered in an
experimental, future, or out-of-scope section:

1. FAB Global
2. Menu Contextual
3. Gráfico de Métricas
4. Mapa de Calor Bioluminescente Beta
5. Medidor Radial
6. Sparkline
7. Grafo de Entidades Beta
8. Slider Gradiente
9. Card de Progresso Preditivo Beta

The separate `Controle de Alternância` and `Interruptor Toggle` concepts are replaced
by one `Toggle/Switch` entry.

## Workbench Interaction

The Workbench keeps the current visual shell and supports:

- section-aware component selection;
- an interactive preview appropriate to each component;
- states and intents;
- a copyable code snippet;
- usage description;
- do and do-not guidance;
- explicit accessibility guidance;
- explicit RAG/XAI relevance.

The component cards and Workbench are generated from the same 25-entry source. This
prevents count drift and guarantees that every component has the full documentation
contract.

## Locale Strategy

Navigation labels remain in the existing translation system for `pt-BR`, `pt-PT`, and
`en-US`. Component names stay standardized while supporting localized section labels,
descriptions, guidance, accessibility text, and Workbench UI labels.

The migration does not change the locale provider or introduce a second translation
mechanism outside the page's existing content factory.

## Files

Expected files to modify:

- `src/App.tsx`: canonical routes and compatibility redirects.
- `src/routes.tsx`: seven primary navigation entries with `/main` first.
- `src/components/AppTopBar.tsx`: home wordmark and `/oracle` chat CTA.
- `src/components/OracleHomePage.tsx`: canonical route comments and chat links.
- `src/components/OraclePage.tsx`: canonical chat-route comments.
- `src/components/ComponentsPage.tsx`: single 25-component Workbench.
- `src/i18n/translations.ts`: route labels and badges where needed.
- `src/components/StudyPage.tsx`: study entry route changed to `/main`.
- `src/components/DesignDecisionsPage.tsx`: chat CTA changed to `/oracle`.
- `src/beatrice/components/persona/ActivePersonaHeader.tsx`: chat link changed to `/oracle`.
- `src/beatrice/components/contextual/PersonaExamples.tsx`: chat link changed to `/oracle`.

Additional files are changed only if repository-wide link validation identifies a
route whose intent is unambiguous.

## Validation

Static validation:

- TypeScript and Vite production build succeeds.
- Primary route array has seven entries in the required order.
- `/oracle/chat` is absent from link targets and exists only as a redirect.
- Home-oriented links do not target `/oracle`.
- Chat-oriented links target `/oracle`.
- Removed component names are absent from `ComponentsPage.tsx`.
- Component data contains exactly 25 unique identifiers.
- Each section contains exactly five entries.
- `Toggle/Switch` occurs once in the component data.
- Every component contains states, intents, snippet, usage, avoidance,
  accessibility, and RAG/XAI fields.

Runtime validation:

- `/main` renders the landing dashboard and is active in the menu.
- `/oracle` renders only the Beatrice chat and does not activate a primary item.
- `/foundations` contains conceptual sections without the Workbench.
- `/components` renders five sections and the 25-entry interactive Workbench.
- Header, wordmark, CTAs, old redirects, and active menu states behave as specified.

## Risks and Mitigations

- The working tree already contains extensive local changes. Edits remain narrowly
  scoped and preserve those changes.
- RAG extraction depends on component documentation being present in the source tree.
  The canonical entries remain in `ComponentsPage.tsx`.
- The component page is large. A single typed source of truth reduces duplication
  without changing global styling or requiring a broader design-system refactor.
- Existing external bookmarks may use `/oracle/chat`; the redirect preserves them.

## Manual Decisions

No unresolved product decision remains. The user explicitly chose complete removal of
the nine out-of-scope components and approved this migration design.
