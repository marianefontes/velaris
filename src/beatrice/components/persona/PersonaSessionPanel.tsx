import { Gauge, RadioTower } from "lucide-react";
import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";

export function PersonaSessionPanel() {
  const { t } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();
  const Icon = strategy.icon;
  const operationalProfile = strategy.operationalProfile;

  return (
    <aside className="rounded-2xl border border-white/10 bg-surface-container-highest/35 p-3 backdrop-blur-2xl">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/5">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-black text-white">{strategy.label}</p>
          <p className="mt-0.5 truncate text-[10px] text-slate-500">{operationalProfile.specialty}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-2.5 py-1.5">
        <RadioTower className="h-3.5 w-3.5 text-primary" />
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-primary">{t("beatricePersona.globalActiveSession")}</p>
      </div>

      <p className="mt-3 text-[11px] leading-5 text-slate-400">{strategy.identityStatement}</p>

      <div className="mt-4 border-t border-white/8 pt-3">
        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">{t("beatricePersona.role")}</p>
        <p className="mt-1 text-xs font-semibold leading-5 text-slate-200">{operationalProfile.title}</p>
        <p className="mt-1 text-[11px] leading-5 text-slate-500">{operationalProfile.specialty}</p>
      </div>

      <div className="mt-4 border-t border-white/8 pt-3">
        <div className="mb-2 flex items-center gap-2">
          <Gauge className="h-3.5 w-3.5 text-primary" />
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">{t("beatricePersona.metricsPrioritized")}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {operationalProfile.prioritizedMetrics.map((metric) => (
            <span key={metric} className="rounded-md border border-white/10 bg-white/[0.025] px-2 py-1 text-[10px] text-slate-400">
              {metric}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
