import os
import re

# Domain and URL patterns to strictly preserve
URL_PATTERNS = [
    r'https?://[^\s"\'<>]+',
    r'(?:[a-zA-Z0-9_\-]+\.)*webguruji\.online(?:/[^\s"\'<>]*)?',
    r'online\.webguruji\.chat',
    r'webguruji_online_[a-zA-Z0-9_]+',
    r'harshguruji01@gmail\.com'
]
COMBINED_URL_REGEX = re.compile('|'.join(f'(?:{p})' for p in URL_PATTERNS), re.IGNORECASE)

def transform_content(text):
    # Step 1: Protect URLs and domains with unique tokens
    placeholders = {}
    
    def protect(m):
        token = f"___HGJ_URL_PROTECT_{len(placeholders)}___"
        placeholders[token] = m.group(0)
        return token

    text = COMBINED_URL_REGEX.sub(protect, text)

    # Step 2: Handle redundant combined mentions like "WebGuruJi / HarshGuruJi"
    text = re.sub(r'(?i)webguruji\s*/\s*harshguruji|harshguruji\s*/\s*webguruji', 'HarshGuruJi', text)
    text = re.sub(r'(?i)webguruji\s*&amp;\s*harshguruji|harshguruji\s*&amp;\s*webguruji', 'HarshGuruJi', text)
    text = re.sub(r'(?i)webguruji\s*&\s*harshguruji|harshguruji\s*&\s*webguruji', 'HarshGuruJi', text)
    text = re.sub(r'(?i)webguruji\s+and\s+harshguruji|harshguruji\s+and\s+webguruji', 'HarshGuruJi', text)

    # Step 3: Clean up duplicated title tags
    # e.g., <title>WebGuruJi ... | HarshGuruJi</title> -> <title>HarshGuruJi ...</title>
    def fix_title_tag(m):
        inner = m.group(1).strip()
        # If starts with WebGuruJi and ends with | HarshGuruJi (or | HarshGuruJi Admin / Careers)
        inner = re.sub(r'(?i)^webguruji\s+', 'HarshGuruJi ', inner)
        # If it now starts with HarshGuruJi and ends with | HarshGuruJi... remove the duplicate end
        if re.search(r'(?i)^harshguruji\b', inner) and re.search(r'(?i)\|\s*harshguruji$', inner):
            inner = re.sub(r'(?i)\s*\|\s*harshguruji$', '', inner).strip()
        elif re.search(r'(?i)^harshguruji\b', inner) and re.search(r'(?i)\|\s*harshguruji\s+(admin|games|learning hub|learning|careers)$', inner):
            # e.g. HarshGuruJi Admin ChatBase Management | HarshGuruJi Admin -> HarshGuruJi Admin ChatBase Management
            inner = re.sub(r'(?i)\s*\|\s*harshguruji\s+(?:admin|games|learning hub|learning|careers)$', '', inner).strip()
        return f'<title>{inner}</title>'

    text = re.sub(r'<title>(.*?)</title>', fix_title_tag, text, flags=re.IGNORECASE | re.DOTALL)

    # Do the same cleanup for og:title and twitter:title
    def fix_meta_title(m):
        tag_start = m.group(1)
        inner = m.group(2).strip()
        tag_end = m.group(3)
        inner = re.sub(r'(?i)^webguruji\s+', 'HarshGuruJi ', inner)
        if re.search(r'(?i)^harshguruji\b', inner) and re.search(r'(?i)\|\s*harshguruji$', inner):
            inner = re.sub(r'(?i)\s*\|\s*harshguruji$', '', inner).strip()
        elif re.search(r'(?i)^harshguruji\b', inner) and re.search(r'(?i)\|\s*harshguruji\s+(admin|games|learning hub|learning|careers)$', inner):
            inner = re.sub(r'(?i)\s*\|\s*harshguruji\s+(?:admin|games|learning hub|learning|careers)$', '', inner).strip()
        return f'{tag_start}{inner}{tag_end}'

    text = re.sub(r'(<meta\s+property=["\']og:title["\']\s+content=["\'])(.*?)(["\'])', fix_meta_title, text, flags=re.IGNORECASE)
    text = re.sub(r'(<meta\s+name=["\']twitter:title["\']\s+content=["\'])(.*?)(["\'])', fix_meta_title, text, flags=re.IGNORECASE)

    # Step 4: Specific known tokens
    text = text.replace('WEBGURUJI', 'HARSHGURUJI')
    text = text.replace('WebGuruJi', 'HarshGuruJi')
    text = text.replace('Webguruji', 'HarshGuruJi')
    text = text.replace('webguruji-login-tab', 'harshguruji-login-tab')
    text = text.replace('webguruji-signup-tab', 'harshguruji-signup-tab')
    text = text.replace('webguruji-backend', 'harshguruji-backend')

    # Step 5: Remaining standalone occurrences based on case
    def repl_case(m):
        s = m.group(0)
        if s.isupper():
            return 'HARSHGURUJI'
        elif s.islower():
            return 'harshguruji'
        else:
            return 'HarshGuruJi'

    text = re.sub(r'(?i)\bwebguruji\b', repl_case, text)

    # Step 6: In error-shield.js keep backwards-compatibility flag if present
    if '__WEBGURUJI_ERROR_SHIELD_ACTIVE__' in text or '__HARSHGURUJI_ERROR_SHIELD_ACTIVE__' in text:
        text = text.replace(
            'window.__WEBGURUJI_ERROR_SHIELD_ACTIVE__ = true;',
            'window.__HARSHGURUJI_ERROR_SHIELD_ACTIVE__ = true;\n  window.__WEBGURUJI_ERROR_SHIELD_ACTIVE__ = true;'
        )

    # Step 7: Restore protected URLs and domains
    for token, original_val in placeholders.items():
        text = text.replace(token, original_val)

    return text

def run():
    modified_files = []
    skipped_files = []

    extensions = ('.html', '.js', '.css', '.json', '.xml', '.txt', '.md')

    for root, dirs, files in os.walk('.'):
        if any(p in root for p in ['.git', 'node_modules']):
            continue
        for f in files:
            # Skip python scripts inside scripts folder that are tooling
            if 'scripts' in root and f.endswith('.py'):
                continue
            if not f.endswith(extensions):
                continue

            p = os.path.normpath(os.path.join(root, f))
            try:
                with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                    original = fp.read()

                updated = transform_content(original)

                if original != updated:
                    with open(p, 'w', encoding='utf-8') as fp:
                        fp.write(updated)
                    modified_files.append(p)
                else:
                    skipped_files.append(p)
            except Exception as e:
                print(f"Error processing {p}: {e}")

    print(f"\n==========================================")
    print(f"Renaming Complete!")
    print(f"Total files updated: {len(modified_files)}")
    print(f"Total files unchanged: {len(skipped_files)}")
    print(f"==========================================\n")
    for f in modified_files[:40]:
        print(f"  Updated: {f}")
    if len(modified_files) > 40:
        print(f"  ... and {len(modified_files) - 40} more files.")

if __name__ == '__main__':
    run()
