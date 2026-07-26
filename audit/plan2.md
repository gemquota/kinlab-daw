# KinLab DAW — Development Plan 2

**Generated from:** review2.md  
**Date:** 2026-07-26  
**Total Tasks:** 28  

---

## Phase 1: Component Tests (P1)

### 1.1 — FloatingControls Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 1.1.1 | Create test file for FloatingControls | `src/components/immersive/__tests__/FloatingControls.test.tsx` | ⬜ |
| 1.1.2 | Test TransportPill renders play button | `src/components/immersive/__tests__/FloatingControls.test.tsx` | ⬜ |
| 1.1.3 | Test play/pause toggle on click | `src/components/immersive/__tests__/FloatingControls.test.tsx` | ⬜ |
| 1.1.4 | Test BPM display and increment/decrement | `src/components/immersive/__tests__/FloatingControls.test.tsx` | ⬜ |
| 1.1.5 | Test volume slider | `src/components/immersive/__tests__/FloatingControls.test.tsx` | ⬜ |
| 1.1.6 | Test PatternPill displays pattern name | `src/components/immersive/__tests__/FloatingControls.test.tsx` | ⬜ |
| 1.1.7 | Test pattern cycle on click | `src/components/immersive/__tests__/FloatingControls.test.tsx` | ⬜ |

### 1.2 — TopToolbar Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 1.2.1 | Create test file for TopToolbar | `src/components/layout/__tests__/TopToolbar.test.tsx` | ⬜ |
| 1.2.2 | Test theme toggle button | `src/components/layout/__tests__/TopToolbar.test.tsx` | ⬜ |
| 1.2.3 | Test help button opens help modal | `src/components/layout/__tests__/TopToolbar.test.tsx` | ⬜ |

---

## Phase 2: Lazy Loading (P2)

### 2.1 — Route Lazy Loading
| ID | Task | File | Status |
|----|------|------|--------|
| 2.1.1 | Add React.lazy to Waveform import | `src/app/router.tsx` | ⬜ |
| 2.1.2 | Add Suspense wrapper with loading fallback | `src/app/router.tsx` | ⬜ |
| 2.1.3 | Create loading spinner component | `src/components/common/LoadingSpinner.tsx` | ⬜ |

---

## Phase 3: Store Tests (P3)

### 3.1 — Settings Store Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 3.1.1 | Create test file for settings store | `src/store/__tests__/settings.store.test.ts` | ⬜ |
| 3.1.2 | Test initial state | `src/store/__tests__/settings.store.test.ts` | ⬜ |
| 3.1.3 | Test state updates | `src/store/__tests__/settings.store.test.ts` | ⬜ |

### 3.2 — Session Store Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 3.2.1 | Create test file for session store | `src/store/__tests__/session.store.test.ts` | ⬜ |
| 3.2.2 | Test session persistence | `src/store/__tests__/session.store.test.ts` | ⬜ |

---

## Phase 4: Documentation (P4)

### 4.1 — Store API Documentation
| ID | Task | File | Status |
|----|------|------|--------|
| 4.1.1 | Add JSDoc to DAW store interface | `src/store/daw.store.ts` | ⬜ |
| 4.1.2 | Add JSDoc to useDAWStore export | `src/store/daw.store.ts` | ⬜ |
| 4.1.3 | Add JSDoc to FloatingControls | `src/components/immersive/FloatingControls.tsx` | ⬜ |

### 4.2 — README Enhancements
| ID | Task | File | Status |
|----|------|------|--------|
| 4.2.1 | Add architecture diagram to README | `README.md` | ⬜ |
| 4.2.2 | Add contributing guidelines | `README.md` | ⬜ |
| 4.2.3 | Add changelog section | `README.md` | ⬜ |

---

## Phase 5: Code Quality (P5)

### 5.1 — Store Optimization
| ID | Task | File | Status |
|----|------|------|--------|
| 5.1.1 | Review all store selectors for optimization | `src/**/*.tsx` | ⬜ |
| 5.1.2 | Add memoization where needed | Various | ⬜ |

### 5.2 — Error Handling Improvements
| ID | Task | File | Status |
|----|------|------|--------|
| 5.2.1 | Add error boundary to audio engine initialization | `src/audio/audioEngine.ts` | ⬜ |
| 5.2.2 | Add fallback UI for audio unavailable | `src/pages/Waveform.tsx` | ⬜ |

---

## Summary

| Phase | Tasks | Priority |
|-------|-------|----------|
| Phase 1: Component Tests | 10 | 🟡 High |
| Phase 2: Lazy Loading | 3 | 🟢 Low |
| Phase 3: Store Tests | 4 | 🟡 High |
| Phase 4: Documentation | 6 | 🟢 Low |
| Phase 5: Code Quality | 5 | 🟢 Low |
| **Total** | **28** | |

---

*Tasks generated from review2.md audit findings.*
