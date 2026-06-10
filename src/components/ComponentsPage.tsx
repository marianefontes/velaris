import {
  AlignLeft,
  Bell,
  BrainCircuit,
  BookOpenCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Command,
  CreditCard,
  ExternalLink,
  FormInput,
  Gauge,
  LayoutGrid,
  Layers3,
  Link2,
  ListChecks,
  ListFilter,
  LoaderCircle,
  MessageCircleQuestion,
  MousePointerClick,
  PanelTop,
  PanelsTopLeft,
  Shapes,
  Sparkles,
  SquareCheckBig,
  Table2,
  Tags,
  TextCursorInput,
  ToggleLeft,
  TriangleAlert,
  Type,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AskAbraxosButton } from "../beatrice/components/assistant/AskAbraxosButton";
import { useI18n } from "../i18n/I18nProvider";
import { getComponentsPreviewCopy } from "../i18n/pages/componentsPreview";
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
  ButtonIntent,
  ButtonState,
  ComponentId,
  ComponentPlaygroundConfig,
  SnippetParseResult,
} from "./componentWorkbench";
import { VelarisLibraryMap } from "./VelarisLibraryMap";
import {
  PageHero,
  PageShell,
  StatusBadge,
} from "./ui/VisualPrimitives";

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

const COMPONENT_CATALOG = getComponentCatalog("pt-BR");

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

const BUTTON_INTENT_CLASSES: Record<ButtonIntent, string> = {
  primary: "border-primary bg-primary text-on-primary hover:bg-primary-dim",
  secondary:
    "border-primary/20 bg-surface-container-highest text-primary hover:border-primary/40 hover:bg-primary/10",
  positive:
    "border-[var(--velaris-color-success)] bg-[var(--velaris-color-success)] text-background hover:brightness-90",
  negative: "border-error bg-error text-on-error hover:bg-error-dim",
};

const BUTTON_HOVER_CLASSES: Record<ButtonIntent, string> = {
  primary: "border-primary bg-primary-dim",
  secondary: "border-primary/40 bg-primary/10 text-primary",
  positive: "border-[var(--velaris-color-success)] bg-[var(--velaris-color-success)] brightness-90",
  negative: "border-error-dim bg-error-dim text-on-error",
};

function buttonPreviewClassName(config: ComponentPlaygroundConfig): string {
  const intent = config.intent.toLowerCase() as ButtonIntent;
  const state = config.state.toLowerCase() as ButtonState;
  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-xs font-bold uppercase tracking-widest outline-none transition-[background-color,border-color,color,box-shadow,transform] duration-[160ms] active:translate-y-px";
  if (state === "disabled") {
    return `${base} cursor-not-allowed border-white/[0.07] bg-white/[0.025] text-on-surface-variant/45`;
  }

  return [
    base,
    BUTTON_INTENT_CLASSES[intent],
    state === "hover" ? BUTTON_HOVER_CLASSES[intent] : "",
    state === "focus"
      ? "border-primary [box-shadow:0_0_0_3px_rgba(222,204,253,0.35)]"
      : "focus-visible:border-primary focus-visible:[box-shadow:0_0_0_3px_rgba(222,204,253,0.35)]",
    state === "loading" ? "cursor-wait" : "",
  ].filter(Boolean).join(" ");
}

function InteractivePreview({
  item,
  config,
  onStateChange,
}: {
  item: ComponentDoc;
  config: ComponentPlaygroundConfig;
  onStateChange: (state: string) => void;
}) {
  const { locale } = useI18n();
  const copy = useMemo(() => getComponentsPreviewCopy(locale), [locale]);
  const [count, setCount] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const [checked, setChecked] = useState(false);
  const [radio, setRadio] = useState("balanced");
  const [chip, setChip] = useState(true);
  const [text, setText] = useState("");
  const [area, setArea] = useState("");
  const [select, setSelect] = useState("designer");
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");
  const [linkVisited, setLinkVisited] = useState(false);
  const [tab, setTab] = useState("preview");
  const [cardSelected, setCardSelected] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [ascending, setAscending] = useState(true);
  const [alertVisible, setAlertVisible] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [confidence, setConfidence] = useState(86);
  const [commandQuery, setCommandQuery] = useState("");
  const [sourceOpen, setSourceOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [displayType, setDisplayType] = useState(false);
  const [iconIndex, setIconIndex] = useState(0);
  const buttonPreviewRef = useRef<HTMLButtonElement>(null);
  const togglePreviewRef = useRef<HTMLButtonElement>(null);
  const state = config.state.toLowerCase();
  const intent = config.intent.toLowerCase();

  useEffect(() => {
    if (item.id !== "button") return;
    if (state === "focus") {
      buttonPreviewRef.current?.focus();
      return;
    }
    if (document.activeElement === buttonPreviewRef.current) {
      buttonPreviewRef.current?.blur();
    }
  }, [item.id, state]);

  useEffect(() => {
    if (item.id === "toggle-switch") {
      if (state === "on") setEnabled(true);
      if (state === "off") setEnabled(false);
      if (state === "focus") {
        setEnabled(false);
        togglePreviewRef.current?.focus();
      } else if (document.activeElement === togglePreviewRef.current) {
        togglePreviewRef.current?.blur();
      }
    }
    if (item.id === "checkbox") setChecked(state === "checked" || state === "indeterminate");
    if (item.id === "radio-button") setRadio(state === "checked" ? "balanced" : "");
    if (item.id === "selectable-chip") setChip(state === "selected");
    if (item.id === "text-input") setText(state === "filled" ? "Velaris" : "");
    if (item.id === "text-area") setArea(state === "filled" ? copy.sampleDecisionContext : "");
    if (item.id === "select-dropdown") setSelect(state === "selected" ? "designer" : "");
    if (item.id === "date-picker") setDate(state === "selected" ? "2026-06-06" : "");
    if (item.id === "form-field") setEmail(state === "valid" ? "nome@empresa.com" : state === "error" ? copy.invalidEmailValue : "");
    if (item.id === "link") setLinkVisited(state === "visited");
    if (item.id === "tabs") setTab(state === "active" ? "preview" : "");
    if (item.id === "card") setCardSelected(state === "selected");
    if (item.id === "modal-dialog") setModalOpen(state !== "closed");
    if (item.id === "alert") setAlertVisible(state !== "dismissed");
    if (item.id === "toast") setToastVisible(state !== "paused");
    if (item.id === "skeleton-loader") setLoaded(state === "loaded");
    if (item.id === "explanation-tooltip") {
      setTooltipOpen(["hover", "focus", "open"].includes(state));
    }
    if (item.id === "confidence-badge") {
      setConfidence(state === "low" ? 34 : state === "medium" ? 67 : state === "high" ? 94 : 86);
    }
    if (item.id === "command-palette") {
      setCommandQuery(state === "empty" ? copy.noResultsQuery : state === "results" ? "audit" : "");
    }
    if (item.id === "source-attribution") setSourceOpen(state === "expanded" || state === "high match");
    if (item.id === "audit-panel") setAuditOpen(state !== "collapsed");
    if (item.id === "typography") setDisplayType(state === "display");
    if (item.id === "icon") {
      setIconIndex(intent === "status" ? 1 : intent === "category" ? 2 : 0);
    }
  }, [copy, intent, item.id, state]);

  const previewButton =
    "rounded-xl bg-signature px-5 py-3 text-xs font-bold uppercase tracking-widest text-on-primary transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50";
  const secondaryButton =
    "rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-primary/25 hover:text-white";

  switch (item.id) {
    case "button":
      {
        const blocked = state === "loading" || state === "disabled";
        const statusId = blocked ? "button-preview-status" : undefined;
        return (
          <div className="text-center">
            <button
              ref={buttonPreviewRef}
              type="button"
              className={buttonPreviewClassName(config)}
              data-intent={intent}
              data-state={state}
              disabled={blocked}
              aria-busy={state === "loading" || undefined}
              aria-describedby={statusId}
              autoFocus={state === "focus"}
              onClick={() => setCount((value) => value + 1)}
            >
              {state === "loading" ? (
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
              ) : null}
              <span>{config.label ?? copy.generateAnalysis}</span>
            </button>
            <p className="mt-3 text-xs text-slate-400">
              {copy.executedCount.replace("{count}", String(count))}
            </p>
            {blocked ? (
              <p id={statusId} className="mt-2 text-[11px] leading-5 text-slate-400" aria-live="polite">
                {state === "loading"
                  ? copy.processingAsync
                  : copy.unavailableAction}
              </p>
            ) : null}
          </div>
        );
      }
    case "toggle-switch":
      {
        const toggleLabel =
          intent === "visibility"
            ? copy.showDetails
            : intent === "mode"
              ? copy.editMode
              : copy.reduceMotion;
        return (
          <div className="w-full max-w-sm">
            <button
              ref={togglePreviewRef}
              type="button"
              role="switch"
              aria-checked={enabled}
              disabled={state === "disabled"}
              autoFocus={state === "focus"}
              onClick={() => {
                const next = !enabled;
                setEnabled(next);
                onStateChange(next ? "On" : "Off");
              }}
              className={`flex min-h-11 items-center gap-3 rounded-xl px-2 text-sm font-semibold text-white outline-none transition-[box-shadow,opacity] duration-[160ms] focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-40 ${state === "focus" ? "ring-2 ring-primary/50" : ""}`}
            >
              <span
                data-toggle-track
                aria-hidden
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-[160ms] ${enabled ? "bg-primary" : "bg-white/10"}`}
              >
                <span
                  data-toggle-thumb
                  className={`absolute left-0 top-1 h-5 w-5 rounded-full bg-background transition-transform duration-[160ms] ${enabled ? "translate-x-6" : "translate-x-1"}`}
                />
              </span>
              <span>{toggleLabel} {enabled ? copy.enabled : copy.disabled}</span>
            </button>
          </div>
        );
      }
    case "checkbox":
      return (
        <label className={`flex min-h-11 items-center gap-3 rounded-xl px-2 text-sm text-white ${state === "disabled" ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}>
          <input
            type="checkbox"
            checked={checked}
            disabled={state === "disabled"}
            autoFocus={state === "focus"}
            aria-checked={state === "indeterminate" ? "mixed" : checked}
            onChange={(event) => {
              setChecked(event.target.checked);
              onStateChange(event.target.checked ? "Checked" : "Unchecked");
            }}
            className="h-5 w-5 accent-primary focus-visible:ring-2 focus-visible:ring-primary/50"
          />
          {intent === "consent"
            ? copy.consentSources
            : intent === "bulk"
              ? copy.selectAll
              : copy.includeRetrievedSources}
        </label>
      );
    case "radio-button":
      return (
        <fieldset className="space-y-3">
          <legend className={`mb-3 text-xs font-bold uppercase tracking-widest ${state === "error" ? "text-error" : "text-slate-400"}`}>
            {intent === "plan" ? copy.plan : intent === "preference" ? copy.preference : copy.singleChoice}
          </legend>
          {["concise", "balanced", "detailed"].map((value) => (
            <label key={value} className={`flex min-h-11 items-center gap-3 text-sm text-white ${state === "disabled" ? "opacity-40" : ""}`}>
              <input
                type="radio"
                name="depth"
                value={value}
                checked={radio === value}
                disabled={state === "disabled"}
                autoFocus={state === "focus" && value === "balanced"}
                onChange={() => {
                  setRadio(value);
                  onStateChange("Checked");
                }}
                className="h-4 w-4 accent-primary"
              />
              {value === "concise" ? copy.concise : value === "balanced" ? copy.balanced : copy.detailed}
            </label>
          ))}
          {state === "error" ? <p className="text-xs text-error">{copy.selectOption}</p> : null}
        </fieldset>
      );
    case "selectable-chip":
      return (
        <button
          type="button"
          aria-pressed={chip}
          disabled={state === "disabled"}
          autoFocus={state === "focus"}
          onClick={() => {
            const next = !chip;
            setChip(next);
            onStateChange(next ? "Selected" : "Default");
          }}
          className={`min-h-11 rounded-full border px-4 py-2 text-xs font-bold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-40 ${chip ? "border-primary/30 bg-primary/15 text-primary" : state === "hover" ? "border-white/20 bg-white/[0.07] text-white" : "border-white/10 bg-white/[0.03] text-slate-400"}`}
        >
          {intent === "tag" ? copy.documentation : intent === "attribute" ? copy.highConfidence : copy.accessibility}
        </button>
      );
    case "text-input":
      return (
        <label className="w-full max-w-sm text-xs font-semibold text-slate-400">
          {intent === "search" ? copy.searchSources : intent === "email" ? copy.email : copy.projectName}
          <input
            type={intent === "email" ? "email" : intent === "search" ? "search" : "text"}
            value={text}
            disabled={state === "disabled"}
            autoFocus={state === "focus"}
            aria-invalid={state === "error"}
            onChange={(event) => {
              setText(event.target.value);
              onStateChange(event.target.value ? "Filled" : "Empty");
            }}
            placeholder={copy.projectPlaceholder}
            className={`mt-2 min-h-11 w-full rounded-xl border bg-black/20 px-4 py-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-40 ${state === "error" ? "border-error/60" : "border-white/10 focus:border-primary/35"}`}
          />
          {state === "error" ? <span className="mt-2 block text-[11px] text-error">{copy.reviewValue}</span> : null}
        </label>
      );
    case "text-area":
      return (
        <label className="w-full max-w-sm text-xs font-semibold text-slate-400">
          {intent === "prompt" ? copy.beatricePrompt : intent === "comment" ? copy.comment : copy.decisionContext}
          <textarea
            value={area}
            disabled={state === "disabled"}
            autoFocus={state === "focus"}
            aria-invalid={state === "error"}
            onChange={(event) => {
              setArea(event.target.value);
              onStateChange(event.target.value ? "Filled" : "Empty");
            }}
            rows={4}
            placeholder={copy.contextPlaceholder}
            className={`mt-2 w-full resize-y rounded-xl border bg-black/20 px-4 py-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-40 ${state === "error" ? "border-error/60" : "border-white/10 focus:border-primary/35"}`}
          />
        </label>
      );
    case "select-dropdown":
      return (
        <label className="w-full max-w-xs text-xs font-semibold text-slate-400">
          {intent === "filter" ? copy.filterSources : intent === "configuration" ? copy.configuration : copy.perspective}
          <select
            value={select}
            disabled={state === "disabled"}
            autoFocus={state === "open"}
            aria-invalid={state === "error"}
            onChange={(event) => {
              setSelect(event.target.value);
              onStateChange(event.target.value ? "Selected" : "Closed");
            }}
            className={`mt-2 min-h-11 w-full rounded-xl border bg-surface-container-high px-4 py-3 text-sm text-white outline-none disabled:opacity-40 ${state === "error" ? "border-error/60" : "border-white/10 focus:border-primary/35"}`}
          >
            <option value="">{copy.select}</option>
            <option value="designer">Designer</option>
            <option value="dev">Developer</option>
            <option value="product_designer">Product Designer</option>
            <option value="qa">QA</option>
            <option value="tech_writer">Tech Writer</option>
            <option value="a11y">Accessibility Specialist</option>
            <option value="maintainer">Maintainer</option>
            <option value="design_system_manager">Design System Manager</option>
          </select>
        </label>
      );
    case "date-picker":
      return (
        <label className="w-full max-w-xs text-xs font-semibold text-slate-400">
          {intent === "range" ? copy.auditPeriod : intent === "deadline" ? copy.deadline : copy.reviewDate}
          <input
            type="date"
            value={date}
            disabled={state === "disabled"}
            autoFocus={state === "open"}
            aria-invalid={state === "invalid"}
            onChange={(event) => {
              setDate(event.target.value);
              onStateChange(event.target.value ? "Selected" : "Empty");
            }}
            className={`mt-2 min-h-11 w-full rounded-xl border bg-surface-container-high px-4 py-3 text-sm text-white outline-none disabled:opacity-40 ${state === "invalid" ? "border-error/60" : "border-white/10 focus:border-primary/35"}`}
          />
        </label>
      );
    case "form-field": {
      const invalid = state === "error" || (email.length > 0 && !email.includes("@"));
      return (
        <label className="w-full max-w-sm text-xs font-semibold text-slate-400">
          {intent === "validation" ? copy.email : intent === "guidance" ? copy.analysisName : copy.inputData}
          {state === "required" ? <span className="ml-1 text-error">*</span> : null}
          <input
            value={email}
            disabled={state === "disabled"}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={invalid}
            aria-describedby="email-hint"
            placeholder="nome@empresa.com"
            className={`mt-2 min-h-11 w-full rounded-xl border bg-black/20 px-4 py-3 text-sm text-white outline-none disabled:opacity-40 ${invalid ? "border-error/50" : state === "valid" ? "border-[var(--velaris-color-success)]/50" : "border-white/10 focus:border-primary/35"}`}
          />
          <span id="email-hint" className={`mt-2 block text-[11px] ${invalid ? "text-error" : "text-slate-400"}`}>
            {invalid ? copy.validEmail : state === "valid" ? copy.validatedValue : copy.contactOnly}
          </span>
        </label>
      );
    }
    case "link":
      return (
        <button
          type="button"
          disabled={state === "disabled"}
          autoFocus={state === "focus"}
          onClick={() => {
            setLinkVisited(true);
            onStateChange("Visited");
          }}
          className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-40 ${state === "hover" ? "bg-primary/10 text-white" : ""}`}
        >
          {intent === "external" ? copy.originalSource : intent === "download" ? copy.downloadReport : copy.exploreFoundations}
          {intent === "external" ? <ExternalLink className="h-4 w-4" /> : null}
          {linkVisited ? <Check className="h-4 w-4" aria-label={copy.visited} /> : null}
        </button>
      );
    case "tabs":
      return (
        <div className="w-full max-w-sm">
          <div role="tablist" className="flex border-b border-white/10">
            {["preview", "usage", "code"].map((value, index) => (
              <button key={value} type="button" role="tab" aria-selected={tab === value} disabled={state === "disabled"} autoFocus={state === "focus" && index === 0} onClick={() => { setTab(value); onStateChange("Active"); }} className={`min-h-11 px-4 py-2 text-xs font-bold uppercase tracking-wider outline-none disabled:opacity-40 ${tab === value ? "border-b-2 border-primary text-primary" : state === "hover" && index === 0 ? "bg-white/5 text-white" : "text-slate-400"}`}>
                {value === "preview" ? copy.preview : value === "usage" ? copy.usage : copy.code}
              </button>
            ))}
          </div>
          <div role="tabpanel" className="p-5 text-sm text-slate-300">{intent}: {tab || copy.noActiveTab}</div>
        </div>
      );
    case "card":
      return (
        <button type="button" aria-pressed={cardSelected} disabled={state === "disabled" || state === "loading"} onClick={() => { const next = !cardSelected; setCardSelected(next); onStateChange(next ? "Selected" : "Default"); }} className={`min-h-11 w-full max-w-xs rounded-2xl border p-5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${cardSelected ? "border-primary/35 bg-primary/10" : state === "hover" ? "border-white/20 bg-white/[0.07]" : "border-white/10 bg-white/[0.03]"}`}>
          <CreditCard className="h-5 w-5 text-primary" />
          <p className="mt-4 text-sm font-bold text-white">{intent === "entity" ? copy.confidenceBadge : intent === "summary" ? copy.analysisSummary : copy.interactiveChoice}</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">{state === "loading" ? copy.loadingContent : copy.selectToCompare}</p>
        </button>
      );
    case "modal-dialog":
      return (
        <div className="text-center">
          <button type="button" disabled={state === "disabled"} onClick={() => { setModalOpen(true); onStateChange("Open"); }} className={`${previewButton} disabled:cursor-not-allowed disabled:opacity-40`}>{copy.openDialog}</button>
          {modalOpen ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/70 p-6">
              <div role="dialog" aria-modal="true" aria-labelledby="preview-dialog-title" className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface-container-high p-5 text-left shadow-panel">
                <div className="flex items-start justify-between">
                  <h4 id="preview-dialog-title" className="font-bold text-white">{intent === "edit" ? copy.editParameters : intent === "critical decision" ? copy.removeSource : copy.confirmDecision}</h4>
                  <button type="button" onClick={() => { setModalOpen(false); onStateChange("Closed"); }} aria-label={copy.close}><X className="h-4 w-4 text-slate-400" /></button>
                </div>
                <p className={`mt-3 text-xs leading-5 ${state === "error" ? "text-error" : "text-slate-400"}`}>{state === "error" ? copy.operationFailed : copy.auditRegistration}</p>
                <button type="button" disabled={state === "submitting" || state === "disabled"} onClick={() => { setModalOpen(false); onStateChange("Closed"); }} className={`mt-5 ${previewButton} disabled:cursor-wait disabled:opacity-50`}>{state === "submitting" ? copy.processing : copy.confirm}</button>
              </div>
            </div>
          ) : null}
        </div>
      );
    case "data-table": {
      const baseRows = state === "empty" ? [] : ascending ? ["Audit Panel", "Button", "Confidence Badge"] : ["Confidence Badge", "Button", "Audit Panel"];
      const rows = state === "loading" ? [copy.loading] : baseRows;
      return (
        <div className="w-full max-w-md overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-left text-xs">
            <caption className="sr-only">{intent === "compare" ? copy.compareComponents : intent === "inspect" ? copy.inspectComponents : copy.manageComponents}</caption>
            <thead className="bg-white/[0.04] text-slate-400">
              <tr><th className="px-4 py-3"><button type="button" onClick={() => { setAscending((value) => !value); onStateChange("Sorted"); }}>{copy.component} {ascending ? "↑" : "↓"}</button></th><th className="px-4 py-3">{copy.status}</th></tr>
            </thead>
            <tbody>
              {rows.map((row, index) => <tr key={row} className={`border-t border-white/[0.06] ${state === "selected row" && index === 0 ? "bg-primary/10" : ""}`}><td className="px-4 py-3 text-white">{row}</td><td className="px-4 py-3 text-primary">{state === "loading" ? "..." : copy.stable}</td></tr>)}
              {rows.length === 0 ? <tr><td colSpan={2} className="px-4 py-8 text-center text-slate-400">{copy.noResults}</td></tr> : null}
            </tbody>
          </table>
        </div>
      );
    }
    case "alert": {
      const alertTone = state === "error"
        ? "border-error/25 bg-error/[0.07] text-error"
        : state === "success"
          ? "border-[var(--velaris-color-success)]/25 bg-[color:rgba(126,231,135,0.07)] text-[var(--velaris-color-success)]"
          : state === "warning"
            ? "border-warning/20 bg-warning/[0.06] text-warning"
            : "border-primary/20 bg-primary/[0.06] text-primary";
      return alertVisible ? (
        <div role="alert" className={`flex w-full max-w-md items-start gap-3 rounded-xl border p-4 ${alertTone}`}>
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1"><p className="text-sm font-bold text-white">{intent === "warn" ? copy.attentionNeeded : intent === "block" ? copy.actionBlocked : copy.systemUpdate}</p><p className="mt-1 text-xs text-slate-400">{copy.reviewEvidence}</p></div>
          <button type="button" onClick={() => { setAlertVisible(false); onStateChange("Dismissed"); }} aria-label={copy.closeAlert}><X className="h-4 w-4 text-slate-400" /></button>
        </div>
      ) : <button type="button" onClick={() => { setAlertVisible(true); onStateChange("Info"); }} className={secondaryButton}>{copy.restoreAlert}</button>;
    }
    case "toast":
      return (
        <div className="text-center">
          <button type="button" onClick={() => { setToastVisible(true); onStateChange("Visible"); }} className={previewButton}>{copy.showNotification}</button>
          {toastVisible ? <div role="status" className={`mt-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold transition-[transform,opacity,background-color,border-color,color] ${intent === "success" ? "border-[var(--velaris-color-success)]/25 bg-[color:rgba(126,231,135,0.08)] text-[var(--velaris-color-success)]" : "border-primary/20 bg-primary/10 text-primary"} ${state === "entering" ? "translate-y-1 opacity-70" : state === "leaving" ? "-translate-y-1 opacity-40" : ""}`}><CheckCircle2 className="h-4 w-4" aria-hidden />{intent === "undo" ? copy.removedUndo : intent === "info" ? copy.syncStarted : copy.analysisComplete}</div> : null}
        </div>
      );
    case "skeleton-loader":
      return (
        <div className="w-full max-w-sm">
          <button type="button" onClick={() => { const next = !loaded; setLoaded(next); onStateChange(next ? "Loaded" : "Loading"); }} className={`${secondaryButton} mb-5`}>{loaded ? copy.showLoading : copy.loadContent}</button>
          {state === "error" ? <div role="alert" className="rounded-xl border border-error/20 bg-error/[0.06] p-4 text-sm text-error">{copy.loadFailure}</div> : loaded ? <div className="rounded-xl border border-white/10 p-4"><p className="font-semibold text-white">{copy.retrievedSource}</p><p className="mt-2 text-xs text-slate-400">{intent}: 92% {copy.match}</p></div> : <div aria-busy="true" className="space-y-3"><div className={`h-5 w-2/3 rounded bg-white/10 ${state === "reduced motion" ? "" : "animate-pulse"}`} /><div className={`h-3 w-full rounded bg-white/[0.06] ${state === "reduced motion" ? "" : "animate-pulse"}`} /><div className={`h-3 w-4/5 rounded bg-white/[0.06] ${state === "reduced motion" ? "" : "animate-pulse"}`} /></div>}
        </div>
      );
    case "explanation-tooltip":
      return (
        <div className="relative">
          <button type="button" aria-describedby="confidence-tip" onMouseEnter={() => { setTooltipOpen(true); onStateChange("Hover"); }} onMouseLeave={() => { setTooltipOpen(false); onStateChange("Closed"); }} onFocus={() => { setTooltipOpen(true); onStateChange("Focus"); }} onBlur={() => { setTooltipOpen(false); onStateChange("Closed"); }} className={secondaryButton}>
            {intent === "shortcut" ? copy.shortcut : intent === "definition" ? copy.definition : copy.explanation} <MessageCircleQuestion className="ml-1 inline h-4 w-4" />
          </button>
          {tooltipOpen ? <div id="confidence-tip" role="tooltip" className="absolute bottom-full left-1/2 mb-3 w-64 -translate-x-1/2 rounded-xl border border-primary/20 bg-surface-container-high p-3 text-xs leading-5 text-slate-300 shadow-panel">{copy.calibratedTooltip}</div> : null}
        </div>
      );
    case "confidence-badge": {
      const tier = confidence >= 80 ? copy.high : confidence >= 55 ? copy.medium : copy.low;
      return (
        <div className="w-full max-w-sm">
          <div className={`flex items-center justify-between rounded-xl border p-4 ${state === "unavailable" ? "border-white/10 bg-white/[0.03] opacity-50" : confidence >= 80 ? "border-[var(--velaris-color-success)]/20 bg-[color:rgba(126,231,135,0.06)]" : confidence >= 55 ? "border-warning/20 bg-warning/[0.05]" : "border-error/20 bg-error/[0.05]"}`}><span className="text-sm font-semibold text-white">{intent === "warn" ? copy.confidenceRisk : intent === "support trust" ? copy.confidenceEvidence : copy.confidence} {state === "unavailable" ? copy.unavailable : tier}</span><span className="rounded-full bg-primary/15 px-3 py-1 text-sm font-black text-primary">{state === "unavailable" ? "-" : `${confidence}%`}</span></div>
          <input aria-label={copy.confidence} disabled={state === "unavailable" || state === "inspecting"} type="range" min="25" max="98" value={confidence} onChange={(event) => { const value = Number(event.target.value); setConfidence(value); onStateChange(value >= 80 ? "High" : value >= 55 ? "Medium" : "Low"); }} className="mt-5 w-full accent-primary disabled:opacity-40" />
        </div>
      );
    }
    case "command-palette": {
      const commands = [copy.openComponents, copy.queryConfidenceBadge, copy.inspectAuditPanel].filter((command) => command.toLowerCase().includes(commandQuery.toLowerCase()));
      return (
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <label className="flex min-h-11 items-center gap-3 border-b border-white/10 px-4 py-3"><Command className="h-4 w-4 text-primary" /><input disabled={state === "closed" || state === "executing"} value={commandQuery} onChange={(event) => { setCommandQuery(event.target.value); onStateChange(event.target.value ? "Searching" : "Results"); }} placeholder={intent === "navigate" ? copy.goTo : intent === "execute" ? copy.executeAction : copy.searchCommand} className="w-full bg-transparent text-sm text-white outline-none disabled:opacity-40" /></label>
          <div className="p-2">{state === "closed" ? <p className="px-3 py-4 text-xs text-slate-400">{copy.paletteClosed}</p> : commands.map((command) => <button key={command} type="button" onClick={() => onStateChange("Executing")} className="block min-h-11 w-full rounded-lg px-3 py-2 text-left text-xs text-slate-300 hover:bg-white/5 hover:text-white">{command}</button>)}{state !== "closed" && commands.length === 0 ? <p className="px-3 py-4 text-xs text-slate-400">{copy.noCommand}</p> : null}</div>
        </div>
      );
    }
    case "source-attribution":
      return (
        <div className="w-full max-w-md">
          <button type="button" disabled={state === "unavailable"} aria-expanded={sourceOpen} onClick={() => { const next = !sourceOpen; setSourceOpen(next); onStateChange(next ? "Expanded" : "Collapsed"); }} className="flex min-h-11 w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left disabled:cursor-not-allowed disabled:opacity-40"><span className="flex items-center gap-2 text-sm font-semibold text-white"><BookOpenCheck className="h-4 w-4 text-primary" />{intent === "verify" ? copy.verifiedSource : intent === "inspect" ? copy.inspectExcerpt : "ComponentsPage.tsx"}</span><span className="text-xs font-bold text-primary">{state === "partial match" ? "54%" : state === "unavailable" ? "-" : `92% ${copy.match}`}</span></button>
          {sourceOpen ? <div className="mt-2 rounded-xl border border-white/[0.07] bg-black/20 p-4 text-xs leading-5 text-slate-400">{copy.sourceEvidence}</div> : null}
        </div>
      );
    case "audit-panel":
      return (
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.025] p-4">
          <button type="button" aria-expanded={auditOpen} onClick={() => { const next = !auditOpen; setAuditOpen(next); onStateChange(next ? "Expanded" : "Collapsed"); }} className="flex min-h-11 w-full items-center justify-between"><span className="flex items-center gap-2 text-sm font-semibold text-white"><ListChecks className="h-4 w-4 text-primary" />{intent === "govern" ? copy.governance : intent === "debug" ? copy.diagnosis : copy.decisionTrail}</span><span className="text-xs font-bold text-primary">{auditOpen ? copy.collapse : copy.inspect}</span></button>
          <div className="mt-4 grid grid-cols-3 gap-2">{["Retrieval", "Ranking", "Synthesis"].map((stage, index) => <div key={stage} className={`rounded-lg border p-2 text-center ${state === "conflict" && index === 1 ? "border-error/30 bg-error/[0.06]" : "border-white/[0.07] bg-black/20"}`}><Check className={`mx-auto h-3.5 w-3.5 ${state === "running" && index === 2 ? "animate-pulse text-warning" : state === "conflict" && index === 1 ? "text-error" : "text-primary"}`} aria-hidden /><p className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">{stage}</p></div>)}</div>
          {auditOpen ? <div className="mt-4 border-t border-white/[0.07] pt-4 text-xs leading-5 text-slate-400">{state === "conflict" ? copy.sourceConflict : state === "running" ? copy.auditRunning : copy.auditSummary}</div> : null}
        </div>
      );
    case "typography":
      return (
        <button type="button" onClick={() => { const next = !displayType; setDisplayType(next); onStateChange(next ? "Display" : "Heading"); }} className="min-h-11 text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">{intent === "metadata" ? copy.metadata : intent === "reading" ? copy.continuousReading : copy.typeScale}</p>
          <p className={`mt-3 tracking-tight text-white transition-[font-size,line-height,letter-spacing] ${state === "code" ? "font-mono text-lg" : state === "caption" || state === "label" ? "text-xs font-bold uppercase tracking-widest" : displayType ? "text-5xl font-black" : "text-3xl font-black"}`}>{copy.explainableEvidence}</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">{copy.toggleTypeScale}</p>
        </button>
      );
    case "icon": {
      const icons = [ShieldPreview, SourcePreview, AuditPreview];
      const ActiveIcon = icons[iconIndex] ?? ShieldPreview;
      if (state === "decorative") {
        return (
          <div className="text-center">
            <span aria-hidden className="flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/15 bg-primary/[0.06] text-primary/60">
              <ActiveIcon className="h-9 w-9" />
            </span>
            <p className="mt-3 text-xs text-slate-400">{copy.decorativeIcon}</p>
          </div>
        );
      }
      return (
        <div className="text-center">
          <button type="button" disabled={state === "disabled"} onClick={() => { setIconIndex((value) => (value + 1) % icons.length); onStateChange("Active"); }} className={`flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary transition-colors hover:bg-primary/15 disabled:opacity-40 ${state === "active" ? "ring-2 ring-primary/50" : ""}`} aria-label={intent === "status" ? copy.toggleStatusIcon : copy.toggleIcon}>
            <ActiveIcon className="h-9 w-9" />
          </button>
          <p className="mt-3 text-xs text-slate-400">{intent}: {copy.clickToChangeSymbol}</p>
        </div>
      );
    }
  }
}

function ShieldPreview({ className }: { className?: string }) {
  return <CheckCircle2 className={className} />;
}

function SourcePreview({ className }: { className?: string }) {
  return <BookOpenCheck className={className} />;
}

function AuditPreview({ className }: { className?: string }) {
  return <ListChecks className={className} />;
}

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
  const [playgroundConfigs, setPlaygroundConfigs] = useState<Record<ComponentId, ComponentPlaygroundConfig>>(
    () => Object.fromEntries(
      COMPONENT_CATALOG.map((item) => [
        item.id,
        createInitialPlaygroundConfig(item.id, item.states, item.intents),
      ]),
    ) as Record<ComponentId, ComponentPlaygroundConfig>,
  );
  const [snippetDrafts, setSnippetDrafts] = useState<Record<ComponentId, string>>(
    () => Object.fromEntries(
      COMPONENT_CATALOG.map((item) => {
        const config = createInitialPlaygroundConfig(item.id, item.states, item.intents);
        return [item.id, generateComponentSnippet(item.id, config, locale)];
      }),
    ) as Record<ComponentId, string>,
  );
  const [snippetErrors, setSnippetErrors] = useState<Partial<Record<ComponentId, SnippetError>>>({});

  useEffect(() => {
    setSnippetDrafts(
      Object.fromEntries(
        COMPONENT_CATALOG.map((item) => [
          item.id,
          generateComponentSnippet(item.id, playgroundConfigs[item.id], locale),
        ]),
      ) as Record<ComponentId, string>,
    );
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
  const activeConfig = playgroundConfigs[selected.id];
  const activeSnippet = snippetDrafts[selected.id];
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
                      <InteractivePreview
                        key={selected.id}
                        item={selected}
                        config={activeConfig}
                        onStateChange={(state) => updatePlaygroundConfig({ state })}
                      />
                      <article
                        data-intent-explanation={activeConfig.intent}
                        className="w-full max-w-md rounded-xl border border-white/[0.08] bg-black/20 p-4 text-left"
                      >
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                          Intent: {activeConfig.intent}
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
                  <p className="component-detail-slot-eyebrow" aria-hidden="true">
                    {ui.preview}
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
      </PageShell>
    </div>
  );
}
