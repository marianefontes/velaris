import { AlertTriangle, ListChecks, Wrench } from "lucide-react";
import { ExecutionTrace } from "../beatrice/components/audit/ExecutionTrace";
import type { ResponseAuditMetadata, SourceChip } from "../beatrice/types/beatrice";
import { useI18n } from "../i18n/I18nProvider";

export type TraceStatus = "idle" | "running" | "done" | "error" | "stopped";

export interface TraceSnapshot {
  status: TraceStatus;
  query?: string;
  intent?: string;
  sources?: SourceChip[] | null;
  auditMetadata?: ResponseAuditMetadata;
  error?: string | null;
}

export interface TracePanelLabels {
  idle: string;
  streaming: string;
  failed: string;
  executionSteps: string;
  auditSummary: string;
  evidenceSimilarity: string;
  perspectiveQuality: string;
  selectionScore: string;
  toolsInvoked: string;
  activeSkills: string;
  structuredSelection: string;
  alternativeCandidates: string;
  rejectedCandidates: string;
  limitations: string;
}

function percent(value: number | undefined | null, fallback = "—") {
  return typeof value === "number" ? `${Math.round(value * 100)}%` : fallback;
}

function MetaRow({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-2 border-b border-white/5 pb-1.5 last:border-0">
      <dt className="font-mono text-slate-500">{label}</dt>
      <dd className={`min-w-0 max-w-[65%] break-words text-right font-mono text-[10px] [overflow-wrap:anywhere] ${tone ?? "text-slate-300"}`}>
        {value}
      </dd>
    </div>
  );
}

function Panel({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
      <h3 className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
        {icon}
        {title}
      </h3>
      {children}
    </article>
  );
}

export function ReasoningLiveTrace({
  trace,
  labels,
}: {
  trace: TraceSnapshot;
  labels: TracePanelLabels;
}) {
  const { locale } = useI18n();
  const metadata = trace.auditMetadata;

  if (trace.status === "idle") {
    return (
      <div className="flex min-h-32 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-6 text-center text-[11px] leading-relaxed text-slate-500">
        {labels.idle}
      </div>
    );
  }

  const summaryRows: Array<[string, string, string?]> = [
    ["status", trace.status],
    ["query", trace.query ?? "—"],
    ["intent", trace.intent ?? metadata?.intent ?? metadata?.user_intent ?? "—"],
    ["workflow", metadata?.workflow ?? "—"],
    ["execution_status", metadata?.execution_status ?? "—"],
    ["request_id", metadata?.request_id ?? "—"],
    ["evidence_tier", metadata?.evidence_tier ?? "—"],
    ["evidence_similarity", percent(metadata?.evidence_similarity)],
    ["confidence", metadata?.confidence ?? "—"],
    ["perspective_quality", percent(metadata?.perspective_quality_score)],
    ["decision_id", metadata?.decision_id ?? "—"],
    ["decision_status", metadata?.decision_status ?? "—"],
  ];

  const metrics = [
    { label: labels.evidenceSimilarity, value: metadata?.evidence_similarity },
    { label: labels.perspectiveQuality, value: metadata?.perspective_quality_score },
    { label: labels.selectionScore, value: metadata?.weighted_score },
  ].filter((metric) => typeof metric.value === "number");

  return (
    <div className="space-y-4">
      {trace.status === "running" ? (
        <div className="feedback-banner-info rounded-2xl px-4 py-3 text-[11px] text-slate-300">
          <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary align-middle" />
          {labels.streaming}
        </div>
      ) : null}

      {trace.status === "error" && trace.error ? (
        <div className="feedback-banner-warning rounded-2xl px-4 py-3 text-[11px]">
          <strong>{labels.failed}</strong> {trace.error}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel
          title={labels.executionSteps}
          icon={<ListChecks className="h-3.5 w-3.5 text-primary" aria-hidden />}
        >
          <ExecutionTrace steps={metadata?.steps} locale={locale} />
        </Panel>

        <Panel title={labels.auditSummary}>
          <dl className="space-y-1.5 text-[11px]">
            {summaryRows.map(([label, value, tone]) => (
              <MetaRow key={label} label={label} value={value} tone={tone} />
            ))}
          </dl>
        </Panel>
      </div>

      {metrics.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
              <p className="text-[10px] uppercase tracking-widest text-slate-500">{metric.label}</p>
              <p className="mt-1 font-mono text-xl text-slate-100">
                {typeof metric.value === "number" && metric.value <= 1
                  ? percent(metric.value)
                  : metric.value?.toFixed(3)}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {metadata?.tools_used && metadata.tools_used.length > 0 ? (
          <Panel
            title={labels.toolsInvoked}
            icon={<Wrench className="h-3.5 w-3.5 text-primary" aria-hidden />}
          >
            <div className="flex flex-wrap gap-2">
              {metadata.tools_used.map((tool) => (
                <span
                  key={tool.name}
                  className="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 font-mono text-[10px] text-primary/80"
                >
                  {tool.name} · {tool.status}
                </span>
              ))}
            </div>
          </Panel>
        ) : null}

        {metadata?.selected_skills && metadata.selected_skills.length > 0 ? (
          <Panel title={labels.activeSkills}>
            <div className="flex flex-wrap gap-2">
              {metadata.selected_skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Panel>
        ) : null}
      </div>

      {metadata?.recommended_component ? (
        <Panel title={labels.structuredSelection}>
          <dl className="space-y-1.5 text-[11px]">
            <MetaRow label="recommended_component" value={metadata.recommended_component} />
            <MetaRow label="component_id" value={metadata.recommended_component_id ?? "—"} />
            <MetaRow label="component_status" value={metadata.component_status ?? "—"} />
            <MetaRow label="selection_policy" value={metadata.selection_policy ?? "—"} />
            <MetaRow label="weighted_score" value={metadata.weighted_score?.toFixed(3) ?? "—"} />
          </dl>
          {metadata.selection_reason ? (
            <p className="mt-3 text-[10px] leading-5 text-slate-500">{metadata.selection_reason}</p>
          ) : null}
        </Panel>
      ) : null}

      {metadata?.alternative_components && metadata.alternative_components.length > 0 ? (
        <Panel title={labels.alternativeCandidates}>
          <div className="space-y-2">
            {metadata.alternative_components.map((component) => (
              <div key={component.component_id} className="rounded-xl border border-white/8 bg-black/20 p-3 text-[11px]">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-slate-200">{component.name}</span>
                  <span className="font-mono text-primary">{component.weighted_score.toFixed(3)}</span>
                </div>
                <p className="mt-1 font-mono text-[10px] text-slate-500">
                  {component.status} · sim {percent(component.evidence_similarity)} · {component.evidence_tier}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      ) : null}

      {metadata?.rejected_components && metadata.rejected_components.length > 0 ? (
        <Panel
          title={labels.rejectedCandidates}
          icon={<AlertTriangle className="h-3.5 w-3.5 text-warning" aria-hidden />}
        >
          <div className="flex flex-wrap gap-2">
            {metadata.rejected_components.map((component) => (
              <span
                key={`${component.component_id}-${component.reason}`}
                className="rounded-full border border-warning/15 bg-warning/[0.055] px-2.5 py-1 text-[10px] text-warning/75"
              >
                {component.name}: {component.reason}
              </span>
            ))}
          </div>
        </Panel>
      ) : null}

      {metadata?.limitations && metadata.limitations.length > 0 ? (
        <div className="rounded-2xl border border-warning/15 bg-warning/[0.055] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-warning">
            {labels.limitations}
          </p>
          <ul className="mt-2 space-y-1 text-[10px] leading-5 text-warning/70">
            {metadata.limitations.map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {metadata?.confidence_rationale ? (
        <p className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 text-[11px] leading-relaxed text-slate-400">
          {metadata.confidence_rationale}
        </p>
      ) : null}
    </div>
  );
}
