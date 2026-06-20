import {
  AlignLeft,
  Bell,
  BookOpenCheck,
  CalendarDays,
  CircleDot,
  Command,
  CreditCard,
  FormInput,
  Gauge,
  Link2,
  ListChecks,
  ListFilter,
  LoaderCircle,
  MessageCircleQuestion,
  MousePointerClick,
  PanelTop,
  PanelsTopLeft,
  Shapes,
  SquareCheckBig,
  Table2,
  Tags,
  TextCursorInput,
  ToggleLeft,
  TriangleAlert,
  Type,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Locale } from "../i18n/translations";
import {
  getComponentAccessibilityCriteria,
  type ComponentAccessibilityCriterion,
} from "./componentAccessibilityPresentation";
import type { ComponentId } from "./componentWorkbench";
import {
  ensureComponentCatalog,
  getComponentMetadataById,
  getComponentMetadataList,
  localizedRuleTexts,
  localizedText,
} from "./componentMetadata";

export type SectionId =
  | "actions"
  | "forms"
  | "structure"
  | "feedback"
  | "intelligence";

export interface ComponentDoc {
  id: ComponentId;
  section: SectionId;
  title: string;
  status: string;
  shortDescription: string;
  about: string;
  aboutFeatures: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  commonUses: string[];
  logic: string;
  structure: string;
  whenToUse: string;
  whenNotToUse: string;
  tradeOffs: string;
  accessibility: {
    summary: string;
    items: string[];
    criteria: ComponentAccessibilityCriterion[];
  };
  ragRelation: string;
  beatriceGuidance: string;
  insight: string;
  states: string[];
  intents: string[];
  icon: LucideIcon;
}

export interface ComponentUsageGuidance {
  do: string[];
  dont: string[];
}

export interface IntentExplanation {
  description: string;
  example: string;
}

const ICONS: Record<ComponentId, LucideIcon> = {
  button: MousePointerClick,
  "toggle-switch": ToggleLeft,
  checkbox: SquareCheckBig,
  "radio-button": CircleDot,
  "selectable-chip": Tags,
  "text-input": TextCursorInput,
  "text-area": AlignLeft,
  "select-dropdown": ListFilter,
  "date-picker": CalendarDays,
  "form-field": FormInput,
  link: Link2,
  tabs: PanelTop,
  card: CreditCard,
  "modal-dialog": PanelsTopLeft,
  "data-table": Table2,
  alert: TriangleAlert,
  toast: Bell,
  "skeleton-loader": LoaderCircle,
  "explanation-tooltip": MessageCircleQuestion,
  "confidence-badge": Gauge,
  "command-palette": Command,
  "source-attribution": BookOpenCheck,
  "audit-panel": ListChecks,
  typography: Type,
  icon: Shapes,
};

const UI_SECTIONS: Record<ComponentId, SectionId> = {
  button: "actions",
  "toggle-switch": "actions",
  checkbox: "actions",
  "radio-button": "actions",
  "selectable-chip": "actions",
  "text-input": "forms",
  "text-area": "forms",
  "select-dropdown": "forms",
  "date-picker": "forms",
  "form-field": "forms",
  link: "structure",
  tabs: "structure",
  card: "structure",
  "modal-dialog": "structure",
  "data-table": "structure",
  alert: "feedback",
  toast: "feedback",
  "skeleton-loader": "feedback",
  "explanation-tooltip": "feedback",
  "confidence-badge": "feedback",
  "command-palette": "intelligence",
  "source-attribution": "intelligence",
  "audit-panel": "intelligence",
  typography: "intelligence",
  icon: "intelligence",
};

function statusLabel(status: string): string {
  return `${status.charAt(0).toUpperCase()}${status.slice(1)}`;
}

export async function getComponentCatalog(locale: Locale): Promise<ComponentDoc[]> {
  await ensureComponentCatalog();
  return getComponentMetadataList().map((component) => {
    const shortDescription = localizedText(component.description, locale);
    const logic = localizedText(component.logic, locale);
    const structure = localizedText(component.structure, locale);
    const accessibilityItems = component.accessibility?.items?.length
      ? component.accessibility.items.map((entry) => localizedText(entry.description, locale))
      : [
          ...(localizedRuleTexts(component.accessibility?.keyboard ?? null, locale) ?? []),
          ...(component.accessibility?.aria ?? []).map((rule) => localizedText(rule.text, locale)),
        ];
    const accessibilitySummary = localizedText(component.accessibility?.summary ?? null, locale);
    const keyboardRules = localizedRuleTexts(component.accessibility?.keyboard ?? null, locale) ?? [];
    const ariaRules = (component.accessibility?.aria ?? []).map((rule) => localizedText(rule.text, locale));
    const ragRelation = localizedText(component.rag_relation, locale);

    return {
      id: component.component_id,
      section: UI_SECTIONS[component.component_id],
      title: component.name,
      status: statusLabel(component.status),
      shortDescription,
      about: localizedText(component.about, locale),
      aboutFeatures: component.about_features.map((feature) => ({
        icon: feature.icon,
        title: localizedText(feature.title, locale),
        description: localizedText(feature.description, locale),
      })),
      commonUses: component.common_uses.map((use) => localizedText(use, locale)),
      logic,
      structure,
      whenToUse: (localizedRuleTexts(component.when_to_use, locale) ?? []).join(" "),
      whenNotToUse: (localizedRuleTexts(component.when_not_to_use, locale) ?? []).join(" "),
      tradeOffs: localizedText(component.trade_offs, locale),
      accessibility: {
        summary: accessibilitySummary,
        items: accessibilityItems,
        criteria: getComponentAccessibilityCriteria(
          component.component_id,
          locale,
          accessibilitySummary,
          keyboardRules,
          ariaRules,
          component.accessibility?.items,
        ),
      },
      ragRelation,
      beatriceGuidance: ragRelation,
      insight: localizedText(component.aetheris_insight, locale),
      states: (component.states ?? []).map((state) => localizedText(state.label, locale)),
      intents: (component.intents ?? []).map((intent) => localizedText(intent.label, locale)),
      icon: ICONS[component.component_id],
    };
  });
}

export function getComponentUsageGuidance(
  componentId: ComponentId,
  locale: Locale,
): ComponentUsageGuidance {
  const component = getComponentMetadataById(componentId);
  if (!component) return { do: [], dont: [] };
  return {
    do: localizedRuleTexts(component.do, locale) ?? [],
    dont: localizedRuleTexts(component.dont, locale) ?? [],
  };
}

export function getIntentExplanation(
  componentId: ComponentId,
  intentValue: string,
  locale: Locale,
): IntentExplanation {
  const component = getComponentMetadataById(componentId);
  const normalized = intentValue.trim().toLowerCase();
  const intent = component?.intents?.find((candidate) => (
    candidate.id.toLowerCase() === normalized
    || candidate.label.pt.toLowerCase() === normalized
    || candidate.label.en?.toLowerCase() === normalized
  ));
  if (intent?.description && intent.example) {
    return {
      description: localizedText(intent.description, locale),
      example: localizedText(intent.example, locale),
    };
  }
  return locale === "en-US"
    ? {
        description: "Describes the purpose this component serves in the current context.",
        example: "The preview demonstrates how this intent changes component usage.",
      }
    : {
        description: "Descreve a finalidade que este componente atende no contexto atual.",
        example: "O preview demonstra como esse intent altera o uso do componente.",
      };
}
