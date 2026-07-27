# KinLab DAW — Development Plan 3

**Generated from:** review3.md  
**Date:** 2026-07-26  
**Total Tasks:** 35  

---

## Phase 1: Store Tests (P1)

### 1.1 — DAW Store Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 1.1.1 | Create test file for DAW store | `src/store/__tests__/daw.store.test.ts` | ✅ |
| 1.1.2 | Test initial state values | `src/store/__tests__/daw.store.test.ts` | ✅ |
| 1.1.3 | Test setBpm boundary (min 20, max 300) | `src/store/__tests__/daw.store.test.ts` | ✅ |
| 1.1.4 | Test setPlaying toggle | `src/store/__tests__/daw.store.test.ts` | ✅ |
| 1.1.5 | Test setMasterVolume clamp (0-1) | `src/store/__tests__/daw.store.test.ts` | ✅ |
| 1.1.6 | Test cyclePattern rotates through patterns | `src/store/__tests__/daw.store.test.ts` | ✅ |

### 1.2 — Theme Store Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 1.2.1 | Create test file for theme store | `src/store/__tests__/theme.store.test.ts` | ✅ |
| 1.2.2 | Test toggleTheme switches dark/light | `src/store/__tests__/theme.store.test.ts` | ✅ |
| 1.2.3 | Test setAccent updates accent color | `src/store/__tests__/theme.store.test.ts` | ✅ |

### 1.3 — UI Store Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 1.3.1 | Create test file for UI store | `src/store/__tests__/ui.store.test.ts` | ✅ |
| 1.3.2 | Test openHelp / closeHelp | `src/store/__tests__/ui.store.test.ts` | ✅ |
| 1.3.3 | Test panel visibility toggles | `src/store/__tests__/ui.store.test.ts` | ✅ |

### 1.4 — History Store Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 1.4.1 | Create test file for history store | `src/store/__tests__/history.store.test.ts` | ✅ |
| 1.4.2 | Test pushAction adds entry | `src/store/__tests__/history.store.test.ts` | ✅ |
| 1.4.3 | Test undo/redo stack management | `src/store/__tests__/history.store.test.ts` | ✅ |

---

## Phase 2: Hook Tests (P2)

### 2.1 — useDerivedState Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 2.1.1 | Create test file for useDerivedState | `src/hooks/__tests__/useDerivedState.test.ts` | ✅ |
| 2.1.2 | Test memoized recomputation | `src/hooks/__tests__/useDerivedState.test.ts` | ✅ |

### 2.2 — usePipeline Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 2.2.1 | Create test file for usePipeline | `src/hooks/__tests__/usePipeline.test.ts` | ✅ |
| 2.2.2 | Test pipeline execution | `src/hooks/__tests__/usePipeline.test.ts` | ✅ |

---

## Phase 3: Type Safety & Error Handling (P3)

### 3.1 — Fix `any` Casts
| ID | Task | File | Status |
|----|------|------|--------|
| 3.1.1 | Replace `any` with proper VisualStore types in VisualDrawer | `src/components/immersive/VisualDrawer.tsx` | ✅ |
| 3.1.2 | Replace `any` with typed return in drumSynth | `src/audio/drumSynth.ts` | ✅ |

### 3.2 — Error Handling Fixes
| ID | Task | File | Status |
|----|------|------|--------|
| 3.2.1 | Add error logging to empty catch in audioEngine voice stop | `src/audio/audioEngine.ts` | ✅ |
| 3.2.2 | Add localStorage quota error handling to persisted stores | `src/store/daw.store.ts` | ✅ |

---

## Phase 4: Dead Code Cleanup (P4)

### 4.1 — Feature Flags
| ID | Task | File | Status |
|----|------|------|--------|
| 4.1.1 | Wire `workerOffloading` flag to computation pipeline | `src/services/computationPipeline.ts` | ✅ |
| 4.1.2 | Wire `phaseSpace3D` flag to visual engine | `src/visual/visualEngine.ts` | ✅ |
| 4.1.3 | Wire `perfMonitor` flag to performance overlay | `src/app/performance.ts` | ✅ |
| 4.1.4 | Remove unused flags (symbolicDiff, parametricCurves, multiDimensional, collaboration, experimentalAnimations, advancedExport) | `src/app/featureFlags.ts` | ✅ |

### 4.2 — Console Cleanup
| ID | Task | File | Status |
|----|------|------|--------|
| 4.2.1 | Guard console.log in boot.ts behind isDev | `src/app/boot.ts` | ✅ |
| 4.2.2 | Guard console.error in ErrorBoundary behind isDev | `src/app/ErrorBoundary.tsx` | ✅ |

---

## Phase 5: Barrel Exports & Documentation (P5)

### 5.1 — Barrel Exports
| ID | Task | File | Status |
|----|------|------|--------|
| 5.1.1 | Export all 14 stores from store/index.ts | `src/store/index.ts` | ✅ |
| 5.1.2 | Export all 3 hooks from hooks/index.ts | `src/hooks/index.ts` | ✅ |

### 5.2 — Critical JSDoc
| ID | Task | File | Status |
|----|------|------|--------|
| 5.2.1 | Add JSDoc to audioEngine public API | `src/audio/audioEngine.ts` | ✅ |
| 5.2.2 | Add JSDoc to visualEngine public API | `src/visual/visualEngine.ts` | ✅ |
| 5.2.3 | Add JSDoc to drumSynth exports | `src/audio/drumSynth.ts` | ✅ |
| 5.2.4 | Add JSDoc to technoSequencer exports | `src/audio/technoSequencer.ts` | ✅ |
| 5.2.5 | Add JSDoc to featureFlags API | `src/app/featureFlags.ts` | ✅ |

---

## Summary

| Phase | Tasks | Priority |
|-------|-------|----------|
| Phase 1: Store Tests | 13 | 🔴 High |
| Phase 2: Hook Tests | 4 | 🔴 High |
| Phase 3: Type Safety & Error Handling | 4 | 🔴 High |
| Phase 4: Dead Code Cleanup | 6 | 🟡 Medium |
| Phase 5: Barrel Exports & Documentation | 7 | 🟢 Low |
| **Total** | **35** | |

