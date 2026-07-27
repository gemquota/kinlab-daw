import { describe, it, expect, beforeEach } from "vitest";
import { useUIStore } from "@/store/ui.store";

describe("UI Store", () => {
  beforeEach(() => {
    localStorage.clear();
    useUIStore.setState({ sidebarOpen: false, inspectorOpen: false });
  });

  it("has correct initial state", () => {
    const state = useUIStore.getState();
    expect(state.sidebarOpen).toBe(false);
    expect(state.inspectorOpen).toBe(false);
  });

  it("setSidebarOpen toggles", () => {
    useUIStore.getState().setSidebarOpen(true);
    expect(useUIStore.getState().sidebarOpen).toBe(true);
    useUIStore.getState().setSidebarOpen(false);
    expect(useUIStore.getState().sidebarOpen).toBe(false);
  });

  it("setInspectorOpen toggles", () => {
    useUIStore.getState().setInspectorOpen(true);
    expect(useUIStore.getState().inspectorOpen).toBe(true);
    useUIStore.getState().setInspectorOpen(false);
    expect(useUIStore.getState().inspectorOpen).toBe(false);
  });
});
