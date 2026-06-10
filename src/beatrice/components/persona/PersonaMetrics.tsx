import { useI18n } from "../../../i18n/I18nProvider";
import { useWorkspacePreferences } from "../../providers/WorkspaceProvider";

export function PersonaMetrics() {
  const { t } = useI18n();
  const { stats } = useWorkspacePreferences();

  return (
    <div className="glass-panel rounded-xl p-3.5">
      <p className="mb-3 text-[11px] font-semibold text-slate-300">{t("chat.sessionStats")}</p>
      <div className="space-y-2 text-[11px]">
        <div className="flex justify-between">
          <span className="text-slate-400">{t("chat.messages")}</span>
          <span className="font-bold text-white">{stats.messages}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">{t("chat.decisionsCited")}</span>
          <span className="font-bold text-primary">{stats.decisions}</span>
        </div>
      </div>
    </div>
  );
}
