import { create } from "zustand";

export interface HistoryEntry {
  id: string;
  timestamp: number;
  action: string;
  description: string;
  snapshot: unknown;
}

interface HistoryStore {
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];
  maxHistory: number;

  pushAction: (action: string, description: string, snapshot: unknown) => void;
  undo: () => HistoryEntry | null;
  redo: () => HistoryEntry | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clear: () => void;
}

let historyId = 0;

export const useHistoryStore = create<HistoryStore>()((set, get) => ({
  undoStack: [],
  redoStack: [],
  maxHistory: 100,

  pushAction: (action, description, snapshot) => {
    const entry: HistoryEntry = {
      id: `h-${++historyId}`,
      timestamp: Date.now(),
      action,
      description,
      snapshot,
    };
    set((s) => ({
      undoStack: [...s.undoStack.slice(-(s.maxHistory - 1)), entry],
      redoStack: [],
    }));
  },

  undo: () => {
    const { undoStack } = get();
    if (undoStack.length === 0) return null;
    const entry = undoStack[undoStack.length - 1]!;
    set((s) => ({
      undoStack: s.undoStack.slice(0, -1),
      redoStack: [...s.redoStack, entry],
    }));
    return entry;
  },

  redo: () => {
    const { redoStack } = get();
    if (redoStack.length === 0) return null;
    const entry = redoStack[redoStack.length - 1]!;
    set((s) => ({
      redoStack: s.redoStack.slice(0, -1),
      undoStack: [...s.undoStack, entry],
    }));
    return entry;
  },

  canUndo: () => get().undoStack.length > 0,
  canRedo: () => get().redoStack.length > 0,
  clear: () => set({ undoStack: [], redoStack: [] }),
}));
