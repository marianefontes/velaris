// ||| Phase IB · /evaluation : academic validation surface
// 5 sections: methodology, instruments (all metrics aggregated),
// baseline (Abraxos vs generic LLM, merged from ComparisonPage),
// status (explicit "pending collection" flag for all metrics).
//
// Rule: metrics shown as definition + target only.
// No fabricated numbers. All status = "pending" until TCC data collection.

import type { ReactNode } from "react";
import { Suspense, lazy } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import { getEvaluationHeader } from "../i18n/pages/technicalPageHeaders";
import {
  Activity,
  Beaker,
  CheckSquare,
  Clock,
  Database,
  FileText,
  Gauge,
  HeartPulse,
  Microscope,
  Radar,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  Telescope,
  ThumbsUp,
  Workflow,
} from "lucide-react";
import { EvaluationMatrix } from "./comparison/EvaluationMatrix";
import { LoadingState, PageHero, PageShell, SectionIntroHeader } from "./ui/VisualPrimitives";

const SystemHealthSection = lazy(() =>
  import("./evaluation/SystemHealthSection").then((module) => ({
    default: module.SystemHealthSection,
  })),
);

// ──────────────────────────────────────────────────────────────────────────
// Section model : 5 sections (health = system reliability diagnostics)
// ──────────────────────────────────────────────────────────────────────────

type FocusId = "methodology" | "instruments" | "baseline" | "status" | "health";

const SECTIONS: Array<{ id: FocusId; icon: typeof Activity }> = [
  { id: "methodology", icon: Microscope },
  { id: "instruments", icon: Target },
  { id: "baseline", icon: Scale },
  { id: "status", icon: Clock },
  { id: "health", icon: HeartPulse },
];

const DIMENSION_IDS = [
  "sus",
  "clarity",
  "trust",
  "precision",
  "satisfaction",
  "task",
  "confidence",
  "explanation",
  "perspective",
  "qualitative",
] as const;

const CLARITY_AXIS_IDS = [
  "directAnswer",
  "evidenceAttribution",
  "vocabularyFit",
  "confidenceCalibration",
  "tradeoffVisibility",
] as const;

const SUS_ITEM_KEYS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
const BASELINE_FEATURE_KEYS = ["0", "1", "2", "3"] as const;

const ECE_BINS = [
  { range: "0.0-0.2", expected: "0.10" },
  { range: "0.2-0.4", expected: "0.30" },
  { range: "0.4-0.6", expected: "0.50" },
  { range: "0.6-0.8", expected: "0.70" },
  { range: "0.8-1.0", expected: "0.90" },
] as const;

const STATUS_ROW_IDS = [
  "sus",
  "clarity",
  "kappa",
  "ece",
  "precision",
  "nps",
  "task",
  "divergence",
  "qualitative",
] as const;

type CollectionStatus = "scaffolded" | "in-progress" | "complete";

// ──────────────────────────────────────────────────────────────────────────
// Page root
// ──────────────────────────────────────────────────────────────────────────

export function EvaluationPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const hashFocus = location.hash.replace("#", "") === "health" ? "health" : null;
  const requestedFocus = searchParams.get("focus") as FocusId | null;
  const focus = requestedFocus ?? hashFocus ?? "methodology";
  const active = SECTIONS.find((section) => section.id === focus) ?? SECTIONS[0];

  const updateFocus = (next: FocusId) => {
    if (next === "methodology") {
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
        {active.id === "methodology" ? <MethodologySection /> : null}
        {active.id === "instruments" ? <InstrumentsSection /> : null}
        {active.id === "baseline" ? <BaselineSection /> : null}
        {active.id === "status" ? <StatusSection /> : null}
        {active.id === "health" ? (
          <Suspense fallback={<HealthSectionFallback />}>
            <SystemHealthSection />
          </Suspense>
        ) : null}
      </div>
    </PageShell>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Hero & nav
// ──────────────────────────────────────────────────────────────────────────

function HealthSectionFallback() {
  const { t } = useI18n();
  return (
    <div className="py-10">
      <LoadingState
        title={t("pages.evaluation.health.loadingTitle")}
        description={t("pages.evaluation.health.loadingDescription")}
      />
    </div>
  );
}

function Hero() {
  const { locale, t } = useI18n();
  const copy = getEvaluationHeader(locale);
  return (
    <PageHero
      eyebrow={
        <>
          <Beaker className="h-3.5 w-3.5" aria-hidden />
          {t("pages.evaluation.eyebrow")}
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
  const copy = getEvaluationHeader(locale);
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
            className={`${isActive ? "section-tab-active" : "section-tab"} shrink-0 xl:min-w-0 xl:flex-col xl:items-start xl:gap-1 xl:text-left`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden strokeWidth={1.5} />
            <span className="font-semibold">{t(`pages.evaluation.sections.${section.id}.label`)}</span>
            <span className="hidden text-[10px] uppercase tracking-widest opacity-50 sm:inline">
              {t(`pages.evaluation.sections.${section.id}.role`)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 1 : Methodology
// ──────────────────────────────────────────────────────────────────────────

function MethodologySection() {
  const { t } = useI18n();
  const M = "pages.evaluation.methodology";

  return (
    <>
      <ZoneShell
        eyebrow={t(`${M}.overview.eyebrow`)}
        title={t(`${M}.overview.title`)}
        caption={t(`${M}.overview.caption`)}
        icon={<Microscope className="h-3.5 w-3.5" aria-hidden />}
      >
        <div className="table-scroll rounded-2xl border border-white/8">
          <table className="w-full text-xs">
            <thead className="bg-white/[0.03] text-[10px] uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">{t(`${M}.table.dimension`)}</th>
                <th className="px-4 py-3 text-left font-semibold">{t(`${M}.table.instrument`)}</th>
                <th className="px-4 py-3 text-left font-semibold">{t(`${M}.table.target`)}</th>
                <th className="px-4 py-3 text-left font-semibold">{t(`${M}.table.status`)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {DIMENSION_IDS.map((id) => (
                <tr key={id}>
                  <td className="px-4 py-3 font-semibold text-slate-100">{t(`${M}.dimensions.${id}.label`)}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-400">{t(`${M}.dimensions.${id}.instrument`)}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-technical-number">{t(`${M}.dimensions.${id}.target`)}</td>
                  <td className="px-4 py-3">
                    <StatusChip status="scaffolded" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ZoneShell>

      <ZoneShell
        eyebrow={t(`${M}.sampling.eyebrow`)}
        title={t(`${M}.sampling.title`)}
      >
        <div className="grid gap-3 lg:grid-cols-3">
          <Card label={t(`${M}.sampling.population.label`)} body={t(`${M}.sampling.population.body`)} />
          <Card label={t(`${M}.sampling.targetSample.label`)} body={t(`${M}.sampling.targetSample.body`)} />
          <Card label={t(`${M}.sampling.ethics.label`)} body={t(`${M}.sampling.ethics.body`)} />
        </div>
      </ZoneShell>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 2 : Instruments & Targets
// ──────────────────────────────────────────────────────────────────────────

function InstrumentsSection() {
  const { t } = useI18n();
  const I = "pages.evaluation.instruments";

  return (
    <>
      <ZoneShell
        eyebrow={t(`${I}.sus.eyebrow`)}
        title={t(`${I}.sus.title`)}
        caption={t(`${I}.sus.caption`)}
        icon={<Gauge className="h-3.5 w-3.5" aria-hidden />}
      >
        <PendingBanner label={t(`${I}.sus.bannerLabel`)} target={t(`${I}.sus.bannerTarget`)} />
        <ol className="space-y-2">
          {SUS_ITEM_KEYS.map((key, index) => (
            <li
              key={key}
              className={`flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-4 text-sm ${index % 2 !== 0 ? "border-rose-300/15" : ""}`}
            >
              <span className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Q{String(index + 1).padStart(2, "0")} · {index % 2 === 0 ? "+" : "−"}
              </span>
              <span className="text-slate-300">{t(`${I}.sus.items.${key}`)}</span>
            </li>
          ))}
        </ol>
      </ZoneShell>

      <ZoneShell
        eyebrow={t(`${I}.clarity.eyebrow`)}
        title={t(`${I}.clarity.title`)}
        caption={t(`${I}.clarity.caption`)}
        icon={<FileText className="h-3.5 w-3.5" aria-hidden />}
      >
        <PendingBanner label={t(`${I}.clarity.bannerLabel`)} target={t(`${I}.clarity.bannerTarget`)} />
        <div className="table-scroll rounded-2xl border border-white/8">
          <table className="w-full text-xs">
            <thead className="bg-white/[0.03] text-[10px] uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">{t(`${I}.clarity.table.axis`)}</th>
                <th className="px-4 py-3 text-left font-semibold">{t(`${I}.clarity.table.anchorLow`)}</th>
                <th className="px-4 py-3 text-left font-semibold">{t(`${I}.clarity.table.anchorHigh`)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {CLARITY_AXIS_IDS.map((id) => (
                <tr key={id}>
                  <td className="px-4 py-3 font-semibold text-slate-200">{t(`${I}.clarity.axes.${id}.axis`)}</td>
                  <td className="px-4 py-3 text-rose-200/80">{t(`${I}.clarity.axes.${id}.anchor1`)}</td>
                  <td className="px-4 py-3 text-success/80">{t(`${I}.clarity.axes.${id}.anchor5`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ZoneShell>

      <ZoneShell
        eyebrow={t(`${I}.trust.eyebrow`)}
        title={t(`${I}.trust.title`)}
        caption={t(`${I}.trust.caption`)}
        icon={<ShieldCheck className="h-3.5 w-3.5" aria-hidden />}
      >
        <PendingBanner label={t(`${I}.trust.bannerLabel`)} target={t(`${I}.trust.bannerTarget`)} />
        <div className="table-scroll rounded-2xl border border-white/8">
          <table className="w-full text-xs">
            <thead className="bg-white/[0.03] text-[10px] uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">{t(`${I}.trust.table.bin`)}</th>
                <th className="px-4 py-3 text-right font-semibold">{t(`${I}.trust.table.expected`)}</th>
                <th className="px-4 py-3 text-right font-semibold">{t(`${I}.trust.table.observed`)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ECE_BINS.map((bin) => (
                <tr key={bin.range}>
                  <td className="px-4 py-3 font-mono text-slate-300">{bin.range}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400">{bin.expected}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-500 italic">
                    {t("pages.evaluation.statuses.pending")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ZoneShell>

      <ZoneShell
        eyebrow={t(`${I}.precision.eyebrow`)}
        title={t(`${I}.precision.title`)}
        caption={t(`${I}.precision.caption`)}
        icon={<Database className="h-3.5 w-3.5" aria-hidden />}
      >
        <PendingBanner label={t(`${I}.precision.bannerLabel`)} target={t(`${I}.precision.bannerTarget`)} />
        <div className="grid gap-3 sm:grid-cols-3">
          <Card label={t(`${I}.precision.procedure.label`)} body={t(`${I}.precision.procedure.body`)} />
          <Card label={t(`${I}.precision.perLens.label`)} body={t(`${I}.precision.perLens.body`)} />
          <Card label={t(`${I}.precision.threshold.label`)} body={t(`${I}.precision.threshold.body`)} />
        </div>
      </ZoneShell>

      <ZoneShell
        eyebrow={t(`${I}.satisfaction.eyebrow`)}
        title={t(`${I}.satisfaction.title`)}
        caption={t(`${I}.satisfaction.caption`)}
        icon={<ThumbsUp className="h-3.5 w-3.5" aria-hidden />}
      >
        <PendingBanner label={t(`${I}.satisfaction.bannerLabel`)} target={t(`${I}.satisfaction.bannerTarget`)} />
      </ZoneShell>

      <ZoneShell
        eyebrow={t(`${I}.task.eyebrow`)}
        title={t(`${I}.task.title`)}
        caption={t(`${I}.task.caption`)}
        icon={<CheckSquare className="h-3.5 w-3.5" aria-hidden />}
      >
        <PendingBanner label={t(`${I}.task.bannerLabel`)} target={t(`${I}.task.bannerTarget`)} />
      </ZoneShell>

      <ZoneShell
        eyebrow={t(`${I}.confidence.eyebrow`)}
        title={t(`${I}.confidence.title`)}
        caption={t(`${I}.confidence.caption`)}
        icon={<Radar className="h-3.5 w-3.5" aria-hidden />}
      >
        <PendingBanner label={t(`${I}.confidence.bannerLabel`)} target={t(`${I}.confidence.bannerTarget`)} />
      </ZoneShell>

      <ZoneShell
        eyebrow={t(`${I}.divergence.eyebrow`)}
        title={t(`${I}.divergence.title`)}
        caption={t(`${I}.divergence.caption`)}
        icon={<Telescope className="h-3.5 w-3.5" aria-hidden />}
      >
        <PendingBanner label={t(`${I}.divergence.bannerLabel`)} target={t(`${I}.divergence.bannerTarget`)} />
        <div className="space-y-3">
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <h3 className="mb-2 text-sm font-semibold text-slate-100">{t(`${I}.divergence.metricTitle`)}</h3>
            <p className="text-xs leading-relaxed text-slate-400">{t(`${I}.divergence.metricBody`)}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <h3 className="mb-2 text-sm font-semibold text-slate-100">{t(`${I}.divergence.convergenceTitle`)}</h3>
            <p className="text-xs leading-relaxed text-slate-400">{t(`${I}.divergence.convergenceBody`)}</p>
          </div>
        </div>
      </ZoneShell>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 3 : Baseline Comparison
// ──────────────────────────────────────────────────────────────────────────

function BaselineSection() {
  const { t } = useI18n();
  const B = "pages.evaluation.baseline";
  const C = "pages.comparison";

  return (
    <>
      <ZoneShell
        eyebrow={t(`${B}.rationale.eyebrow`)}
        title={t(`${B}.rationale.title`)}
        caption={t(`${B}.rationale.caption`)}
        icon={<Scale className="h-3.5 w-3.5" aria-hidden />}
      >
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
          <p className="mb-4 text-sm leading-relaxed text-slate-300">{t(`${C}.why.body`)}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                {t(`${B}.rationale.abraxosTitle`)}
              </div>
              <ul className="space-y-1 text-xs text-slate-400">
                {BASELINE_FEATURE_KEYS.map((key) => (
                  <li key={key} className="flex items-start gap-2">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-success" />
                    {t(`${B}.rationale.abraxos.${key}`)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                {t(`${B}.rationale.genericTitle`)}
              </div>
              <ul className="space-y-1 text-xs text-slate-400">
                {BASELINE_FEATURE_KEYS.map((key) => (
                  <li key={key} className="flex items-start gap-2">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
                    {t(`${B}.rationale.generic.${key}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </ZoneShell>

      <EvaluationMatrix />

      <ZoneShell
        eyebrow={t(`${B}.live.eyebrow`)}
        title={t(`${B}.live.title`)}
        caption={t(`${B}.live.caption`)}
        icon={<Workflow className="h-3.5 w-3.5" aria-hidden />}
      >
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 text-sm text-slate-400">
          {t(`${B}.live.bodyPrefix`)}{" "}
          <a
            href="/perspectives"
            className="text-primary underline underline-offset-2 hover:no-underline"
          >
            {t(`${B}.live.link`)}
          </a>
          {t(`${B}.live.bodySuffix`)}
        </div>
      </ZoneShell>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 4 : Status
// ──────────────────────────────────────────────────────────────────────────

function StatusSection() {
  const { t } = useI18n();
  const S = "pages.evaluation.status";

  return (
    <ZoneShell
      eyebrow={t(`${S}.eyebrow`)}
      title={t(`${S}.title`)}
      caption={t(`${S}.caption`)}
      icon={<Clock className="h-3.5 w-3.5" aria-hidden />}
    >
      <div className="feedback-banner-warning mb-4 rounded-2xl p-4">
        <p className="text-xs">{t(`${S}.warning`)}</p>
      </div>

      <div className="table-scroll rounded-2xl border border-white/8">
        <table className="w-full text-xs">
          <thead className="bg-white/[0.03] text-[10px] uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">{t(`${S}.table.metric`)}</th>
              <th className="px-4 py-3 text-left font-semibold">{t(`${S}.table.target`)}</th>
              <th className="px-4 py-3 text-left font-semibold">{t(`${S}.table.result`)}</th>
              <th className="px-4 py-3 text-left font-semibold">{t(`${S}.table.collectionStatus`)}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {STATUS_ROW_IDS.map((id) => (
              <tr key={id}>
                <td className="px-4 py-3 font-semibold text-slate-100">{t(`${S}.rows.${id}.metric`)}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-technical-number">{t(`${S}.rows.${id}.target`)}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-slate-600 italic">:</td>
                <td className="px-4 py-3">
                  <span className="feedback-pill-warning">
                    <Clock className="h-2.5 w-2.5" aria-hidden />
                    {t("pages.evaluation.statuses.pending")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ZoneShell>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Shared helpers
// ──────────────────────────────────────────────────────────────────────────

function StatusChip({ status }: { status: CollectionStatus }) {
  const { t } = useI18n();
  const tone = {
    scaffolded: "border-slate-500/30 text-slate-400",
    "in-progress": "feedback-pill-warning",
    complete: "feedback-pill-success",
  }[status];
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${tone}`}>
      {t(`pages.evaluation.statuses.${status}`)}
    </span>
  );
}

function PendingBanner({ label, target }: { label: string; target: string }) {
  const { t } = useI18n();
  return (
    <div className="feedback-banner-warning mb-4 flex flex-wrap items-center gap-3 rounded-2xl px-4 py-3">
      <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span className="text-xs">
        {t("pages.evaluation.pendingBanner", { label, target })}
      </span>
    </div>
  );
}

function Card({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
      <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">{label}</h3>
      <p className="text-xs leading-relaxed text-slate-300">{body}</p>
    </div>
  );
}

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
        icon={icon ?? <Activity className="h-3.5 w-3.5" aria-hidden />}
        title={title}
      />
      <div className="section-intro-body">{children}</div>
    </section>
  );
}
