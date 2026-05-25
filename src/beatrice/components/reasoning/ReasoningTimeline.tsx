import type { AuditEntry, AuditLabels } from "../../types/beatrice";
import { useReasoning } from "../../hooks/useReasoning";

export function ReasoningTimeline({ entry, labels }: { entry: AuditEntry; labels: AuditLabels }) {
  const { reasoningStepsForEntry } = useReasoning();
  const steps = reasoningStepsForEntry(entry);

  return (
    <div className="mb-4">
      <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-600">{labels.reasoning}</p>
      <div className="flex items-center gap-1 overflow-x-auto">
        {steps.map((step, index) => (
          <div key={step} className="flex shrink-0 items-center gap-1">
            <span className={`rounded-lg border px-2.5 py-1 text-[9px] font-semibold ${
              index === 2 ? "border-primary/30 bg-primary/10 text-primary" : "border-white/8 bg-white/4 text-slate-500"
            }`}>
              {step}
            </span>
            {index < steps.length - 1 && <span className="text-xs text-slate-700">→</span>}
          </div>
        ))}
      </div>
      {entry.summaryLine && (
        <div className="mt-3 border-l-2 border-primary/25 pl-3">
          <p className="text-xs leading-5 text-slate-400">{entry.summaryLine}</p>
        </div>
      )}
    </div>
  );
}

