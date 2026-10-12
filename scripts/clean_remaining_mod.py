import os

SITE_DIR = r"c:\Users\harsh\OneDrive\Desktop\site"

# 1. navbar-premium.js
navbar_path = os.path.join(SITE_DIR, "navbar-premium.js")
with open(navbar_path, "r", encoding="utf-8") as f:
    text = f.read()
text = text.replace('title="MOD Games"', 'title="Web Games"')
with open(navbar_path, "w", encoding="utf-8", newline="\n") as f:
    f.write(text)

# 2. app.html
app_path = os.path.join(SITE_DIR, "app.html")
if os.path.exists(app_path):
    with open(app_path, "r", encoding="utf-8") as f:
        app_text = f.read()
    app_text = app_text.replace("⚡ MOD Features &amp; Unlocked Edition", "⚡ Key Verified Features &amp; Highlights")
    app_text = app_text.replace("with full MOD features unlocked", "with verified performance and full board options")
    app_text = app_text.replace("MOD Features", "Key Features")
    app_text = app_text.replace("⚡ Is MOD / Unlocked Edition", "⚡ Verified Edition")
    with open(app_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(app_text)

print("Cleaned navbar and app.html successfully")
