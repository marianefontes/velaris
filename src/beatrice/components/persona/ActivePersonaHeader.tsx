import { MessageSquareMore } from "lucide-react";
import { Link } from "react-router-dom";
import { usePersonaContext } from "../../hooks/usePersonaContext";

export function ActivePersonaHeader() {
  const { activePersonaContext: strategy } = usePersonaContext();
  const Icon = strategy.icon;

  return (
    <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <Icon className={`h-6 w-6 ${strategy.accentClass}`} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">{strategy.role}</p>
            <p className={`mt-1 text-sm font-semibold ${strategy.accentClass}`}>{strategy.status}</p>
          </div>
        </div>
        <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white lg:text-5xl">
          {strategy.workspaceTitle}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">{strategy.workspaceSubtitle}</p>
      </div>
      <Link
        to="/beatrice-chat"
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-xs font-bold text-primary transition-colors hover:bg-primary/15"
      >
        <MessageSquareMore className="h-4 w-4" />
        Open Beatrice
      </Link>
    </header>
  );
}
