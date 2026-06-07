import { getApiBaseUrl } from "./apiConfig";

const RESEARCH_KEY_STORAGE = "aetheris.research.key";

export type ResearchAdminVerification =
  | { authenticated: true }
  | {
      authenticated: false;
      reason: "invalid" | "unconfigured" | "route_missing" | "unreachable" | "server_error";
    };

export function readResearchAdminKey(): string {
  return window.sessionStorage.getItem(RESEARCH_KEY_STORAGE) ?? "";
}

export function saveResearchAdminKey(key: string): void {
  window.sessionStorage.setItem(RESEARCH_KEY_STORAGE, key);
}

export function clearResearchAdminKey(): void {
  window.sessionStorage.removeItem(RESEARCH_KEY_STORAGE);
}

export function researchAdminHeaders(key = readResearchAdminKey()): HeadersInit {
  return { "X-Research-Key": key };
}

export async function verifyResearchAdminAccess(key: string): Promise<ResearchAdminVerification> {
  if (!key.trim()) return { authenticated: false, reason: "invalid" };

  try {
    const response = await fetch(`${getApiBaseUrl()}/laboratory/auth/verify`, {
      method: "POST",
      headers: researchAdminHeaders(key),
    });

    if (response.status === 401) return { authenticated: false, reason: "invalid" };
    if (response.status === 503) return { authenticated: false, reason: "unconfigured" };
    if (response.status === 404) return { authenticated: false, reason: "route_missing" };
    if (!response.ok) return { authenticated: false, reason: "server_error" };

    saveResearchAdminKey(key);
    return { authenticated: true };
  } catch {
    return { authenticated: false, reason: "unreachable" };
  }
}

export async function verifyResearchAdminKey(key: string): Promise<boolean> {
  return (await verifyResearchAdminAccess(key)).authenticated;
}
