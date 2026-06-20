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
import type { AbraxosOnboardingVariant } from "../domain/assistant/onboardingContent";
import type { AbraxosOpenContext, AbraxosSurfaceContext } from "../domain/assistant/types";
import { buildRouteSurfaceContext } from "../domain/assistant/routeContext";
import {
  hasSeenAbraxosOnboarding,
  markAbraxosOnboardingSeen,
} from "../domain/assistant/onboardingStorage";
import { contextSignature, mergeSurfaceContext } from "../domain/assistant/types";
import { buildWelcomeMessage } from "../domain/assistant/welcomeMessage";
import { usePersonaContext } from "../hooks/usePersonaContext";
import { useChatStream } from "../hooks/useChatStream";
import { readBeatriceSettings } from "../storage/beatriceStorage";
import { useStudyParticipantSession } from "../../hooks/useStudyParticipantSession";
import type { ChatMessage, HistoryEntry } from "../types/beatrice";

function hasSpecificEntityContext(context: Partial<AbraxosSurfaceContext>): boolean {
  return Boolean(context.section || context.entity_name || context.entity_type);
}

function createWelcomeMessage(
  context: AbraxosSurfaceContext,
  locale: ReturnType<typeof useI18n>["locale"],
): ChatMessage {
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

function resolveFirstVisitVariant(isStudyParticipant: boolean): AbraxosOnboardingVariant {
  return isStudyParticipant ? "research" : "velaris";
}

export interface AbraxosAssistantContextValue {
  isOpen: boolean;
  isVisible: boolean;
  input: string;
  isLoading: boolean;
  messages: ChatMessage[];
  history: HistoryEntry[];
  surfaceContext: AbraxosSurfaceContext;
  onboardingVariant: AbraxosOnboardingVariant | null;
  setInput: Dispatch<SetStateAction<string>>;
  openAbraxos: (context?: AbraxosOpenContext) => void;
  closeAbraxos: () => void;
  toggleAbraxos: () => void;
  setAbraxosContext: (context: Partial<AbraxosSurfaceContext>) => void;
  showAbraxosGuide: () => void;
  dismissOnboarding: () => void;
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
  const participantStatus = useStudyParticipantSession();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [sessionId] = useState(createSessionId);
  const [explicitContext, setExplicitContext] = useState<Partial<AbraxosSurfaceContext>>({});
  const [onboardingVariant, setOnboardingVariant] = useState<AbraxosOnboardingVariant | null>(null);
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

  const hasUserTurns = history.some((entry) => entry.role === "user");
  const isStudyParticipant = participantStatus === "participant";

  const { submitPrompt } = useChatStream({
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

  const dismissOnboarding = useCallback(() => {
    setOnboardingVariant(null);
    markAbraxosOnboardingSeen();
  }, []);

  const maybeShowOnboarding = useCallback((
    contextOverride?: Partial<AbraxosSurfaceContext>,
    options?: { forceGuide?: boolean },
  ) => {
    if (options?.forceGuide) {
      setOnboardingVariant("guide");
      return;
    }
    if (hasUserTurns) {
      setOnboardingVariant(null);
      return;
    }
    if (hasSeenAbraxosOnboarding()) {
      setOnboardingVariant(null);
      return;
    }
    if (hasSpecificEntityContext(contextOverride ?? explicitContext)) {
      setOnboardingVariant(null);
      return;
    }
    setOnboardingVariant(resolveFirstVisitVariant(isStudyParticipant));
  }, [explicitContext, hasUserTurns, isStudyParticipant]);

  const ensureWelcomeMessage = useCallback((context: AbraxosSurfaceContext) => {
    if (onboardingVariant) return;
    const signature = contextSignature(context);
    if (welcomeSignatureRef.current === signature) return;
    if (!hasSpecificEntityContext(context)) return;
    welcomeSignatureRef.current = signature;
    const welcome = createWelcomeMessage(context, locale);
    setMessages((current) => {
      const withoutWelcome = current.filter((message) => !message.isWelcome);
      return [welcome, ...withoutWelcome];
    });
  }, [locale, onboardingVariant]);

  const openAbraxos = useCallback((context?: AbraxosOpenContext) => {
    if (context) {
      setExplicitContext((current) => {
        const next = { ...current, ...context };
        maybeShowOnboarding(next);
        ensureWelcomeMessage(mergeSurfaceContext(routeContext, next));
        return next;
      });
    } else {
      maybeShowOnboarding();
      ensureWelcomeMessage(surfaceContext);
    }
    setIsOpen(true);
  }, [ensureWelcomeMessage, maybeShowOnboarding, routeContext, surfaceContext]);

  const closeAbraxos = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleAbraxos = useCallback(() => {
    setIsOpen((current) => {
      if (!current) {
        maybeShowOnboarding();
        ensureWelcomeMessage(surfaceContext);
      }
      return !current;
    });
  }, [ensureWelcomeMessage, maybeShowOnboarding, surfaceContext]);

  const showAbraxosGuide = useCallback(() => {
    setIsOpen(true);
    setOnboardingVariant("guide");
  }, []);

  const setAbraxosContext = useCallback((context: Partial<AbraxosSurfaceContext>) => {
    setExplicitContext((current) => ({ ...current, ...context }));
  }, []);

  const retryLastPrompt = useCallback(async () => {
    const lastUser = [...history].reverse().find((entry) => entry.role === "user");
    if (!lastUser) return;
    await submitPrompt(lastUser.content);
  }, [history, submitPrompt]);

  useEffect(() => {
    if (!isOpen || onboardingVariant) return;
    ensureWelcomeMessage(surfaceContext);
  }, [ensureWelcomeMessage, isOpen, onboardingVariant, surfaceContext]);

  useEffect(() => {
    if (!hasUserTurns) return;
    setOnboardingVariant(null);
    markAbraxosOnboardingSeen();
  }, [hasUserTurns]);

  const isVisible = !isAssistantHiddenRoute(location.pathname);

  const value = useMemo<AbraxosAssistantContextValue>(() => ({
    isOpen,
    isVisible,
    input,
    isLoading,
    messages,
    history,
    surfaceContext,
    onboardingVariant,
    setInput,
    openAbraxos,
    closeAbraxos,
    toggleAbraxos,
    setAbraxosContext,
    showAbraxosGuide,
    dismissOnboarding,
    submitPrompt,
    retryLastPrompt,
  }), [
    closeAbraxos,
    dismissOnboarding,
    input,
    isLoading,
    isOpen,
    isVisible,
    messages,
    history,
    onboardingVariant,
    openAbraxos,
    setAbraxosContext,
    showAbraxosGuide,
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
