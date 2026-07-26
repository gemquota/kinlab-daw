import random
import sys

random.seed(42)

# Configuration: how many of each level
NUM_LEGS = 2
PHASES_PER_LEG = [random.randint(3, 6) for _ in range(NUM_LEGS)]
STAGES_PER_PHASE = {}   # (leg, phase) -> count
BATCHES_PER_STAGE = {}  # (leg, phase, stage) -> count
STEPS_PER_BATCH = {}    # (leg, phase, stage, batch) -> count

for leg in range(1, NUM_LEGS + 1):
    num_phases = PHASES_PER_LEG[leg - 1]
    for phase in range(1, num_phases + 1):
        num_stages = random.randint(3, 6)
        STAGES_PER_PHASE[(leg, phase)] = num_stages
        for stage in range(1, num_stages + 1):
            num_batches = random.randint(3, 6)
            BATCHES_PER_STAGE[(leg, phase, stage)] = num_batches
            for batch in range(1, num_batches + 1):
                num_steps = random.randint(3, 6)
                STEPS_PER_BATCH[(leg, phase, stage, batch)] = num_steps

# Generate all numbers following odometer rule
numbers = []
total_steps = 0

for leg in range(1, NUM_LEGS + 1):
    for phase in range(1, PHASES_PER_LEG[leg - 1] + 1):
        for stage in range(1, STAGES_PER_PHASE[(leg, phase)] + 1):
            for batch in range(1, BATCHES_PER_STAGE[(leg, phase, stage)] + 1):
                num_steps = STEPS_PER_BATCH[(leg, phase, stage, batch)]
                for step in range(1, num_steps + 1):
                    code = f"{leg}{phase}{stage}{batch}{step}"
                    numbers.append(code)
                    total_steps += 1

# Print summary
print(f"# Total legs: {NUM_LEGS}")
for leg in range(1, NUM_LEGS + 1):
    print(f"# Leg {leg}: {PHASES_PER_LEG[leg-1]} phases")
    for phase in range(1, PHASES_PER_LEG[leg-1] + 1):
        ns = STAGES_PER_PHASE[(leg, phase)]
        print(f"#   Phase {phase}: {ns} stages")
        for stage in range(1, ns + 1):
            nb = BATCHES_PER_STAGE[(leg, phase, stage)]
            print(f"#     Stage {stage}: {nb} batches")
            for batch in range(1, nb + 1):
                ns2 = STEPS_PER_BATCH[(leg, phase, stage, batch)]
                print(f"#       Batch {batch}: {ns2} steps")

print(f"\n# Total steps: {total_steps}\n")

# Print all numbers
for n in numbers:
    print(n)
