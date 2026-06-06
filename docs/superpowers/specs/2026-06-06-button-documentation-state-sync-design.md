# Button Documentation State Synchronization

## Context

The Button documentation in `ComponentsPage.tsx` currently presents states,
intents, a preview, and a code snippet as separate static surfaces:

- state and intent labels are non-interactive `span` elements;
- `InteractivePreview` owns unrelated local state and does not receive the
  documented state or intent;
- the snippet is stored as static catalog text;
- copying code always copies the static catalog snippet;
- Button usage guidance is too broad to serve as implementation documentation.

The visual token taxonomy is already documented. This change connects the
Button workbench behavior to those existing semantic contracts without changing
the architecture of the other 24 component entries.

## Scope

This implementation specializes the existing workbench for the Button entry.
It does not introduce a generic schema system for every documented component,
nor does it add a full JSX parser.

## State Model

The Button documentation uses these canonical types:

```ts
type ButtonIntent = "primary" | "secondary" | "destructive";
type ButtonState = "default" | "hover" | "focus" | "loading" | "disabled";

interface ButtonConfig {
  intent: ButtonIntent;
  state: ButtonState;
  label: string;
}
```

`ComponentsPage` owns the valid Button configuration so controls, preview, and
snippet share one source of truth.

The initial configuration is:

```ts
{
  intent: "primary",
  state: "default",
  label: "Gerar análise",
}
```

## Data Flow

### Controls to preview and snippet

Selecting a state or intent:

1. updates the valid `ButtonConfig`;
2. regenerates the snippet draft;
3. updates the preview immediately;
4. clears any stale snippet parsing error.

### Snippet to controls and preview

Editing the snippet:

1. updates the visible draft immediately;
2. parses the draft using a restricted Button grammar;
3. updates the valid `ButtonConfig` only when parsing succeeds;
4. synchronizes the state and intent controls;
5. preserves the last valid preview when parsing fails;
6. displays a concise inline error beneath the editor.

This prevents incomplete edits from making the preview disappear or flicker.

## Supported Snippet Contract

The editor accepts one Button element with:

- `intent="primary"`, `intent="secondary"`, or `intent="destructive"`;
- optional `loading={true}`;
- optional `disabled`;
- optional `autoFocus`;
- a non-empty plain-text accessible label between the tags.

Examples:

```tsx
<Button intent="secondary">
  Gerar análise
</Button>
```

```tsx
<Button intent="primary" loading={true}>
  Gerar análise
</Button>
```

```tsx
<Button intent="destructive" disabled>
  Excluir análise
</Button>
```

State precedence during parsing is:

1. `loading={true}`;
2. `disabled`;
3. `autoFocus`;
4. `default`.

Hover is a workbench-only visual simulation and is never serialized as a
production prop. Selecting Hover generates the normal Button snippet and keeps
the Hover control selected until the user edits the snippet. Since the snippet
has no production representation for hover, any valid snippet edit resolves
that state to Default unless another supported state prop is present.

Unsupported props, invalid intent values, expressions in the label, multiple
elements, or malformed JSX produce an inline validation error.

## Preview Behavior

The preview receives `ButtonConfig` and renders a real native `button`:

- Default: normal visual treatment.
- Hover: persistent workbench simulation of hover background and border.
- Focus: visible focus ring and `autoFocus`.
- Loading: visible loading indicator, `aria-busy="true"`, and click blocking.
- Disabled: native `disabled`, perceptible visual reduction, and click blocking.

Primary, Secondary, and Destructive each have distinct semantic styling.

The control height and minimum target are at least 44px. The accessible name is
always the configured label. Loading retains that name and adds a visible
loading indicator rather than replacing the label with an unnamed control.

The execution count remains available as lightweight feedback. It increments
only for enabled, non-loading activations.

## Token Mapping

The Button preview consumes the existing Aetheris theme and documented
contracts:

- Primary: `--aetheris-color-primary` / Tailwind `primary`;
- Secondary: semantic secondary and elevated dark surface treatment;
- Destructive: `--aetheris-color-error` / Tailwind `error`;
- Focus: `focus-ring` and `border-focus` visual values;
- Hover: `state-hover-bg` and intent-specific boundary emphasis;
- Disabled: `state-disabled-bg`, `state-disabled-text`, and
  `state-disabled-border`;
- Size: `control-height-md` and `target-size-min`, both 44px;
- Motion: `motion-fast`.

No global token values or project typography are changed.

## Workbench Controls

For Button only, state and intent labels become buttons with:

- `aria-pressed`;
- visible selected treatment;
- minimum 44px interactive target;
- keyboard operation through native button semantics;
- clear focus treatment.

The other component entries retain their existing static state and intent
documentation.

## Snippet Editor

The static `<pre>` becomes a controlled monospace `textarea` for Button only.
It retains the current dark code surface and copy action.

The editor includes:

- an accessible label;
- spellcheck disabled;
- multiline editing;
- inline `role="alert"` validation feedback;
- copy behavior that copies the visible draft, including a temporarily invalid
  draft if the user explicitly requests copying it.

Non-Button entries retain the existing read-only snippet presentation.

## Usage Guidance

The Button entry displays the following concrete guidance.

### Do

- Use Button for explicit actions such as save, confirm, submit, generate, or
  advance.
- Use only one primary action per visual region to preserve clear hierarchy.
- Use loading when an action starts an asynchronous operation.
- Use destructive only for critical actions such as deleting, permanently
  canceling, or removing data.
- Keep Button text short, direct, and action-oriented.

### Don't

- Do not use Button for simple text navigation; use Link when the action only
  changes destination.
- Do not place multiple competing primary Buttons in the same area.
- Do not use disabled without explaining why the action is unavailable.
- Do not use destructive for common or reversible actions.
- Do not manually override styles outside the design-system tokens.

These are rendered as scannable lists for Button. Other components preserve
their existing paragraph guidance.

## Error Handling

Parsing is synchronous and local. No runtime dependency or network request is
introduced.

On invalid input:

- the draft remains editable;
- an error identifies the unsupported or malformed portion;
- controls and preview remain at the last valid configuration;
- copying remains available.

## Files

Expected implementation files:

- `src/components/ComponentsPage.tsx`
- `scripts/test_button_documentation.py`

No global CSS or token configuration change is expected unless implementation
reveals that the existing utility classes cannot express the approved token
mapping.

## Validation

Automated and manual validation must confirm:

- every Button state control updates the preview;
- every Button intent control updates the preview;
- controls regenerate the snippet;
- valid snippet edits update controls and preview;
- invalid snippet edits show an error and retain the last valid preview;
- Hover is simulated without a production-only prop;
- Focus has a persistent visible ring;
- Loading and Disabled block activation;
- Loading exposes `aria-busy`;
- Disabled uses the native disabled attribute;
- the target is at least 44px;
- copy uses the visible snippet draft;
- the Button Do and Don't lists contain all approved rules;
- other component previews and snippets continue working;
- desktop and mobile layouts remain usable without horizontal page overflow;
- TypeScript and production build pass.

## Decisions

- The solution is Button-specific rather than a premature generic controls
  framework.
- The snippet is editable and bidirectional.
- Invalid drafts retain the last valid preview.
- Hover remains documentation-only.
- Focus serializes as `autoFocus`.
- No full JSX parser or new dependency is introduced.
