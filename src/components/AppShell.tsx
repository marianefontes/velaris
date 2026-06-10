import type { ReactNode } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackStudyEvent } from "../services/studyTracking";
import { useStudyParticipantSession } from "../hooks/useStudyParticipantSession";
import { useLaboratorySnapshot } from "../hooks/useLaboratorySnapshot";
import { readResearchAdminKey } from "../services/researchAdminAuth";
import { useI18n } from "../i18n/I18nProvider";
import { AppTopBar } from "./AppTopBar";
import {
  AbraxosRouteTransition,
  getPageEnterClass,
  getTransitionForPath,
} from "./presence/AbraxosRouteTransition";
import { AbraxosAssistantShell } from "../beatrice/components/assistant/AbraxosAssistantShell";
import { BeatricePresence } from "./presence/BeatricePresence";
import { usePrefersReducedMotion } from "./presence/usePrefersReducedMotion";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { t } = useI18n();
  const location = useLocation();
  const reducedMotion = usePrefersReducedMotion();
  const transitionEntry = getTransitionForPath(location.pathname);
  const pageEnterClass = getPageEnterClass(reducedMotion);
  const participantStatus = useStudyParticipantSession();
  const laboratorySnapshot = useLaboratorySnapshot(
    participantStatus === "none" && Boolean(readResearchAdminKey()),
  );
  const shellExemptRoute =
    location.pathname.startsWith("/study/") || location.pathname === "/research";
  const trackingExemptRoute = shellExemptRoute || location.pathname === "/laboratory";

  // Global search mirrors its query into ?q=; strip it so a page_view is not
  // re-emitted on every keystroke. Only meaningful navigation should track.
  const trackedSearch = (() => {
    const params = new URLSearchParams(location.search);
    params.delete("q");
    return params.toString();
  })();

  useEffect(() => {
    if (trackingExemptRoute) return;
    void trackStudyEvent("page_view", {
      title: document.title,
      referrer: document.referrer || null,
    });
  }, [trackingExemptRoute, location.pathname, trackedSearch]);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Abraxos ambient presence: starfield + route-specific transition experiment. */}
      {!shellExemptRoute ? (
        <>
          <BeatricePresence />
          <AbraxosRouteTransition />
        </>
      ) : null}
      <div className="relative z-[1] flex min-h-screen flex-col">
        <a href="#main-content" className="skip-link">
          {t("shell.skipToContent")}
        </a>
        {!shellExemptRoute ? (
          <AppTopBar
            hideLaboratory={participantStatus !== "none"}
            laboratoryUnread={
              (laboratorySnapshot.snapshot?.unread_recommendations ?? 0)
              + (laboratorySnapshot.snapshot?.unread_notifications ?? 0)
            }
          />
        ) : null}
        {shellExemptRoute ? (
          <div id="main-content" tabIndex={-1} className="min-w-0 flex-1 outline-none">
            {children}
          </div>
        ) : (
          <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 outline-none">
            <div
              key={location.pathname}
              className={pageEnterClass}
              data-abraxos-transition-route={transitionEntry ? "destination-presence" : "none"}
              data-abraxos-anchor={transitionEntry?.path ?? "none"}
            >
              {children}
            </div>
          </main>
        )}
      </div>
      {!shellExemptRoute ? <AbraxosAssistantShell /> : null}
    </div>
  );
}
