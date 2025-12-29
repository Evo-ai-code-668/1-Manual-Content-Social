
import re

file_path = r"e:\UX UI AI design\Antigravity AI CLONE GITHUB CODE\1-Manual-Content-Social\app\images\page.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add Import
if "import EditFolderModal" not in content:
    import_statement = "import EditFolderModal from '@/components/dashboard/modals/EditFolderModal'"
    # Add after CreateFolderModal import
    content = content.replace(
        "import CreateFolderModal from '@/components/dashboard/modals/CreateFolderModal'",
        "import CreateFolderModal from '@/components/dashboard/modals/CreateFolderModal'\n" + import_statement
    )

# 2. Add State and Remove old State
# Check for editingItem state
if "const [editingItem, setEditingItem]" not in content:
    # Add it after isCreateModalOpen
    content = content.replace(
        "const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)",
        "const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)\n  const [isEditModalOpen, setIsEditModalOpen] = useState(false)\n  const [editingItem, setEditingItem] = useState(null)"
    )

# Verify if isEditModalOpen was already there and we might have duplicated it if we were not careful?
# restoring script might have added isEditModalOpen separately or not.
# Step 503 showed:
# 265: const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
# 266:
# 267: // Filter & UI States
# ...
# It did NOT show isEditModalOpen there.
# But line 431 used it.
# So I must add it. My manual replacement above adds it.

# Remove `const [editModal, setEditModal]` if it exists.
# It might be further down or missing in restored code?
# In restored code (Step 503), I didn't see it in lines 260-600.
# Wait! line 412 setEditModal used.
# If it's used, it must be defined OR it's undefined and would throw error.
# But I searched for `editingItem` and didn't find it.
# Maybe `editModal` state definition was lost in restoration?
# If so, current page.jsx is broken because it uses setEditModal but doesn't define it.
# Refactoring will FIX this by removing usages.

# 3. Replace handleOpenEdit
new_handle_open_edit = """
  const handleOpenEdit = (item) => {
    setEditingItem(item)
    setIsEditModalOpen(true)
  }
"""
# Regex to find existing handleOpenEdit
# It handles the restored version which might be multi-line
handle_open_edit_pattern = re.compile(r"const handleOpenEdit = \(item\) => \{[\s\S]*?setIsEditModalOpen\(true\)\s+\}", re.MULTILINE)
if handle_open_edit_pattern.search(content):
    content = handle_open_edit_pattern.sub(new_handle_open_edit.strip(), content)
else:
    # If not found (maybe restoration format was different), append it?
    # Restoration added it around line 410.
    # Let's try simple replacement of the text I saw in Step 503
    old_code_block = """  const handleOpenEdit = (item) => {
    setEditingItem(item)
    setEditModal({
      isOpen: true,
      item: item,
      folderName: item.folderName,
      model: item.model,
      accountSocial: item.accountSocial,
      usernameSocial: item.usernameSocial,
      groupAccountSocial: item.groupAccountSocial,
      idea: item.idea,
      niche: item.niche,
      autoSyncInfo: {
        type: item.type,
        department: item.departmentWorks,
        team: item.groupWork,
        leader: item.userWorks
      },
      statusAccountSocial: item.statusAccountSocial,
      loginAppClone: item.loginAppClone
    })
    setIsEditModalOpen(true)
  }"""
    content = content.replace(old_code_block, new_handle_open_edit.strip())

# 4. Replace handleUpdateItem
new_handle_update_item = """
  const handleUpdateItem = (updatedItem) => {
    setIdeaNiches((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    setIsEditModalOpen(false)
    setEditingItem(null)
  }
"""
# Regex for handleUpdateItem
handle_update_pattern = re.compile(r"const handleUpdateItem = \(\) => \{[\s\S]*?setEditingItem\(null\)\s+\}", re.MULTILINE)
content = handle_update_pattern.sub(new_handle_update_item.strip(), content)

# 5. Replace Dialog JSX
# Pattern: {/* Edit Modal */} ... <Dialog open={isEditModalOpen} ... </Dialog>
# The Dialog ends with </Dialog> inside logic?
# I need to match the specific structure.
# Start: {/* Edit Modal */}
# End: </Dialog> (the matching one)
# Since there are multiple Dialogs, I need to be careful.
# The Edit Modal is followed by <Dialog open={createPostModal.isOpen} ...
# So I can search for content between {/* Edit Modal */} and the start of Create Post Modal.

start_marker = "{/* Edit Modal */}"
end_marker = "<Dialog" # Next dialog start (createPostModal)

# Find start of Edit Modal
start_idx = content.find(start_marker)
if start_idx != -1:
    # Look for the next Dialog AFTER the Edit Modal's Dialog
    # The Edit Modal itself starts with <Dialog...
    # So we want to find the SECOND <Dialog after the marker.
    # Or better: find `{/* Edit Modal */}` and then find `open={createPostModal.isOpen}` to confirm end.
    
    # Let's try to capture the whole block
    # It starts with {/* Edit Modal */}
    # Then <Dialog open={isEditModalOpen} ...>
    # ...
    # </Dialog>
    # Then Next Modal
    
    # I'll use a safer approach: identify the unique content of Edit Modal
    # It contains "Edit Works Folder Image" title.
    
    modal_regex = re.compile(r"\{\/\* Edit Modal \*\/\}[\s\S]*?Edit Works Folder Image[\s\S]*?<\/Dialog>", re.MULTILINE)
    match = modal_regex.search(content)
    if match:
        new_component_call = """
      {/* Edit Modal */}
      <EditFolderModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        item={editingItem}
        onSave={handleUpdateItem}
        ideaNiches={ideaNiches}
      />
"""
        content = content.replace(match.group(0), new_component_call.strip())

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Edit Modal Refactoring Complete")
