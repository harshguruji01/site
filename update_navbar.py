import os
import re
import glob

workspace = r"c:\Users\harsh\OneDrive\Desktop\webguruji"

html_files = glob.glob(os.path.join(workspace, "*.html"))

new_nav_content = """<ul class="nav-links" id="nav-links">
        <li><a href="index.html" class="nav-link">Home</a></li>
        <li><a href="daily-special.html" class="nav-link">Daily Special</a></li>
        <li><a href="contributor.html" class="nav-link">Contributors</a></li>
        <li><a href="store.html" class="nav-link">Store</a></li>
        <li><a href="categories.html" class="nav-link">Categories</a></li>
      </ul>
      <div class="nav-search">
        <input type="text" id="site-search" placeholder="Search entire site..." />
        <button id="search-btn">🔍</button>
      </div>
      <a href="login.html" class="btn btn-nav" id="nav-cta">Login</a>
      <button class="hamburger\""""

pattern = re.compile(r'<ul class="nav-links".*?<button class="hamburger"', re.DOTALL)

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if pattern.search(content):
        new_content = pattern.sub(new_nav_content, content)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {os.path.basename(file)}")
    else:
        print(f"No match in {os.path.basename(file)}")
