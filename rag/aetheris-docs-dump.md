# Aetheris Design System — Corpus Dump (TSX Source)

> **Total chunks:** 54  
> **Extractor:** v2.1.0-tsx (React/TypeScript source)  
> **Embedding model:** BAAI/bge-m3  

---

## [COMPONENT] Primary Action
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 766

**Structure:** High-contrast button with brand gradient, elevated shadow and concise single label. Optional leading icon.
**Logic:** One primary action per view centers decision-making and prevents competing calls to attention.
**Context Of Use:** Section: Actions
**When To Use:** Primary task completion and high-value progress steps.
**When Not To Use:** Secondary choices or low-impact options.
**Trade Offs:** Multiple primary actions on the same surface compete and cancel each other out. Demote secondary actions to a button group or overflow menu.
**Aetheris Insight:** Limit to one primary action per focal region to keep neural clarity in dense interfaces.

---

## [COMPONENT] Switch Control
**Source:** `ComponentsPage.tsx`  **Status:** Beta  **Chars:** 763

**Structure:** Pill-shaped container with 2–4 equal-width segments; active segment has filled background and brand color.
**Logic:** Segmented controls signal that options are mutually exclusive and equally weighted — not sequential steps.
**Context Of Use:** Section: Actions
**When To Use:** List, grid, graph and other tightly related perspectives.
**When Not To Use:** Cross-domain navigation or destination changes.
**Trade Offs:** For more than 4 options a dropdown or tab bar scales better. Long labels break the visual balance of equal-weight segments.
**Aetheris Insight:** Keep label lengths balanced to prevent perceptual jitter during transitions.

---

## [COMPONENT] Global FAB
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 780

**Structure:** Circular or squircle button, 56px minimum touch target, floating above content at bottom-right with drop shadow.
**Logic:** The FAB occupies screen real estate at all times, so the action it triggers must justify that persistent cost.
**Context Of Use:** Section: Actions
**When To Use:** Creation flows that are always relevant in the current surface.
**When Not To Use:** Nested details or contextual subtasks.
**Trade Offs:** FABs on desktop feel incongruous without a mobile companion. On desktop, prefer a toolbar button or inline primary action.
**Aetheris Insight:** The FAB should feel like the source of creation in the system, not just another button.

---

## [COMPONENT] Contextual Menu
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 812

**Structure:** Three-dot or chevron trigger revealing a dropdown list. Destructive action sits last with color separation.
**Logic:** Contextual menus preserve visual cleanliness by hiding low-frequency actions behind a trigger only those who need them will discover.
**Context Of Use:** Section: Actions
**When To Use:** Rows, cards, assets and records with optional actions.
**When Not To Use:** Primary flows that deserve direct visibility.
**Trade Offs:** Hiding all actions makes the surface feel inert. Expose the most-used action as a direct affordance and reserve the menu for the rest.
**Aetheris Insight:** Destructive actions should always sit last and visually separated from safe actions.

---

## [COMPONENT] System Alerts
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 755

**Structure:** Full-width or modal banner with semantic icon, severity color, headline and optional CTA button.
**Logic:** Alerts interrupt the user's flow — use only when ignoring the state costs more than the interruption itself.
**Context Of Use:** Section: Feedback
**When To Use:** Critical system states, outages and blocked synchronization.
**When Not To Use:** Informational or dismissible status changes.
**Trade Offs:** Alert overuse causes alert blindness. Reserve for truly critical states — use toasts for everything else.
**Aetheris Insight:** Alerts should break focus only when the cost of ignoring them exceeds the interruption.

---

## [COMPONENT] Toast Notification
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 762

**Structure:** Compact floating card, bottom-center or top-right, auto-dismissing in 3–5s with optional manual dismiss.
**Logic:** Toasts confirm system behavior without requiring user action — they close themselves to preserve flow.
**Context Of Use:** Section: Feedback
**When To Use:** Saved, copied, synced or completed actions.
**When Not To Use:** Anything requiring a user decision or persistent context.
**Trade Offs:** If the message requires action or persists beyond 5s, it is not a toast — use an alert or modal instead.
**Aetheris Insight:** If the user needs to act, it is not a toast. It is an interruption and should be treated as one.

---

## [COMPONENT] Skeleton Loader
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 790

**Structure:** Animated gray blocks matching the geometry of the incoming content — not a generic spinner.
**Logic:** Skeletons set spatial expectations before content arrives, reducing perceived latency by anchoring the layout.
**Context Of Use:** Section: Feedback
**When To Use:** Async panels, lazy content, pagination and API-backed cards.
**When Not To Use:** Operations so fast that the placeholder flickers.
**Trade Offs:** If content loads in under 300ms, the skeleton flickers and creates more disruption than it prevents. Use a simple opacity fade instead.
**Aetheris Insight:** A skeleton must mimic the final geometry; otherwise reveal feels like layout instability.

---

## [COMPONENT] Metrics Plot
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 766

**Structure:** Line or area chart with labeled axes, hover tooltips and optional reference lines for goals or targets.
**Logic:** Temporal data is about direction and rate of change, not just the current value — a chart answers both simultaneously.
**Context Of Use:** Section: Data Visualization
**When To Use:** Velocity, KPI evolution and forecasted movement.
**When Not To Use:** Single bounded values that need no trend context.
**Trade Offs:** For a single current value without trend relevance, a metric card is clearer and less visually heavy than a chart.
**Aetheris Insight:** Direction of change is often more actionable than the raw number itself.

---

## [COMPONENT] Bioluminescent Heatmap
**Source:** `ComponentsPage.tsx`  **Status:** Beta  **Chars:** 780

**Structure:** Grid or canvas with luminance-based color scale from muted to vivid. Legend is mandatory.
**Logic:** Color intensity maps frequency or density to spatial position, making clusters visible at a glance without counting.
**Context Of Use:** Section: Data Visualization
**When To Use:** Activity clusters, dependency hotspots and risk density.
**When Not To Use:** Sparse datasets with few meaningful concentrations.
**Trade Offs:** With sparse data, few cells have meaningful intensity — the visual becomes noise. Minimum viable density is roughly 10% cell coverage.
**Aetheris Insight:** Map intensity with luminance and opacity before relying on hue shifts.

---

## [COMPONENT] Radial Gauge
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 730

**Structure:** Arc from 0 to maximum value with indicator fill; current value shown numerically in center.
**Logic:** A radial form implies a maximum and minimum, making it semantically appropriate only for bounded values.
**Context Of Use:** Section: Data Visualization
**When To Use:** Health metrics, readiness scores and bounded KPIs.
**When Not To Use:** Unbounded values or raw totals.
**Trade Offs:** For multiple bounded values, a bar chart is denser and more comparable. Gauges are best used in isolation or pairs.
**Aetheris Insight:** A radial gauge implies a maximum; never use it for values without clear bounds.

---

## [COMPONENT] Sparkline Strip
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 740

**Structure:** Micro line chart, 60–120px wide, no axes or labels, optionally color-coded by direction.
**Logic:** Sparklines convey directionality — up, down or flat — in minimal space alongside a metric label.
**Context Of Use:** Section: Data Visualization
**When To Use:** Dense dashboards that still need directional context.
**When Not To Use:** Situations where precise reading beats glanceability.
**Trade Offs:** Sparklines sacrifice precision for compactness. If the user needs exact values at each point, use a full chart.
**Aetheris Insight:** A sparkline answers one critical question fast: is this getting better or worse?

---

## [COMPONENT] Entity Graph
**Source:** `ComponentsPage.tsx`  **Status:** Beta  **Chars:** 756

**Structure:** Nodes as entities, edges as relationships, with optional labels, direction arrows and weight encoding.
**Logic:** Node-link diagrams reveal structural relationships that tabular data cannot express — adjacency is data.
**Context Of Use:** Section: Data Visualization
**When To Use:** Connected entities where adjacency itself is meaningful.
**When Not To Use:** Linear flows better expressed as steps or trees.
**Trade Offs:** Graphs with more than ~50 nodes become visually cluttered. Use filtering, clustering or a matrix view instead.
**Aetheris Insight:** Relationships are also data, and surfacing them often reveals the true bottleneck.

---

## [COMPONENT] Neural Input
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 808

**Structure:** Full-width text field with subtle glow animation on focus, placeholder as contextual prompt, optional trailing action button.
**Logic:** A semantically rich input field signals that the system accepts open-ended, natural-language queries — not just form values.
**Context Of Use:** Section: Inputs
**When To Use:** Search, prompts, generative commands and AI-assisted actions.
**When Not To Use:** Rigid structured forms with heavy validation.
**Trade Offs:** Neural inputs imply AI processing behind them. If the backend is a simple search, this styling creates a trust mismatch.
**Aetheris Insight:** Subtle glow and focused contrast make the field feel alive without reducing legibility.

---

## [COMPONENT] Selection Chips
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 748

**Structure:** Pill-shaped labels, horizontally scrollable or wrapping, with filled and outlined states for selected and unselected.
**Logic:** Chips make multi-select options tangible and show selected state inline, reducing the overhead of hidden dropdowns.
**Context Of Use:** Section: Inputs
**When To Use:** Status, labels, dataset refinement and filtering.
**When Not To Use:** Long option lists that demand search or hierarchy.
**Trade Offs:** Beyond 10–12 options, chips become unwieldy. Use a searchable multi-select dropdown instead.
**Aetheris Insight:** Chips work best when options are few, semantically clear and visually balanced.

---

## [COMPONENT] Gradient Slider
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 728

**Structure:** Horizontal track with draggable thumb, gradient fill from left to thumb, current value label above or beside.
**Logic:** A continuous slider is appropriate when the user needs to feel a range, not just select a discrete value.
**Context Of Use:** Section: Inputs
**When To Use:** Precision values with immediate visual response.
**When Not To Use:** Discrete, categorical choices.
**Trade Offs:** Sliders are hard to target precisely on touch. For exact numeric input, pair with a text field or step buttons.
**Aetheris Insight:** A slider should communicate range, not ambiguity. Show the current value clearly.

---

## [COMPONENT] Toggle Switch
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 712

**Structure:** Pill track with circular thumb. Off state muted, on state in brand color. Label always visible.
**Logic:** Toggles communicate binary state with an immediate effect — the UI changes the moment the switch moves.
**Context Of Use:** Section: Inputs
**When To Use:** Instant, reversible preferences.
**When Not To Use:** Dangerous actions or changes that require confirmation.
**Trade Offs:** For settings that require a save action before taking effect, use a checkbox with a Save button instead.
**Aetheris Insight:** A toggle promises immediate reversibility; never use it for high-risk consequences.

---

## [COMPONENT] Date Picker
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 743

**Structure:** Trigger input showing formatted date, popover calendar with month navigation and day selection grid.
**Logic:** Calendars anchor temporal choices in the user's mental model of weeks and months — more reliable than raw text input.
**Context Of Use:** Section: Inputs
**When To Use:** Scheduling, planning and time filtering.
**When Not To Use:** Simple year or text inputs where a calendar is excessive.
**Trade Offs:** For entering a well-known date, a text field is faster. Calendars add overhead when the user already knows the exact date.
**Aetheris Insight:** Today should always be a visible anchor so the user can orient instantly.

---

## [COMPONENT] Search Command Bar
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 771

**Structure:** Modal overlay triggered by keyboard shortcut (⌘K), fuzzy search input, grouped results list with icons.
**Logic:** Command bars give power users a keyboard-driven shortcut to any action without mouse navigation through menus.
**Context Of Use:** Section: Inputs
**When To Use:** Apps with broad IA, many actions or expert workflows.
**When Not To Use:** Tiny products where every action is already visible.
**Trade Offs:** Command bars require discovery — users must know they exist. Pair with an onboarding nudge or visible keyboard shortcut label.
**Aetheris Insight:** A great command bar is not an accessory; it becomes the operational backbone.

---

## [XAI_COMPONENT] Explanation Bubble
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 860

**Structure:** Expandable card attached to a prediction or recommendation, showing rationale in 2–3 plain-language sentences.
**Logic:** When AI drives a recommendation, the reasoning must accompany the output — otherwise trust cannot be calibrated by the user.
**Context Of Use:** Section: Intelligence / XAI
**When To Use:** Any AI-driven score or recommendation shown to non-technical users.
**When Not To Use:** Expert surfaces where raw coefficients matter more than summary language.
**Trade Offs:** Explanation text that is too long defeats its purpose. Aim for 2–3 sentences covering what, why and confidence level.
**Aetheris Insight:** Explanation depth should adapt to role: managers need actionability, engineers need detail.

---

## [XAI_COMPONENT] Confidence Meter
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 797

**Structure:** Progress bar, arc or numeric percentage with semantic color coding (green, amber, red tiers).
**Logic:** Displaying confidence calibrates user reliance — high confidence invites action, low confidence invites verification.
**Context Of Use:** Section: Intelligence / XAI
**When To Use:** Predictions, forecasts and probabilistic suggestions.
**When Not To Use:** Deterministic rules where confidence is misleading theater.
**Trade Offs:** A miscalibrated confidence score is worse than no score — it creates false certainty. Validate calibration before shipping.
**Aetheris Insight:** Trust in AI is earned through uncertainty disclosure, not through tone of certainty.

---

## [XAI_COMPONENT] Predictive Progress Card
**Source:** `ComponentsPage.tsx`  **Status:** Beta  **Chars:** 826

**Structure:** Card split between solid (actual) and dashed (projected) sections, with delta label showing days ahead or behind.
**Logic:** Combining current state with projected trajectory gives managers the information they need to intervene before problems materialize.
**Context Of Use:** Section: Intelligence / XAI
**When To Use:** Sprints, milestones and delivery tracking with historical signal.
**When Not To Use:** Tasks with insufficient historical evidence.
**Trade Offs:** Projections without sufficient historical data are unreliable. Require at least 2–3 completed sprints before activating.
**Aetheris Insight:** The projection shadow must read as hypothesis, not promise, through muted styling.

---

## [XAI_COMPONENT] Source Attribution Link
**Source:** `ComponentsPage.tsx`  **Status:** Stable  **Chars:** 796

**Structure:** Inline chip or footnote linking to the source document, log or dataset that powered the AI output.
**Logic:** Provenance turns an assertion into evidence — it allows users to verify claims and builds durable trust in the system.
**Context Of Use:** Section: Intelligence / XAI
**When To Use:** Every AI-generated summary, prediction or recommendation.
**When Not To Use:** Pure UI feedback that is not data-derived.
**Trade Offs:** If the source is a black-box third-party model output, attribution cannot be honest. Surface this limitation explicitly.
**Aetheris Insight:** Explainability without provenance is storytelling. Evidence makes it auditable.

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
**Source:** `DesignDecisionsPage.tsx`  **Status:** Stable  **Chars:** 500

**Logic:** List layout excels for scannable, sequential data with consistent row density. Bento grid excels for heterogeneous content where size encodes priority — larger cells signal higher importance. Use List when users compare items row by row. Use Bento when visual hierarchy and content variety matter more than strict alignment. Trade-off: Bento requires more design effort per item; List is faster to implement but less expressive.
**Context Of Use:** Rule 12

---

## [DESIGN_DECISION] Haptic Feedback
**Source:** `DesignDecisionsPage.tsx`  **Status:** Stable  **Chars:** 542

**Logic:** Haptic feedback confirms high-stakes or irreversible actions on mobile — deletes, confirmations and state toggles. Reserve for moments where tactile confirmation reduces user anxiety about permanence. When to use: destructive actions, form submissions, binary state changes. When not to use: passive events, informational toasts, decorative interactions. Trade-off: overuse degrades trust and drains battery; underuse leaves users uncertain after consequential actions.
**Context Of Use:** Rule 15

---

## [REASONING] Context Ingestion
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 298

**Logic:** Scanning tokens, components, patterns, documentation fragments and live user intent before generating guidance.
**Context Of Use:** Beatrice XAI reasoning pipeline

---

## [REASONING] Constraint Application
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 307

**Logic:** Applying design-system rules, UX principles, accessibility constraints and brand language to narrow valid outcomes.
**Context Of Use:** Beatrice XAI reasoning pipeline

---

## [REASONING] Synthesis Engine
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 306

**Logic:** Resolving tensions between consistency, context, usability and explanatory depth to generate a justified recommendation.
**Context Of Use:** Beatrice XAI reasoning pipeline

---

## [REASONING] Confidence Metrics
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 332

**Structure:** Three-axis scoring: Recommendation clarity, Token consistency, UX principle fit
**Logic:** Scores surface how well a recommendation aligns with design system rules and UX principles.
**Context Of Use:** Shown after oracle responses to help users calibrate trust
**When To Use:** Reference when evaluating competing recommendations
**Trade Offs:** Scores are proxies — high similarity does not guarantee the correct recommendation for every context.
**Aetheris Insight:** Confidence calibration is what distinguishes an oracle from a search engine.

---

## [REASONING] Decision Alternatives
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 349

**Structure:** Multiple paths evaluated; only the best-fit strategy is returned
**Logic:** Alternative paths are weighted against clarity, rationale depth and trust calibration.
**Context Of Use:** Internal oracle evaluation — surfaces in XAI explanation when requested
**When To Use:** Reference when the user asks why a specific response style was chosen
**Trade Offs:** Showing rejected paths increases transparency but adds cognitive load.
**Aetheris Insight:** The best oracle response is the one the user can audit, trust, and reuse.

---

## [PERSONA] Persona Goals — Francisco Soares
**Source:** `PersonaPage.tsx`  **Status:** Stable  **Chars:** 743

**Logic:** Goals define what the primary consumer persona needs from Beatrice.
**Context Of Use:** Primary persona: Product Manager, mid-level DS consumer, sprint-pressure context
**When To Use:** Reference when designing oracle responses for time-constrained users
**Aetheris Insight:** Francisco wants the right answer in 30 seconds — depth on demand, not by default.

---

## [PERSONA] Persona Frustrations — Francisco Soares
**Source:** `PersonaPage.tsx`  **Status:** Stable  **Chars:** 862

**Logic:** Documented friction points that the oracle must address.
**Context Of Use:** Guides oracle response design: answers must be fast, scannable and source-backed
**When To Use:** Reference when evaluating whether an oracle response resolves the user's real barrier
**Aetheris Insight:** The oracle exists to eliminate the gap between documentation and decision.

---

## [PERSONA] Oracle Capability: Explanation Bubble
**Source:** `PersonaPage.tsx`  **Status:** Stable  **Chars:** 219

**Structure:** XAI Widget
**Logic:** Fills the gap between rule and reasoning by explaining why a component is recommended and which UX principle supports the choice.
**Context Of Use:** Maps persona pain point to specific Aetheris component or feature

---

## [PERSONA] Oracle Capability: Source Attribution Link
**Source:** `PersonaPage.tsx`  **Status:** Stable  **Chars:** 203

**Structure:** Provenance
**Logic:** Shows the exact origin of the answer so Francisco can validate, share and end discussions with traceability.
**Context Of Use:** Maps persona pain point to specific Aetheris component or feature

---

## [PERSONA] Oracle Capability: Confidence Meter
**Source:** `PersonaPage.tsx`  **Status:** Stable  **Chars:** 180

**Structure:** Trust Signal
**Logic:** Communicates certainty level so he can calibrate risk and decide without extra validation.
**Context Of Use:** Maps persona pain point to specific Aetheris component or feature

---

## [PERSONA] Oracle Capability: Beatrice Chat (RAG + NLP)
**Source:** `PersonaPage.tsx`  **Status:** Stable  **Chars:** 211

**Structure:** Oracle
**Logic:** Transforms natural language into a layered answer with recommendation, context, explanation and source within seconds.
**Context Of Use:** Maps persona pain point to specific Aetheris component or feature

---

## [DEV_INTEGRATION] API Endpoints
**Source:** `DevIntegrationPage.tsx`  **Status:** Stable  **Chars:** 358

**Structure:** REST + streaming endpoints served by the FastAPI server on port 3333
**Logic:** Beatrice exposes /api/chat (SSE streaming) and /health (status check).
**Context Of Use:** Integrating Beatrice into external tools, dashboards or developer workflows
**When To Use:** Use /api/chat for all oracle queries. Use /health to verify server status.
**When Not To Use:** Do not poll /api/chat for non-query operations.
**Trade Offs:** SSE streaming requires EventSource-compatible clients.
**Aetheris Insight:** The API contract mirrors OpenAI streaming format — compatible with most AI SDK clients.

---

## [DEV_INTEGRATION] Framework Support
**Source:** `DevIntegrationPage.tsx`  **Status:** Stable  **Chars:** 263

**Structure:** npm packages: @aetheris/core, @aetheris/tokens, @aetheris/react
**Logic:** Aetheris ships framework-specific adapters alongside a framework-agnostic core.
**Context Of Use:** Setting up Aetheris in a new or existing project
**When To Use:** Install @aetheris/react for React projects, @aetheris/vue for Vue projects.
**When Not To Use:** Do not import @aetheris/react in a Vue project or vice versa.
**Trade Offs:** Framework packages add a thin adapter layer — minimal overhead, maximum type safety.
**Aetheris Insight:** The core + tokens separation means theme changes never require framework updates.

---
