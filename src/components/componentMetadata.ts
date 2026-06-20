import { localizeContent } from "../i18n/localizedContent";
import type { Locale } from "../i18n/translations";
import type { ComponentId } from "./componentWorkbench";

export type ComponentStatus = "draft" | "experimental" | "stable" | "deprecated" | "legacy";
export type ComponentSection =
  | "structure"
  | "action"
  | "input"
  | "feedback"
  | "navigation"
  | "content"
  | "layout"
  | "overlay"
  | "data_display";

export interface LocalizedText {
  pt: string;
  en: string | null;
}

export interface LocalizedRule {
  id: string;
  text: LocalizedText;
}

export interface NamedItem {
  id: string;
  label: LocalizedText;
}

export interface IntentItem extends NamedItem {
  description: LocalizedText | null;
  example: LocalizedText | null;
}

export interface AriaRule {
  id: string;
  attribute: string;
  value: string | null;
  text: LocalizedText;
}

export interface ExampleItem {
  id: string;
  title: LocalizedText | null;
  text: LocalizedText;
}

export type AccessibilityCriterionIcon = "keyboard" | "quality" | "semantics";
export type AccessibilityAudience = "designer" | "developer" | "product-designer" | "qa";
export type AccessibilitySeverity = "essential" | "recommended";

export interface AccessibilityItem {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  icon: AccessibilityCriterionIcon;
  applies_to: AccessibilityAudience[];
  severity: AccessibilitySeverity;
}

export interface AccessibilityMetadata {
  summary: LocalizedText | null;
  keyboard: LocalizedRule[] | null;
  aria: AriaRule[] | null;
  items?: AccessibilityItem[] | null;
}

export interface ComponentAboutFeature {
  icon: string;
  title: LocalizedText;
  description: LocalizedText;
}

export interface ComponentMetadata {
  component_id: ComponentId;
  name: string;
  status: ComponentStatus;
  section: ComponentSection;
  description: LocalizedText | null;
  about: LocalizedText;
  about_features: ComponentAboutFeature[];
  common_uses: LocalizedText[];
  logic: LocalizedText | null;
  structure: LocalizedText | null;
  intent: IntentItem | null;
  intents: IntentItem[] | null;
  variants: NamedItem[] | null;
  states: NamedItem[] | null;
  do: LocalizedRule[] | null;
  dont: LocalizedRule[] | null;
  when_to_use: LocalizedRule[] | null;
  when_not_to_use: LocalizedRule[] | null;
  accessibility: AccessibilityMetadata | null;
  edge_cases: LocalizedRule[] | null;
  content_guidelines: LocalizedRule[] | null;
  governance_notes: LocalizedRule[] | null;
  related_components: ComponentId[] | null;
  examples: ExampleItem[] | null;
  anti_patterns: LocalizedRule[] | null;
  trade_offs: LocalizedText | null;
  rag_relation: LocalizedText | null;
  aetheris_insight: LocalizedText | null;
  provenance: Record<string, string[]>;
}

export interface ComponentCatalog {
  schema_version: "1.0.0";
  components: ComponentMetadata[];
}

const STATUSES = new Set<ComponentStatus>(["draft", "experimental", "stable", "deprecated", "legacy"]);
const SECTIONS = new Set<ComponentSection>([
  "structure",
  "action",
  "input",
  "feedback",
  "navigation",
  "content",
  "layout",
  "overlay",
  "data_display",
]);
const PLACEHOLDER_PATTERN = /\b(?:lorem ipsum|tbd|coming soon|fill me)\b|todo\s*:/i;

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Invalid component metadata: ${message}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateLocalizedText(value: unknown, path: string): asserts value is LocalizedText {
  invariant(isRecord(value), `${path} must be an object`);
  invariant(typeof value.pt === "string" && value.pt.length > 0, `${path}.pt must be non-empty`);
  invariant(value.en === null || typeof value.en === "string", `${path}.en must be string or null`);
  invariant(!PLACEHOLDER_PATTERN.test(value.pt), `${path}.pt contains placeholder content`);
  if (typeof value.en === "string") {
    invariant(!PLACEHOLDER_PATTERN.test(value.en), `${path}.en contains placeholder content`);
  }
}

function validateLocalizedRule(value: unknown, path: string): asserts value is LocalizedRule {
  invariant(isRecord(value), `${path} must be an object`);
  invariant(typeof value.id === "string" && value.id.length > 0, `${path}.id must be non-empty`);
  validateLocalizedText(value.text, `${path}.text`);
}

function validateNullableList(
  value: unknown,
  path: string,
  validateItem: (item: unknown, itemPath: string) => void,
): void {
  if (value === null) return;
  invariant(Array.isArray(value), `${path} must be an array or null`);
  value.forEach((item, index) => validateItem(item, `${path}[${index}]`));
}

function validateNamedItem(value: unknown, path: string): asserts value is NamedItem {
  invariant(isRecord(value), `${path} must be an object`);
  invariant(typeof value.id === "string" && value.id.length > 0, `${path}.id must be non-empty`);
  validateLocalizedText(value.label, `${path}.label`);
}

function validateIntent(value: unknown, path: string): asserts value is IntentItem {
  validateNamedItem(value, path);
  const intent = value as unknown as Record<string, unknown>;
  if (intent.description !== null) validateLocalizedText(intent.description, `${path}.description`);
  if (intent.example !== null) validateLocalizedText(intent.example, `${path}.example`);
}

function validateAccessibilityItem(value: unknown, path: string): asserts value is AccessibilityItem {
  invariant(isRecord(value), `${path} must be an object`);
  invariant(typeof value.id === "string" && value.id.length > 0, `${path}.id must be non-empty`);
  validateLocalizedText(value.title, `${path}.title`);
  validateLocalizedText(value.description, `${path}.description`);
  invariant(
    value.icon === "keyboard" || value.icon === "semantics" || value.icon === "quality",
    `${path}.icon must be keyboard, semantics, or quality`,
  );
  if (value.applies_to !== undefined && value.applies_to !== null) {
    invariant(Array.isArray(value.applies_to), `${path}.applies_to must be an array`);
    value.applies_to.forEach((audience, index) => {
      invariant(
        audience === "designer"
          || audience === "developer"
          || audience === "product-designer"
          || audience === "qa",
        `${path}.applies_to[${index}] is invalid`,
      );
    });
  }
  if (value.severity !== undefined) {
    invariant(
      value.severity === "essential" || value.severity === "recommended",
      `${path}.severity must be essential or recommended`,
    );
  }
}

function validateAboutFeature(value: unknown, path: string): asserts value is ComponentAboutFeature {
  invariant(isRecord(value), `${path} must be an object`);
  invariant(typeof value.icon === "string" && value.icon.length > 0, `${path}.icon must be non-empty`);
  validateLocalizedText(value.title, `${path}.title`);
  validateLocalizedText(value.description, `${path}.description`);
}

function validateComponent(value: unknown, index: number): asserts value is ComponentMetadata {
  const path = `components[${index}]`;
  invariant(isRecord(value), `${path} must be an object`);
  invariant(typeof value.component_id === "string" && value.component_id.length > 0, `${path}.component_id`);
  invariant(typeof value.name === "string" && value.name.length > 0, `${path}.name`);
  invariant(STATUSES.has(value.status as ComponentStatus), `${path}.status`);
  invariant(SECTIONS.has(value.section as ComponentSection), `${path}.section`);
  for (const field of ["description", "about", "logic", "structure", "rag_relation", "aetheris_insight"] as const) {
    invariant(value[field] !== null, `${path}.${field} is required`);
  }

  for (const field of ["description", "about", "logic", "structure", "trade_offs", "rag_relation", "aetheris_insight"] as const) {
    if (value[field] !== null) validateLocalizedText(value[field], `${path}.${field}`);
  }
  validateNullableList(value.about_features, `${path}.about_features`, validateAboutFeature);
  validateNullableList(value.common_uses, `${path}.common_uses`, validateLocalizedText);
  invariant(
    Array.isArray(value.about_features) && value.about_features.length >= 3 && value.about_features.length <= 4,
    `${path}.about_features must contain three or four items`,
  );
  invariant(
    Array.isArray(value.common_uses) && value.common_uses.length >= 4 && value.common_uses.length <= 6,
    `${path}.common_uses must contain four to six items`,
  );
  if (value.intent !== null) validateIntent(value.intent, `${path}.intent`);
  validateNullableList(value.intents, `${path}.intents`, validateIntent);
  validateNullableList(value.variants, `${path}.variants`, validateNamedItem);
  validateNullableList(value.states, `${path}.states`, validateNamedItem);
  invariant(Array.isArray(value.states) && value.states.length > 0, `${path}.states must contain a real state`);
  invariant(Array.isArray(value.intents) && value.intents.length > 0, `${path}.intents must contain a real intent`);
  for (const field of [
    "do",
    "dont",
    "when_to_use",
    "when_not_to_use",
    "edge_cases",
    "content_guidelines",
    "governance_notes",
    "anti_patterns",
  ] as const) {
    validateNullableList(value[field], `${path}.${field}`, validateLocalizedRule);
  }
  invariant(Array.isArray(value.do) && value.do.length === 5, `${path}.do must contain exactly five items`);
  invariant(Array.isArray(value.dont) && value.dont.length === 5, `${path}.dont must contain exactly five items`);
  invariant(value.accessibility === null || isRecord(value.accessibility), `${path}.accessibility`);
  if (isRecord(value.accessibility)) {
    if (value.accessibility.summary !== null) {
      validateLocalizedText(value.accessibility.summary, `${path}.accessibility.summary`);
    }
    validateNullableList(value.accessibility.keyboard, `${path}.accessibility.keyboard`, validateLocalizedRule);
    validateNullableList(value.accessibility.aria, `${path}.accessibility.aria`, (item, itemPath) => {
      invariant(isRecord(item), `${itemPath} must be an object`);
      invariant(typeof item.id === "string" && item.id.length > 0, `${itemPath}.id`);
      invariant(typeof item.attribute === "string" && item.attribute.length > 0, `${itemPath}.attribute`);
      invariant(item.value === null || typeof item.value === "string", `${itemPath}.value`);
      validateLocalizedText(item.text, `${itemPath}.text`);
    });
    validateNullableList(value.accessibility.items, `${path}.accessibility.items`, validateAccessibilityItem);
  }
  invariant(isRecord(value.accessibility), `${path}.accessibility is required`);
  invariant(value.accessibility.summary !== null, `${path}.accessibility.summary is required`);
  invariant(
    Array.isArray(value.accessibility.keyboard) && value.accessibility.keyboard.length > 0,
    `${path}.accessibility.keyboard must contain guidance`,
  );
  invariant(
    Array.isArray(value.accessibility.aria) && value.accessibility.aria.length > 0,
    `${path}.accessibility.aria must contain guidance`,
  );
  invariant(
    Array.isArray(value.accessibility.items) && value.accessibility.items.length >= 5,
    `${path}.accessibility.items must contain at least five items`,
  );
  validateNullableList(value.related_components, `${path}.related_components`, (item, itemPath) => {
    invariant(typeof item === "string" && item.length > 0, `${itemPath} must be a component id`);
  });
  validateNullableList(value.examples, `${path}.examples`, (item, itemPath) => {
    invariant(isRecord(item), `${itemPath} must be an object`);
    invariant(typeof item.id === "string" && item.id.length > 0, `${itemPath}.id`);
    if (item.title !== null) validateLocalizedText(item.title, `${itemPath}.title`);
    validateLocalizedText(item.text, `${itemPath}.text`);
  });
  invariant(isRecord(value.provenance), `${path}.provenance`);
  Object.entries(value.provenance).forEach(([field, sources]) => {
    invariant(field.length > 0, `${path}.provenance field must be non-empty`);
    invariant(Array.isArray(sources) && sources.length > 0, `${path}.provenance.${field}`);
    invariant(sources.every((source) => typeof source === "string" && source.length > 0), `${path}.provenance.${field}`);
  });
}

export function validateComponentCatalog(value: unknown): ComponentCatalog {
  invariant(isRecord(value), "catalog must be an object");
  invariant(value.schema_version === "1.0.0", "unsupported schema_version");
  invariant(Array.isArray(value.components), "components must be an array");
  value.components.forEach(validateComponent);

  const components = value.components as ComponentMetadata[];
  const componentIds = components.map((component) => component.component_id);
  invariant(new Set(componentIds).size === componentIds.length, "component_id must be unique");
  const componentIdSet = new Set(componentIds);
  components.forEach((component) => {
    (component.related_components ?? []).forEach((relatedId) => {
      invariant(componentIdSet.has(relatedId), `${component.component_id} references unknown ${relatedId}`);
    });
  });

  const itemIds = components.flatMap((component) => [
    ...(component.do ?? []),
    ...(component.dont ?? []),
    ...(component.when_to_use ?? []),
    ...(component.when_not_to_use ?? []),
    ...(component.edge_cases ?? []),
    ...(component.content_guidelines ?? []),
    ...(component.governance_notes ?? []),
    ...(component.examples ?? []),
    ...(component.anti_patterns ?? []),
    ...(component.accessibility?.keyboard ?? []),
    ...(component.accessibility?.aria ?? []),
    ...(component.accessibility?.items ?? []),
  ].map((item) => item.id));
  invariant(new Set(itemIds).size === itemIds.length, "rule and example IDs must be globally unique");
  return value as unknown as ComponentCatalog;
}

let cachedCatalog: ComponentCatalog | null = null;
let cachedById: Map<ComponentId, ComponentMetadata> | null = null;
let catalogPromise: Promise<ComponentCatalog> | null = null;

export async function ensureComponentCatalog(): Promise<ComponentCatalog> {
  if (cachedCatalog) return cachedCatalog;
  if (!catalogPromise) {
    catalogPromise = import("../../data/component-metadata.json").then((mod) => {
      const raw = (mod as { default: unknown }).default ?? mod;
      const catalog = validateComponentCatalog(raw);
      cachedCatalog = catalog;
      cachedById = new Map(
        catalog.components.map((component) => [component.component_id, component]),
      );
      return catalog;
    });
  }
  return catalogPromise;
}

export function getComponentMetadataList(): ComponentMetadata[] {
  if (!cachedCatalog) {
    throw new Error("Component metadata not loaded. Call ensureComponentCatalog() first.");
  }
  return cachedCatalog.components;
}

export function getComponentMetadataById(componentId: ComponentId): ComponentMetadata | undefined {
  return cachedById?.get(componentId);
}

export function localizedText(value: LocalizedText | null, locale: Locale): string {
  if (!value) return "";
  return localizeContent(locale, value.pt, value.en ?? value.pt);
}

export function localizedRuleTexts(rules: LocalizedRule[] | null, locale: Locale): string[] | null {
  if (rules === null) return null;
  return rules.map((rule) => localizedText(rule.text, locale));
}
