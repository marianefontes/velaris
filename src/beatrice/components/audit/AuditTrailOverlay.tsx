import { lazy, Suspense } from "react";
import { useAuditTrail } from "../../hooks/useAuditTrail";

const AuditTrail = lazy(() =>
  import("./AuditTrail").then((module) => ({ default: module.AuditTrail })),
);

export function AuditTrailOverlay() {
  const { isOpen } = useAuditTrail();
  if (!isOpen) return null;

  return (
    <Suspense fallback={null}>
      <AuditTrail />
    </Suspense>
  );
}
