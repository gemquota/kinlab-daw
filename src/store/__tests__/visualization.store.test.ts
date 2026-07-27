import { describe, it, expect, beforeEach } from "vitest";
import { useVisualizationStore } from "@/store/visualization.store";

describe("Visualization Store", () => {
  beforeEach(() => {
    localStorage.clear();
    useVisualizationStore.setState({ visibleDerivatives: [0, 1] });
  });

  it("has initial state", () => {
    const state = useVisualizationStore.getState();
    expect(state.visibleDerivatives).toBeDefined();
    expect(state.scaleMode).toBeDefined();
  });

  it("toggleDerivative adds and removes", () => {
    useVisualizationStore.getState().toggleDerivative(2);
    expect(useVisualizationStore.getState().visibleDerivatives).toContain(2);
    useVisualizationStore.getState().toggleDerivative(2);
    expect(useVisualizationStore.getState().visibleDerivatives).not.toContain(2);
  });

  it("setScaleMode updates", () => {
    useVisualizationStore.getState().setScaleMode("log");
    expect(useVisualizationStore.getState().scaleMode).toBe("log");
  });

  it("setShowGrid toggles", () => {
    useVisualizationStore.getState().setShowGrid(false);
    expect(useVisualizationStore.getState().showGrid).toBe(false);
  });
});
