import type { AuditEntry, AuditLabels, TradeOff } from "../../types/beatrice";

export function TradeoffPanel({ entry, labels }: { entry: AuditEntry; labels: AuditLabels }) {
  const tradeOffs = entry.tradeOffs;
  const panels: Array<{ key: keyof TradeOff; icon: string; label: string; className: string }> = [
    { key: "gains", icon: "+", label: labels.gains, className: "border-green-400/15 bg-green-400/5 text-green-400" },
    { key: "losses", icon: "-", label: labels.losses, className: "border-red-400/15 bg-red-400/5 text-red-400" },
    { key: "risks", icon: "!", label: labels.risks, className: "border-warning/15 bg-warning/5 text-warning" },
  ];

  return (
    <div className="mb-4">
      <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-600">{labels.tradeOffs}</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {panels.map((panel) => (
          <div key={panel.key} className={`rounded-xl border p-3 ${panel.className}`}>
            <p className="mb-2 text-[9px] font-bold uppercase tracking-wider opacity-70">{panel.label}</p>
            {tradeOffs[panel.key].map((item, index) => (
              <div key={index} className="flex gap-1.5 text-[10px] leading-4 opacity-90">
                <span className="shrink-0">{panel.icon}</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

