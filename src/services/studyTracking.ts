import { getApiBaseUrl } from "./apiConfig";

const STORAGE_KEY = "aetheris.study.sessions";
const ACTIVE_SESSION_KEY = "aetheris.study.activeSession";

export interface StudySessionCredential {
  inviteToken: string;
  sessionId: string;
  accessToken: string;
  participantCode: string;
  createdAt: string;
}

type StoredSessions = Record<string, StudySessionCredential>;

function readStoredSessions(): StoredSessions {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    return parsed && typeof parsed === "object" ? parsed as StoredSessions : {};
  } catch {
    return {};
  }
}

export function saveStudySession(credential: StudySessionCredential): void {
  const sessions = readStoredSessions();
  sessions[credential.inviteToken] = credential;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  window.localStorage.setItem(ACTIVE_SESSION_KEY, credential.inviteToken);
}

export function getStudySessionForInvite(inviteToken: string): StudySessionCredential | null {
  return readStoredSessions()[inviteToken] ?? null;
}

export function getActiveStudySession(): StudySessionCredential | null {
  const activeToken = window.localStorage.getItem(ACTIVE_SESSION_KEY);
  if (!activeToken) return null;
  return getStudySessionForInvite(activeToken);
}

export function clearActiveStudySession(): void {
  window.localStorage.removeItem(ACTIVE_SESSION_KEY);
}

export async function validateStudySession(
  credential: StudySessionCredential,
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/study/sessions/${credential.sessionId}`, {
      headers: { Authorization: `Bearer ${credential.accessToken}` },
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function trackStudyEvent(
  eventType: string,
  metadata: Record<string, unknown> = {},
  path = `${window.location.pathname}${window.location.search}`,
): Promise<void> {
  const credential = getActiveStudySession();
  if (!credential) return;

  try {
    await fetch(`${getApiBaseUrl()}/study/sessions/${credential.sessionId}/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${credential.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: eventType,
        path,
        metadata,
      }),
      keepalive: true,
    });
  } catch {
    // Research telemetry must never interrupt the participant's primary task.
  }
}
