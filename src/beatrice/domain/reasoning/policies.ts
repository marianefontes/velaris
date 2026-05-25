import type { ConfidenceBreakdown, SourceChip, WeightedEvidence } from "../../types/beatrice";
import { PAGE_AUTHORITY } from "./models";

export function computeConfidence(sources: SourceChip[], intent: string): ConfidenceBreakdown {
  const top = sources[0]?.similarity ?? 0.5;
  const avg = sources.length > 0
    ? sources.reduce((sum, source) => sum + source.similarity, 0) / sources.length
    : 0.5;
  const clamp = (value: number) => Math.min(100, Math.max(20, Math.round(value * 100)));
  const isComponent = ["component_guidance", "when_not_to_use"].includes(intent);
  const isToken = intent === "token_lookup";
  const isDecision = intent === "design_decision";

  return {
    ux: clamp(top * (isComponent ? 0.98 : 0.91) + avg * 0.08),
    accessibility: clamp(top * 0.86 + avg * 0.07 + 0.02),
    architecture: clamp(top * (isDecision ? 0.97 : 0.88) + avg * 0.09),
    consistency: clamp(top * (isToken ? 0.99 : 0.93) + avg * 0.07),
    performance: clamp(avg * 0.84 + 0.1),
  };
}

export function buildEvidence(sources: SourceChip[]): WeightedEvidence[] {
  return sources.map((source) => {
    const authority = PAGE_AUTHORITY[source.page_type ?? ""] ?? {
      label: "System source",
      weight: "medium" as const,
    };
    return {
      ...source,
      page_type: source.page_type ?? "",
      weight: authority.weight,
      authorityLabel: authority.label,
    };
  });
}

