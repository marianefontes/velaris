# AETHERIS — AGENTS.md

> Documento operacional para o agente de IA. Descreve o estado **atual** do projeto.
> Última atualização: 2026-06-06.

---

## Projeto

Aetheris é um sistema de design orientado a IA Explicável (XAI), documentação de UX e suporte a decisão. Inclui **Beatrice**, um oráculo de IA que responde perguntas sobre o design system via chat, usando RAG + XAI + Groq.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Estilo | Tailwind CSS v3 (tokens em `tailwind.config.ts`) |
| Roteamento | React Router v6 |
| Animação | Framer Motion |
| Gráficos | Recharts |
| Ícones | Lucide React |
| Backend | Python / FastAPI (`server.py`) — RAG proxy para Groq API |
| LLM | Groq API — `llama-3.3-70b-versatile` (streaming via SSE) |
| Embeddings | `BAAI/bge-m3` via FlagEmbedding — multilingual, 1024 dim |
| Vector DB | ChromaDB (persistente local, cosine HNSW) |
| i18n | Provider customizado (`src/i18n/`) — pt-BR, pt-PT, en |

---

## Rotas (estado atual)

### 9 rotas primárias (aparecem no menu de navegação via `appRoutes` em `routes.tsx`)

| Path | Componente carregado (lazy) | Arquivo fonte | Descrição |
|------|-----------------------------|---------------|-----------|
| `/main` | `OracleHomePage` | `src/components/OracleHomePage.tsx` | Home / landing |
| `/oracle` | `OraclePage` | `src/components/OraclePage.tsx` | Chat com Beatrice |
| `/reasoning` | `ReasoningPage` | `src/components/ReasoningPage.tsx` | XAI + raciocínio explicável |
| `/perspectives` | `PerspectivesPage` | `src/beatrice/pages/PerspectivesPage.tsx` | Perspectivas por persona |
| `/foundations` | `FoundationsHubPage` (exporta `FoundationsPage`) | `src/components/FoundationsHubPage.tsx` | Hub: guidelines, padrões, tokens, decisões |
| `/components` | `ComponentsPage` | `src/components/ComponentsPage.tsx` | Catálogo de componentes |
| `/architecture` | `DevelopersPage` | `src/components/DevelopersPage.tsx` | Arquitetura + integração dev |
| `/evaluation` | `EvaluationPage` | `src/components/EvaluationPage.tsx` | Avaliação do sistema |
| `/results` | `StudyResultsPage` | `src/components/StudyResultsPage.tsx` | Resultados de estudos |

### Rotas utilitárias (fora do menu)

| Path | Arquivo | Descrição |
|------|---------|-----------|
| `/laboratory` | `src/components/LaboratoryPage.tsx` | Laboratório de pesquisa |
| `/study/:token` | `src/components/StudyPage.tsx` | Fluxo de participante de estudo |
| `/research` | `src/components/ResearchAdminPage.tsx` | Admin de pesquisa (senha protegida) |

### Redirects legados (NÃO linkar para esses — redirecionam automaticamente)

| Path legado | Redireciona para |
|-------------|-----------------|
| `/dashboard` | `/main` |
| `/beatrice-chat` | `/oracle` |
| `/oracle/chat` | `/oracle` |
| `/persona` | `/perspectives` |
| `/patterns` | `/foundations?focus=patterns` |
| `/tokens` | `/foundations?focus=tokens` |
| `/design-decisions` | `/foundations` |
| `/guidelines` | `/foundations?focus=manifesto` |
| `/dev-integration` | `/architecture` |
| `/developers` | `/architecture` |
| `/system-evaluation` | `/evaluation` |
| `/comparison` | `/evaluation?focus=baseline` |
| `/intelligence` | `/reasoning` |
| `/principles` | `/foundations` |

---

## Estrutura de Pastas

```
AETHERIS/
├── src/
│   ├── App.tsx              # Componente raiz: todas as <Route>, Suspense, lazy loading
│   ├── main.tsx             # Entry point
│   ├── routes.tsx           # appRoutes[] — 9 itens de navegação (consumido por AppTopBar)
│   ├── index.css            # Estilos globais + utilitários Tailwind
│   ├── vite-env.d.ts        # Declarações de tipo do Vite
│   │
│   ├── components/          # Páginas ativas + componentes de layout + sub-páginas
│   │   │
│   │   │ # Layout global
│   │   ├── AppShell.tsx         # Wrapper de layout: renderiza AppTopBar, wraps children
│   │   ├── AppTopBar.tsx        # Barra de navegação primária (consome appRoutes)
│   │   │
│   │   │ # Páginas primárias (carregadas por App.tsx via lazy)
│   │   ├── OracleHomePage.tsx       # /main
│   │   ├── OraclePage.tsx           # /oracle
│   │   ├── ReasoningPage.tsx        # /reasoning
│   │   ├── FoundationsHubPage.tsx   # /foundations (hub — carrega sub-páginas lazily)
│   │   ├── ComponentsPage.tsx       # /components
│   │   ├── DevelopersPage.tsx       # /architecture
│   │   ├── EvaluationPage.tsx       # /evaluation
│   │   ├── StudyResultsPage.tsx     # /results
│   │   ├── LaboratoryPage.tsx       # /laboratory
│   │   ├── StudyPage.tsx            # /study/:token
│   │   ├── ResearchAdminPage.tsx    # /research
│   │   │
│   │   │ # Sub-páginas carregadas por hubs (NÃO são rotas primárias)
│   │   ├── GuidelinesPage.tsx       # carregada por FoundationsHubPage
│   │   ├── FoundationsPage.tsx      # carregada por FoundationsHubPage
│   │   ├── PatternsPage.tsx         # carregada por FoundationsHubPage
│   │   ├── TokensPage.tsx           # carregada por FoundationsHubPage
│   │   ├── DesignDecisionsPage.tsx  # carregada por DevelopersPage
│   │   ├── DevIntegrationPage.tsx   # carregada por DevelopersPage
│   │   │
│   │   │ # Re-exportações de 1 linha (apontam para beatrice/)
│   │   ├── BeatriceChatPage.tsx  # → src/beatrice/pages/BeatriceChatPage.tsx
│   │   ├── PersonaPage.tsx       # → src/beatrice/pages/PersonaPage.tsx
│   │   │
│   │   │ # Sub-componentes de feature
│   │   ├── ReasoningLiveTrace.tsx       # Usado por DevelopersPage
│   │   ├── comparison/                  # Usado por EvaluationPage
│   │   │   ├── AnswerPanel.tsx
│   │   │   ├── ComparisonEmptyState.tsx
│   │   │   ├── ComparisonInput.tsx
│   │   │   └── EvaluationMatrix.tsx
│   │   ├── oracle/                      # Usado por OraclePage
│   │   │   ├── CognitiveFlow.tsx
│   │   │   ├── CognitiveSkillCard.tsx
│   │   │   ├── OracleEngineCard.tsx
│   │   │   └── context/CurrentContextPanel.tsx
│   │   │
│   │   │ # Dados de workbench (TypeScript puro, não componentes React)
│   │   ├── componentIntentDocumentation.ts
│   │   ├── componentUsageGuidance.ts
│   │   └── componentWorkbench.ts
│   │
│   ├── beatrice/            # Módulo Beatrice — persona, chat, raciocínio, domínio XAI
│   │   ├── pages/
│   │   │   ├── BeatriceChatPage.tsx   # Implementação real do chat modular
│   │   │   ├── PersonaPage.tsx        # Página de persona (não roteada diretamente)
│   │   │   └── PerspectivesPage.tsx   # ROTA ATIVA: /perspectives
│   │   ├── components/
│   │   │   ├── audit/      # AuditEntry, AuditTrail, DecisionGraphView, EvidenceGraph, HistoricalDecision
│   │   │   ├── chat/       # ChatArtifacts, ChatEmptyState, ChatInput, ChatLayout, ChatLoadingState,
│   │   │   │               # ChatMessage, ChatStream, ChatSuggestions, ChatToolbar, HistoryPanel, SettingsPanel
│   │   │   ├── contextual/ # Painéis de contexto de persona (ContextualInsights, PersonaArtifacts, etc.)
│   │   │   ├── persona/    # Widgets do sidebar: PersonaHeader, PersonaInsights,
│   │   │   │               # PersonaMetrics[stats de sessão via useWorkspace],
│   │   │   │               # PersonaWorkspace[sidebar estático com header+insights]
│   │   │   ├── primitives/ # MarkdownRenderer, CommandMarkdownRenderer
│   │   │   ├── reasoning/  # ConfidenceBreakdown, DecisionCard, EvidencePanel,
│   │   │   │               # OutcomePrediction, ReasoningTimeline, TradeoffPanel
│   │   │   └── workspaces/ # PersonaWorkspace[registry dinâmico por persona],
│   │   │                   # DesignerWorkspace, DeveloperWorkspace, ProductManagerWorkspace,
│   │   │                   # QAWorkspace, TechWriterWorkspace
│   │   ├── domain/         # Lógica de domínio pura (sem React)
│   │   │   ├── audit/      # index.ts, models.ts, policies.ts, transformers.ts, types.ts
│   │   │   ├── decision/
│   │   │   ├── governance/ # + capabilities.ts
│   │   │   ├── perspective/# + calibration.ts, lenses.ts, localization.ts
│   │   │   └── reasoning/
│   │   ├── hooks/          # useArtifactGeneration, useAuditTrail, useBeatriceHistory,
│   │   │                   # useBeatriceSettings, useChatStream, useDecisionGraph,
│   │   │                   # usePanelFocusTrap, usePersonaContext, useReasoning, useWorkspaceState
│   │   ├── orchestrators/  # chat.orchestrator.ts
│   │   ├── providers/      # AuditProvider, InsightProvider, PersonaProvider,
│   │   │                   # RecommendationProvider, WorkspaceProvider
│   │   ├── services/       # artifact, audit, orchestration, persona, perspectiveTrial,
│   │   │                   # reasoning, retrieval services
│   │   ├── storage/        # beatriceStorage.ts (localStorage/sessionStorage)
│   │   ├── stores/         # workspace.store.ts
│   │   └── types/          # beatrice.ts
│   │
│   ├── data/
│   │   └── mockDashboard.ts
│   ├── hooks/
│   │   ├── useDashboardData.ts
│   │   ├── useLaboratorySnapshot.ts
│   │   └── useStudyParticipantSession.ts
│   ├── i18n/
│   │   ├── I18nProvider.tsx   # Contexto i18n
│   │   └── translations.ts    # pt-BR, pt-PT, en
│   ├── services/
│   │   ├── apiConfig.ts, comparisonService.ts, dashboardService.ts
│   │   ├── laboratoryService.ts, researchAdminAuth.ts
│   │   ├── studyResultsService.ts, studyTracking.ts
│   └── types/
│       ├── comparison.ts, dashboard.ts, laboratory.ts, oracle.ts
│
├── server.py         # Backend Beatrice — FastAPI, ChromaDB, Groq streaming (USAR ESTE)
├── server.cjs        # DEPRECATED — backend Node.js legado, sem RAG, não usar
│
├── rag/              # Pipeline RAG (Python)
│   ├── extract_docs.py      # TSX → JSON chunks
│   ├── setup_vectordb.py    # JSON → ChromaDB
│   ├── watch.py             # Auto-reindexer (watchdog, 3s debounce)
│   ├── retrieval.py         # Lógica de recuperação
│   ├── context_builder.py   # Montagem de contexto
│   ├── evidence_metrics.py  # Score de evidência
│   ├── query_test.py, test_e2e.py
│   ├── chroma_db/           # Vector store persistente (gitignored)
│   └── aetheris-docs-dump.json / .md   # Último dump do corpus RAG
│
├── cognition/        # Camada de cognição do agente (Python)
│   ├── engines/      # reasoning_engine.py, strategy_composer.py, etc.
│   ├── heuristics/   # activation_rules.md, confidence_rules.md, escalation_rules.md, routing_rules.md
│   ├── orchestration/# ambiguity_detector.py, strategy_selector.py, etc.
│   ├── overrides/    # override_rules.md
│   └── strategies/   # 13 markdowns de estratégia (component_fit_analysis.md, etc.)
│
├── prompts/          # Biblioteca de prompts do Beatrice (Python + Markdown)
│   ├── system/       # core.md, identity.md, behavior.md, persona.md, orchestration.md, etc.
│   ├── intents/      # componentGuidance.md, designDecision.md, explainability.md, etc.
│   ├── responses/    # catalogResponse.md, componentResponse.md, decisionResponse.md, etc.
│   ├── engines/      # adoptionFriction.md, decisionArchaeology.md, explainabilityAudit.md, etc.
│   ├── retrieval/    # chunckRules.md, chunkingStrategy.md, retrievalPolicy.md, retrievalRules.md
│   ├── commands/     # contractCheck.md, enforce.md, feedbackReview.md, tokenImpact.md, tradeoff.md
│   ├── templates/    # VAZIA — aliases removidos em 2026-06-06
│   └── loader.py, prompt_builder.py, intent_router.py, cognitive_profiles.py
│
├── laboratory/       # Laboratório de pesquisa (Python)
│   └── automation.py, calibration.py, cases.py, metrics.py, runner.py, store.py
│
├── research/
│   └── study_store.py
│
├── data/             # SQLite (gitignored)
│   └── aetheris-laboratory.sqlite3*, aetheris-study.sqlite3*
│
├── evals/
│   └── cases/beatrice-core-v1.jsonl
│
├── scripts/          # Scripts Python de teste e validação
│
├── abraxos/          # Identidade visual canônica de Abraxos (presença do oráculo)
│   └── ABRAXOS.md (carta anatômica — fonte da verdade), glyph/ (SVGs L0 +
│       preview.html com teste 16px), renders/ (4 PNGs canônicos aprovados)
│
├── wireframes/       # HTML estáticos de wireframe (exploração de design)
│
├── docs/             # Documentação extendida (GITIGNORED — apenas local)
│
├── tailwind.config.ts    # FONTE DOS TOKENS — editar aqui
├── vite.config.ts        # FONTE DA CONFIG VITE — editar aqui
├── postcss.config.js     # Config PostCSS — JS nativo (não gerado)
├── tsconfig.json         # Root: referencia tsconfig.app.json e tsconfig.node.json
├── tsconfig.app.json     # Compila src/ — noEmit: true
├── tsconfig.node.json    # Valida vite.config.ts e tailwind.config.ts — noEmit: true
├── package.json
├── index.html
└── render.yaml           # Config de deploy no Render.com
```

---

## Comandos Dev

```bash
# Frontend
npm run dev        # Vite dev server (porta 5173, frontend apenas)
npm run build      # tsc -b (type check) + vite build → dist/
npm run preview    # Preview da build de produção

# Backend (necessário para o chat do Beatrice)
GROQ_API_KEY=gsk_... npm start   # FastAPI + ChromaDB + BGE-M3 (porta 3333)

# Pipeline RAG
npm run index      # Re-indexação completa: extract_docs + setup_vectordb --reset
npm run watch-rag  # Auto-reindexação ao salvar arquivos TSX

# Testes
npm run test:rag             # Teste end-to-end do pipeline RAG
npm run test:beatrice        # Testa capacidades do Beatrice
npm run test:reasoning-ui    # Testa a UI de raciocínio
```

---

## Ambiente

Copiar `.env.local.example` para `.env.local`:

```
VITE_ORACLE_API_URL=http://localhost:3333/api/chat   # opcional — override do proxy Vite
GROQ_API_KEY=gsk_...                                  # obrigatório para o backend
```

Vite faz proxy de `/api` → `http://localhost:3333` em dev.

---

## Beatrice (AI Oracle)

- **Backend:** `server.py` — FastAPI, lifespan-based startup, SSE streaming async
- **RAG:** ChromaDB (cosine HNSW) + BGE-M3 embeddings + filtro `page_type` por intenção
- **XAI:** atribuição de fontes via SSE `{ sources, intent }` antes do stream de texto
- **LLM:** Groq `llama-3.3-70b-versatile`
- **Frontend chat:** renderizado por `src/components/OraclePage.tsx`; implementação modular em `src/beatrice/pages/BeatriceChatPage.tsx`
- **Markdown renderer:** customizado em `src/beatrice/components/primitives/MarkdownRenderer.tsx`

---

## Corpus RAG

- **Chunks:** 308 (v3.0.0-intelligence-layer)
- **Fontes indexadas:** ComponentsPage, PatternsPage, TokensPage, DesignDecisionsPage, GuidelinesPage, FoundationsPage, ReasoningPage, PersonaPage, DevIntegrationPage
- **Modelo de embedding:** BAAI/bge-m3 (1024 dim, dense mode)

---

## Dashboard Data

- Mock em `src/data/mockDashboard.ts`
- `dashboardService.ts` simula 850ms de delay de rede
- `useDashboardData.ts` envolve o serviço com estado de loading/error
- Shape definido em `src/types/dashboard.ts`

---

## i18n

- Provider: `src/i18n/I18nProvider.tsx`
- Traduções: `src/i18n/translations.ts` — pt-BR, pt-PT, en
- Labels de rota usam `labelKey` + `badgeKey` de `routes.tsx`
- Beatrice responde no idioma detectado do usuário

---

## Deploy

- `render.yaml` — config do Render.com
- `dist/` — output da build de produção (Vite)
- `dist/.htaccess` — regras Apache de rewrite para SPA (Hostinger)

---

## Convenções-chave

- **Config de navegação:** `src/routes.tsx` exporta `appRoutes[]`. Consumido por `AppTopBar.tsx`. As `<Route>` vivem em `App.tsx`. São dois arquivos com responsabilidades distintas — não confundir.
- **Sem state management externo:** apenas React state + hooks (sem Redux/Zustand)
- **Markdown renderer:** customizado em `src/beatrice/components/primitives/MarkdownRenderer.tsx`
- **Tokens:** definidos em `tailwind.config.ts`. O `tailwind.config.js` é artefato gerado — **não editar**.
- **Vite config:** `vite.config.ts` é a fonte. O `vite.config.js` é artefato gerado — **não editar**.
- **TypeScript:** `tsconfig.node.json` tem `noEmit: true` — não gera `.js` nem `.d.ts` na raiz.
- **Backend:** usar sempre `server.py`. O `server.cjs` é legado deprecated.
- **Dashboard data:** ainda mock. Para dados reais, substituir `dashboardService.ts`.

---

## Arquivos Mortos Conhecidos

Os arquivos abaixo existem em `src/components/` mas não têm nenhuma importação ativa. **Não importar, não referenciar, não criar variantes deles:**

| Arquivo | Situação |
|---------|----------|
| `Sidebar.tsx` | Substituído por `AppTopBar.tsx` na navegação |
| `AIPredictionCard.tsx` | Dashboard mock — nunca integrado |
| `MetricCard.tsx` | Dashboard mock — nunca integrado |
| `OracleGuidancePanel.tsx` | Dashboard mock — nunca integrado |
| `SectionTitle.tsx` | Primitivo genérico — não consumido |
| `SourceAttributionPanel.tsx` | Dashboard mock — nunca integrado |
| `XAIExplanationPanel.tsx` | Dashboard mock — nunca integrado |
| `SystemEvaluationPage.tsx` | Rota `/system-evaluation` redireciona para `/evaluation` |
| `IntelligencePage.tsx` | Conteúdo fundido em `ReasoningPage.tsx` |
| `ComparisonPage.tsx` | Conteúdo fundido em `EvaluationPage.tsx` |
| `MainPage.tsx` | Substituído por `OracleHomePage.tsx` |

---

## Nomes Ambíguos — Atenção ao Editar

Dois pares de componentes têm **nomes idênticos em pastas diferentes**. Sempre confirmar o caminho completo antes de editar:

| Nome | Pasta | Responsabilidade real |
|------|-------|----------------------|
| `PersonaWorkspace.tsx` | `beatrice/components/persona/` | Sidebar estático: Header + Insights + MetricsStats |
| `PersonaWorkspace.tsx` | `beatrice/components/workspaces/` | Registry dinâmico de workspaces por persona (Designer, Dev, PM…) |
| `PersonaMetrics.tsx` | `beatrice/components/persona/` | Stats de sessão (mensagens, tokens) via `useWorkspace` |
| `PersonaMetrics.tsx` | `beatrice/components/contextual/` | Métricas de estratégia de persona via `usePersonaContext` |
