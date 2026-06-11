# Aetheris — Manifesto & Design Principles

> Exported from `PrinciplesPage.tsx · Manifesto` — Phase IB nav refactor.
> Destination: Apêndice do TCC — princípios filosóficos e de design.
> Note: The manifesto section moves to System → manifesto tab. This file preserves
> the full principle text for academic reference.

---

## Core Principles — The system's law

Six load-bearing commitments. Every other principle answers to these.

### 01 — Explainability over opacity
Every recommendation must carry its source, its confidence and its boundary. A correct answer that cannot be traced is indistinguishable from a guess.
**Resists:** AI as oracle

### 02 — Context before recommendation
The system must ground itself in the question before answering it. Retrieval is not a backend optimization — it is the precondition for trust.
**Resists:** premature synthesis

### 03 — Trust must be calibrated, not asserted
Confidence is a measurable property of evidence, not a tone of voice. The system communicates uncertainty in the vocabulary the active perspective recognizes.
**Resists:** confident hallucination

### 04 — Reasoning must be a surface, not a backstage
Where the system reached its answer is as load-bearing as the answer itself. The pipeline is visible — intent, retrieval, ranking, synthesis, calibration.
**Resists:** black-box AI

### 05 — UX is cognitive support, not decoration
Components, hierarchy, density, motion — these are tools to reduce cognitive load. Every interface decision is a stance on attention.
**Resists:** ornamental design

### 06 — Documentation must become dialogue
Static reference fails when the question is contextual. The system must hold a conversation grounded in the same corpus a reader would otherwise read alone.
**Resists:** passive documentation

---

## Cognitive UX — How the interface thinks

### 07 — Adaptive explanation depth
The same evidence should be explained at different depths depending on what the asker can act on. Depth is a knob, not a default.
**Resists:** one-size verbosity

### 08 — Progressive disclosure as a cognitive contract
Show the load-bearing answer first; expose the audit, the alternatives, the calibration on demand. The user opts into complexity.
**Resists:** frontloaded complexity

### 09 — Hierarchy is reasoning made visible
Visual hierarchy is not aesthetic preference — it is an externalization of how the system ranks evidence. Conflicting hierarchies mean unresolved reasoning.
**Resists:** flat layouts that hide priority

### 10 — Decision support over decision substitution
The system explains, surfaces and ranks. The decision belongs to the human. Designs that remove the human from the loop violate this rule.
**Resists:** automation as endpoint

---

## Human-centered AI — The user as cognitive partner

### 11 — The user is a cognitive system, not a target audience
Perspectives are reasoning models, not demographic tags. The system adapts to how someone thinks, not to who they are demographically.
**Resists:** persona-as-marketing

### 12 — Reversibility is a feature of intelligence
Every learned weight, every calibration, every adaptation must be auditable and rollbackable. A system that cannot be unwound has stopped being safe.
**Resists:** irreversible learning

### 13 — Disagreement is signal
When the system disagrees with a request, that disagreement must be expressed — not suppressed. Anti-convergence is part of the contract.
**Resists:** sycophantic compliance

---

## Ethics & Transparency — The limits the system imposes on itself

### 14 — Confidence limits must be named
When the corpus does not support an answer, the system says so. Refusing to fabricate is a higher trust signal than producing a confident wrong one.
**Resists:** fabricated coverage

### 15 — Hallucination is a system failure, not a model quirk
Retrieval grounding, source attribution, vocabulary boosting — these are deliberate architectural responses, not after-the-fact patches.
**Resists:** treating hallucination as inevitable

### 16 — Source attribution is the user's right
Every claim in a response carries the chunk it came from. Removing source attribution to clean the UI removes the basis for trusting the answer.
**Resists:** polish over provenance

---

## Design Philosophy — The grammar of the surface

### 17 — AI-native, not AI-adjacent
The interface is a window into a reasoning pipeline, not a chat overlay on a docs site. Streaming, source chips, calibration knobs are first-class surfaces.
**Resists:** AI as a feature

### 18 — Operational calmness
Density without anxiety. Color used as semantic signal, not decoration. Motion reserved for state change, not delight.
**Resists:** interface theatrics

### 19 — Layered cognition
The page is built in surfaces stacked by epistemic role — retrieved, reasoned, recommended, audited. Each layer has its own grammar and its own visual contract.
**Resists:** flat documentation grids

### 20 — Strategic UX
Every component carries a stance on the user's attention, the system's load, and the organization's trajectory. There are no neutral patterns.
**Resists:** components-as-inventory
