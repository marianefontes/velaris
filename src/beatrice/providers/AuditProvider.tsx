import { createContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Locale } from "../../i18n/translations";
import type { AuditEntry, AuditLabels, AuditTab } from "../types/beatrice";
import { useArtifactGeneration } from "../hooks/useArtifactGeneration";
import { auditService } from "../services/audit.service";
import { useDecisionGraph } from "../hooks/useDecisionGraph";
import { useWorkspace } from "./WorkspaceProvider";

interface AuditContextValue {
  entries: AuditEntry[];
  labels: AuditLabels;
  tab: AuditTab;
  isOpen: boolean;
  expandedIds: Record<string, boolean>;
  graph: ReturnType<typeof useDecisionGraph>;
  close: () => void;
  exportJson: () => void;
  exportMarkdown: () => void;
  open: () => void;
  openDecisions: () => void;
  setTab: (tab: AuditTab) => void;
  toggleExpanded: (id: string) => void;
}

export const AuditContext = createContext<AuditContextValue | null>(null);

export function AuditProvider({ children, locale }: { children: ReactNode; locale: Locale }) {
  const { messages } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<AuditTab>("decisions");
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const entries = useMemo(() => auditService.messagesToAuditEntries(messages), [messages]);
  const labels = useMemo(() => auditService.getAuditLabels(locale), [locale]);
  const graph = useDecisionGraph(entries);
  const artifacts = useArtifactGeneration(locale);

  const value = useMemo<AuditContextValue>(() => ({
    entries,
    labels,
    tab,
    isOpen,
    expandedIds,
    graph,
    close: () => setIsOpen(false),
    exportJson: () => artifacts.exportJson(entries),
    exportMarkdown: () => artifacts.exportMarkdown(entries),
    open: () => setIsOpen(true),
    openDecisions: () => {
      setTab("decisions");
      setIsOpen(true);
    },
    setTab,
    toggleExpanded: (id) => {
      setExpandedIds((current) => ({ ...current, [id]: !current[id] }));
    },
  }), [artifacts, entries, expandedIds, graph, isOpen, labels, tab]);

  return <AuditContext.Provider value={value}>{children}</AuditContext.Provider>;
}
