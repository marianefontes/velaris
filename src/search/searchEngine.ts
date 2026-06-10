// Global search engine - pure, framework-agnostic ranking over the catalog.
// Builds localized entries once per locale, then scores them against a query.

import type { Locale, TranslationKey } from "../i18n/translations";
import { generatedEntries } from "./searchEntries.generated";
import { pageSeeds } from "./pageEntries";
import {
  SEARCH_GROUP_ORDER,
  type SearchEntry,
  type SearchGroup,
  type SearchResult,
  type SearchType,
} from "./types";

export type Translate = (key: TranslationKey, vars?: Record<string, string | number>) => string;

// Lowercase + strip diacritics so "botão" and "botao" both match, and a query
// in any of the three locales hits the same haystack.
export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(query: string): string[] {
  return normalizeText(query)
    .split(/[\s/_,.:;]+/)
    .map((term) => term.trim())
    .filter((term) => term.length > 0);
}

// Light singular/plural tolerance so "tokens" matches "token" and vice-versa
// across PT/EN. Only depluralizes words long enough to stay unambiguous.
function termVariants(term: string): string[] {
  const variants = new Set<string>([term]);
  if (term.length > 3 && term.endsWith("s")) variants.add(term.slice(0, -1));
  return [...variants];
}

function anyKeyword(keywords: string[], predicate: (keyword: string) => boolean): boolean {
  return keywords.some(predicate);
}

// One built set per locale - entries are stable for a session.
const entryCache = new Map<Locale, SearchEntry[]>();

export function buildEntries(locale: Locale, t: Translate): SearchEntry[] {
  const cached = entryCache.get(locale);
  if (cached) return cached;

  const entries: SearchEntry[] = [];

  // Pages first: titles and descriptions resolve through i18n.
  for (const seed of pageSeeds) {
    const title = t(seed.labelKey);
    const description = t(seed.badgeKey);
    const haystack = normalizeText([title, description, seed.keywords.join(" ")].join(" "));
    entries.push({
      id: seed.id,
      type: "page",
      title,
      description,
      route: seed.route,
      keywords: seed.keywords,
      haystack,
      deprecated: seed.deprecated,
    });
  }

  // Catalog entries from the generated corpus index.
  for (const raw of generatedEntries) {
    const description = t(`search.typeDescription.${raw.type}` as TranslationKey);
    const haystack = normalizeText([raw.title, raw.keywords.join(" "), raw.section].join(" "));
    entries.push({
      id: raw.id,
      type: raw.type,
      title: raw.title,
      description,
      route: raw.route,
      keywords: raw.keywords,
      haystack,
    });
  }

  entryCache.set(locale, entries);
  return entries;
}

// Score a single entry. Returns 0 when any query term has no field match
// (AND semantics) so unrelated entries never leak into results.
function scoreEntry(entry: SearchEntry, queryNorm: string, terms: string[]): number {
  const titleNorm = normalizeText(entry.title);
  const keywordsNorm = entry.keywords.map(normalizeText);

  // Whole-query shortcuts (strongest signals).
  let score = 0;
  if (titleNorm === queryNorm) score += 1000;
  else if (titleNorm.startsWith(queryNorm)) score += 320;
  else if (titleNorm.includes(queryNorm)) score += 120;
  if (keywordsNorm.some((keyword) => keyword === queryNorm)) score += 260;

  // Per-term best match - every term must land somewhere.
  for (const term of terms) {
    let best = 0;
    for (const variant of termVariants(term)) {
      if (titleNorm === variant) best = Math.max(best, 240);
      if (titleNorm.startsWith(variant)) best = Math.max(best, 160);
      if (anyKeyword(keywordsNorm, (keyword) => keyword === variant)) best = Math.max(best, 150);
      if (anyKeyword(keywordsNorm, (keyword) => keyword.startsWith(variant))) best = Math.max(best, 90);
      if (titleNorm.includes(variant)) best = Math.max(best, 70);
      if (anyKeyword(keywordsNorm, (keyword) => keyword.includes(variant))) best = Math.max(best, 50);
      if (best === 0 && entry.haystack.includes(variant)) best = Math.max(best, 25);
    }
    if (best === 0) return 0; // term unmatched → entry excluded
    score += best;
  }

  // Pages are the primary IA, nudge them up on ties.
  if (entry.type === "page") score += 12;
  // Never let legacy/deprecated targets outrank live content.
  if (entry.deprecated) score -= 500;
  return score;
}

export function searchEntries(
  query: string,
  locale: Locale,
  t: Translate,
  limit = 24,
): SearchResult[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];
  const queryNorm = normalizeText(query);
  const entries = buildEntries(locale, t);

  const scored: SearchResult[] = [];
  for (const entry of entries) {
    const score = scoreEntry(entry, queryNorm, terms);
    if (score > 0) scored.push({ ...entry, score });
  }

  scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  return scored.slice(0, limit);
}

// Group ranked results by type, preserving the IA order and intra-group score.
export function groupResults(results: SearchResult[]): SearchGroup[] {
  const buckets = new Map<SearchType, SearchResult[]>();
  for (const result of results) {
    const bucket = buckets.get(result.type) ?? [];
    bucket.push(result);
    buckets.set(result.type, bucket);
  }
  const groups: SearchGroup[] = [];
  for (const type of SEARCH_GROUP_ORDER) {
    const bucket = buckets.get(type);
    if (bucket && bucket.length > 0) groups.push({ type, results: bucket });
  }
  return groups;
}
