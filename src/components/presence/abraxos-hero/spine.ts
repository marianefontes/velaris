import { MATERIAL_THRESHOLDS, SPINE_CONTROL_POINTS } from "./constants";

export interface Vec2 {
  x: number;
  y: number;
}

export interface SpineSample {
  x: number;
  y: number;
  t: number;
  tangent: Vec2;
  normal: Vec2;
}

function catmullRom(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): Vec2 {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x:
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y:
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
}

function catmullRomDerivative(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): Vec2 {
  const t2 = t * t;
  return {
    x:
      0.5 *
      (-p0.x + p2.x +
        2 * (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t +
        3 * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t2),
    y:
      0.5 *
      (-p0.y + p2.y +
        2 * (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t +
        3 * (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t2),
  };
}

const POINTS = SPINE_CONTROL_POINTS as unknown as Vec2[];
const SEGMENTS = POINTS.length - 1;

export function sampleSpine(t: number): SpineSample {
  const clamped = Math.max(0, Math.min(1, t));
  const scaled = clamped * SEGMENTS;
  const segment = Math.min(SEGMENTS - 1, Math.floor(scaled));
  const localT = scaled - segment;

  const p0 = POINTS[Math.max(0, segment - 1)];
  const p1 = POINTS[segment];
  const p2 = POINTS[Math.min(POINTS.length - 1, segment + 1)];
  const p3 = POINTS[Math.min(POINTS.length - 1, segment + 2)];

  const pos = catmullRom(p0, p1, p2, p3, localT);
  const deriv = catmullRomDerivative(p0, p1, p2, p3, localT);
  const len = Math.hypot(deriv.x, deriv.y) || 1;

  return {
    x: pos.x,
    y: pos.y,
    t: clamped,
    tangent: { x: deriv.x / len, y: deriv.y / len },
    normal: { x: -deriv.y / len, y: deriv.x / len },
  };
}

/** Body cross-section radius along the spine. */
export function widthAt(t: number): number {
  if (t < 0.12) return 44 - t * 60;
  if (t < MATERIAL_THRESHOLDS.bodyEnd) return 28 * (1 - ((t - 0.12) / 0.48) * 0.35);
  return Math.max(4, 18 * (1 - (t - MATERIAL_THRESHOLDS.bodyEnd) / 0.4));
}
