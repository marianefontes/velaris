import { useCallback, useRef, useState } from "react";
import {
  useWorkspaceComposer,
  useWorkspaceMessages,
  useWorkspacePreferences,
} from "../../providers/WorkspaceProvider";
import { useAuditTrail } from "../../hooks/useAuditTrail";
import { ChatMessage } from "./ChatMessage";
import {
  ChatPerspectiveIntro,
  ChatSuggestionCards,
  useChatOnboarding,
} from "./ChatOnboarding";
import type { ChatMessage as ChatMessageModel } from "../../types/beatrice";
import { getApiBaseUrl } from "../../../services/apiConfig";

export function ChatStream() {
  const { bottomRef, messages } = useWorkspaceMessages();
  const { retryPrompt } = useWorkspaceComposer();
  const { content, settings } = useWorkspacePreferences();
  const { labels, openMessage, updateDecisionStatus, updatingDecisionId } = useAuditTrail();
  const isOnboarding = useChatOnboarding();

  const visibleMessages = messages.filter(
    (message) => !message.isWelcome && !message.id.startsWith("assistant-persona-"),
  );

  const [feedbackRatings, setFeedbackRatings] = useState<Record<string, "up" | "down">>({});
  const feedbackRatingsRef = useRef(feedbackRatings);
  feedbackRatingsRef.current = feedbackRatings;

  const messagesByIdRef = useRef(new Map<string, ChatMessageModel>());
  messagesByIdRef.current = new Map(visibleMessages.map((message) => [message.id, message]));

  const handleOpenAudit = useCallback((messageId: string) => {
    openMessage(messageId);
  }, [openMessage]);

  const handleRetry = useCallback((messageId: string) => {
    void retryPrompt(messageId);
  }, [retryPrompt]);

  const handleFeedback = useCallback((messageId: string, rating: "up" | "down") => {
    if (feedbackRatingsRef.current[messageId]) return;
    setFeedbackRatings((prev) => ({ ...prev, [messageId]: rating }));

    const message = messagesByIdRef.current.get(messageId);
    if (!message) return;

    const meta = message.auditMetadata;
    void fetch(`${getApiBaseUrl()}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating,
        request_id: meta?.request_id ?? null,
        user_query: meta?.query ?? "",
        detected_intent: message.intent ?? meta?.intent ?? "",
        detected_language: meta?.language ?? "",
      }),
    });
  }, []);

  if (isOnboarding) {
    return (
      <div className="beatrice-workspace-onboarding flex flex-1 flex-col items-center justify-center gap-8 py-8 sm:gap-10 sm:py-12">
        <ChatPerspectiveIntro />
        <div className="w-full max-w-[40rem]">
          <ChatSuggestionCards />
        </div>
        <div ref={bottomRef} className="sr-only" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7 pt-1">
      {visibleMessages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          content={content}
          settings={settings}
          onOpenAudit={message.auditMetadata ? handleOpenAudit : undefined}
          onRetry={message.isError ? handleRetry : undefined}
          onUpdateDecision={updateDecisionStatus}
          onFeedback={message.role === "assistant" && !message.isError && !message.isWelcome
            ? handleFeedback
            : undefined}
          feedbackRating={feedbackRatings[message.id]}
          decisionUpdating={updatingDecisionId === message.decisionId}
          evidenceLabel={labels.evidence}
          viewAllLabel={labels.viewAll}
        />
      ))}
      <div ref={bottomRef} aria-hidden="true" />
    </div>
  );
}
