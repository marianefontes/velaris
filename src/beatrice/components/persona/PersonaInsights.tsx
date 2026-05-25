import { Download, MessageSquareMore } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuditTrail } from "../../hooks/useAuditTrail";
import { useReasoning } from "../../hooks/useReasoning";
import { useI18n } from "../../../i18n/I18nProvider";
import { useWorkspace } from "../../providers/WorkspaceProvider";

export function PersonaInsights() {
  const { locale, t } = useI18n();
  const { content, healthData, submitPrompt } = useWorkspace();
  const { entries, exportJson, exportMarkdown, labels, openDecisions } = useAuditTrail();
  const { intentColor, intentLabel } = useReasoning();

  return (
    <>
      <div className="glass-panel rounded-xl p-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">{t("chat.activeContext")}</p>
        <div className="flex flex-col gap-2">
          {content.activeContext.map((item, index) => {
            const isChunkLine = item.includes("22") || item.includes("indexed") || item.includes("indexados");
            const displayItem = isChunkLine && healthData ? item.replace(/\d+/, String(healthData.corpus_chunks)) : item;
            const isLast = index === content.activeContext.length - 1;
            const isOffline = isChunkLine && healthData && !healthData.rag_active;
            return (
              <div key={item} className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${isOffline ? "bg-red-400" : isLast ? "animate-pulse bg-primary" : "bg-green-400"}`} />
                <p className="text-xs text-slate-300">{displayItem}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-panel rounded-xl p-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">{t("chat.recentTopics")}</p>
        <div className="flex flex-col gap-1">
          {content.recentTopics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => void submitPrompt(topic)}
              className="flex items-center gap-2 py-1 text-left text-xs text-slate-400 transition-colors hover:text-primary"
            >
              <MessageSquareMore className="h-4 w-4" />
              {topic}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-xl p-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">{t("chat.quickLinks")}</p>
        <div className="flex flex-col gap-1">
          {content.quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} to={item.to} className="flex items-center gap-2 py-1 text-xs text-slate-400 transition-colors hover:text-primary">
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="glass-panel rounded-xl p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{labels.title}</p>
          {entries.length > 0 && <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold text-primary">{entries.length}</span>}
        </div>
        {entries.length === 0 ? (
          <p className="text-[10px] leading-5 text-slate-600">{labels.empty}</p>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              {entries.slice(-3).map((entry) => (
                <div key={entry.id} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[8px] text-primary/60">{entry.decisionId}</span>
                      <span className={`rounded px-1 py-px text-[8px] font-semibold ${intentColor(entry.intent)}`}>
                        {intentLabel(entry.intent, locale)}
                      </span>
                    </div>
                    <p className="truncate text-[10px] text-slate-400">{entry.userQuery.length > 38 ? entry.userQuery.slice(0, 38) + "..." : entry.userQuery}</p>
                    <p className="text-[9px] text-slate-600">UX {entry.confidence.ux}% · Arch {entry.confidence.architecture}%</p>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={openDecisions} className="mt-2 text-left text-[10px] text-primary transition-opacity hover:opacity-75">
              {labels.viewAll} →
            </button>
            <div className="mt-2 flex gap-1.5">
              <button type="button" onClick={exportMarkdown} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-primary/20 bg-primary/10 py-1.5 text-[9px] font-semibold text-primary hover:bg-primary/20">
                <Download className="h-3 w-3" />
                .md
              </button>
              <button type="button" onClick={exportJson} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 py-1.5 text-[9px] font-semibold text-slate-400 hover:bg-white/10">
                <Download className="h-3 w-3" />
                .json
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
