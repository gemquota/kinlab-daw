import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIStore {
  sidebarOpen: boolean;
  inspectorOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setInspectorOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      inspectorOpen: false,

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setInspectorOpen: (open) => set({ inspectorOpen: open }),
    }),
    { name: "kinlab-ui" },
  ),
);
