import { useInsights } from "../../providers/InsightProvider";
import { useI18n } from "../../../i18n/I18nProvider";

const priorityClass = {
  high: "border-white/10 bg-white/[0.04] text-primary",
  medium: "border-white/8 bg-white/[0.03] text-slate-300",
  low: "border-white/8 bg-white/[0.025] text-slate-500",
};

export function ContextualInsights() {
  const { t } = useI18n();
  const { insights } = useInsights();
  const priorityLabel = {
    high: t("beatricePersona.priorityHigh"),
    medium: t("beatricePersona.priorityMedium"),
    low: t("beatricePersona.priorityLow"),
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-2xl">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-primary">{t("beatricePersona.contextualInsights")}</p>
      <div className="space-y-2.5">
        {insights.map((insight) => (
          <article key={insight.title} className={`rounded-xl border p-3 ${priorityClass[insight.priority]}`}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-white">{insight.title}</h3>
              <span className="rounded-md border border-current/20 px-2 py-0.5 text-[9px] uppercase tracking-widest opacity-75">
                {priorityLabel[insight.priority]}
              </span>
            </div>
            <p className="text-xs leading-5 text-slate-400">{insight.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
