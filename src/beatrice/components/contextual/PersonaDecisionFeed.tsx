import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";

export function PersonaDecisionFeed() {
  const { t } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-2xl">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-primary">{t("beatricePersona.decisionFeed")}</p>
      <div className="space-y-2.5">
        {strategy.decisionFeed.map((decision) => (
          <article key={decision.id} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] text-primary">{decision.id}</span>
              <span className="rounded-md border border-white/8 bg-white/[0.035] px-2 py-0.5 text-[10px] font-bold text-slate-300">{decision.confidence}%</span>
            </div>
            <h3 className="text-sm font-bold text-white">{decision.title}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-400">{decision.rationale}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
