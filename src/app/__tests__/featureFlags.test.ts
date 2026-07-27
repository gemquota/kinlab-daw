import { describe, it, expect, beforeEach } from "vitest";
import {
  getFeatureFlag,
  setFeatureFlag,
  getAllFeatureFlags,
  resetFeatureFlags,
} from "../featureFlags";

describe("Feature Flags", () => {
  beforeEach(() => {
    resetFeatureFlags();
  });

  it("returns default flag values", () => {
    expect(getFeatureFlag("workerOffloading")).toBe(false);
    expect(getFeatureFlag("phaseSpace3D")).toBe(false);
    expect(getFeatureFlag("symbolicDiff")).toBe(false);
  });

  it("sets and gets a flag", () => {
    setFeatureFlag("workerOffloading", true);
    expect(getFeatureFlag("workerOffloading")).toBe(true);
  });

  it("returns all flags", () => {
    const all = getAllFeatureFlags();
    expect(all).toHaveProperty("workerOffloading");
    expect(all).toHaveProperty("phaseSpace3D");
    expect(all).toHaveProperty("symbolicDiff");
    expect(all).toHaveProperty("parametricCurves");
    expect(all).toHaveProperty("multiDimensional");
    expect(all).toHaveProperty("collaboration");
    expect(all).toHaveProperty("perfMonitor");
    expect(all).toHaveProperty("experimentalAnimations");
    expect(all).toHaveProperty("advancedExport");
  });

  it("resets all flags to defaults", () => {
    setFeatureFlag("workerOffloading", true);
    setFeatureFlag("phaseSpace3D", true);
    resetFeatureFlags();
    expect(getFeatureFlag("workerOffloading")).toBe(false);
    expect(getFeatureFlag("phaseSpace3D")).toBe(false);
  });

  it("returns a copy from getAllFeatureFlags", () => {
    const all1 = getAllFeatureFlags();
    const all2 = getAllFeatureFlags();
    expect(all1).not.toBe(all2);
    expect(all1).toEqual(all2);
  });
});
