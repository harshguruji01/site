import os
import re
from pathlib import Path

# The files that should be loaded on every page for global nav/footer
GLOBAL_CSS = ['navbar-premium.css', 'footer-premium.css']
GLOBAL_JS = ['navbar-premium.js', 'footer-premium.js']

def get_prefix(file_path, base_dir):
    """Calculate the relative prefix to the base directory."""
    rel_path = os.path.relpath(file_path, base_dir)
    depth = rel_path.count(os.sep)
    return '../' * depth

def process_file(file_path, base_dir):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return

    original_content = content
    prefix = get_prefix(file_path, base_dir)

    # 1. Remove old navbar placeholders and footers
    # Remove <div id="navbar-placeholder"></div>
    content = re.sub(r'<div\s+id=["\']navbar-placeholder["\'][^>]*>.*?</div>', '', content, flags=re.DOTALL)
    content = re.sub(r'<div\s+id=["\']footer-placeholder["\'][^>]*>.*?</div>', '', content, flags=re.DOTALL)
    
    # Remove old <div class="premium-mobile-nav">...</div> completely
    content = re.sub(r'<div\s+class=["\']premium-mobile-nav["\'].*?</div>\s*<div\s+id=["\']scroll-progress["\']', '<div id="scroll-progress"', content, flags=re.DOTALL)
    content = re.sub(r'<div\s+class=["\']premium-mobile-nav["\'].*?</div>\s*<section', '<section', content, flags=re.DOTALL)
    
    # Actually, a safer way to remove the old mobile nav is matching it up to the next known block or just using a heuristic since it's a huge block.
    # Let's remove the block if it exists:
    content = re.sub(r'<!-- Mobile Full Screen Menu -->.*?</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*</div>', '', content, flags=re.DOTALL)
    content = re.sub(r'<div class="premium-mobile-nav" id="premium-mobile-nav">.*?</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*</div>', '', content, flags=re.DOTALL)
    
    # Remove hardcoded footer <footer class="footer"...>...</footer>
    content = re.sub(r'<!-- Premium Dark Theme Footer -->\s*<footer class="footer".*?</footer>', '', content, flags=re.DOTALL)
    content = re.sub(r'<footer\s+class=["\']footer["\'].*?</footer>', '', content, flags=re.DOTALL)

    # 2. Inject CSS into <head>
    # Check if </head> exists
    if '</head>' in content:
        # Remove existing navbar/footer css links to avoid duplicates
        content = re.sub(r'<link\s+rel=["\']stylesheet["\']\s+href=["\'](?:\.\./)*navbar-premium\.css["\']\s*/*>', '', content)
        content = re.sub(r'<link\s+rel=["\']stylesheet["\']\s+href=["\'](?:\.\./)*footer-premium\.css["\']\s*/*>', '', content)
        content = re.sub(r'<link\s+rel=["\']stylesheet["\']\s+href=["\'](?:\.\./)*navbar\.css["\']\s*/*>', '', content)
        
        css_tags = f'\n  <link rel="stylesheet" href="{prefix}navbar-premium.css">\n  <link rel="stylesheet" href="{prefix}footer-premium.css">\n</head>'
        content = content.replace('</head>', css_tags)

    # 3. Inject JS into <body> (preferably right before </body>)
    if '</body>' in content:
        # Remove existing script tags
        content = re.sub(r'<script\s+src=["\'](?:\.\./)*navbar-premium\.js["\']></script>', '', content)
        content = re.sub(r'<script\s+src=["\'](?:\.\./)*footer-premium\.js["\']></script>', '', content)
        content = re.sub(r'<script\s+src=["\'](?:\.\./)*navbar\.js["\']></script>', '', content)
        
        js_tags = f'\n  <script src="{prefix}navbar-premium.js"></script>\n  <script src="{prefix}footer-premium.js"></script>\n</body>'
        content = content.replace('</body>', js_tags)
    
    # Remove multiple blank lines left behind by cleanup
    content = re.sub(r'\n\s*\n\s*\n+', '\n\n', content)

    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {file_path}")

def main():
    base_dir = Path(__file__).parent.resolve()
    
    # Exclude certain directories or files if needed
    exclude_dirs = {'.git', '.vscode', '.gemini', 'implement md'}
    
    for root, dirs, files in os.walk(base_dir):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                process_file(file_path, base_dir)

if __name__ == '__main__':
    main()
