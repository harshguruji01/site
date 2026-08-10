import os
import re

directory = r"c:\Users\harsh\OneDrive\Desktop\site"

# New footer content with the typo fixed
new_footer = """  <footer class="footer">
    <div class="footer-glow"></div>
    <div class="footer-container">
      <div class="footer-top">
        <div class="footer-brand">
          <a href="#" class="nav-logo" id="footer-logo" style="display:flex; align-items:center; gap:0.6rem; text-decoration:none;">
            <img src="logo.png" alt="HarshGuruJi Logo" style="height: 40px; width: auto; border-radius: 5px;" />
            <span style="font-family:'Space Grotesk',sans-serif; font-weight:800; font-size:1.2rem; background:linear-gradient(135deg,#ff3366,#7c3aed); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">HarshGuruJi</span>
          </a>
          <p>Your go-to place for simple, clear, and reliable learning. Tools, AI, Education & Technology.</p>
          <div class="social-links">
            <a href="https://www.youtube.com/@TESVLOG1" target="_blank" class="social-btn" id="footer-yt"
              aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path
                  d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
              </svg>
            </a>
            <a href="https://www.instagram.com/harshpatelverma1/" target="_blank" class="social-btn" id="footer-ig"
              aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path
                  d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8 0 3.2 0 3.6-.1 4.8-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12c0-3.2 0-3.6.1-4.8C2.4 3.9 4 2.3 7.2 2.3c1.3-.1 1.6-.1 4.8-.1zm0-2.2C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12c0 3.3 0 3.7.1 4.9.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24c3.3 0 3.7 0 4.9-.1 4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9 0-3.3 0-3.7-.1-4.9C23.7 2.7 21.3.3 16.9.1 15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 100 12.4A6.2 6.2 0 0012 5.8zm0 10.2a4 4 0 110-8 4 4 0 010 8zm6.4-11.8a1.4 1.4 0 100 2.8 1.4 1.4 0 000-2.8z" />
              </svg>
            </a>
          </div>
        </div>
        <div class="footer-links">
          <div class="footer-col">
            <h5>Navigation</h5>
            <a href="index.html#home">Home</a>
            <a href="index.html#features">Features</a>
            <a href="index.html#categories">Topics</a>
            <a href="index.html#ai">GuruJi AI</a>
          </div>
          <div class="footer-col">
            <h5>Pages</h5>
            <a href="daily-special.html">Daily Special</a>
            <a href="store.html">Store</a>
            <a href="login.html">Login</a>
            <a href="about.html">About Us</a>
          </div>
          <div class="footer-col">
            <h5>Legal</h5>
            <a href="privacy-policy.html">Privacy Policy</a>
            <a href="cookie.html">Cookie Policy</a>
            <a href="terms-and-conditions.html">Terms & Conditions</a>
            <a href="contact.html">Contact Us</a>
          </div>
        </div>
      </div>
      <!-- Owner Details -->
      <div class="footer-bottom" style="flex-direction: column; gap: 1.5rem; padding-top: 2.5rem;">
        <div style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;">
          <img src="harshlogo.png" loading="lazy" alt="Harsh Patel – Owner" style="height: 80px; width: auto; border-radius: 12px; border: 2px solid rgba(255,255,255,0.1); box-shadow: 0 8px 20px rgba(0,0,0,0.4);" />
          <div>
            <strong style="color: var(--text-primary); font-size: 1.25rem; display: block; margin-bottom: 0.3rem;">Harsh Patel</strong>
            <span style="color: var(--accent-primary); font-size: 0.95rem; font-weight: 600; display: block; margin-bottom: 0.3rem;">Founder & Owner – HarshGuruJi</span>
            <span style="color: var(--text-secondary); font-size: 1rem; display: block;">📞 +91 </span>
            <span style="color: var(--text-secondary); font-size: 1rem; display: block;">📍 Akbarpur, Ambedkarnagar, Uttar Pradesh, India – 224122</span>
          </div>
        </div>
        <p style="color: var(--text-secondary); font-size: 0.85rem;">© 2026 HarshGuruJi – Tools & Learning Platform. All rights reserved.</p>
      </div>
    </div>
  </footer>"""

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
