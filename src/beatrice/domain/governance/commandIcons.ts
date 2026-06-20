import type { LucideIcon } from "lucide-react";
import {
  ArrowRightLeft,
  Blocks,
  Brain,
  CircleHelp,
  FileCheck,
  FileText,
  FlaskConical,
  Gauge,
  GitCompareArrows,
  HeartPulse,
  History,
  Layers3,
  Lightbulb,
  MessageSquareQuote,
  Orbit,
  Scale,
  ScanSearch,
  SearchCheck,
  Shield,
  ShieldCheck,
  Unplug,
  Users,
} from "lucide-react";
import type { CommandMode } from "../../types/beatrice";

/** Shared stroke weight for all command icons — keeps the family visually coherent. */
export const COMMAND_ICON_STROKE = 1.75;

/**
 * Canonical Lucide icon map for every Beatrice command / engine mode.
 * Oracle commands use semantically direct metaphors; legacy aliases mirror their public twin.
 */
export const COMMAND_ICONS: Record<CommandMode, LucideIcon> = {
  // ── Operational commands ─────────────────────────────────────────────────
  enforce: ShieldCheck,
  migrate: ArrowRightLeft,
  capture: ScanSearch,
  document: FileText,
  "token-impact": Orbit,
  "contract-check": FileCheck,

  // ── Investigative commands ─────────────────────────────────────────────────
  memory: Brain,
  decision: Scale,
  perspectives: Layers3,
  audit: SearchCheck,
  "knowledge-gap": CircleHelp,
  simulate: FlaskConical,

  // ── Legacy / auxiliary commands ────────────────────────────────────────────
  history: History,
  why: Lightbulb,
  tradeoff: GitCompareArrows,
  score: Gauge,
  learn: MessageSquareQuote,
  "feedback-review": MessageSquareQuote,

  // ── Canonical engine aliases (mirror public commands) ────────────────────
  "organizational-memory": Brain,
  "decision-archaeology": Scale,
  "perspective-synthesis": Layers3,
  "explainability-audit": SearchCheck,

  // ── Specialized engines ────────────────────────────────────────────────────
  "governance-impact": Blocks,
  "principle-conflict": GitCompareArrows,
  "adoption-friction": Unplug,
  governance: Shield,
  health: HeartPulse,
  "oracle-council": Users,
};
