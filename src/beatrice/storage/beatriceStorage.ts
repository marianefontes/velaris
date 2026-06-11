import type {
  BeatriceConversation,
  BeatriceHistorySnapshot,
  BeatriceSettings,
  ChatMessage,
  HistoryEntry,
  LocaleAware,
  ProfileId,
} from "../types/beatrice";
import { profileIdOrDefault } from "../domain/perspective/profileIds";
import { sanitizePersistedMessages } from "../stores/workspace.store";

export const BEATRICE_HISTORY_STORAGE_KEY = "aetheris_beatrice_history";
export const BEATRICE_SETTINGS_STORAGE_KEY = "aetheris_beatrice_settings";

export const defaultBeatriceSettings: BeatriceSettings = {
  streaming: true,
  autoScroll: true,
  showSources: true,
  showEvidenceSimilarity: true,
  density: "comfortable",
  blurIntensity: "medium",
  verbosity: "balanced",
  xaiDepth: "standard",
};

type JsonRecord = Record<string, unknown>;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readJson(key: string): unknown {
  if (!canUseStorage()) return null;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage may be unavailable in private browsing or quota pressure.
  }
}

function stringValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function booleanValue(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function enumValue<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && allowed.includes(value as T) ? (value as T) : fallback;
}

export function normalizeBeatriceSettings(value: unknown): BeatriceSettings {
  const source = isRecord(value) ? value : {};

  return {
    streaming: booleanValue(source.streaming, defaultBeatriceSettings.streaming),
    autoScroll: booleanValue(source.autoScroll, defaultBeatriceSettings.autoScroll),
    showSources: booleanValue(source.showSources, defaultBeatriceSettings.showSources),
    showEvidenceSimilarity: booleanValue(
      source.showEvidenceSimilarity,
      booleanValue(source.showConfidence, defaultBeatriceSettings.showEvidenceSimilarity),
    ),
    density: enumValue(source.density, ["compact", "comfortable", "dense"] as const, defaultBeatriceSettings.density),
    blurIntensity: enumValue(source.blurIntensity, ["low", "medium", "high"] as const, defaultBeatriceSettings.blurIntensity),
    verbosity: enumValue(source.verbosity, ["concise", "balanced", "detailed"] as const, defaultBeatriceSettings.verbosity),
    xaiDepth: enumValue(source.xaiDepth, ["basic", "standard", "advanced"] as const, defaultBeatriceSettings.xaiDepth),
  };
}

export function readBeatriceSettings(): BeatriceSettings {
  return normalizeBeatriceSettings(readJson(BEATRICE_SETTINGS_STORAGE_KEY));
}

export function writeBeatriceSettings(settings: BeatriceSettings) {
  writeJson(BEATRICE_SETTINGS_STORAGE_KEY, settings);
}

export function resetBeatriceSettingsStorage() {
  writeBeatriceSettings(defaultBeatriceSettings);
}

function normalizeMessage(value: unknown): ChatMessage | null {
  if (!isRecord(value)) return null;
  const role = value.role;
  const content = value.content;
  const id = value.id;

  if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;

  return {
    ...(value as Partial<ChatMessage>),
    id: typeof id === "string" && id ? id : `${role}-${Date.now()}`,
    role,
    content,
  };
}

function normalizeHistoryEntry(value: unknown): HistoryEntry | null {
  if (!isRecord(value)) return null;
  const role = value.role;
  const content = value.content;

  if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
  return { role, content };
}

export function historyFromMessages(messages: ChatMessage[]): HistoryEntry[] {
  return messages
    .filter((message) => !message.isStreaming && !message.isError && (message.role === "user" || message.role === "assistant"))
    .map((message) => ({ role: message.role, content: message.content }));
}

function normalizeConversation(value: unknown, index: number): BeatriceConversation | null {
  if (!isRecord(value)) return null;

  const rawMessages = Array.isArray(value.messages)
    ? value.messages.map(normalizeMessage).filter((message): message is ChatMessage => Boolean(message))
    : [];
  const messages = sanitizePersistedMessages(rawMessages);

  const history = Array.isArray(value.history)
    ? value.history
        .map(normalizeHistoryEntry)
        .filter((entry): entry is HistoryEntry => Boolean(entry))
        .filter((entry) => !entry.content.startsWith("Abraxos está offline.") && !entry.content.startsWith("Abraxos is offline."))
    : historyFromMessages(messages);

  const now = new Date().toISOString();
  const id = stringValue(value.id, `conversation-${index}-${Date.now()}`);
  const createdAt = stringValue(value.createdAt, now);
  const updatedAt = stringValue(value.updatedAt, createdAt);
  const preview = stringValue(value.preview, history.find((entry) => entry.role === "user")?.content ?? "");

  return {
    id,
    title: stringValue(value.title, "Nova conversa"),
    preview,
    createdAt,
    updatedAt,
    messageCount: history.length,
    messages,
    history,
    settings: normalizeBeatriceSettings(value.settings),
    profileId: profileIdOrDefault(value.profileId),
    locale: stringValue(value.locale, "pt-BR") as LocaleAware["locale"],
    isTitleCustom: booleanValue(value.isTitleCustom, false),
  };
}

export function readBeatriceHistory(): BeatriceHistorySnapshot {
  const parsed = readJson(BEATRICE_HISTORY_STORAGE_KEY);
  const source = Array.isArray(parsed) ? { conversations: parsed } : parsed;
  const conversations = isRecord(source) && Array.isArray(source.conversations)
    ? source.conversations
        .map(normalizeConversation)
        .filter((conversation): conversation is BeatriceConversation => Boolean(conversation))
        .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    : [];

  const activeConversationId = isRecord(source)
    ? stringValue(source.activeConversationId, conversations[0]?.id ?? "")
    : conversations[0]?.id ?? "";

  return {
    version: 1,
    activeConversationId,
    conversations,
  };
}

export function writeBeatriceHistory(snapshot: BeatriceHistorySnapshot) {
  writeJson(BEATRICE_HISTORY_STORAGE_KEY, snapshot);
}

// ── Ask prefill ──────────────────────────────────────────────────────────
// The home hero search hands its question to the chat composer through
// sessionStorage so /oracle can pick it up after navigation.

export const BEATRICE_ASK_PREFILL_KEY = "aetheris_beatrice_ask_prefill";

export function writeAskPrefill(question: string) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(BEATRICE_ASK_PREFILL_KEY, question);
  } catch {
    // sessionStorage may be unavailable in private browsing.
  }
}

// One-shot, but stable within the same render pass: StrictMode double-invokes
// state initializers, so the consumed value is cached until the microtask ends.
let pendingAskPrefill: string | null = null;
let askPrefillDispatchLock = false;

export function consumeAskPrefill(): string {
  if (typeof window === "undefined" || askPrefillDispatchLock) return "";
  if (pendingAskPrefill === null) {
    try {
      pendingAskPrefill = window.sessionStorage.getItem(BEATRICE_ASK_PREFILL_KEY) ?? "";
      window.sessionStorage.removeItem(BEATRICE_ASK_PREFILL_KEY);
    } catch {
      pendingAskPrefill = "";
    }
    queueMicrotask(() => {
      pendingAskPrefill = null;
    });
  }
  return pendingAskPrefill;
}

export function lockAskPrefillDispatch() {
  askPrefillDispatchLock = true;
  queueMicrotask(() => {
    askPrefillDispatchLock = false;
  });
}

export function downloadJsonFile(filename: string, data: unknown) {
  if (typeof document === "undefined") return;

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
