import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useLocation } from "react-router-dom";
import { useI18n } from "../../i18n/I18nProvider";
import type { AbraxosOpenContext, AbraxosSurfaceContext } from "../domain/assistant/types";
import { buildRouteSurfaceContext } from "../domain/assistant/routeContext";
import { contextSignature, mergeSurfaceContext } from "../domain/assistant/types";
import { buildWelcomeMessage } from "../domain/assistant/welcomeMessage";
import { usePersonaContext } from "../hooks/usePersonaContext";
import { useChatStream } from "../hooks/useChatStream";
import { readBeatriceSettings } from "../storage/beatriceStorage";
import type { ChatMessage, HistoryEntry } from "../types/beatrice";

function createWelcomeMessage(context: AbraxosSurfaceContext, locale: ReturnType<typeof useI18n>["locale"]): ChatMessage {
  return {
    id: `assistant-welcome-${Date.now()}`,
    role: "assistant",
    content: buildWelcomeMessage(context, locale),
    isWelcome: true,
  };
}

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `floating-${crypto.randomUUID()}`;
  }
  return `floating-${Date.now()}`;
}

export interface AbraxosAssistantContextValue {
  isOpen: boolean;
  isVisible: boolean;
  input: string;
  isLoading: boolean;
  messages: ChatMessage[];
  history: HistoryEntry[];
  surfaceContext: AbraxosSurfaceContext;
  setInput: Dispatch<SetStateAction<string>>;
  openAbraxos: (context?: AbraxosOpenContext) => void;
  closeAbraxos: () => void;
  toggleAbraxos: () => void;
  setAbraxosContext: (context: Partial<AbraxosSurfaceContext>) => void;
  submitPrompt: (promptText?: string) => Promise<void>;
  retryLastPrompt: () => Promise<void>;
}

export const AbraxosAssistantContext = createContext<AbraxosAssistantContextValue | null>(null);

function isAssistantHiddenRoute(pathname: string) {
  return pathname === "/oracle"
    || pathname.startsWith("/study/")
    || pathname === "/research";
}

export function AbraxosAssistantProvider({ children }: { children: ReactNode }) {
  const { locale, t } = useI18n();
  const location = useLocation();
  const { profileId, strategy } = usePersonaContext();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [sessionId] = useState(createSessionId);
  const [explicitContext, setExplicitContext] = useState<Partial<AbraxosSurfaceContext>>({});
  const welcomeSignatureRef = useRef("");
  const settings = useMemo(() => readBeatriceSettings(), []);

  const routeContext = useMemo(
    () => buildRouteSurfaceContext(
      location.pathname,
      location.search,
      locale,
      strategy.label,
      t,
    ),
    [location.pathname, location.search, locale, strategy.label, t],
  );

  const surfaceContext = useMemo(
    () => mergeSurfaceContext(routeContext, explicitContext),
    [explicitContext, routeContext],
  );

  const submitPrompt = useChatStream({
    input,
    isLoading,
    history,
    locale,
    profileId,
    sessionId,
    projectId: "floating-assistant",
    surfaceContext,
    settings,
    setHistory,
    setInput,
    setIsLoading,
    setMessages,
  });

  const ensureWelcomeMessage = useCallback((context: AbraxosSurfaceContext) => {
    const signature = contextSignature(context);
    if (welcomeSignatureRef.current === signature) return;
    welcomeSignatureRef.current = signature;
    const welcome = createWelcomeMessage(context, locale);
    setMessages((current) => {
      const withoutWelcome = current.filter((message) => !message.isWelcome);
      return [welcome, ...withoutWelcome];
    });
  }, [locale]);

  const openAbraxos = useCallback((context?: AbraxosOpenContext) => {
    if (context) {
      setExplicitContext((current) => {
        const next = { ...current, ...context };
        ensureWelcomeMessage(mergeSurfaceContext(routeContext, next));
        return next;
      });
    } else {
      ensureWelcomeMessage(surfaceContext);
    }
    setIsOpen(true);
  }, [ensureWelcomeMessage, routeContext, surfaceContext]);

  const closeAbraxos = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleAbraxos = useCallback(() => {
    setIsOpen((current) => {
      if (!current) {
        ensureWelcomeMessage(surfaceContext);
      }
      return !current;
    });
  }, [ensureWelcomeMessage, surfaceContext]);

  const setAbraxosContext = useCallback((context: Partial<AbraxosSurfaceContext>) => {
    setExplicitContext((current) => ({ ...current, ...context }));
  }, []);

  const retryLastPrompt = useCallback(async () => {
    const lastUser = [...history].reverse().find((entry) => entry.role === "user");
    if (!lastUser) return;
    await submitPrompt(lastUser.content);
  }, [history, submitPrompt]);

  useEffect(() => {
    if (!isOpen) return;
    ensureWelcomeMessage(surfaceContext);
  }, [ensureWelcomeMessage, isOpen, surfaceContext]);

  const isVisible = !isAssistantHiddenRoute(location.pathname);

  const value = useMemo<AbraxosAssistantContextValue>(() => ({
    isOpen,
    isVisible,
    input,
    isLoading,
    messages,
    history,
    surfaceContext,
    setInput,
    openAbraxos,
    closeAbraxos,
    toggleAbraxos,
    setAbraxosContext,
    submitPrompt,
    retryLastPrompt,
  }), [
    closeAbraxos,
    input,
    isLoading,
    isOpen,
    isVisible,
    messages,
    history,
    openAbraxos,
    setAbraxosContext,
    submitPrompt,
    retryLastPrompt,
    surfaceContext,
    toggleAbraxos,
  ]);

  return (
    <AbraxosAssistantContext.Provider value={value}>
      {children}
    </AbraxosAssistantContext.Provider>
  );
}
