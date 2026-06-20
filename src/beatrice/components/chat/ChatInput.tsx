import { ArrowUp, AtSign, Paperclip, Sparkles } from "lucide-react";
import { COMMAND_META, commandHint, commandPlaceholder } from "../../domain/governance";
import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";
import { useWorkspaceComposer } from "../../providers/WorkspaceProvider";
import { CommandIcon } from "./CommandIcon";

const composerUtilityClass =
  "focus-ring flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/[0.05] hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-35 sm:h-10 sm:w-10";

export function ChatInput() {
  const { locale, t } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();
  const { activeCommand, input, isLoading, setInput, submitPrompt } = useWorkspaceComposer();
  const canSubmit = input.trim().length > 0 && !isLoading;
  const inputId = "beatrice-chat-input";
  const groundingId = "beatrice-chat-grounding";
  const domain = strategy.operationalProfile.title.toLowerCase();
  const comingSoon = t("chat.workspace.comingSoon");
  const placeholder = isLoading
    ? t("chat.responding")
    : commandPlaceholder(activeCommand, locale)
      ?? t("chat.workspace.promptAbout", { domain });

  return (
    <>
      {activeCommand ? (
        <div className={`mb-2.5 flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2 ${COMMAND_META[activeCommand].borderClass} ${COMMAND_META[activeCommand].bgClass}`}>
          <span
            aria-hidden="true"
            className={`flex h-4 w-4 shrink-0 items-center justify-center ${COMMAND_META[activeCommand].colorClass}`}
          >
            <CommandIcon icon={COMMAND_META[activeCommand].icon} size="md" />
          </span>
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
            className={`focus-ring ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lg opacity-60 transition-colors hover:bg-white/[0.06] hover:opacity-100 sm:h-10 sm:w-10 ${COMMAND_META[activeCommand].colorClass}`}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      ) : null}

      <label htmlFor={inputId} className="sr-only">
        {t("beatrice.chat.composerLabel")}
      </label>
      <div
        data-abraxos-focus="oracle-composer"
        className={`beatrice-composer-field flex flex-col gap-2 rounded-[22px] border border-white/[0.1] bg-surface-container-high/85 px-3 py-2.5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_12px_40px_rgba(0,0,0,0.32)] transition-[border-color,box-shadow] duration-200 ease-luxe focus-within:border-primary/30 focus-within:shadow-[0_0_0_1px_rgba(222,204,253,0.1),0_16px_48px_rgba(0,0,0,0.36)] sm:rounded-[26px] sm:px-4 sm:py-3 ${strategy.theme.panel}`}
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
          placeholder={placeholder}
          className={`composer-input min-h-[2.75rem] w-full resize-none bg-transparent px-1 text-[15px] leading-6 text-white outline-none focus-visible:outline-none placeholder:text-slate-500 disabled:cursor-wait disabled:opacity-60 sm:min-h-[2.75rem] ${
            activeCommand ? "max-h-[200px] font-mono text-[13px]" : "max-h-[160px]"
          }`}
        />
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              disabled
              aria-disabled="true"
              aria-label={`${t("chat.workspace.attach")} (${comingSoon})`}
              title={`${t("chat.workspace.attach")} — ${comingSoon}`}
              className={composerUtilityClass}
            >
              <Paperclip aria-hidden="true" className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled
              aria-disabled="true"
              aria-label={`${t("chat.workspace.mention")} (${comingSoon})`}
              title={`${t("chat.workspace.mention")} — ${comingSoon}`}
              className={composerUtilityClass}
            >
              <AtSign aria-hidden="true" className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled
              aria-disabled="true"
              aria-label={`${t("chat.workspace.tools")} (${comingSoon})`}
              title={`${t("chat.workspace.tools")} — ${comingSoon}`}
              className={composerUtilityClass}
            >
              <Sparkles aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            disabled={!canSubmit}
            aria-disabled={!canSubmit}
            onClick={() => void submitPrompt()}
            aria-label={t("beatrice.chat.send")}
            className={`focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-background shadow-[0_4px_16px_rgba(0,0,0,0.24)] transition-[opacity,transform,background-color] duration-200 ease-luxe hover:opacity-90 active:translate-y-px disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-600 disabled:shadow-none disabled:opacity-100 sm:h-10 sm:w-10 ${canSubmit ? strategy.theme.signal : ""}`}
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
      <p id={groundingId} className="mx-auto mt-2.5 line-clamp-2 px-2 text-center text-[11px] leading-4 text-slate-600 sm:line-clamp-none">
        {t("chat.grounded")}
      </p>
    </>
  );
}
