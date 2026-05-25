import type { AuditEntry } from "../../types/beatrice";
import { EvidenceGraph } from "./EvidenceGraph";

export function DecisionGraphView({ entries }: { entries: AuditEntry[] }) {
  if (entries.length === 0) return null;
  return <EvidenceGraph entries={entries} />;
}

