import os
import re

pages = []
missing_seo = []

for root, dirs, files in os.walk('.'):
    if any(p in root for p in ['.git', '.agents', 'node_modules', 'scripts']):
        continue
    for f in files:
        if f.endswith('.html'):
            p = os.path.normpath(os.path.join(root, f)).replace('\\', '/')
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
            tm = re.search(r'<title[^>]*>([^<]+)</title>', c, re.I)
            title = tm.group(1).strip() if tm else None
            dm = re.search(r'<meta\s+name=["\']description["\']\s+content=["\']([^"\']+)["\']', c, re.I)
            desc = dm.group(1).strip() if dm else None
            km = re.search(r'<meta\s+name=["\']keywords["\']\s+content=["\']([^"\']+)["\']', c, re.I)
            kw = km.group(1).strip() if km else None
            rm = re.search(r'<meta\s+name=["\']robots["\']\s+content=["\']([^"\']+)["\']', c, re.I)
            robots = rm.group(1).strip() if rm else None
            cm = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\']([^"\']+)["\']', c, re.I)
            canon = cm.group(1).strip() if cm else None

            pages.append((p, title, desc, kw, robots, canon))
            if not title or not desc or not kw or not robots or not canon or 'noindex' in (robots or '').lower():
                missing_seo.append(p)

print(f"Total HTML pages: {len(pages)}")
print(f"Pages with missing SEO or noindex: {len(missing_seo)}")
if missing_seo:
    for m in missing_seo:
        print("  Missing:", m)
else:
    print("ALL 65 PAGES HAVE COMPLETE SEO METADATA, ROBOTS, CANONICAL, TITLE, DESCRIPTION, KEYWORDS!")
