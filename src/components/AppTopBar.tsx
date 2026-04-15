import { Search, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { localeOptions, useI18n } from "../i18n/I18nProvider";
import { appRoutes } from "../routes";

interface AppTopBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export function AppTopBar({ searchQuery, setSearchQuery }: AppTopBarProps) {
  const { locale, setLocale, t } = useI18n();
  const location = useLocation();
  const currentRoute = appRoutes.find((route) => route.path === location.pathname) ?? appRoutes[0];

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-background/75 backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-4 py-4 md:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface-variant">
              {t("shell.navEyebrow")}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="hyphens-auto text-2xl font-black tracking-tight text-white md:text-3xl">
                {t(currentRoute.labelKey)}
              </h2>
              <span className="signature-pill">{t(currentRoute.badgeKey)}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="glass-card flex min-w-[148px] items-center gap-1 rounded-full px-3 py-2">
              <span className="px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                {t("lang.label")}
              </span>
              <div className="flex items-center gap-1">
                {localeOptions.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => setLocale(option.code)}
                    title={option.label}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition ${
                      locale === option.code
                        ? "bg-primary/15 text-white ring-1 ring-primary/30"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span aria-hidden="true">{option.flag}</span>
                  </button>
                ))}
              </div>
            </div>
            <label className="glass-card flex min-w-[250px] flex-1 items-center gap-3 rounded-full px-4 py-3 xl:max-w-[420px]">
              <Search className="h-4 w-4 text-primary" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-on-surface-variant/60"
                placeholder={t("shell.searchPlaceholder")}
                type="text"
              />
            </label>
            <Link
              to="/beatrice-chat"
              className="glass-card inline-flex min-w-0 items-center gap-2 rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition hover:text-white"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hyphens-auto [overflow-wrap:anywhere]">{t("shell.beatriceChat")}</span>
            </Link>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {appRoutes.map((route) => {
            const active = route.path === location.pathname;

            return (
              <Link
                key={route.path}
                to={route.path}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                  active
                  ? "bg-primary text-on-primary"
                  : "glass-card text-on-surface-variant hover:text-white"
                }`}
              >
                <route.icon className="h-3.5 w-3.5" />
                <span className="hyphens-auto [overflow-wrap:anywhere]">{t(route.labelKey)}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
