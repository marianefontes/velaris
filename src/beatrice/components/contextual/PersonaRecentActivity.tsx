import { usePersonaContext } from "../../hooks/usePersonaContext";

export function PersonaRecentActivity() {
  const { activePersonaContext: strategy } = usePersonaContext();

  return (
    <section className="rounded-2xl border border-white/8 bg-background/45 p-5">
      <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">recent activity</p>
      <div className="space-y-4">
        {strategy.recentActivity.map((activity) => (
          <div key={`${activity.timestamp}-${activity.title}`} className="flex gap-3">
            <span className="w-10 shrink-0 font-mono text-[10px] text-slate-600">{activity.timestamp}</span>
            <div>
              <p className="text-xs font-bold text-slate-200">{activity.title}</p>
              <p className="mt-1 text-[11px] leading-5 text-slate-500">{activity.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
