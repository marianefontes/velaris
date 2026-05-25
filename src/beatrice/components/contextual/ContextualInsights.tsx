import { useInsights } from "../../providers/InsightProvider";

const priorityClass = {
  high: "border-red-400/20 bg-red-400/8 text-red-300",
  medium: "border-amber-400/20 bg-amber-400/8 text-amber-300",
  low: "border-slate-400/20 bg-slate-400/8 text-slate-300",
};

export function ContextualInsights() {
  const { insights } = useInsights();

  return (
    <section className="rounded-2xl border border-white/8 bg-background/45 p-5">
      <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">contextual insights</p>
      <div className="space-y-3">
        {insights.map((insight) => (
          <article key={insight.title} className={`rounded-xl border p-4 ${priorityClass[insight.priority]}`}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-white">{insight.title}</h3>
              <span className="rounded-md border border-current/20 px-2 py-0.5 text-[9px] uppercase tracking-widest opacity-75">
                {insight.priority}
              </span>
            </div>
            <p className="text-xs leading-6 text-slate-300">{insight.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
