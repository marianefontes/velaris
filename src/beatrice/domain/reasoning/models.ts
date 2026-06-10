import type { ReasoningAuthority } from "./types";

export const PAGE_AUTHORITY: Record<string, ReasoningAuthority> = {
  design_decision: { label: "Official DS rule", weight: "high" },
  guideline: { label: "Usage guideline", weight: "high" },
  component: { label: "Component spec", weight: "high" },
  token: { label: "Design token", weight: "high" },
  xai_component: { label: "XAI specification", weight: "medium" },
  pattern: { label: "Interaction pattern", weight: "medium" },
  foundation: { label: "Visual foundation", weight: "medium" },
  reasoning: { label: "Execution trace", weight: "low" },
};
