
import os
import re

file_path = "e:/UX UI AI design/Antigravity AI CLONE GITHUB CODE/1-Manual-Content-Social/app/images/page.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add Import
if 'import FolderCard from "@/components/dashboard/FolderCard"' not in content:
    content = content.replace(
        'import FilterBar from "@/components/dashboard/FilterBar"',
        'import FilterBar from "@/components/dashboard/FilterBar"\nimport FolderCard from "@/components/dashboard/FolderCard"'
    )
    print("Added import.")

# 2. Remove Definition
# Find "const FolderCard = ({ title, images, ideaNicheId, folderType, number }) => {"
# And find the closing brace.
# Logic: Use regex or simple string find if unique.
def_start_str = "  const FolderCard = ({ title, images, ideaNicheId, folderType, number }) => {"
start_idx = content.find(def_start_str)
if start_idx != -1:
    # Find matching closing brace.
    # We count braces.
    open_braces = 0
    i = start_idx
    # Fast forward to the first brace
    first_brace = content.find("{", start_idx)
    if first_brace != -1:
        i = first_brace
        open_braces = 1
        i += 1
        while i < len(content) and open_braces > 0:
            if content[i] == '{':
                open_braces += 1
            elif content[i] == '}':
                open_braces -= 1
            i += 1
        
        # Now i is index after closing brace.
        # Check if confirmed.
        sub = content[start_idx:i]
        # print("Found def:", sub[:100], "...", sub[-20:])
        
        # We replace this range with empty string
        content = content[:start_idx] + content[i:]
        print("Removed definition.")
    else:
        print("Could not find opening brace for definition.")
else:
    print("Definition start not found (already removed?).")

# 3. Replace Usage
# We look for the 3 FolderCards block.
# We can use regex replacement for each FolderCard call or the whole block.
# The previous usage:
# <FolderCard
#    number={1}
#    title="New (Square)"
#    images={item.images?.subject || []}
#    ideaNicheId={item.id}
#    folderType="subject"
# />
# We want to replace it.

def replace_usage(match):
    # Extract params
    m_num = re.search(r'number={(\d+)}', match.group(0))
    m_title = re.search(r'title="([^"]+)"', match.group(0))
    m_type = re.search(r'folderType="([^"]+)"', match.group(0))
    # Note: item.id is hard to extract if it varies, but here it is explicitly {item.id} in text.
    
    num = m_num.group(1) if m_num else "1"
    title = m_title.group(1) if m_title else ""
    ftype = m_type.group(1) if m_type else ""
    
    # We assume 'item' is available in context (it is).
    # We construct the new element string.
    # We assume standard indentation is 28 spaces?
    indent = "                            " # 28 spaces
    
    return (f"{indent}<FolderCard\n"
            f"{indent}  number={{{num}}}\n"
            f"{indent}  title=\"{title}\"\n"
            f"{indent}  folderPosts={{posts[`${{item.id}}-{ftype}`] || []}}\n"
            f"{indent}  ideaNicheId={{item.id}}\n"
            f"{indent}  folderType=\"{ftype}\"\n"
            f"{indent}  handleViewPosts={{handleViewPosts}}\n"
            f"{indent}  handleOpenCreatePost={{handleOpenCreatePost}}\n"
            f"{indent}  handleOpenBulkCreate={{handleOpenBulkCreate}}\n"
            f"{indent}/>")

# Regex to find <FolderCard ... />
# Matches inclusive of newlines.
# Note: images={...} contains special chars.
pattern = re.compile(r'<FolderCard\s+number={(\d+)}\s+title="([^"]+)"\s+images={[^}]+}\s+ideaNicheId={item\.id}\s+folderType="([^"]+)"\s+/>')

# The pattern might fail if spaces mismatch.
# Let's try to match EXACT strings for the 3 known cases.
replacements = [
    (
        '                              number={1}\n                              title="New (Square)"\n                              images={item.images?.subject || []}\n                              ideaNicheId={item.id}\n                              folderType="subject"',
        '                              number={1}\n                              title="New (Square)"\n                              folderPosts={posts[`${item.id}-subject`] || []}\n                              ideaNicheId={item.id}\n                              folderType="subject"\n                              handleViewPosts={handleViewPosts}\n                              handleOpenCreatePost={handleOpenCreatePost}\n                              handleOpenBulkCreate={handleOpenBulkCreate}'
    ),
    (
        '                              number={2}\n                              title="Reel (Vertical)"\n                              images={item.images?.scene || []}\n                              ideaNicheId={item.id}\n                              folderType="scene"',
        '                              number={2}\n                              title="Reel (Vertical)"\n                              folderPosts={posts[`${item.id}-scene`] || []}\n                              ideaNicheId={item.id}\n                              folderType="scene"\n                              handleViewPosts={handleViewPosts}\n                              handleOpenCreatePost={handleOpenCreatePost}\n                              handleOpenBulkCreate={handleOpenBulkCreate}'
    ),
    (
        '                              number={3}\n                              title="Square Product"\n                              images={item.images?.style || []}\n                              ideaNicheId={item.id}\n                              folderType="style"',
        '                              number={3}\n                              title="Square Product"\n                              folderPosts={posts[`${item.id}-style`] || []}\n                              ideaNicheId={item.id}\n                              folderType="style"\n                              handleViewPosts={handleViewPosts}\n                              handleOpenCreatePost={handleOpenCreatePost}\n                              handleOpenBulkCreate={handleOpenBulkCreate}'
    )
]

count = 0
for target, repl in replacements:
    if target in content:
        content = content.replace(target, repl)
        count += 1
    else:
        # Try looser match (remove indentation)
        print(f"Target not found: {target[:20]}...")

if count == 3:
    print("Replaced all 3 usages.")
else:
    print(f"Replaced {count}/3 usages. Warning!")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done.")
