// AbraxosKnowledgeCore — orbital convergence visual for the Velaris home hero.
// Transparent nucleus render; library domains orbit as connected sources.

import { Link } from "react-router-dom";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export const ABRAXOS_KNOWLEDGE_CORE_SRC = "/abraxos-knowledge-core.png";

export interface KnowledgeOrbitNode {
  icon: React.ElementType;
  label: string;
  to: string;
}

const NODE_POSITIONS = [
  "top-0 left-1/2 -translate-x-1/2 -translate-y-1",
  "right-0 top-1/2 translate-x-1 -translate-y-1/2",
  "bottom-0 left-1/2 -translate-x-1/2 translate-y-1",
  "left-0 top-1/2 -translate-x-1 -translate-y-1/2",
] as const;

const CONNECTION_ANGLES = [270, 0, 90, 180];

export function AbraxosKnowledgeCore({ nodes }: { nodes: KnowledgeOrbitNode[] }) {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[420px] select-none sm:max-w-[480px]"
      aria-hidden="true"
      data-testid="abraxos-knowledge-core"
    >
      <div className="abraxos-core-atmosphere pointer-events-none absolute inset-[12%] rounded-full" />

      <div
        className={`abraxos-orbit-ring pointer-events-none absolute inset-[8%] rounded-full border border-primary/[0.12] ${reduced ? "" : "abraxos-orbit-spin-slow"}`}
      />
      <div
        className={`abraxos-orbit-ring pointer-events-none absolute inset-[18%] rounded-full border border-primary/[0.08] ${reduced ? "" : "abraxos-orbit-spin-reverse"}`}
      />
      <div
        className={`abraxos-orbit-ring pointer-events-none absolute inset-[28%] rounded-full border border-white/[0.06] ${reduced ? "" : "abraxos-orbit-spin-slow"}`}
        style={{ animationDuration: "140s" }}
      />

      {!reduced ? (
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 18 }, (_, index) => (
            <span
              key={index}
              className="abraxos-orbit-particle absolute h-[3px] w-[3px] rounded-full bg-primary/50"
              style={{
                left: `${14 + (index * 17) % 72}%`,
                top: `${10 + (index * 23) % 80}%`,
                animationDelay: `${index * 0.7}s`,
              }}
            />
          ))}
        </div>
      ) : null}

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        {nodes.map((node, index) => {
          const angle = (CONNECTION_ANGLES[index] * Math.PI) / 180;
          const radius = 38;
          const cx = 50;
          const cy = 50;
          const x2 = cx + radius * Math.cos(angle);
          const y2 = cy + radius * Math.sin(angle);

          return (
            <line
              key={node.label}
              x1={cx}
              y1={cy}
              x2={x2}
              y2={y2}
              className="abraxos-core-connection"
              data-orbit-index={index}
            />
          );
        })}
      </svg>

      <div className="absolute left-1/2 top-1/2 z-10 flex h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className={`relative h-full w-full ${reduced ? "" : "abraxos-core-pulse"}`}>
          <img
            src={ABRAXOS_KNOWLEDGE_CORE_SRC}
            alt=""
            draggable={false}
            className="relative h-full w-full object-contain object-center"
          />
        </div>
      </div>

      <ul className="absolute inset-0 z-20">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          const position = NODE_POSITIONS[index % NODE_POSITIONS.length];

          return (
            <li key={node.label} className={`absolute ${position}`}>
              <Link
                to={node.to}
                tabIndex={-1}
                aria-hidden="true"
                className="abraxos-orbit-node group flex flex-col items-center gap-1.5"
                data-orbit-index={index}
                onMouseEnter={(event) => {
                  const root = event.currentTarget.closest("[data-testid='abraxos-knowledge-core']");
                  root?.querySelectorAll(".abraxos-core-connection").forEach((line) => {
                    line.classList.toggle(
                      "abraxos-core-connection--active",
                      line.getAttribute("data-orbit-index") === String(index),
                    );
                  });
                }}
                onMouseLeave={(event) => {
                  const root = event.currentTarget.closest("[data-testid='abraxos-knowledge-core']");
                  root?.querySelectorAll(".abraxos-core-connection").forEach((line) => {
                    line.classList.remove("abraxos-core-connection--active");
                  });
                }}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 bg-surface-container-high/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_20px_rgba(194,160,252,0.08)] backdrop-blur-md transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_28px_rgba(194,160,252,0.18)] sm:h-12 sm:w-12">
                  <Icon aria-hidden="true" className="h-[18px] w-[18px] text-primary/90 transition-colors group-hover:text-primary" />
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-500 transition-colors group-hover:text-primary/80 sm:text-[10px]">
                  {node.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <span className="sr-only">Abraxos — núcleo de convergência do conhecimento Velaris</span>
    </div>
  );
}
