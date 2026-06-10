// Canonical coordinate space — matches AbraxosDragon viewBox (512×768).

export const ABRAXOS_VIEWBOX = { width: 512, height: 768 } as const;

export const PALETTE = {
  primary: "#DECCFD",
  secondary: "#C2A0FC",
  tertiary: "#C29FFF",
  nebula: "#543589",
  accent: "#B493ED",
  muted: "#9A8FB8",
} as const;

/** Central spine — sole source of truth for creature geometry. */
export const SPINE_CONTROL_POINTS = [
  { x: 352, y: 118 },
  { x: 300, y: 190 },
  { x: 235, y: 310 },
  { x: 300, y: 420 },
  { x: 255, y: 540 },
  { x: 330, y: 640 },
  { x: 400, y: 720 },
] as const;

export const MATERIAL_THRESHOLDS = {
  headEnd: 0.2,
  bodyEnd: 0.6,
  graphStart: 0.6,
} as const;
