import { useMemo } from "react";
import { AuditTrail } from "../components/audit/AuditTrail";
import { ChatArtifacts } from "../components/chat/ChatArtifacts";
import { ChatEmptyState } from "../components/chat/ChatEmptyState";
import { ChatInput } from "../components/chat/ChatInput";
import { ChatLayout } from "../components/chat/ChatLayout";
import { ChatStream } from "../components/chat/ChatStream";
import { ChatSuggestions } from "../components/chat/ChatSuggestions";
import { ChatToolbar } from "../components/chat/ChatToolbar";
import { PersonaContextBanner } from "../components/persona/PersonaContextBanner";
import { PersonaSwitcher } from "../components/persona/PersonaSwitcher";
import { useI18n } from "../../i18n/I18nProvider";
import { AuditProvider } from "../providers/AuditProvider";
import { PersonaProvider } from "../providers/PersonaProvider";
import { WorkspaceProvider } from "../providers/WorkspaceProvider";
import { getChatContent } from "../services/orchestration.service";

export function BeatriceChatPage() {
  const { locale } = useI18n();
  const content = useMemo(() => getChatContent(locale), [locale]);

  return (
    <PersonaProvider locale={locale}>
      <WorkspaceProvider locale={locale} content={content}>
        <AuditProvider locale={locale}>
          <ChatLayout
            overlay={<AuditTrail />}
            toolbar={<ChatToolbar />}
            stream={
              <>
                <ChatEmptyState />
                <ChatSuggestions />
                <ChatStream />
              </>
            }
            composer={
              <>
                <PersonaSwitcher />
                <PersonaContextBanner />
                <ChatInput />
              </>
            }
            artifacts={<ChatArtifacts />}
          />
        </AuditProvider>
      </WorkspaceProvider>
    </PersonaProvider>
  );
}

