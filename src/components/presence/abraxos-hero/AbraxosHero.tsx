// AbraxosHero — procedural Canvas entity for the Velaris home hero.
// Replaces the static manifestation render with a live knowledge-graph serpent.

import { memo, useEffect, useRef, useState } from "react";
import { AbraxosHeroEngine } from "./engine";

export interface AbraxosHeroProps {
  className?: string;
  static?: boolean;
}

export const AbraxosHero = memo(function AbraxosHero({
  className,
  static: staticRender = false,
}: AbraxosHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<AbraxosHeroEngine | null>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const engine = new AbraxosHeroEngine(canvas, { static: staticRender });
    engineRef.current = engine;

    if (staticRender) {
      engine.drawOnce();
    } else {
      engine.start();
    }

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [staticRender]);

  const mapPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current;
    if (!root) return { x: 0, y: 0 };
    const bounds = root.getBoundingClientRect();
    return {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
  };

  const handlePointerEnter = (event: React.PointerEvent<HTMLDivElement>) => {
    setHovering(true);
    const { x, y } = mapPointer(event);
    engineRef.current?.setPointer(x, y, true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const { x, y } = mapPointer(event);
    engineRef.current?.setPointer(x, y, true);
  };

  const handlePointerLeave = () => {
    setHovering(false);
    engineRef.current?.setPointer(0, 0, false);
  };

  const hoverClass =
    hovering && !staticRender
      ? "brightness-[1.06] saturate-[1.04]"
      : hovering && staticRender
        ? "brightness-[1.08] saturate-[1.05]"
        : "";

  return (
    <div
      ref={rootRef}
      className={`relative h-full w-full touch-none ${className ?? ""}`}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className={`pointer-events-none absolute inset-0 h-full w-full mix-blend-screen transition-[filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${hoverClass}`}
        aria-hidden="true"
      />
    </div>
  );
});
