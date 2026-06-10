import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "../../i18n/translations";
import type { ChatContent, HealthData, ProfileId, WorkspaceState } from "../types/beatrice";
import { detectCommandMode } from "../domain/governance";
import { fetchHealthData } from "../services/retrieval.service";
import { getPromptStats } from "../services/orchestration.service";
import { consumeFloatingHandoff } from "../storage/floatingHandoff";
import { consumeAskPrefill } from "../storage/beatriceStorage";
import { useBeatriceHistory } from "./useBeatriceHistory";
import { useBeatriceSettings } from "./useBeatriceSettings";
import { useChatStream } from "./useChatStream";

interface UseWorkspaceStateParams {
  content: ChatContent;
  locale: Locale;
  profileId: ProfileId;
}

function readInitialComposerDraft() {
  const handoff = consumeFloatingHandoff();
  const askPrefill = consumeAskPrefill();
  return {
    input: handoff?.input || askPrefill,
    handoff,
  };
}

export function useWorkspaceState({ content, locale, profileId }: UseWorkspaceStateParams): WorkspaceState {
  const initialComposer = useMemo(() => readInitialComposerDraft(), []);
  const [input, setInput] = useState(initialComposer.input);
  const [isLoading, setIsLoading] = useState(false);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { resetSettings, settings, updateSettings } = useBeatriceSettings();
  const beatriceHistory = useBeatriceHistory({
    initialMessages: content.initialMessages,
    locale,
    profileId,
    settings,
  });

  const {
    activeConversation,
    activeConversationId,
    clearConversations,
    clearOfflineMessages,
    conversations,
    createConversation,
    importHandoffConversation,
    deleteConversation,
    exportConversations,
    history,
    messages,
    openConversation,
    renameConversation,
    setHistory,
    setMessages,
  } = beatriceHistory;

  const submitPrompt = useChatStream({
    input,
    isLoading,
    history,
    locale,
    profileId,
    sessionId: activeConversationId,
    projectId: "default",
    settings,
    setHistory,
    setInput,
    setIsLoading,
    setMessages,
  });
  const startNewConversation = useCallback(() => {
    if (isLoading) return;
    setInput("");
    createConversation();
  }, [createConversation, isLoading]);

  const handoffAppliedRef = useRef(false);
  useEffect(() => {
    if (handoffAppliedRef.current) return;
    const handoff = initialComposer.handoff;
    if (!handoff) return;
    handoffAppliedRef.current = true;
    if (handoff.messages.length > 0 || handoff.history.length > 0) {
      importHandoffConversation(handoff.messages, handoff.history);
    }
  }, [importHandoffConversation, initialComposer.handoff]);

  useEffect(() => {
    fetchHealthData()
      .then((data) => {
        if (!data) return;
        setHealthData(data);
        clearOfflineMessages();
      })
      .catch(() => undefined);
  }, [clearOfflineMessages]);

  // Clear the composer when *switching* conversations — not on the initial
  // mount, which would discard a prefilled question from the home hero.
  const previousConversationRef = useRef(activeConversationId);
  useEffect(() => {
    if (previousConversationRef.current === activeConversationId) return;
    previousConversationRef.current = activeConversationId;
    setInput("");
  }, [activeConversationId]);

  useEffect(() => {
    if (!settings.autoScroll) return;
    const scrollContainer = bottomRef.current?.closest<HTMLElement>(".beatrice-scrollbar");
    if (!scrollContainer) return;
    scrollContainer.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, settings.autoScroll]);

  return {
    content,
    messages,
    conversations,
    activeConversationId,
    activeConversation,
    settings,
    input,
    isLoading,
    healthData,
    stats: useMemo(() => getPromptStats(messages.length), [messages.length]),
    activeCommand: useMemo(() => detectCommandMode(input), [input]),
    bottomRef,
    clearConversations,
    createConversation,
    deleteConversation,
    exportConversations,
    openConversation,
    renameConversation,
    resetSettings,
    setInput,
    setMessages,
    startNewConversation,
    submitPrompt,
    updateSettings,
  };
}
