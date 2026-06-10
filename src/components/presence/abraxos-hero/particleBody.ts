import { PALETTE } from "./constants";
import { densityAt, surfaceOpacityAt } from "./material";
import { mulberry32, randRange } from "./rng";
import { sampleSpine, widthAt } from "./spine";

export interface BodyParticle {
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

export interface BodyConnection {
  a: number;
  b: number;
}

const BODY_COLORS = [PALETTE.primary, PALETTE.secondary, PALETTE.accent, PALETTE.muted] as const;
const CONNECT_DIST = 35;
const CONNECT_DIST_SQ = CONNECT_DIST * CONNECT_DIST;

export function createParticleBody(): {
  particles: BodyParticle[];
  connections: BodyConnection[];
} {
  const rng = mulberry32(0x60d1e5);
  const particles: BodyParticle[] = [];

  for (let t = 0.2; t < 0.6; t += 0.0025) {
    const spine = sampleSpine(t);
    const density = densityAt(t);
    const amount = Math.floor(density * 18);
    const w = widthAt(t);

    for (let i = 0; i < amount; i += 1) {
      const side = rng() > 0.5 ? 1 : -1;
      const spread = randRange(rng, 0.15, 1) * w;
      const along = randRange(rng, -3, 3);

      particles.push({
        baseX: spine.x + spine.normal.x * spread * side + spine.tangent.x * along,
        baseY: spine.y + spine.normal.y * spread * side + spine.tangent.y * along,
        offsetX: 0,
        offsetY: 0,
        radius: randRange(rng, 0.5, 1.8),
        color: BODY_COLORS[Math.floor(rng() * BODY_COLORS.length)],
        alpha: (0.25 + density * 0.45) * surfaceOpacityAt(t),
        seed: rng() * Math.PI * 2,
        t,
      });
    }
  }

  const connections: BodyConnection[] = [];
  const grid = new Map<string, number[]>();
  const cell = CONNECT_DIST;

  const key = (x: number, y: number) =>
    `${Math.floor(x / cell)},${Math.floor(y / cell)}`;

  particles.forEach((p, idx) => {
    const k = key(p.baseX, p.baseY);
    const bucket = grid.get(k);
    if (bucket) bucket.push(idx);
    else grid.set(k, [idx]);
  });

  const seen = new Set<string>();

  particles.forEach((p, idx) => {
    const cx = Math.floor(p.baseX / cell);
    const cy = Math.floor(p.baseY / cell);

    for (let gx = cx - 1; gx <= cx + 1; gx += 1) {
      for (let gy = cy - 1; gy <= cy + 1; gy += 1) {
        const neighbors = grid.get(`${gx},${gy}`);
        if (!neighbors) continue;

        for (const j of neighbors) {
          if (j <= idx) continue;
          const pairKey = `${idx}-${j}`;
          if (seen.has(pairKey)) continue;

          const q = particles[j];
          const dx = p.baseX - q.baseX;
          const dy = p.baseY - q.baseY;
          if (dx * dx + dy * dy < CONNECT_DIST_SQ) {
            seen.add(pairKey);
            connections.push({ a: idx, b: j });
          }
        }
      }
    }
  });

  return { particles, connections };
}
