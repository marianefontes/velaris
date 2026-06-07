import { Scale } from "lucide-react";
import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";

export function PersonaDecisionCriteria() {
  const { t } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();
  const profile = strategy.cognitiveProfile;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-2xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{t("beatricePersona.decisionCriteria")}</p>
        <Scale className="h-4 w-4 text-primary" />
      </div>

      <div className="space-y-3">
        {profile.decisionCriteria.map((criterion, index) => (
          <div key={criterion} className="grid grid-cols-[2rem_1fr] gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.025] font-mono text-[10px] text-primary">
              {index + 1}
            </span>
            <p className="pt-1.5 text-xs leading-5 text-slate-300">{criterion}</p>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">{t("beatricePersona.tradeOffs")}</p>
        <div className="space-y-2">
          {profile.tradeOffs.map((tradeOff) => (
            <div key={`${tradeOff.favors}-${tradeOff.resists}`} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <p className="text-xs text-slate-300">
                <span className="text-primary">{t("beatricePersona.favors")}:</span> {tradeOff.favors}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                <span className="text-slate-400">{t("beatricePersona.resists")}:</span> {tradeOff.resists}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
