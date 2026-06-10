import { createContext, useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Locale } from "../../i18n/translations";
import type { AuditEntry, AuditLabels, AuditTab, ChatMessage, DecisionRecordStatus } from "../types/beatrice";
import { useArtifactGeneration } from "../hooks/useArtifactGeneration";
import { auditService } from "../services/audit.service";
import { useDecisionGraph } from "../hooks/useDecisionGraph";
import { useWorkspaceMessages } from "./WorkspaceProvider";
import { updateDecisionRecord } from "../services/decision.service";

interface AuditContextValue {
  entries: AuditEntry[];
  labels: AuditLabels;
  tab: AuditTab;
  isOpen: boolean;
  expandedIds: Record<string, boolean>;
  graph: ReturnType<typeof useDecisionGraph>;
  auditMessages: ChatMessage[];
  selectedMessage: ChatMessage | null;
  updatingDecisionId: string | null;
  mutationError: string | null;
  close: () => void;
  exportJson: () => void;
  exportMarkdown: () => void;
  open: () => void;
  openMessage: (messageId: string) => void;
  openDecisions: () => void;
  setTab: (tab: AuditTab) => void;
  toggleExpanded: (id: string) => void;
  updateDecisionStatus: (decisionId: string, status: Exclude<DecisionRecordStatus, "draft">) => Promise<void>;
}

export const AuditContext = createContext<AuditContextValue | null>(null);

export function AuditProvider({ children, locale }: { children: ReactNode; locale: Locale }) {
  const { messages, setMessages } = useWorkspaceMessages();
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<AuditTab>("decisions");
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [updatingDecisionId, setUpdatingDecisionId] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const entries = useMemo(() => auditService.messagesToAuditEntries(messages), [messages]);
  const auditMessages = useMemo(
    () => messages.filter((message) => message.role === "assistant" && Boolean(message.auditMetadata)),
    [messages],
  );
  const selectedMessage = useMemo(
    () => (
      auditMessages.find((message) => message.id === selectedMessageId)
      ?? auditMessages[auditMessages.length - 1]
      ?? null
    ),
    [auditMessages, selectedMessageId],
  );
  const labels = useMemo(() => auditService.getAuditLabels(locale), [locale]);
  const graph = useDecisionGraph(entries);
  const artifacts = useArtifactGeneration(locale);
  const open = useCallback(() => {
    setSelectedMessageId(auditMessages[auditMessages.length - 1]?.id ?? null);
    setMutationError(null);
    setIsOpen(true);
  }, [auditMessages]);
  const openMessage = useCallback((messageId: string) => {
    setSelectedMessageId(messageId);
    setMutationError(null);
    setIsOpen(true);
  }, []);
  const updateDecisionStatus = useCallback(async (
    decisionId: string,
    status: Exclude<DecisionRecordStatus, "draft">,
  ) => {
    setMutationError(null);
    setUpdatingDecisionId(decisionId);
    try {
      const decision = await updateDecisionRecord(decisionId, status);
      setMessages((current) => current.map((message) => {
        if (message.decisionId !== decisionId) return message;
        return {
          ...message,
          decisionStatus: decision.status,
          auditMetadata: message.auditMetadata
            ? { ...message.auditMetadata, decision_status: decision.status }
            : message.auditMetadata,
        };
      }));
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "decision_update_failed");
    } finally {
      setUpdatingDecisionId(null);
    }
  }, [setMessages]);

  const value = useMemo<AuditContextValue>(() => ({
    entries,
    labels,
    tab,
    isOpen,
    expandedIds,
    graph,
    auditMessages,
    selectedMessage,
    updatingDecisionId,
    mutationError,
    close: () => setIsOpen(false),
    exportJson: () => artifacts.exportJson(entries),
    exportMarkdown: () => artifacts.exportMarkdown(entries),
    open,
    openMessage,
    openDecisions: () => {
      setTab("decisions");
      open();
    },
    setTab,
    toggleExpanded: (id) => {
      setExpandedIds((current) => ({ ...current, [id]: !current[id] }));
    },
    updateDecisionStatus,
  }), [
    artifacts,
    auditMessages,
    entries,
    expandedIds,
    graph,
    isOpen,
    labels,
    mutationError,
    open,
    openMessage,
    selectedMessage,
    tab,
    updateDecisionStatus,
    updatingDecisionId,
  ]);

  return <AuditContext.Provider value={value}>{children}</AuditContext.Provider>;
}
