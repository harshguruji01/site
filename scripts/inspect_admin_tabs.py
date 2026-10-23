# -*- coding: utf-8 -*-
with open(r'c:\Users\harsh\OneDrive\Desktop\HarshGuruJi\site\admin.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
tabs = re.findall(r'<div[^>]*class=[\'"][^\'"]*studio-tab-content[^\'"]*[\'"][^>]*id=[\'"]([^\'"]+)[\'"]', text)
print("Studio tab content IDs:", tabs)

nav_tabs = re.findall(r'onclick=[\'"]switchTab\([\'"]([^\'"]+)[\'"]\)', text)
print("Navigation tabs:", set(nav_tabs))
