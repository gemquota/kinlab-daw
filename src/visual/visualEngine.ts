/**
 * Generative Visual Engine — 10 truly distinct audiovisual modes.
 * Each mode uses a fundamentally different rendering algorithm.
 */

import type { VisualMode, VisualParams } from "./visualParams";

/* ─── Types ─── */

export interface VisualState {
  width: number; height: number; time: number;
  beat: number; bass: number; mid: number; treble: number; rms: number;
  mouseX: number; mouseY: number; mouseDown: boolean; hueShift: number;
}

/* ─── Shared particle system (used by nebula/network/kaleidoscope) ─── */

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number;
  hue: number; sat: number; alpha: number;
}

let particles: Particle[] = [];

function spawnParticle(state: VisualState, params: VisualParams): Particle {
  const cx = state.width / 2, cy = state.height / 2;
  const angle = Math.random() * Math.PI * 2;
  const dist = Math.random() * Math.min(state.width, state.height) * 0.45;
  return {
    x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist,
    vx: (Math.random() - 0.5) * 3 * params.particleSpeed,
    vy: (Math.random() - 0.5) * 3 * params.particleSpeed,
    life: 0, maxLife: 80 + Math.random() * 180,
    size: 1 + Math.random() * params.particleSize,
    hue: (state.hueShift + Math.random() * 80) % 360,
    sat: 60 + Math.random() * 40, alpha: 0.2 + Math.random() * 0.6,
  };
}

function updateParticles(state: VisualState, params: VisualParams): void {
  const target = Math.floor(params.particleCount * (0.2 + state.rms * 0.8));
  while (particles.length < target) particles.push(spawnParticle(state, params));
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]!;
    p.life++;
    if (state.beat > 0.3) {
      const dx = p.x - state.width / 2, dy = p.y - state.height / 2;
      const d = Math.sqrt(dx * dx + dy * dy) + 1;
      const f = state.beat * params.beatForce / d;
      p.vx += (dx / d) * f; p.vy += (dy / d) * f;
    }
    if (state.mouseX > 0 || state.mouseY > 0) {
      const dx = state.mouseX - p.x, dy = state.mouseY - p.y;
      const d = Math.sqrt(dx * dx + dy * dy) + 1;
      const f = state.mouseDown ? params.mouseForce * 6 : params.mouseForce;
      p.vx += (dx / d) * f; p.vy += (dy / d) * f;
    }
    p.vx += Math.sin(state.time * 4 + p.x * 0.008) * state.bass * 0.8;
    p.vy += Math.cos(state.time * 4 + p.y * 0.008) * state.bass * 0.8;
    p.vx *= params.friction; p.vy *= params.friction;
    p.x += p.vx; p.y += p.vy;
    if (p.x < -20) p.x = state.width + 20;
    if (p.x > state.width + 20) p.x = -20;
    if (p.y < -20) p.y = state.height + 20;
    if (p.y > state.height + 20) p.y = -20;
    if (p.life > p.maxLife) particles.splice(i, 1);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   1. NEBULA — Pure radial gradient clouds + noise grain (NO particles)
   ═══════════════════════════════════════════════════════════════════ */

function drawNebula(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height, cx = W / 2, cy = H / 2;
  const t = state.time * params.speed;

  // Deep space gradient
  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7);
  bg.addColorStop(0, `hsla(${state.hueShift + 240}, 25%, 6%, 1)`);
  bg.addColorStop(0.5, `hsla(${state.hueShift + 260}, 20%, 3%, 1)`);
  bg.addColorStop(1, `hsla(${state.hueShift + 280}, 15%, 1%, 1)`);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Orbital nebula clouds — NO particles, pure gradient blobs
  const count = Math.floor(params.nebulaClouds);
  for (let i = 0; i < count; i++) {
    const angle = t * 0.08 + (i * Math.PI * 2) / count;
    const dist = 120 + state.bass * 100 + i * 50;
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    const size = (100 + state.mid * 80 + i * 25) * params.intensity;

    const g = ctx.createRadialGradient(x, y, 0, x, y, size);
    g.addColorStop(0, `hsla(${(state.hueShift + i * 35) % 360}, 55%, ${15 + state.rms * 20}%, ${0.12 + state.rms * 0.08})`);
    g.addColorStop(0.5, `hsla(${(state.hueShift + i * 35 + 15) % 360}, 40%, ${8 + state.rms * 10}%, ${0.04 + state.rms * 0.04})`);
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
  }

  // Star field — tiny static dots
  for (let i = 0; i < 60; i++) {
    const sx = ((i * 7919 + 1234) % W);
    const sy = ((i * 6271 + 5678) % H);
    const flicker = 0.2 + Math.sin(t * 3 + i) * 0.15;
    ctx.fillStyle = `hsla(${(state.hueShift + i * 17) % 360}, 30%, 80%, ${flicker})`;
    ctx.fillRect(sx, sy, 1, 1);
  }

  // Noise grain
  if (state.rms > 0.1 && params.nebulaNoise > 0) {
    ctx.globalAlpha = state.rms * params.nebulaNoise;
    const imgData = ctx.getImageData(0, 0, W, H);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 16) {
      const n = (Math.random() - 0.5) * 30 * state.rms;
      d[i] = Math.max(0, Math.min(255, d[i]! + n));
      d[i + 1] = Math.max(0, Math.min(255, d[i + 1]! + n));
      d[i + 2] = Math.max(0, Math.min(255, d[i + 2]! + n));
    }
    ctx.putImageData(imgData, 0, 0);
    ctx.globalAlpha = 1;
  }

  // Beat flash
  if (state.beat > 0.6) {
    ctx.fillStyle = `hsla(${state.hueShift}, 40%, 50%, ${(state.beat - 0.6) * 0.15 * params.intensity})`;
    ctx.fillRect(0, 0, W, H);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   2. NETWORK — Connected particle graph with distance-based links
   ═══════════════════════════════════════════════════════════════════ */

function drawNetwork(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;
  ctx.fillStyle = `hsla(${state.hueShift + 220}, 15%, 3%, ${params.trailFade})`;
  ctx.fillRect(0, 0, W, H);
  updateParticles(state, params);

  const linkDist = params.networkLinkDist + state.rms * 40;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < Math.min(i + 30, particles.length); j++) {
      const a = particles[i]!, b = particles[j]!;
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < linkDist) {
        const alpha = (1 - dist / linkDist) * 0.15 * (0.5 + state.rms * 0.5);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `hsla(${(a.hue + state.hueShift) % 360}, 60%, 50%, ${alpha})`;
        ctx.lineWidth = params.networkLineWidth + state.beat * 0.5;
        ctx.stroke();
      }
    }
  }
  for (const p of particles) {
    const lr = p.life / p.maxLife;
    const alpha = p.alpha * Math.min(1, p.life / 10) * Math.max(0, 1 - (lr - 0.7) / 0.3) * (0.5 + state.rms * 0.5);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * (1 + state.beat * 0.6), 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${(p.hue + state.hueShift) % 360}, ${p.sat}%, ${50 + state.rms * 20}%, ${alpha})`;
    ctx.fill();
  }
}

/* ═══════════════════════════════════════════════════════════════════
   3. KALEIDOSCOPE — Symmetric particle mandala
   ═══════════════════════════════════════════════════════════════════ */

function drawKaleidoscope(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;
  const cx = W / 2, cy = H / 2;
  const seg = Math.floor(params.kaleidoSegments);
  const step = (Math.PI * 2) / seg;

  ctx.fillStyle = `hsla(${state.hueShift + 220}, 12%, 3%, 0.05)`;
  ctx.fillRect(0, 0, W, H);
  updateParticles(state, params);

  for (const p of particles) {
    const dx = p.x - cx, dy = p.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    for (let s = 0; s < seg; s++) {
      const sa = angle + s * step + state.time * params.kaleidoSpin * 0.1;
      const sx = cx + Math.cos(sa) * dist, sy = cy + Math.sin(sa) * dist;
      const lr = p.life / p.maxLife;
      const alpha = p.alpha * (1 - lr) * 0.5;
      ctx.beginPath();
      ctx.arc(sx, sy, p.size * (1 + state.beat * 2), 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${(p.hue + s * (360 / seg) + state.hueShift) % 360}, 65%, 50%, ${alpha})`;
      ctx.fill();
    }
  }
  const rings = Math.floor(params.kaleidoRings);
  for (let r = 0; r < rings; r++) {
    const radius = 25 + r * 35 + state.rms * 50;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${(state.hueShift + r * 25) % 360}, 55%, 45%, ${0.18 - r * 0.025})`;
    ctx.lineWidth = 0.8 + state.beat * 2.5;
    ctx.stroke();
  }
}

/* ═══════════════════════════════════════════════════════════════════
   4. OSCILLOSCOPE — Real-time XY oscilloscope traces
   ═══════════════════════════════════════════════════════════════════ */

interface OscTrace { points: number[][]; }

let oscTraces: OscTrace[] = [];

function drawOscilloscope(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;
  const cx = W / 2, cy = H / 2;
  const t = state.time * params.speed;
  const radius = Math.min(W, H) * params.oscScale;

  // Dark background with slight phosphor glow
  ctx.fillStyle = "rgba(0, 3, 0, 0.06)";
  ctx.fillRect(0, 0, W, H);

  // Grid lines (oscilloscope style)
  ctx.strokeStyle = "rgba(0, 255, 0, 0.04)";
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 10; i++) {
    const x = (i / 9) * W;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    const y = (i / 9) * H;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Initialize traces
  while (oscTraces.length < params.oscLayers) {
    oscTraces.push({ points: [] });
  }

  // Generate new points from audio
  const layers = Math.floor(params.oscLayers);
  for (let l = 0; l < layers; l++) {
    const trace = oscTraces[l]!;
    const freq1 = 3 + l * 2 + state.bass * 4;
    const freq2 = 2 + l * 1.5 + state.mid * 3;
    const phase = t * (0.5 + l * 0.3);

    // XY mode: x = sin(freq1*t), y = cos(freq2*t+phase)
    const x = cx + Math.sin(t * freq1 + phase) * radius * (1 + state.rms * 0.3);
    const y = cy + Math.cos(t * freq2 + phase * 0.7) * radius * (1 + state.beat * 0.2);

    trace.points.push([x, y]);
    if (trace.points.length > params.oscTraceLength) trace.points.shift();
  }

  // Draw traces
  for (let l = 0; l < layers; l++) {
    const trace = oscTraces[l]!;
    if (trace.points.length < 2) continue;
    const hue = (120 + l * 40) % 360; // green-ish phosphor tones

    for (let i = 1; i < trace.points.length; i++) {
      const alpha = (i / trace.points.length) * 0.8;
      ctx.beginPath();
      ctx.moveTo(trace.points[i - 1]![0]!, trace.points[i - 1]![1]!);
      ctx.lineTo(trace.points[i]![0]!, trace.points[i]![1]!);
      ctx.strokeStyle = `hsla(${hue}, 80%, ${40 + state.rms * 30}%, ${alpha})`;
      ctx.lineWidth = 1.5 + state.beat * 0.5;
      ctx.stroke();
    }
  }

  // Center crosshair
  ctx.strokeStyle = "rgba(0, 255, 0, 0.08)";
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(cx - 20, cy); ctx.lineTo(cx + 20, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy - 20); ctx.lineTo(cx, cy + 20); ctx.stroke();
}

/* ═══════════════════════════════════════════════════════════════════
   5. TERRAIN — Retro 3D scanline wireframe landscape
   ═══════════════════════════════════════════════════════════════════ */

function drawTerrain(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;
  const t = state.time * params.speed;

  ctx.fillStyle = `hsla(${state.hueShift + 240}, 10%, 2%, 1)`;
  ctx.fillRect(0, 0, W, H);

  const layers = Math.floor(params.terrainLayers);
  const horizon = H * params.terrainPerspective;

  for (let i = 0; i < layers; i++) {
    const tt = i / layers;
    const y = horizon + (H - horizon) * tt;
    const depth = 1 - tt;

    ctx.beginPath();
    for (let x = 0; x < W; x += 3) {
      const nx = x / W;
      const wave = Math.sin(nx * 8 - t * 3) * depth * 30 * (1 + state.bass * 2) * params.terrainHeight;
      const wave2 = Math.cos(nx * 12 + t * 2) * depth * 15 * state.mid * params.terrainHeight;
      const height = depth * 60 * (1 + state.rms * params.intensity);
      const py = y - height + wave + wave2;
      if (x === 0) ctx.moveTo(x, py); else ctx.lineTo(x, py);
    }

    const hue = (state.hueShift + i * 6) % 360;
    ctx.strokeStyle = `hsla(${hue}, 70%, ${30 + depth * 30}%, ${0.3 * depth + state.rms * 0.2})`;
    ctx.lineWidth = 0.8 + depth * 0.5;
    ctx.stroke();

    if (i % 3 === 0) {
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
      ctx.fillStyle = `hsla(${hue}, 50%, ${10 + depth * 15}%, ${0.03 * depth})`;
      ctx.fill();
    }
  }

  if (params.terrainScanlines) {
    for (let y = 0; y < H; y += 3) {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, y, W, 1);
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════
   6. PLASMA — Classic demoscene plasma (sin/cos color math)
   ═══════════════════════════════════════════════════════════════════ */

function drawPlasma(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;
  const t = state.time * params.speed * params.plasmaSpeed;
  const scale = params.plasmaScale;
  const layers = Math.floor(params.plasmaLayers);

  // Use ImageData for pixel-level plasma
  const imgData = ctx.getImageData(0, 0, W, H);
  const d = imgData.data;
  const step = 4; // Skip pixels for performance

  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      const nx = (x / W) * scale;
      const ny = (y / H) * scale;

      // Combine multiple sine waves for plasma effect
      let v = 0;
      for (let l = 0; l < layers; l++) {
        const freq = 1 + l * 0.5;
        v += Math.sin(nx * freq * 6 + t * (0.5 + l * 0.2));
        v += Math.cos(ny * freq * 4 + t * (0.3 + l * 0.15));
        v += Math.sin(Math.sqrt((nx - 0.5) * (nx - 0.5) + (ny - 0.5) * (ny - 0.5)) * 8 + t);
      }
      v = (v + layers * 3) / (layers * 6); // Normalize to 0..1

      // Audio modulation
      v += state.bass * 0.2 * Math.sin(nx * 10 + t);
      v += state.mid * 0.15 * Math.cos(ny * 8 + t * 1.3);
      v = Math.max(0, Math.min(1, v));

      // Color mapping based on palette
      let r: number, g: number, b: number;
      const palette = Math.floor(params.plasmaPalette);
      if (palette === 0) {
        // Rainbow
        r = Math.floor(v * 255);
        g = Math.floor(Math.sin(v * Math.PI * 2 + 2.094) * 127 + 128);
        b = Math.floor(Math.sin(v * Math.PI * 2 + 4.189) * 127 + 128);
      } else if (palette === 1) {
        // Fire
        r = Math.floor(Math.min(255, v * 400));
        g = Math.floor(Math.min(255, v * 200 * (1 - v)));
        b = Math.floor(v * 30);
      } else if (palette === 2) {
        // Ice
        r = Math.floor(v * 40);
        g = Math.floor(v * 180 + 50);
        b = Math.floor(Math.min(255, v * 350));
      } else {
        // Monochrome green (oscilloscope)
        r = 0;
        g = Math.floor(v * 255);
        b = Math.floor(v * 40);
      }

      // Fill step×step block
      for (let dy = 0; dy < step && y + dy < H; dy++) {
        for (let dx = 0; dx < step && x + dx < W; dx++) {
          const idx = ((y + dy) * W + (x + dx)) * 4;
          d[idx] = r;
          d[idx + 1] = g;
          d[idx + 2] = b;
          d[idx + 3] = 255;
        }
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // Beat flash overlay
  if (state.beat > 0.5) {
    ctx.fillStyle = `hsla(${state.hueShift + 60}, 80%, 50%, ${(state.beat - 0.5) * 0.1})`;
    ctx.fillRect(0, 0, W, H);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   7. FLUID — Simplex noise flow field with particle traces
   ═══════════════════════════════════════════════════════════════════ */

function noise2D(x: number, y: number): number {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const hash = (a: number, b: number) => {
    let h = ((a * 2654435761 + b * 2246822519) >>> 0) & 0x7fffffff;
    h = ((h >> 13) ^ h) * 1274126177;
    return ((h >> 16) ^ h) & 0x7fffffff;
  };
  const v00 = (hash(ix, iy) & 0xffff) / 0xffff;
  const v10 = (hash(ix + 1, iy) & 0xffff) / 0xffff;
  const v01 = (hash(ix, iy + 1) & 0xffff) / 0xffff;
  const v11 = (hash(ix + 1, iy + 1) & 0xffff) / 0xffff;
  return v00 * (1 - sx) * (1 - sy) + v10 * sx * (1 - sy) + v01 * (1 - sx) * sy + v11 * sx * sy;
}

function fbm(x: number, y: number, params: VisualParams): number {
  let value = 0, amp = 1, freq = 1, max = 0;
  for (let i = 0; i < params.fluidOctaves; i++) {
    value += noise2D(x * freq, y * freq) * amp;
    max += amp;
    amp *= params.fluidPersistence;
    freq *= params.fluidLacunarity;
  }
  return value / max;
}

interface FluidDot { x: number; y: number; vx: number; vy: number; hue: number; life: number; }

let fluidDots: FluidDot[] = [];

function drawFluid(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;
  const t = state.time * params.speed * 0.3;

  ctx.fillStyle = `hsla(${state.hueShift + 220}, 15%, 2%, ${params.trailFade || 0.05})`;
  ctx.fillRect(0, 0, W, H);

  // Spawn dots
  while (fluidDots.length < 800) {
    fluidDots.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: 0, vy: 0,
      hue: Math.random() * 360,
      life: Math.random() * 200,
    });
  }

  // Update and draw dots — each follows the noise flow field
  for (let i = fluidDots.length - 1; i >= 0; i--) {
    const dot = fluidDots[i]!;
    dot.life++;

    const nx = dot.x * params.fluidScale;
    const ny = dot.y * params.fluidScale;
    const v = fbm(nx + t, ny + t * 0.7, params);
    const angle = v * Math.PI * 4 + state.time * 0.5;

    dot.vx = Math.cos(angle) * 2 * params.intensity;
    dot.vy = Math.sin(angle) * 2 * params.intensity;
    dot.x += dot.vx;
    dot.y += dot.vy;

    // Wrap
    if (dot.x < 0) dot.x = W;
    if (dot.x > W) dot.x = 0;
    if (dot.y < 0) dot.y = H;
    if (dot.y > H) dot.y = 0;

    if (dot.life > 200) { fluidDots.splice(i, 1); continue; }

    const alpha = Math.min(1, dot.life / 20) * Math.max(0, 1 - dot.life / 200) * (0.3 + v * 0.5);
    const hue = (state.hueShift + v * 360 + dot.hue) % 360;
    ctx.fillStyle = `hsla(${hue}, 60%, ${30 + v * 30}%, ${alpha})`;
    ctx.fillRect(dot.x, dot.y, 1.5, 1.5);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   8. ORBS — Gravitational physics orbs with glow
   ═══════════════════════════════════════════════════════════════════ */

interface Orb { x: number; y: number; vx: number; vy: number; size: number; baseSize: number; hue: number; }
let orbs: Orb[] = [];

function initOrbs(state: VisualState, params: VisualParams): void {
  orbs = [];
  for (let i = 0; i < params.orbCount; i++) {
    orbs.push({
      x: Math.random() * state.width, y: Math.random() * state.height,
      vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
      size: params.orbMinSize + Math.random() * (params.orbMaxSize - params.orbMinSize),
      baseSize: params.orbMinSize + Math.random() * (params.orbMaxSize - params.orbMinSize),
      hue: Math.random() * 360,
    });
  }
}

function drawOrbs(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;
  ctx.fillStyle = `rgba(0, 0, 0, ${params.orbTrail})`;
  ctx.fillRect(0, 0, W, H);
  if (orbs.length !== params.orbCount) initOrbs(state, params);

  const cx = state.mouseX || W / 2, cy = state.mouseY || H / 2;
  for (const orb of orbs) {
    const dx = cx - orb.x, dy = cy - orb.y;
    const dist = Math.sqrt(dx * dx + dy * dy) + 1;
    orb.vx += (dx / dist) * params.orbGravity;
    orb.vy += (dy / dist) * params.orbGravity;
    orb.size = orb.baseSize * (1 + state.beat * 0.5 * params.intensity);
    orb.hue = (orb.hue + state.rms * 2) % 360;
    orb.vx *= 0.995; orb.vy *= 0.995;
    orb.x += orb.vx; orb.y += orb.vy;
    if (orb.x < -orb.size) orb.x = W + orb.size;
    if (orb.x > W + orb.size) orb.x = -orb.size;
    if (orb.y < -orb.size) orb.y = H + orb.size;
    if (orb.y > H + orb.size) orb.y = -orb.size;

    if (params.orbGlow > 0) {
      const gg = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size * 2 * params.orbGlow);
      gg.addColorStop(0, `hsla(${orb.hue}, 70%, 50%, ${0.15 * params.intensity})`);
      gg.addColorStop(1, "transparent");
      ctx.fillStyle = gg;
      ctx.fillRect(orb.x - orb.size * 2, orb.y - orb.size * 2, orb.size * 4, orb.size * 4);
    }
    const og = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size);
    og.addColorStop(0, `hsla(${orb.hue}, 70%, ${50 + state.rms * 20}%, 0.8)`);
    og.addColorStop(0.6, `hsla(${orb.hue}, 60%, ${30 + state.rms * 10}%, 0.4)`);
    og.addColorStop(1, `hsla(${orb.hue}, 50%, 20%, 0)`);
    ctx.fillStyle = og;
    ctx.beginPath();
    ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ═══════════════════════════════════════════════════════════════════
   9. VORONOI — Organic cell tessellation
   ═══════════════════════════════════════════════════════════════════ */

interface VoronoiPt { x: number; y: number; vx: number; vy: number; hue: number; }
let voronoiPts: VoronoiPt[] = [];

function initVoronoi(state: VisualState, params: VisualParams): void {
  voronoiPts = [];
  for (let i = 0; i < params.voronoiPoints; i++) {
    voronoiPts.push({
      x: Math.random() * state.width, y: Math.random() * state.height,
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
      hue: Math.random() * 360,
    });
  }
}

function drawVoronoi(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;
  const t = state.time * params.speed;

  ctx.fillStyle = `rgba(0, 0, 0, ${params.trailFade || 0.08})`;
  ctx.fillRect(0, 0, W, H);

  if (voronoiPts.length !== params.voronoiPoints) initVoronoi(state, params);

  // Move points
  for (const pt of voronoiPts) {
    pt.x += pt.vx + Math.sin(t + pt.y * 0.01) * state.bass * 2;
    pt.y += pt.vy + Math.cos(t + pt.x * 0.01) * state.bass * 2;
    if (pt.x < 0) pt.x = W; if (pt.x > W) pt.x = 0;
    if (pt.y < 0) pt.y = H; if (pt.y > H) pt.y = 0;
    pt.hue = (pt.hue + state.rms) % 360;
  }

  // Render Voronoi cells using pixel sampling
  const imgData = ctx.getImageData(0, 0, W, H);
  const d = imgData.data;
  const cellPx = Math.max(2, Math.floor(params.voronoiCellSize));

  for (let y = 0; y < H; y += cellPx) {
    for (let x = 0; x < W; x += cellPx) {
      // Find nearest two points
      let minDist = Infinity, secondDist = Infinity;
      let nearestHue = 0;
      for (const pt of voronoiPts) {
        const dx = x - pt.x, dy = y - pt.y;
        const dist = dx * dx + dy * dy;
        if (dist < minDist) { secondDist = minDist; minDist = dist; nearestHue = pt.hue; }
        else if (dist < secondDist) { secondDist = dist; }
      }

      const edgeDist = Math.sqrt(secondDist) - Math.sqrt(minDist);
      const isEdge = edgeDist < params.voronoiEdgeWidth * (1 + state.beat * 0.5);

      if (isEdge) {
        // Bright edge
        for (let dy = 0; dy < cellPx && y + dy < H; dy++) {
          for (let dx = 0; dx < cellPx && x + dx < W; dx++) {
            const idx = ((y + dy) * W + (x + dx)) * 4;
            d[idx] = Math.floor(200 + state.rms * 55);
            d[idx + 1] = Math.floor(220 + state.rms * 35);
            d[idx + 2] = Math.floor(255);
            d[idx + 3] = 255;
          }
        }
      } else if (params.voronoiFill) {
        // Colored cell interior
        const cellHue = (nearestHue + state.hueShift) % 360;
        const brightness = 15 + state.rms * 10 + (Math.sin(nearestHue * 0.05 + t) * 5);
        for (let dy = 0; dy < cellPx && y + dy < H; dy++) {
          for (let dx = 0; dx < cellPx && x + dx < W; dx++) {
            const idx = ((y + dy) * W + (x + dx)) * 4;
            d[idx] = Math.floor(Math.sin(cellHue * 0.0175) * 40 + brightness + 20);
            d[idx + 1] = Math.floor(Math.sin(cellHue * 0.0175 + 2.094) * 40 + brightness + 15);
            d[idx + 2] = Math.floor(Math.sin(cellHue * 0.0175 + 4.189) * 40 + brightness + 30);
            d[idx + 3] = 255;
          }
        }
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

/* ═══════════════════════════════════════════════════════════════════
   10. FRACTAL — Recursive branching trees
   ═══════════════════════════════════════════════════════════════════ */

function drawBranch(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, angle: number, length: number,
  depth: number, maxDepth: number, params: VisualParams, state: VisualState,
): void {
  if (depth > maxDepth || length < 2) return;
  const wind = Math.sin(state.time * 2 + depth * 0.5) * params.fractalWind * depth * 3;
  const rad = ((angle + wind) * Math.PI) / 180;
  const x2 = x + Math.cos(rad) * length;
  const y2 = y + Math.sin(rad) * length;
  const hue = (state.hueShift + depth * 30 + angle) % 360;
  const alpha = (1 - depth / maxDepth) * 0.6 * (0.5 + state.rms * 0.5);
  const width = Math.max(0.5, (1 - depth / maxDepth) * 4 * params.intensity);

  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2);
  ctx.strokeStyle = `hsla(${hue}, 60%, ${40 + state.rms * 20}%, ${alpha})`;
  ctx.lineWidth = width; ctx.lineCap = "round"; ctx.stroke();

  const next = length * 0.72;
  const ba = params.fractalAngle * (0.8 + state.bass * 0.4);
  for (let b = 0; b < params.fractalBranches; b++) {
    const spread = (b - (params.fractalBranches - 1) / 2) * ba;
    drawBranch(ctx, x2, y2, angle + spread, next, depth + 1, maxDepth, params, state);
  }
}

function drawFractal(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;
  ctx.fillStyle = `rgba(0, 0, 0, ${params.trailFade || 0.08})`;
  ctx.fillRect(0, 0, W, H);
  const len = params.fractalLength * (1 + state.beat * 0.3 * params.intensity);
  drawBranch(ctx, W / 2, H * 0.85, -90, len, 0, Math.floor(params.fractalDepth), params, state);
}

/* ═══════════════════════════════════════════════════════════════════
   Main render dispatcher
   ═══════════════════════════════════════════════════════════════════ */

const RENDERERS: Record<VisualMode, (ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams) => void> = {
  nebula: drawNebula,
  network: drawNetwork,
  kaleidoscope: drawKaleidoscope,
  oscilloscope: drawOscilloscope,
  terrain: drawTerrain,
  plasma: drawPlasma,
  fluid: drawFluid,
  orbs: drawOrbs,
  voronoi: drawVoronoi,
  fractal: drawFractal,
};

export function renderFrame(
  ctx: CanvasRenderingContext2D, mode: VisualMode, state: VisualState, params: VisualParams,
): void {
  (RENDERERS[mode] ?? drawNebula)(ctx, state, params);
}

/* ─── Analyser helpers ─── */

export function extractAudioData(analyser: AnalyserNode): { bass: number; mid: number; treble: number; rms: number; beat: number } {
  const freqData = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(freqData);
  const timeData = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteTimeDomainData(timeData);
  const binCount = freqData.length;
  const bassEnd = Math.floor(binCount * 0.1);
  const midEnd = Math.floor(binCount * 0.5);
  let bassSum = 0, midSum = 0, trebleSum = 0;
  for (let i = 0; i < bassEnd; i++) bassSum += freqData[i]!;
  for (let i = bassEnd; i < midEnd; i++) midSum += freqData[i]!;
  for (let i = midEnd; i < binCount; i++) trebleSum += freqData[i]!;
  const bass = bassSum / (bassEnd * 255);
  const mid = midSum / ((midEnd - bassEnd) * 255);
  const treble = trebleSum / ((binCount - midEnd) * 255);
  let rmsSum = 0;
  for (let i = 0; i < timeData.length; i++) {
    const v = (timeData[i]! - 128) / 128;
    rmsSum += v * v;
  }
  const rms = Math.sqrt(rmsSum / timeData.length);
  const beat = bass > 0.35 ? Math.min(1, (bass - 0.35) * 2.8) : 0;
  return { bass, mid, treble, rms, beat };
}

export function resetVisuals(): void {
  particles = [];
  orbs = [];
  fluidDots = [];
  voronoiPts = [];
  oscTraces = [];
}
