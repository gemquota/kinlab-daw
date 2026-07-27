# VOID — Dev Tasks

**84 unique steps across 2 legs**

---

## Leg 1 — Foundation & Stability

### Phase 1 — Code Quality & Build Health

#### Stage 1 — TypeScript & Build

##### Batch 1 — TS Error Resolution
[x] Run tsc --noEmit and catalog all errors — 11111
[x] Fix audio engine type errors — 11112
[x] Fix store type errors (Zustand generics) — 11113
[x] Fix component prop type mismatches — 11114
[x] Verify clean tsc --noEmit with zero errors — 11115
✅ 111 — Batch 1 — COMPLETE

##### Batch 2 — Lint & Format
[x] Run eslint and catalog all warnings/errors — 11121
[x] Fix critical lint errors (hooks, imports) — 11122
[x] Fix warnings (unused vars, exhaustive deps) — 11123
[x] Run prettier on entire src/ tree — 11124
✅ 112 — Batch 2 — COMPLETE

##### Batch 3 — Build Pipeline
[x] Verify vite build produces clean output — 11131
[x] Verify GitHub Actions deploy workflow works — 11132
[x] Test production build loads in browser — 11133
[x] Verify dist/ output is under 500KB gzipped — 11134
[x] Add build size check to CI — 11135
✅ 113 — Batch 3 — COMPLETE

#### Stage 2 — Testing

##### Batch 4 — Test Repair
[x] Run vitest and catalog all failures — 11141
[x] Fix audio engine unit tests — 11142
[x] Fix store unit tests (Zustand mock patterns) — 11143
[x] Fix component render tests (React 19 compat) — 11144
[x] Verify all tests pass: vitest run — 11145
✅ 114 — Batch 4 — COMPLETE

##### Batch 5 — Test Coverage
[x] Add visual engine unit tests (6 modes) — 11151
[x] Add gesture engine unit tests — 11152
[x] Add interaction manager unit tests — 11153
[x] Add drumSynth edge case tests — 11154
[x] Achieve >80% line coverage on src/audio/ — 11155
✅ 115 — Batch 5 — COMPLETE

### Phase 2 — Architecture Cleanup

#### Stage 1 — State Management

##### Batch 6 — Store Audit
[x] Audit all 14 Zustand stores for redundancy — 11211
[x] Remove dead visualization.store (no production imports) — 11212
[x] Remove dead session.store (no production imports) — 11213
[x] Remove 11 dead stores (visualization, session, encyclopedia, export, history, presets, settings, simulator, taylor, ui, padGrid) — 11214
[x] Verify persist middleware works after store cleanup — 11215
✅ 116 — Batch 6 — COMPLETE

##### Batch 7 — Store Selectors
[x] Audit all useDAWStore() calls for selector leaks — 11221
[x] Fix selector leaks in Waveform.tsx — 11222
[x] Fix selector leaks in FloatingControls.tsx — 11223
[x] Fix selector leaks in TransportBar.tsx — 11224
[x] Add selector perf test (re-render count) — 11225
✅ 117 — Batch 7 — COMPLETE

#### Stage 2 — Component Architecture

##### Batch 8 — Component Audit
[x] Audit component tree for prop drilling — 11231
[x] Extract shared hooks from duplicated logic — 11232
[x] Consolidate duplicate CSS classes — 11233
[x] Remove dead/unused components — 11234
[x] Verify no circular dependencies in imports — 11235
✅ 118 — Batch 8 — COMPLETE

##### Batch 9 — Error Handling
[x] Add ErrorBoundary to audio engine init — 11241
[x] Add ErrorBoundary to visual canvas — 11242
[x] Add try/catch to Web Audio API calls — 11243
[x] Add user-facing error toasts for failures — 11244
[x] Test error recovery (disconnect/reconnect) — 11245
✅ 119 — Batch 9 — COMPLETE

---

## Leg 2 — Features & Polish

### Phase 1 — Audio Enhancements

#### Stage 1 — Sound Engine

##### Batch 10 — Synth Expansion
[ ] Add synth voice (saw/square/sine oscillator) — 12111
[ ] Add ADSR envelope to synth voice — 12112
[ ] Add filter cutoff/Q per-voice — 12113
[ ] Add pitch bend / glide control — 12114
[ ] Wire synth to instrument grid pads — 12115
✅ 121 — Batch 10 — COMPLETE

##### Batch 11 — Effects Enhancement
[ ] Add compressor threshold/ratio/attack/release — 12121
[ ] Add EQ (3-band) to master chain — 12122
[ ] Add phaser/chorus effect module — 12123
[ ] Add per-drum filter (not just master) — 12124
[ ] Add sidechain compression (kick → bass) — 12125
✅ 122 — Batch 11 — COMPLETE

#### Stage 2 — Sequencer

##### Batch 12 — Step Sequencer
[ ] Fix step sequencer UI rendering bugs — 12131
[ ] Add velocity editing per step — 12132
[ ] Add swing/shuffle control — 12133
[ ] Add pattern chain (loop multiple patterns) — 12134
[ ] Add randomize pattern button — 12135
✅ 123 — Batch 12 — COMPLETE

##### Batch 13 — Pattern System
[ ] Add user pattern save/load (localStorage) — 12141
[ ] Add pattern import/export (JSON) — 12142
[ ] Add 5 more built-in patterns (DnB, Ambient) — 12143
[ ] Add pattern morphing (interpolate two patterns) — 12144
[ ] Add pattern name editing — 12145
✅ 124 — Batch 13 — COMPLETE

### Phase 2 — Visual & UX Polish

#### Stage 1 — Visual Engine

##### Batch 14 — Visual Performance
[ ] Profile visual engine frame times — 12211
[ ] Optimize particle system (Object pooling) — 12212
[ ] Add low-power mode (reduce particle count) — 12213
[ ] Add FPS counter to UI — 12214
[ ] Verify 60fps on mobile devices — 12215
✅ 125 — Batch 14 — COMPLETE

##### Batch 15 — Visual Modes
[ ] Add 7th mode: "Waveform" (oscilloscope style) — 12221
[ ] Add 8th mode: "Matrix" (rain/grid) — 12222
[ ] Add mode transition animations (crossfade) — 12223
[ ] Add preset visual configs per pattern — 12224
[ ] Add randomize visual params button — 12225
✅ 126 — Batch 15 — COMPLETE

#### Stage 2 — UI/UX

##### Batch 16 — Accessibility
[ ] Add ARIA labels to all interactive elements — 12231
[ ] Add keyboard navigation for mixer controls — 12232
[ ] Add screen reader announcements for state — 12233
[ ] Add high-contrast mode toggle — 12234
[ ] Test with screen reader (NVDA/VoiceOver) — 12235
✅ 127 — Batch 16 — COMPLETE

##### Batch 17 — Mobile & Responsive
[ ] Audit layout at 375px, 768px, 1024px widths — 12241
[ ] Fix overflow/scroll issues on small screens — 12242
[ ] Optimize touch targets (min 44px) — 12243
[ ] Add haptic feedback on pad triggers (mobile) — 12244
[ ] Test full flow on iOS Safari + Android Chrome — 12245
✅ 128 — Batch 17 — COMPLETE
