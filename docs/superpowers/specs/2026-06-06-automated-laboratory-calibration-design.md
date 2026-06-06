# Automated Laboratory Calibration

**Date:** 2026-06-06
**Status:** Approved for implementation planning

## Purpose

Extend the Beatrice offline laboratory with a controlled daily optimization
cycle. The system runs three scheduled evaluations every day, uses increasing
repetition counts, detects weak perspective behavior, tests small numeric
calibration changes, and may promote a validated calibration without editing
source code or prompt text. Completed laboratory results and accepted human
reviews feed the next proposal cycle.

The primary objective is to improve answer quality across Beatrice's distinct
perspectives while preserving factual correctness, source fidelity,
appropriate abstention, accessibility, and defensible cross-perspective
divergence.

This feature is not autonomous prompt rewriting. It is a bounded calibration
system with deterministic limits, persistent evidence, internal review, and
immediate rollback.

## Selected Approach

The selected approach is an in-process scheduler backed by SQLite and the
existing sequential `LaboratoryRunner`.

Two alternatives were rejected:

- An external cron calling protected HTTP endpoints would simplify timing but
  would split ownership across deployment configuration, credentials, and the
  application database.
- A free-form agent editing prompts would provide more expressive changes but
  would create an unacceptable regression, auditability, and rollback surface.

The in-process design keeps scheduling, idempotency, calibration versions,
recommendations, and execution evidence in one protected subsystem. It is
appropriate for the current single-instance Render deployment and can later be
replaced by an external worker without changing the stored contracts.

## Daily Schedule

Automation uses the configured laboratory timezone, defaulting to
`Europe/Lisbon`.

Fixed daily slots are:

| Slot | Local time | Version label | Repetitions |
|---|---:|---|---:|
| 1 | 00:00 | `candidate1-YYYY-MM-DD` | 1 |
| 2 | 08:00 | `candidate2-YYYY-MM-DD` | 2 |
| 3 | 16:00 | `candidate3-YYYY-MM-DD` | 3 |

The date in each label is calculated in the configured timezone. For example,
the runs on June 7, 2026 are:

- `candidate1-2026-06-07`
- `candidate2-2026-06-07`
- `candidate3-2026-06-07`

The schedule is fixed to local wall-clock time rather than relative to server
startup. This prevents drift after deploys and restarts.

Automation is controlled by:

- `LABORATORY_AUTOMATION_ENABLED`, default `false`;
- `LABORATORY_SCHEDULE_TIMEZONE`, default `Europe/Lisbon`;
- `LABORATORY_AUTOMATION_CASE_SET`, default `beatrice-core-v1`.

The deployed backend explicitly enables automation. Local development remains
disabled unless requested so that starting the server does not unexpectedly
consume model calls.

## Daily Evaluation Funnel

The three runs are stages of one daily evidence funnel.

### Candidate 1: control and diagnosis

`candidate1` evaluates the currently active server-side calibration with one
execution per case and perspective.

It establishes the day's control result and identifies:

- the weakest perspectives;
- cases with missing perspective signals;
- factual, source, abstention, or structural regressions;
- whether the previous automatic promotion remained healthy;
- eligible numeric parameters for the next bounded experiment.

Candidate 1 never promotes a new calibration.

### Candidate 2: bounded experiment

`candidate2` evaluates a proposed calibration with two executions per
combination.

The proposal:

- starts from the active calibration version;
- changes at most two perspectives in one daily cycle;
- changes at most one numeric field per affected perspective;
- uses a maximum step of `0.05`;
- remains within `0.15` of the source-code default;
- never changes identity, vocabulary, heuristics, textual structure,
  information hierarchy, trust style, prompt text, routing rules, retrieval
  rules, model, or dataset.

Candidate 2 measures whether the improvement survives repetition. It may be
rejected automatically but cannot become active.

### Candidate 3: validation

`candidate3` evaluates the exact same proposed calibration as candidate 2 with
three executions per combination.

Candidate 3 must not introduce a new parameter change. Its purpose is
confirmation, not further exploration.

If candidate 2 failed a hard guardrail, candidate 3 runs the active
configuration as a control and records that no promotion was attempted.

Only a completed candidate 3 can trigger automatic promotion.

## Request Volume

The initial case set has eight cases and the laboratory evaluates all seven
perspectives:

- candidate 1: `8 × 7 × 1 = 56` model calls;
- candidate 2: `8 × 7 × 2 = 112` model calls;
- candidate 3: `8 × 7 × 3 = 168` model calls;
- daily total: `336` model calls.

The UI shows the estimated daily volume and the actual call, latency, failure,
and token totals. Automation pauses when model credentials are unavailable or
the provider repeatedly returns rate-limit errors.

## Calibration Surface

The first automated release may change only these existing per-perspective
numeric fields:

- `technicality`;
- `risk_sensitivity`.

`depth` remains available for explicit user calibration but is not changed
automatically because it is categorical and has a larger response-shape impact.

The automatic calibration order is:

1. source-code perspective defaults;
2. active server-side automatic calibration;
3. explicit per-request user calibration.

An explicit user calibration always wins for that request. Automatic
calibration does not overwrite browser settings or remove user control.

Laboratory runs record the complete effective calibration and its version.
This makes every answer reproducible after later promotions.

## Proposal Selection

Proposal generation is deterministic. No language model chooses configuration
values.

The selector ranks perspectives using per-profile metrics from candidate 1,
the latest comparable completed runs, and accepted laboratory reviews, with
priority given to:

- perspective signal and perspective adherence;
- observed correctness;
- required-fact and forbidden-claim behavior;
- source coverage and retrieval precision;
- appropriate abstention;
- factual convergence for invariant cases;
- principled divergence for perspective-sensitive cases;
- repeat stability when repetitions are available.

The selector changes only one coordinate for a perspective at a time. It uses
the outcome of prior bounded experiments to choose `+0.05` or `-0.05`. When
there is no directional evidence, it alternates the direction and records the
experiment as exploratory.

At most the two lowest-scoring eligible perspectives are included in a daily
proposal. A perspective with an unresolved critical regression is not tuned;
it produces a review recommendation instead.

Only results with matching dataset and prompt fingerprints are compared
directly. Older results remain visible as history but do not silently influence
a proposal after the evaluation contract changes.

## Promotion Guardrails

Automatic promotion requires all of the following:

- candidate 2 and candidate 3 used the same calibration proposal;
- both runs completed without failed items;
- both runs improved the targeted perspective objective over candidate 1;
- candidate 3 improved the targeted objective by at least `0.02`;
- observed correctness did not decrease by more than `0.01`;
- required-fact coverage did not decrease;
- forbidden-claim avoidance did not decrease;
- source coverage did not decrease by more than `0.01`;
- abstention performance did not decrease;
- factual convergence did not decrease by more than `0.02`;
- principled divergence did not decrease by more than `0.02`;
- no individual perspective decreased by more than `0.03`;
- the improvement direction is consistent between candidates 2 and 3;
- the proposed values satisfy all step and cumulative drift limits.

A higher aggregate score cannot override a failed guardrail.

When all requirements pass, the candidate calibration becomes active and a
review record with status `applied_automatically` is created.

## Automatic Rollback

Every promotion stores the previous active calibration version.

The next candidate 1 acts as a post-promotion health check. The system rolls
back automatically when it detects:

- a hard factual, forbidden-claim, source, or abstention regression;
- a targeted perspective objective below its pre-promotion control;
- repeated provider or generation failures attributable to the promoted
  configuration;
- an invalid or unreadable calibration version.

Rollback is atomic: the active-version pointer returns to the previous version.
Historical runs and recommendations are never deleted.

An administrator can also select `Reverter` from the recommendation detail.

## Scheduling Safety

The scheduler creates at most one automatic run per date and slot. SQLite
enforces uniqueness for `(schedule_date, slot_index)`, preventing duplicates
after reloads or concurrent scheduler ticks.

Additional rules:

- missed slots are not backfilled automatically;
- a startup within a 15-minute slot grace period may claim that slot;
- if any laboratory run is queued or running, the automatic slot is skipped;
- skipped slots create an internal notification with the reason;
- the scheduler does not overlap runs;
- candidate 2 requires a completed candidate 1 from the same date;
- candidate 3 requires a completed candidate 2 or records a control-only run;
- a partial, failed, cancelled, or interrupted run cannot promote calibration;
- server shutdown cancels the scheduler task cleanly without deleting jobs.

Manual laboratory runs remain available. They do not participate in automatic
promotion unless explicitly associated with a calibration proposal in a future
release.

## Persistence

The laboratory database gains persistent entities for:

- schedule slot claims;
- immutable calibration versions;
- one active calibration pointer;
- daily calibration proposals;
- recommendation and review records;
- internal notifications and read state;
- promotion and rollback audit events.

Existing runs gain:

- origin: `manual` or `scheduled`;
- schedule date and slot;
- calibration version ID;
- calibration proposal ID;
- effective per-perspective calibration snapshot;
- control run ID where applicable.

The active calibration is stored as data, not written into Python or Markdown
files.

## Results Synchronization

Laboratory execution, recommendation, and Results-page data share the same
SQLite source of truth. The frontend does not maintain an independent aggregate
or copy recommendation state between routes.

The backend maintains a monotonic laboratory revision. The revision advances
transactionally when:

- a run is created, progresses, or is finalized;
- a human item review is saved;
- a recommendation is created or decided;
- a notification is created or read;
- a calibration is promoted or rolled back;
- automation is paused, resumed, or skips a slot.

The protected laboratory snapshot contains:

- the current revision and generation time;
- automation status and next slot;
- active and previous calibration versions;
- latest scheduled and manual runs;
- candidate 1, 2, and 3 state for the current day;
- baseline and comparable metric deltas;
- metrics by perspective and case category;
- promotion guardrail outcomes;
- regressions and rollbacks;
- pending human-review count;
- unread recommendation and notification counts;
- recent recommendation summaries.

Both `/laboratory` and the `Resultados do laboratório` section consume this
snapshot through the same typed service. They refetch:

- after every administrator mutation;
- while a run is queued or running;
- when the browser window regains focus;
- when a lightweight revision check reports a newer value.

The Results page is an analytical summary, while the Laboratory page remains
the operational detail surface. They must display the same latest run,
baseline, active calibration, regression state, and unread counts for a given
revision.

Historical laboratory results feed proposal generation only after run
finalization. Partial, failed, cancelled, interrupted, fingerprint-incompatible,
or manually excluded results remain inspectable but are not optimization
inputs.

## Recommendation Center

The Laboratory page gains a primary `Recomendações` view alongside execution
history.

The top navigation displays an unread badge such as `Laboratório · 3`. The
badge is hidden from study participants together with the Laboratory route.

Each recommendation contains:

- date, stage, run, and calibration version;
- status and unread state;
- affected perspectives;
- problem identified;
- proposed or applied numeric changes;
- before-and-after metrics;
- representative answer comparisons;
- evidence explaining the recommendation;
- guardrails passed or failed;
- risks and rollback availability;
- an explicit explanation of why the system promoted, rejected, skipped, or
  reverted the candidate.

Recommendation statuses are:

- `applied_automatically`;
- `awaiting_review`;
- `rejected_automatically`;
- `reverted`;
- `informational`.

Available actions depend on the record:

- `Marcar como lida`;
- `Reverter` for an active automatic calibration;
- `Rejeitar` for a pending human recommendation;
- `Aprovar para backlog` for a prompt or rule recommendation;
- `Retestar` by creating a new manual run.

`Aprovar para backlog` records the research decision only. It does not edit
prompt files or production code.

No email or external notification channel is added.

## Internal Notifications

Unread notifications are created for:

- scheduled run started, completed, partial, or failed;
- candidate rejected by a guardrail;
- candidate promoted;
- automatic or manual rollback;
- schedule skipped;
- automation paused by missing credentials or provider limits;
- a new human-review recommendation.

Reading a notification does not change the recommendation decision state.
Notifications are administrator-only and protected by `RESEARCH_ADMIN_KEY`.

## API Surface

Protected additions include:

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

The Laboratory page shows whether automation is enabled, paused, waiting,
running, or blocked, plus the next scheduled slot.

The existing `GET /api/laboratory/results` remains compatible and is expanded
from the same snapshot builder. It must not maintain a separate aggregation
path.

## UI Changes

The Laboratory page adds:

- an automation status strip with next execution and daily request estimate;
- `Execuções` and `Recomendações` views;
- unread counters;
- scheduled/manual origin indicators in run history;
- calibration-version and proposal metadata in run detail;
- before-and-after perspective metrics;
- guardrail checklists;
- recommendation rationale and rollback controls.

The existing manual run composer remains available and visually separate from
the automatic schedule.

The `Resultados do laboratório` section adds:

- current automation and active-calibration status;
- the three daily candidates and their progression;
- historical metric trends;
- perspective-by-perspective improvement or regression;
- latest promotion or rollback rationale;
- pending and unread review totals;
- a link to open the corresponding recommendation in the Laboratory.

The section updates during active runs and after recommendation decisions
without requiring a full-page reload.

## Error Handling

- Missing `GROQ_API_KEY` pauses automation and creates one deduplicated
  notification instead of producing three failed runs per day.
- Provider rate limits stop the current run safely and pause later slots until
  the configured cooldown expires.
- Invalid datasets prevent slot creation and generate an actionable
  notification.
- A failed proposal never changes the active calibration.
- A failed promotion transaction leaves the previous active version intact.
- An unreadable active version triggers rollback to the latest valid version.
- UI network failures do not affect scheduler execution.
- A stale frontend revision triggers a refetch and never overwrites newer
  laboratory state.
- Notification and recommendation failures do not permit promotion without a
  complete audit record.

## Security And Access

All automation controls, recommendations, notifications, calibration versions,
and run details remain protected by `RESEARCH_ADMIN_KEY`.

Study invite holders:

- do not see the Laboratory navigation item or badge;
- cannot open the Laboratory page;
- cannot read automation status, recommendations, or notifications;
- cannot influence server-side automatic calibration.

The scheduler does not require or expose the administrator key because it runs
inside the backend process.

## Observability

The backend logs structured events for slot claims, run creation, proposal
selection, guardrail decisions, promotion, pause, and rollback.

The health payload exposes only non-sensitive state:

- automation enabled or disabled;
- automation paused or operational;
- next scheduled execution;
- active calibration version identifier.

Calibration values and recommendation contents remain behind administrator
authentication.

## Testing

Automated tests cover:

- timezone-aware candidate labels and the three daily slots;
- candidate repetition counts of one, two, and three;
- idempotent schedule claims;
- no backfill outside the grace period;
- prerequisite handling between candidates;
- run-overlap prevention;
- deterministic bounded proposal generation;
- maximum step and cumulative drift limits;
- calibration precedence;
- exact reuse of candidate 2 calibration by candidate 3;
- every promotion guardrail;
- failed and partial runs never promoting;
- promotion and automatic rollback transactions;
- recommendation and notification persistence;
- one-source result snapshot and monotonic revision updates;
- identical summary values across Laboratory and Results consumers;
- finalized compatible results feeding the next proposal;
- partial or fingerprint-incompatible results being excluded from proposals;
- unread badge counts;
- participant exclusion from every new endpoint and UI surface;
- automation pause for missing credentials and provider limits;
- unchanged manual-run behavior.

Browser tests verify the recommendation center, unread badge, mark-as-read
behavior, rationale display, and rollback confirmation.

## Success Criteria

The feature is complete when:

- three idempotent scheduled slots are evaluated every enabled day;
- labels and repetitions match the requested candidate sequence;
- automatic changes are limited to approved numeric perspective calibrations;
- candidate 3 is the only stage allowed to promote;
- every promotion has comparative evidence and a reversible audit trail;
- regressions trigger rejection or rollback instead of silent degradation;
- administrators can read recommendations and their reasoning inside the
  Laboratory;
- Laboratory and Results stay synchronized from one persisted snapshot;
- completed compatible results and accepted reviews feed later proposals;
- internal unread notifications are visible without email;
- study participants have no visibility or access;
- no prompt, source-code, retrieval, or routing file is edited automatically.
