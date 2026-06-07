import { useI18n } from "../../../i18n/I18nProvider";
import { useWorkspace } from "../../providers/WorkspaceProvider";

export function PersonaMetrics() {
  const { t } = useI18n();
  const { stats } = useWorkspace();

  return (
    <div className="glass-panel rounded-xl p-4">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">{t("chat.sessionStats")}</p>
      <div className="space-y-2 text-[10px]">
        <div className="flex justify-between">
          <span className="text-slate-500">{t("chat.messages")}</span>
          <span className="font-bold text-white">{stats.messages}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">{t("chat.decisionsCited")}</span>
          <span className="font-bold text-primary">{stats.decisions}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">{t("chat.avgConfidence")}</span>
          <span className="font-bold text-primary">{stats.confidence}</span>
        </div>
      </div>
    </div>
  );
}
