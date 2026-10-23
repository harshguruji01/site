# -*- coding: utf-8 -*-
with open(r"c:\Users\harsh\OneDrive\Desktop\HarshGuruJi\ai\index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if "authmodal" in line.lower() or "modal" in line.lower():
        if "id=" in line:
            print(f"{i+1}: {line.strip()[:100]}")
