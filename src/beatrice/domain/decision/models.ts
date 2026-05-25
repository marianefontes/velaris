import type { IntentTradeOffMap } from "./types";

export const INTENT_TRADEOFFS: IntentTradeOffMap = {
  component_guidance: {
    gains: ["Consistent interface pattern", "Guided user experience", "Design system alignment"],
    losses: ["Flexibility constraint", "Implementation coupling to DS version"],
    risks: ["Pattern may not cover all edge cases"],
  },
  pattern_guidance: {
    gains: ["Proven UX flow", "Reduced cognitive decision overhead", "Team consistency"],
    losses: ["Customization overhead", "Potential pattern rigidity over time"],
    risks: ["Flow may need revision as product scope evolves"],
  },
  token_lookup: {
    gains: ["Visual consistency across surfaces", "Maintainable and themeable scale"],
    losses: ["Reduced per-context flexibility"],
    risks: ["Token deprecation in future system versions"],
  },
  design_decision: {
    gains: ["Architectural clarity", "Documented and traceable rationale"],
    losses: ["Alternative paths foreclosed", "Alignment cost across teams"],
    risks: ["Decision may require revisiting at scale"],
  },
  when_not_to_use: {
    gains: ["Prevents known anti-patterns", "Clear usage boundary established"],
    losses: ["May restrict valid edge cases"],
    risks: ["Rule exceptions generate governance overhead"],
  },
  xai_explanation: {
    gains: ["Transparent AI reasoning", "Traceable confidence and evidence chain"],
    losses: ["Explanation layer adds cognitive load"],
    risks: ["Proxy metrics may not reflect subjective UX quality"],
  },
  general: {
    gains: ["Informed design direction from system context"],
    losses: ["Lower retrieval specificity | broader scope"],
    risks: ["Response drawn from general RAG context, not targeted"],
  },
};

