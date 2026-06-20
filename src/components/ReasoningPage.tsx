// ||| Phase IB · /reasoning : cognitive pipeline surface
// Public documentation for Abraxos, the Evidence Weaver, capabilities, and the
// end-to-end cognitive pipeline.

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { useLocation, useSearchParams, Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import { getReasoningPageContent } from "../i18n/pages/reasoningPage";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Blocks,
  BookOpenCheck,
  BrainCircuit,
  ChevronDown,
  Code2,
  Compass,
  Database,
  FileCheck2,
  Filter,
  Gauge,
  HeartPulse,
  History,
  Layers,
  Lightbulb,
  Link2,
  Network,
  PackageSearch,
  Palette,
  Scale,
  ShieldCheck,
  Sparkles,
  Search,
  Telescope,
  Users,
  Wrench,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  AUTOMATIC_SKILLS,
  COMMAND_ICONS,
  ORACLE_COMMANDS,
} from "../beatrice/domain/governance";
import type { CapabilityDefinition } from "../beatrice/domain/governance";
import type { CognitiveFlowStep } from "../types/oracle";
import { CognitiveFlow } from "./oracle/CognitiveFlow";
import { PageHero, PageShell, SectionIntroHeader } from "./ui/VisualPrimitives";

// ──────────────────────────────────────────────────────────────────────────
// Section model
// ──────────────────────────────────────────────────────────────────────────

type FocusId = "overview" | "weaver" | "skills" | "commands" | "pipeline";

interface SectionMeta {
  id: FocusId;
  label: string;
  role: string;
  icon: typeof BrainCircuit;
}

const SECTIONS: SectionMeta[] = [
  { id: "overview", label: "Overview", role: "Abraxos cognition", icon: Sparkles },
  { id: "weaver", label: "Evidence Weaver", role: "Evidence orchestration", icon: Network },
  { id: "skills", label: "Habilidades do Abraxos", role: "Ativação automática", icon: Lightbulb },
  { id: "commands", label: "Comandos do Oráculo", role: "Ativação manual", icon: Wrench },
  { id: "pipeline", label: "Pipeline", role: "9 stages", icon: Workflow },
];

// ──────────────────────────────────────────────────────────────────────────
// Intelligence data : from IntelligencePage (merged here per spec)
// ──────────────────────────────────────────────────────────────────────────

const CAPABILITY_ICONS: Record<string, LucideIcon> = {
  "pattern-exploration": Telescope,
  "architecture-analysis": Layers,
  "interaction-guardrail": ShieldCheck,
  "design-system-governance-check": FileCheck2,
  "component-fit-analysis": PackageSearch,
  "component-misuse-detection": AlertTriangle,
  "token-impact-analysis": Palette,
  "design-to-code-contract-check": Code2,
  "implementation-planning": Workflow,
  "trade-off-analysis": Scale,
  "systems-thinking": Network,
  "risk-assessment": Gauge,
  memory: COMMAND_ICONS.memory,
  decision: COMMAND_ICONS.decision,
  perspectives: COMMAND_ICONS.perspectives,
  audit: COMMAND_ICONS.audit,
  "knowledge-gap": COMMAND_ICONS["knowledge-gap"],
  governance: COMMAND_ICONS.governance,
  health: COMMAND_ICONS.health,
  "governance-impact": COMMAND_ICONS["governance-impact"],
  simulate: COMMAND_ICONS.simulate,
  "principle-conflict": COMMAND_ICONS["principle-conflict"],
  "adoption-friction": COMMAND_ICONS["adoption-friction"],
  "oracle-council": COMMAND_ICONS["oracle-council"],
  enforce: COMMAND_ICONS.enforce,
  migrate: COMMAND_ICONS.migrate,
  capture: COMMAND_ICONS.capture,
  document: COMMAND_ICONS.document,
  "token-impact": COMMAND_ICONS["token-impact"],
  "contract-check": COMMAND_ICONS["contract-check"],
  "feedback-review": FileCheck2,
};

const FLOW_IDS = [
  "question",
  "intent",
  "skill",
  "retrieval",
  "attribution",
  "calibration",
  "synthesis",
  "answer",
] as const;

// ──────────────────────────────────────────────────────────────────────────
// Page root
// ──────────────────────────────────────────────────────────────────────────

const COMMAND_SECTION_HASHES = new Set([
  "comandos-do-oraculo",
  "comandos-operacional",
  "comandos-investigativo",
]);

export function ReasoningPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedFocus = searchParams.get("focus");
  const hashFocus = COMMAND_SECTION_HASHES.has(location.hash.replace("#", "")) ? "commands" : null;
  const focus = requestedFocus === "engines"
    ? "commands"
    : (requestedFocus as FocusId | null) ?? hashFocus ?? "overview";
  const active = SECTIONS.find((section) => section.id === focus) ?? SECTIONS[0];

  const updateFocus = (next: FocusId) => {
    if (next === "overview") {
      searchParams.delete("focus");
      setSearchParams(searchParams, { replace: true });
    } else {
      searchParams.set("focus", next);
      setSearchParams(searchParams, { replace: true });
    }
  };

  return (
    <PageShell>
      <Hero />
      <SectionNav active={active.id} onChange={updateFocus} />

      <div
        id={`reasoning-panel-${active.id}`}
        role="tabpanel"
        aria-labelledby={`reasoning-tab-${active.id}`}
        tabIndex={0}
        className="mt-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {active.id === "overview" ? <OverviewSection onJump={updateFocus} /> : null}
        {active.id === "weaver" ? <EvidenceWeaverSection /> : null}
        {active.id === "skills" ? <SkillsSection /> : null}
        {active.id === "commands" ? <CommandsSection /> : null}
        {active.id === "pipeline" ? <PipelineSection /> : null}
      </div>
    </PageShell>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Hero
// ──────────────────────────────────────────────────────────────────────────

function Hero() {
  const { locale } = useI18n();
  const copy = getReasoningPageContent(locale).hero;
  return (
    <div className="reasoning-page-hero">
      <PageHero
        eyebrow={
          <>
            <BrainCircuit className="h-3.5 w-3.5" aria-hidden />
            {copy.eyebrow}
          </>
        }
        title={
          <>
            {copy.titleLead} <em className="not-italic text-primary">{copy.titleAccent}</em>.
          </>
        }
        description={copy.lead}
      />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Section nav
// ──────────────────────────────────────────────────────────────────────────

function SectionNav({ active, onChange }: { active: FocusId; onChange: (next: FocusId) => void }) {
  const { locale, t } = useI18n();
  const copy = getReasoningPageContent(locale);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % SECTIONS.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + SECTIONS.length) % SECTIONS.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = SECTIONS.length - 1;
    else return;

    event.preventDefault();
    const next = SECTIONS[nextIndex];
    onChange(next.id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <nav
      aria-label={copy.hero.navAria}
      role="tablist"
      className="flex gap-2 overflow-x-auto pb-1 xl:grid xl:grid-cols-5 xl:overflow-visible"
    >
      {SECTIONS.map((section, index) => {
        const Icon = section.icon;
        const isActive = section.id === active;
        return (
          <button
            key={section.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={`reasoning-tab-${section.id}`}
            type="button"
            onClick={() => onChange(section.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`reasoning-panel-${section.id}`}
            tabIndex={isActive ? 0 : -1}
            className={`${isActive ? "section-tab-active" : "section-tab"} focus-ring shrink-0 xl:min-w-0 xl:flex-col xl:items-start xl:gap-1 xl:text-left`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            <span className="font-semibold">{t(`pages.reasoning.sections.${section.id}.label`)}</span>
            <span className="hidden text-[10px] uppercase tracking-widest opacity-50 sm:inline">
              {t(`pages.reasoning.sections.${section.id}.role`)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 1 : Overview
// ──────────────────────────────────────────────────────────────────────────

function OverviewSection({ onJump }: { onJump: (next: FocusId) => void }) {
  const { locale, t } = useI18n();
  const copy = getReasoningPageContent(locale).overview;
  const P = "pages.intelligence";

  const flow: CognitiveFlowStep[] = FLOW_IDS.map((id) => ({
    label: t(`${P}.flow.steps.${id}.label`),
    detail: t(`${P}.flow.steps.${id}.detail`),
  }));

  return (
    <>
      <ZoneShell
        eyebrow={copy.flowEyebrow}
        title={copy.flowTitle}
        caption={copy.flowCaption}
        icon={<Sparkles className="h-3.5 w-3.5" aria-hidden />}
      >
        <div className="content-card">
          <CognitiveFlow steps={flow} />
        </div>
      </ZoneShell>

      <ZoneShell
        eyebrow={copy.differenceEyebrow}
        title={copy.differenceTitle}
        caption={copy.differenceCaption}
        icon={<Scale className="h-3.5 w-3.5" aria-hidden />}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {copy.differenceCards.map(([label, body]) => (
            <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
              <div className="mb-2 text-xs font-semibold text-slate-100">{label}</div>
              <p className="text-[11px] leading-relaxed text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </ZoneShell>

      <ZoneShell
        eyebrow={copy.exploreEyebrow}
        title={copy.exploreTitle}
        caption={copy.exploreCaption}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { id: "weaver" as FocusId, ...copy.exploreCards.weaver, icon: <Network className="h-4 w-4" aria-hidden /> },
            { id: "skills" as FocusId, ...copy.exploreCards.skills, icon: <Lightbulb className="h-4 w-4" aria-hidden /> },
            { id: "commands" as FocusId, ...copy.exploreCards.commands, icon: <Wrench className="h-4 w-4" aria-hidden /> },
            { id: "pipeline" as FocusId, ...copy.exploreCards.pipeline, icon: <Workflow className="h-4 w-4" aria-hidden /> },
          ].map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => onJump(card.id)}
              className="focus-ring rounded-2xl border border-white/8 bg-white/[0.02] p-5 text-left transition-colors hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="mb-2 flex items-center gap-2 text-primary">{card.icon}<span className="text-sm font-semibold text-slate-100">{card.label}</span></div>
              <p className="text-[11px] leading-relaxed text-slate-400">{card.body}</p>
              <div className="mt-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                <span>{copy.open}</span>
                <ArrowRight className="h-3 w-3" aria-hidden />
              </div>
            </button>
          ))}
        </div>
      </ZoneShell>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 2 : Evidence Weaver
// ──────────────────────────────────────────────────────────────────────────

function EvidenceWeaverSection() {
  const { locale } = useI18n();
  const copy = getReasoningPageContent(locale).weaver;

  return (
    <ZoneShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      caption={copy.caption}
      icon={<Network className="h-3.5 w-3.5" aria-hidden />}
      variant="xai"
    >
      <div
        data-testid="evidence-weaver"
        className="overflow-hidden rounded-2xl border border-primary/20 bg-[linear-gradient(145deg,rgba(222,204,253,0.075),rgba(255,255,255,0.018)_42%,rgba(10,10,12,0.35))] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
      >
        <ol className="grid gap-px bg-white/[0.06] sm:grid-cols-2 xl:grid-cols-4">
          {copy.steps.map((step, index) => (
            <li key={step.title} className="min-w-0 bg-surface-container-highest/95 p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/[0.08] font-mono text-[10px] font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden="true"
                  className="h-px min-w-0 flex-1 bg-gradient-to-r from-primary/35 to-transparent"
                />
              </div>
              <h3 className="text-sm font-semibold text-slate-100">{step.title}</h3>
              <p className="mt-2 text-xs leading-6 text-slate-400">{step.body}</p>
            </li>
          ))}
        </ol>

        <nav
          aria-label={copy.architectureFlowLabel}
          data-testid="evidence-weaver-flow"
          className="border-t border-white/[0.07] px-5 py-4"
        >
          <ol className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {copy.architectureFlow.map((step, index) => (
              <li key={step.label} className="flex min-w-0 items-center gap-3 sm:flex-1">
                <div className="min-w-0 sm:flex-1 sm:text-center">
                  <p className="text-[11px] font-medium text-slate-300">{step.label}</p>
                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] leading-5 text-slate-500">
                    {step.detail}
                  </p>
                </div>
                {index < copy.architectureFlow.length - 1 ? (
                  <ArrowRight
                    className="hidden h-3.5 w-3.5 shrink-0 text-white/15 sm:block"
                    aria-hidden
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </nav>

        <div className="grid gap-4 border-t border-white/[0.07] p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <p className="text-sm font-semibold text-slate-100">{copy.relationshipTitle}</p>
            <p className="mt-2 max-w-4xl text-xs leading-6 text-slate-400">{copy.relationshipBody}</p>
            <blockquote
              data-testid="evidence-weaver-closing"
              className="mt-4 max-w-4xl border-l border-primary/20 pl-4 text-xs leading-6 text-slate-500"
            >
              {copy.closingLines.map((line, index) => (
                <p key={line} className={index > 0 ? "mt-2" : undefined}>
                  {line}
                </p>
              ))}
            </blockquote>
          </div>
          <p className="max-w-sm shrink-0 rounded-xl border border-primary/15 bg-primary/[0.06] px-4 py-3 text-xs font-semibold leading-5 text-primary">
            {copy.motto}
          </p>
        </div>
      </div>
    </ZoneShell>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 3 : Abraxos skills
// ──────────────────────────────────────────────────────────────────────────

function SkillsSection() {
  const { locale } = useI18n();
  const copy = getReasoningPageContent(locale).skills;
  return (
    <ZoneShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      caption={copy.caption}
      icon={<Sparkles className="h-3.5 w-3.5" aria-hidden />}
    >
      <div className="mb-5 rounded-2xl border border-primary/15 bg-primary/[0.05] p-4 shadow-[0_0_32px_rgba(169,153,198,0.06)]">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <Lightbulb className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-semibold text-slate-100">{copy.appliedBy}</p>
            <p className="mt-1 text-xs leading-6 text-slate-400">
              {copy.appliedBody}
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {AUTOMATIC_SKILLS.map((skill) => (
          <SkillCard key={skill.id} capability={skill} />
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.02] p-4 text-xs leading-6 text-slate-400">
        <strong className="text-slate-200">{copy.auditLabel}</strong> {copy.auditBody}
      </div>
    </ZoneShell>
  );
}

function CommandsSection() {
  const location = useLocation();
  const { locale } = useI18n();
  const copy = getReasoningPageContent(locale).commands;
  const operationalCommands = ORACLE_COMMANDS.filter((command) => command.type === "Ação operacional");
  const investigativeCommands = ORACLE_COMMANDS.filter(
    (command) => command.type !== "Ação operacional",
  );

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash === "comandos-operacional" || hash === "comandos-investigativo") {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  return (
    <ZoneShell
      id="comandos-do-oraculo"
      eyebrow={copy.eyebrow}
      title={copy.title}
      caption={copy.caption}
      icon={<Wrench className="h-3.5 w-3.5" aria-hidden />}
    >
      <CommandHowTo manual={copy.manual} />

      <div className="commands-subsection">
        <div className="grid gap-4 md:grid-cols-2">
          <CategoryNavButton
            targetId="comandos-operacional"
            label={copy.operational}
            description={copy.operationalDescription}
            tone="primary"
          />
          <CategoryNavButton
            targetId="comandos-investigativo"
            label={copy.investigative}
            description={copy.investigativeDescription}
            tone="secondary"
          />
        </div>
      </div>

      <section id="comandos-operacional" className="commands-subsection scroll-mt-28">
        <h3 className="subsection-heading">{copy.operational}</h3>
        <p className="mb-5 max-w-3xl text-xs leading-6 text-slate-400">{copy.operationalDescription}</p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {operationalCommands.map((command) => (
            <CommandCard key={command.id} capability={command} />
          ))}
        </div>
      </section>

      <section id="comandos-investigativo" className="commands-subsection scroll-mt-28">
        <h3 className="subsection-heading">{copy.investigative}</h3>
        <p className="mb-5 max-w-3xl text-xs leading-6 text-slate-400">{copy.investigativeDescription}</p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {investigativeCommands.map((command) => (
            <CommandCard key={command.id} capability={command} />
          ))}
        </div>
      </section>

      <div className="commands-subsection rounded-2xl border border-white/8 bg-white/[0.02] p-4 text-xs leading-6 text-slate-400">
        <strong className="text-slate-200">{copy.compatibilityLabel}</strong> {copy.compatibilityBody}
      </div>
    </ZoneShell>
  );
}

function SkillCard({ capability }: { capability: CapabilityDefinition }) {
  const Icon = CAPABILITY_ICONS[capability.id] ?? BrainCircuit;
  const { locale } = useI18n();
  const copy = getReasoningPageContent(locale).capability;

  return (
    <article
      className="content-card h-full"
      title={copy.automaticTitle}
    >
      <div className="mb-3 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <h3 className="font-serif text-base font-semibold text-white">{capability.name}</h3>
          <p className="mt-1 inline-flex rounded-full border border-primary/15 bg-primary/[0.06] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-primary">
            {copy.automaticBadge}
          </p>
        </div>
      </div>

      <p className="mb-3 text-sm leading-6 text-slate-400">{capability.description}</p>
      <CapabilityField label={copy.activatedWhen} value={capability.activation} />
      <CapabilityField label={copy.expectedOutput} value={capability.output} />
      <CapabilityField label={copy.combinesWith} value={capability.combinesWith} />
      <CapabilityField label={copy.ragEvidence} value={capability.ragEvidence} />
    </article>
  );
}

function CommandCard({ capability }: { capability: CapabilityDefinition }) {
  const Icon = CAPABILITY_ICONS[capability.id] ?? Wrench;
  const { locale } = useI18n();
  const pageCopy = getReasoningPageContent(locale);
  const copy = pageCopy.capability;
  const isOperational = capability.type === "Ação operacional";
  const accent = isOperational ? "text-primary" : "text-secondary";
  const badgeClass = isOperational
    ? "border-primary/20 bg-primary/[0.07] text-primary"
    : "border-secondary/20 bg-secondary/[0.07] text-secondary";

  return (
    <article
      className="content-card h-full"
      title={copy.manualTitle}
    >
      <div className="mb-3 flex items-start gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] ${accent}`}>
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-base font-semibold text-white">{capability.name}</h3>
            {capability.experimental ? (
              <span className="rounded-full border border-fuchsia-300/20 bg-fuchsia-300/[0.06] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-fuchsia-300">
                {copy.experimental}
              </span>
            ) : null}
          </div>
          <code className={`mt-1.5 inline-block font-mono text-xs font-semibold ${accent}`}>
            {capability.command}
          </code>
        </div>
      </div>

      <span className={`mb-3 inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] ${badgeClass}`}>
        {isOperational ? pageCopy.commands.operational : pageCopy.commands.investigative}
      </span>
      <p className="mb-3 text-sm leading-6 text-slate-400">{capability.description}</p>
      <CapabilityField label={copy.whenToUse} value={capability.activation} />
      <CapabilityField label={copy.exampleInput} value={capability.example} mono />
      <CapabilityField label={copy.expectedOutput} value={capability.output} />
      <CapabilityField label={copy.ragEvidence} value={capability.ragEvidence} />
      <CapabilityField label={copy.combinesWithSkills} value={capability.combinesWith} />
      {capability.canonicalCommand ? (
        <CapabilityField label={copy.canonicalContract} value={capability.canonicalCommand} mono />
      ) : null}
      {capability.id === "health" ? (
        <Link
          to="/evaluation?focus=health#health"
          className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary transition hover:text-primary-dim"
        >
          Abrir Health do Sistema em Avaliação
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      ) : null}
    </article>
  );
}

function CommandHowTo({ manual }: { manual: string }) {
  const { locale } = useI18n();
  const copy = getReasoningPageContent(locale).commands;

  return (
    <div
      data-testid="command-how-to"
      className="overflow-hidden rounded-2xl border border-primary/20 bg-[linear-gradient(135deg,rgba(169,153,198,0.09),rgba(255,255,255,0.02))] shadow-[0_0_40px_rgba(169,153,198,0.08)]"
    >
      <div className="border-b border-white/[0.07] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <Wrench className="h-4 w-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="font-serif text-lg font-semibold text-white">{copy.howTitle}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {copy.howBody}
            </p>
            <p className="mt-3 text-xs leading-6 text-slate-400">
              {manual}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              {copy.howHint}
            </p>
          </div>
        </div>
      </div>
      <CommandExampleGroup label={copy.operational} examples={copy.operationalExamples} tone="primary" />
      <CommandExampleGroup label={copy.investigative} examples={copy.investigativeExamples} tone="secondary" />
    </div>
  );
}

function CategoryNavButton({
  targetId,
  label,
  description,
  tone,
}: {
  targetId: string;
  label: string;
  description: string;
  tone: "primary" | "secondary";
}) {
  const classes = tone === "primary"
    ? "border-primary/15 bg-primary/[0.05] text-primary hover:border-primary/30 hover:bg-primary/[0.08]"
    : "border-secondary/15 bg-secondary/[0.05] text-secondary hover:border-secondary/30 hover:bg-secondary/[0.08]";

  const jumpToSection = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${targetId}`);
  };

  return (
    <button
      type="button"
      onClick={jumpToSection}
      className={`group w-full rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${classes}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em]">{label}</p>
        <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
      </div>
      <p className="mt-1.5 text-xs leading-5 text-slate-400">{description}</p>
    </button>
  );
}

function CommandExampleGroup({
  label,
  examples,
  tone,
}: {
  label: string;
  examples: string[];
  tone: "primary" | "secondary";
}) {
  const labelClass = tone === "primary" ? "text-primary" : "text-secondary";

  return (
    <div className="border-t border-white/[0.07]">
      <p className={`bg-surface-container-highest/70 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.14em] ${labelClass}`}>
        {label}
      </p>
      <div className="grid gap-px bg-white/[0.05] md:grid-cols-2">
        {examples.map((example) => (
          <code key={example} className="bg-surface-container-highest/90 px-4 py-3 font-mono text-[10px] leading-5 text-primary/85">
            {example}
          </code>
        ))}
      </div>
    </div>
  );
}

function CapabilityField({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="border-t border-white/[0.06] py-2.5 first:border-t-0">
      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-600">{label}</p>
      <p className={`mt-1 text-[11px] leading-5 text-slate-300 ${mono ? "font-mono text-[10px] text-primary/80" : ""}`}>{value}</p>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SECTION 5 : Full reasoning pipeline (9 stages, expandable)
// Confidence calibration is internal to this section (not a separate tab).
// ──────────────────────────────────────────────────────────────────────────

interface PipelineStage {
  step: number;
  label: string;
  input: string;
  output: string;
  artefact: string;
  detail: string;
  group: "ingest" | "retrieve" | "synthesize" | "explain";
}

const PIPELINE: PipelineStage[] = [
  {
    step: 1,
    label: "Query ingestion",
    input: "user message + conversation history + active perspective + calibration",
    output: "normalized PromptBuildContext",
    artefact: "server.py · chat handler",
    detail:
      "The /api/chat endpoint trims history to the last 16 messages, sanitizes the calibration override, parses any /command prefix, and constructs a PromptBuildContext that carries the full state into the pipeline.",
    group: "ingest",
  },
  {
    step: 2,
    label: "Intent classification",
    input: "the user query (string)",
    output: "{ retrieval_intent, response_intent, top_k, catalog_mode }",
    artefact: "prompts/intent_router.py · route_query",
    detail:
      "Catalog mode is detected first (structural list queries). Otherwise command_mode overrides the intent. Otherwise a keyword-frequency vote across 7 intent vocabularies selects the highest-scoring intent : or 'general' if no signal.",
    group: "ingest",
  },
  {
    step: 3,
    label: "Embedding generation",
    input: "the query string",
    output: "1024-dim dense vector",
    artefact: "FlagEmbedding · BAAI/bge-m3",
    detail:
      "BAAI/bge-m3 produces a multilingual dense embedding (1024 dimensions) at fp16 precision. Loaded once at server startup via the FastAPI lifespan handler so requests pay no model load cost.",
    group: "retrieve",
  },
  {
    step: 4,
    label: "Vector retrieval",
    input: "query vector + page_type filter",
    output: "top_k * 4 candidate chunks",
    artefact: "rag/retrieval.py · retrieve_chunks",
    detail:
      "ChromaDB HNSW lookup against the persistent corpus. Filtered first by intent-derived page_type (component, pattern, token, design_decision, …). If filtered retrieval returns nothing, a fallback unfiltered query runs to avoid empty contexts.",
    group: "retrieve",
  },
  {
    step: 5,
    label: "Similarity ranking",
    input: "candidate chunks + perspective + vocabulary",
    output: "ranked top_k chunks",
    artefact: "PROFILE_RETRIEVAL_WEIGHTS · _vocabulary_boost",
    detail:
      "Each chunk receives weighted_score = similarity × retrieval_weight × vocabulary_boost. The vocabulary boost is capped at +20% to prevent keyword overfit. Chunks sort by weighted_score, then raw similarity as tiebreaker.",
    group: "retrieve",
  },
  {
    step: 6,
    label: "Context assembly",
    input: "ranked chunks + intent + perspective state",
    output: "RAG context block (markdown)",
    artefact: "rag/context_builder.py · build_rag_context",
    detail:
      "The selected chunks are composed into a prompt-ready evidence block preserving page_type, source, and similarity per chunk. Catalog mode emits a fuller registry block; commands inject command-specific framing.",
    group: "synthesize",
  },
  {
    step: 7,
    label: "Response synthesis",
    input: "RAG context + cognitive profile + runtime frame + system layers",
    output: "Groq messages payload",
    artefact: "prompts/prompt_builder.py · build_system_prompt",
    detail:
      "Stacks 8 prompt layers: system layers (core/identity/orchestration/retrieval-policy/anti-patterns/response-rules), runtime frame, cognitive context, intent prompt, response template, cognitive profile, dialogue, RAG context. Sent to Groq llama-3.3-70b-versatile with streaming on.",
    group: "synthesize",
  },
  {
    step: 8,
    label: "XAI attribution",
    input: "ranked chunks (pre-LLM)",
    output: "SSE 'sources' event before text",
    artefact: "server.py · streaming handler",
    detail:
      "Source chips are emitted as the first SSE event : before the first text delta arrives. The frontend renders attribution as a first-class audit surface, not a post-hoc footnote.",
    group: "explain",
  },
  {
    step: 9,
    label: "Confidence calibration",
    input: "cognitive profile · trust_calibration_style",
    output: "structured confidence in response body",
    artefact: "prompts/cognitive_profiles.py · _trust_calibration_contract",
    detail:
      "The active lens enforces one of three confidence styles: quantified (numeric), qualitative (hedged), or comparative (relative to a precedent). The contract is injected as part of the system prompt; the model is bound to it.",
    group: "explain",
  },
];

function groupAccent(group: PipelineStage["group"]): string {
  switch (group) {
    case "ingest": return "#fcd34d";
    case "retrieve": return "#67e8f9";
    case "synthesize": return "#c4b5fd";
    case "explain": return "#86efac";
  }
}

function PipelineSection() {
  const [openStep, setOpenStep] = useState<number | null>(null);
  const { locale } = useI18n();
  const copy = getReasoningPageContent(locale).pipeline;
  return (
    <ZoneShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      caption={copy.caption}
      icon={<Network className="h-3.5 w-3.5" aria-hidden />}
      variant="xai"
    >
      <ol className="space-y-2">
        {copy.stages.map((stage, index) => {
          const step = index + 1;
          const isOpen = openStep === step;
          const accent = groupAccent(stage.group);
          return (
            <li key={stage.label}>
              <button
                type="button"
                onClick={() => setOpenStep(isOpen ? null : step)}
                aria-expanded={isOpen}
                className="focus-ring w-full rounded-2xl border border-white/8 bg-white/[0.02] p-5 text-left transition-colors hover:bg-white/[0.04]"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border font-mono text-xs"
                    style={{ borderColor: accent, color: accent }}
                  >
                    {String(step).padStart(2, "0")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-3">
                      <span className="text-sm font-semibold text-slate-100">{stage.label}</span>
                      <code className="rounded border border-white/10 bg-black/30 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                        {stage.artefact}
                      </code>
                      <span className="text-[10px] uppercase tracking-widest" style={{ color: accent }}>
                        {copy.groupLabels[stage.group]}
                      </span>
                    </div>
                    <div className="mt-2 grid gap-2 text-[11px] sm:grid-cols-[auto_1fr] sm:gap-x-4">
                      <span className="text-slate-500">{copy.input}</span>
                      <span className="font-mono text-slate-400">{stage.input}</span>
                      <span className="text-slate-500">{copy.output}</span>
                      <span className="font-mono text-slate-400">{stage.output}</span>
                    </div>
                    {isOpen ? (
                      <p className="mt-3 text-xs leading-relaxed text-slate-300">{stage.detail}</p>
                    ) : null}
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </ZoneShell>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Shared shells
// ──────────────────────────────────────────────────────────────────────────

function ZoneShell({
  eyebrow,
  title,
  caption,
  icon,
  children,
  variant,
  id,
}: {
  eyebrow: string;
  title: string;
  caption?: string;
  icon?: ReactNode;
  children: ReactNode;
  variant?: "xai";
  id?: string;
}) {
  return (
    <section id={id} className={`content-section scroll-mt-28${variant === "xai" ? " content-section-xai" : ""}`}>
      <SectionIntroHeader
        description={caption}
        eyebrow={eyebrow}
        icon={icon}
        title={title}
      />
      <div className="section-intro-body">{children}</div>
    </section>
  );
}
