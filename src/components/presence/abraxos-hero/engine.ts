// Procedural Abraxos render engine — single rAF loop, no React per-frame updates.

import { ABRAXOS_VIEWBOX } from "./constants";
import { createGraphTail, GRAPH_COLORS } from "./graphTail";
import { createHeadLayer, type HeadParticle } from "./headLayer";
import { createParticleBody, type BodyParticle } from "./particleBody";
import { createStarField } from "./starField";
import { createWingGraphs, WING_COLOR } from "./wingGraph";

interface Layout {
  offsetX: number;
  offsetY: number;
  drawW: number;
  drawH: number;
  scale: number;
}

interface PointerState {
  x: number;
  y: number;
  active: boolean;
}

type Movable = {
  baseX: number;
  baseY: number;
  offsetX: number;
  offsetY: number;
  t?: number;
};

function computeLayout(containerW: number, containerH: number): Layout {
  const scale = Math.min(
    containerW / ABRAXOS_VIEWBOX.width,
    containerH / ABRAXOS_VIEWBOX.height,
  );
  const drawW = ABRAXOS_VIEWBOX.width * scale;
  const drawH = ABRAXOS_VIEWBOX.height * scale;
  return {
    offsetX: (containerW - drawW) * 0.5,
    offsetY: containerH - drawH,
    drawW,
    drawH,
    scale,
  };
}

function toView(
  layout: Layout,
  x: number,
  y: number,
): { x: number; y: number } {
  const sx = layout.drawW / ABRAXOS_VIEWBOX.width;
  const sy = layout.drawH / ABRAXOS_VIEWBOX.height;
  return {
    x: layout.offsetX + x * sx,
    y: layout.offsetY + y * sy,
  };
}

function fromView(layout: Layout, x: number, y: number): { x: number; y: number } {
  const sx = layout.drawW / ABRAXOS_VIEWBOX.width;
  const sy = layout.drawH / ABRAXOS_VIEWBOX.height;
  return {
    x: (x - layout.offsetX) / sx,
    y: (y - layout.offsetY) / sy,
  };
}

function applyMouseForce(
  particle: Movable,
  pointer: PointerState,
  layout: Layout,
  radius: number,
  strength: number,
) {
  if (!pointer.active) {
    particle.offsetX *= 0.92;
    particle.offsetY *= 0.92;
    return;
  }

  const pos = toView(layout, particle.baseX + particle.offsetX, particle.baseY + particle.offsetY);
  const dx = pointer.x - pos.x;
  const dy = pointer.y - pos.y;
  const dist = Math.hypot(dx, dy);

  if (dist < radius) {
    const force = (1 - dist / radius) * strength;
    particle.offsetX += (dx / (dist || 1)) * force * 0.08;
    particle.offsetY += (dy / (dist || 1)) * force * 0.08;
  } else {
    particle.offsetX *= 0.94;
    particle.offsetY *= 0.94;
  }
}

export class AbraxosHeroEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private layout: Layout = { offsetX: 0, offsetY: 0, drawW: 0, drawH: 0, scale: 1 };
  private width = 0;
  private height = 0;
  private dpr = 1;
  private rafId = 0;
  private running = false;
  private time = 0;
  private pointer: PointerState = { x: 0, y: 0, active: false };
  private resizeObserver: ResizeObserver | null = null;
  private staticMode = false;
  private hoverGlow = 0;

  private head = createHeadLayer();
  private body = createParticleBody();
  private graph = createGraphTail();
  private wings = createWingGraphs();
  private stars = createStarField();

  constructor(canvas: HTMLCanvasElement, options?: { static?: boolean }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.staticMode = options?.static ?? false;
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.resize();
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  setPointer(x: number, y: number, active: boolean) {
    this.pointer = { x, y, active };
    this.hoverGlow = active ? 1 : 0;
  }

  start() {
    if (this.running || this.staticMode) return;
    this.running = true;
    this.time = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  drawOnce() {
    this.time = performance.now();
    this.render();
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

    if (!this.staticMode && !this.running) {
      this.start();
    } else if (this.staticMode) {
      this.drawOnce();
    }
  }

  private tick = (now: number) => {
    if (!this.running) return;
    this.time = now;
    this.render();
    this.rafId = requestAnimationFrame(this.tick);
  };

  private render() {
    const { ctx, layout } = this;
    const breathe = Math.sin(this.time * 0.001) * 2.5;
    const breatheX = Math.sin(this.time * 0.0008 + 0.5) * 1.2;
    const glowBoost = 1 + this.hoverGlow * 0.12;

    ctx.clearRect(0, 0, this.width, this.height);
    ctx.globalCompositeOperation = "source-over";

    this.drawStarField(breathe);

    ctx.globalCompositeOperation = "lighter";

    this.drawHeadNebula(breathe, glowBoost);
    this.drawGraphEdges(glowBoost);
    this.drawBodyConnections(glowBoost);
    this.drawWings(breathe, glowBoost);
    this.drawBodyParticles(breathe, breatheX, glowBoost);
    this.drawGraphNodes(breathe, glowBoost);
    this.drawHeadParticles(breathe, breatheX, glowBoost);
    this.drawEyes(glowBoost);

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  }

  private drawStarField(breathe: number) {
    const { ctx, stars, layout } = this;
    ctx.globalCompositeOperation = "source-over";

    for (const star of stars) {
      const twinkle =
        star.baseAlpha *
        (0.55 + Math.sin(this.time * 0.001 + star.seed) * 0.45);
      const pos = toView(layout, star.x, star.y + breathe * 0.08);
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, star.radius * layout.scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawBodyConnections(glowBoost: number) {
    const { ctx, body, layout } = this;
    ctx.strokeStyle = "#c2a0fc";
    ctx.lineWidth = 0.6 * layout.scale;

    for (const { a, b } of body.connections) {
      const pa = body.particles[a];
      const pb = body.particles[b];
      const posA = toView(
        layout,
        pa.baseX + pa.offsetX,
        pa.baseY + pa.offsetY + Math.sin(this.time * 0.001 + pa.seed) * 0.6,
      );
      const posB = toView(
        layout,
        pb.baseX + pb.offsetX,
        pb.baseY + pb.offsetY + Math.sin(this.time * 0.001 + pb.seed) * 0.6,
      );
      const avgT = (pa.t + pb.t) * 0.5;
      ctx.globalAlpha = 0.12 * (1 - avgT) * glowBoost;
      ctx.beginPath();
      ctx.moveTo(posA.x, posA.y);
      ctx.lineTo(posB.x, posB.y);
      ctx.stroke();
    }
  }

  private drawGraphEdges(glowBoost: number) {
    const { ctx, graph, layout } = this;

    for (const edge of graph.edges) {
      const na = graph.nodes[edge.a];
      const nb = graph.nodes[edge.b];
      const dissolveA =
        0.45 + Math.sin(this.time * 0.0018 + na.seed) * 0.25;
      const dissolveB =
        0.45 + Math.sin(this.time * 0.0018 + nb.seed) * 0.25;

      const posA = toView(layout, na.baseX + na.offsetX, na.baseY + na.offsetY);
      const posB = toView(layout, nb.baseX + nb.offsetX, nb.baseY + nb.offsetY);

      ctx.strokeStyle = GRAPH_COLORS[edge.a % GRAPH_COLORS.length];
      ctx.lineWidth = 0.8 * layout.scale;
      ctx.globalAlpha = edge.alpha * dissolveA * dissolveB * glowBoost;
      ctx.beginPath();
      ctx.moveTo(posA.x, posA.y);
      ctx.lineTo(posB.x, posB.y);
      ctx.stroke();
    }
  }

  private drawWings(breathe: number, glowBoost: number) {
    const { ctx, wings, layout } = this;

    for (const wing of wings) {
      for (const edge of wing.edges) {
        const a = wing.nodes[edge.a];
        const b = wing.nodes[edge.b];
        const posA = toView(layout, a.x, a.y + breathe * 0.15);
        const posB = toView(layout, b.x, b.y + breathe * 0.15);
        ctx.strokeStyle = WING_COLOR;
        ctx.lineWidth = 0.7 * layout.scale;
        ctx.globalAlpha = 0.22 * glowBoost;
        ctx.beginPath();
        ctx.moveTo(posA.x, posA.y);
        ctx.lineTo(posB.x, posB.y);
        ctx.stroke();
      }

      for (const node of wing.nodes) {
        const pulse = 0.6 + Math.sin(this.time * 0.003 + node.seed) * 0.25;
        const pos = toView(layout, node.x, node.y + breathe * 0.15);
        ctx.fillStyle = WING_COLOR;
        ctx.globalAlpha = 0.35 * pulse * glowBoost;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, node.radius * layout.scale, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  private updateParticleForces(
    particles: Array<HeadParticle | BodyParticle>,
    radius: number,
    strength: number,
  ) {
    for (const p of particles) {
      applyMouseForce(p, this.pointer, this.layout, radius, strength);
    }
  }

  private drawBodyParticles(breathe: number, breatheX: number, glowBoost: number) {
    const { ctx, body, layout } = this;
    this.updateParticleForces(body.particles, 120 * layout.scale, 2.5);

    for (const p of body.particles) {
      const wobble = Math.sin(this.time * 0.001 + p.seed) * 1.2;
      const pos = toView(
        layout,
        p.baseX + p.offsetX + breatheX * (1 - p.t),
        p.baseY + p.offsetY + breathe * (1 - p.t * 0.5) + wobble,
      );
      const flicker =
        p.t > 0.5
          ? 0.55 + Math.sin(this.time * 0.002 + p.seed) * 0.45
          : 1;

      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * flicker * glowBoost;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, p.radius * layout.scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawGraphNodes(breathe: number, glowBoost: number) {
    const { ctx, graph, layout } = this;

    for (const node of graph.nodes) {
      applyMouseForce(node, this.pointer, this.layout, 100 * layout.scale, 2);

      const pulse = node.pulse
        ? 0.7 + Math.sin(this.time * 0.003 + node.phase) * 0.3
        : 0.55 + Math.sin(this.time * 0.002 + node.seed) * 0.2;

      const dissolve =
        0.4 + Math.sin(this.time * 0.0016 + node.seed) * 0.35;

      const pos = toView(
        layout,
        node.baseX + node.offsetX,
        node.baseY + node.offsetY + breathe * 0.2 * node.t,
      );

      ctx.fillStyle = GRAPH_COLORS[Math.floor(node.seed) % GRAPH_COLORS.length];
      ctx.globalAlpha = pulse * dissolve * glowBoost;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, node.radius * layout.scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawHeadParticles(breathe: number, breatheX: number, glowBoost: number) {
    const { ctx, head, layout } = this;
    this.updateParticleForces(head.particles, 140 * layout.scale, 1.8);

    for (const p of head.particles) {
      const pos = toView(
        layout,
        p.baseX + p.offsetX + breatheX * 0.4,
        p.baseY + p.offsetY + breathe * 0.35,
      );
      const shimmer = 0.85 + Math.sin(this.time * 0.0025 + p.seed) * 0.15;

      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * shimmer * glowBoost;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, p.radius * layout.scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawHeadNebula(breathe: number, glowBoost: number) {
    const { ctx, head, layout } = this;
    const pos = toView(layout, head.center.x, head.center.y + breathe * 0.25);
    const r = 72 * layout.scale;

    const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r);
    gradient.addColorStop(0, "rgba(84, 53, 137, 0.35)");
    gradient.addColorStop(0.45, "rgba(194, 160, 252, 0.12)");
    gradient.addColorStop(1, "rgba(194, 160, 252, 0)");

    ctx.globalAlpha = 0.85 * glowBoost;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawEyes(glowBoost: number) {
    const { ctx, head, layout } = this;

    for (const eye of head.eyes) {
      const pulse = 0.75 + Math.sin(this.time * 0.003 + eye.seed) * 0.25;
      const pos = toView(layout, eye.x, eye.y);
      const r = eye.radius * layout.scale * (1 + pulse * 0.15);

      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 2.2);
      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(0.35, "#deccfd");
      gradient.addColorStop(1, "rgba(222, 204, 253, 0)");

      ctx.globalAlpha = pulse * glowBoost;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, r * 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 0.95 * glowBoost;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, r * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /** Map container pointer to canvas coordinates. */
  mapPointer(clientX: number, clientY: number, bounds: DOMRect) {
    return {
      x: clientX - bounds.left,
      y: clientY - bounds.top,
    };
  }

  /** Expose view-space pointer for tests. */
  pointerInViewSpace(x: number, y: number) {
    return fromView(this.layout, x, y);
  }
}
