import type { AuditEntry } from "../../types/beatrice";

export function reasoningStepsForEntry(_entry: AuditEntry): string[] {
  return ["Evidence", "Inference", "Decision", "Trade-offs", "Outcome"];
}

