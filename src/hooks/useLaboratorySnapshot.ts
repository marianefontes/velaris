import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchLaboratoryRevision,
  fetchLaboratorySnapshot,
  LABORATORY_INVALIDATION_EVENT,
} from "../services/laboratoryService";
import type { LaboratorySnapshot } from "../types/laboratory";


export function useLaboratorySnapshot(enabled: boolean) {
  const [snapshot, setSnapshot] = useState<LaboratorySnapshot | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const revisionRef = useRef(0);

  const refresh = useCallback(async () => {
    if (!enabled) return undefined;
    setStatus((current) => current === "ready" ? current : "loading");
    try {
      const next = await fetchLaboratorySnapshot();
      revisionRef.current = next.revision;
      setSnapshot(next);
      setStatus("ready");
      return next;
    } catch {
      setStatus("error");
      return undefined;
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      revisionRef.current = 0;
      setSnapshot(null);
      setStatus("idle");
      return;
    }
    void refresh();
  }, [enabled, refresh]);

  useEffect(() => {
    if (!enabled) return;
    const hasActiveRun = snapshot?.runs?.some((run) => ["queued", "running"].includes(run.status));
    const interval = window.setInterval(async () => {
      if (hasActiveRun) {
        void refresh();
        return;
      }
      try {
        const revision = await fetchLaboratoryRevision();
        if (revision > revisionRef.current) void refresh();
      } catch {
        // Retain the last synchronized snapshot during temporary network loss.
      }
    }, hasActiveRun ? 2000 : 15000);
    return () => window.clearInterval(interval);
  }, [enabled, refresh, snapshot?.revision]);

  useEffect(() => {
    if (!enabled) return;
    const onFocus = () => void refresh();
    const onInvalidated = () => void refresh();
    window.addEventListener("focus", onFocus);
    window.addEventListener(LABORATORY_INVALIDATION_EVENT, onInvalidated);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener(LABORATORY_INVALIDATION_EVENT, onInvalidated);
    };
  }, [enabled, refresh]);

  return { snapshot, status, refresh };
}
