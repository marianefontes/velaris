import type { HealthData } from "../types/beatrice";

const HEALTH_API = "/api/health";

export async function fetchHealthData(): Promise<HealthData | null> {
  const response = await fetch(HEALTH_API);
  return response.ok ? response.json() : null;
}

