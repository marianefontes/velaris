import { useCallback } from "react";
import type { Locale } from "../../i18n/translations";
import type { AuditEntry } from "../types/beatrice";
import { exportAuditTrailJson, exportAuditTrailMd } from "../services/artifact.service";

export function useArtifactGeneration(locale: Locale) {
  const exportMarkdown = useCallback((entries: AuditEntry[]) => {
    exportAuditTrailMd(entries, locale);
  }, [locale]);

  const exportJson = useCallback((entries: AuditEntry[]) => {
    exportAuditTrailJson(entries, locale);
  }, [locale]);

  return { exportJson, exportMarkdown };
}

