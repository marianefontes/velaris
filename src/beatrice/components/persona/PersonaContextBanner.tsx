import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";

export function PersonaContextBanner({ variant = "compact" }: { variant?: "compact" | "full" }) {
  const { t } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();
  const operationalProfile = strategy.operationalProfile;

  if (variant === "full") {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3 backdrop-blur-2xl">
        <div className="grid gap-3 lg:grid-cols-[1fr_18rem] lg:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">{strategy.workspaceTone}</p>
            <p className="mt-1 text-sm font-semibold text-slate-200">
              {operationalProfile.fullName} · {operationalProfile.title}
            </p>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500">{operationalProfile.communicationStyle}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {operationalProfile.prioritizedMetrics.slice(0, 3).map((metric) => (
              <div key={metric} className="rounded-xl border border-white/8 bg-surface-container/35 px-3 py-2">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">{t("beatricePersona.metric")}</p>
                <p className="mt-1 text-[10px] text-slate-300">{metric}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="mb-2 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2">
      <p className="text-[9px] font-bold uppercase tracking-widest text-primary">{strategy.label} · {t("beatricePersona.workspace")}</p>
      <p className="mt-1 text-[10px] leading-4 text-slate-400">{operationalProfile.fullName} · {operationalProfile.mainFocus}</p>
    </div>
  );
}
