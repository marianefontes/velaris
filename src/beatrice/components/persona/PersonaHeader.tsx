import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";

export function PersonaHeader() {
  const { t } = useI18n();
  const { strategy } = usePersonaContext();
  const Icon = strategy.icon;
  const operationalProfile = strategy.operationalProfile;

  return (
    <div className="border-b border-white/[0.07] px-4 py-4">
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" className="h-4 w-4 text-primary/75" />
        <p className="text-[11px] font-semibold text-slate-300">{t("chat.context")}</p>
      </div>
      <p className="mt-2 text-[11px] font-medium leading-4 text-slate-400">{operationalProfile.specialty}</p>
      <p className="mt-1 text-[11px] leading-4 text-slate-500">{operationalProfile.title}</p>
    </div>
  );
}
