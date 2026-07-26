#!/usr/bin/env python3
"""Generate task lists for every number in outline_numbers.txt."""

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
BATCH_TOPICS = {
    (1,1,1,1):"Project Foundation & Dependencies",
    (1,1,1,2):"Application Shell & Layout",
    (1,1,1,3):"Design System & Component Library",
    (1,1,1,4):"Scientific Domain Model",
    (1,1,1,5):"Mathematical Engine",
    (1,1,1,6):"State Architecture",
    (1,1,2,1):"Application Bootstrap",
    (1,1,2,2):"Theme Engine",
    (1,1,2,3):"Navigation & Workspace",
    (1,1,2,4):"Reactive Pipeline",
    (1,1,2,5):"Taylor Lab Core",
    (1,1,2,6):"Coefficient Editor",
    (1,1,3,1):"Slider Components",
    (1,1,3,2):"Equation Rendering",
    (1,1,3,3):"Expression Panel",
    (1,1,3,4):"Polynomial Preview",
    (1,1,3,5):"Chart Infrastructure",
    (1,1,3,6):"Curve Rendering",
    (1,2,1,1):"Phase Space Plot",
    (1,2,1,2):"Contribution Charts",
    (1,2,1,3):"Crosshair & Tooltip",
    (1,2,1,4):"Canvas Renderer",
    (1,2,1,5):"Particle Animation",
    (1,2,1,6):"Vector Visualization",
    (1,2,2,1):"Motion Trails",
    (1,2,2,2):"Playback Controls",
    (1,2,2,3):"Article Templates",
    (1,2,2,4):"KaTeX Rendering",
    (1,2,2,5):"Interactive Examples",
    (1,2,2,6):"Search & Navigation",
    (1,2,3,1):"Related Concepts",
    (1,2,3,2):"Preset Schema",
    (1,2,3,3):"Built-in Presets",
    (1,2,3,4):"User Presets",
    (1,2,3,5):"Import / Export",
    (1,2,3,6):"Preset Browser",
    (1,3,1,1):"PNG Export",
    (1,3,1,2):"SVG Export",
    (1,3,1,3):"CSV Export",
    (1,3,1,4):"JSON Export",
    (1,3,1,5):"URL Serialization",
    (1,3,1,6):"Comparison Workspace",
    (1,3,2,1):"Side-by-side Panel",
    (1,3,2,2):"Differential Analysis",
    (1,3,2,3):"Statistical Comparison",
    (1,3,2,4):"Split-pane Resize",
    (1,3,2,5):"Polar / Radial Plots",
    (1,3,2,6):"Waterfall Chart",
    (1,4,1,1):"Taylor Convergence Anim",
    (1,4,1,2):"Error Bound Viz",
    (1,4,1,3):"Logarithmic Views",
    (1,4,1,4):"3D Phase Space",
    (1,4,1,5):"Interactive Rotation",
    (1,4,1,6):"3D Particle System",
    (1,4,2,1):"Depth-based Coloring",
    (1,4,2,2):"Screenshot Capture",
    (1,4,2,3):"Symbolic Differentiation",
    (1,4,2,4):"LaTeX Expression Builder",
    (1,4,2,5):"Step-by-step Derivation",
    (1,4,2,6):"Chain Rule Visual",
    (1,4,3,1):"Integration Path Display",
    (1,4,3,2):"2D Parametric Curves",
    (1,4,3,3):"3D Parametric Surfaces",
    (1,4,3,4):"Angular Kinematics",
    (1,4,3,5):"Multi-axis Decomposition",
    (1,4,3,6):"Coordinate Transforms",
    (2,1,1,1):"Worker Offloading",
    (2,1,1,2):"WASM Math Kernels",
    (2,1,1,3):"Virtualized Lists",
    (2,1,1,4):"Canvas Optimization",
    (2,1,1,5):"Bundle Splitting",
    (2,1,1,6):"Unit Test Coverage",
    (2,1,2,1):"Integration Tests",
    (2,1,2,2):"Visual Regression",
    (2,1,2,3):"Accessibility Audit",
    (2,1,2,4):"Cross-browser Compat",
    (2,1,2,5):"Storybook",
    (2,1,2,6):"API Documentation",
    (2,1,3,1):"User Guide",
    (2,1,3,2):"Deployment Pipeline",
    (2,1,3,3):"Analytics & Monitoring",
    (2,1,3,4):"Tutorial Framework",
    (2,1,3,5):"Step-by-step Guides",
    (2,1,3,6):"Interactive Challenges",
    (2,2,1,1):"Progress Tracking",
    (2,2,1,2):"Achievement System",
    (2,2,1,3):"Quiz Engine",
    (2,2,1,4):"Drag-and-drop Derivation",
    (2,2,1,5):"Coefficient Estimation",
    (2,2,1,6):"Viz Builder Assessment",
    (2,2,2,1):"Score & Feedback",
    (2,2,2,2):"URL State Sharing",
    (2,2,2,3):"Embed Widget",
    (2,2,2,4):"Screenshot Sharing",
    (2,2,2,5):"Presentation Mode",
    (2,2,2,6):"Notebook Export",
    (2,2,3,1):"Real-time State Sync",
    (2,2,3,2):"Cursor Presence",
    (2,2,3,3):"Comment System",
    (2,2,3,4):"Version History",
    (2,2,3,5):"Role-based Access",
    (2,2,3,6):"Unit Conversion",
    (2,3,1,1):"Error Analysis",
    (2,3,1,2):"Signal Processing",
    (2,3,1,3):"Control Systems",
    (2,3,1,4):"Sensor Data Import",
    (2,3,1,5):"REST API",
    (2,3,1,6):"WebSocket Live Updates",
    (2,3,2,1):"Python/Julia Interop",
    (2,3,2,2):"MATLAB Export",
    (2,3,2,3):"Plugin System",
    (2,3,2,4):"Final Polish & Release",
    (2,3,2,5):"Retrospective & Next Steps",
}

def get_batch_count(leg, phase, stage, batch):
    """Deterministic step count per batch (3-6)."""
    h = hash((leg, phase, stage, batch))
    return 3 + (h % 4)

def generate_step_tasks(batch_name, step, total_steps, step_seed):
    """Generate a hierarchical, progressive task list for one step."""
    rng = random.Random(step_seed)
    
    progress = step / total_steps  # 0.0 → 1.0
    
    # 5 progressive phases; pick 2-3 based on position
    phases = [
        ("Define & Design", [
            f"Analyze requirements for {batch_name} — step {step}/{total_steps}",
            f"Define TypeScript interfaces and data contracts",
            f"Design component hierarchy and prop types",
            f"Document dependencies on prior completed steps",
        ]),
        ("Implement Core", [
            f"Write core pure functions with input validation",
            f"Create primary React component with props interface",
            f"Add memoization for expensive derived computations",
            f"Implement error handling and fallback states",
            f"Wire component to Zustand store subscription",
        ]),
        ("Test & Validate", [
            f"Write unit tests covering happy path and edge cases",
            f"Write component render tests with Testing Library",
            f"Verify ARIA roles and keyboard navigation",
            f"Test with reduced-motion media query",
            f"Verify dark and light theme rendering",
        ]),
        ("Integrate & Wire", [
            f"Connect to computation pipeline result",
            f"Subscribe to only necessary store slices",
            f"Wire keyboard shortcut if applicable",
            f"Connect to parent layout container",
            f"Verify no unnecessary re-renders",
        ]),
        ("Polish & Ship", [
            f"Add loading, empty, and error state UI",
            f"Add focus-visible indicators",
            f"Performance profile render cycle",
            f"Update documentation and inline JSDoc",
            f"Run full test suite — confirm zero regressions",
            f"Commit with descriptive conventional commit message",
        ]),
    ]
    
    # Select phases based on position
    if progress < 0.2:
        selected = [phases[0], phases[1]]
    elif progress < 0.5:
        selected = [phases[1], phases[2]]
    elif progress < 0.8:
        selected = [phases[2], phases[3]]
    else:
        selected = [phases[3], phases[4]]
    
    return selected


def main():
    with open("outline_numbers.txt") as f:
        numbers = [l.strip() for l in f if l.strip()]
    
    out = []
    out.append("# KinLab — Development Task Lists\n")
    out.append(f"**{len(numbers)} steps** | Atomically decomposed | Hierarchically structured | Incrementally progressive\n")
    
    batch_step_counts = {}
    
    # Pre-compute step counts per batch
    for num in numbers:
        key = num[:4]  # LPSB
        if key not in batch_step_counts:
            batch_step_counts[key] = get_batch_count(int(num[0]), int(num[1]), int(num[2]), int(num[3]))
    
    batch_current = {}
    
    for num in numbers:
        leg = int(num[0])
        phase = int(num[1])
        stage = int(num[2])
        batch = int(num[3])
        step = int(num[4])
        
        leg_name = LEGS.get(leg, f"Leg {leg}")
        phase_name = PHASES.get((leg,phase), f"Phase {phase}")
        stage_name = STAGES.get((leg,phase,stage), f"Stage {stage}")
        batch_name = BATCH_TOPICS.get((leg,phase,stage,batch), f"Batch {batch}")
        
        key = num[:4]
        total_steps = batch_step_counts[key]
        
        is_first_step = key not in batch_current
        batch_current[key] = step
        
        if is_first_step:
            out.append("---\n")
            out.append(f"## {key}X — {batch_name}")
            out.append(f"*{leg_name} > {phase_name} > {stage_name} > {batch_name}*\n")
            out.append(f"**Steps in batch:** {total_steps}\n")
        
        out.append(f"### Step {num} — {batch_name} ({step}/{total_steps})\n")
        
        task_seed = int(num) * 7 + 13
        categories = generate_step_tasks(batch_name, step, total_steps, task_seed)
        
        for cat_name, tasks in categories:
            out.append(f"**{cat_name}:**")
            for t in tasks:
                out.append(f"- [ ] {t}")
            out.append("")
        
        if step == total_steps:
            out.append(f"**✅ BATCH COMPLETE** — all {total_steps} steps done\n")
    
    result = "\n".join(out)
    with open("DEV_TASKS.md", "w") as f:
        f.write(result)
    
    task_count = sum(1 for l in result.split("\n") if l.strip().startswith("- [ ]"))
    batch_count = len(batch_step_counts)
    print(f"Generated DEV_TASKS.md")
    print(f"  {len(numbers)} steps across {batch_count} batches")
    print(f"  {task_count} atomic task items")

if __name__ == "__main__":
    main()
