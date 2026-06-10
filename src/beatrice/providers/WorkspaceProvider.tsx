import { createContext, useContext, useMemo } from "react";
import type { Context, ReactNode } from "react";
import type { Locale } from "../../i18n/translations";
import type { ChatContent, WorkspaceState } from "../types/beatrice";
import { usePersonaContext } from "../hooks/usePersonaContext";
import { useWorkspaceState } from "../hooks/useWorkspaceState";

export const WorkspaceContext = createContext<WorkspaceState | null>(null);
type WorkspaceMessagesValue = Pick<WorkspaceState, "bottomRef" | "messages" | "setMessages">;
type WorkspaceComposerValue = Pick<
  WorkspaceState,
  "activeCommand" | "input" | "isLoading" | "setInput" | "submitPrompt"
>;
type WorkspacePreferencesValue = Pick<
  WorkspaceState,
  "content" | "healthData" | "resetSettings" | "settings" | "stats" | "updateSettings"
>;
type WorkspaceHistoryValue = Pick<
  WorkspaceState,
  | "activeConversation"
  | "activeConversationId"
  | "clearConversations"
  | "conversations"
  | "createConversation"
  | "deleteConversation"
  | "exportConversations"
  | "openConversation"
  | "renameConversation"
  | "startNewConversation"
>;

const WorkspaceMessagesContext = createContext<WorkspaceMessagesValue | null>(null);
const WorkspaceComposerContext = createContext<WorkspaceComposerValue | null>(null);
const WorkspacePreferencesContext = createContext<WorkspacePreferencesValue | null>(null);
const WorkspaceHistoryContext = createContext<WorkspaceHistoryValue | null>(null);

export function WorkspaceProvider({
  children,
  content,
  locale,
}: {
  children: ReactNode;
  content: ChatContent;
  locale: Locale;
}) {
  const { profileId } = usePersonaContext();
  const workspace = useWorkspaceState({ content, locale, profileId });
  const messagesValue = useMemo<WorkspaceMessagesValue>(() => ({
    bottomRef: workspace.bottomRef,
    messages: workspace.messages,
    setMessages: workspace.setMessages,
  }), [workspace.bottomRef, workspace.messages, workspace.setMessages]);
  const composerValue = useMemo<WorkspaceComposerValue>(() => ({
    activeCommand: workspace.activeCommand,
    input: workspace.input,
    isLoading: workspace.isLoading,
    setInput: workspace.setInput,
    submitPrompt: workspace.submitPrompt,
  }), [
    workspace.activeCommand,
    workspace.input,
    workspace.isLoading,
    workspace.setInput,
    workspace.submitPrompt,
  ]);
  const preferencesValue = useMemo<WorkspacePreferencesValue>(() => ({
    content: workspace.content,
    healthData: workspace.healthData,
    resetSettings: workspace.resetSettings,
    settings: workspace.settings,
    stats: workspace.stats,
    updateSettings: workspace.updateSettings,
  }), [
    workspace.content,
    workspace.healthData,
    workspace.resetSettings,
    workspace.settings,
    workspace.stats,
    workspace.updateSettings,
  ]);
  const historyValue = useMemo<WorkspaceHistoryValue>(() => ({
    activeConversation: workspace.activeConversation,
    activeConversationId: workspace.activeConversationId,
    clearConversations: workspace.clearConversations,
    conversations: workspace.conversations,
    createConversation: workspace.createConversation,
    deleteConversation: workspace.deleteConversation,
    exportConversations: workspace.exportConversations,
    openConversation: workspace.openConversation,
    renameConversation: workspace.renameConversation,
    startNewConversation: workspace.startNewConversation,
  }), [
    workspace.activeConversation,
    workspace.activeConversationId,
    workspace.clearConversations,
    workspace.conversations,
    workspace.createConversation,
    workspace.deleteConversation,
    workspace.exportConversations,
    workspace.openConversation,
    workspace.renameConversation,
    workspace.startNewConversation,
  ]);

  return (
    <WorkspaceContext.Provider value={workspace}>
      <WorkspaceMessagesContext.Provider value={messagesValue}>
        <WorkspaceComposerContext.Provider value={composerValue}>
          <WorkspacePreferencesContext.Provider value={preferencesValue}>
            <WorkspaceHistoryContext.Provider value={historyValue}>
              {children}
            </WorkspaceHistoryContext.Provider>
          </WorkspacePreferencesContext.Provider>
        </WorkspaceComposerContext.Provider>
      </WorkspaceMessagesContext.Provider>
    </WorkspaceContext.Provider>
  );
}

function useRequiredWorkspaceContext<Value>(context: Context<Value | null>, name: string) {
  const value = useContext(context);
  if (!value) {
    throw new Error(`${name} must be used within WorkspaceProvider`);
  }
  return value;
}

export function useWorkspace() {
  const context = useRequiredWorkspaceContext(WorkspaceContext, "useWorkspace");
  return context;
}

export function useWorkspaceMessages() {
  return useRequiredWorkspaceContext(WorkspaceMessagesContext, "useWorkspaceMessages");
}

export function useWorkspaceComposer() {
  return useRequiredWorkspaceContext(WorkspaceComposerContext, "useWorkspaceComposer");
}

export function useWorkspacePreferences() {
  return useRequiredWorkspaceContext(WorkspacePreferencesContext, "useWorkspacePreferences");
}

export function useWorkspaceHistory() {
  return useRequiredWorkspaceContext(WorkspaceHistoryContext, "useWorkspaceHistory");
}
