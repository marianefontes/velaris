import { Palette } from "lucide-react";
import type { ReactNode } from "react";
import { useI18n } from "../i18n/I18nProvider";
import type { Locale } from "../i18n/translations";
import {
  FoundationSection,
  FoundationSectionHeader,
  FoundationSectionHero,
} from "./ui/FoundationPrimitives";

type TokenKind = "color" | "system";
type TokenLayer = "primitive" | "semantic" | "xai";
type TokenGroupId =
  | "primary"
  | "surface"
  | "semantic-color"
  | "typography"
  | "spacing"
  | "radius-shadow"
  | "motion"
  | "text"
  | "border"
  | "interaction"
  | "feedback"
  | "special-surface"
  | "elevation"
  | "layering"
  | "dimension"
  | "technical"
  | "xai";

interface TokenDefinition {
  name: string;
  value: string;
  group: TokenGroupId;
  kind: TokenKind;
  layer: TokenLayer;
  description: string;
  components: string;
  previewClass?: string;
}

interface AliasDefinition {
  name: string;
  target: string;
  resolvedValue: string;
  group: string;
  description: string;
}

interface CoverageRow {
  components: string;
  componentCount: number;
  groups: string[];
  rationale: string;
}

const canonicalTokens: TokenDefinition[] = [
  // Primitive color: 15
  { name: "primary-50", value: "#f5f0ff", group: "primary", kind: "color", layer: "primitive", description: "Lightest brand tint for subtle emphasis.", components: "Documentation, highlights" },
  { name: "primary-100", value: "#ede2ff", group: "primary", kind: "color", layer: "primitive", description: "Soft brand tint for quiet selected surfaces.", components: "Chip, Tabs, Card" },
  { name: "primary-200", value: "#deccfd", group: "primary", kind: "color", layer: "primitive", description: "Core light accent and focus foundation.", components: "Button, focus, XAI" },
  { name: "primary-300", value: "#c2a0fc", group: "primary", kind: "color", layer: "primitive", description: "Secondary brand accent and source emphasis.", components: "Source Attribution, icons" },
  { name: "primary-400", value: "#a777f9", group: "primary", kind: "color", layer: "primitive", description: "Mid accent for stronger interactive emphasis.", components: "Selected controls" },
  { name: "primary-500", value: "#8b4ff5", group: "primary", kind: "color", layer: "primitive", description: "Saturated accent for dense visual states.", components: "Charts, active states" },
  { name: "primary-600", value: "#6a30d4", group: "primary", kind: "color", layer: "primitive", description: "Deep accent for pressed and layered states.", components: "Button, selected surfaces" },
  { name: "primary-700", value: "#4a1aa0", group: "primary", kind: "color", layer: "primitive", description: "Deepest brand tone for translucent selection.", components: "Rows, chips, overlays" },
  { name: "surface-lowest", value: "#000000", group: "surface", kind: "color", layer: "primitive", description: "Lowest depth and maximum visual separation.", components: "Backdrop, code" },
  { name: "background", value: "#0e0e10", group: "surface", kind: "color", layer: "primitive", description: "Application canvas in dark mode.", components: "Application shell" },
  { name: "surface-container-low", value: "#131315", group: "surface", kind: "color", layer: "primitive", description: "Low-elevation content region.", components: "Workbench, sections" },
  { name: "surface-container", value: "#19191c", group: "surface", kind: "color", layer: "primitive", description: "Default container surface.", components: "Card, Table" },
  { name: "surface-container-high", value: "#1f1f22", group: "surface", kind: "color", layer: "primitive", description: "Elevated container and dialog base.", components: "Dialog, panel" },
  { name: "surface-container-highest", value: "#262528", group: "surface", kind: "color", layer: "primitive", description: "Highest opaque surface and popover base.", components: "Popover, Command Palette" },
  { name: "surface-bright", value: "#2c2c2f", group: "surface", kind: "color", layer: "primitive", description: "Brightest dark surface for placeholders.", components: "Skeleton, hover" },

  // Existing semantic color: 5
  { name: "--velaris-color-primary", value: "#deccfd", group: "semantic-color", kind: "color", layer: "semantic", description: "Primary semantic action and focus color. Resolves to primary-200.", components: "Button, Link, focus" },
  { name: "--velaris-color-secondary", value: "#c2a0fc", group: "semantic-color", kind: "color", layer: "semantic", description: "Secondary semantic accent. Resolves to primary-300.", components: "Badge, source, icon" },
  { name: "--velaris-color-success", value: "#7ee787", group: "semantic-color", kind: "color", layer: "semantic", description: "Successful completion and positive evidence.", components: "Alert, Toast, Confidence Badge" },
  { name: "--velaris-color-warning", value: "#ffa657", group: "semantic-color", kind: "color", layer: "semantic", description: "Caution, partial evidence, and medium confidence.", components: "Alert, Confidence Badge" },
  { name: "--velaris-color-error", value: "#ff6e84", group: "semantic-color", kind: "color", layer: "semantic", description: "Error, destructive action, and conflict.", components: "Form Field, Alert, Audit Panel" },

  // Existing system: typography 4
  { name: "display-xl", value: "text-6xl font-black tracking-tighter", group: "typography", kind: "system", layer: "primitive", description: "Hero headlines and identity surfaces.", components: "Page hero, brand" , previewClass: "text-5xl font-black tracking-tighter" },
  { name: "heading-lg", value: "text-3xl font-black tracking-tight", group: "typography", kind: "system", layer: "primitive", description: "Major sections and content anchors.", components: "Documentation sections", previewClass: "text-3xl font-black tracking-tight" },
  { name: "body-md", value: "text-base leading-7", group: "typography", kind: "system", layer: "primitive", description: "Readable interface copy with balanced rhythm.", components: "Card, Dialog, docs", previewClass: "text-base leading-7 text-on-surface-variant" },
  { name: "label-sm", value: "text-xs font-bold uppercase tracking-[0.24em]", group: "typography", kind: "system", layer: "primitive", description: "Metadata, compact navigation, and chips.", components: "Badge, table label", previewClass: "text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant" },

  // Existing system: spacing 5
  { name: "space-1", value: "0.25rem", group: "spacing", kind: "system", layer: "primitive", description: "Micro alignment and icon breathing room.", components: "Icon, inline metadata" },
  { name: "space-2", value: "0.5rem", group: "spacing", kind: "system", layer: "primitive", description: "Compact group spacing and chips.", components: "Chip, Badge, Button" },
  { name: "space-4", value: "1rem", group: "spacing", kind: "system", layer: "primitive", description: "Default card padding and form rhythm.", components: "Form Field, Card" },
  { name: "space-6", value: "1.5rem", group: "spacing", kind: "system", layer: "primitive", description: "Section blocks and content density.", components: "Dialog, panels" },
  { name: "space-10", value: "2.5rem", group: "spacing", kind: "system", layer: "primitive", description: "Hero spacing and layout separation.", components: "Page sections" },

  // Existing system: radius and shadow 4
  { name: "radius-sm", value: "0.5rem", group: "radius-shadow", kind: "system", layer: "primitive", description: "Inputs, pills, and compact cards.", components: "Input, Badge" },
  { name: "radius-md", value: "1rem", group: "radius-shadow", kind: "system", layer: "primitive", description: "Standard panels and control groups.", components: "Card, Alert" },
  { name: "radius-xl", value: "2rem", group: "radius-shadow", kind: "system", layer: "primitive", description: "Hero cards and immersive surfaces.", components: "Dialog, Workbench" },
  { name: "shadow-glow", value: "0 0 64px rgba(179,157,219,0.12)", group: "radius-shadow", kind: "system", layer: "primitive", description: "Specialized Velaris ambient emphasis.", components: "Identity, XAI focal points" },

  // Existing system: motion 4
  { name: "motion-fast", value: "160ms", group: "motion", kind: "system", layer: "primitive", description: "Micro interactions and control feedback.", components: "Button, Link, Toggle" },
  { name: "motion-base", value: "240ms", group: "motion", kind: "system", layer: "primitive", description: "Default transitions for cards and layout shifts.", components: "Card, Tabs, Select" },
  { name: "motion-slow", value: "420ms", group: "motion", kind: "system", layer: "primitive", description: "Meaningful emphasis and staged reveals.", components: "Dialog, Audit Panel" },
  { name: "easing-signature", value: "cubic-bezier(0.22,1,0.36,1)", group: "motion", kind: "system", layer: "primitive", description: "Smooth movement without abrupt stops.", components: "All animated components" },

  // New text semantic: 5
  { name: "text-primary", value: "#f9f5f8", group: "text", kind: "color", layer: "semantic", description: "Highest-priority readable text on dark surfaces.", components: "Typography, Dialog, Table" },
  { name: "text-secondary", value: "#adaaad", group: "text", kind: "color", layer: "semantic", description: "Supporting copy with reduced emphasis.", components: "Card, Form Field, Source" },
  { name: "text-muted", value: "#767577", group: "text", kind: "color", layer: "semantic", description: "Quiet metadata and low-priority labels.", components: "Caption, Table, Audit" },
  { name: "text-disabled", value: "rgba(173,170,173,0.45)", group: "text", kind: "color", layer: "semantic", description: "Unavailable text while preserving legibility.", components: "Button, Input, Tabs" },
  { name: "text-inverse", value: "#50426a", group: "text", kind: "color", layer: "semantic", description: "Text placed on light primary surfaces.", components: "Primary Button, selected controls" },

  // New border semantic: 4
  { name: "border-subtle", value: "rgba(255,255,255,0.07)", group: "border", kind: "color", layer: "semantic", description: "Quiet structural separation.", components: "Card, Table, Skeleton" },
  { name: "border-default", value: "rgba(255,255,255,0.10)", group: "border", kind: "color", layer: "semantic", description: "Default control and container boundary.", components: "Input, Dialog, Panel" },
  { name: "border-strong", value: "#48474a", group: "border", kind: "color", layer: "semantic", description: "High-emphasis structural boundary.", components: "Table, Modal, Command Palette" },
  { name: "border-focus", value: "#deccfd", group: "border", kind: "color", layer: "semantic", description: "Focused or selected boundary. Resolves to primary-200.", components: "Input, Checkbox, Tabs" },

  // New interaction semantic: 6
  { name: "state-hover-bg", value: "rgba(255,255,255,0.04)", group: "interaction", kind: "color", layer: "semantic", description: "Subtle hover fill on dark surfaces.", components: "Button, Link, Table row" },
  { name: "state-hover-border", value: "rgba(222,204,253,0.16)", group: "interaction", kind: "color", layer: "semantic", description: "Hover boundary with restrained brand emphasis.", components: "Card, Chip, Input" },
  { name: "state-pressed-bg", value: "rgba(222,204,253,0.14)", group: "interaction", kind: "color", layer: "semantic", description: "Pressed feedback for immediate controls.", components: "Button, Toggle, Tabs" },
  { name: "state-selected-bg", value: "rgba(74,26,160,0.22)", group: "interaction", kind: "color", layer: "semantic", description: "Selected surface derived from primary-700.", components: "Chip, Tabs, Table row" },
  { name: "state-disabled-bg", value: "rgba(255,255,255,0.025)", group: "interaction", kind: "color", layer: "semantic", description: "Disabled fill that remains distinguishable.", components: "Button, Input, Select" },
  { name: "focus-ring", value: "0 0 0 3px rgba(222,204,253,0.35)", group: "interaction", kind: "system", layer: "semantic", description: "Keyboard focus contract derived from primary-200.", components: "All interactive components" },

  // New feedback semantic: 10
  { name: "feedback-info-bg", value: "rgba(222,204,253,0.08)", group: "feedback", kind: "color", layer: "semantic", description: "Neutral explanatory feedback surface.", components: "Alert, Tooltip, Toast" },
  { name: "feedback-info-border", value: "rgba(222,204,253,0.24)", group: "feedback", kind: "color", layer: "semantic", description: "Boundary for informational feedback.", components: "Alert, Tooltip" },
  { name: "feedback-success-bg", value: "rgba(126,231,135,0.08)", group: "feedback", kind: "color", layer: "semantic", description: "Successful completion surface.", components: "Toast, Alert, Form Field" },
  { name: "feedback-success-border", value: "rgba(126,231,135,0.28)", group: "feedback", kind: "color", layer: "semantic", description: "Boundary for successful feedback.", components: "Toast, Alert" },
  { name: "feedback-warning-bg", value: "rgba(255,166,87,0.08)", group: "feedback", kind: "color", layer: "semantic", description: "Caution and partial-evidence surface.", components: "Alert, Confidence Badge" },
  { name: "feedback-warning-border", value: "rgba(255,166,87,0.28)", group: "feedback", kind: "color", layer: "semantic", description: "Boundary for cautionary feedback.", components: "Alert, Audit Panel" },
  { name: "feedback-error-bg", value: "rgba(255,110,132,0.08)", group: "feedback", kind: "color", layer: "semantic", description: "Error and blocking feedback surface.", components: "Form Field, Alert, Audit" },
  { name: "feedback-error-border", value: "rgba(255,110,132,0.28)", group: "feedback", kind: "color", layer: "semantic", description: "Boundary for error and conflict feedback.", components: "Input, Alert, Audit Panel" },
  { name: "feedback-info-icon", value: "#deccfd", group: "feedback", kind: "color", layer: "semantic", description: "Informational icon and foreground. Resolves to primary-200.", components: "Alert, Tooltip" },
  { name: "feedback-error-icon", value: "#ff6e84", group: "feedback", kind: "color", layer: "semantic", description: "Error icon and foreground. Resolves to the semantic error color.", components: "Alert, Form Field, Audit" },

  // New specialized surfaces: 4
  { name: "surface-overlay", value: "rgba(14,14,16,0.92)", group: "special-surface", kind: "color", layer: "semantic", description: "Opaque overlay surface above the application canvas.", components: "Modal, Command Palette" },
  { name: "surface-skeleton", value: "rgba(44,44,47,0.72)", group: "special-surface", kind: "color", layer: "semantic", description: "Loading placeholder derived from surface-bright.", components: "Skeleton Loader" },
  { name: "surface-row-selected", value: "rgba(74,26,160,0.18)", group: "special-surface", kind: "color", layer: "semantic", description: "Selected data row derived from primary-700.", components: "Table/Data Table" },
  { name: "overlay-backdrop", value: "rgba(0,0,0,0.72)", group: "special-surface", kind: "color", layer: "semantic", description: "Backdrop that isolates modal and command contexts.", components: "Modal, Command Palette" },

  // New elevation: 3
  { name: "shadow-sm", value: "0 8px 24px rgba(0,0,0,0.18)", group: "elevation", kind: "system", layer: "semantic", description: "Subtle elevation for cards and compact overlays.", components: "Card, Tooltip" },
  { name: "shadow-md", value: "0 16px 40px rgba(0,0,0,0.28)", group: "elevation", kind: "system", layer: "semantic", description: "Default floating-surface elevation.", components: "Toast, Command Palette" },
  { name: "shadow-lg", value: "0 24px 72px rgba(0,0,0,0.38)", group: "elevation", kind: "system", layer: "semantic", description: "Strong isolation for blocking surfaces.", components: "Modal/Dialog" },

  // New layering: 4
  { name: "z-tooltip", value: "40", group: "layering", kind: "system", layer: "semantic", description: "Tooltip and explanation bubble layer.", components: "Tooltip" },
  { name: "z-toast", value: "50", group: "layering", kind: "system", layer: "semantic", description: "Transient notification layer.", components: "Toast/Notification" },
  { name: "z-modal", value: "60", group: "layering", kind: "system", layer: "semantic", description: "Blocking dialog layer.", components: "Modal/Dialog" },
  { name: "z-command", value: "70", group: "layering", kind: "system", layer: "semantic", description: "Global command surface layer.", components: "Command Palette" },

  // New dimensions: 7
  { name: "control-height-sm", value: "32px", group: "dimension", kind: "system", layer: "semantic", description: "Compact control height for dense contexts.", components: "Chip, compact Button" },
  { name: "control-height-md", value: "44px", group: "dimension", kind: "system", layer: "semantic", description: "Default accessible control height.", components: "Button, Input, Select" },
  { name: "control-height-lg", value: "52px", group: "dimension", kind: "system", layer: "semantic", description: "Prominent control height for primary tasks.", components: "Command Palette, primary Input" },
  { name: "target-size-min", value: "44px", group: "dimension", kind: "system", layer: "semantic", description: "Minimum interactive target for accessibility.", components: "All interactive components" },
  { name: "icon-size-sm", value: "16px", group: "dimension", kind: "system", layer: "semantic", description: "Compact icon size for metadata and controls.", components: "Chip, Badge, Table" },
  { name: "icon-size-md", value: "20px", group: "dimension", kind: "system", layer: "semantic", description: "Default interface icon size.", components: "Button, Input, Alert" },
  { name: "icon-size-lg", value: "24px", group: "dimension", kind: "system", layer: "semantic", description: "Prominent icon size for feedback and navigation.", components: "Alert, Dialog, empty states" },

  // New complementary typography: 4
  { name: "heading-md", value: "text-2xl font-bold tracking-tight", group: "typography", kind: "system", layer: "semantic", description: "Panel and component documentation heading.", components: "Card, Dialog, Audit Panel", previewClass: "text-2xl font-bold tracking-tight" },
  { name: "body-sm", value: "text-sm leading-6", group: "typography", kind: "system", layer: "semantic", description: "Compact explanatory and form copy.", components: "Form Field, Source Attribution", previewClass: "text-sm leading-6 text-on-surface-variant" },
  { name: "caption", value: "text-[11px] leading-4", group: "typography", kind: "system", layer: "semantic", description: "Metadata, timestamps, and provenance.", components: "Table, Source, Audit", previewClass: "text-[11px] leading-4 text-on-surface-variant" },
  { name: "code-sm", value: "font-mono text-xs leading-6", group: "typography", kind: "system", layer: "semantic", description: "Readable snippets and technical evidence.", components: "Code Snippet, Audit Panel", previewClass: "font-mono text-xs leading-6 text-primary" },

  // New canonical XAI: 4
  { name: "xai-source-bg", value: "rgba(222,204,253,0.06)", group: "xai", kind: "color", layer: "xai", description: "Grounded source and provenance surface.", components: "Source Attribution, RAG response" },
  { name: "xai-source-border", value: "#c2a0fc", group: "xai", kind: "color", layer: "xai", description: "Inspectable source boundary. Resolves to primary-300.", components: "Source Attribution" },
  { name: "xai-evidence-highlight", value: "rgba(222,204,253,0.16)", group: "xai", kind: "color", layer: "xai", description: "Evidence emphasis derived from primary-200 with opacity.", components: "Source Attribution, Tooltip" },
  { name: "xai-audit-running", value: "#c2a0fc", group: "xai", kind: "color", layer: "xai", description: "Audit process currently executing.", components: "Audit Panel, Consulta ao Abraxos" },

  // Technical color system: syntax, metadata, and engineering surfaces
  { name: "technical.foreground", value: "#e8e1f5", group: "technical", kind: "color", layer: "semantic", description: "Default monospace foreground for technical surfaces. Lavender base, easier on the eyes than saturated IDE defaults.", components: "Code block, trace panel, inline code" },
  { name: "technical.keyword", value: "#c4a7e7", group: "technical", kind: "color", layer: "semantic", description: "Reserved words, pipeline stages, and language keywords in technical surfaces.", components: "Code Snippet, Execution Trace, Pipeline" },
  { name: "technical.type", value: "#9ccfd8", group: "technical", kind: "color", layer: "semantic", description: "Types, classes, entities, enums, and schema metadata such as page_type.", components: "Developers, Corpus table, API Explorer" },
  { name: "technical.entity", value: "#9ccfd8", group: "technical", kind: "color", layer: "semantic", description: "Reserved alias for domain entities. Currently resolves to technical.type.", components: "Future: interfaces, domain models" },
  { name: "technical.string", value: "#31748f", group: "technical", kind: "color", layer: "semantic", description: "Text literals, configuration values, and quoted labels.", components: "Code Snippet, Dev Integration" },
  { name: "technical.property", value: "#e8e1f5", group: "technical", kind: "color", layer: "semantic", description: "Properties, module names, and file paths. Resolves to technical.foreground.", components: "Architecture tiers, RAG pipeline, Snippets" },
  { name: "technical.number", value: "#eb6f92", group: "technical", kind: "color", layer: "semantic", description: "Numeric data, metrics, targets, versions, and coverage values.", components: "Evaluation META, Laboratory metrics" },
  { name: "technical.command", value: "#f6c177", group: "technical", kind: "color", layer: "semantic", description: "Functions, executable shell commands, and runnable actions.", components: "Developers, Dev Integration, Scripts" },
  { name: "technical.operator", value: "#b0a8bc", group: "technical", kind: "color", layer: "semantic", description: "Operators, separators, and structural punctuation in code.", components: "Code Snippet, Markdown code" },
  { name: "technical.comment", value: "#6e6a78", group: "technical", kind: "color", layer: "semantic", description: "Secondary hints, trailing notes, and low-priority technical metadata.", components: "Execution Trace, inline hints" },
  { name: "technical.accent", value: "#9d7fe6", group: "technical", kind: "color", layer: "semantic", description: "Focused technical highlight that is not branding or feedback.", components: "Baseline tags, technical links" },
  { name: "technical.surface", value: "rgba(255,255,255,0.022)", group: "technical", kind: "color", layer: "semantic", description: "Background for monospace blocks and engineering panels.", components: "Code block, trace panel" },
  { name: "technical.surface-border", value: "rgba(255,255,255,0.10)", group: "technical", kind: "color", layer: "semantic", description: "Structural border for technical blocks.", components: "Code block, API panel" },
  { name: "technical.chip-bg", value: "rgba(194,160,252,0.05)", group: "technical", kind: "color", layer: "semantic", description: "Inline technical chip background.", components: "Path chip, artefact chip" },
  { name: "technical.chip-border", value: "rgba(158,180,204,0.18)", group: "technical", kind: "color", layer: "semantic", description: "Inline technical chip border.", components: "Path chip, artefact chip" },
];

const aliasTokens: AliasDefinition[] = [
  { name: "state-selected-border", target: "border-focus", resolvedValue: "#deccfd", group: "Interaction", description: "Selected controls reuse the focus boundary contract." },
  { name: "state-disabled-text", target: "text-disabled", resolvedValue: "rgba(173,170,173,0.45)", group: "Interaction", description: "Disabled foreground is governed by the text contract." },
  { name: "state-disabled-border", target: "border-subtle", resolvedValue: "rgba(255,255,255,0.07)", group: "Interaction", description: "Disabled boundaries remain quiet without a duplicate value." },
  { name: "feedback-info-text", target: "feedback-info-icon", resolvedValue: "#deccfd", group: "Feedback", description: "Info text and icon share the same foreground contract." },
  { name: "feedback-success-text", target: "--velaris-color-success", resolvedValue: "#7ee787", group: "Feedback", description: "Success foreground resolves to the semantic success color." },
  { name: "feedback-success-icon", target: "--velaris-color-success", resolvedValue: "#7ee787", group: "Feedback", description: "Success icon resolves to the semantic success color." },
  { name: "feedback-warning-text", target: "--velaris-color-warning", resolvedValue: "#ffa657", group: "Feedback", description: "Warning foreground resolves to the semantic warning color." },
  { name: "feedback-warning-icon", target: "--velaris-color-warning", resolvedValue: "#ffa657", group: "Feedback", description: "Warning icon resolves to the semantic warning color." },
  { name: "feedback-error-text", target: "feedback-error-icon", resolvedValue: "#ff6e84", group: "Feedback", description: "Error text and icon share one foreground contract." },
  { name: "xai-confidence-high", target: "--velaris-color-success", resolvedValue: "#7ee787", group: "XAI", description: "High calibrated confidence reuses semantic success." },
  { name: "xai-confidence-medium", target: "--velaris-color-warning", resolvedValue: "#ffa657", group: "XAI", description: "Medium confidence communicates caution without a new hue." },
  { name: "xai-confidence-low", target: "--velaris-color-error", resolvedValue: "#ff6e84", group: "XAI", description: "Low confidence reuses the semantic error signal." },
  { name: "xai-audit-complete", target: "--velaris-color-success", resolvedValue: "#7ee787", group: "XAI", description: "Completed audits reuse semantic success." },
  { name: "xai-audit-conflict", target: "--velaris-color-error", resolvedValue: "#ff6e84", group: "XAI", description: "Policy or evidence conflicts reuse semantic error." },
  { name: "surface-dialog", target: "surface-container-high", resolvedValue: "#1f1f22", group: "Surface", description: "Dialog is a semantic usage contract over the high container." },
  { name: "surface-popover", target: "surface-container-highest", resolvedValue: "#262528", group: "Surface", description: "Popover is a semantic usage contract over the highest container." },
  { name: "technical.path", target: "technical.property", resolvedValue: "#e8e1f5", group: "Technical", description: "File and module paths reuse the property role." },
  { name: "technical.metadata", target: "technical.type", resolvedValue: "#9ccfd8", group: "Technical", description: "Schema metadata and enums reuse the type role." },
  { name: "technical.link", target: "technical.accent", resolvedValue: "#9d7fe6", group: "Technical", description: "Technical documentation links reuse the accent role." },
];

const coverageRows: CoverageRow[] = [
  { components: "Button, Toggle/Switch, Checkbox, Radio, Chip", componentCount: 5, groups: ["color", "text", "interaction", "focus-ring", "dimension", "radius", "motion"], rationale: "Actions need clear priority, selection, keyboard focus, and accessible targets." },
  { components: "Input, Text Area, Select, Date Picker, Form Field", componentCount: 5, groups: ["text", "border", "focus-ring", "disabled", "feedback", "spacing", "dimension"], rationale: "Form controls share entry, validation, focus, and error contracts." },
  { components: "Link, Tabs, Card, Table/Data Table", componentCount: 4, groups: ["text", "selected state", "border", "surface", "elevation", "typography"], rationale: "Navigation and structure depend on readable hierarchy and visible selection." },
  { components: "Modal/Dialog", componentCount: 1, groups: ["surface-dialog", "overlay-backdrop", "z-modal", "shadow-lg", "motion"], rationale: "Blocking contexts require isolation, elevation, and reliable stacking." },
  { components: "Alert, Toast/Notification, Tooltip", componentCount: 3, groups: ["feedback", "z-toast", "z-tooltip", "shadow", "motion"], rationale: "Feedback needs severity, persistence, and transient-layer contracts." },
  { components: "Command Palette", componentCount: 1, groups: ["surface-popover", "overlay-backdrop", "z-command", "state-selected", "focus-ring"], rationale: "Command discovery combines search, selection, and global overlay behavior." },
  { components: "Confidence Badge", componentCount: 1, groups: ["xai-confidence", "feedback", "radius", "typography"], rationale: "Confidence maps calibrated evidence to reusable semantic feedback." },
  { components: "Source Attribution, Audit Panel", componentCount: 2, groups: ["xai-source", "xai-evidence", "xai-audit", "surface", "border", "typography"], rationale: "Traceability requires inspectable evidence, process status, and readable provenance." },
  { components: "Skeleton Loader, Explanation Bubble, Consulta ao Abraxos", componentCount: 3, groups: ["surface-skeleton", "xai-evidence", "xai-source", "feedback", "motion"], rationale: "Loading and explanation surfaces must preserve context while evidence and responses are assembled." },
];

const semanticGroupIds: TokenGroupId[] = [
  "text",
  "border",
  "interaction",
  "feedback",
  "special-surface",
  "elevation",
  "layering",
  "dimension",
  "typography",
];

const xaiAliases = aliasTokens.filter((alias) => alias.group === "XAI");
const primitiveTokens = canonicalTokens.filter((token) => token.layer === "primitive");
const preservedSemanticColors = canonicalTokens.filter((token) => token.group === "semantic-color");
const semanticInterfaceTokens = canonicalTokens.filter(
  (token) => token.layer === "semantic" && token.group !== "semantic-color",
);
const xaiTokens = canonicalTokens.filter((token) => token.layer === "xai");
const technicalTokens = canonicalTokens.filter((token) => token.group === "technical");

const tokenMetrics = {
  canonical: canonicalTokens.length,
  documented: canonicalTokens.length + aliasTokens.length,
  preserved: primitiveTokens.length + preservedSemanticColors.length,
  semantic: semanticInterfaceTokens.length,
  xai: xaiTokens.length + xaiAliases.length,
  uniqueColors: new Set(
    canonicalTokens
      .filter((token) => token.kind === "color")
      .map((token) => token.value.toLowerCase().replace(/\s+/g, "")),
  ).size,
  aliases: aliasTokens.length,
  components: coverageRows.reduce((total, row) => total + row.componentCount, 0),
};

const TOKEN_DESCRIPTIONS_PT: Record<string, string> = {
  "primary-50": "Tom mais claro da marca para ênfase sutil.",
  "primary-100": "Tom suave da marca para superfícies selecionadas discretas.",
  "primary-200": "Acento claro principal e base do foco.",
  "primary-300": "Acento secundário para fontes, evidências e ícones.",
  "primary-400": "Acento intermediário para estados interativos mais fortes.",
  "primary-500": "Acento saturado para estados visuais densos.",
  "primary-600": "Acento profundo para estados pressionados e em camadas.",
  "primary-700": "Tom mais profundo da marca para seleções translúcidas.",
  "surface-lowest": "Profundidade mínima e separação visual máxima.",
  background: "Base visual da aplicação em modo escuro.",
  "surface-container-low": "Região de conteúdo com baixa elevação.",
  "surface-container": "Superfície padrão para contentores.",
  "surface-container-high": "Base elevada para painéis e diálogos.",
  "surface-container-highest": "Superfície opaca mais alta para popovers.",
  "surface-bright": "Superfície escura mais clara para placeholders e hover.",
  "--velaris-color-primary": "Cor semântica principal de ação e foco. Resolve para primary-200.",
  "--velaris-color-secondary": "Acento semântico secundário. Resolve para primary-300.",
  "--velaris-color-success": "Conclusão bem-sucedida e evidência positiva.",
  "--velaris-color-warning": "Cautela, evidência parcial e confiança média.",
  "--velaris-color-error": "Erro, ação destrutiva e conflito.",
  "display-xl": "Títulos de hero e superfícies de identidade.",
  "heading-lg": "Seções principais e âncoras de conteúdo.",
  "body-md": "Texto de interface legível com ritmo equilibrado.",
  "label-sm": "Metadados, navegação compacta e chips.",
  "space-1": "Microalinhamento e respiro para ícones.",
  "space-2": "Espaçamento de grupos compactos e chips.",
  "space-4": "Padding padrão de cards e ritmo de formulários.",
  "space-6": "Blocos de seção e densidade de conteúdo.",
  "space-10": "Separação de hero e grandes regiões de layout.",
  "radius-sm": "Inputs, badges e superfícies compactas.",
  "radius-md": "Painéis padrão e grupos de controles.",
  "radius-xl": "Superfícies imersivas e diálogos amplos.",
  "shadow-glow": "Ênfase ambiente característica do Velaris.",
  "motion-fast": "Microinterações e resposta de controles.",
  "motion-base": "Transição padrão para cards e mudanças de layout.",
  "motion-slow": "Ênfase significativa e revelações em etapas.",
  "easing-signature": "Movimento suave sem paragens abruptas.",
  "text-primary": "Texto legível de maior prioridade em superfícies escuras.",
  "text-secondary": "Texto de apoio com ênfase reduzida.",
  "text-muted": "Metadados discretos e rótulos de baixa prioridade.",
  "text-disabled": "Texto indisponível que preserva legibilidade.",
  "text-inverse": "Texto aplicado sobre superfícies claras da marca.",
  "border-subtle": "Separação estrutural discreta.",
  "border-default": "Limite padrão de controles e contentores.",
  "border-strong": "Limite estrutural de alta ênfase.",
  "border-focus": "Limite de foco ou seleção. Resolve para primary-200.",
  "state-hover-bg": "Preenchimento sutil de hover em superfícies escuras.",
  "state-hover-border": "Limite de hover com ênfase contida da marca.",
  "state-pressed-bg": "Resposta visual imediata para controles pressionados.",
  "state-selected-bg": "Superfície selecionada derivada de primary-700.",
  "state-disabled-bg": "Preenchimento desativado ainda distinguível.",
  "focus-ring": "Contrato de foco por teclado derivado de primary-200.",
  "feedback-info-bg": "Superfície neutra para feedback explicativo.",
  "feedback-info-border": "Limite para feedback informativo.",
  "feedback-success-bg": "Superfície de conclusão bem-sucedida.",
  "feedback-success-border": "Limite para feedback de sucesso.",
  "feedback-warning-bg": "Superfície de cautela e evidência parcial.",
  "feedback-warning-border": "Limite para feedback de cautela.",
  "feedback-error-bg": "Superfície de erro e bloqueio.",
  "feedback-error-border": "Limite para erro e conflito.",
  "feedback-info-icon": "Ícone e foreground informativos. Resolve para primary-200.",
  "feedback-error-icon": "Ícone e foreground de erro. Resolve para a cor semântica de erro.",
  "surface-overlay": "Superfície opaca sobre a base da aplicação.",
  "surface-skeleton": "Placeholder de carregamento derivado de surface-bright.",
  "surface-row-selected": "Linha de dados selecionada derivada de primary-700.",
  "overlay-backdrop": "Fundo que isola contextos modais e de comando.",
  "shadow-sm": "Elevação sutil para cards e overlays compactos.",
  "shadow-md": "Elevação padrão para superfícies flutuantes.",
  "shadow-lg": "Isolamento forte para superfícies bloqueantes.",
  "z-tooltip": "Camada de tooltip e explicação contextual.",
  "z-toast": "Camada de notificações transitórias.",
  "z-modal": "Camada de diálogos bloqueantes.",
  "z-command": "Camada global da superfície de comandos.",
  "control-height-sm": "Altura compacta para contextos densos.",
  "control-height-md": "Altura acessível padrão de controles.",
  "control-height-lg": "Altura proeminente para tarefas principais.",
  "target-size-min": "Alvo interativo mínimo para acessibilidade.",
  "icon-size-sm": "Ícone compacto para metadados e controles.",
  "icon-size-md": "Tamanho padrão de ícones de interface.",
  "icon-size-lg": "Ícone proeminente para feedback e navegação.",
  "heading-md": "Título de painel e documentação de componentes.",
  "body-sm": "Texto explicativo e de formulário compacto.",
  caption: "Metadados, timestamps e proveniência.",
  "code-sm": "Trechos de código e evidência técnica legíveis.",
  "xai-source-bg": "Superfície de fonte fundamentada e proveniência.",
  "xai-source-border": "Limite de fonte inspecionável. Resolve para primary-300.",
  "xai-evidence-highlight": "Ênfase de evidência derivada de primary-200 com opacidade.",
  "xai-audit-running": "Processo de auditoria atualmente em execução.",
  "technical.foreground": "Foreground padrão monospace em superfícies técnicas. Base lavanda, mais confortável que defaults saturados de IDE.",
  "technical.keyword": "Palavras reservadas, estágios de pipeline e keywords em superfícies técnicas.",
  "technical.type": "Tipos, entidades, enums e metadados de schema como page_type.",
  "technical.entity": "Alias reservado para entidades de domínio. Hoje resolve para technical.type.",
  "technical.string": "Literais textuais, valores de configuração e labels entre aspas.",
  "technical.property": "Propriedades, nomes de módulo e caminhos de arquivo.",
  "technical.number": "Dados numéricos, métricas, metas, versões e cobertura.",
  "technical.command": "Comandos de shell executáveis e ações runnable.",
  "technical.operator": "Operadores, separadores e pontuação estrutural em código.",
  "technical.comment": "Hints secundários, notas de rodapé e metadados de baixa prioridade.",
  "technical.accent": "Destaque técnico pontual que não é branding nem feedback.",
  "technical.surface": "Fundo para blocos monospace e painéis de engenharia.",
  "technical.surface-border": "Borda estrutural para blocos técnicos.",
  "technical.chip-bg": "Fundo de chip técnico inline.",
  "technical.chip-border": "Borda de chip técnico inline.",
};

const ALIAS_DESCRIPTIONS_PT: Record<string, string> = {
  "state-selected-border": "Controles selecionados reutilizam o contrato de limite de foco.",
  "state-disabled-text": "O foreground desativado é governado pelo contrato de texto.",
  "state-disabled-border": "Limites desativados permanecem discretos sem duplicar valores.",
  "feedback-info-text": "Texto e ícone informativos compartilham o mesmo foreground.",
  "feedback-success-text": "O foreground de sucesso resolve para a cor semântica de sucesso.",
  "feedback-success-icon": "O ícone de sucesso resolve para a cor semântica de sucesso.",
  "feedback-warning-text": "O foreground de alerta resolve para a cor semântica de alerta.",
  "feedback-warning-icon": "O ícone de alerta resolve para a cor semântica de alerta.",
  "feedback-error-text": "Texto e ícone de erro compartilham o mesmo foreground.",
  "xai-confidence-high": "Confiança calibrada alta reutiliza o contrato semântico de sucesso.",
  "xai-confidence-medium": "Confiança média comunica cautela sem criar uma nova cor.",
  "xai-confidence-low": "Confiança baixa reutiliza o sinal semântico de erro.",
  "xai-audit-complete": "Auditorias concluídas reutilizam o contrato de sucesso.",
  "xai-audit-conflict": "Conflitos de política ou evidência reutilizam o contrato de erro.",
  "surface-dialog": "Diálogos usam um contrato semântico sobre o contentor elevado.",
  "surface-popover": "Popovers usam um contrato semântico sobre o contentor mais alto.",
  "technical.path": "Caminhos de arquivo e módulo reutilizam o papel property.",
  "technical.metadata": "Metadados de schema e enums reutilizam o papel type.",
  "technical.link": "Links técnicos de documentação reutilizam o papel accent.",
};

const COVERAGE_RATIONALE_PT: Record<string, string> = {
  "Button, Toggle/Switch, Checkbox, Radio, Chip": "Ações precisam de prioridade clara, seleção, foco por teclado e alvos acessíveis.",
  "Input, Text Area, Select, Date Picker, Form Field": "Controles de formulário compartilham entrada, validação, foco e contratos de erro.",
  "Link, Tabs, Card, Table/Data Table": "Navegação e estrutura dependem de hierarquia legível e seleção visível.",
  "Modal/Dialog": "Contextos bloqueantes exigem isolamento, elevação e empilhamento confiável.",
  "Alert, Toast/Notification, Tooltip": "Feedback exige severidade, persistência e contratos de camadas transitórias.",
  "Command Palette": "A descoberta de comandos combina pesquisa, seleção e comportamento global de overlay.",
  "Confidence Badge": "A confiança relaciona evidência calibrada a feedback semântico reutilizável.",
  "Source Attribution, Audit Panel": "Rastreabilidade exige evidência inspecionável, estado de processo e proveniência legível.",
  "Skeleton Loader, Explanation Bubble, Consulta ao Abraxos": "Carregamento e explicação devem preservar o contexto enquanto evidências e respostas são reunidas.",
};

function getCopy(locale: Locale) {
  if (locale === "en-US") {
    return {
      eyebrow: "Taxonomy of the visual language",
      titleLead: "Design",
      titleAccent: "Tokens",
      subtitle: "Base values, interface contracts, and explainability states organized from foundation to application.",
      heroNoteLabel: "Taxonomy contract",
      heroNote: "Values become reusable system decisions when their purpose and resolution remain explicit.",
      metrics: {
        documented: "Documented",
        preserved: "Preserved base",
        semantic: "Interface semantics",
        xai: "XAI contracts",
        aliases: "Aliases",
        colors: "Unique colors",
        components: "Components",
      },
      countNote: "The preserved baseline contains 32 strict primitives and five pre-existing semantic color contracts. Layer and alias counts intentionally overlap.",
      guideEyebrow: "Reading model",
      guideTitle: "How to read this taxonomy",
      guideBody: "Primitive tokens preserve base values. Semantic tokens describe reusable interface roles. XAI tokens encode confidence, source, evidence, and audit states. Aliases connect these layers without duplicating values.",
      chapters: {
        primitive: { eyebrow: "Foundation", title: "Preserved primitive tokens", lead: "Base values sustaining the original Velaris identity, with the five historical semantic colors identified separately." },
        semantic: { eyebrow: "Interface contracts", title: "Semantic interface tokens", lead: "Reusable roles describing intent, visual state, and interface behavior without creating a token for every intent." },
        technical: { eyebrow: "Engineering surfaces", title: "Technical Color System", lead: "A Velaris-native palette for code, architecture, metadata, and documentation — derived from lavender and violet, not IDE defaults." },
        xai: { eyebrow: "Explainability", title: "Specialized XAI tokens", lead: "Contracts for confidence, source, evidence, and auditability in Abraxos responses." },
        aliases: { eyebrow: "Resolution model", title: "Aliases and semantic contracts", lead: "One value can support several explicit contracts without duplicating visual decisions." },
        coverage: { eyebrow: "Application", title: "Component coverage", lead: "Token groups mapped to the behavioral needs of the 25 primary components." },
      },
      groups: {
        text: ["Text contracts", "Readable hierarchy across dark surfaces, disabled states, and inverse actions."],
        border: ["Border contracts", "Reusable boundaries for controls, containers, focus, and selection."],
        interaction: ["Interaction states", "Hover, pressed, selected, disabled, and keyboard-focus behavior."],
        feedback: ["Semantic feedback", "Background, boundary, and foreground contracts for system messages."],
        "special-surface": ["Surface and overlay", "Overlay, skeleton, selected-row, and backdrop roles."],
        elevation: ["Elevation", "Spatial hierarchy for cards, popovers, notifications, and dialogs."],
        layering: ["Layering and z-index", "Predictable stacking for transient and blocking surfaces."],
        dimension: ["Dimensions and accessibility", "Control heights, minimum targets, and icon scale."],
        typography: ["Semantic typography", "Complementary text roles for panels, metadata, and technical evidence."],
      },
      primaryScale: "Primary scale",
      surfaceScale: "Surface scale",
      preservedColors: "Preserved semantic color contracts",
      preservedColorsLead: "These five contracts belong to the original 37-token baseline but are semantic roles, not strict primitives.",
      typography: "Base typography",
      spacing: "Spacing",
      radiusShadow: "Radius and signature shadow",
      motion: "Motion and easing",
      token: "Token",
      value: "Value",
      role: "Role",
      usedBy: "Used by",
      count: "tokens",
      canonical: "Canonical",
      alias: "Alias",
      type: "Type",
      target: "Target",
      resolvedValue: "Resolved value",
      contract: "Contract",
      category: "Category",
      components: "Components",
      tokenGroups: "Token groups",
      rationale: "Rationale",
      aliasesNote: "Aliases are explicit names for existing decisions. They do not create new colors and do not increase the canonical token count.",
      xaiNote: "XAI tokens encode meaning rather than decoration. They sustain Confidence Badge, Source Attribution, Audit Panel, Explanation Bubble, Abraxos Chat, and RAG-retrieved responses.",
      technicalWhenUse: "Use for file paths, shell commands, schema metadata, numeric targets, monospace blocks, execution traces, and engineering documentation.",
      technicalWhenNot: "Do not use for navigation, CTAs, brand moments, success/warning/error states, or persona themes. Those belong to primary, secondary, and feedback contracts.",
      technicalRule: "technical = what it is · feedback = how it is",
      technicalExamples: [
        ["server.py", "technical.property"],
        ["npm run dev", "technical.command"],
        ["page_type = architecture", "technical.type"],
        ["META ≥ 0.80", "technical.number"],
        ["Execution completed", "feedback-success"],
        ["Warning: evidence missing", "feedback-warning"],
      ],
      typeSample: "Velaris evidence",
      opacity: "with opacity",
    };
  }

  if (locale === "pt-PT") {
    return {
      eyebrow: "Taxonomia da linguagem visual",
      titleLead: "Tokens de",
      titleAccent: "Design",
      subtitle: "Valores base, contratos de interface e estados de explicabilidade organizados da fundação à aplicação.",
      heroNoteLabel: "Contrato da taxonomia",
      heroNote: "Os valores tornam-se decisões reutilizáveis quando a sua finalidade e resolução permanecem explícitas.",
      metrics: {
        documented: "Documentados",
        preserved: "Base preservada",
        semantic: "Semânticos de interface",
        xai: "Contratos XAI",
        aliases: "Aliases",
        colors: "Cores únicas",
        components: "Componentes",
      },
      countNote: "A base preservada contém 32 primitivos estritos e cinco contratos semânticos de cor já existentes. As contagens de camada e aliases sobrepõem-se de forma intencional.",
      guideEyebrow: "Modelo de leitura",
      guideTitle: "Como ler esta taxonomia",
      guideBody: "Tokens primitivos preservam valores base. Tokens semânticos descrevem papéis reutilizáveis de interface. Tokens XAI codificam confiança, fonte, evidência e auditoria. Aliases ligam estas camadas sem duplicar valores.",
      chapters: {
        primitive: { eyebrow: "Fundação", title: "Tokens primitivos preservados", lead: "Valores base que sustentam a identidade original do Velaris, com as cinco cores semânticas históricas identificadas em separado." },
        semantic: { eyebrow: "Contratos de interface", title: "Tokens semânticos de interface", lead: "Papéis reutilizáveis que descrevem intenção, estado visual e comportamento sem criar um token para cada finalidade." },
        technical: { eyebrow: "Superfícies de engenharia", title: "Technical Color System", lead: "Paleta nativa Velaris para código, arquitetura, metadados e documentação — derivada de lavanda e violeta, não de defaults de IDE." },
        xai: { eyebrow: "Explicabilidade", title: "Tokens especializados de XAI", lead: "Contratos específicos para confiança, fonte, evidência e auditabilidade nas respostas do Abraxos." },
        aliases: { eyebrow: "Modelo de resolução", title: "Aliases e contratos semânticos", lead: "Um mesmo valor pode sustentar vários contratos explícitos sem duplicar decisões visuais." },
        coverage: { eyebrow: "Aplicação", title: "Cobertura por componente", lead: "Relação entre grupos de tokens e as necessidades comportamentais dos 25 componentes principais." },
      },
      groups: {
        text: ["Contratos de texto", "Hierarquia legível em superfícies escuras, estados desativados e ações inversas."],
        border: ["Contratos de limites", "Limites reutilizáveis para controlos, contentores, foco e seleção."],
        interaction: ["Estados de interação", "Comportamento de hover, pressão, seleção, desativação e foco por teclado."],
        feedback: ["Feedback semântico", "Contratos de fundo, limite e foreground para mensagens do sistema."],
        "special-surface": ["Superfície e overlay", "Papéis de overlay, skeleton, linha selecionada e backdrop."],
        elevation: ["Elevação", "Hierarquia espacial para cards, popovers, notificações e diálogos."],
        layering: ["Camadas e z-index", "Empilhamento previsível para superfícies transitórias e bloqueantes."],
        dimension: ["Dimensões e acessibilidade", "Alturas de controlos, alvos mínimos e escala de ícones."],
        typography: ["Tipografia semântica", "Papéis complementares para painéis, metadados e evidência técnica."],
      },
      technicalWhenUse: "Use para paths, comandos shell, metadados de schema, metas numéricas, blocos monospace, traces de execução e documentação de engenharia.",
      technicalWhenNot: "Não use para navegação, CTAs, momentos de marca, estados success/warning/error ou temas de persona. Esses papéis pertencem a primary, secondary e feedback.",
      technicalRule: "technical = o que é · feedback = como está",
      technicalExamples: [
        ["server.py", "technical.property"],
        ["npm run dev", "technical.command"],
        ["page_type = architecture", "technical.type"],
        ["META ≥ 0.80", "technical.number"],
        ["Execução concluída", "feedback-success"],
        ["Aviso: evidência em falta", "feedback-warning"],
      ],
      primaryScale: "Escala Primary",
      surfaceScale: "Escala Surface",
      preservedColors: "Contratos semânticos de cor preservados",
      preservedColorsLead: "Estes cinco contratos pertencem à base original de 37 tokens, mas são papéis semânticos e não primitivos estritos.",
      typography: "Tipografia base",
      spacing: "Espaçamento",
      radiusShadow: "Raios e sombra de identidade",
      motion: "Movimento e easing",
      token: "Token",
      value: "Valor",
      role: "Papel",
      usedBy: "Utilizado por",
      count: "tokens",
      canonical: "Canónico",
      alias: "Alias",
      type: "Tipo",
      target: "Destino",
      resolvedValue: "Valor resolvido",
      contract: "Contrato",
      category: "Categoria",
      components: "Componentes",
      tokenGroups: "Grupos de tokens",
      rationale: "Justificação",
      aliasesNote: "Aliases são nomes explícitos para decisões existentes. Não criam novas cores nem aumentam a contagem de tokens canónicos.",
      xaiNote: "Tokens XAI codificam significado, não decoração. Sustentam Confidence Badge, Source Attribution, Audit Panel, Explanation Bubble, Consulta ao Abraxos e respostas recuperadas por RAG.",
      typeSample: "Evidência Velaris",
      opacity: "com opacidade",
    };
  }

  return {
    eyebrow: "Taxonomia da linguagem visual",
    titleLead: "Tokens de",
    titleAccent: "Design",
    subtitle: "Valores base, contratos de interface e estados de explicabilidade organizados da fundação à aplicação.",
    heroNoteLabel: "Contrato da taxonomia",
    heroNote: "Valores se tornam decisões reutilizáveis quando sua finalidade e resolução permanecem explícitas.",
    metrics: {
      documented: "Documentados",
      preserved: "Base preservada",
      semantic: "Semânticos de interface",
      xai: "Contratos XAI",
      aliases: "Aliases",
      colors: "Cores únicas",
      components: "Componentes",
    },
    countNote: "A base preservada contém 32 primitivos estritos e cinco contratos semânticos de cor já existentes. As contagens de camada e aliases se sobrepõem de forma intencional.",
    guideEyebrow: "Modelo de leitura",
    guideTitle: "Como ler esta taxonomia",
    guideBody: "Tokens primitivos preservam valores base. Tokens semânticos descrevem papéis reutilizáveis de interface. Tokens XAI codificam confiança, fonte, evidência e auditoria. Aliases conectam essas camadas sem duplicar valores.",
    chapters: {
      primitive: { eyebrow: "Fundação", title: "Tokens primitivos preservados", lead: "Valores base que sustentam a identidade original do Velaris, com as cinco cores semânticas históricas identificadas separadamente." },
      semantic: { eyebrow: "Contratos de interface", title: "Tokens semânticos de interface", lead: "Papéis reutilizáveis que descrevem intenção, estado visual e comportamento sem criar um token para cada finalidade." },
      technical: { eyebrow: "Superfícies de engenharia", title: "Technical Color System", lead: "Paleta nativa Velaris para código, arquitetura, metadados e documentação — derivada de lavanda e violeta, não de defaults de IDE." },
      xai: { eyebrow: "Explicabilidade", title: "Tokens especializados de XAI", lead: "Contratos específicos para confiança, fonte, evidência e auditabilidade nas respostas do Abraxos." },
      aliases: { eyebrow: "Modelo de resolução", title: "Aliases e contratos semânticos", lead: "Um mesmo valor pode sustentar diferentes contratos explícitos sem duplicar decisões visuais." },
      coverage: { eyebrow: "Aplicação", title: "Cobertura por componente", lead: "Relação entre grupos de tokens e as necessidades comportamentais dos 25 componentes principais." },
    },
    groups: {
      text: ["Contratos de texto", "Hierarquia legível em superfícies escuras, estados desativados e ações inversas."],
      border: ["Contratos de borda", "Bordas reutilizáveis para controles, contêineres, foco e seleção."],
      interaction: ["Estados de interação", "Comportamento de hover, pressão, seleção, desativação e foco por teclado."],
      feedback: ["Feedback semântico", "Contratos de fundo, borda e foreground para mensagens do sistema."],
      "special-surface": ["Superfície e overlay", "Papéis de overlay, skeleton, linha selecionada e backdrop."],
      elevation: ["Elevação", "Hierarquia espacial para cards, popovers, notificações e diálogos."],
      layering: ["Camadas e z-index", "Empilhamento previsível para superfícies transitórias e bloqueantes."],
      dimension: ["Dimensões e acessibilidade", "Alturas de controles, alvos mínimos e escala de ícones."],
      typography: ["Tipografia semântica", "Papéis complementares para painéis, metadados e evidência técnica."],
    },
    technicalWhenUse: "Use para paths, comandos shell, metadados de schema, metas numéricas, blocos monospace, traces de execução e documentação de engenharia.",
    technicalWhenNot: "Não use para navegação, CTAs, momentos de marca, estados success/warning/error ou temas de persona. Esses papéis pertencem a primary, secondary e feedback.",
    technicalRule: "technical = o que é · feedback = como está",
    technicalExamples: [
      ["server.py", "technical.property"],
      ["npm run dev", "technical.command"],
      ["page_type = architecture", "technical.type"],
      ["META ≥ 0.80", "technical.number"],
      ["Execução concluída", "feedback-success"],
      ["Aviso: evidência em falta", "feedback-warning"],
    ],
    primaryScale: "Escala Primary",
    surfaceScale: "Escala Surface",
    preservedColors: "Contratos semânticos de cor preservados",
    preservedColorsLead: "Esses cinco contratos pertencem à base original de 37 tokens, mas são papéis semânticos e não primitivos estritos.",
    typography: "Tipografia base",
    spacing: "Espaçamento",
    radiusShadow: "Raios e sombra de identidade",
    motion: "Movimento e easing",
    token: "Token",
    value: "Valor",
    role: "Papel",
    usedBy: "Usado por",
    count: "tokens",
    canonical: "Canônico",
    alias: "Alias",
    type: "Tipo",
    target: "Destino",
    resolvedValue: "Valor resolvido",
    contract: "Contrato",
    category: "Categoria",
    components: "Componentes",
    tokenGroups: "Grupos de tokens",
    rationale: "Justificativa",
    aliasesNote: "Aliases são nomes explícitos para decisões existentes. Eles não criam novas cores nem aumentam a contagem de tokens canônicos.",
    xaiNote: "Tokens XAI codificam significado, não decoração. Eles sustentam Confidence Badge, Source Attribution, Audit Panel, Explanation Bubble, Consulta ao Abraxos e respostas recuperadas por RAG.",
    typeSample: "Evidência Velaris",
    opacity: "com opacidade",
  };
}

type PageCopy = ReturnType<typeof getCopy>;

function tokensIn(group: TokenGroupId, layer?: TokenLayer) {
  return canonicalTokens.filter(
    (token) => token.group === group && (layer === undefined || token.layer === layer),
  );
}

function tokenDescription(token: TokenDefinition, locale: Locale) {
  return locale === "en-US" ? token.description : TOKEN_DESCRIPTIONS_PT[token.name] ?? token.description;
}

function aliasDescription(alias: AliasDefinition, locale: Locale) {
  return locale === "en-US" ? alias.description : ALIAS_DESCRIPTIONS_PT[alias.name] ?? alias.description;
}

function coverageRationale(row: CoverageRow, locale: Locale) {
  return locale === "en-US" ? row.rationale : COVERAGE_RATIONALE_PT[row.components] ?? row.rationale;
}

function aliasCategory(group: string, locale: Locale) {
  if (locale === "en-US") return group;
  const labels: Record<string, string> = {
    Interaction: "Interação",
    Feedback: "Feedback",
    XAI: "XAI",
    Surface: "Superfície",
    Technical: "Técnico",
  };
  return labels[group] ?? group;
}

function TokenChapter({
  number,
  eyebrow,
  title,
  lead,
  tone = "default",
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  lead: string;
  tone?: "default" | "xai";
  children: ReactNode;
}) {
  return (
    <section
      data-token-chapter={number}
      className={`relative border-t border-white/[0.09] py-12 sm:py-14 ${
        tone === "xai" ? "isolate" : ""
      }`}
    >
      {tone === "xai" ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 inset-y-3 -z-10 rounded-[24px] bg-[radial-gradient(circle_at_82%_12%,rgba(178,138,242,0.09),transparent_38%),rgba(255,255,255,0.012)] lg:-inset-x-8"
        />
      ) : null}
      <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-x-4 sm:grid-cols-[56px_minmax(0,1fr)] sm:gap-x-6">
        <p className="pt-0.5 text-3xl font-semibold tracking-[-0.05em] text-[#a983e4]">
          {number}
        </p>
        <header>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b4a3c0]">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-[1.625rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[#f5f1f7] sm:text-[2rem]">
            {title}
          </h2>
          <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#9f98a6] sm:text-[15px]">
            {lead}
          </p>
        </header>
        <div className="col-start-2 mt-9 min-w-0">{children}</div>
      </div>
    </section>
  );
}

function ColorScale({
  title,
  tokens,
}: {
  title: string;
  tokens: TokenDefinition[];
}) {
  return (
    <section className="border-t border-white/[0.075] py-7 first:border-t-0 first:pt-0">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h3 className="text-base font-semibold tracking-[-0.02em] text-[#eee9f1]">{title}</h3>
        <span className="font-mono text-[10px] text-[#aaa2af]">{tokens.length}</span>
      </div>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${Math.min(tokens.length, 8)}, minmax(0, 1fr))` }}
      >
        {tokens.map((token) => (
          <div key={token.name} className="min-w-0">
            <div
              className="h-16 border border-white/[0.11] sm:h-20"
              style={{ background: token.value }}
            />
            <code className="mt-2 block truncate font-mono text-[9px] text-[#c8c0ce]">
              {token.name}
            </code>
            <code className="mt-0.5 block font-mono text-[10px] text-[#aaa2af]">
              {token.value}
            </code>
          </div>
        ))}
      </div>
    </section>
  );
}

function TokenLedger({
  tokens,
  locale,
  copy,
}: {
  tokens: TokenDefinition[];
  locale: Locale;
  copy: PageCopy;
}) {
  return (
    <div className="border-y border-white/[0.08]">
      <div className="hidden grid-cols-[minmax(160px,0.75fr)_minmax(160px,0.8fr)_minmax(0,1.3fr)_minmax(150px,0.75fr)] gap-5 border-b border-white/[0.08] py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#aaa2af] lg:grid">
        <span>{copy.token}</span>
        <span>{copy.value}</span>
        <span>{copy.role}</span>
        <span>{copy.usedBy}</span>
      </div>
      <ol>
        {tokens.map((token) => (
          <li
            key={token.name}
            className="grid gap-3 border-b border-white/[0.065] py-4 last:border-b-0 sm:grid-cols-[minmax(160px,0.8fr)_minmax(0,1.2fr)] lg:grid-cols-[minmax(160px,0.75fr)_minmax(160px,0.8fr)_minmax(0,1.3fr)_minmax(150px,0.75fr)] lg:gap-5"
          >
            <div className="flex min-w-0 items-start gap-2.5">
              {token.kind === "color" ? (
                <span
                  aria-hidden="true"
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 border border-white/[0.14]"
                  style={{ background: token.value }}
                />
              ) : null}
              <code className="break-all font-mono text-[11px] font-semibold leading-5 text-[#e9e3ed]">
                {token.name}
              </code>
            </div>
            <code className="break-all font-mono text-[10px] leading-5 text-[#a98ad8]">
              {token.value}
            </code>
            <p className="text-xs leading-5 text-[#aaa2af]">{tokenDescription(token, locale)}</p>
            <p className="text-[10px] uppercase leading-5 tracking-[0.12em] text-[#aaa2af]">
              {token.components}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function LedgerGroup({
  title,
  description,
  tokens,
  locale,
  copy,
}: {
  title: string;
  description: string;
  tokens: TokenDefinition[];
  locale: Locale;
  copy: PageCopy;
}) {
  return (
    <section className="border-t border-white/[0.075] py-8 first:border-t-0 first:pt-0">
      <header className="mb-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.025em] text-[#eee9f1]">{title}</h3>
          <p className="mt-1.5 max-w-[680px] text-xs leading-5 text-[#aaa2af]">{description}</p>
        </div>
        <p className="font-mono text-[10px] text-[#aaa2af]">
          {tokens.length} {copy.count}
        </p>
      </header>
      <TokenLedger tokens={tokens} locale={locale} copy={copy} />
    </section>
  );
}

function TypographyLedger({
  tokens,
  locale,
  copy,
}: {
  tokens: TokenDefinition[];
  locale: Locale;
  copy: PageCopy;
}) {
  return (
    <section className="border-t border-white/[0.075] py-8">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-[-0.025em] text-[#eee9f1]">{copy.typography}</h3>
        <span className="font-mono text-[10px] text-[#aaa2af]">{tokens.length}</span>
      </div>
      <div className="border-y border-white/[0.08]">
        {tokens.map((token) => (
          <article
            key={token.name}
            className="grid gap-4 border-b border-white/[0.065] py-5 last:border-b-0 md:grid-cols-[160px_minmax(220px,1fr)_minmax(220px,0.8fr)] md:items-center"
          >
            <div>
              <code className="font-mono text-[11px] font-semibold text-[#e9e3ed]">{token.name}</code>
              <code className="mt-1 block break-all font-mono text-[10px] leading-4 text-[#aaa2af]">
                {token.value}
              </code>
            </div>
            <p className={`${token.previewClass ?? ""} max-w-full overflow-hidden text-ellipsis`}>
              {copy.typeSample}
            </p>
            <div>
              <p className="text-xs leading-5 text-[#aaa2af]">{tokenDescription(token, locale)}</p>
              <p className="mt-1.5 text-[10px] uppercase tracking-[0.12em] text-[#aaa2af]">
                {token.components}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function XaiLedger({ locale, copy }: { locale: Locale; copy: PageCopy }) {
  const contracts = [
    ...xaiTokens.map((token) => ({
      name: token.name,
      value: token.value,
      description: tokenDescription(token, locale),
      components: token.components,
      type: copy.canonical,
      target: "",
    })),
    ...xaiAliases.map((alias) => ({
      name: alias.name,
      value: alias.resolvedValue,
      description: aliasDescription(alias, locale),
      components: alias.group,
      type: copy.alias,
      target: alias.target,
    })),
  ];

  return (
    <div>
      <p className="mb-6 max-w-[820px] text-sm leading-6 text-[#a9a1af]">{copy.xaiNote}</p>
      <div className="border-y border-[#b28af2]/[0.16]">
        <div className="hidden grid-cols-[minmax(170px,0.85fr)_110px_minmax(160px,0.75fr)_minmax(0,1.2fr)] gap-5 border-b border-white/[0.08] py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#aaa2af] lg:grid">
          <span>{copy.token}</span>
          <span>{copy.type}</span>
          <span>{copy.value}</span>
          <span>{copy.role}</span>
        </div>
        {contracts.map((contract) => (
          <article
            key={contract.name}
            className="grid gap-3 border-b border-white/[0.07] py-4 last:border-b-0 sm:grid-cols-[minmax(160px,0.8fr)_minmax(0,1.2fr)] lg:grid-cols-[minmax(170px,0.85fr)_110px_minmax(160px,0.75fr)_minmax(0,1.2fr)] lg:gap-5"
          >
            <code className="break-all font-mono text-[11px] font-semibold leading-5 text-[#eee8f3]">
              {contract.name}
            </code>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#c8acef]">
              {contract.type}
            </p>
            <div>
              <code className="break-all font-mono text-[10px] leading-5 text-[#b699df]">
                {contract.value}
              </code>
              {contract.target ? (
                <code className="mt-1 block break-all font-mono text-[10px] text-[#aaa2af]">
                  → {contract.target}
                </code>
              ) : null}
            </div>
            <div>
              <p className="text-xs leading-5 text-[#aaa2af]">{contract.description}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#aaa2af]">
                {contract.components}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ResolutionStudies({ copy }: { copy: PageCopy }) {
  return (
    <div className="grid border-y border-white/[0.09] md:grid-cols-2">
      <article className="py-6 pr-0 md:pr-8">
        <code className="font-mono text-xs font-semibold text-[#c3a4f1]">
          primary-200: #deccfd
        </code>
        <div className="mt-4 space-y-2 font-mono text-[10px] leading-5 text-[#8d8593]">
          <p>--velaris-color-primary → primary-200</p>
          <p>focus-ring → primary-200 {copy.opacity}</p>
          <p>border-focus → primary-200</p>
          <p>xai-evidence-highlight → primary-200 {copy.opacity}</p>
        </div>
      </article>
      <article className="border-t border-white/[0.09] py-6 md:border-l md:border-t-0 md:pl-8">
        <code className="font-mono text-xs font-semibold text-[#9bd7a2]">
          --velaris-color-success: #7ee787
        </code>
        <div className="mt-4 space-y-2 font-mono text-[10px] leading-5 text-[#8d8593]">
          <p>xai-confidence-high → --velaris-color-success</p>
          <p>feedback-success-icon → --velaris-color-success</p>
          <p>xai-audit-complete → --velaris-color-success</p>
        </div>
      </article>
    </div>
  );
}

function AliasTable({ locale, copy }: { locale: Locale; copy: PageCopy }) {
  return (
    <div className="mt-8 overflow-x-auto border-y border-white/[0.09]">
      <table className="data-table min-w-[900px]">
        <thead>
          <tr>
            <th className="px-4 py-3">{copy.alias}</th>
            <th className="px-4 py-3">{copy.target}</th>
            <th className="px-4 py-3">{copy.resolvedValue}</th>
            <th className="px-4 py-3">{copy.contract}</th>
            <th className="px-4 py-3">{copy.category}</th>
          </tr>
        </thead>
        <tbody>
          {aliasTokens.map((alias) => (
            <tr key={alias.name}>
              <td className="px-4 py-3">
                <code className="font-mono text-[11px] text-[#ece6ef]">{alias.name}</code>
              </td>
              <td className="px-4 py-3">
                <code className="font-mono text-[10px] text-[#b699df]">{alias.target}</code>
              </td>
              <td className="px-4 py-3">
                <code className="font-mono text-[10px] text-[#aaa2af]">{alias.resolvedValue}</code>
              </td>
              <td className="px-4 py-3 text-xs leading-5 text-[#aaa2af]">
                {aliasDescription(alias, locale)}
              </td>
              <td className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#aaa2af]">
                {aliasCategory(alias.group, locale)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CoverageTable({ locale, copy }: { locale: Locale; copy: PageCopy }) {
  return (
    <div className="overflow-x-auto border-y border-white/[0.09]">
      <table className="data-table min-w-[920px]">
        <thead>
          <tr>
            <th className="px-4 py-3">{copy.components}</th>
            <th className="px-4 py-3">{copy.tokenGroups}</th>
            <th className="px-4 py-3">{copy.rationale}</th>
          </tr>
        </thead>
        <tbody>
          {coverageRows.map((row) => (
            <tr key={row.components}>
              <td className="px-4 py-4">
                <p className="max-w-[280px] text-xs font-semibold leading-5 text-[#eee9f1]">
                  {row.components}
                </p>
                <p className="mt-1 font-mono text-[10px] text-[#aaa2af]">
                  {row.componentCount} {copy.components.toLowerCase()}
                </p>
              </td>
              <td className="px-4 py-4">
                <p className="max-w-[320px] text-[10px] uppercase leading-5 tracking-[0.11em] text-[#9b80c5]">
                  {row.groups.join(" · ")}
                </p>
              </td>
              <td className="px-4 py-4 text-xs leading-5 text-[#aaa2af]">
                {coverageRationale(row, locale)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TokensPage() {
  const { locale } = useI18n();
  const copy = getCopy(locale);
  const primaryTokens = tokensIn("primary");
  const surfaceTokens = tokensIn("surface");
  const primitiveTypography = tokensIn("typography", "primitive");

  const metrics = [
    [copy.metrics.documented, tokenMetrics.documented],
    [copy.metrics.preserved, tokenMetrics.preserved],
    [copy.metrics.semantic, tokenMetrics.semantic],
    [copy.metrics.xai, tokenMetrics.xai],
    [copy.metrics.aliases, tokenMetrics.aliases],
    [copy.metrics.colors, tokenMetrics.uniqueColors],
    [copy.metrics.components, tokenMetrics.components],
  ] as const;

  return (
    <article className="foundation-page">
      <FoundationSectionHero
        description={copy.subtitle}
        eyebrow={copy.eyebrow}
        icon={Palette}
        metricNote={copy.countNote}
        metrics={metrics.map(([label, value]) => ({ label, value }))}
        note={copy.heroNote}
        noteLabel={copy.heroNoteLabel}
        titleAccent={copy.titleAccent}
        titleLead={copy.titleLead}
      />

      <div className="foundation-content-shell">
      <FoundationSection>
        <FoundationSectionHeader
          aside={<p>{copy.guideBody}</p>}
          eyebrow={copy.guideEyebrow}
          title={copy.guideTitle}
        />
      </FoundationSection>

      <TokenChapter number="01" {...copy.chapters.primitive}>
        <ColorScale title={copy.primaryScale} tokens={primaryTokens} />
        <ColorScale title={copy.surfaceScale} tokens={surfaceTokens} />
        <LedgerGroup
          title={copy.preservedColors}
          description={copy.preservedColorsLead}
          tokens={preservedSemanticColors}
          locale={locale}
          copy={copy}
        />
        <TypographyLedger
          tokens={primitiveTypography}
          locale={locale}
          copy={copy}
        />
        <LedgerGroup
          title={copy.spacing}
          description={tokenDescription(tokensIn("spacing")[0], locale)}
          tokens={tokensIn("spacing")}
          locale={locale}
          copy={copy}
        />
        <LedgerGroup
          title={copy.radiusShadow}
          description={tokenDescription(tokensIn("radius-shadow")[0], locale)}
          tokens={tokensIn("radius-shadow")}
          locale={locale}
          copy={copy}
        />
        <LedgerGroup
          title={copy.motion}
          description={tokenDescription(tokensIn("motion")[0], locale)}
          tokens={tokensIn("motion")}
          locale={locale}
          copy={copy}
        />
      </TokenChapter>

      <TokenChapter number="02" {...copy.chapters.semantic}>
        {semanticGroupIds.map((groupId) => {
          const [title, description] = copy.groups[groupId as keyof typeof copy.groups];
          return (
            <LedgerGroup
              key={groupId}
              title={title}
              description={description}
              tokens={tokensIn(groupId, "semantic")}
              locale={locale}
              copy={copy}
            />
          );
        })}
      </TokenChapter>

      <TokenChapter number="03" {...copy.chapters.technical}>
        <div className="mb-8 max-w-[800px] space-y-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <p className="text-sm font-semibold tracking-[-0.02em] text-[#eee9f1]">{copy.technicalRule}</p>
          <p className="text-sm leading-6 text-[#aaa2af]">{copy.technicalWhenUse}</p>
          <p className="text-sm leading-6 text-[#aaa2af]">{copy.technicalWhenNot}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {copy.technicalExamples.map(([sample, token]) => (
              <div key={sample} className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] px-3 py-2">
                <code className="font-mono text-[10px] text-technical-string">{sample}</code>
                <code className="font-mono text-[10px] text-technical-accent">{token}</code>
              </div>
            ))}
          </div>
        </div>
        <LedgerGroup
          title="Technical roles"
          description="Engineering and documentation colors derived from the Velaris lavender system."
          tokens={technicalTokens}
          locale={locale}
          copy={copy}
        />
      </TokenChapter>

      <TokenChapter number="04" tone="xai" {...copy.chapters.xai}>
        <XaiLedger locale={locale} copy={copy} />
      </TokenChapter>

      <TokenChapter number="05" {...copy.chapters.aliases}>
        <p className="mb-6 max-w-[800px] text-sm leading-6 text-[#aaa2af]">{copy.aliasesNote}</p>
        <ResolutionStudies copy={copy} />
        <AliasTable locale={locale} copy={copy} />
      </TokenChapter>

      <TokenChapter number="06" {...copy.chapters.coverage}>
        <CoverageTable locale={locale} copy={copy} />
      </TokenChapter>
      </div>
    </article>
  );
}
