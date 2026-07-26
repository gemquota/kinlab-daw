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
  name: "kinlab",
  type: "folder",
  path: "",
  children: [
    {
      name: "src",
      type: "folder",
      path: "src",
      children: [
        {
          name: "app",
          type: "folder",
          path: "src/app",
          children: [
            { name: "App.tsx", type: "file", path: "src/app/App.tsx", ext: "tsx", size: 210 },
            { name: "AppShell.tsx", type: "file", path: "src/app/AppShell.tsx", ext: "tsx", size: 940 },
            { name: "AppProviders.tsx", type: "file", path: "src/app/AppProviders.tsx", ext: "tsx", size: 900 },
            { name: "ErrorBoundary.tsx", type: "file", path: "src/app/ErrorBoundary.tsx", ext: "tsx", size: 1200 },
            { name: "boot.ts", type: "file", path: "src/app/boot.ts", ext: "ts", size: 400 },
            { name: "config.ts", type: "file", path: "src/app/config.ts", ext: "ts", size: 300 },
            { name: "featureFlags.ts", type: "file", path: "src/app/featureFlags.ts", ext: "ts", size: 350 },
            { name: "keyboardShortcuts.ts", type: "file", path: "src/app/keyboardShortcuts.ts", ext: "ts", size: 800 },
            { name: "lazyModules.ts", type: "file", path: "src/app/lazyModules.ts", ext: "ts", size: 500 },
            { name: "performance.ts", type: "file", path: "src/app/performance.ts", ext: "ts", size: 600 },
            { name: "router.tsx", type: "file", path: "src/app/router.tsx", ext: "tsx", size: 1100 },
          ],
        },
        {
          name: "components",
          type: "folder",
          path: "src/components",
          children: [
            {
              name: "common",
              type: "folder",
              path: "src/components/common",
              children: [
                { name: "Breadcrumbs.tsx", type: "file", path: "src/components/common/Breadcrumbs.tsx", ext: "tsx", size: 700 },
                { name: "CommandPalette.tsx", type: "file", path: "src/components/common/CommandPalette.tsx", ext: "tsx", size: 1500 },
                { name: "Notifications.tsx", type: "file", path: "src/components/common/Notifications.tsx", ext: "tsx", size: 900 },
              ],
            },
            {
              name: "layout",
              type: "folder",
              path: "src/components/layout",
              children: [
                { name: "InspectorPanel.tsx", type: "file", path: "src/components/layout/InspectorPanel.tsx", ext: "tsx", size: 2400 },
                { name: "Sidebar.tsx", type: "file", path: "src/components/layout/Sidebar.tsx", ext: "tsx", size: 1900 },
                { name: "StatusBar.tsx", type: "file", path: "src/components/layout/StatusBar.tsx", ext: "tsx", size: 600 },
                { name: "TopToolbar.tsx", type: "file", path: "src/components/layout/TopToolbar.tsx", ext: "tsx", size: 1400 },
              ],
            },
            {
              name: "ui",
              type: "folder",
              path: "src/components/ui",
              children: [
                { name: "Badge.tsx", type: "file", path: "src/components/ui/Badge.tsx", ext: "tsx", size: 1700 },
                { name: "Button.tsx", type: "file", path: "src/components/ui/Button.tsx", ext: "tsx", size: 1100 },
                { name: "Card.tsx", type: "file", path: "src/components/ui/Card.tsx", ext: "tsx", size: 800 },
                { name: "Divider.tsx", type: "file", path: "src/components/ui/Divider.tsx", ext: "tsx", size: 300 },
                { name: "IconButton.tsx", type: "file", path: "src/components/ui/IconButton.tsx", ext: "tsx", size: 700 },
                { name: "NumericInput.tsx", type: "file", path: "src/components/ui/NumericInput.tsx", ext: "tsx", size: 900 },
                { name: "ProgressBar.tsx", type: "file", path: "src/components/ui/ProgressBar.tsx", ext: "tsx", size: 500 },
                { name: "ScrollArea.tsx", type: "file", path: "src/components/ui/ScrollArea.tsx", ext: "tsx", size: 400 },
                { name: "Skeleton.tsx", type: "file", path: "src/components/ui/Skeleton.tsx", ext: "tsx", size: 300 },
                { name: "Slider.tsx", type: "file", path: "src/components/ui/Slider.tsx", ext: "tsx", size: 1200 },
                { name: "Toggle.tsx", type: "file", path: "src/components/ui/Toggle.tsx", ext: "tsx", size: 1700 },
                { name: "Tooltip.tsx", type: "file", path: "src/components/ui/Tooltip.tsx", ext: "tsx", size: 600 },
                { name: "index.ts", type: "file", path: "src/components/ui/index.ts", ext: "ts", size: 400 },
              ],
            },
          ],
        },
        {
          name: "data",
          type: "folder",
          path: "src/data",
          children: [
            { name: "colors.data.ts", type: "file", path: "src/data/colors.data.ts", ext: "ts", size: 600 },
            { name: "derivatives.data.ts", type: "file", path: "src/data/derivatives.data.ts", ext: "ts", size: 8000 },
            { name: "presets.data.ts", type: "file", path: "src/data/presets.data.ts", ext: "ts", size: 3000 },
            { name: "transformers.ts", type: "file", path: "src/data/transformers.ts", ext: "ts", size: 1200 },
            { name: "units.data.ts", type: "file", path: "src/data/units.data.ts", ext: "ts", size: 2000 },
            { name: "validation.ts", type: "file", path: "src/data/validation.ts", ext: "ts", size: 800 },
          ],
        },
        {
          name: "hooks",
          type: "folder",
          path: "src/hooks",
          children: [
            { name: "index.ts", type: "file", path: "src/hooks/index.ts", ext: "ts", size: 200 },
            { name: "useDerivedState.ts", type: "file", path: "src/hooks/useDerivedState.ts", ext: "ts", size: 600 },
            { name: "usePipeline.ts", type: "file", path: "src/hooks/usePipeline.ts", ext: "ts", size: 900 },
          ],
        },
        {
          name: "lib",
          type: "folder",
          path: "src/lib",
          children: [
            { name: "cn.ts", type: "file", path: "src/lib/cn.ts", ext: "ts", size: 150 },
            { name: "index.ts", type: "file", path: "src/lib/index.ts", ext: "ts", size: 200 },
            {
              name: "theme",
              type: "folder",
              path: "src/lib/theme",
              children: [
                { name: "accessibility.ts", type: "file", path: "src/lib/theme/accessibility.ts", ext: "ts", size: 500 },
                { name: "index.ts", type: "file", path: "src/lib/theme/index.ts", ext: "ts", size: 300 },
                { name: "themes.ts", type: "file", path: "src/lib/theme/themes.ts", ext: "ts", size: 1200 },
                { name: "tokens.ts", type: "file", path: "src/lib/theme/tokens.ts", ext: "ts", size: 2000 },
              ],
            },
          ],
        },
        {
          name: "math",
          type: "folder",
          path: "src/math",
          children: [
            { name: "index.ts", type: "file", path: "src/math/index.ts", ext: "ts", size: 400 },
            {
              name: "algebra",
              type: "folder",
              path: "src/math/algebra",
              children: [
                { name: "coefficients.engine.ts", type: "file", path: "src/math/algebra/coefficients.engine.ts", ext: "ts", size: 1500 },
                { name: "factorial.engine.ts", type: "file", path: "src/math/algebra/factorial.engine.ts", ext: "ts", size: 800 },
                { name: "polynomial.engine.ts", type: "file", path: "src/math/algebra/polynomial.engine.ts", ext: "ts", size: 2000 },
                { name: "power.engine.ts", type: "file", path: "src/math/algebra/power.engine.ts", ext: "ts", size: 600 },
              ],
            },
            {
              name: "calculus",
              type: "folder",
              path: "src/math/calculus",
              children: [
                { name: "chainRule.engine.ts", type: "file", path: "src/math/calculus/chainRule.engine.ts", ext: "ts", size: 700 },
                { name: "derivative.engine.ts", type: "file", path: "src/math/calculus/derivative.engine.ts", ext: "ts", size: 1800 },
                { name: "finiteDifference.engine.ts", type: "file", path: "src/math/calculus/finiteDifference.engine.ts", ext: "ts", size: 1200 },
                { name: "integral.engine.ts", type: "file", path: "src/math/calculus/integral.engine.ts", ext: "ts", size: 1500 },
                { name: "taylor.engine.ts", type: "file", path: "src/math/calculus/taylor.engine.ts", ext: "ts", size: 2500 },
              ],
            },
            {
              name: "kinematics",
              type: "folder",
              path: "src/math/kinematics",
              children: [
                { name: "dimensions.engine.ts", type: "file", path: "src/math/kinematics/dimensions.engine.ts", ext: "ts", size: 1000 },
                { name: "motion.engine.ts", type: "file", path: "src/math/kinematics/motion.engine.ts", ext: "ts", size: 2000 },
                { name: "units.engine.ts", type: "file", path: "src/math/kinematics/units.engine.ts", ext: "ts", size: 1500 },
                { name: "vectors.engine.ts", type: "file", path: "src/math/kinematics/vectors.engine.ts", ext: "ts", size: 1800 },
              ],
            },
            {
              name: "sampling",
              type: "folder",
              path: "src/math/sampling",
              children: [
                { name: "adaptiveStep.engine.ts", type: "file", path: "src/math/sampling/adaptiveStep.engine.ts", ext: "ts", size: 1200 },
                { name: "interpolation.engine.ts", type: "file", path: "src/math/sampling/interpolation.engine.ts", ext: "ts", size: 1000 },
                { name: "sampler.engine.ts", type: "file", path: "src/math/sampling/sampler.engine.ts", ext: "ts", size: 1500 },
                { name: "smoothing.engine.ts", type: "file", path: "src/math/sampling/smoothing.engine.ts", ext: "ts", size: 800 },
              ],
            },
            {
              name: "statistics",
              type: "folder",
              path: "src/math/statistics",
              children: [
                { name: "extrema.engine.ts", type: "file", path: "src/math/statistics/extrema.engine.ts", ext: "ts", size: 800 },
                { name: "histogram.engine.ts", type: "file", path: "src/math/statistics/histogram.engine.ts", ext: "ts", size: 1000 },
                { name: "normalization.engine.ts", type: "file", path: "src/math/statistics/normalization.engine.ts", ext: "ts", size: 700 },
                { name: "ranges.engine.ts", type: "file", path: "src/math/statistics/ranges.engine.ts", ext: "ts", size: 600 },
              ],
            },
            {
              name: "utilities",
              type: "folder",
              path: "src/math/utilities",
              children: [
                { name: "epsilon.ts", type: "file", path: "src/math/utilities/epsilon.ts", ext: "ts", size: 300 },
                { name: "memoization.ts", type: "file", path: "src/math/utilities/memoization.ts", ext: "ts", size: 500 },
                { name: "precision.ts", type: "file", path: "src/math/utilities/precision.ts", ext: "ts", size: 400 },
                { name: "validation.ts", type: "file", path: "src/math/utilities/validation.ts", ext: "ts", size: 600 },
              ],
            },
          ],
        },
        {
          name: "pages",
          type: "folder",
          path: "src/pages",
          children: [
            { name: "Compare.tsx", type: "file", path: "src/pages/Compare.tsx", ext: "tsx", size: 500 },
            { name: "Dashboard.tsx", type: "file", path: "src/pages/Dashboard.tsx", ext: "tsx", size: 2200 },
            { name: "Encyclopedia.tsx", type: "file", path: "src/pages/Encyclopedia.tsx", ext: "tsx", size: 600 },
            { name: "Export.tsx", type: "file", path: "src/pages/Export.tsx", ext: "tsx", size: 500 },
            { name: "Laboratory.tsx", type: "file", path: "src/pages/Laboratory.tsx", ext: "tsx", size: 600 },
            { name: "Presets.tsx", type: "file", path: "src/pages/Presets.tsx", ext: "tsx", size: 500 },
            { name: "Settings.tsx", type: "file", path: "src/pages/Settings.tsx", ext: "tsx", size: 500 },
            { name: "Simulator.tsx", type: "file", path: "src/pages/Simulator.tsx", ext: "tsx", size: 500 },
            { name: "Visualizations.tsx", type: "file", path: "src/pages/Visualizations.tsx", ext: "tsx", size: 500 },
          ],
        },
        {
          name: "services",
          type: "folder",
          path: "src/services",
          children: [
            { name: "computationPipeline.ts", type: "file", path: "src/services/computationPipeline.ts", ext: "ts", size: 3000 },
            { name: "index.ts", type: "file", path: "src/services/index.ts", ext: "ts", size: 200 },
          ],
        },
        {
          name: "store",
          type: "folder",
          path: "src/store",
          children: [
            { name: "encyclopedia.store.ts", type: "file", path: "src/store/encyclopedia.store.ts", ext: "ts", size: 800 },
            { name: "export.store.ts", type: "file", path: "src/store/export.store.ts", ext: "ts", size: 600 },
            { name: "history.store.ts", type: "file", path: "src/store/history.store.ts", ext: "ts", size: 1200 },
            { name: "index.ts", type: "file", path: "src/store/index.ts", ext: "ts", size: 500 },
            { name: "presets.store.ts", type: "file", path: "src/store/presets.store.ts", ext: "ts", size: 1000 },
            { name: "session.store.ts", type: "file", path: "src/store/session.store.ts", ext: "ts", size: 700 },
            { name: "settings.store.ts", type: "file", path: "src/store/settings.store.ts", ext: "ts", size: 800 },
            { name: "simulator.store.ts", type: "file", path: "src/store/simulator.store.ts", ext: "ts", size: 900 },
            { name: "taylor.store.ts", type: "file", path: "src/store/taylor.store.ts", ext: "ts", size: 1500 },
            { name: "theme.store.ts", type: "file", path: "src/store/theme.store.ts", ext: "ts", size: 700 },
            { name: "ui.store.ts", type: "file", path: "src/store/ui.store.ts", ext: "ts", size: 1000 },
            { name: "visualization.store.ts", type: "file", path: "src/store/visualization.store.ts", ext: "ts", size: 800 },
          ],
        },
        {
          name: "styles",
          type: "folder",
          path: "src/styles",
          children: [
            { name: "index.css", type: "file", path: "src/styles/index.css", ext: "css", size: 5000 },
          ],
        },
        {
          name: "types",
          type: "folder",
          path: "src/types",
          children: [
            { name: "derivative.types.ts", type: "file", path: "src/types/derivative.types.ts", ext: "ts", size: 2000 },
            { name: "index.ts", type: "file", path: "src/types/index.ts", ext: "ts", size: 200 },
            { name: "physics.types.ts", type: "file", path: "src/types/physics.types.ts", ext: "ts", size: 1200 },
            { name: "simulation.types.ts", type: "file", path: "src/types/simulation.types.ts", ext: "ts", size: 800 },
            { name: "visualization.types.ts", type: "file", path: "src/types/visualization.types.ts", ext: "ts", size: 1000 },
          ],
        },
        {
          name: "utils",
          type: "folder",
          path: "src/utils",
          children: [
            { name: "format.ts", type: "file", path: "src/utils/format.ts", ext: "ts", size: 800 },
          ],
        },
        { name: "main.tsx", type: "file", path: "src/main.tsx", ext: "tsx", size: 350 },
        { name: "vite-env.d.ts", type: "file", path: "src/vite-env.d.ts", ext: "ts", size: 100 },
      ],
    },
  ],
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
