import os, glob, re

site_dir = r"c:\Users\harsh\OneDrive\Desktop\HarshGuruJi\site"
html_files = glob.glob(os.path.join(site_dir, "**", "*.html"), recursive=True)

print(f"Total HTML files: {len(html_files)}")
print("-" * 90)

for f in sorted(html_files):
    rel = os.path.relpath(f, site_dir)
    with open(f, "r", encoding="utf-8", errors="ignore") as fp:
        content = fp.read()
    
    has_adsense = "ca-pub-7706204118195419" in content
    has_under_const = ("under construction" in content.lower()) or ("निर्माणाधीन" in content)
    has_meta_refresh = "http-equiv=\"refresh\"" in content.lower() or "http-equiv='refresh'" in content.lower()
    has_noindex = "noindex" in content.lower()
    
    # Text word count estimate (excluding tags and scripts)
    clean_text = re.sub(r"<script[\s\S]*?</script>", " ", content, flags=re.I)
    clean_text = re.sub(r"<style[\s\S]*?</style>", " ", clean_text, flags=re.I)
    clean_text = re.sub(r"<[^>]+>", " ", clean_text)
    clean_text = re.sub(r"\s+", " ", clean_text).strip()
    words = len(clean_text.split())
    
    flags = []
    if has_adsense: flags.append("ADSENSE")
    if has_under_const: flags.append("UNDER_CONST")
    if has_meta_refresh: flags.append("META_REFRESH")
    if has_noindex: flags.append("NOINDEX")
    
    print(f"{rel:50} | Words: {words:5} | {' '.join(flags)}")
