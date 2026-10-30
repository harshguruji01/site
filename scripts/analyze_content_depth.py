import os, glob, re

site_dir = r"c:\Users\harsh\OneDrive\Desktop\HarshGuruJi\site"
html_files = glob.glob(os.path.join(site_dir, "**", "*.html"), recursive=True)

report = []

for f in sorted(html_files):
    rel = os.path.relpath(f, site_dir)
    if any(x in rel for x in ["node_modules", ".git", ".gemini", "dist", "build"]):
        continue
    with open(f, "r", encoding="utf-8", errors="ignore") as fp:
        content = fp.read()
    
    # check noindex
    has_noindex = bool(re.search(r'<meta[^>]+name=["\']robots["\'][^>]+noindex', content, re.I))
    has_adsense = "ca-pub-7706204118195419" in content
    
    # title
    title_m = re.search(r'<title>(.*?)</title>', content, re.I | re.S)
    title = title_m.group(1).strip() if title_m else "NO TITLE"
    
    # clean text word count
    clean_text = re.sub(r"<script[\s\S]*?</script>", " ", content, flags=re.I)
    clean_text = re.sub(r"<style[\s\S]*?</style>", " ", clean_text, flags=re.I)
    clean_text = re.sub(r"<svg[\s\S]*?</svg>", " ", clean_text, flags=re.I)
    clean_text = re.sub(r"<[^>]+>", " ", clean_text)
    clean_text = re.sub(r"\s+", " ", clean_text).strip()
    words = len(clean_text.split())
    
    report.append({
        "file": rel,
        "title": title,
        "words": words,
        "has_adsense": has_adsense,
        "has_noindex": has_noindex
    })

print(f"{'FILE':45} | {'WORDS':6} | {'INDEX':7} | {'ADS':5} | TITLE")
print("-" * 110)
for r in report:
    idx_str = "NOINDEX" if r["has_noindex"] else "INDEX"
    ads_str = "ADS" if r["has_adsense"] else "---"
    print(f"{r['file']:45} | {r['words']:6} | {idx_str:7} | {ads_str:5} | {r['title'][:40]}")
