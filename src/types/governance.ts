export type GovernanceSeverity = "critical" | "high" | "medium" | "low";

export interface GovernanceAlert {
  id: string;
  category: string;
  severity: GovernanceSeverity;
  priority: number;
  problem: string;
  impact: string;
  affected_entities: string[];
  recommendation: string;
}

export interface GovernanceAlertsPayload {
  audited_at: string;
  total_alerts: number;
  severity_summary: Record<GovernanceSeverity, number>;
  category_summary: Record<string, number>;
  alerts: GovernanceAlert[];
}
