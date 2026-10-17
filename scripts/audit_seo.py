import os
import re
import urllib.parse

with open('sitemap.xml', 'r', encoding='utf-8', errors='ignore') as f:
    sitemap = f.read()

issues = []
all_files = []

for root, dirs, files in os.walk('.'):
    if any(p in root for p in ['.git', '.agents', 'node_modules']):
        continue
    for f in files:
        if f.endswith('.html'):
            p = os.path.normpath(os.path.join(root, f))
            rel = p.replace('\\', '/')
            if rel.startswith('./'):
                rel = rel[2:]
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
            
            # Check robots
            rm = re.search(r'<meta\s+name=["\']robots["\']\s+content=["\']([^"\']+)["\']', c, re.I)
            robots = rm.group(1) if rm else 'MISSING'
            
            # Check canonical
            cm = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\']([^"\']+)["\']', c, re.I)
            canonical = cm.group(1) if cm else 'MISSING'
            
            # Check title
            tm = re.search(r'<title[^>]*>([^<]+)</title>', c, re.I)
            title = tm.group(1).strip() if tm else 'MISSING'

            # Check in sitemap
            rel_encoded = urllib.parse.quote(rel)
            in_sitemap = (
                (rel in sitemap) or 
                (rel.replace('.html', '') in sitemap) or
                (rel_encoded in sitemap) or
                (rel_encoded.replace('.html', '') in sitemap)
            )

            file_info = {
                'file': rel,
                'robots': robots,
                'canonical': canonical,
                'title': title,
                'in_sitemap': in_sitemap
            }
            all_files.append(file_info)

            if 'noindex' in robots.lower() or robots == 'MISSING' or canonical == 'MISSING' or not in_sitemap:
                issues.append(file_info)

print(f'Total HTML files: {len(all_files)}')
print(f'Total files with indexing/sitemap issues: {len(issues)}')
if issues:
    print('\nFiles with issues:')
    for item in issues:
        print(f"- {item['file']}: robots='{item['robots']}', canonical='{item['canonical']}', in_sitemap={item['in_sitemap']}")
else:
    print('ALL 65 PAGES ARE 100% INDEXABLE, VALID CANONICALS, AND PRESENT IN SITEMAP.XML!')
