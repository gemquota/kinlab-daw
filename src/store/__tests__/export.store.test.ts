import { describe, it, expect, beforeEach } from "vitest";
import { useExportStore } from "@/store/export.store";

describe("Export Store", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("has initial state", () => {
    const state = useExportStore.getState();
    expect(state.format).toBe("png");
    expect(state.imageWidth).toBeGreaterThan(0);
  });

  it("setFormat updates", () => {
    useExportStore.getState().setFormat("svg");
    expect(useExportStore.getState().format).toBe("svg");
  });

  it("setImageSize updates dimensions", () => {
    useExportStore.getState().setImageSize(1920, 1080);
    const state = useExportStore.getState();
    expect(state.imageWidth).toBe(1920);
    expect(state.imageHeight).toBe(1080);
  });

  it("setTransparentBackground toggles", () => {
    useExportStore.getState().setTransparentBackground(true);
    expect(useExportStore.getState().transparentBackground).toBe(true);
  });
});
