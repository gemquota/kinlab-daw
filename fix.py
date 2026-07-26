import re

with open("generate_final.py") as f:
    code = f.read()

# Fix the regex pattern
code = code.replace(
    'task_str = re.sub(r"\\\\s*—\\\\s*[0-9A-F]{5}$", "", task_str)',
    'task_str = re.sub(r"\\s*—\\s*[0-9A-F]{5}$", "", task_str)'
)

# Remove duplicate import re
lines = code.split('\n')
seen_import_re = False
new_lines = []
for line in lines:
    if line.strip() == 'import re':
        if seen_import_re:
            continue
        seen_import_re = True
    new_lines.append(line)

with open("generate_final.py", "w") as f:
    f.write('\n'.join(new_lines))

print("Fixed")
