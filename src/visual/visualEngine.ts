/**
 * Generative Visual Engine — 6 distinct audiovisual modes.
 * Each mode uses a fundamentally different rendering algorithm.
 */

import type { VisualMode, VisualParams } from "./visualParams";
import { getGestureOverlay } from "@/audio/interactionManager";

/* ---- Types ---- */

export interface VisualState {
  width: number; height: number; time: number;
  beat: number; bass: number; mid: number; treble: number; rms: number;
  mouseX: number; mouseY: number; mouseDown: boolean; hueShift: number;
  interactionIntensity: number;
  interactionX: number;
  interactionY: number;
  interactionHolding: boolean;
}

/* ---- Shared particle system ---- */

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

/* ===========================================================
   1. NEBULA — Cosmic radial gradient clouds with swirl + pulse
   =========================================================== */

function drawNebula(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height, cx = W / 2, cy = H / 2;
  const t = state.time * params.speed;
  const rms = Math.max(state.rms, 0.15);

  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7);
  bg.addColorStop(0, "hsla(" + (state.hueShift + 240) + ", 30%, 8%, 1)");
  bg.addColorStop(0.5, "hsla(" + (state.hueShift + 260) + ", 25%, 4%, 1)");
  bg.addColorStop(1, "hsla(" + (state.hueShift + 280) + ", 20%, 2%, 1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

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
      const x = cx + Math.cos(baseAngle + swirlOffset * 0.01) * dist + pullX;
      const y = cy + Math.sin(baseAngle + swirlOffset * 0.01) * dist * 0.6 + pullY;
      const r = (60 + rms * 140 + Math.sin(t * pulse + i) * 30) * layerDepth;
      const hue = (state.hueShift + i * 40 + layer * 60) % 360;

      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, "hsla(" + hue + ", 70%, 50%, " + (0.25 * layerDepth * params.intensity) + ")");
      grad.addColorStop(0.4, "hsla(" + hue + ", 60%, 30%, " + (0.1 * layerDepth * params.intensity) + ")");
      grad.addColorStop(1, "hsla(" + hue + ", 50%, 10%, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }
  }

  updateParticles(state, params);
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = "hsla(" + p.hue + ", " + p.sat + "%!, 60%, " + (p.alpha * (1 - p.life / p.maxLife)) + ")";
    ctx.fill();
  }
}

/* ===========================================================
   2. NETWORK — Connected particle graph
   =========================================================== */

function drawNetwork(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;
  ctx.fillStyle = "rgba(0,0,0," + (params.trailFade || 0.08) + ")";
  ctx.fillRect(0, 0, W, H);

  updateParticles(state, params);

  // Draw links
  const linkDist = params.networkLinkDist;
  for (let i = 0; i < particles.length; i++) {
    const a = particles[i]!;
    for (let j = i + 1; j < particles.length; j++) {
      const b = particles[j]!;
      const dx = a.x - b.x, dy = a.y - b.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < linkDist) {
        const alpha = (1 - d / linkDist) * params.linkOpacity * (0.5 + state.rms);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = "hsla(" + ((a.hue + b.hue) / 2) + ", 60%, 50%, " + alpha + ")";
        ctx.lineWidth = params.networkLineWidth;
        ctx.stroke();
      }
    }
  }

  // Draw nodes
  for (const p of particles) {
    const r = p.size * (1 + state.beat * 0.5 * params.intensity);
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = "hsla(" + p.hue + ", 80%, 60%, " + (p.alpha * 0.8) + ")";
    ctx.fill();
    if (params.networkNodeGlow > 0) {
      ctx.save();
      ctx.shadowColor = "hsla(" + p.hue + ", 80%, 60%, 0.6)";
      ctx.shadowBlur = params.networkNodeGlow * 4;
      ctx.fill();
      ctx.restore();
    }
  }
}

/* ===========================================================
   3. PLASMA — Demoscene plasma color field
   =========================================================== */

function drawPlasma(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;
  const t = state.time * params.plasmaSpeed * params.speed;
  const s = params.plasmaScale;

  for (let y = 0; y < H; y += 4) {
    for (let x = 0; x < W; x += 4) {
      const nx = x / W * s;
      const ny = y / H * s;

      let v = Math.sin(nx * params.plasmaFrequency * 10 + t);
      v += Math.sin(ny * params.plasmaFrequency * 10 + t * 0.7);
      v += Math.sin((nx + ny) * params.plasmaFrequency * 8 + t * 0.5);
      if (params.plasmaLayers > 1) v += Math.sin(Math.sqrt(nx * nx + ny * ny) * 12 + t * 1.3) * 0.5;
      if (params.plasmaLayers > 2) v += Math.sin(nx * 15 - t * 0.8) * Math.cos(ny * 15 + t * 0.6) * 0.3;
      if (params.plasmaLayers > 3) v += Math.sin((nx + ny) * 20 + state.bass * 5) * 0.2;
      if (params.plasmaLayers > 4) v += Math.cos(nx * 25 - ny * 25 + t) * 0.15;

      v = (v + 2) / 4 * params.plasmaContrast;

      const hue = (state.hueShift + v * 180 + params.plasmaWarp * Math.sin(t + nx * 5) * 30) % 360;
      const sat = 60 + v * 30;
      const lum = 15 + v * 45;

      ctx.fillStyle = "hsl(" + hue + "," + sat + "%!," + lum + "%!)";
      ctx.fillRect(x, y, 4, 4);
    }
  }
}

/* ===========================================================
   4. ORBS — Gravitational orbs with glow
   =========================================================== */

interface Orb {
  x: number; y: number; vx: number; vy: number; r: number; hue: number;
}

let orbs: Orb[] = [];

function drawOrbs(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;

  ctx.fillStyle = "rgba(0,0,0," + (params.trailFade || 0.05) + ")";
  ctx.fillRect(0, 0, W, H);

  const count = Math.floor(params.orbCount);
  while (orbs.length < count) {
    orbs.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
      r: params.orbMinSize + Math.random() * (params.orbMaxSize - params.orbMinSize),
      hue: Math.random() * 360,
    });
  }
  while (orbs.length > count) orbs.pop();

  const cx = W / 2, cy = H / 2;
  for (const o of orbs) {
    const dx = cx - o.x, dy = cy - o.y;
    const d = Math.sqrt(dx * dx + dy * dy) + 1;
    o.vx += (dx / d) * params.orbGravity;
    o.vy += (dy / d) * params.orbGravity;

    if (state.mouseDown) {
      const mdx = state.mouseX - o.x, mdy = state.mouseY - o.y;
      const md = Math.sqrt(mdx * mdx + mdy * mdy) + 1;
      o.vx += (mdx / md) * params.mouseForce * 3;
      o.vy += (mdy / md) * params.mouseForce * 3;
    }

    o.vx *= params.orbDamping;
    o.vy *= params.orbDamping;
    o.x += o.vx + Math.sin(state.time * 2 + o.hue) * 0.3;
    o.y += o.vy + Math.cos(state.time * 2 + o.hue) * 0.3;

    if (o.x < 0) { o.x = 0; o.vx *= -params.orbBounce; }
    if (o.x > W) { o.x = W; o.vx *= -params.orbBounce; }
    if (o.y < 0) { o.y = 0; o.vy *= -params.orbBounce; }
    if (o.y > H) { o.y = H; o.vy *= -params.orbBounce; }

    const pulseR = o.r * (1 + state.beat * params.orbPulse * 0.5 + state.interactionIntensity * 0.3);
    const hue = (state.hueShift + o.hue) % 360;

    const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, pulseR * 1.5);
    grad.addColorStop(0, "hsla(" + hue + ", 70%, 60%, " + params.orbOpacity + ")");
    grad.addColorStop(0.5, "hsla(" + hue + ", 60%, 40%, " + (params.orbOpacity * 0.4) + ")");
    grad.addColorStop(1, "hsla(" + hue + ", 50%, 20%, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(o.x, o.y, pulseR * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ===========================================================
   5. VORONOI — Organic cell tessellation
   =========================================================== */

interface VoronoiPt {
  x: number; y: number; vx: number; vy: number; hue: number;
}

let voronoiPts: VoronoiPt[] = [];

function drawVoronoi(ctx: CanvasRenderingContext2D, state: VisualState, params: VisualParams): void {
  const W = state.width, H = state.height;

  ctx.fillStyle = "rgba(0,0,0," + (params.trailFade || 0.08) + ")";
  ctx.fillRect(0, 0, W, H);

  const count = Math.floor(params.voronoiPoints);
  while (voronoiPts.length < count) {
    voronoiPts.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * params.voronoiDrift * 2,
      vy: (Math.random() - 0.5) * params.voronoiDrift * 2,
      hue: Math.random() * 360,
    });
  }
  while (voronoiPts.length > count) voronoiPts.pop();

  const cellSize = params.voronoiCellSize;
  for (const p of voronoiPts) {
    p.x += p.vx + Math.sin(state.time + p.hue * 0.01) * 0.5 * params.speed;
    p.y += p.vy + Math.cos(state.time + p.hue * 0.01) * 0.5 * params.speed;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    p.x = Math.max(0, Math.min(W, p.x));
    p.y = Math.max(0, Math.min(H, p.y));
  }

  const step = cellSize;
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      let minD = Infinity, min2D = Infinity, closest = 0;
      for (let i = 0; i < voronoiPts.length; i++) {
        const pp = voronoiPts[i]!;
        const dx = x - pp.x, dy = y - pp.y;
        const d = dx * dx + dy * dy;
        if (d < minD) { min2D = minD; minD = d; closest = i; }
        else if (d < min2D) min2D = d;
      }
      const edgeDist = Math.sqrt(min2D) - Math.sqrt(minD);
      const edge = edgeDist < params.voronoiEdgeWidth;
      const hue = (state.hueShift + voronoiPts[closest]!.hue) % 360;
      const pulse = state.beat * params.voronoiPulse;

      if (edge) {
        ctx.fillStyle = "hsla(" + hue + ", 80%, " + (60 + pulse * 30) + "%!, " + (params.voronoiOpacity * 0.9) + ")";
      } else if (params.voronoiFill) {
        ctx.fillStyle = "hsla(" + hue + ", 50%, " + (15 + pulse * 10) + "%!, " + (params.voronoiOpacity * 0.4) + ")";
      } else continue;

      ctx.fillRect(x, y, step, step);
    }
  }
}

/* ===========================================================
   6. FRACTAL — Recursive branching trees
   =========================================================== */

function drawBranch(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, angle: number, length: number,
  depth: number, maxDepth: number, params: VisualParams, state: VisualState,
): void {
  if (depth > maxDepth || length < 2) return;
  const interactWind = params.fractalWind + state.interactionIntensity * 0.5 * (state.interactionX - 0.5);
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
  ctx.strokeStyle = "hsla(" + hue + ", 60%, " + (40 + state.rms * 20) + "%!, " + alpha + ")";
  ctx.lineWidth = width; ctx.lineCap = "round"; ctx.stroke();

  if (params.fractalGlow > 0 && depth < 3) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.strokeStyle = "hsla(" + hue + ", 80%, 60%, " + (alpha * params.fractalGlow * 0.3) + ")";
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
  ctx.fillStyle = "rgba(0,0,0," + (params.trailFade || 0.08) + ")";
  ctx.fillRect(0, 0, W, H);
  const len = params.fractalLength * (1 + state.beat * 0.3 * params.intensity + state.interactionIntensity * 0.4);
  drawBranch(ctx, W / 2, H * 0.85, -90, len, 0, Math.floor(params.fractalDepth), params, state);
}

/* ===========================================================
   Gesture overlay — render current instrument/FX state
   =========================================================== */

function drawGestureOverlay(ctx: CanvasRenderingContext2D, state: VisualState): void {
  const overlay = getGestureOverlay();
  if (!overlay.active) return;

  const W = state.width;

  ctx.save();
  ctx.font = "bold 14px monospace";
  ctx.textAlign = "right";

  // Instrument name
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillText(overlay.instrument, W - 20, 30);

  // FX type + enabled state
  ctx.font = "11px monospace";
  ctx.fillStyle = overlay.fxEnabled ? "rgba(100,255,100,0.6)" : "rgba(255,100,100,0.4)";
  ctx.fillText("FX: " + overlay.fx + (overlay.fxEnabled ? " ON" : " OFF"), W - 20, 48);

  // Arp pattern
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillText("ARP: " + overlay.arp, W - 20, 64);

  ctx.restore();
}

/* ===========================================================
   Main render dispatcher
   =========================================================== */

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
  drawGestureOverlay(ctx, state);
}

/* ---- Analyser helpers ---- */

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
