#!/usr/bin/env python3
"""Regenerate BREADCRUMBS.md and DEV_TASKS.md with correct content for every line."""
import random, re
random.seed(42)

# ── Full hierarchy names ──────────────────────────────────────────
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

# EVERY LPSB → descriptive name (hand-mapped from outline_numbers.txt analysis)
BATCH_NAMES = {
    # Leg 1 Phase 1 Stage 1
    "1111":"Project Foundation","1112":"Application Shell & Layout",
    "1113":"Design System & Components","1114":"Scientific Domain Model",
    "1115":"Mathematical Engine Core",
    # Leg 1 Phase 1 Stage 2
    "1121":"State Architecture","1122":"Application Bootstrap",
    "1123":"Theme Engine","1124":"Navigation & Workspace",
    "1125":"Reactive Pipeline","1126":"Taylor Lab Core",
    # Leg 1 Phase 1 Stage 3
    "1131":"Coefficient Editor","1132":"Adaptive Sliders",
    "1133":"Symbolic Equation KaTeX","1134":"Expression Panel",
    "1135":"Polynomial Preview",
    # Leg 1 Phase 2 Stage 1 (note: phase 2 stage 1 in our numbering)
    "1141":"Chart Infrastructure","1142":"Multi-derivative Curves",
    "1143":"Phase Space Plot",
    "1151":"Contribution Charts","1152":"Crosshair & Tooltip",
    "1153":"Chart Legend System","1154":"Axis Scaling","1155":"Export-Ready Charts",
    # Leg 1 Phase 2 Stage 2
    "1211":"HTML5 Canvas Renderer","1212":"Particle Animation",
    "1213":"Vector Arrows","1221":"Motion Trails","1222":"Playback Controls",
    "1223":"Article Templates","1231":"KaTeX Rendering","1232":"Interactive Examples",
    "1233":"Search & Navigation","1241":"Related Concepts","1242":"Preset Schema",
    "1243":"Built-in Presets","1251":"User Presets","1252":"Import/Export Presets",
    "1253":"Preset Browser UI","1261":"PNG Export","1262":"SVG Export",
    "1263":"CSV Data Export","1264":"JSON State Export","1265":"URL Serialization",
    # Leg 1 Phase 3
    "1311":"Dual-coefficient Compare","1312":"Side-by-side Panels",
    "1313":"Differential Overlay","1314":"Statistical Comparison",
    "1315":"Split-pane Docking","1321":"Polar/Radial Plots","1322":"Waterfall Chart",
    "1323":"Taylor Convergence","1324":"Error Bounds","1325":"Logarithmic Views",
    "1326":"Chart Annotations","1331":"3D Phase Space","1332":"Interactive Rotation",
    "1333":"3D Particles","1334":"Depth Coloring","1335":"Screenshot Capture",
    "1341":"Symbolic Differentiation","1342":"LaTeX Builder","1343":"Derivation Display",
    "1344":"Chain Rule Visual",
    # Leg 1 Phase 4
    "1411":"2D Parametric Curves","1412":"3D Parametric Surfaces",
    "1413":"Angular Kinematics","1414":"Multi-axis Decomposition",
    "1415":"Coordinate Transforms",
    "2111":"Web Worker Offloading","2112":"WASM Math Kernels",
    "2113":"Virtualized Lists","2114":"Canvas rAF Optimization",
    "2115":"Bundle Splitting",
    "2121":"Unit Test Coverage","2122":"Integration Tests",
    "2123":"Visual Regression","2124":"Accessibility Audit",
    "2125":"Cross-browser Compat",
    "2131":"Storybook Setup","2132":"API Documentation",
    "2133":"User Guide","2134":"Deployment Pipeline","2135":"Analytics",
    # Leg 2 Phase 1
    "2211":"Tutorial Framework","2212":"Step-by-step Guides",
    "2213":"Interactive Challenges","2214":"Progress Tracking",
    "2215":"Achievement System","2216":"Onboarding Flow",
    "2221":"Quiz Engine","2222":"Drag Derivation","2223":"Coefficient Challenge",
    "2224":"Viz Builder Assessment","2225":"Score & Feedback",
    # Leg 2 Phase 2
    "2231":"URL State Sharing","2232":"Embed Widget","2233":"Screenshot Sharing",
    "2234":"Presentation Mode","2235":"Notebook Export",
    "2241":"Real-time State Sync","2242":"Cursor Presence",
    "2243":"Comment System","2244":"Version History",
    "2251":"Role-based Access","2252":"Unit Conversion","2253":"Error Analysis",
    "2254":"Signal Processing","2255":"Control Systems","2256":"Sensor Import",
    # Leg 2 Phase 3
    "2311":"REST API","2312":"WebSocket Live","2313":"Python/Julia Interop",
    "2314":"MATLAB Export","2315":"Plugin System Core",
    "2321":"Plugin Registry","2322":"Plugin UI","2323":"Plugin API",
    "2324":"Plugin Docs","2325":"Plugin Examples","2326":"Plugin Store",
    "2331":"Final Integration","2332":"End-to-end Testing",
    "2333":"Performance Benchmarking",
    "2334":"Security Audit","2335":"Documentation Review",
    "2336":"Release Preparation",
    "2341":"Launch Checklist","2342":"Monitoring Setup",
    "2343":"Incident Playbook",
    "2344":"User Feedback Loop","2345":"Analytics Dashboard",
    "2346":"Post-launch Review",
    "2351":"Roadmap Planning","2352":"Technical Debt Review",
    "2353":"Architecture Retrospective","2354":"Team Retrospective",
    "2355":"Next Phase Planning",
    "2361":"Knowledge Transfer","2362":"Code Review Standards",
    "2363":"CI/CD Hardening","2364":"Infrastructure Review",
    "2365":"Disaster Recovery Plan",
}

# ── Read outline_numbers.txt for actual step counts ──────────────
with open("outline_numbers.txt") as f:
    numbers = [l.strip() for l in f if l.strip()]

batch_counts = {}
for n in numbers:
    key = n[:4]
    batch_counts[key] = batch_counts.get(key, 0) + 1

# ── Generate BREADCRUMBS.md ──────────────────────────────────────
bc = []
bc.append("# KinLab — Path Breadcrumbs\n")
bc.append(f"**{len(numbers)} steps** across **{len(batch_counts)} batches**\n")
bc.append("---\n")

current_batch = None
for num in numbers:
    leg = int(num[0]); phase = int(num[1]); stage = int(num[2])
    batch = int(num[3]); step = int(num[4])
    key = num[:4]
    total = batch_counts[key]
    
    leg_n = LEGS.get(leg, f"Leg {leg}")
    phase_n = PHASES.get((leg,phase), f"Phase {phase}")
    stage_n = STAGES.get((leg,phase,stage), f"Stage {stage}")
    batch_n = BATCH_NAMES.get(key, f"Batch {batch}")
    
    path = f"{leg_n} > {phase_n} > {stage_n} > {batch_n}"
    
    if key != current_batch:
        bc.append(f"### {key} — {batch_n}")
    current_batch = key
    
    bc.append(f"- **{num}** — {batch_n} (step {step}/{total})")
    bc.append(f"  Path: {path}\n")

with open("BREADCRUMBS.md", "w") as f:
    f.write("\n".join(bc))
print(f"BREADCRUMBS.md: {len(numbers)} lines, {len(bc)} total lines")

# ── Generate DEV_TASKS.md ────────────────────────────────────────
dt = []
dt.append("# KinLab — Development Task Lists\n")
dt.append(f"**{len(numbers)} steps** | **{len(batch_counts)} batches** | Atomically decomposed | Hierarchically structured | Incrementally progressive\n")
dt.append("---\n")

for num in numbers:
    leg = int(num[0]); phase = int(num[1]); stage = int(num[2])
    batch = int(num[3]); step = int(num[4])
    key = num[:4]
    total = batch_counts[key]
    
    batch_n = BATCH_NAMES.get(key, f"Batch {batch}")
    leg_n = LEGS.get(leg, f"Leg {leg}")
    phase_n = PHASES.get((leg,phase), f"Phase {phase}")
    stage_n = STAGES.get((leg,phase,stage), f"Stage {stage}")
    path = f"{leg_n} > {phase_n} > {stage_n} > {batch_n}"
    
    is_first = step == 1
    
    if is_first:
        dt.append(f"## {key} — {batch_n}")
        dt.append(f"*{path}*\n")
        dt.append(f"**Steps in batch:** {total}\n")
    
    progress = step / total
    
    # 5 progressive phases
    phases = [
        ("Define & Design", [
            f"Analyze requirements for {batch_n} (step {step}/{total})",
            f"Define TypeScript interfaces and type contracts",
            f"Design component/API surface and data flow",
            f"Document dependencies on completed prior steps",
        ]),
        ("Implement Core", [
            f"Write core pure functions with input validation",
            f"Create primary React component/module",
            f"Add memoization for expensive computations",
            f"Implement error handling and fallback states",
        ]),
        ("Test & Validate", [
            f"Write unit tests for core logic (happy + edge cases)",
            f"Write component render tests with Testing Library",
            f"Verify ARIA roles, keyboard navigation, focus management",
            f"Test dark/light theme rendering",
            f"Verify reduced-motion compliance",
        ]),
        ("Integrate & Wire", [
            f"Connect to computation pipeline results",
            f"Subscribe to only necessary Zustand store slices",
            f"Wire keyboard shortcuts if applicable",
            f"Connect to parent layout container",
            f"Verify minimal re-renders via React DevTools",
        ]),
        ("Polish & Ship", [
            f"Add loading, empty, and error state UI",
            f"Add focus-visible indicators and hover effects",
            f"Performance-profile render cycle",
            f"Update documentation and JSDoc comments",
            f"Run full test suite — zero regressions",
            f"Commit with conventional commit message",
        ]),
    ]
    
    if progress <= 0.25:
        sel = [phases[0], phases[1]]
    elif progress <= 0.5:
        sel = [phases[1], phases[2]]
    elif progress <= 0.75:
        sel = [phases[2], phases[3]]
    else:
        sel = [phases[3], phases[4]]
    
    dt.append(f"### Step {num} — {batch_n} ({step}/{total})\n")
    
    for cat_name, tasks in sel:
        dt.append(f"**{cat_name}:**")
        for t in tasks:
            dt.append(f"- [ ] {t}")
        dt.append("")
    
    if step == total:
        dt.append(f"**✅ BATCH COMPLETE** — all {total} steps done\n")

with open("DEV_TASKS.md", "w") as f:
    f.write("\n".join(dt))

task_count = sum(1 for l in dt if l.strip().startswith("- [ ]"))
print(f"DEV_TASKS.md: {len(numbers)} steps, {len(batch_counts)} batches, {task_count} tasks")
