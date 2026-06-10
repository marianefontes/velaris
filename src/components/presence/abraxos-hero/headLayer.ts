import { PALETTE } from "./constants";
import { densityAt } from "./material";
import { mulberry32, randRange } from "./rng";
import type { SpineSample } from "./spine";
import { sampleSpine } from "./spine";

export interface HeadParticle {
  baseX: number;
  baseY: number;
  offsetX: number;
  offsetY: number;
  radius: number;
  color: string;
  alpha: number;
  seed: number;
  t: number;
}

export interface EyeGlow {
  x: number;
  y: number;
  radius: number;
  seed: number;
}

const HEAD_COLORS = [PALETTE.primary, PALETTE.secondary, PALETTE.tertiary, "#ffffff"] as const;

function inEllipse(
  x: number,
  y: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  angle = -0.35,
): boolean {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = x - cx;
  const dy = y - cy;
  const lx = dx * cos + dy * sin;
  const ly = -dx * sin + dy * cos;
  return (lx * lx) / (rx * rx) + (ly * ly) / (ry * ry) <= 1;
}

/** Anatomical mask preserving snout, jaw, crest and neck. */
function headMaskWeight(lx: number, ly: number): number {
  const skull = inEllipse(lx, ly, 0, 0, 40, 34) ? 1 : 0;
  const snout = inEllipse(lx, ly, 24, -14, 32, 15, -0.2) ? 1.2 : 0;
  const jaw = inEllipse(lx, ly, 6, 18, 28, 17, 0.1) ? 0.9 : 0;
  const crest1 = inEllipse(lx, ly, -6, -32, 14, 22, -0.5) ? 0.85 : 0;
  const crest2 = inEllipse(lx, ly, -18, -42, 12, 18, -0.55) ? 0.75 : 0;
  const crest3 = inEllipse(lx, ly, -30, -48, 10, 14, -0.6) ? 0.65 : 0;
  const neck = inEllipse(lx, ly, -18, 28, 22, 30, 0.2) ? 0.7 : 0;
  return Math.max(skull, snout, jaw, crest1, crest2, crest3, neck);
}

export function createHeadLayer(count = 1200): {
  particles: HeadParticle[];
  eyes: EyeGlow[];
  center: SpineSample;
} {
  const center = sampleSpine(0.04);
  const rng = mulberry32(0x0abfa505);
  const particles: HeadParticle[] = [];
  const headAngle = Math.atan2(center.tangent.y, center.tangent.x);
  const cos = Math.cos(headAngle);
  const sin = Math.sin(headAngle);

  let attempts = 0;
  while (particles.length < count && attempts < count * 12) {
    attempts += 1;
    const angle = rng() * Math.PI * 2;
    const radius = Math.pow(rng(), 0.55) * 48;
    const lx = Math.cos(angle) * radius;
    const ly = Math.sin(angle) * radius;
    const weight = headMaskWeight(lx, ly);
    if (weight < 0.35) continue;

    const wx = center.x + lx * cos - ly * sin;
    const wy = center.y + lx * sin + ly * cos;
    const distFactor = 1 - Math.hypot(lx, ly) / 52;

    particles.push({
      baseX: wx,
      baseY: wy,
      offsetX: 0,
      offsetY: 0,
      radius: randRange(rng, 0.8, 2.4) * (0.7 + weight * 0.5),
      color: HEAD_COLORS[Math.floor(rng() * HEAD_COLORS.length)],
      alpha: (0.55 + distFactor * 0.4) * weight * densityAt(0.04),
      seed: rng() * Math.PI * 2,
      t: 0.04,
    });
  }

  const eyeOffset1 = { lx: 16, ly: -10 };
  const eyeOffset2 = { lx: 22, ly: -2 };

  const toWorld = (lx: number, ly: number) => ({
    x: center.x + lx * cos - ly * sin,
    y: center.y + lx * sin + ly * cos,
  });

  const e1 = toWorld(eyeOffset1.lx, eyeOffset1.ly);
  const e2 = toWorld(eyeOffset2.lx, eyeOffset2.ly);

  const eyes: EyeGlow[] = [
    { x: e1.x, y: e1.y, radius: 3.2, seed: 0.2 },
    { x: e2.x, y: e2.y, radius: 2.6, seed: 1.4 },
  ];

  return { particles, eyes, center };
}
