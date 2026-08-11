import os
import re
from pathlib import Path

def main():
    d = r'c:\Users\harsh\OneDrive\Desktop\site'
    for root, _, files in os.walk(d):
        if '.git' in root or '.gemini' in root: continue
        for f in files:
            if f.endswith('.html'):
                fp = os.path.join(root, f)
                try:
                    with open(fp, 'r', encoding='utf-8') as file:
                        content = file.read()
                    
                    # Remove the defer script since we have the injected ones
                    new_content = re.sub(r'<script\s+src=["\']navbar-premium\.js["\']\s+defer></script>\n?', '', content)
                    # Also handle ../navbar-premium.js just in case
                    new_content = re.sub(r'<script\s+src=["\']\.\./navbar-premium\.js["\']\s+defer></script>\n?', '', new_content)

                    if new_content != content:
                        with open(fp, 'w', encoding='utf-8') as file:
                            file.write(new_content)
                        print(f"Fixed: {fp}")
                except Exception as e:
                    pass

if __name__ == '__main__':
    main()
