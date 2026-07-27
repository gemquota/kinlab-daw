# VOID — Path Breadcrumbs

**84 unique steps across 2 legs**

---

## Leg 1 — Foundation & Stability

### Phase 1 — Code Quality & Build Health

#### Stage 1 — TypeScript & Build

##### Batch 1 — TS Error Resolution
✓ 11111 — Audit all TS errors
✓ 11112 — Fix audio engine type errors
✓ 11113 — Fix store type errors
✓ 11114 — Fix component prop type mismatches
✓ 11115 — Verify clean tsc --noEmit

##### Batch 2 — Lint & Format
✓ 11121 — Run eslint catalog
✓ 11122 — Fix critical lint errors
✓ 11123 — Fix warnings
✓ 11124 — Run prettier

##### Batch 3 — Build Pipeline
✓ 11131 — Verify vite build
✓ 11132 — Verify GitHub Actions deploy
✓ 11133 — Test production build in browser
✓ 11134 — Verify dist/ under 500KB gzipped
✓ 11135 — Add build size check to CI

#### Stage 2 — Testing

##### Batch 4 — Test Repair
✓ 11141 — Run vitest catalog failures
✓ 11142 — Fix audio engine tests
✓ 11143 — Fix store tests
✓ 11144 — Fix component render tests
✓ 11145 — Verify all tests pass

##### Batch 5 — Test Coverage
✓ 11151 — Add visual engine tests
✓ 11152 — Add gesture engine tests
✓ 11153 — Add interaction manager tests
✓ 11154 — Add drumSynth edge case tests
✓ 11155 — Achieve >80% coverage src/audio/

### Phase 2 — Architecture Cleanup

#### Stage 1 — State Management

##### Batch 6 — Store Audit
✓ 11211 — Audit all 14 Zustand stores
✓ 11212 — Merge visual + visualization stores
✓ 11213 — Merge session into daw store
✓ 11214 — Remove unused stores
✓ 11215 — Verify persist middleware

##### Batch 7 — Store Selectors
✓ 11221 — Audit selector leaks
✓ 11222 — Fix Waveform.tsx selectors
✓ 11223 — Fix FloatingControls.tsx selectors
✓ 11224 — Fix TransportBar.tsx selectors
✓ 11225 — Add selector perf test

#### Stage 2 — Component Architecture

##### Batch 8 — Component Audit
✓ 11231 — Audit prop drilling
✓ 11232 — Extract shared hooks
✓ 11233 — Consolidate duplicate CSS
✓ 11234 — Remove dead components
✓ 11235 — Verify no circular deps

##### Batch 9 — Error Handling
✓ 11241 — Add ErrorBoundary audio init
✓ 11242 — Add ErrorBoundary visual canvas
✓ 11243 — Add try/catch Web Audio calls
✓ 11244 — Add user-facing error toasts
✓ 11245 — Test error recovery

---

## Leg 2 — Features & Polish

### Phase 1 — Audio Enhancements

#### Stage 1 — Sound Engine

##### Batch 10 — Synth Expansion
— 12111 — Add synth voice oscillator
— 12112 — Add ADSR envelope
— 12113 — Add filter per-voice
— 12114 — Add pitch bend / glide
— 12115 — Wire synth to pads

##### Batch 11 — Effects Enhancement
— 12121 — Add compressor controls
— 12122 — Add 3-band EQ
— 12123 — Add phaser/chorus
— 12124 — Add per-drum filter
— 12125 — Add sidechain compression

#### Stage 2 — Sequencer

##### Batch 12 — Step Sequencer
— 12131 — Fix sequencer UI bugs
— 12132 — Add velocity editing
— 12133 — Add swing/shuffle
— 12134 — Add pattern chain
— 12135 — Add randomize pattern

##### Batch 13 — Pattern System
— 12141 — Add user pattern save/load
— 12142 — Add pattern import/export
— 12143 — Add 5 more patterns
— 12144 — Add pattern morphing
— 12145 — Add pattern name editing

### Phase 2 — Visual & UX Polish

#### Stage 1 — Visual Engine

##### Batch 14 — Visual Performance
— 12211 — Profile frame times
— 12212 — Optimize particle pooling
— 12213 — Add low-power mode
— 12214 — Add FPS counter
— 12215 — Verify 60fps mobile

##### Batch 15 — Visual Modes
— 12221 — Add "Waveform" mode
— 12222 — Add "Matrix" mode
— 12223 — Add mode transition animations
— 12224 — Add preset visual configs
— 12225 — Add randomize visual params

#### Stage 2 — UI/UX

##### Batch 16 — Accessibility
— 12231 — Add ARIA labels
— 12232 — Add keyboard navigation
— 12233 — Add screen reader announcements
— 12234 — Add high-contrast mode
— 12235 — Test with screen reader

##### Batch 17 — Mobile & Responsive
— 12241 — Audit layout at breakpoints
— 12242 — Fix overflow/scroll issues
— 12243 — Optimize touch targets
— 12244 — Add haptic feedback
— 12245 — Test on iOS Safari + Android Chrome
