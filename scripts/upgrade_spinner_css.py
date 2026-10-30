import os

ROOT = r"C:\Users\harsh\OneDrive\Desktop\HarshGuruJi"

TARGET_CSS = """.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}"""

UPGRADED_CSS = """.spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  height: 20px;
  vertical-align: middle;
  border: none;
  border-radius: 0;
  animation: none;
}"""

for dirpath, dirnames, filenames in os.walk(ROOT):
    if "node_modules" in dirpath or ".next" in dirpath:
        continue
    for f in filenames:
        if f.endswith(".css"):
            p = os.path.join(dirpath, f)
            with open(p, "r", encoding="utf-8") as file:
                content = file.read()
            if ".spinner {" in content and "border-radius: 50%" in content:
                # normalize line endings
                norm = content.replace("\r\n", "\n")
                if TARGET_CSS in norm:
                    norm = norm.replace(TARGET_CSS, UPGRADED_CSS)
                    with open(p, "w", encoding="utf-8") as file:
                        file.write(norm)
                    print(f"Upgraded .spinner in {p}")
