import { COMMAND_META, ORACLE_ACTION_ORDER, ORACLE_INVESTIGATION_ORDER } from "../../domain/governance";
import type { CommandMode } from "../../types/beatrice";
import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";
import { useWorkspace } from "../../providers/WorkspaceProvider";

export function ChatSuggestions() {
  const { locale } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();
  const { content, setInput, settings, submitPrompt } = useWorkspace();
  const density = {
    compact: "p-3",
    comfortable: "p-4",
    dense: "p-3",
  }[settings.density];

  const isEn = locale === "en-US";

  const renderCommandChip = (command: CommandMode) => {
    const meta = COMMAND_META[command];
    return (
      <button
        key={command}
        type="button"
        onClick={() => setInput(`/${command} `)}
        title={command}
        className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest transition-all duration-150 hover:opacity-90 hover:scale-[1.02] ${meta.borderClass} ${meta.bgClass} ${meta.colorClass}`}
      >
        <span>{meta.icon}</span>
        {meta.label}
      </button>
    );
  };

  return (
    <>
      {/* ── Suggestion cards ──────────────────────────────────────────────────
          Architectural base (clean layout, restrained borders) with cognitive
          hover — glow surfaces as a discovery, not a default state.
      ──────────────────────────────────────────────────────────────────────── */}
      <div className="mx-auto grid w-full max-w-3xl gap-3 md:grid-cols-2">
        {content.suggestedPrompts.map((prompt) => {
          const Icon = prompt.icon;
          return (
            <button
              key={prompt.title}
              type="button"
              onClick={() => {
                setInput(prompt.body);
                void submitPrompt(prompt.body);
              }}
              className={`suggestion-card ${density} text-left group ${strategy.theme.panel}`}
            >
              <Icon className={`mb-2.5 h-4 w-4 ${strategy.theme.accentText} transition-transform duration-200 group-hover:scale-110`} />
              <p className="mb-1 text-sm font-bold text-white">{prompt.title}</p>
              <p className="text-xs leading-[1.65] text-slate-400 group-hover:text-slate-300 transition-colors duration-200">
                {prompt.body}
              </p>
            </button>
          );
        })}
      </div>

      {/* One actionable surface. Categories explain the command contract
          without recreating separate command/engine sections. */}
      <div className="mx-auto w-full max-w-3xl rounded-xl border border-white/[0.06] bg-white/[0.015] p-3">
        <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {isEn ? "Oracle Commands" : "Comandos do Oráculo"}
          </span>
          <span className="text-[9px] text-slate-600">
            {isEn ? "type / to activate" : "digite / para acionar"}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[8px] font-bold uppercase tracking-[0.14em] text-primary/60">
              {isEn ? "Operational action" : "Ação operacional"}
            </span>
            {ORACLE_ACTION_ORDER.map(renderCommandChip)}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[8px] font-bold uppercase tracking-[0.14em] text-secondary/60">
              {isEn ? "Investigative mode" : "Modo investigativo"}
            </span>
            {ORACLE_INVESTIGATION_ORDER.map(renderCommandChip)}
          </div>
        </div>
      </div>
    </>
  );
}
