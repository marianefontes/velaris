# Specialized Perspective Response Contracts

Date: 2026-06-07
Status: Approved

## Goal

Make the Developer and Accessibility Specialist perspectives change the
substance and structure of Beatrice responses across chat, commands,
perspective trials and laboratory runs.

This is the first implementation batch of real perspective differentiation.
The architecture must allow later contracts for QA, Designer, Maintainer, Tech
Writer, Product Designer and Design System Manager.

## Architecture

Add a backend perspective-contract registry keyed by the stable profile IDs.
Each contract owns:

- a prompt layer loaded during final system-prompt composition;
- deterministic groups of observable response signals;
- a validator that reports missing groups as warnings;
- a stable contract ID and version for audit metadata.

The prompt builder injects the active contract after the generic response
template and cognitive profile. Command contracts remain active, but the
perspective contract controls the specialist criteria, vocabulary and
perspective-specific response structure.

The validator does not infer hidden reasoning or score correctness. It scans
the completed response for required observable signals and returns:

- `profile_contract_applied`;
- `profile_contract_id`;
- `required_signals_found`;
- `required_signals_missing`;
- `perspective_quality_score`;
- validation status;
- `profile_contract_warnings` records for missing groups.

`perspective_quality_score` is the ratio of required signal groups found to the
total required by the active contract. It measures observable contract
coverage, not factual correctness or answer confidence.

## Streaming And Persistence

The chat endpoint emits intent, sources and engine metadata before response
text. It accumulates the generated text and emits a final SSE event containing
`audit_metadata` and only the cognitive skills with observable application
before `[DONE]`.

Perspective trials consume the same endpoint and therefore receive the same
contract. The regular chat stores `audit_metadata` on the assistant message.
Laboratory generation validates the non-streamed answer and persists the audit
metadata with the run item.

Warnings are diagnostic metadata. They do not trigger a second model call, edit
the answer, fabricate content or expose a reasoning trace.

## Developer Contract

For implementation-oriented recommendations, the response order is:

1. Recomendacao tecnica
2. Contrato de componente sugerido
3. Fluxo de estado
4. Edge cases e cuidados tecnicos
5. Acessibilidade tecnica minima
6. Quando nao usar
7. Evidencias

The contract prioritizes implementation details, component API, async state,
integration, reuse and maintenance. For destructive actions it requires:

- the first click only opens the dialog;
- the destructive operation runs only from `onConfirm`;
- loading and duplicate-submit protection;
- success closes the dialog and updates local state or cached data;
- error keeps the dialog open with explicit feedback;
- cancellation behavior and focus return;
- network failure, denied permission, stale or already removed items, infinite
  loading, cancellation during the request, mobile behavior and dependencies;
- a standardized design-system component and centralized destructive variants;
- alternatives for low-impact reversible actions, bulk actions and typed
  confirmation reserved for critical cases.

Suggested props are examples only when supported by the question and evidence.
The answer must distinguish a proposed API from an official Aetheris API and
must never invent official props or components.

## Accessibility Specialist Contract

Every recommendation is reviewed through practical accessibility criteria:

- keyboard navigation;
- focus management, visible focus and focus return;
- semantic HTML and ARIA;
- screen readers and assistive technologies;
- contrast and non-color-dependent communication;
- loading, error, disabled and success states;
- error prevention and understandable text;
- mobile accessibility when relevant.

Interactive components require a short accessibility checklist.

Dialog recommendations additionally cover native dialog semantics or
`role="dialog"`, `aria-modal="true"`, `aria-labelledby`,
`aria-describedby`, focus trapping, Tab and Shift+Tab, focus return, Escape
behavior according to criticality, clear cancellation, explicit destructive
labels, non-color-dependent meaning and loading or error announcements.

Destructive actions also require explicit confirmation, described
consequences, cancellation, undo when reversible, and protection against
accidental execution or duplicate submission.

## Skills

Selected cognitive skills must materially affect at least one recommendation,
risk, guardrail, implementation detail or validation criterion. Merely naming
the skill does not satisfy the orchestration contract. Skills are not announced
inside the generated answer. The runtime filters selected skills after
generation and discloses only those with observable application signals.

## Evidence Contract

Sources remain supplied only by retrieval. The response may report evidence
similarity and evidence tier only from retrieved values. Evidence similarity is
not answer confidence and must never be labeled as such.

The response must state limitations when evidence is missing or does not define
an official component API. No source, component, prop, token or historical fact
may be invented.

## Tests

Add deterministic tests for:

- contract selection for `dev`, `a11y` and unsupported profiles;
- prompt injection in ordinary chat and command contexts;
- Developer validation groups: API or props, state flow, edge cases,
  integration or reuse and technical accessibility;
- Accessibility validation groups: focus, keyboard, semantics or ARIA,
  assistive technology, accessible states and error prevention;
- explicit evidence similarity, evidence tier and limitation signals;
- post-response skill filtering;
- a cross-perspective destructive-action comparison with a textual similarity
  threshold and distinct required structures;
- final SSE audit metadata behavior through isolated helpers;
- evidence tier serialization;
- the destructive-action eval expectations for both perspectives;
- removal of UI copy that calls retrieval similarity answer confidence;
- frontend build and existing Beatrice capability checks.

## Non-Goals

- No second model call or automatic answer rewrite.
- No hidden chain-of-thought or fabricated reasoning trace.
- No migration of profile IDs.
- No contracts for the remaining perspectives in this batch.
