import { CircleHelp } from "lucide-react";
import { Link } from "react-router-dom";
import { COMMAND_META, ORACLE_ACTION_ORDER, ORACLE_INVESTIGATION_ORDER } from "../../domain/governance";
import type { CommandMode } from "../../types/beatrice";
import { useI18n } from "../../../i18n/I18nProvider";
import { useWorkspaceComposer } from "../../providers/WorkspaceProvider";
import { CommandIcon } from "./CommandIcon";

const OPERATIONAL_COMMAND_LINK = "/reasoning?focus=commands#comandos-operacional";
const INVESTIGATIVE_COMMAND_LINK = "/reasoning?focus=commands#comandos-investigativo";

export function ChatComposerCommands() {
  const { t } = useI18n();
  const { setInput } = useWorkspaceComposer();

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
        className={`focus-ring flex min-h-9 items-center gap-2.5 rounded-lg border px-3 py-2 text-[11px] font-medium transition-[background-color,border-color,color] duration-200 ease-luxe ${toneClass}`}
      >
        <span
          aria-hidden="true"
          className="flex h-4 w-4 shrink-0 items-center justify-center opacity-90"
        >
          <CommandIcon icon={meta.icon} />
        </span>
        {meta.label}
      </button>
    );
  };

  const renderGroupExplanation = (href: string, groupLabel: string) => (
    <Link
      to={href}
      className="focus-ring inline-flex min-h-8 shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium text-slate-500 transition-colors hover:bg-white/[0.04] hover:text-slate-300"
      aria-label={t("beatrice.chat.viewGroupExplanation", { group: groupLabel })}
    >
      <CircleHelp aria-hidden="true" className="h-3.5 w-3.5" />
      <span>{t("beatrice.chat.viewExplanation")}</span>
    </Link>
  );

  return (
    <details className="group mb-2 rounded-xl border border-white/[0.06] bg-white/[0.012]">
      <summary className="focus-ring flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-3 py-2 text-left sm:px-3.5 [&::-webkit-details-marker]:hidden">
        <span className="text-[11px] font-semibold text-slate-300">
          {t("beatrice.chat.oracleCommands")}
        </span>
        <span className="hidden text-[11px] text-slate-500 sm:inline">
          {t("beatrice.chat.activateCommandHint")}
        </span>
      </summary>

      <div className="space-y-3 border-t border-white/[0.06] px-3.5 pb-3 pt-3">
        <div id="oracle-commands-operational">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
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
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
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
  );
}
