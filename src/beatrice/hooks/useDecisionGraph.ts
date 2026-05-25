import { useMemo } from "react";
import type { AuditEntry } from "../types/beatrice";

export function useDecisionGraph(entries: AuditEntry[]) {
  return useMemo(() => {
    const nodes = entries.map((entry) => ({
      id: entry.decisionId,
      label: entry.intent,
      confidence: entry.confidence.ux,
    }));
    const edges = entries.flatMap((entry) =>
      entry.relatedDecisions.map((relatedId) => ({
        from: entry.decisionId,
        to: relatedId,
      })),
    );
    return { edges, nodes };
  }, [entries]);
}
