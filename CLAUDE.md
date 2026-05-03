# AETHERIS — CLAUDE.md

## Project

Aetheris is a design system dashboard oriented toward explainable AI (XAI), UX documentation, and decision support. It features an AI oracle named **Beatrice** that answers questions about the design system via a chat interface.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Node.js (`server.cjs`) — HTTP proxy to Anthropic API |
| AI | Anthropic API (`claude-haiku-4-5`), streaming via SSE |
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
server.cjs        # Beatrice API proxy (Anthropic streaming, no bundler)
rag/              # RAG pipeline scripts (Python) — not part of the running app
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
npm run start      # Start Beatrice backend: node server.cjs
```

## Environment

Copy `.env.local.example` to `.env.local`:

```
VITE_ORACLE_API_URL=http://localhost:3333/api/chat   # optional override
ANTHROPIC_API_KEY=sk-ant-...                          # required for backend
```

Vite proxies `/api` → `http://localhost:3333` in dev — no need to set `VITE_ORACLE_API_URL` locally unless pointing to a different server.

Backend started separately: `ANTHROPIC_API_KEY=sk-ant-... node server.cjs`

## Beatrice (AI Oracle)

- Lives in `server.cjs` — pure Node.js HTTP server, no Express
- Streams Anthropic responses via SSE (`text/event-stream`)
- System prompt defines Beatrice's role as XAI design system oracle (responds in user's language)
- Model: `claude-haiku-4-5`
- Frontend chat: `src/components/BeatriceChatPage.tsx` — includes custom markdown renderer (no external lib)

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
- `aetheris-hostinger.zip` — zipped dist for Hostinger upload

## Key Conventions

- No external state management (no Redux/Zustand) — React state + hooks only
- No external markdown library — custom renderer in BeatriceChatPage
- Dashboard data is mock; replace `dashboardService.ts` to wire real API
- `server.cjs` uses CommonJS (`require`) — keep it that way, it runs outside Vite
- Tailwind config in both `.js` and `.ts` — use `tailwind.config.ts` as source of truth
