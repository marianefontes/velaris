import {
  Accessibility,
  Ban,
  CheckCircle2,
  Focus,
  Keyboard,
  LoaderCircle,
  ScanLine,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import type { ComponentAccessibilityCriterionIcon } from "./componentAccessibilityPresentation";
import type { ComponentDoc, IntentExplanation } from "./componentPresentation";
import type { ComponentPlaygroundConfig } from "./componentWorkbench";

export interface ComponentSidePanelLabels {
  states: string;
  intents: string;
  noIntents: string;
  accessibility: string;
  aiRecommendation: string;
}

interface ComponentPanelBaseProps {
  component: ComponentDoc;
  config: ComponentPlaygroundConfig;
  labels: ComponentSidePanelLabels;
  onConfigChange: (patch: Partial<ComponentPlaygroundConfig>) => void;
}

const ACCESSIBILITY_ICONS = {
  keyboard: Keyboard,
  semantics: ScanLine,
  quality: ShieldCheck,
} satisfies Record<ComponentAccessibilityCriterionIcon, typeof Keyboard>;

const LOADING_STATES = new Set([
  "executing",
  "loading",
  "running",
  "searching",
  "submitting",
]);

const POSITIVE_STATES = new Set([
  "active",
  "checked",
  "complete",
  "high",
  "loaded",
  "on",
  "selected",
  "success",
  "valid",
  "visible",
]);

const NEGATIVE_STATES = new Set([
  "conflict",
  "error",
  "invalid",
  "unavailable",
]);

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function getIntentTone(intent: string): "negative" | "neutral" | "positive" {
  const value = normalize(intent);
  if (value === "positive" || value === "success") return "positive";
  if (value === "negative") return "negative";
  return "neutral";
}

function StateIcon({ state }: { state: string }) {
  const value = normalize(state);

  if (LOADING_STATES.has(value)) {
    return <LoaderCircle className="component-control-spinner h-3.5 w-3.5" aria-hidden />;
  }
  if (value === "disabled" || value === "unavailable") {
    return <Ban className="h-3.5 w-3.5" aria-hidden />;
  }
  if (value === "focus") {
    return <Focus className="h-3.5 w-3.5" aria-hidden />;
  }
  if (NEGATIVE_STATES.has(value)) {
    return <TriangleAlert className="h-3.5 w-3.5" aria-hidden />;
  }
  if (POSITIVE_STATES.has(value)) {
    return <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />;
  }
  return null;
}

export function ComponentControlsSection({
  component,
  config,
  labels,
  onConfigChange,
}: ComponentPanelBaseProps) {
  return (
    <section
      data-component-controls={component.id}
      data-component-side-panel={component.id}
      aria-label={`${component.title}: ${labels.states} e ${labels.intents}`}
      className="component-inspector-card component-controls-card component-detail-panel-fill"
    >
      <div className="grid min-w-0 gap-5 sm:grid-cols-2 sm:gap-0">
        <div className="min-w-0 sm:pr-5">
          <h3 className="component-inspector-label">{labels.states}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {component.states.map((state) => {
              const active = config.state === state;
              const unavailable = normalize(state) === "disabled";
              return (
                <button
                  key={state}
                  type="button"
                  aria-label={`${labels.states}: ${state}`}
                  aria-pressed={active}
                  onClick={() => onConfigChange({ state })}
                  data-unavailable-state={unavailable || undefined}
                  className="component-control-button"
                >
                  <StateIcon state={state} />
                  <span>{state}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-w-0 border-t border-white/[0.07] pt-5 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
          <h3 className="component-inspector-label">{labels.intents}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {component.intents.length > 0
              ? component.intents.map((intent) => {
                  const active = config.intent === intent;
                  const tone = getIntentTone(intent);
                  return (
                    <button
                      key={intent}
                      type="button"
                      aria-label={`${labels.intents}: ${intent}`}
                      aria-pressed={active}
                      onClick={() => onConfigChange({ intent })}
                      data-intent-tone={tone}
                      className="component-control-button"
                    >
                      <span
                        className="component-intent-dot"
                        data-intent-tone={tone}
                        aria-hidden
                      />
                      <span>{intent}</span>
                    </button>
                  );
                })
              : (
                  <p className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2.5 text-xs leading-5 text-slate-400">
                    {labels.noIntents}
                  </p>
                )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ComponentGuidanceSection({
  component,
  config,
  intentExplanation,
  labels,
}: Omit<ComponentPanelBaseProps, "onConfigChange"> & {
  intentExplanation: IntentExplanation;
}) {
  const recommendation = component.beatriceGuidance;
  const contextLabel = `${config.intent} · ${config.state}`;

  return (
    <section
      data-component-guidance={component.id}
      data-component-side-panel={component.id}
      aria-label={`${component.title}: ${labels.accessibility} e ${labels.aiRecommendation}`}
      className="component-inspector-card component-guidance-card component-detail-panel-fill overflow-hidden"
    >
      <div className="component-guidance-section component-guidance-section-accessibility" id="velaris-component-section-accessibility">
        <header className="component-guidance-header">
          <span className="component-inspector-icon component-inspector-icon-compact">
            <Accessibility className="h-3.5 w-3.5" aria-hidden />
          </span>
          <h3 className="component-inspector-label text-primary">{labels.accessibility}</h3>
        </header>

        <ul
          className={
            component.accessibility.criteria.length > 5
              ? "component-accessibility-compact component-accessibility-compact-grid"
              : "component-accessibility-compact"
          }
        >
          {component.accessibility.criteria.map((criterion) => {
            const Icon = ACCESSIBILITY_ICONS[criterion.icon];
            return (
              <li
                key={`${component.id}-${criterion.title}`}
                data-accessibility-criterion
                className="component-accessibility-compact-item"
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-primary/80" aria-hidden />
                <div className="min-w-0">
                  <h4 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                    {criterion.title}
                  </h4>
                  <p className="mt-0.5 text-[11px] leading-4 text-slate-400">
                    {criterion.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="component-guidance-section component-guidance-section-ai">
        <header className="component-guidance-header">
          <span className="component-inspector-icon component-inspector-icon-compact component-inspector-icon-ai">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
          </span>
          <h3 className="component-inspector-label text-primary">{labels.aiRecommendation}</h3>
        </header>

        <div className="component-ai-recommendation">
          <p className="text-[10px] font-semibold tracking-[0.08em] text-primary/70 normal-case">
            {contextLabel}
          </p>
          <p data-ai-recommendation className="mt-2 line-clamp-3 text-xs leading-5 text-slate-300">
            {recommendation}
          </p>
          <p className="sr-only">{intentExplanation.description}</p>
        </div>
      </div>
    </section>
  );
}

export function ComponentSidePanel({
  component,
  config,
  intentExplanation,
  labels,
  onConfigChange,
}: ComponentPanelBaseProps & {
  intentExplanation: IntentExplanation;
}) {
  return (
    <aside className="component-inspector">
      <ComponentControlsSection
        component={component}
        config={config}
        labels={labels}
        onConfigChange={onConfigChange}
      />
      <ComponentGuidanceSection
        component={component}
        config={config}
        intentExplanation={intentExplanation}
        labels={labels}
      />
    </aside>
  );
}
