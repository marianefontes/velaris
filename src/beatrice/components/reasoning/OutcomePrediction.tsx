import type { AuditEntry, AuditLabels } from "../../types/beatrice";

export function OutcomePrediction({ entry, labels }: { entry: AuditEntry; labels: AuditLabels }) {
  return (
    <div className="flex flex-wrap items-center gap-4 border-t border-white/6 pt-3">
      <div>
        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">{labels.lifecycle}</p>
        <p className="mt-0.5 text-[10px] text-slate-500">
          {labels.created}: <span className="text-slate-300">{entry.lifecycle.createdAt}</span>
          {" · "}
          {labels.review}: <span className="text-amber-400/80">{entry.lifecycle.reviewDate}</span>
        </p>
      </div>
      {entry.relatedDecisions.length > 0 && (
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">{labels.related}</p>
          <div className="mt-0.5 flex gap-1.5">
            {entry.relatedDecisions.map((decisionId) => (
              <span key={decisionId} className="rounded border border-primary/20 px-1.5 py-px font-mono text-[9px] text-primary/70">
                {decisionId}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

