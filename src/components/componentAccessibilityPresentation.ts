import type { Locale } from "../i18n/translations";
import type { AccessibilityItem } from "./componentMetadata";
import { localizedText } from "./componentMetadata";
import type { ComponentId } from "./componentWorkbench";

export type ComponentAccessibilityCriterionIcon =
  | "keyboard"
  | "quality"
  | "semantics";

export interface ComponentAccessibilityCriterion {
  icon: ComponentAccessibilityCriterionIcon;
  title: string;
  description: string;
}

interface CriterionTitle {
  pt: string;
  en: string;
}

interface CriterionTitles {
  keyboard: CriterionTitle;
  semantics: CriterionTitle;
  quality: CriterionTitle;
}

const CRITERION_TITLES: Partial<Record<ComponentId, CriterionTitles>> = {
  button: {
    keyboard: { pt: "Teclado", en: "Keyboard" },
    semantics: { pt: "Anúncio", en: "Announcement" },
    quality: { pt: "Foco e alvo", en: "Focus and target" },
  },
  "toggle-switch": {
    keyboard: { pt: "Alternância", en: "Toggle control" },
    semantics: { pt: "Estado", en: "State" },
    quality: { pt: "Rótulo claro", en: "Clear label" },
  },
  checkbox: {
    keyboard: { pt: "Teclado", en: "Keyboard" },
    semantics: { pt: "Estado misto", en: "Mixed state" },
    quality: { pt: "Label associado", en: "Associated label" },
  },
  "radio-button": {
    keyboard: { pt: "Navegação", en: "Navigation" },
    semantics: { pt: "Grupo nomeado", en: "Named group" },
    quality: { pt: "Escolha única", en: "Single choice" },
  },
  "selectable-chip": {
    keyboard: { pt: "Teclado", en: "Keyboard" },
    semantics: { pt: "Seleção", en: "Selection" },
    quality: { pt: "Alvo e foco", en: "Target and focus" },
  },
  "text-input": {
    keyboard: { pt: "Edição", en: "Editing" },
    semantics: { pt: "Campo descrito", en: "Described field" },
    quality: { pt: "Erro e foco", en: "Error and focus" },
  },
  "text-area": {
    keyboard: { pt: "Edição multilinha", en: "Multiline editing" },
    semantics: { pt: "Instruções", en: "Instructions" },
    quality: { pt: "Limites e foco", en: "Limits and focus" },
  },
  "select-dropdown": {
    keyboard: { pt: "Navegação", en: "Navigation" },
    semantics: { pt: "Trigger e lista", en: "Trigger and list" },
    quality: { pt: "Valor anunciado", en: "Announced value" },
  },
  "date-picker": {
    keyboard: { pt: "Entrada flexível", en: "Flexible input" },
    semantics: { pt: "Formato e erro", en: "Format and error" },
    quality: { pt: "Calendário operável", en: "Operable calendar" },
  },
  "form-field": {
    keyboard: { pt: "Ordem de foco", en: "Focus order" },
    semantics: { pt: "Relações", en: "Relationships" },
    quality: { pt: "Validação", en: "Validation" },
  },
  link: {
    keyboard: { pt: "Ativação", en: "Activation" },
    semantics: { pt: "Destino", en: "Destination" },
    quality: { pt: "Foco visível", en: "Visible focus" },
  },
  tabs: {
    keyboard: { pt: "Navegação", en: "Navigation" },
    semantics: { pt: "Relações", en: "Relationships" },
    quality: { pt: "Painel ativo", en: "Active panel" },
  },
  card: {
    keyboard: { pt: "Interação", en: "Interaction" },
    semantics: { pt: "Nome e estado", en: "Name and state" },
    quality: { pt: "Hierarquia", en: "Hierarchy" },
  },
  "modal-dialog": {
    keyboard: { pt: "Contenção de foco", en: "Focus containment" },
    semantics: { pt: "Semântica", en: "Semantics" },
    quality: { pt: "Fechamento seguro", en: "Safe dismissal" },
  },
  "data-table": {
    keyboard: { pt: "Controles", en: "Controls" },
    semantics: { pt: "Estrutura", en: "Structure" },
    quality: { pt: "Ordenação", en: "Sorting" },
  },
  alert: {
    keyboard: { pt: "Ações", en: "Actions" },
    semantics: { pt: "Urgência", en: "Urgency" },
    quality: { pt: "Texto e cor", en: "Text and color" },
  },
  toast: {
    keyboard: { pt: "Ações", en: "Actions" },
    semantics: { pt: "Live region", en: "Live region" },
    quality: { pt: "Tempo e pausa", en: "Timing and pause" },
  },
  "skeleton-loader": {
    keyboard: { pt: "Sem foco", en: "No focus" },
    semantics: { pt: "Estado busy", en: "Busy state" },
    quality: { pt: "Movimento reduzido", en: "Reduced motion" },
  },
  "explanation-tooltip": {
    keyboard: { pt: "Foco e Escape", en: "Focus and Escape" },
    semantics: { pt: "Relação", en: "Relationship" },
    quality: { pt: "Retorno ao trigger", en: "Trigger return" },
  },
  "confidence-badge": {
    keyboard: { pt: "Inspeção", en: "Inspection" },
    semantics: { pt: "Valor em texto", en: "Text value" },
    quality: { pt: "Contraste e escala", en: "Contrast and scale" },
  },
  "command-palette": {
    keyboard: { pt: "Teclado completo", en: "Full keyboard" },
    semantics: { pt: "Combobox", en: "Combobox" },
    quality: { pt: "Atalho e retorno", en: "Shortcut and return" },
  },
  "source-attribution": {
    keyboard: { pt: "Divulgação", en: "Disclosure" },
    semantics: { pt: "Estado expandido", en: "Expanded state" },
    quality: { pt: "Ordem de leitura", en: "Reading order" },
  },
  "audit-panel": {
    keyboard: { pt: "Navegação", en: "Navigation" },
    semantics: { pt: "Estrutura", en: "Structure" },
    quality: { pt: "Estados textuais", en: "Text states" },
  },
  typography: {
    keyboard: { pt: "Conteúdo real", en: "Real content" },
    semantics: { pt: "Hierarquia", en: "Hierarchy" },
    quality: { pt: "Zoom e contraste", en: "Zoom and contrast" },
  },
  icon: {
    keyboard: { pt: "Ativação", en: "Activation" },
    semantics: { pt: "Nome acessível", en: "Accessible name" },
    quality: { pt: "Alvo e decoração", en: "Target and decoration" },
  },
};

const FALLBACK_TITLES: CriterionTitles = {
  keyboard: { pt: "Teclado", en: "Keyboard" },
  semantics: { pt: "Semântica", en: "Semantics" },
  quality: { pt: "Qualidade de uso", en: "Usage quality" },
};

function titleFor(title: CriterionTitle, locale: Locale): string {
  return locale === "en-US" ? title.en : title.pt;
}

function criteriaFromItems(
  items: AccessibilityItem[],
  locale: Locale,
): ComponentAccessibilityCriterion[] {
  return items.map((entry) => ({
    icon: entry.icon,
    title: localizedText(entry.title, locale),
    description: localizedText(entry.description, locale),
  }));
}

function criteriaFromLegacyBuckets(
  componentId: ComponentId,
  locale: Locale,
  summary: string,
  keyboardRules: string[],
  ariaRules: string[],
): ComponentAccessibilityCriterion[] {
  const titles = CRITERION_TITLES[componentId] ?? FALLBACK_TITLES;

  return [
    {
      icon: "keyboard",
      title: titleFor(titles.keyboard, locale),
      description: keyboardRules.join(" ") || summary,
    },
    {
      icon: "semantics",
      title: titleFor(titles.semantics, locale),
      description: ariaRules.join(" ") || summary,
    },
    {
      icon: "quality",
      title: titleFor(titles.quality, locale),
      description: summary,
    },
  ];
}

export function getComponentAccessibilityCriteria(
  componentId: ComponentId,
  locale: Locale,
  summary: string,
  keyboardRules: string[],
  ariaRules: string[],
  items: AccessibilityItem[] | null | undefined = null,
): ComponentAccessibilityCriterion[] {
  if (items && items.length >= 5) {
    return criteriaFromItems(items, locale);
  }

  return criteriaFromLegacyBuckets(
    componentId,
    locale,
    summary,
    keyboardRules,
    ariaRules,
  );
}
