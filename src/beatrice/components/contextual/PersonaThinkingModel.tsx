import { BrainCircuit, ShieldAlert } from "lucide-react";
import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";

export function PersonaThinkingModel() {
  const { t } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();
  const profile = strategy.cognitiveProfile;
  const operationalProfile = strategy.operationalProfile;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-2xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{t("beatricePersona.thinkingModel")}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{operationalProfile.communicationStyle}</p>
        </div>
        <BrainCircuit className="h-5 w-5 text-primary" />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">{t("beatricePersona.objectives")}</p>
          <div className="space-y-2">
            {profile.objective.map((item) => (
              <div key={item} className="rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-600">
            <ShieldAlert className="h-3.5 w-3.5" />
            {t("beatricePersona.fears")}
          </p>
          <div className="space-y-2">
            {profile.fears.map((item) => (
              <div key={item} className="rounded-lg border border-white/8 bg-white/[0.025] px-3 py-2 text-xs text-slate-400">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">{t("beatricePersona.mentalStructure")}</p>
        <div className="grid gap-2 md:grid-cols-4">
          {operationalProfile.mentalStructure.map((step, index) => (
            <div key={step} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <span className="font-mono text-[10px] text-primary">0{index + 1}</span>
              <p className="mt-2 text-xs leading-5 text-slate-300">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">{t("beatricePersona.heuristics")}</p>
        <div className="grid gap-2 md:grid-cols-2">
          {profile.heuristics.map((item) => (
            <div key={item} className="rounded-xl border border-white/8 bg-black/15 p-3 text-xs leading-5 text-slate-300">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
