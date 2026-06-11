import {
  useWorkspaceComposer,
  useWorkspaceMessages,
  useWorkspacePreferences,
} from "../../providers/WorkspaceProvider";
import { useAuditTrail } from "../../hooks/useAuditTrail";
import { ChatMessage } from "./ChatMessage";

export function ChatStream() {
  const { bottomRef, messages } = useWorkspaceMessages();
  const { retryPrompt } = useWorkspaceComposer();
  const { content, settings } = useWorkspacePreferences();
  const { labels, openMessage, updateDecisionStatus, updatingDecisionId } = useAuditTrail();
  const visibleMessages = messages.filter((message) => !message.id.startsWith("assistant-persona-"));

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
          decisionUpdating={updatingDecisionId === message.decisionId}
          evidenceLabel={labels.evidence}
          viewAllLabel={labels.viewAll}
        />
      ))}
      <div ref={bottomRef} aria-hidden="true" />
    </div>
  );
}
