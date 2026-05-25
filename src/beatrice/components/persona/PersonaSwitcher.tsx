import { usePersonaContext } from "../../hooks/usePersonaContext";

export function PersonaSwitcher() {
  const { options, profileId, toggleProfile } = usePersonaContext();

  return (
    <div className="mb-2 flex items-center gap-1.5">
      {options.map((profile) => {
        const Icon = profile.icon;
        const active = profileId === profile.id;
        return (
          <button
            key={profile.id}
            type="button"
            onClick={() => toggleProfile(profile.id)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
              active
                ? "border-primary/40 bg-primary/15 text-primary"
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
