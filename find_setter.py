
path = r"e:\UX UI AI design\Antigravity AI CLONE GITHUB CODE\1-Manual-Content-Social\app\images\page.jsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "setCreatePostModal" in line:
            print(f"{i+1}: {line.strip()}")
