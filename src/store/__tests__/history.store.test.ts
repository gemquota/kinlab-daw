import { describe, it, expect, beforeEach } from "vitest";
import { useHistoryStore } from "@/store/history.store";

describe("History Store", () => {
  beforeEach(() => {
    useHistoryStore.setState({ undoStack: [], redoStack: [] });
  });

  it("starts with empty stacks", () => {
    const state = useHistoryStore.getState();
    expect(state.undoStack).toHaveLength(0);
    expect(state.redoStack).toHaveLength(0);
  });

  it("pushAction adds to undoStack", () => {
    useHistoryStore.getState().pushAction("test", "desc", { val: 1 });
    expect(useHistoryStore.getState().undoStack).toHaveLength(1);
    expect(useHistoryStore.getState().undoStack[0]!.action).toBe("test");
  });

  it("pushAction clears redoStack", () => {
    useHistoryStore.getState().pushAction("a", "a", null);
    useHistoryStore.getState().undo();
    useHistoryStore.getState().pushAction("b", "b", null);
    expect(useHistoryStore.getState().redoStack).toHaveLength(0);
  });

  it("undo returns last entry and moves to redo", () => {
    useHistoryStore.getState().pushAction("a", "a", null);
    const entry = useHistoryStore.getState().undo();
    expect(entry).not.toBeNull();
    expect(entry!.action).toBe("a");
    expect(useHistoryStore.getState().undoStack).toHaveLength(0);
    expect(useHistoryStore.getState().redoStack).toHaveLength(1);
  });

  it("undo returns null when empty", () => {
    expect(useHistoryStore.getState().undo()).toBeNull();
  });

  it("redo returns entry and moves back to undo", () => {
    useHistoryStore.getState().pushAction("a", "a", null);
    useHistoryStore.getState().undo();
    const entry = useHistoryStore.getState().redo();
    expect(entry).not.toBeNull();
    expect(useHistoryStore.getState().undoStack).toHaveLength(1);
    expect(useHistoryStore.getState().redoStack).toHaveLength(0);
  });

  it("redo returns null when empty", () => {
    expect(useHistoryStore.getState().redo()).toBeNull();
  });

  it("canUndo and canRedo reflect state", () => {
    expect(useHistoryStore.getState().canUndo()).toBe(false);
    useHistoryStore.getState().pushAction("a", "a", null);
    expect(useHistoryStore.getState().canUndo()).toBe(true);
    useHistoryStore.getState().undo();
    expect(useHistoryStore.getState().canUndo()).toBe(false);
    expect(useHistoryStore.getState().canRedo()).toBe(true);
  });

  it("clear empties both stacks", () => {
    useHistoryStore.getState().pushAction("a", "a", null);
    useHistoryStore.getState().pushAction("b", "b", null);
    useHistoryStore.getState().clear();
    expect(useHistoryStore.getState().undoStack).toHaveLength(0);
    expect(useHistoryStore.getState().redoStack).toHaveLength(0);
  });
});
