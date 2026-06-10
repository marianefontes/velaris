// BeatricePresence is the internal global ambient layer for Abraxos. A fixed, pointer-transparent
// starfield behind every primary surface: each route is a different region of
// knowledge, so the field changes character with the path. Scroll makes the
// constellations reorganize; the search bar can ask the field to converge.

import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { SerpentSilhouette } from "./ConstellationSerpent";
import { onPresence } from "./presenceBus";
import { StardustEngine, type PresenceMood } from "./stardustEngine";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const SILHOUETTE_COOLDOWN_MS = 8000;

function moodForPath(pathname: string): PresenceMood {
  if (pathname.startsWith("/components")) return "constellation";
  if (pathname.startsWith("/foundations")) return "structured";
  if (
    pathname.startsWith("/reasoning") ||
    pathname.startsWith("/oracle") ||
    pathname.startsWith("/evaluation")
  ) {
    return "nodes";
  }
  return "ambient";
}

export function BeatricePresence() {
  const { pathname } = useLocation();
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<StardustEngine | null>(null);
  const [silhouetteTick, setSilhouetteTick] = useState(0);
  const lastSilhouetteRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new StardustEngine(canvas, { mood: moodForPath(window.location.pathname) });
    engineRef.current = engine;

    if (reduced) {
      engine.renderStatic();
      return () => {
        engineRef.current = null;
        engine.destroy();
      };
    }

    engine.start();

    let lastScrollY = window.scrollY;
    const onScroll = () => {
      engine.scrollImpulse(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const offConverge = onPresence("converge", ({ x, y }) => {
      engine.attractTo(x, y, 900);
      engine.convergeBurst(x, y, 150, 10);
    });
    const offSilhouette = onPresence("silhouette", () => {
      const now = Date.now();
      if (now - lastSilhouetteRef.current < SILHOUETTE_COOLDOWN_MS) return;
      lastSilhouetteRef.current = now;
      setSilhouetteTick((tick) => tick + 1);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      offConverge();
      offSilhouette();
      engineRef.current = null;
      engine.destroy();
    };
  }, [reduced]);

  useEffect(() => {
    engineRef.current?.setMood(moodForPath(pathname));
  }, [pathname]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <canvas ref={canvasRef} className="h-full w-full" />
      {silhouetteTick > 0 ? <SerpentSilhouette key={silhouetteTick} /> : null}
    </div>
  );
}
