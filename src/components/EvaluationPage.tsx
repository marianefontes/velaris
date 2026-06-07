// ||| Phase IB · /evaluation — academic validation surface
// 4 final sections: methodology, instruments (all metrics aggregated),
// baseline (Beatrice vs generic LLM, merged from ComparisonPage),
// status (explicit "pending collection" flag for all metrics).
//
// Rule: metrics shown as definition + target only.
// No fabricated numbers. All status = "pending" until TCC data collection.

import type { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import {
  Activity,
  Beaker,
  CheckSquare,
  Clock,
  Database,
  FileText,
  Gauge,
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

// ──────────────────────────────────────────────────────────────────────────
// Section model — 4 final sections per spec
// ──────────────────────────────────────────────────────────────────────────

type FocusId = "methodology" | "instruments" | "baseline" | "status";

const SECTIONS: Array<{ id: FocusId; label: string; role: string; icon: typeof Activity }> = [
  { id: "methodology", label: "Methodology", role: "evaluation framework", icon: Microscope },
  { id: "instruments", label: "Instruments & Targets", role: "metrics", icon: Target },
  { id: "baseline", label: "Baseline Comparison", role: "Beatrice vs generic LLM", icon: Scale },
  { id: "status", label: "Status", role: "data collection", icon: Clock },
];

// ──────────────────────────────────────────────────────────────────────────
// Page root
// ──────────────────────────────────────────────────────────────────────────

export function EvaluationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focus = (searchParams.get("focus") as FocusId | null) ?? "methodology";
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
    <div className="mx-auto w-full max-w-[1280px] px-6 py-10 text-slate-200 lg:px-10">
      <Hero />
      <SectionNav active={active.id} onChange={updateFocus} />

      <div className="mt-10">
        {active.id === "methodology" ? <MethodologySection /> : null}
        {active.id === "instruments" ? <InstrumentsSection /> : null}
        {active.id === "baseline" ? <BaselineSection /> : null}
        {active.id === "status" ? <StatusSection /> : null}
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
        <Beaker className="h-3.5 w-3.5" aria-hidden />
        {t("pages.evaluation.eyebrow")}
      </div>
      <h1 className="page-h1">
        How Aetheris is <em className="not-italic text-primary">measured</em>.
      </h1>
      <p className="page-lead">
        The platform is a research artifact. This surface scaffolds the methodology that turns it
        into measured results — what is measured, how it is measured, what ranges count as evidence,
        and what remains pending collection.
      </p>
    </header>
  );
}

function SectionNav({ active, onChange }: { active: FocusId; onChange: (next: FocusId) => void }) {
  const { t } = useI18n();
  return (
    <nav aria-label="Evaluation sections" className="flex flex-wrap gap-2">
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
// SECTION 1 — Methodology (was overview)
// ──────────────────────────────────────────────────────────────────────────

type CollectionStatus = "scaffolded" | "in-progress" | "complete";

interface EvalDimension {
  id: string;
  label: string;
  instrument: string;
  target: string;
  status: CollectionStatus;
}

const DIMENSIONS: EvalDimension[] = [
  { id: "sus", label: "System Usability Scale", instrument: "Brooke, 1996 — 10 items, 5-point Likert", target: "≥ 75 (good)", status: "scaffolded" },
  { id: "clarity", label: "Explanation clarity", instrument: "5-axis rubric, blind-rated", target: "mean ≥ 4/5", status: "scaffolded" },
  { id: "trust", label: "Trust calibration", instrument: "Confidence vs accuracy delta", target: "ECE ≤ 0.10", status: "scaffolded" },
  { id: "precision", label: "Retrieval precision @ k", instrument: "Top-3 relevance vote against gold set", target: "P@3 ≥ 0.80", status: "scaffolded" },
  { id: "satisfaction", label: "User satisfaction", instrument: "Post-session NPS-style score", target: "NPS ≥ +30", status: "scaffolded" },
  { id: "task", label: "Task success", instrument: "Pre-defined scenarios, pass/partial/fail", target: "≥ 80% pass", status: "scaffolded" },
  { id: "confidence", label: "Confidence distribution", instrument: "Histogram of stated confidence per regime", target: "<10% in low band by design", status: "scaffolded" },
  { id: "explanation", label: "Explanation quality rubric", instrument: "5 axes × 5-point scale, 3 raters", target: "Cohen's κ ≥ 0.60", status: "scaffolded" },
  { id: "perspective", label: "Cross-perspective divergence", instrument: "Same query × N lenses, semantic delta", target: "principled divergence on ≥ 70% of cases", status: "scaffolded" },
  { id: "qualitative", label: "Qualitative feedback", instrument: "Thematic analysis of open-ended responses", target: "saturation at 12+ participants", status: "scaffolded" },
];

function MethodologySection() {
  return (
    <>
      <ZoneShell
        eyebrow="Methodology overview"
        title="Ten dimensions, ten instruments"
        caption="Each row below is a deliberate measurement. Status is explicit — all are scaffolded (rubric defined, collection pending). The TCC will report against this exact table."
        icon={<Microscope className="h-3.5 w-3.5" aria-hidden />}
      >
        <div className="overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-xs">
            <thead className="bg-white/[0.03] text-[10px] uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Dimension</th>
                <th className="px-4 py-3 text-left font-semibold">Instrument</th>
                <th className="px-4 py-3 text-left font-semibold">Target</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {DIMENSIONS.map((dim) => (
                <tr key={dim.id}>
                  <td className="px-4 py-3 font-semibold text-slate-100">{dim.label}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-400">{dim.instrument}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-cyan-300">{dim.target}</td>
                  <td className="px-4 py-3">
                    <StatusChip status={dim.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ZoneShell>

      <ZoneShell
        eyebrow="Sampling frame"
        title="Population, sample size, ethics"
      >
        <div className="grid gap-3 lg:grid-cols-3">
          <Card label="Population" body="Design-system practitioners (designers, frontend engineers, PMs, QAs, content strategists) at organizations operating multi-product platforms. Mid-to-senior level." />
          <Card label="Target sample" body="N ≥ 18 across the 7 cognitive perspectives, minimum 2 per perspective. Mixed-method: 30-minute structured session + open-ended exit interview." />
          <Card label="Ethics" body="Informed consent. No PII captured. Session recordings anonymized at transcription. Raw data retained 12 months for academic audit." />
        </div>
      </ZoneShell>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 2 — Instruments & Targets (all metrics aggregated)
// ──────────────────────────────────────────────────────────────────────────

const SUS_ITEMS = [
  "I think that I would like to use this system frequently.",
  "I found the system unnecessarily complex.",
  "I thought the system was easy to use.",
  "I think that I would need the support of a technical person to be able to use this system.",
  "I found the various functions in this system were well integrated.",
  "I thought there was too much inconsistency in this system.",
  "I would imagine that most people would learn to use this system very quickly.",
  "I found the system very cumbersome to use.",
  "I felt very confident using the system.",
  "I needed to learn a lot of things before I could get going with this system.",
];

const CLARITY_AXES = [
  { axis: "Direct answer", anchor1: "Buried in qualifications", anchor5: "Lands in the first sentence" },
  { axis: "Evidence attribution", anchor1: "Unsourced assertion", anchor5: "Every claim traced to a chunk" },
  { axis: "Vocabulary fit", anchor1: "Generic technical prose", anchor5: "Active lens vocabulary throughout" },
  { axis: "Confidence calibration", anchor1: "Confident wherever, hedged nowhere", anchor5: "Calibration matches evidence strength" },
  { axis: "Trade-off visibility", anchor1: "Only the chosen path appears", anchor5: "Alternatives named and weighed" },
];

function InstrumentsSection() {
  return (
    <>
      <ZoneShell
        eyebrow="SUS — System Usability Scale"
        title="10-item Likert scale (Brooke 1996)"
        caption="Target ≥ 75 (good). Pending collection. Score = ((Σ odd − 5) + (25 − Σ even)) × 2.5, range 0–100."
        icon={<Gauge className="h-3.5 w-3.5" aria-hidden />}
      >
        <PendingBanner label="SUS score" target="≥ 75" />
        <ol className="space-y-2">
          {SUS_ITEMS.map((item, index) => (
            <li key={item} className={`flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-4 text-sm ${index % 2 !== 0 ? "border-rose-300/15" : ""}`}>
              <span className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Q{String(index + 1).padStart(2, "0")} · {index % 2 === 0 ? "+" : "−"}
              </span>
              <span className="text-slate-300">{item}</span>
            </li>
          ))}
        </ol>
      </ZoneShell>

      <ZoneShell
        eyebrow="Explanation Clarity — 5-axis rubric"
        title="Blind-rated, 3 raters, Cohen's κ ≥ 0.60"
        caption="Target mean ≥ 4/5 per axis. Pending collection. Anchors below are the 1 and 5 marks."
        icon={<FileText className="h-3.5 w-3.5" aria-hidden />}
      >
        <PendingBanner label="Clarity mean" target="≥ 4/5 per axis" />
        <div className="overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-xs">
            <thead className="bg-white/[0.03] text-[10px] uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Axis</th>
                <th className="px-4 py-3 text-left font-semibold">1 — anchor low</th>
                <th className="px-4 py-3 text-left font-semibold">5 — anchor high</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {CLARITY_AXES.map((row) => (
                <tr key={row.axis}>
                  <td className="px-4 py-3 font-semibold text-slate-200">{row.axis}</td>
                  <td className="px-4 py-3 text-rose-200/80">{row.anchor1}</td>
                  <td className="px-4 py-3 text-emerald-200/80">{row.anchor5}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ZoneShell>

      <ZoneShell
        eyebrow="Trust Calibration — ECE"
        title="Expected Calibration Error ≤ 0.10"
        caption="ECE = Σᵢ (nᵢ/N) · |accᵢ − confᵢ| over k bins. Per-perspective ECE tracked. All bins pending collection."
        icon={<ShieldCheck className="h-3.5 w-3.5" aria-hidden />}
      >
        <PendingBanner label="ECE" target="≤ 0.10" />
        <div className="overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-xs">
            <thead className="bg-white/[0.03] text-[10px] uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Confidence bin</th>
                <th className="px-4 py-3 text-right font-semibold">Expected accuracy</th>
                <th className="px-4 py-3 text-right font-semibold">Observed accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { range: "0.0–0.2", expected: "0.10", observed: "pending" },
                { range: "0.2–0.4", expected: "0.30", observed: "pending" },
                { range: "0.4–0.6", expected: "0.50", observed: "pending" },
                { range: "0.6–0.8", expected: "0.70", observed: "pending" },
                { range: "0.8–1.0", expected: "0.90", observed: "pending" },
              ].map((bin) => (
                <tr key={bin.range}>
                  <td className="px-4 py-3 font-mono text-slate-300">{bin.range}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400">{bin.expected}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-500 italic">{bin.observed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ZoneShell>

      <ZoneShell
        eyebrow="Retrieval Precision @ k"
        title="P@3 ≥ 0.80 against gold set"
        caption="Top-3 relevance vote by domain experts against curated query–answer pairs. Pending collection."
        icon={<Database className="h-3.5 w-3.5" aria-hidden />}
      >
        <PendingBanner label="P@3" target="≥ 0.80" />
        <div className="grid gap-3 sm:grid-cols-3">
          <Card label="Procedure" body="Curated 20-query gold set. 2 domain-expert raters vote relevance per returned chunk. P@k = fraction of top-k chunks rated relevant." />
          <Card label="Per-lens" body="P@3 tracked separately per perspective since retrieval weights differ across lenses." />
          <Card label="Threshold" body="P@3 < 0.70 triggers corpus audit (missing page_type) and retrieval weight recalibration." />
        </div>
      </ZoneShell>

      <ZoneShell
        eyebrow="User Satisfaction — NPS"
        title="Net Promoter Score ≥ +30"
        caption="Post-session NPS-style 0–10 rating with open-ended reason. Pending collection."
        icon={<ThumbsUp className="h-3.5 w-3.5" aria-hidden />}
      >
        <PendingBanner label="NPS" target="≥ +30" />
      </ZoneShell>

      <ZoneShell
        eyebrow="Task Success"
        title="≥ 80% pass rate on pre-defined scenarios"
        caption="Pre-defined task scenarios rated pass / partial / fail. Pending collection."
        icon={<CheckSquare className="h-3.5 w-3.5" aria-hidden />}
      >
        <PendingBanner label="Task success" target="≥ 80% pass" />
      </ZoneShell>

      <ZoneShell
        eyebrow="Confidence Distribution"
        title="< 10% in low-confidence band by design"
        caption="Histogram of stated confidence levels per regime. Pending collection."
        icon={<Radar className="h-3.5 w-3.5" aria-hidden />}
      >
        <PendingBanner label="Low-confidence band" target="< 10%" />
      </ZoneShell>

      <ZoneShell
        eyebrow="Cross-perspective Divergence"
        title="Principled divergence on ≥ 70% of queries"
        caption="Same query × N lenses, semantic delta. Divergence must be explained by lens vocabulary (verified by rubric)."
        icon={<Telescope className="h-3.5 w-3.5" aria-hidden />}
      >
        <PendingBanner label="Divergence rate" target="≥ 70% principled" />
        <div className="space-y-3">
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <h3 className="mb-2 text-sm font-semibold text-slate-100">Divergence metric</h3>
            <p className="text-xs leading-relaxed text-slate-400">For a query Q, run Beatrice through every perspective P. Compute semantic similarity between responses pairwise. Divergence = 1 − mean(pairwise similarity). Principled divergence requires the divergent dimension to be one the perspective's vocabulary named.</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <h3 className="mb-2 text-sm font-semibold text-slate-100">Convergence threshold</h3>
            <p className="text-xs leading-relaxed text-slate-400">On queries where evidence is unambiguous (factual lookup), responses should converge. Convergence rate = fraction of unambiguous queries where divergence &lt; 0.20.</p>
          </div>
        </div>
      </ZoneShell>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 3 — Baseline Comparison (merged from ComparisonPage)
// ──────────────────────────────────────────────────────────────────────────

function BaselineSection() {
  const { t } = useI18n();
  const P = "pages.comparison";

  return (
    <>
      <ZoneShell
        eyebrow="Baseline rationale"
        title="Why compare Beatrice to a generic LLM"
        caption="The evaluation baseline is a generic LLM answering the same design-system questions without retrieval, source attribution or confidence calibration. The delta between the two models on each criterion is the primary academic contribution."
        icon={<Scale className="h-3.5 w-3.5" aria-hidden />}
      >
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
          <p className="mb-4 text-sm leading-relaxed text-slate-300">
            {t(`${P}.why.body`)}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Beatrice — RAG + XAI</div>
              <ul className="space-y-1 text-xs text-slate-400">
                <li className="flex items-start gap-2"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-300" /> Domain-grounded via ChromaDB corpus</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-300" /> Source attribution per claim</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-300" /> Confidence calibrated from retrieval similarity</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-300" /> Perspective-adaptive framing</li>
              </ul>
            </div>
            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Generic LLM</div>
              <ul className="space-y-1 text-xs text-slate-400">
                <li className="flex items-start gap-2"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-slate-500" /> Broad parametric knowledge only</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-slate-500" /> No source attribution</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-slate-500" /> No explicit confidence signal</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-slate-500" /> No domain constraint</li>
              </ul>
            </div>
          </div>
        </div>
      </ZoneShell>

      <EvaluationMatrix />

      <ZoneShell
        eyebrow="Live comparison"
        title="Try it — same question, two reasoning models"
        caption="The live comparison demo has moved to Oracle. Ask Beatrice a design-system question, then compare to a generic LLM answer via the Perspectives surface."
        icon={<Workflow className="h-3.5 w-3.5" aria-hidden />}
      >
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 text-sm text-slate-400">
          The live head-to-head demo (Beatrice vs generic LLM, same query) is accessible at{" "}
          <a
            href="/perspectives"
            className="text-primary underline underline-offset-2 hover:no-underline"
          >
            Perspectives → Comparison
          </a>
          . The matrix above is the static, citable version for the TCC evaluation appendix.
        </div>
      </ZoneShell>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 4 — Status (explicit "pending collection" for all metrics)
// ──────────────────────────────────────────────────────────────────────────

function StatusSection() {
  return (
    <ZoneShell
      eyebrow="Data collection status"
      title="What has been collected — and what has not"
      caption="All metrics are scaffolded: rubric defined, instruments ready, targets set. No data collected yet. The TCC evaluation chapter will fill this table with real results."
      icon={<Clock className="h-3.5 w-3.5" aria-hidden />}
    >
      <div className="mb-4 rounded-2xl border border-amber-300/20 bg-amber-300/[0.04] p-4">
        <p className="text-xs text-amber-200">
          <strong className="text-amber-300">All metrics below are pending data collection.</strong>{" "}
          Numbers shown are targets and definitions — not results. Fabricated results would
          invalidate the academic contribution.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8">
        <table className="w-full text-xs">
          <thead className="bg-white/[0.03] text-[10px] uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Metric</th>
              <th className="px-4 py-3 text-left font-semibold">Target</th>
              <th className="px-4 py-3 text-left font-semibold">Result</th>
              <th className="px-4 py-3 text-left font-semibold">Collection status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[
              { metric: "SUS", target: "≥ 75", result: "—", status: "pending" as const },
              { metric: "Explanation clarity (mean)", target: "≥ 4/5 per axis", result: "—", status: "pending" as const },
              { metric: "Cohen's κ (inter-rater)", target: "≥ 0.60", result: "—", status: "pending" as const },
              { metric: "ECE (trust calibration)", target: "≤ 0.10", result: "—", status: "pending" as const },
              { metric: "Retrieval P@3", target: "≥ 0.80", result: "—", status: "pending" as const },
              { metric: "NPS (satisfaction)", target: "≥ +30", result: "—", status: "pending" as const },
              { metric: "Task success rate", target: "≥ 80% pass", result: "—", status: "pending" as const },
              { metric: "Cross-perspective divergence", target: "≥ 70% principled", result: "—", status: "pending" as const },
              { metric: "Qualitative saturation", target: "12+ participants", result: "—", status: "pending" as const },
            ].map((row) => (
              <tr key={row.metric}>
                <td className="px-4 py-3 font-semibold text-slate-100">{row.metric}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-cyan-300">{row.target}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-slate-600 italic">{row.result}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-300">
                    <Clock className="h-2.5 w-2.5" aria-hidden />
                    pending
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
  const tone = {
    scaffolded: "border-slate-500/30 text-slate-400",
    "in-progress": "border-amber-300/30 text-amber-300",
    complete: "border-emerald-300/30 text-emerald-300",
  }[status];
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${tone}`}>
      {status}
    </span>
  );
}

function PendingBanner({ label, target }: { label: string; target: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/[0.04] px-4 py-3">
      <Clock className="h-3.5 w-3.5 shrink-0 text-amber-300" aria-hidden />
      <span className="text-xs text-amber-200">
        <strong className="text-amber-300">{label}</strong>: target {target} — pending data collection.
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
      <header className="mb-4 flex items-baseline gap-3">
        <span className="section-eyebrow">
          {icon ?? <Activity className="h-3.5 w-3.5" aria-hidden />}
          {eyebrow}
        </span>
      </header>
      <h2 className="section-h2">{title}</h2>
      {caption ? <p className="section-lead">{caption}</p> : null}
      {children}
    </section>
  );
}
