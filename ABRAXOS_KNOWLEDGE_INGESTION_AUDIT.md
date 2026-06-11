# ABRAXOS KNOWLEDGE INGESTION AUDIT

**Data:** 2026-06-11  
**Escopo:** Velaris (ecossistema) + Abraxos (agente cognitivo)  
**Método:** Auditoria read-only — frontend, corpus RAG, indexação ChromaDB, intents, roteamento, testes de recuperação, nomenclatura, paridade e capacidades cognitivas.  
**Corpus ativo:** 200 chunks (`aetheris_design_system`, BGE-M3, indexado 2026-06-10)  
**Veredito:** ❌ **NÃO APROVADO** nos critérios de aceite

---

## A. Resumo Executivo

| Pergunta | Resposta |
|----------|----------|
| Abraxos recebe corretamente as novas informações? | **Parcialmente.** O runtime agent tem engines, APIs e páginas novas, mas o corpus RAG ainda indexa sobretudo catálogo (tokens 51%, componentes 12%). A camada de inteligência (Health, Governança, Simulação, Perspectivas/Cognição) existe no frontend e no código Python, mas **não está indexada** para recuperação vetorial. |
| Health está indexado? | **Não.** `SystemHealthSection`, métricas (RAG Health, Catalog Health, etc.) e o comando `/health` **não têm chunks**. O comando existe em `capabilities.ts` mas está ausente do dump e do engine registry. |
| Governança está indexada? | **Parcialmente.** `/governance-impact` tem chunk; **`/governance` (Governance Agent) não**. Alertas são injetados em runtime via `governance_agent.py`, não via RAG. |
| Simulation está indexada? | **Não.** Engine `simulate` existe em runtime; **chunk ausente** do corpus. |
| Oracle Council está indexado? | **Parcialmente.** Chunk do comando `/oracle-council` existe; contratos de deliberação (`multi_agent_council.py`, `prompts/engines/oracleCouncil.md`) **não**. |
| Nomenclatura está consistente? | **Não.** Velaris/Abraxos dominam no frontend; Aetheris/Beatrice persistem em prompts, RAG e código interno. **"Agente Cognitivo" não aparece** em nenhum arquivo auditado. Abraxos ainda é descrito como "oráculo" nas respostas determinísticas. |

### Estado geral

```
Frontend (UI)          ████████████████░░░░  ~80% cobertura documental
Runtime (agent/API)    ██████████████░░░░░░  ~70% capacidades implementadas
Corpus RAG             ██████░░░░░░░░░░░░░░  ~30% alinhado com produto atual
Intents semânticos     ████░░░░░░░░░░░░░░░░  ~20% dos intents esperados existem
Recuperação vetorial   █████░░░░░░░░░░░░░░░  Comandos/capabilities parcialmente recuperáveis
Anti-alucinação        ███████░░░░░░░░░░░░░  SideDrawer bloqueado; outros falsos positivos
```

**Conclusão:** O Abraxos evoluiu como **agente cognitivo no código e na UI**, mas o **pipeline de ingestão de conhecimento ainda reflete a fase Beatrice/Aetheris** — indexador de design system, não de inteligência do ecossistema.

---

## B. Achados Críticos

### C1 — Corpus RAG desalinhado da arquitetura cognitiva atual

**Impacto:** Perguntas sobre Health, Governança, Simulação, Perspectivas/Cognição e Avaliação **não encontram evidência vetorial**. O LLM improvisa ou responde `out_of_scope`.

**Evidência:**
- 200 chunks; fontes ativas: `TokensPage` (122), `capabilities.ts` (28), `component-metadata.json` (25), `PatternsPage` (11), `FoundationsPage` (8), `DesignDecisionsPage` (4), `DevIntegrationPage` (2).
- **Zero chunks** de: `EvaluationPage`, `SystemHealthSection`, `GovernancePage`, `KnowledgeHealthPage`, `IntelligenceLabPage`, `PerspectivesPage`, `PerspectivesCognitionSection`, `DevelopersPage`, `ReasoningPage`, `GuidelinesPage`, `PersonaPage`.
- CLAUDE.md ainda declara **54 chunks** — documentação operacional desatualizada.

### C2 — Três extractors silenciosamente quebrados

| Extractor | Arquivo fonte | Causa | Chunks |
|-----------|---------------|-------|--------|
| `extract_guidelines` | `GuidelinesPage.tsx` | Procura `corePrinciples`; página usa `getGuidelinesContent()` com `pillars` i18n | **0** |
| `extract_reasoning` | `ReasoningPage.tsx` | Procura `const steps = [...]`; página usa i18n + `CognitiveFlow` | **0** |
| `extract_persona` | `PersonaPage.tsx` | Caminho errado: `src/components/` vs `src/beatrice/pages/` | **0** |

### C3 — Comandos `/health`, `/governance`, `/simulate` ausentes do corpus

De 19 comandos em `capabilities.ts`, **16 estão indexados**. Ausentes:

| Comando | Frontend | Engine registry | Corpus |
|---------|----------|-----------------|--------|
| `/health` | ✅ ReasoningPage | ❌ Não é engine | ❌ |
| `/governance` | ✅ ReasoningPage + GovernancePage | ✅ `governance` | ❌ |
| `/simulate` | ✅ ReasoningPage | ✅ `simulate` | ❌ |

**Teste de recuperação (`System Health health command`):** top-1 = `Command Center` (pattern) — **irrelevante**.

### C4 — Intents semânticos esperados não existem

Nenhum dos intents abaixo está definido em `intent_router.py` ou `agent/models.py`:

`system_health` · `agent_identity` · `governance_analysis` · `simulation` · `multi_agent_reasoning`

Capacidades cognitivas usam **engine IDs** (`governance`, `simulate`, `oracle-council`) ativados **somente via `command_mode` explícito**, não por linguagem natural.

**Resultado dos testes de roteamento (amostra):**

| Pergunta | Intent obtido | Esperado |
|----------|---------------|----------|
| "qual a saúde do sistema?" | `out_of_scope` | `system_health` |
| "o Abraxos é chatbot?" | `out_of_scope` | `agent_identity` |
| "o que é agente cognitivo?" | `out_of_scope` | `agent_identity` |
| "existem problemas de governança?" | `out_of_scope` | `governance_analysis` |
| "simule substituir Modal por Drawer" | `unsupported_entity_lookup` | `simulation` |
| "devemos usar Modal ou Drawer?" | `unsupported_entity_lookup` | `multi_agent_reasoning` |
| "Onde fica o Health?" | `out_of_scope` | navegação / `system_health` |

### C5 — Anti-alucinação incompleta para entidades falsas

| Entidade | Intent | Bloqueio |
|----------|--------|----------|
| SideDrawer | `unsupported_entity_lookup` | ✅ Correto — registry + resposta determinística |
| DragonButton | `out_of_scope` | ❌ Deveria bloquear como entidade inexistente |
| MagicPopover | `out_of_scope` | ❌ Idem |
| MegaWizard | `out_of_scope` | ❌ Idem |

`DragonButton`, `MagicPopover`, `MegaWizard` existem em `intelligence_lab.py` como casos adversariais, mas **não estão em `unsupported_entities_registry.py`**.

### C6 — Drawer/SideDrawer bloqueia fluxos críticos (Simulação, Oracle Council, Comparação)

- `Modal ou Drawer?` → `unsupported_entity_lookup` (Drawer tratado como inexistente).
- `/simulate substituir Modal por Drawer` → bloqueado antes do engine `simulate`.
- `/oracle-council devemos usar Modal ou Drawer?` → bloqueado.

**Impacto:** Casos de uso centrais da auditoria (checkout mobile, deliberação multi-perspectiva) **não chegam aos engines**.

### C7 — Filtros de `page_type` excluem chunks indexados

| `page_type` indexado | Presente em `INTENT_FILTER`? |
|----------------------|------------------------------|
| `accessibility` (8 chunks) | ❌ Filtros usam `foundation`, não `accessibility` |
| `oracle_command` (16) | ❌ Não listado em nenhum filtro |
| `automatic_skill` (12) | ❌ Não listado |

Engines com `retrieval_intent: design_decision` **não recuperam** a documentação do próprio comando (`oracle_command`).

### C8 — Identidade cognitiva não modelada

- `concept_map.py` descreve Abraxos como **"oráculo contextual"**, não "agente cognitivo".
- Perguntas "chatbot vs oráculo vs agente" → `out_of_scope`.
- Termo **"Agente Cognitivo"**: 0 ocorrências em `src/`, `agent/`, `prompts/`, `rag/`, `cognition/`.
- `prompts/system/core.md` ainda usa Beatrice + Aetheris como identidade canônica do sistema.

---

## C. Achados Médios

### M1 — Health: três conceitos não unificados

| Superfície | Rota/API | Dados | Indexado |
|------------|----------|-------|----------|
| Health do Sistema (Avaliação §5) | `/evaluation?focus=health` | Mock estático (84%) | ❌ |
| Knowledge Health Dashboard | `/knowledge-health` (admin) | API live | ❌ |
| RAG corpus diagnostics | `/api/health` | Live (200 chunks) | ❌ |

Scores mockados em `SystemHealthSection.tsx`; `capabilities.ts` admite: *"Scores mockados na UI; futura integração com knowledge health"*.

### M2 — `/health` documentado na UI mas não wired no chat

- Presente em `ReasoningPage` + `capabilities.ts`.
- **Ausente** de: `CommandMode` type, `COMMAND_META`, `COMMAND_PATTERN`, `commandMessages.ts`, chat chips.
- Não é engine em `cognition/engines/registry.py`.

### M3 — Páginas utilitárias sem descoberta nem corpus

`/governance`, `/knowledge-health`, `/intelligence-lab` — fora do menu, sem chunks, admin-gated.

### M4 — Respostas determinísticas de identidade parciais

| Pergunta | Funciona? | Mecanismo |
|----------|-----------|-----------|
| "O que é Velaris?" | ✅ | `concept_query` → `concept_map` |
| "O que era Aetheris?" | ✅ | `legacy_name_query` |
| "o que é Abraxos?" | ✅ | `concept_query` (como "oráculo") |
| "Por que Beatrice virou Abraxos?" | ⚠️ | `general_design_system` → LLM (sem resposta determinística) |
| "o Abraxos é chatbot?" | ❌ | `out_of_scope` |
| "o que é agente cognitivo?" | ❌ | `out_of_scope` |

### M5 — Recuperação vetorial: comandos parcialmente funcionais

| Query | Top-1 recuperado | Relevante? |
|-------|------------------|------------|
| "Knowledge Gap lacunas" | Knowledge Gap (`oracle_command`) | ✅ |
| "Governance Agent governance" | Governance Impact (`oracle_command`) | ⚠️ Parcial |
| "Simulate simulation" | Empty States (pattern) | ❌ |
| "Oracle Council multi perspective" | Empty States (pattern) | ❌ |
| "RAG Health métrica" | Confidence Badge (xai_component) | ❌ |
| "Organizational Memory decisões" | Primary vs Secondary Button (design_decision) | ⚠️ |
| "Modal Dialog blocking" | Modal/Dialog (component) | ✅ |

### M6 — Nomenclatura: transição incompleta

| Termo | Ocorrências (src/agent/prompts/rag/cognition) | Classificação |
|-------|-----------------------------------------------|---------------|
| Velaris | 307 | ✅ Atual — dominante no frontend |
| Abraxos | 412 | ✅ Atual — dominante no frontend |
| Aetheris | 364 | ⚠️ Maioria em RAG (281) + prompts (64) — legado técnico |
| Beatrice | 83 | ⚠️ Código interno + prompts — legado |
| Oráculo | 44 | ⚠️ Metáfora ativa em UI e respostas |
| Agente Cognitivo | 0 | ❌ Termo formal ausente |
| Chatbot | 1 | ✅ Apenas negação em `prompts/system/core.md` |

### M7 — Perspectivas: runtime sem corpus

`PerspectivesPage` + `PerspectivesCognitionSection` documentam lentes, calibração e instrumentação — **zero chunks**. Comando `/perspectives` indexado; conteúdo das lentes não.

### M8 — Engine contracts (`prompts/engines/*.md`) não indexados

11 engines com contratos markdown — nenhum no vector store. Funcionam apenas quando `command_mode` ativa o engine e o prompt é montado em runtime.

---

## D. Achados Baixos

### B1 — Chat chips incompletos
`/oracle-council` e `/health` ausentes de `ORACLE_INVESTIGATION_ORDER` / chips do chat.

### B2 — i18n gaps
`GovernancePage`, `KnowledgeHealthPage`, `IntelligenceLabPage` — copy hardcoded, sem provider i18n.

### B3 — Exemplos de comandos incompletos
`reasoningPage.ts` exemplifica 7 de 19 comandos.

### B4 — `context_builder.py` labels
`accessibility`, `oracle_command`, `automatic_skill` caem em fallback genérico `"Velaris Registry"`.

### B5 — Corpus dominado por tokens (51%)
Risco de recuperação enviesada para tokens em queries amplas (`general` intent).

### B6 — Links hardcoded PT em ReasoningPage
"Abrir dashboard…", "Abrir Health…" — não localizados.

---

## E. Matriz de Cobertura

| Área | Frontend | Corpus | Chunks | Indexação | Recuperação | Status | Ação Recomendada |
|------|----------|--------|--------|-----------|-------------|--------|------------------|
| **Avaliação (geral)** | ✅ 5 seções | ❌ | 0 | — | ❌ | Ausente | Adicionar extractor para `EvaluationPage.tsx` |
| **Health do Sistema** | ✅ §5 em Avaliação | ❌ | 0 | — | ❌ | Ausente | Extrair `SystemHealthSection` + `evaluationHealth.ts`; criar engine `/health` |
| **Raciocínio / Commands** | ✅ ReasoningPage | ⚠️ | 16/19 cmds | Parcial | ⚠️ | Parcial | Corrigir `extract_reasoning`; re-indexar; adicionar health/governance/simulate |
| **Governance Agent** | ✅ GovernancePage | ❌ cmd | 0 | Runtime injeta alerts | ⚠️ | Parcial | Extrair GovernancePage; chunk `/governance`; intent `governance_analysis` |
| **Governance Impact** | ✅ | ✅ | 1 | OK | ✅ | Completa | — |
| **Simulation** | ✅ comando | ❌ | 0 | Engine OK | ❌ | Parcial | Chunk `/simulate`; resolver bloqueio Drawer em comparações |
| **Oracle Council** | ✅ experimental | ⚠️ | 1 cmd | Engine OK | ❌ | Parcial | Indexar contrato + perspectivas; fix Drawer blocking |
| **Organizational Memory** | ✅ | ✅ cmd | 1 | Engine OK | ⚠️ | Parcial | Mais `design_decision` chunks; intent natural language |
| **Decision Archaeology** | ✅ | ✅ cmd | 1 + 4 decisions | OK | ⚠️ | Parcial | Enriquecer corpus de decisões |
| **Knowledge Gap** | ✅ | ✅ cmd | 1 | Engine OK | ✅ | Parcial | Indexar KnowledgeHealthPage |
| **Explainability Audit** | ✅ | ✅ cmd | 1 | Engine OK | ⚠️ | Parcial | Corrigir filtro `xai_explanation` |
| **Principle Conflict** | ✅ | ✅ cmd | 1 | Engine OK | ❌ | Parcial | Intent + chunks de guidelines |
| **Perspectivas** | ✅ PerspectivesPage | ❌ | 0 | — | ❌ | Ausente | Corrigir `extract_persona`; extrair PerspectivesPage |
| **Cognição** | ✅ PerspectivesCognitionSection | ❌ | 0 | — | ❌ | Ausente | Extrair seção cognição + `cognition/` strategies |
| **Arquitetura / RAG** | ✅ DevelopersPage | ⚠️ | 2 dev_integration | Parcial | ⚠️ | Parcial | Extrair DevelopersPage (corpus, pipeline) |
| **Guidelines** | ✅ | ❌ extractor quebrado | 0 | — | ❌ | Ausente | Reescrever `extract_guidelines` para i18n |
| **Componentes** | ✅ | ✅ | 25 | OK | ✅ | Completa | — |
| **Tokens** | ✅ | ✅ | 122 | OK | ✅ | Completa | — |
| **Patterns** | ✅ | ✅ | 11 | OK | ✅ | Completa | — |
| **Acessibilidade** | ✅ Foundations | ✅ | 8 | ⚠️ `page_type` mismatch | ⚠️ | Parcial | Adicionar `accessibility` a `INTENT_FILTER` |
| **Identidade Velaris/Abraxos** | ✅ | ❌ | 0 | `concept_map` runtime | ⚠️ | Parcial | Chunks de identidade + intent `agent_identity` |
| **Legado Aetheris/Beatrice** | ⚠️ código interno | ⚠️ refs RAG | — | `legacy_name_query` | ✅ | Parcial | Atualizar prompts/system; re-indexar |
| **Anti-alucinação** | — | — | — | Registry parcial | ⚠️ | Parcial | Registrar DragonButton, MagicPopover, MegaWizard |
| **Intelligence Lab** | ✅ admin | ❌ | 0 | Runtime only | ❌ | Ausente | Extrair categorias adversariais |
| **Knowledge Health API** | ✅ admin | ❌ | 0 | Live API | ❌ | Ausente | Corpus sintético das métricas |

---

## F. Recomendações

### Prioridade P0 — Bloqueadores de inteligência

| # | Problema | Arquivo provável | Causa | Correção |
|---|----------|------------------|-------|----------|
| 1 | Health não recuperável | `rag/extract_docs.py`, `SystemHealthSection.tsx` | Página não extraída | Novo extractor `extract_evaluation_health`; incluir 10 métricas + 7 measures |
| 2 | `/health` sem engine | `cognition/engines/registry.py`, `beatrice.ts` | Comando órfão | Criar engine `health` com `needs_evidence_metrics`; adicionar a `CommandMode` |
| 3 | Extractors quebrados | `rag/extract_docs.py` | Regex desatualizado vs i18n | Reescrever guidelines, reasoning, persona extractors |
| 4 | Intents ausentes | `prompts/intent_router.py`, `agent/understanding.py` | Modelo antigo | Adicionar `system_health`, `agent_identity`, `governance_analysis`, `simulation`, `multi_agent_reasoning` |
| 5 | Drawer bloqueia simulate/council | `agent/unsupported_entity_detection.py` | Drawer = unsupported | Permitir Drawer como alias de comparação quando Modal presente; ou adicionar Drawer ao catálogo |
| 6 | Anti-alucinação parcial | `agent/unsupported_entities_registry.py` | Registry incompleto | Registrar DragonButton, MagicPopover, MegaWizard |
| 7 | Re-indexação | `npm run index` | Dump 3 cmds atrás | Re-executar pipeline após fixes |

### Prioridade P1 — Cobertura cognitiva

| # | Problema | Arquivo | Correção |
|---|----------|---------|----------|
| 8 | Governance sem chunk | `GovernancePage.tsx`, `capabilities.ts` | Extrair página + garantir chunk `governance` |
| 9 | Simulate sem chunk | `capabilities.ts`, `strategic_reasoning.py` | Chunk do comando + cenários exemplo |
| 10 | `page_type` filters | `prompts/intent_router.py` | Adicionar `accessibility`, `oracle_command`, `automatic_skill` aos filtros relevantes |
| 11 | Perspectivas sem corpus | `PerspectivesPage.tsx`, `PerspectivesCognitionSection.tsx` | Novos extractors |
| 12 | Identidade cognitiva | `agent/concept_map.py`, `prompts/system/core.md` | Respostas para chatbot/oráculo/agente cognitivo; atualizar nomenclatura |
| 13 | Engine contracts no RAG | `prompts/engines/*.md` | Extrair como `page_type: engine_contract` |

### Prioridade P2 — UX e paridade

| # | Problema | Arquivo | Correção |
|---|----------|---------|----------|
| 14 | `/health` no chat | `policies.ts`, `commandMessages.ts`, `ChatSuggestions.tsx` | Wiring completo |
| 15 | Health mock vs live | `SystemHealthSection.tsx`, `intelligenceHealthService.ts` | Integrar API ou documentar limitação |
| 16 | CLAUDE.md desatualizado | `CLAUDE.md` | Atualizar chunk count, rotas, nomenclatura |
| 17 | i18n páginas admin | `GovernancePage.tsx`, etc. | Migrar para provider |
| 18 | Nomenclatura RAG | `rag/extract_docs.py`, collection name | Renomear refs Aetheris → Velaris no corpus |

---

## G. Auditoria das Capacidades Cognitivas

| Capability | Descrição UI | Exemplo | Chunk | Engine | Intent NL | Recuperação | Status |
|------------|-------------|---------|-------|--------|-----------|-------------|--------|
| **Organizational Memory** | ✅ | ✅ `/memory` | ✅ | ✅ | ❌ | ⚠️ | **Parcial** |
| **Decision Archaeology** | ✅ | ✅ `/decision` | ✅ | ✅ | ⚠️ `design_decision` | ⚠️ | **Parcial** |
| **Governance Agent** | ✅ | ✅ `/governance` | ❌ | ✅ + alerts | ❌ | ❌ | **Parcial** |
| **Governance Impact** | ✅ | ✅ | ✅ | ✅ | ❌ | ⚠️ | **Parcial** |
| **Principle Conflict** | ✅ | ✅ | ✅ | ✅ | ❌ misroute | ❌ | **Parcial** |
| **Oracle Council** | ✅ experimental | ✅ | ✅ cmd | ✅ | ❌ | ❌ | **Parcial** |
| **Multi-Agent Reasoning** | = Council | ✅ | ✅ cmd | ✅ | ❌ | ❌ | **Parcial** |
| **Knowledge Gap** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | **Parcial** |
| **Explainability Audit** | ✅ | ✅ `/audit` | ✅ | ✅ | ⚠️ | ⚠️ | **Parcial** |
| **Token Impact** | ✅ skill+cmd | ✅ | ✅ | N/A (skill) | ⚠️ | ✅ | **Parcial** |
| **Simulation Engine** | ✅ | ✅ `/simulate` | ❌ | ✅ | ❌ | ❌ | **Parcial** |
| **System Health** | ✅ | ✅ `/health` | ❌ | ❌ | ❌ | ❌ | **Ausente** |
| **Component Fit Analysis** | ✅ skill | ✅ | ✅ skill | auto | ✅ | ✅ | **Completa** |
| **Adoption Friction** | ✅ | ✅ | ✅ | ✅ | ❌ | ⚠️ | **Parcial** |

---

## H. Testes de Recuperação — Registro

### Identidade

| Query | Intent | Chunks top-1 | Resposta determinística | Alucinação | Confiança |
|-------|--------|--------------|-------------------------|------------|-----------|
| O que é Velaris? | `concept_query` | N/A (determinístico) | ✅ Design system atual | Não | Alta |
| O que era Aetheris? | `legacy_name_query` | N/A | ✅ Nome anterior → Velaris | Não | Alta |
| Por que Beatrice virou Abraxos? | `general_design_system` | LLM | ⚠️ Sem resposta fixa | Risco LLM | Média |
| chatbot vs oráculo vs agente? | `out_of_scope` | N/A | ❌ Recusa escopo | N/A | — |

### Health

| Query | Intent | Chunks top-1 | Resposta | Status |
|-------|--------|--------------|----------|--------|
| Onde fica o Health? | `out_of_scope` | — | ❌ Recusa | Falha |
| O que é RAG Health? | `concept_query` (parcial) | Confidence Badge | ❌ Irrelevante | Falha |
| Unknown Component Handling | `general` | Governance Impact (cmd) | ⚠️ Parcial | Falha |

### Comandos (via `command_mode`)

| Comando | Engine | `retrieval_intent` | Corpus cmd | Runtime |
|---------|--------|-------------------|------------|---------|
| `governance` | ✅ | `general` | ❌ | ⚠️ Alerts injetados; NL bloqueada |
| `simulate` | ✅ | `design_decision` | ❌ | ⚠️ Drawer bloqueia |
| `oracle-council` | ✅ | `general` | ✅ | ⚠️ Drawer bloqueia |
| `knowledge-gap` | ✅ | `general` | ✅ | ✅ Compõe |
| `health` | ❌ | `general` | ❌ | ❌ Sem engine |

### Anti-alucinação

| Entidade | Bloqueio | Resposta |
|----------|----------|----------|
| SideDrawer | ✅ `unsupported_entity_lookup` | Não existe; sugere Modal; ref. Material |
| DragonButton | ❌ `out_of_scope` | Recusa genérica — **não confirma inexistência** |
| MagicPopover | ❌ `out_of_scope` | Idem |
| MegaWizard | ❌ `out_of_scope` | Idem |

### Perspectivas

| Query | Intent | Recuperação |
|-------|--------|-------------|
| perspectiva acessibilidade | — | Sem chunks de perspectivas; runtime `perspective_registry` parcial |
| perspectiva documentação | — | Idem |

---

## I. Testes de Paridade

| Regra | Resultado |
|-------|-----------|
| Toda rota principal possui chunks | ❌ 6/9 rotas sem representação (Reasoning, Perspectives, Architecture, Evaluation, Laboratory, Results) |
| Todo comando possui documentação | ✅ Frontend 19/19; ❌ Corpus 16/19 |
| Toda métrica de Health possui chunk | ❌ 0/10 |
| Toda perspectiva possui documentação | ❌ Lentes não indexadas |
| Todo capability possui descrição indexada | ⚠️ 28/31 (skills+cmds); engines contracts não |
| Nenhum componente inexistente recomendado | ⚠️ SideDrawer OK; outros falsos não testados em produção |

---

## J. Consistência Frontend ↔ Corpus ↔ Respostas

| Desalinhamento | Exemplo |
|----------------|---------|
| Frontend → sem corpus | Health 84% mock; Abraxos não sabe explicar |
| Corpus → sem frontend | 122 token chunks; UI não expõe todos |
| Resposta termo incorreto | Abraxos = "oráculo contextual" (não "agente cognitivo") |
| Comando inventado | Risco baixo — commands vêm de registry |
| Rota inventada | Risco médio — navegação determinística funciona |
| Componente inventado | Risco em DragonButton etc. |
| Health existe mas não recuperável | ✅ Confirmado |
| `/governance` existe mas chunk ausente | ✅ Confirmado |

---

## K. Critério de Aceite — Checklist Final

| Critério | Status |
|----------|--------|
| Abraxos explica Velaris, Abraxos, Aetheris, Beatrice | ⚠️ Parcial (Beatrice rename → LLM) |
| Diferencia chatbot, oráculo e agente cognitivo | ❌ |
| Explica Health e métricas | ❌ |
| Explica Governance Agent | ⚠️ Só via `/governance` + alerts |
| Explica Simulation | ❌ NL; ⚠️ comando bloqueado por Drawer |
| Explica Oracle Council | ❌ NL; ⚠️ comando bloqueado |
| Recupera Organizational Memory | ⚠️ Só via `/memory` |
| Recupera Decision Archaeology | ⚠️ Parcial |
| Identifica Knowledge Gaps | ⚠️ Via `/knowledge-gap` |
| Calcula Governance Impact | ⚠️ Via comando |
| Reconhece componentes inexistentes | ⚠️ Parcial (1/4 testados) |
| Não recomenda entidades inexistentes | ⚠️ Não validado end-to-end |
| Frontend, corpus, chunks e respostas alinhados | ❌ |

### Veredito: ❌ AUDITORIA NÃO APROVADA

O agente **funciona bem no núcleo de design system** (componentes, tokens, patterns, SideDrawer) mas **não ingere nem recupera** a camada de inteligência que o produto expõe desde a transição Velaris/Abraxos.

---

## L. Plano de Remediação Sugerido (não executado)

```
Fase 1 (P0) — Corpus e extractors
  ├── Corrigir 3 extractors quebrados
  ├── Adicionar extractors: Evaluation/Health, Governance, Perspectives, Developers
  ├── Re-indexar (npm run index)
  └── Adicionar chunks: /health, /governance, /simulate

Fase 2 (P0) — Roteamento semântico
  ├── Intents: system_health, agent_identity, governance_analysis, simulation, multi_agent_reasoning
  ├── Engine /health no registry
  ├── concept_map: agente cognitivo + chatbot vs oráculo
  └── Fix Drawer em comparações/simulação

Fase 3 (P1) — Anti-alucinação e filtros
  ├── Expandir unsupported_entities_registry
  ├── INTENT_FILTER: accessibility, oracle_command, automatic_skill
  └── Indexar engine contracts

Fase 4 (P2) — UX e nomenclatura
  ├── Wire /health no chat
  ├── Integrar Health live ou documentar mock
  ├── Atualizar prompts/system + CLAUDE.md
  └── i18n páginas admin
```

---

*Auditoria executada sem modificações no código. Correções devem ser implementadas em ciclo separado após aprovação do diagnóstico.*
