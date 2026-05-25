import { useContext } from "react";
import { AuditContext } from "../providers/AuditProvider";

export function useAuditTrail() {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error("useAuditTrail must be used within AuditProvider");
  }
  return context;
}
