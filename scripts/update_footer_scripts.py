import os

ROOT = r"C:\Users\harsh\OneDrive\Desktop\HarshGuruJi"

INJECTOR_CODE = """  // Guarantee HarshGuruJi Universal Loading Lines (@ruhith369 / 21st.dev)
  try {
    if (!document.querySelector('link[href*="loading-lines.css"]')) {
      const llCss = document.createElement('link');
      llCss.rel = 'stylesheet';
      llCss.href = 'loading-lines.css';
      document.head.appendChild(llCss);
    }
    if (!window.renderHarshLoader && !document.querySelector('script[src*="loading-lines.js"]')) {
      const llScript = document.createElement('script');
      llScript.src = 'loading-lines.js';
      llScript.defer = true;
      document.body.appendChild(llScript);
    }
  } catch(e) {}
"""

for dirpath, dirnames, filenames in os.walk(ROOT):
    if "node_modules" in dirpath or ".next" in dirpath:
        continue
    for f in filenames:
        if f == "footer-premium.js":
            p = os.path.join(dirpath, f)
            with open(p, "r", encoding="utf-8") as file:
                content = file.read()
            if "loading-lines.css" not in content:
                # Insert inside DOMContentLoaded
                if "document.addEventListener('DOMContentLoaded', () => {" in content:
                    content = content.replace("document.addEventListener('DOMContentLoaded', () => {", "document.addEventListener('DOMContentLoaded', () => {\n" + INJECTOR_CODE, 1)
                    with open(p, "w", encoding="utf-8") as file:
                        file.write(content)
                    print(f"Updated footer-premium.js in {dirpath}")
