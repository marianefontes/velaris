import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";

export function PersonaRecentActivity() {
  const { t } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-2xl">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-primary">{t("beatricePersona.recentActivity")}</p>
      <div className="space-y-3">
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
