# Abraxos Final Strengthening Audit — 2026-06-11

Consolidated report for the pre-external-testing hardening round.
No architecture changes. No commits made.

---

## 1. Audit Report (problems, severity, fixes)

| # | Problem | Severity | Fix applied |
|---|---------|----------|-------------|
| 1 | No programmatic knowledge-state classification | High | `agent/knowledge_taxonomy.py` — 6-state taxonomy wired into `runtime.structured_context` |
| 2 | Migration LLM invented components when entity missing | Critical | `entity_validation_gate.py` (prior round) + contract/policy tightened |
| 3 | Duplicate component hint map diverged from alias registry | Medium | `entity_validation_gate` now uses `primary_exact_match()` from `entity_resolution` |
| 4 | Operating principles existed but not loaded in prompts | Medium | `prompts/system/operatingPrinciples.md` added to `SYSTEM_LAYERS` |
| 5 | Simple existence queries returned long answers | Low | `is_simple_existence_query()` + compact `entity_lookup_response()` |
| 6 | Button aliases incomplete for multilingual probes | Medium | Added `primary button`, `action button`, `componente botão`, ES/FR variants |
| 7 | Beatrice/Aetheris in active cognition docstrings | Low | `cognition/engines/registry.py`, `prompts/prompt_builder.py` updated |
| 8 | `/migrate` false-positive on "migração para este" | High | Arrow parsing restricted to `→` / `->` only (prior round) |
| 9 | `abraxos-operating-principles.md` not in concept registry | Low | `operating_principles` concept entry added |

### Not changed (intentional)

| Item | Reason |
|------|--------|
| `aetheris_insight` metadata field | Breaking schema change — Tier 3 |
| `aetheris-docs-dump.json` filename | Requires corpus regeneration — Tier 3 |
| `src/beatrice/` path references in RAG extractors | Frontend module path — out of scope |
| Legacy alias handling for Beatrice/Aetheris | Required for migration Q&A |

---

## 2. Coverage Report

**Script:** `scripts/audit_semantic_coverage.py`  
**Output:** `docs/_audits/SEMANTIC_COVERAGE_REPORT.json`

| Metric | Value |
|--------|-------|
| Components in catalog | 25 |
| Fully covered by probe phrases | 25 |
| With alias gaps | 0 |

### Aliases added this round

- `button`: `componente botão`, `primary button`, `action button`, `botón primario`, `bouton principal`

### Entity resolution order (verified)

```
1. Exact match     → entity_resolution.resolve_exact_entity_matches()
2. Alias match     → COMPONENT_ALIASES in entity_alias_registry
3. Catalog         → component_registry / unsupported_entities_registry
4. Vector search   → RAG retrieval (never overrides exact match via exact_match_supersedes_semantic)
5. Fallback        → clarification / gap response / out_of_scope
```

### Knowledge domains

| Domain | Resolution path |
|--------|-----------------|
| Components | `entity_resolution` + `COMPONENT_ALIASES` |
| Unsupported (Drawer, etc.) | `unsupported_entities_registry` |
| Tokens / patterns | `catalog_registries.resolve_typed_catalog_entities` |
| Concepts | `concept_registry` + `concept_map` |
| Perspectives | `perspective_registry` |

---

## 3. Robustness Report

| Scenario | Resistance | Mechanism |
|----------|------------|-----------|
| Unspecified migration artifact | Strong | `entity_validation_gate` → deterministic clarification |
| Deictic reference ("este componente") | Strong | Deictic markers → `needs_clarification` |
| Known gap (Drawer) | Strong | `unsupported_entities_registry` → `not_in_catalog` state |
| Adversarial name (DragonButton) | Medium | `unknown_entity_lookup` + evidence_integrity |
| Vector false positive | Strong | `exact_match_supersedes_semantic()` in evidence selection |
| Insufficient evidence + specific output | Medium | `evidence_integrity` blocks recommendation/code language |
| Simple lookup ("tem Button?") | Strong | Compact deterministic response |
| Multilingual (PT/EN/ES) | Medium | Aliases in registry; canonical names preserved |
| Out-of-scope queries | Strong | `out_of_scope` intent + consultant template |

### Identity consistency (active pipeline)

| Area | Status |
|------|--------|
| `prompts/system/*` | Abraxos / Velaris |
| `prompts/intents/*`, `responses/*` | Clean |
| `agent/concept_map` | Legacy names kept for migration Q&A |
| `rag/aetheris-docs-dump.*` | Legacy — regenerate after TSX rename (Tier 3) |
| `cognition/` docstrings | Updated to Abraxos/Velaris |

---

## 4. Future Recommendations (not implemented)

| Priority | Recommendation |
|----------|----------------|
| P1 | Extend entity gate to `component_decision` when recommendation markers appear without entity |
| P2 | Multilingual clarification/fallback strings for ES/FR/AR |
| P3 | Regenerate RAG corpus with Velaris naming (`aetheris_insight` → `velaris_insight`) |
| P4 | Index full `abraxos-operating-principles.md` as RAG chunks |
| P5 | Adversarial eval suite for hallucination resistance (automated nightly) |
| P6 | Interface-wide modernization queries — explicit strategy-only mode vs clarification |

---

## Files created or modified

### New
- `agent/knowledge_taxonomy.py`
- `prompts/system/operatingPrinciples.md`
- `scripts/audit_semantic_coverage.py`
- `tests/agent/test_knowledge_taxonomy.py`
- `docs/_audits/SEMANTIC_COVERAGE_REPORT.json`
- `docs/_audits/ABRAXOS_FINAL_STRENGTHENING_AUDIT.md` (this file)

### Modified
- `agent/entity_alias_registry.py`
- `agent/entity_validation_gate.py`
- `agent/operational_responses.py`
- `agent/runtime.py`
- `agent/concept_registry.py`
- `agent/migration_advisor.py`
- `prompts/prompt_builder.py`
- `cognition/engines/registry.py`

### Test status
`npm run test:agent` — all tests passing.
