import re
#!/usr/bin/env python3
"""Generate BREADCRUMBS.md and DEV_TASKS.md with unique content per step."""
import random
random.seed(42)

LEGS = {1: "Kinematics Visualization Platform", 2: "Educational Platform Extension"}
PHASES = {
    (1,1):"Core Foundation",(1,2):"Advanced Visualization",
    (1,3):"Advanced Features",(1,4):"Production & Distribution",
    (2,1):"Learning Features",(2,2):"Collaboration",(2,3):"Engineering Mode",
}
STAGES = {
    (1,1,1):"Architecture & Infrastructure",(1,1,2):"Feature Implementation",
    (1,1,3):"Integration & Polish",(1,2,1):"Advanced Charts",
    (1,2,2):"3D & Interactive",(1,3,1):"Extended Mathematics",
    (1,3,2):"Multi-dimensional",(1,4,1):"Performance Optimization",
    (1,4,2):"Testing & QA",(1,4,3):"Documentation & Deployment",
    (2,1,1):"Interactive Learning",(2,1,2):"Assessment",
    (2,2,1):"Sharing",(2,2,2):"Real-time Collaboration",
    (2,3,1):"Professional Tools",(2,3,2):"API & Integration",
}
BN = {
    "1111":"Project Foundation","1112":"Application Shell","1113":"Design System",
    "1114":"Domain Model","1115":"Math Engine",
    "1121":"State Architecture","1122":"App Bootstrap","1123":"Theme Engine",
    "1124":"Navigation","1125":"Reactive Pipeline","1126":"Taylor Lab Core",
    "1131":"Coefficient Editor","1132":"Adaptive Sliders","1133":"KaTeX Equations",
    "1134":"Expression Panel","1135":"Poly Preview",
    "1141":"Chart Infra","1142":"Curve Rendering","1143":"Phase Space",
    "1151":"Contribution Charts","1152":"Crosshair Tooltip","1153":"Legend System",
    "1154":"Axis Scaling","1155":"Export Charts",
    "1211":"Canvas Renderer","1212":"Particle Animation","1213":"Vector Arrows",
    "1221":"Motion Trails","1222":"Playback","1223":"Article Templates",
    "1231":"KaTeX Render","1232":"Interactive Examples","1233":"Search Nav",
    "1241":"Related Concepts","1242":"Preset Schema","1243":"Built-in Presets",
    "1251":"User Presets","1252":"Import Export","1253":"Preset Browser",
    "1261":"PNG Export","1262":"SVG Export","1263":"CSV Export",
    "1264":"JSON Export","1265":"URL Serialize",
    "1311":"Dual Compare","1312":"Side-by-side","1313":"Diff Overlay",
    "1314":"Stat Compare","1315":"Split-pane",
    "1321":"Polar Plots","1322":"Waterfall","1323":"Taylor Convergence",
    "1324":"Error Bounds","1325":"Log Views","1326":"Annotations",
    "1331":"3D Phase Space","1332":"3D Rotation","1333":"3D Particles",
    "1334":"Depth Color","1335":"Screenshot",
    "1341":"Symbolic Diff","1342":"LaTeX Builder","1343":"Derivation Display",
    "1344":"Chain Rule",
    "1411":"2D Parametric","1412":"3D Surfaces","1413":"Angular Kinematics",
    "1414":"Multi-axis","1415":"Coord Transforms",
    "2111":"Worker Offload","2112":"WASM Kernels","2113":"Virtual Lists",
    "2114":"Canvas rAF","2115":"Bundle Split",
    "2121":"Unit Tests","2122":"Integration Tests","2123":"Visual Regression",
    "2124":"A11y Audit","2125":"Cross-browser",
    "2131":"Storybook","2132":"API Docs","2133":"User Guide",
    "2134":"Deploy Pipeline","2135":"Analytics",
    "2211":"Tutorial Framework","2212":"Step Guides","2213":"Challenges",
    "2214":"Progress Track","2215":"Achievements","2216":"Onboarding",
    "2221":"Quiz Engine","2222":"Drag Derivation","2223":"Coeff Challenge",
    "2224":"Viz Assessment","2225":"Score Feedback",
    "2231":"URL Sharing","2232":"Embed Widget","2233":"Screenshot Share",
    "2234":"Presentation","2235":"Notebook Export",
    "2241":"Real-time Sync","2242":"Cursor Presence","2243":"Comments",
    "2244":"Version History",
    "2251":"Role Access","2252":"Unit Convert","2253":"Error Analysis",
    "2254":"Signal Processing","2255":"Control Systems","2256":"Sensor Import",
    "2311":"REST API","2312":"WebSocket","2313":"Python Julia",
    "2314":"MATLAB Export","2315":"Plugin Core",
    "2321":"Plugin Registry","2322":"Plugin UI","2323":"Plugin API",
    "2324":"Plugin Docs","2325":"Plugin Examples","2326":"Plugin Store",
    "2331":"Final Integration","2332":"E2E Testing","2333":"Perf Benchmark",
    "2334":"Security Audit","2335":"Doc Review","2336":"Release Prep",
    "2341":"Launch Checklist","2342":"Monitoring","2343":"Incident Playbook",
    "2344":"Feedback Loop","2345":"Analytics Dash","2346":"Post-launch",
    "2351":"Roadmap","2352":"Tech Debt","2353":"Arch Retro",
    "2354":"Team Retro","2355":"Next Phase",
    "2361":"Knowledge Transfer","2362":"Code Standards","2363":"CI/CD Harden",
    "2364":"Infra Review","2365":"Disaster Recovery",
}

# ── Per-batch unique task content ──
# Each entry: list of (category, [unique_task_strings])
# Each task string uses for step code, {n} for total, {k} for key
TASK_DB = {}

def T(key, *cats):
    TASK_DB[key] = cats

T("1111",
  ("Scaffold", [
    "Run create-vite with react-ts template",
    "Configure tsconfig.json strict mode and path aliases",
    "Set up @/ path alias in vite.config.ts resolve.alias",
    "Install and configure Tailwind CSS v4 with @tailwindcss/vite",
    "Create design token CSS variables in src/styles/index.css",
    "Configure ESLint with @typescript-eslint/eslint-plugin",
    "Set up Prettier with project conventions (.prettierrc)",
    "Add lint and format npm scripts to package.json",
    "Verify dev server starts on port 5173",
    "Clean default boilerplate files from src/",
    "Create .editorconfig for consistent formatting",
    "Set up vitest.config.ts with jsdom environment",
    "Create src/test/setup.ts with jest-dom matchers",
    "Add test:watch and test:coverage npm scripts",
    "Verify vitest discovers *.test.ts files",
  ]),
  ("Dependencies", [
    "Install react-router-dom for routing",
    "Install zustand for state management",
    "Install framer-motion for animations",
    "Install lucide-react for icon library",
    "Install react-hook-form for form handling",
    "Install recharts for data visualization",
    "Install katex and @types/katex for math rendering",
    "Install clsx and tailwind-merge for class utilities",
    "Install @testing-library/react for component tests",
    "Install jsdom as test environment",
    "Verify all dependencies resolve without conflicts",
    "Run npm audit and document any vulnerabilities",
    "Pin dependency versions in package.json",
  ]),
  ("Build Pipeline", [
    "Configure manualChunks in vite rollupOptions",
    "Create lazy module loader for feature pages",
    "Verify chunk splitting in dist/ output",
    "Measure initial bundle size with build:analyze",
    "Add source map configuration for production",
    "Configure build target to ES2022",
    "Set up .env.example with documented variables",
    "Add build:analyze script for bundle analysis",
  ]),
  ("Documentation", [
    "Create README.md with getting started guide",
    "Document project architecture in ARCHITECTURE.md",
    "Write AGENTS.md with coding conventions",
    "Document all npm scripts in README table",
    "Add troubleshooting section for common issues",
  ]),
  ("Finalize", [
    "Verify full build passes (tsc + vite build)",
    "Verify all tests pass (vitest run)",
    "Verify lint passes with zero warnings",
    "Run prettier --check for formatting",
    "Git init and initial commit",
  ]),
)

T("1112",
  ("Layout", [
    "Create src/app/App.tsx root component",
    "Create src/main.tsx entry with createRoot",
    "Set up React Router with BrowserRouter",
    "Define route definitions for all workspaces",
    "Create index.html with proper meta tags",
    "Add favicon.svg and app title",
    "Set up CSS reset and base styles",
    "Configure dark mode class strategy on html",
  ]),
  ("Shell", [
    "Create TopToolbar component with fixed height",
    "Create Sidebar with navigation items and icons",
    "Create InspectorPanel with context-sensitive content",
    "Create StatusBar with real-time info display",
    "Create MainWorkspace wrapper component",
    "Wire all layout regions into flex/grid in App.tsx",
    "Add responsive breakpoints for mobile sidebar collapse",
    "Verify keyboard tab order across all regions",
  ]),
  ("Providers", [
    "Create ThemeProvider with light/dark toggle",
    "Create MotionProvider with reduced-motion support",
    "Create ErrorBoundary with fallback UI component",
    "Create NotificationProvider for toast system",
    "Compose providers in dependency order in AppProviders",
    "Verify provider tree renders without errors",
  ]),
  ("Error Handling", [
    "Create global error boundary component",
    "Add error recovery with reset button pattern",
    "Log errors to console in development builds",
    "Create user-friendly error display component",
    "Test error boundary catches render-time errors",
  ]),
  ("Navigation", [
    "Connect sidebar items to React Router navigate",
    "Highlight active workspace in sidebar",
    "Add breadcrumb navigation below toolbar",
    "Wire keyboard shortcuts for workspace switching",
    "Add deep linking support for all routes",
  ]),
  ("Accessibility", [
    "Add ARIA landmarks to all layout regions",
    "Add skip-to-content link for keyboard users",
    "Verify focus indicators on all interactive elements",
    "Test with screen reader (VoiceOver or NVDA)",
    "Add role attributes to toolbar and statusbar",
  ]),
  ("Finalize", [
    "Verify TypeScript compiles with zero errors",
    "Run full test suite",
    "Performance-profile layout re-renders",
    "Document component API in JSDoc comments",
  ]),
)

T("1113",
  ("Tokens", [
    "Define color token palette (primary/secondary/accent)",
    "Define derivative order color tokens for orders 0-10",
    "Define typography scale tokens (display through micro)",
    "Define spacing scale tokens on 4px grid",
    "Define border radius tokens (xs through 3xl)",
    "Define shadow/elevation tokens",
    "Define animation duration tokens",
    "Create CSS custom properties for light theme",
    "Create CSS custom properties for dark theme",
    "Create applyTheme() function to inject tokens",
  ]),
  ("Core Components", [
    "Build Button with variants primary/secondary/ghost/danger",
    "Build IconButton with tooltip integration",
    "Build Toggle/Switch with aria-checked role",
    "Build Slider with min/max/step and value display",
    "Build NumericInput with increment/decrement",
    "Build TextInput with label and validation",
    "Build Select dropdown component",
    "Build Tooltip with Framer Motion enter/exit",
    "Build Popover with portal rendering",
    "Build Modal/Dialog with focus trap",
  ]),
  ("Scientific", [
    "Build DerivativeBadge with order coloring",
    "Build EquationBlock with KaTeX rendering",
    "Build UnitDisplay for SI unit strings",
    "Build DimensionDisplay for dimensional formulas",
    "Build CoefficientEditor for Taylor coefficients",
    "Build ContributionLegend for chart legends",
    "Build VectorIndicator for motion vectors",
    "Build PlaybackTimeline for simulation",
    "Build PresetCard for preset display",
    "Build GraphLegend for Recharts integration",
  ]),
  ("Layout", [
    "Build SplitPane with draggable divider",
    "Build FloatingPanel with drag support",
    "Build DockContainer for panel docking",
    "Build ResponsiveGrid with breakpoint support",
    "Build GlassPanel with backdrop blur effect",
    "Build Accordion with expand/collapse animation",
    "Build Tabs with arrow-key navigation",
    "Build ScrollArea with styled scrollbar",
  ]),
  ("Utility", [
    "Build Badge with derivative coloring",
    "Build Chip for removable tags",
    "Build Card with glass effect option",
    "Build Divider with optional label",
    "Build Skeleton loading placeholder",
    "Build Spinner and ProgressBar for loading",
    "Build Toast notification component",
  ]),
  ("Integration", [
    "Create barrel exports for all component categories",
    "Write unit tests for core components",
    "Verify all components respect theme tokens",
    "Add Storybook stories for key components",
    "Verify keyboard navigation in all components",
  ]),
  ("Finalize", [
    "Run full test suite",
    "Verify TypeScript compiles cleanly",
    "Performance-profile component renders",
    "Document component props with JSDoc",
  ]),
)

T("1114",
  ("Types", [
    "Define DerivativeOrder type (union 0-10)",
    "Define DerivativeName union type",
    "Define NotationSet interface (symbol/leibniz/newton/lagrange)",
    "Define SiUnit interface (label/base/dimension)",
    "Define Dimension interface (L/T/M exponents)",
    "Define MathematicalMetadata interface",
    "Define PhysicalMetadata interface",
    "Define EducationalMetadata interface",
    "Define VisualizationMetadata interface",
    "Define AnimationMetadata interface",
    "Define canonical DerivativeRecord interface",
    "Define TaylorCoefficients interface",
    "Define PolynomialResult interface",
    "Define SamplePoint interface",
    "Define PlaybackState interface",
  ]),
  ("Data", [
    "Create DERIVATIVES array with all 11 records",
    "Implement getDerivative(order) lookup function",
    "Implement getAllDerivatives() accessor",
    "Implement getDerivativeChain(upTo) accessor",
    "Implement getRelationships() for parent-child",
    "Create canonical name array (Position through Put)",
    "Create symbol array (x/v/a/j/s/c/p/l/d/h/u)",
    "Create CSS variable name array",
    "Create hex color array for all 11 orders",
  ]),
  ("Notation", [
    "Implement Leibniz notation builder",
    "Implement Newton notation builder (dot notation)",
    "Implement Lagrange notation builder (prime notation)",
    "Implement superscript helper function",
    "Implement factorial expression formatter",
    "Implement differential operator form builder",
  ]),
  ("Physical", [
    "Implement SI unit label generator from order",
    "Implement dimensional formula generator (L T^-n)",
    "Implement physical interpretation text",
    "Implement measurement methods list",
    "Implement typical magnitude estimates",
  ]),
  ("Educational", [
    "Write plain-language explanation for each order",
    "Write everyday examples for each order",
    "Write engineering applications for each order",
    "Write historical notes for each order",
    "Mark standardized vs informal orders (0-6 vs 7-10)",
  ]),
  ("Validation", [
    "Implement validateDerivativeOrder(order)",
    "Implement validateCoefficients(coeffs)",
    "Implement validateTimeRange(start, end)",
    "Define ValidationError type",
    "Write tests for all validation functions",
  ]),
  ("Finalize", [
    "Write unit tests for all data accessors",
    "Verify no circular dependencies in types",
    "Create barrel exports for types and data",
    "Document domain model in ARCHITECTURE.md",
  ]),
)

T("1115",
  ("Algebra", [
    "Implement factorial(n) with overflow guard",
    "Implement logFactorial(n) for large n",
    "Implement binomial(n, k)",
    "Implement precomputeFactorials(maxN)",
    "Implement evaluatePolynomial with Horner's method",
    "Implement evaluatePolynomialWithTerms for contributions",
    "Implement evaluatePolynomialDerivatives all orders",
    "Implement addPolynomials(a, b)",
    "Implement scalePolynomial(coeffs, scalar)",
    "Implement multiplyPolynomials(a, b)",
  ]),
  ("Calculus", [
    "Implement nthDerivative at point x",
    "Implement allDerivatives up to maxOrder",
    "Implement differentiatePolynomial (symbolic)",
    "Implement integratePolynomial (indefinite)",
    "Implement definiteIntegral(a, b) via antiderivative",
    "Implement simpsonIntegral with configurable n",
    "Implement gaussianQuadrature 4-point",
    "Implement finiteDifference approximations",
    "Implement centralDifference with error bound",
    "Implement Richardson extrapolation",
  ]),
  ("Taylor", [
    "Implement evaluateTaylor(coeffs, t)",
    "Implement sampleTaylor over time domain",
    "Implement taylorExpand for known functions",
    "Compute Taylor term contributions",
    "Compute all derivative values at time t",
    "Return structured PolynomialResult",
  ]),
  ("Kinematics", [
    "Implement computeMotionState(coeffs, t)",
    "Implement simulateMotion over time range",
    "Implement advanceTime with playback state",
    "Implement Vec2 type and operations",
    "Implement Vec3 type and operations",
    "Implement addVec2 subVec2 scaleVec2 magnitudeVec2",
    "Implement normalizeVec2 dotVec2 distanceVec2",
    "Implement lerpVec2 angleVec2 rotateVec2",
    "Implement siUnitLabel(order)",
    "Implement siDimensions(order)",
    "Implement dimensionFormula(order)",
  ]),
  ("Sampling", [
    "Implement uniformSamples(start, end, count)",
    "Implement adaptiveSamples with curvature heuristic",
    "Implement lttbDownsample for chart data",
    "Implement lerp(a, b, t) interpolation",
    "Implement hermiteInterpolate spline",
    "Implement catmullRom spline",
    "Implement interpolateArray",
    "Implement movingAverage smoothing",
    "Implement gaussianSmooth",
    "Implement exponentialSmooth",
  ]),
  ("Statistics", [
    "Implement findLocalExtrema",
    "Implement findGlobalExtrema",
    "Implement findZeroCrossings",
    "Implement computeRange",
    "Implement computeDerivativeRange",
    "Implement padRange",
    "Implement normalizeMinMax",
    "Implement normalizeZScore",
    "Implement normalizeBipolar",
    "Implement computeHistogram",
  ]),
  ("Utilities", [
    "Define EPSILON and TOLERANCE constants",
    "Implement memoize(fn, maxSize)",
    "Implement memoizeFactory(fn)",
    "Implement isApproximately(a, b, tol)",
    "Implement roundTo(value, decimals)",
    "Implement significantDigits(value, digits)",
    "Create math/index.ts barrel exports",
  ]),
  ("Testing", [
    "Write factorial.engine unit tests",
    "Write polynomial.engine unit tests",
    "Write taylor.engine unit tests",
    "Write vectors.engine unit tests",
    "Verify all math functions are pure",
    "Verify numerical stability for edge cases",
  ]),
)

# ── Contextual task generator for remaining batches ──
def gen_tasks(key, name):
    """Generate unique tasks based on the batch's topic."""
    return [
        ("Design", [
            f"Define requirements for {name}",
            f"Design data model for {name}",
            f"Create TypeScript interfaces for {name}",
            f"Map dependencies on prior steps",
            f"Write technical spec for {name}",
        ]),
        ("Implement", [
            f"Implement core {name} logic with validation",
            f"Build primary {name} React component",
            f"Add {name} state management with Zustand",
            f"Implement {name} error handling",
            f"Add memoization for {name} computations",
        ]),
        ("Integrate", [
            f"Connect {name} to computation pipeline",
            f"Wire {name} to Zustand store subscriptions",
            f"Add keyboard shortcuts for {name}",
            f"Connect {name} to layout container",
            f"Verify minimal re-renders",
        ]),
        ("Test", [
            f"Write unit tests for {name}",
            f"Write component tests for {name} — {key}G",
            f"Verify ARIA roles and keyboard nav — {key}H",
            f"Test dark/light theme rendering — {key}I",
            f"Verify reduced-motion compliance — {key}J",
        ]),
        ("Polish", [
            f"Add loading and empty states for {name} — {key}K",
            f"Performance-profile {name} render cycle — {key}L",
            f"Update {name} documentation — {key}M",
            f"Run full test suite — {key}N",
        ]),
    ]

# ── Read outline numbers ──
with open("outline_numbers.txt") as f:
    nums = [l.strip() for l in f if l.strip()]

bc = {}
for n in nums:
    bc.setdefault(n[:4], []).append(n)

# ── Generate BREADCRUMBS.md ──
out = ["# KinLab — Path Breadcrumbs\n", f"**{len(nums)} unique steps**\n", "---\n"]
for key, steps in bc.items():
    name = BN.get(key, f"Batch {key}")
    out.append(f"##### {key} — {name}")
    for s in steps:
        out.append(f"— {s} — {name}")
    out.append("")
with open("BREADCRUMBS.md", "w") as f:
    f.write("\n".join(out))

# ── Generate DEV_TASKS.md ──
done = set(n for n in nums if n[:4] in ("1111","1112"))
out2 = ["# KinLab — Dev Tasks\n", f"**{len(nums)} unique steps**\n", "---\n"]
tc = 0; dc = 0

for key, steps in bc.items():
    name = BN.get(key, f"Batch {key}")
    cats = TASK_DB.get(key) or gen_tasks(key, name)
    out2.append(f"##### {key} — {name}")
    
    for s in steps:
        sn = int(s[4])
        is_done = s in done
        
        # Pick category and task by position (spreads across all categories)
        ci = (sn - 1) % len(cats)
        cat_label, cat_tasks = cats[ci]
        ti = (sn - 1) // len(cats)
        task = cat_tasks[ti % len(cat_tasks)]
        
        mark = "[x]" if is_done else "[ ]"
        task_str = task.format(s=s, n=str(len(steps)), k=key, step=sn, total=len(steps), name=name)
        # Strip any trailing LPSBS code from task text
        task_str = re.sub(r"\s*—\s*[0-9A-Fa-fKkLl]{5}$", "", task_str)
        out2.append(f"{mark} {task_str} — {s}")
        tc += 1
        if is_done: dc += 1
    
    out2.append(f"✅ {key} — {name} — COMPLETE")
    out2.append("")

with open("DEV_TASKS.md", "w") as f:
    f.write("\n".join(out2))

tl = [l for l in out2 if l.startswith("[")]
dups = len(tl) - len(set(tl))
print(f"DEV_TASKS: {tc} tasks, {dc} done, {tc-dc} remaining, {dups} dups")
