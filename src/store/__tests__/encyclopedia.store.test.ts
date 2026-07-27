import { describe, it, expect, beforeEach } from "vitest";
import { useEncyclopediaStore } from "@/store/encyclopedia.store";

describe("Encyclopedia Store", () => {
  beforeEach(() => {
    localStorage.clear();
    useEncyclopediaStore.setState({
      selectedDerivative: 0,
      expandedSections: ["properties", "notation"],
      searchQuery: "",
      recentlyViewed: [],
      favorites: [],
    });
  });

  it("has initial state", () => {
    const state = useEncyclopediaStore.getState();
    expect(state.selectedDerivative).toBe(0);
    expect(state.expandedSections).toContain("properties");
  });

  it("setSelectedDerivative updates", () => {
    useEncyclopediaStore.getState().setSelectedDerivative(3);
    expect(useEncyclopediaStore.getState().selectedDerivative).toBe(3);
  });

  it("setSearchQuery updates", () => {
    useEncyclopediaStore.getState().setSearchQuery("velocity");
    expect(useEncyclopediaStore.getState().searchQuery).toBe("velocity");
  });

  it("addToRecentlyViewed adds entry", () => {
    useEncyclopediaStore.getState().addToRecentlyViewed(2);
    expect(useEncyclopediaStore.getState().recentlyViewed).toContain(2);
  });

  it("toggleFavorite adds and removes", () => {
    useEncyclopediaStore.getState().toggleFavorite(1);
    expect(useEncyclopediaStore.getState().favorites).toContain(1);
    useEncyclopediaStore.getState().toggleFavorite(1);
    expect(useEncyclopediaStore.getState().favorites).not.toContain(1);
  });
});
