// AbraxosDragon: coordinate-space exports for Abraxos anatomy sampling.
// The Velaris home hero renders Abraxos procedurally via AbraxosHero (Canvas).
// This module retains the viewBox and outline path used by legacy sampling utilities.

export const ABRAXOS_DRAGON_VIEWBOX = { width: 512, height: 768 };

// Approximate outer silhouette of the render, used only as particle spawn anchors
// (clockwise from the snout). Not drawn — kept in sync with the canonical render.
export const ABRAXOS_DRAGON_OUTLINE =
  "M 352 118 " +
  "C 340 100 320 80 300 58 " +
  "C 285 70 260 75 235 95 " +
  "C 215 140 205 200 200 260 " +
  "C 195 320 205 380 235 430 " +
  "C 260 470 270 510 255 555 " +
  "C 240 595 220 630 235 665 " +
  "C 250 690 300 705 360 715 " +
  "L 470 725 " +
  "C 430 700 390 680 355 650 " +
  "C 330 620 325 585 340 545 " +
  "C 355 505 370 470 368 430 " +
  "C 365 390 345 350 320 310 " +
  "C 300 275 290 235 295 195 " +
  "C 300 160 320 135 352 118 Z";

interface AbraxosDragonProps {
  className?: string;
}

export function AbraxosDragon({ className }: AbraxosDragonProps) {
  return (
    <svg
      viewBox={`0 0 ${ABRAXOS_DRAGON_VIEWBOX.width} ${ABRAXOS_DRAGON_VIEWBOX.height}`}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      className={`mix-blend-screen ${className ?? ""}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <image
        href="/abraxos-manifestacao.png"
        x="0"
        y="0"
        width={ABRAXOS_DRAGON_VIEWBOX.width}
        height={ABRAXOS_DRAGON_VIEWBOX.height}
        preserveAspectRatio="xMidYMax meet"
      />
    </svg>
  );
}
