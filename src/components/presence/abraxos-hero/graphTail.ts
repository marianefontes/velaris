import { PALETTE } from "./constants";
import { mulberry32, randRange } from "./rng";
import { sampleSpine } from "./spine";

export interface GraphNode {
  baseX: number;
  baseY: number;
  offsetX: number;
  offsetY: number;
  radius: number;
  seed: number;
  t: number;
  pulse: boolean;
  phase: number;
}

export interface GraphEdge {
  a: number;
  b: number;
  alpha: number;
}

export function createGraphTail(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const rng = mulberry32(0x9a4b070);
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  for (let t = 0.6; t <= 1; t += 0.028) {
    const spine = sampleSpine(t);
    const jitter = randRange(rng, -6, 6) * (t - 0.5);
    nodes.push({
      baseX: spine.x + spine.normal.x * jitter,
      baseY: spine.y + spine.normal.y * jitter,
      offsetX: 0,
      offsetY: 0,
      radius: randRange(rng, 1.4, 3.2) * (1.1 - t * 0.3),
      seed: rng() * Math.PI * 2,
      t,
      pulse: rng() > 0.55,
      phase: rng() * Math.PI * 2,
    });
  }

  for (let i = 0; i < nodes.length - 1; i += 1) {
    edges.push({ a: i, b: i + 1, alpha: 0.45 });
  }

  nodes.forEach((node, idx) => {
    if (rng() > 0.68) return;
    const spine = sampleSpine(node.t);
    const branchLen = randRange(rng, 18, 42) * (1 - node.t * 0.5);
    const angle =
      Math.atan2(spine.normal.y, spine.normal.x) +
      (rng() > 0.5 ? 1 : -1) * randRange(rng, 0.4, 1.1);

    const bx = node.baseX + Math.cos(angle) * branchLen;
    const by = node.baseY + Math.sin(angle) * branchLen;

    const branchIdx = nodes.length;
    nodes.push({
      baseX: bx,
      baseY: by,
      offsetX: 0,
      offsetY: 0,
      radius: randRange(rng, 0.9, 2.2),
      seed: rng() * Math.PI * 2,
      t: Math.min(1, node.t + 0.06),
      pulse: rng() > 0.7,
      phase: rng() * Math.PI * 2,
    });

    edges.push({ a: idx, b: branchIdx, alpha: 0.28 });

    if (rng() > 0.55) {
      const subLen = branchLen * randRange(rng, 0.35, 0.6);
      const subAngle = angle + (rng() > 0.5 ? 1 : -1) * randRange(rng, 0.5, 1.2);
      const subIdx = nodes.length;
      nodes.push({
        baseX: bx + Math.cos(subAngle) * subLen,
        baseY: by + Math.sin(subAngle) * subLen,
        offsetX: 0,
        offsetY: 0,
        radius: randRange(rng, 0.7, 1.6),
        seed: rng() * Math.PI * 2,
        t: Math.min(1, node.t + 0.1),
        pulse: false,
        phase: rng() * Math.PI * 2,
      });
      edges.push({ a: branchIdx, b: subIdx, alpha: 0.2 });
    }
  });

  return { nodes, edges };
}

export const GRAPH_COLORS = [PALETTE.primary, PALETTE.secondary, PALETTE.tertiary] as const;
