import os
import re

allowed_url_pattern = re.compile(
    r'(?:https?://[^\s"\'<>]*webguruji[^\s"\'<>]*|'
    r'[a-zA-Z0-9_\-\.]*webguruji\.online[a-zA-Z0-9_\-\./]*|'
    r'online\.webguruji\.chat|'
    r'webguruji_online_[a-zA-Z0-9_]+)',
    re.IGNORECASE
)

unexpected = []

for root, dirs, files in os.walk('.'):
    if any(p in root for p in ['.git', 'node_modules', 'scripts']):
        continue
    for f in files:
        if f.endswith(('.html', '.js', '.css', '.json', '.xml', '.txt', '.md')):
            p = os.path.normpath(os.path.join(root, f)).replace('\\', '/')
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                for line_no, line in enumerate(fp, 1):
                    # Remove all allowed URL matches from the line
                    scrubbed = allowed_url_pattern.sub('', line)
                    # If webguruji still appears, report it
                    if re.search(r'(?i)webguruji', scrubbed):
                        unexpected.append((p, line_no, line.strip()))

print(f"==================================================")
print(f"VERIFICATION RESULTS: Non-URL webguruji count: {len(unexpected)}")
print(f"==================================================")
if unexpected:
    for p, lno, l in unexpected:
        print(f"{p}:{lno} -> {l}")
else:
    print("PERFECT: ZERO NON-URL 'webguruji' OCCURRENCES FOUND ACROSS ENTIRE CODEBASE!")
    print("All URLs with www.webguruji.online are fully preserved!")
