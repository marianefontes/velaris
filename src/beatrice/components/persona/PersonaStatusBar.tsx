import { usePersonaContext } from "../../hooks/usePersonaContext";

export function PersonaStatusBar() {
  const { activePersonaContext: strategy } = usePersonaContext();
  const weighting = Object.entries(strategy.retrievalWeighting);

  return (
    <section className="grid gap-3 md:grid-cols-3">
      <div className="rounded-2xl border border-white/8 bg-surface-container-high/35 p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">retrieval weighting</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {weighting.map(([key, value]) => (
            <span key={key} className="rounded-lg border border-white/8 bg-white/5 px-2.5 py-1 text-[10px] text-slate-300">
              {key} · {value.toFixed(2)}
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-white/8 bg-surface-container-high/35 p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">artifact ordering</p>
        <p className="mt-3 text-xs leading-6 text-slate-300">{strategy.artifactRanking.join(" → ")}</p>
      </div>
      <div className="rounded-2xl border border-white/8 bg-surface-container-high/35 p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">audit focus</p>
        <p className="mt-3 text-xs leading-6 text-slate-300">{strategy.auditFocus.join(" · ")}</p>
      </div>
    </section>
  );
}
