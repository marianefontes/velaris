// Global search - shared types.
// The catalog (components, patterns, tokens, decisions, guidelines, reasoning,
// dev) is generated from the canonical RAG corpus. Page entries are authored by
// hand so their titles/descriptions stay localized through i18n.

export type SearchType =
  | "page"
  | "component"
  | "pattern"
  | "token"
  | "decision"
  | "guideline"
  | "reasoning"
  | "dev";

// Group order shown in the results panel (matches the IA the prompt expects:
// Pages, Components, Patterns, Tokens, Decisions, Guidelines, then the rest).
export const SEARCH_GROUP_ORDER: SearchType[] = [
  "page",
  "component",
  "pattern",
  "token",
  "decision",
  "guideline",
  "reasoning",
  "dev",
];

// A catalog entry as emitted by scripts/build_search_index.py.
export interface RawSearchEntry {
  id: string;
  type: SearchType;
  title: string;
  route: string;
  section: string;
  keywords: string[];
}

// A localized, searchable entry built at runtime.
export interface SearchEntry {
  id: string;
  type: SearchType;
  title: string;
  description: string;
  route: string;
  // Lowercased, accent-folded haystack used for matching.
  haystack: string;
  // Original keywords kept for exact-keyword ranking.
  keywords: string[];
  // True for legacy/deprecated targets so ranking can de-prioritize them.
  deprecated?: boolean;
}

export interface SearchResult extends SearchEntry {
  score: number;
}

export interface SearchGroup {
  type: SearchType;
  results: SearchResult[];
}
