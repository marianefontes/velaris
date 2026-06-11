import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  Database,
  Eye,
  Gauge,
  Layers,
  Link2,
  Minus,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { buildOracleHref } from "../../beatrice/navigation/oracleNavigation";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useI18n } from "../../i18n/I18nProvider";
import { getEvaluationHealthContent } from "../../i18n/pages/evaluationHealth";
import { SectionIntroHeader } from "../ui/VisualPrimitives";

type HealthStatus = "healthy" | "attention" | "critical" | "evolving";
type HealthTrend = "improving" | "stable" | "declining";

const METRIC_ICONS: Record<string, LucideIcon> = {
  rag: Database,
  catalog: Layers,
  attribution: Link2,
  perspectives: Users,
  validation: ShieldCheck,
  unknownComponents: AlertTriangle,
  calibration: Gauge,
  evidenceGaps: BookOpen,
  governance: Sparkles,
  accessibility: Eye,
};

const METRIC_SCORES: Record<string, { score: number; status: HealthStatus; trend?: HealthTrend }> = {
  rag: { score: 88, status: "healthy", trend: "improving" },
  catalog: { score: 79, status: "attention", trend: "stable" },
  attribution: { score: 91, status: "healthy", trend: "improving" },
  perspectives: { score: 72, status: "attention", trend: "stable" },
  validation: { score: 68, status: "evolving", trend: "improving" },
  unknownComponents: { score: 86, status: "healthy", trend: "stable" },
  calibration: { score: 74, status: "attention", trend: "improving" },
  evidenceGaps: { score: 65, status: "critical", trend: "declining" },
  governance: { score: 82, status: "evolving", trend: "improving" },
  accessibility: { score: 77, status: "attention", trend: "stable" },
};

const TIMELINE_DATA = [
  { month: "Jan", score: 71 },
  { month: "Fev", score: 78 },
  { month: "Mar", score: 84 },
];

const METRIC_IDS = [
  "governance",
  "rag",
  "catalog",
  "attribution",
  "perspectives",
  "validation",
  "unknownComponents",
  "calibration",
  "evidenceGaps",
  "accessibility",
] as const;

const ALERT_IDS = ["edgeCases", "perspectives", "tradeoffs", "parity", "empirical"] as const;
const MEASURE_IDS = [
  "knowledge",
  "rag",
  "catalog",
  "hallucination",
  "perspectives",
  "traceability",
  "confidence",
] as const;

const MEASURE_THEMES: Record<
  (typeof MEASURE_IDS)[number],
  { icon: LucideIcon; shell: string; iconShell: string; title: string }
> = {
  knowledge: {
    icon: BookOpen,
    shell: "border-primary/20 bg-primary/[0.05]",
    iconShell: "border-primary/25 bg-primary/12 text-primary",
    title: "text-primary",
  },
  rag: {
    icon: Database,
    shell: "border-sky-400/20 bg-sky-400/[0.05]",
    iconShell: "border-sky-400/25 bg-sky-400/12 text-sky-300",
    title: "text-sky-200",
  },
  catalog: {
    icon: Layers,
    shell: "border-violet-400/20 bg-violet-400/[0.05]",
    iconShell: "border-violet-400/25 bg-violet-400/12 text-violet-300",
    title: "text-violet-200",
  },
  hallucination: {
    icon: ShieldCheck,
    shell: "border-rose-400/20 bg-rose-400/[0.05]",
    iconShell: "border-rose-400/25 bg-rose-400/12 text-rose-300",
    title: "text-rose-200",
  },
  perspectives: {
    icon: Users,
    shell: "border-amber-400/20 bg-amber-400/[0.05]",
    iconShell: "border-amber-400/25 bg-amber-400/12 text-amber-300",
    title: "text-amber-200",
  },
  traceability: {
    icon: Link2,
    shell: "border-emerald-400/20 bg-emerald-400/[0.05]",
    iconShell: "border-emerald-400/25 bg-emerald-400/12 text-emerald-300",
    title: "text-emerald-200",
  },
  confidence: {
    icon: Gauge,
    shell: "border-lime-400/20 bg-lime-400/[0.05]",
    iconShell: "border-lime-400/25 bg-lime-400/12 text-lime-300",
    title: "text-lime-200",
  },
};

export function SystemHealthSection() {
  const { locale } = useI18n();
  const copy = getEvaluationHealthContent(locale);

  return (
    <section
      id="health"
      data-abraxos-focus="evaluation-health"
      className="content-section scroll-mt-28"
    >
      <SectionIntroHeader
        description={copy.description}
        eyebrow={copy.eyebrow}
        icon={<Gauge className="h-3.5 w-3.5" aria-hidden />}
        title={copy.title}
      />

      <div className="section-intro-body">
        <GovernanceAgentSpotlight copy={copy} />

        <div className="health-subsection">
          <OverallHealthCard copy={copy} />
        </div>

        <div className="health-subsection">
          <h3 className="subsection-heading">{copy.timeline.title}</h3>
          <HealthTimeline copy={copy} />
        </div>

        <div className="health-subsection">
          <h3 className="subsection-heading">{copy.metricsGrid.title}</h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-5">
            {METRIC_IDS.map((id) => (
              <HealthMetricCard key={id} copy={copy} metricId={id} />
            ))}
          </div>
        </div>

        <div className="health-subsection">
          <AlertsPanel copy={copy} />
        </div>

        <div className="health-subsection">
          <MeasuresPanel copy={copy} />
        </div>

        <div className="health-subsection">
          <ResearchSurfacesPanel copy={copy} />
        </div>
      </div>
    </section>
  );
}

type HealthCopy = ReturnType<typeof getEvaluationHealthContent>;

function OverallHealthCard({ copy }: { copy: HealthCopy }) {
  return (
    <article
      className="rounded-2xl border border-primary/20 bg-[linear-gradient(135deg,rgba(169,153,198,0.12),rgba(255,255,255,0.02))] p-6 shadow-[0_0_40px_rgba(169,153,198,0.08)]"
      aria-label={copy.overall.label}
    >
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary/80">
            {copy.overall.label}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
            {copy.overall.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <StatusBadge copy={copy} status="evolving" />
            <TrendBadge copy={copy} trend="improving" />
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            {copy.overall.scoreLabel}
          </p>
          <p className="mt-1 font-mono text-5xl font-semibold tracking-[-0.04em] text-white" aria-hidden>
            84<span className="text-2xl text-primary">%</span>
          </p>
          <span className="sr-only">{copy.overall.scoreSr.replace("{score}", "84")}</span>
        </div>
      </div>
    </article>
  );
}

function HealthMetricCard({
  copy,
  metricId,
}: {
  copy: HealthCopy;
  metricId: (typeof METRIC_IDS)[number];
}) {
  const data = METRIC_SCORES[metricId];
  const Icon = METRIC_ICONS[metricId] ?? Gauge;
  const metric = copy.metrics[metricId];
  const isGovernance = metricId === "governance";

  const card = (
    <article
      className={`rounded-2xl border border-white/8 bg-white/[0.02] p-4 ${
        isGovernance ? "transition-colors hover:border-emerald-400/25 hover:bg-emerald-400/[0.03]" : ""
      }`}
      aria-label={`${metric.label}: ${data.score}%`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/[0.06] text-primary">
          <Icon className="h-3.5 w-3.5" aria-hidden />
        </span>
        <p className="font-mono text-2xl font-semibold tracking-[-0.03em] text-white">
          {data.score}<span className="text-sm text-primary">%</span>
        </p>
      </div>
      <h4 className="text-xs font-semibold text-slate-100">{metric.label}</h4>
      <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">{metric.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusBadge copy={copy} status={data.status} compact />
        {data.trend ? <TrendBadge copy={copy} trend={data.trend} compact /> : null}
      </div>
      {isGovernance ? (
        <p className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-300/80">
          Governance Agent
          <ArrowRight className="h-3 w-3" aria-hidden />
        </p>
      ) : null}
    </article>
  );

  if (isGovernance) {
    return (
      <Link to="#governance-agent" className="focus-ring block rounded-2xl">
        {card}
      </Link>
    );
  }

  return card;
}

function HealthTimeline({ copy }: { copy: HealthCopy }) {
  const { locale } = useI18n();
  const months =
    locale === "en-US"
      ? [
          { month: "Jan", score: 71 },
          { month: "Feb", score: 78 },
          { month: "Mar", score: 84 },
        ]
      : TIMELINE_DATA;

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
      <div className="mb-4 flex flex-wrap gap-4 sm:hidden">
        {months.map((point) => (
          <div key={point.month} className="surface-panel-subtle min-w-[4.5rem] px-3 py-2 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{point.month}</p>
            <p className="mt-1 font-mono text-lg font-semibold text-white">{point.score}%</p>
          </div>
        ))}
      </div>
      <div className="hidden h-36 sm:block" aria-hidden>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={months} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[60, 90]}
              tick={{ fill: "#64748b", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(15,15,20,0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                fontSize: 12,
              }}
              formatter={(value: number) => [`${value}%`, copy.timeline.score]}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#a999c6"
              strokeWidth={2}
              dot={{ fill: "#a999c6", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 5, fill: "#c4b5fd" }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="sr-only">
        {months.map((point) => `${point.month}: ${point.score}%`).join(", ")}
      </p>
    </div>
  );
}

function GovernanceAgentSpotlight({ copy }: { copy: HealthCopy }) {
  const agent = copy.governanceAgent;

  return (
    <article
      id="governance-agent"
      data-abraxos-focus="governance-agent"
      className="scroll-mt-28 overflow-hidden rounded-2xl border border-emerald-500/20 bg-[linear-gradient(135deg,rgba(52,211,153,0.08),rgba(255,255,255,0.02))] shadow-[0_0_40px_rgba(52,211,153,0.06)]"
    >
      <div className="border-b border-white/[0.07] p-5 sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
            <Sparkles className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300/80">
              {agent.eyebrow}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h3 className="font-serif text-xl font-semibold text-white">{agent.title}</h3>
              <code className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-2.5 py-1 font-mono text-xs font-semibold text-emerald-300">
                {agent.command}
              </code>
              <span className="rounded-full border border-secondary/20 bg-secondary/[0.07] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-secondary">
                {agent.modeBadge}
              </span>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">{agent.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                to="/governance"
                className="focus-ring inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/15"
              >
                {agent.openDashboard}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
              <Link
                to={buildOracleHref("/governance")}
                className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-slate-200 transition hover:bg-white/[0.08]"
              >
                {agent.runInOracle}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 border-t border-white/[0.07] p-5 sm:grid-cols-2 sm:gap-6 sm:p-6">
        <SpotlightField label={agent.whenToUse} value={agent.whenToUseBody} />
        <SpotlightField label={agent.exampleInput} value={agent.command} mono />
        <SpotlightField label={agent.expectedOutput} value={agent.expectedOutputBody} />
        <SpotlightField label={agent.ragEvidence} value={agent.ragEvidenceBody} />
        <SpotlightField label={agent.combinesWith} value={agent.combinesWithBody} className="sm:col-span-2" />
      </div>
    </article>
  );
}

function SpotlightField({
  label,
  value,
  mono,
  className,
}: {
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className={`mt-1.5 text-sm leading-relaxed text-slate-300 ${mono ? "font-mono text-emerald-200/90" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function AlertsPanel({ copy }: { copy: HealthCopy }) {
  return (
    <div>
      <h3 className="subsection-heading">{copy.alerts.title}</h3>
      <ul className="space-y-2" role="list">
        {ALERT_IDS.map((id) => (
          <li
            key={id}
            className="flex items-start gap-3 rounded-xl border border-amber-500/15 bg-amber-500/[0.04] px-4 py-3"
          >
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" aria-hidden />
            <span className="text-xs leading-relaxed text-slate-300">{copy.alerts.items[id]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResearchSurfacesPanel({ copy }: { copy: HealthCopy }) {
  const surfaces = [
    { id: "knowledgeHealth", to: "/knowledge-health", icon: BookOpen },
    { id: "intelligenceLab", to: "/intelligence-lab", icon: BrainCircuit },
    { id: "governance", to: "/governance", icon: Sparkles },
  ] as const;

  return (
    <div>
      <h3 className="subsection-heading">{copy.research.title}</h3>
      <p className="-mt-2 mb-4 max-w-2xl text-xs leading-relaxed text-slate-500">{copy.research.caption}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {surfaces.map(({ id, to, icon: Icon }) => {
          const surface = copy.research.surfaces[id];
          return (
            <Link
              key={id}
              to={to}
              className="focus-ring group flex min-h-[7.5rem] flex-col justify-between rounded-2xl border border-white/8 bg-white/[0.02] p-4 transition-colors hover:border-primary/25 hover:bg-white/[0.04]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-primary/15 bg-primary/[0.06] text-primary">
                <Icon className="h-3.5 w-3.5" aria-hidden />
              </span>
              <div className="mt-3">
                <p className="text-xs font-semibold text-slate-100">{surface.label}</p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">{surface.description}</p>
              </div>
              <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-primary/80 group-hover:text-primary">
                {to}
                <ArrowRight className="h-3 w-3" aria-hidden />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function MeasuresPanel({ copy }: { copy: HealthCopy }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-primary/15 bg-[linear-gradient(135deg,rgba(169,153,198,0.07),rgba(255,255,255,0.02))] shadow-[0_0_32px_rgba(169,153,198,0.05)]">
      <header className="border-b border-white/[0.07] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <Gauge className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <h3 className="subsection-heading mb-1">{copy.measures.title}</h3>
            <p className="max-w-2xl text-xs leading-relaxed text-slate-400">{copy.measures.caption}</p>
          </div>
        </div>
      </header>

      <ul className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-6" role="list">
        {MEASURE_IDS.map((id, index) => {
          const theme = MEASURE_THEMES[id];
          const Icon = theme.icon;
          const isLast = index === MEASURE_IDS.length - 1;

          return (
            <li
              key={id}
              className={`flex items-start gap-3 rounded-xl border p-4 ${theme.shell} ${
                isLast ? "sm:col-span-2 lg:col-span-3" : ""
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${theme.iconShell}`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className={`text-xs font-semibold leading-snug ${theme.title}`}>
                  {copy.measures.labels[id]}
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-300">{copy.measures.items[id]}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

function StatusBadge({
  copy,
  status,
  compact,
}: {
  copy: HealthCopy;
  status: HealthStatus;
  compact?: boolean;
}) {
  const label = copy.statuses[status];
  const styles: Record<HealthStatus, string> = {
    healthy: "border-emerald-500/25 bg-emerald-500/10 text-emerald-200",
    attention: "border-amber-500/25 bg-amber-500/10 text-amber-200",
    critical: "border-rose-500/25 bg-rose-500/10 text-rose-200",
    evolving: "border-primary/25 bg-primary/10 text-primary",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-bold uppercase tracking-widest ${styles[status]} ${compact ? "px-2 py-0.5 text-[9px]" : "px-2.5 py-1 text-[10px]"}`}
    >
      {label}
    </span>
  );
}

function TrendBadge({
  copy,
  trend,
  compact,
}: {
  copy: HealthCopy;
  trend: HealthTrend;
  compact?: boolean;
}) {
  const label = copy.trends[trend];
  const Icon =
    trend === "improving" ? ArrowUpRight : trend === "declining" ? ArrowDownRight : Minus;
  const styles: Record<HealthTrend, string> = {
    improving: "border-emerald-500/20 text-emerald-300",
    stable: "border-slate-500/20 text-slate-400",
    declining: "border-rose-500/20 text-rose-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border bg-white/[0.02] font-semibold ${styles[trend]} ${compact ? "px-2 py-0.5 text-[9px]" : "px-2.5 py-1 text-[10px]"}`}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {label}
    </span>
  );
}
