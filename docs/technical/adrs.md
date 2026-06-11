# Architecture Decision Records — Aetheris

> Memória arquitetural do projeto. Responde "por que" o código é como é.
> Fonte consolidada de: `decisoes-tomadas.md`, `DesignDecisionsPage.tsx`, registros de sessão.
> Atualizado: 2026-06-06.

---

## ADR-01 — Stack Frontend: React + TypeScript + Vite + Tailwind

**Data:** Março 2026 | **Categoria:** Arquitetura

**Decisão:** Frontend construído com React 18, TypeScript, Vite e Tailwind CSS v3.

**Por que:**
- React: padrão de mercado para dashboards com estado complexo
- TypeScript: segurança de tipos nos schemas de componentes, tokens e patterns
- Vite: HMR instantâneo, build rápido, suporte nativo a ESM
- Tailwind: integração direta com design tokens utilitários, sem CSS externo

**Descartados:** Next.js (SSR desnecessário para SPA sem SEO), Vue 3 (ecossistema menor), CSS Modules (Tailwind integra melhor com tokens).

**Consequências:** SPA puro — deploy em CDN estática. Sem SSR. Migração futura requer adição de framework (Next.js ou Remix).

---

## ADR-02 — Modelo de Embedding: BAAI/bge-m3

**Data:** Abril 2026 | **Categoria:** ML / RAG

**Decisão:** `BAAI/bge-m3` com dimensão 1024, executado em FP16, via FlagEmbedding.

**Por que:**
- Suporte nativo a 100+ idiomas (corpus em inglês técnico, queries em português)
- Contexto de 8192 tokens — sem truncamento de chunks longos
- Multi-funcionalidade: dense + sparse + ColBERT — evolução sem trocar de modelo
- Supera alternativas nos benchmarks MTEB para retrieval multilingual

**Descartados:** `all-MiniLM-L6-v2` (monolíngue, 256 tokens), `bge-large-en-v1.5` (monolíngue).

**Consequências:** Requer ~1.5GB RAM para carga local. Hybrid retrieval (dense + sparse) é upgrade sem re-indexação. Ver `rag/embedding-model-justification.md`.

---

## ADR-03 — Vector Store: ChromaDB persistente local

**Data:** Abril 2026 | **Categoria:** Infraestrutura / RAG

**Decisão:** ChromaDB em modo persistente local em `rag/chroma_db/`. Coleção `aetheris_design_system`. Métrica: cosine similarity (HNSW).

**Por que:**
- Open source, sem custo, sem infraestrutura de nuvem
- Persiste em disco (SQLite + HNSW) — reproduzível em qualquer ambiente
- API Python ergonômica com suporte a filtros por metadados (`page_type`)

**Descartados:** Pinecone (custo), Weaviate (overhead de Docker), FAISS (sem persistência nativa), pgvector (depende de PostgreSQL).

**Consequências:** `chroma_db/` está no `.gitignore`. Re-indexação necessária em ambiente novo: `python rag/setup_vectordb.py --reset`. Para produção, migrar para ChromaDB Server ou pgvector.

---

## ADR-04 — Técnica XAI: RAG-native Attribution via SSE

**Data:** Abril 2026 | **Categoria:** IA / Explicabilidade

**Decisão:** Atribuição de fontes via evento SSE `{ sources, intent }` emitido pelo servidor antes do streaming de texto.

**Por que:** RAG-native attribution é a técnica XAI escolhida — o servidor já gera os dados (chunks, similaridade coseno). O evento SSE fecha o ciclo de XAI: o usuário vê de onde a Beatrice buscou e com qual confiança, sem overhead de chamada adicional.

**Design:** Chips inline com título do chunk + percentual de similaridade. Aparecem após a resposta completa — o momento correto para auditoria, não durante o streaming.

**Descartados:** Painel lateral separado (complexidade de layout), exibição durante streaming (chips apareceriam truncados).

**Consequências:** `ChatMessage` tem campos opcionais `sources?: SourceChip[]` e `intent?: string`. O SSE parser distingue dois tipos: `{ sources }` (primeiro) e `{ delta }` (stream).

---

## ADR-05 — Backend: Migração de Node.js (TF-IDF) para Python/FastAPI (RAG vetorial)

**Data:** Maio 2026 | **Categoria:** Arquitetura / Backend

**Decisão:** Servidor migrado de `server.cjs` (Node.js, TF-IDF) para `server.py` (Python, FastAPI, ChromaDB + BGE-M3).

**Por que:**
- ChromaDB não tem binding estável para Node.js
- TF-IDF em `server.cjs` era interim — não usava os embeddings gerados
- Python elimina fricção de linguagem para o pipeline ML completo

**Pipeline completo:** query → embed (BGE-M3) → retrieve (ChromaDB cosine) → augment (system prompt) → generate (Groq streaming SSE).

**Descartados:** Microserviço Python separado com Node.js na frente (latência extra), Pinecone/cloud (custo e dependência externa).

**Consequências:** `server.cjs` está deprecated e não tem RAG. Usar sempre `server.py`. Frontend mantém protocolo idêntico (`POST /api/chat`, SSE) — sem mudanças necessárias.

---

## ADR-06 — Classificador de Intent por Keywords no Servidor

**Data:** Maio 2026 | **Categoria:** Backend / XAI

**Decisão:** Classificador de intent baseado em keyword matching em `server.py`, com 6 categorias + fallback `general`.

**Categorias:** `component_guidance`, `pattern_guidance`, `token_lookup`, `design_decision`, `when_not_to_use`, `xai_explanation`.

**Por que:**
- Custo zero (string matching, síncrono)
- Intent é metadado de audit trail visível ao usuário no chip SSE
- Base para retrieval especializado por `page_type` em versões futuras

**Descartados:** Classificador ML fine-tuned (custo desproporcional para 6 categorias), classificação pelo LLM (dobra latência e custo de API).

**Consequências:** Keywords bilíngues (PT-BR + EN). Queries em outros idiomas → `general`. Extensível: adicionar keywords não requer restart.

---

## ADR-07 — Auto-reindexação do Corpus com watchdog (3s debounce)

**Data:** Maio 2026 | **Categoria:** DX / Pipeline

**Decisão:** `rag/watch.py` usa `watchdog` para monitorar alterações em `src/components/*.tsx` e re-executar o pipeline completo automaticamente.

**Por que:** Sem auto-reindexação, qualquer mudança nos `.tsx` (fonte do corpus RAG) exige dois comandos manuais. Isso cria atrito e risco de corpus desatualizado.

**Debounce de 3s:** evita execuções em sequência rápida (salves em estágios de editores).

**Consequências:** O ChromaDB é recriado do zero a cada reindexação (`--reset`) — consistência garantida. Reindexação leva ~10–30s (dominada pelo BGE-M3).

---

## ADR-08 — Sistema de Personas → Sistema de Perspectivas (Lentes Cognitivas)

**Data:** Maio 2026 | **Categoria:** Produto / Arquitetura

**Decisão:** O sistema de personas demográficas (Designer, Dev, PM) foi substituído por perspectivas cognitivas instrumentadas com calibrações mensuráveis.

**Por que:**
- Personas como "perfis demográficos" são proxies — o que importa é o modelo de raciocínio usado para avaliar o design system
- Perspectivas têm calibrações mensuráveis: `depth`, `technicality`, `riskSensitivity`, `trustCalibrationStyle`
- Permite comparação lado a lado de duas perspectivas com diferentes calibrações (feature do `/perspectives`)
- Fundamentação em XAI: o usuário vê como a perspectiva influencia a resposta

**Impacto no código:**
- `src/beatrice/domain/persona/` renomeado para `src/beatrice/domain/perspective/`
- `src/beatrice/pages/PersonaPage.tsx` → subordinado; rota ativa é `/perspectives` → `PerspectivesPage.tsx`
- `lenses.ts` define as perspectivas com `LENS_INSTRUMENTATION` e calibrações

**Consequências:** A rota `/persona` redireciona para `/perspectives`. Código antigo em `beatrice/components/persona/` ainda existe como sidebar panel; não confundir com o sistema de perspectivas em `beatrice/domain/perspective/`.

---

## ADR-09 — Consolidação de 13 Rotas em 9 Superfícies Primárias

**Data:** Junho 2026 | **Categoria:** Produto / Arquitetura

**Decisão:** Navegação consolidada de 13 rotas independentes para 9 superfícies, com as demais rotas viradas em redirects ou sub-seções de hub pages.

**Antes:** `/main`, `/dashboard`, `/components`, `/foundations`, `/guidelines`, `/persona`, `/patterns`, `/reasoning`, `/system-evaluation`, `/tokens`, `/beatrice-chat`, `/dev-integration`, `/design-decisions`.

**Depois:** `/main`, `/oracle`, `/reasoning`, `/perspectives`, `/foundations`, `/components`, `/architecture`, `/evaluation`, `/results`.

**Por que:**
- 13 itens de navegação excedem o limite cognitivo (7±2) para menus de aplicativos
- `/foundations` é hub natural para guidelines, patterns, tokens, design decisions
- `/architecture` é hub natural para dev integration + architecture docs
- `/evaluation` absorve `/system-evaluation` + `/comparison` (sidebar ou tab)

**Consequências:** Todas as URLs antigas são redirects — bookmarks e links externos continuam funcionando. `src/App.tsx` contém a lista completa de redirects legados.

---

## ADR-10 — Laboratório de Pesquisa em SQLite Local

**Data:** Junho 2026 | **Categoria:** Pesquisa / Infraestrutura

**Decisão:** Dados do laboratório de pesquisa com participantes armazenados em SQLite local em `data/aetheris-laboratory.sqlite3`.

**Por que:**
- Dados de pesquisa com participantes reais exigem controle local (sem envio para serviço externo)
- SQLite é suficiente para o volume de dados do TCC (N ≤ 50 participantes)
- `laboratory/store.py` abstrai o acesso — substituível por PostgreSQL sem mudar lógica acima

**Consequências:** `data/*.sqlite3*` está no `.gitignore`. Dados de pesquisa não são versionados. Backup manual necessário.

---

## ADR-11 — tsconfig.node.json: composite + noEmit (correção de emissão na raiz)

**Data:** Junho 2026 | **Categoria:** Build / TypeScript

**Decisão:** Adicionado `"noEmit": true` ao `tsconfig.node.json`.

**Por que:** `composite: true` sem `noEmit` causava emissão de `vite.config.js`, `vite.config.d.ts`, `tailwind.config.js`, `tailwind.config.d.ts` na raiz a cada `npm run build`. Esses artefatos poluíam o working tree e podiam ser confundidos com fontes editáveis.

**Causa raiz:** Vite e Tailwind leem os `.ts` diretamente via esbuild interno — não precisam dos `.js` compilados. O `composite: true` era necessário apenas para o build incremental referenciado por `tsconfig.json`.

**Consequências:** Os artefatos não são mais gerados. O `.gitignore` já os cobria por nome — proteção mantida para o caso de regressão.

---

## ADR-12 — Dashboard Data: Mock permanente na v1

**Data:** Maio 2026 | **Categoria:** Frontend / Produto

**Decisão:** Dados do Oracle Dashboard são servidos por mock em `src/data/mockDashboard.ts` com delay artificial de 850ms via `dashboardService.ts`.

**Por que:** Integração com dados reais de projetos (Jira, Linear, GitHub Projects) está fora do escopo da v1 do TCC. O mock permite desenvolver e demonstrar a interface completa sem dependência de API externa.

**Consequências:** Para conectar a dados reais, substituir a implementação de `dashboardService.ts` mantendo a mesma interface de retorno (`DashboardData`). Nenhuma mudança nos componentes é necessária.
