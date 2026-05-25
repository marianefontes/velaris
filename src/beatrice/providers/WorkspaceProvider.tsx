import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { Locale } from "../../i18n/translations";
import type { ChatContent, WorkspaceState } from "../types/beatrice";
import { usePersonaContext } from "../hooks/usePersonaContext";
import { useWorkspaceState } from "../hooks/useWorkspaceState";

export const WorkspaceContext = createContext<WorkspaceState | null>(null);

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

  return <WorkspaceContext.Provider value={workspace}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }
  return context;
}
