// AbraxosInteractive: procedural Abraxos entity for the Velaris home hero.
// The creature is rendered entirely on Canvas — no static image assets.

import { AbraxosHero } from "./abraxos-hero/AbraxosHero";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export function AbraxosInteractive() {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      className="abraxos-interactive relative ml-auto h-full w-[88%] max-w-[480px] sm:w-[92%]"
      aria-hidden="true"
    >
      <AbraxosHero className="h-full w-full" static={reduced} />
    </div>
  );
}
