
import re

page_path = r"e:\UX UI AI design\Antigravity AI CLONE GITHUB CODE\1-Manual-Content-Social\app\images\page.jsx"

with open(page_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add Import
if "import DeleteConfirmationModal" not in content:
    import_stmt = 'import DeleteConfirmationModal from "@/components/dashboard/modals/DeleteConfirmationModal"'
    if 'import BulkCreateModal from "@/components/dashboard/modals/BulkCreateModal"' in content:
        content = content.replace(
            'import BulkCreateModal from "@/components/dashboard/modals/BulkCreateModal"',
            'import BulkCreateModal from "@/components/dashboard/modals/BulkCreateModal"\n' + import_stmt
        )
    else:
        # Fallback
        content = content.replace(
            'import ViewPostsModal from "@/components/dashboard/modals/ViewPostsModal"',
            'import ViewPostsModal from "@/components/dashboard/modals/ViewPostsModal"\n' + import_stmt
        )

# 2. Add handleConfirmDelete wrapper (optional, or just inline in render)
# Since we need to access handleDeletePost and handleBulkDelete which might be closures or available in scope.
# It's cleaner to keep the logic in the main render or adding a helper.
# Let's add a helper `handleConfirmDelete` before the return statement if possible, or just pass it in the component props inline if it's short.
# The previous logic was:
# onClick={() => {
#    if (deleteConfirmation.type === "bulk") {
#      handleBulkDelete()
#    } else if (deleteConfirmation.type === "single" && deleteConfirmation.postId) {
#      handleDeletePost(deleteConfirmation.postId)
#    }
#    setDeleteConfirmation({ ...deleteConfirmation, isOpen: false })
#  }}

# We'll just define the component with this logic inline in the props for simplicity in replacement.

# 3. Replace UI Logic
# Find <Dialog open={deleteConfirmation.isOpen}
marker = "open={deleteConfirmation.isOpen}"
marker_idx = content.find(marker)

if marker_idx != -1:
    dialog_start_idx = content.rfind("<Dialog", 0, marker_idx)
    
    # This is the last dialog, so it ends before the closing </div> of the main component?
    # Or before `</div> ) }`
    
    # We can look for the closing </Dialog>
    dialog_end_idx = content.find("</Dialog>", marker_idx)
    
    if dialog_start_idx != -1 and dialog_end_idx != -1:
        block_end_idx = dialog_end_idx + 9
        old_block = content[dialog_start_idx:block_end_idx]
        
        new_component = """<DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteConfirmation({ isOpen: false, type: null, postId: null, position: null, postNumber: null })
          }
        }}
        data={deleteConfirmation}
        selectedCount={selectedIds.length}
        onConfirm={() => {
          if (deleteConfirmation.type === "bulk") {
            handleBulkDelete()
          } else if (deleteConfirmation.type === "single" && deleteConfirmation.postId) {
            handleDeletePost(deleteConfirmation.postId)
          }
          setDeleteConfirmation({ ...deleteConfirmation, isOpen: false })
        }}
        onCancel={() => setDeleteConfirmation({ ...deleteConfirmation, isOpen: false })}
      />"""
        
        content = content.replace(old_block, new_component)
        print("Successfully replaced DeleteConfirmationModal UI block")

with open(page_path, "w", encoding="utf-8") as f:
    f.write(content)
