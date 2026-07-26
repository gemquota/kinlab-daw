# VOID — Audiovisual Synthesizer

A real-time audiovisual synthesizer built with React, TypeScript, and Web Audio API. Create immersive audio experiences with procedural visualization.

## Features

- 🎵 **Real-time synthesis** — Oscillator-based audio with effects chain (reverb, delay, compression)
- 🎨 **Immersive canvas** — Fullscreen WebGL visualization with particle effects
- 🎛️ **Transport controls** — Play/pause, BPM, volume, pattern selection
- 🎹 **Techno patterns** — Pre-built patterns (Filthy Techno, Minimal, Industrial, Acid, Rumble)
- 🔊 **Audio engine** — Web Audio API with filters, panning, and effects routing

## Tech Stack

- **React 19** with TypeScript
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Web Audio API** for synthesis
- **Canvas API** for visualization

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd kinlab-daw

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Production build
npm run preview    # Preview production build
npm run test       # Run tests
npm run test:run   # Run tests once
npm run lint       # Run linter
npm run format     # Format code
```

## Usage

1. **Start playback** — Click the play button or press `Space`
2. **Adjust BPM** — Use +/- buttons or type in the BPM field (60-200)
3. **Change volume** — Drag the volume slider
4. **Switch patterns** — Click the pattern name to cycle through presets
5. **Visualize** — Watch the canvas respond to audio in real-time

## Architecture

```
src/
├── app/           # App shell, router, providers
├── audio/         # Web Audio API engine
├── components/    # React components
│   ├── common/    # Shared components (ErrorFallback, LoadingSpinner)
│   ├── daw/       # DAW-specific components
│   ├── immersive/ # Canvas and floating controls
│   └── layout/    # Layout components (TopToolbar)
├── hooks/         # Custom React hooks
├── pages/         # Route pages (Waveform)
├── store/         # Zustand state management
└── utils/         # Utility functions
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `Escape` | Close panel |

## State Management

The app uses Zustand for state management with the following stores:

- **DAW Store** — Playback, tracks, patterns, BPM
- **Settings Store** — UI preferences
- **Session Store** — Session tracking
- **Theme Store** — Light/dark mode

### Using Store Selectors

For optimal performance, use individual selectors:

```tsx
// ✅ Good — only re-renders when 'playing' changes
const playing = useDAWStore((s) => s.playing);
const setPlaying = useDAWStore((s) => s.setPlaying);

// ❌ Bad — re-renders on every state change
const daw = useDAWStore();
```

## Testing

The project includes unit tests for:
- Store logic
- Audio engine
- Custom hooks
- UI components

Run tests with:
```bash
npm run test:run
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests to ensure they pass
6. Submit a pull request

## Changelog

### v0.2.0 (2026-07-26)

- **Performance**: Fixed redundant store selectors in Waveform and FloatingControls
- **Error Handling**: Added ErrorBoundary with ErrorFallback UI component
- **Accessibility**: Added ARIA labels to all interactive controls
- **Security**: Added Content-Security-Policy meta tag to index.html
- **Testing**: Added test suite for audio engine, hooks, stores, and components
- **Loading**: Implemented React.lazy code splitting with Suspense fallback
- **Documentation**: Added JSDoc to audio engine, store, and components

## License

MIT
