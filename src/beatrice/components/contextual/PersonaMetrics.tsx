import { usePersonaContext } from "../../hooks/usePersonaContext";

export function PersonaMetrics() {
  const { activePersonaContext: strategy } = usePersonaContext();

  return (
    <section className="grid gap-3 md:grid-cols-3">
      {strategy.metrics.map((metric) => (
        <div key={metric.label} className="rounded-2xl border border-white/8 bg-background/45 p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{metric.label}</p>
          <div className="mt-3 flex items-end justify-between">
            <p className={`text-3xl font-black tracking-tight ${metric.tone}`}>{metric.value}</p>
            <span className="rounded-md border border-white/8 bg-white/5 px-2 py-1 text-[10px] text-slate-400">{metric.delta}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
