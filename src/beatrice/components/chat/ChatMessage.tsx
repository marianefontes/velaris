import { memo } from "react";
import { Clipboard, Link2, Sparkles, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";
import { COMMAND_META } from "../../domain/governance";
import { useI18n } from "../../../i18n/I18nProvider";
import type { BeatriceSettings, ChatContent, ChatMessage as ChatMessageModel } from "../../types/beatrice";
import { CommandMarkdownRenderer, MarkdownRenderer } from "../primitives";
import { ChatLoadingState } from "./ChatLoadingState";
import { ReasoningBanner } from "./ReasoningBanner";

// `content` and `settings` arrive as props (lifted out of useWorkspace) so this
// component no longer subscribes to the workspace context. The context value
// changes identity on every streamed frame, which would defeat the React.memo
// below — a direct useContext consumer always re-renders on context change.
// With stable props, memo lets static messages skip re-render while the active
// streaming message updates. See ChatStream (the sole call site).
function ChatMessageComponent({
  message,
  content,
  settings,
}: {
  message: ChatMessageModel;
  content: ChatContent;
  settings: BeatriceSettings;
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
      assistant: "p-5",
      text: "text-sm leading-6",
      gap: "gap-4",
    },
    dense: {
      user: "px-3.5 py-2.5",
      assistant: "p-3.5",
      text: "text-xs leading-5",
      gap: "gap-3",
    },
  }[settings.density];

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className={`max-w-[32rem] rounded-[16px_16px_4px_16px] border border-primary/20 bg-[linear-gradient(45deg,rgba(222,204,253,0.15),rgba(194,160,252,0.15))] ${density.user}`}>
          <p className={`${density.text} text-on-surface`}>{message.content}</p>
          <p className="mt-2 text-right text-[10px] text-on-surface-variant">{content.justNow}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${density.gap}`}>
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-signature">
        <Sparkles className="h-4 w-4 text-on-primary" />
      </div>
      <div className="flex-1">
        {message.commandMode && !message.isStreaming && (
          <div className={`mb-2 flex items-center gap-2 rounded-xl border px-3 py-1.5 ${COMMAND_META[message.commandMode].borderClass} ${COMMAND_META[message.commandMode].bgClass}`}>
            <span className={`text-sm font-bold ${COMMAND_META[message.commandMode].colorClass}`}>{COMMAND_META[message.commandMode].icon}</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${COMMAND_META[message.commandMode].colorClass}`}>
              {COMMAND_META[message.commandMode].label} — {message.engine ? "Modo investigativo" : "Ação operacional"}
            </span>
            <span className={`ml-auto text-[9px] opacity-50 ${COMMAND_META[message.commandMode].colorClass}`}>
              RAG + {message.sources?.length ?? 0} sources
            </span>
          </div>
        )}

        {message.catalogMode && !message.isStreaming && (
          <div className="mb-2 flex items-center gap-2 rounded-xl border border-teal-400/25 bg-teal-400/8 px-3 py-1.5">
            <span className="text-sm font-bold text-teal-400">+</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400">CATALOG MODE — Registry Arquitetural</span>
            <span className="ml-auto text-[9px] text-teal-400 opacity-50">{message.sources?.length ?? 0} fontes · completude prioritária</span>
          </div>
        )}

        {!message.commandMode && !message.catalogMode && <ReasoningBanner message={message} />}

        <div className={`rounded-[4px_16px_16px_16px] border ${density.assistant} ${
          message.commandMode || message.catalogMode ? "max-w-[56rem]" : "max-w-[38rem]"
        } ${message.isError ? "border-red-500/20 bg-red-950/30" : "border-white/10 bg-surface-container-highest/70"}`}>
          {message.decisionId && (
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
              Beatrice · {message.decisionId}
            </p>
          )}

          {message.isStreaming && message.content === "" ? (
            <ChatLoadingState />
          ) : message.responseCards ? (
            <>
              <p className="mb-4 text-sm leading-7 text-on-surface">{message.content}</p>
              <div className="mb-4 flex flex-col gap-3">
                {message.responseCards.map((card) => (
                  <div key={card.title} className={`rounded-xl border p-3 ${
                    card.accent === "primary" ? "border-primary/10 bg-primary/5" : "border-secondary/10 bg-secondary/5"
                  }`}>
                    <p className="mb-1 text-xs font-bold text-on-surface">{card.title}</p>
                    <p className="text-xs leading-6 text-on-surface-variant">{card.text}</p>
                  </div>
                ))}
              </div>
              {message.conclusion && (
                <p className="text-xs leading-6 text-on-surface-variant">
                  {content.coreRule}: <span className="font-medium text-on-surface">{message.conclusion}</span>
                </p>
              )}
            </>
          ) : (
            <>
              {(message.commandMode || message.catalogMode) && !message.isStreaming
                ? <CommandMarkdownRenderer text={message.content} />
                : <MarkdownRenderer text={message.content} />}
              {message.isStreaming && <span className="ml-0.5 inline-block h-4 w-0.5 bg-primary motion-safe:animate-pulse" />}
              {!message.isStreaming && settings.showSources && message.sources && message.sources.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.sources.map((source, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary"
                      title={settings.showConfidence ? `${source.source} - ${Math.round(source.similarity * 100)}% similarity` : source.source}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary opacity-70" />
                      {source.title}
                      {settings.showConfidence && (
                        <span className="ml-0.5 font-normal opacity-60">{Math.round(source.similarity * 100)}%</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Transparent cognitive-skill disclosure — Camada 1 XAI signal. */}
        {!message.isStreaming && message.cognitiveSkills && message.cognitiveSkills.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-on-surface-variant">
              {t("chat.skillsUsed")}
            </span>
            {message.cognitiveSkills.map((skill) => (
              <span
                key={skill.id}
                title={`${skill.reason} · ${Math.round(skill.confidence * 100)}%`}
                className="flex items-center gap-1 rounded-full border border-primary/15 bg-primary/5 px-2 py-0.5 text-[9px] font-semibold text-primary/80"
              >
                {skill.label}
                <span className="font-normal opacity-50">{skill.intensity}</span>
              </span>
            ))}
          </div>
        )}

        {!message.isStreaming && !message.isError && (
          <div className="mt-2 flex gap-4 pl-1 text-[10px] text-on-surface-variant">
            <button className="flex items-center gap-1 transition-colors hover:text-primary">
              <ThumbsUp className="h-3.5 w-3.5" />
              {t("chat.helpful")}
            </button>
            <button
              className="flex items-center gap-1 transition-colors hover:text-primary"
              onClick={() => { void navigator.clipboard.writeText(message.content); }}
            >
              <Clipboard className="h-3.5 w-3.5" />
              {t("chat.copy")}
            </button>
            <Link to="/foundations" className="flex items-center gap-1 transition-colors hover:text-primary">
              <Link2 className="h-3.5 w-3.5" />
              {t("chat.viewDecision")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Static (non-streaming) messages keep a stable `message` identity across
// frames (patchMessage in workspace.store only replaces the patched message),
// so memo skips them; only the active streaming bubble re-renders per frame.
export const ChatMessage = memo(ChatMessageComponent);
