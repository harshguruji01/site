# -*- coding: utf-8 -*-
import os, glob

html_files = glob.glob('**/*.html', recursive=True)
print(f'Total HTML files found: {len(html_files)}')

issues = []
for hf in html_files:
    if 'node_modules' in hf or '.git' in hf:
        continue
    with open(hf, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Check for ads.html reference
    if 'ads.html' in content and not hf.startswith('scripts'):
        issues.append(f'{hf}: references ads.html')

    # Check for third-party ad networks
    for bad in ['adsterra', 'effectivecpm', 'alwingulla', 'partner_ads']:
        if bad in content.lower():
            issues.append(f'{hf}: contains third party ad network keyword: {bad}')

    # Check for under construction with AdSense
    if ('under construction' in content.lower() or 'निर्माणाधीन' in content) and 'adsbygoogle' in content:
        issues.append(f'{hf}: Under construction with AdSense script')

    # Check for meta refresh 0
    if 'http-equiv="refresh"' in content.lower() and 'content="0;' in content.lower():
        issues.append(f'{hf}: 0-second meta refresh redirect')

    # Check admin/auth pages for AdSense
    is_private = any(p in hf.lower() for p in ['admin', 'login', 'signup', 'forgot-password', 'reset-password', 'dashboard', 'settings', 'consent'])
    if is_private:
        if 'adsbygoogle' in content:
            issues.append(f'{hf}: PRIVATE/AUTH page contains AdSense script')
        if 'noindex' not in content.lower():
            issues.append(f'{hf}: PRIVATE/AUTH page is MISSING noindex')

print(f'Total issues found: {len(issues)}')
for iss in issues:
    print(' -', iss)
