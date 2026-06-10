import { ArrowUp } from "lucide-react";
import { COMMAND_META, commandHint, commandPlaceholder } from "../../domain/governance";
import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";
import {
  useWorkspaceComposer,
  useWorkspacePreferences,
} from "../../providers/WorkspaceProvider";

export function ChatInput() {
  const { locale, t } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();
  const { activeCommand, input, isLoading, setInput, submitPrompt } = useWorkspaceComposer();
  const { settings } = useWorkspacePreferences();
  const density = {
    compact: "px-4 py-3",
    comfortable: "px-4 py-3",
    dense: "px-3.5 py-2.5",
  }[settings.density];
  const canSubmit = input.trim().length > 0 && !isLoading;
  const inputId = "beatrice-chat-input";
  const groundingId = "beatrice-chat-grounding";

  return (
    <>
      {activeCommand && (
        <div className={`mb-2 flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2 ${COMMAND_META[activeCommand].borderClass} ${COMMAND_META[activeCommand].bgClass}`}>
          <span aria-hidden="true" className={`text-sm ${COMMAND_META[activeCommand].colorClass}`}>{COMMAND_META[activeCommand].icon}</span>
          <span className={`text-[11px] font-bold uppercase tracking-[0.12em] ${COMMAND_META[activeCommand].colorClass}`}>
            {t("beatrice.chat.commandMode", { command: `/${activeCommand}` })}
          </span>
          <span className={`hidden min-w-0 truncate text-[11px] opacity-65 sm:inline ${COMMAND_META[activeCommand].colorClass}`}>
            : {commandHint(activeCommand, locale)}
          </span>
          <button
            type="button"
            onClick={() => setInput("")}
            aria-label={t("beatrice.chat.clearCommand")}
            className={`focus-ring ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lg opacity-60 transition-colors hover:bg-white/[0.06] hover:opacity-100 ${COMMAND_META[activeCommand].colorClass}`}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      )}

      <label htmlFor={inputId} className="sr-only">
        {t("beatrice.chat.composerLabel")}
      </label>
      <div
        data-abraxos-focus="oracle-composer"
        className={`flex items-end gap-3 rounded-[18px] border ${density} shadow-[0_8px_28px_rgba(0,0,0,0.16)] transition-[border-color,box-shadow] duration-200 ease-luxe focus-within:border-primary/40 focus-within:shadow-[0_10px_34px_rgba(0,0,0,0.22)] ${strategy.theme.panel}`}
      >
        <textarea
          id={inputId}
          rows={activeCommand ? 4 : 1}
          value={input}
          disabled={isLoading}
          aria-describedby={groundingId}
          aria-busy={isLoading}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !activeCommand && canSubmit) {
              event.preventDefault();
              void submitPrompt();
            }
            if (event.key === "Enter" && event.metaKey && canSubmit) {
              event.preventDefault();
              void submitPrompt();
            }
          }}
          placeholder={isLoading ? t("chat.responding") : commandPlaceholder(activeCommand, locale) ?? t("chat.promptPlaceholder")}
          className={`min-h-11 flex-1 resize-none bg-transparent py-2 text-[15px] leading-6 text-white outline-none placeholder:text-slate-500 disabled:cursor-wait disabled:opacity-60 ${
            activeCommand ? "max-h-[200px] font-mono text-[13px]" : "max-h-[144px]"
          }`}
        />
        <div className="flex shrink-0 items-center">
          <button
            type="button"
            disabled={!canSubmit}
            aria-disabled={!canSubmit}
            onClick={() => void submitPrompt()}
            aria-label={t("beatrice.chat.send")}
            className={`focus-ring flex h-11 w-11 items-center justify-center rounded-xl text-background shadow-[0_4px_14px_rgba(0,0,0,0.18)] transition-[opacity,transform,background-color] duration-200 ease-luxe hover:opacity-90 active:translate-y-px disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-600 disabled:shadow-none disabled:opacity-100 ${canSubmit ? strategy.theme.signal : ""}`}
          >
            {isLoading ? (
              <>
                <span aria-hidden="true" className="h-4 w-4 rounded-full border-2 border-slate-600 border-t-slate-300 motion-safe:animate-spin" />
                <span className="sr-only">{t("chat.responding")}</span>
              </>
            ) : (
              <ArrowUp aria-hidden="true" className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      <p id={groundingId} className="mx-auto mt-1.5 line-clamp-2 max-w-2xl text-center text-[11px] leading-4 text-slate-500 sm:line-clamp-none">
        {t("chat.grounded")}
      </p>
    </>
  );
}
