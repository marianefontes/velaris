# Automated Laboratory Calibration Implementation Plan

## Goal

Implement the approved controlled calibration cycle defined in
`docs/superpowers/specs/2026-06-06-automated-laboratory-calibration-design.md`.

The delivery must:

- create three idempotent daily candidate runs at 00:00, 08:00, and 16:00 in
  `Europe/Lisbon`;
- use one, two, and three repetitions respectively;
- tune only bounded numeric perspective calibration;
- promote only a validated candidate 3;
- rollback measurable regressions;
- persist recommendations and internal notifications;
- keep Laboratory and Results synchronized from one protected snapshot;
- preserve participant exclusion and manual laboratory behavior.

## Implementation Principles

1. Keep SQLite as the single source of truth.
2. Keep the existing `LaboratoryRunner` sequential.
3. Inject time into scheduler decisions so timing tests are deterministic.
4. Store calibration as immutable versions and switch only an active pointer.
5. Never write prompt, cognition, routing, retrieval, or source-code files.
6. Apply calibration precedence in this order:
   source defaults, active automatic version, explicit request override.
7. Build recommendations from deterministic metrics and guardrail results.
8. Make every mutation advance one monotonic laboratory revision.
9. Deploy schema and APIs safely before enabling scheduled model traffic.

## Phase 1: Establish Test Baseline

### Files

- `scripts/test_laboratory.py`
- `scripts/test_laboratory_api.py`
- `scripts/test_laboratory_access_ui.py`

### Work

1. Run the current laboratory core and API suites before schema changes.
2. Record the current manual-run payload and result-summary contracts.
3. Confirm the test environment always sets
   `LABORATORY_AUTOMATION_ENABLED=false`.
4. Preserve the existing temporary-database pattern so automated tests never
   touch `data/aetheris-laboratory.sqlite3`.
5. Keep real Groq calls out of automated tests by injecting fake generation
   callbacks.

### Verification

```bash
python3 scripts/test_laboratory.py
python3 scripts/test_laboratory_api.py
```

## Phase 2: Versioned Persistence And Revisioning

### Files

- `laboratory/store.py`
- `scripts/test_laboratory.py`

### Schema changes

Add migration helpers that inspect `PRAGMA table_info` before issuing
`ALTER TABLE`. Existing local and Render databases must migrate in place.

Extend `laboratory_runs` with:

- `origin TEXT NOT NULL DEFAULT 'manual'`;
- `schedule_date TEXT`;
- `schedule_slot INTEGER`;
- `calibration_version_id TEXT`;
- `calibration_proposal_id TEXT`;
- `calibration_snapshot_json TEXT NOT NULL DEFAULT '{}'`;
- `control_run_id TEXT`;
- `prompt_tokens INTEGER`;
- `completion_tokens INTEGER`;

Create:

- `laboratory_state`
  - singleton revision;
  - automation pause state and reason;
  - active calibration version ID;
  - previous calibration version ID.
- `laboratory_schedule_slots`
  - local schedule date;
  - slot index;
  - intended execution time;
  - claim status;
  - run ID;
  - skip or failure reason;
  - unique `(schedule_date, slot_index)`.
- `laboratory_calibration_versions`
  - immutable calibration JSON;
  - parent version;
  - origin;
  - proposal ID;
  - creation and activation timestamps.
- `laboratory_calibration_proposals`
  - date;
  - base and proposed version IDs;
  - targeted perspectives and fields;
  - control, experiment, and validation run IDs;
  - status;
  - deterministic rationale and guardrail JSON.
- `laboratory_recommendations`
  - type, status, title, summary, rationale;
  - affected perspectives;
  - metric comparisons;
  - guardrails;
  - linked run, proposal, and calibration IDs;
  - unread state and decision metadata.
- `laboratory_notifications`
  - event type, title, body;
  - linked recommendation and run;
  - deduplication key;
  - read timestamp.
- `laboratory_audit_events`
  - promotion, rollback, pause, resume, skip, and decision events;
  - actor and structured metadata.

### Store behavior

1. Seed one immutable `source-defaults` calibration version on initialization.
2. Point the active-version state at the seed only when no pointer exists.
3. Add a transaction helper that increments `laboratory_state.revision`.
4. Increment the revision for every run, review, recommendation, notification,
   calibration, automation-state, and slot mutation.
5. Make notification insertion idempotent through `deduplication_key`.
6. Add transactional methods for:
   - slot claim and skip;
   - calibration version creation and activation;
   - atomic rollback;
   - proposal creation and status changes;
   - recommendation creation, read, and decision;
   - notification creation and read;
   - current revision and snapshot reads.
7. Preserve existing `create_run` callers by adding optional keyword-only
   metadata with manual defaults.
8. Include new fields in run serialization without changing existing names.

### Tests

Add coverage for:

- migration of a database containing only the current five tables;
- repeated `initialize()` calls;
- seed calibration idempotency;
- monotonic revision increments;
- duplicate schedule claim rejection;
- atomic promotion and rollback;
- recommendation and notification deduplication;
- unchanged manual-run creation.

## Phase 3: Calibration Domain

### Files

- `laboratory/calibration.py` new
- `prompts/cognitive_profiles.py`
- `prompts/prompt_builder.py`
- `server.py`
- `scripts/test_laboratory_automation.py` new

### Calibration representation

Use a JSON-compatible mapping:

```text
{
  "designer": {"technicality": 0.35, "risk_sensitivity": 0.55},
  "dev": {"technicality": 0.90, "risk_sensitivity": 0.65},
  ...
}
```

### Work

1. Derive source defaults directly from `COGNITIVE_PROFILES`.
2. Validate that calibration payloads:
   - contain known profiles only;
   - contain only `technicality` and `risk_sensitivity`;
   - contain numbers from zero to one;
   - stay within `0.15` of source defaults.
3. Implement active-profile lookup from the immutable active version.
4. Implement request calibration merge:
   - start with source profile defaults;
   - overlay active server calibration;
   - overlay sanitized explicit user fields;
   - preserve explicit user `depth`.
5. Update calibration provenance to distinguish:
   - `lens-default`;
   - `automatic-calibration`;
   - `user-calibrated`.
6. Pass the merged calibration to both runtime frame and cognitive profile
   prompt.
7. Include active calibration version ID in chat metadata for administrator
   observability without exposing calibration values.
8. Keep neutral/general responses unchanged.

### Tests

Verify:

- source-default extraction;
- rejection of unknown fields and profiles;
- `0.05` step and `0.15` drift enforcement;
- automatic calibration overriding source defaults;
- explicit request calibration overriding automatic values;
- explicit depth remaining user-controlled;
- prompt output showing the correct provenance.

## Phase 4: Per-Perspective Metrics And Optimization Inputs

### Files

- `laboratory/store.py`
- `laboratory/metrics.py`
- `laboratory/calibration.py`
- `laboratory/runner.py`
- `server.py`
- `scripts/test_laboratory.py`
- `scripts/test_laboratory_automation.py`

### Work

1. Add store queries that aggregate metric values by:
   - run;
   - perspective;
   - case;
   - category.
2. Treat accepted human-review metrics as higher-priority observations when a
   deterministic metric measures the same concern.
3. Restrict optimization inputs to finalized completed runs with matching:
   - case-set ID;
   - dataset fingerprint;
   - prompt fingerprint.
4. Exclude failed, partial, cancelled, interrupted, and explicitly ineligible
   runs.
5. Capture Groq `usage.prompt_tokens` and `usage.completion_tokens` from
   non-streaming laboratory responses.
6. Aggregate duration, error, and token totals into run and snapshot summaries.
7. Classify provider failures into:
   - missing credentials;
   - invalid credentials;
   - rate limit;
   - timeout;
   - provider error;
   - invalid response.
8. Preserve the original error text for inspection while exposing a stable
   machine-readable category.

### Tests

Verify:

- perspective aggregation;
- accepted human review precedence;
- fingerprint incompatibility exclusion;
- partial-run exclusion;
- token aggregation;
- provider-error classification;
- no change to existing deterministic metrics.

## Phase 5: Deterministic Proposal And Guardrail Engine

### Files

- `laboratory/calibration.py`
- `laboratory/store.py`
- `scripts/test_laboratory_automation.py`

### Proposal selection

1. Compute one objective score per perspective from available comparable
   metrics.
2. Keep factual, source, forbidden-claim, and abstention metrics as hard
   constraints rather than allowing them to be hidden by an average.
3. Rank eligible perspectives by weakest objective score.
4. Select at most two perspectives.
5. Change at most one coordinate per selected perspective.
6. Use a fixed `0.05` step.
7. Use prior experiment outcomes to choose direction.
8. Alternate direction deterministically when no prior directional evidence
   exists.
9. Persist the full rationale and metric evidence with the proposal.
10. Generate a review recommendation instead of tuning when a perspective has
    an unresolved critical regression.

### Guardrail evaluation

Implement a pure function that compares control, experiment, and validation:

- same proposal in candidates 2 and 3;
- both completed with zero failed items;
- targeted objective improves in both;
- candidate 3 improvement is at least `0.02`;
- correctness delta is at least `-0.01`;
- required-fact and forbidden-claim metrics do not decrease;
- source coverage delta is at least `-0.01`;
- abstention does not decrease;
- factual convergence delta is at least `-0.02`;
- principled divergence delta is at least `-0.02`;
- no perspective objective delta is below `-0.03`;
- experiment and validation improvements have the same direction;
- proposal satisfies step and drift limits.

Return every check with:

- pass/fail;
- observed value;
- threshold;
- human-readable rationale.

### Tests

Use table-driven scenarios for every guardrail, including:

- all checks pass;
- higher aggregate score with one hard failure;
- candidate 2 pass and candidate 3 regression;
- one affected perspective improving while another exceeds regression limit;
- invalid step and cumulative drift;
- missing comparable metric;
- failed item;
- mismatched proposal IDs.

## Phase 6: Scheduler And Daily Funnel

### Files

- `laboratory/automation.py` new
- `laboratory/runner.py`
- `laboratory/store.py`
- `server.py`
- `scripts/test_laboratory_automation.py`

### Scheduler model

Create a `LaboratoryAutomation` coordinator with injected:

- store;
- runner;
- prompt fingerprint callback;
- model ID;
- API-credential readiness callback;
- clock callback;
- timezone.

Use `zoneinfo.ZoneInfo`; do not add a scheduling dependency.

### Work

1. Define the three immutable slots:
   - slot 1 at 00:00, candidate 1, one repetition;
   - slot 2 at 08:00, candidate 2, two repetitions;
   - slot 3 at 16:00, candidate 3, three repetitions.
2. Calculate labels as `candidate{slot}-YYYY-MM-DD` in the configured timezone.
3. Poll on a short interval while the application is alive.
4. Claim only a slot inside its 15-minute grace period.
5. Never backfill an older slot.
6. Skip and notify when another laboratory run is queued or running.
7. Pause and deduplicate notification when `GROQ_API_KEY` is unavailable.
8. Candidate 1:
   - snapshot the active calibration;
   - create a scheduled control run;
   - run all seven perspectives.
9. After candidate 1 completion:
   - evaluate post-promotion health;
   - rollback if health checks fail;
   - create the day's deterministic proposal.
10. Candidate 2:
    - require completed candidate 1;
    - use the proposal calibration;
    - persist proposal and control linkage.
11. After candidate 2:
    - evaluate early hard guardrails;
    - mark proposal rejected when appropriate.
12. Candidate 3:
    - use the exact candidate 2 proposal when eligible;
    - otherwise run the active calibration as a validation control;
    - never generate a new adjustment.
13. After candidate 3:
    - evaluate all promotion guardrails;
    - atomically promote or reject;
    - create recommendation, notification, and audit event.
14. Catch provider rate limits:
    - safely finalize the current run;
    - pause future slots with reason and cooldown metadata;
    - create one deduplicated notification.
15. Add clean `start()` and `stop()` lifecycle methods.
16. Keep manual runs outside the promotion funnel.

### Runner integration

1. Add an optional asynchronous finalization callback to `LaboratoryRunner`.
2. Invoke it after persisted finalization.
3. Prevent callback failures from corrupting the finalized run.
4. Persist callback failure as an automation notification and audit event.
5. Keep the existing single-run lock.

### Tests

Use a fake clock and fake generator to verify:

- Lisbon timezone and date labels;
- daylight-saving transitions;
- exact repetition counts;
- grace period;
- no backfill;
- idempotent claims;
- run-overlap skip;
- candidate prerequisites;
- candidate 2 proposal reuse by candidate 3;
- rejected candidate 2 control behavior;
- promotion after candidate 3 only;
- automatic rollback on next candidate 1;
- pause/resume;
- rate-limit pause;
- scheduler shutdown.

## Phase 7: Unified Snapshot And Protected API

### Files

- `laboratory/store.py`
- `laboratory/automation.py`
- `server.py`
- `scripts/test_laboratory_api.py`
- `scripts/test_laboratory_automation.py`

### Snapshot

Implement one store-backed snapshot builder containing:

- revision and generated timestamp;
- automation state and next slot;
- active and previous calibration metadata;
- current day's candidate runs;
- latest scheduled and manual runs;
- baseline and regression deltas;
- run, token, latency, and failure totals;
- metrics by perspective and category;
- guardrail outcomes;
- pending human reviews;
- unread recommendations and notifications;
- recent recommendation summaries.

`results_summary()` becomes a compatibility projection of this snapshot. It
must not run an independent aggregation path.

### API work

Add protected endpoints:

- `GET /api/laboratory/snapshot`;
- `GET /api/laboratory/revision`;
- `GET /api/laboratory/automation/status`;
- `POST /api/laboratory/automation/pause`;
- `POST /api/laboratory/automation/resume`;
- `GET /api/laboratory/recommendations`;
- `GET /api/laboratory/recommendations/{id}`;
- `POST /api/laboratory/recommendations/{id}/read`;
- `POST /api/laboratory/recommendations/{id}/decision`;
- `POST /api/laboratory/calibrations/{id}/rollback`;
- `GET /api/laboratory/notifications`;
- `POST /api/laboratory/notifications/read`.

Add Pydantic payloads for:

- pause reason;
- recommendation decision;
- notification IDs;
- rollback confirmation.

### Existing endpoint behavior

1. Keep all endpoints protected by `X-Research-Key`.
2. Keep public `/api/study/results` free of laboratory data.
3. Expand `GET /api/laboratory/results` compatibly.
4. Return `409` for stale or invalid decisions.
5. Return the new revision after mutations.
6. Include non-sensitive automation state in `/api/health`.

### Tests

Verify:

- unauthorized access to every new endpoint;
- participant data remains separate;
- snapshot and compatibility results agree;
- revision increments after each API mutation;
- stale decision rejection;
- pause, resume, read, decision, and rollback behavior;
- no calibration values in public health.

## Phase 8: Server Lifecycle And Deployment Configuration

### Files

- `server.py`
- `render.yaml`
- `.env.local` documentation only through comments or sample guidance if an
  existing sample file is introduced later

### Work

1. Initialize automation after laboratory-store initialization.
2. Start the scheduler only when:
   - `LABORATORY_AUTOMATION_ENABLED=true`;
   - database initialization succeeded.
3. Stop the scheduler during FastAPI shutdown.
4. Keep local default disabled.
5. Configure Render backend:
   - `LABORATORY_DB_PATH=/var/data/aetheris-laboratory.sqlite3`;
   - `LABORATORY_AUTOMATION_ENABLED=true`;
   - `LABORATORY_SCHEDULE_TIMEZONE=Europe/Lisbon`;
   - `LABORATORY_AUTOMATION_CASE_SET=beatrice-core-v1`.
6. Continue using the persistent `/var/data` disk.
7. Do not create missed runs on the first deploy.
8. Ensure the updated Python backend is deployed before relying on any new
   frontend surface.

### Rollout order

1. Deploy schema and APIs with automation disabled.
2. Verify migration, snapshot, manual runs, and protected access.
3. Enable automation.
4. Confirm the next slot rather than forcing a historical slot.
5. Verify the first candidate 1 notification and result synchronization.

## Phase 9: Typed Frontend Data Layer

### Files

- `src/types/laboratory.ts`
- `src/services/laboratoryService.ts`
- `src/hooks/useLaboratorySnapshot.ts` new

### Work

1. Add types for:
   - automation state;
   - calibration metadata;
   - candidate state;
   - proposal and guardrail checks;
   - recommendation detail and summary;
   - notification;
   - unified snapshot;
   - run origin and schedule metadata.
2. Add service methods for every protected endpoint.
3. Make mutation methods return the resulting revision.
4. Add a small module-level invalidation event emitted after successful
   mutations.
5. Implement `useLaboratorySnapshot`:
   - fetch full snapshot when authenticated;
   - poll while a run is active;
   - check lightweight revision while idle;
   - refetch on newer revision;
   - refetch on window focus;
   - subscribe to local mutation invalidation;
   - abort requests on unmount;
   - never expose data to participant sessions.
6. Preserve current auth clearing on `401`.

### Tests

Where practical, test pure revision and stale-response handling without a
browser. Browser coverage is added in Phase 12.

## Phase 10: Laboratory Recommendation Center

### Files

- `src/components/LaboratoryPage.tsx`
- `src/components/laboratory/AutomationStatus.tsx` new
- `src/components/laboratory/LaboratoryTabs.tsx` new
- `src/components/laboratory/RecommendationsPanel.tsx` new
- `src/components/laboratory/RecommendationDetail.tsx` new
- `src/components/laboratory/GuardrailChecklist.tsx` new
- `src/components/laboratory/PerspectiveDeltaTable.tsx` new

### Work

1. Keep the authentication and participant redirect behavior unchanged.
2. Replace separate run-list loading with the unified snapshot hook.
3. Add the automation strip:
   - enabled, paused, running, or blocked;
   - next local slot;
   - active calibration version;
   - daily estimated calls;
   - pause/resume controls.
4. Add `Execuções` and `Recomendações` views.
5. Preserve the manual run composer in `Execuções`.
6. Mark scheduled and manual runs clearly.
7. Display candidate sequence, repetitions, proposal, and control linkage.
8. Show unread recommendation count.
9. In recommendation detail, render:
   - problem and affected perspectives;
   - exact numeric changes;
   - before/after metrics;
   - representative answer comparisons;
   - passed and failed guardrails;
   - promotion, rejection, skip, or rollback rationale;
   - risk and rollback state.
10. Add actions:
    - mark read;
    - reject;
    - approve for backlog;
    - retest through a manual run;
    - rollback with explicit confirmation.
11. Support deep links:
    `/laboratory?view=recommendations&recommendation={id}`.
12. Maintain keyboard navigation, focus visibility, status announcements, and
    readable loading/error states.

## Phase 11: Results And Top-Menu Synchronization

### Files

- `src/components/StudyResultsPage.tsx`
- `src/components/AppShell.tsx`
- `src/components/AppTopBar.tsx`
- `src/i18n/translations.ts`

### Results page

1. Use the unified snapshot hook for Laboratory Results.
2. Preserve the Study Results request and participant-only behavior.
3. Add:
   - automation and active-calibration status;
   - current day's three candidates;
   - latest promotion or rollback;
   - historical metric trend summaries;
   - perspective improvements and regressions;
   - pending and unread counts;
   - links to recommendation detail.
4. Keep summary values identical to the Laboratory page for one revision.
5. Refresh without full-page reload after mutations or completed runs.

### Top menu

1. Read only unread totals and revision when:
   - no participant session is active;
   - a research-admin key exists.
2. Render `Laboratório · N` while preserving all nine items on one centered
   desktop line.
3. Do not render a badge when the count is zero.
4. Hide the route and badge from invite participants.
5. Make the badge accessible through an expanded link label.

### Localization

Add Brazilian Portuguese, European Portuguese, and English copy for:

- automation states;
- candidates;
- recommendations and decisions;
- guardrail outcomes;
- notifications;
- rollback;
- synchronized Results summaries.

## Phase 12: Browser And Integration Verification

### Files

- `scripts/test_laboratory_access_ui.py`
- `scripts/test_laboratory_automation_ui.py` new
- `scripts/test_results_page.py`

### Browser scenarios

1. Admin sees automation status and recommendation tabs.
2. Unread recommendation count appears in the top menu.
3. Marking a recommendation read updates:
   - Laboratory;
   - top-menu badge;
   - Results summary.
4. Recommendation detail shows rationale, metrics, and guardrails.
5. Rollback requires confirmation and updates active version everywhere.
6. Results candidate status tracks queued, running, and completed states.
7. Window focus refreshes a newer revision.
8. Participant sessions:
   - do not see Laboratory or badge;
   - redirect away from `/laboratory`;
   - do not see Laboratory Results.
9. Nine admin navigation items remain one centered line at desktop width.

### Commands

```bash
python3 scripts/test_laboratory.py
python3 scripts/test_laboratory_automation.py
python3 scripts/test_laboratory_api.py
python3 scripts/test_beatrice_capabilities.py
python3 scripts/check_primary_navigation.py
npm run build
```

Run browser suites with local API and Vite servers:

```bash
RESEARCH_ADMIN_KEY=<configured-test-key> python3 scripts/test_laboratory_access_ui.py
RESEARCH_ADMIN_KEY=<configured-test-key> python3 scripts/test_laboratory_automation_ui.py
python3 scripts/test_results_page.py
```

The current worktree may contain unrelated TypeScript failures. If the full
build still fails outside the files touched by this feature, report those
failures separately and still run all targeted laboratory tests.

## Phase 13: Operational Acceptance

### Local acceptance

1. Start with automation disabled.
2. Authenticate as administrator.
3. Create a manual run and confirm no regression.
4. Inspect snapshot and revision consistency.
5. Exercise a fake-clock scheduled cycle in tests.
6. Confirm explicit user calibration overrides active automatic calibration.

### Render acceptance

1. Confirm `/api/health` is served by the updated FastAPI backend.
2. Confirm persistent study and laboratory database paths.
3. Authenticate with the Render `RESEARCH_ADMIN_KEY`.
4. Verify automation status and next Lisbon slot.
5. Confirm no backfilled run appears.
6. Observe the first scheduled candidate 1.
7. Confirm Laboratory, Results, and top-menu badge show the same revision.
8. Confirm candidate 2 uses a bounded proposal.
9. Confirm candidate 3 reuses it exactly.
10. Inspect the generated recommendation before relying on promotion.

## Completion Criteria

Implementation is complete only when:

- schema migration preserves existing runs and reviews;
- scheduler claims each daily slot at most once;
- labels and repetition counts match the approved sequence;
- candidate 2 and candidate 3 share the exact proposal;
- candidate 3 is the only promotion path;
- all hard guardrails are enforced independently of aggregate score;
- promotion and rollback are atomic and auditable;
- active calibration influences chat while explicit user calibration wins;
- compatible finalized results and accepted reviews feed later proposals;
- one snapshot keeps Laboratory, Results, and badges synchronized;
- recommendations explain what changed and why;
- participant access remains blocked;
- manual laboratory behavior remains intact;
- no autonomous file or prompt editing exists.
