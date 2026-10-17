import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('admin.html', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find("SearchParams(window.location.search).get('from')")
if idx != -1:
    print(c[idx-50:idx+800])
