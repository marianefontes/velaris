import { getApiBaseUrl } from "./apiConfig";
import type { GovernanceAlertsPayload } from "../types/governance";

export async function fetchGovernanceAlerts(): Promise<GovernanceAlertsPayload> {
  const response = await fetch(`${getApiBaseUrl()}/governance/alerts`);
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { detail?: string } | null;
    throw new Error(body?.detail ?? `governance_http_${response.status}`);
  }
  return response.json() as Promise<GovernanceAlertsPayload>;
}
