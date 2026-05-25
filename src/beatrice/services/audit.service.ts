import { getAuditLabels, messagesToAuditEntries } from "../domain/audit";
import { exportAuditTrailJson, exportAuditTrailMd } from "./artifact.service";

export const auditService = {
  exportAuditTrailJson,
  exportAuditTrailMd,
  getAuditLabels,
  messagesToAuditEntries,
};
