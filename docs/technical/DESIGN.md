---
name: Velaris
description: Design System Intelligence — dark editorial instrument for oracle-guided decisions
colors:
  background: "#0e0e10"
  surface-immersive: "#09090d"
  surface-container-low: "#131315"
  surface-container: "#19191c"
  surface-container-high: "#1f1f22"
  surface-container-highest: "#262528"
  primary: "#deccfd"
  primary-dim: "#d0bfee"
  primary-container: "#a999c6"
  secondary: "#c2a0fc"
  secondary-container: "#543589"
  tertiary: "#c29fff"
  on-surface: "#f9f5f8"
  on-surface-variant: "#adaaad"
  outline: "#767577"
  outline-variant: "#48474a"
  error: "#ff6e84"
  warning: "#ffa657"
  success: "#7ee787"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.25rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.04em"
rounded:
  sm: "0.75rem"
  md: "1.125rem"
  lg: "1.25rem"
  xl: "1.625rem"
  full: "9999px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  section: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: "0.625rem 1.25rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface-variant}"
    rounded: "{rounded.md}"
    padding: "0.625rem 1rem"
  card-surface:
    backgroundColor: "{colors.surface-container-high}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
  input-field:
    backgroundColor: "#17171a"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "0.75rem 0.75rem"
    height: "2.75rem"
---

## Overview

**Creative north star: The Spectral Atelier**

Velaris reads as a dark editorial workshop where knowledge condenses into light. Surfaces are void-adjacent graphite with lavender intelligence accents. Hierarchy comes from typographic scale and spacing rhythm, not card proliferation. Abraxos presence appears as glow, graph dissolve, and translucence at identity moments.

Mood: calm, precise, premium, unhurried. Anti-feel: generic SaaS dashboard, AI hype neon, decorative glass everywhere.

Motion uses a single house ease (`cubic-bezier(0.22, 1, 0.36, 1)`): short fade-up and message-in transitions. No bounce, no layout animation.

## Colors

**Strategy: Restrained with committed accent**

Tinted void neutrals carry ~90% of surface area. Lavender primary (`#deccfd`) and secondary (`#c2a0fc`) appear as signal: links, focus, oracle glow, active chips. Semantic colors (success, warning, error) are reserved for status, never decoration.

| Role | Token | Character |
|------|-------|-----------|
| Canvas | `background` | Void graphite — primary app ground |
| Depth | `surface-container-*` | Layered void steps for elevation without heavy shadow |
| Signal | `primary` / `secondary` | Lavender mist — oracle intelligence |
| Text | `on-surface` / `on-surface-variant` | Warm near-white / muted secondary copy |
| Structure | `outline` / `outline-variant` | Hairline borders at 5–10% white alpha |

Technical syntax palette (`technical.*` in Tailwind) mirrors Rose Pine Dawn tones for code blocks and reasoning traces. Keep syntax colors inside technical surfaces only.

Never use pure `#000` or `#fff` for large fields. Prefer existing surface tokens and `border-white/[0.05–0.10]` hairlines.

## Typography

**Inter** for all roles (display through label). Hierarchy through weight + scale (≥1.25 ratio between steps), not font-family switching.

- Body copy: cap line length ~65–75ch in prose sections.
- Labels and eyebrows: uppercase or small caps feel via `label` size + letter-spacing, not decorative fonts.
- Headlines: tight tracking (`-0.01em` to `-0.02em`), semibold weight.
- Tabular numerals for metrics and similarity scores.

## Elevation

**Philosophy: tonal layering + ambient glow, not stacked cards**

Elevation is expressed through surface-container steps, subtle inset highlights, and restrained glow shadows (`glow`, `panel`, `oracle`, `cognitive-*` in Tailwind). Shadows are atmospheric (lavender-tinted, low opacity), not structural drop shadows.

- Grounded contact: `soft` shadow for bubbles and floating inputs.
- Oracle moments: `oracle-ambient` radial gradient at section tops.
- Avoid nested card-in-card-in-card stacks; prefer full-width sections with internal dividers.

Glass/blur (`backdrop-blur-xl`) is allowed sparingly on hero and oracle panels, not as a default card treatment.

## Components

**Cards / panels**
- Radius: `rounded-[18px]` to `rounded-[26px]` for feature cards; `rounded-xl` for compact nested items.
- Border: `border-white/[0.05–0.08]`, brighten slightly on hover.
- Background: gradient from `white/[0.035]` or `surface-container-high/40`, not flat gray slabs.

**Buttons**
- Primary: filled primary with on-primary text; focus ring `ring-primary/50`.
- Ghost: transparent with on-surface-variant text; hover lifts border/background one step.
- Min touch target: 44px height on interactive rows.

**Inputs** (`.laboratory-input` pattern)
- Height 44px, `rounded-xl`, `#17171a` fill, `border-white/10`, focus `border-primary/35`.

**Chat / oracle**
- Message fade-up on entry (`message-in` animation).
- Source chips: compact rounded-xl rows, primary tint at low alpha.
- Abraxos mark: glyph at 16px+; never cartoon illustration.

**Navigation**
- AppTopBar: primary routes only (9 surfaces); badges via i18n keys.
- Focus-visible rings with offset against `background`.

## Do's and Don'ts

**Do**
- Use existing Tailwind tokens from `tailwind.config.ts` and CSS vars in `src/index.css`.
- Let typography and spacing create hierarchy before adding containers.
- Show evidence, sources, and reasoning inline where users decide.
- Keep Abraxos presence spectral and graph-dissolved per `abraxos/ABRAXOS.md`.
- Test contrast for lavender text on void backgrounds (AA minimum).

**Don't**
- Side-stripe colored borders on cards, alerts, or list items.
- Gradient text (`background-clip: text`).
- Identical icon + heading + paragraph card grids repeated endlessly.
- Hero-metric template (big number, small label, gradient accent).
- Modal as first solution; prefer inline progressive disclosure.
- Decorative animation on layout properties or bounce/elastic easing.
- Mascot-style Abraxos or fantasy dragon rendering in product UI.
