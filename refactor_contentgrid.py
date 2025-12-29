
import os
import re

file_path = "e:/UX UI AI design/Antigravity AI CLONE GITHUB CODE/1-Manual-Content-Social/app/images/page.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update Imports
if 'import ContentGrid from "@/components/dashboard/ContentGrid"' not in content:
    content = content.replace(
        'import FilterBar from "@/components/dashboard/FilterBar"',
        'import FilterBar from "@/components/dashboard/FilterBar"\nimport ContentGrid from "@/components/dashboard/ContentGrid"'
    )
    print("Added ContentGrid import.")

if 'import FolderCard from "@/components/dashboard/FolderCard"' in content:
    content = content.replace('import FolderCard from "@/components/dashboard/FolderCard"', '')
    print("Removed FolderCard import.")

# 2. Remove PaginationControls definition
# Find "const PaginationControls = ({"
pg_start_str = "  const PaginationControls = ({"
start_idx = content.find(pg_start_str)
if start_idx != -1:
    # Find matching closing brace/paren.
    # It ends with "  )" usually? 
    # Logic: count parens?
    # It starts with ({ ... }) => ( ... )
    
    # We can try to find the end of the return (...)
    # It matches the indentation logic.
    # Or just count braces.
    open_braces = 0
    i = start_idx
    
    # Fast forward to first brace
    first_brace = content.find("{", start_idx)
    i = first_brace + 1
    open_braces = 1
    
    while i < len(content) and open_braces > 0:
        if content[i] == '{':
            open_braces += 1
        elif content[i] == '}':
            open_braces -= 1
        i += 1
    
    # After braces of args, we have " => ("
    # Find next (
    next_paren = content.find("(", i)
    if next_paren != -1:
        i = next_paren + 1
        open_parens = 1
        while i < len(content) and open_parens > 0:
            if content[i] == '(':
                open_parens += 1
            elif content[i] == ')':
                open_parens -= 1
            i += 1
            
        # i is now after closing paren of return.
        # Check if we removed enough?
        # Usually it ends with "  )" line.
        
        # Let's verify by string slice
        # print("Removed PG:", content[start_idx:i])
        content = content[:start_idx] + content[i:]
        print("Removed PaginationControls definition.")
    else:
        print("Could not find start of PaginationControls body.")
else:
    print("PaginationControls definition not found.")

# 3. Replace Grid Logic
# Find "{platformItems.length === 0 ?"
grid_start_str = "{platformItems.length === 0 ?"
grid_start_idx = content.find(grid_start_str)

if grid_start_idx != -1:
    # Find end of block.
    # It's inside a return ( ... { ... } )
    # We count curly braces.
    open_curlies = 1
    i = grid_start_idx + len(grid_start_str)
    
    while i < len(content) and open_curlies > 0:
        if content[i] == '{':
            open_curlies += 1
        elif content[i] == '}':
            open_curlies -= 1
        i += 1
    
    # i is after closing curly
    # The block is "{platformItems.length === 0 ? ... : ... }"
    # So we replace content[grid_start_idx:i]
    
    indent = "        " # 8 spaces
    new_block = (f"{indent}<ContentGrid\n"
                 f"{indent}  platform={{platform}}\n"
                 f"{indent}  platformItems={{platformItems}}\n"
                 f"{indent}  currentItems={{currentItems}}\n"
                 f"{indent}  currentPage={{currentPage}}\n"
                 f"{indent}  itemsPerPage={{itemsPerPage}}\n"
                 f"{indent}  setCurrentPage={{setCurrentPage}}\n"
                 f"{indent}  setItemsPerPage={{setItemsPerPage}}\n"
                 f"{indent}  selectedIds={{selectedIds}}\n"
                 f"{indent}  handleSelectAll={{handleSelectAll}}\n"
                 f"{indent}  handleBulkDelete={{handleBulkDelete}}\n"
                 f"{indent}  handleSelectItem={{handleSelectItem}}\n"
                 f"{indent}  handleStatusFieldUpdate={{handleStatusFieldUpdate}}\n"
                 f"{indent}  handleEdit={{handleOpenEdit}}\n"
                 f"{indent}  handleViewPosts={{handleViewPosts}}\n"
                 f"{indent}  handleOpenCreatePost={{handleOpenCreatePost}}\n"
                 f"{indent}  handleOpenBulkCreate={{handleOpenBulkCreate}}\n"
                 f"{indent}  posts={{posts}}\n"
                 f"{indent}/>")
    
    content = content[:grid_start_idx] + new_block + content[i:]
    print("Replaced ContentGrid logic.")
else:
    print("ContentGrid logic start not found.")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done.")
