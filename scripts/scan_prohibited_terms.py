import os, glob

keywords = ['18+', 'partner ads', 'adult', 'warez', 'hack apk', 'crack apk']
html_files = glob.glob('**/*.html', recursive=True)

found = []
for f in html_files:
    if any(x in f for x in ['node_modules', '.git', '.gemini', 'dist', 'build']):
        continue
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        c = fp.read().lower()
    for k in keywords:
        if k in c:
            found.append((f, k))

print(f"Total files scanned: {len(html_files)}")
print(f"Flagged occurrences: {len(found)}")
for f, k in found:
    print(f"  {f:40} -> '{k}'")
