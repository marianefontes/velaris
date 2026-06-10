import { AlertTriangle, BrainCircuit, BriefcaseBusiness, Check, ChevronDown, Gauge, Target, UserRound, Wrench } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
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

          <details className="mt-3 rounded-xl border border-white/8 bg-white/[0.025]">
            <summary className="focus-ring flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              <span className="flex items-center gap-2">
                <UserRound aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
                {t("beatricePersona.profileTrigger")}
              </span>
              <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 text-slate-600" />
            </summary>

            <div className="max-h-[48vh] overflow-y-auto border-t border-white/8 p-3">
              <p className="text-xs leading-5 text-slate-400">{operationalProfile.specialty}</p>

              <div className="mt-3 grid gap-2 md:grid-cols-2">
                <ProfileBlock icon={<BriefcaseBusiness className="h-3.5 w-3.5" />} label={t("beatricePersona.principalResponsibility")}>
                  {operationalProfile.primaryResponsibility}
                </ProfileBlock>
                <ProfileBlock icon={<AlertTriangle className="h-3.5 w-3.5" />} label={t("beatricePersona.principalPain")}>
                  {operationalProfile.primaryPain}
                </ProfileBlock>
                <ProfileBlock icon={<BrainCircuit className="h-3.5 w-3.5" />} label={t("beatricePersona.cognitiveProfile")}>
                  {strategy.reasoningStyle}
                </ProfileBlock>
                <ProfileBlock icon={<Target className="h-3.5 w-3.5" />} label={t("beatricePersona.mainFocus")}>
                  {operationalProfile.mainFocus}
                </ProfileBlock>
              </div>

              <div className="mt-3 grid gap-3">
                <PillGroup icon={<Wrench className="h-3.5 w-3.5" />} label={t("beatricePersona.tools")} items={operationalProfile.tools} />
                <PillGroup icon={<Gauge className="h-3.5 w-3.5" />} label={t("beatricePersona.metricsPrioritized")} items={operationalProfile.prioritizedMetrics} />
                <PillGroup icon={<AlertTriangle className="h-3.5 w-3.5" />} label={t("beatricePersona.operationalFears")} items={operationalProfile.operationalFears} />
              </div>

              <div className="mt-3 rounded-xl border border-white/8 bg-black/15 p-3">
                <div className="flex items-center gap-2 text-primary">
                  <UserRound className="h-3.5 w-3.5" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em]">{t("beatricePersona.analysisStyleMentalStructure")}</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-400">{operationalProfile.communicationStyle}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {operationalProfile.mentalStructure.map((step, index) => (
                    <div key={step} className="rounded-lg border border-white/8 bg-white/[0.025] p-2.5">
                      <span className="font-mono text-[10px] text-primary">0{index + 1}</span>
                      <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-400">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

function ProfileBlock({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3">
      <div className="mb-2 flex items-center gap-2 text-primary">
        {icon}
        <p className="text-[10px] font-bold uppercase tracking-[0.16em]">{label}</p>
      </div>
      <p className="text-xs leading-5 text-slate-400">{children}</p>
    </div>
  );
}

function PillGroup({
  icon,
  label,
  items,
}: {
  icon: ReactNode;
  label: string;
  items: string[];
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-primary">
        {icon}
        <p className="text-[10px] font-bold uppercase tracking-[0.16em]">{label}</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-lg border border-white/8 bg-white/[0.025] px-2.5 py-1.5 text-[10px] text-slate-400"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
