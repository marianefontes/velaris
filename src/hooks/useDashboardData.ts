import { useEffect, useState } from "react";
import { fetchDashboardData } from "../services/dashboardService";
import type { Locale } from "../i18n/translations";
import type { DashboardData } from "../types/dashboard";

export function useDashboardData(locale: Locale) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    void fetchDashboardData(locale).then((response) => {
      if (!active) {
        return;
      }

      setData(response);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, [locale]);

  return { data, isLoading };
}
