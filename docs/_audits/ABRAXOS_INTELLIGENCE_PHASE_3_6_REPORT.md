# ABRAXOS Intelligence Phases 3 to 6 Report

> Conclusão do restante da Fase 3, Fases 4, 5 e 6 do plano de inteligência Abraxos.
> Data: 2026-06-10.

---

## 1. Resumo executivo

| Métrica | Antes (Fase 2/3 parcial) | Agora |
|---------|--------------------------|-------|
| Testes agent (`tests/agent`) | 154 OK | **179 OK** |
| Matriz de auditoria (`audit_intelligence_matrix.py`) | 60/61 | **61/61** |
| Matriz E2E (`test_intelligence_e2e.py`) | não validada | **22/22** |
| Chunks RAG indexados | 54 (legado) | **200** (Velaris) |
| Regras determinísticas | 5 recomendações | **10** (5 + 5 comparações) |

O pipeline agora cobre navegação, guidance, recomendações, comparações canônicas, entidades ausentes e perspectivas com `navigation_action` consistente no SSE, sem regressões nos testes.

---

## 2. Fase 3 (restante): ações unificadas e fallbacks

### Implementado

| Item | Estado |
|------|--------|
| `agent/action_builder.py` unificado | Concluído |
| Ações em `component_decision` após seleção RAG | Concluído |
| Ações em workflows compostos (`compare_options`, `token_lookup`, `pattern_guidance`, `accessibility_guidance`, `design_decision`, `documentation_help`) | Concluído |
| Ações em `direct_entity_guidance` / `entity_lookup` com seção `accessibility` ou `states` | Concluído |
| Ações em fallbacks de catálogo (`_catalog_selection_for_named`, `_recover_from_catalog`) | Concluído |
| `navigation_action` preservado em erros SSE (`server.py`) | Concluído |
| Guard `_should_defer_unknown_entity_intent` para não bloquear navegação/recomendação | Concluído |

### Arquivos principais

- `agent/action_builder.py`
- `agent/runtime.py` (`_apply_action_payload`, fallbacks de catálogo)
- `agent/unsupported_entity_detection.py` (defer de `unknown_entity_lookup`)
- `agent/understanding.py` (ordem de intents + defer)

---

## 3. Fase 4: decision rules e comparações determinísticas

### Recomendações (5 regras)

| rule_id | Caso |
|---------|------|
| `multiple_choice` | várias opções independentes |
| `destructive_action` | ação destrutiva / confirmação |
| `success_feedback` | feedback de sucesso |
| `field_error` | erro de campo |
| `long_option_list` | lista longa de opções |

### Comparações (5 regras)

| rule_id | Par |
|---------|-----|
| `button_vs_link` | Button vs Link |
| `radio_vs_select` | Radio Button vs Select |
| `checkbox_vs_switch` | Checkbox vs Switch |
| `modal_vs_drawer` | Modal/Dialog vs Drawer |
| `generic_component_comparison` | fallback estruturado |

### Integração

- Workflow `comparison_rule` no planner e runtime (sem RAG, sem LLM)
- Workflow `decision_rule_recommendation` para recomendações canônicas
- `single_choice_recommendation` preservado para escolha única mutuamente exclusiva
- Drawer mapeado via `PATTERN_ENTITY_ALIASES` em comparações

---

## 4. Fase 5: qualidade, health e corpus Velaris

### Implementado

| Item | Estado |
|------|--------|
| `agent/ui_leak_guard.py` (server-side) | Concluído |
| `dedupe_catalog_sections()` em `response_dedup.py` | Concluído |
| `orchestration_health_snapshot()` com `decision_rules` e `action_builder` | Concluído |
| Branding Velaris em `rag/extract_docs.py` e `rag/context_builder.py` | Concluído |
| Reindexação ChromaDB (`npm run index`) | Concluído (200 chunks) |
| `meta.product_name = Velaris` nos chunks | Concluído |

### Corpus pós-reindex

```
token: 103 | component: 22 | token_alias: 19 | oracle_command: 16
automatic_skill: 12 | pattern: 11 | accessibility: 8 | design_decision: 4
```

Chunks passam a usar prefixo `VELARIS` em vez de `AETHERIS`.

---

## 5. Fase 6: testes E2E e matriz expandida

### `scripts/test_intelligence_e2e.py` (22 casos)

| Categoria | Casos | Critério |
|-----------|-------|----------|
| Small talk / out of scope | 2 | intent + sem compose |
| Entity lookup | 2 | action |
| Guidance (`acessibilidade`, `estados`) | 2 | action + seção |
| Recomendações determinísticas | 2 | workflow `decision_rule_recommendation` |
| Comparações canônicas | 4 | workflow `comparison_rule` + action |
| Conceito Abraxos | 1 | `concept_query` |
| Navegação tokens | 1 | `navigation_query` + action |
| **8 perspectivas** | 8 | `perspective_lookup` + profile + action |

### `scripts/audit_intelligence_matrix.py`

- 61 casos, todos passando
- Comparações com `expect_action=True` onde aplicável

### Testes unitários

- `tests/agent/test_decision_rules.py` (recomendação + comparação)
- `tests/agent/test_ui_leak_guard.py`
- Atualizações em `test_planner_policies`, `test_understanding`, `test_sse` para `comparison_rule`

---

## 6. Correções de regressão

1. **`unknown_entity_lookup` agressivo**: queries de navegação (`onde acho tokens`), perspectiva (`quero ver acessibilidade`) e recomendação (`qual componente uso...`) eram capturadas antes dos branches nativos. Corrigido com `_should_defer_unknown_entity_intent`.
2. **Testes `compare_options` vs `comparison_rule`**: pares canônicos agora usam workflow determinístico; comparações genéricas (ex.: Tabs vs Accordion) continuam em `compare_options` com RAG.
3. **SSE smoke**: workflows determinísticos (`comparison_rule`, `decision_rule_recommendation`) não exigem `tools_used`.

---

## 7. Comandos de validação

```bash
# Testes agent
python3 -m unittest discover -s tests/agent

# Matriz E2E fases 3-6
python3 scripts/test_intelligence_e2e.py

# Matriz de auditoria completa
python3 scripts/audit_intelligence_matrix.py

# Health do pipeline
python3 -c "from agent.comprehension import orchestration_health_snapshot; import json; print(json.dumps(orchestration_health_snapshot(), indent=2))"
```

---

## 8. O que permanece fora de escopo (deliberado)

- Drawer como componente no catálogo (continua como entidade ausente; comparação via regra + Modal/Dialog)
- `profile_switch_request` como intent separado
- Playwright E2E no mini chat / chat completo (coberto por matriz runtime + SSE contract tests)
- Alteração de identidade visual Abraxos

---

## 9. Score final estimado

Com base na matriz de auditoria (61/61) e cobertura E2E (22/22):

**Score de inteligência operacional: 61/61 (100%)** na matriz de regressão automatizada.

Testes agent: **179/179 OK**.
