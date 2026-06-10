import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Locale } from "../../i18n/translations";
import type { AbraxosSurfaceContext } from "../domain/assistant/types";
import type { BeatriceSettings, ChatMessage, HistoryEntry, ProfileId } from "../types/beatrice";
import {
  commandModeForPrompt,
  createStreamingAssistantMessage,
  createUserMessage,
  parseEventStream,
  resolveChatFailure,
  sanitizeAssistantContent,
  sanitizeUserPrompt,
  submitChatRequest,
} from "../orchestrators/chat.orchestrator";
import {
  appendStreamingMetadata,
  patchMessage,
  removeOfflineMessages,
} from "../stores/workspace.store";
import { trackStudyEvent } from "../../services/studyTracking";

interface UseChatStreamParams {
  input: string;
  isLoading: boolean;
  history: HistoryEntry[];
  locale: Locale;
  profileId: ProfileId;
  sessionId: string;
  projectId?: string;
  surfaceContext?: AbraxosSurfaceContext | null;
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
  sessionId,
  projectId = "default",
  surfaceContext = null,
  settings,
  setHistory,
  setInput,
  setIsLoading,
  setMessages,
}: UseChatStreamParams) {
  return useCallback(
    async (promptText?: string) => {
      const text = sanitizeUserPrompt(promptText ?? input);
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
          setMessages((previous) => patchMessage(previous, streamId, {
            content: sanitizeAssistantContent(full),
          }));
        });
      };
      const cancelScheduled = () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      };

      try {
        const response = await submitChatRequest(
          nextHistory,
          profileId,
          detectedCommand,
          settings,
          sessionId,
          projectId,
          surfaceContext,
        );
        if (response.ok) {
          setMessages((previous) => removeOfflineMessages(previous));
        }
        let responseIntent: string | undefined;
        let responseEngine: string | null | undefined;
        let sourceCount = 0;
        let auditWarningCodes: string[] = [];
        let navigationAction: ChatMessage["navigationAction"];
        let secondaryNavigationActions: ChatMessage["secondaryNavigationActions"];

        for await (const parsed of parseEventStream(response)) {
          if (parsed.error) {
            cancelScheduled();
            void trackStudyEvent("response_error", {
              error: parsed.error,
              profile: profileId,
            });
            setMessages((previous) => {
              const withMetadata = parsed.audit_metadata
                ? appendStreamingMetadata(previous, streamId, { auditMetadata: parsed.audit_metadata })
                : previous;
              return patchMessage(withMetadata, streamId, {
                content: `${parsed.error}`,
                errorKind: "backend",
                isStreaming: false,
                isError: true,
              });
            });
            setIsLoading(false);
            return;
          }

          if (
            parsed.sources !== undefined ||
            parsed.intent !== undefined ||
            parsed.cognitive_skills !== undefined ||
            parsed.engine !== undefined ||
            parsed.audit_metadata !== undefined ||
            parsed.navigation_action !== undefined ||
            parsed.secondary_navigation_actions !== undefined
          ) {
            if (parsed.intent !== undefined) responseIntent = parsed.intent;
            if (parsed.engine !== undefined) responseEngine = parsed.engine;
            if (parsed.sources !== undefined) sourceCount = parsed.sources.length;
            if (parsed.audit_metadata !== undefined) {
              auditWarningCodes = (parsed.audit_metadata.profile_contract_warnings ?? [])
                .map((warning) => warning.code);
            }
            if (parsed.navigation_action !== undefined) {
              navigationAction = parsed.navigation_action;
            }
            if (parsed.secondary_navigation_actions !== undefined) {
              secondaryNavigationActions = parsed.secondary_navigation_actions;
            }
            setMessages((previous) =>
              appendStreamingMetadata(previous, streamId, {
                sources: parsed.sources,
                intent: parsed.intent,
                catalogMode: parsed.catalog_mode,
                cognitiveSkills: parsed.cognitive_skills,
                engine: parsed.engine,
                auditMetadata: parsed.audit_metadata,
                navigationAction: parsed.navigation_action,
                secondaryNavigationActions: parsed.secondary_navigation_actions,
              }),
            );
          }

          if (parsed.delta) {
            full += parsed.delta;
            if (settings.streaming) scheduleCommit();
          }
        }

        cancelScheduled();
        const sanitizedFull = sanitizeAssistantContent(full);
        setMessages((previous) => patchMessage(previous, streamId, {
          content: sanitizedFull,
          isStreaming: false,
          navigationAction,
          secondaryNavigationActions,
        }));
        setHistory((previous) => [...previous, { role: "assistant", content: sanitizedFull }]);
        void trackStudyEvent("response_completed", {
          response: sanitizedFull,
          profile: profileId,
          intent: responseIntent ?? null,
          engine: responseEngine ?? null,
          source_count: sourceCount,
          perspective_contract_warnings: auditWarningCodes,
        });
      } catch {
        cancelScheduled();
        const fallback = await resolveChatFailure(locale);
        void trackStudyEvent("response_error", {
          error: fallback.errorKind === "offline"
            ? "oracle_unavailable"
            : "chat_request_failed",
          profile: profileId,
        });
        setMessages((previous) =>
          patchMessage(removeOfflineMessages(previous), streamId, {
            content: fallback.content,
            errorKind: fallback.errorKind,
            isStreaming: false,
            isError: true,
          }),
        );
      } finally {
        cancelScheduled();
        setIsLoading(false);
      }
    },
    [history, input, isLoading, locale, profileId, projectId, sessionId, surfaceContext, settings, setHistory, setInput, setIsLoading, setMessages],
  );
}
