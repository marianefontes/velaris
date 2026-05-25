import { useRecommendations } from "../../providers/RecommendationProvider";

export function PersonaRecommendations() {
  const { recommendations } = useRecommendations();

  return (
    <section className="rounded-2xl border border-white/8 bg-background/45 p-5">
      <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">recommendations</p>
      <div className="space-y-3">
        {recommendations.map((recommendation) => (
          <article key={recommendation.title} className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <h3 className="text-sm font-bold text-white">{recommendation.title}</h3>
            <p className="mt-2 text-xs leading-6 text-slate-300">{recommendation.action}</p>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-primary">{recommendation.impact}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
