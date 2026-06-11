import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";

export function PersonaProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { t } = useI18n();
  const { activePersonaContext: strategy, options, profileId, setProfileId } = usePersonaContext();
  const ActiveIcon = strategy.icon;
  const operationalProfile = strategy.operationalProfile;

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
        onClick={() => setOpen((current) => !current)}
        className="focus-ring glass-card inline-flex min-h-11 max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1.5 text-left transition-colors hover:border-white/18 hover:bg-white/[0.055]"
        aria-label={t(open ? "beatricePersona.closeProfileMenu" : "beatricePersona.openProfileMenu", {
          profile: strategy.label,
        })}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
          <ActiveIcon aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
        </span>
        <span className="hidden min-w-0 lg:block">
          <span className="block truncate text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">{t("beatricePersona.profileTrigger")}</span>
          <span className="block max-w-[10rem] truncate text-[11px] font-black text-white">{strategy.label}</span>
        </span>
        <ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={t("beatricePersona.perspectiveSelector")}
          className="absolute right-0 z-50 mt-2 w-[31rem] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-white/10 bg-surface-container-highest/95 p-3 shadow-panel backdrop-blur-2xl"
        >
          <div className="flex items-start gap-3 border-b border-white/8 pb-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
              <ActiveIcon aria-hidden="true" className="h-4 w-4 text-primary" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{t("beatricePersona.activeSpecialization")}</p>
              <h2 className="mt-1 truncate text-sm font-black text-white">{strategy.label}</h2>
              <p className="mt-1 text-[11px] leading-5 text-slate-300">{t("beatricePersona.beatricePerspective")} · {operationalProfile.title}</p>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            {options.map((profile) => {
              const Icon = profile.icon;
              const active = profile.id === profileId;

              return (
                <button
                  key={profile.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => {
                    setProfileId(profile.id);
                    setOpen(false);
                    window.requestAnimationFrame(() => triggerRef.current?.focus());
                  }}
                  className={`focus-ring grid min-h-11 w-full grid-cols-[1.75rem_1fr_auto] items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-colors ${
                    active
                      ? "border-primary/20 bg-primary/10"
                      : "border-transparent hover:border-white/10 hover:bg-white/[0.04]"
                  }`}
                >
                  <span className={`flex h-7 w-7 items-center justify-center rounded-lg border ${active ? "border-primary/20 bg-primary/10" : "border-white/8 bg-white/[0.035]"}`}>
                    <Icon aria-hidden="true" className={`h-3.5 w-3.5 ${active ? "text-primary" : "text-slate-400"}`} />
                  </span>
                  <span className="min-w-0">
                    <span className={`block truncate text-xs font-bold ${active ? "text-white" : "text-slate-300"}`}>{profile.label}</span>
                    <span className="mt-0.5 block truncate text-[11px] text-slate-400">{profile.operationalProfile.specialty}</span>
                  </span>
                  {active && <Check aria-hidden="true" className="h-3.5 w-3.5 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
