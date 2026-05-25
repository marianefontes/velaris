import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "../../i18n/translations";
import type { ChatContent, ChatMessage, HealthData, HistoryEntry, ProfileId, WorkspaceState } from "../types/beatrice";
import { detectCommandMode } from "../domain/governance";
import { fetchHealthData } from "../services/retrieval.service";
import { getPromptStats } from "../services/orchestration.service";
import { useChatStream } from "./useChatStream";

interface UseWorkspaceStateParams {
  content: ChatContent;
  locale: Locale;
  profileId: ProfileId;
}

export function useWorkspaceState({ content, locale, profileId }: UseWorkspaceStateParams): WorkspaceState {
  const [messages, setMessages] = useState<ChatMessage[]>(content.initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const submitPrompt = useChatStream({
    input,
    isLoading,
    history,
    locale,
    profileId,
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
    setMessages(content.initialMessages);
    setInput("");
    setHistory([]);
  }, [content]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return {
    content,
    messages,
    input,
    isLoading,
    healthData,
    stats: useMemo(() => getPromptStats(messages.length), [messages.length]),
    activeCommand: useMemo(() => detectCommandMode(input), [input]),
    bottomRef,
    setInput,
    submitPrompt,
  };
}

