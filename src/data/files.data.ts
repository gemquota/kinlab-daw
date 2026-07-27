export type FileNodeType = "file" | "folder";

export interface FileNode {
  name: string;
  type: FileNodeType;
  path: string;
  /** Extension without dot — undefined for folders */
  ext?: string;
  /** Byte size estimate (for display) */
  size?: number;
  children?: FileNode[];
}

/** Static project tree — mirrors the actual src/ layout */
export const PROJECT_FILES: FileNode = {
  "name": "src",
  "type": "folder",
  "path": "src",
  "children": [
    {
      "name": "app",
      "type": "folder",
      "path": "src/app",
      "children": [
        {
          "name": "App.tsx",
          "type": "file",
          "path": "src/app/App.tsx",
          "ext": "tsx",
          "size": 158
        },
        {
          "name": "AppProviders.tsx",
          "type": "file",
          "path": "src/app/AppProviders.tsx",
          "ext": "tsx",
          "size": 604
        },
        {
          "name": "AppShell.tsx",
          "type": "file",
          "path": "src/app/AppShell.tsx",
          "ext": "tsx",
          "size": 725
        },
        {
          "name": "boot.ts",
          "type": "file",
          "path": "src/app/boot.ts",
          "ext": "ts",
          "size": 432
        },
        {
          "name": "config.ts",
          "type": "file",
          "path": "src/app/config.ts",
          "ext": "ts",
          "size": 562
        },
        {
          "name": "ErrorBoundary.tsx",
          "type": "file",
          "path": "src/app/ErrorBoundary.tsx",
          "ext": "tsx",
          "size": 1770
        },
        {
          "name": "featureFlags.ts",
          "type": "file",
          "path": "src/app/featureFlags.ts",
          "ext": "ts",
          "size": 1617
        },
        {
          "name": "performance.ts",
          "type": "file",
          "path": "src/app/performance.ts",
          "ext": "ts",
          "size": 1747
        },
        {
          "name": "router.tsx",
          "type": "file",
          "path": "src/app/router.tsx",
          "ext": "tsx",
          "size": 1282
        }
      ]
    },
    {
      "name": "assets",
      "type": "folder",
      "path": "src/assets",
      "children": [
        {
          "name": "hero.png",
          "type": "file",
          "path": "src/assets/hero.png",
          "ext": "png",
          "size": 13057
        },
        {
          "name": "vite.svg",
          "type": "file",
          "path": "src/assets/vite.svg",
          "ext": "svg",
          "size": 8709
        }
      ]
    },
    {
      "name": "audio",
      "type": "folder",
      "path": "src/audio",
      "children": [
        {
          "name": "audioEngine.ts",
          "type": "file",
          "path": "src/audio/audioEngine.ts",
          "ext": "ts",
          "size": 11739
        },
        {
          "name": "drumSynth.ts",
          "type": "file",
          "path": "src/audio/drumSynth.ts",
          "ext": "ts",
          "size": 8272
        },
        {
          "name": "gestureEngine.ts",
          "type": "file",
          "path": "src/audio/gestureEngine.ts",
          "ext": "ts",
          "size": 5588
        },
        {
          "name": "interactionManager.ts",
          "type": "file",
          "path": "src/audio/interactionManager.ts",
          "ext": "ts",
          "size": 6068
        },
        {
          "name": "technoSequencer.ts",
          "type": "file",
          "path": "src/audio/technoSequencer.ts",
          "ext": "ts",
          "size": 5555
        }
      ]
    },
    {
      "name": "components",
      "type": "folder",
      "path": "src/components",
      "children": [
        {
          "name": "common",
          "type": "folder",
          "path": "src/components/common",
          "children": [
            {
              "name": "Breadcrumbs.tsx",
              "type": "file",
              "path": "src/components/common/Breadcrumbs.tsx",
              "ext": "tsx",
              "size": 860
            },
            {
              "name": "CommandPalette.tsx",
              "type": "file",
              "path": "src/components/common/CommandPalette.tsx",
              "ext": "tsx",
              "size": 6516
            },
            {
              "name": "ErrorFallback.tsx",
              "type": "file",
              "path": "src/components/common/ErrorFallback.tsx",
              "ext": "tsx",
              "size": 1009
            },
            {
              "name": "FileExplorer.tsx",
              "type": "file",
              "path": "src/components/common/FileExplorer.tsx",
              "ext": "tsx",
              "size": 11859
            },
            {
              "name": "HelpModal.tsx",
              "type": "file",
              "path": "src/components/common/HelpModal.tsx",
              "ext": "tsx",
              "size": 5731
            },
            {
              "name": "LoadingSpinner.tsx",
              "type": "file",
              "path": "src/components/common/LoadingSpinner.tsx",
              "ext": "tsx",
              "size": 541
            },
            {
              "name": "Notifications.tsx",
              "type": "file",
              "path": "src/components/common/Notifications.tsx",
              "ext": "tsx",
              "size": 3190
            }
          ]
        },
        {
          "name": "daw",
          "type": "folder",
          "path": "src/components/daw",
          "children": [
            {
              "name": "ArpeggioPanel.tsx",
              "type": "file",
              "path": "src/components/daw/ArpeggioPanel.tsx",
              "ext": "tsx",
              "size": 123
            },
            {
              "name": "MasterMeter.tsx",
              "type": "file",
              "path": "src/components/daw/MasterMeter.tsx",
              "ext": "tsx",
              "size": 122
            },
            {
              "name": "Mixer.tsx",
              "type": "file",
              "path": "src/components/daw/Mixer.tsx",
              "ext": "tsx",
              "size": 109
            },
            {
              "name": "PresetBrowser.tsx",
              "type": "file",
              "path": "src/components/daw/PresetBrowser.tsx",
              "ext": "tsx",
              "size": 126
            },
            {
              "name": "ProceduralPanel.tsx",
              "type": "file",
              "path": "src/components/daw/ProceduralPanel.tsx",
              "ext": "tsx",
              "size": 124
            },
            {
              "name": "StepSequencerUI.tsx",
              "type": "file",
              "path": "src/components/daw/StepSequencerUI.tsx",
              "ext": "tsx",
              "size": 128
            },
            {
              "name": "TrackLanes.tsx",
              "type": "file",
              "path": "src/components/daw/TrackLanes.tsx",
              "ext": "tsx",
              "size": 120
            },
            {
              "name": "TransportBar.tsx",
              "type": "file",
              "path": "src/components/daw/TransportBar.tsx",
              "ext": "tsx",
              "size": 120
            }
          ]
        },
        {
          "name": "immersive",
          "type": "folder",
          "path": "src/components/immersive",
          "children": [
            {
              "name": "FloatingControls.tsx",
              "type": "file",
              "path": "src/components/immersive/FloatingControls.tsx",
              "ext": "tsx",
              "size": 9666
            },
            {
              "name": "ImmersiveCanvas.tsx",
              "type": "file",
              "path": "src/components/immersive/ImmersiveCanvas.tsx",
              "ext": "tsx",
              "size": 5376
            },
            {
              "name": "InstrumentGrid.tsx",
              "type": "file",
              "path": "src/components/immersive/InstrumentGrid.tsx",
              "ext": "tsx",
              "size": 5799
            },
            {
              "name": "VisualDrawer.tsx",
              "type": "file",
              "path": "src/components/immersive/VisualDrawer.tsx",
              "ext": "tsx",
              "size": 5712
            }
          ]
        },
        {
          "name": "layout",
          "type": "folder",
          "path": "src/components/layout",
          "children": [
            {
              "name": "InspectorPanel.tsx",
              "type": "file",
              "path": "src/components/layout/InspectorPanel.tsx",
              "ext": "tsx",
              "size": 3549
            },
            {
              "name": "Sidebar.tsx",
              "type": "file",
              "path": "src/components/layout/Sidebar.tsx",
              "ext": "tsx",
              "size": 2762
            },
            {
              "name": "StatusBar.tsx",
              "type": "file",
              "path": "src/components/layout/StatusBar.tsx",
              "ext": "tsx",
              "size": 1288
            },
            {
              "name": "TopToolbar.tsx",
              "type": "file",
              "path": "src/components/layout/TopToolbar.tsx",
              "ext": "tsx",
              "size": 2499
            }
          ]
        },
        {
          "name": "simulator",
          "type": "folder",
          "path": "src/components/simulator",
          "children": [
            {
              "name": "WaveformCanvas.tsx",
              "type": "file",
              "path": "src/components/simulator/WaveformCanvas.tsx",
              "ext": "tsx",
              "size": 6856
            },
            {
              "name": "WaveformControls.tsx",
              "type": "file",
              "path": "src/components/simulator/WaveformControls.tsx",
              "ext": "tsx",
              "size": 13995
            }
          ]
        },
        {
          "name": "ui",
          "type": "folder",
          "path": "src/components/ui",
          "children": [
            {
              "name": "Badge.tsx",
              "type": "file",
              "path": "src/components/ui/Badge.tsx",
              "ext": "tsx",
              "size": 3691
            },
            {
              "name": "Button.tsx",
              "type": "file",
              "path": "src/components/ui/Button.tsx",
              "ext": "tsx",
              "size": 3570
            },
            {
              "name": "Card.tsx",
              "type": "file",
              "path": "src/components/ui/Card.tsx",
              "ext": "tsx",
              "size": 3651
            },
            {
              "name": "Divider.tsx",
              "type": "file",
              "path": "src/components/ui/Divider.tsx",
              "ext": "tsx",
              "size": 1500
            },
            {
              "name": "IconButton.tsx",
              "type": "file",
              "path": "src/components/ui/IconButton.tsx",
              "ext": "tsx",
              "size": 3621
            },
            {
              "name": "index.ts",
              "type": "file",
              "path": "src/components/ui/index.ts",
              "ext": "ts",
              "size": 901
            },
            {
              "name": "NumericInput.tsx",
              "type": "file",
              "path": "src/components/ui/NumericInput.tsx",
              "ext": "tsx",
              "size": 6621
            },
            {
              "name": "ProgressBar.tsx",
              "type": "file",
              "path": "src/components/ui/ProgressBar.tsx",
              "ext": "tsx",
              "size": 3254
            },
            {
              "name": "ScrollArea.tsx",
              "type": "file",
              "path": "src/components/ui/ScrollArea.tsx",
              "ext": "tsx",
              "size": 1648
            },
            {
              "name": "Skeleton.tsx",
              "type": "file",
              "path": "src/components/ui/Skeleton.tsx",
              "ext": "tsx",
              "size": 1093
            },
            {
              "name": "Slider.tsx",
              "type": "file",
              "path": "src/components/ui/Slider.tsx",
              "ext": "tsx",
              "size": 5189
            },
            {
              "name": "Toggle.tsx",
              "type": "file",
              "path": "src/components/ui/Toggle.tsx",
              "ext": "tsx",
              "size": 3054
            },
            {
              "name": "Tooltip.tsx",
              "type": "file",
              "path": "src/components/ui/Tooltip.tsx",
              "ext": "tsx",
              "size": 3712
            }
          ]
        }
      ]
    },
    {
      "name": "data",
      "type": "folder",
      "path": "src/data",
      "children": [
        {
          "name": "colors.data.ts",
          "type": "file",
          "path": "src/data/colors.data.ts",
          "ext": "ts",
          "size": 4315
        },
        {
          "name": "derivatives.data.ts",
          "type": "file",
          "path": "src/data/derivatives.data.ts",
          "ext": "ts",
          "size": 9276
        },
        {
          "name": "files.data.ts",
          "type": "file",
          "path": "src/data/files.data.ts",
          "ext": "ts",
          "size": 17570
        },
        {
          "name": "presets.data.ts",
          "type": "file",
          "path": "src/data/presets.data.ts",
          "ext": "ts",
          "size": 3201
        },
        {
          "name": "units.data.ts",
          "type": "file",
          "path": "src/data/units.data.ts",
          "ext": "ts",
          "size": 4032
        },
        {
          "name": "validation.ts",
          "type": "file",
          "path": "src/data/validation.ts",
          "ext": "ts",
          "size": 7177
        }
      ]
    },
    {
      "name": "hooks",
      "type": "folder",
      "path": "src/hooks",
      "children": [
        {
          "name": "index.ts",
          "type": "file",
          "path": "src/hooks/index.ts",
          "ext": "ts",
          "size": 69
        },
        {
          "name": "useAudioSync.ts",
          "type": "file",
          "path": "src/hooks/useAudioSync.ts",
          "ext": "ts",
          "size": 2879
        },
        {
          "name": "useDerivedState.ts",
          "type": "file",
          "path": "src/hooks/useDerivedState.ts",
          "ext": "ts",
          "size": 91
        },
        {
          "name": "usePipeline.ts",
          "type": "file",
          "path": "src/hooks/usePipeline.ts",
          "ext": "ts",
          "size": 91
        }
      ]
    },
    {
      "name": "lib",
      "type": "folder",
      "path": "src/lib",
      "children": [
        {
          "name": "theme",
          "type": "folder",
          "path": "src/lib/theme",
          "children": [
            {
              "name": "accessibility.ts",
              "type": "file",
              "path": "src/lib/theme/accessibility.ts",
              "ext": "ts",
              "size": 926
            },
            {
              "name": "index.ts",
              "type": "file",
              "path": "src/lib/theme/index.ts",
              "ext": "ts",
              "size": 389
            },
            {
              "name": "themes.ts",
              "type": "file",
              "path": "src/lib/theme/themes.ts",
              "ext": "ts",
              "size": 3667
            },
            {
              "name": "tokens.ts",
              "type": "file",
              "path": "src/lib/theme/tokens.ts",
              "ext": "ts",
              "size": 3525
            }
          ]
        },
        {
          "name": "cn.ts",
          "type": "file",
          "path": "src/lib/cn.ts",
          "ext": "ts",
          "size": 177
        },
        {
          "name": "index.ts",
          "type": "file",
          "path": "src/lib/index.ts",
          "ext": "ts",
          "size": 27
        }
      ]
    },
    {
      "name": "math",
      "type": "folder",
      "path": "src/math",
      "children": [
        {
          "name": "waveform",
          "type": "folder",
          "path": "src/math/waveform",
          "children": [
            {
              "name": "waveform.engine.ts",
              "type": "file",
              "path": "src/math/waveform/waveform.engine.ts",
              "ext": "ts",
              "size": 13715
            }
          ]
        },
        {
          "name": "index.ts",
          "type": "file",
          "path": "src/math/index.ts",
          "ext": "ts",
          "size": 44
        }
      ]
    },
    {
      "name": "music",
      "type": "folder",
      "path": "src/music",
      "children": [
        {
          "name": "arpeggios.ts",
          "type": "file",
          "path": "src/music/arpeggios.ts",
          "ext": "ts",
          "size": 6666
        }
      ]
    },
    {
      "name": "pages",
      "type": "folder",
      "path": "src/pages",
      "children": [
        {
          "name": "Waveform.tsx",
          "type": "file",
          "path": "src/pages/Waveform.tsx",
          "ext": "tsx",
          "size": 2647
        }
      ]
    },
    {
      "name": "store",
      "type": "folder",
      "path": "src/store",
      "children": [
        {
          "name": "daw.store.ts",
          "type": "file",
          "path": "src/store/daw.store.ts",
          "ext": "ts",
          "size": 3614
        },
        {
          "name": "index.ts",
          "type": "file",
          "path": "src/store/index.ts",
          "ext": "ts",
          "size": 192
        },
        {
          "name": "theme.store.ts",
          "type": "file",
          "path": "src/store/theme.store.ts",
          "ext": "ts",
          "size": 2601
        },
        {
          "name": "visual.store.ts",
          "type": "file",
          "path": "src/store/visual.store.ts",
          "ext": "ts",
          "size": 805
        },
        {
          "name": "waveform.store.ts",
          "type": "file",
          "path": "src/store/waveform.store.ts",
          "ext": "ts",
          "size": 4267
        }
      ]
    },
    {
      "name": "styles",
      "type": "folder",
      "path": "src/styles",
      "children": [
        {
          "name": "index.css",
          "type": "file",
          "path": "src/styles/index.css",
          "ext": "css",
          "size": 4144
        }
      ]
    },
    {
      "name": "types",
      "type": "folder",
      "path": "src/types",
      "children": [
        {
          "name": "derivative.types.ts",
          "type": "file",
          "path": "src/types/derivative.types.ts",
          "ext": "ts",
          "size": 4716
        },
        {
          "name": "index.ts",
          "type": "file",
          "path": "src/types/index.ts",
          "ext": "ts",
          "size": 164
        },
        {
          "name": "physics.types.ts",
          "type": "file",
          "path": "src/types/physics.types.ts",
          "ext": "ts",
          "size": 1032
        },
        {
          "name": "simulation.types.ts",
          "type": "file",
          "path": "src/types/simulation.types.ts",
          "ext": "ts",
          "size": 1344
        },
        {
          "name": "visualization.types.ts",
          "type": "file",
          "path": "src/types/visualization.types.ts",
          "ext": "ts",
          "size": 2184
        }
      ]
    },
    {
      "name": "utils",
      "type": "folder",
      "path": "src/utils",
      "children": [
        {
          "name": "format.ts",
          "type": "file",
          "path": "src/utils/format.ts",
          "ext": "ts",
          "size": 1124
        }
      ]
    },
    {
      "name": "visual",
      "type": "folder",
      "path": "src/visual",
      "children": [
        {
          "name": "visualEngine.ts",
          "type": "file",
          "path": "src/visual/visualEngine.ts",
          "ext": "ts",
          "size": 19164
        },
        {
          "name": "visualParams.ts",
          "type": "file",
          "path": "src/visual/visualParams.ts",
          "ext": "ts",
          "size": 9845
        }
      ]
    },
    {
      "name": "main.tsx",
      "type": "file",
      "path": "src/main.tsx",
      "ext": "tsx",
      "size": 407
    },
    {
      "name": "test_canvas.html",
      "type": "file",
      "path": "src/test_canvas.html",
      "ext": "html",
      "size": 1003
    },
    {
      "name": "vite-env.d.ts",
      "type": "file",
      "path": "src/vite-env.d.ts",
      "ext": "ts",
      "size": 89
    }
  ]
};

/* ── helpers ───────────────────────────────────────────────────────── */

/** Flatten every FileNode (files only) into a flat list */
export function flattenFiles(node: FileNode): FileNode[] {
  const out: FileNode[] = [];
  function walk(n: FileNode) {
    if (n.type === "file") out.push(n);
    n.children?.forEach(walk);
  }
  walk(node);
  return out;
}

/** Count files in a tree */
export function countFiles(node: FileNode): number {
  if (node.type === "file") return 1;
  return (node.children ?? []).reduce((s, c) => s + countFiles(c), 0);
}

/** Count folders in a tree */
export function countFolders(node: FileNode): number {
  if (node.type === "file") return 0;
  return 1 + (node.children ?? []).reduce((s, c) => s + countFolders(c), 0);
}

/** Format byte size to human-readable */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} kB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

/** Map extension → display label */
export function extLabel(ext?: string): string {
  const map: Record<string, string> = {
    ts: "TypeScript",
    tsx: "React TSX",
    css: "CSS",
    json: "JSON",
    md: "Markdown",
    html: "HTML",
    js: "JavaScript",
  };
  return map[ext ?? ""] ?? ext?.toUpperCase() ?? "—";
}
