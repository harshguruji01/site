import os, re

SITE_DIR = r"c:\Users\harsh\OneDrive\Desktop\HarshGuruJi\site"

# List of pages that MUST NOT have AdSense and MUST be noindex
NOINDEX_NOADSENSE_FILES = [
    "admin.html",
    "admin-chatbase.html",
    "admin-contacts.html",
    "admin-requests.html",
    "adminapkupload.html",
    "adminbooks.html",
    "admincontributors.html",
    "login.html",
    "signup.html",
    "forgot-password.html",
    "reset-password.html",
    "dashboard.html",
    "settings.html",
    "verify-contributor.html",
    "cookie.html",
    "appearance.html",
    "ads.html",
    os.path.join("oauth", "consent", "index.html"),
]

for rel_path in NOINDEX_NOADSENSE_FILES:
    full_path = os.path.join(SITE_DIR, rel_path)
    if not os.path.exists(full_path):
        print(f"Skipping missing file: {rel_path}")
        continue
    
    with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    
    # 1. Remove google-adsense-account meta tag
    content = re.sub(r'<meta\s+name=["\']google-adsense-account["\'][^>]*>\s*', '', content, flags=re.I)
    
    # 2. Remove adsbygoogle.js script tag
    content = re.sub(r'<script\s+async(?:="")?\s+src=["\']https://pagead2\.googlesyndication\.com/pagead/js/adsbygoogle\.js[^"\']*["\'][^>]*></script>\s*', '', content, flags=re.I)
    content = re.sub(r'<script[^>]*src=["\'][^"\']*adsbygoogle\.js[^"\']*["\'][^>]*></script>\s*', '', content, flags=re.I)
    
    # 3. Remove ad-shield.js or ad comment blocks
    content = re.sub(r'<!--\s*AdSense Click-Bombing & Invalid Traffic Protection\s*-->\s*', '', content, flags=re.I)
    content = re.sub(r'<script\s+src=["\'][^"\']*ad-shield\.js["\'][^>]*></script>\s*', '', content, flags=re.I)
    
    # 4. Ensure <meta name="robots" content="noindex, nofollow">
    if '<meta name="robots"' in content:
        content = re.sub(r'<meta\s+name=["\']robots["\'][^>]*>', '<meta name="robots" content="noindex, nofollow">', content, flags=re.I)
    else:
        # Insert after <head>
        content = re.sub(r'(<head[^>]*>)', r'\1\n  <meta name="robots" content="noindex, nofollow">', content, count=1, flags=re.I)
    
    with open(full_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)
    
    print(f"[OK] Cleaned non-content page: {rel_path}")

print("All admin/private pages cleaned successfully.")
