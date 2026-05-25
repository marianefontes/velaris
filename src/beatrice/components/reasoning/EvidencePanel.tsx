import type { AuditEntry, AuditLabels } from "../../types/beatrice";

export function EvidencePanel({ entry, labels }: { entry: AuditEntry; labels: AuditLabels }) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-600">{labels.evidence}</p>
      <div className="flex flex-col gap-2">
        {entry.evidence.map((evidence, index) => (
          <div key={index} className="flex items-start gap-2 rounded-lg border border-white/6 bg-white/3 px-3 py-2">
            <span className={`mt-0.5 shrink-0 rounded px-1.5 py-px text-[8px] font-bold uppercase ${
              evidence.weight === "high"
                ? "bg-green-400/15 text-green-400"
                : evidence.weight === "medium"
                ? "bg-amber-400/15 text-amber-400"
                : "bg-slate-400/15 text-slate-500"
            }`}>
              {evidence.weight}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-slate-300">
                {evidence.source} — &ldquo;{evidence.title}&rdquo;
              </p>
              <p className="text-[9px] text-slate-600">{evidence.authorityLabel}</p>
            </div>
            <span className="shrink-0 text-[10px] font-bold text-primary">{Math.round(evidence.similarity * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

