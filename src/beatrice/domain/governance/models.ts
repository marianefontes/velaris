import type { CommandMeta, CommandMode } from "./types";

export const COMMAND_META: Record<CommandMode, CommandMeta> = {
  enforce: {
    icon: "⚡",
    label: "ENFORCE",
    colorClass: "text-amber-400",
    borderClass: "border-amber-400/25",
    bgClass: "bg-amber-400/8",
  },
  migrate: {
    icon: "=>",
    label: "MIGRATE",
    colorClass: "text-blue-400",
    borderClass: "border-blue-400/25",
    bgClass: "bg-blue-400/8",
  },
  history: {
    icon: "◎",
    label: "HISTORY",
    colorClass: "text-violet-400",
    borderClass: "border-violet-400/25",
    bgClass: "bg-violet-400/8",
  },
  why: {
    icon: "⬡",
    label: "WHY",
    colorClass: "text-emerald-400",
    borderClass: "border-emerald-400/25",
    bgClass: "bg-emerald-400/8",
  },
  tradeoff: {
    icon: "⇌",
    label: "TRADEOFF",
    colorClass: "text-orange-400",
    borderClass: "border-orange-400/25",
    bgClass: "bg-orange-400/8",
  },
  score: {
    icon: "◈",
    label: "SCORE",
    colorClass: "text-sky-400",
    borderClass: "border-sky-400/25",
    bgClass: "bg-sky-400/8",
  },
};

export const COMMAND_ORDER: CommandMode[] = ["enforce", "migrate", "history", "why", "tradeoff", "score"];

