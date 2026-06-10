import { PALETTE } from "./constants";
import { sampleSpine } from "./spine";

export interface WingNode {
  x: number;
  y: number;
  radius: number;
  seed: number;
}

export interface WingEdge {
  a: number;
  b: number;
}

export interface WingGraph {
  nodes: WingNode[];
  edges: WingEdge[];
  originT: number;
}

/** Vestigial wing as a small connection graph — folded along the dorsal spine. */
function buildWing(
  side: 1 | -1,
  originT: number,
  seed: number,
): { nodes: WingNode[]; edges: WingEdge[] } {
  const spine = sampleSpine(originT);
  const nx = spine.normal.x * side;
  const ny = spine.normal.y * side;
  const tx = spine.tangent.x;
  const ty = spine.tangent.y;

  const ox = spine.x;
  const oy = spine.y;

  const nodes: WingNode[] = [
    { x: ox, y: oy, radius: 1.6, seed },
    { x: ox + nx * 14 + tx * 6, y: oy + ny * 14 + ty * 6, radius: 1.4, seed: seed + 0.4 },
    { x: ox + nx * 28 + tx * 2, y: oy + ny * 28 + ty * 2, radius: 1.2, seed: seed + 0.8 },
    { x: ox + nx * 20 + tx * 18, y: oy + ny * 20 + ty * 18, radius: 1.1, seed: seed + 1.2 },
    { x: ox + nx * 34 + tx * 12, y: oy + ny * 34 + ty * 12, radius: 1.3, seed: seed + 1.6 },
    { x: ox + nx * 10 + tx * 26, y: oy + ny * 10 + ty * 26, radius: 1, seed: seed + 2 },
  ];

  const edges: WingEdge[] = [
    { a: 0, b: 1 },
    { a: 1, b: 2 },
    { a: 1, b: 3 },
    { a: 3, b: 4 },
    { a: 3, b: 5 },
    { a: 2, b: 4 },
  ];

  return { nodes, edges };
}

export function createWingGraphs(): WingGraph[] {
  const left = buildWing(-1, 0.28, 0.5);
  const right = buildWing(1, 0.32, 2.1);

  return [
    { ...left, originT: 0.28 },
    { ...right, originT: 0.32 },
  ];
}

export const WING_COLOR = PALETTE.secondary;
