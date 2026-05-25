import { History, ListChecks, Settings2, Sparkles } from "lucide-react";
import { useAuditTrail } from "../../hooks/useAuditTrail";
import { useI18n } from "../../../i18n/I18nProvider";

export function ChatToolbar() {
  const { t } = useI18n();
  const { entries, labels, open } = useAuditTrail();

  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-background/40 px-8 py-5 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-signature">
          <Sparkles className="h-5 w-5 text-on-primary" />
        </div>
        <div>
          <p className="text-sm font-black tracking-tight text-white">Beatrice</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">{t("chat.online")}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={open}
          className="glass-panel relative flex items-center gap-2 rounded-xl px-4 py-2 text-xs text-slate-400 transition-colors hover:border-primary/30 hover:text-primary"
        >
          <ListChecks className="h-4 w-4" />
          {labels.badge}
          {entries.length > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-on-primary">
              {entries.length}
            </span>
          )}
        </button>
        <button className="glass-panel flex items-center gap-2 rounded-xl px-4 py-2 text-xs text-slate-400">
          <History className="h-4 w-4" />
          {t("chat.history")}
        </button>
        <button className="glass-panel flex items-center gap-2 rounded-xl px-4 py-2 text-xs text-slate-400">
          <Settings2 className="h-4 w-4" />
          {t("chat.settings")}
        </button>
      </div>
    </header>
  );
}

