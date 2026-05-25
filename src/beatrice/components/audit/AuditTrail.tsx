import { Download, ListChecks } from "lucide-react";
import { useAuditTrail } from "../../hooks/useAuditTrail";
import { useI18n } from "../../../i18n/I18nProvider";
import { AuditEntry } from "./AuditEntry";
import { DecisionGraphView } from "./DecisionGraphView";
import { HistoricalDecision } from "./HistoricalDecision";

export function AuditTrail() {
  const { locale } = useI18n();
  const {
    close,
    entries,
    expandedIds,
    exportJson,
    exportMarkdown,
    isOpen,
    labels,
    setTab,
    tab,
    toggleExpanded,
  } = useAuditTrail();

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-20 flex flex-col overflow-hidden rounded-[28px] bg-[#090b13]/97 backdrop-blur-2xl">
      <div className="flex shrink-0 items-center justify-between border-b border-white/8 px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/20">
            <ListChecks className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-black tracking-tight text-white">{labels.title}</p>
            <p className="text-[10px] text-slate-600">{entries.length} {labels.entries}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-white/8 bg-white/4 p-1">
          {(["decisions", "timeline"] as const).map((nextTab) => (
            <button
              key={nextTab}
              type="button"
              onClick={() => setTab(nextTab)}
              className={`rounded-lg px-3 py-1 text-[10px] font-semibold transition-colors ${
                tab === nextTab ? "bg-primary/20 text-primary" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {nextTab === "decisions" ? labels.tabDecisions : labels.tabTimeline}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={entries.length === 0}
            onClick={exportMarkdown}
            className="glass-panel flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-semibold text-primary transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" />
            {labels.exportMd}
          </button>
          <button
            type="button"
            disabled={entries.length === 0}
            onClick={exportJson}
            className="glass-panel flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-semibold text-slate-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" />
            {labels.exportJson}
          </button>
          <button type="button" onClick={close} className="glass-panel rounded-xl px-3 py-1.5 text-[10px] text-slate-500 hover:text-white">
            {labels.close}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {entries.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="max-w-xs text-center text-sm leading-6 text-slate-500">{labels.empty}</p>
          </div>
        ) : tab === "timeline" ? (
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/8" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                {new Date().toLocaleDateString(locale === "en-US" ? "en-US" : "pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <div className="h-px flex-1 bg-white/8" />
            </div>
            {entries.map((entry, index) => (
              <HistoricalDecision
                key={entry.id}
                entry={entry}
                index={index}
                isLast={index === entries.length - 1}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-3">
            <DecisionGraphView entries={entries} />
            {entries.map((entry) => (
              <AuditEntry
                key={entry.id}
                entry={entry}
                expanded={!!expandedIds[entry.id]}
                labels={labels}
                locale={locale}
                onToggle={() => toggleExpanded(entry.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
