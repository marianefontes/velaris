import { useState } from "react";
import {
  useWorkspaceComposer,
  useWorkspaceMessages,
  useWorkspacePreferences,
} from "../../providers/WorkspaceProvider";
import { useAuditTrail } from "../../hooks/useAuditTrail";
import { ChatMessage } from "./ChatMessage";
import type { ChatMessage as ChatMessageModel } from "../../types/beatrice";
import { getApiBaseUrl } from "../../../services/apiConfig";

export function ChatStream() {
  const { bottomRef, messages } = useWorkspaceMessages();
  const { retryPrompt } = useWorkspaceComposer();
  const { content, settings } = useWorkspacePreferences();
  const { labels, openMessage, updateDecisionStatus, updatingDecisionId } = useAuditTrail();
  const visibleMessages = messages.filter((message) => !message.id.startsWith("assistant-persona-"));

  const [feedbackRatings, setFeedbackRatings] = useState<Record<string, "up" | "down">>({});

  const handleFeedback = (message: ChatMessageModel, rating: "up" | "down") => {
    if (feedbackRatings[message.id]) return;
    setFeedbackRatings((prev) => ({ ...prev, [message.id]: rating }));

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
  };

  return (
    <div className="flex flex-col gap-7 pt-1">
      {visibleMessages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          content={content}
          settings={settings}
          onOpenAudit={() => openMessage(message.id)}
          onRetry={message.isError ? () => void retryPrompt(message.id) : undefined}
          onUpdateDecision={updateDecisionStatus}
          onFeedback={message.role === "assistant" && !message.isError && !message.isWelcome
            ? (rating) => handleFeedback(message, rating)
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
