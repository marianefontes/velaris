import { ArrowRight } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import type { OracleEngineInfo } from "../../types/oracle";

// ||| One oracle engine as an I/O contract: input → process → output, plus the
// explainability role. Engines are the *mechanism*; skills are the *behavior*.

export function OracleEngineCard({ engine }: { engine: OracleEngineInfo }) {
  const { t } = useI18n();
  const Icon = engine.icon;
  return (
    <article className="content-card h-full">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-secondary/25 bg-secondary/10 text-secondary">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <h3 className="font-serif text-base font-semibold text-white">{engine.name}</h3>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
        <span className="rounded-md border border-white/[0.07] bg-surface-container/60 px-2 py-1">{engine.input}</span>
        <ArrowRight className="h-3 w-3 text-slate-600" aria-hidden />
        <span className="rounded-md border border-white/[0.07] bg-surface-container/60 px-2 py-1">{engine.process}</span>
        <ArrowRight className="h-3 w-3 text-slate-600" aria-hidden />
        <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-primary">{engine.output}</span>
      </div>

      <div className="border-l-2 border-secondary/25 pl-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{t("pages.intelligence.labels.xaiRole")}</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-300">{engine.xaiRole}</p>
      </div>
    </article>
  );
}
