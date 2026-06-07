import type { LucideIcon } from "lucide-react";
import type { RefObject } from "react";
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
  page_type?: string;
  retrieval_weight?: number;
  weighted_score?: number;
}

export type GovernanceCommand =
  | "enforce" | "migrate" | "memory" | "decision" | "perspectives" | "audit"
  | "history" | "why" | "tradeoff"
  | "score" | "simulate" | "capture" | "document" | "learn"
  | "feedback-review" | "token-impact" | "contract-check";

// Core Oracle Engines — user-selected specialized capabilities (Camada 2).
export type OracleEngineId =
  | "organizational-memory" | "decision-archaeology" | "perspective-synthesis" | "explainability-audit"
  | "knowledge-gap" | "governance-impact" | "principle-conflict" | "adoption-friction"
  | "oracle-council";

export type CommandMode = GovernanceCommand | OracleEngineId;

// Transparently disclosed cognitive skill (Camada 1) — XAI signal from the backend.
export interface CognitiveSkill {
  id: string;
  label: string;
  reason: string;
  confidence: number;
  intensity: "light" | "medium" | "high";
}

export interface ResponseCard {
  title: string;
  text: string;
  accent: "primary" | "secondary";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  decisionId?: string;
  responseCards?: ResponseCard[];
  conclusion?: string;
  isStreaming?: boolean;
  isError?: boolean;
  sources?: SourceChip[];
  intent?: string;
  commandMode?: CommandMode;
  catalogMode?: boolean;
  cognitiveSkills?: CognitiveSkill[];
  engine?: OracleEngineId | null;
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
  showConfidence: boolean;
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

export type ProfileId = "general" | "dev" | "designer" | "pm" | "qa" | "writer" | "a11y" | "maintainer";

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
  // ||| Phase 4 — adaptation instrumentation (optional during migration)
  preferredDepth?: "low" | "medium" | "high";
  technicalityLevel?: number;       // 0..1
  riskSensitivity?: number;         // 0..1
  trustCalibrationStyle?: "quantified" | "qualitative" | "comparative";
  informationHierarchy?: string[];
}

/** Phase 4 alias — the new vocabulary for the cognitive lens concept. */
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
  submitPrompt: (promptText?: string) => Promise<void>;
  updateSettings: (patch: Partial<BeatriceSettings>) => void;
}

export interface StreamChunk {
  delta?: string;
  sources?: SourceChip[];
  intent?: string;
  catalog_mode?: boolean;
  cognitive_skills?: CognitiveSkill[];
  engine?: OracleEngineId | null;
  error?: string;
}

export type LocaleAware = {
  locale: Locale;
};
