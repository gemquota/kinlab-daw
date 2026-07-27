import { describe, it, expect } from "vitest";

describe("Drum Synth", () => {
  it("exports triggerDrum function", async () => {
    const mod = await import("../drumSynth");
    expect(typeof mod.triggerDrum).toBe("function");
  });

  it("exports DrumType type", async () => {
    const mod = await import("../drumSynth");
    // Type-only export, verify the module loads
    expect(mod).toBeDefined();
  });

  it("exports individual trigger functions", async () => {
    const mod = await import("../drumSynth");
    expect(typeof mod.triggerKick).toBe("function");
    expect(typeof mod.triggerHat).toBe("function");
    expect(typeof mod.triggerClap).toBe("function");
    expect(typeof mod.triggerBass).toBe("function");
    expect(typeof mod.triggerPerc).toBe("function");
    expect(typeof mod.triggerTom).toBe("function");
    expect(typeof mod.triggerCrash).toBe("function");
  });
});
