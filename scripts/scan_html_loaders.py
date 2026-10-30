import os
import re

ROOT = r"C:\Users\harsh\OneDrive\Desktop\HarshGuruJi"
exclude = ["node_modules", ".next", "dist", "build", ".gradle", ".git"]
pattern = re.compile(r'(?:class|id)=["\'][^"\']*(?:spinner|loader|loading)[^"\']*["\']', re.IGNORECASE)

results = []
for dirpath, _, filenames in os.walk(ROOT):
    if any(ex in dirpath for ex in exclude):
        continue
    for f in filenames:
        if f.endswith(".html"):
            p = os.path.join(dirpath, f)
            try:
                with open(p, "r", encoding="utf-8") as file:
                    content = file.read()
                m = pattern.findall(content)
                if m:
                    results.append((p.replace(ROOT, ""), list(set(m))))
            except Exception:
                pass

print(f"Total HTML files with loader/spinner: {len(results)}")
for item in results:
    print(item[0], item[1])
