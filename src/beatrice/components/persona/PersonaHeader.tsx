import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";

export function PersonaHeader() {
  const { t } = useI18n();
  const { strategy } = usePersonaContext();
  const Icon = strategy.icon;

  return (
    <div className="border-b border-white/10 px-5 py-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{t("chat.context")}</p>
      </div>
    </div>
  );
}

