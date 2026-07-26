/**
 * Lightweight performance instrumentation.
 * Disabled in production builds.
 */

export interface PerformanceMetrics {
  renderTime: number;
  storeUpdates: number;
  computeTime: number;
  frameRate: number;
}

const isDev: boolean = (import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV ?? false;

let metrics: PerformanceMetrics = {
  renderTime: 0,
  storeUpdates: 0,
  computeTime: 0,
  frameRate: 60,
};

let enabled = isDev;

export function enablePerformanceMonitoring(): void {
  enabled = true;
}

export function disablePerformanceMonitoring(): void {
  enabled = false;
}

export function startTimer(label: string): () => number {
  if (!enabled) return () => 0;
  const start = performance.now();
  return () => {
    const duration = performance.now() - start;
    console.debug(`[perf] ${label}: ${duration.toFixed(2)}ms`);
    return duration;
  };
}

export function recordStoreUpdate(): void {
  if (!enabled) return;
  metrics.storeUpdates++;
}

export function getMetrics(): PerformanceMetrics {
  return { ...metrics };
}

export function resetMetrics(): void {
  metrics = { renderTime: 0, storeUpdates: 0, computeTime: 0, frameRate: 60 };
}

export function startFrameRateMonitor(callback?: (fps: number) => void): () => void {
  if (!enabled) return () => {};
  let frameCount = 0;
  let lastTime = performance.now();
  let running = true;

  function tick(): void {
    if (!running) return;
    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      metrics.frameRate = frameCount;
      callback?.(frameCount);
      frameCount = 0;
      lastTime = now;
    }
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
  return () => { running = false; };
}
