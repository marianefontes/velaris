# AETHERIS

**A Design System Platform with Explainable AI, UX Documentation, and Decision Support**

AETHERIS is an intelligent design system platform that combines a comprehensive component library, design tokens, and an AI-powered oracle (Abraxos) to guide design and implementation decisions. Built with modern web technologies and powered by retrieval-augmented generation (RAG), it serves as both a reference and a decision-making partner for cross-functional teams.

**Live at:** https://beatrice.world

---

## ✨ Features

- **🧠 AI Oracle (Abraxos)** — Chat-based AI assistant that answers design system questions with cited evidence from the corpus
- **📚 Component Catalog** — 40+ UI components with detailed specs, Do/Don't rules, accessibility notes, and code examples
- **🎨 Design Tokens** — Semantic color, spacing, typography and shadow tokens defined as single source of truth
- **📋 Design Patterns** — Interaction patterns, layout strategies, and best practices for common workflows
- **🔍 Full-Text Search** — Fast client-side search across pages, components, tokens, patterns and decisions
- **👥 Professional Perspectives** — Specialized AI personas (Designer, Developer, QA, Product Manager, etc.) calibrated for different roles
- **✅ Design Decision Log** — Persistent record of system evolution and reasoning
- **📊 Visual Studio** — Interactive reasoning engine with audit trails and evidence graphs
- **🌐 Multilingual** — Portuguese (Brazil), Portuguese (Portugal), English with locale-aware content

---

## 🛠️ Tech Stack

### Frontend
- **React 18** — UI library with TypeScript
- **Vite 5** — Fast build tool and dev server
- **React Router v6** — Client-side routing
- **Tailwind CSS v3** — Utility-first styling with custom design tokens
- **Framer Motion** — Smooth animations and transitions
- **Recharts** — Data visualization
- **Lucide React** — Icon library

### Backend
- **Python 3.11+** — Server runtime
- **FastAPI** — Async web framework with automatic OpenAPI docs
- **Groq API** — Inference for `llama-3.3-70b-versatile` model via streaming (SSE)
- **ChromaDB** — Vector database for RAG with cosine similarity search
- **BAAI/bge-m3** — Multilingual embedding model (1024 dimensions) via FlagEmbedding
- **SQLite** — Persistent storage for research studies, lab experiments, and decision records

### Infrastructure
- **Render** — Deployment platform (free tier compatible with RAG disabled)
- **GitHub** — Version control and CI/CD hooks
- **Render.yaml** — Infrastructure-as-code for reproducible deployments

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 16+ (for npm and frontend tooling)
- **Python** 3.11+ (for backend)
- **GROQ_API_KEY** — Free API key from https://console.groq.com

### 1. Clone the Repository

```bash
git clone https://github.com/marianefontes/AETHERIS.git
cd AETHERIS
```

### 2. Frontend Setup

```bash
npm install
```

### 3. Backend Setup

```bash
pip install -r requirements.txt
```

Create a `.env.local` file in the project root:

```bash
GROQ_API_KEY=gsk_your_key_here
```

### 4. Run Locally

**Terminal 1 — Frontend (Vite dev server on port 5173):**

```bash
npm run dev
```

**Terminal 2 — Backend (FastAPI on port 3333):**

```bash
npm start
```

The frontend will proxy API requests to `http://localhost:3333/api` automatically.

### 5. Open in Browser

- **Frontend:** http://localhost:5173
- **API docs:** http://localhost:3333/docs

---

## 📁 Project Structure

```
AETHERIS/
├── src/                          # Frontend (React + TypeScript)
│   ├── App.tsx                   # Root component with routing
│   ├── routes.tsx                # Navigation configuration
│   ├── components/               # Page components and layouts
│   ├── beatrice/                 # AI oracle domain logic
│   │   ├── pages/                # Oracle-specific pages
│   │   ├── components/           # Chat, audit trail, reasoning UI
│   │   ├── services/             # API layer and business logic
│   │   ├── domain/               # Pure TypeScript models
│   │   ├── hooks/                # Custom React hooks
│   │   └── providers/            # Context providers
│   ├── i18n/                     # Internationalization (pt-BR, pt-PT, en)
│   ├── search/                   # Full-text search engine
│   └── index.css                 # Global styles + Tailwind utilities
│
├── server.py                     # FastAPI application (main backend)
├── agent/                        # Governed agentic execution layer
│   ├── planner.py                # Query comprehension and plan generation
│   ├── runtime.py                # Plan execution with tool invocation
│   ├── tools/                    # Domain-specific tools (search, validate, compare)
│   └── store.py                  # Decision record persistence
│
├── cognition/                    # Cognitive orchestration
│   ├── engines/                  # Reasoning engines and strategies
│   ├── orchestration/            # Strategy selection and composition
│   └── heuristics/               # Activation rules and thresholds
│
├── prompts/                      # Prompt templates and builders
│   ├── system/                   # System prompts and behaviors
│   ├── perspectives/             # Per-role response contracts
│   ├── intents/                  # Intent-specific guidance
│   └── responses/                # Response templates
│
├── rag/                          # Retrieval-Augmented Generation
│   ├── extract_docs.py           # Extract chunks from source files
│   ├── setup_vectordb.py         # Index chunks into ChromaDB
│   ├── retrieval.py              # Query and score documents
│   ├── context_builder.py        # Assemble RAG context for prompts
│   └── chroma_db/                # Vector store (gitignored)
│
├── laboratory/                   # Research lab and evals
│   ├── automation.py             # Automated evaluation runs
│   ├── runner.py                 # Test case execution
│   └── store.py                  # Results persistence
│
├── scripts/                      # Utility scripts for CI and debugging
├── evals/                        # Test cases and evaluation suite
├── abraxos/                      # Abraxos identity (glyph, renders)
├── public/                       # Static assets
├── tailwind.config.ts            # Design tokens (source of truth)
├── vite.config.ts                # Frontend build configuration
├── render.yaml                   # Render deployment configuration
└── package.json                  # Dependencies and npm scripts
```

---

## 🗺️ Routes

### Primary Navigation (in app menu)

| Path | Component | Purpose |
|------|-----------|---------|
| `/main` | OracleHomePage | Landing page with Abraxos consultation entry |
| `/oracle` | OraclePage | Chat with the AI oracle about design system topics |
| `/perspectives` | PerspectivesPage | Calibrate AI personas (Designer, Developer, QA, etc.) |
| `/reasoning` | ReasoningPage | Interactive reasoning engine with visible decision-making |
| `/foundations` | FoundationsHubPage | Design guidelines, patterns, tokens, and decisions |
| `/components` | ComponentsPage | Component catalog with specs and playground |
| `/architecture` | DevelopersPage | Developer integration guide and architecture docs |
| `/evaluation` | EvaluationPage | System evaluation and comparison tools |
| `/results` | StudyResultsPage | Empirical research results |

### Utility Routes

| Path | Purpose |
|------|---------|
| `/laboratory` | Research lab for automated evaluations |
| `/study/:token` | Participant study flow |
| `/research` | Research admin dashboard (password protected) |

### API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/chat` | Stream chat responses (SSE) |
| GET | `/api/health` | Health check |
| GET | `/api/laboratory/*` | Lab experiment endpoints |
| POST | `/api/decisions` | Create/update design decision records |
| GET | `/api/perspective/health` | Audit active perspective contract compliance |

---

## 👨‍💻 Development

### npm Scripts

```bash
# Frontend
npm run dev              # Start Vite dev server (port 5173)
npm run build           # Type-check and build for production
npm run preview         # Preview production build locally

# Backend
npm start               # Start FastAPI server (port 3333, with auto-reload)

# RAG Pipeline
npm run index           # Full re-index: extract_docs → setup_vectordb
npm run watch-rag       # Auto-reindex on file changes

# Testing
npm run test:agent      # Python agent layer tests
npm run test:agent-ui   # Frontend unit tests (vitest)
npm run test:rag        # RAG pipeline end-to-end test
```

### Code Style

- **TypeScript** — Strict mode enabled, no implicit `any`
- **React** — Hooks-based, lazy loading for route components
- **Tailwind CSS** — Utility classes; custom classes in `@layer` only
- **Python** — Type hints, docstrings, 100-char line limit
- **Commits** — Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, etc.)

### Key Files to Know

- **`tailwind.config.ts`** — Single source of truth for design tokens
- **`src/routes.tsx`** — Navigation item configuration
- **`server.py`** — FastAPI app, RAG pipeline, Groq integration
- **`CLAUDE.md`** — Operational document for the codebase
- **`.env.local`** — Local environment variables (create from scratch)

---

## 🚀 Deployment

### Automatic (GitHub to Render)

1. Merge to `main` branch
2. Render picks up `render.yaml` automatically
3. Builds and deploys both frontend (static) and backend (Python)

### Manual Deployment

**Frontend (Static Site):**
```bash
npm run build
# Upload `dist/` to Render or Hostinger
```

**Backend:**
```bash
# Set GROQ_API_KEY in Render environment
# Push to GitHub, Render auto-deploys
```

### Environment Variables (Render)

| Variable | Purpose | Required |
|----------|---------|----------|
| `GROQ_API_KEY` | Groq API authentication | ✅ Yes |
| `ALLOWED_ORIGINS` | CORS whitelist (e.g., `beatrice.world`) | No (default: `*`) |
| `AETHERIS_SKIP_RAG_STARTUP` | Skip RAG bootstrap on startup (for free tier) | No |

### Deployment Constraints

- **Free tier:** 512MB RAM — RAG disabled by default (use catalog-only mode)
- **Recommended:** Starter plan ($7/month) for RAG + full functionality

---

## 📖 Documentation

- **[CLAUDE.md](CLAUDE.md)** — Operational guide for developers
- **[ACCESSIBILITY.md](ACCESSIBILITY.md)** — A11y standards and contracts
- **[AGENT.md](AGENT.md)** — Governed agent layer architecture
- **[PERSPECTIVES.md](PERSPECTIVES.md)** — Professional perspective profiles

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create a branch** for your feature: `git checkout -b feature/my-feature`
3. **Make changes** following the code style above
4. **Commit** with Conventional Commits: `git commit -m "feat: add new component"`
5. **Push** and open a **Pull Request** to `main`
6. **Tests pass** and **review approved** → merge

### Before Submitting PR

```bash
npm run build              # Type-check and build
npm run test:agent-ui      # Run frontend tests
npm run test:rag           # Run RAG pipeline tests
```

---

## 📄 License

This project is proprietary. All rights reserved © 2025.

---

## 🙋 Support

- **Issues:** Open a GitHub issue for bugs and feature requests
- **Docs:** See [CLAUDE.md](CLAUDE.md) and inline comments in code
- **API:** FastAPI auto-generated docs at http://localhost:3333/docs

---

## 🎯 Roadmap

- [ ] Persistent RAG on Render (paid tier)
- [ ] Mobile-optimized chat interface
- [ ] Design decision versioning and branching
- [ ] Export component specs to Figma
- [ ] Team collaboration features
- [ ] Custom LLM fine-tuning for Aetheris domain

---

**Made with ❤️ by the Aetheris team.**
