
import re

page_path = r"e:\UX UI AI design\Antigravity AI CLONE GITHUB CODE\1-Manual-Content-Social\app\images\page.jsx"

with open(page_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add Import
if "import BulkCreateModal" not in content:
    import_stmt = 'import BulkCreateModal from "@/components/dashboard/modals/BulkCreateModal"'
    if 'import CreatePostModal from "@/components/dashboard/modals/CreatePostModal"' in content:
        content = content.replace(
            'import CreatePostModal from "@/components/dashboard/modals/CreatePostModal"',
            'import CreatePostModal from "@/components/dashboard/modals/CreatePostModal"\n' + import_stmt
        )
    else:
        # Fallback
        content = content.replace(
            'import ViewPostsModal from "@/components/dashboard/modals/ViewPostsModal"',
            'import ViewPostsModal from "@/components/dashboard/modals/ViewPostsModal"\n' + import_stmt
        )

# 2. Add handleUpdateBulkData Helper
new_handler = """
  const handleUpdateBulkData = (updates) => {
    setBulkCreateModal((prev) => ({
      ...prev,
      ...updates
    }))
  }
"""

if "const handleUpdateBulkData" not in content:
    content = content.replace("const handleBulkCreatePosts =", new_handler + "\n  const handleBulkCreatePosts =")

# 3. Modify handleBulkCreatePosts wrapper?
# Actually handleBulkCreatePosts already handles the logic and closes the modal.
# We just need to replace the UI.

# 4. Replace UI Logic
# Strategy: Find "open={bulkCreateModal.isOpen}"
# Find <Dialog start before it.
# Find <Dialog...DeleteConfirmation... start after it (or whatever is next).
# Next is DeleteConfirmationModal logic.

marker = "open={bulkCreateModal.isOpen}"
marker_idx = content.find(marker)

if marker_idx != -1:
    dialog_start_idx = content.rfind("<Dialog", 0, marker_idx)
    
    # Identify next dialog.
    # We can look for open={deleteConfirmation.isOpen}
    next_marker = "open={deleteConfirmation.isOpen}"
    next_marker_idx = content.find(next_marker, marker_idx)
    
    if next_marker_idx != -1:
        # The modal ends before the next Dialog starts
        # Find the <Dialog for deleteConfirmation to act as boundary
        next_dialog_start = content.rfind("<Dialog", marker_idx, next_marker_idx)
        
        # The current modal block ends before `next_dialog_start`
        block_end_idx = next_dialog_start
        
        if dialog_start_idx != -1 and block_end_idx != -1:
            old_block = content[dialog_start_idx:block_end_idx].rstrip()
            
            new_component = """<BulkCreateModal
        isOpen={bulkCreateModal.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setBulkCreateModal({
              isOpen: false,
              ideaNicheId: null,
              folderType: null,
              folderName: null,
              quantity: 5,
            })
          }
        }}
        data={bulkCreateModal}
        onUpdateData={handleUpdateBulkData}
        onCreate={handleBulkCreatePosts}
      />
      """
            
            content = content.replace(old_block, new_component)
            print("Successfully replaced BulkCreateModal UI block")

with open(page_path, "w", encoding="utf-8") as f:
    f.write(content)
