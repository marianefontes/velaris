// Global search - accessible, ranked, bilingual command-style finder.
// Wires the previously decorative ⌘K field into the real catalog (pages,
// components, patterns, tokens, decisions, guidelines, reasoning, dev).

import {
  Accessibility,
  BrainCircuit,
  Code2,
  Component as ComponentIcon,
  CornerDownLeft,
  FileText,
  GitBranch,
  LayoutGrid,
  Palette,
  Search,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import type { TranslationKey } from "../i18n/translations";
import { groupResults, searchEntries } from "../search/searchEngine";
import type { SearchResult, SearchType } from "../search/types";

const TYPE_ICON: Record<SearchType, LucideIcon> = {
  page: FileText,
  component: ComponentIcon,
  pattern: LayoutGrid,
  token: Palette,
  decision: GitBranch,
  guideline: Accessibility,
  reasoning: BrainCircuit,
  dev: Code2,
};

function useDebounced<T>(value: T, delay = 140): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handle = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(handle);
  }, [value, delay]);
  return debounced;
}

export function GlobalSearch() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounced(query);

  const results = useMemo<SearchResult[]>(() => {
    if (debouncedQuery.trim().length === 0) return [];
    return searchEntries(debouncedQuery, locale, t);
  }, [debouncedQuery, locale, t]);

  const groups = useMemo(() => groupResults(results), [results]);
  const hasQuery = debouncedQuery.trim().length > 0;
  const showPanel = open && hasQuery;

  // Keep activeIndex within bounds whenever the result set changes.
  useEffect(() => {
    setActiveIndex(0);
  }, [debouncedQuery]);

  // Mirror the query into ?q= (replace, current page only) for shareable links.
  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (current === query) return;
    const next = new URLSearchParams(searchParams);
    if (query.trim()) next.set("q", query);
    else next.delete("q");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // ⌘K / Ctrl+K focuses the field from anywhere.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close when clicking outside the search region.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function goToResult(result: SearchResult | undefined) {
    if (!result) return;
    setOpen(false);
    inputRef.current?.blur();
    navigate(result.route);
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      if (showPanel) {
        event.preventDefault();
        setOpen(false);
        return;
      }
      setQuery("");
      return;
    }
    if (!showPanel || results.length === 0) {
      if (event.key === "Enter" && hasQuery && results.length > 0) {
        event.preventDefault();
        goToResult(results[0]);
      }
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      goToResult(results[activeIndex] ?? results[0]);
    }
  }

  // Flat index lookup so grouped rendering keeps a single active cursor.
  const indexOfResult = (result: SearchResult) => results.indexOf(result);

  return (
    <div ref={containerRef} className="relative flex min-w-0 flex-1">
      <label className="glass-card flex min-h-11 min-w-0 flex-1 items-center gap-2.5 rounded-xl px-3 py-2 transition-all focus-within:border-primary/25 focus-within:shadow-[0_0_0_1px_rgba(194,160,252,0.12)]">
        <Search aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-primary/70" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="min-w-0 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
          placeholder={t("shell.searchPlaceholder")}
          aria-label={t("shell.searchAria")}
          type="text"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls="global-search-listbox"
          aria-activedescendant={showPanel && results.length > 0 ? `gs-option-${activeIndex}` : undefined}
          autoComplete="off"
          spellCheck={false}
        />
        <kbd className="hidden shrink-0 items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 sm:flex">
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </label>

      {showPanel && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-[70vh] overflow-y-auto rounded-2xl border border-white/10 bg-surface-container-highest/95 p-2 shadow-panel backdrop-blur-2xl">
          {results.length === 0 ? (
            <div role="status" aria-live="polite" className="px-3 py-6 text-center">
              <p className="text-sm font-semibold text-slate-200">{t("search.noResults")}</p>
              <p className="mt-1 text-xs text-slate-500">{t("search.noResultsHint")}</p>
            </div>
          ) : (
            <>
              <ul
                id="global-search-listbox"
                role="listbox"
                aria-label={t("search.resultsAria")}
                className="flex flex-col gap-0.5"
              >
                {groups.map((group) => (
                  <li key={group.type} role="presentation">
                    <p className="px-2 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      {t(`search.groupLabel.${group.type}` as TranslationKey)}
                    </p>
                    <ul role="presentation" className="flex flex-col gap-0.5">
                      {group.results.map((result) => {
                        const flatIndex = indexOfResult(result);
                        const active = flatIndex === activeIndex;
                        const Icon = TYPE_ICON[result.type];
                        return (
                          <li key={result.id} role="presentation">
                            <button
                              type="button"
                              id={`gs-option-${flatIndex}`}
                              role="option"
                              aria-selected={active}
                              onMouseEnter={() => setActiveIndex(flatIndex)}
                              onClick={() => goToResult(result)}
                              className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors ${
                                active ? "bg-primary/[0.12]" : "hover:bg-white/[0.04]"
                              }`}
                            >
                              <span
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                                  active ? "bg-primary/15 text-primary" : "bg-white/[0.04] text-slate-400"
                                }`}
                              >
                                <Icon className="h-3.5 w-3.5" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold text-white">
                                  {result.title}
                                </span>
                                <span className="block truncate text-xs text-slate-500">
                                  {result.description}
                                </span>
                              </span>
                              <span className="hidden shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600 sm:block">
                                {t(`search.typeLabel.${result.type}` as TranslationKey)}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
              <div className="mt-1 flex items-center gap-3 border-t border-white/[0.06] px-2.5 pt-2 text-[10px] text-slate-600">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-white/10 bg-white/5 px-1">↑</kbd>
                  <kbd className="rounded border border-white/10 bg-white/5 px-1">↓</kbd>
                  {t("search.hintNavigate")}
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-white/10 bg-white/5 px-1">
                    <CornerDownLeft className="h-2.5 w-2.5" />
                  </kbd>
                  {t("search.hintOpen")}
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-white/10 bg-white/5 px-1">esc</kbd>
                  {t("search.hintClose")}
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
