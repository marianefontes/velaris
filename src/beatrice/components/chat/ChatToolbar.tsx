import { History, ListChecks, PanelRight, Settings2 } from "lucide-react";
import { AbraxosMark } from "../assistant/AbraxosMark";
import { useAuditTrail } from "../../hooks/useAuditTrail";
import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";
import { useWorkspaceHistory } from "../../providers/WorkspaceProvider";
import { NewChatAction } from "./NewChatAction";

function ToolbarDivider() {
  return <span className="hidden h-7 w-px shrink-0 bg-white/[0.08] sm:block" aria-hidden />;
}

function SecondaryAction({
  label,
  onClick,
  icon: Icon,
  active = false,
  badge,
  ariaLabel,
}: {
  label: string;
  onClick: () => void;
  icon: typeof History;
  active?: boolean;
  badge?: number | string;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      aria-pressed={active}
      className={`focus-ring relative flex h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium transition-[background-color,color] duration-200 ease-luxe sm:h-10 sm:min-w-10 sm:px-3 ${
        active
          ? "bg-primary/[0.1] text-primary"
          : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
      }`}
    >
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span className="hidden lg:inline">{label}</span>
      {badge !== undefined && Number(badge) > 0 ? (
        <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-primary">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

export function ChatToolbar({
  contextOpen = false,
  onOpenHistory = () => undefined,
  onOpenSettings = () => undefined,
  onToggleContext = () => undefined,
}: {
  contextOpen?: boolean;
  onOpenHistory?: () => void;
  onOpenSettings?: () => void;
  onToggleContext?: () => void;
}) {
  const { t } = useI18n();
  const { auditMessages, labels, open } = useAuditTrail();
  const { activePersonaContext: strategy } = usePersonaContext();
  const { conversations } = useWorkspaceHistory();
  const Icon = strategy.icon;
  const recordedConversations = conversations.filter((conversation) => conversation.history.length > 0).length;

  return (
    <header className="beatrice-workspace-header relative z-20 grid w-full min-w-0 shrink-0 grid-cols-[minmax(0,1fr)_minmax(0,11.5rem)] items-center gap-2 overflow-hidden border-b border-white/[0.06] bg-background/95 px-3 py-2.5 backdrop-blur-md sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-4 sm:px-6 sm:py-3 lg:px-8">
      <div className="flex min-w-0 items-center gap-2 overflow-hidden sm:gap-4">
        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <AbraxosMark size="sm" variant="chat" />
          <span className="text-[13px] font-semibold tracking-tight text-white">Abraxos</span>
          <ToolbarDivider />
        </div>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div
            className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border sm:h-10 sm:w-10 ${strategy.theme.accentBorder} ${strategy.theme.accentBg}`}
          >
            <div
              className={`pointer-events-none absolute -inset-0.5 rounded-[11px] opacity-40 beatrice-toolbar-avatar-glow ${strategy.theme.accentBg}`}
              aria-hidden
            />
            <Icon aria-hidden="true" className={`relative h-4 w-4 sm:h-[18px] sm:w-[18px] ${strategy.theme.accentText}`} />
          </div>

          <div className="min-w-0">
            <h2 id="beatrice-chat-title" className="truncate text-[13px] font-semibold tracking-tight text-white sm:text-sm">
              {strategy.sessionTitle}
            </h2>
            <div className="mt-0.5 hidden min-w-0 items-center gap-1.5 min-[420px]:flex" role="status">
              <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${strategy.theme.signal}`} />
              <p className="truncate text-[11px] text-slate-500">{t("chat.workspace.statusActive")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="beatrice-toolbar-actions flex min-w-0 shrink items-center gap-0.5 overflow-x-auto sm:gap-2">
        <div className="flex shrink-0 items-center gap-0.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-0.5 sm:gap-1 sm:p-1">
          <NewChatAction variant="primary" />
          <button
            type="button"
            onClick={open}
            aria-label={labels.title}
            className={`focus-ring relative flex h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium text-slate-300 transition-[background-color,color] duration-200 ease-luxe hover:bg-white/[0.04] hover:text-white sm:h-10 sm:min-w-10 sm:px-3 ${strategy.theme.panel}`}
          >
            <ListChecks aria-hidden="true" className="h-4 w-4" />
            <span className="hidden lg:inline">{labels.badge}</span>
            {auditMessages.length > 0 ? (
              <span
                className={`absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-background ${strategy.theme.signal}`}
              >
                {auditMessages.length}
              </span>
            ) : null}
          </button>
        </div>

        <ToolbarDivider />

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <SecondaryAction
            label={t("chat.history")}
            onClick={onOpenHistory}
            icon={History}
            badge={recordedConversations > 0 ? recordedConversations : undefined}
          />
          <SecondaryAction
            label={t("chat.contextPanel")}
            onClick={onToggleContext}
            icon={PanelRight}
            active={contextOpen}
            ariaLabel={t("chat.toggleContext")}
          />
          <SecondaryAction
            label={t("chat.settings")}
            onClick={onOpenSettings}
            icon={Settings2}
          />
        </div>
      </div>
    </header>
  );
}
