# Entity Validation Gate — Audit Report

Date: 2026-06-11

## Root Cause

The migration hallucination was **not** caused by a hardcoded Dialog fallback or a default `/migrate` component.

Investigation found three compounding causes:

1. **Permissive migration contract policy** (`agent/migration_advisor.py`, `prompts/intents/migrationAdvisor.md`)
   - Explicitly instructed the LLM: *"Do not refuse for insufficient corpus evidence"* and *"still providing the strategy"* when the legacy artifact was missing.
   - This allowed the model to invent Dialog APIs, React code, state flows and accessibility detail, then disclaim insufficient evidence at the end.

2. **No pre-composition entity gate**
   - `migration_advisor` workflow reached LLM composition even when no source artifact was validated.
   - Runtime only blocked `component_decision` via deterministic selection — not migration.

3. **False-positive `/migrate` arrow parsing**
   - `entity_validation_gate` initially treated Portuguese *"migração para este..."* as `/migrate source → target`, falsely validating the entire sentence as the source entity.
   - Fixed: arrow parsing only applies when `→` or `->` is present.

### Where Dialog was inferred

| Layer | Finding |
|-------|---------|
| Python resolver | **No** — `_resolve_target_component()` returned `None` for unspecified queries |
| Hardcoded default | **No** — no Dialog default in planner/runtime |
| Session memory reuse | **No** — no last-entity carry-over in migration path |
| LLM heuristic | **Yes** — prompted to produce a full plan anyway; modal/dialog is a common migration stereotype |
| Blueprint hints | Partial — page recommendation blueprints mention Modal/Dialog for checkout/settings (unrelated workflow) |
| Unsupported registry | Suggests Modal/Dialog as alternative for Drawer — only after explicit Drawer citation |

## Files Affected

| File | Change |
|------|--------|
| `agent/entity_validation_gate.py` | **New** — mandatory entity validation, clarification response, hint resolution |
| `agent/migration_advisor.py` | Contract policy rewritten; legacy label → catalog target mapping |
| `agent/runtime.py` | Pre-composition gate; `entity_validation` on execution context |
| `agent/evidence_integrity.py` | Block specific output when evidence absent + entity unknown |
| `prompts/intents/migrationAdvisor.md` | Prohibits invention without validated entity |
| `tests/agent/test_entity_validation_gate.py` | **New** — acceptance tests |
| `tests/agent/test_migration_advisor.py` | Updated generic migration expectations |

## Corrections Implemented

1. **`validate_entity_for_capability()`** — returns `validated | needs_clarification | not_required`
2. **Deterministic clarification** before retrieval/LLM when status is `needs_clarification`
3. **Confidence threshold** `>= 0.75` for validated entities
4. **Legacy label support** — `LegacyModal`, `OldButton`, `o LegacyModal` validate and map to catalog targets
5. **Deictic blocking** — `este componente legado`, `migrar isso`, `componente legado` without name → clarification
6. **Migration contract** — forbids specific recommendations when `entity_validation.status != validated`
7. **Evidence integrity** — blocks recommendation/code/API language without evidence and without named entity

## Protected Flows

| Capability | Workflow | Gate |
|------------|----------|------|
| Migration Advisor | `migration_advisor` | Yes |
| Compare Advisor | `compare_options`, `comparison_rule` | Yes |
| Direct entity guidance | `direct_entity_guidance` | Yes |
| Accessibility (component-scoped) | `accessibility_guidance` | Yes (when component implied) |
| `/migrate` command | `command_mode=migrate` | Yes (arrow syntax only) |

## Flows Still Vulnerable

| Flow | Risk | Mitigation path |
|------|------|-----------------|
| LLM ignores contract after validation | Low | Post-response `evidence_integrity` gate |
| `component_decision` use-case recommendations | Medium | Existing selection policy; not gated to preserve decision rules |
| `page_recommendation` | By design | Page-level composition without single artifact |
| Interface-wide modernization queries | Medium | May compose strategy; no specific component contract |
| Pending intent resume after clarification | Low | Already resumes with resolved entity |

## Tests Added

`tests/agent/test_entity_validation_gate.py`:

| Query | Expected |
|-------|----------|
| `gere um plano de migração` | clarification |
| `Gere um caminho de migração para este componente legado` | clarification |
| `migre este componente legado` | clarification |
| `como migrar isso?` | clarification |
| `como migrar o LegacyModal?` | validated → migration |
| `como migrar o OldButton?` | validated → migration |
| `Como migrar um botão legado?` | validated → Button target |

## Acceptance Criteria

All acceptance tests pass in `npm run test:agent` (306 tests).
