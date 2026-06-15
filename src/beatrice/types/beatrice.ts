import type { LucideIcon } from "lucide-react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import type { Locale } from "../../i18n/translations";

export interface SuggestedPrompt {
  title: string;
  body: string;
  icon: LucideIcon;
}

export interface SourceChip {
  title: string;
  source: string;
  similarity: number;
  evidence_tier?: EvidenceTier | "registry";
  excerpt?: string;
  origin?: string;
  page_type?: string;
  retrieval_weight?: number;
  weighted_score?: number;
}

export type GovernanceCommand =
  | "enforce" | "migrate" | "memory" | "decision" | "perspectives" | "audit"
  | "history" | "why" | "tradeoff"
  | "score" | "simulate" | "capture" | "document" | "learn"
  | "feedback-review" | "token-impact" | "contract-check";

// Core Oracle Engines : user-selected specialized capabilities (Camada 2).
export type OracleEngineId =
  | "organizational-memory" | "decision-archaeology" | "perspective-synthesis" | "explainability-audit"
  | "knowledge-gap" | "governance-impact" | "simulate" | "principle-conflict" | "adoption-friction"
  | "governance" | "health"
  | "oracle-council";

export type CommandMode = GovernanceCommand | OracleEngineId;

// Transparently disclosed cognitive skill (Camada 1) : XAI signal from the backend.
export interface CognitiveSkill {
  id: string;
  label: string;
  reason: string;
  confidence: number;
  intensity: "light" | "medium" | "high";
}

export interface PerspectiveAuditWarning {
  code: string;
  signal_group: string;
  message: string;
}

export type EvidenceTier =
  | "strong"
  | "partial"
  | "weak"
  | "insufficient"
  | "not_required";
export type ExecutionStepStatus = "pending" | "running" | "completed" | "failed" | "blocked" | "skipped";
export type DecisionRecordStatus = "draft" | "confirmed" | "rejected";

export interface ExecutionStep {
  id: string;
  label: string;
  status: ExecutionStepStatus;
  details?: string | null;
  timestamp?: string | null;
}

export interface ToolExecutionSummary {
  name: string;
  permission: "read_only" | "write_action";
  status: "completed" | "failed" | "blocked";
  details?: string | null;
}

export interface AuditSelectedRule {
  id: string;
  field: "do" | "dont" | "when_to_use" | "when_not_to_use";
  text: string;
  rule_similarity: number;
  sources: string[];
}

export interface AuditComponentCandidate {
  component_id: string;
  name: string;
  status: "draft" | "experimental" | "stable" | "deprecated" | "legacy";
  weighted_score: number;
  evidence_similarity: number;
  evidence_tier: EvidenceTier;
}

export interface AuditRejectedComponent extends AuditComponentCandidate {
  reason:
    | "weak_evidence"
    | "insufficient_evidence"
    | "deprecated_status"
    | "legacy_status"
    | "unresolved_component_id"
    | "unsupported_page_type";
}

export interface ResponseAuditMetadata {
  profile_contract_applied?: boolean;
  profile_contract_id?: string | null;
  required_signals_found?: string[];
  required_signals_missing?: string[];
  perspective_quality_score?: number | null;
  perspective_contract?: {
    id: string;
    version: string;
    profile: string;
  } | null;
  status?: "pass" | "warning" | "not_applicable";
  validation_method?: "observable_response_signals";
  matched_signals?: string[];
  profile_contract_warnings?: PerspectiveAuditWarning[];
  selected_skills?: string[];
  skill_content_requirement?: string;
  request_id?: string;
  query?: string;
  intent?: string;
  workflow?: string;
  user_intent?: string;
  answer_strategy?: string;
  language?: "pt-BR" | "pt-PT" | "en" | "es" | "fr" | "ar" | "other" | "unknown";
  entities?: {
    components: string[];
    patterns: string[];
    tokens: string[];
    token_categories: string[];
    states: string[];
    interaction_intents: string[];
    contexts: string[];
    accessibility_constraints: string[];
    risks: string[];
  };
  tools_used?: ToolExecutionSummary[];
  steps?: ExecutionStep[];
  sources?: SourceChip[];
  evidence_similarity?: number;
  evidence_tier?: EvidenceTier;
  confidence?: "high" | "medium" | "low" | "not_determined";
  confidence_rationale?: string;
  recommended_component?: string | null;
  recommended_component_id?: string | null;
  component_status?: AuditComponentCandidate["status"] | null;
  weighted_score?: number;
  alternative_components?: AuditComponentCandidate[];
  alternative_threshold?: number;
  alternative_limit?: number;
  rejected_components?: AuditRejectedComponent[];
  selection_reason?: string | null;
  selection_policy?: string | null;
  status_policy_applied?: boolean;
  component_intent?: unknown;
  used_do_rules?: AuditSelectedRule[];
  used_dont_rules?: AuditSelectedRule[];
  used_when_to_use?: AuditSelectedRule[];
  used_when_not_to_use?: AuditSelectedRule[];
  when_to_use?: unknown[] | null;
  when_not_to_use?: unknown[] | null;
  missing_component_fields?: string[];
  field_sources?: Record<string, string[]>;
  component_evidence?: unknown;
  response_validation_status?: "pass" | "fallback" | "not_applicable";
  validation_violation_type?:
    | "promoted_alternative"
    | "invented_component"
    | "invented_token"
    | "invented_confidence"
    | "contradicted_recommended_component"
    | "unsupported_claim"
    | "missing_required_limitation"
    | null;
  validation_violations?: string[];
  promoted_component_detected?: string | null;
  expected_recommended_component?: string | null;
  fallback_used?: boolean;
  fallback_reason?: string | null;
  limitations?: string[];
  decision_id?: string | null;
  decision_status?: DecisionRecordStatus | null;
  execution_status?: "running" | "completed" | "limited" | "failed" | "blocked";
}

export interface ResponseCard {
  title: string;
  text: string;
  accent: "primary" | "secondary";
}

export type NavigationTargetType =
  | "page"
  | "section"
  | "component"
  | "token"
  | "pattern"
  | "decision"
  | "concept"
  | "perspective";

export type NavigationActionSource =
  | "route_map"
  | "catalog"
  | "search_index"
  | "rag"
  | "manual_alias"
  | "perspective_registry";

export type NavigationConfidence = "exact" | "partial";

export type NavigationActionType = "navigate" | "set_profile";

export interface NavigationAction {
  label: string;
  href: string;
  target_type: NavigationTargetType;
  source: NavigationActionSource;
  confidence: NavigationConfidence;
  anchor?: string;
  metadata?: {
    profileId?: string;
    action_type?: NavigationActionType;
    internal?: boolean;
    section_key?: string;
    component_id?: string;
    component_name?: string;
    [key: string]: unknown;
  };
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  decisionId?: string;
  responseCards?: ResponseCard[];
  conclusion?: string;
  isStreaming?: boolean;
  isWelcome?: boolean;
  isError?: boolean;
  errorKind?: "backend" | "offline" | "technical";
  sources?: SourceChip[];
  intent?: string;
  commandMode?: CommandMode;
  catalogMode?: boolean;
  cognitiveSkills?: CognitiveSkill[];
  engine?: OracleEngineId | null;
  auditMetadata?: ResponseAuditMetadata;
  decisionStatus?: DecisionRecordStatus;
  navigationAction?: NavigationAction;
  secondaryNavigationActions?: NavigationAction[];
}

export interface HistoryEntry {
  role: "user" | "assistant";
  content: string;
}

export type BeatriceDensity = "compact" | "comfortable" | "dense";
export type BeatriceBlurIntensity = "low" | "medium" | "high";
export type BeatriceVerbosity = "concise" | "balanced" | "detailed";
export type BeatriceXAIDepth = "basic" | "standard" | "advanced";

export interface BeatriceSettings {
  streaming: boolean;
  autoScroll: boolean;
  showSources: boolean;
  showEvidenceSimilarity: boolean;
  density: BeatriceDensity;
  blurIntensity: BeatriceBlurIntensity;
  verbosity: BeatriceVerbosity;
  xaiDepth: BeatriceXAIDepth;
}

export interface BeatriceConversation {
  id: string;
  title: string;
  preview: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  messages: ChatMessage[];
  history: HistoryEntry[];
  settings: BeatriceSettings;
  profileId: ProfileId;
  locale: Locale;
  isTitleCustom?: boolean;
}

export interface BeatriceHistorySnapshot {
  version: 1;
  activeConversationId: string;
  conversations: BeatriceConversation[];
}

export interface ChatContent {
  suggestedPrompts: SuggestedPrompt[];
  initialMessages: ChatMessage[];
  activeContext: string[];
  recentTopics: string[];
  quickLinks: Array<{ label: string; to: string; icon: LucideIcon }>;
  justNow: string;
  coreRule: string;
}

export interface HealthData {
  status: string;
  corpus_chunks: number;
  rag_active: boolean;
  embedder: string;
}

export interface PromptStats {
  messages: number;
  decisions: number;
  confidence: string;
}

export interface ConfidenceBreakdown {
  ux: number;
  accessibility: number;
  architecture: number;
  consistency: number;
  performance: number;
}

export interface WeightedEvidence {
  title: string;
  source: string;
  similarity: number;
  page_type: string;
  weight: "high" | "medium" | "low";
  authorityLabel: string;
}

export interface TradeOff {
  gains: string[];
  losses: string[];
  risks: string[];
}

export interface AuditEntry {
  id: string;
  decisionId: string;
  intent: string;
  userQuery: string;
  sources: SourceChip[];
  summaryLine: string;
  confidence: ConfidenceBreakdown;
  evidence: WeightedEvidence[];
  tradeOffs: TradeOff;
  lifecycle: { status: "active" | "deprecated"; createdAt: string; reviewDate: string };
  relatedDecisions: string[];
}

export interface AuditLabels {
  badge: string;
  title: string;
  entries: string;
  empty: string;
  exportMd: string;
  exportJson: string;
  close: string;
  viewAll: string;
  tabDecisions: string;
  tabTimeline: string;
  confidence: string;
  evidence: string;
  tradeOffs: string;
  gains: string;
  losses: string;
  risks: string;
  lifecycle: string;
  created: string;
  review: string;
  active: string;
  related: string;
  reasoning: string;
  uxConf: string;
  a11yConf: string;
  archConf: string;
  consConf: string;
  perfConf: string;
}

export type AuditTab = "decisions" | "timeline";

export type ProfileId =
  | "general"
  | "dev"
  | "designer"
  | "product_designer"
  | "qa"
  | "tech_writer"
  | "a11y"
  | "maintainer"
  | "design_system_manager";

export interface PersonaStrategy {
  id: ProfileId;
  label: string;
  icon: LucideIcon;
  role: string;
  sessionTitle: string;
  operationalMode: string;
  identityStatement: string;
  workspaceTitle: string;
  workspaceSubtitle: string;
  workspaceTone: string;
  status: string;
  accentClass: string;
  reasoningStyle: string;
  languagePattern: string;
  operationalProfile: PersonaOperationalProfile;
  cognitiveProfile: PersonaCognitiveProfile;
  theme: PersonaTheme;
  reasoningPriorities: string[];
  retrievalWeighting: Record<string, number>;
  dashboardComposition: string[];
  examples: string[];
  artifactRanking: string[];
  auditFocus: string[];
  insightOrdering: string[];
  navigationFocus: PersonaNavigationItem[];
  highlightedComponents: PersonaHighlightedComponent[];
  metrics: PersonaMetric[];
  insights: PersonaInsight[];
  recommendations: PersonaRecommendation[];
  artifacts: PersonaArtifact[];
  decisionFeed: PersonaDecision[];
  recentActivity: PersonaActivity[];
  widgets: string[];
}

export interface PersonaOperationalProfile {
  fullName: string;
  title: string;
  specialty: string;
  primaryResponsibility: string;
  primaryPain: string;
  tools: string[];
  operationalEnvironment: string;
  prioritizedMetrics: string[];
  operationalFears: string[];
  communicationStyle: string;
  mentalStructure: string[];
  mainFocus: string;
}

export interface PersonaCognitiveProfile {
  objective: string[];
  fears: string[];
  heuristics: string[];
  tradeOffs: Array<{ favors: string; resists: string }>;
  textualStructure: string[];
  vocabulary: string[];
  alertPatterns: string[];
  decisionCriteria: string[];
  disagreementBias: string;
  // ||| Phase 4 : adaptation instrumentation (optional during migration)
  preferredDepth?: "low" | "medium" | "high";
  technicalityLevel?: number;       // 0..1
  riskSensitivity?: number;         // 0..1
  trustCalibrationStyle?: "quantified" | "qualitative" | "comparative";
  informationHierarchy?: string[];
}

/** Phase 4 alias : the new vocabulary for the cognitive lens concept. */
export type CognitiveLens = PersonaCognitiveProfile;

export interface PersonaTheme {
  shell: string;
  backdrop: string;
  panel: string;
  accentText: string;
  accentBorder: string;
  accentBg: string;
  accentRing: string;
  signal: string;
  meter: string;
}

export interface PersonaNavigationItem {
  label: string;
  detail: string;
}

export interface PersonaHighlightedComponent {
  name: string;
  reason: string;
  signal: string;
}

export interface PersonaMetric {
  label: string;
  value: string;
  delta: string;
  tone: string;
}

export interface PersonaInsight {
  title: string;
  detail: string;
  priority: "high" | "medium" | "low";
}

export interface PersonaRecommendation {
  title: string;
  action: string;
  impact: string;
}

export interface PersonaArtifact {
  title: string;
  type: string;
  state: string;
}

export interface PersonaDecision {
  id: string;
  title: string;
  rationale: string;
  confidence: number;
}

export interface PersonaActivity {
  timestamp: string;
  title: string;
  detail: string;
}

export interface CommandMeta {
  icon: string;
  label: string;
  colorClass: string;
  borderClass: string;
  bgClass: string;
}

export interface WorkspaceState {
  content: ChatContent;
  messages: ChatMessage[];
  conversations: BeatriceConversation[];
  activeConversationId: string;
  activeConversation: BeatriceConversation | null;
  settings: BeatriceSettings;
  input: string;
  isLoading: boolean;
  healthData: HealthData | null;
  stats: PromptStats;
  activeCommand: CommandMode | null;
  bottomRef: RefObject<HTMLDivElement>;
  clearConversations: () => void;
  createConversation: () => void;
  deleteConversation: (conversationId: string) => void;
  exportConversations: () => void;
  openConversation: (conversationId: string) => void;
  renameConversation: (conversationId: string, title: string) => void;
  resetSettings: () => void;
  setInput: (value: string) => void;
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  startNewConversation: () => void;
  submitPrompt: (promptText?: string) => Promise<void>;
  retryPrompt: (errorMessageId: string) => Promise<void>;
  updateSettings: (patch: Partial<BeatriceSettings>) => void;
}

export interface StreamChunk {
  delta?: string;
  sources?: SourceChip[];
  intent?: string;
  workflow?: string;
  tools_used?: ToolExecutionSummary[];
  catalog_mode?: boolean;
  cognitive_skills?: CognitiveSkill[];
  engine?: OracleEngineId | null;
  audit_metadata?: ResponseAuditMetadata;
  final?: boolean;
  navigation_action?: NavigationAction;
  secondary_navigation_actions?: NavigationAction[];
  request_id?: string;
  error?: string;
}

export type LocaleAware = {
  locale: Locale;
};
