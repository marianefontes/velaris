import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { ChatMessage } from "../types/beatrice";
import type { Locale } from "../../i18n/translations";
import type { ChatContent, HealthData, ProfileId, WorkspaceState } from "../types/beatrice";
import { detectCommandMode } from "../domain/governance";
import { ORACLE_QUERY_PARAM } from "../navigation/oracleNavigation";
import { fetchHealthData } from "../services/retrieval.service";
import { getPromptStats } from "../services/orchestration.service";
import { consumeFloatingHandoff } from "../storage/floatingHandoff";
import { consumeAskPrefill, lockAskPrefillDispatch } from "../storage/beatriceStorage";
import { useBeatriceHistory } from "./useBeatriceHistory";
import { useBeatriceSettings } from "./useBeatriceSettings";
import { useChatStream } from "./useChatStream";

interface UseWorkspaceStateParams {
  content: ChatContent;
  locale: Locale;
  profileId: ProfileId;
}

function readInitialComposerDraft(queryPrefill = "") {
  const handoff = consumeFloatingHandoff();
  const sessionPrefill = consumeAskPrefill();
  const askPrefill = sessionPrefill || queryPrefill;
  return {
    input: handoff?.input || askPrefill,
    handoff,
    askPrefill,
  };
}

function hasVisibleUserTurn(messages: ChatMessage[]) {
  return messages.some(
    (message) => message.role === "user" && !message.id.startsWith("assistant-persona-"),
  );
}

export function useWorkspaceState({ content, locale, profileId }: UseWorkspaceStateParams): WorkspaceState {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialComposer = useMemo(() => {
    const queryPrefill = typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get(ORACLE_QUERY_PARAM)?.trim() ?? ""
      : "";
    return readInitialComposerDraft(queryPrefill);
  }, []);
  const [input, setInput] = useState(initialComposer.input);
  const [deferredAskSubmit, setDeferredAskSubmit] = useState<string | null>(null);
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

  const { submitPrompt, retryPrompt } = useChatStream({
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

  const askPrefillHandledRef = useRef(false);
  useEffect(() => {
    const askPrefill = initialComposer.askPrefill.trim();
    if (askPrefillHandledRef.current || !askPrefill) return;
    askPrefillHandledRef.current = true;
    lockAskPrefillDispatch();

    const hasPriorTurns = history.some((entry) => entry.role === "user") || hasVisibleUserTurn(messages);
    if (hasPriorTurns) {
      setDeferredAskSubmit(askPrefill);
      createConversation();
      return;
    }

    void submitPrompt(askPrefill);
  }, [createConversation, history, initialComposer.askPrefill, messages, submitPrompt]);

  useEffect(() => {
    if (!deferredAskSubmit) return;
    const text = deferredAskSubmit;
    setDeferredAskSubmit(null);
    void submitPrompt(text);
  }, [activeConversationId, deferredAskSubmit, submitPrompt]);

  useEffect(() => {
    if (!searchParams.has(ORACLE_QUERY_PARAM)) return;
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete(ORACLE_QUERY_PARAM);
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

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
    const streamingActive = isLoading || messages.some((message) => message.isStreaming);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollContainer.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: streamingActive || reduceMotion ? "auto" : "smooth",
    });
  }, [isLoading, messages, settings.autoScroll]);

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
    retryPrompt,
    updateSettings,
  };
}
