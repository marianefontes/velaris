import { ArrowUp, Paperclip } from "lucide-react";
import { COMMAND_META, commandHint, commandPlaceholder } from "../../domain/governance";
import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";
import { useWorkspace } from "../../providers/WorkspaceProvider";

export function ChatInput() {
  const { t } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();
  const { activeCommand, input, isLoading, setInput, settings, submitPrompt } = useWorkspace();
  const density = {
    compact: "px-4 py-3",
    comfortable: "px-4 py-4",
    dense: "px-3 py-3",
  }[settings.density];

  return (
    <>
      {activeCommand && (
        <div className={`mb-1.5 flex items-center gap-2 rounded-xl border px-3 py-2 ${COMMAND_META[activeCommand].borderClass} ${COMMAND_META[activeCommand].bgClass}`}>
          <span className={`text-sm ${COMMAND_META[activeCommand].colorClass}`}>{COMMAND_META[activeCommand].icon}</span>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${COMMAND_META[activeCommand].colorClass}`}>
            /{activeCommand} mode
          </span>
          <span className={`text-[10px] opacity-50 ${COMMAND_META[activeCommand].colorClass}`}>
            — {commandHint(activeCommand)}
          </span>
          <button
            type="button"
            onClick={() => setInput("")}
            className={`ml-auto text-[10px] opacity-40 hover:opacity-80 ${COMMAND_META[activeCommand].colorClass}`}
          >
            x
          </button>
        </div>
      )}

      <div className={`flex items-end gap-3 rounded-2xl border ${density} shadow-[0_0_48px_rgba(169,153,198,0.1)] ${strategy.theme.panel}`}>
        <textarea
          rows={activeCommand ? 4 : 1}
          value={input}
          disabled={isLoading}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !activeCommand) {
              event.preventDefault();
              void submitPrompt();
            }
            if (event.key === "Enter" && event.metaKey) {
              event.preventDefault();
              void submitPrompt();
            }
          }}
          placeholder={isLoading ? t("chat.responding") : commandPlaceholder(activeCommand) ?? `${strategy.label}: ${strategy.examples[0]}`}
          className={`flex-1 resize-none bg-transparent leading-6 text-white outline-none placeholder:text-slate-500 disabled:opacity-50 ${
            activeCommand ? "max-h-[200px] font-mono text-xs" : "max-h-[120px] text-sm"
          }`}
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Attach context"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => void submitPrompt()}
            className={`flex h-9 w-9 items-center justify-center rounded-xl text-background transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40 ${strategy.theme.signal}`}
          >
            {isLoading ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      <p className="mt-3 text-center text-[10px] text-slate-700">{t("chat.grounded")}</p>
    </>
  );
}
