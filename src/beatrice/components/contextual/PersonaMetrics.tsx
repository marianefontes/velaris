import { usePersonaContext } from "../../hooks/usePersonaContext";

export function PersonaMetrics() {
  const { activePersonaContext: strategy } = usePersonaContext();

  return (
    <section className="grid gap-3 md:grid-cols-3">
      {strategy.metrics.map((metric) => (
        <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-2xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{metric.label}</p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="text-2xl font-black tracking-tight text-white">{metric.value}</p>
            <span className="rounded-md border border-white/8 bg-white/[0.035] px-2 py-1 text-[10px] text-slate-500">{metric.delta}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
