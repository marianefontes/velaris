import { usePersonaContext } from "../../hooks/usePersonaContext";

export function PersonaContextBanner({ variant = "compact" }: { variant?: "compact" | "full" }) {
  const { activePersonaContext: strategy, profileId } = usePersonaContext();
  if (profileId === "general") return null;

  if (variant === "full") {
    return (
      <section className="rounded-[18px] border border-white/8 bg-white/[0.03] px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">{strategy.workspaceTone}</p>
            <p className="mt-1 text-sm leading-6 text-slate-300">{strategy.workspaceSubtitle}</p>
          </div>
          <div className="grid min-w-[20rem] grid-cols-3 gap-2">
            {strategy.reasoningPriorities.slice(0, 3).map((priority) => (
              <div key={priority} className="rounded-xl border border-white/8 bg-background/50 px-3 py-2">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">priority</p>
                <p className="mt-1 text-[10px] text-slate-300">{priority}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="mb-2 rounded-xl border border-white/8 bg-white/4 px-3 py-2">
      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">{strategy.label} workspace</p>
      <p className="mt-1 text-[10px] leading-4 text-slate-400">{strategy.reasoningPriorities.join(" · ")}</p>
    </div>
  );
}
