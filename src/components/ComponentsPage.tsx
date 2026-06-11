import {
  Bell,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  FormInput,
  LayoutGrid,
  Layers3,
  LoaderCircle,
  MousePointerClick,
  Sparkles,
  Tags,
  ToggleLeft,
  Type,
  X,
} from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AskAbraxosButton } from "../beatrice/components/assistant/AskAbraxosButton";
import { useI18n } from "../i18n/I18nProvider";
import type { Locale } from "../i18n/translations";
import { ComponentAboutCard } from "./ComponentAboutCard";
import { ComponentControlsSection, ComponentGuidanceSection } from "./ComponentSidePanel";
import { ComponentSnippetSection } from "./ComponentSnippetSection";
import {
  createInitialPlaygroundConfig,
  generateComponentSnippet,
  parseComponentSnippet,
} from "./componentWorkbench";
import {
  getComponentCatalog,
  getIntentExplanation,
} from "./componentPresentation";
import type { ComponentDoc, SectionId } from "./componentPresentation";
import {
  getComponentPractices,
  type ComponentPracticeIcon,
  type ComponentPracticeItem,
} from "./componentPracticePresentation";
import type {
  ComponentId,
  ComponentPlaygroundConfig,
  SnippetParseResult,
} from "./componentWorkbench";
import {
  PageHero,
  PageShell,
  StatusBadge,
} from "./ui/VisualPrimitives";

const ComponentInteractivePreview = lazy(() =>
  import("./ComponentInteractivePreview").then((module) => ({
    default: module.ComponentInteractivePreview,
  })),
);

const VelarisLibraryMap = lazy(() =>
  import("./VelarisLibraryMap").then((module) => ({
    default: module.VelarisLibraryMap,
  })),
);

function PreviewFallback({ label }: { label: string }) {
  return (
    <div className="lazy-panel-fallback" role="status" aria-live="polite">
      <LoaderCircle className="h-5 w-5 motion-safe:animate-spin text-primary" aria-hidden />
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function LibraryMapFallback({ label }: { label: string }) {
  return (
    <div className="library-map-fallback" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
    </div>
  );
}

interface SectionMeta {
  id: SectionId;
  title: string;
  description: string;
}

interface WorkbenchUi {
  eyebrow: string;
  title: string;
  description: string;
  count: string;
  corpus: string;
  sectionNav: string;
  componentNav: string;
  preview: string;
  about: string;
  commonUses: string;
  accessibility: string;
  accessibilityDescription: string;
  aiRecommendation: string;
  aiRecommendationDescription: string;
  recommendationBasis: string;
  states: string;
  intents: string;
  noIntents: string;
  code: string;
  copy: string;
  copied: string;
  codeLanguage: string;
  libraryMap: string;
  libraryJourneyTitle: string;
  libraryJourneyLead: string;
  libraryJourneyMeta: string;
  libraryJourneyStart: string;
  libraryJourneyLegend: string;
  libraryYouAreHere: string;
  libraryTerritoryComponents: string;
  libraryDestinationEyebrow: string;
  libraryDestinationTitle: string;
  libraryDestinationLead: string;
  components: string;
  stable: string;
  bestPractices: string;
  avoid: string;
  bestPracticesDescription: string;
  avoidDescription: string;
  breadcrumb: string;
  snippetEditorLabel: string;
  previewLoading: string;
  libraryMapLoading: string;
  controlsEyebrow: string;
  intentLabel: string;
}

type SnippetError = Extract<SnippetParseResult, { ok: false }>["error"];

function getSnippetError(error: SnippetError, locale: Locale): string {
  if (locale === "en-US") {
    return error === "invalid-syntax"
      ? "Use a complete snippet with the documented component structure."
      : "This editor accepts the documented props and generated state/intent combinations.";
  }
  return error === "invalid-syntax"
    ? "Use um snippet completo com a estrutura documentada do componente."
    : "Este editor aceita as props documentadas e as combinações geradas de state e intent.";
}


const SECTION_NAV_ICONS = {
  actions: MousePointerClick,
  forms: FormInput,
  structure: LayoutGrid,
  feedback: Bell,
  intelligence: BrainCircuit,
} as const;
function getSections(locale: Locale): SectionMeta[] {
  const en = locale === "en-US";
  const ptPt = locale === "pt-PT";

  return [
    {
      id: "actions",
      title: en ? "Actions and Controls" : ptPt ? "Ações e Controlos" : "Ações e Controles",
      description: en
        ? "Trigger commands, toggle states, and control user choices."
        : "Acionam comandos, alternam estados e controlam escolhas do usuário.",
    },
    {
      id: "forms",
      title: en ? "Inputs and Forms" : "Inputs e Formulários",
      description: en
        ? "Capture, edit, structure, and validate data."
        : "Capturam, editam, estruturam e validam dados.",
    },
    {
      id: "structure",
      title: en ? "Navigation and Structure" : "Navegação e Estrutura",
      description: en
        ? "Organize content, navigation, decisions, and data."
        : "Organizam conteúdo, navegação, decisões e dados.",
    },
    {
      id: "feedback",
      title: en ? "Feedback and States" : "Feedback e Estados",
      description: en
        ? "Communicate system status, loading, explanations, and confidence."
        : "Comunicam status, carregamento, explicações e confiança.",
    },
    {
      id: "intelligence",
      title: en ? "Intelligence, XAI and Auditability" : "Inteligência, XAI e Auditabilidade",
      description: en
        ? "Support retrieval, provenance, governance, and explainability."
        : "Apoiam recuperação, proveniência, governança e explicabilidade.",
    },
  ];
}

function getUi(locale: Locale): WorkbenchUi {
  if (locale === "en-US") {
    return {
      eyebrow: "Interactive design-system documentation",
      title: "Component Workbench",
      description:
        "Production components documented as operational evidence for product teams and Abraxos's RAG pipeline.",
      count: "{count} primary components",
      corpus: "Curated RAG corpus",
      sectionNav: "Sections",
      componentNav: "Components",
      preview: "Interactive preview",
      about: "About this component",
      commonUses: "Common uses",
      accessibility: "Accessibility",
      accessibilityDescription: "Component-specific criteria drawn from the documented catalog.",
      aiRecommendation: "AI recommendation",
      aiRecommendationDescription: "Contextual guidance based on component evidence, state, and intent.",
      recommendationBasis: "Recommendation based on the component catalog.",
      states: "States",
      intents: "Intents",
      noIntents: "This component has no semantic intents.",
      code: "Code snippet",
      copy: "Copy code",
      copied: "Copied",
      codeLanguage: "TSX",
      libraryMap: "Velaris Library Map",
      libraryJourneyTitle: "Journey through Components",
      libraryJourneyLead:
        "A continuous reading of the 25 primary components, organized as operational territories inside the Velaris design system.",
      libraryJourneyMeta: "{count} components · 5 territories",
      libraryJourneyStart: "Journey start",
      libraryJourneyLegend: "Journey legend",
      libraryYouAreHere: "You are here",
      libraryTerritoryComponents: "Components in this territory",
      libraryDestinationEyebrow: "Final destination",
      libraryDestinationTitle: "Velaris Library",
      libraryDestinationLead:
        "The consolidated knowledge surface where evidence, usage, and component contracts converge.",
      components: "components",
      stable: "Stable",
      bestPractices: "Best practices",
      avoid: "Avoid",
      bestPracticesDescription: "Five decisions that preserve clarity, semantics, and operational consistency.",
      avoidDescription: "Five failures that weaken meaning, accessibility, or component behavior.",
      breadcrumb: "Component location",
      snippetEditorLabel: "Edit component code snippet",
      previewLoading: "Loading interactive preview",
      libraryMapLoading: "Loading library map",
      controlsEyebrow: "Controls",
      intentLabel: "Intent",
    };
  }

  return {
    eyebrow: "Documentação interativa do design system",
    title: "Workbench de Componentes",
    description:
      "Componentes de produção documentados como evidência operacional para equipes de produto e para o pipeline RAG do Abraxos.",
    count: "{count} componentes principais",
    corpus: "Corpus RAG curado",
    sectionNav: "Seções",
    componentNav: "Componentes",
    preview: "Preview interativo",
    about: "Sobre este componente",
    commonUses: "Usos comuns",
    accessibility: "Acessibilidade",
    accessibilityDescription: "Critérios específicos derivados do catálogo documentado.",
    aiRecommendation: "Recomendação da IA",
    aiRecommendationDescription: "Orientação contextual baseada no componente, state e intent.",
    recommendationBasis: "Recomendação baseada no catálogo do componente.",
    states: "States",
    intents: "Intents",
    noIntents: "Este componente não possui intents semânticos.",
    code: "Code snippet",
    copy: "Copiar código",
    copied: "Copiado",
    codeLanguage: "TSX",
    libraryMap: "Mapa da Biblioteca de Velaris",
    libraryJourneyTitle: "Jornada pelos Componentes",
    libraryJourneyLead:
      "Leitura contínua dos 25 componentes principais, organizados como territórios operacionais do design system Velaris.",
    libraryJourneyMeta: "{count} componentes · 5 territórios",
    libraryJourneyStart: "Início da jornada",
    libraryJourneyLegend: "Legenda da jornada",
    libraryYouAreHere: "Você está aqui",
    libraryTerritoryComponents: "Componentes neste território",
    libraryDestinationEyebrow: "Destino final",
    libraryDestinationTitle: "Biblioteca de Velaris",
    libraryDestinationLead:
      "A superfície consolidada onde evidência, uso e contratos de componentes convergem.",
    components: "componentes",
    stable: "Estável",
    bestPractices: "Boas práticas",
    avoid: "Evitar",
    bestPracticesDescription: "Cinco decisões que preservam clareza, semântica e consistência operacional.",
    avoidDescription: "Cinco falhas que enfraquecem significado, acessibilidade ou comportamento.",
    breadcrumb: "Localização do componente",
    snippetEditorLabel: "Editar code snippet do componente",
    previewLoading: locale === "pt-PT" ? "A carregar preview interativo" : "Carregando preview interativo",
    libraryMapLoading: locale === "pt-PT" ? "A carregar mapa da biblioteca" : "Carregando mapa da biblioteca",
    controlsEyebrow: locale === "pt-PT" ? "Controlos" : "Controles",
    intentLabel: "Intent",
  };
}

const PRACTICE_ICONS = {
  action: MousePointerClick,
  clarity: Sparkles,
  confirm: CheckCircle2,
  content: Type,
  focus: CircleDot,
  hierarchy: Layers3,
  misuse: X,
  motion: LoaderCircle,
  semantics: Tags,
  state: ToggleLeft,
} satisfies Record<ComponentPracticeIcon, typeof MousePointerClick>;


function PracticePanel({
  description,
  items,
  title,
  tone,
}: {
  description: string;
  items: ComponentPracticeItem[];
  title: string;
  tone: "positive" | "negative";
}) {
  const positive = tone === "positive";
  const toneColor = positive
    ? "text-[var(--velaris-color-success)]"
    : "text-[var(--velaris-color-error)]";
  return (
    <article
      className={`overflow-hidden rounded-[20px] border bg-surface-container-low ${
        positive
          ? "border-[color:rgba(126,231,135,0.15)]"
          : "border-[color:rgba(255,110,132,0.15)]"
      }`}
    >
      <header className="flex items-start gap-3 border-b border-white/[0.07] px-5 py-5 sm:px-6">
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${
            positive
              ? "border-[color:rgba(126,231,135,0.2)] bg-[color:rgba(126,231,135,0.055)] text-[var(--velaris-color-success)]"
              : "border-[color:rgba(255,110,132,0.2)] bg-[color:rgba(255,110,132,0.055)] text-[var(--velaris-color-error)]"
          }`}
        >
          {positive
            ? <CheckCircle2 className="h-4 w-4" aria-hidden />
            : <X className="h-4 w-4" aria-hidden />}
        </span>
        <div>
          <h2 className={`text-sm font-semibold uppercase tracking-[0.12em] ${toneColor}`}>{title}</h2>
          <p className="mt-1 max-w-[62ch] text-xs leading-5 text-slate-400">{description}</p>
        </div>
      </header>
      <ol
        data-usage-guidance={positive ? "do" : "dont"}
        className="grid sm:grid-cols-2 xl:grid-cols-5"
      >
        {items.map((item, index) => {
          const Icon = PRACTICE_ICONS[item.icon];
          return (
            <li
              key={`${item.title}-${index}`}
              className="min-w-0 border-b border-white/[0.06] px-5 py-5 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-child(even)]:border-l xl:border-b-0 xl:border-l xl:first:border-l-0"
            >
              <Icon
                className={`h-5 w-5 ${toneColor}`}
                aria-hidden
              />
              <h3 className={`mt-4 text-xs font-semibold leading-5 ${toneColor}`}>{item.title}</h3>
              <p className="mt-2 text-[11px] leading-5 text-slate-400">{item.description}</p>
            </li>
          );
        })}
      </ol>
    </article>
  );
}

export function ComponentsPage() {
  const { locale } = useI18n();
  const [searchParams] = useSearchParams();
  const ui = getUi(locale);
  const sections = getSections(locale);
  const catalog = useMemo(
    () => getComponentCatalog(locale),
    [locale],
  );
  const [selectedId, setSelectedId] = useState<ComponentId>("button");
  const [copied, setCopied] = useState(false);
  const [playgroundConfigs, setPlaygroundConfigs] = useState<Partial<Record<ComponentId, ComponentPlaygroundConfig>>>({});
  const [snippetDrafts, setSnippetDrafts] = useState<Partial<Record<ComponentId, string>>>({});
  const [snippetErrors, setSnippetErrors] = useState<Partial<Record<ComponentId, SnippetError>>>({});

  useEffect(() => {
    setSnippetDrafts({});
    setSnippetErrors({});
  }, [locale]);

  const selected = catalog.find((item) => item.id === selectedId) ?? catalog[0]!;

  useEffect(() => {
    const componentParam = searchParams.get("component");
    if (!componentParam) return;
    const match = catalog.find((item) => item.id === componentParam);
    if (match) {
      setSelectedId(match.id);
    }
  }, [catalog, searchParams]);

  useEffect(() => {
    const section = searchParams.get("section");
    if (!section) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(`velaris-component-section-${section}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [searchParams, selectedId]);
  const activeConfig = useMemo(
    () => playgroundConfigs[selected.id]
      ?? createInitialPlaygroundConfig(selected.id, selected.states, selected.intents),
    [playgroundConfigs, selected],
  );
  const activeSnippet = useMemo(
    () => snippetDrafts[selected.id] ?? generateComponentSnippet(selected.id, activeConfig, locale),
    [snippetDrafts, selected.id, activeConfig, locale],
  );
  const activeSnippetError = snippetErrors[selected.id];
  const activeSection = sections.find((section) => section.id === selected.section) ?? sections[0]!;
  const SelectedIcon = selected.icon;
  const practices = getComponentPractices(selected.id, locale);
  const intentExplanation = getIntentExplanation(selected.id, activeConfig.intent, locale);
  const componentCount = ui.count.replace("{count}", String(catalog.length));
  const activeStateKey = activeConfig.state.toLowerCase();
  const previewFrameClass = [
    activeStateKey === "focus" ? "border-primary/45 [box-shadow:inset_0_0_0_1px_rgba(222,204,253,0.2)]" : "",
    activeStateKey === "hover" ? "border-white/15 bg-surface-container-high" : "",
    activeStateKey === "disabled" ? "opacity-70" : "",
    ["loading", "searching", "running", "submitting", "executing"].includes(activeStateKey)
      ? "border-primary/20"
      : "",
    ["error", "invalid", "conflict"].includes(activeStateKey) ? "border-error/30" : "",
  ].filter(Boolean).join(" ");

  const selectSection = (sectionId: SectionId) => {
    const first = catalog.find((item) => item.section === sectionId);
    if (first) setSelectedId(first.id);
  };

  const updatePlaygroundConfig = (patch: Partial<ComponentPlaygroundConfig>) => {
    const nextConfig = { ...activeConfig, ...patch };
    setPlaygroundConfigs((current) => ({ ...current, [selected.id]: nextConfig }));
    setSnippetDrafts((current) => ({
      ...current,
      [selected.id]: generateComponentSnippet(selected.id, nextConfig, locale),
    }));
    setSnippetErrors((current) => {
      const next = { ...current };
      delete next[selected.id];
      return next;
    });
  };

  const updateSnippet = (draft: string) => {
    setSnippetDrafts((current) => ({ ...current, [selected.id]: draft }));
    const parsed = parseComponentSnippet(selected.id, draft, selected.states, selected.intents, locale);
    if (parsed.ok) {
      setPlaygroundConfigs((current) => ({ ...current, [selected.id]: parsed.config }));
      setSnippetErrors((current) => {
        const next = { ...current };
        delete next[selected.id];
        return next;
      });
      return;
    }
    setSnippetErrors((current) => ({ ...current, [selected.id]: parsed.error }));
  };

  const copySnippet = async () => {
    try {
      await navigator.clipboard.writeText(activeSnippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="text-slate-200">
      <PageShell width="wide" className="space-y-8 pb-20">
        <PageHero
          eyebrow={
            <>
              <Layers3 className="h-3.5 w-3.5" aria-hidden />
              {ui.eyebrow}
            </>
          }
          title={
            <>
              {ui.title.split(" ")[0]}{" "}
              <span className="page-h1-accent">{ui.title.split(" ").slice(1).join(" ")}</span>
            </>
          }
          description={ui.description}
          actions={
            <>
              <StatusBadge tone="stable">{componentCount}</StatusBadge>
              <span className="inline-flex min-h-6 items-center rounded-md border border-white/[0.08] bg-white/[0.025] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                {ui.corpus}
              </span>
            </>
          }
          aside={
            <div
              className="premium-card hidden h-24 w-24 grid-cols-2 gap-1.5 p-3 sm:grid sm:h-28 sm:w-28"
              aria-hidden
            >
              <span className="rounded-md border border-primary/20 bg-primary/[0.07]" />
              <span className="rounded-md border border-white/10 bg-white/[0.03]" />
              <span className="rounded-md border border-white/10 bg-white/[0.03]" />
              <span className="rounded-md border border-primary/15 bg-primary/[0.05]" />
            </div>
          }
        />
        <nav
          aria-label={ui.sectionNav}
          className="flex gap-2 overflow-x-auto xl:grid xl:grid-cols-5 xl:overflow-visible"
        >
          {sections.map((section) => {
            const active = section.id === selected.section;
            const sectionCount = catalog.filter((item) => item.section === section.id).length;
            const Icon = SECTION_NAV_ICONS[section.id];
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => selectSection(section.id)}
                aria-pressed={active}
                className={`${active ? "section-tab-active" : "section-tab"} shrink-0 xl:min-w-0 xl:flex-col xl:items-start xl:gap-1 xl:text-left`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden strokeWidth={1.5} />
                <span className="font-semibold">{section.title}</span>
                <span className="hidden text-[10px] uppercase tracking-widest opacity-50 sm:inline">
                  {String(sectionCount).padStart(2, "0")} {ui.components}
                </span>
              </button>
            );
          })}
        </nav>

        <section className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-surface-container-low shadow-[0_24px_80px_rgba(2,2,4,0.18)]">
          <div className="grid xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside
            data-abraxos-focus="component-catalog"
            className="border-b border-white/[0.08] bg-black/10 p-5 xl:border-b-0 xl:border-r"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">{ui.componentNav}</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">{activeSection.title}</h2>
            <p className="mt-2 max-w-[34ch] text-xs leading-5 text-slate-400">{activeSection.description}</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {catalog.filter((item) => item.section === selected.section).map((item) => {
                const Icon = item.icon;
                const active = item.id === selected.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    aria-current={active ? "true" : undefined}
                    className={`flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-[background-color,border-color,color,transform] duration-200 active:translate-y-px ${active ? "border-primary/25 bg-primary/[0.09] text-white" : "border-transparent bg-white/[0.018] text-slate-400 hover:border-white/[0.08] hover:bg-white/[0.035] hover:text-white"}`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${active ? "text-primary" : "text-slate-400"}`} aria-hidden />
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="border-b border-white/[0.08] p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-xl border border-primary/15 bg-primary/[0.055]">
                      <SelectedIcon className="h-4 w-4 text-primary" aria-hidden />
                    </span>
                    <StatusBadge tone="stable">{ui.stable}</StatusBadge>
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">{selected.title}</h2>
                  <p className="mt-3 max-w-[68ch] text-sm leading-7 text-slate-300">{selected.shortDescription}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <AskAbraxosButton
                    context={{
                      page: ui.components,
                      section: selected.title,
                      entity_type: "component",
                      entity_name: selected.title,
                    }}
                  />
                  <nav aria-label={ui.breadcrumb} className="flex min-h-11 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    <span>{ui.componentNav}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-500" aria-hidden />
                    <span className="text-primary">{activeSection.title}</span>
                  </nav>
                </div>
              </div>
            </div>

            <div className="component-detail-body" data-component-detail={selected.id}>
              <div className="component-detail-stage">
                <div className="component-detail-preview-slot p-6 md:p-8 lg:border-r lg:border-white/[0.08]">
                  <p className="component-detail-slot-eyebrow text-slate-300">{ui.preview}</p>
                  <div
                    data-component-preview={selected.id}
                    data-state={activeConfig.state}
                    data-intent={activeConfig.intent}
                    className={`component-preview-frame component-detail-slot-panel relative mt-4 flex min-h-[320px] flex-col overflow-hidden rounded-[20px] border border-white/[0.08] bg-surface-container transition-[background-color,border-color,box-shadow,opacity] duration-[160ms] ${previewFrameClass}`}
                  >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/[0.04] to-transparent" />
                    <div className="component-preview-toolbar relative z-[2]">
                      <span className="component-preview-state-badge rounded-md border border-primary/15 bg-background/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-primary">
                        {activeConfig.intent} · {activeConfig.state}
                      </span>
                    </div>
                    <div className="component-preview-stage relative z-[1] flex flex-1 flex-col items-center justify-center gap-5 px-5 pb-6 pt-2 sm:px-6 sm:pb-7">
                      <Suspense fallback={<PreviewFallback label={ui.previewLoading} />}>
                        <ComponentInteractivePreview
                          key={selected.id}
                          item={selected}
                          config={activeConfig}
                          onStateChange={(state) => updatePlaygroundConfig({ state })}
                        />
                      </Suspense>
                      <article
                        data-intent-explanation={activeConfig.intent}
                        className="surface-panel-subtle w-full max-w-md p-4 text-left"
                      >
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                          {ui.intentLabel}: {activeConfig.intent}
                        </p>
                        <p className="mt-2 text-xs leading-5 text-slate-300">
                          {intentExplanation.description}
                        </p>
                        <p className="mt-2 text-[11px] leading-5 text-slate-400">
                          {intentExplanation.example}
                        </p>
                      </article>
                    </div>
                  </div>
                </div>

                <div
                  id="velaris-component-section-states"
                  className="component-detail-controls-slot p-6 md:p-8"
                >
                  <p className="component-detail-slot-eyebrow">
                    {ui.controlsEyebrow}
                  </p>
                  <div className="component-detail-slot-panel mt-4">
                    <ComponentControlsSection
                      component={selected}
                      config={activeConfig}
                      labels={{
                        states: ui.states,
                        intents: ui.intents,
                        noIntents: ui.noIntents,
                        accessibility: ui.accessibility,
                        aiRecommendation: ui.aiRecommendation,
                      }}
                      onConfigChange={updatePlaygroundConfig}
                    />
                  </div>
                </div>

                <div
                  id="velaris-component-section-about"
                  className="component-detail-about-slot border-t border-white/[0.08] p-6 md:p-8 lg:border-r lg:border-t-0"
                >
                  <ComponentAboutCard
                    className="component-detail-panel-fill h-full"
                    componentId={selected.id}
                    title={ui.about}
                    commonUsesLabel={ui.commonUses}
                    about={selected.about}
                    features={selected.aboutFeatures}
                    commonUses={selected.commonUses}
                  />
                </div>

                <div
                  id="velaris-component-section-guidelines"
                  className="component-detail-guidance-slot border-t border-white/[0.08] p-6 md:p-8 lg:border-t-0"
                >
                  <ComponentGuidanceSection
                    component={selected}
                    config={activeConfig}
                    intentExplanation={intentExplanation}
                    labels={{
                      states: ui.states,
                      intents: ui.intents,
                      noIntents: ui.noIntents,
                      accessibility: ui.accessibility,
                      aiRecommendation: ui.aiRecommendation,
                    }}
                  />
                </div>
              </div>

              <div className="component-detail-divider" aria-hidden />

              <div className="component-detail-snippet p-6 md:p-8">
                <ComponentSnippetSection
                  componentId={selected.id}
                  copied={copied}
                  labels={{
                    code: ui.code,
                    codeLanguage: ui.codeLanguage,
                    copy: ui.copy,
                    copied: ui.copied,
                    snippetEditorLabel: ui.snippetEditorLabel,
                  }}
                  snippet={activeSnippet}
                  snippetErrorMessage={activeSnippetError ? getSnippetError(activeSnippetError, locale) : undefined}
                  onCopySnippet={() => { void copySnippet(); }}
                  onSnippetChange={updateSnippet}
                />
              </div>
            </div>
          </div>
          </div>
        </section>

        <section aria-label={`${ui.bestPractices} e ${ui.avoid}`} className="grid gap-4 lg:grid-cols-2">
          <PracticePanel
            title={ui.bestPractices}
            description={ui.bestPracticesDescription}
            items={practices.dos}
            tone="positive"
          />
          <PracticePanel
            title={ui.avoid}
            description={ui.avoidDescription}
            items={practices.donts}
            tone="negative"
          />
        </section>

        <Suspense fallback={<LibraryMapFallback label={ui.libraryMapLoading} />}>
          <VelarisLibraryMap
            catalog={catalog}
            sections={sections}
            selectedId={selectedId}
            selectedSectionId={selected.section}
            onSelectComponent={setSelectedId}
            onSelectSection={selectSection}
            copy={{
              eyebrow: ui.libraryMap,
              title: ui.libraryJourneyTitle,
              lead: ui.libraryJourneyLead,
              meta: ui.libraryJourneyMeta.replace("{count}", String(catalog.length)),
              componentsLabel: ui.components,
              journeyStart: ui.libraryJourneyStart,
              youAreHere: ui.libraryYouAreHere,
              territoryComponents: ui.libraryTerritoryComponents,
              destinationEyebrow: ui.libraryDestinationEyebrow,
              destinationTitle: ui.libraryDestinationTitle,
              destinationLead: ui.libraryDestinationLead,
            }}
          />
        </Suspense>
      </PageShell>
    </div>
  );
}
