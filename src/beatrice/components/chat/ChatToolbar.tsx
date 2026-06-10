import { History, ListChecks, Settings2 } from "lucide-react";
import { useAuditTrail } from "../../hooks/useAuditTrail";
import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";
import { useWorkspaceHistory } from "../../providers/WorkspaceProvider";
import { NewChatAction } from "./NewChatAction";

export function ChatToolbar({
  onOpenHistory = () => undefined,
  onOpenSettings = () => undefined,
}: {
  onOpenHistory?: () => void;
  onOpenSettings?: () => void;
}) {
  const { t } = useI18n();
  const { auditMessages, labels, open } = useAuditTrail();
  const { activePersonaContext: strategy } = usePersonaContext();
  const { conversations } = useWorkspaceHistory();
  const Icon = strategy.icon;
  const recordedConversations = conversations.filter((conversation) => conversation.history.length > 0).length;

  return (
    <header className="relative flex items-center justify-between gap-3 border-b border-white/[0.07] bg-background/45 px-4 py-3.5 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${strategy.theme.accentBorder} ${strategy.theme.accentBg}`}
        >
          <Icon aria-hidden="true" className={`h-5 w-5 ${strategy.theme.accentText}`} />
        </div>

        <div className="min-w-0">
          <h2 id="beatrice-chat-title" className="truncate text-sm font-bold tracking-tight text-white sm:text-base">
            {strategy.sessionTitle}
          </h2>
          <div className="mt-0.5 flex min-w-0 items-center gap-2" role="status">
            <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${strategy.theme.signal}`} />
            <p className="truncate text-[11px] text-slate-400">
              {t("chat.online")} · {strategy.operationalMode}
            </p>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <NewChatAction />

        <button
          type="button"
          onClick={open}
          aria-label={labels.title}
          className={`focus-ring relative flex h-11 min-w-11 items-center justify-center gap-2 rounded-xl border px-3 text-xs text-slate-300 transition-[background-color,border-color,color] duration-200 ease-luxe hover:border-white/15 hover:text-white ${strategy.theme.panel}`}
        >
          <ListChecks aria-hidden="true" className="h-4 w-4" />
          <span className="hidden lg:inline">{labels.badge}</span>
          {auditMessages.length > 0 && (
            <span
              className={`absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-background ${strategy.theme.signal}`}
            >
              {auditMessages.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onOpenHistory}
          aria-label={t("chat.history")}
          className="focus-ring glass-panel relative flex h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-3 text-xs text-slate-300 transition-[background-color,border-color,color] duration-200 ease-luxe hover:border-primary/25 hover:text-white"
        >
          <History aria-hidden="true" className="h-4 w-4" />
          <span className="hidden lg:inline">{t("chat.history")}</span>
          {recordedConversations > 0 && (
            <span className="ml-0.5 hidden rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary sm:inline">
              {recordedConversations}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          aria-label={t("chat.settings")}
          className="focus-ring glass-panel flex h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-3 text-xs text-slate-300 transition-[background-color,border-color,color] duration-200 ease-luxe hover:border-primary/25 hover:text-white"
        >
          <Settings2 aria-hidden="true" className="h-4 w-4" />
          <span className="hidden lg:inline">{t("chat.settings")}</span>
        </button>
      </div>
    </header>
  );
}
