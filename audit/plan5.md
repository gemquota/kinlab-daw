# KinLab DAW — Development Plan 5 (Final)

**Generated from:** review5.md  
**Date:** 2026-07-26  
**Total Tasks:** 30  

---

## Phase 1: Remaining Store Tests (P1)

### 1.1 — Encyclopedia Store Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 1.1.1 | Create test for encyclopedia store | `src/store/__tests__/encyclopedia.store.test.ts` | ✅ |
| 1.1.2 | Test initial state and CRUD | `src/store/__tests__/encyclopedia.store.test.ts` | ✅ |

### 1.2 — Export Store Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 1.2.1 | Create test for export store | `src/store/__tests__/export.store.test.ts` | ✅ |
| 1.2.2 | Test export format selection | `src/store/__tests__/export.store.test.ts` | ✅ |

### 1.3 — Simulator Store Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 1.3.1 | Create test for simulator store | `src/store/__tests__/simulator.store.test.ts` | ✅ |
| 1.3.2 | Test simulation parameters | `src/store/__tests__/simulator.store.test.ts` | ✅ |

### 1.4 — Visualization Store Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 1.4.1 | Create test for visualization store | `src/store/__tests__/visualization.store.test.ts` | ✅ |
| 1.4.2 | Test visualization mode switching | `src/store/__tests__/visualization.store.test.ts` | ✅ |

---

## Phase 2: Remaining ARIA Labels (P2)

### 2.1 — Common Component ARIA
| ID | Task | File | Status |
|----|------|------|--------|
| 2.1.1 | Add ARIA to FileExplorer buttons | `src/components/common/FileExplorer.tsx` | ✅ |
| 2.1.2 | Add ARIA to CommandPalette buttons | `src/components/common/CommandPalette.tsx` | ✅ |
| 2.1.3 | Add ARIA to Notifications dismiss button | `src/components/common/Notifications.tsx` | ✅ |
| 2.1.4 | Add ARIA to ErrorFallback button | `src/components/common/ErrorFallback.tsx` | ✅ |

### 2.2 — Layout Component ARIA
| ID | Task | File | Status |
|----|------|------|--------|
| 2.2.1 | Add ARIA to InspectorPanel buttons | `src/components/layout/InspectorPanel.tsx` | ✅ |
| 2.2.2 | Add ARIA to StatusBar buttons | `src/components/layout/StatusBar.tsx` | ✅ |

---

## Phase 3: Code Quality Improvements (P3)

### 3.1 — Visual Engine Decomposition
| ID | Task | File | Status |
|----|------|------|--------|
| 3.1.1 | Extract nebula renderer to separate file | `src/visual/renderers/nebula.ts` | ⬜ |
| 3.1.2 | Extract network renderer | `src/visual/renderers/network.ts` | ⬜ |
| 3.1.3 | Extract kaleidoscope renderer | `src/visual/renderers/kaleidoscope.ts` | ⬜ |
| 3.1.4 | Extract oscilloscope renderer | `src/visual/renderers/oscilloscope.ts` | ⬜ |
| 3.1.5 | Extract terrain renderer | `src/visual/renderers/terrain.ts` | ⬜ |
| 3.1.6 | Extract plasma renderer | `src/visual/renderers/plasma.ts` | ⬜ |
| 3.1.7 | Extract fluid renderer | `src/visual/renderers/fluid.ts` | ⬜ |
| 3.1.8 | Extract orbs renderer | `src/visual/renderers/orbs.ts` | ⬜ |
| 3.1.9 | Extract voronoi renderer | `src/visual/renderers/voronoi.ts` | ⬜ |
| 3.1.10 | Extract fractal renderer | `src/visual/renderers/fractal.ts` | ⬜ |
| 3.1.11 | Refactor visualEngine.ts to import renderers | `src/visual/visualEngine.ts` | ⬜ |

---

## Phase 4: Audio Engine Tests (P4)

### 4.1 — Additional Audio Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 4.1.1 | Add tests for drumSynth triggers | `src/audio/__tests__/drumSynth.test.ts` | ✅ |
| 4.1.2 | Add tests for technoSequencer patterns | `src/audio/__tests__/technoSequencer.test.ts` | ✅ |

---

## Summary

| Phase | Tasks | Priority |
|-------|-------|----------|
| Phase 1: Remaining Store Tests | 8 | 🟡 Medium |
| Phase 2: Remaining ARIA Labels | 6 | 🟡 Medium |
| Phase 3: Visual Engine Decomposition | 11 | 🟢 Low |
| Phase 4: Audio Engine Tests | 2 | 🟢 Low |
| **Total** | **27** | |

