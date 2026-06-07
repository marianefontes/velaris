import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";

export function PersonaStatusBar() {
  const { t } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();
  const operationalProfile = strategy.operationalProfile;
  const weighting = Object.entries(strategy.retrievalWeighting);

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3 backdrop-blur-2xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{t("beatricePersona.communicationStyle")}</p>
        <p className="mt-2 text-xs leading-5 text-slate-400">{operationalProfile.communicationStyle}</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3 backdrop-blur-2xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{t("beatricePersona.retrievalWeighting")}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {weighting.map(([key, value]) => (
            <span key={key} className="rounded-lg border border-white/10 bg-white/[0.025] px-2 py-1 text-[10px] text-slate-400">
              {key} · {value.toFixed(2)}
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3 backdrop-blur-2xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{t("beatricePersona.metricsPrioritized")}</p>
        <p className="mt-2 text-xs leading-5 text-slate-400">{operationalProfile.prioritizedMetrics.join(" · ")}</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3 backdrop-blur-2xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{t("beatricePersona.operationalFears")}</p>
        <p className="mt-2 text-xs leading-5 text-slate-400">{operationalProfile.operationalFears.join(" · ")}</p>
      </div>
    </section>
  );
}
