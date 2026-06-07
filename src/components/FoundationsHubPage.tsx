// ||| /foundations — guidelines, accessibility, patterns and tokens
// Legacy focus IDs remain stable so existing links keep working.

import { lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { Accessibility, Compass, LayoutGrid, Palette, Shapes, Sparkles } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";

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

type FocusId = "manifesto" | "foundations" | "patterns" | "tokens";

interface SectionMeta {
  id: FocusId;
  icon: typeof Compass;
}

const SECTIONS: SectionMeta[] = [
  { id: "manifesto", icon: Compass },
  { id: "foundations", icon: Accessibility },
  { id: "patterns", icon: Shapes },
  { id: "tokens", icon: Palette },
];

export function FoundationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedFocus = (searchParams.get("focus") as FocusId | null) ?? "manifesto";
  const focus = SECTIONS.some((section) => section.id === requestedFocus)
    ? requestedFocus
    : "manifesto";
  const usesImmersiveBackground = focus === "manifesto" || focus === "patterns";

  const updateFocus = (next: FocusId) => {
    if (next === "manifesto") {
      searchParams.delete("focus");
    } else {
      searchParams.set("focus", next);
    }
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <div className={usesImmersiveBackground ? "bg-surface-immersive text-slate-200" : "text-slate-200"}>
      <div className="mx-auto w-full max-w-[1280px] px-6 pt-10 lg:px-10">
        <Hero />
        <SectionNav active={focus} onChange={updateFocus} />
      </div>

      {focus === "manifesto" ? (
        <div className="mt-4">
          <Suspense fallback={<SectionSkeleton immersive />}>
            <GuidelinesPage />
          </Suspense>
        </div>
      ) : focus === "foundations" ? (
        <div className="mt-4">
          <Suspense fallback={<SectionSkeleton immersive />}>
            <AccessibilityPage />
          </Suspense>
        </div>
      ) : (
        <div className="mx-auto mt-10 w-full max-w-[1280px] px-6 pb-10 lg:px-10">
          {focus === "patterns" ? (
            <Suspense fallback={<SectionSkeleton />}>
              <PatternsPage />
            </Suspense>
          ) : null}
          {focus === "tokens" ? (
            <Suspense fallback={<SectionSkeleton />}>
              <TokensPage />
            </Suspense>
          ) : null}
        </div>
      )}
    </div>
  );
}

function Hero() {
  const { t } = useI18n();

  return (
    <header className="page-hero">
      <div className="page-eyebrow">
        <LayoutGrid className="h-3.5 w-3.5" aria-hidden />
        {t("pages.foundations.eyebrow")}
      </div>
      <h1 className="page-h1">
        {t("pages.foundations.hero.titleLead")}{" "}
        <span className="page-h1-accent">{t("pages.foundations.hero.titleAccent")}</span>.
      </h1>
      <p className="max-w-3xl text-sm leading-relaxed text-slate-400">
        {t("pages.foundations.hero.description")}
      </p>
    </header>
  );
}

function SectionNav({ active, onChange }: { active: FocusId; onChange: (next: FocusId) => void }) {
  const { t } = useI18n();

  return (
    <nav aria-label={t("pages.foundations.navigationLabel")} className="flex flex-wrap gap-2">
      {SECTIONS.map((section) => {
        const Icon = section.icon;
        const isActive = section.id === active;

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onChange(section.id)}
            aria-pressed={isActive}
            className={isActive ? "section-tab-active" : "section-tab"}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
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

function SectionSkeleton({ immersive = false }: { immersive?: boolean }) {
  const { t } = useI18n();

  return (
    <div className={immersive ? "flex min-h-screen items-center justify-center" : "section-skeleton"}>
      <div className="section-skeleton-inner">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary" aria-hidden />
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
            {t("pages.foundations.loading")}
          </span>
        </div>
      </div>
    </div>
  );
}
