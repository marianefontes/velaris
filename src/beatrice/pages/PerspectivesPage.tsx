// ||| /perspectives : identity gallery + cognitive architecture (two sections).

import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { BriefcaseBusiness, Compass, ScanLine, Target, Telescope, UserRound, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { PageHero, PageShell } from "../../components/ui/VisualPrimitives";
import { normalizeProfileId } from "../domain/perspective/profileIds";
import { usePersonaContext } from "../hooks/usePersonaContext";
import { PerspectivesCognitionSection } from "./PerspectivesCognitionSection";
import { shortLabel, ZoneShell } from "./perspectivePageShared";
import type { PersonaStrategy, ProfileId } from "../types/beatrice";

type FocusId = "identity" | "cognition";

interface SectionMeta {
  id: FocusId;
  icon: LucideIcon;
}

const SECTIONS: SectionMeta[] = [
  { id: "identity", icon: Telescope },
  { id: "cognition", icon: ScanLine },
];

export function PerspectivesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { profileId, setProfileId, options, activePersonaContext: activePersona } = usePersonaContext();
  const focus: FocusId = searchParams.get("focus") === "cognition" ? "cognition" : "identity";

  useEffect(() => {
    const requestedProfile = normalizeProfileId(searchParams.get("profile"));
    if (requestedProfile && requestedProfile !== "general" && requestedProfile !== profileId) {
      setProfileId(requestedProfile);
    }
  }, [profileId, searchParams, setProfileId]);

  const personas = useMemo(() => options.filter((option) => option.id !== "general"), [options]);

  const updateFocus = (next: FocusId) => {
    const params = new URLSearchParams(searchParams);
    if (next === "identity") {
      params.delete("focus");
    } else {
      params.set("focus", next);
    }
    setSearchParams(params, { replace: true });
  };

  return (
    <PageShell>
      <HeroZone />
      <PerspectiveModeSwitcher active={focus} onChange={updateFocus} />

      <div
        id={`perspectives-panel-${focus}`}
        role="tabpanel"
        aria-labelledby={`perspectives-tab-${focus}`}
        tabIndex={0}
        className="mt-8 scroll-mt-28 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:mt-10"
      >
        {focus === "identity" ? (
          <IdentitySection
            persona={activePersona}
            personas={personas}
            activeId={profileId}
            onSelect={setProfileId}
            onJumpToCognition={() => updateFocus("cognition")}
          />
        ) : (
          <PerspectivesCognitionSection />
        )}
      </div>
    </PageShell>
  );
}

function PerspectiveModeSwitcher({ active, onChange }: { active: FocusId; onChange: (next: FocusId) => void }) {
  const { t } = useI18n();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const sectionHighlight = "font-medium text-primary/90";

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % SECTIONS.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + SECTIONS.length) % SECTIONS.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = SECTIONS.length - 1;
    else return;

    event.preventDefault();
    onChange(SECTIONS[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  const columns: Array<{
    id: FocusId;
    glyph: LucideIcon;
    body: ReactNode;
  }> = [
    {
      id: "identity",
      glyph: UserRound,
      body: (
        <p className="text-[15px] leading-[1.65] text-slate-300">
          {t("perspectives.preamble.concept")}
        </p>
      ),
    },
    {
      id: "cognition",
      glyph: Compass,
      body: (
        <p className="text-sm leading-[1.7] text-slate-400">
          {t("perspectives.preamble.usageIn")}{" "}
          <span className={sectionHighlight}>{t("perspectives.sections.identity.label")}</span>
          {t("perspectives.preamble.usageChoose")}{" "}
          <span className={sectionHighlight}>{t("perspectives.sections.cognition.label")}</span>
          {t("perspectives.preamble.usageUnderstand")}
        </p>
      ),
    },
  ];

  return (
    <nav
      aria-label={t("perspectives.sections.navAria")}
      role="tablist"
      className="mode-switcher-grid"
    >
      {columns.map((column, index) => {
        const section = SECTIONS.find((entry) => entry.id === column.id)!;
        const Icon = section.icon;
        const isActive = section.id === active;

        return (
          <div key={column.id} className="mode-switcher-column">
            <div className="flex gap-3.5">
              <PreambleGlyph icon={column.glyph} />
              <div className="min-w-0">{column.body}</div>
            </div>
            <button
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`perspectives-tab-${section.id}`}
              type="button"
              onClick={() => onChange(section.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`perspectives-panel-${section.id}`}
              tabIndex={isActive ? 0 : -1}
              className={`${isActive ? "section-tab-active" : "section-tab"} section-tab-card focus-ring`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span className="section-tab-label">{t(`perspectives.sections.${section.id}.label`)}</span>
              <span className="section-tab-role">{t(`perspectives.sections.${section.id}.role`)}</span>
            </button>
          </div>
        );
      })}
    </nav>
  );
}

function PreambleGlyph({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span
      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.02] text-slate-500"
      aria-hidden
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
    </span>
  );
}

function HeroZone() {
  const { t } = useI18n();
  return (
    <PageHero
      eyebrow={
        <>
          <Telescope className="h-3.5 w-3.5" aria-hidden />
          {t("perspectives.hero.eyebrow")}
        </>
      }
      title={
        <>
          {t("perspectives.hero.titlePrefix")}{" "}
          <em className="not-italic text-primary">{t("perspectives.hero.titleEm")}</em>.
        </>
      }
    />
  );
}

function IdentitySection({
  persona,
  personas,
  activeId,
  onSelect,
  onJumpToCognition,
}: {
  persona: PersonaStrategy;
  personas: PersonaStrategy[];
  activeId: ProfileId;
  onSelect: (id: ProfileId) => void;
  onJumpToCognition: () => void;
}) {
  return (
    <>
      <ActivePersonaBar persona={persona} onJumpToCognition={onJumpToCognition} />
      <PersonaSelectorGrid personas={personas} activeId={activeId} onSelect={onSelect} />
      <PersonaIdentityDetail persona={persona} />
    </>
  );
}

function ActivePersonaBar({
  persona,
  onJumpToCognition,
}: {
  persona: PersonaStrategy;
  onJumpToCognition: () => void;
}) {
  const { t } = useI18n();
  return (
    <div
      className={`mb-10 flex flex-col gap-3 rounded-2xl border sm:flex-row sm:items-center sm:justify-between ${persona.theme.accentBorder} ${persona.theme.accentBg} px-5 py-3.5`}
      role="status"
      aria-live="polite"
      aria-label={t("perspectives.activeLens.status")}
    >
      <div className="flex min-w-0 items-center gap-4">
        <span className={`text-[10px] font-bold uppercase tracking-[0.28em] ${persona.theme.accentText}`}>
          {t("perspectives.activeLens.label")}
        </span>
        <span className="hidden h-4 w-px bg-white/15 sm:block" />
        <span className={`truncate text-sm font-semibold ${persona.theme.accentText}`}>
          {shortLabel(persona.label)}
        </span>
        <span className="hidden truncate text-xs text-slate-500 lg:block">· {persona.role}</span>
      </div>
      <button
        type="button"
        onClick={onJumpToCognition}
        className="focus-ring inline-flex items-center gap-1.5 self-start rounded-full border border-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-300 transition-colors hover:border-white/30 hover:text-white sm:self-auto"
      >
        <ScanLine className="h-3 w-3" aria-hidden />
        {t("perspectives.identity.cognitionCta")}
      </button>
    </div>
  );
}

function PersonaSelectorGrid({
  personas,
  activeId,
  onSelect,
}: {
  personas: PersonaStrategy[];
  activeId: ProfileId;
  onSelect: (id: ProfileId) => void;
}) {
  const { t } = useI18n();
  return (
    <ZoneShell
      eyebrow={t("perspectives.selector.eyebrow")}
      title={t("perspectives.selector.title")}
      caption={t("perspectives.selector.caption")}
    >
      <div
        role="radiogroup"
        aria-label={t("perspectives.selector.ariaLabel")}
        data-abraxos-focus="perspective-lens"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {personas.map((persona) => {
          const isActive = persona.id === activeId;
          const Icon = persona.icon;
          return (
            <button
              key={persona.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onSelect(persona.id)}
              className={`focus-ring flex flex-col rounded-2xl border p-4 text-left transition-colors ${
                isActive
                  ? `${persona.theme.accentBorder} ${persona.theme.accentBg}`
                  : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
              }`}
            >
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                    isActive ? `${persona.theme.accentBorder} ${persona.theme.accentBg}` : "border-white/10 bg-white/[0.04]"
                  }`}
                >
                  <Icon aria-hidden className={`h-4 w-4 ${isActive ? persona.theme.accentText : "text-slate-400"}`} />
                </span>
                {isActive ? (
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${persona.theme.accentText}`}>
                    {t("perspectives.identity.activeBadge")}
                  </span>
                ) : null}
              </div>
              <span className={`text-sm font-semibold ${isActive ? persona.theme.accentText : "text-slate-200"}`}>
                {shortLabel(persona.label)}
              </span>
              <span className="mt-0.5 text-xs text-slate-500">{persona.role}</span>
              <span className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-400">
                {persona.identityStatement}
              </span>
            </button>
          );
        })}
      </div>
    </ZoneShell>
  );
}

function PersonaIdentityDetail({ persona }: { persona: PersonaStrategy }) {
  const { t } = useI18n();
  const profile = persona.operationalProfile;

  return (
    <ZoneShell
      eyebrow={t("perspectives.identity.detailEyebrow")}
      title={shortLabel(persona.label)}
      caption={profile.specialty}
    >
      <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]">
        <div className="border-b border-white/8 px-5 py-4">
          <p className="text-sm leading-relaxed text-slate-300">{persona.identityStatement}</p>
        </div>

        <div className="grid gap-px bg-white/8 md:grid-cols-2">
          <IdentityField
            icon={<BriefcaseBusiness className="h-3.5 w-3.5" />}
            label={t("beatricePersona.principalResponsibility")}
            value={profile.primaryResponsibility}
          />
          <IdentityField
            icon={<Target className="h-3.5 w-3.5" />}
            label={t("beatricePersona.principalPain")}
            value={profile.primaryPain}
          />
          <IdentityField
            icon={<ScanLine className="h-3.5 w-3.5" />}
            label={t("beatricePersona.cognitiveProfile")}
            value={persona.reasoningStyle}
          />
          <IdentityField
            icon={<Target className="h-3.5 w-3.5" />}
            label={t("beatricePersona.mainFocus")}
            value={profile.mainFocus}
          />
        </div>

        <div className="border-t border-white/8 p-5">
          <IdentityPillGroup
            icon={<Wrench className="h-3.5 w-3.5" />}
            label={t("beatricePersona.tools")}
            items={profile.tools}
          />
        </div>

        <div className="border-t border-white/8 p-5">
          <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            {t("perspectives.identity.analysisExample")}
          </h3>
          <p className="rounded-xl border border-white/8 bg-black/20 px-4 py-3 font-mono text-xs leading-relaxed text-slate-300">
            {persona.examples[0]}
          </p>
        </div>

        <div className="border-t border-white/8 p-5">
          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            {t("perspectives.identity.limitations")}
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-400">
            {profile.operationalFears.map((fear) => (
              <li key={fear} className="flex items-start gap-2">
                <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${persona.theme.signal}`} aria-hidden />
                <span>{fear}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ZoneShell>
  );
}

function IdentityField({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white/[0.02] p-5">
      <div className="mb-2 flex items-center gap-2 text-primary">
        {icon}
        <p className="text-[10px] font-bold uppercase tracking-[0.16em]">{label}</p>
      </div>
      <p className="text-xs leading-relaxed text-slate-400">{value}</p>
    </div>
  );
}

function IdentityPillGroup({
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
