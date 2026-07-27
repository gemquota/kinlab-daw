# VOID — Audiovisual Synthesizer LPSBS Plan

## Numbering: LPSBS (Leg.Phase.Stage.Batch.Step)

Each step gets a 5-digit code. A digit may only increment when every
digit to its right has completed (reached its max value for that batch).

    Step 1→2→3→4→5 (max)
         │         │
         │    Batch increments, Step resets to 1
         │         │
    Batch 1→2→3→4→5 (max)
         │         │
         │    Stage increments, Batch+Step reset to 1
         │         │
    Stage 1→2 (max)
         │         │
         │    Phase increments, Stage+Batch+Step reset to 1
         │         │
    Phase 1→2 (max)
         │         │
         │    Leg increments, all right digits reset to 1

---

## Leg 1 — Foundation & Stability

### Phase 1 — Code Quality & Build Health

#### Stage 1 — TypeScript & Build

##### Batch 1 — TS Error Resolution (5 steps)

| Code  | Title                                          | Status |
|-------|------------------------------------------------|--------|
| 11111 | Audit all TS errors in src/ with tsc --noEmit  | [ ]    |
| 11112 | Fix audio engine type errors                   | [ ]    |
| 11113 | Fix store type errors (Zustand generics)       | [ ]    |
| 11114 | Fix component prop type mismatches             | [ ]    |
| 11115 | Verify clean tsc --noEmit with zero errors     | [ ]    |

##### Batch 2 — Lint & Format (4 steps)

| Code  | Title                                          | Status |
|-------|------------------------------------------------|--------|
| 11121 | Run eslint and catalog all warnings/errors     | [ ]    |
| 11122 | Fix critical lint errors (hooks, imports)      | [ ]    |
| 11123 | Fix warnings (unused vars, exhaustive deps)    | [ ]    |
| 11124 | Run prettier on entire src/ tree               | [ ]    |

##### Batch 3 — Build Pipeline (5 steps)

| Code  | Title                                          | Status |
|-------|------------------------------------------------|--------|
| 11131 | Verify vite build produces clean output        | [ ]    |
| 11132 | Verify GitHub Actions deploy workflow works     | [ ]    |
| 11133 | Test production build loads in browser          | [ ]    |
| 11134 | Verify dist/ output is under 500KB gzipped     | [ ]    |
| 11135 | Add build size check to CI                     | [ ]    |

#### Stage 2 — Testing

##### Batch 4 — Test Repair (5 steps)

| Code  | Title                                          | Status |
|-------|------------------------------------------------|--------|
| 11141 | Run vitest and catalog all failures            | [ ]    |
| 11142 | Fix audio engine unit tests                    | [ ]    |
| 11143 | Fix store unit tests (Zustand mock patterns)   | [ ]    |
| 11144 | Fix component render tests (React 19 compat)   | [ ]    |
| 11145 | Verify all tests pass: vitest run              | [ ]    |

##### Batch 5 — Test Coverage (5 steps)

| Code  | Title                                          | Status |
|-------|------------------------------------------------|--------|
| 11151 | Add visual engine unit tests (6 modes)         | [ ]    |
| 11152 | Add gesture engine unit tests                  | [ ]    |
| 11153 | Add interaction manager unit tests             | [ ]    |
| 11154 | Add drumSynth edge case tests                  | [ ]    |
| 11155 | Achieve >80% line coverage on src/audio/       | [ ]    |

### Phase 2 — Architecture Cleanup

#### Stage 1 — State Management

##### Batch 6 — Store Audit (5 steps)

| Code  | Title                                          | Status |
|-------|------------------------------------------------|--------|
| 11211 | Audit all 14 Zustand stores for redundancy     | [ ]    |
| 11212 | Merge visual.store.ts and visualization.store.ts | [ ]  |
| 11213 | Merge session.store.ts into daw.store.ts       | [ ]    |
| 11214 | Remove unused stores (export, encyclopedia)    | [ ]    |
| 11215 | Verify persist middleware works after merges    | [ ]    |

##### Batch 7 — Store Selectors (5 steps)

| Code  | Title                                          | Status |
|-------|------------------------------------------------|--------|
| 11221 | Audit all useDAWStore() calls for selector leaks | [ ]  |
| 11222 | Fix selector leaks in Waveform.tsx             | [ ]    |
| 11223 | Fix selector leaks in FloatingControls.tsx     | [ ]    |
| 11224 | Fix selector leaks in TransportBar.tsx         | [ ]    |
| 11225 | Add selector perf test (re-render count)       | [ ]    |

#### Stage 2 — Component Architecture

##### Batch 8 — Component Audit (5 steps)

| Code  | Title                                          | Status |
|-------|------------------------------------------------|--------|
| 11231 | Audit component tree for prop drilling         | [ ]    |
| 11232 | Extract shared hooks from duplicated logic     | [ ]    |
| 11233 | Consolidate duplicate CSS classes              | [ ]    |
| 11234 | Remove dead/unused components                  | [ ]    |
| 11235 | Verify no circular dependencies in imports     | [ ]    |

##### Batch 9 — Error Handling (5 steps)

| Code  | Title                                          | Status |
|-------|------------------------------------------------|--------|
| 11241 | Add ErrorBoundary to audio engine init         | [ ]    |
| 11242 | Add ErrorBoundary to visual canvas             | [ ]    |
| 11243 | Add try/catch to Web Audio API calls           | [ ]    |
| 11244 | Add user-facing error toasts for failures      | [ ]    |
| 11245 | Test error recovery (disconnect/reconnect)     | [ ]    |

---

## Leg 2 — Features & Polish

### Phase 1 — Audio Enhancements

#### Stage 1 — Sound Engine

##### Batch 10 — Synth Expansion (5 steps)

| Code  | Title                                          | Status |
|-------|------------------------------------------------|--------|
| 12111 | Add synth voice (saw/square/sine oscillator)   | [ ]    |
| 12112 | Add ADSR envelope to synth voice               | [ ]    |
| 12113 | Add filter cutoff/Q per-voice                  | [ ]    |
| 12114 | Add pitch bend / glide control                 | [ ]    |
| 12115 | Wire synth to instrument grid pads             | [ ]    |

##### Batch 11 — Effects Enhancement (5 steps)

| Code  | Title                                          | Status |
|-------|------------------------------------------------|--------|
| 12121 | Add compressor threshold/ratio/attack/release  | [ ]    |
| 12122 | Add EQ (3-band) to master chain                | [ ]    |
| 12123 | Add phaser/chorus effect module                | [ ]    |
| 12124 | Add per-drum filter (not just master)          | [ ]    |
| 12125 | Add sidechain compression (kick → bass)        | [ ]    |

#### Stage 2 — Sequencer

##### Batch 12 — Step Sequencer (5 steps)

| Code  | Title                                          | Status |
|-------|------------------------------------------------|--------|
| 12131 | Fix step sequencer UI rendering bugs           | [ ]    |
| 12132 | Add velocity editing per step                  | [ ]    |
| 12133 | Add swing/shuffle control                      | [ ]    |
| 12134 | Add pattern chain (loop multiple patterns)     | [ ]    |
| 12135 | Add randomize pattern button                   | [ ]    |

##### Batch 13 — Pattern System (5 steps)

| Code  | Title                                          | Status |
|-------|------------------------------------------------|--------|
| 12141 | Add user pattern save/load (localStorage)      | [ ]    |
| 12142 | Add pattern import/export (JSON)               | [ ]    |
| 12143 | Add 5 more built-in patterns (DnB, Ambient)   | [ ]    |
| 12144 | Add pattern morphing (interpolate two patterns)| [ ]    |
| 12145 | Add pattern name editing                       | [ ]    |

### Phase 2 — Visual & UX Polish

#### Stage 1 — Visual Engine

##### Batch 14 — Visual Performance (5 steps)

| Code  | Title                                          | Status |
|-------|------------------------------------------------|--------|
| 12211 | Profile visual engine frame times              | [ ]    |
| 12112 | Optimize particle system (Object池 pooling)    | [ ]    |
| 12213 | Add low-power mode (reduce particle count)     | [ ]    |
| 12214 | Add FPS counter to UI                          | [ ]    |
| 12215 | Verify 60fps on mobile devices                 | [ ]    |

##### Batch 15 — Visual Modes (5 steps)

| Code  | Title                                          | Status |
|-------|------------------------------------------------|--------|
| 12221 | Add 7th mode: "Waveform" (oscilloscope style)  | [ ]    |
| 12222 | Add 8th mode: "Matrix" (rain/grid)             | [ ]    |
| 12223 | Add mode transition animations (crossfade)     | [ ]    |
| 12224 | Add preset visual configs per pattern          | [ ]    |
| 12225 | Add randomize visual params button             | [ ]    |

#### Stage 2 — UI/UX

##### Batch 16 — Accessibility (5 steps)

| Code  | Title                                          | Status |
|-------|------------------------------------------------|--------|
| 12231 | Add ARIA labels to all interactive elements    | [ ]    |
| 12232 | Add keyboard navigation for mixer controls     | [ ]    |
| 12233 | Add screen reader announcements for state      | [ ]    |
| 12234 | Add high-contrast mode toggle                  | [ ]    |
| 12235 | Test with screen reader (NVDA/VoiceOver)       | [ ]    |

##### Batch 17 — Mobile & Responsive (5 steps)

| Code  | Title                                          | Status |
|-------|------------------------------------------------|--------|
| 12241 | Audit layout at 375px, 768px, 1024px widths    | [ ]    |
| 12242 | Fix overflow/scroll issues on small screens    | [ ]    |
| 12243 | Optimize touch targets (min 44px)              | [ ]    |
| 12244 | Add haptic feedback on pad triggers (mobile)   | [ ]    |
| 12245 | Test full flow on iOS Safari + Android Chrome  | [ ]    |

---

## Summary

| Leg | Phase | Stage | Batch | Steps | Total |
|-----|-------|-------|-------|-------|-------|
| 1   | 1     | 1     | 1-3   | 14    | 14    |
| 1   | 1     | 2     | 4-5   | 10    | 10    |
| 1   | 2     | 1     | 6-7   | 10    | 10    |
| 1   | 2     | 2     | 8-9   | 10    | 10    |
| 2   | 1     | 1     | 10-11 | 10    | 10    |
| 2   | 1     | 2     | 12-13 | 10    | 10    |
| 2   | 2     | 1     | 14-15 | 10    | 10    |
| 2   | 2     | 2     | 16-17 | 10    | 10    |
|     |       |       |       | **Total** | **84** |
