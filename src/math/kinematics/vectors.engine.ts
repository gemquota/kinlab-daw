export interface Vec2 {
  x: number;
  y: number;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export function vec2(x: number, y: number): Vec2 {
  return { x, y };
}

export function vec3(x: number, y: number, z: number): Vec3 {
  return { x, y, z };
}

export function addVec2(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function subVec2(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function scaleVec2(v: Vec2, s: number): Vec2 {
  return { x: v.x * s, y: v.y * s };
}

export function magnitudeVec2(v: Vec2): number {
  return Math.sqrt(v.x ** 2 + v.y ** 2);
}

export function normalizeVec2(v: Vec2): Vec2 {
  const mag = magnitudeVec2(v);
  if (mag < Number.EPSILON) return { x: 0, y: 0 };
  return { x: v.x / mag, y: v.y / mag };
}

export function dotVec2(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y;
}

export function distanceVec2(a: Vec2, b: Vec2): number {
  return magnitudeVec2(subVec2(b, a));
}

export function lerpVec2(a: Vec2, b: Vec2, t: number): Vec2 {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export function angleVec2(v: Vec2): number {
  return Math.atan2(v.y, v.x);
}

export function rotateVec2(v: Vec2, angle: number): Vec2 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: v.x * cos - v.y * sin, y: v.x * sin + v.y * cos };
}
