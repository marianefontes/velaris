import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Locale } from "../../i18n/translations";
import type {
  BeatriceConversation,
  BeatriceHistorySnapshot,
  BeatriceSettings,
  ChatMessage,
  HistoryEntry,
  ProfileId,
} from "../types/beatrice";
import {
  downloadJsonFile,
  readBeatriceHistory,
  writeBeatriceHistory,
} from "../storage/beatriceStorage";
import { removeOfflineMessages } from "../stores/workspace.store";

interface UseBeatriceHistoryParams {
  initialMessages: ChatMessage[];
  locale: Locale;
  profileId: ProfileId;
  settings: BeatriceSettings;
}

function createConversationId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `conversation-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function cloneMessages(messages: ChatMessage[]) {
  return messages.map((message) => ({ ...message }));
}

function truncateText(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 3).trim()}...` : normalized;
}

const TITLE_STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "como",
  "de",
  "do",
  "does",
  "e",
  "em",
  "for",
  "how",
  "i",
  "me",
  "o",
  "os",
  "para",
  "por",
  "qual",
  "quais",
  "que",
  "should",
  "the",
  "to",
  "usar",
  "use",
  "what",
  "when",
  "which",
]);

const TITLE_DOMAINS: Array<{ label: string; priority: number; terms: string[] }> = [
  { label: "Dashboard", priority: 10, terms: ["dashboard", "painel"] },
  { label: "Components", priority: 20, terms: ["component", "components", "componente", "componentes"] },
  { label: "Patterns", priority: 30, terms: ["pattern", "patterns", "padrao", "padroes"] },
  { label: "Tokens", priority: 40, terms: ["token", "tokens"] },
  { label: "Accessibility", priority: 50, terms: ["accessibility", "acessibilidade", "wcag"] },
  { label: "XAI", priority: 60, terms: ["xai", "explainability", "explicabilidade", "confidence", "confianca"] },
  { label: "Governance", priority: 70, terms: ["governance", "governanca", "decisao", "decision"] },
  { label: "Layout", priority: 80, terms: ["layout", "grid", "interface"] },
];

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function generateConversationTitle(prompt: string) {
  const normalized = prompt
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^\/[a-z]+\s+/i, "")
    .toLowerCase();

  const words: string[] = normalized.match(/[a-z0-9]+/g) ?? [];
  const matchedDomains = TITLE_DOMAINS
    .filter((domain) => domain.terms.some((term) => words.includes(term)))
    .sort((a, b) => a.priority - b.priority)
    .map((domain) => domain.label);

  const fallbackWords = words
    .filter((word) => word.length > 2 && !TITLE_STOPWORDS.has(word))
    .filter((word) => !TITLE_DOMAINS.some((domain) => domain.terms.includes(word)))
    .slice(0, Math.max(0, 3 - matchedDomains.length))
    .map(titleCase);

  const labels = [...new Set([...matchedDomains, ...fallbackWords])];

  if (labels.length === 0) {
    return "Abraxos Conversation";
  }

  const needsGuidance = words.some((word) => ["use", "usar", "should", "devo", "recommend", "recomendar"].includes(word));
  const title = needsGuidance && !labels.includes("Guidance") ? [...labels, "Guidance"].join(" ") : labels.join(" ");

  return truncateText(title, 48);
}

function firstUserMessage(history: HistoryEntry[]) {
  return history.find((entry) => entry.role === "user")?.content ?? "";
}

function applyConversationMetadata(conversation: BeatriceConversation): BeatriceConversation {
  const firstPrompt = firstUserMessage(conversation.history);
  const title = conversation.isTitleCustom || !firstPrompt
    ? conversation.title
    : generateConversationTitle(firstPrompt);

  return {
    ...conversation,
    title,
    preview: firstPrompt ? truncateText(firstPrompt, 110) : "",
    messageCount: conversation.history.length,
  };
}

function makeConversation({
  initialMessages,
  locale,
  profileId,
  settings,
}: UseBeatriceHistoryParams): BeatriceConversation {
  const now = new Date().toISOString();

  return {
    id: createConversationId(),
    title: locale === "en-US" ? "New conversation" : "Nova conversa",
    preview: "",
    createdAt: now,
    updatedAt: now,
    messageCount: 0,
    messages: cloneMessages(initialMessages),
    history: [],
    settings,
    profileId,
    locale,
  };
}

function sortConversations(conversations: BeatriceConversation[]) {
  return [...conversations].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
}

function snapshotWithActiveConversation(
  snapshot: BeatriceHistorySnapshot,
  params: UseBeatriceHistoryParams,
) {
  if (snapshot.conversations.length === 0) {
    const conversation = makeConversation(params);
    return {
      version: 1,
      activeConversationId: conversation.id,
      conversations: [conversation],
    } satisfies BeatriceHistorySnapshot;
  }

  const activeExists = snapshot.conversations.some((conversation) => conversation.id === snapshot.activeConversationId);
  return activeExists ? snapshot : { ...snapshot, activeConversationId: snapshot.conversations[0].id };
}

export function useBeatriceHistory(params: UseBeatriceHistoryParams) {
  const { initialMessages, locale, profileId, settings } = params;
  const conversationParams = useMemo(
    () => ({ initialMessages, locale, profileId, settings }),
    [initialMessages, locale, profileId, settings],
  );
  const contextKey = `${locale}:${profileId}`;
  const previousContextKey = useRef(contextKey);

  const [snapshot, setSnapshot] = useState<BeatriceHistorySnapshot>(() =>
    snapshotWithActiveConversation(readBeatriceHistory(), conversationParams),
  );

  useEffect(() => {
    writeBeatriceHistory(snapshot);
  }, [snapshot]);

  const activeConversation = useMemo(
    () => snapshot.conversations.find((conversation) => conversation.id === snapshot.activeConversationId) ?? null,
    [snapshot.activeConversationId, snapshot.conversations],
  );

  const updateActiveConversation = useCallback(
    (updater: (conversation: BeatriceConversation) => BeatriceConversation) => {
      setSnapshot((current) => {
        const ensured = snapshotWithActiveConversation(current, conversationParams);
        const nextConversations = ensured.conversations.map((conversation) => {
          if (conversation.id !== ensured.activeConversationId) return conversation;
          return applyConversationMetadata(updater(conversation));
        });

        return {
          ...ensured,
          conversations: sortConversations(nextConversations),
        };
      });
    },
    [conversationParams],
  );

  const setMessages = useCallback<Dispatch<SetStateAction<ChatMessage[]>>>(
    (action) => {
      updateActiveConversation((conversation) => {
        const nextMessages = typeof action === "function" ? action(conversation.messages) : action;
        return {
          ...conversation,
          messages: cloneMessages(nextMessages),
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [updateActiveConversation],
  );

  const setHistory = useCallback<Dispatch<SetStateAction<HistoryEntry[]>>>(
    (action) => {
      updateActiveConversation((conversation) => {
        const nextHistory = typeof action === "function" ? action(conversation.history) : action;
        return {
          ...conversation,
          history: nextHistory.map((entry) => ({ ...entry })),
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [updateActiveConversation],
  );

  const createConversation = useCallback(() => {
    setSnapshot((current) => {
      const conversation = makeConversation(conversationParams);
      const preserved = current.conversations.filter((item) => item.history.length > 0);

      return {
        version: 1,
        activeConversationId: conversation.id,
        conversations: sortConversations([conversation, ...preserved]),
      };
    });
  }, [conversationParams]);

  const importHandoffConversation = useCallback((
    messages: ChatMessage[],
    history: HistoryEntry[],
  ) => {
    setSnapshot((current) => {
      const conversation = applyConversationMetadata({
        ...makeConversation(conversationParams),
        messages: cloneMessages(messages),
        history: history.map((entry) => ({ ...entry })),
      });
      const preserved = current.conversations.filter((item) => item.history.length > 0);

      return {
        version: 1,
        activeConversationId: conversation.id,
        conversations: sortConversations([conversation, ...preserved]),
      };
    });
  }, [conversationParams]);

  const openConversation = useCallback((conversationId: string) => {
    setSnapshot((current) => {
      if (!current.conversations.some((conversation) => conversation.id === conversationId)) return current;
      return { ...current, activeConversationId: conversationId };
    });
  }, []);

  const deleteConversation = useCallback(
    (conversationId: string) => {
      setSnapshot((current) => {
        const remaining = current.conversations.filter((conversation) => conversation.id !== conversationId);
        if (remaining.length === 0) {
          const conversation = makeConversation(conversationParams);
          return {
            version: 1,
            activeConversationId: conversation.id,
            conversations: [conversation],
          };
        }

        const nextActiveId = current.activeConversationId === conversationId
          ? sortConversations(remaining)[0].id
          : current.activeConversationId;

        return {
          version: 1,
          activeConversationId: nextActiveId,
          conversations: sortConversations(remaining),
        };
      });
    },
    [conversationParams],
  );

  const renameConversation = useCallback((conversationId: string, title: string) => {
    const nextTitle = truncateText(title, 48);
    if (!nextTitle) return;

    setSnapshot((current) => ({
      ...current,
      conversations: current.conversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              title: nextTitle,
              isTitleCustom: true,
              updatedAt: new Date().toISOString(),
            }
          : conversation,
      ),
    }));
  }, []);

  const clearConversations = useCallback(() => {
    const conversation = makeConversation(conversationParams);
    setSnapshot({
      version: 1,
      activeConversationId: conversation.id,
      conversations: [conversation],
    });
  }, [conversationParams]);

  const clearOfflineMessages = useCallback(() => {
    setSnapshot((current) => {
      let changed = false;
      const conversations = current.conversations.map((conversation) => {
        const messages = removeOfflineMessages(conversation.messages);
        if (messages.length === conversation.messages.length) {
          return conversation;
        }
        changed = true;
        return { ...conversation, messages };
      });
      return changed ? { ...current, conversations } : current;
    });
  }, []);

  const exportConversations = useCallback(() => {
    const exportedAt = new Date().toISOString();
    downloadJsonFile(`aetheris-beatrice-history-${exportedAt.slice(0, 10)}.json`, {
      ...snapshot,
      exportedAt,
    });
  }, [snapshot]);

  useEffect(() => {
    updateActiveConversation((conversation) => ({
      ...conversation,
      settings,
    }));
  }, [settings, updateActiveConversation]);

  useEffect(() => {
    if (previousContextKey.current === contextKey) return;
    previousContextKey.current = contextKey;
    createConversation();
  }, [contextKey, createConversation]);

  return {
    activeConversation,
    activeConversationId: snapshot.activeConversationId,
    clearConversations,
    clearOfflineMessages,
    conversations: snapshot.conversations,
    createConversation,
    importHandoffConversation,
    deleteConversation,
    exportConversations,
    history: activeConversation?.history ?? [],
    messages: activeConversation?.messages ?? initialMessages,
    openConversation,
    renameConversation,
    setHistory,
    setMessages,
  };
}
