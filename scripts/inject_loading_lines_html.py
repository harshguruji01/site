import os
import glob

EXCLUDE_PATTERNS = ["node_modules", ".next", "dist", "build", ".gradle", ".git"]

def should_process(file_path):
    for pat in EXCLUDE_PATTERNS:
        if pat in file_path:
            return False
    return file_path.endswith(".html")

def inject_loading_lines(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return False

    modified = False

    # Check for CSS
    if "loading-lines.css" not in content:
        css_tag = '  <link rel="stylesheet" href="loading-lines.css">\n'
        if "</head>" in content:
            content = content.replace("</head>", css_tag + "</head>", 1)
            modified = True
        elif "<head>" in content:
            content = content.replace("<head>", "<head>\n" + css_tag, 1)
            modified = True

    # Check for JS
    if "loading-lines.js" not in content:
        js_tag = '  <script src="loading-lines.js" defer></script>\n'
        if "</body>" in content:
            content = content.replace("</body>", js_tag + "</body>", 1)
            modified = True
        elif "</head>" in content:
            content = content.replace("</head>", js_tag + "</head>", 1)
            modified = True

    if modified:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        return True
    return False

def main():
    root = r"C:\Users\harsh\OneDrive\Desktop\HarshGuruJi"
    count = 0
    total = 0

    for dirpath, dirnames, filenames in os.walk(root):
        # Skip excluded dirs
        if any(pat in dirpath for pat in EXCLUDE_PATTERNS):
            continue

        for f in filenames:
            if f.endswith(".html"):
                total += 1
                full_path = os.path.join(dirpath, f)
                if inject_loading_lines(full_path):
                    count += 1
                    print(f"Injected into: {full_path}")

    print(f"\nDone. Processed {total} HTML files, injected into {count} files.")

if __name__ == "__main__":
    main()
