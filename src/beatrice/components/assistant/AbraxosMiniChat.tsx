import { ExternalLink, Minus, SendHorizontal, X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../../i18n/I18nProvider";
import { useAbraxosAssistant } from "../../hooks/useAbraxosAssistant";
import type { NavigationAction } from "../../types/beatrice";
import { writeFloatingHandoff } from "../../storage/floatingHandoff";
import { AbraxosMark } from "./AbraxosMark";
import { ChatNavigationActions } from "../chat/ChatNavigationActions";

function contextLabel(context: ReturnType<typeof useAbraxosAssistant>["surfaceContext"]) {
  const page = context.page ?? context.page_title ?? "";
  const section = context.section ?? context.entity_name ?? "";
  if (page && section) return `${page} > ${section}`;
  return page || section || "—";
}

function MiniChatMessage({
  role,
  content,
  isStreaming,
  isError,
  errorKind,
  navigationAction,
  secondaryNavigationActions,
  onRetry,
}: {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  isError?: boolean;
  errorKind?: "backend" | "offline" | "technical";
  navigationAction?: NavigationAction;
  secondaryNavigationActions?: NavigationAction[];
  onRetry?: () => void;
}) {
  const { t } = useI18n();
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] rounded-2xl border px-3.5 py-2.5 text-[13px] leading-5 ${
          isUser
            ? "border-primary/25 bg-primary/15 text-white"
            : "border-white/[0.08] bg-surface-container-high/80 text-slate-200"
        }`}
      >
        <p className="whitespace-pre-wrap">{content || (isStreaming ? t("assistant.thinking") : "")}</p>
        {isStreaming ? (
          <p className="mt-1 text-[10px] text-slate-400" aria-live="polite">
            {t("assistant.thinking")}
          </p>
        ) : null}
        {isError && errorKind === "offline" ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-amber-200/90">{t("assistant.offlineCompact")}</span>
            {onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="focus-ring rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-white transition-colors hover:border-primary/35"
              >
                {t("assistant.retry")}
              </button>
            ) : null}
          </div>
        ) : null}
        {!isStreaming && !isError && (navigationAction || secondaryNavigationActions?.length) ? (
          <ChatNavigationActions
            compact
            navigationAction={navigationAction}
            secondaryNavigationActions={secondaryNavigationActions}
          />
        ) : null}
      </div>
    </div>
  );
}

export function AbraxosMiniChat({
  fabRef,
}: {
  fabRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const titleId = useId();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const {
    closeAbraxos,
    history,
    input,
    isLoading,
    isOpen,
    isVisible,
    messages,
    retryLastPrompt,
    setInput,
    submitPrompt,
    surfaceContext,
  } = useAbraxosAssistant();

  useEffect(() => {
    if (!isOpen || !messagesRef.current) return;
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [isOpen, messages, isLoading]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeAbraxos();
      fabRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeAbraxos, fabRef, isOpen]);

  if (!isVisible || !isOpen) return null;

  const canSubmit = input.trim().length > 0 && !isLoading;
  const perspective = surfaceContext.active_perspective;

  const openFullChat = () => {
    writeFloatingHandoff({
      context: surfaceContext,
      input,
      messages: messages.filter((message) => !message.isWelcome),
      history,
    });
    closeAbraxos();
    navigate("/oracle");
  };

  return (
    <section
      id="abraxos-mini-chat"
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      className="fixed inset-x-3 bottom-[5.25rem] z-[59] flex max-h-[min(680px,calc(100dvh-6.5rem))] flex-col overflow-hidden rounded-[22px] border border-white/[0.1] bg-surface-container/90 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:inset-x-auto sm:bottom-[5.75rem] sm:right-6 sm:w-[min(420px,calc(100vw-3rem))] sm:max-h-[min(640px,calc(100dvh-7rem))]"
    >
      <header className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-4 sm:px-5 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <AbraxosMark size="lg" variant="chat" className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" />
          <div className="min-w-0">
            <h2 id={titleId} className="text-[15px] font-semibold leading-5 text-white sm:text-base">
              {t("assistant.title")}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-300/90">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {t("assistant.online")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              closeAbraxos();
              fabRef.current?.focus();
            }}
            aria-label={t("assistant.minimize")}
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            <Minus aria-hidden="true" className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              closeAbraxos();
              fabRef.current?.focus();
            }}
            aria-label={t("assistant.close")}
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="border-b border-white/[0.06] px-4 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          {t("assistant.currentContext")}
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-xs text-slate-200">{contextLabel(surfaceContext)}</p>
          {perspective ? (
            <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              {perspective}
            </span>
          ) : null}
        </div>
      </div>

      <div
        ref={messagesRef}
        className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((message) => (
          <MiniChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
            isStreaming={message.isStreaming}
            isError={message.isError}
            errorKind={message.errorKind}
            navigationAction={message.navigationAction}
            secondaryNavigationActions={message.secondaryNavigationActions}
            onRetry={message.isError ? () => void retryLastPrompt() : undefined}
          />
        ))}
      </div>

      <footer className="border-t border-white/[0.08] p-3">
        <form
          className="flex items-end gap-2 rounded-2xl border border-white/[0.08] bg-black/20 px-3 py-2"
          onSubmit={(event) => {
            event.preventDefault();
            void submitPrompt();
          }}
        >
          <label htmlFor="abraxos-mini-chat-input" className="sr-only">
            {t("assistant.inputLabel")}
          </label>
          <textarea
            ref={inputRef}
            id="abraxos-mini-chat-input"
            rows={1}
            value={input}
            disabled={isLoading}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && canSubmit) {
                event.preventDefault();
                void submitPrompt();
              }
            }}
            placeholder={t("assistant.inputPlaceholder")}
            className="max-h-24 min-h-10 flex-1 resize-none bg-transparent py-1.5 text-[14px] leading-5 text-white outline-none focus:outline-none focus-visible:outline-none placeholder:text-slate-500 disabled:cursor-wait disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!canSubmit}
            aria-label={t("assistant.send")}
            className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-signature text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <SendHorizontal aria-hidden="true" className="h-4 w-4" />
          </button>
        </form>

        <button
          type="button"
          onClick={openFullChat}
          className="focus-ring mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/25 bg-transparent px-3 py-2.5 text-xs font-medium text-primary transition-colors hover:border-primary/40 hover:bg-primary/[0.06]"
        >
          {t("assistant.openFullChat")}
          <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
      </footer>
    </section>
  );
}
