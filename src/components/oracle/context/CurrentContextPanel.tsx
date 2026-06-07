// ||| EXTRACTED (Phase: nav refactor — safe extraction step)
// Source of truth: src/components/DashboardPage.tsx (inline "Current context"
// filter block, original lines ~48-95). This is a faithful, prop-driven
// extraction of the session-context chip row that the migration spec maps to
// Oracle → section `context`.
//
// IMPORTANT: This component is ISOLATED only. It is NOT yet wired into Oracle
// and DashboardPage has NOT been modified. It compiles standalone (tsc -b).
// Wiring/removal happens in a later migration step, per aetheris-spec-implementacao.md.

import type { Locale } from "../../../i18n/translations";

export interface CurrentContextPanelProps {
  /** Active locale — drives the chip labels (matches DashboardPage behaviour). */
  locale: Locale;
  /** Currently selected context chip. */
  activeFilter: string;
  /** Selection callback. */
  onSelect: (filter: string) => void;
  /**
   * Optional override of the chip list. When omitted, falls back to the same
   * three context filters the Dashboard used: Current context / Document base /
   * UX evaluation (localized).
   */
  filters?: string[];
}

/** Localized default chips — verbatim from the original DashboardPage logic. */
export function getDefaultContextFilters(locale: Locale): string[] {
  return locale === "en-US"
    ? ["Current context", "Document base", "UX evaluation"]
    : ["Contexto atual", "Base documental", "Avaliação UX"];
}

export function CurrentContextPanel({
  locale,
  activeFilter,
  onSelect,
  filters,
}: CurrentContextPanelProps) {
  const chips = filters ?? getDefaultContextFilters(locale);

  return (
    <section className="flex flex-wrap items-center gap-2">
      {chips.map((range) => (
        <button
          key={range}
          className={range === activeFilter ? "filter-tab filter-tab-active" : "filter-tab glass-card"}
          onClick={() => onSelect(range)}
          type="button"
        >
          {range}
        </button>
      ))}
    </section>
  );
}
