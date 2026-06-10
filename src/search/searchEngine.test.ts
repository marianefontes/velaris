import { describe, expect, it } from "vitest";
import type { TranslationKey } from "../i18n/translations";
import { groupResults, normalizeText, searchEntries } from "./searchEngine";

// Minimal translator stub: returns the key. Catalog titles are literal in the
// generated index, and page entries match through their keyword lists, so this
// is sufficient to exercise ranking without loading the full i18n bundle.
const t = (key: TranslationKey) => key as unknown as string;

function topTitles(query: string, n = 5): string[] {
  return searchEntries(query, "pt-BR", t)
    .slice(0, n)
    .map((result) => result.title);
}

describe("normalizeText", () => {
  it("folds accents and case", () => {
    expect(normalizeText("Botão")).toBe("botao");
    expect(normalizeText("Confiança")).toBe("confianca");
  });
});

describe("searchEntries - required terms", () => {
  const cases: Array<[string, string]> = [
    ["button", "Button"],
    ["botão", "Button"],
    ["modal", "Modal/Dialog"],
    ["confiança", "Confidence Badge"],
    ["confidence", "Confidence Badge"],
    ["onboarding", "Onboarding"],
  ];

  it.each(cases)("'%s' surfaces %s near the top", (query, expectedTitle) => {
    expect(topTitles(query)).toContain(expectedTitle);
  });

  it("'cor' surfaces color tokens", () => {
    const titles = topTitles("cor", 8).join(" ").toLowerCase();
    expect(titles).toMatch(/color|primary/);
  });

  it("'espaçamento' and 'spacing' both surface spacing tokens", () => {
    expect(topTitles("espaçamento", 8).some((title) => title.startsWith("space"))).toBe(true);
    expect(topTitles("spacing", 8).some((title) => title.startsWith("space"))).toBe(true);
  });

  it("'tokens' returns many token entries", () => {
    const results = searchEntries("tokens", "pt-BR", t);
    expect(results.filter((result) => result.type === "token").length).toBeGreaterThan(5);
  });

  it("'decisão' surfaces a decision", () => {
    const results = searchEntries("decisão", "pt-BR", t);
    expect(results.some((result) => result.type === "decision")).toBe(true);
  });

  it("'abraxos', the legacy alias, and 'oráculo' surface the oracle page", () => {
    expect(searchEntries("abraxos", "pt-BR", t).some((r) => r.route === "/oracle")).toBe(true);
    expect(searchEntries("beatrice", "pt-BR", t).some((r) => r.route === "/oracle")).toBe(true);
    expect(searchEntries("oráculo", "pt-BR", t).some((r) => r.route === "/oracle")).toBe(true);
  });

  it("nonsense returns nothing", () => {
    expect(searchEntries("banana cósmica", "pt-BR", t)).toHaveLength(0);
  });

  it("groups preserve IA order", () => {
    const groups = groupResults(searchEntries("a", "pt-BR", t));
    const types = groups.map((group) => group.type);
    const sorted = [...types].sort(
      (a, b) =>
        ["page", "component", "pattern", "token", "decision", "guideline", "reasoning", "dev"].indexOf(a) -
        ["page", "component", "pattern", "token", "decision", "guideline", "reasoning", "dev"].indexOf(b),
    );
    expect(types).toEqual(sorted);
  });
});
