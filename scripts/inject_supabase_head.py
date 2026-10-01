import os

tag_cdn = '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>'
tag_head = '<script src="js/supabase-head.js"></script>'

directories = [
    r'C:\Users\harsh\OneDrive\Desktop\store',
    r'c:\Users\harsh\OneDrive\Desktop\site'
]

for d in directories:
    print(f"=== CHECKING {d} ===")
    for f in os.listdir(d):
        if f.endswith('.html'):
            p = os.path.join(d, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
            
            # If supabase-head.js is not present, inject it
            if 'supabase-head.js' not in c and '</head>' in c:
                # Remove duplicate supabase-js@2 if already there
                if tag_cdn in c:
                    c = c.replace(tag_cdn, '')
                injection = f'  {tag_cdn}\n  {tag_head}\n</head>'
                c = c.replace('</head>', injection, 1)
                with open(p, 'w', encoding='utf-8') as fp:
                    fp.write(c)
                print(f"Injected in {f}")
            else:
                print(f"Already configured: {f}")

print("\nDone injecting supabase-head across store and site!")
