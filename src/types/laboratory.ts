export type LaboratoryRunStatus =
  | "queued"
  | "running"
  | "completed"
  | "partial"
  | "failed"
  | "cancelled"
  | "interrupted";

export interface LaboratoryCaseSet {
  id: string;
  version: string;
  case_count: number;
  fingerprint: string;
  categories: Record<string, number>;
}

export interface LaboratoryMetric {
  metric_name: string;
  value: number | null;
  status: string;
  rationale: string;
  evaluator_version: string;
}

export interface LaboratorySource {
  position: number;
  title: string;
  source: string;
  page_type: string;
  similarity: number | null;
  retrieval_weight: number | null;
  weighted_score: number | null;
}

export interface LaboratoryReview {
  reviewer: string;
  scores: Record<string, number>;
  notes: string;
  reviewed_at: string;
}

export interface LaboratoryRunItem {
  id: string;
  run_id: string;
  case_id: string;
  profile: string;
  repetition: number;
  question: string;
  category: string;
  convergence_mode: string;
  status: string;
  answer_text: string | null;
  intent: string | null;
  cognitive_skills: Array<Record<string, unknown>>;
  evidence_metrics: Record<string, number>;
  duration_ms: number | null;
  error: string | null;
  error_category: string | null;
  retry_count: number;
  retry_after: string | null;
  sources: LaboratorySource[];
  metrics: LaboratoryMetric[];
  review: LaboratoryReview | null;
}

export interface LaboratoryRetrievalSnapshot {
  captured_at: string;
  retrieval_mode: "dense" | "hybrid";
  retrieval_mode_override: string | null;
  env_retrieval_mode: "dense" | "hybrid";
  rrf_k: number;
  corpus_version: string;
  corpus_chunk_count: number;
  indexed_chunk_count: number;
  sparse_cache_available: boolean;
  sparse_cache_corpus_version: string | null;
  sparse_retrieval_supported: boolean;
  hybrid_effective: boolean;
  hybrid_fallback_reason: string | null;
}

export interface LaboratoryMetricComparisonRow {
  baseline: number | null;
  candidate: number | null;
  delta: number | null;
  baseline_samples?: number;
  candidate_samples?: number;
}

export interface LaboratoryRunComparison {
  baseline_run_id: string;
  candidate_run_id: string;
  comparison_group_id: string | null;
  compatible: boolean;
  baseline: {
    id: string;
    version_label: string;
    status: LaboratoryRunStatus;
    aggregate: LaboratoryRun["aggregate"];
    retrieval_snapshot: LaboratoryRetrievalSnapshot;
    dataset_version: string;
    dataset_fingerprint: string;
  };
  candidate: {
    id: string;
    version_label: string;
    status: LaboratoryRunStatus;
    aggregate: LaboratoryRun["aggregate"];
    retrieval_snapshot: LaboratoryRetrievalSnapshot;
    dataset_version: string;
    dataset_fingerprint: string;
  };
  metrics: Record<string, LaboratoryMetricComparisonRow>;
}

export interface LaboratoryAggregateMetric {
  value: number;
  samples: number;
}

export interface LaboratoryRun {
  id: string;
  case_set_id: string;
  dataset_version: string;
  dataset_fingerprint: string;
  version_label: string;
  profiles: string[];
  repetitions: number;
  status: LaboratoryRunStatus;
  total_items: number;
  completed_items: number;
  failed_items: number;
  model: string;
  prompt_fingerprint: string;
  aggregate: {
    score?: number | null;
    metrics?: Record<string, LaboratoryAggregateMetric>;
    confidence_calibration?: {
      status: string;
      ece: number | null;
      reason: string;
    };
  };
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  cancel_requested_at: string | null;
  is_baseline: boolean;
  approved_at: string | null;
  origin: "manual" | "scheduled";
  schedule_date: string | null;
  schedule_slot: number | null;
  calibration_version_id: string | null;
  calibration_proposal_id: string | null;
  calibration_snapshot: Record<string, { technicality: number; risk_sensitivity: number }>;
  control_run_id: string | null;
  comparison_group_id: string | null;
  retrieval_snapshot: LaboratoryRetrievalSnapshot;
  prompt_tokens: number;
  completion_tokens: number;
  progress: number;
  items?: LaboratoryRunItem[];
}

export interface LaboratoryCalibrationVersion {
  id: string;
  label: string;
  calibration: Record<string, { technicality: number; risk_sensitivity: number }>;
  parent_version_id?: string | null;
  origin: string;
  proposal_id?: string | null;
  created_at?: string;
  activated_at?: string | null;
}

export interface LaboratoryAutomationStatus {
  enabled: boolean;
  paused: boolean;
  pause_reason: string | null;
  pause_until: string | null;
  timezone: string;
  case_set_id: string;
  next_slot: {
    index: number;
    version_label: string;
    repetitions: number;
    scheduled_for: string;
  } | null;
  daily_estimated_calls: number;
  active_calibration_version_id: string | null;
  revision: number;
}

export interface LaboratoryScheduleSlot {
  id: string;
  schedule_date: string;
  slot_index: number;
  scheduled_for: string;
  status: string;
  run_id: string | null;
  reason: string | null;
  claimed_at: string;
  completed_at: string | null;
}

export interface LaboratoryGuardrailCheck {
  id: string;
  passed: boolean;
  observed: number | string | boolean | null;
  threshold: number | string | boolean;
  rationale: string;
}

export interface LaboratoryRecommendation {
  id: string;
  recommendation_type: string;
  status: string;
  title: string;
  summary: string;
  rationale: string;
  affected_perspectives: string[];
  metric_comparison: Record<string, unknown>;
  guardrails: {
    passed?: boolean;
    checks?: LaboratoryGuardrailCheck[];
    failed?: string[];
  };
  run_id: string | null;
  proposal_id: string | null;
  calibration_version_id: string | null;
  is_read: boolean;
  decided_at: string | null;
  decision: string | null;
  decision_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface LaboratoryNotification {
  id: string;
  event_type: string;
  title: string;
  body: string;
  run_id: string | null;
  recommendation_id: string | null;
  created_at: string;
  read_at: string | null;
}

export interface LaboratorySnapshot {
  revision: number;
  generated_at: string;
  run_count: number;
  completed_run_count: number;
  pending_reviews: number;
  unread_recommendations: number;
  recommendation_count: number;
  unread_notifications: number;
  latest: LaboratoryRun | null;
  latest_scheduled: LaboratoryRun | null;
  latest_manual: LaboratoryRun | null;
  baseline: LaboratoryRun | null;
  regressions: Array<{ metric: string; delta: number }>;
  runs: LaboratoryRun[];
  automation: LaboratoryAutomationStatus;
  active_calibration: LaboratoryCalibrationVersion;
  candidates: LaboratoryScheduleSlot[];
  recommendations: LaboratoryRecommendation[];
  notifications: LaboratoryNotification[];
  latest_perspective_metrics: Record<string, Record<string, number>>;
}

export type LaboratoryResults = Omit<
  LaboratorySnapshot,
  "runs" | "recommendation_count" | "notifications"
>;
