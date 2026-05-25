import { usePersonaContext } from "../../hooks/usePersonaContext";

export function PersonaDecisionFeed() {
  const { activePersonaContext: strategy } = usePersonaContext();

  return (
    <section className="rounded-2xl border border-white/8 bg-background/45 p-5">
      <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">decision feed</p>
      <div className="space-y-3">
        {strategy.decisionFeed.map((decision) => (
          <article key={decision.id} className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] text-primary">{decision.id}</span>
              <span className="rounded-md bg-green-400/10 px-2 py-0.5 text-[10px] font-bold text-green-300">{decision.confidence}%</span>
            </div>
            <h3 className="text-sm font-bold text-white">{decision.title}</h3>
            <p className="mt-2 text-xs leading-6 text-slate-400">{decision.rationale}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
