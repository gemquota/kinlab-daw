/**
 * Generative Visual Engine — Abstract, Minimal, Beat-Reactive.
 * Pure algorithmic visuals driven by Web Audio analyser data.
 * No images, no assets — everything is math.
 */

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

export type VisualMode = "nebula" | "particles" | "waveField" | "terrain" | "cellular" | "kaleidoscope";

/* ─── Particle System ─── */

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
  hue: number;
  sat: number;
  alpha: number;
}

let particles: Particle[] = [];
const MAX_PARTICLES = 2500;

function spawnParticle(state: VisualState): Particle {
  const cx = state.width / 2;
  const cy = state.height / 2;
  const angle = Math.random() * Math.PI * 2;
  const dist = Math.random() * Math.min(state.width, state.height) * 0.45;
  return {
    x: cx + Math.cos(angle) * dist,
    y: cy + Math.sin(angle) * dist,
    vx: (Math.random() - 0.5) * 3,
    vy: (Math.random() - 0.5) * 3,
    life: 0,
    maxLife: 80 + Math.random() * 180,
    size: 1 + Math.random() * 3,
    hue: (state.hueShift + Math.random() * 80) % 360,
    sat: 60 + Math.random() * 40,
    alpha: 0.2 + Math.random() * 0.6,
  };
}

function updateParticles(state: VisualState): void {
  const targetCount = Math.floor(MAX_PARTICLES * (0.2 + state.rms * 0.8));
  while (particles.length < targetCount) particles.push(spawnParticle(state));

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]!;
    p.life++;

    // Beat repulsion from center
    if (state.beat > 0.3) {
      const dx = p.x - state.width / 2;
      const dy = p.y - state.height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy) + 1;
      const force = state.beat * 8 / dist;
      p.vx += (dx / dist) * force;
      p.vy += (dy / dist) * force;
    }

    // Mouse attraction
    if (state.mouseX > 0 || state.mouseY > 0) {
      const dx = state.mouseX - p.x;
      const dy = state.mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy) + 1;
      const force = state.mouseDown ? 0.4 : 0.06;
      p.vx += (dx / dist) * force;
      p.vy += (dy / dist) * force;
    }

    // Bass wobble
    p.vx += Math.sin(state.time * 4 + p.x * 0.008) * state.bass * 0.8;
    p.vy += Math.cos(state.time * 4 + p.y * 0.008) * state.bass * 0.8;

    // Friction
    p.vx *= 0.96;
    p.vy *= 0.96;

    p.x += p.vx;
    p.y += p.vy;

    // Wrap
    if (p.x < -20) p.x = state.width + 20;
    if (p.x > state.width + 20) p.x = -20;
    if (p.y < -20) p.y = state.height + 20;
    if (p.y > state.height + 20) p.y = -20;

    if (p.life > p.maxLife) particles.splice(i, 1);
  }
}

/* ─── Draw: Nebula ─── */

function drawNebula(ctx: CanvasRenderingContext2D, state: VisualState): void {
  const W = state.width;
  const H = state.height;
  const cx = W / 2;
  const cy = H / 2;

  // Deep dark base
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7);
  grad.addColorStop(0, `hsla(${state.hueShift + 240}, 25%, 6%, 1)`);
  grad.addColorStop(0.5, `hsla(${state.hueShift + 260}, 20%, 3%, 1)`);
  grad.addColorStop(1, `hsla(${state.hueShift + 280}, 15%, 1%, 1)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Nebula clouds — beat-reactive
  for (let i = 0; i < 6; i++) {
    const angle = state.time * 0.08 + (i * Math.PI * 2) / 6;
    const dist = 120 + state.bass * 100 + i * 50;
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    const size = 100 + state.mid * 80 + i * 25;

    const cloudGrad = ctx.createRadialGradient(x, y, 0, x, y, size);
    cloudGrad.addColorStop(0, `hsla(${(state.hueShift + i * 35) % 360}, 55%, ${15 + state.rms * 20}%, ${0.12 + state.rms * 0.08})`);
    cloudGrad.addColorStop(0.5, `hsla(${(state.hueShift + i * 35 + 15) % 360}, 40%, ${8 + state.rms * 10}%, ${0.04 + state.rms * 0.04})`);
    cloudGrad.addColorStop(1, "transparent");
    ctx.fillStyle = cloudGrad;
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
  }

  // Noise grain overlay
  if (state.rms > 0.1) {
    ctx.globalAlpha = state.rms * 0.15;
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

  // Particles
  updateParticles(state);
  for (const p of particles) {
    const lifeRatio = p.life / p.maxLife;
    const fadeIn = Math.min(1, p.life / 15);
    const fadeOut = Math.max(0, 1 - (lifeRatio - 0.75) / 0.25);
    const alpha = p.alpha * fadeIn * fadeOut * (0.4 + state.rms * 0.6);

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * (1 + state.beat * 0.8), 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${45 + state.rms * 25}%, ${alpha})`;
    ctx.fill();

    if (state.rms > 0.25) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, 50%, ${alpha * 0.1})`;
      ctx.fill();
    }
  }

  // Beat flash
  if (state.beat > 0.6) {
    ctx.fillStyle = `hsla(${state.hueShift}, 40%, 50%, ${(state.beat - 0.6) * 0.15})`;
    ctx.fillRect(0, 0, W, H);
  }
}

/* ─── Draw: Particles ─── */

function drawParticles(ctx: CanvasRenderingContext2D, state: VisualState): void {
  const W = state.width;
  const H = state.height;

  ctx.fillStyle = `hsla(${state.hueShift + 220}, 15%, 3%, 0.08)`;
  ctx.fillRect(0, 0, W, H);

  updateParticles(state);

  // Draw connections
  const connectionDist = 80 + state.rms * 40;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < Math.min(i + 30, particles.length); j++) {
      const a = particles[i]!;
      const b = particles[j]!;
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < connectionDist) {
        const alpha = (1 - dist / connectionDist) * 0.15 * (0.5 + state.rms * 0.5);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `hsla(${(a.hue + state.hueShift) % 360}, 60%, 50%, ${alpha})`;
        ctx.lineWidth = 0.5 + state.beat * 0.5;
        ctx.stroke();
      }
    }
  }

  // Draw particles
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

/* ─── Draw: Wave Field ─── */

function drawWaveField(ctx: CanvasRenderingContext2D, state: VisualState): void {
  const W = state.width;
  const H = state.height;
  const cx = W / 2;
  const cy = H / 2;

  ctx.fillStyle = `hsla(${state.hueShift + 230}, 15%, 2%, 0.1)`;
  ctx.fillRect(0, 0, W, H);

  const lines = 40;
  const spacing = H / lines;

  for (let i = 0; i < lines; i++) {
    const y = i * spacing;
    const freq = 0.005 + (i / lines) * 0.01;
    const amplitude = 15 + state.rms * 40 + state.beat * 20;
    const phase = state.time * 2 + i * 0.3;
    const hue = (state.hueShift + i * 4) % 360;

    ctx.beginPath();
    for (let x = 0; x < W; x += 2) {
      const wave1 = Math.sin(x * freq + phase) * amplitude;
      const wave2 = Math.cos(x * freq * 1.5 + phase * 0.7) * amplitude * 0.5;
      const bassInfluence = state.bass * Math.sin(x * 0.002 + state.time) * 20;
      const py = y + wave1 + wave2 + bassInfluence;

      if (x === 0) ctx.moveTo(x, py);
      else ctx.lineTo(x, py);
    }

    const alpha = 0.15 + (i % 4 === 0 ? 0.1 : 0) + state.rms * 0.2;
    ctx.strokeStyle = `hsla(${hue}, 60%, ${40 + state.rms * 20}%, ${alpha})`;
    ctx.lineWidth = 1 + state.beat * 0.5;
    ctx.stroke();
  }

  // Beat pulse rings
  if (state.beat > 0.5) {
    for (let r = 0; r < 3; r++) {
      const radius = 50 + r * 80 + state.beat * 60;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${state.hueShift}, 50%, 50%, ${(state.beat - 0.5) * 0.15 * (1 - r / 3)})`;
      ctx.lineWidth = 1 + state.beat;
      ctx.stroke();
    }
  }
}

/* ─── Draw: Terrain ─── */

function drawTerrain(ctx: CanvasRenderingContext2D, state: VisualState): void {
  const W = state.width;
  const H = state.height;

  // Black base with scanlines
  ctx.fillStyle = `hsla(${state.hueShift + 240}, 10%, 2%, 1)`;
  ctx.fillRect(0, 0, W, H);

  const lines = 30;
  const horizon = H * 0.45;

  for (let i = 0; i < lines; i++) {
    const t = i / lines;
    const y = horizon + (H - horizon) * t;
    const depth = 1 - t;

    ctx.beginPath();

    for (let x = 0; x < W; x += 3) {
      const nx = x / W;
      const wave = Math.sin(nx * 8 - state.time * 3) * depth * 30 * (1 + state.bass * 2);
      const wave2 = Math.cos(nx * 12 + state.time * 2) * depth * 15 * state.mid;
      const height = depth * 60 * (1 + state.rms);
      const py = y - height + wave + wave2;

      if (x === 0) ctx.moveTo(x, py);
      else ctx.lineTo(x, py);
    }

    const hue = (state.hueShift + i * 6) % 360;
    ctx.strokeStyle = `hsla(${hue}, 70%, ${30 + depth * 30}%, ${0.3 * depth + state.rms * 0.2})`;
    ctx.lineWidth = 0.8 + depth * 0.5;
    ctx.stroke();

    // Fill below
    if (i % 3 === 0) {
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fillStyle = `hsla(${hue}, 50%, ${10 + depth * 15}%, ${0.03 * depth})`;
      ctx.fill();
    }
  }

  // Scanline effect
  for (let y = 0; y < H; y += 3) {
    ctx.fillStyle = `rgba(0, 0, 0, 0.08)`;
    ctx.fillRect(0, y, W, 1);
  }
}

/* ─── Draw: Cellular ─── */

function drawCellular(ctx: CanvasRenderingContext2D, state: VisualState): void {
  const W = state.width;
  const H = state.height;
  const cellSize = 12 + Math.floor(state.rms * 4);
  const cols = Math.ceil(W / cellSize);
  const rows = Math.ceil(H / cellSize);

  ctx.fillStyle = `hsla(${state.hueShift + 240}, 18%, 3%, 0.1)`;
  ctx.fillRect(0, 0, W, H);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellSize;
      const y = r * cellSize;
      const dx = x - W / 2;
      const dy = y - H / 2;
      const dist = Math.sqrt(dx * dx + dy * dy) / (Math.min(W, H) / 2);

      const wave1 = Math.sin(dist * 10 - state.time * 3) * state.bass;
      const wave2 = Math.cos((x + y) * 0.008 + state.time * 2) * state.mid;
      const wave3 = Math.sin(Math.atan2(dy, dx) * 6 + state.time * 1.5) * state.treble;
      const combined = (wave1 + wave2 + wave3 + 3) / 6;

      if (combined > 0.48) {
        const hue = (state.hueShift + dist * 70 + state.time * 15) % 360;
        const alpha = (combined - 0.48) * 3 * (1 - dist * 0.6);
        ctx.fillStyle = `hsla(${hue}, 65%, ${35 + combined * 35}%, ${alpha * 0.7})`;
        ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
      }
    }
  }
}

/* ─── Draw: Kaleidoscope ─── */

function drawKaleidoscope(ctx: CanvasRenderingContext2D, state: VisualState): void {
  const W = state.width;
  const H = state.height;
  const cx = W / 2;
  const cy = H / 2;
  const segments = 8;
  const angleStep = (Math.PI * 2) / segments;

  ctx.fillStyle = `hsla(${state.hueShift + 220}, 12%, 3%, 0.05)`;
  ctx.fillRect(0, 0, W, H);

  updateParticles(state);

  for (const p of particles) {
    const dx = p.x - cx;
    const dy = p.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    for (let s = 0; s < segments; s++) {
      const segAngle = angle + s * angleStep;
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

  // Center mandala rings
  for (let ring = 0; ring < 6; ring++) {
    const radius = 25 + ring * 35 + state.rms * 50;
    const hue = (state.hueShift + ring * 25) % 360;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${hue}, 55%, 45%, ${0.18 - ring * 0.025})`;
    ctx.lineWidth = 0.8 + state.beat * 2.5;
    ctx.stroke();
  }

  // Beat flash at center
  if (state.beat > 0.5) {
    const flashR = 30 + state.beat * 50;
    const flashGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, flashR);
    flashGrad.addColorStop(0, `hsla(${state.hueShift}, 60%, 60%, ${(state.beat - 0.5) * 0.3})`);
    flashGrad.addColorStop(1, "transparent");
    ctx.fillStyle = flashGrad;
    ctx.fillRect(cx - flashR, cy - flashR, flashR * 2, flashR * 2);
  }
}

/* ─── Main render ─── */

const RENDERERS: Record<VisualMode, (ctx: CanvasRenderingContext2D, state: VisualState) => void> = {
  nebula: drawNebula,
  particles: drawParticles,
  waveField: drawWaveField,
  terrain: drawTerrain,
  cellular: drawCellular,
  kaleidoscope: drawKaleidoscope,
};

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  mode: VisualMode,
  state: VisualState,
): void {
  const renderer = RENDERERS[mode] ?? drawNebula;
  renderer(ctx, state);
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

  // RMS
  let rmsSum = 0;
  for (let i = 0; i < timeData.length; i++) {
    const v = (timeData[i]! - 128) / 128;
    rmsSum += v * v;
  }
  const rms = Math.sqrt(rmsSum / timeData.length);

  // Beat detection — bass threshold with hysteresis
  const beat = bass > 0.35 ? Math.min(1, (bass - 0.35) * 2.8) : 0;

  return { bass, mid, treble, rms, beat };
}

/* ─── Visual mode metadata ─── */

export const VISUAL_MODES: { id: VisualMode; name: string; desc: string }[] = [
  { id: "nebula", name: "Nebula", desc: "Cosmic clouds and particles" },
  { id: "particles", name: "Particles", desc: "Connected particle network" },
  { id: "waveField", name: "Wave Field", desc: "Audio-driven wave interference" },
  { id: "terrain", name: "Terrain", desc: "Retro scanline landscape" },
  { id: "cellular", name: "Cellular", desc: "Cellular automata patterns" },
  { id: "kaleidoscope", name: "Kaleidoscope", desc: "Symmetric mandala geometry" },
];

/* ─── Reset ─── */

export function resetVisuals(): void {
  particles = [];
}
