import { Clipboard, Link2, Sparkles, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";
import { COMMAND_META } from "../../domain/governance";
import { useI18n } from "../../../i18n/I18nProvider";
import type { ChatMessage as ChatMessageModel } from "../../types/beatrice";
import { useWorkspace } from "../../providers/WorkspaceProvider";
import { CommandMarkdownRenderer, MarkdownRenderer } from "../primitives";
import { ChatLoadingState } from "./ChatLoadingState";

export function ChatMessage({ message }: { message: ChatMessageModel }) {
  const { t } = useI18n();
  const { content } = useWorkspace();

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[32rem] rounded-[16px_16px_4px_16px] border border-primary/20 bg-[linear-gradient(45deg,rgba(222,204,253,0.15),rgba(194,160,252,0.15))] px-5 py-4">
          <p className="text-sm leading-6 text-white">{message.content}</p>
          <p className="mt-2 text-right text-[10px] text-slate-500">{content.justNow}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-signature">
        <Sparkles className="h-4 w-4 text-on-primary" />
      </div>
      <div className="flex-1">
        {message.commandMode && !message.isStreaming && (
          <div className={`mb-2 flex items-center gap-2 rounded-xl border px-3 py-1.5 ${COMMAND_META[message.commandMode].borderClass} ${COMMAND_META[message.commandMode].bgClass}`}>
            <span className={`text-sm font-bold ${COMMAND_META[message.commandMode].colorClass}`}>{COMMAND_META[message.commandMode].icon}</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${COMMAND_META[message.commandMode].colorClass}`}>
              /{message.commandMode} — Governance Engine
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

        <div className={`rounded-[4px_16px_16px_16px] border p-5 ${
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
              <p className="mb-4 text-sm leading-7 text-slate-300">{message.content}</p>
              <div className="mb-4 flex flex-col gap-3">
                {message.responseCards.map((card) => (
                  <div key={card.title} className={`rounded-xl border p-3 ${
                    card.accent === "primary" ? "border-primary/10 bg-primary/5" : "border-secondary/10 bg-secondary/5"
                  }`}>
                    <p className="mb-1 text-xs font-bold text-white">{card.title}</p>
                    <p className="text-xs leading-6 text-slate-400">{card.text}</p>
                  </div>
                ))}
              </div>
              {message.conclusion && (
                <p className="text-xs leading-6 text-slate-400">
                  {content.coreRule}: <span className="font-medium text-white">{message.conclusion}</span>
                </p>
              )}
            </>
          ) : (
            <>
              {(message.commandMode || message.catalogMode) && !message.isStreaming
                ? <CommandMarkdownRenderer text={message.content} />
                : <MarkdownRenderer text={message.content} />}
              {message.isStreaming && <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-primary" />}
              {!message.isStreaming && message.sources && message.sources.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.sources.map((source, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary"
                      title={`${source.source} — ${Math.round(source.similarity * 100)}% similarity`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary opacity-70" />
                      {source.title}
                      <span className="ml-0.5 font-normal opacity-60">{Math.round(source.similarity * 100)}%</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {!message.isStreaming && !message.isError && (
          <div className="mt-2 flex gap-4 pl-1 text-[10px] text-slate-500">
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
            <Link to="/design-decisions" className="flex items-center gap-1 transition-colors hover:text-primary">
              <Link2 className="h-3.5 w-3.5" />
              {t("chat.viewDecision")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
