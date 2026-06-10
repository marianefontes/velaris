import { usePersonaContext } from "../../hooks/usePersonaContext";
import { useI18n } from "../../../i18n/I18nProvider";

export function PersonaSwitcher({ variant = "compact" }: { variant?: "compact" | "workspace" }) {
  const { activePersonaContext: strategy, options, profileId, setProfileId } = usePersonaContext();
  const { t } = useI18n();

  if (variant === "workspace") {
    const ActiveIcon = strategy.icon;

    return (
      <aside className="rounded-2xl border border-white/10 bg-white/[0.025] p-3 backdrop-blur-2xl">
        <div className="mb-3 rounded-xl border border-white/8 bg-black/15 p-3">
          <div className="mb-2 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035]">
              <ActiveIcon className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-white">{strategy.label}</p>
              <p className="mt-0.5 truncate text-[10px] uppercase tracking-[0.14em] text-slate-500">{strategy.role}</p>
            </div>
          </div>
          <p className="text-[11px] leading-5 text-slate-500">{strategy.operationalMode}</p>
        </div>

        <div className="space-y-1" aria-label={t("beatricePersona.perspectiveSelector")}>
          {options.map((profile) => {
            const Icon = profile.icon;
            const active = profileId === profile.id;

            return (
              <button
                key={profile.id}
                type="button"
                onClick={() => setProfileId(profile.id)}
                className={`grid w-full grid-cols-[1.75rem_1fr_auto] items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-colors ${
                  active
                    ? "border-primary/20 bg-primary/10"
                    : "border-white/8 bg-white/[0.025] hover:border-white/18 hover:bg-white/[0.045]"
                }`}
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded-lg border ${active ? "border-primary/20 bg-primary/10" : "border-white/8 bg-white/[0.035]"}`}>
                  <Icon className={`h-3.5 w-3.5 ${active ? "text-primary" : "text-slate-500"}`} />
                </span>
                <span className="min-w-0">
                  <span className={`block text-xs font-bold ${active ? "text-white" : "text-slate-300"}`}>{profile.label}</span>
                  <span className="block truncate text-[10px] text-slate-600">{profile.operationalMode}</span>
                </span>
                <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-primary" : "bg-white/10"}`} />
              </button>
            );
          })}
        </div>
      </aside>
    );
  }

  return (
    <div className="mb-2 flex flex-wrap items-center gap-1.5">
      {options.map((profile) => {
        const Icon = profile.icon;
        const active = profileId === profile.id;
        return (
          <button
            key={profile.id}
            type="button"
            onClick={() => setProfileId(profile.id)}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-colors ${
              active
                ? "border-primary/20 bg-primary/10 text-primary"
                : "border-white/10 bg-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300"
            }`}
          >
            <Icon className="h-3 w-3" />
            {profile.label}
          </button>
        );
      })}
    </div>
  );
}
