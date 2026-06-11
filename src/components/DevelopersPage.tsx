// ||| Phase IB · /developers : implementation intelligence
// 5 final sections: architecture (merged infrastructure), rag, integration,
// corpus (merged inspector + live trace), agent-runtime (cognitive flow).

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import { getDevelopersPageContent } from "../i18n/pages/developersPage";
import { getDevelopersHeader } from "../i18n/pages/technicalPageHeaders";
import {
  Activity,
  BrainCircuit,
  Cpu,
  Database,
  FileCode,
  GitBranch,
  Layers,
  Network,
  Play,
  ScanSearch,
  Server,
  Square,
  TerminalSquare,
  Workflow,
} from "lucide-react";
import { fetchHealthData } from "../beatrice/services/retrieval.service";
import { runPerspectiveTrial } from "../beatrice/services/perspectiveTrial.service";
import type { HealthData, ResponseAuditMetadata, SourceChip } from "../beatrice/types/beatrice";
import { usePersonaContext } from "../beatrice/hooks/usePersonaContext";
import { PageHero, PageShell, SectionIntroHeader } from "./ui/VisualPrimitives";
import { ReasoningLiveTrace, type TraceSnapshot } from "./ReasoningLiveTrace";
import { CognitiveFlow } from "./oracle/CognitiveFlow";

// ──────────────────────────────────────────────────────────────────────────
// Section model
// ──────────────────────────────────────────────────────────────────────────

type FocusId =
  | "architecture"
  | "rag"
  | "integration"
  | "corpus"
  | "agent-runtime";

const SECTIONS: Array<{ id: FocusId; icon: typeof Cpu }> = [
  { id: "architecture", icon: Network },
  { id: "rag", icon: Workflow },
  { id: "integration", icon: FileCode },
  { id: "corpus", icon: Database },
  { id: "agent-runtime", icon: BrainCircuit },
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
    <PageShell>
      <Hero />
      <SectionNav active={active.id} onChange={updateFocus} />

      <div className="mt-10">
        {active.id === "architecture" ? <ArchitectureSection /> : null}
        {active.id === "rag" ? <RagSection /> : null}
        {active.id === "integration" ? <IntegrationSection /> : null}
        {active.id === "corpus" ? <CorpusSection /> : null}
        {active.id === "agent-runtime" ? <AgentRuntimeSection /> : null}
      </div>
    </PageShell>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Hero & nav
// ──────────────────────────────────────────────────────────────────────────

function Hero() {
  const { locale, t } = useI18n();
  const copy = getDevelopersHeader(locale);
  return (
    <PageHero
      eyebrow={
        <>
          <TerminalSquare className="h-3.5 w-3.5" aria-hidden />
          {t("pages.developers.eyebrow")}
        </>
      }
      title={
        <>
          {copy.titleLead} <em className="not-italic text-primary">{copy.titleAccent}</em>.
        </>
      }
      description={copy.lead}
    />
  );
}

function SectionNav({ active, onChange }: { active: FocusId; onChange: (next: FocusId) => void }) {
  const { locale, t } = useI18n();
  const copy = getDevelopersHeader(locale);
  return (
    <nav
      aria-label={copy.navigationAria}
      className="flex gap-2 overflow-x-auto xl:grid xl:grid-cols-5 xl:overflow-visible"
    >
      {SECTIONS.map((section) => {
        const Icon = section.icon;
        const isActive = section.id === active;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onChange(section.id)}
            aria-pressed={isActive}
            data-abraxos-focus={`architecture-${section.id}`}
            className={`${isActive ? "section-tab-active" : "section-tab"} shrink-0 xl:min-w-0 xl:flex-col xl:items-start xl:gap-1 xl:text-left`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden strokeWidth={1.5} />
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
// SECTION 1 : Architecture overview (3 tiers + data flows)
// ──────────────────────────────────────────────────────────────────────────

const TIER_LEVELS = [3, 2, 1] as const;

type TechAccent = {
  shell: string;
  badge: string;
  chip: string;
  chipBorder: string;
  name: string;
  key: string;
  value: string;
};

const TECH_ACCENTS = {
  browser: {
    shell: "border-primary/20 bg-primary/[0.04]",
    badge: "border-primary/25 bg-primary/10 text-primary",
    chip: "bg-primary/[0.06] text-primary",
    chipBorder: "border-primary/20",
    name: "text-primary",
    key: "text-technical-keyword",
    value: "text-technical-property",
  },
  fastapi: {
    shell: "border-sky-400/20 bg-sky-400/[0.04]",
    badge: "border-sky-400/25 bg-sky-400/10 text-sky-300",
    chip: "bg-sky-400/[0.07] text-sky-200",
    chipBorder: "border-sky-400/22",
    name: "text-sky-200",
    key: "text-sky-400/80",
    value: "text-sky-100",
  },
  embedding: {
    shell: "border-secondary/20 bg-secondary/[0.05]",
    badge: "border-secondary/25 bg-secondary/10 text-secondary",
    chip: "bg-secondary/[0.08] text-secondary-dim",
    chipBorder: "border-secondary/22",
    name: "text-secondary-dim",
    key: "text-technical-keyword",
    value: "text-technical-type",
  },
  vector: {
    shell: "border-emerald-400/20 bg-emerald-400/[0.04]",
    badge: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    chip: "bg-emerald-400/[0.07] text-emerald-200",
    chipBorder: "border-emerald-400/22",
    name: "text-emerald-200",
    key: "text-emerald-400/75",
    value: "text-emerald-100",
  },
  llm: {
    shell: "border-warning/20 bg-warning/[0.04]",
    badge: "border-warning/25 bg-warning/10 text-warning",
    chip: "bg-warning/[0.08] text-technical-command",
    chipBorder: "border-warning/22",
    name: "text-technical-command",
    key: "text-warning/80",
    value: "text-technical-foreground",
  },
  stream: {
    shell: "border-fuchsia-400/20 bg-fuchsia-400/[0.04]",
    badge: "border-fuchsia-400/25 bg-fuchsia-400/10 text-fuchsia-300",
    chip: "bg-fuchsia-400/[0.07] text-fuchsia-200",
    chipBorder: "border-fuchsia-400/22",
    name: "text-fuchsia-200",
    key: "text-fuchsia-400/75",
    value: "text-fuchsia-100",
  },
} as const satisfies Record<string, TechAccent>;

const TIER_ACCENTS = [TECH_ACCENTS.browser, TECH_ACCENTS.fastapi, TECH_ACCENTS.vector] as const;
const COMMAND_ACCENTS = [TECH_ACCENTS.browser, TECH_ACCENTS.fastapi, TECH_ACCENTS.vector] as const;
const INTEGRATION_SNIPPET_ACCENTS = [
  TECH_ACCENTS.fastapi,
  TECH_ACCENTS.stream,
  TECH_ACCENTS.embedding,
  TECH_ACCENTS.llm,
] as const;
const HEALTH_METRIC_ACCENTS = [TECH_ACCENTS.vector, TECH_ACCENTS.embedding, TECH_ACCENTS.browser] as const;
const GAP_ACCENTS = [TECH_ACCENTS.browser, TECH_ACCENTS.llm, TECH_ACCENTS.fastapi] as const;
const LAYER_ACCENTS = [
  TECH_ACCENTS.fastapi,
  TECH_ACCENTS.embedding,
  TECH_ACCENTS.llm,
  TECH_ACCENTS.vector,
] as const;
const LAYER_DOTS = ["bg-sky-400/75", "bg-secondary/75", "bg-warning/80", "bg-emerald-400/75"] as const;
const CAPABILITY_NAME_ACCENTS = [
  TECH_ACCENTS.vector,
  TECH_ACCENTS.llm,
  TECH_ACCENTS.stream,
  TECH_ACCENTS.browser,
  TECH_ACCENTS.embedding,
  TECH_ACCENTS.fastapi,
  TECH_ACCENTS.llm,
  TECH_ACCENTS.embedding,
] as const;

function resolveRagPhaseAccent(phase: string): TechAccent {
  switch (phase) {
    case "extraction":
      return TECH_ACCENTS.browser;
    case "indexing":
      return TECH_ACCENTS.embedding;
    case "watch":
      return TECH_ACCENTS.llm;
    case "serve":
      return TECH_ACCENTS.fastapi;
    default:
      return TECH_ACCENTS.browser;
  }
}

function resolveFlowAccent(label: string): TechAccent {
  const normalized = label.toLowerCase();
  if (normalized.includes("navegador") || normalized.includes("browser")) return TECH_ACCENTS.browser;
  if (normalized.includes("fastapi")) return TECH_ACCENTS.fastapi;
  if (normalized.includes("bge")) return TECH_ACCENTS.embedding;
  if (normalized.includes("chroma")) return TECH_ACCENTS.vector;
  if (normalized.includes("groq")) return TECH_ACCENTS.llm;
  return TECH_ACCENTS.browser;
}

function resolveComponentAccent(name: string): TechAccent {
  const normalized = name.toLowerCase();
  if (normalized.includes("chroma")) return TECH_ACCENTS.vector;
  if (normalized.includes("bge") || normalized.includes("embedding")) return TECH_ACCENTS.embedding;
  if (normalized.includes("groq") || normalized.includes("llama")) return TECH_ACCENTS.llm;
  if (
    normalized.includes("react")
    || normalized.includes("tailwind")
    || normalized.includes("router")
    || normalized.includes("provider")
    || normalized.includes("workspace")
  ) {
    return TECH_ACCENTS.browser;
  }
  if (normalized.includes("server") || normalized.includes("prompts") || normalized.includes("rag")) {
    return TECH_ACCENTS.fastapi;
  }
  return TECH_ACCENTS.browser;
}

function resolveInfraAccent(name: string): TechAccent {
  switch (name) {
    case "Groq":
      return TECH_ACCENTS.llm;
    case "BAAI/bge-m3":
      return TECH_ACCENTS.embedding;
    case "ChromaDB":
      return TECH_ACCENTS.vector;
    case "FastAPI":
      return TECH_ACCENTS.fastapi;
    case "SSE":
      return TECH_ACCENTS.stream;
    default:
      return TECH_ACCENTS.fastapi;
  }
}

function FlowEndpoint({ label }: { label: string }) {
  const accent = resolveFlowAccent(label);
  return (
    <span
      className={`inline-flex max-w-full break-all rounded-md border px-2 py-0.5 font-mono text-[11px] ${accent.chip} ${accent.chipBorder}`}
    >
      {label}
    </span>
  );
}

function ArchitectureSection() {
  const { locale } = useI18n();
  const copy = getDevelopersPageContent(locale).architecture;

  return (
    <>
      <ZoneShell
        eyebrow={copy.stack.eyebrow}
        title={copy.stack.title}
        caption={copy.stack.caption}
        icon={<Layers className="h-3.5 w-3.5" aria-hidden />}
      >
        <ol className="space-y-4">
          {copy.tiers.map((tier, index) => {
            const level = TIER_LEVELS[index];
            const tierAccent = TIER_ACCENTS[index] ?? TECH_ACCENTS.browser;
            return (
            <li
              key={level}
              className={`rounded-2xl border p-5 sm:p-6 ${tierAccent.shell}`}
            >
              <header className="mb-4 flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest ${tierAccent.badge}`}
                >
                  {copy.stack.tierLabel(level)}
                </span>
                <span className={`text-sm font-semibold ${tierAccent.name}`}>{tier.label}</span>
                <span className="text-[11px] text-slate-400">· {tier.responsibility}</span>
              </header>
              <ul className="grid gap-3 lg:grid-cols-2">
                {tier.components.map((component) => {
                  const accent = resolveComponentAccent(component.name);
                  return (
                    <li
                      key={component.name}
                      className={`flex min-w-0 flex-col gap-2 rounded-xl border p-3.5 ${accent.chipBorder} bg-black/25`}
                    >
                      <code className={`max-w-full break-all font-mono text-xs font-semibold ${accent.name}`}>
                        {component.name}
                      </code>
                      <span className="min-w-0 break-words text-[11px] leading-relaxed text-slate-400">
                        {component.detail}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </li>
            );
          })}
        </ol>
      </ZoneShell>

      <ZoneShell
        eyebrow={copy.dataFlows.eyebrow}
        title={copy.dataFlows.title}
        caption={copy.dataFlows.caption}
        icon={<GitBranch className="h-3.5 w-3.5" aria-hidden />}
      >
        <div className="table-scroll rounded-2xl border border-white/8 bg-white/[0.015]">
          <table className="w-full text-xs">
            <thead className="bg-white/[0.03] text-[10px] uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">{copy.dataFlows.columns.from}</th>
                <th className="px-4 py-3 text-left font-semibold">{copy.dataFlows.columns.to}</th>
                <th className="px-4 py-3 text-left font-semibold">{copy.dataFlows.columns.payload}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {copy.dataFlows.rows.map((flow) => (
                <tr key={`${flow.from}-${flow.to}-${flow.payload}`} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <FlowEndpoint label={flow.from} />
                  </td>
                  <td className="px-4 py-3">
                    <FlowEndpoint label={flow.to} />
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] leading-relaxed text-technical-type">
                    {flow.payload}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ZoneShell>

      <ZoneShell
        eyebrow={copy.devCommands.eyebrow}
        title={copy.devCommands.title}
      >
        <div className="grid gap-4 sm:grid-cols-3 sm:items-stretch">
          {copy.devCommands.panels.map((panel, index) => (
            <CommandPanel
              key={panel.command}
              accent={COMMAND_ACCENTS[index] ?? TECH_ACCENTS.browser}
              label={panel.label}
              command={panel.command}
              detail={panel.detail}
            />
          ))}
        </div>
      </ZoneShell>
      <InfrastructureSection />
    </>
  );
}

function CommandPanel({
  accent,
  label,
  command,
  detail,
}: {
  accent: TechAccent;
  label: string;
  command: string;
  detail: string;
}) {
  return (
    <article className={`flex h-full flex-col gap-4 rounded-2xl border p-5 sm:p-6 ${accent.shell}`}>
      <h3 className={`text-[10px] font-bold uppercase tracking-[0.22em] ${accent.name}`}>{label}</h3>
      <code className={`technical-block block w-full border ${accent.chipBorder} bg-black/30 text-technical-command`}>
        $ {command}
      </code>
      <p className="text-xs leading-relaxed text-slate-400">{detail}</p>
    </article>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 2 : RAG pipeline walkthrough
// ──────────────────────────────────────────────────────────────────────────

function RagSection() {
  const { locale } = useI18n();
  const copy = getDevelopersPageContent(locale).rag;

  return (
    <>
      <ZoneShell
        eyebrow={copy.pipeline.eyebrow}
        title={copy.pipeline.title}
        caption={copy.pipeline.caption}
        icon={<Workflow className="h-3.5 w-3.5" aria-hidden />}
      >
        <ol className="space-y-4">
          {copy.stages.map((stage) => {
            const accent = resolveRagPhaseAccent(stage.phase);
            return (
              <li key={stage.artefact} className={`rounded-2xl border p-5 sm:p-6 ${accent.shell}`}>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${accent.badge}`}
                  >
                    {copy.pipeline.phaseLabel(stage.phase)}
                  </span>
                  <code className={`technical-chip border ${accent.chipBorder} ${accent.chip}`}>
                    {stage.artefact}
                  </code>
                  {"command" in stage && stage.command ? (
                    <code className="technical-chip border border-warning/22 bg-warning/[0.08] text-technical-command">
                      $ {stage.command}
                    </code>
                  ) : null}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-slate-300">{stage.description}</p>
                <div className={`rounded-xl border bg-black/25 p-3.5 ${accent.chipBorder}`}>
                  <div className={`mb-1.5 text-[10px] font-semibold uppercase tracking-widest ${accent.key}`}>
                    {copy.pipeline.outputLabel}
                  </div>
                  <code className={`break-words font-mono text-[11px] [overflow-wrap:anywhere] ${accent.value}`}>
                    {stage.output}
                  </code>
                </div>
              </li>
            );
          })}
        </ol>
      </ZoneShell>

      <CrossRefPanel
        title={copy.crossRef.title}
        links={[
          { to: "/reasoning", label: copy.crossRef.link },
        ]}
      />
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 3 : AI infrastructure
// ──────────────────────────────────────────────────────────────────────────

function InfrastructureSection() {
  const { locale } = useI18n();
  const copy = getDevelopersPageContent(locale).architecture.infrastructure;

  return (
    <ZoneShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      caption={copy.caption}
      icon={<Cpu className="h-3.5 w-3.5" aria-hidden />}
    >
      <div className="space-y-4">
        {copy.components.map((component) => {
          const accent = resolveInfraAccent(component.name);
          return (
            <article
              key={component.name}
              className={`rounded-2xl border p-5 sm:p-6 ${accent.shell}`}
            >
              <header className="mb-3 flex flex-wrap items-center gap-3">
                <span className={`text-sm font-semibold ${accent.name}`}>{component.name}</span>
                <code className={`technical-chip border ${accent.chipBorder} ${accent.chip}`}>
                  {component.version}
                </code>
              </header>
              <p className="mb-4 text-sm leading-relaxed text-slate-300">{component.role}</p>
              <dl className="grid gap-3 sm:grid-cols-2">
                {component.config.map((entry) => (
                  <div
                    key={entry.key}
                    className={`flex min-w-0 flex-col gap-1.5 rounded-xl border bg-black/25 p-3.5 ${accent.chipBorder}`}
                  >
                    <dt className={`shrink-0 font-mono text-[10px] font-semibold uppercase tracking-wider ${accent.key}`}>
                      {entry.key}
                    </dt>
                    <dd className={`min-w-0 break-all font-mono text-[11px] leading-relaxed ${accent.value}`}>
                      {entry.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          );
        })}
      </div>
    </ZoneShell>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 4 : Integration guides
// ──────────────────────────────────────────────────────────────────────────

function IntegrationSection() {
  const { locale } = useI18n();
  const copy = getDevelopersPageContent(locale).integration;

  return (
    <ZoneShell
      eyebrow={copy.guides.eyebrow}
      title={copy.guides.title}
      caption={copy.guides.caption}
      icon={<FileCode className="h-3.5 w-3.5" aria-hidden />}
    >
      <div className="space-y-4">
        {copy.snippets.map((snippet, index) => {
          const accent = INTEGRATION_SNIPPET_ACCENTS[index] ?? TECH_ACCENTS.browser;
          return (
            <article
              key={snippet.label}
              className={`overflow-hidden rounded-2xl border ${accent.shell}`}
            >
              <header className={`border-b px-4 py-2.5 ${accent.chipBorder} bg-black/20`}>
                <span className={`text-[10px] font-bold uppercase tracking-[0.22em] ${accent.name}`}>
                  {snippet.label}
                </span>
              </header>
              <pre
                className={`overflow-x-auto border-l-2 bg-black/35 p-4 font-mono text-[11px] leading-relaxed text-technical-foreground ${accent.chipBorder}`}
              >
                {snippet.body}
              </pre>
            </article>
          );
        })}
      </div>
    </ZoneShell>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 5 : Corpus intelligence (real /api/health + page_type breakdown)
// ──────────────────────────────────────────────────────────────────────────

function CorpusSection() {
  const { locale } = useI18n();
  const copy = getDevelopersPageContent(locale).corpus;
  const [health, setHealth] = useState<HealthData | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [trace, setTrace] = useState<TraceSnapshot>({ status: "idle" });
  const updateTrace = useCallback((patch: Partial<TraceSnapshot>) => {
    setTrace((previous) => ({ ...previous, ...patch }));
  }, []);

  useEffect(() => {
    fetchHealthData()
      .then((data) => {
        if (data) setHealth(data);
        else setHealthError(copy.health.backendErrors.noPayload);
      })
      .catch(() => setHealthError(copy.health.backendErrors.unreachable));
  }, [copy.health.backendErrors.noPayload, copy.health.backendErrors.unreachable]);

  const pageTypeProfile = copy.health.pageTypes;
  const expectedTotal = pageTypeProfile.reduce((sum, row) => sum + row.expected, 0);
  const totalChunks = health?.corpus_chunks ?? expectedTotal;

  return (
    <>
      <ZoneShell
        eyebrow={copy.health.eyebrow}
        title={copy.health.title}
        caption={copy.health.caption}
        icon={<Database className="h-3.5 w-3.5" aria-hidden />}
      >
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <HealthMetric
            accent={HEALTH_METRIC_ACCENTS[0]}
            label="corpus_chunks"
            value={totalChunks.toString()}
            detail={health ? copy.health.metrics.live : healthError ? copy.health.metrics.fromProfile : copy.health.metrics.loading}
          />
          <HealthMetric
            accent={HEALTH_METRIC_ACCENTS[1]}
            label="rag_active"
            value={health ? (health.rag_active ? "yes" : "no") : ":"}
            detail={health?.embedder ?? ":"}
            valueTone={health?.rag_active === false ? "text-warning" : undefined}
          />
          <HealthMetric
            accent={HEALTH_METRIC_ACCENTS[2]}
            label="extraction"
            value={copy.health.metrics.pageTypes(pageTypeProfile.length)}
            detail={copy.health.metrics.expectedChunks(expectedTotal)}
          />
        </div>

        {healthError ? (
          <div className="feedback-banner-warning mb-4 rounded-2xl p-4 text-xs">
            <strong>{copy.health.healthError.title}</strong> {copy.health.healthError.body}
          </div>
        ) : null}

        <div className="table-scroll rounded-2xl border border-white/8 bg-white/[0.015]">
          <table className="w-full text-xs">
            <thead className="bg-white/[0.03] text-[10px] uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">{copy.health.table.pageType}</th>
                <th className="px-4 py-3 text-left font-semibold">{copy.health.table.source}</th>
                <th className="px-4 py-3 text-right font-semibold">{copy.health.table.expected}</th>
                <th className="px-4 py-3 text-left font-semibold">{copy.health.table.cognitiveRole}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pageTypeProfile.map((row) => (
                <tr key={row.page_type} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-mono text-technical-type">{row.page_type}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-technical-property">{row.source}</td>
                  <td className="px-4 py-3 text-right font-mono text-technical-number">{row.expected}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-400">{row.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ZoneShell>

      <ZoneShell
        eyebrow={copy.gaps.eyebrow}
        title={copy.gaps.title}
        caption={copy.gaps.caption}
      >
        <ul className="space-y-3 text-xs text-slate-400">
          {copy.gaps.items.map((item, index) => {
            const accent = GAP_ACCENTS[index] ?? TECH_ACCENTS.browser;
            return (
              <li key={item.strong} className={`rounded-xl border p-3.5 ${accent.shell}`}>
                <strong className={accent.name}>{item.strong}</strong> {item.body}
              </li>
            );
          })}
        </ul>
      </ZoneShell>
      <InspectorSection onTraceUpdate={updateTrace} />
      <ZoneShell
        eyebrow={copy.liveTrace.eyebrow}
        title={copy.liveTrace.title}
        caption={copy.liveTrace.caption}
        icon={<ScanSearch className="h-3.5 w-3.5" aria-hidden />}
      >
        <ReasoningLiveTrace trace={trace} labels={copy.trace} />
      </ZoneShell>
    </>
  );
}

function HealthMetric({
  accent,
  label,
  value,
  detail,
  valueTone,
}: {
  accent: TechAccent;
  label: string;
  value: string;
  detail: string;
  valueTone?: string;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${accent.shell}`}>
      <div className={`mb-1 text-[10px] font-semibold uppercase tracking-widest ${accent.key}`}>{label}</div>
      <div className={`font-mono text-xl ${valueTone ?? "text-slate-100"}`}>{value}</div>
      <div className="mt-1 text-[10px] text-slate-500">{detail}</div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 6 : Inspector (live retrieval against /api/chat)
// ──────────────────────────────────────────────────────────────────────────

function InspectorSection({ onTraceUpdate }: { onTraceUpdate?: (patch: Partial<TraceSnapshot>) => void }) {
  const { locale } = useI18n();
  const copy = getDevelopersPageContent(locale).corpus.inspector;
  const { profileId } = usePersonaContext();
  const [query, setQuery] = useState(copy.defaultQuery);

  useEffect(() => {
    setQuery(copy.defaultQuery);
  }, [copy.defaultQuery]);
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
    const trimmedQuery = query.trim();
    setSources(null);
    setIntent(undefined);
    setResponseText("");
    setError(null);
    setStatus("running");
    onTraceUpdate?.({
      status: "running",
      query: trimmedQuery,
      intent: undefined,
      sources: null,
      auditMetadata: undefined,
      error: null,
    });

    try {
      await runPerspectiveTrial({
        query: trimmedQuery,
        profileId,
        signal: controller.signal,
        onDelta: setResponseText,
        onSources: (next, nextIntent) => {
          setSources(next ?? null);
          setIntent(nextIntent);
          onTraceUpdate?.({ sources: next ?? null, intent: nextIntent });
        },
        onAuditMetadata: (auditMetadata: ResponseAuditMetadata) => {
          onTraceUpdate?.({ auditMetadata });
        },
      });
      if (!controller.signal.aborted) {
        setStatus("done");
        onTraceUpdate?.({ status: "done" });
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      const message = err instanceof Error ? err.message : "unknown";
      setStatus("error");
      setError(message);
      onTraceUpdate?.({ status: "error", error: message });
    }
  };

  const stop = () => {
    abortRef.current?.abort();
    setStatus("stopped");
    onTraceUpdate?.({ status: "stopped" });
  };

  return (
    <>
      <ZoneShell
        eyebrow={copy.eyebrow}
        title={copy.title}
        caption={copy.caption}
        icon={<ScanSearch className="h-3.5 w-3.5" aria-hidden />}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (status !== "running") void run();
          }}
          className="mb-4 flex min-w-0 items-stretch gap-2 rounded-2xl border border-primary/15 bg-black/30 p-2"
        >
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.placeholder}
            disabled={status === "running"}
            aria-label={copy.queryAria}
            className="focus-ring min-h-11 min-w-0 flex-1 rounded-lg bg-transparent px-3 py-2 font-mono text-xs text-slate-200 placeholder:text-slate-600 disabled:opacity-50"
          />
          {status === "running" ? (
            <button
              type="button"
              onClick={stop}
              className="focus-ring inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-200 hover:border-white/30"
            >
              <Square className="h-3 w-3" aria-hidden />
              {copy.stop}
            </button>
          ) : (
            <button
              type="submit"
              disabled={!query.trim()}
              className="focus-ring inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/15 px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/25 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Play className="h-3 w-3" aria-hidden />
              {copy.inspect}
            </button>
          )}
        </form>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className={`rounded-2xl border p-4 lg:col-span-1 ${TECH_ACCENTS.browser.shell}`}>
            <h3 className={`mb-3 text-[10px] font-bold uppercase tracking-[0.22em] ${TECH_ACCENTS.browser.name}`}>
              {copy.requestState}
            </h3>
            <dl className="space-y-2 text-[11px]">
              <Row k="perspective" v={profileId} />
              <Row k="status" v={status} />
              <Row k="intent" v={intent ?? ":"} />
              <Row k="sources" v={sources ? String(sources.length) : "0"} />
              {error ? <Row k="error" v={error} tone="text-rose-300" /> : null}
            </dl>
          </div>

          <div className={`rounded-2xl border p-4 lg:col-span-2 ${TECH_ACCENTS.vector.shell}`}>
            <h3 className={`mb-3 text-[10px] font-bold uppercase tracking-[0.22em] ${TECH_ACCENTS.vector.name}`}>
              {copy.sourceChunks}
            </h3>
            {sources && sources.length > 0 ? (
              <ol className="space-y-2">
                {sources.map((chunk, index) => (
                  <li
                    key={`${chunk.title}-${index}`}
                    className={`rounded-xl border bg-black/25 p-3 text-[11px] ${TECH_ACCENTS.vector.chipBorder}`}
                  >
                    <div className="mb-1 flex flex-wrap items-baseline gap-2">
                      <span className="font-mono text-technical-keyword">#{index + 1}</span>
                      <span className="text-slate-200">{chunk.title || copy.untitled}</span>
                      {chunk.page_type ? (
                        <code className="technical-chip border border-sky-400/22 bg-sky-400/[0.07] text-technical-type">
                          {chunk.page_type}
                        </code>
                      ) : null}
                    </div>
                    <div className="grid grid-cols-1 gap-1 font-mono text-[10px] min-[390px]:grid-cols-3 min-[390px]:gap-2">
                      <span className="text-technical-type">sim {chunk.similarity.toFixed(3)}</span>
                      <span className="text-technical-keyword">w ×{chunk.retrieval_weight?.toFixed(2) ?? "1.00"}</span>
                      <span className="text-technical-number">score {chunk.weighted_score?.toFixed(3) ?? ":"}</span>
                    </div>
                    {chunk.source ? (
                      <div className="mt-2 break-words text-[10px] text-slate-600 [overflow-wrap:anywhere]">{chunk.source}</div>
                    ) : null}
                  </li>
                ))}
              </ol>
            ) : (
              <div className="flex h-32 items-center justify-center text-[11px] text-slate-600">
                {status === "running" ? copy.waitingSources : copy.emptySources}
              </div>
            )}
          </div>
        </div>

        {responseText ? (
          <div className={`mt-4 rounded-2xl border bg-black/20 p-4 ${TECH_ACCENTS.stream.shell}`}>
            <h3 className={`mb-2 text-[10px] font-bold uppercase tracking-[0.22em] ${TECH_ACCENTS.stream.name}`}>
              {copy.responseRaw}
            </h3>
            <pre className="max-h-96 overflow-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-technical-foreground [overflow-wrap:anywhere]">
              {responseText}
            </pre>
          </div>
        ) : null}
      </ZoneShell>

      <CrossRefPanel
        title={copy.crossRef.title}
        links={[
          { to: "/perspectives", label: copy.crossRef.link },
        ]}
      />
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 5 : Agent runtime (cognitive flow)
// ──────────────────────────────────────────────────────────────────────────

function AgentRuntimeSection() {
  const { locale } = useI18n();
  const copy = getDevelopersPageContent(locale).agentRuntime;

  return (
    <>
      <ZoneShell
        eyebrow={copy.flow.eyebrow}
        title={copy.flow.title}
        caption={copy.flow.caption}
        icon={<BrainCircuit className="h-3.5 w-3.5" aria-hidden />}
      >
        <div className="content-card">
          <CognitiveFlow steps={copy.flow.steps} />
        </div>
      </ZoneShell>

      <ZoneShell
        eyebrow={copy.layers.eyebrow}
        title={copy.layers.title}
        caption={copy.layers.caption}
        icon={<Layers className="h-3.5 w-3.5" aria-hidden />}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {copy.layers.items.map((layer, index) => {
            const accent = LAYER_ACCENTS[index] ?? TECH_ACCENTS.browser;
            return (
              <div key={layer.label} className={`rounded-2xl border p-5 ${accent.shell}`}>
                <h3 className={`mb-3 text-sm font-semibold ${accent.name}`}>{layer.label}</h3>
                <ul className="space-y-2.5">
                  {layer.responsibilities.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-400">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${LAYER_DOTS[index] ?? "bg-primary/75"}`} aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </ZoneShell>

      <ZoneShell
        eyebrow={copy.capabilities.eyebrow}
        title={copy.capabilities.title}
        caption={copy.capabilities.caption}
        icon={<Cpu className="h-3.5 w-3.5" aria-hidden />}
      >
        <div className="table-scroll rounded-2xl border border-white/8 bg-white/[0.015]">
          <table className="w-full text-xs">
            <thead className="bg-white/[0.03] text-[10px] uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">{copy.capabilities.columns.name}</th>
                <th className="px-4 py-3 text-left font-semibold">{copy.capabilities.columns.input}</th>
                <th className="px-4 py-3 text-left font-semibold">{copy.capabilities.columns.output}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {copy.capabilities.rows.map((row, index) => {
                const accent = CAPABILITY_NAME_ACCENTS[index] ?? TECH_ACCENTS.browser;
                return (
                  <tr key={row.name} className="transition-colors hover:bg-white/[0.02]">
                    <td className={`px-4 py-3 font-semibold ${accent.name}`}>{row.name}</td>
                    <td className="px-4 py-3 text-[11px] leading-relaxed text-slate-400">{row.input}</td>
                    <td className="px-4 py-3 text-[11px] leading-relaxed text-technical-type">{row.output}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ZoneShell>

      <ZoneShell
        eyebrow={copy.ragVsAgent.eyebrow}
        title={copy.ragVsAgent.title}
        caption={copy.ragVsAgent.caption}
        icon={<GitBranch className="h-3.5 w-3.5" aria-hidden />}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={`rounded-2xl border p-5 ${TECH_ACCENTS.embedding.shell}`}>
            <h3 className={`mb-2 font-mono text-xs font-semibold ${TECH_ACCENTS.embedding.name}`}>
              {copy.ragVsAgent.rag.label}
            </h3>
            <p className="text-[11px] leading-relaxed text-slate-400">{copy.ragVsAgent.rag.body}</p>
          </div>
          <div className={`rounded-2xl border p-5 ${TECH_ACCENTS.browser.shell}`}>
            <h3 className={`mb-2 text-xs font-semibold ${TECH_ACCENTS.browser.name}`}>
              {copy.ragVsAgent.agent.label}
            </h3>
            <p className="text-[11px] leading-relaxed text-slate-400">{copy.ragVsAgent.agent.body}</p>
          </div>
        </div>
      </ZoneShell>

      <ZoneShell
        eyebrow={copy.contract.eyebrow}
        title={copy.contract.title}
        caption={copy.contract.caption}
        icon={<Network className="h-3.5 w-3.5" aria-hidden />}
      >
        <ul className="space-y-3">
          {copy.contract.reasons.map((reason) => (
            <li key={reason} className="flex gap-3 text-sm leading-6 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </ZoneShell>

      <CrossRefPanel title={copy.crossRef.title} links={copy.crossRef.links} />
    </>
  );
}

function Row({ k, v, tone }: { k: string; v: string; tone?: string }) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-2 border-b border-white/5 pb-1 last:border-0">
      <dt className="font-mono text-technical-keyword">{k}</dt>
      <dd className={`min-w-0 break-words text-right font-mono [overflow-wrap:anywhere] ${tone ?? "text-technical-property"}`}>{v}</dd>
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
      <SectionIntroHeader
        description={caption}
        eyebrow={eyebrow}
        icon={icon ?? <Server className="h-3.5 w-3.5" aria-hidden />}
        title={title}
      />
      <div className="section-intro-body">{children}</div>
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
            className="focus-ring inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-300 transition-colors hover:border-white/30 hover:text-white"
          >
            <Activity className="h-3 w-3" aria-hidden />
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

