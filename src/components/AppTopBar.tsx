// ||| Global header : two-layer glass navigation
// Layer 1: identity (logo + name + subtitle) + search (⌘K) + locale + chat CTA + persona
// Layer 2: primary navigation chips with active underline glow

import { ChevronDown, Globe, Sparkles } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PersonaProfileMenu } from "../beatrice/components/persona/PersonaProfileMenu";
import { GlobalSearch } from "./GlobalSearch";
import { localeOptions, useI18n } from "../i18n/I18nProvider";
import { appRoutes } from "../routes";

interface AppTopBarProps {
  hideLaboratory: boolean;
  laboratoryUnread?: number;
}

// ─── Locale selector (globe + short code + dropdown) ─────────────────────
function LocaleSelector() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const shortLabel = locale.split("-")[0].toUpperCase(); // pt-BR → PT, en-US → EN

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("shell.localeSelectorAria")}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        className="focus-ring glass-card flex min-h-11 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-white/15 hover:text-white"
      >
        <Globe aria-hidden="true" className="h-3.5 w-3.5 text-slate-300" />
        <span className="tracking-wide">{shortLabel}</span>
        <ChevronDown aria-hidden="true" className={`h-3 w-3 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
          <div
            id={menuId}
            role="menu"
            aria-label={t("shell.localeSelectorAria")}
            className="absolute right-0 z-50 mt-2 min-w-[9rem] overflow-hidden rounded-xl border border-white/10 bg-surface-container-highest/95 py-1 shadow-panel backdrop-blur-2xl"
          >
            {localeOptions.map((option) => (
              <button
                key={option.code}
                type="button"
                role="menuitemradio"
                aria-checked={locale === option.code}
                onClick={() => {
                  setLocale(option.code);
                  setOpen(false);
                  window.requestAnimationFrame(() => triggerRef.current?.focus());
                }}
                className={`focus-ring flex min-h-11 w-full items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
                  locale === option.code
                    ? "text-primary bg-primary/8 font-semibold"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span aria-hidden="true" className="font-mono text-[10px] text-slate-400">{option.code.split("-")[1]}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
      )}
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────
export function AppTopBar({
  hideLaboratory,
  laboratoryUnread = 0,
}: AppTopBarProps) {
  const { t } = useI18n();
  const location = useLocation();
  const oracleActive = location.pathname === "/oracle" || location.pathname.startsWith("/oracle/");
  const navRef = useRef<HTMLElement>(null);
  const visibleRoutes = hideLaboratory
    ? appRoutes.filter((route) => route.path !== "/laboratory")
    : appRoutes;

  useEffect(() => {
    const nav = navRef.current;
    const activeItem = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !activeItem || nav.scrollWidth <= nav.clientWidth) return;

    const targetLeft = activeItem.offsetLeft - (nav.clientWidth - activeItem.clientWidth) / 2;
    nav.scrollTo({ left: Math.max(0, targetLeft), behavior: "auto" });
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-30 flex flex-col gap-1.5 border-b border-white/[0.045] bg-background/80 px-3 py-2 backdrop-blur-xl sm:px-4 md:px-6">

      {/* ── Layer 1: Identity + global actions ───────────────────── */}
      <div className="glass-card relative z-[2] flex min-w-0 max-w-full items-center gap-2.5 rounded-xl px-3 py-2.5 md:gap-4 md:px-4">

        {/* Logo + wordmark */}
        <Link to="/main" className="focus-ring flex min-h-11 shrink-0 items-center gap-3 rounded-lg">
          <img
            src="/aetheris.png"
            alt="Velaris"
            width="32"
            height="32"
            className="h-8 w-8 object-contain"
          />
          <div className="hidden flex-col sm:flex">
            <span className="text-xs font-bold tracking-[0.25em] text-white">VELARIS</span>
            <span className="text-[9px] font-semibold tracking-[0.18em] text-slate-400">ORACLE INTELLIGENCE</span>
          </div>
        </Link>

        {/* Separator */}
        <div className="hidden h-8 w-px bg-white/[0.08] sm:block" />

        {/* Search : grows to fill available space */}
        <GlobalSearch />

        {/* Locale selector */}
        <LocaleSelector />

        {/* Primary oracle CTA */}
        <Link
          to="/oracle"
          aria-label={t("shell.beatriceChat")}
          aria-current={oracleActive ? "page" : undefined}
          className={`focus-ring oracle-cta inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] md:px-3.5 ${
            oracleActive ? "oracle-cta-active" : ""
          }`}
        >
          <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
          <span className="hidden md:inline">{t("shell.beatriceChat")}</span>
        </Link>

        {/* Persona / account */}
        <PersonaProfileMenu />
      </div>

      {/* ── Layer 2: Primary navigation ──────────────────────────── */}
      <div className="mobile-nav-fade glass-card rounded-xl px-2 py-1.5">
        <nav
          ref={navRef}
          aria-label={t("shell.primaryNavigation")}
          className={`flex justify-start gap-1 overflow-x-auto lg:grid lg:overflow-visible ${
            visibleRoutes.length === 9 ? "lg:grid-cols-9" : "lg:grid-cols-8"
          }`}
        >
          {visibleRoutes.map((route) => {
            const active =
              route.path === location.pathname || location.pathname.startsWith(`${route.path}/`);
            const Icon = route.icon;

            return (
              <Link
                key={route.path}
                to={route.path}
                aria-label={
                  route.path === "/laboratory" && laboratoryUnread > 0
                    ? t("shell.laboratoryUnread", {
                        label: t(route.labelKey),
                        count: laboratoryUnread,
                      })
                    : undefined
                }
                aria-current={active ? "page" : undefined}
                className={`focus-ring relative inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] transition-[background-color,color,transform] duration-200 active:translate-y-px lg:min-w-0 lg:px-1.5 ${
                  active
                    ? "bg-primary/[0.09] text-white shadow-[inset_0_0_0_1px_rgba(222,204,253,0.15)]"
                    : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon aria-hidden="true" className={`h-3.5 w-3.5 ${active ? "text-primary" : ""}`} />
                <span>
                  {t(route.labelKey)}
                  {route.path === "/laboratory" && laboratoryUnread > 0
                    ? ` · ${laboratoryUnread}`
                    : ""}
                </span>

                {/* Active underline glow */}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-1/2 h-px w-1/2 -translate-x-1/2 rounded-full bg-primary/70"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Hairline accent below header */}
      <div className="topbar-accent" />
    </header>
  );
}
