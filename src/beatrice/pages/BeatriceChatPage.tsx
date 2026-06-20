import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { AuditTrailOverlay } from "../components/audit/AuditTrailOverlay";
import { ChatComposerDock } from "../components/chat/ChatComposerDock";
import { ChatLayout, useChatViewport } from "../components/chat/ChatLayout";
import { ChatStream } from "../components/chat/ChatStream";
import { ChatToolbar } from "../components/chat/ChatToolbar";
import { useI18n } from "../../i18n/I18nProvider";
import { usePersonaContext } from "../hooks/usePersonaContext";
import { AuditProvider } from "../providers/AuditProvider";
import { WorkspaceProvider } from "../providers/WorkspaceProvider";
import { getChatContent, getPersonaChatContent } from "../services/orchestration.service";
import type { Locale } from "../../i18n/translations";

const HistoryPanel = lazy(() =>
  import("../components/chat/HistoryPanel").then((module) => ({ default: module.HistoryPanel })),
);
const SettingsPanel = lazy(() =>
  import("../components/chat/SettingsPanel").then((module) => ({ default: module.SettingsPanel })),
);

export function BeatriceChatPage() {
  const { locale } = useI18n();

  return <PersonaAwareChatWorkspace locale={locale} />;
}

function PersonaAwareChatWorkspace({ locale }: { locale: Locale }) {
  const { activePersonaContext: strategy } = usePersonaContext();
  const { isDesktop } = useChatViewport();
  const content = useMemo(() => getChatContent(locale), [locale]);
  const personaContent = useMemo(() => getPersonaChatContent(content, strategy, locale), [content, locale, strategy]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [contextOpen, setContextOpen] = useState(isDesktop);

  useEffect(() => {
    setContextOpen(isDesktop);
  }, [isDesktop, strategy.id]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <WorkspaceProvider locale={locale} content={personaContent}>
        <AuditProvider locale={locale}>
          <ChatLayout
          contextOpen={contextOpen}
          isDesktop={isDesktop}
          onContextOpenChange={setContextOpen}
          overlay={<AuditTrailOverlay />}
          toolbar={
            <ChatToolbar
              contextOpen={contextOpen}
              onToggleContext={() => setContextOpen((current) => !current)}
              onOpenHistory={() => setIsHistoryOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          }
          stream={<ChatStream />}
          composer={<ChatComposerDock />}
        />
        {isHistoryOpen ? (
          <Suspense fallback={null}>
            <HistoryPanel isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
          </Suspense>
        ) : null}
        {isSettingsOpen ? (
          <Suspense fallback={null}>
            <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
          </Suspense>
        ) : null}
        </AuditProvider>
      </WorkspaceProvider>
    </div>
  );
}
