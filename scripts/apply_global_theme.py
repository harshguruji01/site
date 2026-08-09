import os
import glob
from bs4 import BeautifulSoup
import re

workspace = r"c:\Users\harsh\OneDrive\Desktop\site"
html_files = glob.glob(os.path.join(workspace, "*.html"))

# 1. Read index.html to extract components
index_path = os.path.join(workspace, "index.html")
with open(index_path, 'r', encoding='utf-8') as f:
    index_soup = BeautifulSoup(f, 'html.parser')

premium_navbar = index_soup.find('nav', class_='premium-navbar')
mobile_nav = index_soup.find('div', class_='premium-mobile-nav')
footer = index_soup.find('footer', class_='footer')

if not premium_navbar or not mobile_nav or not footer:
    print("Error: Could not extract premium navbar, mobile nav, or footer from index.html")
    exit(1)

premium_navbar_str = str(premium_navbar)
mobile_nav_str = str(mobile_nav)
footer_str = str(footer)

for file_path in html_files:
    if os.path.basename(file_path) == "index.html":
        continue # Skip index.html itself

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    
    changed = False

    # 1. Replace Navigation
    existing_nav = soup.find('nav')
    if existing_nav:
        existing_nav.replace_with(BeautifulSoup(premium_navbar_str, 'html.parser'))
        changed = True
    else:
        # Insert after body start
        if soup.body:
            soup.body.insert(0, BeautifulSoup(premium_navbar_str, 'html.parser'))
            changed = True
            
    # 2. Replace Mobile Nav
    existing_mobile = soup.find('div', class_=re.compile(r'.*mobile.*nav.*'))
    if existing_mobile:
        existing_mobile.replace_with(BeautifulSoup(mobile_nav_str, 'html.parser'))
        changed = True
    else:
        # Insert after premium-navbar
        inserted_nav = soup.find('nav', class_='premium-navbar')
        if inserted_nav:
            inserted_nav.insert_after(BeautifulSoup(mobile_nav_str, 'html.parser'))
            changed = True

    # 3. Replace Footer
    existing_footer = soup.find('footer')
    if existing_footer:
        existing_footer.replace_with(BeautifulSoup(footer_str, 'html.parser'))
        changed = True
    else:
        if soup.body:
            soup.body.append(BeautifulSoup(footer_str, 'html.parser'))
            changed = True

    # 4. Ensure Stylesheet
    if soup.head:
        if not soup.head.find('link', href='navbar-premium.css'):
            link_tag = soup.new_tag('link', rel='stylesheet', href='navbar-premium.css')
            soup.head.append(link_tag)
            changed = True
            
    # 5. Ensure JS
    if soup.body:
        if not soup.body.find('script', src='navbar-premium.js'):
            script_tag = soup.new_tag('script', src='navbar-premium.js', defer=True)
            soup.body.append(script_tag)
            changed = True

    if changed:
        with open(file_path, 'w', encoding='utf-8') as f:
            # Prevent formatter from adding closing tags to self-closing HTML5 elements
            f.write(soup.encode(formatter='html5').decode('utf-8'))
        print(f"Updated {os.path.basename(file_path)}")

print("Global theme structure applied successfully.")
