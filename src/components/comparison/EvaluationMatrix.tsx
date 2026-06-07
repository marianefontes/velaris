import { Sparkles } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";

// ||| Qualitative comparison across the dimensions that matter for decision
// support. Levels live in code (they drive color); all copy is localized.
// The generic side is "low" because it lacks the mechanism, not because it is bad.

type Level = "high" | "medium" | "low" | "none";

// id ↔ level mapping. Text comes from pages.comparison.matrix.items.<id>.
const CRITERIA: Array<{ id: string; beatriceLevel: Level; genericLevel: Level }> = [
  { id: "domain-grounding", beatriceLevel: "high", genericLevel: "low" },
  { id: "source-traceability", beatriceLevel: "high", genericLevel: "none" },
  { id: "confidence-calibration", beatriceLevel: "high", genericLevel: "none" },
  { id: "ds-specificity", beatriceLevel: "high", genericLevel: "low" },
  { id: "decision-usefulness", beatriceLevel: "high", genericLevel: "medium" },
  { id: "hallucination-risk", beatriceLevel: "low", genericLevel: "high" },
];

const LEVEL_STYLE: Record<Level, string> = {
  high: "text-emerald-300 border-emerald-300/30 bg-emerald-300/10",
  medium: "text-amber-300 border-amber-300/30 bg-amber-300/10",
  low: "text-slate-400 border-white/10 bg-surface-container/60",
  none: "text-slate-600 border-white/[0.06] bg-surface-container/40",
};

export function EvaluationMatrix() {
  const { t } = useI18n();
  const M = "pages.comparison.matrix";

  const LevelTag = ({ level }: { level: Level }) => (
    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${LEVEL_STYLE[level]}`}>
      {t(`${M}.levels.${level}`)}
    </span>
  );

  return (
    <section className="content-section">
      <span className="section-eyebrow">
        <Sparkles className="h-3.5 w-3.5" aria-hidden />
        {t(`${M}.eyebrow`)}
      </span>
      <h2 className="section-h2">{t(`${M}.title`)}</h2>
      <p className="section-lead">{t(`${M}.lead`)}</p>

      <div className="content-card overflow-hidden p-0">
        {/* Header row — hidden on mobile, where each criterion stacks. */}
        <div className="hidden grid-cols-[1.2fr_1.4fr_1.4fr] gap-4 border-b border-white/[0.08] px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 sm:grid">
          <span>{t(`${M}.colCriterion`)}</span>
          <span className="text-primary/80">{t(`${M}.colBeatrice`)}</span>
          <span>{t(`${M}.colGeneric`)}</span>
        </div>

        <ul>
          {CRITERIA.map((row, index) => (
            <li
              key={row.id}
              className={`grid grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-[1.2fr_1.4fr_1.4fr] sm:gap-4 ${
                index % 2 === 1 ? "bg-white/[0.015]" : ""
              }`}
            >
              <span className="text-sm font-semibold text-white">{t(`${M}.items.${row.id}.criterion`)}</span>

              <div className="flex items-start gap-2">
                <LevelTag level={row.beatriceLevel} />
                <span className="text-xs leading-relaxed text-slate-300">{t(`${M}.items.${row.id}.beatrice`)}</span>
              </div>

              <div className="flex items-start gap-2">
                <LevelTag level={row.genericLevel} />
                <span className="text-xs leading-relaxed text-slate-400">{t(`${M}.items.${row.id}.generic`)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
