import { usePersonaContext } from "../../hooks/usePersonaContext";

export function PersonaArtifacts() {
  const { activePersonaContext: strategy } = usePersonaContext();

  return (
    <section className="rounded-2xl border border-white/8 bg-background/45 p-5">
      <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">artifacts</p>
      <div className="grid gap-3">
        {strategy.artifacts.map((artifact) => (
          <div key={artifact.title} className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
            <div>
              <p className="text-sm font-bold text-white">{artifact.title}</p>
              <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-600">{artifact.type}</p>
            </div>
            <span className="rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
              {artifact.state}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
