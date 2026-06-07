// ||| Types for the /comparison experience — Beatrice vs a generic LLM.

export interface ComparisonSource {
  title: string;
  source: string;
  similarity: number;
}

export interface BeatriceComparisonResult {
  answer: string;
  intent?: string;
  sources: ComparisonSource[];
  // 0..100, derived from retrieval similarity. null when no sources were returned.
  confidence: number | null;
  engine?: string | null;
}

export interface GenericComparisonResult {
  answer: string;
  // True while the generic side is served by a local mock (no real endpoint yet).
  isMock: boolean;
}

export type ComparisonStatus = "idle" | "loading" | "done" | "error";

export interface ComparisonState {
  status: ComparisonStatus;
  question: string;
  beatrice: BeatriceComparisonResult | null;
  generic: GenericComparisonResult | null;
  error: string | null;
}
