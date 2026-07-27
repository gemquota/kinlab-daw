/**
 * Multi-touch gesture recognition engine.
 * Tracks active touch points by identifier, detects tap vs drag,
 * and classifies by finger count (1/2/3) + direction.
 */

/* ─── Gesture types ─── */

export type GestureType =
  | "tap"
  | "two-finger-tap"
  | "drag"
  | "two-finger-drag"
  | "three-finger-drag";

export type GestureDirection = "horizontal" | "vertical";

export interface GestureEvent {
  type: GestureType;
  direction: GestureDirection;
  fingerCount: number;
  /** Normalized delta from gesture start (-1 to 1 range, approximate) */
  deltaX: number;
  deltaY: number;
  /** Raw cumulative delta in pixels */
  rawDeltaX: number;
  rawDeltaY: number;
  /** How far the finger has moved (pixels) */
  distance: number;
}

/* ─── Touch tracking ─── */

interface TrackedTouch {
  id: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  startTime: number;
}

const activeTouches: Map<number, TrackedTouch> = new Map();
let gestureStarted = false;
let gestureEmitted = false;
let lastGestureEvent: GestureEvent | null = null;

/* ─── Thresholds ─── */
const TAP_MAX_DISTANCE_PX = 15;
const DRAG_MIN_DISTANCE_PX = 10;

/* ─── Public API ─── */

export interface GestureCallbacks {
  onGesture: (event: GestureEvent) => void;
  onTap: (fingerCount: number) => void;
}

let callbacks: GestureCallbacks = { onGesture: () => {}, onTap: () => {} };

export function setGestureCallbacks(cb: GestureCallbacks): void {
  callbacks = cb;
}

export function handleTouchStart(e: TouchEvent): void {
  const now = performance.now();

  // If there are already active touches, new touch means finger count increased
  if (activeTouches.size > 0) {
    // Reset gesture state when finger count changes
    gestureStarted = false;
    gestureEmitted = false;
  }

  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i]!;
    activeTouches.set(t.identifier, {
      id: t.identifier,
      startX: t.clientX,
      startY: t.clientY,
      currentX: t.clientX,
      currentY: t.clientY,
      startTime: now,
    });
  }
}

export function handleTouchMove(e: TouchEvent): void {
  const fingerCount = activeTouches.size;

  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i]!;
    const tracked = activeTouches.get(t.identifier);
    if (!tracked) continue;
    tracked.currentX = t.clientX;
    tracked.currentY = t.clientY;
  }

  if (fingerCount === 0) return;

  // Calculate aggregate position (centroid) and deltas
  let startX = 0, startY = 0, currentX = 0, currentY = 0;
  let minStartTime = Infinity;

  for (const touch of activeTouches.values()) {
    startX += touch.startX;
    startY += touch.startY;
    currentX += touch.currentX;
    currentY += touch.currentY;
    if (touch.startTime < minStartTime) minStartTime = touch.startTime;
  }

  const n = activeTouches.size;
  const avgStartX = startX / n;
  const avgStartY = startY / n;
  const avgCurrentX = currentX / n;
  const avgCurrentY = currentY / n;

  const rawDeltaX = avgCurrentX - avgStartX;
  const rawDeltaY = avgCurrentY - avgStartY;
  const distance = Math.sqrt(rawDeltaX * rawDeltaX + rawDeltaY * rawDeltaY);

  if (distance > TAP_MAX_DISTANCE_PX) {
    gestureStarted = true;
  }

  if (!gestureStarted || gestureEmitted) return;

  if (distance > DRAG_MIN_DISTANCE_PX) {
    const type: GestureType = fingerCount === 1
      ? "drag"
      : fingerCount === 2
        ? "two-finger-drag"
        : "three-finger-drag";

    const isHorizontal = Math.abs(rawDeltaX) > Math.abs(rawDeltaY);
    const direction: GestureDirection = isHorizontal ? "horizontal" : "vertical";

    // Normalize deltas to roughly -1..1 range (based on 300px drag range)
    const normRange = 300;

    const event: GestureEvent = {
      type,
      direction,
      fingerCount,
      deltaX: Math.max(-1, Math.min(1, rawDeltaX / normRange)),
      deltaY: Math.max(-1, Math.min(1, rawDeltaY / normRange)),
      rawDeltaX,
      rawDeltaY,
      distance,
    };

    lastGestureEvent = event;
    callbacks.onGesture(event);
  }
}

export function handleTouchEnd(e: TouchEvent): void {
  const fingerCountBefore = activeTouches.size;

  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i]!;
    activeTouches.delete(t.identifier);
  }

  const fingerCountAfter = activeTouches.size;

  if (fingerCountAfter === 0 && !gestureStarted) {
    const tapFingers = fingerCountBefore;
    if (tapFingers === 1 || tapFingers === 2) {
      callbacks.onTap(tapFingers);
    }
  }

  // Reset when all fingers lifted
  if (fingerCountAfter === 0) {
    gestureStarted = false;
    gestureEmitted = false;
    lastGestureEvent = null;
  }
}

export function handleMouseDown(x: number, y: number): void {
  handleTouchStart({
    changedTouches: [{ identifier: 0, clientX: x, clientY: y } as Touch],
  } as unknown as TouchEvent);
}

export function handleMouseMove(x: number, y: number): void {
  handleTouchMove({
    changedTouches: [{ identifier: 0, clientX: x, clientY: y } as Touch],
  } as unknown as TouchEvent);
}

export function handleMouseUp(x: number, y: number): void {
  handleTouchEnd({
    changedTouches: [{ identifier: 0, clientX: x, clientY: y } as Touch],
  } as unknown as TouchEvent);
}

export function resetGestures(): void {
  activeTouches.clear();
  gestureStarted = false;
  gestureEmitted = false;
  lastGestureEvent = null;
}

export function getLastGestureEvent(): GestureEvent | null {
  return lastGestureEvent;
}
