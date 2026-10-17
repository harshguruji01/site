import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('admin.html', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('mtab-chatbase')
if idx != -1:
    print("Found mtab-chatbase at index", idx)
    print(c[idx-200:idx+1500])
else:
    print("mtab-chatbase not found")
