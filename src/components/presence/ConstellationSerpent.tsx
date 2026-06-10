// ConstellationSerpent: abstract luminous trail for micro-interactions (search focus).
// Not Abraxos. The home hero dragon lives in AbraxosDragon.tsx.

// Tail enters off-canvas bottom-left, body weaves upward, head rests at the
// top observing the content to its right — never the user.
export const SERPENT_SPINE =
  "M -30 668 C 90 640 170 612 196 548 C 222 484 150 452 138 396 " +
  "C 126 340 190 304 252 292 C 314 280 372 268 384 212 C 396 156 352 120 318 96";

const STARS: Array<[number, number, number]> = [
  [60, 648, 1.4], [140, 602, 1.1], [190, 556, 1.8], [208, 512, 1.2],
  [196, 470, 1.5], [160, 440, 1.0], [140, 404, 1.6], [136, 364, 1.1],
  [168, 322, 1.4], [220, 300, 1.2], [270, 288, 1.7], [330, 272, 1.2],
  [372, 244, 1.5], [386, 204, 1.9], [376, 160, 1.3], [344, 116, 1.5],
];

const SPARKLES: Array<[number, number]> = [
  [96, 600], [240, 420], [320, 330], [410, 180], [110, 480], [300, 140],
];

export const SERPENT_VIEWBOX = { width: 520, height: 700 };

export function ConstellationSerpent({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 700"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="serpent-body" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#c2a0fc" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#deccfd" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
        </linearGradient>
        <filter id="serpent-nebula" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="serpent-haze" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>

      {/* Nebula body: wide soft glow, then a tighter haze, then a chain of light */}
      <path d={SERPENT_SPINE} fill="none" stroke="url(#serpent-body)" strokeWidth="34" strokeLinecap="round" opacity="0.14" filter="url(#serpent-nebula)" />
      <path d={SERPENT_SPINE} fill="none" stroke="url(#serpent-body)" strokeWidth="11" strokeLinecap="round" opacity="0.3" filter="url(#serpent-haze)" />
      <path d={SERPENT_SPINE} fill="none" stroke="url(#serpent-body)" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="1 15" opacity="0.9" />

      {/* Dorsal fins: faint arcs leaving the spine */}
      <path d="M 196 548 Q 236 520 258 532" fill="none" stroke="#deccfd" strokeWidth="1" opacity="0.25" filter="url(#serpent-haze)" />
      <path d="M 138 396 Q 96 372 92 340" fill="none" stroke="#deccfd" strokeWidth="1" opacity="0.22" filter="url(#serpent-haze)" />
      <path d="M 252 292 Q 258 248 236 226" fill="none" stroke="#deccfd" strokeWidth="1" opacity="0.25" filter="url(#serpent-haze)" />

      {/* Head: crest, snout and a calm eye looking toward the content */}
      <circle cx="318" cy="96" r="7" fill="#deccfd" opacity="0.5" filter="url(#serpent-haze)" />
      <path d="M 318 96 Q 336 100 352 112" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      <path d="M 310 88 Q 296 70 290 56" fill="none" stroke="#deccfd" strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
      <path d="M 302 94 Q 284 82 274 72" fill="none" stroke="#deccfd" strokeWidth="1.1" strokeLinecap="round" opacity="0.45" />
      <path d="M 316 82 Q 308 62 310 48" fill="none" stroke="#deccfd" strokeWidth="1.1" strokeLinecap="round" opacity="0.45" />
      <circle cx="327" cy="99" r="1.9" fill="#ffffff" opacity="0.95" />

      {/* Constellation stars riding the body */}
      {STARS.map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#ffffff" opacity={0.35 + r * 0.25} />
      ))}
      {SPARKLES.map(([x, y]) => (
        <g key={`${x}-${y}`} stroke="#deccfd" strokeWidth="0.8" opacity="0.4">
          <line x1={x - 3.4} y1={y} x2={x + 3.4} y2={y} />
          <line x1={x} y1={y - 3.4} x2={x} y2={y + 3.4} />
        </g>
      ))}
    </svg>
  );
}

// Sub-second subconscious flash behind the interface (search focus).
// Opacity choreography lives in .presence-silhouette (index.css).
export function SerpentSilhouette() {
  return (
    <svg
      viewBox="0 0 520 700"
      aria-hidden="true"
      className="presence-silhouette absolute bottom-0 left-[-4%] h-[88%] w-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={SERPENT_SPINE}
        fill="none"
        stroke="#deccfd"
        strokeWidth="26"
        strokeLinecap="round"
        filter="url(#serpent-silhouette-blur)"
      />
      <defs>
        <filter id="serpent-silhouette-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>
    </svg>
  );
}
