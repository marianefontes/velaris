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
}

export type CommandMode = "enforce" | "migrate" | "history" | "why" | "tradeoff" | "score";

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
}

export interface HistoryEntry {
  role: "user" | "assistant";
  content: string;
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

export type ProfileId = "general" | "dev" | "designer" | "pm" | "qa" | "writer";

export interface PersonaStrategy {
  id: ProfileId;
  label: string;
  icon: LucideIcon;
  role: string;
  workspaceTitle: string;
  workspaceSubtitle: string;
  workspaceTone: string;
  status: string;
  accentClass: string;
  reasoningPriorities: string[];
  retrievalWeighting: Record<string, number>;
  dashboardComposition: string[];
  examples: string[];
  artifactRanking: string[];
  auditFocus: string[];
  insightOrdering: string[];
  metrics: PersonaMetric[];
  insights: PersonaInsight[];
  recommendations: PersonaRecommendation[];
  artifacts: PersonaArtifact[];
  decisionFeed: PersonaDecision[];
  recentActivity: PersonaActivity[];
  widgets: string[];
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
  input: string;
  isLoading: boolean;
  healthData: HealthData | null;
  stats: PromptStats;
  activeCommand: CommandMode | null;
  bottomRef: RefObject<HTMLDivElement>;
  setInput: (value: string) => void;
  submitPrompt: (promptText?: string) => Promise<void>;
}

export interface StreamChunk {
  delta?: string;
  sources?: SourceChip[];
  intent?: string;
  catalog_mode?: boolean;
  error?: string;
}

export type LocaleAware = {
  locale: Locale;
};
