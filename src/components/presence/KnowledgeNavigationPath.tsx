// KnowledgeNavigationPath: luminous trail connecting Velaris library entry points.
// Navigation only. This is not Abraxos.

export const NAVIGATION_PATH_VIEWBOX = { width: 140, height: 700 };

export const NAVIGATION_SPINE =
  "M 48 668 C 58 590 68 510 72 430 C 76 350 62 280 78 210 C 88 150 96 100 104 52";

const NAV_NODES = [
  { cy: 52, label: "0" },
  { cy: 210, label: "1" },
  { cy: 430, label: "2" },
  { cy: 668, label: "3" },
];

export function KnowledgeNavigationPath({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${NAVIGATION_PATH_VIEWBOX.width} ${NAVIGATION_PATH_VIEWBOX.height}`}
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="nav-path-gradient" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#c2a0fc" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#deccfd" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#deccfd" stopOpacity="0.7" />
        </linearGradient>
        <filter id="nav-path-glow" x="-80%" y="-10%" width="260%" height="120%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d={NAVIGATION_SPINE}
        fill="none"
        stroke="url(#nav-path-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="2 14"
        opacity="0.55"
        filter="url(#nav-path-glow)"
      />

      {NAV_NODES.map(({ cy, label }) => (
        <g key={label}>
          <circle cx="104" cy={cy} r="5" fill="none" stroke="#c2a0fc" strokeWidth="0.8" opacity="0.45" />
          <circle cx="104" cy={cy} r="1.8" fill="#deccfd" opacity="0.65" />
        </g>
      ))}
    </svg>
  );
}
