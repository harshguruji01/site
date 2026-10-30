import os
import re

SITE_DIR = r"c:\Users\harsh\OneDrive\Desktop\site"

def fix_index_html():
    path = os.path.join(SITE_DIR, "index.html")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Replace 18+ Partner Ads button
    content = re.sub(
        r'<button\s+type="button"\s+class="btn\s+btn-ads-premium"\s+id="hero-ads-btn">[\s\S]*?<span>🔞\s*Partner Ads</span>[\s\S]*?</button>',
        '<a href="free-tools.html" class="btn btn-ads-premium" id="hero-tools-btn" style="text-decoration:none;">\n          <span>🛠️ Free Tools</span>\n        </a>',
        content
    )

    # 2. Fix privacy policy link
    content = content.replace("https://sites.google.com/view/harshguruji/privacy-policy", "privacy-policy.html")

    # 3. Remove age verification script
    content = re.sub(r'\s*<script\s+src="js/age_verification\.js"\s+defer></script>', '', content)

    # 4. Remove Partner Ads modal if present
    content = re.sub(r'<!--\s*PARTNER ADS PERMISSION GATE OVERLAY[\s\S]*?<!--\s*END PARTNER ADS GATE\s*-->', '', content)

    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)
    print("✓ index.html fixed")

def fix_navbar_js():
    path = os.path.join(SITE_DIR, "navbar-premium.js")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace MOD Games with Games & Apps
    content = content.replace("🎮 MOD Games", "🎮 Web Games")
    
    # Remove ads.html entry from search items
    content = re.sub(
        r'\{\s*title:\s*[\'"]Partner Ads & Sponsorships[\'"][\s\S]*?keywords:\s*[\'"][^\'"]*partner ads[^\'"]*[\'"]\s*\},?',
        '',
        content
    )

    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)
    print("✓ navbar-premium.js fixed")

def fix_store_and_apps():
    # 1. store.html
    store_path = os.path.join(SITE_DIR, "store.html")
    with open(store_path, "r", encoding="utf-8") as f:
        content = f.read()

    content = content.replace('<span class="box-badge box-badge-mod">⚡ MOD</span>', '<span class="box-badge box-badge-verified">⚡ Verified</span>')
    content = content.replace('🎮 MOD Games', '🎮 Web Games')

    with open(store_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)
    print("✓ store.html fixed")

    # 2. store-detail.html
    sd_path = os.path.join(SITE_DIR, "store-detail.html")
    with open(sd_path, "r", encoding="utf-8") as f:
        content = f.read()

    content = content.replace("Chess - Chess Prince MOD APK", "Chess - Chess Prince Official APK")
    content = content.replace("⚡ MOD UNLOCKED", "⚡ VERIFIED EDITION")
    content = content.replace("full MOD features unlocked", "verified features, premium performance, and classic chess gameplay")
    content = content.replace("⚡ MOD Features &amp; Unlocked Edition", "⚡ Key Verified Features &amp; Capabilities")
    content = content.replace("⚡ MOD Features:", "⚡ Verified Features:")

    with open(sd_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)
    print("✓ store-detail.html fixed")

    # 3. data/apps.json
    apps_json_path = os.path.join(SITE_DIR, "data", "apps.json")
    if os.path.exists(apps_json_path):
        with open(apps_json_path, "r", encoding="utf-8") as f:
            content = f.read()
        content = content.replace("Chess - Chess Prince MOD APK", "Chess - Chess Prince Official APK")
        content = content.replace("with full MOD features unlocked", "with verified performance, full board options, and offline AI")
        content = content.replace('"is_mod": true', '"is_mod": false')
        with open(apps_json_path, "w", encoding="utf-8", newline="\n") as f:
            f.write(content)
        print("✓ data/apps.json fixed")

    # 4. js/store.js
    store_js = os.path.join(SITE_DIR, "js", "store.js")
    if os.path.exists(store_js):
        with open(store_js, "r", encoding="utf-8") as f:
            content = f.read()
        content = content.replace('<span class="box-badge box-badge-mod">⚡ MOD</span>', '<span class="box-badge box-badge-verified">⚡ Verified</span>')
        content = content.replace('⚡ MOD Features:', '⚡ Key Features:')
        content = content.replace('⚡ MOD Edition', '⚡ Official Edition')
        content = content.replace('with full MOD features unlocked', 'with verified performance and offline play')
        with open(store_js, "w", encoding="utf-8", newline="\n") as f:
            f.write(content)
        print("✓ js/store.js fixed")

def fix_robots_and_sitemap():
    # robots.txt
    robots_path = os.path.join(SITE_DIR, "robots.txt")
    with open(robots_path, "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace("Allow: /ads.html", "Disallow: /ads.html")
    with open(robots_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)
    print("✓ robots.txt fixed")

    # sitemap.xml
    sitemap_path = os.path.join(SITE_DIR, "sitemap.xml")
    with open(sitemap_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Remove ads.html URL block
    content = re.sub(r'\s*<url>\s*<loc>https://www\.webguruji\.online/ads\.html</loc>[\s\S]*?</url>', '', content)
    # Remove apps.json URL block
    content = re.sub(r'\s*<url>\s*<loc>https://www\.webguruji\.online/data/apps\.json</loc>[\s\S]*?</url>', '', content)

    with open(sitemap_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)
    print("✓ sitemap.xml fixed")

def fix_contact_page():
    contact_path = os.path.join(SITE_DIR, "contact.html")
    with open(contact_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Remove mandatory auth notice that blocks visitors from contacting
    content = content.replace('id="contact-auth-notice" style="display:none;', 'id="contact-auth-notice" style="display:none !important;')
    # Make email field always editable and not readonly
    content = content.replace('readonly style="cursor:not-allowed; opacity:0.9;"', 'placeholder="Your email (e.g. name@example.com)"')

    # Add direct contact cards and response guarantee
    direct_info = '''
<div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:18px; padding:2rem; margin-bottom:2rem; text-align:left;">
  <h3 style="color:var(--text-primary); margin-top:0; margin-bottom:1rem; font-size:1.3rem; display:flex; align-items:center; gap:8px;">
    <span>📬 Direct Official Channels</span>
  </h3>
  <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1.25rem;">
    <div style="padding:1rem; background:rgba(255,255,255,0.03); border-radius:12px; border:1px solid rgba(255,255,255,0.06);">
      <div style="color:var(--accent-primary); font-weight:700; font-size:0.9rem; margin-bottom:4px;">Official Support Email</div>
      <a href="mailto:info@webguruji.online" style="color:#fff; text-decoration:none; font-weight:600; word-break:break-all;">info@webguruji.online</a>
      <div style="color:var(--text-secondary); font-size:0.8rem; margin-top:4px;">Average reply within 24-48 hours</div>
    </div>
    <div style="padding:1rem; background:rgba(255,255,255,0.03); border-radius:12px; border:1px solid rgba(255,255,255,0.06);">
      <div style="color:var(--accent-secondary); font-weight:700; font-size:0.9rem; margin-bottom:4px;">Platform Headquarters</div>
      <div style="color:#fff; font-weight:600;">HarshGuruJi Digital Services</div>
      <div style="color:var(--text-secondary); font-size:0.8rem; margin-top:4px;">India • Remote Operations</div>
    </div>
    <div style="padding:1rem; background:rgba(255,255,255,0.03); border-radius:12px; border:1px solid rgba(255,255,255,0.06);">
      <div style="color:#10b981; font-weight:700; font-size:0.9rem; margin-bottom:4px;">Community Channels</div>
      <div style="color:#fff; font-weight:600;">YouTube • Telegram • Instagram</div>
      <div style="color:var(--text-secondary); font-size:0.8rem; margin-top:4px;">@harshguruji1</div>
    </div>
  </div>
</div>
'''
    if "Direct Official Channels" not in content:
        content = content.replace('<div class="auth-card" style="max-width:600px">', '<div class="auth-card" style="max-width:760px">' + direct_info)

    with open(contact_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)
    print("✓ contact.html fixed")

if __name__ == "__main__":
    fix_index_html()
    fix_navbar_js()
    fix_store_and_apps()
    fix_robots_and_sitemap()
    fix_contact_page()
    print("Phase 1 fixes executed successfully!")
