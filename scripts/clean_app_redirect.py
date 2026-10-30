import os
import re

SITE_DIR = r"c:\Users\harsh\OneDrive\Desktop\HarshGuruJi\site"

# 1. app.html: Add noindex and remove AdSense meta tag and script
app_path = os.path.join(SITE_DIR, "app.html")
with open(app_path, "r", encoding="utf-8") as f:
    content = f.read()

content = re.sub(r'<meta\s+name=["\']robots["\'][^>]+>', '<meta name="robots" content="noindex, follow">', content)
content = content.replace('<meta name="google-adsense-account" content="ca-pub-7706204118195419">', '')
content = re.sub(r'<script[^>]*pagead2\.googlesyndication\.com[^>]*></script>', '', content)

with open(app_path, "w", encoding="utf-8") as f:
    f.write(content)
print("[OK] app.html set to noindex and AdSense removed!")

# 2. robots.txt
robots_path = os.path.join(SITE_DIR, "robots.txt")
with open(robots_path, "r", encoding="utf-8") as f:
    rcontent = f.read()

rcontent = rcontent.replace("Allow: /app.html", "Disallow: /app.html")
with open(robots_path, "w", encoding="utf-8") as f:
    f.write(rcontent)
print("[OK] robots.txt updated!")

# 3. sitemap.xml
sitemap_path = os.path.join(SITE_DIR, "sitemap.xml")
with open(sitemap_path, "r", encoding="utf-8") as f:
    scontent = f.read()

scontent = re.sub(r'\s*<url>\s*<loc>https?://[^<]*/app\.html</loc>[\s\S]*?</url>', '', scontent)
with open(sitemap_path, "w", encoding="utf-8") as f:
    f.write(scontent)
print("[OK] sitemap.xml updated!")
