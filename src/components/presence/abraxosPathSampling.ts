// Samples edge points along the Abraxos dragon outline for particle spawn anchors.

import { ABRAXOS_DRAGON_OUTLINE, ABRAXOS_DRAGON_VIEWBOX } from "./AbraxosDragon";

export interface SampledEdgePoint {
  x: number;
  y: number;
  nx: number;
  ny: number;
}

export function sampleDragonEdgePoints(segments = 160): SampledEdgePoint[] {
  if (typeof document === "undefined") {
    return fallbackEdgePoints();
  }

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute(
    "viewBox",
    `0 0 ${ABRAXOS_DRAGON_VIEWBOX.width} ${ABRAXOS_DRAGON_VIEWBOX.height}`,
  );
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  svg.style.visibility = "hidden";
  svg.style.pointerEvents = "none";

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", ABRAXOS_DRAGON_OUTLINE);
  svg.appendChild(path);
  document.body.appendChild(svg);

  const points: SampledEdgePoint[] = [];
  const total = path.getTotalLength();

  for (let i = 0; i <= segments; i += 1) {
    const at = (total * i) / segments;
    const pt = path.getPointAtLength(at);
    const ahead = path.getPointAtLength(Math.min(total, at + 4));
    const tx = ahead.x - pt.x;
    const ty = ahead.y - pt.y;
    const len = Math.hypot(tx, ty) || 1;
    points.push({
      x: pt.x,
      y: pt.y,
      nx: -ty / len,
      ny: tx / len,
    });
  }

  document.body.removeChild(svg);
  return points;
}

function fallbackEdgePoints(): SampledEdgePoint[] {
  return [
    { x: 36, y: 640, nx: -0.7, ny: 0.7 },
    { x: 148, y: 320, nx: -0.5, ny: -0.9 },
    { x: 238, y: 218, nx: 0.6, ny: -0.8 },
    { x: 362, y: 54, nx: 0.9, ny: -0.4 },
    { x: 412, y: 98, nx: 1, ny: 0.1 },
    { x: 328, y: 158, nx: 0.3, ny: 0.95 },
  ];
}
