import type { LucideIcon } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
}

export interface Metric {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "steady";
  hint: string;
}

export interface VelocityPoint {
  sprint: string;
  committed: number;
  delivered: number;
  predicted: number;
}

export interface TaskStatusDatum {
  name: string;
  value: number;
  color: string;
}

export interface BurndownPoint {
  day: string;
  ideal: number;
  actual: number;
}

export interface SprintHealth {
  label: string;
  value: number;
  tone: "good" | "warning" | "critical";
  detail: string;
}

export interface PredictionSource {
  id: string;
  label: string;
  kind: "document" | "sprint-log" | "survey" | "forecast";
}

export interface AIPrediction {
  id: string;
  title: string;
  risk: "low" | "medium" | "high";
  summary: string;
  confidence: number;
  timeframe: string;
  sources: PredictionSource[];
}

export interface ExplanationPanelData {
  title: string;
  explanation: string;
  recommendation: string;
}

export interface GuidanceStep {
  id: string;
  title: string;
  description: string;
}

export interface OracleGuidanceData {
  start: string;
  structure: string;
  bestCombination: string;
  whenToUse: string;
  whenNotToUse: string;
  why: string;
  uxPrinciples: GuidanceStep[];
}

export interface DashboardData {
  metrics: Metric[];
  velocity: VelocityPoint[];
  taskStatus: TaskStatusDatum[];
  burndown: BurndownPoint[];
  sprintHealth: SprintHealth[];
  predictions: AIPrediction[];
  explanation: ExplanationPanelData;
  guidance: OracleGuidanceData;
}
