import { MATERIAL_THRESHOLDS } from "./constants";

/** Particle / matter density along the spine (1 = condensed, 0 = dissolved). */
export function densityAt(t: number): number {
  return 1 - t;
}

/** Surface opacity — fades as matter dissolves into graph. */
export function surfaceOpacityAt(t: number): number {
  if (t < MATERIAL_THRESHOLDS.graphStart) return 1;
  return Math.max(0, 1 - (t - MATERIAL_THRESHOLDS.graphStart) / 0.4);
}

export function regionAt(t: number): "head" | "body" | "graph" {
  if (t < MATERIAL_THRESHOLDS.headEnd) return "head";
  if (t < MATERIAL_THRESHOLDS.bodyEnd) return "body";
  return "graph";
}
