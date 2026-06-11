# Oracle Engine | System Health

Command: `/health`

## Purpose

Surface a consolidated reliability diagnostic for the Velaris ecosystem and the Abraxos agent.

## Behavior

- Directs maintainers to **Evaluation → Health do Sistema** (`/evaluation?focus=health#health`).
- Explains what each Health dimension measures (RAG, catalog, attribution, perspectives, validation, unknown components, calibration, evidence gaps, governance, accessibility).
- Uses retrieved `system_health` and `oracle_command` chunks as evidence.
- States clearly when UI scores are **mock data** pending live Knowledge Health API integration.

## Limitations

- Does not execute live reliability gates unless backend APIs are wired.
- Not a substitute for `/knowledge-health` (admin) or `/api/health` (RAG corpus status).

## Output contract

1. Where Health lives in the product.
2. Overall purpose of the Health section.
3. Relevant metrics for the user's question.
4. Whether data is mock or live.
5. Suggested next step (`/knowledge-gap`, `/governance`, `/audit`) when gaps are cited.
