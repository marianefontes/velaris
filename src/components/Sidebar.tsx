import { Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import { appRoutes } from "../routes";

interface SidebarProps {
  searchQuery: string;
}

export function Sidebar({ searchQuery }: SidebarProps) {
  const { t } = useI18n();
  const location = useLocation();
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredRoutes = appRoutes.filter((route) => {
    const searchableText = [
      t(route.labelKey),
      t(route.badgeKey),
      route.label,
      route.path.replace("/", "").replace(/-/g, " "),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });

  return (
    <aside className="group/sidebar hidden w-[88px] flex-col border-r border-white/10 bg-background/80 px-4 py-8 backdrop-blur-3xl transition-[width,padding] duration-300 ease-out hover:w-64 hover:px-6 lg:flex">
      <div className="mb-10 flex flex-col items-center overflow-hidden group-hover/sidebar:items-start">
        <img
          alt="Aetheris"
          className="h-12 w-12 shrink-0 object-contain drop-shadow-[0_0_22px_rgba(194,160,252,0.35)] transition-all duration-300 ease-out group-hover/sidebar:h-16 group-hover/sidebar:w-16"
          src="/aetheris.png"
        />
        <div className="mt-4 h-0 w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover/sidebar:h-auto group-hover/sidebar:w-44 group-hover/sidebar:opacity-100">
          <h1 className="text-xl font-black tracking-[0.35em] text-primary">AETHERIS</h1>
          <p className="mt-2 whitespace-nowrap text-[10px] uppercase tracking-[0.24em] text-slate-500">
            {t("shell.sidebarSubtitle")}
          </p>
        </div>
      </div>

      <nav className="space-y-1">
        {filteredRoutes.map((route) => {
          const { path, icon: Icon } = route;
          const active = location.pathname === path;
          const translatedLabel = t(route.labelKey);

          return (
            <Link
              key={path}
              to={path}
              className={`flex w-full items-center justify-center overflow-hidden rounded-2xl px-0 py-3 text-left text-sm transition group-hover/sidebar:justify-start group-hover/sidebar:px-3 ${
                active
                  ? "bg-white/5 font-semibold text-primary shadow-panel"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                <Icon className="h-4 w-4" />
              </span>
              <span className="w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover/sidebar:ml-3 group-hover/sidebar:w-36 group-hover/sidebar:opacity-100">
                {translatedLabel}
              </span>
            </Link>
          );
        })}
        {filteredRoutes.length === 0 ? (
          <div className="overflow-hidden px-3 py-4">
            <p className="w-0 overflow-hidden whitespace-nowrap text-xs text-slate-500 opacity-0 transition-all duration-300 group-hover/sidebar:w-40 group-hover/sidebar:opacity-100">
              {t("shell.sidebarEmpty")}
            </p>
          </div>
        ) : null}
      </nav>

      <div className="mt-auto overflow-hidden glass-card rounded-[24px] p-3 transition-all duration-300 group-hover/sidebar:p-4">
        <div className="mb-0 flex items-center justify-center gap-0 group-hover/sidebar:mb-3 group-hover/sidebar:justify-start group-hover/sidebar:gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-signature text-on-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover/sidebar:w-36 group-hover/sidebar:opacity-100">
            <p className="text-sm font-bold text-white">{t("shell.sidebarCardTitle")}</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
              {t("shell.sidebarCardStatus")}
            </p>
          </div>
        </div>
        <p className="h-0 overflow-hidden text-xs leading-relaxed text-on-surface-variant opacity-0 transition-all duration-300 group-hover/sidebar:h-20 group-hover/sidebar:opacity-100">
          {t("shell.sidebarCardText")}
        </p>
      </div>
    </aside>
  );
}
