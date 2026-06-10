import type { Locale } from "../../../i18n/translations";
import type { AuditEntry, AuditLabels } from "../../types/beatrice";
import { useReasoning } from "../../hooks/useReasoning";
import { ConfidenceBreakdown } from "./ConfidenceBreakdown";
import { EvidencePanel } from "./EvidencePanel";
import { OutcomePrediction } from "./OutcomePrediction";
import { TradeoffPanel } from "./TradeoffPanel";

export function DecisionCard({
  entry,
  expanded,
  labels,
  locale,
  onToggle,
}: {
  entry: AuditEntry;
  expanded: boolean;
  labels: AuditLabels;
  locale: Locale;
  onToggle: () => void;
}) {
  const { intentColor, intentLabel } = useReasoning();

  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-surface-container-highest/40">
      <button type="button" onClick={onToggle} className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-white/3">
        <span className="shrink-0 font-mono text-[9px] font-bold text-primary/70">{entry.decisionId}</span>
        <span className={`shrink-0 rounded-full border px-2.5 py-px text-[9px] font-semibold ${intentColor(entry.intent)}`}>
          {intentLabel(entry.intent, locale)}
        </span>
        <span className="min-w-0 flex-1 truncate text-xs text-slate-400">
          {entry.userQuery.length > 70 ? entry.userQuery.slice(0, 70) + "..." : entry.userQuery}
        </span>
        <span className="shrink-0 rounded-full bg-green-400/10 px-2 py-px text-[10px] font-bold text-green-400">{entry.confidence.ux}%</span>
        <span className="shrink-0 rounded-full bg-white/5 px-1.5 py-px text-[9px] font-bold text-slate-500">{labels.active}</span>
        <span className={`shrink-0 text-slate-600 transition-transform ${expanded ? "rotate-90" : ""}`}>›</span>
      </button>

      {expanded && (
        <div className="border-t border-white/8 px-5 pb-5 pt-4">
          <p className="mb-4 text-xs font-medium leading-5 text-slate-300">&ldquo;{entry.userQuery}&rdquo;</p>
          <ConfidenceBreakdown entry={entry} labels={labels} />
          <EvidencePanel entry={entry} labels={labels} />
          <TradeoffPanel entry={entry} labels={labels} />
          <OutcomePrediction entry={entry} labels={labels} />
        </div>
      )}
    </div>
  );
}
