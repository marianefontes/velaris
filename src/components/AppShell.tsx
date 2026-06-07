import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { trackStudyEvent } from "../services/studyTracking";
import { useStudyParticipantSession } from "../hooks/useStudyParticipantSession";
import { useLaboratorySnapshot } from "../hooks/useLaboratorySnapshot";
import { readResearchAdminKey } from "../services/researchAdminAuth";
import { AppTopBar } from "./AppTopBar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const participantStatus = useStudyParticipantSession();
  const laboratorySnapshot = useLaboratorySnapshot(
    participantStatus === "none" && Boolean(readResearchAdminKey()),
  );
  const shellExemptRoute =
    location.pathname.startsWith("/study/") || location.pathname === "/research";
  const trackingExemptRoute = shellExemptRoute || location.pathname === "/laboratory";

  useEffect(() => {
    if (trackingExemptRoute) return;
    void trackStudyEvent("page_view", {
      title: document.title,
      referrer: document.referrer || null,
    });
  }, [trackingExemptRoute, location.pathname, location.search]);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <div className="flex min-h-screen flex-col">
        {!shellExemptRoute ? (
          <AppTopBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            hideLaboratory={participantStatus !== "none"}
            laboratoryUnread={
              (laboratorySnapshot.snapshot?.unread_recommendations ?? 0)
              + (laboratorySnapshot.snapshot?.unread_notifications ?? 0)
            }
          />
        ) : null}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
