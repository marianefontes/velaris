// Reduced-motion fallback — soft fade only, no spatial movement. Max 150ms.

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getTransitionForPath } from "../transitionRegistry";
import { usePrefersReducedMotion } from "../usePrefersReducedMotion";

const FADE_MS = 150;

export function ReducedMotionFadeTransition({ navTick }: { navTick: number }) {
  const { pathname } = useLocation();
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(false);

  const entry = getTransitionForPath(pathname);
  const hasExperiment = Boolean(entry);

  useEffect(() => {
    if (!reduced || !hasExperiment || navTick === 0) return undefined;

    setActive(true);
    const timer = window.setTimeout(() => setActive(false), FADE_MS);
    return () => {
      window.clearTimeout(timer);
      setActive(false);
    };
  }, [pathname, reduced, hasExperiment, navTick]);

  if (!reduced || !hasExperiment || !active) return null;

  return (
    <div
      aria-hidden="true"
      data-abraxos-transition="reduced-fade"
      className="abraxos-reduced-fade pointer-events-none fixed inset-0 z-[60]"
    />
  );
}
