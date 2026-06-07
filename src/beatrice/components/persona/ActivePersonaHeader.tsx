import { MessageSquareMore, RadioTower } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";

export function ActivePersonaHeader() {
  const { t } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();
  const Icon = strategy.icon;
  const operationalProfile = strategy.operationalProfile;

  return (
    <header className="grid gap-5 border-b border-white/5 pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
      <div className="max-w-3xl">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">{strategy.operationalMode}</p>
            <p className="mt-1 text-xs font-semibold text-primary">{strategy.status}</p>
          </div>
        </div>
        <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white lg:text-4xl">
          {strategy.sessionTitle}
        </h1>
        <p className="mt-3 text-sm font-semibold text-primary">
          {operationalProfile.fullName} · {operationalProfile.title}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-on-surface-variant">{operationalProfile.primaryResponsibility}</p>
        <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-500">{operationalProfile.operationalEnvironment}</p>
      </div>
      <div className="flex flex-wrap gap-2 lg:justify-end">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
          <RadioTower className="h-3.5 w-3.5" />
          {t("beatricePersona.activePersonaSession")}
        </div>
        <Link
          to="/oracle"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:border-primary/25 hover:text-white"
        >
          <MessageSquareMore className="h-3.5 w-3.5" />
          {t("beatricePersona.openContextualChat")}
        </Link>
      </div>
    </header>
  );
}
