# ABRAXOS Intelligence Phase 2 and 3 Report

> Implementação de intents/registries (Fase 2) e preservação de `navigation_action` no caminho composto (Fase 3 parcial).
> Data: 2026-06-10.

---

## 1. O que foi implementado

### Fase 2: intents e registries

| Item | Estado |
|------|--------|
| Small talk / help curto (`me ajuda?`, `pode me ajudar?`, `ajudas-me?`, EN) | Concluído |
| `entity_alias_registry.py` centralizado | Concluído |
| Entity lookup natural (`me mostra`, `onde fica`, `quero ver`, `abre`) | Concluído |
| `decision_rules.py` para 5 recomendações comuns | Concluído |
| Integração no planner + runtime (`decision_rule_recommendation`) | Concluído |
| Correção falso positivo `catalog` em "lista longa de opções" | Concluído |

### Fase 3 parcial: navigation_action no SSE composto

| Item | Estado |
|------|--------|
| `navigation_action` no evento `final` com `should_compose=True` | Concluído |
| `secondary_navigation_actions` no mesmo evento | Concluído |
| Ações derivadas de `component_selection` após RAG | Concluído |
| Fallback de composição com ações preservadas | Concluído |

---

## 2. O que não foi implementado (deliberado nesta etapa)

- Reindexação ChromaDB / rebranding corpus Aetheris → Velaris
- `Drawer` no catálogo (Modal vs Drawer continua sem segundo componente)
- Guidance determinística para `acessibilidade do Modal` e `quais estados do Button?` (ainda usa RAG+LLM, mas com botão no path composto)
- `ui_leak_guard` server-side
- `profile_switch_request` como intent separado
- Comparação determinística Modal vs Drawer

---

## 3. Arquivos alterados

| Arquivo | Alteração |
|---------|-----------|
| `agent/entity_alias_registry.py` | **Novo** registry canônico de aliases |
| `agent/decision_rules.py` | **Novo** módulo de regras determinísticas |
| `agent/understanding.py` | Small talk, entity lookup, ordem de intents, catalog fix |
| `agent/entity_resolution.py` | Usa `COMPONENT_ALIASES` do registry |
| `agent/models.py` | Workflow `decision_rule_recommendation` |
| `agent/planner.py` | Roteamento para decision rules |
| `agent/runtime.py` | Handler determinístico + `_attach_selection_navigation` |
| `agent/operational_responses.py` | Copy de help curto com perspectiva |
| `server.py` | SSE `final` composto inclui navigation payload |
| `scripts/audit_intelligence_matrix.py` | Casos novos e regras de pass |
| `tests/agent/test_decision_rules.py` | **Novo** |
| `tests/agent/test_operational_orchestration.py` | Expectativas de copy |
| `tests/agent/test_sse.py` | Teste composto com `navigation_action` + decision rule |

---

## 4. Como decision_rules funciona

1. `analyze_query` classifica `component_recommendation`
2. `build_agent_plan` chama `resolve_decision_rule(query)` antes de `component_decision`
3. Se houver match com confiança alta, workflow = `decision_rule_recommendation`
4. `runtime.prepare` responde de forma determinística com `decision_rule_response()` e anexa:
   - `navigation_action` para o componente recomendado
   - `secondary_navigation_actions` para alternativas
5. RAG não é chamado nesse workflow
6. `single_choice_recommendation` continua com prioridade para escolha única condicional

Regras ativas:

| Caso | Componente | rule_id |
|------|------------|---------|
| Escolher várias opções | Checkbox | `multiple_choice` |
| Ação destrutiva | Modal/Dialog | `destructive_action` |
| Feedback de sucesso | Toast/Notification | `success_feedback` |
| Erro em campo | Form Field | `field_error` |
| Lista longa de opções | Select/Dropdown | `long_option_list` |

---

## 5. Como entity_alias_registry funciona

- Fonte: `data/component-metadata.json` + `COMPONENT_ALIASES` por `component_id`
- Cada entrada expõe: `component_id`, `name`, `aliases`, `route`, `target_type`, `status`
- `entity_resolution.resolve_exact_entity_matches` usa aliases ordenados por comprimento (exact vence fuzzy)
- `understanding._components` consome o mesmo mapa
- Aliases compostos (`radio button`) têm prioridade sobre tokens curtos (`radio`, `button`) via word-boundary e ordenação por tamanho

---

## 6. Como action payload foi preservado no SSE composto

### Antes

`server.py` enviava `navigation_action` apenas no branch `should_compose=False` (L1446-1449). O evento `final` do Groq (L1601+) omitia ações.

### Depois

1. `runtime._attach_selection_navigation()` define ações após `build_component_selection` em `component_decision`
2. `server.py` inclui `serialize_navigation_payload(...)` no `final` do path composto
3. `_composition_failure_events` também serializa ações quando há fallback determinístico

Frontend (`useChatStream`, `ChatNavigationActions`) não precisou de alteração: já consumia `navigation_action` do SSE.

---

## 7. Antes / depois dos casos críticos

| Input | Antes | Depois |
|-------|-------|--------|
| `me ajuda?` | out_of_scope | small_talk, sem RAG |
| `me mostra Modal` | component_recommendation + RAG | entity_lookup + botão |
| `onde fica Checkbox?` | component_recommendation + RAG | entity_lookup + botão |
| `qual componente uso para escolher várias opções?` | component_decision + RAG | decision_rule + Checkbox + botão |
| `qual componente uso para ação destrutiva?` | component_decision + RAG | decision_rule + Modal + botão |
| `qual componente uso para feedback de sucesso?` | component_decision + RAG | decision_rule + Toast + botão |
| `qual componente uso para erro em campo?` | component_decision + RAG | decision_rule + Form Field + botão |
| `qual componente uso para lista longa de opções?` | catalog (bug) | decision_rule + Select + botão |
| Recomendação via Groq | sem botão no final | `navigation_action` no SSE final |

---

## 8. Resultado atualizado da matriz

Comando:

```bash
python3 scripts/audit_intelligence_matrix.py
```

| Métrica | Antes | Depois |
|---------|-------|--------|
| Total casos | 56 | 61 |
| Pass | 45 (80%) | **60 (98.4%)** |
| Fail | 11 | **1** |

Único fail remanescente:

- `Modal ou Drawer?` → Drawer ausente do catálogo; intent cai em `component_recommendation` em vez de `component_comparison`

Critério de aceite (≥ 52/56): **atingido**.

---

## 9. Testes executados

```bash
python3 -m unittest discover -s tests/agent -q
# Ran 154 tests in ~1.5s — OK

python3 scripts/audit_intelligence_matrix.py
# 60/61 pass
```

Novos testes:

- `tests/agent/test_decision_rules.py` (regras + entity lookup + small talk)
- `tests/agent/test_sse.py::test_decision_rule_stream_is_deterministic_with_navigation_action`
- `tests/agent/test_sse.py::test_successful_stream_emits_initial_deltas_and_final_decision` valida `navigation_action` no path composto

---

## 10. Gaps restantes

| Prioridade | Gap | Próximo passo |
|------------|-----|---------------|
| Média | Modal vs Drawer sem Drawer no catálogo | Adicionar componente ou pattern alias |
| Média | Guidance `acessibilidade do X` ainda via LLM | Branch `direct_entity_guidance` para a11y+componente |
| Baixa | `ui_leak_guard` só no frontend | Módulo server-side |
| Fase 5 | Corpus Aetheris no RAG | Reindexação Velaris |

---

## Critérios de aceite

| Critério | Status |
|----------|--------|
| Matriz ≥ 52/56 | ✅ 60/61 |
| `me ajuda?` não cai em out_of_scope | ✅ |
| `me mostra Modal` resolve entidade | ✅ |
| `onde fica Checkbox?` resolve entidade | ✅ |
| Recomendações comuns não dependem só do LLM | ✅ (5 casos + single choice) |
| Recommendation retorna action payload | ✅ |
| `navigation_action` no frontend com `should_compose=True` | ✅ |
| 145+ testes existentes passando | ✅ 154 OK |
| RAG preservado | ✅ |
| ChromaDB não reindexado | ✅ |
| Identidade visual inalterada | ✅ |

---

*Fim do relatório.*
