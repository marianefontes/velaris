# ARCHITECTURE.md — Mapa de Camadas do Aetheris

> Guia operacional para o agente. Define onde cada tipo de código pertence,
> quais são as dependências permitidas entre camadas, e onde criar novos arquivos.
> Atualizado: 2026-06-06.

---

## Visão geral das três camadas

```
┌─────────────────────────────────────────────────┐
│  FRONTEND (React / TypeScript / Vite)           │
│  src/                                           │
│  ├── App.tsx + routes.tsx  → roteamento         │
│  ├── components/           → páginas e layout   │
│  ├── beatrice/             → módulo Abraxos     │
│  ├── i18n/                 → internacionalização│
│  ├── hooks/ services/ types/ data/              │
│  └── index.css             → estilos globais    │
├─────────────────────────────────────────────────┤
│  BACKEND (Python / FastAPI)                     │
│  server.py                 → API HTTP (porta 3333)│
│  ├── rag/                  → pipeline RAG       │
│  ├── cognition/            → lógica cognitiva   │
│  ├── prompts/              → biblioteca prompts │
│  └── laboratory/ research/ → pesquisa           │
├─────────────────────────────────────────────────┤
│  DADOS (local, não versionados)                 │
│  rag/chroma_db/            → embeddings (HNSW)  │
│  data/*.sqlite3            → laboratório/pesquisa│
└─────────────────────────────────────────────────┘
```

---

## Camada Frontend — `src/`

### Onde criar cada tipo de arquivo

| Tipo | Pasta correta | Exemplo |
|------|---------------|---------|
| Página primária (rota no menu) | `src/components/` | `OracleHomePage.tsx` |
| Sub-página carregada por hub | `src/components/` | `PatternsPage.tsx` |
| Componente de layout global | `src/components/` | `AppShell.tsx`, `AppTopBar.tsx` |
| Sub-componente de feature específica | `src/components/<feature>/` | `comparison/EvaluationMatrix.tsx` |
| Página do módulo Abraxos | `src/beatrice/pages/` | `PerspectivesPage.tsx` |
| Componente visual Abraxos | `src/beatrice/components/<grupo>/` | `chat/ChatInput.tsx` |
| Lógica de domínio puro (sem React) | `src/beatrice/domain/<domínio>/` | `perspective/models.ts` |
| Hook customizado Abraxos | `src/beatrice/hooks/` | `usePersonaContext.ts` |
| Serviço Abraxos | `src/beatrice/services/` | `reasoning.service.ts` |
| Provider React (contexto) | `src/beatrice/providers/` | `PersonaProvider.tsx` |
| Hook de produto (fora do módulo Abraxos) | `src/hooks/` | `useDashboardData.ts` |
| Serviço de produto (fora do módulo Abraxos) | `src/services/` | `dashboardService.ts` |
| Tipos TypeScript de produto | `src/types/` | `dashboard.ts` |
| Dados mock | `src/data/` | `mockDashboard.ts` |
| Traduções | `src/i18n/translations.ts` | — |

### Regras de dependência no frontend

```
App.tsx
  └── components/AppShell
        └── components/AppTopBar  (consome routes.tsx + beatrice/components/persona/)
  └── components/[Páginas primárias]
        └── components/[Sub-páginas / sub-componentes]
              └── beatrice/components/[componentes visuais]
                    └── beatrice/hooks/
                          └── beatrice/domain/  ← sem dependência React
```

**Regras:**
- `src/components/` NÃO deve importar de `src/beatrice/domain/` diretamente — usar hooks ou serviços como intermediários
- `src/beatrice/domain/` NÃO pode importar nada de React ou de outros módulos além de TypeScript puro
- `src/beatrice/providers/` são o único ponto de entrada para contextos compartilhados entre páginas do Abraxos
- Páginas primárias (`components/`) podem importar componentes de `beatrice/components/` — isso é intencional

### Sub-módulos de `beatrice/components/`

| Grupo | Responsabilidade |
|-------|-----------------|
| `audit/` | Trilha de decisões auditáveis (AuditTrail, HistoricalDecision, etc.) |
| `chat/` | Interface de chat modular (input, mensagem, stream, sugestões, etc.) |
| `contextual/` | Painéis de contexto de persona exibidos no workspace (DecisionFeed, Artifacts, etc.) |
| `persona/` | Sidebar estático de persona (Header, Insights, SessionStats, SidebarPanel) |
| `primitives/` | Primitivos genéricos reutilizáveis (MarkdownRenderer, CommandMarkdownRenderer) |
| `reasoning/` | Componentes de raciocínio XAI (ConfidenceBreakdown, EvidencePanel, TradeoffPanel, etc.) |
| `workspaces/` | Workspaces especializados por persona (DesignerWorkspace, DeveloperWorkspace, etc.) |

---

## Camada Backend — Python

### `server.py` — Ponto de entrada

Responsabilidade única: receber `POST /api/chat`, executar o pipeline RAG e devolver SSE.

```
POST /api/chat
  └── classify_intent()        → detecta categoria da query
  └── retrieval.retrieve()     → busca ChromaDB por embeddings
  └── context_builder.build()  → monta contexto para o LLM
  └── groq.stream()            → gera resposta via Groq streaming
  └── SSE: { sources, intent } → primeiro evento (XAI)
  └── SSE: { delta }           → eventos de streaming de texto
```

### `rag/` — Pipeline de indexação

| Arquivo | Responsabilidade |
|---------|-----------------|
| `extract_docs.py` | Extrai texto dos arquivos `.tsx` em `src/components/` → chunks JSON |
| `setup_vectordb.py` | Indexa os chunks JSON no ChromaDB (com `--reset`) |
| `watch.py` | Monitora `src/components/*.tsx` e re-executa o pipeline (debounce 3s) |
| `retrieval.py` | Lógica de query ao ChromaDB (dense cosine, filtro por `page_type`) |
| `context_builder.py` | Monta o system prompt com os chunks recuperados |
| `evidence_metrics.py` | Calcula score de evidência dos chunks para XAI |

### `cognition/` — Camada cognitiva do agente

Não é código de produção — é a lógica de raciocínio **do agente de IA** que desenvolve o Aetheris.

| Sub-pasta | Conteúdo |
|-----------|---------|
| `strategies/` | 13 markdowns de estratégia de análise (component_fit_analysis.md, etc.) |
| `heuristics/` | Regras de ativação, confiança, escalação e roteamento (markdowns) |
| `engines/` | Python: seletor de estratégia, compositor, detector de ambiguidade |
| `orchestration/` | Python: orquestrador de raciocínio e pesos de estratégia |
| `overrides/` | Regras de override do agente (markdown) |

### `prompts/` — Biblioteca de prompts do Abraxos

O diretório técnico `src/beatrice/`, os nomes de tipos e as chaves persistidas
mantêm a nomenclatura anterior por compatibilidade. A identidade pública é
Abraxos.

| Sub-pasta | Conteúdo |
|-----------|---------|
| `system/` | Prompts de sistema: identidade, comportamento, persona, orquestração |
| `intents/` | Prompts por intenção detectada (componentGuidance, tokenLookup, etc.) |
| `responses/` | Templates de resposta por tipo (catalogResponse, componentResponse, etc.) |
| `engines/` | Prompts de engines especializados (perspectiveSynthesis, governanceImpact, etc.) |
| `retrieval/` | Políticas de chunking e retrieval |
| `commands/` | Prompts para slash commands do Oracle |

### `laboratory/` + `research/` — Pesquisa com participantes

| Módulo | Responsabilidade |
|--------|-----------------|
| `laboratory/runner.py` | Orquestra execução de casos de estudo |
| `laboratory/calibration.py` | Calibração automática do Abraxos |
| `laboratory/store.py` | Acesso ao SQLite do laboratório |
| `research/study_store.py` | Dados de participantes de estudos |

---

## Camada de Dados

| Local | Tipo | Versionado? |
|-------|------|------------|
| `rag/chroma_db/` | Embeddings HNSW (ChromaDB) | Não — `.gitignore` |
| `data/aetheris-laboratory.sqlite3` | Dados do laboratório | Não — `.gitignore` |
| `data/aetheris-study.sqlite3` | Dados de participantes | Não — `.gitignore` |
| `rag/aetheris-docs-dump.json` | Último dump do corpus | Não — `.gitignore` (implícito via rag/) |

---

## Tokens de Design — `tailwind.config.ts`

### Hierarquia de tokens de superfície (usar na ordem)

| Token | Uso correto |
|-------|------------|
| `bg-background` | Fundo raiz da aplicação |
| `bg-surface` | Mesma cor de fundo (alias semântico) |
| `bg-surface-container-lowest` | `#000` — regiões mais profundas/recuadas |
| `bg-surface-container-low` | `#131315` — painéis secundários |
| `bg-surface-container` | `#19191c` — cards e painéis principais |
| `bg-surface-container-high` | `#1f1f22` — sidebar, header |
| `bg-surface-container-highest` | `#262528` — overlays, tooltips |
| `bg-surface-bright` | `#2c2c2f` — hover states, destaques |

### Tokens de sombra cognitiva (usar para componentes do Abraxos)

| Token | Contexto |
|-------|---------|
| `shadow-cognitive-sm` | Cards pequenos com presença sutil |
| `shadow-cognitive-md` | Painéis e modais |
| `shadow-cognitive-lg` | Componentes de destaque principal |
| `shadow-oracle` | Identidade do Oracle (landing, hero) |
| `shadow-glow` | Glow genérico (usar com moderação) |
| `shadow-panel` | Painéis de contexto |
| `shadow-chip-active` | Estado ativo de chips de filtro |

### Regra sobre cores hardcoded

**Não usar hex literais em componentes.** Usar classes Tailwind com tokens semânticos (`text-primary`, `bg-surface-container`, `border-outline-variant`). A única exceção documentada: `hexForId()` em `PerspectivesPage.tsx` (coloração dinâmica de lentes de persona).

---

## Regras de Importação

### Permitido
- Páginas em `src/components/` importando componentes de `src/beatrice/components/`
- `src/beatrice/hooks/` importando de `src/beatrice/domain/`
- `src/beatrice/services/` importando de `src/beatrice/domain/`
- `src/components/AppTopBar.tsx` importando de `src/beatrice/components/persona/`

### Proibido
- `src/beatrice/domain/` importando qualquer coisa de `src/components/`
- `src/beatrice/domain/` importando hooks ou serviços React
- Importações circulares entre providers

### Atenção
- `src/routes.tsx` é importado por `AppTopBar.tsx` — é o único lugar onde alterar o menu de navegação
- As `<Route>` em `App.tsx` são separadas de `appRoutes` em `routes.tsx` — ambos precisam ser atualizados ao criar uma nova rota primária
