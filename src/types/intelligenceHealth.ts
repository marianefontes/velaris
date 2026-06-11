export type CoverageDimensions = Record<string, boolean>;

export interface KnowledgeDebtEntry {
  entity: string;
  entity_id: string;
  type: "component" | "perspective";
  coverage_percent: number;
  missing_fields: string[];
  priority: "critical" | "high" | "medium" | "healthy";
  is_complete: boolean;
}

export interface ComponentCoverageEntry {
  component_id: string;
  name: string;
  status: string;
  dimensions: CoverageDimensions;
  missing_fields: string[];
  coverage_ratio: number;
  coverage_percent: number;
  coverage_v2_ratio: number;
  coverage_v2_percent: number;
  backlog_priority: string;
  is_complete: boolean;
}

export interface PerspectiveCoverageEntry {
  profile: string;
  label: string;
  dimensions: CoverageDimensions;
  signal_group_count: number;
  coverage_ratio: number;
  coverage_percent: number;
}

export interface KnowledgeGapEntry {
  entity: string;
  entity_id: string;
  type: "component" | "perspective";
  gap: string;
  coverage_percent: number;
  priority: "high" | "medium" | "low";
}

export interface IntelligenceScores {
  knowledge_coverage: number;
  evidence_reliability: number;
  hallucination_resistance: number;
  decision_coverage: number;
  perspective_coverage: number;
  overall_intelligence_health: number;
}

export interface KnowledgeHealthDashboard {
  audited_at: string;
  knowledge_health_score: number;
  entities_catalogued: {
    components: number;
    tokens: number;
    patterns: number;
    guidelines: number;
    foundations: number;
    perspectives: number;
    decisions: number;
  };
  component_coverage: ComponentCoverageEntry[];
  perspective_coverage: PerspectiveCoverageEntry[];
  knowledge_debt_backlog: KnowledgeDebtEntry[];
  knowledge_gaps: KnowledgeGapEntry[];
  knowledge_gaps_total: number;
  critical_entity_count: number;
  complete_entity_count: number;
  evidence_health: {
    distribution: Record<"strong" | "medium" | "weak" | "absent", number>;
    percentages: Record<"strong" | "medium" | "weak" | "absent", number>;
    audited_fields: number;
  };
  decision_health: {
    total: number;
    statuses: Record<string, number>;
    orphans: string[];
    orphan_count: number;
  };
  intelligence_scores: IntelligenceScores;
}

export interface AdversarialCase {
  id: string;
  category: string;
  query: string;
  expected: string;
  description: string;
}

export interface AdversarialResult extends AdversarialCase {
  passed: boolean;
  fail_reason: string;
  workflow: string;
  retrieval_intent: string;
  entity_status: string | null;
  unsupported_entity: string | null;
  exact_matches: string[];
  integrity_violations: string[];
  response_preview: string;
}

export interface AdversarialSuiteResult {
  passed: number;
  total: number;
  pass_rate_percent: number;
  by_category: Record<string, { passed: number; total: number }>;
  results: AdversarialResult[];
}

export interface ReliabilityGate {
  passed: boolean;
  message: string;
  details: Record<string, unknown>;
}

export interface ReliabilityGatesResult {
  passed: boolean;
  hallucination_resistance_score: number;
  minimum_hallucination_resistance: number;
  gates: Record<string, ReliabilityGate>;
  intelligence_scores: IntelligenceScores;
}
