# KinLab DAW — Development Plan 4

**Generated from:** review4.md  
**Date:** 2026-07-26  
**Total Tasks:** 40  

---

## Phase 1: Accessibility (P1)

### 1.1 — Button ARIA Labels
| ID | Task | File | Status |
|----|------|------|--------|
| 1.1.1 | Add aria-label to MixerPanel mute buttons | `src/components/immersive/FloatingControls.tsx` | ✅ |
| 1.1.2 | Add aria-label to MixerPanel sliders | `src/components/immersive/FloatingControls.tsx` | ✅ |
| 1.1.3 | Add aria-label to EffectsPanel sliders | `src/components/immersive/FloatingControls.tsx` | ✅ |
| 1.1.4 | Add aria-label to PanelToggle buttons | `src/components/immersive/FloatingControls.tsx` | ✅ |
| 1.1.5 | Add aria-label to VisualModeSelector buttons | `src/components/immersive/ImmersiveCanvas.tsx` | ✅ |
| 1.1.6 | Add aria-label to TopToolbar buttons | `src/components/layout/TopToolbar.tsx` | ✅ |
| 1.1.7 | Add aria-label to HelpModal close button | `src/components/common/HelpModal.tsx` | ✅ |
| 1.1.8 | Add aria-label to CommandPalette inputs | `src/components/common/CommandPalette.tsx` | ✅ |
| 1.1.9 | Add aria-label to Sidebar navigation | `src/components/layout/Sidebar.tsx` | ✅ |
| 1.1.10 | Add aria-label to StatusBar elements | `src/components/layout/StatusBar.tsx` | ✅ |

### 1.2 — Input ARIA Labels
| ID | Task | File | Status |
|----|------|------|--------|
| 1.2.1 | Add aria-label to VisualDrawer range inputs | `src/components/immersive/VisualDrawer.tsx` | ✅ |
| 1.2.2 | Add aria-label to WaveformControls inputs | `src/components/simulator/WaveformControls.tsx` | ✅ |
| 1.2.3 | Add aria-label to FileExplorer inputs | `src/components/common/FileExplorer.tsx` | ✅ |

---

## Phase 2: Math Engine Tests (P2)

### 2.1 — Core Calculus Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 2.1.1 | Create test for derivative engine | `src/math/__tests__/derivative.test.ts` | ✅ |
| 2.1.2 | Create test for integral engine | `src/math/__tests__/integral.test.ts` | ✅ |
| 2.1.3 | Create test for chainRule engine | `src/math/__tests__/chainRule.test.ts` | ✅ |
| 2.1.4 | Create test for finiteDifference engine | `src/math/__tests__/finiteDifference.test.ts` | ✅ |

### 2.2 — Kinematics Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 2.2.1 | Create test for motion engine | `src/math/__tests__/motion.test.ts` | ✅ |
| 2.2.2 | Create test for units engine | `src/math/__tests__/units.test.ts` | ✅ |

---

## Phase 3: Store Tests (P3)

### 3.1 — Visual Store Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 3.1.1 | Create test for visual store | `src/store/__tests__/visual.store.test.ts` | ✅ |
| 3.1.2 | Test setParam, resetParams | `src/store/__tests__/visual.store.test.ts` | ✅ |

### 3.2 — Waveform Store Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 3.2.1 | Create test for waveform store | `src/store/__tests__/waveform.store.test.ts` | ✅ |
| 3.2.2 | Test preset selection | `src/store/__tests__/waveform.store.test.ts` | ✅ |

### 3.3 — Presets Store Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 3.3.1 | Create test for presets store | `src/store/__tests__/presets.store.test.ts` | ✅ |
| 3.3.2 | Test preset CRUD | `src/store/__tests__/presets.store.test.ts` | ✅ |

---

## Phase 4: Data Module Tests (P4)

### 4.1 — Validation Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 4.1.1 | Create test for validation module | `src/data/__tests__/validation.test.ts` | ✅ |
| 4.1.2 | Test input validation functions | `src/data/__tests__/validation.test.ts` | ✅ |

### 4.2 — Transformer Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 4.2.1 | Create test for transformers | `src/data/__tests__/transformers.test.ts` | ✅ |
| 4.2.2 | Test coefficient conversion | `src/data/__tests__/transformers.test.ts` | ✅ |

---

## Phase 5: Component Tests (P5)

### 5.1 — UI Primitive Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 5.1.1 | Create test for Button component | `src/components/ui/__tests__/Button.test.tsx` | ✅ |
| 5.1.2 | Create test for Card component | `src/components/ui/__tests__/Card.test.tsx` | ✅ |
| 5.1.3 | Create test for Slider component | `src/components/ui/__tests__/Slider.test.tsx` | ✅ |
| 5.1.4 | Create test for Toggle component | `src/components/ui/__tests__/Toggle.test.tsx` | ✅ |

### 5.2 — Layout Component Tests
| ID | Task | File | Status |
|----|------|------|--------|
| 5.2.1 | Create test for Sidebar | `src/components/layout/__tests__/Sidebar.test.tsx` | ✅ |
| 5.2.2 | Create test for StatusBar | `src/components/layout/__tests__/StatusBar.test.tsx` | ✅ |

---

## Summary

| Phase | Tasks | Priority |
|-------|-------|----------|
| Phase 1: Accessibility | 13 | 🔴 High |
| Phase 2: Math Engine Tests | 6 | 🔴 High |
| Phase 3: Store Tests | 6 | 🟡 Medium |
| Phase 4: Data Module Tests | 4 | 🟡 Medium |
| Phase 5: Component Tests | 6 | 🟢 Low |
| **Total** | **35** | |

