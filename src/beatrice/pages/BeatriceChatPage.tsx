import { useMemo, useState } from "react";
import { AuditTrail } from "../components/audit/AuditTrail";
import { ChatArtifacts } from "../components/chat/ChatArtifacts";
import { ChatEmptyState } from "../components/chat/ChatEmptyState";
import { ChatInput } from "../components/chat/ChatInput";
import { ChatLayout } from "../components/chat/ChatLayout";
import { ChatStream } from "../components/chat/ChatStream";
import { ChatSuggestions } from "../components/chat/ChatSuggestions";
import { ChatToolbar } from "../components/chat/ChatToolbar";
import { HistoryPanel } from "../components/chat/HistoryPanel";
import { SettingsPanel } from "../components/chat/SettingsPanel";
import { PersonaContextBanner } from "../components/persona/PersonaContextBanner";
import { useI18n } from "../../i18n/I18nProvider";
import { usePersonaContext } from "../hooks/usePersonaContext";
import { AuditProvider } from "../providers/AuditProvider";
import { WorkspaceProvider } from "../providers/WorkspaceProvider";
import { getChatContent, getPersonaChatContent } from "../services/orchestration.service";
import type { Locale } from "../../i18n/translations";

export function BeatriceChatPage() {
  const { locale } = useI18n();

  return <PersonaAwareChatWorkspace locale={locale} />;
}

function PersonaAwareChatWorkspace({ locale }: { locale: Locale }) {
  const { activePersonaContext: strategy } = usePersonaContext();
  const content = useMemo(() => getChatContent(locale), [locale]);
  const personaContent = useMemo(() => getPersonaChatContent(content, strategy, locale), [content, locale, strategy]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <WorkspaceProvider locale={locale} content={personaContent}>
      <AuditProvider locale={locale}>
        <ChatLayout
          overlay={<AuditTrail />}
          toolbar={
            <ChatToolbar
              onOpenHistory={() => setIsHistoryOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          }
          stream={
            <>
              <ChatEmptyState />
              <ChatSuggestions />
              <ChatStream />
            </>
          }
          composer={
            <>
              <PersonaContextBanner />
              <ChatInput />
            </>
          }
          artifacts={<ChatArtifacts />}
        />
        <HistoryPanel isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
        <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </AuditProvider>
    </WorkspaceProvider>
  );
}
