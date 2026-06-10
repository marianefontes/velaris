// ||| Phase IB · /developers : implementation intelligence
// 4 final sections: architecture (merged infrastructure), rag, integration,
// corpus (merged inspector + live trace). Reference and decisions removed per spec.

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import { getDevelopersPageContent } from "../i18n/pages/developersPage";
import { getDevelopersHeader } from "../i18n/pages/technicalPageHeaders";
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

// ──────────────────────────────────────────────────────────────────────────
// Section model
// ──────────────────────────────────────────────────────────────────────────

type FocusId =
  | "architecture"
  | "rag"
  | "integration"
  | "corpus";

const SECTIONS: Array<{ id: FocusId; icon: typeof Cpu }> = [
  { id: "architecture", icon: Network },
  { id: "rag", icon: Workflow },
  { id: "integration", icon: FileCode },
  { id: "corpus", icon: Database },
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
      className="flex gap-2 overflow-x-auto xl:grid xl:grid-cols-4 xl:overflow-visible"
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
        <ol className="space-y-3">
          {copy.tiers.map((tier, index) => {
            const level = TIER_LEVELS[index];
            return (
            <li key={level} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
              <header className="mb-3 flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  {copy.stack.tierLabel(level)}
                </span>
                <span className="text-sm font-semibold text-slate-100">{tier.label}</span>
                <span className="text-[11px] text-slate-500">: {tier.responsibility}</span>
              </header>
              <ul className="grid gap-2 lg:grid-cols-2">
                {tier.components.map((component) => (
                  <li
                    key={component.name}
                    className="flex min-w-0 flex-wrap items-baseline gap-2 rounded-xl border border-white/8 bg-black/20 p-3 text-xs"
                  >
                    <code className="max-w-full break-all font-mono text-technical-property">{component.name}</code>
                    <span className="min-w-0 break-words text-[11px] text-slate-400">{component.detail}</span>
                  </li>
                ))}
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
        <div className="table-scroll rounded-2xl border border-white/8">
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
        eyebrow={copy.devCommands.eyebrow}
        title={copy.devCommands.title}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {copy.devCommands.panels.map((panel) => (
            <CommandPanel
              key={panel.command}
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

function CommandPanel({ label, command, detail }: { label: string; command: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
      <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">{label}</h3>
      <code className="technical-block mb-3 text-technical-command">
        $ {command}
      </code>
      <p className="text-[11px] leading-relaxed text-slate-400">{detail}</p>
    </div>
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
        <ol className="space-y-3">
          {copy.stages.map((stage) => (
            <li key={stage.artefact} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
              <div className="mb-3 flex flex-wrap items-baseline gap-3">
                <span className="text-[10px] uppercase tracking-widest text-slate-500">
                  {copy.pipeline.phaseLabel(stage.phase)}
                </span>
                <code className="technical-chip text-technical-property">
                  {stage.artefact}
                </code>
                {"command" in stage && stage.command ? (
                  <code className="technical-chip text-technical-command">
                    $ {stage.command}
                  </code>
                ) : null}
              </div>
              <p className="mb-3 text-sm leading-relaxed text-slate-300">{stage.description}</p>
              <div className="rounded-xl border border-white/8 bg-black/20 p-3">
                <div className="mb-1 text-[10px] uppercase tracking-widest text-slate-600">{copy.pipeline.outputLabel}</div>
                <code className="break-words font-mono text-[11px] text-slate-300 [overflow-wrap:anywhere]">{stage.output}</code>
              </div>
            </li>
          ))}
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
      <div className="space-y-3">
        {copy.components.map((component) => (
          <article
            key={component.name}
            className="rounded-2xl border border-white/8 bg-white/[0.02] p-5"
          >
            <header className="mb-3 flex flex-wrap items-baseline gap-3">
              <span className="text-sm font-semibold text-slate-100">{component.name}</span>
              <code className="technical-chip text-technical-property">
                {component.version}
              </code>
            </header>
            <p className="mb-3 text-sm leading-relaxed text-slate-300">{component.role}</p>
            <dl className="grid gap-2 sm:grid-cols-2">
              {component.config.map((entry) => (
                <div key={entry.key} className="flex min-w-0 flex-wrap items-baseline gap-2 rounded-xl border border-white/8 bg-black/20 p-3 text-[11px]">
                  <dt className="shrink-0 font-mono text-slate-500">{entry.key}</dt>
                  <dd className="min-w-0 break-all font-mono text-slate-300">{entry.value}</dd>
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
      <div className="space-y-3">
        {copy.snippets.map((snippet) => (
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
            label="corpus_chunks"
            value={totalChunks.toString()}
            detail={health ? copy.health.metrics.live : healthError ? copy.health.metrics.fromProfile : copy.health.metrics.loading}
          />
          <HealthMetric
            label="rag_active"
            value={health ? (health.rag_active ? "yes" : "no") : ":"}
            detail={health?.embedder ?? ":"}
          />
          <HealthMetric
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

        <div className="table-scroll rounded-2xl border border-white/8">
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
                <tr key={row.page_type}>
                  <td className="px-4 py-3 font-mono text-technical-type">{row.page_type}</td>
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
        eyebrow={copy.gaps.eyebrow}
        title={copy.gaps.title}
        caption={copy.gaps.caption}
      >
        <ul className="space-y-2 text-xs text-slate-400">
          {copy.gaps.items.map((item) => (
            <li key={item.strong} className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
              <strong className="text-slate-200">{item.strong}</strong> {item.body}
            </li>
          ))}
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
          className="mb-4 flex min-w-0 items-stretch gap-2 rounded-2xl border border-white/10 bg-black/30 p-2"
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
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 lg:col-span-1">
            <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
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

          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 lg:col-span-2">
            <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
              {copy.sourceChunks}
            </h3>
            {sources && sources.length > 0 ? (
              <ol className="space-y-2">
                {sources.map((chunk, index) => (
                  <li key={`${chunk.title}-${index}`} className="rounded-xl border border-white/8 bg-black/20 p-3 text-[11px]">
                    <div className="mb-1 flex flex-wrap items-baseline gap-2">
                      <span className="font-mono text-slate-500">#{index + 1}</span>
                      <span className="text-slate-200">{chunk.title || copy.untitled}</span>
                      {chunk.page_type ? (
                        <code className="technical-chip text-technical-property">
                          {chunk.page_type}
                        </code>
                      ) : null}
                    </div>
                    <div className="grid grid-cols-1 gap-1 font-mono text-[10px] text-slate-400 min-[390px]:grid-cols-3 min-[390px]:gap-2">
                      <span>sim {chunk.similarity.toFixed(3)}</span>
                      <span>w ×{chunk.retrieval_weight?.toFixed(2) ?? "1.00"}</span>
                      <span>score {chunk.weighted_score?.toFixed(3) ?? ":"}</span>
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
          <div className="mt-4 rounded-2xl border border-white/8 bg-black/20 p-4">
            <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
              {copy.responseRaw}
            </h3>
            <pre className="max-h-96 overflow-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-slate-300 [overflow-wrap:anywhere]">
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

function Row({ k, v, tone }: { k: string; v: string; tone?: string }) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-2 border-b border-white/5 pb-1 last:border-0">
      <dt className="font-mono text-slate-500">{k}</dt>
      <dd className={`min-w-0 break-words text-right font-mono [overflow-wrap:anywhere] ${tone ?? "text-slate-300"}`}>{v}</dd>
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

