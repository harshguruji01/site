# -*- coding: utf-8 -*-
with open("ai.html", "r", encoding="utf-8") as f:
    content = f.read()

content_hub = content.replace(
    'rel="canonical" href="https://webguruji.online/ai.html"',
    'rel="canonical" href="https://webguruji.online/ai-hub.html"'
)

with open("ai-hub.html", "w", encoding="utf-8") as f:
    f.write(content_hub)

print("ai-hub.html synchronized successfully!")
