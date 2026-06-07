import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "../../i18n/translations";
import type { ChatContent, HealthData, ProfileId, WorkspaceState } from "../types/beatrice";
import { detectCommandMode } from "../domain/governance";
import { fetchHealthData } from "../services/retrieval.service";
import { getPromptStats } from "../services/orchestration.service";
import { useBeatriceHistory } from "./useBeatriceHistory";
import { useBeatriceSettings } from "./useBeatriceSettings";
import { useChatStream } from "./useChatStream";

interface UseWorkspaceStateParams {
  content: ChatContent;
  locale: Locale;
  profileId: ProfileId;
}

export function useWorkspaceState({ content, locale, profileId }: UseWorkspaceStateParams): WorkspaceState {
  const [input, setInput] = useState("");
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
    conversations,
    createConversation,
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
    settings,
    setHistory,
    setInput,
    setIsLoading,
    setMessages,
  });

  useEffect(() => {
    fetchHealthData()
      .then((data) => {
        if (data) setHealthData(data);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    setInput("");
  }, [activeConversationId]);

  useEffect(() => {
    if (!settings.autoScroll) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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
    submitPrompt,
    updateSettings,
  };
}
