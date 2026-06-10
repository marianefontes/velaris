// ||| Phase R · Calibration domain helpers
// Shared between PerspectivesPage (writes) and chat orchestrator (reads).
// Persists per-lens calibration to localStorage and exposes a typed reader.

import type { ProfileId } from "../../types/beatrice";
import { legacyProfileIdsFor } from "./profileIds";

export type CalibrationDepth = "low" | "medium" | "high";

export interface Calibration {
  depth: CalibrationDepth;
  technicality: number; // 0..1
  risk_sensitivity: number; // 0..1
}

const CALIBRATION_KEY_PREFIX = "beatrice.calibration";

function calibrationKey(profileId: string): string {
  return `${CALIBRATION_KEY_PREFIX}.${profileId}`;
}

export function readCalibration(profileId: ProfileId): Calibration | null {
  if (typeof window === "undefined") return null;
  try {
    const canonicalKey = calibrationKey(profileId);
    let raw = window.localStorage.getItem(canonicalKey);
    const legacyKeys = legacyProfileIdsFor(profileId).map(calibrationKey);
    let legacyKey: string | null = null;
    if (!raw) {
      legacyKey = legacyKeys.find((key) => window.localStorage.getItem(key)) ?? null;
      raw = legacyKey ? window.localStorage.getItem(legacyKey) : null;
    }
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Calibration & { riskSensitivity?: number }>;
    const depth = parsed.depth;
    if (depth !== "low" && depth !== "medium" && depth !== "high") return null;
    // Accept legacy camelCase shape (riskSensitivity) for forward compat with the page state.
    const tech = typeof parsed.technicality === "number" ? parsed.technicality : null;
    const risk =
      typeof parsed.risk_sensitivity === "number"
        ? parsed.risk_sensitivity
        : typeof parsed.riskSensitivity === "number"
          ? parsed.riskSensitivity
          : null;
    if (tech === null || risk === null) return null;
    const calibration = {
      depth,
      technicality: clamp01(tech),
      risk_sensitivity: clamp01(risk),
    };
    if (legacyKey || legacyKeys.some((key) => window.localStorage.getItem(key))) {
      window.localStorage.setItem(canonicalKey, JSON.stringify(calibration));
      legacyKeys.forEach((key) => window.localStorage.removeItem(key));
    }
    return calibration;
  } catch {
    return null;
  }
}

export function writeCalibration(profileId: ProfileId, calibration: Calibration) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(calibrationKey(profileId), JSON.stringify(calibration));
}

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}
