import { ABRAXOS_VIEWBOX } from "./constants";
import { mulberry32, randRange } from "./rng";

export interface Star {
  x: number;
  y: number;
  radius: number;
  seed: number;
  baseAlpha: number;
}

export function createStarField(count = 800): Star[] {
  const rng = mulberry32(0x57abf13d);
  const stars: Star[] = [];

  for (let i = 0; i < count; i += 1) {
    stars.push({
      x: randRange(rng, 0, ABRAXOS_VIEWBOX.width),
      y: randRange(rng, 0, ABRAXOS_VIEWBOX.height),
      radius: randRange(rng, 0.3, 1.1),
      seed: rng() * Math.PI * 2,
      baseAlpha: randRange(rng, 0.08, 0.22),
    });
  }

  return stars;
}
