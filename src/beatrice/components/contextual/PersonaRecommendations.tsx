import { useRecommendations } from "../../providers/RecommendationProvider";
import { useI18n } from "../../../i18n/I18nProvider";

export function PersonaRecommendations() {
  const { t } = useI18n();
  const { recommendations } = useRecommendations();

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-2xl">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-primary">{t("beatricePersona.recommendations")}</p>
      <div className="space-y-2.5">
        {recommendations.map((recommendation) => (
          <article key={recommendation.title} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
            <h3 className="text-sm font-bold text-white">{recommendation.title}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-400">{recommendation.action}</p>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-primary">{recommendation.impact}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
