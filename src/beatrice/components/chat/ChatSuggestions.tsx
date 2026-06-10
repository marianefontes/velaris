import { CircleHelp } from "lucide-react";
import { Link } from "react-router-dom";
import { COMMAND_META, ORACLE_ACTION_ORDER, ORACLE_INVESTIGATION_ORDER } from "../../domain/governance";
import type { CommandMode } from "../../types/beatrice";
import { toDisplayTitle } from "../../domain/displayTitle";
import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";
import {
  useWorkspaceComposer,
  useWorkspaceMessages,
  useWorkspacePreferences,
} from "../../providers/WorkspaceProvider";

const OPERATIONAL_COMMAND_LINK = "/reasoning?focus=commands#comandos-operacional";
const INVESTIGATIVE_COMMAND_LINK = "/reasoning?focus=commands#comandos-investigativo";

export function ChatSuggestions() {
  const { locale, t } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();
  const { setInput, submitPrompt } = useWorkspaceComposer();
  const { messages } = useWorkspaceMessages();
  const { content, settings } = useWorkspacePreferences();
  const density = {
    compact: "p-3",
    comfortable: "p-4",
    dense: "p-3",
  }[settings.density];
  const isOnboarding = messages.length <= 1;

  const renderCommandChip = (command: CommandMode, tone: "operational" | "investigative") => {
    const meta = COMMAND_META[command];
    const toneClass =
      tone === "operational"
        ? "border-primary/12 bg-primary/[0.04] text-primary/85 hover:border-primary/20 hover:bg-primary/[0.07]"
        : "border-secondary/12 bg-secondary/[0.04] text-secondary/85 hover:border-secondary/20 hover:bg-secondary/[0.07]";

    return (
      <button
        key={command}
        type="button"
        onClick={() => setInput(`/${command} `)}
        title={command}
        className={`focus-ring flex min-h-10 items-center gap-2 rounded-lg border px-3 py-2 text-[11px] font-medium transition-[background-color,border-color,color] duration-200 ease-luxe ${toneClass}`}
      >
        <span aria-hidden="true" className="opacity-80">{meta.icon}</span>
        {meta.label}
      </button>
    );
  };

  const renderGroupExplanation = (href: string, groupLabel: string) => (
    <Link
      to={href}
      className="focus-ring inline-flex min-h-9 shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium text-slate-500 transition-colors hover:bg-white/[0.04] hover:text-slate-300"
      aria-label={t("beatrice.chat.viewGroupExplanation", { group: groupLabel })}
    >
      <CircleHelp aria-hidden="true" className="h-3.5 w-3.5" />
      <span>{t("beatrice.chat.viewExplanation")}</span>
    </Link>
  );

  if (!isOnboarding) return null;

  return (
    <>
      <div className="mx-auto grid w-full max-w-[46rem] gap-2.5 sm:grid-cols-3">
        {content.suggestedPrompts.slice(0, 3).map((prompt) => {
          const Icon = prompt.icon;
          const title = toDisplayTitle(prompt.title, locale);
          return (
            <button
              key={prompt.title}
              type="button"
              onClick={() => {
                setInput(prompt.body);
                void submitPrompt(prompt.body);
              }}
              className={`suggestion-card focus-ring group grid min-h-[4.75rem] grid-cols-[1.25rem_1fr] gap-x-3 text-left sm:block sm:min-h-[8.5rem] ${density} ${strategy.theme.panel}`}
            >
              <Icon aria-hidden="true" className={`mt-0.5 h-4 w-4 sm:mb-3 sm:mt-0 ${strategy.theme.accentText}`} />
              <div>
                <p className="mb-1 text-sm font-semibold text-white sm:mb-1.5">{title}</p>
                <p className="line-clamp-1 text-xs leading-[1.65] text-slate-400 transition-colors duration-200 group-hover:text-slate-300 group-focus-visible:text-slate-300 sm:line-clamp-3">
                  {prompt.body}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <details className="group mx-auto w-full max-w-[46rem] rounded-xl border border-white/[0.06] bg-white/[0.012]">
        <summary className="focus-ring flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left [&::-webkit-details-marker]:hidden">
          <span className="text-[11px] font-semibold text-slate-300">
            {t("beatrice.chat.oracleCommands")}
          </span>
          <span className="text-[11px] text-slate-500">
            {t("beatrice.chat.activateCommandHint")}
          </span>
        </summary>

        <div className="space-y-4 border-t border-white/[0.06] px-3.5 pb-3.5 pt-3.5">
          <div id="oracle-commands-operational">
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] font-semibold text-primary/80">
                {t("beatrice.chat.operationalAction")}
              </p>
              {renderGroupExplanation(OPERATIONAL_COMMAND_LINK, t("beatrice.chat.operationalAction"))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {ORACLE_ACTION_ORDER.map((command) => renderCommandChip(command, "operational"))}
            </div>
          </div>
          <div id="oracle-commands-investigative">
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] font-semibold text-secondary/80">
                {t("beatrice.chat.investigativeMode")}
              </p>
              {renderGroupExplanation(INVESTIGATIVE_COMMAND_LINK, t("beatrice.chat.investigativeMode"))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {ORACLE_INVESTIGATION_ORDER.map((command) => renderCommandChip(command, "investigative"))}
            </div>
          </div>
        </div>
      </details>
    </>
  );
}
