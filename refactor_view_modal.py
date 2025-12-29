
import re

page_path = r"e:\UX UI AI design\Antigravity AI CLONE GITHUB CODE\1-Manual-Content-Social\app\images\page.jsx"

with open(page_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add Import
if "import ViewPostsModal" not in content:
    import_stmt = 'import ViewPostsModal from "@/components/dashboard/modals/ViewPostsModal"'
    # Add after EditFolderModal
    content = content.replace(
        'import EditFolderModal from "@/components/dashboard/modals/EditFolderModal"',
        'import EditFolderModal from "@/components/dashboard/modals/EditFolderModal"\n' + import_stmt
    )

# 2. Add handleUpdatePostInView
# We'll add it before handleViewMediaUpload (or anywhere appropriate)
# Let's add it before handleViewMediaUpload
new_handler = """
  const handleUpdatePostInView = (postId, updates) => {
    const key = `${viewPostsModal.ideaNicheId}-${viewPostsModal.folderType}`
    
    setPosts((prev) => {
      const currentPosts = prev[key] || []
      const updatedPosts = currentPosts.map((p) => 
        p.id === postId ? { ...p, ...updates } : p
      )
      return { ...prev, [key]: updatedPosts }
    })

    setViewPostsModal((prev) => ({
      ...prev,
      posts: prev.posts.map((p) => 
        p.id === postId ? { ...p, ...updates } : p
      )
    }))
  }

"""

if "const handleUpdatePostInView" not in content:
    content = content.replace("const handleViewMediaUpload =", new_handler + "const handleViewMediaUpload =")

# 3. Replace UI Block
start_marker = "<Dialog\n        open={viewPostsModal.isOpen}"
start_idx = content.find(start_marker)

if start_idx == -1:
    # Try cleaner whitespace
    start_marker = "open={viewPostsModal.isOpen}"
    start_idx = content.find(start_marker)
    start_idx = content.rfind("<Dialog", 0, start_idx)

end_marker = "open={bulkCreateModal.isOpen}"
end_idx = content.find(end_marker)
block_end_idx = content.rfind("</Dialog>", 0, end_idx) + 9

if start_idx != -1 and block_end_idx != -1:
    old_block = content[start_idx:block_end_idx]
    
    new_component = """<ViewPostsModal
        isOpen={viewPostsModal.isOpen}
        onOpenChange={(open) => setViewPostsModal({ ...viewPostsModal, isOpen: open })}
        data={viewPostsModal}
        onUpdatePosts={handleUpdatePostInView}
        onDeleteRequest={(type, postId, postNumber, position) => 
          setDeleteConfirmation({ isOpen: true, type, postId, postNumber, position })
        }
        onUploadMedia={handleViewMediaUpload}
      />"""
      
    content = content.replace(old_block, new_component)
else:
    print("Could not find ViewPostsModal UI block")

with open(page_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Refactored page.jsx to use ViewPostsModal")
