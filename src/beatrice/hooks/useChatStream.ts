import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Locale } from "../../i18n/translations";
import type { ChatMessage, HistoryEntry, ProfileId } from "../types/beatrice";
import {
  commandModeForPrompt,
  createStreamingAssistantMessage,
  createUserMessage,
  offlineMessage,
  parseEventStream,
  requestProfile,
  submitChatRequest,
} from "../orchestrators/chat.orchestrator";
import { appendStreamingMetadata, patchMessage } from "../stores/workspace.store";

interface UseChatStreamParams {
  input: string;
  isLoading: boolean;
  history: HistoryEntry[];
  locale: Locale;
  profileId: ProfileId;
  setHistory: Dispatch<SetStateAction<HistoryEntry[]>>;
  setInput: Dispatch<SetStateAction<string>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
}

export function useChatStream({
  input,
  isLoading,
  history,
  locale,
  profileId,
  setHistory,
  setInput,
  setIsLoading,
  setMessages,
}: UseChatStreamParams) {
  return useCallback(
    async (promptText?: string) => {
      const text = (promptText ?? input).trim();
      if (!text || isLoading) return;

      const detectedCommand = commandModeForPrompt(text);
      const userMessage = createUserMessage(text);
      const assistantMessage = createStreamingAssistantMessage(detectedCommand);
      const streamId = assistantMessage.id;

      setMessages((previous) => [...previous, userMessage, assistantMessage]);
      setInput("");
      setIsLoading(true);

      const nextHistory: HistoryEntry[] = [...history, { role: "user", content: text }];
      setHistory(nextHistory);

      try {
        const response = await submitChatRequest(nextHistory, requestProfile(profileId, detectedCommand));
        let full = "";

        for await (const parsed of parseEventStream(response)) {
          if (parsed.error) {
            setMessages((previous) =>
              patchMessage(previous, streamId, {
                content: `⚠️ ${parsed.error}`,
                isStreaming: false,
                isError: true,
              }),
            );
            setIsLoading(false);
            return;
          }

          if (parsed.sources !== undefined || parsed.intent !== undefined) {
            setMessages((previous) =>
              appendStreamingMetadata(previous, streamId, {
                sources: parsed.sources,
                intent: parsed.intent,
                catalogMode: parsed.catalog_mode,
              }),
            );
          }

          if (parsed.delta) {
            full += parsed.delta;
            setMessages((previous) => patchMessage(previous, streamId, { content: full }));
          }
        }

        setMessages((previous) => patchMessage(previous, streamId, { isStreaming: false }));
        setHistory((previous) => [...previous, { role: "assistant", content: full }]);
      } catch {
        setMessages((previous) =>
          patchMessage(previous, streamId, {
            content: offlineMessage(locale),
            isStreaming: false,
            isError: true,
          }),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [history, input, isLoading, locale, profileId, setHistory, setInput, setIsLoading, setMessages],
  );
}

