
import re

page_path = r"e:\UX UI AI design\Antigravity AI CLONE GITHUB CODE\1-Manual-Content-Social\app\images\page.jsx"
comp_path = r"e:\UX UI AI design\Antigravity AI CLONE GITHUB CODE\1-Manual-Content-Social\components\dashboard\modals\ViewPostsModal.jsx"

with open(page_path, "r", encoding="utf-8") as f:
    content = f.read()

# Locate the ViewPostsModal Dialog block
start_marker = "<Dialog\n        open={viewPostsModal.isOpen}"
start_idx = content.find(start_marker)

if start_idx == -1:
    # Try simpler marker
    start_marker = "open={viewPostsModal.isOpen}"
    start_idx = content.find(start_marker)
    # Backtrack to <Dialog
    start_idx = content.rfind("<Dialog", 0, start_idx)

if start_idx == -1:
    print("Could not find ViewPostsModal in page.jsx")
    exit(1)

# Find the end of data.
# It ends before <Dialog open={bulkCreateModal.isOpen}
end_marker = "open={bulkCreateModal.isOpen}"
end_idx = content.find(end_marker)

# We need the </Dialog> before the bulk modal
# Search backwards from end_marker
block_end_idx = content.rfind("</Dialog>", 0, end_idx) + 9 # include </Dialog>

extracted_jsx = content[start_idx:block_end_idx]

# Perform Replacements
# 1. viewPostsModal.folderName -> data.folderName
extracted_jsx = extracted_jsx.replace("viewPostsModal.folderName", "data.folderName")
extracted_jsx = extracted_jsx.replace("viewPostsModal.folderType", "data.folderType")
extracted_jsx = extracted_jsx.replace("viewPostsModal.ideaNicheId", "data.ideaNicheId")

# 2. viewPostsModal.posts -> posts
extracted_jsx = extracted_jsx.replace("viewPostsModal.posts", "posts")

# 3. Local UI State
extracted_jsx = extracted_jsx.replace("viewPostsModal.selectedPostIndex", "selectedPostIndex")
extracted_jsx = extracted_jsx.replace("viewPostsModal.currentPage", "currentPage")
extracted_jsx = extracted_jsx.replace("viewPostsModal.postsPerPage", "postsPerPage")

# 4. Handler Calls
# setViewPostsModal({ ...viewPostsModal, isOpen: open }) -> onOpenChange(open)
extracted_jsx = re.sub(
    r"setViewPostsModal\(\{\s*\.\.\.viewPostsModal,\s*isOpen:\s*open\s*\}\)",
    "onOpenChange(open)",
    extracted_jsx
)

# Pagination/Selection updates
# setViewPostsModal({ ...viewPostsModal, selectedPostIndex: postIndex }) -> setSelectedPostIndex(postIndex)
extracted_jsx = re.sub(
    r"setViewPostsModal\(\{\s*\.\.\.viewPostsModal,\s*selectedPostIndex:\s*([^}]+)\s*\}\)",
    r"setSelectedPostIndex(\1)",
    extracted_jsx
)
# handle variations of spacing
extracted_jsx = re.sub(
    r"setViewPostsModal\(\(prev\)\s*=>\s*\(\{\s*\.\.\.prev,\s*selectedPostIndex:\s*([^}]+)\s*\}\)\)",
    r"setSelectedPostIndex(\1)",
    extracted_jsx
)

# Pagination
extracted_jsx = re.sub(
    r"setViewPostsModal\(\{\s*\.\.\.viewPostsModal,\s*currentPage:\s*([^}]+)\s*\}\)",
    r"setCurrentPage(\1)",
    extracted_jsx
)
extracted_jsx = re.sub(
    r"setViewPostsModal\(\{\s*\.\.\.viewPostsModal,\s*postsPerPage:\s*([^,]+),\s*currentPage:\s*1\s*\}\)",
    r"setPostsPerPage(\1); setCurrentPage(1)",
    extracted_jsx
)

# 5. Data Updates
# setPosts(...)
# We need to replace setPosts calls with onUpdatePosts calls.
# This is tricky because setPosts usually updates the WHOLE logic.
# But inside the modal, it updates a specific post.
# Pattern: setPosts((prev) => ... [key]: prev[key].map(...) )
# We should replace this with: onUpdatePosts(post.id, { field: value })

# Example:
# setPosts((prev) => { ... map(p => p.id === post.id ? { ...p, caption: e.target.value } : p) })
# -> onUpdatePosts(post.id, { caption: e.target.value })

# I will write a generic wrapper function in the component `localUpdatePost` that calls `onUpdatePosts`.
# And replace `setPosts(...)` with `localUpdatePost(...)`?
# Too hard to regex replace complex logic blocks.
# Better to Replace the UI blocks that contain them?
# Or manual cleanup later.

# Let's do string replacement for known handlers
extracted_jsx = extracted_jsx.replace("handleViewMediaUpload(post.id, e)", "onUploadMedia(post.id, e)")
extracted_jsx = extracted_jsx.replace("handlePostStatusChangeForView", "onPostStatusChange") # Need to pass this prop wrapper

# handleRemovePostMedia -> onUpdatePost logic?
# It was inline.
# I'll let it be `setPosts` for now, but I need to shim `setPosts` in the component to call `onUpdatePosts`.
# shim: const setPosts = (callback) => { ... logic to extract update and call onUpdatePosts ... }
# Impossible.
# I will output the raw extracted JSX and then I will Fix it manually to be safe.

# Construct the full component file
full_component = f"""
import React, {{{{ useState, useEffect }}}} from "react"
import {{
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
}} from "@/components/ui/dialog"
import {{ Button }} from "@/components/ui/button"
import {{
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
}} from "@/components/ui/select"
import {{ Checkbox }} from "@/components/ui/checkbox"
import {{ Input }} from "@/components/ui/input"
import {{
  FileImage,
  Play,
  FileText,
  Info,
  ChevronDown,
  ChevronRight,
  Trash2,
  Upload,
  X,
  ImageIcon,
  Instagram,
  FolderOpen,
  Clock,
  FileX,
  Film
}} from "lucide-react"

export default function ViewPostsModal({{
  isOpen,
  onOpenChange,
  data,
  onUpdatePosts,
  onDeleteRequest,
  onUploadMedia,
}}) {{
  // Local UI State
  const [selectedPostIndex, setSelectedPostIndex] = useState(0)
  const [selectedPostIds, setSelectedPostIds] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(10)
  const [viewGuideVisible, setViewGuideVisible] = useState(false)
  const [isCaptionCollapsed, setIsCaptionCollapsed] = useState(false)
  const [isMediaCollapsed, setIsMediaCollapsed] = useState(false)
  const [showAllMedia, setShowAllMedia] = useState({{}})
  const [statusFilter, setStatusFilter] = useState("all")

  const posts = data.posts || []

  useEffect(() => {{
    if (isOpen) {{
      setSelectedPostIndex(0)
      setSelectedPostIds([])
      setCurrentPage(1)
      setIsCaptionCollapsed(false)
      setIsMediaCollapsed(false)
      setShowAllMedia({{}})
      setStatusFilter("all")
    }}
  }}, [isOpen])
  
  // Helpers
  const getStatusInfo = (status) => {{
    switch (status?.toLowerCase()) {{
      case "use": return {{ label: "Use", color: "bg-blue-100 text-blue-700 border-blue-200" }}
      case "draft": return {{ label: "Draft", color: "bg-yellow-100 text-yellow-700 border-yellow-200" }}
      case "posted": return {{ label: "Posted", color: "bg-green-100 text-green-700 border-green-200" }}
      case "posting error": return {{ label: "Posting Error", color: "bg-red-100 text-red-700 border-red-200" }}
      default: return {{ label: "Draft", color: "bg-yellow-100 text-yellow-700 border-yellow-200" }}
    }}
  }}
  
  const getFilteredPosts = () => {{
    if (statusFilter === "all") return posts
    return posts.filter((post) => (post.status?.toLowerCase() || "draft") === statusFilter.toLowerCase())
  }}
  
  const handleBulkStatusEdit = (newStatus) => {{
      selectedPostIds.forEach(postId => {{
          onUpdatePosts(postId, {{ status: newStatus, statusChangedAt: new Date().toISOString() }})
      }})
      setSelectedPostIds([])
  }}
  
  const handleReorderMediaInView = (postId, dragIndex, hoverIndex) => {{
     const post = posts.find(p => p.id === postId)
     if (!post) return
     const newMedia = [...post.mediaFiles]
     const [reorderedItem] = newMedia.splice(dragIndex, 1)
     newMedia.splice(hoverIndex, 0, reorderedItem)
     const updatedMedia = newMedia.map((m, idx) => ({{ ...m, order: idx + 1 }}))
     onUpdatePosts(postId, {{ mediaFiles: updatedMedia }})
  }}

  const isPostEditable = (status) => {{
    const s = status?.toLowerCase()
    return s === "draft" || s === "posting error"
  }}
  
  const getStatusBadge = (status) => getStatusInfo(status)

  return (
{extracted_jsx}
  )
}}
"""

with open(comp_path, "w", encoding="utf-8") as f:
    f.write(full_component)
    
print("Extracted ViewPostsModal")
