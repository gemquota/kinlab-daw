/**
 * Generative Visual Engine — 6 distinct audiovisual modes.
 * Each mode uses a fundamentally different rendering algorithm.
 */

import type { VisualMode, VisualParams } from "./visualParams";

/* ─── Types ─── */

export interface VisualState {
  width: number; height: number; time: number;
  beat: number; bass: number; mid: number; treble: number; rms: number;
  mouseX: number; mouseY: number; mouseDown: boolean; hueShift: number;
  interactionIntensity: number;
  interactionX: number;
  interactionY: number;
  interactionHolding: boolean;
}

/* ─── Shared particle system (used by nebula/network) ─── */

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
    hue: (state.hueShift + Math.random() * (params.particleHue || 80)) % 360,
    sat: 60 + Math.random() * 40,
    alpha: (params.particleAlpha || 0.5) + Math.random() * 0.3,
  };
}

function updateParticles(state: VisualState, params: VisualParams): void {
  const target = Math.floor(params.particleCount * (0.2 + state.rms * 0.8));
  while (particles.length < target) particles.push(spawnParticle(state, params));
  const drag = params.particleDrag || 0.98;
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
    p.vx += p.vx * state.interactionIntensity * 0.3;
    p.vy += p.vy * state.interactionIntensity * 0.3;
    p.vx += Math.sin(state.time * 4 + p.x * 0.008) * state.bass * 0.8;
    p.vy += Math.cos(state.time * 4 + p.y * 0.008) * state.bass * 0.8;
    p.vx *= params.friction * drag; p.vy *= params.friction * drag;
    p.x += p.vx; p.y += p.vy;
    if (p.x < -20) p.x = state.width + 20;
    if (p.x > state.width + 20) p.x = -20;
    if (p.y < -20) p.y = state.height + 20;
    if (p.y > state.height + 20) p.y = -20;
    if (p.life > p.maxLife) particles.splice(i, 1);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   1. NEBULA — Cosmic radial gradient clouds with swirl + pulse
   ═══════════════════════════════════════════════════════════════════ */

function drawNebula(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height, cx = W / 2, cy = H / 2;
  const t = state.time * params.speed;
  const rms = Math.max(state.rms, 0.15);

  // Deep space gradient
  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7);
  bg.addColorStop(0, `hsla(${state.hueShift + 240}, 30%, 8%, 1)`);
  bg.addColorStop(0.5, `hsla(${state.hueShift + 260}, 25%, 4%, 1)`);
  bg.addColorStop(1, `hsla(${state.hueShift + 280}, 20%, 2%, 1)`);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Orbital nebula clouds with swirl and rotation
  const count = Math.floor(params.nebulaClouds);
  const rotSpeed = params.nebulaRotation || 0.3;
  const swirl = params.nebulaSwirl || 0;
  const pulse = params.nebulaPulse || 0.5;
  const depthLayers = Math.floor(params.nebulaDepth || 3);

  for (let layer = 0; layer < depthLayers; layer++) {
    const layerDepth = (layer + 1) / depthLayers;
    for (let i = 0; i < count; i++) {
      const baseAngle = t * 0.08 * rotSpeed + (i * Math.PI * 2) / count + layer * 0.5;
      const swirlOffset = Math.sin(t * 0.3 + i) * swirl * 50;
      const pullX = (state.interactionX - 0.5) * state.interactionIntensity * 200;
      const pullY = (state.interactionY - 0.5) * state.interactionIntensity * 200;
      const dist = (120 + state.bass * 200 + i * 80) * layerDepth;
      const x = cx + Math.cos(baseAngle) * dist + pullX + swirlOffset;
      const y = cy + Math.sin(baseAngle) * dist + pullY;
      const pulseScale = 1 + Math.sin(t * 2 + i) * pulse * 0.3;
      const size = (150 + state.mid * 120 + i * 40) * params.intensity * pulseScale * layerDepth
        * (1 + state.interactionIntensity * 0.5);

      const hue = (state.hueShift + i * 35 + layer * 20) % 360;
      const g = ctx.createRadialGradient(x, y, 0, x, y, size);
      g.addColorStop(0, `hsla(${hue}, 70%, ${25 + rms * 30}%, ${(0.35 + rms * 0.2) * layerDepth})`);
      g.addColorStop(0.4, `hsla(${(hue + 15) % 360}, 55%, ${15 + rms * 20}%, ${(0.15 + rms * 0.1) * layerDepth})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(x - size, y - size, size * 2, size * 2);
    }
  }

  // Star field
  for (let i = 0; i < 80; i++) {
    const sx = ((i * 7919 + 1234) % W);
    const sy = ((i * 6271 + 5678) % H);
    const flicker = 0.4 + Math.sin(t * 3 + i) * 0.3;
    const sz = 1 + Math.sin(t * 2 + i * 0.5) * 0.5;
    ctx.fillStyle = `hsla(${(state.hueShift + i * 17) % 360}, 40%, 85%, ${flicker})`;
    ctx.fillRect(sx, sy, sz, sz);
  }

  // Warp distortion overlay
  if (params.nebulaWarp > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const warpSize = Math.min(W, H) * 0.4 * params.nebulaWarp;
    const warpX = cx + Math.cos(t * 0.7) * warpSize;
    const warpY = cy + Math.sin(t * 0.5) * warpSize;
    const wg = ctx.createRadialGradient(warpX, warpY, 0, warpX, warpY, warpSize);
    wg.addColorStop(0, `hsla(${(state.hueShift + 120) % 360}, 60%, 30%, ${0.08 * state.rms})`);
    wg.addColorStop(1, "transparent");
    ctx.fillStyle = wg;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  // Noise grain
  if (rms > 0.05 && params.nebulaNoise > 0) {
    ctx.globalAlpha = rms * params.nebulaNoise * 2;
    const imgData = ctx.getImageData(0, 0, W, H);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 16) {
      const n = (Math.random() - 0.5) * 40 * rms;
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
   2. NETWORK — Connected particle graph with pulse + glow
   ═══════════════════════════════════════════════════════════════════ */

function drawNetwork(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;
  const decay = params.networkDecay || 0.95;
  ctx.fillStyle = `hsla(${state.hueShift + 220}, 15%, 3%, ${1 - decay + 0.02})`;
  ctx.fillRect(0, 0, W, H);
  updateParticles(state, params);

  const linkDist = params.networkLinkDist + state.rms * 40 + state.interactionIntensity * 60;
  const pulse = params.networkPulse || 0;
  const pulseSpeed = params.linkPulseSpeed || 2;
  const linkAlphaBase = params.linkOpacity || 0.4;
  const jitter = params.networkJitter || 0;
  const colorMode = Math.floor(params.networkColor || 0);

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < Math.min(i + 30, particles.length); j++) {
      const a = particles[i]!, b = particles[j]!;
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < linkDist) {
        const pulseMod = pulse > 0 ? Math.sin(state.time * pulseSpeed + i * 0.1) * pulse * 0.3 : 0;
        const alpha = (1 - dist / linkDist) * linkAlphaBase * (0.5 + state.rms * 0.5 + pulseMod);
        let hue: number;
        if (colorMode === 0) hue = (a.hue + state.hueShift) % 360;
        else if (colorMode === 1) hue = (dist / linkDist * 120 + state.hueShift) % 360;
        else if (colorMode === 2) hue = (state.hueShift + state.time * 20) % 360;
        else hue = (a.hue + b.hue) / 2;
        ctx.beginPath();
        ctx.moveTo(a.x + (Math.random() - 0.5) * jitter * 3, a.y + (Math.random() - 0.5) * jitter * 3);
        ctx.lineTo(b.x + (Math.random() - 0.5) * jitter * 3, b.y + (Math.random() - 0.5) * jitter * 3);
        ctx.strokeStyle = `hsla(${hue}, 60%, 50%, ${alpha})`;
        ctx.lineWidth = params.networkLineWidth + state.beat * 0.5;
        ctx.stroke();
      }
    }
  }

  const nodeGlow = params.networkNodeGlow || 0;
  const shape = Math.floor(params.nodeShape || 0);
  for (const p of particles) {
    const lr = p.life / p.maxLife;
    const alpha = p.alpha * Math.min(1, p.life / 10) * Math.max(0, 1 - (lr - 0.7) / 0.3) * (0.5 + state.rms * 0.5);
    const sz = p.size * (1 + state.beat * 0.6);
    const hue = (p.hue + state.hueShift) % 360;
    if (nodeGlow > 0) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, sz * nodeGlow * 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, 60%, 50%, ${alpha * 0.15})`;
      ctx.fill();
    }
    ctx.beginPath();
    if (shape === 0) {
      ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
    } else if (shape === 1) {
      ctx.rect(p.x - sz, p.y - sz, sz * 2, sz * 2);
    } else {
      ctx.moveTo(p.x, p.y - sz);
      ctx.lineTo(p.x - sz, p.y + sz);
      ctx.lineTo(p.x + sz, p.y + sz);
      ctx.closePath();
    }
    ctx.fillStyle = `hsla(${hue}, ${p.sat}%, ${50 + state.rms * 20}%, ${alpha})`;
    ctx.fill();
  }
}

/* ═══════════════════════════════════════════════════════════════════
   3. PLASMA — Demoscene plasma with warp + frequency control
   ═══════════════════════════════════════════════════════════════════ */

function drawPlasma(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;
  const interactSpeed = 1 + state.interactionIntensity * 2;
  const t = state.time * params.speed * params.plasmaSpeed * interactSpeed;
  const scale = params.plasmaScale * (1 + state.interactionIntensity * 0.5);
  const layers = Math.floor(params.plasmaLayers);
  const freq = params.plasmaFrequency || 1.5;
  const contrast = params.plasmaContrast || 1;
  const rotation = params.plasmaRotation || 0;
  const warp = params.plasmaWarp || 0;
  const alpha = params.plasmaAlpha || 0.8;

  const imgData = ctx.getImageData(0, 0, W, H);
  const d = imgData.data;
  const step = 4;

  const cosR = Math.cos(rotation * t * 0.1);
  const sinR = Math.sin(rotation * t * 0.1);

  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      let nx = (x / W) * scale;
      let ny = (y / H) * scale;

      // Rotation
      if (rotation > 0) {
        const rx = nx * cosR - ny * sinR;
        const ry = nx * sinR + ny * cosR;
        nx = rx; ny = ry;
      }

      // Warp distortion
      if (warp > 0) {
        nx += Math.sin(ny * 4 + t) * warp * 0.3;
        ny += Math.cos(nx * 4 + t * 0.7) * warp * 0.3;
      }

      let v = 0;
      for (let l = 0; l < layers; l++) {
        const f = freq + l * 0.5;
        v += Math.sin(nx * f * 6 + t * (0.5 + l * 0.2));
        v += Math.cos(ny * f * 4 + t * (0.3 + l * 0.15));
        v += Math.sin(Math.sqrt((nx - 0.5) ** 2 + (ny - 0.5) ** 2) * 8 + t);
      }
      v = (v + layers * 3) / (layers * 6);
      v = Math.pow(Math.max(0, Math.min(1, v)), 1 / Math.max(0.1, contrast));

      v += state.bass * 0.2 * Math.sin(nx * 10 + t);
      v += state.mid * 0.15 * Math.cos(ny * 8 + t * 1.3);
      v = Math.max(0, Math.min(1, v));

      const palette = Math.floor(params.plasmaPalette);
      let r: number, g: number, b: number;
      if (palette === 0) {
        r = Math.floor(v * 255);
        g = Math.floor(Math.sin(v * Math.PI * 2 + 2.094) * 127 + 128);
        b = Math.floor(Math.sin(v * Math.PI * 2 + 4.189) * 127 + 128);
      } else if (palette === 1) {
        r = Math.floor(Math.min(255, v * 400));
        g = Math.floor(Math.min(255, v * 200 * (1 - v)));
        b = Math.floor(v * 30);
      } else if (palette === 2) {
        r = Math.floor(v * 40);
        g = Math.floor(v * 180 + 50);
        b = Math.floor(Math.min(255, v * 350));
      } else {
        r = 0;
        g = Math.floor(v * 255);
        b = Math.floor(v * 40);
      }

      for (let dy = 0; dy < step && y + dy < H; dy++) {
        for (let dx = 0; dx < step && x + dx < W; dx++) {
          const idx = ((y + dy) * W + (x + dx)) * 4;
          d[idx] = r;
          d[idx + 1] = g;
          d[idx + 2] = b;
          d[idx + 3] = Math.floor(alpha * 255);
        }
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);

  if (state.beat > 0.5) {
    ctx.fillStyle = `hsla(${state.hueShift + 60}, 80%, 50%, ${(state.beat - 0.5) * 0.1})`;
    ctx.fillRect(0, 0, W, H);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   4. ORBS — Gravitational physics with charge + bounce + pulse
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
  const damping = params.orbDamping || 0.995;
  const charge = params.orbCharge || 0;
  const bounce = params.orbBounce || 0.8;
  const magnetism = params.orbMagnetism || 0;
  const orbPulse = params.orbPulse || 0;
  const opacity = params.orbOpacity || 0.85;
  const colorMode = Math.floor(params.orbColor || 0);

  // Orb-orb repulsion when charge > 0
  if (charge !== 0) {
    for (let i = 0; i < orbs.length; i++) {
      for (let j = i + 1; j < orbs.length; j++) {
        const a = orbs[i]!, b = orbs[j]!;
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) + 1;
        const force = charge * 0.01 / (d * 0.1);
        a.vx -= (dx / d) * force;
        a.vy -= (dy / d) * force;
        b.vx += (dx / d) * force;
        b.vy += (dy / d) * force;
      }
    }
  }

  for (const orb of orbs) {
    const dx = cx - orb.x, dy = cy - orb.y;
    const dist = Math.sqrt(dx * dx + dy * dy) + 1;
    const interactGrav = params.orbGravity * (1 + state.interactionIntensity * 3);
    orb.vx += (dx / dist) * interactGrav;
    orb.vy += (dy / dist) * interactGrav;

    // Magnetism toward cursor
    if (magnetism > 0 && state.interactionHolding) {
      orb.vx += (dx / dist) * magnetism * 0.05;
      orb.vy += (dy / dist) * magnetism * 0.05;
    }

    const pulseScale = 1 + state.beat * 0.5 * params.intensity * (1 + orbPulse) + state.interactionIntensity * 0.4;
    orb.size = orb.baseSize * pulseScale;
    orb.hue = (orb.hue + state.rms * 2) % 360;
    orb.vx *= damping; orb.vy *= damping;
    orb.x += orb.vx; orb.y += orb.vy;

    // Bounce off walls
    if (bounce > 0) {
      if (orb.x < 0) { orb.x = 0; orb.vx = Math.abs(orb.vx) * bounce; }
      if (orb.x > W) { orb.x = W; orb.vx = -Math.abs(orb.vx) * bounce; }
      if (orb.y < 0) { orb.y = 0; orb.vy = Math.abs(orb.vy) * bounce; }
      if (orb.y > H) { orb.y = H; orb.vy = -Math.abs(orb.vy) * bounce; }
    } else {
      if (orb.x < -orb.size) orb.x = W + orb.size;
      if (orb.x > W + orb.size) orb.x = -orb.size;
      if (orb.y < -orb.size) orb.y = H + orb.size;
      if (orb.y > H + orb.size) orb.y = -orb.size;
    }

    let hue = orb.hue;
    if (colorMode === 1) hue = (state.hueShift + orb.x / W * 120) % 360;
    else if (colorMode === 2) hue = (state.hueShift + state.time * 30) % 360;
    else if (colorMode === 3) hue = (orb.hue + state.hueShift) % 360;

    if (params.orbGlow > 0) {
      const gg = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size * 2 * params.orbGlow);
      gg.addColorStop(0, `hsla(${hue}, 70%, 50%, ${0.15 * params.intensity * opacity})`);
      gg.addColorStop(1, "transparent");
      ctx.fillStyle = gg;
      ctx.fillRect(orb.x - orb.size * 2, orb.y - orb.size * 2, orb.size * 4, orb.size * 4);
    }
    const og = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size);
    og.addColorStop(0, `hsla(${hue}, 70%, ${50 + state.rms * 20}%, ${0.8 * opacity})`);
    og.addColorStop(0.6, `hsla(${hue}, 60%, ${30 + state.rms * 10}%, ${0.4 * opacity})`);
    og.addColorStop(1, `hsla(${hue}, 50%, 20%, 0)`);
    ctx.fillStyle = og;
    ctx.beginPath();
    ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ═══════════════════════════════════════════════════════════════════
   5. VORONOI — Organic cell tessellation with drift + pulse
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
  const drift = params.voronoiDrift || 0.3;
  const noise = params.voronoiNoise || 0;
  const colorMode = Math.floor(params.voronoiColor || 0);
  const opacity = params.voronoiOpacity || 0.6;
  const fade = params.voronoiFade || 0.3;

  ctx.fillStyle = `rgba(0, 0, 0, ${params.trailFade || 0.08})`;
  ctx.fillRect(0, 0, W, H);

  if (voronoiPts.length !== params.voronoiPoints) initVoronoi(state, params);

  for (const pt of voronoiPts) {
    const vdx = pt.x - state.mouseX, vdy = pt.y - state.mouseY;
    const vd = Math.sqrt(vdx * vdx + vdy * vdy) + 1;
    const vPush = state.interactionIntensity * 0.8 / vd;
    pt.x += pt.vx * drift + Math.sin(t + pt.y * 0.01) * state.bass * 2 + (vdx / vd) * vPush;
    pt.y += pt.vy * drift + Math.cos(t + pt.x * 0.01) * state.bass * 2 + (vdy / vd) * vPush;
    if (noise > 0) {
      pt.x += (Math.random() - 0.5) * noise * 3;
      pt.y += (Math.random() - 0.5) * noise * 3;
    }
    if (pt.x < 0) pt.x = W; if (pt.x > W) pt.x = 0;
    if (pt.y < 0) pt.y = H; if (pt.y > H) pt.y = 0;
    pt.hue = (pt.hue + state.rms) % 360;
  }

  const imgData = ctx.getImageData(0, 0, W, H);
  const d = imgData.data;
  const cellPx = Math.max(2, Math.floor(params.voronoiCellSize));
  const edgePulse = 1 + state.beat * 0.5 * (params.voronoiPulse || 0);

  for (let y = 0; y < H; y += cellPx) {
    for (let x = 0; x < W; x += cellPx) {
      let minDist = Infinity, secondDist = Infinity;
      let nearestHue = 0;
      for (const pt of voronoiPts) {
        const dx = x - pt.x, dy = y - pt.y;
        const dist = dx * dx + dy * dy;
        if (dist < minDist) { secondDist = minDist; minDist = dist; nearestHue = pt.hue; }
        else if (dist < secondDist) { secondDist = dist; }
      }

      const edgeDist = Math.sqrt(secondDist) - Math.sqrt(minDist);
      const isEdge = edgeDist < params.voronoiEdgeWidth * edgePulse;

      let cellHue: number;
      if (colorMode === 0) cellHue = nearestHue;
      else if (colorMode === 1) cellHue = (state.hueShift + Math.sqrt(minDist) * 0.5) % 360;
      else if (colorMode === 2) cellHue = (nearestHue + state.time * 20) % 360;
      else cellHue = (nearestHue + state.hueShift) % 360;

      if (isEdge) {
        for (let dy2 = 0; dy2 < cellPx && y + dy2 < H; dy2++) {
          for (let dx2 = 0; dx2 < cellPx && x + dx2 < W; dx2++) {
            const idx = ((y + dy2) * W + (x + dx2)) * 4;
            const edgeFade = fade > 0 ? Math.min(1, edgeDist / (fade * 5 + 0.1)) : 1;
            const brightness = (40 + state.rms * 30) * edgeFade;
            d[idx] = Math.floor(Math.min(255, brightness * 1.2));
            d[idx + 1] = Math.floor(Math.min(255, brightness * 0.9));
            d[idx + 2] = Math.floor(Math.min(255, brightness * 1.5));
            d[idx + 3] = 255;
          }
        }
      } else if (params.voronoiFill) {
        const h = cellHue / 360;
        const r2 = Math.floor(h * 6 < 1 ? 255 : h * 6 < 2 ? 255 * (2 - h * 6) : 0);
        const g2 = Math.floor(h * 6 < 1 ? 255 * h * 6 : h * 6 < 3 ? 255 : h * 6 < 4 ? 255 * (4 - h * 6) : 0);
        const b2 = Math.floor(h * 6 < 2 ? 0 : h * 6 < 3 ? 255 * (h * 6 - 2) : h * 6 < 5 ? 255 : 255 * (6 - h * 6));
        for (let dy2 = 0; dy2 < cellPx && y + dy2 < H; dy2++) {
          for (let dx2 = 0; dx2 < cellPx && x + dx2 < W; dx2++) {
            const idx = ((y + dy2) * W + (x + dx2)) * 4;
            d[idx] = Math.floor(r2 * opacity * 0.4);
            d[idx + 1] = Math.floor(g2 * opacity * 0.4);
            d[idx + 2] = Math.floor(b2 * opacity * 0.4);
            d[idx + 3] = 255;
          }
        }
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

/* ═══════════════════════════════════════════════════════════════════
   6. FRACTAL — Recursive branching trees with glow + chaos
   ═══════════════════════════════════════════════════════════════════ */

function drawBranch(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, angle: number, length: number,
  depth: number, maxDepth: number, params: VisualParams, state: VisualState,
): void {
  if (depth > maxDepth || length < 2) return;
  const interactWind = params.fractalWind + state.interactionIntensity * 0.5 * (state.interactionX - 0.5);
  // sway used via fractalSway param
  const chaos = params.fractalChaos || 0;
  const wind = Math.sin(state.time * 2 + depth * 0.5) * interactWind * depth * 3;
  const chaosOffset = chaos > 0 ? (Math.random() - 0.5) * chaos * 10 : 0;
  const rad = ((angle + wind + chaosOffset) * Math.PI) / 180;
  const x2 = x + Math.cos(rad) * length;
  const y2 = y + Math.sin(rad) * length;
  const colorMode = Math.floor(params.fractalColor || 0);
  let hue: number;
  if (colorMode === 0) hue = (state.hueShift + depth * 30 + angle) % 360;
  else if (colorMode === 1) hue = (state.hueShift + depth / maxDepth * 180) % 360;
  else if (colorMode === 2) hue = (state.hueShift + state.time * 20) % 360;
  else hue = (state.hueShift + x / state.width * 120) % 360;
  const alpha = (1 - depth / maxDepth) * 0.6 * (0.5 + state.rms * 0.5);
  const width = Math.max(0.5, (1 - depth / maxDepth) * (params.fractalThickness || 4) * params.intensity);

  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2);
  ctx.strokeStyle = `hsla(${hue}, 60%, ${40 + state.rms * 20}%, ${alpha})`;
  ctx.lineWidth = width; ctx.lineCap = "round"; ctx.stroke();

  // Glow effect
  if (params.fractalGlow > 0 && depth < 3) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${alpha * params.fractalGlow * 0.3})`;
    ctx.lineWidth = width * 3;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.restore();
  }

  const decay = params.fractalDecay || 0.72;
  const next = length * decay;
  const ba = params.fractalAngle * (0.8 + state.bass * 0.4 + state.interactionIntensity * 0.6);
  for (let b = 0; b < params.fractalBranches; b++) {
    const spread = (b - (params.fractalBranches - 1) / 2) * ba;
    drawBranch(ctx, x2, y2, angle + spread, next, depth + 1, maxDepth, params, state);
  }
}

function drawFractal(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;
  ctx.fillStyle = `rgba(0, 0, 0, ${params.trailFade || 0.08})`;
  ctx.fillRect(0, 0, W, H);
  const len = params.fractalLength * (1 + state.beat * 0.3 * params.intensity + state.interactionIntensity * 0.4);
  drawBranch(ctx, W / 2, H * 0.85, -90, len, 0, Math.floor(params.fractalDepth), params, state);
}

/* ═══════════════════════════════════════════════════════════════════
   Main render dispatcher
   ═══════════════════════════════════════════════════════════════════ */

const RENDERERS: Record<VisualMode, (ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams) => void> = {
  nebula: drawNebula,
  network: drawNetwork,
  plasma: drawPlasma,
  orbs: drawOrbs,
  voronoi: drawVoronoi,
  fractal: drawFractal,
};

export function renderFrame(
  ctx: CanvasRenderingContext2D, mode: VisualMode, state: VisualState, params: VisualParams,
): void {
  if (state.width <= 0 || state.height <= 0) return;
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
  voronoiPts = [];
}
