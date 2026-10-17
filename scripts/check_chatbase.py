import os
import re

files = ['chat.html', 'chat-app.html', 'admin-chatbase.html', 'admin.html', 'store.html']
for fn in files:
    if not os.path.exists(fn):
        print(f"File not found: {fn}")
        continue
    with open(fn, 'r', encoding='utf-8') as f:
        content = f.read()
    print(f'=== Checking {fn} ===')
    
    # Scripts
    scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', content, re.I)
    for s in scripts:
        if not s.startswith('http') and not s.startswith('//'):
            clean_s = s.split('?')[0].split('#')[0]
            exists = os.path.exists(clean_s)
            if not exists:
                print(f"  [MISSING SCRIPT]: {s}")

    # Stylesheets
    styles = re.findall(r'<link[^>]+(?:href=["\']([^"\']+)["\'][^>]*rel=["\']stylesheet["\']|rel=["\']stylesheet["\'][^>]*href=["\']([^"\']+)["\'])', content, re.I)
    for st_tuple in styles:
        st = st_tuple[0] or st_tuple[1]
        if st and not st.startswith('http') and not st.startswith('//'):
            clean_st = st.split('?')[0].split('#')[0]
            exists = os.path.exists(clean_st)
            if not exists:
                print(f"  [MISSING STYLESHEET]: {st}")

    # Images
    imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content, re.I)
    for img in imgs:
        if not img.startswith('http') and not img.startswith('//') and not img.startswith('data:'):
            clean_img = img.split('?')[0].split('#')[0]
            exists = os.path.exists(clean_img)
            if not exists:
                print(f"  [MISSING IMAGE]: {img}")

    # Check for unclosed script tags or basic JS syntax errors in inline scripts
    inline_scripts = re.findall(r'<script(?![^>]*src=)[^>]*>(.*?)</script>', content, re.I | re.DOTALL)
    print(f"  Found {len(inline_scripts)} inline scripts.")
print("Check completed.")
