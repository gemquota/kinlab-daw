import { describe, it, expect, beforeEach } from "vitest";
import { usePresetsStore } from "@/store/presets.store";

describe("Presets Store", () => {
  beforeEach(() => {
    localStorage.clear();
    usePresetsStore.setState({ presets: [], selectedCategory: "All" });
  });

  it("has initial state", () => {
    const state = usePresetsStore.getState();
    expect(state.presets).toEqual([]);
  });

  it("addPreset adds entry with generated id", () => {
    usePresetsStore.getState().addPreset({
      name: "Test Preset",
      coefficients: [],
      t0: 0,
      maxOrder: 3,
      category: "Test",
      description: "A test",
      isBuiltIn: false,
    });
    const presets = usePresetsStore.getState().presets;
    expect(presets).toHaveLength(1);
    expect(presets[0]!.id).toMatch(/^user-/);
  });

  it("deletePreset removes non-built-in entry", () => {
    usePresetsStore.getState().addPreset({
      name: "To Delete",
      coefficients: [],
      t0: 0,
      maxOrder: 3,
      category: "Test",
      description: "",
      isBuiltIn: false,
    });
    const id = usePresetsStore.getState().presets[0]!.id;
    usePresetsStore.getState().deletePreset(id);
    expect(usePresetsStore.getState().presets).toHaveLength(0);
  });
});
