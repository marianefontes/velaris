import { getMockDashboardData } from "../data/mockDashboard";
import type { Locale } from "../i18n/translations";
import type { DashboardData } from "../types/dashboard";

export async function fetchDashboardData(locale: Locale): Promise<DashboardData> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(getMockDashboardData(locale)), 850);
  });
}
