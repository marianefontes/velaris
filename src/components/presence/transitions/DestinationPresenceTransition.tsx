// Presença no Destino — Abraxos pulses once near the page's strategic focus point.

import { useEffect, useRef, type MutableRefObject } from "react";
import { useLocation } from "react-router-dom";
import { waitForPresenceAnchor, type AnchorPoint } from "../presenceAnchors";
import { getTransitionForPath } from "../transitionRegistry";
import { usePrefersReducedMotion } from "../usePrefersReducedMotion";
import {
  drawParticles,
  easeOutQuart,
  setupCanvas,
  spawnTrailParticle,
  type Particle,
} from "./transitionCanvas";

const DURATION_MS = 730;
const INTENSITY = 0.78;

function drawStarburst(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number,
  alpha: number,
) {
  const a = alpha * INTENSITY;
  const rays = 8;
  const inner = 3.25 + progress * 8;
  const outer = 14 + progress * 30;

  const core = ctx.createRadialGradient(x, y, 0, x, y, inner * 2.6);
  core.addColorStop(0, `rgba(255, 255, 255, ${(a * 0.82).toFixed(3)})`);
  core.addColorStop(0.38, `rgba(222, 204, 253, ${(a * 0.58).toFixed(3)})`);
  core.addColorStop(0.72, `rgba(168, 85, 247, ${(a * 0.21).toFixed(3)})`);
  core.addColorStop(1, "rgba(124, 58, 237, 0)");
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(x, y, inner * 2.6, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < rays; i += 1) {
    const angle = (i / rays) * Math.PI * 2 + progress * 0.32;
    const rayAlpha = a * (0.44 + (i % 2) * 0.14);
    ctx.strokeStyle = `rgba(222, 204, 253, ${rayAlpha.toFixed(3)})`;
    ctx.lineWidth = i % 2 === 0 ? 1.5 : 0.9;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * inner, y + Math.sin(angle) * inner);
    ctx.lineTo(x + Math.cos(angle) * outer, y + Math.sin(angle) * outer);
    ctx.stroke();
  }

  ctx.strokeStyle = `rgba(255, 255, 255, ${(a * 0.2).toFixed(3)})`;
  ctx.lineWidth = 0.7;
  for (let i = 0; i < rays; i += 1) {
    const angle = (i / rays) * Math.PI * 2 + Math.PI / rays;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * (inner * 0.45), y + Math.sin(angle) * (inner * 0.45));
    ctx.lineTo(x + Math.cos(angle) * (outer * 0.68), y + Math.sin(angle) * (outer * 0.68));
    ctx.stroke();
  }
}

function runPresencePulse(
  canvas: HTMLCanvasElement,
  anchor: AnchorPoint,
  onDone: () => void,
  rafRef: MutableRefObject<number>,
) {
  const surface = setupCanvas(canvas);
  if (!surface) return;

  const { ctx, width, height } = surface;
  cancelAnimationFrame(rafRef.current);

  const startedAt = performance.now();
  const particles: Particle[] = [];

  const frame = (now: number) => {
    const elapsed = now - startedAt;
    const t = Math.min(elapsed / DURATION_MS, 1);
    ctx.clearRect(0, 0, width, height);

    if (t < 0.14) {
      const arrive = t / 0.14;
      ctx.fillStyle = `rgba(222, 204, 253, ${(arrive * 0.58 * INTENSITY).toFixed(3)})`;
      ctx.shadowColor = "rgba(168, 85, 247, 0.55)";
      ctx.shadowBlur = 12 * arrive;
      ctx.beginPath();
      ctx.arc(anchor.x, anchor.y, 2.5 + arrive * 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else if (t < 0.48) {
      const pulse = easeOutQuart((t - 0.14) / 0.34);
      const alpha = Math.sin(pulse * Math.PI);
      drawStarburst(ctx, anchor.x, anchor.y, pulse, alpha);
    } else {
      const dissolve = (t - 0.48) / 0.52;
      if (dissolve < 0.34) {
        for (let i = 0; i < 2; i += 1) {
          spawnTrailParticle(particles, anchor.x, anchor.y, now, 1.05);
        }
      }
      const mist = ctx.createRadialGradient(anchor.x, anchor.y, 0, anchor.x, anchor.y, 48 + dissolve * 32);
      mist.addColorStop(0, `rgba(222, 204, 253, ${((1 - dissolve) * 0.1 * INTENSITY).toFixed(3)})`);
      mist.addColorStop(1, "rgba(168, 85, 247, 0)");
      ctx.fillStyle = mist;
      ctx.beginPath();
      ctx.arc(anchor.x, anchor.y, 48 + dissolve * 32, 0, Math.PI * 2);
      ctx.fill();
    }

    const particlesAlive = drawParticles(ctx, particles, now);

    if (t < 1 || particlesAlive) {
      rafRef.current = requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, width, height);
      onDone();
    }
  };

  rafRef.current = requestAnimationFrame(frame);
}

export function DestinationPresenceTransition({ navTick }: { navTick: number }) {
  const { pathname, search } = useLocation();
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  const entry = getTransitionForPath(pathname);
  const active = Boolean(entry);

  useEffect(() => {
    if (!active || reduced || navTick === 0) return undefined;

    let cancelled = false;

    const start = async () => {
      const anchor = await waitForPresenceAnchor(pathname, search);
      if (cancelled || !anchor || !canvasRef.current) return;
      runPresencePulse(canvasRef.current, anchor, () => undefined, rafRef);
    };

    void start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, [pathname, search, reduced, active, navTick]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-abraxos-transition="destination-presence"
      className="pointer-events-none fixed inset-0 z-[60]"
    />
  );
}
