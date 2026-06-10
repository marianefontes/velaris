export interface CanvasSurface {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  dpr: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  bornAt: number;
  life: number;
  radius: number;
  alpha: number;
}

export function setupCanvas(canvas: HTMLCanvasElement): CanvasSurface | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  return { ctx, width, height, dpr };
}

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export function easeOutQuart(t: number) {
  return 1 - (1 - t) ** 4;
}

export function spawnTrailParticle(
  particles: Particle[],
  x: number,
  y: number,
  now: number,
  intensity = 1,
) {
  for (let i = 0; i < 2; i += 1) {
    particles.push({
      x: x + (Math.random() * 8 - 4),
      y: y + (Math.random() * 8 - 4),
      vx: (Math.random() * 0.06 - 0.04) * intensity,
      vy: (Math.random() * 0.04 - 0.02) * intensity,
      bornAt: now,
      life: 420 + Math.random() * 380,
      radius: 0.8 + Math.random() * 2.2,
      alpha: 0.35 + Math.random() * 0.45,
    });
  }
}

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[], now: number) {
  let alive = false;
  for (const grain of particles) {
    const age = (now - grain.bornAt) / grain.life;
    if (age >= 1) continue;
    alive = true;
    grain.x += grain.vx * 16;
    grain.y += grain.vy * 16;
    const fade = (1 - age) * grain.alpha;
    ctx.fillStyle = `rgba(222, 204, 253, ${fade.toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(grain.x, grain.y, grain.radius * (1 - age * 0.35), 0, Math.PI * 2);
    ctx.fill();
  }
  return alive;
}
