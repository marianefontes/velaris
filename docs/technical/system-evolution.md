# System Evolution — Aetheris Trajectory

> Exported from `SystemPage.tsx · EvolutionTimeline` — Phase IA nav refactor.
> Destination: TCC capítulo 5.1, narrativa de evolução do artefato.

---

## Phase 0 — Documentation surface

Static React+Tailwind catalog of components, patterns and tokens. No retrieval, no reasoning — pure visual reference.

**Tags:** React 18, Tailwind v3, static

---

## Phase 1 — Beatrice — RAG-native chat

FastAPI backend, ChromaDB persistent store, BAAI/bge-m3 multilingual embeddings, Groq llama-3.3-70b streaming. Source attribution as a first-class SSE event.

**Tags:** FastAPI, ChromaDB, BGE-M3, Groq, SSE

---

## Phase 2 — Modular prompt architecture

System prompts decomposed into stacked layers — core, identity, orchestration, retrieval policy, anti-patterns, response rules, intent prompt, response template, cognitive profile, dialogue, RAG context. Each piece independently auditable.

**Tags:** prompts/prompt_builder.py, modular

---

## Phase 3 — Slash commands · governance

`/enforce`, `/migrate`, `/history`, `/why`, `/tradeoff`, `/score` — operational commands that wrap the same retrieval pipeline with command-specific response contracts (markdown tables, structured fields).

**Tags:** governance commands

---

## Phase 4 — Catalog mode + cognitive orchestration

Auto-detected structural queries ("list the components") trigger a completeness-first response. Cognitive orchestration weights select reasoning strategy per query.

**Tags:** catalog mode, orchestration

---

## Phase 5 — Cognitive perspectives

Persona becomes Perspective — a cognitive lens with measurable instrumentation (depth, technicality, risk sensitivity, trust calibration style, information hierarchy). Retrieval gains per-lens vocabulary boost. User-tunable knobs flow to the backend.

**Tags:** /perspectives, perspective-aware retrieval

---

## Phase IA — Information architecture migration

Platform restructures from documentation surface into 7 cognitive surfaces — /oracle, /system, /principles, /reasoning, /perspectives, /dashboard, /developers — plus /evaluation. Each is a module inside a reasoning system, not a documentation page.

**Tags:** this release

---

## Phase IB — Navigation consolidation (current)

Platform consolidates to 6 final surfaces: Oracle, Reasoning, Perspectives, System, Developers, Evaluation. Intelligence → Reasoning (merge), Principles → System (merge), Dashboard → Oracle (redirect), Comparison → Evaluation/baseline (redirect). 9-item menu reduced to 6.

**Tags:** nav-refactor, aetheris-spec-implementacao.md
