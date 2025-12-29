
import re

page_path = r"e:\UX UI AI design\Antigravity AI CLONE GITHUB CODE\1-Manual-Content-Social\app\images\page.jsx"

with open(page_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add Import (if not present)
if "import CreatePostModal" not in content:
    import_stmt = 'import CreatePostModal from "@/components/dashboard/modals/CreatePostModal"'
    if 'import ViewPostsModal from "@/components/dashboard/modals/ViewPostsModal"' in content:
        content = content.replace(
            'import ViewPostsModal from "@/components/dashboard/modals/ViewPostsModal"',
            'import ViewPostsModal from "@/components/dashboard/modals/ViewPostsModal"\n' + import_stmt
        )
    else:
        # Fallback if ViewPostsModal import is missing (unlikely)
        content = content.replace(
            'import EditFolderModal from "@/components/dashboard/modals/EditFolderModal"',
            'import EditFolderModal from "@/components/dashboard/modals/EditFolderModal"\n' + import_stmt
        )

# 2. Add handleUpdateCreatePostData (if not present)
new_handler = """
  const handleUpdateCreatePostData = (updates) => {
    setCreatePostModal((prev) => ({
      ...prev,
      ...updates
    }))
  }
"""

if "const handleUpdateCreatePostData" not in content:
    content = content.replace("const handleOpenCreatePost =", new_handler + "\n  const handleOpenCreatePost =")

# 3. Replace UI Block
# Strategy: Find "open={createPostModal.isOpen}"
# Then find the <Dialog start tag before it.
# Then find the <ViewPostsModal start tag.
# The block ends before <ViewPostsModal.

marker = "open={createPostModal.isOpen}"
marker_idx = content.find(marker)

if marker_idx != -1:
    dialog_start_idx = content.rfind("<Dialog", 0, marker_idx)
    
    # We expect <ViewPostsModal to follow immediately after this dialog
    next_component_marker = "<ViewPostsModal"
    next_component_idx = content.find(next_component_marker, marker_idx)
    
    if next_component_idx != -1:
        # The dialog ends just before <ViewPostsModal
        # There might be some whitespace
        block_end_idx = content.rfind("</Dialog>", marker_idx, next_component_idx) + 9
        
        if dialog_start_idx != -1 and block_end_idx != -1:
            old_block = content[dialog_start_idx:block_end_idx]
            
            new_component = """<CreatePostModal
        isOpen={createPostModal.isOpen}
        onOpenChange={(open) => !open && setCreatePostModal({ ...createPostModal, isOpen: false })}
        data={createPostModal}
        onUpdateData={handleUpdateCreatePostData}
        onSave={handleSavePost}
        posts={posts}
      />"""
            
            content = content.replace(old_block, new_component)
            print("Successfully replaced CreatePostModal UI block")
        else:
            print("Found markers but couldn't isolate block boundaries")
    else:
        print("Could not find next component marker (<ViewPostsModal)")
else:
    print("Could not find createPostModal marker")

with open(page_path, "w", encoding="utf-8") as f:
    f.write(content)
