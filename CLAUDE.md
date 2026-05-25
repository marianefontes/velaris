# AETHERIS — CLAUDE.md

## Project

Aetheris is a design system dashboard oriented toward explainable AI (XAI), UX documentation, and decision support. It features an AI oracle named **Beatrice** that answers questions about the design system via a chat interface, using RAG + XAI + Groq.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Python / FastAPI (`server.py`) — RAG proxy to Groq API |
| LLM | Groq API — `llama-3.3-70b-versatile` (streaming via SSE) |
| Embeddings | `BAAI/bge-m3` via FlagEmbedding — multilingual, 1024 dim |
| Vector DB | ChromaDB (persistent local, cosine HNSW) |
| i18n | Custom provider (`src/i18n/`) |

## Structure

```
src/
  components/     # All pages and UI components (one file per page/component)
  data/           # Mock data (mockDashboard.ts)
  hooks/          # useDashboardData.ts
  i18n/           # I18nProvider.tsx + translations.ts
  services/       # dashboardService.ts (fetches dashboard data)
  types/          # dashboard.ts (TypeScript types)
  routes.tsx      # Route definitions with labels, icons, i18n keys
  App.tsx         # Root component
  main.tsx        # Entry point
server.py         # Beatrice backend — FastAPI, ChromaDB, Groq streaming
server.cjs        # Legacy Node.js backend (deprecated — no RAG)
rag/              # RAG pipeline scripts (Python)
  extract_docs.py    # TSX → JSON chunks (v2.1.0)
  setup_vectordb.py  # JSON → ChromaDB indexing
  watch.py           # Auto-reindexer (watchdog, 3s debounce)
  chroma_db/         # Persistent vector store (gitignored)
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/main` | MainPage | Landing/overview |
| `/dashboard` | DashboardPage | Oracle Dashboard with metrics |
| `/components` | ComponentsPage | Design system components |
| `/foundations` | FoundationsPage | Design foundations |
| `/guidelines` | GuidelinesPage | Usage guidelines |
| `/persona` | PersonaPage | Beatrice persona definition |
| `/patterns` | PatternsPage | UX patterns |
| `/reasoning` | ReasoningPage | XAI reasoning explanations |
| `/system-evaluation` | SystemEvaluationPage | System health/eval |
| `/tokens` | TokensPage | Design tokens |
| `/beatrice-chat` | BeatriceChatPage | Beatrice AI chat |
| `/dev-integration` | DevIntegrationPage | Developer integration guide |
| `/design-decisions` | DesignDecisionsPage | Decision log |

## Dev Commands

```bash
npm run dev        # Start Vite dev server (frontend only, port 5173)
npm run build      # TypeScript check + Vite production build → dist/
npm run preview    # Preview production build locally

# Backend (Python — required for Beatrice chat)
GROQ_API_KEY=gsk_... npm start        # FastAPI + ChromaDB + BGE-M3 (port 3333)

# RAG pipeline
npm run index      # Full reindex: extract_docs + setup_vectordb
npm run watch-rag  # Auto-reindex on TSX file save
```

## Environment

Copy `.env.local.example` to `.env.local`:

```
VITE_ORACLE_API_URL=http://localhost:3333/api/chat   # optional override
GROQ_API_KEY=gsk_...                                  # required for backend
```

Vite proxies `/api` → `http://localhost:3333` in dev.

## Beatrice (AI Oracle)

- Backend: `server.py` — FastAPI, lifespan-based startup, async SSE streaming
- RAG: ChromaDB (cosine HNSW) + BGE-M3 embeddings + intent-based `page_type` filtering
- XAI: source attribution via SSE `{ sources, intent }` event before text stream
- LLM: Groq `llama-3.3-70b-versatile`
- Frontend chat: `src/components/BeatriceChatPage.tsx` — SSE parsing, source chips

## RAG Corpus

- **Chunks:** 54 (as of v2.1.0-tsx)
- **Sources:** ComponentsPage, PatternsPage, TokensPage, DesignDecisionsPage, GuidelinesPage, FoundationsPage, ReasoningPage, PersonaPage, DevIntegrationPage
- **Embedding model:** BAAI/bge-m3 (1024 dim, dense mode)

## Dashboard Data

- Currently uses mock data: `src/data/mockDashboard.ts`
- `dashboardService.ts` simulates 850ms network delay
- `useDashboardData.ts` hook wraps the service with loading/error state
- Data shape defined in `src/types/dashboard.ts`

## i18n

- Provider: `src/i18n/I18nProvider.tsx`
- Translations: `src/i18n/translations.ts`
- Route labels use `labelKey` + `badgeKey` from `routes.tsx`
- Beatrice responds in the user's detected language

## Deployment

- `render.yaml` — Render.com deployment config
- `dist/` — production build output (Vite)
- `dist/.htaccess` — Apache rewrite rules for SPA routing (Hostinger)

## Key Conventions

- No external state management (no Redux/Zustand) — React state + hooks only
- No external markdown library — custom renderer in BeatriceChatPage
- Dashboard data is mock; replace `dashboardService.ts` to wire real API
- `server.py` uses FastAPI lifespan handler — BGE-M3 loads at startup, not on import
- `server.cjs` is the legacy Node.js backend — do not use for RAG features
- Tailwind config in both `.js` and `.ts` — use `tailwind.config.ts` as source of truth
