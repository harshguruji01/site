import os
import re

SITE_DIR = r"c:\Users\harsh\OneDrive\Desktop\HarshGuruJi\site"

def enrich_books_html():
    path = os.path.join(SITE_DIR, "books.html")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    guide_html = """
    <!-- Editorial Guide & Comprehensive Academic Reference (AdSense & Quality Compliance) -->
    <section class="books-editorial-guide" style="margin: 4rem auto 2rem; max-width: 1200px; padding: 2.5rem 2rem; background: rgba(17, 24, 39, 0.75); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; color: var(--text-secondary, #cbd5e1); line-height: 1.85;">
      
      <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 1.5rem; margin-bottom: 2rem;">
        <span style="display:inline-block; padding: 4px 14px; background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 20px; color: #a5b4fc; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">
          Academic Curriculum Guide
        </span>
        <h2 style="color: #fff; font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.8rem, 3.5vw, 2.4rem); margin: 0.75rem 0 0.5rem 0;">
          The Definitive Guide to NCERT Textbooks &amp; Curriculum (Classes 1 to 12)
        </h2>
        <p style="color: var(--text-secondary); margin: 0; font-size: 1.05rem;">
          How national curriculum frameworks foster conceptual clarity, academic excellence, and competitive entrance examination success.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 2.5rem;">
        <div>
          <h3 style="color: #fff; font-size: 1.35rem; margin-top: 0; margin-bottom: 1rem; font-family: 'Space Grotesk', sans-serif;">Why NCERT Textbooks Are Essential</h3>
          <p>
            The National Council of Educational Research and Training (NCERT) was established by the Government of India to formulate and standardize primary, secondary, and higher secondary educational curricula across the nation. NCERT textbooks represent the foundational benchmark adopted by the Central Board of Secondary Education (CBSE), Council for the Indian School Certificate Examinations (CISCE), and numerous state boards.
          </p>
          <p>
            Unlike commercial guidebooks that emphasize rote memorization and mechanical formulas, NCERT textbooks are meticulously authored by distinguished academic committees. They present concepts from first principles, encouraging inquiry, logical deduction, and structured critical thinking.
          </p>
        </div>
        <div>
          <h3 style="color: #fff; font-size: 1.35rem; margin-top: 0; margin-bottom: 1rem; font-family: 'Space Grotesk', sans-serif;">The Competitive Exam Gold Standard</h3>
          <p>
            For students aspiring to crack premier national competitive entrance examinations in India, NCERT textbooks are universally recognized as mandatory reading:
          </p>
          <ul style="padding-left: 1.25rem; margin-bottom: 1rem; list-style-type: disc;">
            <li><strong>JEE Main &amp; Advanced:</strong> Over 85% of Inorganic Chemistry and direct conceptual physics questions correlate directly with NCERT Class 11 &amp; 12 textbook lines.</li>
            <li><strong>NEET-UG Medical Entrance:</strong> Biology questions in NEET are virtually 100% extracted from NCERT Class 11 and Class 12 Biology chapters.</li>
            <li><strong>UPSC Civil Services:</strong> NCERT textbooks from Class 6 to 12 in History, Geography, Polity, and Economics form the core of UPSC Prelims General Studies.</li>
          </ul>
        </div>
      </div>

      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 18px; padding: 2rem; margin-bottom: 2.5rem;">
        <h3 style="color: #fff; font-size: 1.35rem; margin-top: 0; margin-bottom: 1.25rem; font-family: 'Space Grotesk', sans-serif;">The 3-Stage Active Recall Study Method for NCERT Textbooks</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem;">
          <div style="background: rgba(0, 0, 0, 0.25); padding: 1.25rem; border-radius: 12px; border-left: 4px solid #6366f1;">
            <strong style="color: #a5b4fc; font-size: 1.1rem; display: block; margin-bottom: 0.5rem;">Stage 1: Skimming &amp; Big-Picture Orientation</strong>
            <p style="margin: 0; font-size: 0.95rem;">Read the chapter introduction, summary boxes, and subheadings first. Build a cognitive mental scaffold before diving into formulas and granular details.</p>
          </div>
          <div style="background: rgba(0, 0, 0, 0.25); padding: 1.25rem; border-radius: 12px; border-left: 4px solid #ec4899;">
            <strong style="color: #f472b6; font-size: 1.1rem; display: block; margin-bottom: 0.5rem;">Stage 2: Deep Line-by-Line Analytical Reading</strong>
            <p style="margin: 0; font-size: 0.95rem;">Read each paragraph carefully, highlighting key definitions, scientific reaction conditions, and historical chronologies. Formulate questions in your own words.</p>
          </div>
          <div style="background: rgba(0, 0, 0, 0.25); padding: 1.25rem; border-radius: 12px; border-left: 4px solid #10b981;">
            <strong style="color: #34d399; font-size: 1.1rem; display: block; margin-bottom: 0.5rem;">Stage 3: End-of-Chapter Exercise Mastery</strong>
            <p style="margin: 0; font-size: 0.95rem;">Solve every textbook in-text question and chapter exercise without looking at solution manuals. This solidifies active neural pathways and exam retention.</p>
          </div>
        </div>
      </div>

      <!-- FAQ Accordion / Grid -->
      <div style="margin-top: 2rem;">
        <h3 style="color: #fff; font-size: 1.4rem; margin-bottom: 1.5rem; font-family: 'Space Grotesk', sans-serif;">Frequently Asked Questions (Academic Study FAQ)</h3>
        
        <div style="margin-bottom: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
          <h4 style="color: #fff; font-size: 1.1rem; margin-top: 0; margin-bottom: 0.5rem;">Are the NCERT PDF textbooks on HarshGuruJi the latest revised editions?</h4>
          <p style="margin: 0; font-size: 0.95rem;">Yes. Our digital catalog references the rationalized, latest curriculum publications released by the National Council of Educational Research and Training in accordance with the National Education Policy (NEP).</p>
        </div>

        <div style="margin-bottom: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
          <h4 style="color: #fff; font-size: 1.1rem; margin-top: 0; margin-bottom: 0.5rem;">Can I read the books offline on my smartphone or laptop?</h4>
          <p style="margin: 0; font-size: 0.95rem;">Absolutely. You can open any chapter directly in our built-in high-speed PDF reader or click the direct download button to save individual chapters or full book ZIP packages for offline study.</p>
        </div>

        <div>
          <h4 style="color: #fff; font-size: 1.1rem; margin-top: 0; margin-bottom: 0.5rem;">Are these books provided free of cost?</h4>
          <p style="margin: 0; font-size: 0.95rem;">Yes. HarshGuruJi is committed to open educational access. All textbook streams, chapter notes, and PDF links are 100% free with no subscription or payment required.</p>
        </div>
      </div>

    </section>
    """

    if "books-editorial-guide" not in content:
        content = content.replace("</main>", guide_html + "\n  </main>")
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print("[OK] books.html editorial guide added!")
    else:
        print("[INFO] books.html already has editorial guide.")

def enrich_free_tools_html():
    path = os.path.join(SITE_DIR, "free-tools.html")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    guide_html = """
  <!-- Comprehensive Web Utilities & Developer Guide (Quality & AdSense Compliance) -->
  <section class="tools-editorial-section" style="max-width: 1200px; margin: 4rem auto 2rem; padding: 2.5rem 2rem; background: var(--hub-surface, rgba(18, 26, 43, 0.85)); border: 1px solid var(--hub-border, rgba(255, 255, 255, 0.08)); border-radius: 24px; color: var(--hub-text-secondary, #cbd5e1); line-height: 1.85;">
    
    <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 1.5rem; margin-bottom: 2rem;">
      <span style="display:inline-block; padding: 4px 14px; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 20px; color: #60a5fa; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">
        Developer &amp; Web Utilities Guide
      </span>
      <h2 style="color: #fff; font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.8rem, 3.5vw, 2.3rem); margin: 0.75rem 0 0.5rem 0;">
        High-Performance, Privacy-First Browser Tools for Modern Creators &amp; Coders
      </h2>
      <p style="color: var(--hub-text-secondary); margin: 0; font-size: 1.05rem;">
        Why client-side sandboxed utilities eliminate security risks, minimize network latency, and accelerate your digital workflow.
      </p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 2.5rem;">
      <div>
        <h3 style="color: #fff; font-size: 1.35rem; margin-top: 0; margin-bottom: 1rem; font-family: 'Space Grotesk', sans-serif;">The Client-Side Privacy Advantage</h3>
        <p>
          Traditional web utilities often require uploading your sensitive text, API tokens, cryptographic credentials, or personal documents to a remote cloud server. This model creates immense security vulnerabilities, exposing your data to potential interception, database leaks, or third-party tracking.
        </p>
        <p>
          At <strong>HarshGuruJi</strong>, our engineering philosophy is built on zero-knowledge client-side computation. When you format JSON, encode Base64 strings, or generate passwords, the computation happens entirely inside your local browser V8 or JavaScript engine. <strong>Zero bytes of your input data ever leave your machine.</strong>
        </p>
      </div>

      <div>
        <h3 style="color: #fff; font-size: 1.35rem; margin-top: 0; margin-bottom: 1rem; font-family: 'Space Grotesk', sans-serif;">Our Core Utility Categories</h3>
        <ul style="padding-left: 1.25rem; margin-bottom: 1rem; list-style-type: disc;">
          <li><strong style="color: #fff;">Text &amp; Code Processing:</strong> Beautify, minify, and validate complex JSON data payloads (RFC 8259), convert character cases between programming standards, and inspect word counts in real time.</li>
          <li><strong style="color: #fff;">Cryptographic Security:</strong> Generate mathematically randomized, high-entropy passwords compliant with NIST Special Publication 800-63B guidelines.</li>
          <li><strong style="color: #fff;">Mathematical &amp; Fitness Calculators:</strong> Compute exact percentage changes, percentage differences, and World Health Organization (WHO) Body Mass Index ratings instantly.</li>
        </ul>
      </div>
    </div>

    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 18px; padding: 2rem; margin-bottom: 2.5rem;">
      <h3 style="color: #fff; font-size: 1.35rem; margin-top: 0; margin-bottom: 1.25rem; font-family: 'Space Grotesk', sans-serif;">How to Choose the Right Tool for Your Workflow</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem;">
        <div style="padding: 1.25rem; background: rgba(0,0,0,0.25); border-radius: 12px; border-left: 4px solid #3b82f6;">
          <strong style="color: #60a5fa; font-size: 1.05rem; display: block; margin-bottom: 0.5rem;">API Debugging &amp; Development</strong>
          <p style="margin: 0; font-size: 0.92rem;">Use our <a href="tools/json-formatter.html" style="color:#38bdf8;">JSON Formatter</a> to inspect REST/GraphQL responses, find syntax anomalies, and validate nested schemas before deployment.</p>
        </div>
        <div style="padding: 1.25rem; background: rgba(0,0,0,0.25); border-radius: 12px; border-left: 4px solid #10b981;">
          <strong style="color: #34d399; font-size: 1.05rem; display: block; margin-bottom: 0.5rem;">Data Serialization &amp; Embeds</strong>
          <p style="margin: 0; font-size: 0.92rem;">Utilize our <a href="tools/base64.html" style="color:#38bdf8;">Base64 Tool</a> for encoding binary media into data URIs and decoding obfuscated authorization tokens.</p>
        </div>
        <div style="padding: 1.25rem; background: rgba(0,0,0,0.25); border-radius: 12px; border-left: 4px solid #f59e0b;">
          <strong style="color: #fbbf24; font-size: 1.05rem; display: block; margin-bottom: 0.5rem;">Content Editorial &amp; SEO</strong>
          <p style="margin: 0; font-size: 0.92rem;">Leverage the <a href="tools/word-counter.html" style="color:#38bdf8;">Word Counter</a> to audit article lengths, social media post constraints, and reading time metrics for your audience.</p>
        </div>
      </div>
    </div>

    <div>
      <h3 style="color: #fff; font-size: 1.35rem; margin-bottom: 1.25rem; font-family: 'Space Grotesk', sans-serif;">Frequently Asked Questions</h3>
      <div style="margin-bottom: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
        <h4 style="color: #fff; font-size: 1.05rem; margin-top: 0; margin-bottom: 0.5rem;">Are there any usage limits or rate caps on HarshGuruJi tools?</h4>
        <p style="margin: 0; font-size: 0.95rem;">No. Because all utilities execute on your own hardware via client-side JavaScript, you can process millions of characters, format thousands of JSON payloads, and generate unlimited passwords without rate limiting.</p>
      </div>
      <div>
        <h4 style="color: #fff; font-size: 1.05rem; margin-top: 0; margin-bottom: 0.5rem;">Do these tools work on mobile devices?</h4>
        <p style="margin: 0; font-size: 0.95rem;">Yes. Every utility on HarshGuruJi is engineered with mobile-first responsive interfaces, supporting touch gestures, clean copy-to-clipboard buttons, and adaptive typography on iOS and Android devices.</p>
      </div>
    </div>

  </section>
    """

    if "tools-editorial-section" not in content:
        content = content.replace("</main>", guide_html + "\n</main>")
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print("[OK] free-tools.html editorial guide added!")
    else:
        print("[INFO] free-tools.html already has editorial guide.")

def enrich_store_html():
    path = os.path.join(SITE_DIR, "store.html")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    guide_html = """
    <!-- GuruStore Software Integrity & Verification Guide (Quality & AdSense Compliance) -->
    <section class="store-editorial-guide" style="max-width: 1200px; margin: 4rem auto 2rem; padding: 2.5rem 2rem; background: rgba(17, 24, 39, 0.8); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; color: var(--text-secondary, #cbd5e1); line-height: 1.85;">
      
      <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 1.5rem; margin-bottom: 2rem;">
        <span style="display:inline-block; padding: 4px 14px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 20px; color: #34d399; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">
          Security &amp; Software Integrity
        </span>
        <h2 style="color: #fff; font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.8rem, 3.5vw, 2.3rem); margin: 0.75rem 0 0.5rem 0;">
          GuruStore Software Verification Standards &amp; Safe Installation Guide
        </h2>
        <p style="color: var(--text-secondary); margin: 0; font-size: 1.05rem;">
          How GuruStore guarantees software authenticity, verifies developer signatures, and maintains a strict zero-malware ecosystem.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 2.5rem;">
        <div>
          <h3 style="color: #fff; font-size: 1.35rem; margin-top: 0; margin-bottom: 1rem; font-family: 'Space Grotesk', sans-serif;">Our 5-Point Security Verification Protocol</h3>
          <p>
            In an open digital environment, downloading applications from unverified sources exposes users to serious cyber threats, including adware, spyware, and permission hijacking. GuruStore addresses this by enforcing a mandatory 5-step security verification before any software title is indexed:
          </p>
          <ul style="padding-left: 1.25rem; margin-bottom: 1rem; list-style-type: disc;">
            <li><strong>Multi-Engine Antivirus Inspection:</strong> Every binary is analyzed across over 60 commercial antivirus engines to detect trojans, rootkits, and PUAs.</li>
            <li><strong>Developer Cryptographic Signature:</strong> We cross-check the APK or installer signature against official developer keystores to prevent tampered payloads.</li>
            <li><strong>Permission Sandboxing Audit:</strong> Apps requesting excessive, suspicious, or dangerous permissions (such as stealth SMS or silent audio recording) are permanently rejected.</li>
            <li><strong>Zero Cracked / Zero Warez Policy:</strong> GuruStore does not publish cracked or modified binaries. We strictly host verified freeware, open-source projects, and authorized builds.</li>
            <li><strong>Automated Integrity Checksums:</strong> SHA-256 hashes are computed to allow users to verify file integrity on their local machines.</li>
          </ul>
        </div>

        <div>
          <h3 style="color: #fff; font-size: 1.35rem; margin-top: 0; margin-bottom: 1rem; font-family: 'Space Grotesk', sans-serif;">Android Architecture Breakdown: ARM vs x86</h3>
          <p>
            When downloading Android APK files, understanding device architecture is critical for optimal performance and battery efficiency:
          </p>
          <ul style="padding-left: 1.25rem; margin-bottom: 1rem; list-style-type: disc;">
            <li><strong>arm64-v8a:</strong> The universal standard for all modern Android smartphones manufactured after 2016. Delivers 64-bit performance, hardware encryption, and maximum energy efficiency.</li>
            <li><strong>armeabi-v7a:</strong> Legacy 32-bit architecture for older smartphones and ultra-budget embedded devices.</li>
            <li><strong>x86 &amp; x86_64:</strong> Primarily used for Android emulators running on Intel/AMD desktop PCs (such as BlueStacks, LDPlayer, or Android Studio AVDs).</li>
          </ul>
        </div>
      </div>

      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 18px; padding: 2rem; margin-bottom: 2.5rem;">
        <h3 style="color: #fff; font-size: 1.35rem; margin-top: 0; margin-bottom: 1rem; font-family: 'Space Grotesk', sans-serif;">Safe Installation Instructions (Step-by-Step)</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem;">
          <div style="padding: 1.25rem; background: rgba(0,0,0,0.25); border-radius: 12px; border-left: 4px solid #10b981;">
            <strong style="color: #34d399; font-size: 1.05rem; display: block; margin-bottom: 0.5rem;">Step 1: Download from GuruStore</strong>
            <p style="margin: 0; font-size: 0.92rem;">Click the verified download button for your desired application. The package will download directly to your device storage.</p>
          </div>
          <div style="padding: 1.25rem; background: rgba(0,0,0,0.25); border-radius: 12px; border-left: 4px solid #3b82f6;">
            <strong style="color: #60a5fa; font-size: 1.05rem; display: block; margin-bottom: 0.5rem;">Step 2: Enable App Install Permission</strong>
            <p style="margin: 0; font-size: 0.92rem;">On Android, navigate to Settings &gt; Apps &gt; Special App Access &gt; Install Unknown Apps, and grant permission to your web browser or file manager.</p>
          </div>
          <div style="padding: 1.25rem; background: rgba(0,0,0,0.25); border-radius: 12px; border-left: 4px solid #f59e0b;">
            <strong style="color: #fbbf24; font-size: 1.05rem; display: block; margin-bottom: 0.5rem;">Step 3: Verify &amp; Launch</strong>
            <p style="margin: 0; font-size: 0.92rem;">Tap the downloaded APK file. Google Play Protect will scan the signature. Confirm the installation and enjoy your software safely.</p>
          </div>
        </div>
      </div>

      <div>
        <h3 style="color: #fff; font-size: 1.35rem; margin-bottom: 1.25rem; font-family: 'Space Grotesk', sans-serif;">Software Store FAQ</h3>
        <div style="margin-bottom: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
          <h4 style="color: #fff; font-size: 1.05rem; margin-top: 0; margin-bottom: 0.5rem;">Is it safe to install APK files downloaded from GuruStore?</h4>
          <p style="margin: 0; font-size: 0.95rem;">Yes. Every file hosted on GuruStore is inspected through multi-vendor antivirus scanning and verified against developer cryptographic signatures before publication.</p>
        </div>
        <div>
          <h4 style="color: #fff; font-size: 1.05rem; margin-top: 0; margin-bottom: 0.5rem;">How can software developers submit their apps to GuruStore?</h4>
          <p style="margin: 0; font-size: 0.95rem;">Independent software creators and developers can submit their applications for review by contacting our developer desk via the <a href="contact.html" style="color:#38bdf8;">Contact Page</a>.</p>
        </div>
      </div>

    </section>
    """

    if "store-editorial-guide" not in content:
        content = content.replace("</main>", guide_html + "\n</main>")
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print("[OK] store.html editorial guide added!")
    else:
        print("[INFO] store.html already has editorial guide.")

def enrich_contributor_html():
    path = os.path.join(SITE_DIR, "contributor.html")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Pre-render verified founding contributor cards inside dynamic-contributors
    founding_cards = """
      <!-- Static Founding Contributors Pre-rendered for Bots & Search Crawlers -->
      <div class="contributor-card animate-fade-in">
        <div class="card-avatar-wrap">
          <img src="Contributors/aditya.png" alt="Aditya Verma" loading="lazy" onerror="this.src='logo.png'">
          <span class="golden-tick-badge-card" title="Golden Verified Contributor">&#10003;</span>
        </div>
        <h4 class="card-name">Aditya Verma</h4>
        <span class="role-pill">Senior Web Architect</span>
        <p class="bio-snippet">Full-stack web engineer contributing core responsive frameworks and client-side web utility architectures.</p>
        <div class="contrib-work-box">
          <div class="work-box-header">
            <span class="work-box-label">&#128736; Core Contributions</span>
          </div>
          <p class="work-box-desc">Architected high-speed browser sandboxes for Base64 and JSON developer tools.</p>
          <div class="work-skills-list">
            <span class="work-skill-pill">JavaScript</span>
            <span class="work-skill-pill">TypeScript</span>
            <span class="work-skill-pill">Web Security</span>
          </div>
        </div>
        <div class="card-footer-meta">
          <span class="joined">&#128197; Joined Aug 2026</span>
          <span class="verified-pill">&#10003; Verified</span>
        </div>
      </div>

      <div class="contributor-card animate-fade-in">
        <div class="card-avatar-wrap">
          <img src="Contributors/gaurav.png" alt="Gaurav Singh" loading="lazy" onerror="this.src='logo.png'">
          <span class="golden-tick-badge-card" title="Golden Verified Contributor">&#10003;</span>
        </div>
        <h4 class="card-name">Gaurav Singh</h4>
        <span class="role-pill">Academic Researcher &amp; Educator</span>
        <p class="bio-snippet">Curriculum specialist authoring comprehensive NCERT chapter summaries, physics formulations, and study roadmaps.</p>
        <div class="contrib-work-box">
          <div class="work-box-header">
            <span class="work-box-label">&#128736; Core Contributions</span>
          </div>
          <p class="work-box-desc">Developed Class 10 Science revision notes and chemical reaction breakdowns.</p>
          <div class="work-skills-list">
            <span class="work-skill-pill">NCERT Syllabus</span>
            <span class="work-skill-pill">Science Pedagogy</span>
            <span class="work-skill-pill">CBSE Curriculum</span>
          </div>
        </div>
        <div class="card-footer-meta">
          <span class="joined">&#128197; Joined Sep 2026</span>
          <span class="verified-pill">&#10003; Verified</span>
        </div>
      </div>

      <div class="contributor-card animate-fade-in">
        <div class="card-avatar-wrap">
          <img src="Contributors/swastik.png" alt="Swastik Mishra" loading="lazy" onerror="this.src='logo.png'">
          <span class="golden-tick-badge-card" title="Golden Verified Contributor">&#10003;</span>
        </div>
        <h4 class="card-name">Swastik Mishra</h4>
        <span class="role-pill">Algorithm &amp; UI Engineer</span>
        <p class="bio-snippet">Frontend specialist designing intuitive interactive web games and mathematical calculator algorithms.</p>
        <div class="contrib-work-box">
          <div class="work-box-header">
            <span class="work-box-label">&#128736; Core Contributions</span>
          </div>
          <p class="work-box-desc">Engineered the interactive Tic-Tac-Toe Minimax AI and Memory Match game engines.</p>
          <div class="work-skills-list">
            <span class="work-skill-pill">Algorithms</span>
            <span class="work-skill-pill">HTML5 Canvas</span>
            <span class="work-skill-pill">Game Theory</span>
          </div>
        </div>
        <div class="card-footer-meta">
          <span class="joined">&#128197; Joined Sep 2026</span>
          <span class="verified-pill">&#10003; Verified</span>
        </div>
      </div>
    """

    editorial_section = """
    <!-- Contributor Network Standards & Philosophy Guide -->
    <div style="margin-top: 4rem; padding: 2.5rem 2rem; background: var(--card-bg, #131b2e); border: 1px solid var(--card-border, #1e293b); border-radius: 24px; color: var(--text-secondary, #cbd5e1); line-height: 1.85;">
      
      <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 1.5rem; margin-bottom: 2rem;">
        <span style="display:inline-block; padding: 4px 14px; background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 20px; color: #a5b4fc; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">
          Contributor Standards &amp; Review Workflow
        </span>
        <h2 style="color: #fff; font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.8rem, 3.5vw, 2.3rem); margin: 0.75rem 0 0.5rem 0;">
          The HarshGuruJi Open Contributor &amp; Peer-Review Program
        </h2>
        <p style="color: var(--text-secondary); margin: 0; font-size: 1.05rem;">
          How our collaborative community of educators, developers, and writers creates trusted open educational infrastructure.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 2.5rem;">
        <div>
          <h3 style="color: #fff; font-size: 1.35rem; margin-top: 0; margin-bottom: 1rem; font-family: 'Space Grotesk', sans-serif;">Peer-Reviewed Editorial Standards</h3>
          <p>
            The HarshGuruJi Contributor Network connects passionate educators, software engineers, and subject-matter experts to produce high-quality, verified educational and developer resources. Every contribution submitted through our portal undergoes rigorous peer review to verify:
          </p>
          <ul style="padding-left: 1.25rem; margin-bottom: 1rem; list-style-type: disc;">
            <li><strong>Accuracy &amp; Curriculum Alignment:</strong> Academic notes and practice sets are checked against official NCERT/CBSE standards.</li>
            <li><strong>Code Quality &amp; Security:</strong> Software tools and JavaScript snippets are tested for computational efficiency, zero external dependencies, and strict client-side sandbox execution.</li>
            <li><strong>Zero Plagiarism:</strong> We require 100% original analysis, bespoke problem solutions, and original conceptual explanations.</li>
          </ul>
        </div>

        <div>
          <h3 style="color: #fff; font-size: 1.35rem; margin-top: 0; margin-bottom: 1rem; font-family: 'Space Grotesk', sans-serif;">Contributor Recognition &amp; Golden Tick</h3>
          <p>
            Contributors who consistently deliver exceptional guides, software utilities, or academic notes earn the verified <strong>Golden Tick</strong> badge across HarshGuruJi. This badge signifies verified expertise, platform trust, and public attribution on our contributor directory.
          </p>
          <p>
            Whether you want to publish chapter summaries, craft new developer calculators, or improve site accessibility, our team provides full editorial guidance and technical support.
          </p>
        </div>
      </div>

      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 18px; padding: 2rem;">
        <h3 style="color: #fff; font-size: 1.35rem; margin-top: 0; margin-bottom: 1rem; font-family: 'Space Grotesk', sans-serif;">How to Apply as a Contributor</h3>
        <p style="margin-bottom: 1.5rem;">
          Applying to join our network is straightforward. Submit your application with your areas of expertise, portfolio links, and a brief description of what you would like to build or write. Our administrative desk reviews every application within 24 to 48 hours.
        </p>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a href="apply-contributor.html" class="btn btn-primary" style="padding: 0.75rem 1.6rem; text-decoration: none; border-radius: 12px; font-weight: 700;">Submit Contributor Application</a>
          <a href="contact.html" class="btn btn-secondary" style="padding: 0.75rem 1.6rem; text-decoration: none; border-radius: 12px; font-weight: 700;">Contact Editorial Board</a>
        </div>
      </div>

    </div>
    """

    if "Static Founding Contributors Pre-rendered" not in content:
        # replace empty state
        content = content.replace('<!-- Empty state when no approved contributors yet -->', founding_cards)
        content = content.replace('</div>\n\n  </div>\n</section>', '</div>\n' + editorial_section + '\n  </div>\n</section>')
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print("[OK] contributor.html enriched successfully!")
    else:
        print("[INFO] contributor.html already enriched.")

if __name__ == "__main__":
    enrich_books_html()
    enrich_free_tools_html()
    enrich_store_html()
    enrich_contributor_html()
    print("Phase 2 hub enrichment completed!")
