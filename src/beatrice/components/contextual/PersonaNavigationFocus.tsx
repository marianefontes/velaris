import { Compass } from "lucide-react";
import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";

export function PersonaNavigationFocus() {
  const { t } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-2xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
          {t("beatrice.contextual.navigationPriorities")}
        </p>
        <Compass className="h-4 w-4 text-primary" />
      </div>
      <div className="space-y-3">
        {strategy.navigationFocus.map((item, index) => (
          <div key={item.label} className="grid grid-cols-[2rem_1fr] gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.025] font-mono text-[10px] text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm font-bold text-white">{item.label}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
