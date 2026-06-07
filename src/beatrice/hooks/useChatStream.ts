import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Locale } from "../../i18n/translations";
import type { BeatriceSettings, ChatMessage, HistoryEntry, ProfileId } from "../types/beatrice";
import {
  commandModeForPrompt,
  createStreamingAssistantMessage,
  createUserMessage,
  offlineMessage,
  parseEventStream,
  submitChatRequest,
} from "../orchestrators/chat.orchestrator";
import { appendStreamingMetadata, patchMessage } from "../stores/workspace.store";
import { trackStudyEvent } from "../../services/studyTracking";

interface UseChatStreamParams {
  input: string;
  isLoading: boolean;
  history: HistoryEntry[];
  locale: Locale;
  profileId: ProfileId;
  settings: BeatriceSettings;
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
  settings,
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
      void trackStudyEvent("prompt_submitted", {
        prompt: text,
        profile: profileId,
        command_mode: detectedCommand ?? null,
        history_messages: nextHistory.length,
      });

      // rAF-batched streaming append: one setMessages per animation frame (~16ms
      // at 60fps). Tokens that arrive within the same frame are coalesced into a
      // single commit; the browser never skips a frame. This gives smooth 60fps
      // visual flow while still bounding React commit rate to ≤60/s (vs one per
      // token). Declared outside try so catch/finally can cancel a pending frame.
      let full = "";
      let rafId: number | null = null;
      const scheduleCommit = () => {
        if (rafId !== null) return;
        rafId = requestAnimationFrame(() => {
          rafId = null;
          setMessages((previous) => patchMessage(previous, streamId, { content: full }));
        });
      };
      const cancelScheduled = () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      };

      try {
        const response = await submitChatRequest(nextHistory, profileId, detectedCommand, settings);
        let responseIntent: string | undefined;
        let responseEngine: string | null | undefined;
        let sourceCount = 0;

        for await (const parsed of parseEventStream(response)) {
          if (parsed.error) {
            cancelScheduled();
            void trackStudyEvent("response_error", {
              error: parsed.error,
              profile: profileId,
            });
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

          if (
            parsed.sources !== undefined ||
            parsed.intent !== undefined ||
            parsed.cognitive_skills !== undefined ||
            parsed.engine !== undefined
          ) {
            if (parsed.intent !== undefined) responseIntent = parsed.intent;
            if (parsed.engine !== undefined) responseEngine = parsed.engine;
            if (parsed.sources !== undefined) sourceCount = parsed.sources.length;
            setMessages((previous) =>
              appendStreamingMetadata(previous, streamId, {
                sources: parsed.sources,
                intent: parsed.intent,
                catalogMode: parsed.catalog_mode,
                cognitiveSkills: parsed.cognitive_skills,
                engine: parsed.engine,
              }),
            );
          }

          if (parsed.delta) {
            full += parsed.delta;
            if (settings.streaming) scheduleCommit();
          }
        }

        cancelScheduled();
        setMessages((previous) => patchMessage(previous, streamId, { content: full, isStreaming: false }));
        setHistory((previous) => [...previous, { role: "assistant", content: full }]);
        void trackStudyEvent("response_completed", {
          response: full,
          profile: profileId,
          intent: responseIntent ?? null,
          engine: responseEngine ?? null,
          source_count: sourceCount,
        });
      } catch {
        cancelScheduled();
        void trackStudyEvent("response_error", {
          error: "oracle_unavailable",
          profile: profileId,
        });
        setMessages((previous) =>
          patchMessage(previous, streamId, {
            content: offlineMessage(locale),
            isStreaming: false,
            isError: true,
          }),
        );
      } finally {
        cancelScheduled();
        setIsLoading(false);
      }
    },
    [history, input, isLoading, locale, profileId, settings, setHistory, setInput, setIsLoading, setMessages],
  );
}
