import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";
import { useWorkspaceMessages } from "../../providers/WorkspaceProvider";

export function ChatEmptyState() {
  const { t } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();
  const { messages } = useWorkspaceMessages();
  const Icon = strategy.icon;
  const operationalProfile = strategy.operationalProfile;

  if (messages.length > 1) return null;

  return (
    <div className="flex flex-col items-center justify-center px-3 pb-2 pt-4 text-center sm:pt-6">
      <div className="relative mb-5 hidden items-center justify-center sm:flex">
        <div
          className={`pointer-events-none absolute inset-0 scale-[2.4] rounded-full opacity-20 blur-3xl motion-safe:animate-spectral-halo ${strategy.theme.accentBg}`}
        />
        <div
          className={`pointer-events-none absolute -inset-[6px] rounded-[22px] border ${strategy.theme.accentBorder} opacity-20`}
        />
        <div
          className={`relative flex h-14 w-14 items-center justify-center rounded-[18px] border ${strategy.theme.accentBorder} ${strategy.theme.accentBg}`}
        >
          <Icon aria-hidden="true" className={`h-7 w-7 ${strategy.theme.accentText}`} />
        </div>
      </div>

      <h2 className="text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl">
        {strategy.sessionTitle}
      </h2>
      <p className={`mt-2 hidden text-xs font-medium sm:block ${strategy.theme.accentText}`}>
        {t("beatricePersona.beatricePerspective")} · {operationalProfile.title}
      </p>
      <p className="mt-2 line-clamp-1 max-w-[60ch] text-xs leading-5 text-slate-400 sm:mt-4 sm:line-clamp-none sm:text-sm sm:leading-6">
        {operationalProfile.primaryPain || t("chat.description")}
      </p>
    </div>
  );
}
