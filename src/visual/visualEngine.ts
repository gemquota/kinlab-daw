/**
 * Generative Visual Engine
 * Real-time particle systems, fluid simulation, and beat-reactive geometry.
 * Driven by Web Audio analyser data.
 */

/* ─── Types ─── */

export interface VisualState {
  width: number;
  height: number;
  time: number;
  beat: number;        // 0..1, beat intensity
  bass: number;        // 0..1, bass energy
  mid: number;         // 0..1, mid energy
  treble: number;      // 0..1, treble energy
  rms: number;         // 0..1, overall loudness
  mouseX: number;
  mouseY: number;
  mouseDown: boolean;
  hueShift: number;    // global hue rotation
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
const MAX_PARTICLES = 2000;

function spawnParticle(state: VisualState): Particle {
  const cx = state.width / 2;
  const cy = state.height / 2;
  const angle = Math.random() * Math.PI * 2;
  const dist = Math.random() * Math.min(state.width, state.height) * 0.4;
  return {
    x: cx + Math.cos(angle) * dist,
    y: cy + Math.sin(angle) * dist,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    life: 0,
    maxLife: 100 + Math.random() * 200,
    size: 1 + Math.random() * 3,
    hue: (state.hueShift + Math.random() * 60) % 360,
    sat: 70 + Math.random() * 30,
    alpha: 0.3 + Math.random() * 0.5,
  };
}

function updateParticles(state: VisualState): void {
  const targetCount = Math.floor(MAX_PARTICLES * (0.3 + state.rms * 0.7));
  while (particles.length < targetCount) particles.push(spawnParticle(state));

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]!;
    p.life++;

    // Beat repulsion
    if (state.beat > 0.5) {
      const dx = p.x - state.width / 2;
      const dy = p.y - state.height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy) + 1;
      const force = state.beat * 5 / dist;
      p.vx += (dx / dist) * force;
      p.vy += (dy / dist) * force;
    }

    // Mouse attraction
    if (state.mouseX > 0 || state.mouseY > 0) {
      const dx = state.mouseX - p.x;
      const dy = state.mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy) + 1;
      const force = state.mouseDown ? 0.3 : 0.05;
      p.vx += (dx / dist) * force;
      p.vy += (dy / dist) * force;
    }

    // Bass wobble
    p.vx += Math.sin(state.time * 3 + p.x * 0.01) * state.bass * 0.5;
    p.vy += Math.cos(state.time * 3 + p.y * 0.01) * state.bass * 0.5;

    // Friction
    p.vx *= 0.98;
    p.vy *= 0.98;

    p.x += p.vx;
    p.y += p.vy;

    // Wrap
    if (p.x < -10) p.x = state.width + 10;
    if (p.x > state.width + 10) p.x = -10;
    if (p.y < -10) p.y = state.height + 10;
    if (p.y > state.height + 10) p.y = -10;

    // Remove dead
    if (p.life > p.maxLife) {
      particles.splice(i, 1);
    }
  }
}

/* ─── Draw functions ─── */

function drawNebula(ctx: CanvasRenderingContext2D, state: VisualState): void {
  const W = state.width;
  const H = state.height;
  const cx = W / 2;
  const cy = H / 2;

  // Dark base with subtle gradient
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7);
  grad.addColorStop(0, `hsla(${state.hueShift + 240}, 30%, 8%, 1)`);
  grad.addColorStop(0.5, `hsla(${state.hueShift + 260}, 25%, 4%, 1)`);
  grad.addColorStop(1, `hsla(${state.hueShift + 280}, 20%, 2%, 1)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Nebula clouds
  for (let i = 0; i < 5; i++) {
    const angle = state.time * 0.1 + (i * Math.PI * 2) / 5;
    const dist = 100 + state.bass * 80 + i * 40;
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    const size = 80 + state.mid * 60 + i * 20;

    const cloudGrad = ctx.createRadialGradient(x, y, 0, x, y, size);
    cloudGrad.addColorStop(0, `hsla(${(state.hueShift + i * 40) % 360}, 60%, ${20 + state.rms * 15}%, ${0.15 + state.rms * 0.1})`);
    cloudGrad.addColorStop(0.5, `hsla(${(state.hueShift + i * 40 + 20) % 360}, 50%, ${10 + state.rms * 10}%, ${0.05 + state.rms * 0.05})`);
    cloudGrad.addColorStop(1, "transparent");
    ctx.fillStyle = cloudGrad;
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
  }

  // Particles
  updateParticles(state);
  for (const p of particles) {
    const lifeRatio = p.life / p.maxLife;
    const fadeIn = Math.min(1, p.life / 20);
    const fadeOut = Math.max(0, 1 - (lifeRatio - 0.8) / 0.2);
    const alpha = p.alpha * fadeIn * fadeOut * (0.5 + state.rms * 0.5);

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * (1 + state.beat * 0.5), 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${50 + state.rms * 20}%, ${alpha})`;
    ctx.fill();

    // Glow
    if (state.rms > 0.3) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${50 + state.rms * 20}%, ${alpha * 0.15})`;
      ctx.fill();
    }
  }

  // Center glow
  const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 150 + state.rms * 100);
  centerGlow.addColorStop(0, `hsla(${state.hueShift}, 80%, 60%, ${0.1 + state.beat * 0.15})`);
  centerGlow.addColorStop(0.5, `hsla(${state.hueShift + 30}, 60%, 40%, ${0.03 + state.beat * 0.05})`);
  centerGlow.addColorStop(1, "transparent");
  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, W, H);
}

function drawParticles(ctx: CanvasRenderingContext2D, state: VisualState): void {
  ctx.fillStyle = `hsla(${state.hueShift + 240}, 20%, 3%, 0.15)`;
  ctx.fillRect(0, 0, state.width, state.height);

  updateParticles(state);

  // Draw connecting lines between nearby particles
  ctx.lineWidth = 0.5;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < Math.min(i + 20, particles.length); j++) {
      const a = particles[i]!;
      const b = particles[j]!;
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        const alpha = (1 - dist / 80) * 0.15 * (0.5 + state.rms);
        ctx.strokeStyle = `hsla(${(a.hue + state.hueShift) % 360}, 60%, 50%, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  // Draw particles
  for (const p of particles) {
    const lifeRatio = p.life / p.maxLife;
    const alpha = p.alpha * (1 - lifeRatio);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * (1 + state.treble * 0.8), 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${(p.hue + state.hueShift) % 360}, ${p.sat}%, 60%, ${alpha})`;
    ctx.fill();
  }
}

function drawWaveField(ctx: CanvasRenderingContext2D, state: VisualState): void {
  const W = state.width;
  const H = state.height;

  ctx.fillStyle = `hsla(${state.hueShift + 220}, 15%, 5%, 0.08)`;
  ctx.fillRect(0, 0, W, H);

  const lines = 40;
  const pointsPerLine = 80;

  for (let l = 0; l < lines; l++) {
    const baseY = (l / lines) * H;
    const hue = (state.hueShift + l * 3) % 360;

    ctx.beginPath();
    ctx.strokeStyle = `hsla(${hue}, 60%, ${40 + state.rms * 20}%, ${0.3 + (l / lines) * 0.4})`;
    ctx.lineWidth = 1 + state.beat * 1.5;

    for (let p = 0; p <= pointsPerLine; p++) {
      const x = (p / pointsPerLine) * W;
      const t = state.time + l * 0.3;
      const wave1 = Math.sin(x * 0.01 + t * 2) * 20 * state.bass;
      const wave2 = Math.sin(x * 0.02 - t * 1.5 + l * 0.1) * 15 * state.mid;
      const wave3 = Math.cos(x * 0.005 + t * 0.8) * 10 * state.treble;
      const mouseInfluence = Math.exp(-Math.pow((x - state.mouseX) * 0.005, 2) * 10) * 30 * (state.mouseDown ? 2 : 0.5);
      const y = baseY + wave1 + wave2 + wave3 + mouseInfluence;

      if (p === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

function drawTerrain(ctx: CanvasRenderingContext2D, state: VisualState): void {
  const W = state.width;
  const H = state.height;

  ctx.fillStyle = `hsla(${state.hueShift + 200}, 15%, 3%, 1)`;
  ctx.fillRect(0, 0, W, H);

  const rows = 30;
  const cols = 60;
  const perspective = 0.7;

  for (let row = 0; row < rows; row++) {
    const progress = row / rows;
    const y = H * 0.3 + progress * H * 0.7;
    const depth = 1 - progress * perspective;
    const hue = (state.hueShift + row * 4) % 360;

    ctx.beginPath();
    ctx.strokeStyle = `hsla(${hue}, 50%, ${30 + progress * 20}%, ${0.4 + progress * 0.4})`;
    ctx.lineWidth = (1 + state.beat * 2) * depth;

    for (let col = 0; col <= cols; col++) {
      const x = (col / cols) * W;
      const noise1 = Math.sin(col * 0.2 + state.time * 2 + row * 0.3) * 30 * state.bass;
      const noise2 = Math.cos(col * 0.15 - state.time * 1.5 + row * 0.2) * 20 * state.mid;
      const noise3 = Math.sin(col * 0.3 + state.time * 3) * 10 * state.treble;
      const height = (noise1 + noise2 + noise3) * depth;
      const py = y + height;

      if (col === 0) ctx.moveTo(x, py);
      else ctx.lineTo(x, py);
    }
    ctx.stroke();

    // Fill under terrain
    if (row % 3 === 0) {
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fillStyle = `hsla(${hue}, 40%, ${5 + progress * 5}%, ${0.05 + state.rms * 0.05})`;
      ctx.fill();
    }
  }
}

function drawCellular(ctx: CanvasRenderingContext2D, state: VisualState): void {
  const W = state.width;
  const H = state.height;
  const cellSize = 8;
  const cols = Math.ceil(W / cellSize);
  const rows = Math.ceil(H / cellSize);

  ctx.fillStyle = `hsla(${state.hueShift + 240}, 20%, 5%, 0.12)`;
  ctx.fillRect(0, 0, W, H);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellSize;
      const y = r * cellSize;

      // Distance from center
      const dx = x - W / 2;
      const dy = y - H / 2;
      const dist = Math.sqrt(dx * dx + dy * dy) / (Math.min(W, H) / 2);

      // Wave interference
      const wave1 = Math.sin(dist * 10 - state.time * 3) * state.bass;
      const wave2 = Math.cos((x + y) * 0.01 + state.time * 2) * state.mid;
      const wave3 = Math.sin(Math.atan2(dy, dx) * 5 + state.time * 1.5) * state.treble;
      const combined = (wave1 + wave2 + wave3 + 3) / 6;

      if (combined > 0.5) {
        const hue = (state.hueShift + dist * 60 + state.time * 20) % 360;
        const alpha = (combined - 0.5) * 2 * (1 - dist * 0.7);
        ctx.fillStyle = `hsla(${hue}, 70%, ${40 + combined * 30}%, ${alpha * 0.8})`;
        ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
      }
    }
  }
}

function drawKaleidoscope(ctx: CanvasRenderingContext2D, state: VisualState): void {
  const W = state.width;
  const H = state.height;
  const cx = W / 2;
  const cy = H / 2;
  const segments = 8;
  const angleStep = (Math.PI * 2) / segments;

  ctx.fillStyle = `hsla(${state.hueShift + 220}, 15%, 4%, 0.06)`;
  ctx.fillRect(0, 0, W, H);

  updateParticles(state);

  for (const p of particles) {
    // Map to kaleidoscope segments
    const dx = p.x - cx;
    const dy = p.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    for (let s = 0; s < segments; s++) {
      const segAngle = angle + s * angleStep;
      const sx = cx + Math.cos(segAngle) * dist;
      const sy = cy + Math.sin(segAngle) * dist;

      const lifeRatio = p.life / p.maxLife;
      const alpha = p.alpha * (1 - lifeRatio) * 0.6;

      ctx.beginPath();
      ctx.arc(sx, sy, p.size * (1 + state.beat * 1.5), 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${(p.hue + s * (360 / segments) + state.hueShift) % 360}, 70%, 55%, ${alpha})`;
      ctx.fill();
    }
  }

  // Center mandala
  for (let ring = 0; ring < 5; ring++) {
    const radius = 20 + ring * 30 + state.rms * 40;
    const hue = (state.hueShift + ring * 30) % 360;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${hue}, 60%, 50%, ${0.2 - ring * 0.03})`;
    ctx.lineWidth = 1 + state.beat * 2;
    ctx.stroke();
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

  // Simple beat detection (bass threshold)
  const beat = bass > 0.4 ? Math.min(1, (bass - 0.4) * 2.5) : 0;

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
