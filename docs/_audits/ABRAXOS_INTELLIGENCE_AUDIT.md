# ABRAXOS Intelligence Audit

> Auditoria técnica do pipeline de inteligência do Abraxos (Velaris design system oracle).
> Data: 2026-06-10. Escopo: diagnóstico e plano de melhoria. Nenhuma alteração de comportamento foi implementada nesta fase.

---

## 1. Resumo executivo

O Abraxos já possui uma **camada agente governada** madura o suficiente para não ser um chatbot genérico. O fluxo principal (`POST /api/chat`) passa por entendimento operacional, planejamento de workflow, execução determinística ou RAG+LLM, validação pós-geração e deduplicação.

**O que funciona bem hoje (≈80% da matriz obrigatória):**

- Saudações, navegação canônica, navegação semântica, perspectivas, conceitos internos e out_of_scope real
- 8 contratos de perspectiva carregam, entram no prompt e têm health endpoint com sha256
- ChromaDB ativo com 182 chunks, BGE-M3, fallback de catálogo quando RAG falha
- Ações navegáveis (`navigation_action`, `profile_action` via `set_profile`) no caminho determinístico
- 145 testes unitários do agent layer passando

**Lacunas críticas identificadas:**

1. **Recomendações e comparações caem em RAG+LLM** na maioria dos casos, sem `decision_rules` nem botão de componente na resposta composta
2. **`navigation_action` ausente no SSE final** quando `should_compose=True` (respostas via Groq)
3. **`me ajuda?` cai em out_of_scope** por lacuna de small talk / help curto
4. **Entity lookup frágil** para frases como `me mostra Modal` e `onde fica Checkbox?`
5. **Drawer ausente do catálogo**, impedindo comparação Modal vs Drawer
6. **Corpus RAG ainda Aetheris-branded** enquanto prompts mandam falar Velaris/Abraxos
7. **`decision_rules` e `entity_alias_registry` não existem** como módulos; lógica espalhada em heurísticas
8. **`ui_leak_guard` só no frontend**; flag no health do backend sem implementação server-side

**Recomendação:** implementar melhorias em 6 fases (ver seção 12), começando por intents/registries e ações navegáveis antes de expandir RAG.

---

## 2. Como o Abraxos funciona hoje

### Visão geral

O Abraxos combina três camadas:

| Camada | Papel |
|--------|-------|
| **Frontend** | Envia histórico + profile + contexto de superfície; renderiza stream SSE, markdown e botões de ação |
| **Agent layer** (`agent/`) | Governança: entende, planeja, executa tools, decide se compõe com LLM, valida, deduplica |
| **RAG + prompts** | Recuperação vetorial (ChromaDB), montagem de contexto, contratos de perspectiva, composição Groq |

O LLM **não escolhe tools**. Ele só compõe texto quando `runtime.prepare()` define `should_compose=True`.

### Mini chat vs chat completo

| Aspecto | Mini chat (`AbraxosMiniChat`) | Chat completo (`/oracle`) |
|---------|-------------------------------|---------------------------|
| Estado | `AbraxosAssistantProvider` | `WorkspaceProvider` |
| Session | `floating-{uuid}` | conversation ID persistido |
| `surface_context` | Sim (rota + contexto de página) | Não |
| Pipeline HTTP | Idêntico | Idêntico |
| Render de ações | `ChatNavigationActions compact` | `ChatNavigationActions` |

Ambos usam `useChatStream` → `submitChatRequest` → `POST /api/chat`.

### Perspectivas

8 contratos `.md` em `prompts/perspectives/` são injetados via `prompt_builder.py` como **prompt contract** (estratégia oficial: `hybrid_prompt_contract`). **Não são chunks RAG.** Health em `/api/knowledge/perspectives/health` confirma 8/8 carregados com sha256.

---

## 3. Mapa do pipeline atual

```
user input
  │
  ├─ [Frontend] sanitizeUserPrompt (UI leak guard parcial)
  │     useChatStream: optimistic UI, history, POST /api/chat
  │
  ├─ [server.py] POST /api/chat
  │     trim history → última mensagem do user
  │
  ├─ [prompts/intent_router.py] route_query()
  │     analyze_query() → QueryUnderstanding
  │     classify_intent() → retrieval_intent + top_k + catalog_mode
  │     normalize_profile_id(profile)
  │
  ├─ [cognition/] build_cognitive_orchestration()  (skills para audit UI, não escolhe tools)
  │
  ├─ [agent/runtime.py] AgentRuntime.prepare()
  │     │
  │     ├─ [agent/planner.py] build_agent_plan()
  │     │     intent → workflow + tool list
  │     │
  │     ├─ Caminho determinístico (should_compose=False)
  │     │     greeting, navigation, perspective, entity, concept, single_choice_recommendation, out_of_scope
  │     │     operational_responses.py → texto
  │     │     navigation_actions.py → navigation_action / profile_action
  │     │     response_dedup.py
  │     │
  │     └─ Caminho composto (should_compose=True)
  │           executor.execute_plan() → retrieval_tools → server.retrieve_chunks()
  │           evidence.py → scoring, component selection, evidence tier
  │           Groq stream (prompt_builder + perspective contracts)
  │           validate_response() (component_decision, token_lookup)
  │           finalize_success() + dedupe
  │
  ├─ [SSE] metadata → delta(s) → final
  │     navigation_action SOMENTE no branch determinístico (linhas 1446-1449 server.py)
  │
  └─ [Frontend] useChatStream parseEventStream
        ChatMessage / MiniChatMessage → MarkdownRenderer
        ChatNavigationActions (navigate | set_profile + React Router)
```

### Onde cada etapa ocorre

| Etapa | Arquivo | Função |
|-------|---------|--------|
| Recebe query (FE) | `useChatStream.ts` | `submitPrompt` |
| Envia HTTP | `chat.orchestrator.ts` | `submitChatRequest` |
| Recebe HTTP | `server.py` | `chat()` ~L1353 |
| `normalize_query` | `agent/understanding.py` | `normalize_query`, `normalize_text` |
| Intent classification | `agent/understanding.py` | `_intent`, `analyze_query` |
| Operational intent | `agent/understanding.py` | `operational_intent = user_intent` |
| Retrieval intent | `prompts/intent_router.py` | `classify_intent` |
| Entity resolution | `agent/entity_resolution.py` + `understanding._components` | `resolve_exact_entity_matches` |
| Route resolution | `agent/route_map.py` | `resolve_navigation_route` |
| Perspective resolution | `agent/perspective_registry.py` | `resolve_perspective_match` |
| Semantic navigation | `agent/semantic_navigation.py` | `resolve_semantic_navigation` |
| Concept resolution | `agent/concept_map.py` | `resolve_concept_key`, `concept_response` |
| Migration alias | `understanding._LEGACY_*`, `route_map` legacy paths | Hot path parcial |
| Migration registry (dados) | `agent/migration_alias_registry.py` | Health only; `resolve_*` sem callers |
| RAG / ChromaDB | `server.py` → `rag/retrieval.py` | `retrieve_chunks`, `retrieve_catalog_chunks` |
| Prompt building | `prompts/prompt_builder.py` | system + intent + perspective contracts |
| Perspective contracts | `prompts/perspective_contracts.py` + `perspectives/*.md` | injeção + validação pós-geração |
| Response validation | `agent/response_validation.py` | `validate_component_response`, `validate_token_response` |
| Dedupe | `agent/response_dedup.py` | `dedupe_response` |
| Navigation actions | `agent/navigation_actions.py` | `navigation_action_for_*` |
| `out_of_scope` | `understanding._intent` → `planner` → `runtime.prepare` | 3 gates em cascata |
| UI render ações | `ChatNavigationActions.tsx` | `handleAction` navigate / set_profile |

---

## 4. Arquivos analisados

### Agent layer

| Arquivo | Função atual | Ativo? | Conversa com | Riscos |
|---------|--------------|--------|--------------|--------|
| `agent/understanding.py` | Normalização, intents, entidades, idioma | **Sim, hot path** | planner, intent_router | Heurísticas longas; ordem de prioridade frágil; `me ajuda` fora do vocabulário |
| `agent/runtime.py` | Orquestrador principal; branches determinístico/RAG | **Sim** | server, executor, navigation_actions | Ações só no determinístico; debug logs podem vazar contexto interno |
| `agent/planner.py` | Intent → workflow + tools | **Sim** | runtime, policies | Fallback out_of_scope se nenhum workflow casa |
| `agent/executor.py` | Executa tools do registry | **Sim** | retrieval_tools | Falha de tool propaga para limitations |
| `agent/evidence.py` | Evidence tier, component selection, RuleScorer | **Sim** | runtime, validation | Sem `decision_rules` nomeado; scoring opaco para recomendações |
| `agent/entity_resolution.py` | Match exato word-boundary no catálogo | **Sim** | understanding, evidence | Drawer e aliases parciais ausentes |
| `agent/route_map.py` | 9 rotas canônicas Velaris + legacy redirects | **Sim** | semantic_navigation, runtime | Cobertura boa para seções principais |
| `agent/perspective_registry.py` | 8 perspectivas com aliases e rotas | **Sim** | semantic_navigation, navigation_actions | `profile_switch_request` não é intent separado |
| `agent/semantic_navigation.py` | NL location-seeking + fuzzy vocab (56 termos) | **Sim** | understanding | Boa cobertura PT/EN |
| `agent/concept_map.py` | Respostas determinísticas para conceitos internos | **Sim** | runtime | Tecelã mapeado; evidence tier coberto |
| `agent/concept_registry.py` | Wrapper metadata para health | Health/tests | comprehension | Não no hot path direto |
| `agent/migration_alias_registry.py` | Dados Aetheris→Velaris, Beatrice→Abraxos | **Parcial** | health | `resolve_product_alias()` sem callers em produção |
| `agent/operational_responses.py` | Copy determinístico (greeting, nav, entity…) | **Sim** | runtime | Tom consistente Velaris |
| `agent/navigation_actions.py` | Payload de botões navigate/set_profile | **Sim** | server SSE | Não anexado no path composto |
| `agent/response_validation.py` | Guardrails pós-LLM component/token | **Sim** | runtime | Só 2 workflows; resto `not_applicable` |
| `agent/response_dedup.py` | Dedup frases, bullets, parágrafos | **Sim** | runtime, operational_responses | Não cobre when_to_use repetido entre seções LLM |
| `agent/recommendation_policy.py` | Single-choice recommendation determinística | **Sim** | planner, runtime | Único caso de recomendação rule-based |
| `agent/models.py` | Contratos Pydantic (QueryUnderstanding, NavigationAction…) | **Sim** | Toda a camada | — |
| `agent/planner.py` | Workflow matrix | **Sim** | runtime | — |
| `agent/comprehension.py` | PIPELINE_STAGES documentado + health | Health/tests | server `/api/orchestration/health` | Não é driver runtime |
| `agent/policies.py` | Bloqueia tools em out_of_scope | **Sim** | executor | — |
| `agent/store.py` | SQLite runs/decisions | **Sim** | runtime | — |
| `agent/tools/*.py` | Wrappers RAG por domínio | **Sim** | executor | — |

### Prompts e RAG

| Arquivo | Função atual | Ativo? | Riscos |
|---------|--------------|--------|--------|
| `prompts/intent_router.py` | Bridge understanding → retrieval_intent | **Sim** | `INTENT_KEYWORDS` morto (nunca referenciado) |
| `prompts/perspective_contracts.py` | 8 contratos + validação sinais observáveis | **Sim** | Perspectiva ativa muda prompt; impacto real depende do LLM |
| `prompts/perspectives/*.md` | Contratos v1.2–v3.0 | **Sim** | Não indexados no RAG (correto) |
| `prompts/perspective_health.py` | Audit sha256, divergências registry | **Sim** | — |
| `prompts/perspective_ids.py` | Canonical 8 + aliases legacy | **Sim** | — |
| `prompts/system/responseRules.md` | Regras de resposta Velaris/Abraxos | **Sim** | Conflita com `context_builder.py` (Aetheris) |
| `prompts/prompt_builder.py` | Monta mensagens Groq | **Sim** | — |
| `rag/extract_docs.py` | TSX → chunks (`AETHERIS COMPONENT:`) | **Sim** | Branding legado no corpus |
| `rag/retrieval.py` | ChromaDB + INTENT_FILTER + profile boost | **Sim** | — |
| `rag/context_builder.py` | Bloco de evidência para LLM | **Sim** | Aberturas "O Aetheris possui…" |
| `rag/aetheris-docs-dump.json` | 182 chunks | **Sim** | `corpus_version` null no health |
| `scripts/build_search_index.py` | Gera `searchEntries.generated.ts` | **Sim** | Manual regen necessária |
| `src/search/searchEntries.generated.ts` | 182 entradas de busca FE | **Sim** | Pode divergir do catálogo |

### Frontend

| Arquivo | Função atual | Ativo? | Riscos |
|---------|--------------|--------|--------|
| `chat.orchestrator.ts` | HTTP/SSE + UI leak sanitize | **Sim** | Guard só no FE |
| `useChatStream.ts` | Stream, metadata, nav actions | **Sim** | Ações só se backend envia |
| `AbraxosMiniChat.tsx` | Floating chat + handoff | **Sim** | — |
| `ChatInput.tsx` | Composer full chat | **Sim** | — |
| `ChatNavigationActions.tsx` | Botões navigate/set_profile | **Sim** | A11y básica ok; testes existem |
| `ChatMessage.tsx` | Bubble + markdown + ações | **Sim** | — |
| `MarkdownRenderer.tsx` | Render markdown custom | **Sim** | — |

### Backend entry

| Arquivo | Função | Ativo? | Riscos |
|---------|--------|--------|--------|
| `server.py` | FastAPI, lifespan RAG, `/api/chat` SSE | **Sim** | Nav actions omitidas no final composto |
| `server.cjs` | Legado Node | **Obsoleto** | Não usar |

---

## 5. O que já está bom

### Normalização (`normalize_query` + `normalize_text`)

| Capacidade | Estado | Evidência |
|------------|--------|-----------|
| Casing | OK | lowercase em `normalize_text` |
| Acentos | OK | NFKD fold |
| Pontuação | OK | strip em smileys; collapse whitespace |
| Repetição de letras (greeting) | OK | `_collapse_repeated_greeting_word` |
| Emojis | OK | `_EMOJI_PATTERN` removido |
| Typos leves | Parcial | `radio buton`, `check box`; lista curta |
| PT-BR / PT-PT / EN | Parcial | `_language()` heurístico; sem locale formal |
| Aliases greeting | OK | oie→oi, oieee→oi, olá Abraxos strip |

### Intents operacionais

| Intent | Existe | Onde |
|--------|--------|------|
| greeting | Sim | `understanding._social_intent` |
| small_talk | Sim | `_SMALL_TALK_TERMS` |
| navigation_query | Sim | `_resolve_location_intent`, `route_map` |
| semantic_navigation_query | Sim | `semantic_navigation.py` |
| perspective_lookup | Sim | `perspective_registry` + semantic |
| profile_switch_request | **Parcial** | Absorvido por `perspective_lookup` ("mudar para designer") |
| entity_lookup | Sim | `_is_entity_lookup_query` |
| direct_entity_guidance | Sim | `_is_direct_entity_guidance` |
| concept_lookup | Sim | `concept_map.resolve_concept_key` |
| migration_alias_lookup | Parcial | Legacy terms em understanding; registry data only |
| recommendation_request | Sim | `component_recommendation` + `single_choice_recommendation` |
| comparison_request | Sim | `component_comparison` |
| audit_request | Sim | `component_recommendation` com audit signals |
| documentation_request | Sim | `general_design_system`, `help_request` |
| implementation_request | Sim | Via `component_recommendation` + implementation signals |
| accessibility_request | Sim | `accessibility_guidance` |
| test_request | Não explícito | — |
| out_of_scope | Sim | 3 gates |

### Registries

| Registry | Existe | Ativo runtime |
|----------|--------|---------------|
| route_map | Sim (`CANONICAL_ROUTES`) | Sim |
| perspective_registry | Sim (8) | Sim |
| concept_registry | Sim (wrapper) | Sim (via concept_map) |
| migration_alias_registry | Sim (dados) | Parcial (health; resolvers não chamados) |
| entity_alias_registry | **Não** | Aliases em `_COMPONENT_ALIASES` em understanding |
| decision_rules | **Não** | Lógica parcial em `recommendation_policy` + `evidence.RuleScorer` |

### RAG

| Item | Estado |
|------|--------|
| ChromaDB ativo | Sim, 182 chunks |
| Collection correta | Sim, cosine HNSW |
| Chunks atualizados | `last_indexed_at: 2026-06-10T14:36:08+00:00` |
| Metadados Velaris/Abraxos | Parcial: tokens `--velaris-*`; texto prefix `AETHERIS` |
| Corpus Aetheris/Beatrice | Sim, branding legado em dump e context_builder |
| Health endpoint | `/api/health`, `/api/knowledge/health` |
| Fallback RAG falha | Sim: catálogo canônico + respostas determinísticas (test_chat_recovery) |

### Perspectivas

| Item | Estado |
|------|--------|
| 8 contratos .md | Sim |
| 8 carregam | Sim (health healthy) |
| Entram no prompt | Sim (`hybrid_prompt_contract`) |
| Perspectiva ativa muda resposta | Sim (injeção + validação pós-geração) |
| Validation pós-geração | Sim (`validate_perspective_response`) |
| Health endpoint | `/api/knowledge/perspectives/health` |
| Hash/versionamento | sha256 por contrato; registry_version por perspectiva |

### Ações navegáveis

| Item | Estado |
|------|--------|
| navigation_action | Sim (determinístico) |
| profile_action (set_profile) | Sim via metadata.action_type |
| secondary_navigation_actions | Sim |
| Frontend renderiza botão | Sim (`ChatNavigationActions`) |
| Navega React Router | Sim |
| Troca profileId | Sim |
| Acessibilidade botões | Parcial: testes existem; compact mode no mini chat |

### Deduplicação

| Item | Estado |
|------|--------|
| Frases repetidas | Sim (`response_dedup`) |
| Bullets repetidos | Sim (line-level) |
| Parágrafos que repetem bullets | Parcial (paragraph subsumption) |
| when_to_use repetido | Não garantido em respostas LLM |
| when_not_to_use repetido | Não garantido em respostas LLM |

### UI leak guard

| Item | Estado |
|------|--------|
| Labels não entram em user prompt | Sim (`sanitizeUserPrompt`) |
| Placeholder leak | Sim (markers bloqueados) |
| Quick action label | Sim (mesmos markers) |
| "Pergunta para o Abraxos…" | Sim (FE only) |
| Backend guard | **Não** (flag health sem código) |

---

## 6. O que está parcialmente bom

1. **Recomendação inteligente:** apenas `single_choice_recommendation` é determinística com botão. Demais casos vão para `component_decision` + RAG + LLM sem ação.
2. **Comparação:** funciona quando 2 componentes são detectados (`Button ou Link` OK). Falha se segundo componente não está no catálogo (`Modal ou Drawer` só detecta Modal).
3. **Entity lookup:** funciona para `tem Button?` mas não para `me mostra X` ou `onde fica X?`.
4. **Migration aliases:** dados existem; resolvers do registry não estão no hot path.
5. **Naming Velaris:** responseRules e operational_responses usam Velaris; RAG context ainda diz Aetheris.
6. **Perspectiva ativa:** contrato injeta e valida, mas resposta final ainda depende muito do LLM para tom e estrutura.
7. **Testes:** 145 unitários + matriz 45/56; falta E2E com Groq real para workflows compostos.

---

## 7. O que está falhando

| # | Sintoma | Causa provável |
|---|---------|----------------|
| F1 | Recomendações sem botão na UI | `navigation_action` não serializado no SSE `final` do path composto (`server.py` L1601-1611) |
| F2 | `me ajuda?` → out_of_scope | `"me ajuda"` ausente de `_SMALL_TALK_TERMS` e `_HELP_REQUEST_TERMS` |
| F3 | `me mostra Modal` → component_recommendation | `"me mostra"` não está em `_ENTITY_LOOKUP_TERMS`; cai em has_component_reference |
| F4 | `onde fica Checkbox?` → component_recommendation | `"onde fica"` não qualifica entity_lookup; componente nomeado domina |
| F5 | `Modal ou Drawer?` → component_recommendation | Drawer ausente do catálogo; só 1 componente detectado |
| F6 | `lista longa de opções` → catalog | Termo dispara `catalog` intent antes de recommendation |
| F7 | Respostas LLM longas para perguntas simples | Falta response_builder com modo curto por intent |
| F8 | Termos internos com risco de OOS | Fallback final em `_intent` L701-703 se sem `_DOMAIN_TERMS` |

---

## 8. O que está faltando

| Item | Prioridade |
|------|------------|
| `decision_rules` registry (Button vs Link, Radio vs Select, etc.) | Alta |
| `entity_alias_registry` centralizado | Média |
| `response_builder` com templates por intent | Alta |
| `action_builder` no path composto | Crítica |
| `ui_leak_guard` server-side | Média |
| `language_detector` com locale PT-BR/PT-PT | Baixa |
| Reindexação corpus Velaris/Abraxos | Alta |
| `profile_switch_request` como intent explícito | Baixa |
| E2E com 8 perspectivas + Groq | Alta |
| Drawer (e aliases) no catálogo | Média |
| Test matrix automatizada permanente (`scripts/audit_intelligence_matrix.py`) | Média |

---

## 9. Matriz de testes com resultados

**Método:** `scripts/audit_intelligence_matrix.py` (runtime local com fixture RAG) + 145 testes `unittest` em `tests/agent/`.
**Backend live:** ChromaDB 182 chunks, RAG ativo, Groq configurado.
**Score:** 45/56 pass (80.4%).

### Greeting (6/6 pass)

| Input | normalized | intent | workflow | RAG | action | Resultado |
|-------|------------|--------|----------|-----|--------|-----------|
| oie | oi | greeting | greeting | não | não | pass |
| oiee | oi | greeting | greeting | não | não | pass |
| oi :) | oi | greeting | greeting | não | não | pass |
| olá, Abraxos | ola | greeting | greeting | não | não | pass |
| bom dia | bom dia | greeting | greeting | não | não | pass |
| hello | hello | greeting | greeting | não | não | pass |

### Small talk (3/4 pass)

| Input | intent | Resultado | Motivo falha |
|-------|--------|-----------|--------------|
| tudo bem? | small_talk | pass | — |
| estás online? | small_talk | pass | — |
| podes ajudar? | small_talk | pass | — |
| me ajuda? | **out_of_scope** | **fail** | Termo curto não cadastrado |

### Navigation (5/5 pass)

Todas resolvem `navigation_query` ou `semantic_navigation_query` com `navigation_action` para rota canônica (`/foundations?focus=tokens`, `/components`, etc.).

### Semantic navigation (5/5 pass)

Inclui perspectiva de design → designer, QA → qa, acessibilidade → a11y, governança → design_system_manager, documentação → tech_writer.

### Perspective (5/5 pass)

`mudar para designer`, `usar perspectiva de produto`, `visão de acessibilidade`, `parte de documentação`, `quero a perspectiva de QA` → `perspective_lookup` com `set_profile` ou navigate.

### Entity lookup (3/5 pass)

| Input | intent | action | Resultado |
|-------|--------|--------|-----------|
| tem Button? | entity_lookup | sim | pass |
| você tem Radio Button? | entity_lookup | sim | pass |
| existe Select? | entity_lookup | sim | pass |
| me mostra Modal | component_recommendation | não | **fail** |
| onde fica Checkbox? | component_recommendation | não | **fail** |

### Direct guidance (3/5 pass)

| Input | intent | action | Resultado |
|-------|--------|--------|-----------|
| quando usar Radio Button? | direct_entity_guidance | sim | pass |
| quando não usar Button? | direct_entity_guidance | sim | pass |
| como usar Select? | direct_entity_guidance | sim | pass |
| acessibilidade do Modal | component_recommendation | não | **fail** (vai para RAG) |
| quais estados do Button? | component_recommendation | não | **fail** (vai para RAG) |

### Recommendation (1/6 pass)

| Input | intent | workflow | action | Resultado |
|-------|--------|----------|--------|-----------|
| escolher apenas uma opção… | component_recommendation | single_choice_recommendation | sim (Radio Button) | **pass** |
| escolher várias opções | component_recommendation | component_decision | não | fail |
| ação destrutiva | component_recommendation | component_decision | não | fail |
| feedback de sucesso | component_recommendation | component_decision | não | fail |
| erro em campo | component_recommendation | component_decision | não | fail |
| lista longa de opções | **catalog** | component_decision | não | fail |

### Comparison (3/4 pass)

| Input | intent | Resultado |
|-------|--------|-----------|
| Button ou Link? | component_comparison | pass |
| Radio Button ou Select? | component_comparison | pass |
| Checkbox ou Switch? | component_comparison | pass |
| Modal ou Drawer? | component_recommendation | **fail** (Drawer não no catálogo) |

### Concept (8/8 pass)

Abraxos, Beatrice, Velaris, Aetheris, Tecelã, evidence tier, RAG, XAI → `concept_query` ou `legacy_name_query`, determinístico, sem RAG.

### Out of scope (3/3 pass)

Tempo, campeonato, receita → `out_of_scope`. Termos internos (oie, perspectiva design, Abraxos, Button) nunca caem em OOS (testado em `test_comprehension_pipeline`).

### Actions (casos com botão esperado)

| Input | action gerada | Resultado |
|-------|---------------|-----------|
| onde acho tokens? | sim → /foundations?focus=tokens | pass |
| perspectiva de design | sim (set_profile) | pass |
| tem Button? | sim → /components?component=button | pass |
| quando usar Radio Button? | sim | pass |
| recomendação single choice | sim (Radio Button) | pass |
| recomendações gerais (destrutiva, sucesso…) | não no path composto | fail |

---

## 10. Lacunas por prioridade

### A. Críticas

| ID | Sintoma | Causa | Arquivos | Impacto | Solução | Risco alteração | Teste |
|----|---------|-------|----------|---------|---------|-----------------|-------|
| A1 | Recomendações sem botão | Nav action omitida no SSE composto | `server.py`, `runtime.py` | UX quebrada; usuário não navega ao componente | Anexar `serialize_navigation_payload` no final composto; `action_builder` pós-selection | Médio | `test_sse.py`, matriz recommendation |
| A2 | Recomendações dependem de LLM | Sem `decision_rules` | `planner.py`, novo módulo | Resposta inconsistente, lenta, cara | Registry de regras + respostas determinísticas para top 10 casos | Médio | `test_component_intelligence.py` estender |
| A3 | `me ajuda?` → OOS | Vocabulário incompleto | `understanding.py` | Primeira interação frustrante | Adicionar `me ajuda`, `ajuda` a small_talk ou help | Baixo | `test_operational_orchestration.py` |

### B. Altas

| ID | Sintoma | Causa | Arquivos | Solução | Teste |
|----|---------|-------|----------|---------|-------|
| B1 | Entity lookup frágil | Termos `me mostra`, `onde fica` não mapeados | `understanding.py` | Expandir `_ENTITY_LOOKUP_TERMS`; priorizar lookup sobre recommendation quando intent é existência | matriz entity lookup |
| B2 | Guidance vai para RAG | `acessibilidade do X`, `estados do X` → component_recommendation | `understanding.py`, `runtime.py` | Branch `direct_entity_guidance` para a11y/states; resposta do catálogo | `test_comprehension_pipeline` |
| B3 | Modal vs Drawer falha | Drawer ausente | `component-metadata.json`, `understanding._COMPONENT_ALIASES` | Adicionar Drawer ou mapear para componente existente | matriz comparison |
| B4 | Corpus Aetheris no RAG | Migração incompleta | `extract_docs.py`, `context_builder.py` | Reindexar com prefix Velaris; alinhar responseRules | `npm run index`, health |
| B5 | Lista longa → catalog | Intent catalog preempts recommendation | `understanding.py`, `intent_router.py` | Reordenar: recommendation signals antes de catalog | matriz recommendation |

### C. Médias

| ID | Sintoma | Solução | Teste |
|----|---------|---------|-------|
| C1 | migration_alias_registry não no hot path | Chamar `resolve_product_alias` em understanding | test migration |
| C2 | INTENT_KEYWORDS morto | Remover ou usar | lint |
| C3 | ui_leak_guard só FE | Implementar strip server-side em runtime.finalize | test sanitize |
| C4 | Dedupe when_to_use em LLM | Estender dedup com campos de catálogo | test dedup |
| C5 | corpus_version null | Expor `meta.extractor_version` no health | health endpoint test |

### D. Baixas

| ID | Sintoma | Solução |
|----|---------|---------|
| D1 | profile_switch_request implícito | Intent explícito opcional |
| D2 | locale PT-PT vs PT-BR | language_detector com hint |
| D3 | Tom de respostas OOS | Refinar copy em operational_responses |
| D4 | Logs debug runtime | Reduzir em produção |

---

## 11. Avaliação out_of_scope

### Onde é definido hoje

1. **`understanding._intent()`** L621-624: listas explícitas (`_EXPLICIT_OUT_OF_SCOPE`, `_EXPLICIT_NONEXISTENT`)
2. **`understanding._intent()`** L701-703: fallback final se sem `_DOMAIN_TERMS` e sem semantic match
3. **`planner.build_agent_plan()`** L110-117: re-check explícito + workflow out_of_scope
4. **`runtime.prepare()`** L445-451: bloqueia tools e LLM

### Tentativas antes do fallback OOS (ordem em `_intent`)

1. greeting / small_talk
2. explicit OOS lists
3. legacy_name_query
4. concept_query
5. location_intent (navigation, semantic, perspective)
6. catalog
7. direct_entity_guidance
8. entity_lookup
9. component_recommendation (vários sinais)
10. accessibility_guidance
11. xai_explanation
12. component_comparison
13. pattern, token, design_decision
14. language_followup
15. help_request
16. semantic_navigation (segunda chance)
17. general_design_system
18. **out_of_scope fallback**

### O que falta antes do fallback

| Tentativa esperada | Estado |
|--------------------|--------|
| migration_alias (via registry) | Parcial (só termos hardcoded) |
| fuzzy interno | Parcial (só em semantic_navigation) |
| recommendation | Sim, mas tarde (após entity) |
| `me ajuda` como help/smalltalk | **Falta** |

### Termos internos caindo em OOS?

Na matriz e em `test_out_of_scope_acceptance`: **não** para oie, perspectiva, Abraxos, Button. **Sim** para `me ajuda?` (falso positivo).

### Registries que deveriam ser consultados antes?

- `migration_alias_registry.resolve_product_alias()` (não chamado)
- `concept_registry` (via concept_map, OK)
- `entity_resolution` antes do fallback (OK para termos com match)

**Conclusão:** out_of_scope **não está cedo demais** para o domínio geral, mas está **antes de help/smalltalk curto** para frases como `me ajuda?`. A regra esperada do utilizador é quase satisfeita; falta expandir vocabulário social e garantir migration_alias no hot path.

---

## 12. Avaliação dependência do RAG

### Perguntas que deveriam ser determinísticas (hoje vs ideal)

| Tipo | Ideal | Hoje |
|------|-------|------|
| Saudação | Determinístico | OK |
| Small talk / help curto | Determinístico | Parcial (`me ajuda` falha) |
| Navegação | route_map | OK |
| Perspectiva | perspective_registry | OK |
| Conceito interno | concept_registry | OK |
| Entity lookup | catálogo | Parcial |
| Guidance direta | catálogo | Parcial (alguns vão para RAG) |
| Single choice recommendation | decision_rules | OK |
| Outras recomendações | decision_rules + catálogo | **RAG+LLM** |
| Comparação | decision_rules + catálogo | Parcial (RAG quando compõe) |
| Auditoria | RAG + evidência + validação | OK |
| Documentação ampla | RAG + LLM | OK |

### Regra esperada vs realidade

O sistema está **mais dependente do RAG do que deveria** para recomendações e parte do guidance. O `NON_RAG_INTENTS` em `comprehension.py` documenta a intenção correta, mas `component_recommendation` não está na lista e domina falsos positivos.

**Perguntas que hoje chamam RAG desnecessariamente:**

- `me mostra Modal`, `onde fica Checkbox?`
- `acessibilidade do Modal`, `quais estados do Button?`
- Todas as recomendações exceto single choice
- `Modal ou Drawer?` (deveria ser comparação determinística)

---

## 13. Proposta de arquitetura melhorada

### Módulos alvo

```
normalize_query          → understanding.py (manter, expandir typos)
language_detector        → extrair de _language() + locale hint
operational_intent_detector → understanding._intent (refatorar em tabela)
route_map                → manter
perspective_registry     → manter
concept_registry         → manter + unificar com concept_map
migration_alias_registry → integrar resolve_* no hot path
entity_alias_registry    → CRIAR (migrar _COMPONENT_ALIASES)
decision_rules           → CRIAR (casos Button/Link, Radio/Select, etc.)
rag_retriever            → manter retrieval.py
evidence_policy          → manter evidence.py
response_builder         → CRIAR (templates por workflow)
action_builder           → extrair de navigation_actions + chamar sempre
response_validator       → manter + expandir workflows
response_deduper         → manter
ui_leak_guard            → CRIAR server-side + manter FE
health endpoints         → manter + adicionar decision_rules health
```

### O que manter

- Pipeline governado agent layer (planner não deixa LLM escolher tools)
- 8 perspective contracts como prompt injection (não RAG)
- ChromaDB + BGE-M3 para documentação ampla e auditoria
- `single_choice_recommendation` como modelo para outras regras
- Frontend `ChatNavigationActions` com set_profile

### O que refatorar

- `_intent()` em detector declarativo com prioridades testáveis
- `server.py` SSE final unificado (determinístico e composto)
- `context_builder.py` branding Velaris
- Unificar aliases de entidade

### O que criar

- `agent/decision_rules.py`
- `agent/entity_alias_registry.py`
- `agent/response_builder.py`
- `agent/ui_leak_guard.py`
- `scripts/audit_intelligence_matrix.py` como teste de regressão permanente

### O que remover/consolidar

- `INTENT_KEYWORDS` morto em intent_router.py
- Duplicação de alias data entre understanding e entity_resolution
- `server.cjs` (já deprecated)

### Ordem final do pipeline proposta

```
1.  normalize_query
2.  language_detector
3.  operational_intent_detector (greeting → smalltalk → explicit_oos)
4.  migration_alias_registry
5.  concept_registry
6.  route_map + semantic_navigation
7.  perspective_registry
8.  entity_alias_registry + entity_resolution
9.  decision_rules (recommendation, comparison)
10. decide_rag_needed
11. rag_retriever (se necessário)
12. evidence_policy
13. response_builder (determinístico ou contexto LLM)
14. LLM compose (se necessário)
15. response_validator
16. action_builder (sempre que houver rota/componente/profile)
17. response_deduper
18. ui_leak_guard
19. fallback out_of_scope (último recurso)
```

---

## 14. Plano de implementação por fases

### Fase 1: Diagnóstico e testes (esta entrega)

- [x] Mapear pipeline
- [x] Inventariar arquivos
- [x] Matriz de testes (`scripts/audit_intelligence_matrix.py`)
- [x] Relatório de lacunas (`ABRAXOS_INTELLIGENCE_AUDIT.md`)
- [ ] Integrar matriz em CI (`unittest` ou script dedicado)

### Fase 2: Intents e registries

- Expandir small_talk/help (`me ajuda`, `ajuda`)
- Expandir entity_lookup terms (`me mostra`, `onde fica` + componente)
- Integrar `migration_alias_registry.resolve_*`
- Criar `entity_alias_registry`
- Criar `decision_rules` para top 5 casos
- Corrigir prioridade catalog vs recommendation

### Fase 3: Ações navegáveis

- `action_builder` no SSE final composto
- Botões para guidance, entity lookup, recomendações rule-based
- Validar mini chat e chat completo

### Fase 4: Recomendação inteligente

- decision_rules: Radio vs Select, Button vs Link, Modal vs Drawer, Checkbox vs Switch
- Respostas curtas determinísticas + botão componente principal
- RAG opcional para nuance, não para decisão primária

### Fase 5: Limpeza e confiabilidade

- Dedupe when_to_use/when_not_to_use
- ui_leak_guard server-side
- Health: decision_rules, corpus_version
- Reindexação corpus Velaris/Abraxos (`extract_docs`, `context_builder`)

### Fase 6: Testes E2E

- 8 perspectivas com Groq real
- Recomendações principais
- Navegação + conceitos + OOS real
- `scripts/test_perspective_smoke_e2e.py` expandir

---

## 15. Riscos

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| Refatorar `_intent` quebra casos existentes | Alta | Matriz 56 casos + 145 testes antes/depois |
| decision_rules muito rígidas | Média | Fallback RAG quando confidence baixa |
| Reindexação altera retrieval | Média | A/B com evals `beatrice-core-v1.jsonl` |
| Nav actions no path composto duplicam botões | Baixa | Uma primary action por resposta |
| Groq rate limit em E2E | Média | Mock em CI; E2E manual agendado |
| Conflito naming Aetheris/Velaris confunde LLM | Alta | Fase 5 obrigatória antes de release |

---

## 16. Testes recomendados

| Suite | Comando | Cobertura |
|-------|---------|-----------|
| Agent unit | `python3 -m unittest discover -s tests/agent` | 145 testes |
| Matriz inteligência | `python3 scripts/audit_intelligence_matrix.py` | 56 casos obrigatórios |
| Contratos perspectiva | `python3 scripts/test_perspective_contracts.py` | 8 contratos |
| Agent layer v1 | `python3 scripts/validate_agent_layer_v1.py` | Contrato SSE |
| Capabilities | `npm run test:beatrice` | Integração |
| E2E perspectivas | `python3 scripts/test_perspective_smoke_e2e.py` | Smoke 8 personas |
| Health | `curl /api/health`, `/api/knowledge/health`, `/api/orchestration/health` | Infra |

---

## 17. Critérios de aceite (Abraxos mais inteligente)

O Abraxos será considerado **materialmente mais inteligente** quando:

1. **Matriz obrigatória ≥ 95%** (53/56), com zero falhas em greeting, navigation, perspective, concept, OOS
2. **Toda recomendação top-10** retorna componente principal + botão navegável sem depender só do LLM
3. **Entity lookup** funciona para `tem X?`, `me mostra X`, `onde fica X?`
4. **Comparações canônicas** (Button/Link, Radio/Select, Modal/Drawer, Checkbox/Switch) são determinísticas ou híbridas com evidência, nunca resposta vaga
5. **navigation_action** presente em ≥ 90% dos casos com rota/componente resolvido (determinístico e composto)
6. **Nenhum termo interno** (Velaris, Abraxos, Beatrice, Aetheris, componente catalogado) cai em out_of_scope
7. **Corpus RAG** usa branding Velaris; `context_builder` alinhado com `responseRules.md`
8. **8 perspectivas** passam smoke E2E com contrato validado pós-geração
9. **UI leak:** zero ocorrência de placeholders/labels em `message.content` (FE + BE)
10. **Tempo de resposta:** intents não-RAG < 500ms p95 local; sem chamada Groq para greeting/navigation/entity/concept

---

## Apêndice A: Health snapshot (2026-06-10)

```json
{
  "rag_active": true,
  "corpus_chunks": 182,
  "vector_collection_count": 182,
  "last_indexed_at": "2026-06-10T14:36:08+00:00",
  "catalog_loaded": true,
  "total_components": 25,
  "perspectives_healthy": true,
  "perspectives_loaded": "8/8",
  "orchestration_stages": 20,
  "agent_tests_passed": 145,
  "matrix_score": "45/56 (80.4%)"
}
```

## Apêndice B: Script de matriz

Executar:

```bash
python3 scripts/audit_intelligence_matrix.py > /tmp/audit_matrix.json
python3 -m unittest discover -s tests/agent -q
```

O script `scripts/audit_intelligence_matrix.py` foi criado nesta auditoria como artefato da Fase 1. Pode ser promovido a teste de regressão permanente na Fase 2.

---

*Fim do relatório. Nenhuma alteração de código de produção foi feita além do script de diagnóstico.*
