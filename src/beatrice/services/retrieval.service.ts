import type { HealthData } from "../types/beatrice";
import { getApiConfiguration } from "../../services/apiConfig";

export interface HealthCheckResult {
  data: HealthData | null;
  error: unknown;
  healthy: boolean;
  status: number | null;
  url: string;
}

function devLog(label: string, payload: unknown) {
  if (import.meta.env.DEV) {
    console.debug(`[abraxos:health] ${label}`, payload);
  }
}

function parseHealthBody(rawBody: string): HealthData | null {
  if (!rawBody) return null;
  try {
    return JSON.parse(rawBody) as HealthData;
  } catch {
    return null;
  }
}

export async function checkApiHealth(): Promise<HealthCheckResult> {
  const configuration = getApiConfiguration();
  devLog("request", {
    configuredValue: configuration.configuredValue,
    source: configuration.source,
    url: configuration.healthUrl,
  });

  try {
    const response = await fetch(configuration.healthUrl, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    const rawBody = await response.text();
    const data = parseHealthBody(rawBody);
    const healthy = response.ok && data?.status === "ok";

    devLog("response", {
      body: data ?? rawBody,
      status: response.status,
      url: configuration.healthUrl,
    });
    devLog("result", { healthy });

    return {
      data,
      error: null,
      healthy,
      status: response.status,
      url: configuration.healthUrl,
    };
  } catch (error) {
    devLog("error", {
      error,
      url: configuration.healthUrl,
    });
    devLog("result", { healthy: false });
    return {
      data: null,
      error,
      healthy: false,
      status: null,
      url: configuration.healthUrl,
    };
  }
}

export async function fetchHealthData(): Promise<HealthData | null> {
  const result = await checkApiHealth();
  return result.healthy ? result.data : null;
}
