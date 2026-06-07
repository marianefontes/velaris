import { getApiBaseUrl } from "./apiConfig";
import {
  clearResearchAdminKey,
  readResearchAdminKey,
  researchAdminHeaders,
} from "./researchAdminAuth";
import type {
  LaboratoryCaseSet,
  LaboratoryNotification,
  LaboratoryRecommendation,
  LaboratoryResults,
  LaboratoryRun,
  LaboratorySnapshot,
} from "../types/laboratory";

export const LABORATORY_INVALIDATION_EVENT = "aetheris:laboratory-invalidated";

function invalidateLaboratory(): void {
  window.dispatchEvent(new CustomEvent(LABORATORY_INVALIDATION_EVENT));
}

async function laboratoryFetch<T>(
  path: string,
  options: RequestInit = {},
  key = readResearchAdminKey(),
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("X-Research-Key", key);
  const response = await fetch(`${getApiBaseUrl()}${path}`, { ...options, headers });
  if (response.status === 401) clearResearchAdminKey();
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { detail?: string } | null;
    throw new Error(body?.detail ?? `laboratory_http_${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchLaboratoryCaseSets(): Promise<LaboratoryCaseSet[]> {
  const response = await laboratoryFetch<{ case_sets: LaboratoryCaseSet[] }>("/laboratory/case-sets");
  return response.case_sets;
}

export async function fetchLaboratoryRuns(): Promise<LaboratoryRun[]> {
  const response = await laboratoryFetch<{ runs: LaboratoryRun[] }>("/laboratory/runs");
  return response.runs;
}

export async function fetchLaboratoryRun(runId: string): Promise<LaboratoryRun> {
  return laboratoryFetch<LaboratoryRun>(`/laboratory/runs/${runId}`);
}

export async function createLaboratoryRun(payload: {
  case_set_id: string;
  version_label: string;
  profiles: string[];
  repetitions: number;
}): Promise<LaboratoryRun> {
  const run = await laboratoryFetch<LaboratoryRun>("/laboratory/runs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  invalidateLaboratory();
  return run;
}

export async function cancelLaboratoryRun(runId: string): Promise<void> {
  await laboratoryFetch(`/laboratory/runs/${runId}/cancel`, { method: "POST" });
  invalidateLaboratory();
}

export async function setLaboratoryBaseline(runId: string): Promise<void> {
  await laboratoryFetch(`/laboratory/runs/${runId}/baseline`, { method: "POST" });
  invalidateLaboratory();
}

export async function reviewLaboratoryItem(
  itemId: string,
  payload: { reviewer: string; scores: Record<string, number>; notes: string },
): Promise<void> {
  await laboratoryFetch(`/laboratory/items/${itemId}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  invalidateLaboratory();
}

export async function fetchLaboratoryResults(): Promise<LaboratoryResults> {
  return laboratoryFetch<LaboratoryResults>("/laboratory/results");
}

export async function fetchLaboratorySnapshot(signal?: AbortSignal): Promise<LaboratorySnapshot> {
  return laboratoryFetch<LaboratorySnapshot>("/laboratory/snapshot", { signal });
}

export async function fetchLaboratoryRevision(signal?: AbortSignal): Promise<number> {
  const response = await laboratoryFetch<{ revision: number }>("/laboratory/revision", { signal });
  return response.revision;
}

export async function pauseLaboratoryAutomation(reason: string): Promise<void> {
  await laboratoryFetch("/laboratory/automation/pause", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });
  invalidateLaboratory();
}

export async function resumeLaboratoryAutomation(): Promise<void> {
  await laboratoryFetch("/laboratory/automation/resume", { method: "POST" });
  invalidateLaboratory();
}

export async function fetchLaboratoryRecommendations(): Promise<LaboratoryRecommendation[]> {
  const response = await laboratoryFetch<{ recommendations: LaboratoryRecommendation[] }>(
    "/laboratory/recommendations",
  );
  return response.recommendations;
}

export async function markLaboratoryRecommendationRead(id: string): Promise<void> {
  await laboratoryFetch(`/laboratory/recommendations/${id}/read`, { method: "POST" });
  invalidateLaboratory();
}

export async function decideLaboratoryRecommendation(
  id: string,
  decision: "reject" | "approve_for_backlog",
  notes = "",
): Promise<void> {
  await laboratoryFetch(`/laboratory/recommendations/${id}/decision`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ decision, notes }),
  });
  invalidateLaboratory();
}

export async function rollbackLaboratoryCalibration(
  versionId: string,
  reason: string,
): Promise<void> {
  await laboratoryFetch(`/laboratory/calibrations/${versionId}/rollback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });
  invalidateLaboratory();
}

export async function fetchLaboratoryNotifications(): Promise<LaboratoryNotification[]> {
  const response = await laboratoryFetch<{ notifications: LaboratoryNotification[] }>(
    "/laboratory/notifications",
  );
  return response.notifications;
}

export async function markLaboratoryNotificationsRead(ids: string[] = []): Promise<void> {
  await laboratoryFetch("/laboratory/notifications/read", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  invalidateLaboratory();
}
