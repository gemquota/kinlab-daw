import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DerivativeOrder } from "@/types";

interface EncyclopediaStore {
  selectedDerivative: DerivativeOrder;
  expandedSections: string[];
  searchQuery: string;
  recentlyViewed: DerivativeOrder[];
  favorites: DerivativeOrder[];

  setSelectedDerivative: (order: DerivativeOrder) => void;
  toggleSection: (section: string) => void;
  expandSection: (section: string) => void;
  collapseSection: (section: string) => void;
  setSearchQuery: (query: string) => void;
  addToRecentlyViewed: (order: DerivativeOrder) => void;
  toggleFavorite: (order: DerivativeOrder) => void;
}

export const useEncyclopediaStore = create<EncyclopediaStore>()(
  persist(
    (set, get) => ({
      selectedDerivative: 0,
      expandedSections: ["properties", "notation"],
      searchQuery: "",
      recentlyViewed: [],
      favorites: [],

      setSelectedDerivative: (order) => {
        set({ selectedDerivative: order });
        get().addToRecentlyViewed(order);
      },
      toggleSection: (section) =>
        set((s) => ({
          expandedSections: s.expandedSections.includes(section)
            ? s.expandedSections.filter((sec) => sec !== section)
            : [...s.expandedSections, section],
        })),
      expandSection: (section) =>
        set((s) => ({
          expandedSections: s.expandedSections.includes(section)
            ? s.expandedSections
            : [...s.expandedSections, section],
        })),
      collapseSection: (section) =>
        set((s) => ({
          expandedSections: s.expandedSections.filter((sec) => sec !== section),
        })),
      setSearchQuery: (query) => set({ searchQuery: query }),
      addToRecentlyViewed: (order) =>
        set((s) => {
          const filtered = s.recentlyViewed.filter((o) => o !== order);
          return { recentlyViewed: [order, ...filtered].slice(0, 10) };
        }),
      toggleFavorite: (order) =>
        set((s) => ({
          favorites: s.favorites.includes(order)
            ? s.favorites.filter((o) => o !== order)
            : [...s.favorites, order],
        })),
    }),
    { name: "kinlab-encyclopedia" },
  ),
);
