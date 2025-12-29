
import os

file_path = "e:/UX UI AI design/Antigravity AI CLONE GITHUB CODE/1-Manual-Content-Social/app/images/page.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

start_index = -1
end_index = -1

# Find start
for i, line in enumerate(lines):
    if "{/* Filter Section */}" in line:
        start_index = i
        break

if start_index == -1:
    print("Start marker not found")
    exit(1)

# Find end (Look for </Collapsible> with correct indentation)
# The start line (start_index + 1) is <Collapsible ...
# We expect indentation of that line to match the closing line.
collapsible_line_index = start_index + 1
collapsible_line = lines[collapsible_line_index]
indentation = collapsible_line[:len(collapsible_line) - len(collapsible_line.lstrip())]

for i in range(start_index + 1, len(lines)):
    if lines[i].startswith(indentation + "</Collapsible>"):
        end_index = i
        break

if end_index == -1:
    print("End marker not found")
    exit(1)

print(f"Found block from line {start_index+1} to {end_index+1}")

# Replacement content
new_content = [
    f"{indentation}{{/* Filter Section */}}\n",
    f"{indentation}<FilterBar\n",
    f"{indentation}  isFilterOpen={{isFilterOpen}}\n",
    f"{indentation}  setIsFilterOpen={{setIsFilterOpen}}\n",
    f"{indentation}  currentFilters={{currentFilters}}\n",
    f"{indentation}  updatePlatformFilter={{updatePlatformFilter}}\n",
    f"{indentation}  platform={{platform}}\n",
    f"{indentation}  handleSavePreset={{handleSavePreset}}\n",
    f"{indentation}  handleLoadPreset={{handleLoadPreset}}\n",
    f"{indentation}  filterPresets={{filterPresets}}\n",
    f"{indentation}  filterValues={{filterValues}}\n",
    f"{indentation}/>\n"
]

# Replace
new_lines = lines[:start_index] + new_content + lines[end_index+1:]

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Replacement successful")
