import { getApiBaseUrl } from "./apiConfig";
import {
  clearResearchAdminKey,
  readResearchAdminKey,
  researchAdminHeaders,
} from "./researchAdminAuth";
import type {
  AdversarialCase,
  AdversarialSuiteResult,
  KnowledgeHealthDashboard,
  ReliabilityGatesResult,
} from "../types/intelligenceHealth";

async function intelligenceFetch<T>(
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
    throw new Error(body?.detail ?? `intelligence_http_${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchKnowledgeHealthDashboard(): Promise<KnowledgeHealthDashboard> {
  return intelligenceFetch<KnowledgeHealthDashboard>("/knowledge/health/dashboard");
}

export async function fetchAdversarialCases(): Promise<AdversarialCase[]> {
  const response = await intelligenceFetch<{ cases: AdversarialCase[] }>("/intelligence/lab/cases");
  return response.cases;
}

export async function runAdversarialSuite(): Promise<AdversarialSuiteResult> {
  return intelligenceFetch<AdversarialSuiteResult>("/intelligence/lab/run", { method: "POST" });
}

export async function fetchReliabilityGates(): Promise<ReliabilityGatesResult> {
  return intelligenceFetch<ReliabilityGatesResult>("/intelligence/reliability-gates");
}

export { readResearchAdminKey, verifyResearchAdminAccess } from "./researchAdminAuth";
