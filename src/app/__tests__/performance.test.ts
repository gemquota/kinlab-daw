import { describe, it, expect, beforeEach } from "vitest";
import {
  enablePerformanceMonitoring,
  disablePerformanceMonitoring,
  startTimer,
  recordStoreUpdate,
  getMetrics,
  resetMetrics,
} from "../performance";

describe("Performance Monitoring", () => {
  beforeEach(() => {
    disablePerformanceMonitoring();
    resetMetrics();
  });

  it("returns metrics object", () => {
    const metrics = getMetrics();
    expect(metrics).toHaveProperty("renderTime");
    expect(metrics).toHaveProperty("storeUpdates");
    expect(metrics).toHaveProperty("computeTime");
    expect(metrics).toHaveProperty("frameRate");
  });

  it("resets metrics to defaults", () => {
    recordStoreUpdate();
    recordStoreUpdate();
    resetMetrics();
    const metrics = getMetrics();
    expect(metrics.storeUpdates).toBe(0);
  });

  it("records store updates when enabled", () => {
    enablePerformanceMonitoring();
    recordStoreUpdate();
    recordStoreUpdate();
    recordStoreUpdate();
    const metrics = getMetrics();
    expect(metrics.storeUpdates).toBe(3);
  });

  it("startTimer returns a function when enabled", () => {
    enablePerformanceMonitoring();
    const end = startTimer("test");
    expect(typeof end).toBe("function");
    const duration = end();
    expect(typeof duration).toBe("number");
    expect(duration).toBeGreaterThanOrEqual(0);
  });

  it("startTimer returns zero-duration function when disabled", () => {
    disablePerformanceMonitoring();
    const end = startTimer("test");
    const duration = end();
    expect(duration).toBe(0);
  });
});
