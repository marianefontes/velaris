import { useState } from "react";
import { useI18n } from "../../../i18n/I18nProvider";
import type { TranslationKey } from "../../../i18n/translations";
import {
  getResearchOnboardingExamples,
  getVelarisOnboardingExamples,
  ONBOARDING_PERSPECTIVES,
  type AbraxosOnboardingVariant,
} from "../../domain/assistant/onboardingContent";

interface AbraxosOnboardingPanelProps {
  variant: AbraxosOnboardingVariant;
  onDismiss: () => void;
  onExampleSelect: (prompt: string) => void;
}

function ExampleButton({
  prompt,
  onSelect,
}: {
  prompt: string;
  onSelect: (prompt: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(prompt)}
      className="focus-ring w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-left text-[12px] leading-5 text-slate-300 transition-colors hover:border-primary/25 hover:bg-white/[0.04] hover:text-white"
    >
      {prompt}
    </button>
  );
}

function VelarisOnboarding({
  expanded,
  onToggleExpanded,
  onDismiss,
  onExampleSelect,
}: {
  expanded: boolean;
  onToggleExpanded: () => void;
  onDismiss: () => void;
  onExampleSelect: (prompt: string) => void;
}) {
  const { locale, t } = useI18n();
  const examples = getVelarisOnboardingExamples(locale);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[15px] font-semibold text-white">{t("assistant.onboarding.velarisWelcome")}</h3>
        <p className="mt-2 text-[13px] leading-5 text-slate-400">{t("assistant.onboarding.velarisLead")}</p>
      </div>

      {expanded ? (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            {t("assistant.onboarding.exploreExamples")}
          </p>
          <div className="space-y-1.5">
            {examples.map((prompt) => (
              <ExampleButton key={prompt} prompt={prompt} onSelect={onExampleSelect} />
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {!expanded ? (
          <button
            type="button"
            onClick={onToggleExpanded}
            className="focus-ring rounded-full border border-white/[0.12] bg-white/[0.03] px-3.5 py-2 text-[12px] font-medium text-slate-200 transition-colors hover:border-primary/30 hover:text-white"
          >
            {t("assistant.onboarding.exploreExamples")}
          </button>
        ) : null}
        <button
          type="button"
          onClick={onDismiss}
          className="focus-ring rounded-full border border-primary/30 bg-primary/15 px-3.5 py-2 text-[12px] font-medium text-primary transition-colors hover:border-primary/45 hover:bg-primary/20"
        >
          {t("assistant.onboarding.startChat")}
        </button>
      </div>
    </div>
  );
}

function ResearchOnboarding({
  expanded,
  onToggleExpanded,
  onDismiss,
  onExampleSelect,
}: {
  expanded: boolean;
  onToggleExpanded: () => void;
  onDismiss: () => void;
  onExampleSelect: (prompt: string) => void;
}) {
  const { locale, t } = useI18n();
  const categories: Array<{ key: TranslationKey; emoji: string; id: string }> = [
    { key: "assistant.onboarding.categories.understanding", emoji: "🔍", id: "understanding" },
    { key: "assistant.onboarding.categories.decision", emoji: "⚖️", id: "decision" },
    { key: "assistant.onboarding.categories.institutional", emoji: "🧠", id: "institutional" },
    { key: "assistant.onboarding.categories.engineering", emoji: "🔧", id: "engineering" },
  ];
  const researchExamples = getResearchOnboardingExamples(locale);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[15px] font-semibold text-white">{t("assistant.onboarding.researchWelcome")}</h3>
        <p className="mt-2 text-[13px] leading-5 text-slate-400">{t("assistant.onboarding.researchLead")}</p>
      </div>

      {expanded ? (
        <div className="space-y-3">
          {categories.map(({ key, emoji, id }) => {
            const examples = researchExamples[id] ?? [];
            return (
              <div key={key}>
                <p className="text-[12px] font-semibold text-slate-200">
                  {emoji} {t(key)}
                </p>
                <ul className="mt-1.5 space-y-1.5">
                  {examples.map((prompt) => (
                    <li key={prompt}>
                      <ExampleButton prompt={prompt} onSelect={onExampleSelect} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ) : null}

      <p className="text-[12px] leading-5 text-slate-500">{t("assistant.onboarding.researchSuggestion")}</p>

      <div className="flex flex-wrap gap-2">
        {!expanded ? (
          <button
            type="button"
            onClick={onToggleExpanded}
            className="focus-ring rounded-full border border-white/[0.12] bg-white/[0.03] px-3.5 py-2 text-[12px] font-medium text-slate-200 transition-colors hover:border-primary/30 hover:text-white"
          >
            {t("assistant.onboarding.showExamples")}
          </button>
        ) : null}
        <button
          type="button"
          onClick={onDismiss}
          className="focus-ring rounded-full border border-primary/30 bg-primary/15 px-3.5 py-2 text-[12px] font-medium text-primary transition-colors hover:border-primary/45 hover:bg-primary/20"
        >
          {t("assistant.onboarding.start")}
        </button>
      </div>
    </div>
  );
}

function GuideOnboarding({
  onDismiss,
  onExampleSelect,
}: {
  onDismiss: () => void;
  onExampleSelect: (prompt: string) => void;
}) {
  const { locale, t } = useI18n();
  const examples = getVelarisOnboardingExamples(locale);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[15px] font-semibold text-white">{t("assistant.onboarding.guideTitle")}</h3>
      </div>

      <div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-300/80">
            {t("assistant.onboarding.guideDoesTitle")}
          </p>
          <p className="mt-1 text-[12px] leading-5 text-slate-300">{t("assistant.onboarding.guideDoes")}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-300/80">
            {t("assistant.onboarding.guideDoesNotTitle")}
          </p>
          <p className="mt-1 text-[12px] leading-5 text-slate-300">{t("assistant.onboarding.guideDoesNot")}</p>
        </div>
      </div>

      <div className="space-y-1.5">
        {examples.slice(0, 4).map((prompt) => (
          <ExampleButton key={prompt} prompt={prompt} onSelect={onExampleSelect} />
        ))}
      </div>

      <div>
        <p className="text-[12px] font-medium text-slate-200">{t("assistant.onboarding.perspectivesTitle")}</p>
        <ul className="mt-2 space-y-1 text-[11px] leading-4 text-slate-400">
          {ONBOARDING_PERSPECTIVES.map((perspective) => (
            <li key={`${perspective.name}-${perspective.role}`}>
              <button
                type="button"
                onClick={() => onExampleSelect(perspective.examplePrompt)}
                className="focus-ring text-left transition-colors hover:text-primary"
              >
                {perspective.name} — {perspective.role}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[11px] leading-4 text-slate-500">{t("assistant.onboarding.perspectivesHint")}</p>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="focus-ring rounded-full border border-primary/30 bg-primary/15 px-3.5 py-2 text-[12px] font-medium text-primary transition-colors hover:border-primary/45 hover:bg-primary/20"
      >
        {t("assistant.onboarding.startChat")}
      </button>
    </div>
  );
}

export function AbraxosOnboardingPanel({
  variant,
  onDismiss,
  onExampleSelect,
}: AbraxosOnboardingPanelProps) {
  const [expanded, setExpanded] = useState(variant === "research");

  const handleExampleSelect = (prompt: string) => {
    onDismiss();
    onExampleSelect(prompt);
  };

  return (
    <div
      className="rounded-2xl border border-primary/15 bg-gradient-to-b from-primary/[0.08] to-transparent p-4"
      aria-live="polite"
    >
      {variant === "velaris" ? (
        <VelarisOnboarding
          expanded={expanded}
          onToggleExpanded={() => setExpanded(true)}
          onDismiss={onDismiss}
          onExampleSelect={handleExampleSelect}
        />
      ) : null}
      {variant === "research" ? (
        <ResearchOnboarding
          expanded={expanded}
          onToggleExpanded={() => setExpanded(true)}
          onDismiss={onDismiss}
          onExampleSelect={handleExampleSelect}
        />
      ) : null}
      {variant === "guide" ? (
        <GuideOnboarding onDismiss={onDismiss} onExampleSelect={handleExampleSelect} />
      ) : null}
    </div>
  );
}
