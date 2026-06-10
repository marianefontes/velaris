// Canvas 2D particle engine for Abraxos hover dispersion.
// Particles spawn from silhouette edges near the cursor and drift with pointer direction.

import type { SampledEdgePoint } from "./abraxosPathSampling";
import { ABRAXOS_DRAGON_VIEWBOX } from "./AbraxosDragon";

const PALETTE = ["#deccfd", "#c2a0fc", "#b493ed", "#9a8fb8", "#8892a8"] as const;
const MAX_DT = 32;
const MAX_PARTICLES = 160;
const EMIT_INTERVAL_MS = 24;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
  color: string;
  peakAlpha: number;
  sprite: number;
}

interface Layout {
  offsetX: number;
  offsetY: number;
  drawW: number;
  drawH: number;
}

interface PointerState {
  x: number;
  y: number;
  dx: number;
  dy: number;
  active: boolean;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function computeLayout(containerW: number, containerH: number): Layout {
  const scale = Math.min(
    containerW / ABRAXOS_DRAGON_VIEWBOX.width,
    containerH / ABRAXOS_DRAGON_VIEWBOX.height,
  );
  const drawW = ABRAXOS_DRAGON_VIEWBOX.width * scale;
  const drawH = ABRAXOS_DRAGON_VIEWBOX.height * scale;
  // Matches the SVG's preserveAspectRatio="xMidYMax meet": centered, bottom-aligned.
  return {
    offsetX: (containerW - drawW) * 0.5,
    offsetY: containerH - drawH,
    drawW,
    drawH,
  };
}

function makeSprites(): HTMLCanvasElement[] {
  return PALETTE.map((color) => {
    const size = 36;
    const sprite = document.createElement("canvas");
    sprite.width = size;
    sprite.height = size;
    const ctx = sprite.getContext("2d")!;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.35, `${color}cc`);
    gradient.addColorStop(1, `${color}00`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return sprite;
  });
}

export class AbraxosParticleEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private sprites: HTMLCanvasElement[];
  private particles: Particle[] = [];
  private edgePoints: SampledEdgePoint[] = [];
  private mappedEdges: Array<SampledEdgePoint & { cx: number; cy: number }> = [];
  private layout: Layout = { offsetX: 0, offsetY: 0, drawW: 0, drawH: 0 };
  private pointer: PointerState = { x: 0, y: 0, dx: 0, dy: 0, active: false };
  private width = 0;
  private height = 0;
  private dpr = 1;
  private rafId = 0;
  private running = false;
  private lastTime = 0;
  private lastEmit = 0;
  private resizeObserver: ResizeObserver | null = null;

  constructor(canvas: HTMLCanvasElement, edgePoints: SampledEdgePoint[]) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.sprites = makeSprites();
    this.edgePoints = edgePoints;
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.resize();
  }

  destroy() {
    this.running = false;
    this.pointer.active = false;
    cancelAnimationFrame(this.rafId);
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.particles = [];
  }

  setEdgePoints(edgePoints: SampledEdgePoint[]) {
    this.edgePoints = edgePoints;
    this.remapEdges();
  }

  setPointer(x: number, y: number, active: boolean) {
    const dx = active ? x - this.pointer.x : 0;
    const dy = active ? y - this.pointer.y : 0;
    this.pointer = { x, y, dx, dy, active };

    if (active && !this.running) {
      this.start();
    }
    if (!active && this.particles.length === 0) {
      this.stop();
    }
  }

  private remapEdges() {
    const { offsetX, offsetY, drawW, drawH } = this.layout;
    const scaleX = drawW / ABRAXOS_DRAGON_VIEWBOX.width;
    const scaleY = drawH / ABRAXOS_DRAGON_VIEWBOX.height;
    this.mappedEdges = this.edgePoints.map((edge) => ({
      ...edge,
      cx: offsetX + edge.x * scaleX,
      cy: offsetY + edge.y * scaleY,
    }));
  }

  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = Math.round(rect.width * this.dpr);
    this.canvas.height = Math.round(rect.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.layout = computeLayout(this.width, this.height);
    this.remapEdges();
  }

  private start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.lastEmit = 0;
    this.rafId = requestAnimationFrame(this.tick);
  }

  private stop() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  private spawnNearCursor(now: number) {
    if (!this.pointer.active || this.mappedEdges.length === 0) return;
    if (now - this.lastEmit < EMIT_INTERVAL_MS) return;
    this.lastEmit = now;

    const { x: px, y: py, dx, dy } = this.pointer;
    const cursorLen = Math.hypot(dx, dy);
    const cursorNx = cursorLen > 0.5 ? dx / cursorLen : 0;
    const cursorNy = cursorLen > 0.5 ? dy / cursorLen : -0.35;

    const ranked = this.mappedEdges
      .map((edge) => ({
        edge,
        dist: Math.hypot(edge.cx - px, edge.cy - py),
      }))
      .sort((a, b) => a.dist - b.dist);

    const spawnPool = [
      ...ranked.slice(0, 5).map((item) => item.edge),
      ranked[Math.floor(Math.random() * Math.min(12, ranked.length))]?.edge,
      ranked[Math.floor(Math.random() * ranked.length)]?.edge,
    ].filter(Boolean) as Array<SampledEdgePoint & { cx: number; cy: number }>;

    for (let i = 0; i < 4; i += 1) {
      if (this.particles.length >= MAX_PARTICLES) break;
      const edge = spawnPool[Math.floor(Math.random() * spawnPool.length)];
      if (!edge) continue;

      const jitter = rand(-2.5, 2.5);
      const sx = edge.cx + edge.nx * jitter;
      const sy = edge.cy + edge.ny * jitter;
      const toX = px - sx;
      const toY = py - sy;
      const toLen = Math.hypot(toX, toY) || 1;
      const speed = rand(0.05, 0.12);
      const outward = rand(0.01, 0.03);

      this.particles.push({
        x: sx,
        y: sy,
        vx: (toX / toLen) * speed * 0.65 + cursorNx * speed * 0.35 + edge.nx * outward,
        vy: (toY / toLen) * speed * 0.65 + cursorNy * speed * 0.35 + edge.ny * outward - rand(0.005, 0.02),
        radius: rand(1.0, 2.6),
        life: 0,
        maxLife: rand(500, 900),
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        peakAlpha: rand(0.6, 0.95),
        sprite: Math.floor(Math.random() * this.sprites.length),
      });
    }
  }

  private tick = (now: number) => {
    if (!this.running) return;

    const dt = Math.min(now - this.lastTime, MAX_DT);
    this.lastTime = now;

    this.spawnNearCursor(now);

    this.particles = this.particles.filter((particle) => {
      particle.life += dt;
      if (particle.life >= particle.maxLife) return false;

      const progress = particle.life / particle.maxLife;
      const drift = 1 - easeOutCubic(progress);
      particle.x += particle.vx * dt * drift;
      particle.y += particle.vy * dt * drift;
      particle.vx *= Math.pow(0.985, dt);
      particle.vy *= Math.pow(0.985, dt);
      return true;
    });

    this.draw();

    if (!this.pointer.active && this.particles.length === 0) {
      this.stop();
      return;
    }

    this.rafId = requestAnimationFrame(this.tick);
  };

  private draw() {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.globalCompositeOperation = "lighter";

    for (const particle of this.particles) {
      const progress = particle.life / particle.maxLife;
      const fadeIn = Math.min(progress / 0.12, 1);
      const fadeOut = 1 - easeOutCubic(Math.max(0, (progress - 0.3) / 0.7));
      const alpha = fadeIn * fadeOut * particle.peakAlpha;

      ctx.globalAlpha = alpha;
      const sprite = this.sprites[particle.sprite];
      const size = particle.radius * 8;
      ctx.drawImage(sprite, particle.x - size / 2, particle.y - size / 2, size, size);
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }
}
