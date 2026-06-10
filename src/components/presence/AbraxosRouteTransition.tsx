// AbraxosRouteTransition — Presença no Destino on every primary surface.
// Strategic anchor placement is defined in presenceAnchors.ts.

import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { DestinationPresenceTransition } from "./transitions/DestinationPresenceTransition";
import { ReducedMotionFadeTransition } from "./transitions/ReducedMotionFadeTransition";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

function useNavigationTick() {
  const { pathname } = useLocation();
  const firstRender = useRef(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setTick((value) => value + 1);
  }, [pathname]);

  return tick;
}

export function AbraxosRouteTransition() {
  const reduced = usePrefersReducedMotion();
  const navTick = useNavigationTick();

  if (reduced) {
    return <ReducedMotionFadeTransition navTick={navTick} />;
  }

  return <DestinationPresenceTransition navTick={navTick} />;
}

export {
  getTransitionForPath,
  getPageEnterClass,
  ROUTE_TRANSITION_REGISTRY,
  type RouteTransitionEntry,
  type TransitionVariant,
} from "./transitionRegistry";

export {
  getAnchorStrategy,
  resolvePresenceAnchor,
  ROUTE_ANCHOR_REGISTRY,
  type RouteAnchorEntry,
} from "./presenceAnchors";
