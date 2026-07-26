/**
 * Generative Visual Engine — 10 distinct audiovisual modes.
 * Each mode has unique algorithmic logic and configurable parameters.
 */

import type { VisualMode, VisualParams } from "./visualParams";

/* ─── Types ─── */

export interface VisualState {
  width: number;
  height: number;
  time: number;
  beat: number;
  bass: number;
  mid: number;
  treble: number;
  rms: number;
  mouseX: number;
  mouseY: number;
  mouseDown: boolean;
  hueShift: number;
}

/* ─── Shared particle system ─── */

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
  hue: number; sat: number; alpha: number;
}

let particles: Particle[] = [];

function spawnParticle(state: VisualState, params: VisualParams): Particle {
  const cx = state.width / 2;
  const cy = state.height / 2;
  const angle = Math.random() * Math.PI * 2;
  const dist = Math.random() * Math.min(state.width, state.height) * 0.45;
  return {
    x: cx + Math.cos(angle) * dist,
    y: cy + Math.sin(angle) * dist,
    vx: (Math.random() - 0.5) * 3 * params.particleSpeed,
    vy: (Math.random() - 0.5) * 3 * params.particleSpeed,
    life: 0,
    maxLife: 80 + Math.random() * 180,
    size: 1 + Math.random() * params.particleSize,
    hue: (state.hueShift + Math.random() * 80) % 360,
    sat: 60 + Math.random() * 40,
    alpha: 0.2 + Math.random() * 0.6,
  };
}

function updateParticles(state: VisualState, params: VisualParams): void {
  const targetCount = Math.floor(params.particleCount * (0.2 + state.rms * 0.8));
  while (particles.length < targetCount) particles.push(spawnParticle(state, params));

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]!;
    p.life++;

    if (state.beat > 0.3) {
      const dx = p.x - state.width / 2;
      const dy = p.y - state.height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy) + 1;
      const force = state.beat * params.beatForce / dist;
      p.vx += (dx / dist) * force;
      p.vy += (dy / dist) * force;
    }

    if (state.mouseX > 0 || state.mouseY > 0) {
      const dx = state.mouseX - p.x;
      const dy = state.mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy) + 1;
      const force = state.mouseDown ? params.mouseForce * 6 : params.mouseForce;
      p.vx += (dx / dist) * force;
      p.vy += (dy / dist) * force;
    }

    p.vx += Math.sin(state.time * 4 + p.x * 0.008) * state.bass * 0.8;
    p.vy += Math.cos(state.time * 4 + p.y * 0.008) * state.bass * 0.8;

    p.vx *= params.friction;
    p.vy *= params.friction;

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < -20) p.x = state.width + 20;
    if (p.x > state.width + 20) p.x = -20;
    if (p.y < -20) p.y = state.height + 20;
    if (p.y > state.height + 20) p.y = -20;

    if (p.life > p.maxLife) particles.splice(i, 1);
  }
}

/* ─── 1. Nebula ─── */

function drawNebula(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;
  const cx = W / 2, cy = H / 2;

  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7);
  grad.addColorStop(0, `hsla(${state.hueShift + 240}, 25%, 6%, 1)`);
  grad.addColorStop(0.5, `hsla(${state.hueShift + 260}, 20%, 3%, 1)`);
  grad.addColorStop(1, `hsla(${state.hueShift + 280}, 15%, 1%, 1)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const cloudCount = Math.floor(params.nebulaClouds);
  for (let i = 0; i < cloudCount; i++) {
    const angle = state.time * 0.08 * params.speed + (i * Math.PI * 2) / cloudCount;
    const dist = 120 + state.bass * 100 + i * 50;
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    const size = (100 + state.mid * 80 + i * 25) * params.intensity;

    const cloudGrad = ctx.createRadialGradient(x, y, 0, x, y, size);
    cloudGrad.addColorStop(0, `hsla(${(state.hueShift + i * 35) % 360}, 55%, ${15 + state.rms * 20}%, ${0.12 + state.rms * 0.08})`);
    cloudGrad.addColorStop(0.5, `hsla(${(state.hueShift + i * 35 + 15) % 360}, 40%, ${8 + state.rms * 10}%, ${0.04 + state.rms * 0.04})`);
    cloudGrad.addColorStop(1, "transparent");
    ctx.fillStyle = cloudGrad;
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
  }

  // Noise grain
  if (state.rms > 0.1 && params.nebulaNoise > 0) {
    ctx.globalAlpha = state.rms * params.nebulaNoise;
    const imgData = ctx.getImageData(0, 0, W, H);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 16) {
      const noise = (Math.random() - 0.5) * 30 * state.rms;
      d[i] = Math.max(0, Math.min(255, d[i]! + noise));
      d[i + 1] = Math.max(0, Math.min(255, d[i + 1]! + noise));
      d[i + 2] = Math.max(0, Math.min(255, d[i + 2]! + noise));
    }
    ctx.putImageData(imgData, 0, 0);
    ctx.globalAlpha = 1;
  }

  updateParticles(state, params);
  for (const p of particles) {
    const lifeRatio = p.life / p.maxLife;
    const fadeIn = Math.min(1, p.life / 15);
    const fadeOut = Math.max(0, 1 - (lifeRatio - 0.75) / 0.25);
    const alpha = p.alpha * fadeIn * fadeOut * (0.4 + state.rms * 0.6);

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * (1 + state.beat * 0.8), 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${45 + state.rms * 25}%, ${alpha})`;
    ctx.fill();

    if (state.rms > 0.25 && params.nebulaGlow > 0) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * params.nebulaGlow, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, 50%, ${alpha * 0.08})`;
      ctx.fill();
    }
  }

  if (state.beat > 0.6) {
    ctx.fillStyle = `hsla(${state.hueShift}, 40%, 50%, ${(state.beat - 0.6) * 0.15 * params.intensity})`;
    ctx.fillRect(0, 0, W, H);
  }
}

/* ─── 2. Network ─── */

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
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `hsla(${(a.hue + state.hueShift) % 360}, 60%, 50%, ${alpha})`;
        ctx.lineWidth = params.networkLineWidth + state.beat * 0.5;
        ctx.stroke();
      }
    }
  }

  for (const p of particles) {
    const lifeRatio = p.life / p.maxLife;
    const fadeIn = Math.min(1, p.life / 10);
    const fadeOut = Math.max(0, 1 - (lifeRatio - 0.7) / 0.3);
    const alpha = p.alpha * fadeIn * fadeOut * (0.5 + state.rms * 0.5);

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * (1 + state.beat * 0.6), 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${(p.hue + state.hueShift) % 360}, ${p.sat}%, ${50 + state.rms * 20}%, ${alpha})`;
    ctx.fill();
  }
}

/* ─── 3. Kaleidoscope ─── */

function drawKaleidoscope(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;
  const cx = W / 2, cy = H / 2;
  const segments = Math.floor(params.kaleidoSegments);
  const angleStep = (Math.PI * 2) / segments;

  ctx.fillStyle = `hsla(${state.hueShift + 220}, 12%, 3%, 0.05)`;
  ctx.fillRect(0, 0, W, H);

  updateParticles(state, params);

  for (const p of particles) {
    const dx = p.x - cx, dy = p.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    for (let s = 0; s < segments; s++) {
      const segAngle = angle + s * angleStep + state.time * params.kaleidoSpin * 0.1;
      const sx = cx + Math.cos(segAngle) * dist;
      const sy = cy + Math.sin(segAngle) * dist;

      const lifeRatio = p.life / p.maxLife;
      const alpha = p.alpha * (1 - lifeRatio) * 0.5;

      ctx.beginPath();
      ctx.arc(sx, sy, p.size * (1 + state.beat * 2), 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${(p.hue + s * (360 / segments) + state.hueShift) % 360}, 65%, 50%, ${alpha})`;
      ctx.fill();
    }
  }

  const ringCount = Math.floor(params.kaleidoRings);
  for (let ring = 0; ring < ringCount; ring++) {
    const radius = 25 + ring * 35 + state.rms * 50;
    const hue = (state.hueShift + ring * 25) % 360;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${hue}, 55%, 45%, ${0.18 - ring * 0.025})`;
    ctx.lineWidth = 0.8 + state.beat * 2.5;
    ctx.stroke();
  }

  if (state.beat > 0.5) {
    const flashR = 30 + state.beat * 50;
    const flashGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, flashR);
    flashGrad.addColorStop(0, `hsla(${state.hueShift}, 60%, 60%, ${(state.beat - 0.5) * 0.3})`);
    flashGrad.addColorStop(1, "transparent");
    ctx.fillStyle = flashGrad;
    ctx.fillRect(cx - flashR, cy - flashR, flashR * 2, flashR * 2);
  }
}

/* ─── 4. Wave Field ─── */

function drawWaveField(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;

  ctx.fillStyle = `hsla(${state.hueShift + 230}, 15%, 2%, ${params.trailFade || 0.1})`;
  ctx.fillRect(0, 0, W, H);

  const lines = Math.floor(params.waveLines);
  const spacing = H / lines;
  const t = state.time * params.speed;

  for (let i = 0; i < lines; i++) {
    const y = i * spacing;
    const freq = 0.005 * params.waveFrequency + (i / lines) * 0.01 * params.waveFrequency;
    const amplitude = (15 + state.rms * 40 + state.beat * 20) * params.waveAmplitude;
    const phase = t * 2 + i * 0.3;
    const hue = (state.hueShift + i * 4) % 360;

    ctx.beginPath();
    for (let x = 0; x < W; x += 2) {
      const wave1 = Math.sin(x * freq + phase) * amplitude;
      const wave2 = Math.cos(x * freq * 1.5 + phase * 0.7) * amplitude * 0.5;
      const bassInfluence = state.bass * Math.sin(x * 0.002 + t) * 20;
      const py = y + wave1 + wave2 + bassInfluence;
      if (x === 0) ctx.moveTo(x, py); else ctx.lineTo(x, py);
    }

    const alpha = 0.15 + (i % 4 === 0 ? 0.1 : 0) + state.rms * 0.2;
    ctx.strokeStyle = `hsla(${hue}, 60%, ${40 + state.rms * 20}%, ${alpha})`;
    ctx.lineWidth = params.waveThickness + state.beat * 0.5;
    ctx.stroke();
  }

  if (state.beat > 0.5) {
    for (let r = 0; r < 3; r++) {
      const radius = 50 + r * 80 + state.beat * 60;
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${state.hueShift}, 50%, 50%, ${(state.beat - 0.5) * 0.15 * (1 - r / 3)})`;
      ctx.lineWidth = 1 + state.beat;
      ctx.stroke();
    }
  }
}

/* ─── 5. Terrain ─── */

function drawTerrain(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;
  const t = state.time * params.speed;

  ctx.fillStyle = `hsla(${state.hueShift + 240}, 10%, 2%, 1)`;
  ctx.fillRect(0, 0, W, H);

  const lines = Math.floor(params.terrainLayers);
  const horizon = H * params.terrainPerspective;

  for (let i = 0; i < lines; i++) {
    const tt = i / lines;
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

/* ─── 6. Cellular ─── */

function drawCellular(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;
  const cs = params.cellSize + Math.floor(state.rms * 4);
  const cols = Math.ceil(W / cs);
  const rows = Math.ceil(H / cs);
  const t = state.time * params.speed;

  ctx.fillStyle = `hsla(${state.hueShift + 240}, 18%, 3%, ${params.trailFade || 0.1})`;
  ctx.fillRect(0, 0, W, H);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cs, y = r * cs;
      const dx = x - W / 2, dy = y - H / 2;
      const dist = Math.sqrt(dx * dx + dy * dy) / (Math.min(W, H) / 2);

      const wave1 = Math.sin(dist * 10 - t * 3) * state.bass;
      const wave2 = Math.cos((x + y) * 0.008 + t * 2) * state.mid;
      const wave3 = Math.sin(Math.atan2(dy, dx) * 6 + t * 1.5) * state.treble;
      const combined = (wave1 + wave2 + wave3 + 3) / 6;

      if (combined > params.cellThreshold) {
        const hue = (state.hueShift + dist * params.cellHueSpread + t * 15) % 360;
        const alpha = (combined - params.cellThreshold) * 3 * (1 - dist * 0.6);
        ctx.fillStyle = `hsla(${hue}, 65%, ${35 + combined * 35}%, ${alpha * 0.7 * params.intensity})`;
        ctx.fillRect(x, y, cs - 1, cs - 1);
      }
    }
  }
}

/* ─── 7. Fluid ─── */

// Simple 2D noise (value noise with smoothstep)
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
  let value = 0, amplitude = 1, frequency = 1, maxVal = 0;
  for (let i = 0; i < params.fluidOctaves; i++) {
    value += noise2D(x * frequency, y * frequency) * amplitude;
    maxVal += amplitude;
    amplitude *= params.fluidPersistence;
    frequency *= params.fluidLacunarity;
  }
  return value / maxVal;
}

function drawFluid(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;
  const t = state.time * params.speed * 0.3;

  ctx.fillStyle = `hsla(${state.hueShift + 220}, 15%, 2%, ${params.trailFade || 0.05})`;
  ctx.fillRect(0, 0, W, H);

  // Draw fluid field lines
  const step = 20;
  for (let gx = 0; gx < W; gx += step) {
    for (let gy = 0; gy < H; gy += step) {
      const nx = gx * params.fluidScale;
      const ny = gy * params.fluidScale;

      const v = fbm(nx + t, ny + t * 0.7, params);
      const angle = v * Math.PI * 4 + state.time * 0.5;
      const len = (v * 15 + 5) * params.intensity;

      const hue = (state.hueShift + v * 360) % 360;
      const alpha = v * 0.4 * (0.5 + state.rms * 0.5);

      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx + Math.cos(angle) * len, gy + Math.sin(angle) * len);
      ctx.strokeStyle = `hsla(${hue}, 60%, ${30 + v * 30}%, ${alpha})`;
      ctx.lineWidth = 1 + state.beat * 0.5;
      ctx.stroke();
    }
  }

  // Overlay with flowing colored blobs
  for (let i = 0; i < 5; i++) {
    const bx = W * (0.2 + 0.6 * noise2D(i * 3.7 + t * 0.5, 0));
    const by = H * (0.2 + 0.6 * noise2D(0, i * 3.7 + t * 0.5));
    const bs = 60 + state.rms * 100 + i * 20;
    const hue = (state.hueShift + i * 60) % 360;

    const grad = ctx.createRadialGradient(bx, by, 0, bx, by, bs);
    grad.addColorStop(0, `hsla(${hue}, 50%, ${20 + state.rms * 15}%, ${0.1 + state.rms * 0.05})`);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(bx - bs, by - bs, bs * 2, bs * 2);
  }
}

/* ─── 8. Orbs ─── */

interface Orb {
  x: number; y: number;
  vx: number; vy: number;
  size: number; baseSize: number;
  hue: number;
}

let orbs: Orb[] = [];

function initOrbs(state: VisualState, params: VisualParams): void {
  orbs = [];
  for (let i = 0; i < params.orbCount; i++) {
    orbs.push({
      x: Math.random() * state.width,
      y: Math.random() * state.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: params.orbMinSize + Math.random() * (params.orbMaxSize - params.orbMinSize),
      baseSize: params.orbMinSize + Math.random() * (params.orbMaxSize - params.orbMinSize),
      hue: Math.random() * 360,
    });
  }
}

function drawOrbs(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;

  // Trail fade
  ctx.fillStyle = `rgba(0, 0, 0, ${params.orbTrail})`;
  ctx.fillRect(0, 0, W, H);

  if (orbs.length !== params.orbCount) initOrbs(state, params);

  const cx = state.mouseX || W / 2;
  const cy = state.mouseY || H / 2;

  for (const orb of orbs) {
    // Gravity toward mouse/center
    const dx = cx - orb.x;
    const dy = cy - orb.y;
    const dist = Math.sqrt(dx * dx + dy * dy) + 1;
    orb.vx += (dx / dist) * params.orbGravity;
    orb.vy += (dy / dist) * params.orbGravity;

    // Beat pulse
    orb.size = orb.baseSize * (1 + state.beat * 0.5 * params.intensity);

    // Audio-reactive hue
    orb.hue = (orb.hue + state.rms * 2) % 360;

    // Friction
    orb.vx *= 0.995;
    orb.vy *= 0.995;

    orb.x += orb.vx;
    orb.y += orb.vy;

    // Wrap
    if (orb.x < -orb.size) orb.x = W + orb.size;
    if (orb.x > W + orb.size) orb.x = -orb.size;
    if (orb.y < -orb.size) orb.y = H + orb.size;
    if (orb.y > H + orb.size) orb.y = -orb.size;

    // Draw glow
    if (params.orbGlow > 0) {
      const glowGrad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size * 2 * params.orbGlow);
      glowGrad.addColorStop(0, `hsla(${orb.hue}, 70%, 50%, ${0.15 * params.intensity})`);
      glowGrad.addColorStop(1, "transparent");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(orb.x - orb.size * 2, orb.y - orb.size * 2, orb.size * 4, orb.size * 4);
    }

    // Draw orb
    const orbGrad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size);
    orbGrad.addColorStop(0, `hsla(${orb.hue}, 70%, ${50 + state.rms * 20}%, 0.8)`);
    orbGrad.addColorStop(0.6, `hsla(${orb.hue}, 60%, ${30 + state.rms * 10}%, 0.4)`);
    orbGrad.addColorStop(1, `hsla(${orb.hue}, 50%, 20%, 0)`);
    ctx.fillStyle = orbGrad;
    ctx.beginPath();
    ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ─── 9. Lissajous ─── */

function drawLissajous(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;
  const cx = W / 2, cy = H / 2;

  ctx.fillStyle = `rgba(0, 0, 0, ${params.trailFade || 0.05})`;
  ctx.fillRect(0, 0, W, H);

  const maxRadius = Math.min(W, H) * 0.4;
  const t = state.time * params.speed * params.lissRotation;
  const layerCount = Math.floor(params.lissLayers);

  for (let layer = 0; layer < layerCount; layer++) {
    const layerRatio = layer / layerCount;
    const radius = maxRadius * (0.3 + layerRatio * 0.7) * (1 + state.beat * 0.2 * params.intensity);
    const phaseOffset = layer * 0.2 + params.lissPhase;
    const hue = (state.hueShift + layer * (360 / layerCount)) % 360;

    ctx.beginPath();
    for (let i = 0; i <= 500; i++) {
      const angle = (i / 500) * Math.PI * 2;
      const x = cx + Math.sin(angle * params.lissFreqX + t + phaseOffset) * radius;
      const y = cy + Math.cos(angle * params.lissFreqY + t * 0.7 + phaseOffset) * radius;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();

    ctx.strokeStyle = `hsla(${hue}, 60%, ${45 + state.rms * 20}%, ${0.3 + state.rms * 0.3})`;
    ctx.lineWidth = params.lissLineWidth * (0.5 + state.beat * 0.5);
    ctx.stroke();
  }

  // Beat flash center
  if (state.beat > 0.5) {
    const flashR = 20 + state.beat * 40;
    const flashGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, flashR);
    flashGrad.addColorStop(0, `hsla(${state.hueShift}, 60%, 60%, ${(state.beat - 0.5) * 0.2})`);
    flashGrad.addColorStop(1, "transparent");
    ctx.fillStyle = flashGrad;
    ctx.fillRect(cx - flashR, cy - flashR, flashR * 2, flashR * 2);
  }
}

/* ─── 10. Fractal ─── */

function drawBranch(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, angle: number, length: number,
  depth: number, maxDepth: number, params: VisualParams, state: VisualState,
): void {
  if (depth > maxDepth || length < 2) return;

  const wind = Math.sin(state.time * 2 + depth * 0.5) * params.fractalWind * depth * 3;
  const radAngle = ((angle + wind) * Math.PI) / 180;
  const x2 = x + Math.cos(radAngle) * length;
  const y2 = y + Math.sin(radAngle) * length;

  const hue = (state.hueShift + depth * 30 + angle) % 360;
  const alpha = (1 - depth / maxDepth) * 0.6 * (0.5 + state.rms * 0.5);
  const width = Math.max(0.5, (1 - depth / maxDepth) * 4 * params.intensity);

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = `hsla(${hue}, 60%, ${40 + state.rms * 20}%, ${alpha})`;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.stroke();

  const nextLength = length * 0.72;
  const branchAngle = params.fractalAngle * (0.8 + state.bass * 0.4);

  for (let b = 0; b < params.fractalBranches; b++) {
    const spread = (b - (params.fractalBranches - 1) / 2) * branchAngle;
    drawBranch(ctx, x2, y2, angle + spread, nextLength, depth + 1, maxDepth, params, state);
  }
}

function drawFractal(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;

  ctx.fillStyle = `rgba(0, 0, 0, ${params.trailFade || 0.08})`;
  ctx.fillRect(0, 0, W, H);

  const startX = W / 2;
  const startY = H * 0.85;
  const baseAngle = -90;
  const lengthScale = params.fractalLength * (1 + state.beat * 0.3 * params.intensity);

  drawBranch(ctx, startX, startY, baseAngle, lengthScale, 0, Math.floor(params.fractalDepth), params, state);

  // Ground glow
  const groundGrad = ctx.createLinearGradient(0, H * 0.85, 0, H);
  groundGrad.addColorStop(0, "transparent");
  groundGrad.addColorStop(1, `hsla(${state.hueShift}, 40%, 15%, 0.15)`);
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, H * 0.85, W, H * 0.15);
}

/* ─── Main render ─── */

const RENDERERS: Record<VisualMode, (ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams) => void> = {
  nebula: drawNebula,
  network: drawNetwork,
  kaleidoscope: drawKaleidoscope,
  waveField: drawWaveField,
  terrain: drawTerrain,
  cellular: drawCellular,
  fluid: drawFluid,
  orbs: drawOrbs,
  lissajous: drawLissajous,
  fractal: drawFractal,
};

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  mode: VisualMode,
  state: VisualState,
  params: VisualParams,
): void {
  const renderer = RENDERERS[mode] ?? drawNebula;
  renderer(ctx, state, params);
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

/* ─── Reset ─── */

export function resetVisuals(): void {
  particles = [];
  orbs = [];
}
