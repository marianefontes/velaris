import type { AuditEntry } from "../../types/beatrice";

export function EvidenceGraph({ entries }: { entries: AuditEntry[] }) {
  const sourceCount = new Set(entries.flatMap((entry) => entry.sources.map((source) => source.source))).size;

  return (
    <div className="mb-4 grid grid-cols-3 gap-2">
      <div className="rounded-xl border border-white/8 bg-white/4 p-3">
        <p className="text-[9px] uppercase tracking-widest text-slate-600">Decisions</p>
        <p className="mt-1 text-lg font-black text-white">{entries.length}</p>
      </div>
      <div className="rounded-xl border border-white/8 bg-white/4 p-3">
        <p className="text-[9px] uppercase tracking-widest text-slate-600">Sources</p>
        <p className="mt-1 text-lg font-black text-primary">{sourceCount}</p>
      </div>
      <div className="rounded-xl border border-white/8 bg-white/4 p-3">
        <p className="text-[9px] uppercase tracking-widest text-slate-600">Links</p>
        <p className="mt-1 text-lg font-black text-green-400">{entries.reduce((sum, entry) => sum + entry.relatedDecisions.length, 0)}</p>
      </div>
    </div>
  );
}

