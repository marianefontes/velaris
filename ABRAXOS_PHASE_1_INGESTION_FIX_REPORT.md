# ABRAXOS PHASE 1 — INGESTION FIX REPORT

**Data:** 2026-06-11  
**Escopo:** Fase 1 apenas — extractors, chunks, metadados, reindexação, validação de recuperação  
**Comando de reindexação:** `npm run index` (`python3 rag/extract_docs.py && python3 rag/setup_vectordb.py --reset`)

---

## A. Resumo do que foi corrigido

A Fase 1 corrigiu a fundação de ingestão do Abraxos para que a camada atual de inteligência do Velaris chegue ao corpus RAG e seja recuperável por busca vetorial.

**Principais entregas:**

1. **Extractors quebrados corrigidos** — `extract_guidelines` e `extract_reasoning` reescritos; `extract_persona` substituído por `extract_perspectives` + `extract_cognition`.
2. **Novos extractors** — Evaluation, System Health (18 chunks), Governance, Knowledge Health, Intelligence Lab, Developers Architecture, Engine Contracts.
3. **Comandos `/health`, `/governance`, `/simulate`** — todos os 19 comandos agora indexados com metadados `command`, `route`, `capability`.
4. **Metadados padronizados** — campos `kind`, `section`, `command`, `capability`, `route`, `tags` em chunks novos e enriquecidos; `setup_vectordb.py` atualizado para persistir no ChromaDB.
5. **Reindexação completa** — corpus passou de **200 → 308 chunks**; ChromaDB `aetheris_design_system` resetado e repovoado.
6. **Distribuição equilibrada** — tokens caíram de **51% → 33%** do corpus total.

**Veredito Fase 1:** ✅ **APROVADA** nos critérios de ingestão e indexação. Recuperação vetorial melhorou substancialmente; roteamento semântico (`out_of_scope`) permanece limitação conhecida para Fase 2.

---

## B. Arquivos alterados

| Arquivo | Alteração |
|---------|-----------|
| `rag/intelligence_extractors.py` | **Novo** — extractors da camada de inteligência |
| `rag/extract_docs.py` | Integração Phase 1, remoção extractors obsoletos, metadados enriquecidos em capabilities |
| `rag/setup_vectordb.py` | Metadados ChromaDB: `kind`, `command`, `capability`, `route`, `tags` |
| `rag/aetheris-docs-dump.json` | Regenerado — 308 chunks |
| `rag/aetheris-docs-dump.md` | Regenerado |
| `rag/chroma_db/` | Reindexado (308 documentos) |

**Nenhum arquivo fora do pipeline de ingestão foi alterado** (sem intents, sem UI, sem chat, sem engines novas).

---

## C. Antes e depois

### Total de chunks

| Métrica | Antes | Depois | Δ |
|---------|------:|-------:|--:|
| Total chunks | 200 | 308 | +108 (+54%) |
| Oracle commands | 16 | 19 | +3 |
| Token share | 51.5% | 33.4% | −18.1 pp |

### Distribuição por `page_type`

| page_type | Antes | Depois |
|-----------|------:|-------:|
| token | 103 | 103 |
| component | 22 | 22 |
| token_alias | 19 | 19 |
| oracle_command | 16 | **19** |
| automatic_skill | 12 | 12 |
| pattern | 11 | 11 |
| accessibility | 8 | 8 |
| design_decision | 4 | 4 |
| xai_component | 3 | 3 |
| dev_integration | 2 | 2 |
| **system_health** | 0 | **18** |
| **reasoning** | 0 | **15** |
| **governance** | 0 | **11** |
| **knowledge_health** | 0 | **11** |
| **perspective** | 0 | **9** |
| **cognition** | 0 | **9** |
| **guideline** | 0 | **7** |
| **intelligence_lab** | 0 | **7** |
| **engine_contract** | 0 | **7** |
| **developer_architecture** | 0 | **6** |
| **evaluation** | 0 | **5** |

### Páginas com 0 chunks → chunks após Fase 1

| Página / Área | Antes | Depois | Chunks |
|---------------|-------|--------|-------:|
| GuidelinesPage | 0 | ✅ | 7 |
| ReasoningPage | 0 | ✅ | 15 |
| PerspectivesPage | 0 | ✅ | 9 (perspective) |
| PerspectivesCognitionSection | 0 | ✅ | 9 (cognition) |
| EvaluationPage | 0 | ✅ | 5 |
| SystemHealthSection | 0 | ✅ | 18 (system_health) |
| GovernancePage | 0 | ✅ | 11 |
| KnowledgeHealthPage | 0 | ✅ | 11 |
| IntelligenceLabPage | 0 | ✅ | 7 |
| DevelopersPage | 0 | ✅ | 6 |
| PersonaPage (legado) | 0 | — | Substituído por PerspectivesPage |
| `/health` command | ausente | ✅ | oracle_command + system_health |
| `/governance` command | ausente | ✅ | oracle_command + governance |
| `/simulate` command | ausente | ✅ | oracle_command + engine_contract |

---

## D. Matriz de cobertura

| Área | Frontend | Extractor | Chunks | Indexação | Recuperação | Status |
|------|----------|-----------|-------:|-----------|-------------|--------|
| Guidelines | ✅ | `extract_guidelines` | 7 | ✅ | ⚠️ | **Corrigido** |
| Reasoning | ✅ | `extract_reasoning` | 15 | ✅ | ✅ | **Corrigido** |
| Perspectives | ✅ | `extract_perspectives` | 9 | ✅ | ✅ | **Corrigido** |
| Cognition | ✅ | `extract_cognition` | 9 | ✅ | ⚠️ | **Corrigido** |
| Evaluation | ✅ | `extract_evaluation` | 5 | ✅ | ⚠️ | **Novo** |
| System Health | ✅ | `extract_system_health` | 18 | ✅ | ✅ | **Novo** |
| Governance | ✅ | `extract_governance_page` | 11 | ✅ | ✅ | **Novo** |
| Knowledge Health | ✅ | `extract_knowledge_health` | 11 | ✅ | ⚠️ | **Novo** |
| Intelligence Lab | ✅ | `extract_intelligence_lab` | 7 | ✅ | ⚠️ | **Novo** |
| Architecture/RAG | ✅ | `extract_developers_architecture` | 6 | ✅ | ⚠️ | **Novo** |
| Engine contracts | runtime | `extract_engine_contracts` | 7 | ✅ | ✅ | **Novo (1B)** |
| Oracle commands (19) | ✅ | `extract_beatrice_capabilities` | 19 | ✅ | ✅ | **Corrigido** |
| Components/Tokens | ✅ | existentes | 144 | ✅ | ✅ | Mantido |

---

## E. Resultado dos testes de recuperação

Método: ChromaDB live + BGE-M3 + `retrieve_chunks()` com intent do `route_query` atual.  
**14/21** queries com top-1 semanticamente relevante ao domínio esperado.

### Health (6/7 relevantes no top-3; 5/7 no top-1)

| Query | Intent | Top-1 | page_type | Score | Relevante |
|-------|--------|-------|-----------|------:|-----------|
| Onde fica o Health do Sistema? | out_of_scope | Governance Health | system_health | 0.602 | ✅ |
| O que o Health do Sistema mede? | out_of_scope | Governance Health | system_health | 0.672 | ✅ |
| O que é RAG Health? | concept_query | **RAG Health** | system_health | 0.540 | ✅ |
| O que é Catalog Health? | out_of_scope | **Catalog Health** | system_health | 0.576 | ✅ |
| O que é Unknown Component Handling? | component_guidance | Skeleton Loader | component | 0.488 | ❌ (intent filtra componentes) |
| O que é Confidence Calibration? | out_of_scope | Confidence Badge | xai_component | 0.672 | ❌ (xai_component vence; health em #2) |
| O que é Governance Health? | out_of_scope | **Governance Health** | system_health | 0.609 | ✅ |

**Nota:** Perguntas de Health agora recuperam chunks `system_health`, não componentes aleatórios (exceto quando `component_guidance` intent filtra o corpus).

### Comandos (4/4 no top-3; 3/4 top-1 oracle_command)

| Query | Intent | Top-1 | page_type | Relevante |
|-------|--------|-------|-----------|-----------|
| Existe comando /health? | out_of_scope | **System Health** | oracle_command | ✅ |
| O que o comando /health faz? | out_of_scope | **System Health** | oracle_command | ✅ |
| O que o comando /governance faz? | out_of_scope | Governance Agent — Alert Dashboard | governance | ✅ (conteúdo correto; também oracle_command em #3) |
| O que o comando /simulate faz? | out_of_scope | **Simulate** | oracle_command | ✅ |

### Perspectivas (2/4 top-1 perspective; 4/4 no top-3)

| Query | Intent | Top-1 | Relevante |
|-------|--------|-------|-----------|
| Quais perspectivas profissionais existem? | out_of_scope | **Velaris Professional Perspectives** | ✅ |
| Como as perspectivas influenciam a resposta do Abraxos? | out_of_scope | Feedback & Trust (guideline) | ⚠️ perspective em #2 |
| Qual perspectiva para acessibilidade? | perspective_lookup | Perspective — Designer | ⚠️ a11y em #2 (0.660) |
| Qual perspectiva para documentação técnica? | perspective_lookup | Dashboard (pattern) | ❌ tech_writer em #3 (0.636) |

### Governança, Simulação, Oracle Council (3/3 ✅)

| Query | Top-1 | page_type |
|-------|-------|-----------|
| O que é Governance Agent? | Governance Agent — Alert Dashboard | governance |
| O que é Simulation Engine? | Oracle Engine \| Simulate | engine_contract |
| O que é Oracle Council? | Oracle Engine \| Oracle Council | engine_contract |

### Arquitetura (1/3 top-1 developer_architecture)

| Query | Top-1 | Relevante |
|-------|-------|-----------|
| Como o Abraxos recupera evidências? | Source Attribution (xai_component) | ⚠️ RAG architecture em #3 |
| Como o RAG do Velaris funciona? | Governance Readiness Check (skill) | ❌ |
| Corpus vs chunk vs fonte? | **Corpus, Chunk and Source — Definitions** | ✅ (0.770) |

### Anti-padrões eliminados

| Query (antes) | Top-1 antes | Top-1 depois |
|---------------|-------------|--------------|
| RAG Health métrica | Confidence Badge (xai_component) | **RAG Health** (system_health) |
| System Health health command | Command Center (pattern) | **System Health** (oracle_command) |
| Simulate simulation | Empty States (pattern) | **Simulate** (oracle_command) |

---

## F. Lacunas restantes para Fase 2

Estas lacunas são **esperadas** e **fora do escopo da Fase 1**:

1. **Intents semânticos** — `system_health`, `agent_identity`, `governance_analysis`, etc. Perguntas naturais ainda caem em `out_of_scope` ou intents genéricos.
2. **Engine `/health`** — comando indexado; engine no registry não criada (conforme escopo).
3. **Filtros `page_type`** — `accessibility`, `oracle_command`, `system_health` não estão em `INTENT_FILTER`; recuperação depende de intent `general`.
4. **Anti-alucinação** — DragonButton/MagicPopover/MegaWizard ainda não no registry.
5. **Drawer blocking** — comparações com Drawer ainda interceptadas em runtime.
6. **Recuperação fina** — algumas queries de perspectiva e arquitetura competem com patterns/components no top-1.
7. **Health UI mock** — chunks documentam que scores são mock; integração live com Knowledge Health API é Fase 2+.
8. **Guidelines PT** — extractor usa bloco en-US; variantes pt-BR/pt-PT não duplicadas (evita inflação).

---

## G. Confirmação de escopo

**Não foi implementado nesta fase:**

- ❌ Novos intents semânticos
- ❌ Engine `/health` no registry
- ❌ Mudanças no roteamento (`intent_router.py`, `understanding.py`)
- ❌ Alterações no chat ou UI
- ❌ Renomeação global Aetheris/Beatrice → Velaris/Abraxos
- ❌ Nova rota `/health` no menu
- ❌ Refatorações fora do pipeline RAG

**Foi implementado:**

- ✅ Extractors corrigidos e novos
- ✅ 108 chunks de inteligência adicionados
- ✅ Metadados padronizados
- ✅ Reindexação ChromaDB (308 docs)
- ✅ Testes de recuperação pós-indexação
- ✅ Engine contracts (subfase 1B — 7 arquivos prioritários)

---

## H. Critérios de aceite — checklist Fase 1

| Critério | Status |
|----------|--------|
| GuidelinesPage ≠ 0 chunks | ✅ 7 |
| ReasoningPage ≠ 0 chunks | ✅ 15 |
| PerspectivesPage gera chunks | ✅ 9 + 9 cognition |
| EvaluationPage gera chunks | ✅ 5 |
| SystemHealthSection gera chunks | ✅ 18 |
| Cada métrica de Health tem chunk | ✅ 10 métricas + overall + 7 measures |
| `/health`, `/governance`, `/simulate` no corpus | ✅ |
| Perguntas Health → chunks Health | ✅ (maioria; 2 exceções por intent/filter) |
| Perguntas perspectivas → chunks perspective | ⚠️ Parcial (top-3 OK; top-1 em 2/4) |
| Perguntas comandos → oracle_command | ✅ |
| Total chunks aumentou coerentemente | ✅ +54% |
| Distribuição por page_type registrada | ✅ |
| Nenhuma página importante com 0 chunks sem justificativa | ✅ (PersonaPage → Perspectives) |

### Veredito: ✅ FASE 1 APROVADA

A fundação de ingestão está corrigida. O Abraxos agora tem acesso vetorial à camada de inteligência do Velaris: Health, Avaliação, Governança, Simulação, Perspectivas, Cognição, Arquitetura e Comandos. A qualidade das respostas em linguagem natural continuará limitada até a Fase 2 (intents + roteamento).

---

*Extractor version: `3.0.0-intelligence-layer` · Embedding: BAAI/bge-m3 · Collection: `aetheris_design_system`*
