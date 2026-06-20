import { ArrowRight } from "lucide-react";
import { useI18n } from "../../../i18n/I18nProvider";
import { toDisplayTitle } from "../../domain/displayTitle";
import { usePersonaContext } from "../../hooks/usePersonaContext";
import {
  useWorkspaceComposer,
  useWorkspaceMessages,
  useWorkspacePreferences,
} from "../../providers/WorkspaceProvider";
import type { PersonaStrategy } from "../../types/beatrice";

export function useChatOnboarding() {
  const { messages } = useWorkspaceMessages();
  return !messages.some(
    (message) => message.role === "user" && !message.id.startsWith("assistant-persona-"),
  );
}

function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildWorkspaceEntries(strategy: PersonaStrategy, t: ReturnType<typeof useI18n>["t"]) {
  const profile = strategy.operationalProfile;
  const metric = profile.prioritizedMetrics[0] ?? profile.mainFocus;
  const fear = profile.operationalFears[0] ?? profile.primaryPain;

  return [
    {
      title: profile.title,
      subtitle: t("chat.workspace.entryAnalyze", { topic: profile.title.toLowerCase() }),
      body: strategy.examples[0] ?? profile.primaryResponsibility,
      icon: strategy.icon,
    },
    {
      title: capitalize(metric),
      subtitle: t("chat.workspace.entryEvaluate", { topic: metric }),
      body: strategy.examples[1] ?? profile.primaryPain,
      icon: strategy.icon,
    },
    {
      title: capitalize(fear),
      subtitle: t("chat.workspace.entryIdentify", { topic: fear }),
      body: strategy.examples[2] ?? profile.mainFocus,
      icon: strategy.icon,
    },
  ];
}

export function ChatPerspectiveIntro() {
  const { t } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();
  const operationalProfile = strategy.operationalProfile;
  const Icon = strategy.icon;

  return (
    <header className="beatrice-workspace-intro flex flex-col items-center text-center">
      <div className="relative mb-5">
        <div
          className={`pointer-events-none absolute -inset-4 rounded-full opacity-50 beatrice-intro-glow ${strategy.theme.accentBg}`}
          aria-hidden
        />
        <div
          className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border ${strategy.theme.accentBorder} ${strategy.theme.accentBg}`}
        >
          <Icon aria-hidden="true" className={`h-7 w-7 ${strategy.theme.accentText}`} />
        </div>
      </div>

      <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
        {strategy.workspaceTitle}
      </h2>
      <p className="mt-3 max-w-[36ch] text-sm leading-6 text-slate-400">
        {operationalProfile.primaryPain}
      </p>
      <p className="mt-5 text-[15px] font-medium text-slate-200">
        {t("chat.workspace.cta")}
      </p>
    </header>
  );
}

export function ChatSuggestionCards() {
  const { locale, t } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();
  const { setInput, submitPrompt } = useWorkspaceComposer();
  const entries = buildWorkspaceEntries(strategy, t);

  return (
    <div className="w-full">
      <div
        className="grid grid-cols-1 gap-2 sm:grid-cols-3"
        role="group"
        aria-label={strategy.workspaceTitle}
      >
        {entries.map((entry) => {
          const Icon = entry.icon;
          const title = toDisplayTitle(entry.title, locale);

          return (
            <button
              key={entry.title}
              type="button"
              onClick={() => {
                setInput(entry.body);
                void submitPrompt(entry.body);
              }}
              className="workspace-entry-card focus-ring group flex min-h-[4.5rem] flex-col justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-3 text-left transition-[border-color,background-color,transform] duration-200 ease-luxe hover:border-primary/20 hover:bg-white/[0.035] active:translate-y-px"
            >
              <div className="flex items-start justify-between gap-2">
                <Icon aria-hidden="true" className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${strategy.theme.accentText}`} />
                <ArrowRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 text-slate-600 transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-primary/70"
                />
              </div>
              <div className="mt-2 min-w-0">
                <p className="truncate text-[13px] font-semibold text-white">{title}</p>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-slate-500 transition-colors group-hover:text-slate-400">
                  {entry.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-center text-[11px] leading-4 text-slate-600">
        {t("chat.workspace.tip")}
      </p>
    </div>
  );
}
