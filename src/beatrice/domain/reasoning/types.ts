import type { ConfidenceBreakdown, SourceChip, WeightedEvidence } from "../../types/beatrice";

export interface ReasoningAuthority {
  label: string;
  weight: WeightedEvidence["weight"];
}

export interface ReasoningModel {
  computeConfidence: (sources: SourceChip[], intent: string) => ConfidenceBreakdown;
  buildEvidence: (sources: SourceChip[]) => WeightedEvidence[];
}

