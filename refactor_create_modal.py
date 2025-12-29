
import re

file_path = r"e:\UX UI AI design\Antigravity AI CLONE GITHUB CODE\1-Manual-Content-Social\app\images\page.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add Import
if "import CreateFolderModal" not in content:
    content = content.replace(
        'import ContentGrid from "@/components/dashboard/ContentGrid"',
        'import ContentGrid from "@/components/dashboard/ContentGrid"\nimport CreateFolderModal from "@/components/dashboard/modals/CreateFolderModal"'
    )

# 2. Add handleCreateItem and Remove handleCreateNew
# We'll replace the handleCreateNew function with handleCreateItem.
# Using regex to find the block is risky with brace matching, so we'll look for the specific start and end context if possible.
# Faster: Regex replace the specific function definition loop.
# handleCreateNew starts with "const handleCreateNew = () => {"
# and ends with "}"
# We'll use a brace counter to find the end.

def replace_function(content, func_name, new_code):
    start_index = content.find(f"const {func_name} = () => {{")
    if start_index == -1:
        # Try variations
        start_index = content.find(f"const {func_name} = (")
    
    if start_index == -1:
        print(f"Function {func_name} not found.")
        return content

    # Find the matching closing brace
    brace_count = 0
    i = start_index
    # Fast forward to the first opening brace
    while i < len(content) and content[i] != '{':
        i += 1
    
    if i == len(content):
        return content

    brace_count = 1
    i += 1
    while i < len(content) and brace_count > 0:
        if content[i] == '{':
            brace_count += 1
        elif content[i] == '}':
            brace_count -= 1
        i += 1
    
    # i is now the index after the closing brace
    return content[:start_index] + new_code + content[i:]

new_handle_create = """const handleCreateItem = (newItem) => {
    setIdeaNiches((prev) => [newItem, ...prev])
    setIsCreateModalOpen(false)
  }"""

content = replace_function(content, "handleCreateNew", new_handle_create)

# 3. Remove Helper Functions
functions_to_remove = [
    "isUsernameTaken",
    "getFilteredUsernames",
    "toggleDayOfWeek",
    "addTimeRange",
    "removeTimeRange",
    "updateTimeRange"
]

# For functions with arguments, standard replace_function works if we match "const name ="
for func in functions_to_remove:
    # Handle specific signatures if needed, but brace counting works for arrow functions
    # Note: isUsernameTaken has arg (username)
    # getFilteredUsernames has no arg
    # toggleDayOfWeek has (type, day)
    
    # We need a robust matcher for "const func = ("
    # Regex to find start index
    match = re.search(f"const {func}\s*=\s*\(", content)
    if match:
        start_pos = match.start()
        # Find brace end
        brace_count = 0
        i = start_pos
        # Fast forward to {
        while i < len(content) and content[i] != '{':
            i += 1
        brace_count = 1
        i += 1
        while i < len(content) and brace_count > 0:
            if content[i] == '{':
                brace_count += 1
            elif content[i] == '}':
                brace_count -= 1
            i += 1
        
        # Remove the block + trailing newline
        content = content[:start_pos] + content[i+1:] # +1 to eat a newline if present? or just exact
    else:
        print(f"Helper {func} not found.")

# 4. Remove States
states_to_remove = [
    "selectedUsernameSocial",
    "selectedGroupAccountSocial",
    "usernameSearch",
    "selectedIdea",
    "selectedNiche",
    "autoSyncInfo",
    "selectedAccountSocial",
    "selectedModel",
    "selectedFolderName",
    "selectedStatusContent",
    "contentTypeConfigs",
    "createSelectedUsernameSocial",
    "createSelectedGroupAccountSocial"
]

for state in states_to_remove:
    # Regex for "const [state, setState] = useState(...)"
    # Be careful with multiline useState (contentTypeConfigs)
    # Simple regex for single line:
    # content = re.sub(f"const \[{state}, set.*\] = useState\(.*\)\n", "", content)
    
    # For multiline, we find start, verify it matches the pattern, then find matching paren/brace?
    # contentTypeConfigs is multi-line.
    
    pattern = re.compile(f"const \[{state}, set[a-zA-Z0-9]+\] = useState")
    match = pattern.search(content)
    if match:
        start_idx = match.start()
        # Traverse until end of statement (usually matching parens, but here useState(...) calls)
        # We need to balance parens for useState(...)
        
        # Find start of useState args
        p_start = content.find("useState(", start_idx) + 8 # length of useState(
        paren_count = 1
        i = p_start
        while i < len(content) and paren_count > 0:
            if content[i] == '(':
                paren_count += 1
            elif content[i] == ')':
                paren_count -= 1
            i += 1
        
        # i is after closing paren of useState.
        # usually comments or newlines follow?
        # remove until next line?
        content = content[:start_idx] + content[i:] # Leaves a blank line effectively?
        # Clean up empty lines later?

# 5. Remove useEffects
# Harder to target specific useEffects without unique comments.
# We'll use the unique dependency arrays:
# [selectedIdea, selectedNiche]
# [selectedAccountSocial]

deps_to_remove = [
    "[selectedIdea, selectedNiche]",
    "[selectedAccountSocial]"
]

for dep in deps_to_remove:
    # Find useEffect(() => .... , deps)
    # Search for dependency string
    dep_idx = content.find(dep)
    if dep_idx != -1:
        # Search BACKWARDS for useEffect
        # This is risky if unrelated useEffects are close.
        # But formatted code usually has useEffect start on new line.
        
        # We search backwards for "useEffect(() =>"
        start_search = content.rfind("useEffect(() =>", 0, dep_idx)
        if start_search != -1:
             # Verify this useEffect block contains the dep_idx and ends after it
             # Find end of this useEffect block
             paren_count = 1
             i = start_search + 11 # len of useEffect(
             while i < len(content) and paren_count > 0:
                 if content[i] == '(':
                     paren_count += 1
                 elif content[i] == ')':
                     paren_count -= 1
                 i += 1
             
             if i > dep_idx:
                 # Included
                 content = content[:start_search] + content[i+1:]

# 6. Replace UI Block
# Find <Dialog open={isCreateModalOpen}
# Find matching </Dialog>
# The closing tag is tricky.
# We know it ends before "{/* Edit Modal */}" (line 2882)
# Text marker: "{/* Create Modal */}" (Line 2279 approx?) No, I saw it in view_file.
# Step 449 shows "{/* Edit Modal */}" at line 2882.
# The Create Modal ends just before that.

create_modal_start_marker = "{/* Create Modal? NO, searching for Dialog open={isCreateModalOpen} */}"
# Actually I'll search for the Dialog tag directly.
start_dlg = content.find("<Dialog open={isCreateModalOpen}")
if start_dlg == -1:
    print("Create Modal Dialog not found")
else:
    # Find the end.
    # We can search for the start of Edit Modal as an anchor
    edit_modal_start = content.find("{/* Edit Modal */}")
    if edit_modal_start == -1:
        # Try finding the next dialog?
        edit_modal_start = content.find("<Dialog open={isEditModalOpen}")
    
    if edit_modal_start != -1:
        # The closing </Dialog> for create modal is before this.
        end_dlg_match = content.rfind("</Dialog>", 0, edit_modal_start)
        if end_dlg_match != -1:
            end_dlg = end_dlg_match + 9 # len of </Dialog>
            
            replacement_ui = """<CreateFolderModal
          isOpen={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSave={handleCreateItem}
          activeTab={activeTab}
          ideaNiches={ideaNiches}
        />"""
            
            content = content[:start_dlg] + replacement_ui + content[end_dlg:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Refactor complete.")
