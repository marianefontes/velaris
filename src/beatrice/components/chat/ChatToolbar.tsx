import { History, ListChecks, Settings2 } from "lucide-react";
import { useAuditTrail } from "../../hooks/useAuditTrail";
import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";
import { useWorkspace } from "../../providers/WorkspaceProvider";

export function ChatToolbar({
  onOpenHistory = () => undefined,
  onOpenSettings = () => undefined,
}: {
  onOpenHistory?: () => void;
  onOpenSettings?: () => void;
}) {
  const { t } = useI18n();
  const { entries, labels, open } = useAuditTrail();
  const { activePersonaContext: strategy } = usePersonaContext();
  const { conversations } = useWorkspace();
  const Icon = strategy.icon;
  const recordedConversations = conversations.filter((conversation) => conversation.history.length > 0).length;

  return (
    <header className="relative flex flex-col gap-4 border-b border-white/[0.08] bg-background/35 px-5 py-4 backdrop-blur-xl sm:px-8 lg:flex-row lg:items-center lg:justify-between">

      {/* Oracle identity block — persona icon + session title + status */}
      <div className="flex items-center gap-4">
        {/* Icon: persona-aware symbol with subtle cognitive glow */}
        <div
          className={`relative flex h-10 w-10 items-center justify-center rounded-xl border ${strategy.theme.accentBorder} ${strategy.theme.accentBg}`}
          style={{
            boxShadow: "0 0 18px rgba(179, 157, 219, 0.14), 0 0 0 1px rgba(222, 204, 253, 0.06)",
          }}
        >
          <Icon className={`h-5 w-5 ${strategy.theme.accentText}`} />
        </div>

        <div>
          <p className="text-sm font-black tracking-tight text-white">{strategy.sessionTitle}</p>
          <div className="mt-1 flex items-center gap-2">
            {/* Live status pulse — cognitive signal */}
            <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${strategy.theme.signal}`} />
            <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
              {t("chat.online")} · {strategy.operationalMode}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar actions — clean and architectural */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={open}
          aria-label={labels.title}
          className={`relative flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs text-slate-400 transition-all duration-200 hover:text-white hover:border-white/15 ${strategy.theme.panel}`}
        >
          <ListChecks className="h-3.5 w-3.5" />
          {labels.badge}
          {entries.length > 0 && (
            <span
              className={`absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-background ${strategy.theme.signal}`}
            >
              {entries.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onOpenHistory}
          aria-label={t("chat.history")}
          className="glass-panel relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs text-slate-400 transition-all duration-200 hover:border-primary/25 hover:text-white hover:shadow-cognitive-sm"
        >
          <History className="h-3.5 w-3.5" />
          {t("chat.history")}
          {recordedConversations > 0 && (
            <span className="ml-0.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold text-primary">
              {recordedConversations}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          aria-label={t("chat.settings")}
          className="glass-panel flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs text-slate-400 transition-all duration-200 hover:border-primary/25 hover:text-white hover:shadow-cognitive-sm"
        >
          <Settings2 className="h-3.5 w-3.5" />
          {t("chat.settings")}
        </button>
      </div>
    </header>
  );
}
