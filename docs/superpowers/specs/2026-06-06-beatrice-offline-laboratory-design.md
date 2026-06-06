# Beatrice Offline Evaluation Laboratory

**Date:** 2026-06-06
**Status:** Approved for implementation planning

## Purpose

Add an administrator-only evaluation laboratory that runs reproducible Beatrice
benchmarks outside participant sessions. The laboratory must evaluate the whole
answer pipeline: retrieval, source fidelity, factual correctness, coverage,
perspective adherence, stability, convergence, principled divergence,
abstention, latency, failures, and confidence calibration.

The laboratory informs prompt and calibration changes. It must never update the
production Beatrice configuration automatically.

## Product Surfaces

### Primary navigation

Add `Laboratory` as the ninth primary route at `/laboratory`.

On desktop, all nine primary items remain centered on one line. Navigation uses
smaller type, tighter tracking, smaller horizontal padding, and equal-width
columns. Narrow viewports keep horizontal scrolling instead of compressing
labels beyond readability.

The Laboratory item is omitted whenever a valid study participant session is
active. Its visibility is only a convenience; authorization is enforced by the
backend.

### Laboratory page

The page has four working areas:

1. **Run benchmark:** choose a version label, case set, perspectives, and repeat
   count; review the estimated request count before starting.
2. **Run history:** show persisted runs, status, progress, timestamps, model,
   prompt fingerprint, and aggregate score.
3. **Metrics:** show factual correctness, source fidelity, retrieval precision,
   coverage, perspective adherence, stability, factual convergence, principled
   divergence, abstention, confidence calibration, latency, and error rate.
4. **Case inspection:** compare answers across perspectives and repetitions,
   inspect retrieved sources, automatic rubric findings, and human review.

The first release exposes exactly one curated case set while retaining a data
model that supports additional versioned sets.

### Results page

`/results` is divided into two top-level sections:

- **Study Results:** the current participant, profile, usage, and instrument
  results.
- **Laboratory Results:** aggregate benchmark history, latest run health,
  metric summaries, and regressions against the selected baseline.

Study participants only receive the Study Results section. Laboratory Results
are requested from protected endpoints and rendered only for an authenticated
administrator.

## Access Control

The laboratory reuses `RESEARCH_ADMIN_KEY`.

- The browser stores the entered key in `sessionStorage`, following the current
  `/research` administration flow.
- Every laboratory endpoint requires `X-Research-Key`.
- Invalid or missing credentials return `401`; missing server configuration
  returns `503`.
- A participant with an active valid study session cannot open the laboratory.
  The client redirects them to `/main`, and the backend remains inaccessible
  without the administrator key.
- Direct navigation to `/laboratory` first renders an authentication gate when
  no participant session is active and no valid administrator credential has
  been verified.
- Laboratory result data is not included in the public `/api/study/results`
  payload.

## Evaluation Dataset

Cases live in a versioned repository file, initially
`evals/cases/beatrice-core-v1.jsonl`.

Each case contains:

- stable case ID and dataset version;
- localized question and category;
- expected retrieval intent;
- expected source identifiers or semantic areas;
- required facts;
- forbidden claims;
- expected abstention behavior;
- whether perspectives should converge or may diverge;
- per-perspective expected priorities, vocabulary, risks, and decision criteria;
- rubric weights and optional human notes.

The initial set covers:

- factual lookup;
- component and pattern selection;
- design decisions with legitimate trade-offs;
- ambiguous questions;
- contradictory evidence;
- missing-corpus or out-of-scope questions;
- accessibility, implementation, governance, and XAI scenarios.

Facts remain invariant across perspectives. Perspective expectations describe
priority, framing, criteria, and defensible recommendation differences, not
permission to alter evidence.

## Execution Model

Runs are persistent jobs. A run expands into:

`selected cases × selected perspectives × repetitions`

The API creates the run immediately and processes it in a background worker.
Each generated answer is persisted as soon as it completes, so refreshes or
browser closure do not discard progress.

The runner records:

- case, perspective, calibration, and repetition;
- answer text and status;
- retrieved chunks and source metadata;
- routing intent and cognitive skills;
- evidence metrics;
- model identifier and generation parameters;
- prompt and dataset fingerprints;
- start time, duration, and error details.

Only one in-process worker claims a run at a time. Interrupted `running` runs
are marked `interrupted` on server startup and can be retried as a new run.
Cancellation stops scheduling new items while preserving completed results.

The first implementation uses the existing application process and SQLite. It
does not require an external queue.

## Storage

Laboratory data uses a dedicated SQLite file by default,
`data/aetheris-laboratory.sqlite3`, configurable through
`LABORATORY_DB_PATH`.

Core tables:

- `laboratory_runs`
- `laboratory_run_items`
- `laboratory_item_sources`
- `laboratory_metric_scores`
- `laboratory_human_reviews`

Study participant records remain in the research database. The separation
prevents laboratory traffic from contaminating participant analytics.

## Metric Model

Metrics are stored independently instead of collapsed into one opaque
confidence percentage.

### Deterministic metrics

- retrieval precision against expected source areas;
- source coverage;
- citation/source presence;
- required-fact and forbidden-claim checks where exact rules exist;
- latency and error rate;
- within-perspective repeat stability;
- cross-perspective semantic similarity;
- factual convergence on invariant cases;
- response length and structural adherence.

### Rubric-assisted metrics

- factual correctness where lexical rules are insufficient;
- source-to-claim fidelity;
- answer completeness;
- perspective adherence;
- whether divergence is explained by the lens;
- appropriate abstention;
- usefulness and actionability.

Automatic rubric judgments must include a rationale and evaluator version.
They are provisional until accepted or corrected by a human reviewer.

### Confidence calibration

Retrieval evidence confidence remains a measure of evidence strength. It is not
renamed or treated as answer correctness.

Calibration compares a recorded confidence signal with observed correctness
from accepted evaluations. The laboratory reports Expected Calibration Error
only when enough reviewed samples exist; otherwise the metric is marked
`insufficient-data`.

### Aggregate score

The UI shows a weighted summary for scanning, while every constituent metric
remains visible. A candidate version cannot pass solely through a higher
aggregate score.

## Baselines And Promotion

A completed run may be designated as the baseline. A candidate report shows:

- absolute metric values;
- delta from baseline;
- improved cases;
- regressions;
- newly introduced errors;
- confidence calibration change;
- unresolved human reviews.

Promotion is a manual record, not a runtime configuration change. A candidate
is eligible only when:

- no critical factual or source-fidelity regression exists;
- minimum metric thresholds pass;
- required human reviews are complete;
- the administrator explicitly marks the run approved.

## API

Protected endpoints:

- `POST /api/laboratory/auth/verify`
- `GET /api/laboratory/case-sets`
- `POST /api/laboratory/runs`
- `GET /api/laboratory/runs`
- `GET /api/laboratory/runs/{run_id}`
- `POST /api/laboratory/runs/{run_id}/cancel`
- `POST /api/laboratory/runs/{run_id}/baseline`
- `POST /api/laboratory/items/{item_id}/review`
- `GET /api/laboratory/results`

Run creation validates dataset IDs, profile IDs, repeat limits, and a maximum
request count. The server rejects oversized runs rather than silently
truncating them.

## Error Handling

- Missing model credentials fail the run with a visible configuration error.
- Individual generation failures mark only that item failed; the run continues.
- Invalid datasets prevent run creation and name the invalid case.
- Metric failures are stored separately from answer failures.
- Partial and cancelled runs remain inspectable but cannot become baselines.
- The UI polls persisted status and tolerates temporary network loss.

## Initial Delivery

The first implementation is a functional vertical slice:

- protected route and authentication gate;
- participant-aware navigation and route guard;
- centered nine-item desktop navigation;
- versioned core dataset;
- SQLite schema and persistent run lifecycle;
- asynchronous runner using the existing Beatrice pipeline;
- deterministic first-pass metrics;
- run history, progress, aggregate metrics, and case inspection;
- human review storage;
- Study Results and protected Laboratory Results sections;
- tests for authorization, participant exclusion, navigation, persistence,
  metric calculation, and results separation.

In the first release, rubric dimensions that cannot be scored deterministically
are marked `pending-review` and receive a human score in the case inspector.
They are excluded from aggregates until reviewed. The data contract supports
an automated evaluator later without changing stored run answers.

## Acceptance Criteria

1. A valid study participant never sees Laboratory in primary navigation.
2. A valid study participant navigating directly to `/laboratory` is redirected.
3. Laboratory APIs reject requests without a valid `RESEARCH_ADMIN_KEY`.
4. Desktop primary navigation shows all allowed items centered on one line.
5. An administrator can create a run and observe persisted progress.
6. Refreshing the page does not lose completed run items.
7. Results distinguish evidence confidence from observed correctness.
8. Factual cases reward convergence; decision cases allow only
   rubric-supported divergence.
9. Study and laboratory data are stored and returned separately.
10. `/results` exposes study results to participants and laboratory results only
    to authenticated administrators.
11. No run changes Beatrice's production prompts or calibration automatically.
