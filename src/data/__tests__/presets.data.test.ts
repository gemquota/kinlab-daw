import { describe, it, expect } from "vitest";
import { PRESETS } from "../presets.data";

describe("Presets Data", () => {
  it("exports an array of presets", () => {
    expect(Array.isArray(PRESETS)).toBe(true);
    expect(PRESETS.length).toBeGreaterThan(0);
  });

  it("each preset has required fields", () => {
    for (const preset of PRESETS) {
      expect(preset).toHaveProperty("id");
      expect(preset).toHaveProperty("name");
      expect(preset).toHaveProperty("description");
      expect(preset).toHaveProperty("category");
      expect(preset).toHaveProperty("coefficients");
      expect(preset).toHaveProperty("timeRange");
      expect(preset).toHaveProperty("sampleCount");
      expect(preset).toHaveProperty("icon");
    }
  });

  it("each preset has unique id", () => {
    const ids = PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each preset has valid category", () => {
    const validCategories = ["linear", "polynomial", "trigonometric", "exponential", "custom"];
    for (const preset of PRESETS) {
      expect(validCategories).toContain(preset.category);
    }
  });

  it("each preset has valid timeRange tuple", () => {
    for (const preset of PRESETS) {
      expect(preset.timeRange).toHaveLength(2);
      expect(preset.timeRange[0]).toBeLessThan(preset.timeRange[1]);
    }
  });
});
