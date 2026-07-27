import { describe, it, expect, beforeEach } from "vitest";
import { useVisualStore } from "@/store/visual.store";

describe("Visual Store", () => {
  beforeEach(() => {
    localStorage.clear();
    useVisualStore.setState({ params: { ...useVisualStore.getState().params } });
  });

  it("has default params", () => {
    const state = useVisualStore.getState();
    expect(state.params).toHaveProperty("hueShift");
    expect(state.params).toHaveProperty("speed");
    expect(state.params).toHaveProperty("particleCount");
  });

  it("setParam updates a single param", () => {
    useVisualStore.getState().setParam("speed", 5);
    expect(useVisualStore.getState().params.speed).toBe(5);
  });

  it("resetParams restores defaults", () => {
    useVisualStore.getState().setParam("speed", 99);
    useVisualStore.getState().resetParams();
    expect(useVisualStore.getState().params.speed).not.toBe(99);
  });
});
