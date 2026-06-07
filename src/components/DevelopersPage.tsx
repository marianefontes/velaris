// ||| Phase IB · /developers — implementation intelligence
// 4 final sections: architecture (merged infrastructure), rag, integration,
// corpus (merged inspector + live trace). Reference and decisions removed per spec.

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import {
  Activity,
  Cpu,
  Database,
  FileCode,
  GitBranch,
  Layers,
  Network,
  Play,
  ScanSearch,
  Server,
  Sparkles,
  Square,
  TerminalSquare,
  Workflow,
} from "lucide-react";
import { fetchHealthData } from "../beatrice/services/retrieval.service";
import { runPerspectiveTrial } from "../beatrice/services/perspectiveTrial.service";
import type { HealthData, SourceChip } from "../beatrice/types/beatrice";
import { usePersonaContext } from "../beatrice/hooks/usePersonaContext";

const ReasoningLiveTrace = lazy(() =>
  import("./ReasoningLiveTrace").then((module) => ({ default: module.ReasoningLiveTrace })),
);

// ──────────────────────────────────────────────────────────────────────────
// Section model
// ──────────────────────────────────────────────────────────────────────────

type FocusId =
  | "architecture"
  | "rag"
  | "integration"
  | "corpus";

const SECTIONS: Array<{ id: FocusId; label: string; role: string; icon: typeof Cpu }> = [
  { id: "architecture", label: "Architecture", role: "stack overview", icon: Network },
  { id: "rag", label: "RAG Pipeline", role: "extract · index · serve", icon: Workflow },
  { id: "integration", label: "Integration", role: "API surfaces", icon: FileCode },
  { id: "corpus", label: "Corpus & Retrieval", role: "live diagnostics", icon: Database },
];

// ──────────────────────────────────────────────────────────────────────────
// Page root
// ──────────────────────────────────────────────────────────────────────────

export function DevelopersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focus = (searchParams.get("focus") as FocusId | null) ?? "architecture";
  const active = SECTIONS.find((section) => section.id === focus) ?? SECTIONS[0];

  const updateFocus = (next: FocusId) => {
    if (next === "architecture") {
      searchParams.delete("focus");
      setSearchParams(searchParams, { replace: true });
    } else {
      searchParams.set("focus", next);
      setSearchParams(searchParams, { replace: true });
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-10 text-slate-200 lg:px-10">
      <Hero />
      <SectionNav active={active.id} onChange={updateFocus} />

      <div className="mt-10">
        {active.id === "architecture" ? <ArchitectureSection /> : null}
        {active.id === "rag" ? <RagSection /> : null}
        {active.id === "integration" ? <IntegrationSection /> : null}
        {active.id === "corpus" ? <CorpusSection /> : null}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Hero & nav
// ──────────────────────────────────────────────────────────────────────────

function Hero() {
  const { t } = useI18n();
  return (
    <header className="page-hero">
      <div className="page-eyebrow">
        <TerminalSquare className="h-3.5 w-3.5" aria-hidden />
        {t("pages.developers.eyebrow")}
      </div>
      <h1 className="page-h1">
        The platform, <em className="not-italic text-primary">explained as it runs</em>.
      </h1>
      <p className="page-lead">
        Aetheris is a small surface over a deliberate backend. This page documents the system the
        way you'd want it documented if you were about to extend it — named modules, real artifact
        paths, runnable commands, a live retrieval inspector against the same /api/chat the chat
        surface uses.
      </p>
    </header>
  );
}

function SectionNav({ active, onChange }: { active: FocusId; onChange: (next: FocusId) => void }) {
  const { t } = useI18n();
  return (
    <nav aria-label="Developer sections" className="flex flex-wrap gap-2">
      {SECTIONS.map((section) => {
        const Icon = section.icon;
        const isActive = section.id === active;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onChange(section.id)}
            aria-pressed={isActive}
            className={isActive ? "section-tab-active" : "section-tab"}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            <span className="font-semibold">{t(`pages.developers.sections.${section.id}.label`)}</span>
            <span className="hidden text-[10px] uppercase tracking-widest opacity-50 sm:inline">
              {t(`pages.developers.sections.${section.id}.role`)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 1 — Architecture overview (3 tiers + data flows)
// ──────────────────────────────────────────────────────────────────────────

interface ArchTier {
  level: number;
  label: string;
  responsibility: string;
  components: Array<{ name: string; detail: string }>;
}

const ARCH_TIERS: ArchTier[] = [
  {
    level: 3,
    label: "Browser",
    responsibility: "Surfaces, perspective state, streaming UI",
    components: [
      { name: "React 18 + TypeScript", detail: "Vite-powered SPA, code-split per route" },
      { name: "Tailwind CSS v3", detail: "Token-driven styling, dark-first" },
      { name: "React Router v6", detail: "8 cognitive surfaces + legacy redirects" },
      { name: "PerspectiveProvider", detail: "Active lens + calibration overrides, persisted per profile" },
      { name: "WorkspaceProvider", detail: "Chat state, history, settings" },
    ],
  },
  {
    level: 2,
    label: "FastAPI server",
    responsibility: "Orchestration, prompt assembly, Groq proxy",
    components: [
      { name: "server.py", detail: "Lifespan-aware FastAPI; loads BGE-M3 + Chroma once at startup" },
      { name: "prompts/intent_router.py", detail: "Catalog detection · command routing · keyword-vote intent classification" },
      { name: "prompts/prompt_builder.py", detail: "Stacks 8 prompt layers into the system prompt" },
      { name: "prompts/cognitive_profiles.py", detail: "7 cognitive lenses + calibration override resolution" },
      { name: "rag/retrieval.py", detail: "Perspective-weighted vector retrieval with vocabulary boost" },
      { name: "rag/context_builder.py", detail: "Composes retrieved chunks into the RAG context block" },
    ],
  },
  {
    level: 1,
    label: "Storage & inference",
    responsibility: "Corpus, embeddings, LLM",
    components: [
      { name: "ChromaDB (persistent, cosine HNSW)", detail: "Local-first vector store at rag/chroma_db/" },
      { name: "BAAI/bge-m3 (FlagEmbedding)", detail: "Multilingual dense vectors, 1024 dim, fp16" },
      { name: "Groq · llama-3.3-70b-versatile", detail: "Streaming chat completions via SSE" },
    ],
  },
];

const DATA_FLOWS = [
  { from: "Browser", to: "FastAPI", payload: "POST /api/chat { messages, profile, command_mode, calibration }" },
  { from: "FastAPI", to: "BGE-M3", payload: "embed(query) → 1024-dim dense vector" },
  { from: "FastAPI", to: "ChromaDB", payload: "query_embeddings + where: page_type filter → top_k·4 candidates" },
  { from: "FastAPI", to: "Groq", payload: "messages: [system_prompt, …history], stream: true" },
  { from: "FastAPI", to: "Browser", payload: "SSE: sources event → delta events → [DONE]" },
];

function ArchitectureSection() {
  return (
    <>
      <ZoneShell
        eyebrow="Three tiers"
        title="Stack overview"
        caption="The browser holds state and renders. The server orchestrates. Storage and inference are the load-bearing externals. Each tier is independently runnable in dev."
        icon={<Layers className="h-3.5 w-3.5" aria-hidden />}
      >
        <ol className="space-y-3">
          {ARCH_TIERS.map((tier) => (
            <li key={tier.level} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
              <header className="mb-3 flex items-baseline gap-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  Tier {tier.level}
                </span>
                <span className="text-sm font-semibold text-slate-100">{tier.label}</span>
                <span className="text-[11px] text-slate-500">— {tier.responsibility}</span>
              </header>
              <ul className="grid gap-2 lg:grid-cols-2">
                {tier.components.map((component) => (
                  <li
                    key={component.name}
                    className="flex items-baseline gap-2 rounded-xl border border-white/8 bg-black/20 p-3 text-xs"
                  >
                    <code className="shrink-0 font-mono text-cyan-300">{component.name}</code>
                    <span className="text-[11px] text-slate-400">{component.detail}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </ZoneShell>

      <ZoneShell
        eyebrow="Data flows"
        title="Five edges between the tiers"
        caption="Every interaction in Aetheris reduces to these five edges. The SSE source event is special — it is emitted before any text delta, so attribution lands first."
        icon={<GitBranch className="h-3.5 w-3.5" aria-hidden />}
      >
        <div className="overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-xs">
            <thead className="bg-white/[0.03] text-[10px] uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">From</th>
                <th className="px-4 py-3 text-left font-semibold">To</th>
                <th className="px-4 py-3 text-left font-semibold">Payload shape</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {DATA_FLOWS.map((flow) => (
                <tr key={`${flow.from}-${flow.to}-${flow.payload}`}>
                  <td className="px-4 py-3 font-mono text-slate-200">{flow.from}</td>
                  <td className="px-4 py-3 font-mono text-slate-200">{flow.to}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-400">{flow.payload}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ZoneShell>

      <ZoneShell
        eyebrow="Dev commands"
        title="Three commands to run the system locally"
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <CommandPanel
            label="Frontend"
            command="npm run dev"
            detail="Vite dev server on port 5173 with HMR; /api proxied to :3333"
          />
          <CommandPanel
            label="Backend"
            command="GROQ_API_KEY=gsk_… npm start"
            detail="FastAPI + ChromaDB + BGE-M3 on port 3333; lifespan loads model at startup"
          />
          <CommandPanel
            label="Indexing"
            command="npm run index"
            detail="Full reindex: TSX → JSON chunks → ChromaDB. Or npm run watch-rag for incremental"
          />
        </div>
      </ZoneShell>
      <InfrastructureSection />
    </>
  );
}

function CommandPanel({ label, command, detail }: { label: string; command: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
      <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">{label}</h3>
      <code className="mb-3 block break-all rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-[11px] text-emerald-300">
        $ {command}
      </code>
      <p className="text-[11px] leading-relaxed text-slate-400">{detail}</p>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 2 — RAG pipeline walkthrough
// ──────────────────────────────────────────────────────────────────────────

interface RagStage {
  phase: "extraction" | "indexing" | "watch" | "serve";
  artefact: string;
  command?: string;
  description: string;
  output: string;
}

const RAG_STAGES: RagStage[] = [
  {
    phase: "extraction",
    artefact: "rag/extract_docs.py",
    command: "python rag/extract_docs.py",
    description:
      "Walks the TSX source tree (ComponentsPage, PatternsPage, TokensPage, …), parses each surface for documented blocks, and produces a JSON list of typed chunks. Each chunk carries title, text, page_type, source path.",
    output: "rag/chunks.json — 54 chunks at v2.1.0",
  },
  {
    phase: "indexing",
    artefact: "rag/setup_vectordb.py",
    command: "python rag/setup_vectordb.py",
    description:
      "Loads chunks.json, embeds each chunk with BAAI/bge-m3 dense mode, writes to ChromaDB with metadata. Idempotent — re-running reindexes the full corpus.",
    output: "rag/chroma_db/ — persistent Chroma collection 'aetheris_design_system'",
  },
  {
    phase: "watch",
    artefact: "rag/watch.py",
    command: "npm run watch-rag",
    description:
      "Watchdog observer on src/components/*Page.tsx — debounced 3s — re-runs extract + selective embed when a TSX surface saves. Used in dev to keep the corpus tracking the code.",
    output: "live incremental reindex; logs to stdout",
  },
  {
    phase: "serve",
    artefact: "rag/retrieval.py · retrieve_chunks",
    description:
      "At query time: embed query → ChromaDB cosine HNSW lookup filtered by intent page_type → apply per-perspective weight → apply vocabulary boost → sort by weighted_score → cut to top_k. Returns a list of chunks with the 6 attribution fields.",
    output: "chunks[]: { text, title, source, page_type, similarity, retrieval_weight, vocabulary_boost, weighted_score, retrieval_mode }",
  },
];

function RagSection() {
  return (
    <>
      <ZoneShell
        eyebrow="From TSX to retrievable chunk"
        title="The RAG pipeline, in four stages"
        caption="Extraction happens at build time. Indexing happens at deploy time. Watch happens in dev. Serve happens per request. Each stage has a single named script."
        icon={<Workflow className="h-3.5 w-3.5" aria-hidden />}
      >
        <ol className="space-y-3">
          {RAG_STAGES.map((stage) => (
            <li key={stage.artefact} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
              <div className="mb-3 flex flex-wrap items-baseline gap-3">
                <span className="text-[10px] uppercase tracking-widest text-slate-500">
                  Phase · {stage.phase}
                </span>
                <code className="rounded border border-white/10 bg-black/30 px-2 py-0.5 font-mono text-[11px] text-cyan-300">
                  {stage.artefact}
                </code>
                {stage.command ? (
                  <code className="rounded border border-emerald-300/20 bg-emerald-300/[0.04] px-2 py-0.5 font-mono text-[10px] text-emerald-300">
                    $ {stage.command}
                  </code>
                ) : null}
              </div>
              <p className="mb-3 text-sm leading-relaxed text-slate-300">{stage.description}</p>
              <div className="rounded-xl border border-white/8 bg-black/20 p-3">
                <div className="mb-1 text-[10px] uppercase tracking-widest text-slate-600">output</div>
                <code className="font-mono text-[11px] text-slate-300">{stage.output}</code>
              </div>
            </li>
          ))}
        </ol>
      </ZoneShell>

      <CrossRefPanel
        title="Same pipeline, another angle"
        links={[
          { to: "/reasoning", label: "Reasoning · Pipeline — conceptual overview" },
        ]}
      />
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 3 — AI infrastructure
// ──────────────────────────────────────────────────────────────────────────

interface InfraComponent {
  name: string;
  version: string;
  role: string;
  config: Array<{ key: string; value: string }>;
  doc?: string;
}

const INFRA: InfraComponent[] = [
  {
    name: "Groq",
    version: "llama-3.3-70b-versatile",
    role: "LLM inference. Streaming chat completions, OpenAI-compatible API surface, low TTFT.",
    config: [
      { key: "endpoint", value: "https://api.groq.com/openai/v1/chat/completions" },
      { key: "stream", value: "true" },
      { key: "max_tokens", value: "1800–3500 depending on mode" },
      { key: "timeout", value: "60s (httpx.AsyncClient)" },
    ],
  },
  {
    name: "BAAI/bge-m3",
    version: "via FlagEmbedding",
    role: "Multilingual dense embedding. 1024-dim vectors, supports dense / sparse / colbert; we use dense only.",
    config: [
      { key: "precision", value: "fp16" },
      { key: "dim", value: "1024" },
      { key: "load", value: "FastAPI lifespan startup (once)" },
      { key: "languages", value: "100+ via shared multilingual model" },
    ],
  },
  {
    name: "ChromaDB",
    version: "PersistentClient",
    role: "Local vector store. Cosine HNSW index, metadata filtering, full-collection scan for catalog mode.",
    config: [
      { key: "path", value: "rag/chroma_db/" },
      { key: "collection", value: "aetheris_design_system" },
      { key: "space", value: "cosine" },
      { key: "index", value: "hnsw" },
    ],
  },
  {
    name: "FastAPI",
    version: "lifespan-aware",
    role: "ASGI backend. /api/chat for streaming, /api/health for diagnostics, CORS open for dev.",
    config: [
      { key: "port", value: "3333" },
      { key: "runner", value: "uvicorn server:app --port 3333 --reload" },
      { key: "lifespan", value: "loads BGE-M3 + Chroma once at startup" },
    ],
  },
  {
    name: "SSE",
    version: "text/event-stream",
    role: "Server-sent events stream. Source attribution event before first delta, then incremental text deltas, then [DONE].",
    config: [
      { key: "events", value: "{ sources, intent, catalog_mode } · { delta } · [DONE]" },
      { key: "errors", value: "401 / 429 / 5xx wrapped as { error } event" },
      { key: "client", value: "src/beatrice/orchestrators/chat.orchestrator.ts · parseEventStream" },
    ],
  },
];

function InfrastructureSection() {
  return (
    <ZoneShell
      eyebrow="External dependencies"
      title="AI infrastructure"
      caption="Five named externals, each with a single responsibility. Versions and config are explicit — no implicit assumptions about which model or which index sits behind a layer."
      icon={<Cpu className="h-3.5 w-3.5" aria-hidden />}
    >
      <div className="space-y-3">
        {INFRA.map((component) => (
          <article
            key={component.name}
            className="rounded-2xl border border-white/8 bg-white/[0.02] p-5"
          >
            <header className="mb-3 flex flex-wrap items-baseline gap-3">
              <span className="text-sm font-semibold text-slate-100">{component.name}</span>
              <code className="rounded border border-white/10 bg-black/30 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                {component.version}
              </code>
            </header>
            <p className="mb-3 text-sm leading-relaxed text-slate-300">{component.role}</p>
            <dl className="grid gap-2 sm:grid-cols-2">
              {component.config.map((entry) => (
                <div key={entry.key} className="flex items-baseline gap-2 rounded-xl border border-white/8 bg-black/20 p-3 text-[11px]">
                  <dt className="shrink-0 font-mono text-slate-500">{entry.key}</dt>
                  <dd className="font-mono text-slate-300">{entry.value}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </ZoneShell>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 4 — Integration guides
// ──────────────────────────────────────────────────────────────────────────

const INTEGRATION_SNIPPETS = [
  {
    label: "POST /api/chat (curl)",
    body: `curl -N -X POST http://localhost:3333/api/chat \\
  -H 'Content-Type: application/json' \\
  -d '{
    "messages": [{ "role": "user", "content": "Which component for inline form validation?" }],
    "profile": "a11y",
    "command_mode": null,
    "calibration": { "depth": "high", "technicality": 0.7, "risk_sensitivity": 0.8 }
  }'`,
  },
  {
    label: "Reading the SSE stream (frontend)",
    body: `import { runPerspectiveTrial } from "@/beatrice/services/perspectiveTrial.service";

const result = await runPerspectiveTrial({
  query: "Which component for inline form validation?",
  profileId: "a11y",
  onDelta: (text) => console.log("partial:", text),
  onSources: (sources, intent) => console.log("evidence:", { sources, intent }),
});

console.log("final:", result.text);`,
  },
  {
    label: "Using the perspective context",
    body: `import { usePersonaContext } from "@/beatrice/hooks/usePersonaContext";

function Component() {
  const { profileId, activePersonaContext, setProfileId } = usePersonaContext();
  // activePersonaContext is the localized PersonaStrategy for the active lens
  // setProfileId persists and updates retrieval weighting + prompt adaptation
}`,
  },
  {
    label: "Calibration override (persisted per lens)",
    body: `import { writeCalibration, readCalibration } from "@/beatrice/domain/perspective";

writeCalibration("a11y", { depth: "high", technicality: 0.7, risk_sensitivity: 0.85 });
// All subsequent /api/chat calls under the a11y lens send this calibration.

const current = readCalibration("a11y");
// returns null if the lens is using defaults, else the persisted override.`,
  },
];

function IntegrationSection() {
  return (
    <ZoneShell
      eyebrow="Integration guides"
      title="Four ways to talk to the system"
      caption="The same /api/chat endpoint underpins every surface — from the chat to the perspective trial to a curl from your terminal. Calibration and perspective flow as payload fields, not auth headers."
      icon={<FileCode className="h-3.5 w-3.5" aria-hidden />}
    >
      <div className="space-y-3">
        {INTEGRATION_SNIPPETS.map((snippet) => (
          <article
            key={snippet.label}
            className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]"
          >
            <header className="border-b border-white/8 bg-white/[0.03] px-4 py-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                {snippet.label}
              </span>
            </header>
            <pre className="overflow-x-auto bg-black/40 p-4 font-mono text-[11px] leading-relaxed text-slate-300">
              {snippet.body}
            </pre>
          </article>
        ))}
      </div>
    </ZoneShell>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 5 — Corpus intelligence (real /api/health + page_type breakdown)
// ──────────────────────────────────────────────────────────────────────────

// Approximate breakdown from rag/extract_docs.py v2.1.0 — for context only.
// The total chunk count below is read live from /api/health.
const PAGE_TYPE_PROFILE = [
  { page_type: "component", source: "ComponentsPage.tsx", expected: 22, role: "implementable primitives" },
  { page_type: "xai_component", source: "ComponentsPage.tsx (XAI components)", expected: 3, role: "explanation-aware variants" },
  { page_type: "pattern", source: "PatternsPage.tsx", expected: 11, role: "interaction logic" },
  { page_type: "token", source: "TokensPage.tsx", expected: 88, role: "canonical design contracts" },
  { page_type: "token_alias", source: "TokensPage.tsx", expected: 16, role: "semantic reuse contracts" },
  { page_type: "design_decision", source: "DesignDecisionsPage.tsx", expected: 4, role: "governance memory" },
  { page_type: "dev_integration", source: "DevIntegrationPage.tsx", expected: 2, role: "developer entry" },
];

function CorpusSection() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);

  useEffect(() => {
    fetchHealthData()
      .then((data) => {
        if (data) setHealth(data);
        else setHealthError("Backend reachable but returned no payload");
      })
      .catch(() => setHealthError("Backend unreachable — start uvicorn on :3333"));
  }, []);

  const expectedTotal = PAGE_TYPE_PROFILE.reduce((sum, row) => sum + row.expected, 0);
  const totalChunks = health?.corpus_chunks ?? expectedTotal;

  return (
    <>
      <ZoneShell
        eyebrow="Live diagnostics"
        title="Corpus health"
        caption="Total chunks and embedder status come from /api/health in real time. Per-page-type breakdown is the expected profile from the extractor at v2.1.0 — if the live count diverges, the corpus has drifted from the source."
        icon={<Database className="h-3.5 w-3.5" aria-hidden />}
      >
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <HealthMetric
            label="corpus_chunks"
            value={totalChunks.toString()}
            detail={health ? "live" : healthError ? "from extractor profile" : "loading…"}
          />
          <HealthMetric
            label="rag_active"
            value={health ? (health.rag_active ? "yes" : "no") : "—"}
            detail={health?.embedder ?? "—"}
          />
          <HealthMetric
            label="extraction"
            value={`${PAGE_TYPE_PROFILE.length} page_types`}
            detail={`expected ${expectedTotal} chunks`}
          />
        </div>

        {healthError ? (
          <div className="mb-4 rounded-2xl border border-amber-300/20 bg-amber-300/[0.04] p-4 text-xs text-amber-200">
            <strong className="text-amber-300">/api/health unreachable.</strong> The numbers below are
            the extractor's expected profile, not live. Start the backend to see real counts.
          </div>
        ) : null}

        <div className="overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-xs">
            <thead className="bg-white/[0.03] text-[10px] uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">page_type</th>
                <th className="px-4 py-3 text-left font-semibold">source</th>
                <th className="px-4 py-3 text-right font-semibold">expected</th>
                <th className="px-4 py-3 text-left font-semibold">cognitive role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {PAGE_TYPE_PROFILE.map((row) => (
                <tr key={row.page_type}>
                  <td className="px-4 py-3 font-mono text-cyan-300">{row.page_type}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-400">{row.source}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-300">{row.expected}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-400">{row.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ZoneShell>

      <ZoneShell
        eyebrow="Gap detection"
        title="What absence in the corpus means"
        caption="A missing page_type is a missing knowledge family. The retrieval pipeline silently filters to none — which surfaces as low-confidence or refusal at the reasoning layer."
      >
        <ul className="space-y-2 text-xs text-slate-400">
          <li className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
            <strong className="text-slate-200">No chunks of a page_type ≠ no source.</strong> The
            extractor may have skipped a TSX surface; run <code className="rounded border border-white/10 bg-black/30 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">npm run index</code> after adding documented blocks.
          </li>
          <li className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
            <strong className="text-slate-200">Health says rag_active=false.</strong> FlagEmbedding
            failed to import. Install: <code className="rounded border border-white/10 bg-black/30 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">pip install FlagEmbedding</code>
          </li>
          <li className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
            <strong className="text-slate-200">Live count drifts from expected profile.</strong> The
            source code added or removed documented blocks. Either reindex or update the
            PAGE_TYPE_PROFILE constant in this file.
          </li>
        </ul>
      </ZoneShell>
      <InspectorSection />
      <ZoneShell
        eyebrow="Live trace"
        title="Real-time reasoning trace"
        caption="Watch the oracle's intent, retrieval and confidence signals update live as it responds. Same data the chat surface uses — exposed here as a dev diagnostic."
        icon={<ScanSearch className="h-3.5 w-3.5" aria-hidden />}
      >
        <Suspense fallback={<SectionSkeleton />}>
          <ReasoningLiveTrace />
        </Suspense>
      </ZoneShell>
    </>
  );
}

function HealthMetric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
      <div className="mb-1 text-[10px] uppercase tracking-widest text-slate-500">{label}</div>
      <div className="font-mono text-xl text-slate-100">{value}</div>
      <div className="mt-1 text-[10px] text-slate-500">{detail}</div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 6 — Inspector (live retrieval against /api/chat)
// ──────────────────────────────────────────────────────────────────────────

function InspectorSection() {
  const { profileId } = usePersonaContext();
  const [query, setQuery] = useState("Why was SideDrawer chosen for mobile checkout?");
  const [sources, setSources] = useState<SourceChip[] | null>(null);
  const [intent, setIntent] = useState<string | undefined>(undefined);
  const [responseText, setResponseText] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error" | "stopped">("idle");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const run = async () => {
    if (!query.trim()) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setSources(null);
    setIntent(undefined);
    setResponseText("");
    setError(null);
    setStatus("running");

    try {
      await runPerspectiveTrial({
        query: query.trim(),
        profileId,
        signal: controller.signal,
        onDelta: setResponseText,
        onSources: (next, nextIntent) => {
          setSources(next ?? null);
          setIntent(nextIntent);
        },
      });
      if (!controller.signal.aborted) setStatus("done");
    } catch (err) {
      if (controller.signal.aborted) return;
      setStatus("error");
      setError(err instanceof Error ? err.message : "unknown");
    }
  };

  const stop = () => {
    abortRef.current?.abort();
    setStatus("stopped");
  };

  return (
    <>
      <ZoneShell
        eyebrow="Live retrieval debug"
        title="Inspector"
        caption="Hits /api/chat with the active perspective, collects the SSE sources event, and renders the full chunk attribution. The same payload your chat surfaces consume."
        icon={<ScanSearch className="h-3.5 w-3.5" aria-hidden />}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (status !== "running") void run();
          }}
          className="mb-4 flex items-stretch gap-2 rounded-2xl border border-white/10 bg-black/30 p-2"
        >
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type a query to inspect retrieval"
            disabled={status === "running"}
            aria-label="Inspector query"
            className="flex-1 bg-transparent px-3 py-2 font-mono text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none disabled:opacity-50"
          />
          {status === "running" ? (
            <button
              type="button"
              onClick={stop}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-200 hover:border-white/30"
            >
              <Square className="h-3 w-3" aria-hidden />
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!query.trim()}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/15 px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/25 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Play className="h-3 w-3" aria-hidden />
              Inspect
            </button>
          )}
        </form>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 lg:col-span-1">
            <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
              Request state
            </h3>
            <dl className="space-y-2 text-[11px]">
              <Row k="perspective" v={profileId} />
              <Row k="status" v={status} />
              <Row k="intent" v={intent ?? "—"} />
              <Row k="sources" v={sources ? String(sources.length) : "0"} />
              {error ? <Row k="error" v={error} tone="text-rose-300" /> : null}
            </dl>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 lg:col-span-2">
            <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
              Source chunks
            </h3>
            {sources && sources.length > 0 ? (
              <ol className="space-y-2">
                {sources.map((chunk, index) => (
                  <li key={`${chunk.title}-${index}`} className="rounded-xl border border-white/8 bg-black/20 p-3 text-[11px]">
                    <div className="mb-1 flex flex-wrap items-baseline gap-2">
                      <span className="font-mono text-slate-500">#{index + 1}</span>
                      <span className="text-slate-200">{chunk.title || "(untitled)"}</span>
                      {chunk.page_type ? (
                        <code className="rounded border border-cyan-300/20 bg-cyan-300/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-cyan-300">
                          {chunk.page_type}
                        </code>
                      ) : null}
                    </div>
                    <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-slate-400">
                      <span>sim {chunk.similarity.toFixed(3)}</span>
                      <span>w ×{chunk.retrieval_weight?.toFixed(2) ?? "1.00"}</span>
                      <span>score {chunk.weighted_score?.toFixed(3) ?? "—"}</span>
                    </div>
                    {chunk.source ? (
                      <div className="mt-2 truncate text-[10px] text-slate-600">{chunk.source}</div>
                    ) : null}
                  </li>
                ))}
              </ol>
            ) : (
              <div className="flex h-32 items-center justify-center text-[11px] text-slate-600">
                {status === "running" ? "waiting for source event…" : "run an inspection to see retrieved chunks"}
              </div>
            )}
          </div>
        </div>

        {responseText ? (
          <div className="mt-4 rounded-2xl border border-white/8 bg-black/20 p-4">
            <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
              Response (raw)
            </h3>
            <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-slate-300">
              {responseText}
            </pre>
          </div>
        ) : null}
      </ZoneShell>

      <CrossRefPanel
        title="For perspective-aware comparison instead"
        links={[
          { to: "/perspectives", label: "Perspectives · live trial (two lenses in parallel)" },
        ]}
      />
    </>
  );
}

function Row({ k, v, tone }: { k: string; v: string; tone?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-white/5 pb-1 last:border-0">
      <dt className="font-mono text-slate-500">{k}</dt>
      <dd className={`truncate font-mono ${tone ?? "text-slate-300"}`}>{v}</dd>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Shared shells
// ──────────────────────────────────────────────────────────────────────────

function ZoneShell({
  eyebrow,
  title,
  caption,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  caption?: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="content-section">
      <header className="mb-4 flex items-baseline gap-3">
        <span className="section-eyebrow">
          {icon ?? <Server className="h-3.5 w-3.5" aria-hidden />}
          {eyebrow}
        </span>
      </header>
      <h2 className="section-h2">{title}</h2>
      {caption ? <p className="section-lead">{caption}</p> : null}
      {children}
    </section>
  );
}

function CrossRefPanel({ title, links }: { title: string; links: Array<{ to: string; label: string }> }) {
  return (
    <section className="mb-14 content-card">
      <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-300 transition-colors hover:border-white/30 hover:text-white"
          >
            <Activity className="h-3 w-3" aria-hidden />
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

function SectionSkeleton() {
  return (
    <div className="section-skeleton">
      <div className="section-skeleton-inner">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary" aria-hidden />
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
            Loading section
          </span>
        </div>
      </div>
    </div>
  );
}
