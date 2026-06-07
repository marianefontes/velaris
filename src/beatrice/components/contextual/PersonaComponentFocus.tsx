import { Layers3 } from "lucide-react";
import { usePersonaContext } from "../../hooks/usePersonaContext";

export function PersonaComponentFocus() {
  const { activePersonaContext: strategy } = usePersonaContext();

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-2xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">highlighted components</p>
        <Layers3 className="h-4 w-4 text-primary" />
      </div>
      <div className="space-y-2.5">
        {strategy.highlightedComponents.map((component) => (
          <article key={component.name} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-white">{component.name}</h3>
              <span className="rounded-md border border-white/10 bg-white/[0.025] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary">
                {component.signal}
              </span>
            </div>
            <p className="text-xs leading-5 text-slate-400">{component.reason}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
