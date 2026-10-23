import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\harsh\OneDrive\Desktop\HarshGuruJi\site\admin.html', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

print('Total lines:', len(lines))
for i, l in enumerate(lines):
    if '<body' in l:
        print('body tag at line', i+1)
    if 'id="' in l and any(k in l.lower() for k in ['section', 'dashboard', 'panel', 'view', 'content', 'sidebar', 'nav', 'tile', 'messages', 'inquiries']):
        print(f'{i+1}: {l.strip()[:140]}')
