import { describe, it, expect } from "vitest";
import { APP_CONFIG } from "../config";

describe("APP_CONFIG", () => {
  it("has correct name", () => {
    expect(APP_CONFIG.name).toBe("KinLab");
  });

  it("has version string", () => {
    expect(APP_CONFIG.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("has default theme", () => {
    expect(APP_CONFIG.defaultTheme).toBe("dark");
  });

  it("has max derivative order", () => {
    expect(APP_CONFIG.maxDerivativeOrder).toBe(10);
  });

  it("has default sample count", () => {
    expect(APP_CONFIG.defaultSampleCount).toBe(200);
  });

  it("has default time range", () => {
    expect(APP_CONFIG.defaultTimeRange).toEqual({ min: 0, max: 10 });
  });

  it("has autosave interval", () => {
    expect(APP_CONFIG.autosaveInterval).toBe(5000);
  });

  it("has max history entries", () => {
    expect(APP_CONFIG.maxHistoryEntries).toBe(100);
  });
});
