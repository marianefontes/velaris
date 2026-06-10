import type { Locale } from "../../i18n/translations";

const PT_MINOR_WORDS = new Set([
  "a",
  "o",
  "e",
  "ou",
  "de",
  "da",
  "do",
  "dos",
  "das",
  "em",
  "no",
  "na",
  "nos",
  "nas",
  "com",
  "por",
  "para",
  "vs",
  "vs.",
]);

function capitalizeWord(word: string): string {
  if (!word) return word;
  const [first, ...rest] = word;
  return `${first.toUpperCase()}${rest.join("")}`;
}

export function toDisplayTitle(text: string, locale: Locale): string {
  const trimmed = text.trim();
  if (!trimmed || locale === "en-US") return trimmed;

  return trimmed
    .split(/\s+/)
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index > 0 && PT_MINOR_WORDS.has(lower)) return lower;
      return capitalizeWord(lower);
    })
    .join(" ");
}
