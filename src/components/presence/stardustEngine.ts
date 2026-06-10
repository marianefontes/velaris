// stardustEngine powers the canvas particles behind the Abraxos presence layer.
// Pure TS + Canvas 2D, zero deps, transform-only motion, rAF capped at the
// browser's refresh. One instance per canvas; AppShell owns the global ambient
// layer, DragonHero/AskBeatriceBar own small local instances for bursts.
//
// Moods map to knowledge regions (see Velaris presence concept):
//   ambient        — sparse drifting stars (default / home)
//   constellation  — organic traces, links forming and dissolving (/components)
//   structured     — flows aligned to axes, longer-lived links (/foundations)
//   nodes          — luminous anchors, particles converging (/reasoning, /oracle)

export type PresenceMood = "ambient" | "constellation" | "structured" | "nodes";

export interface BurstOptions {
  count?: number;
  speed?: number;
  driftX?: number;
  driftY?: number;
  radius?: number;
  life?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
  baseAlpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
  sprite: number;
  transient: boolean;
  homeX?: number;
  homeY?: number;
}

interface AnchorNode {
  x: number;
  y: number;
  pulse: number;
}

const PALETTE = ["#ffffff", "#deccfd", "#c2a0fc"] as const;
const LINK_COLOR = "194, 160, 252";
const MAX_DT = 50;

const MOOD_DENSITY: Record<PresenceMood, number> = {
  ambient: 0.000045,
  constellation: 0.00007,
  structured: 0.00007,
  nodes: 0.00006,
};

const MOOD_LINK_DIST: Record<PresenceMood, number> = {
  ambient: 0,
  constellation: 110,
  structured: 135,
  nodes: 140,
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function makeSprite(color: string): HTMLCanvasElement {
  const size = 32;
  const sprite = document.createElement("canvas");
  sprite.width = size;
  sprite.height = size;
  const ctx = sprite.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.25, `${color}aa`);
  gradient.addColorStop(1, `${color}00`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return sprite;
}

export class StardustEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private sprites: HTMLCanvasElement[];
  private particles: Particle[] = [];
  private anchors: AnchorNode[] = [];
  private mood: PresenceMood;
  private ambientDensity: number;
  private width = 0;
  private height = 0;
  private dpr = 1;
  private rafId = 0;
  private lastTime = 0;
  private running = false;
  private scrollDrift = 0;
  private attractor: { x: number; y: number; until: number } | null = null;
  private resizeObserver: ResizeObserver | null = null;

  constructor(canvas: HTMLCanvasElement, options?: { mood?: PresenceMood; ambient?: boolean }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.sprites = PALETTE.map(makeSprite);
    this.mood = options?.mood ?? "ambient";
    this.ambientDensity = options?.ambient === false ? 0 : 1;

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.resize();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.particles = [];
  }

  setMood(mood: PresenceMood) {
    if (mood === this.mood) return;
    this.mood = mood;
    this.anchors = [];
    this.seedAnchors();
    this.settleParticleCount();
  }

  /** Hover dust: a few fragments detach near (x, y) and drift with the cursor. */
  spawnBurst(x: number, y: number, options?: BurstOptions) {
    const count = options?.count ?? 3;
    for (let i = 0; i < count; i += 1) {
      const angle = rand(0, Math.PI * 2);
      const speed = options?.speed ?? rand(0.004, 0.018);
      this.particles.push({
        x: x + rand(-4, 4),
        y: y + rand(-4, 4),
        vx: Math.cos(angle) * speed + (options?.driftX ?? 0),
        vy: Math.sin(angle) * speed + (options?.driftY ?? 0) - 0.006,
        radius: options?.radius ?? rand(0.6, 1.8),
        life: 0,
        maxLife: options?.life ?? rand(600, 1300),
        baseAlpha: rand(0.35, 0.85),
        twinklePhase: rand(0, Math.PI * 2),
        twinkleSpeed: rand(0.004, 0.01),
        sprite: Math.floor(rand(0, this.sprites.length)),
        transient: true,
      });
    }
  }

  /** Search focus: stars born on a ring slowly homing toward (x, y). */
  convergeBurst(x: number, y: number, ringRadius = 120, count = 14) {
    for (let i = 0; i < count; i += 1) {
      const angle = rand(0, Math.PI * 2);
      const distance = ringRadius * rand(0.6, 1.25);
      this.particles.push({
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        radius: rand(0.6, 1.6),
        life: 0,
        maxLife: rand(700, 1300),
        baseAlpha: rand(0.4, 0.85),
        twinklePhase: rand(0, Math.PI * 2),
        twinkleSpeed: rand(0.004, 0.012),
        sprite: Math.floor(rand(0, this.sprites.length)),
        transient: true,
        homeX: x + rand(-14, 14),
        homeY: y + rand(-8, 8),
      });
    }
  }

  /** Pull ambient stars gently toward a viewport point for a moment. */
  attractTo(x: number, y: number, durationMs = 900) {
    this.attractor = { x, y, until: performance.now() + durationMs };
  }

  /** Scroll makes the field breathe: constellations slowly reorganize. */
  scrollImpulse(deltaY: number) {
    this.scrollDrift = Math.max(-0.05, Math.min(0.05, this.scrollDrift - deltaY * 0.00008));
  }

  /** Single still frame for prefers-reduced-motion users. */
  renderStatic() {
    this.resize();
    this.settleParticleCount();
    this.particles.forEach((particle) => {
      particle.twinklePhase = rand(0, Math.PI * 2);
    });
    this.draw();
  }

  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = Math.round(rect.width * this.dpr);
    this.canvas.height = Math.round(rect.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.seedAnchors();
    this.settleParticleCount();
  }

  private targetCount() {
    return Math.round(this.width * this.height * MOOD_DENSITY[this.mood] * this.ambientDensity);
  }

  private settleParticleCount() {
    const ambient = this.particles.filter((particle) => !particle.transient);
    const target = this.targetCount();
    while (ambient.length < target) {
      const particle = this.makeAmbientParticle();
      ambient.push(particle);
      this.particles.push(particle);
    }
    if (ambient.length > target) {
      let excess = ambient.length - target;
      this.particles = this.particles.filter((particle) => {
        if (!particle.transient && excess > 0) {
          excess -= 1;
          return false;
        }
        return true;
      });
    }
  }

  private makeAmbientParticle(): Particle {
    return {
      x: rand(0, this.width),
      y: rand(0, this.height),
      vx: rand(-0.008, 0.008),
      vy: rand(-0.008, 0.008),
      radius: rand(0.5, 1.7),
      life: 0,
      maxLife: Infinity,
      baseAlpha: rand(0.12, 0.55),
      twinklePhase: rand(0, Math.PI * 2),
      twinkleSpeed: rand(0.0008, 0.0035),
      sprite: Math.floor(rand(0, this.sprites.length)),
      transient: false,
    };
  }

  private seedAnchors() {
    if (this.mood !== "nodes" || this.width === 0) return;
    if (this.anchors.length > 0) return;
    const count = 5;
    for (let i = 0; i < count; i += 1) {
      this.anchors.push({
        x: this.width * rand(0.12, 0.88),
        y: this.height * rand(0.15, 0.85),
        pulse: rand(0, Math.PI * 2),
      });
    }
  }

  private tick = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(now - this.lastTime, MAX_DT);
    this.lastTime = now;
    if (!document.hidden && dt > 0) {
      this.step(dt, now);
      this.draw();
    }
    this.rafId = requestAnimationFrame(this.tick);
  };

  private step(dt: number, now: number) {
    const attractorActive = this.attractor !== null && now < this.attractor.until;
    if (this.attractor && !attractorActive) this.attractor = null;
    this.scrollDrift *= Math.pow(0.994, dt);

    this.particles = this.particles.filter((particle) => {
      particle.life += dt;
      if (particle.life >= particle.maxLife) return false;

      // Organic wander; "structured" eases motion toward the nearest axis.
      particle.vx += rand(-0.0006, 0.0006) * dt * 0.06;
      particle.vy += rand(-0.0006, 0.0006) * dt * 0.06;
      if (this.mood === "structured" && !particle.transient) {
        const axisVx = Math.abs(particle.vx) >= Math.abs(particle.vy) ? particle.vx : 0;
        const axisVy = axisVx === 0 ? particle.vy : 0;
        particle.vx += (axisVx - particle.vx) * 0.002 * dt;
        particle.vy += (axisVy - particle.vy) * 0.002 * dt;
      }
      if (this.mood === "nodes" && !particle.transient && this.anchors.length > 0) {
        let nearest = this.anchors[0];
        let best = Infinity;
        for (const anchor of this.anchors) {
          const d = (anchor.x - particle.x) ** 2 + (anchor.y - particle.y) ** 2;
          if (d < best) {
            best = d;
            nearest = anchor;
          }
        }
        particle.vx += (nearest.x - particle.x) * 0.0000004 * dt;
        particle.vy += (nearest.y - particle.y) * 0.0000004 * dt;
      }
      if (attractorActive && this.attractor && !particle.transient) {
        particle.vx += (this.attractor.x - particle.x) * 0.0000045 * dt;
        particle.vy += (this.attractor.y - particle.y) * 0.0000045 * dt;
      }
      if (particle.homeX !== undefined && particle.homeY !== undefined) {
        particle.vx += (particle.homeX - particle.x) * 0.00001 * dt;
        particle.vy += (particle.homeY - particle.y) * 0.00001 * dt;
        particle.vx *= Math.pow(0.998, dt);
        particle.vy *= Math.pow(0.998, dt);
      }

      const speedCap = particle.transient ? 0.08 : 0.024;
      particle.vx = Math.max(-speedCap, Math.min(speedCap, particle.vx));
      particle.vy = Math.max(-speedCap, Math.min(speedCap, particle.vy));

      particle.x += particle.vx * dt;
      particle.y += (particle.vy + (particle.transient ? 0 : this.scrollDrift)) * dt;
      particle.twinklePhase += particle.twinkleSpeed * dt;

      if (!particle.transient) {
        if (particle.x < -8) particle.x = this.width + 8;
        if (particle.x > this.width + 8) particle.x = -8;
        if (particle.y < -8) particle.y = this.height + 8;
        if (particle.y > this.height + 8) particle.y = -8;
      }
      return true;
    });

    for (const anchor of this.anchors) {
      anchor.pulse += 0.0012 * dt;
    }
  }

  private draw() {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.width, this.height);

    const linkDist = MOOD_LINK_DIST[this.mood];
    if (linkDist > 0) {
      const ambient = this.particles.filter((particle) => !particle.transient);
      ctx.lineWidth = 0.7;
      for (let i = 0; i < ambient.length; i += 1) {
        for (let j = i + 1; j < ambient.length; j += 1) {
          const dx = ambient[i].x - ambient[j].x;
          const dy = ambient[i].y - ambient[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq > linkDist * linkDist) continue;
          const closeness = 1 - Math.sqrt(distSq) / linkDist;
          // Links breathe with both endpoints' twinkle so constellations dissolve.
          const breath =
            (0.5 + 0.5 * Math.sin(ambient[i].twinklePhase)) *
            (0.5 + 0.5 * Math.sin(ambient[j].twinklePhase));
          const alpha = closeness * breath * (this.mood === "structured" ? 0.16 : 0.11);
          if (alpha < 0.01) continue;
          ctx.strokeStyle = `rgba(${LINK_COLOR}, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(ambient[i].x, ambient[i].y);
          ctx.lineTo(ambient[j].x, ambient[j].y);
          ctx.stroke();
        }
      }
    }

    for (const anchor of this.anchors) {
      const glow = 0.18 + 0.1 * Math.sin(anchor.pulse);
      ctx.globalAlpha = glow;
      const sprite = this.sprites[2];
      const size = 26;
      ctx.drawImage(sprite, anchor.x - size / 2, anchor.y - size / 2, size, size);
    }

    for (const particle of this.particles) {
      const fade = particle.transient
        ? Math.sin(Math.min(particle.life / particle.maxLife, 1) * Math.PI)
        : 1;
      const twinkle = 0.55 + 0.45 * Math.sin(particle.twinklePhase);
      ctx.globalAlpha = Math.max(0, Math.min(1, particle.baseAlpha * twinkle * fade));
      const sprite = this.sprites[particle.sprite];
      const size = particle.radius * 7;
      ctx.drawImage(sprite, particle.x - size / 2, particle.y - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
  }
}
