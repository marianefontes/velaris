import { Download, MessageSquareMore } from "lucide-react";
import { Link } from "react-router-dom";
import { toDisplayTitle } from "../../domain/displayTitle";
import { useAuditTrail } from "../../hooks/useAuditTrail";
import { useReasoning } from "../../hooks/useReasoning";
import { useI18n } from "../../../i18n/I18nProvider";
import {
  useWorkspaceComposer,
  useWorkspacePreferences,
} from "../../providers/WorkspaceProvider";

export function PersonaInsights() {
  const { locale, t } = useI18n();
  const { submitPrompt } = useWorkspaceComposer();
  const { content, healthData } = useWorkspacePreferences();
  const { entries, exportJson, exportMarkdown, labels, openDecisions } = useAuditTrail();
  const { intentColor, intentLabel } = useReasoning();
  const primaryContext = content.activeContext.slice(0, 3);
  const secondaryContext = content.activeContext.slice(3);

  return (
    <>
      <div className="glass-panel rounded-xl p-3.5">
        <p className="mb-2 text-[11px] font-semibold text-slate-300">{t("chat.activeContext")}</p>
        <div className="flex flex-col gap-2">
          {primaryContext.map((item, index) => {
            const isChunkLine = item.includes("22") || item.includes("indexed") || item.includes("indexados");
            const displayItem = isChunkLine && healthData ? item.replace(/\d+/, String(healthData.corpus_chunks)) : item;
            const isOffline = isChunkLine && healthData && !healthData.rag_active;
            return (
              <div key={item} className="flex items-center gap-2">
                <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${isOffline ? "bg-red-400" : index === 0 ? "bg-primary" : "bg-green-400"}`} />
                <p className="text-[11px] leading-4 text-slate-300">{displayItem}</p>
              </div>
            );
          })}
        </div>
        {secondaryContext.length > 0 && (
          <details className="group/context mt-2">
            <summary className="focus-ring flex min-h-10 cursor-pointer list-none items-center justify-between rounded-lg px-2 text-[11px] text-slate-500 transition-colors hover:bg-white/[0.025] hover:text-slate-300 [&::-webkit-details-marker]:hidden">
              <span>{t("chat.context")}</span>
              <span>+{secondaryContext.length}</span>
            </summary>
            <div className="mt-1 space-y-2 border-t border-white/[0.06] pt-2">
              {secondaryContext.map((item) => (
                <p key={item} className="break-words text-[11px] leading-4 text-slate-400">
                  {item}
                </p>
              ))}
            </div>
          </details>
        )}
      </div>

      <details className="glass-panel group/rail rounded-xl">
        <summary className="focus-ring flex min-h-11 cursor-pointer list-none items-center justify-between rounded-xl px-3.5 text-[11px] font-semibold text-slate-300 [&::-webkit-details-marker]:hidden">
          {t("chat.recentTopics")}
          <span className="text-slate-500">{content.recentTopics.length}</span>
        </summary>
        <div className="border-t border-white/[0.06] px-2.5 pb-2.5 pt-1.5">
          {content.recentTopics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => void submitPrompt(topic)}
              className="focus-ring flex min-h-11 w-full items-center gap-2 rounded-lg px-2 text-left text-xs leading-4 text-slate-400 transition-colors hover:bg-white/[0.025] hover:text-primary"
            >
              <MessageSquareMore aria-hidden="true" className="h-4 w-4 shrink-0" />
              {toDisplayTitle(topic, locale)}
            </button>
          ))}
        </div>
      </details>

      <details className="glass-panel group/rail rounded-xl">
        <summary className="focus-ring flex min-h-11 cursor-pointer list-none items-center justify-between rounded-xl px-3.5 text-[11px] font-semibold text-slate-300 [&::-webkit-details-marker]:hidden">
          {t("chat.quickLinks")}
          <span className="text-slate-500">{content.quickLinks.length}</span>
        </summary>
        <div className="border-t border-white/[0.06] px-2.5 pb-2.5 pt-1.5">
          {content.quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} to={item.to} className="focus-ring flex min-h-11 items-center gap-2 rounded-lg px-2 text-xs text-slate-400 transition-colors hover:bg-white/[0.025] hover:text-primary">
                <Icon aria-hidden="true" className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </details>

      <details className="glass-panel group/rail rounded-xl">
        <summary className="focus-ring flex min-h-11 cursor-pointer list-none items-center justify-between rounded-xl px-3.5 text-[11px] font-semibold text-slate-300 [&::-webkit-details-marker]:hidden">
          {labels.title}
          <span className="text-slate-500">{entries.length}</span>
        </summary>
        <div className="border-t border-white/[0.06] p-3">
        {entries.length === 0 ? (
          <p className="text-[11px] leading-5 text-slate-500">{labels.empty}</p>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              {entries.slice(-3).map((entry) => (
                <div key={entry.id} className="flex items-start gap-2">
                  <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] text-primary/75">{entry.decisionId}</span>
                      <span className={`rounded px-1 py-px text-[11px] font-semibold ${intentColor(entry.intent)}`}>
                        {intentLabel(entry.intent, locale)}
                      </span>
                    </div>
                    <p className="truncate text-[11px] text-slate-400">{entry.userQuery.length > 38 ? entry.userQuery.slice(0, 38) + "..." : entry.userQuery}</p>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={openDecisions} className="focus-ring mt-2 flex min-h-11 w-full items-center rounded-lg px-2 text-left text-[11px] text-primary transition-colors hover:bg-primary/[0.05]">
              {labels.viewAll} →
            </button>
            <div className="mt-1 flex gap-1.5">
              <button type="button" onClick={exportMarkdown} className="focus-ring flex min-h-11 flex-1 items-center justify-center gap-1 rounded-lg border border-primary/15 bg-primary/[0.06] text-[11px] font-semibold text-primary hover:bg-primary/10">
                <Download aria-hidden="true" className="h-3.5 w-3.5" />
                .md
              </button>
              <button type="button" onClick={exportJson} className="focus-ring flex min-h-11 flex-1 items-center justify-center gap-1 rounded-lg border border-white/[0.07] bg-white/[0.025] text-[11px] font-semibold text-slate-400 hover:bg-white/[0.05]">
                <Download aria-hidden="true" className="h-3.5 w-3.5" />
                .json
              </button>
            </div>
          </>
        )}
        </div>
      </details>
    </>
  );
}
