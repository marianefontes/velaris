// ||| /foundations : guidelines, accessibility, patterns and tokens
// Legacy focus IDs remain stable so existing links keep working.

import { lazy, Suspense, useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { Accessibility, Compass, LayoutGrid, Palette, ShieldCheck, Shapes, Sparkles } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { PageHero, PageShell } from "./ui/VisualPrimitives";

const GuidelinesPage = lazy(() =>
  import("./GuidelinesPage").then((module) => ({ default: module.GuidelinesPage })),
);
const AccessibilityPage = lazy(() =>
  import("./FoundationsPage").then((module) => ({ default: module.FoundationsPage })),
);
const PatternsPage = lazy(() =>
  import("./PatternsPage").then((module) => ({ default: module.PatternsPage })),
);
const TokensPage = lazy(() =>
  import("./TokensPage").then((module) => ({ default: module.TokensPage })),
);
const EvidencePage = lazy(() =>
  import("./EvidencePage").then((module) => ({ default: module.EvidencePage })),
);

type FocusId = "manifesto" | "foundations" | "patterns" | "tokens" | "evidence";

interface SectionMeta {
  id: FocusId;
  icon: typeof Compass;
}

const SECTIONS: SectionMeta[] = [
  { id: "manifesto", icon: Compass },
  { id: "foundations", icon: Accessibility },
  { id: "patterns", icon: Shapes },
  { id: "tokens", icon: Palette },
  { id: "evidence", icon: ShieldCheck },
];

export function FoundationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedFocus = (searchParams.get("focus") as FocusId | null) ?? "manifesto";
  const focus = SECTIONS.some((section) => section.id === requestedFocus)
    ? requestedFocus
    : "manifesto";

  const updateFocus = (next: FocusId) => {
    const nextParams = new URLSearchParams(searchParams);
    if (next === "manifesto") {
      nextParams.delete("focus");
    } else {
      nextParams.set("focus", next);
    }
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <div className="min-w-0 bg-surface-immersive text-slate-200">
      <PageShell className="pb-0">
        <Hero />
        <SectionNav active={focus} onChange={updateFocus} />
      </PageShell>

      <div
        id="foundation-panel"
        role="tabpanel"
        aria-labelledby={`foundation-tab-${focus}`}
        className="foundation-tabpanel"
        tabIndex={0}
      >
        <Suspense fallback={<SectionSkeleton />}>
          {focus === "manifesto" ? <GuidelinesPage /> : null}
          {focus === "foundations" ? <AccessibilityPage /> : null}
          {focus === "patterns" ? <PatternsPage /> : null}
          {focus === "tokens" ? <TokensPage /> : null}
          {focus === "evidence" ? <EvidencePage /> : null}
        </Suspense>
      </div>
    </div>
  );
}

function Hero() {
  const { t } = useI18n();

  return (
    <PageHero
      eyebrow={
        <>
          <LayoutGrid className="h-3.5 w-3.5" aria-hidden />
          {t("pages.foundations.eyebrow")}
        </>
      }
      title={
        <>
          {t("pages.foundations.hero.titleLead")}{" "}
          <span className="page-h1-accent">{t("pages.foundations.hero.titleAccent")}</span>.
        </>
      }
      description={t("pages.foundations.hero.description")}
    />
  );
}

function SectionNav({ active, onChange }: { active: FocusId; onChange: (next: FocusId) => void }) {
  const { t } = useI18n();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const activeIndex = SECTIONS.findIndex((section) => section.id === active);
    const activeTab = tabRefs.current[activeIndex];
    if (!activeTab) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    activeTab.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [active]);

  const focusTab = (index: number) => {
    const normalizedIndex = (index + SECTIONS.length) % SECTIONS.length;
    tabRefs.current[normalizedIndex]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusTab(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusTab(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusTab(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusTab(SECTIONS.length - 1);
    }
  };

  return (
    <nav
      aria-label={t("pages.foundations.navigationLabel")}
      role="tablist"
      aria-orientation="horizontal"
      className="flex gap-2 overflow-x-auto xl:grid xl:grid-cols-5 xl:overflow-visible"
    >
      {SECTIONS.map((section, index) => {
        const Icon = section.icon;
        const isActive = section.id === active;

        return (
          <button
            key={section.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={`foundation-tab-${section.id}`}
            type="button"
            role="tab"
            aria-controls="foundation-panel"
            aria-selected={isActive}
            data-state={isActive ? "active" : "inactive"}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(section.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`${isActive ? "section-tab-active" : "section-tab"} shrink-0 xl:min-w-0 xl:flex-col xl:items-start xl:gap-1 xl:text-left`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden strokeWidth={1.5} />
            <span className="font-semibold">
              {t(`pages.foundations.sections.${section.id}.label`)}
            </span>
            <span className="hidden text-[10px] uppercase tracking-widest opacity-50 sm:inline">
              {t(`pages.foundations.sections.${section.id}.role`)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function SectionSkeleton() {
  const { t } = useI18n();

  return (
    <div role="status" aria-live="polite" className="section-skeleton mx-auto min-h-[22rem] max-w-[1280px]">
      <div className="section-skeleton-inner">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-primary motion-safe:animate-pulse" aria-hidden />
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
            {t("pages.foundations.loading")}
          </span>
        </div>
      </div>
    </div>
  );
}
