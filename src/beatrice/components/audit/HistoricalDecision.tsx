import type { Locale } from "../../../i18n/translations";
import type { AuditEntry } from "../../types/beatrice";
import { useReasoning } from "../../hooks/useReasoning";

export function HistoricalDecision({
  entry,
  index,
  isLast,
  locale,
}: {
  entry: AuditEntry;
  index: number;
  isLast: boolean;
  locale: Locale;
}) {
  const { intentColor, intentLabel } = useReasoning();

  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div className="mt-1 h-3 w-3 rounded-full border-2 border-primary bg-background ring-4 ring-primary/10" />
        {!isLast && <div className="my-1 w-px flex-1 bg-white/8" style={{ minHeight: 36 }} />}
      </div>
      <div className="mb-5 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="font-mono text-[9px] font-bold text-primary/80">{entry.decisionId}</span>
          <span className={`rounded-full border px-2 py-px text-[9px] font-semibold ${intentColor(entry.intent)}`}>
            {intentLabel(entry.intent, locale)}
          </span>
          <span className="ml-auto text-[9px] font-bold text-green-400">{entry.confidence.ux}% UX</span>
        </div>
        <p className="text-xs leading-5 text-slate-300">
          &ldquo;{entry.userQuery.length > 90 ? entry.userQuery.slice(0, 90) + "..." : entry.userQuery}&rdquo;
        </p>
        {entry.summaryLine && (
          <p className="mt-1 text-[10px] leading-4 text-slate-600">
            {entry.summaryLine.slice(0, 100)}{entry.summaryLine.length > 100 ? "..." : ""}
          </p>
        )}
      </div>
    </div>
  );
}

