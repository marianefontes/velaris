import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";

export function PersonaHeader() {
  const { t } = useI18n();
  const { strategy } = usePersonaContext();
  const Icon = strategy.icon;
  const operationalProfile = strategy.operationalProfile;

  return (
    <div className="border-b border-white/10 px-5 py-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{t("chat.context")}</p>
      </div>
      <p className="mt-2 text-[10px] font-semibold leading-4 text-slate-400">{operationalProfile.fullName}</p>
      <p className="mt-1 text-[10px] leading-4 text-slate-600">{operationalProfile.title}</p>
    </div>
  );
}
