import type { DecisionRecordStatus } from "../types/beatrice";

export interface DecisionRecord {
  decision_id: string;
  status: DecisionRecordStatus;
  confirmed_by_user: boolean;
  updated_at: string;
}

export async function updateDecisionRecord(
  decisionId: string,
  status: Exclude<DecisionRecordStatus, "draft">,
): Promise<DecisionRecord> {
  const response = await fetch(`/api/decisions/${encodeURIComponent(decisionId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { detail?: string } | null;
    throw new Error(payload?.detail ?? `decision_update_failed:${response.status}`);
  }
  return response.json() as Promise<DecisionRecord>;
}
