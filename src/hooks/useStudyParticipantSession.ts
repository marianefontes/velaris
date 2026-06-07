import { useEffect, useState } from "react";
import {
  clearActiveStudySession,
  getActiveStudySession,
  validateStudySession,
} from "../services/studyTracking";

export type ParticipantSessionStatus = "checking" | "participant" | "none";

export function useStudyParticipantSession(): ParticipantSessionStatus {
  const [status, setStatus] = useState<ParticipantSessionStatus>(() =>
    getActiveStudySession() ? "checking" : "none"
  );

  useEffect(() => {
    const credential = getActiveStudySession();
    if (!credential) {
      setStatus("none");
      return;
    }
    let active = true;
    validateStudySession(credential).then((valid) => {
      if (!active) return;
      if (valid) {
        setStatus("participant");
      } else {
        clearActiveStudySession();
        setStatus("none");
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return status;
}
