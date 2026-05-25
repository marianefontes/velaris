import type { AuditEntry, AuditLabels } from "../../types/beatrice";

function ConfidenceBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 shrink-0 text-[10px] text-slate-500">{label}</span>
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/8">
        <div className="h-1 rounded-full bg-gradient-to-r from-primary/60 to-primary" style={{ width: `${value}%` }} />
      </div>
      <span className="w-8 text-right text-[10px] font-bold text-white">{value}%</span>
    </div>
  );
}

export function ConfidenceBreakdown({ entry, labels }: { entry: AuditEntry; labels: AuditLabels }) {
  const confidence = entry.confidence;
  return (
    <div className="mb-4">
      <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-600">{labels.confidence}</p>
      <div className="flex flex-col gap-1.5">
        <ConfidenceBar value={confidence.ux} label={labels.uxConf} />
        <ConfidenceBar value={confidence.accessibility} label={labels.a11yConf} />
        <ConfidenceBar value={confidence.architecture} label={labels.archConf} />
        <ConfidenceBar value={confidence.consistency} label={labels.consConf} />
        <ConfidenceBar value={confidence.performance} label={labels.perfConf} />
      </div>
    </div>
  );
}

