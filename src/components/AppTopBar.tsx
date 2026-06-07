// ||| Global header — two-layer glass navigation
// Layer 1: identity (logo + name + subtitle) + search (⌘K) + locale + chat CTA + persona
// Layer 2: primary navigation chips with active underline glow

import { ChevronDown, Globe, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PersonaProfileMenu } from "../beatrice/components/persona/PersonaProfileMenu";
import { localeOptions, useI18n } from "../i18n/I18nProvider";
import { appRoutes } from "../routes";

interface AppTopBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  hideLaboratory: boolean;
  laboratoryUnread?: number;
}

// ─── Locale selector (globe + short code + dropdown) ─────────────────────
function LocaleSelector() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);

  const shortLabel = locale.split("-")[0].toUpperCase(); // pt-BR → PT, en-US → EN

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="glass-card flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-white/15 hover:text-white"
      >
        <Globe className="h-3.5 w-3.5 text-slate-400" />
        <span className="tracking-wide">{shortLabel}</span>
        <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          {/* backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 min-w-[100px] overflow-hidden rounded-xl border border-white/10 bg-surface-container-highest/95 py-1 shadow-panel backdrop-blur-2xl">
            {localeOptions.map((option) => (
              <button
                key={option.code}
                type="button"
                onClick={() => { setLocale(option.code); setOpen(false); }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
                  locale === option.code
                    ? "text-primary bg-primary/8 font-semibold"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{option.flag}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────
export function AppTopBar({
  searchQuery,
  setSearchQuery,
  hideLaboratory,
  laboratoryUnread = 0,
}: AppTopBarProps) {
  const { t } = useI18n();
  const location = useLocation();
  const visibleRoutes = hideLaboratory
    ? appRoutes.filter((route) => route.path !== "/laboratory")
    : appRoutes;

  return (
    <header className="sticky top-0 z-30 flex flex-col gap-2 bg-background/70 px-4 py-3 backdrop-blur-xl md:px-6">

      {/* ── Layer 1: Identity + global actions ───────────────────── */}
      <div className="glass-card relative z-[2] flex items-center gap-3 rounded-2xl px-4 py-3 md:gap-4 md:px-5">

        {/* Logo + wordmark */}
        <Link to="/main" className="flex shrink-0 items-center gap-3">
          <img
            src="/aetheris.png"
            alt="Aetheris"
            className="h-9 w-9 object-contain drop-shadow-[0_0_14px_rgba(194,160,252,0.5)]"
          />
          <div className="hidden flex-col sm:flex">
            <span className="text-sm font-black tracking-[0.28em] text-white">AETHERIS</span>
            <span className="text-[9px] font-semibold tracking-[0.22em] text-slate-500">ORACLE INTELLIGENCE</span>
          </div>
        </Link>

        {/* Separator */}
        <div className="hidden h-8 w-px bg-white/[0.08] sm:block" />

        {/* Search — grows to fill available space */}
        <label className="glass-card flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2 transition-all focus-within:border-primary/25 focus-within:shadow-[0_0_0_1px_rgba(194,160,252,0.12)]">
          <Search className="h-3.5 w-3.5 shrink-0 text-primary/50" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
            placeholder={t("shell.searchPlaceholder")}
            type="text"
          />
          {/* ⌘K shortcut hint */}
          <kbd className="hidden shrink-0 items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 sm:flex">
            <span>⌘</span><span>K</span>
          </kbd>
        </label>

        {/* Locale selector */}
        <LocaleSelector />

        {/* Chat da Beatrice CTA */}
        <Link
          to="/oracle"
          className="oracle-cta hidden shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] md:inline-flex"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>{t("shell.beatriceChat")}</span>
        </Link>

        {/* Persona / account */}
        <PersonaProfileMenu />
      </div>

      {/* ── Layer 2: Primary navigation ──────────────────────────── */}
      <div className="glass-card rounded-2xl px-3 py-2">
        <nav
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
                    ? `${t(route.labelKey)} · ${laboratoryUnread} não lidas`
                    : undefined
                }
                className={`relative inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.11em] transition-all duration-200 lg:min-w-0 lg:px-1.5 ${
                  active
                    ? "bg-primary/[0.12] text-white shadow-[inset_0_0_0_1px_rgba(194,160,252,0.18)]"
                    : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${active ? "text-primary" : ""}`} />
                <span>
                  {t(route.labelKey)}
                  {route.path === "/laboratory" && laboratoryUnread > 0
                    ? ` · ${laboratoryUnread}`
                    : ""}
                </span>

                {/* Active underline glow */}
                {active && (
                  <span
                    className="absolute bottom-0 left-1/2 h-px w-3/4 -translate-x-1/2 rounded-full"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(194,160,252,0.7), transparent)",
                      boxShadow: "0 0 6px 1px rgba(194,160,252,0.35)",
                    }}
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
