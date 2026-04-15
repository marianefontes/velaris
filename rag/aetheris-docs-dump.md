# Aetheris Design System — Corpus Dump (TSX Source)

> **Total chunks:** 37  
> **Extractor:** v2.0.0-tsx (React/TypeScript source)  
> **Embedding model:** BAAI/bge-m3  

---

## [COMPONENT] Primary Action
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 387

**Context Of Use:** Section: Actions
**When To Use:** Primary task completion and high-value progress steps.
**When Not To Use:** Secondary choices or low-impact options.
**Aetheris Insight:** Limit to one primary action per focal region to keep neural clarity in dense interfaces.

---

## [COMPONENT] Switch Control
**Source:** `ComponentsPage.tsx`  **Status:** Beta  **Chars:** 389

**Context Of Use:** Section: Actions
**When To Use:** List, grid, graph and other tightly related perspectives.
**When Not To Use:** Cross-domain navigation or destination changes.
**Aetheris Insight:** Keep label lengths balanced to prevent perceptual jitter during transitions.

---

## [COMPONENT] Global FAB
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 397

**Context Of Use:** Section: Actions
**When To Use:** Creation flows that are always relevant in the current surface.
**When Not To Use:** Nested details or contextual subtasks.
**Aetheris Insight:** The FAB should feel like the source of creation in the system, not just another button.

---

## [COMPONENT] Contextual Menu
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 399

**Context Of Use:** Section: Actions
**When To Use:** Rows, cards, assets and records with optional actions.
**When Not To Use:** Primary flows that deserve direct visibility.
**Aetheris Insight:** Destructive actions should always sit last and visually separated from safe actions.

---

## [COMPONENT] System Alerts
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 407

**Context Of Use:** Section: Feedback
**When To Use:** Critical system states, outages and blocked synchronization.
**When Not To Use:** Informational or dismissible status changes.
**Aetheris Insight:** Alerts should break focus only when the cost of ignoring them exceeds the interruption.

---

## [COMPONENT] Toast Notification
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 413

**Context Of Use:** Section: Feedback
**When To Use:** Saved, copied, synced or completed actions.
**When Not To Use:** Anything requiring a user decision or persistent context.
**Aetheris Insight:** If the user needs to act, it is not a toast. It is an interruption and should be treated as one.

---

## [COMPONENT] Skeleton Loader
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 415

**Context Of Use:** Section: Feedback
**When To Use:** Async panels, lazy content, pagination and API-backed cards.
**When Not To Use:** Operations so fast that the placeholder flickers.
**Aetheris Insight:** A skeleton must mimic the final geometry; otherwise reveal feels like layout instability.

---

## [COMPONENT] Metrics Plot
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 392

**Context Of Use:** Section: Data Visualization
**When To Use:** Velocity, KPI evolution and forecasted movement.
**When Not To Use:** Single bounded values that need no trend context.
**Aetheris Insight:** Direction of change is often more actionable than the raw number itself.

---

## [COMPONENT] Bioluminescent Heatmap
**Source:** `ComponentsPage.tsx`  **Status:** Beta  **Chars:** 402

**Context Of Use:** Section: Data Visualization
**When To Use:** Activity clusters, dependency hotspots and risk density.
**When Not To Use:** Sparse datasets with few meaningful concentrations.
**Aetheris Insight:** Map intensity with luminance and opacity before relying on hue shifts.

---

## [COMPONENT] Radial Gauge
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 381

**Context Of Use:** Section: Data Visualization
**When To Use:** Health metrics, readiness scores and bounded KPIs.
**When Not To Use:** Unbounded values or raw totals.
**Aetheris Insight:** A radial gauge implies a maximum; never use it for values without clear bounds.

---

## [COMPONENT] Sparkline Strip
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 406

**Context Of Use:** Section: Data Visualization
**When To Use:** Dense dashboards that still need directional context.
**When Not To Use:** Situations where precise reading beats glanceability.
**Aetheris Insight:** A sparkline answers one critical question fast: is this getting better or worse?

---

## [COMPONENT] Entity Graph
**Source:** `ComponentsPage.tsx`  **Status:** Beta  **Chars:** 401

**Context Of Use:** Section: Data Visualization
**When To Use:** Connected entities where adjacency itself is meaningful.
**When Not To Use:** Linear flows better expressed as steps or trees.
**Aetheris Insight:** Relationships are also data, and surfacing them often reveals the true bottleneck.

---

## [COMPONENT] Neural Input
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 400

**Context Of Use:** Section: Inputs
**When To Use:** Search, prompts, generative commands and AI-assisted actions.
**When Not To Use:** Rigid structured forms with heavy validation.
**Aetheris Insight:** Subtle glow and focused contrast make the field feel alive without reducing legibility.

---

## [COMPONENT] Selection Chips
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 385

**Context Of Use:** Section: Inputs
**When To Use:** Status, labels, dataset refinement and filtering.
**When Not To Use:** Long option lists that demand search or hierarchy.
**Aetheris Insight:** Chips work best when options are few, semantically clear and visually balanced.

---

## [COMPONENT] Gradient Slider
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 364

**Context Of Use:** Section: Inputs
**When To Use:** Precision values with immediate visual response.
**When Not To Use:** Discrete, categorical choices.
**Aetheris Insight:** A slider should communicate range, not ambiguity. Show the current value clearly.

---

## [COMPONENT] Toggle Switch
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 371

**Context Of Use:** Section: Inputs
**When To Use:** Instant, reversible preferences.
**When Not To Use:** Dangerous actions or changes that require confirmation.
**Aetheris Insight:** A toggle promises immediate reversibility; never use it for high-risk consequences.

---

## [COMPONENT] Date Picker
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 365

**Context Of Use:** Section: Inputs
**When To Use:** Scheduling, planning and time filtering.
**When Not To Use:** Simple year or text inputs where a calendar is excessive.
**Aetheris Insight:** Today should always be a visible anchor so the user can orient instantly.

---

## [COMPONENT] Search Command Bar
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 393

**Context Of Use:** Section: Inputs
**When To Use:** Apps with broad IA, many actions or expert workflows.
**When Not To Use:** Tiny products where every action is already visible.
**Aetheris Insight:** A great command bar is not an accessory; it becomes the operational backbone.

---

## [PATTERN] Dashboard
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 541

**Structure:** Centralized telemetry hub with high-density data visualization and contextual action bars.
**Logic:** Aggregation of disparate data sources into a unified cognitive plane.
**Context Of Use:** Monitoring systems, complex SaaS management, and resource oversight.
**When Not To Use:** Simple task-focused tools or mobile-first consumer apps where focus is singular.
**Aetheris Insight:** Dashboards should breathe. In complex environments, prioritize temporal data: what is happening now over what has happened.

---

## [PATTERN] Multi-step Form
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 676

**Structure:** Input fields fragmented into thematic logical blocks, each scoped to a single decision or data group, with persistent progress indication.
**Logic:** Reduces overwhelm by sequencing decisions and maintaining momentum through completion.
**Context Of Use:** Account registration, checkout flows, complex configuration wizards and onboarding sequences with branching logic.
**When Not To Use:** Simple forms under five fields, related inputs that benefit from simultaneous visibility or quick mobile actions.
**Aetheris Insight:** Focus on momentum. Use predictive pre-fills and inline validation to eliminate cognitive drag between steps.

---

## [PATTERN] Onboarding
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 682

**Structure:** Progressive disclosure sequence that introduces key features through contextual education without interrupting the primary workflow.
**Context Of Use:** First-run experiences, post-signup activation, feature discovery after major updates and role-based capability reveals.
**When Not To Use:** Interfaces that are already self-evident, transactional flows or returning users who already completed setup.
**Trade Offs:** Increases activation and adoption, but becomes easy to skip if it feels generic or detached from user intent.
**Aetheris Insight:** Personalize the path. Show users what they care about first instead of replaying a generic tour.

---

## [PATTERN] Data Explorer
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 679

**Structure:** Dynamic filtering interface with faceted search, drill-down capabilities and cross-dimensional analysis controls over large datasets.
**Logic:** Hypothesis-driven exploration where users define queries and the system surfaces relevant subsets.
**Context Of Use:** Analytics platforms, research tools, inventory systems and BI dashboards with multi-dimensional data.
**Trade Offs:** Extremely powerful for experts, but needs clear affordances, sane defaults and saved views to avoid novice overload.
**Aetheris Insight:** Use semantic search as the primary entry point. A single natural-language query often replaces a chain of manual filters.

---

## [PATTERN] Empty States
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 755

**Structure:** Intentional placeholder view combining explanation, hierarchy and one primary action scoped to the empty container.
**Logic:** Transforms absence into guidance, turning the first interaction with a feature into a conversion moment.
**Context Of Use:** New accounts, cleared tables, zero-result searches, unconnected integrations and fresh projects.
**When Not To Use:** Transient loading or background processing, where skeleton screens preserve spatial continuity better.
**Trade Offs:** Excellent for orientation and activation, but weakens trust if it feels decorative instead of actionable.
**Aetheris Insight:** Treat void as opportunity. A clear next step reframes incompleteness as a starting point, not a failure.

---

## [PATTERN] Settings & Config
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 452

**Logic:** Hierarchical nesting of system variables and user preferences.
**Context Of Use:** Global application control, preferences, permissions and environment-level tuning.
**Trade Offs:** Powerful and expected, but quickly becomes hostile when high-impact toggles are buried too deep.
**Aetheris Insight:** Configuration is the user's manifesto. Never hide high-impact toggles behind more than two layers of navigation.

---

## [PATTERN] Command Center
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 391

**Structure:** Single-input, modal-driven command surface backed by keyboard shortcuts and semantic matching.
**Trade Offs:** Fastest pattern for experts, but almost invisible to new users without clear onboarding or discoverability cues.
**Aetheris Insight:** Language is the most efficient interface. Every complex app benefits from a text-based shortcut system.

---

## [PATTERN] Focus Mode
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 778

**Structure:** A modal or full-screen overlay that isolates a single artifact by collapsing sidebars, notifications and peripheral navigation.
**Logic:** Eliminates context switching cost and lowers the cognitive price of sustaining attention on one objective.
**Context Of Use:** Long-form editors, code reviews, document drafting and design canvases that need prolonged immersion.
**When Not To Use:** Workflows that depend on simultaneous references, multi-pane awareness or live collaborative context.
**Trade Offs:** Maximizes concentration and quality, but can disorient users if returning to the broader interface is high-friction.
**Aetheris Insight:** Silence is a design decision. A good Focus Mode curates attention instead of merely hiding controls.

---

## [PATTERN] Collaboration
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 749

**Structure:** Real-time presence indicators, conflict-resolution UI and co-editing primitives layered onto an existing single-user interface.
**Logic:** Operational transformation or CRDT-based synchronization turns presence into first-class interface data.
**Context Of Use:** Collaborative documents, shared canvases, code review sessions and whiteboarding workflows.
**When Not To Use:** Strict sequential ownership flows, low-latency environments with tight constraints or single-user personal surfaces.
**Trade Offs:** Increases team velocity, but adds significant system complexity and can introduce visual noise in solo tasks.
**Aetheris Insight:** Presence is data. Show what others are editing, not only where they are.

---

## [PATTERN] Timeline
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 728

**Structure:** Chronological log of state mutations, user actions or system events with actor identity, timestamps and restore affordances.
**Logic:** Treats every meaningful change as an immutable event, turning time into a navigable axis.
**Context Of Use:** Version-controlled editors, audit logs, publishing workflows and configuration history surfaces.
**When Not To Use:** Ephemeral live feeds, trivial interactions or cases where event storage costs outweigh user value.
**Trade Offs:** Builds recovery confidence and trust, but needs careful abstraction to avoid overwhelming non-technical users.
**Aetheris Insight:** Permanent history is more than undo. It gives users permission to take creative risks.

---

## [PATTERN] Entity Picker
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 731

**Structure:** Inline or popover search-driven selector for relational entities with type-ahead, multi-select and preview chips.
**Logic:** Creates typed references instead of duplicating data, preserving authority in the source context.
**Context Of Use:** Assignees, tags, mentions, attachments, relationship fields and permission scope selectors.
**When Not To Use:** Small static option sets or flat values such as booleans, enums and simple colors.
**Trade Offs:** Preserves relational integrity and reduces duplication, but relies on fast backend search and responsive type-ahead UX.
**Aetheris Insight:** Link, don't copy. References preserve authority and allow the system to reason about relationships.

---

## [TOKEN] Color Tokens
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 428

**Structure:** Primary scale (#f5f0ff → #4a1aa0) + Surface scale (#000000 → #2c2c2f)
**Logic:** Primary tokens drive brand identity and interactive states. Surface tokens define depth hierarchy.
**Context Of Use:** Every component that uses color must reference these tokens, never raw hex values.
**When To Use:** Use primary-200 (#deccfd) for brand accent, primary-300 (#c2a0fc) for secondary. Use background (#0e0e10) for app background, surface-container (#19191c) for cards.
**When Not To Use:** Never use raw hex values outside this token system.
**Aetheris Insight:** primary-200 and primary-300 form the signature gradient. Surface tokens create depth without shadows.

---

## [TOKEN] Semantic Color Tokens
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 260

**Structure:** Named semantic roles mapped to hex values
**Logic:** Semantic tokens abstract color intent from raw values.
**Context Of Use:** Use semantic tokens (--aetheris-color-primary, --aetheris-color-error) for states and feedback.
**When To Use:** Use error (#ff6e84) for destructive actions and alerts. Use success (#7ee787) for confirmations.
**When Not To Use:** Do not use warning color for primary actions.
**Aetheris Insight:** Semantic tokens decouple meaning from aesthetics — changing a theme only requires updating token values.

---

## [TOKEN] Typography Tokens
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 427

**Structure:** display-xl → heading-lg → body-md → label-sm
**Logic:** Four-level type scale balancing display impact with readable body density.
**Context Of Use:** Every text element should reference one of these four scales.
**When To Use:** display-xl for hero headlines, heading-lg for section anchors, body-md for documentation, label-sm for metadata and chips.
**When Not To Use:** Do not mix custom font sizes outside this scale.
**Aetheris Insight:** A constrained type scale is invisible when correct and jarring when broken.

---

## [TOKEN] Spacing Tokens
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 302

**Structure:** space-1 (0.25rem) through space-10 (2.5rem)
**Logic:** Consistent rhythm across all layout decisions.
**Context Of Use:** All padding, margin and gap values should use these tokens.
**When To Use:** space-4 (1rem) for default card padding, space-6 for section blocks, space-10 for hero separation.
**When Not To Use:** Do not use arbitrary pixel values for spacing.
**Aetheris Insight:** Consistent spacing is what makes dense interfaces feel intentional rather than cramped.

---

## [DESIGN_DECISION] Side Drawer vs Modal Overlay
**Source:** `DesignDecisionsPage.tsx`  **Status:** Stable  **Chars:** 620

**Structure:** Decision tree based on user focus requirements
**Logic:** Spatial continuity vs. attention isolation trade-off.
**Context Of Use:** Any form, panel or overlay interaction that requires choosing a container type.
**When To Use:** Side Drawer: user needs page context. Modal: action requires full focus.
**When Not To Use:** Do not use Modal for low-stakes, reversible actions that don't need interruption.
**Trade Offs:** Visual occlusion with drawers; modal blindness and context loss with modals.
**Aetheris Insight:** The decision maps to one question: does the user need to see the page while acting?

---

## [DESIGN_DECISION] Primary vs. Secondary Button Logic
**Source:** `DesignDecisionsPage.tsx`  **Status:** Stable  **Chars:** 205

**Logic:** When to use the signature gradient versus restrained secondary treatments for terminal actions.
**Context Of Use:** Rule 08: Action Hierarchy

---

## [DESIGN_DECISION] List vs. Bento
**Source:** `DesignDecisionsPage.tsx`  **Status:** Stable  **Chars:** 151

**Logic:** Data visualization density strategies and when chunking improves comprehension.
**Context Of Use:** Rule 12

---

## [DESIGN_DECISION] Haptic Feedback
**Source:** `DesignDecisionsPage.tsx`  **Status:** Stable  **Chars:** 148

**Logic:** Sensory triggers for mobile-first paradigms and confirmation-heavy actions.
**Context Of Use:** Rule 15

---
