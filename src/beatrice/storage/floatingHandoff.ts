import type { ChatMessage, HistoryEntry } from "../types/beatrice";
import type { AbraxosSurfaceContext } from "../domain/assistant/types";

export const FLOATING_HANDOFF_KEY = "aetheris_abraxos_floating_handoff";

export interface FloatingHandoffPayload {
  context: AbraxosSurfaceContext;
  input: string;
  messages: ChatMessage[];
  history: HistoryEntry[];
}

function canUseSessionStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function writeFloatingHandoff(payload: FloatingHandoffPayload) {
  if (!canUseSessionStorage()) return;
  try {
    window.sessionStorage.setItem(FLOATING_HANDOFF_KEY, JSON.stringify(payload));
  } catch {
    // sessionStorage may be unavailable in private browsing.
  }
}

let pendingFloatingHandoff: FloatingHandoffPayload | null = null;

export function consumeFloatingHandoff(): FloatingHandoffPayload | null {
  if (typeof window === "undefined") return null;
  if (pendingFloatingHandoff === null) {
    try {
      const raw = window.sessionStorage.getItem(FLOATING_HANDOFF_KEY);
      window.sessionStorage.removeItem(FLOATING_HANDOFF_KEY);
      pendingFloatingHandoff = raw ? JSON.parse(raw) as FloatingHandoffPayload : null;
    } catch {
      pendingFloatingHandoff = null;
    }
    queueMicrotask(() => {
      pendingFloatingHandoff = null;
    });
  }
  return pendingFloatingHandoff;
}
