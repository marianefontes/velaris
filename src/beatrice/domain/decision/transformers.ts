import type { AuditEntry } from "../../types/beatrice";

export function relatedDecisionIds(entry: AuditEntry, entries: AuditEntry[]): string[] {
  return entries
    .filter(
      (other) =>
        other.id !== entry.id &&
        (other.intent === entry.intent ||
          other.sources.some((source) => entry.sources.some((entrySource) => entrySource.source === source.source))),
    )
    .map((other) => other.decisionId)
    .slice(0, 3);
}

