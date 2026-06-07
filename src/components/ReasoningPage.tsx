// ||| Phase IB · /reasoning — cognitive pipeline surface
// Public documentation for Beatrice's two capability types plus the end-to-end
// cognitive pipeline.

import { useState } from "react";
import type { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Blocks,
  BookOpenCheck,
  BrainCircuit,
  ChevronDown,
  Code2,
  Compass,
  Database,
  FileCheck2,
  Filter,
  Gauge,
  History,
  Layers,
  Lightbulb,
  Link2,
  Network,
  PackageSearch,
  Palette,
  Scale,
  ShieldCheck,
  Sparkles,
  Search,
  Telescope,
  Users,
  Wrench,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  AUTOMATIC_SKILLS,
  ORACLE_COMMANDS,
} from "../beatrice/domain/governance";
import type { CapabilityDefinition } from "../beatrice/domain/governance";
import type { CognitiveFlowStep } from "../types/oracle";
import { CognitiveFlow } from "./oracle/CognitiveFlow";

// ──────────────────────────────────────────────────────────────────────────
// Section model — 4 final sections per spec
// ──────────────────────────────────────────────────────────────────────────

type FocusId = "overview" | "skills" | "commands" | "pipeline";

interface SectionMeta {
  id: FocusId;
  label: string;
  role: string;
  icon: typeof BrainCircuit;
}

const SECTIONS: SectionMeta[] = [
  { id: "overview", label: "Overview", role: "Beatrice cognition", icon: Sparkles },
  { id: "skills", label: "Habilidades da Beatrice", role: "Ativação automática", icon: Lightbulb },
  { id: "commands", label: "Comandos do Oráculo", role: "Ações e modos acionáveis", icon: Wrench },
  { id: "pipeline", label: "Pipeline", role: "9 stages", icon: Workflow },
];

// ──────────────────────────────────────────────────────────────────────────
// Intelligence data — from IntelligencePage (merged here per spec)
// ──────────────────────────────────────────────────────────────────────────

const CAPABILITY_ICONS: Record<string, LucideIcon> = {
  "pattern-exploration": Telescope,
  "architecture-analysis": Layers,
  "interaction-guardrail": ShieldCheck,
  "design-system-governance-check": FileCheck2,
  "component-fit-analysis": PackageSearch,
  "component-misuse-detection": AlertTriangle,
  "token-impact-analysis": Palette,
  "design-to-code-contract-check": Code2,
  "implementation-planning": Workflow,
  "trade-off-analysis": Scale,
  "systems-thinking": Network,
  "risk-assessment": Gauge,
  memory: History,
  decision: Search,
  perspectives: Users,
  audit: Activity,
  "knowledge-gap": BookOpenCheck,
  "governance-impact": Blocks,
  "principle-conflict": Scale,
  "adoption-friction": AlertTriangle,
  "oracle-council": Users,
  enforce: ShieldCheck,
  migrate: Workflow,
  capture: Database,
  document: BookOpenCheck,
  "token-impact": Palette,
  "contract-check": Code2,
  "feedback-review": FileCheck2,
};

const FLOW_IDS = [
  "question",
  "intent",
  "skill",
  "retrieval",
  "attribution",
  "calibration",
  "synthesis",
  "answer",
] as const;

// ──────────────────────────────────────────────────────────────────────────
// Page root
// ──────────────────────────────────────────────────────────────────────────

export function ReasoningPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedFocus = searchParams.get("focus");
  const focus = requestedFocus === "engines"
    ? "commands"
    : (requestedFocus as FocusId | null) ?? "overview";
  const active = SECTIONS.find((section) => section.id === focus) ?? SECTIONS[0];

  const updateFocus = (next: FocusId) => {
    if (next === "overview") {
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
        {active.id === "overview" ? <OverviewSection onJump={updateFocus} /> : null}
        {active.id === "skills" ? <SkillsSection /> : null}
        {active.id === "commands" ? <CommandsSection /> : null}
        {active.id === "pipeline" ? <PipelineSection /> : null}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Hero
// ──────────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <header className="page-hero">
      <div className="page-eyebrow">
        <BrainCircuit className="h-3.5 w-3.5" aria-hidden />
        Cognitive pipeline
      </div>
      <h1 className="page-h1">
        How Beatrice <em className="not-italic text-primary">actually thinks</em>.
      </h1>
      <p className="page-lead">
        A Beatrice combina dois tipos de capacidade: habilidades internas que ela aplica
        automaticamente e comandos acionáveis que o usuário chama com <code>/</code>.
        Cada capacidade declara quando atua, o que produz e quais evidências sustentam a resposta.
      </p>
    </header>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Section nav
// ──────────────────────────────────────────────────────────────────────────

function SectionNav({ active, onChange }: { active: FocusId; onChange: (next: FocusId) => void }) {
  const { t } = useI18n();
  return (
    <nav aria-label="Reasoning sections" className="flex flex-wrap gap-2">
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
            <span className="font-semibold">{t(`pages.reasoning.sections.${section.id}.label`)}</span>
            <span className="hidden text-[10px] uppercase tracking-widest opacity-50 sm:inline">
              {t(`pages.reasoning.sections.${section.id}.role`)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 1 — Overview (cognitive flow + navigation to skills/engines/pipeline)
// ──────────────────────────────────────────────────────────────────────────

function OverviewSection({ onJump }: { onJump: (next: FocusId) => void }) {
  const { t } = useI18n();
  const P = "pages.intelligence";

  const flow: CognitiveFlowStep[] = FLOW_IDS.map((id) => ({
    label: t(`${P}.flow.steps.${id}.label`),
    detail: t(`${P}.flow.steps.${id}.detail`),
  }));

  return (
    <>
      <ZoneShell
        eyebrow="Cognitive architecture"
        title="How a question becomes an explainable answer"
        caption="The path every question travels — from interpretation to a response delivered together with its sources and confidence. Each step is a named codebase artifact."
        icon={<Sparkles className="h-3.5 w-3.5" aria-hidden />}
      >
        <div className="content-card">
          <CognitiveFlow steps={flow} />
        </div>
      </ZoneShell>

      <ZoneShell
        eyebrow="What makes Beatrice different"
        title="Architecture, not magic"
        caption="A generic LLM answers from broad parametric knowledge. Beatrice constrains generation through retrieved design-system documentation and exposes the reasoning evidence through source attribution and confidence calibration."
        icon={<Scale className="h-3.5 w-3.5" aria-hidden />}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Domain specificity", body: "Reasons inside the Aetheris design system" },
            { label: "Retrieved documentation", body: "Answers constrained by the corpus" },
            { label: "Cited sources", body: "Every claim is traceable" },
            { label: "Confidence score", body: "Uncertainty calibrated from retrieval" },
            { label: "Classified intent", body: "The interpretation is explicit" },
            { label: "Persona adaptation", body: "Depth and focus fit the active lens" },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
              <div className="mb-2 text-xs font-semibold text-slate-100">{card.label}</div>
              <p className="text-[11px] leading-relaxed text-slate-400">{card.body}</p>
            </div>
          ))}
        </div>
      </ZoneShell>

      <ZoneShell
        eyebrow="What to explore"
        title="Dois tipos de capacidade"
        caption="A Beatrice escolhe as habilidades. O usuário escolhe os comandos. O pipeline conecta ambos à evidência e à explicabilidade."
      >
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { id: "skills" as FocusId, label: "Habilidades da Beatrice", icon: <Lightbulb className="h-4 w-4" aria-hidden />, body: "Capacidades internas, detectadas por intenção e aplicadas sem comando manual." },
            { id: "commands" as FocusId, label: "Comandos do Oráculo", icon: <Wrench className="h-4 w-4" aria-hidden />, body: "Ações operacionais e modos investigativos que o usuário aciona com / no chat." },
            { id: "pipeline" as FocusId, label: "Pipeline", icon: <Workflow className="h-4 w-4" aria-hidden />, body: "Nove etapas verificáveis, da interpretação da pergunta à resposta com fontes e confiança." },
          ].map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => onJump(card.id)}
              className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 text-left transition-colors hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="mb-2 flex items-center gap-2 text-primary">{card.icon}<span className="text-sm font-semibold text-slate-100">{card.label}</span></div>
              <p className="text-[11px] leading-relaxed text-slate-400">{card.body}</p>
              <div className="mt-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                <span>Open</span>
                <ArrowRight className="h-3 w-3" aria-hidden />
              </div>
            </button>
          ))}
        </div>
      </ZoneShell>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 2 — Beatrice skills
// ──────────────────────────────────────────────────────────────────────────

function SkillsSection() {
  return (
    <ZoneShell
      eyebrow="Ativação automática"
      title="Habilidades da Beatrice"
      caption="A Beatrice ativa estas habilidades automaticamente ao interpretar a intenção, o contexto e o tipo de problema apresentado pelo usuário. Elas funcionam como comportamentos internos de análise, permitindo que o oráculo recomende componentes, detecte mau uso, avalie acessibilidade, verifique impacto de tokens e identifique riscos de governança sem exigir comandos manuais."
      icon={<Sparkles className="h-3.5 w-3.5" aria-hidden />}
    >
      <div className="mb-5 rounded-2xl border border-primary/15 bg-primary/[0.05] p-4 shadow-[0_0_32px_rgba(169,153,198,0.06)]">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <Lightbulb className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-semibold text-slate-100">Aplicada pela Beatrice</p>
            <p className="mt-1 text-xs leading-6 text-slate-400">
              O usuário não precisa chamar essas habilidades diretamente. Elas são combinadas pela Beatrice conforme a pergunta exige.
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {AUTOMATIC_SKILLS.map((skill) => (
          <SkillCard key={skill.id} capability={skill} />
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.02] p-4 text-xs leading-6 text-slate-400">
        <strong className="text-slate-200">Auditabilidade:</strong> a interface pode mostrar quais habilidades foram aplicadas, o motivo e a confiança. Retrieval Deep Dive continua sendo um mecanismo interno e não aparece como habilidade pública.
      </div>
    </ZoneShell>
  );
}

function CommandsSection() {
  return (
    <ZoneShell
      eyebrow="Ações e modos acionáveis"
      title="Comandos do Oráculo"
      caption="Use comandos do oráculo quando quiser direcionar explicitamente a Beatrice. Alguns comandos executam ações operacionais, como validar, migrar ou capturar evidências. Outros ativam modos investigativos, como recuperar memória institucional, reconstruir decisões, sintetizar perspectivas ou auditar fontes, lacunas e confiança."
      icon={<Wrench className="h-3.5 w-3.5" aria-hidden />}
    >
      <p className="-mt-3 mb-5 text-xs leading-6 text-slate-400">
        Diferente das habilidades automáticas, os comandos precisam ser acionados manualmente no chat usando <code className="text-primary">/</code>.
      </p>

      <CommandHowTo />

      <div className="mb-4 flex flex-wrap gap-2">
        <CategoryLegend
          label="Ação operacional"
          description="Executa uma tarefa concreta e retorna um artefato, validação ou transformação."
          tone="primary"
        />
        <CategoryLegend
          label="Modo investigativo"
          description="Orienta o raciocínio da Beatrice para uma análise profunda e explicável."
          tone="secondary"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ORACLE_COMMANDS.map((command) => (
          <CommandCard key={command.id} capability={command} />
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.02] p-4 text-xs leading-6 text-slate-400">
        <strong className="text-slate-200">Compatibilidade:</strong> os nomes canônicos longos continuam funcionando. Os aliases antigos <code>/history</code>, <code>/why</code>, <code>/score</code> e <code>/simulate</code> também permanecem disponíveis como fallback.
      </div>
    </ZoneShell>
  );
}

function SkillCard({ capability }: { capability: CapabilityDefinition }) {
  const Icon = CAPABILITY_ICONS[capability.id] ?? BrainCircuit;

  return (
    <article
      className="content-card h-full"
      title="Ativada automaticamente quando a Beatrice identifica essa necessidade na pergunta."
    >
      <div className="mb-3 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <h3 className="font-serif text-base font-semibold text-white">{capability.name}</h3>
          <p className="mt-1 inline-flex rounded-full border border-primary/15 bg-primary/[0.06] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-primary">
            Auto · Detectada por intenção
          </p>
        </div>
      </div>

      <p className="mb-3 text-sm leading-6 text-slate-400">{capability.description}</p>
      <CapabilityField label="Ativada quando" value={capability.activation} />
      <CapabilityField label="Saída esperada" value={capability.output} />
      <CapabilityField label="Pode combinar com" value={capability.combinesWith} />
      <CapabilityField label="Evidência RAG" value={capability.ragEvidence} />
    </article>
  );
}

function CommandCard({ capability }: { capability: CapabilityDefinition }) {
  const Icon = CAPABILITY_ICONS[capability.id] ?? Wrench;
  const isOperational = capability.type === "Ação operacional";
  const accent = isOperational ? "text-primary" : "text-secondary";
  const badgeClass = isOperational
    ? "border-primary/20 bg-primary/[0.07] text-primary"
    : "border-secondary/20 bg-secondary/[0.07] text-secondary";

  return (
    <article
      className="content-card h-full"
      title="Acione manualmente no chat usando este comando."
    >
      <div className="mb-3 flex items-start gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] ${accent}`}>
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-base font-semibold text-white">{capability.name}</h3>
            {capability.experimental ? (
              <span className="rounded-full border border-fuchsia-300/20 bg-fuchsia-300/[0.06] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-fuchsia-300">
                Experimental
              </span>
            ) : null}
          </div>
          <code className={`mt-1.5 inline-block font-mono text-xs font-semibold ${accent}`}>
            {capability.command}
          </code>
        </div>
      </div>

      <span className={`mb-3 inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] ${badgeClass}`}>
        {capability.type}
      </span>
      <p className="mb-3 text-sm leading-6 text-slate-400">{capability.description}</p>
      <CapabilityField label="Quando usar" value={capability.activation} />
      <CapabilityField label="Entrada exemplo" value={capability.example} mono />
      <CapabilityField label="Saída esperada" value={capability.output} />
      <CapabilityField label="Evidência RAG" value={capability.ragEvidence} />
      <CapabilityField label="Combina com habilidades" value={capability.combinesWith} />
      {capability.canonicalCommand ? (
        <CapabilityField label="Contrato canônico" value={capability.canonicalCommand} mono />
      ) : null}
    </article>
  );
}

function CommandHowTo() {
  const examples = [
    '/enforce <Button color="red">Delete</Button>',
    "/migrate LegacyDrawer → Drawer",
    "/capture [cole uma discussão de PR ou decisão de produto]",
    "/memory O que já foi decidido sobre o uso de modais em ações destrutivas?",
    "/decision Por que usamos Toast em vez de Alert para feedback não bloqueante?",
    "/perspectives Compare essa decisão do ponto de vista de design, frontend e QA.",
    "/audit Mostre as fontes, lacunas e nível de confiança desta recomendação.",
  ];

  return (
    <div
      data-testid="command-how-to"
      className="mb-6 overflow-hidden rounded-2xl border border-primary/20 bg-[linear-gradient(135deg,rgba(169,153,198,0.09),rgba(255,255,255,0.02))] shadow-[0_0_40px_rgba(169,153,198,0.08)]"
    >
      <div className="border-b border-white/[0.07] p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <Wrench className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <h3 className="font-serif text-lg font-semibold text-white">Como acionar um comando</h3>
            <p className="mt-1 text-sm leading-6 text-slate-300">
              No chat da Beatrice, digite <code className="text-primary">/</code> e escolha um comando disponível. Depois, escreva a pergunta, o contexto ou o artefato que deseja analisar.
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Comandos funcionam como atalhos explícitos de raciocínio ou ação. Eles ajudam quando você quer controlar o tipo de resposta que a Beatrice deve produzir.
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-px bg-white/[0.05] md:grid-cols-2">
        {examples.map((example) => (
          <code key={example} className="bg-surface-container-highest/90 px-4 py-3 font-mono text-[10px] leading-5 text-primary/85">
            {example}
          </code>
        ))}
      </div>
    </div>
  );
}

function CategoryLegend({
  label,
  description,
  tone,
}: {
  label: string;
  description: string;
  tone: "primary" | "secondary";
}) {
  const classes = tone === "primary"
    ? "border-primary/15 bg-primary/[0.05] text-primary"
    : "border-secondary/15 bg-secondary/[0.05] text-secondary";

  return (
    <div className={`rounded-xl border px-3 py-2 ${classes}`} title={description}>
      <p className="text-[9px] font-bold uppercase tracking-[0.14em]">{label}</p>
      <p className="mt-1 max-w-sm text-[10px] leading-4 text-slate-500">{description}</p>
    </div>
  );
}

function CapabilityField({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="border-t border-white/[0.06] py-2.5 first:border-t-0">
      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-600">{label}</p>
      <p className={`mt-1 text-[11px] leading-5 text-slate-300 ${mono ? "font-mono text-[10px] text-primary/80" : ""}`}>{value}</p>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 4 — Full reasoning pipeline (9 stages, expandable)
// Confidence calibration is internal to this section (not a separate tab).
// ──────────────────────────────────────────────────────────────────────────

interface PipelineStage {
  step: number;
  label: string;
  input: string;
  output: string;
  artefact: string;
  detail: string;
  group: "ingest" | "retrieve" | "synthesize" | "explain";
}

const PIPELINE: PipelineStage[] = [
  {
    step: 1,
    label: "Query ingestion",
    input: "user message + conversation history + active perspective + calibration",
    output: "normalized PromptBuildContext",
    artefact: "server.py · chat handler",
    detail:
      "The /api/chat endpoint trims history to the last 16 messages, sanitizes the calibration override, parses any /command prefix, and constructs a PromptBuildContext that carries the full state into the pipeline.",
    group: "ingest",
  },
  {
    step: 2,
    label: "Intent classification",
    input: "the user query (string)",
    output: "{ retrieval_intent, response_intent, top_k, catalog_mode }",
    artefact: "prompts/intent_router.py · route_query",
    detail:
      "Catalog mode is detected first (structural list queries). Otherwise command_mode overrides the intent. Otherwise a keyword-frequency vote across 7 intent vocabularies selects the highest-scoring intent — or 'general' if no signal.",
    group: "ingest",
  },
  {
    step: 3,
    label: "Embedding generation",
    input: "the query string",
    output: "1024-dim dense vector",
    artefact: "FlagEmbedding · BAAI/bge-m3",
    detail:
      "BAAI/bge-m3 produces a multilingual dense embedding (1024 dimensions) at fp16 precision. Loaded once at server startup via the FastAPI lifespan handler so requests pay no model load cost.",
    group: "retrieve",
  },
  {
    step: 4,
    label: "Vector retrieval",
    input: "query vector + page_type filter",
    output: "top_k * 4 candidate chunks",
    artefact: "rag/retrieval.py · retrieve_chunks",
    detail:
      "ChromaDB HNSW lookup against the persistent corpus. Filtered first by intent-derived page_type (component, pattern, token, design_decision, …). If filtered retrieval returns nothing, a fallback unfiltered query runs to avoid empty contexts.",
    group: "retrieve",
  },
  {
    step: 5,
    label: "Similarity ranking",
    input: "candidate chunks + perspective + vocabulary",
    output: "ranked top_k chunks",
    artefact: "PROFILE_RETRIEVAL_WEIGHTS · _vocabulary_boost",
    detail:
      "Each chunk receives weighted_score = similarity × retrieval_weight × vocabulary_boost. The vocabulary boost is capped at +20% to prevent keyword overfit. Chunks sort by weighted_score, then raw similarity as tiebreaker.",
    group: "retrieve",
  },
  {
    step: 6,
    label: "Context assembly",
    input: "ranked chunks + intent + perspective state",
    output: "RAG context block (markdown)",
    artefact: "rag/context_builder.py · build_rag_context",
    detail:
      "The selected chunks are composed into a prompt-ready evidence block preserving page_type, source, and similarity per chunk. Catalog mode emits a fuller registry block; commands inject command-specific framing.",
    group: "synthesize",
  },
  {
    step: 7,
    label: "Response synthesis",
    input: "RAG context + cognitive profile + runtime frame + system layers",
    output: "Groq messages payload",
    artefact: "prompts/prompt_builder.py · build_system_prompt",
    detail:
      "Stacks 8 prompt layers: system layers (core/identity/orchestration/retrieval-policy/anti-patterns/response-rules), runtime frame, cognitive context, intent prompt, response template, cognitive profile, dialogue, RAG context. Sent to Groq llama-3.3-70b-versatile with streaming on.",
    group: "synthesize",
  },
  {
    step: 8,
    label: "XAI attribution",
    input: "ranked chunks (pre-LLM)",
    output: "SSE 'sources' event before text",
    artefact: "server.py · streaming handler",
    detail:
      "Source chips are emitted as the first SSE event — before the first text delta arrives. The frontend renders attribution as a first-class audit surface, not a post-hoc footnote.",
    group: "explain",
  },
  {
    step: 9,
    label: "Confidence calibration",
    input: "cognitive profile · trust_calibration_style",
    output: "structured confidence in response body",
    artefact: "prompts/cognitive_profiles.py · _trust_calibration_contract",
    detail:
      "The active lens enforces one of three confidence styles: quantified (numeric), qualitative (hedged), or comparative (relative to a precedent). The contract is injected as part of the system prompt; the model is bound to it.",
    group: "explain",
  },
];

function groupAccent(group: PipelineStage["group"]): string {
  switch (group) {
    case "ingest": return "#fcd34d";
    case "retrieve": return "#67e8f9";
    case "synthesize": return "#c4b5fd";
    case "explain": return "#86efac";
  }
}

function PipelineSection() {
  const [openStep, setOpenStep] = useState<number | null>(null);
  return (
    <ZoneShell
      eyebrow="Full pipeline"
      title="Nine stages, end to end"
      caption="Each stage takes a structured input, produces a structured output, and lives in a named codebase artifact. Click a stage to read its role. Confidence calibration (stage 9) is internal to the pipeline — not a separate section."
      icon={<Network className="h-3.5 w-3.5" aria-hidden />}
      variant="xai"
    >
      <ol className="space-y-2">
        {PIPELINE.map((stage) => {
          const isOpen = openStep === stage.step;
          const accent = groupAccent(stage.group);
          return (
            <li key={stage.step}>
              <button
                type="button"
                onClick={() => setOpenStep(isOpen ? null : stage.step)}
                aria-expanded={isOpen}
                className="w-full rounded-2xl border border-white/8 bg-white/[0.02] p-5 text-left transition-colors hover:bg-white/[0.04]"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border font-mono text-xs"
                    style={{ borderColor: accent, color: accent }}
                  >
                    {String(stage.step).padStart(2, "0")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-3">
                      <span className="text-sm font-semibold text-slate-100">{stage.label}</span>
                      <code className="rounded border border-white/10 bg-black/30 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                        {stage.artefact}
                      </code>
                      <span className="text-[10px] uppercase tracking-widest" style={{ color: accent }}>
                        {stage.group}
                      </span>
                    </div>
                    <div className="mt-2 grid gap-2 text-[11px] sm:grid-cols-[auto_1fr] sm:gap-x-4">
                      <span className="text-slate-500">in:</span>
                      <span className="font-mono text-slate-400">{stage.input}</span>
                      <span className="text-slate-500">out:</span>
                      <span className="font-mono text-slate-400">{stage.output}</span>
                    </div>
                    {isOpen ? (
                      <p className="mt-3 text-xs leading-relaxed text-slate-300">{stage.detail}</p>
                    ) : null}
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </ZoneShell>
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
  variant,
}: {
  eyebrow: string;
  title: string;
  caption?: string;
  icon?: ReactNode;
  children: ReactNode;
  variant?: "xai";
}) {
  return (
    <section className={`content-section${variant === "xai" ? " content-section-xai" : ""}`}>
      <header className="mb-4 flex items-baseline gap-3">
        <span className="section-eyebrow">
          {icon ?? <BrainCircuit className="h-3.5 w-3.5" aria-hidden />}
          {eyebrow}
        </span>
      </header>
      <h2 className="section-h2">{title}</h2>
      {caption ? <p className="section-lead">{caption}</p> : null}
      {children}
    </section>
  );
}
