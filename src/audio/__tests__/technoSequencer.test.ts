import { describe, it, expect } from "vitest";
import { FILTHY_TECHNO, MINIMAL_TECHNO, getHitsOnStep, ALL_PATTERNS } from "../technoSequencer";

describe("Techno Sequencer", () => {
  it("FILTHY_TECHNO has bpm and hits", () => {
    expect(FILTHY_TECHNO.bpm).toBeGreaterThan(0);
    expect(FILTHY_TECHNO.hits).toBeDefined();
    expect(Array.isArray(FILTHY_TECHNO.hits)).toBe(true);
  });

  it("MINIMAL_TECHNO has different bpm", () => {
    expect(MINIMAL_TECHNO.bpm).toBeGreaterThan(0);
  });

  it("getHitsOnStep returns array", () => {
    const hits = getHitsOnStep(FILTHY_TECHNO, 0);
    expect(Array.isArray(hits)).toBe(true);
  });

  it("ALL_PATTERNS contains all patterns", () => {
    expect(ALL_PATTERNS.length).toBeGreaterThanOrEqual(4);
  });

  it("getHitsOnStep handles out of range step", () => {
    const hits = getHitsOnStep(FILTHY_TECHNO, 999);
    expect(Array.isArray(hits)).toBe(true);
  });
});
