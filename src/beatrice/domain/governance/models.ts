import type { CommandMeta, CommandMode } from "./types";
import { COMMAND_ICONS } from "./commandIcons";

export const COMMAND_META: Record<CommandMode, CommandMeta> = {
  enforce: {
    icon: COMMAND_ICONS.enforce,
    label: "ENFORCE",
    colorClass: "text-amber-400",
    borderClass: "border-amber-400/25",
    bgClass: "bg-amber-400/8",
  },
  migrate: {
    icon: COMMAND_ICONS.migrate,
    label: "MIGRATE",
    colorClass: "text-blue-400",
    borderClass: "border-blue-400/25",
    bgClass: "bg-blue-400/8",
  },
  memory: {
    icon: COMMAND_ICONS.memory,
    label: "MEMORY",
    colorClass: "text-violet-300",
    borderClass: "border-violet-300/30",
    bgClass: "bg-violet-300/10",
  },
  decision: {
    icon: COMMAND_ICONS.decision,
    label: "DECISION",
    colorClass: "text-amber-300",
    borderClass: "border-amber-300/30",
    bgClass: "bg-amber-300/10",
  },
  perspectives: {
    icon: COMMAND_ICONS.perspectives,
    label: "PERSPECTIVES",
    colorClass: "text-sky-300",
    borderClass: "border-sky-300/30",
    bgClass: "bg-sky-300/10",
  },
  audit: {
    icon: COMMAND_ICONS.audit,
    label: "AUDIT",
    colorClass: "text-emerald-300",
    borderClass: "border-emerald-300/30",
    bgClass: "bg-emerald-300/10",
  },
  history: {
    icon: COMMAND_ICONS.history,
    label: "HISTORY",
    colorClass: "text-violet-400",
    borderClass: "border-violet-400/25",
    bgClass: "bg-violet-400/8",
  },
  why: {
    icon: COMMAND_ICONS.why,
    label: "WHY",
    colorClass: "text-emerald-400",
    borderClass: "border-emerald-400/25",
    bgClass: "bg-emerald-400/8",
  },
  tradeoff: {
    icon: COMMAND_ICONS.tradeoff,
    label: "TRADEOFF",
    colorClass: "text-orange-400",
    borderClass: "border-orange-400/25",
    bgClass: "bg-orange-400/8",
  },
  score: {
    icon: COMMAND_ICONS.score,
    label: "SCORE",
    colorClass: "text-sky-400",
    borderClass: "border-sky-400/25",
    bgClass: "bg-sky-400/8",
  },
  simulate: {
    icon: COMMAND_ICONS.simulate,
    label: "SIMULATE",
    colorClass: "text-cyan-400",
    borderClass: "border-cyan-400/25",
    bgClass: "bg-cyan-400/8",
  },
  capture: {
    icon: COMMAND_ICONS.capture,
    label: "CAPTURE",
    colorClass: "text-rose-400",
    borderClass: "border-rose-400/25",
    bgClass: "bg-rose-400/8",
  },
  document: {
    icon: COMMAND_ICONS.document,
    label: "DOCUMENT",
    colorClass: "text-indigo-400",
    borderClass: "border-indigo-400/25",
    bgClass: "bg-indigo-400/8",
  },
  learn: {
    icon: COMMAND_ICONS.learn,
    label: "FEEDBACK LEGACY",
    colorClass: "text-lime-400",
    borderClass: "border-lime-400/25",
    bgClass: "bg-lime-400/8",
  },
  "feedback-review": {
    icon: COMMAND_ICONS["feedback-review"],
    label: "FEEDBACK",
    colorClass: "text-lime-400",
    borderClass: "border-lime-400/25",
    bgClass: "bg-lime-400/8",
  },
  "token-impact": {
    icon: COMMAND_ICONS["token-impact"],
    label: "TOKEN IMPACT",
    colorClass: "text-pink-300",
    borderClass: "border-pink-300/25",
    bgClass: "bg-pink-300/8",
  },
  "contract-check": {
    icon: COMMAND_ICONS["contract-check"],
    label: "CONTRACT",
    colorClass: "text-teal-300",
    borderClass: "border-teal-300/25",
    bgClass: "bg-teal-300/8",
  },

  // ── Core Oracle Engines ──────────────────────────────────────────────────
  "organizational-memory": {
    icon: COMMAND_ICONS["organizational-memory"],
    label: "ORG MEMORY",
    colorClass: "text-violet-300",
    borderClass: "border-violet-300/30",
    bgClass: "bg-violet-300/10",
  },
  "decision-archaeology": {
    icon: COMMAND_ICONS["decision-archaeology"],
    label: "ARCHAEOLOGY",
    colorClass: "text-amber-300",
    borderClass: "border-amber-300/30",
    bgClass: "bg-amber-300/10",
  },
  "perspective-synthesis": {
    icon: COMMAND_ICONS["perspective-synthesis"],
    label: "PERSPECTIVES",
    colorClass: "text-sky-300",
    borderClass: "border-sky-300/30",
    bgClass: "bg-sky-300/10",
  },
  "explainability-audit": {
    icon: COMMAND_ICONS["explainability-audit"],
    label: "XAI AUDIT",
    colorClass: "text-emerald-300",
    borderClass: "border-emerald-300/30",
    bgClass: "bg-emerald-300/10",
  },

  // ── Specialized Oracle Engines ───────────────────────────────────────────
  "knowledge-gap": {
    icon: COMMAND_ICONS["knowledge-gap"],
    label: "KNOWLEDGE GAP",
    colorClass: "text-rose-300",
    borderClass: "border-rose-300/30",
    bgClass: "bg-rose-300/10",
  },
  "governance-impact": {
    icon: COMMAND_ICONS["governance-impact"],
    label: "GOV IMPACT",
    colorClass: "text-cyan-300",
    borderClass: "border-cyan-300/30",
    bgClass: "bg-cyan-300/10",
  },
  "principle-conflict": {
    icon: COMMAND_ICONS["principle-conflict"],
    label: "PRINCIPLES",
    colorClass: "text-orange-300",
    borderClass: "border-orange-300/30",
    bgClass: "bg-orange-300/10",
  },
  "adoption-friction": {
    icon: COMMAND_ICONS["adoption-friction"],
    label: "ADOPTION",
    colorClass: "text-yellow-300",
    borderClass: "border-yellow-300/30",
    bgClass: "bg-yellow-300/10",
  },
  governance: {
    icon: COMMAND_ICONS.governance,
    label: "GOVERNANCE",
    colorClass: "text-emerald-300",
    borderClass: "border-emerald-300/30",
    bgClass: "bg-emerald-300/10",
  },
  health: {
    icon: COMMAND_ICONS.health,
    label: "HEALTH",
    colorClass: "text-lime-300",
    borderClass: "border-lime-300/30",
    bgClass: "bg-lime-300/10",
  },
  "oracle-council": {
    icon: COMMAND_ICONS["oracle-council"],
    label: "COUNCIL",
    colorClass: "text-fuchsia-300",
    borderClass: "border-fuchsia-300/30",
    bgClass: "bg-fuchsia-300/10",
  },
};

// Public command surface: one section, differentiated by internal category.
export const ORACLE_ACTION_ORDER: CommandMode[] = [
  "enforce",
  "migrate",
  "capture",
  "document",
  "token-impact",
  "contract-check",
];

export const ORACLE_INVESTIGATION_ORDER: CommandMode[] = [
  "memory",
  "decision",
  "perspectives",
  "audit",
  "knowledge-gap",
  "simulate",
];
