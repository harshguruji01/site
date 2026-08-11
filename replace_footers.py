import os
import re

directory = r"c:\Users\harsh\OneDrive\Desktop\site"

# Read footer content from template_footer.txt
template_path = os.path.join(directory, "template_footer.txt")
try:
    with open(template_path, 'r', encoding='utf-8') as f:
        new_footer = f.read()
except FileNotFoundError:
    print("Error: template_footer.txt not found.")
    exit(1)

html_files = [f for f in os.listdir(directory) if f.endswith('.html')]

count = 0
for filename in html_files:
    filepath = os.path.join(directory, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the footer and replace it
    # We use a regex that looks for <footer...</footer>
    new_content = re.sub(r'<footer.*?</footer>', new_footer, content, flags=re.DOTALL)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        count += 1
        print(f"Updated footer in {filename}")

print(f"Total files updated: {count}")
