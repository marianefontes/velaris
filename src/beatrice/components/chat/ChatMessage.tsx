import { memo, useId, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Clipboard,
  FileSearch,
  FileText,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
  XCircle,
} from "lucide-react";
import { AbraxosMark } from "../assistant/AbraxosMark";
import { COMMAND_META } from "../../domain/governance";
import { useI18n } from "../../../i18n/I18nProvider";
import type {
  BeatriceSettings,
  ChatContent,
  ChatMessage as ChatMessageModel,
  DecisionRecordStatus,
  SourceChip,
} from "../../types/beatrice";
import { CommandMarkdownRenderer, MarkdownRenderer } from "../primitives";
import { SecondaryButton } from "../../../components/ui/VisualPrimitives";
import { ChatLoadingState } from "./ChatLoadingState";
import { ChatNavigationActions } from "./ChatNavigationActions";
import { ExecutionSummaryBanner } from "./ExecutionSummaryBanner";

function SourceDetail({
  settings,
  source,
  t,
}: {
  settings: BeatriceSettings;
  source: SourceChip;
  t: ReturnType<typeof useI18n>["t"];
}) {
  const similarity = Math.round(source.similarity * 100);
  const [open, setOpen] = useState(false);
  const detailId = useId();

  return (
    <div
      className="rounded-xl border border-white/[0.07] bg-white/[0.018]"
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !open) return;
        event.preventDefault();
        setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={detailId}
        onClick={() => setOpen((current) => !current)}
        className="focus-ring flex min-h-11 w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left"
      >
        <FileText aria-hidden="true" className="h-4 w-4 shrink-0 text-primary/70" />
        <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-200">
          {source.title}
        </span>
        {settings.showEvidenceSimilarity && (
          <span className="shrink-0 text-[11px] font-semibold tabular-nums text-primary/75">
            {similarity}%
          </span>
        )}
        <ChevronDown
          aria-hidden="true"
          className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 ease-luxe ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div id={detailId} className="border-t border-white/[0.06] px-3 pb-3 pt-2.5">
        <p className="break-words font-mono text-[11px] leading-5 text-slate-400">
          {source.origin ?? source.source}
        </p>
        {source.excerpt && (
          <p className="mt-2 text-xs leading-5 text-slate-300">
            {source.excerpt}
          </p>
        )}
        {settings.showEvidenceSimilarity && (
          <p className="mt-2 text-[11px] leading-4 text-slate-400">
            {t("beatrice.chat.sourceSimilarityTitle", {
              source: source.source,
              similarity,
            })}
          </p>
        )}
      </div>}
    </div>
  );
}

function SourceDisclosure({
  evidenceLabel,
  settings,
  sources,
  t,
  viewAllLabel,
}: {
  evidenceLabel: string;
  settings: BeatriceSettings;
  sources: SourceChip[];
  t: ReturnType<typeof useI18n>["t"];
  viewAllLabel: string;
}) {
  const primarySources = sources.slice(0, 2);
  const additionalSources = sources.slice(2);
  const [showAll, setShowAll] = useState(false);
  const additionalSourcesId = useId();

  return (
    <section aria-label={evidenceLabel} className="mt-3 max-w-[72ch] border-t border-white/[0.07] pt-3 motion-safe:animate-fade-in">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-[11px] font-semibold text-slate-300">{evidenceLabel}</h3>
        <span className="text-[11px] tabular-nums text-slate-500">
          {t("beatrice.chat.sourceCount", { count: sources.length })}
        </span>
      </div>
      <div className="space-y-2">
        {primarySources.map((source, index) => (
          <SourceDetail key={`${source.source}-${index}`} settings={settings} source={source} t={t} />
        ))}
      </div>
      {additionalSources.length > 0 && (
        <div
          className="mt-2"
          onKeyDown={(event) => {
            if (event.key !== "Escape" || !showAll) return;
            event.preventDefault();
            setShowAll(false);
          }}
        >
          <button
            type="button"
            aria-expanded={showAll}
            aria-controls={additionalSourcesId}
            onClick={() => setShowAll((current) => !current)}
            className="focus-ring flex min-h-11 w-full items-center justify-between rounded-lg px-2 text-xs font-medium text-primary/80 transition-colors hover:bg-primary/[0.05] hover:text-primary"
          >
            <span>{viewAllLabel}</span>
            <span className="flex items-center gap-2 text-[11px] text-slate-400">
              +{additionalSources.length}
              <ChevronDown
                aria-hidden="true"
                className={`h-3.5 w-3.5 transition-transform duration-200 ease-luxe ${showAll ? "rotate-180" : ""}`}
              />
            </span>
          </button>
          {showAll && <div id={additionalSourcesId} className="mt-2 space-y-2">
            {additionalSources.map((source, index) => (
              <SourceDetail key={`${source.source}-${index + 2}`} settings={settings} source={source} t={t} />
            ))}
          </div>}
        </div>
      )}
    </section>
  );
}

// `content` and `settings` arrive as props (lifted out of useWorkspace) so this
// component no longer subscribes to the workspace context. The context value
// changes identity on every streamed frame, which would defeat the React.memo
// below : a direct useContext consumer always re-renders on context change.
// With stable props, memo lets static messages skip re-render while the active
// streaming message updates. See ChatStream (the sole call site).
function ChatMessageComponent({
  message,
  content,
  settings,
  onOpenAudit,
  onRetry,
  onUpdateDecision,
  onFeedback,
  feedbackRating,
  decisionUpdating = false,
  evidenceLabel,
  viewAllLabel,
}: {
  message: ChatMessageModel;
  content: ChatContent;
  settings: BeatriceSettings;
  onOpenAudit?: () => void;
  onRetry?: () => void;
  onUpdateDecision?: (
    decisionId: string,
    status: Exclude<DecisionRecordStatus, "draft">,
  ) => Promise<void>;
  onFeedback?: (rating: "up" | "down") => void;
  feedbackRating?: "up" | "down";
  decisionUpdating?: boolean;
  evidenceLabel: string;
  viewAllLabel: string;
}) {
  const { t } = useI18n();
  const density = {
    compact: {
      user: "px-4 py-3",
      assistant: "p-4",
      text: "text-sm leading-6",
      gap: "gap-3",
    },
    comfortable: {
      user: "px-5 py-4",
      assistant: "py-4 sm:py-5",
      text: "text-[15px] leading-6",
      gap: "gap-4",
    },
    dense: {
      user: "px-3.5 py-2.5",
      assistant: "py-3.5",
      text: "text-sm leading-6",
      gap: "gap-3",
    },
  }[settings.density];

  if (message.role === "user") {
    return (
      <article className="flex justify-end motion-safe:animate-message-in">
        <div className={`max-w-[32rem] rounded-[18px_18px_6px_18px] border border-primary/15 bg-primary/[0.075] shadow-[0_8px_24px_rgba(0,0,0,0.16)] ${density.user}`}>
          <p className={`${density.text} whitespace-pre-wrap text-on-surface`}>{message.content}</p>
          <p className="mt-2 text-right text-[11px] text-slate-500">{content.justNow}</p>
        </div>
      </article>
    );
  }

  return (
    <article className={`group/message flex min-w-0 ${density.gap} motion-safe:animate-message-in`}>
      <AbraxosMark variant="consult" size="sm" className="mt-1 hidden shrink-0 sm:block" />
      <div className="min-w-0 flex-1">
        {message.commandMode && !message.isStreaming && (
          <div className={`mb-2 flex min-h-10 flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border px-3 py-2 ${COMMAND_META[message.commandMode].borderClass} ${COMMAND_META[message.commandMode].bgClass}`}>
            <span aria-hidden="true" className={`text-sm font-bold ${COMMAND_META[message.commandMode].colorClass}`}>{COMMAND_META[message.commandMode].icon}</span>
            <span className={`text-[11px] font-semibold ${COMMAND_META[message.commandMode].colorClass}`}>
              {COMMAND_META[message.commandMode].label}: {t(message.engine ? "beatrice.chat.investigativeMode" : "beatrice.chat.operationalAction")}
            </span>
            <span className={`ml-auto text-[11px] opacity-70 ${COMMAND_META[message.commandMode].colorClass}`}>
              RAG + {t("beatrice.chat.sourceCount", { count: message.sources?.length ?? 0 })}
            </span>
          </div>
        )}

        {message.catalogMode && !message.isStreaming && (
          <div className="mb-2 flex min-h-10 flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-teal-400/20 bg-teal-400/[0.06] px-3 py-2">
            <span aria-hidden="true" className="text-sm font-bold text-teal-300">+</span>
            <span className="text-[11px] font-semibold text-teal-300">
              {t("beatrice.chat.catalogMode")}: {t("beatrice.chat.architecturalRegistry")}
            </span>
            <span className="ml-auto text-[11px] text-teal-300 opacity-70">
              {t("beatrice.chat.sourceCount", { count: message.sources?.length ?? 0 })} · {t("beatrice.chat.completenessPriority")}
            </span>
          </div>
        )}

        {!message.commandMode && !message.catalogMode && <ExecutionSummaryBanner message={message} />}

        <div
          role={message.isError ? "alert" : undefined}
          className={`border-y ${density.assistant} ${
            message.commandMode || message.catalogMode ? "max-w-[60rem]" : "max-w-[72ch]"
          } ${message.isError ? "border-red-400/25 bg-red-950/20 px-4 sm:px-5" : "border-white/[0.07]"}`}
        >
          {message.decisionId && (
            <p className="mb-3 text-[11px] font-semibold text-primary/80">
              Abraxos · {message.decisionId}
            </p>
          )}

          {message.isStreaming && message.content === "" ? (
            <ChatLoadingState />
          ) : message.responseCards ? (
            <>
              <p className="mb-4 text-[15px] leading-7 text-on-surface">{message.content}</p>
              <div className="mb-4 divide-y divide-white/[0.07] border-y border-white/[0.07]">
                {message.responseCards.map((card) => (
                  <div key={card.title} className="py-3.5">
                    <p className={`mb-1.5 text-xs font-semibold ${card.accent === "primary" ? "text-primary" : "text-secondary"}`}>
                      {card.title}
                    </p>
                    <p className="text-sm leading-6 text-slate-300">{card.text}</p>
                  </div>
                ))}
              </div>
              {message.conclusion && (
                <p className="text-sm leading-6 text-slate-300">
                  {content.coreRule}: <span className="font-medium text-on-surface">{message.conclusion}</span>
                </p>
              )}
            </>
          ) : (
            <>
              {(message.commandMode || message.catalogMode) && !message.isStreaming
                ? <CommandMarkdownRenderer text={message.content} />
                : <MarkdownRenderer text={message.content} />}
              {message.isStreaming && <span aria-hidden="true" className="ml-1 inline-block h-4 w-px bg-primary motion-safe:animate-pulse" />}
            </>
          )}
        </div>

        {message.isError && onRetry ? (
          <div className="mt-3 flex flex-wrap gap-2 px-4 sm:px-5">
            <SecondaryButton
              disabled={message.isStreaming}
              onClick={onRetry}
              className="min-h-11 gap-2 rounded-lg px-3 py-2"
            >
              <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
              {t("assistant.retry")}
            </SecondaryButton>
          </div>
        ) : null}

        {!message.isStreaming && (message.navigationAction || message.secondaryNavigationActions?.length) ? (
          <ChatNavigationActions
            navigationAction={message.navigationAction}
            secondaryNavigationActions={message.secondaryNavigationActions}
          />
        ) : null}

        {!message.isStreaming && settings.showSources && message.sources && message.sources.length > 0 && (
          <SourceDisclosure
            evidenceLabel={evidenceLabel}
            settings={settings}
            sources={message.sources}
            t={t}
            viewAllLabel={viewAllLabel}
          />
        )}

        {!message.isStreaming && message.cognitiveSkills && message.cognitiveSkills.length > 0 && (
          <details className="group/skills mt-2 max-w-[72ch]">
            <summary className="focus-ring flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-lg px-2 text-[11px] font-medium text-slate-500 transition-colors hover:bg-white/[0.025] hover:text-slate-300 [&::-webkit-details-marker]:hidden">
              <span>{t("chat.skillsUsed")}</span>
              <span className="tabular-nums text-slate-600">{message.cognitiveSkills.length}</span>
              <ChevronDown
                aria-hidden="true"
                className="ml-auto h-3.5 w-3.5 transition-transform duration-200 ease-luxe group-open/skills:rotate-180"
              />
            </summary>
            <div className="mt-1 space-y-2 rounded-xl border border-white/[0.07] bg-white/[0.015] p-3">
              {message.cognitiveSkills.map((skill) => (
                <div key={skill.id}>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-xs font-medium text-slate-200">{skill.label}</p>
                    <span className="text-[11px] text-primary/75">{skill.intensity}</span>
                    <span className="ml-auto text-[11px] tabular-nums text-slate-500">
                      {Math.round(skill.confidence * 100)}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{skill.reason}</p>
                </div>
              ))}
            </div>
          </details>
        )}

        {!message.isStreaming && !message.isError && (
          <div className="mt-2 flex flex-wrap gap-1 text-xs text-slate-500 opacity-100 transition-opacity duration-200 sm:opacity-70 sm:group-hover/message:opacity-100 sm:group-focus-within/message:opacity-100">
            <button
              type="button"
              className="focus-ring flex min-h-11 items-center gap-2 rounded-lg px-3 transition-colors hover:bg-white/[0.035] hover:text-primary"
              onClick={() => { void navigator.clipboard.writeText(message.content); }}
            >
              <Clipboard aria-hidden="true" className="h-4 w-4" />
              {t("chat.copy")}
            </button>
            {onFeedback && (
              <>
                <button
                  type="button"
                  disabled={!!feedbackRating}
                  aria-label={t("chat.helpful")}
                  aria-pressed={feedbackRating === "up"}
                  onClick={() => onFeedback("up")}
                  className={`focus-ring flex min-h-11 items-center gap-2 rounded-lg px-3 transition-colors disabled:cursor-default ${
                    feedbackRating === "up"
                      ? "text-success"
                      : "hover:bg-white/[0.035] hover:text-success disabled:opacity-40"
                  }`}
                >
                  <ThumbsUp aria-hidden="true" className="h-4 w-4" />
                  {!feedbackRating && <span className="sr-only sm:not-sr-only">{t("chat.helpful")}</span>}
                </button>
                <button
                  type="button"
                  disabled={!!feedbackRating}
                  aria-label={t("chat.notHelpful")}
                  aria-pressed={feedbackRating === "down"}
                  onClick={() => onFeedback("down")}
                  className={`focus-ring flex min-h-11 items-center gap-2 rounded-lg px-3 transition-colors disabled:cursor-default ${
                    feedbackRating === "down"
                      ? "text-red-400"
                      : "hover:bg-white/[0.035] hover:text-red-400 disabled:opacity-40"
                  }`}
                >
                  <ThumbsDown aria-hidden="true" className="h-4 w-4" />
                </button>
              </>
            )}
            {message.auditMetadata && onOpenAudit && (
              <button type="button" onClick={onOpenAudit} className="focus-ring flex min-h-11 items-center gap-2 rounded-lg px-3 transition-colors hover:bg-white/[0.035] hover:text-primary">
                <FileSearch aria-hidden="true" className="h-4 w-4" />
                {t("beatrice.chat.auditMetadata")}
              </button>
            )}
            {message.decisionId && message.decisionStatus === "draft" && onUpdateDecision && (
              <>
                <button
                  type="button"
                  disabled={decisionUpdating}
                  onClick={() => void onUpdateDecision(message.decisionId!, "confirmed")}
                  className="focus-ring flex min-h-11 items-center gap-2 rounded-lg px-3 text-success transition-colors hover:bg-success/[0.06] hover:text-success disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                  {t("beatrice.chat.confirmDecision")}
                </button>
                <button
                  type="button"
                  disabled={decisionUpdating}
                  onClick={() => void onUpdateDecision(message.decisionId!, "rejected")}
                  className="focus-ring flex min-h-11 items-center gap-2 rounded-lg px-3 text-red-400 transition-colors hover:bg-red-400/[0.06] hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <XCircle aria-hidden="true" className="h-4 w-4" />
                  {t("beatrice.chat.rejectDecision")}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

// Static (non-streaming) messages keep a stable `message` identity across
// frames (patchMessage in workspace.store only replaces the patched message),
// so memo skips them; only the active streaming bubble re-renders per frame.
export const ChatMessage = memo(ChatMessageComponent);
