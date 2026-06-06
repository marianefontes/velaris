# Manifesto i18n Design

## Goal

Localize every user-facing string in the Foundations Manifesto for `pt-BR`,
`pt-PT`, and `en-US`. The two Portuguese variants must use distinct, natural
editorial wording instead of sharing a generic translation.

## Scope

The localization covers:

- the Foundations hero title and description;
- the section navigation accessibility label;
- the five Manifesto cluster headings and descriptions;
- all 20 principle statements, explanations, and "resists" values;
- the "resists" label shown on each principle;
- the section loading label.

The English copy remains the semantic source and keeps its current meaning.
Layout, component structure, routing, and non-Manifesto content remain
unchanged.

## Architecture

Add the copy below `pages.foundations` in each locale within
`src/i18n/translations.ts`.

Keep the principle numbers and icon/component structure in
`src/components/FoundationsHubPage.tsx`. Replace embedded English strings with
translation keys resolved through the existing `t(key)` API. Since that API
returns strings rather than structured objects, the component will keep small
arrays of stable principle and cluster IDs and derive translated fields by key.

Suggested key hierarchy:

```text
pages.foundations.hero.*
pages.foundations.navigationLabel
pages.foundations.manifesto.resistsLabel
pages.foundations.manifesto.clusters.<cluster>.*
pages.foundations.manifesto.principles.<principle>.*
pages.foundations.loading
```

## Locale Direction

`pt-BR` uses Brazilian product-language conventions such as `usuário`,
`confiabilidade`, and natural Brazilian sentence construction.

`pt-PT` uses European Portuguese conventions such as `utilizador`,
`fiabilidade`, `recuar/reverter` where contextually natural, and European
sentence construction.

Technical terms already established by the product, including Aetheris, UX,
AI/IA, retrieval, pipeline, tokens, and design system, remain recognizable and
are translated only when that improves clarity without changing meaning.

## Verification

Run the TypeScript and Vite production build. Review the changed component for
remaining user-facing English literals in the Manifesto path and confirm that
all three locale trees contain the same required keys.
