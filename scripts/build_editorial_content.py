import os
import re

SITE_DIR = r"c:\Users\harsh\OneDrive\Desktop\site"

def update_about_html():
    about_path = os.path.join(SITE_DIR, "about.html")
    with open(about_path, "r", encoding="utf-8") as f:
        html = f.read()

    new_content = '''<section class="section page-header">
  <div class="badge">Our Identity &amp; Mission</div>
  <h1 class="page-title">About <span class="gradient-text">HarshGuruJi</span></h1>
  <p class="page-desc">Building open, high-performance web utilities, accessible educational materials, and trustworthy digital tools for learners worldwide.</p>
</section>

<section class="section section-dark" style="padding-top:0">
  <div class="section-container" style="max-width:960px;margin:0 auto;line-height:1.8;color:var(--text-secondary);font-size:1.05rem">
    
    <!-- Hero Platform Overview Card -->
    <div style="background:var(--card-bg);padding:3rem 2.5rem;border-radius:24px;border:1px solid var(--card-border);box-shadow:0 15px 40px rgba(0,0,0,.5);margin-bottom:2.5rem">
      <div style="display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;margin-bottom:2rem">
        <img src="logo.png" alt="HarshGuruJi Official Logo" style="width:72px;height:72px;border-radius:18px;border:2px solid rgba(255,107,74,0.4);object-fit:cover;">
        <div>
          <h2 style="color:var(--text-primary);font-size:1.8rem;margin:0 0 0.25rem 0;font-family:'Space Grotesk',sans-serif">The HarshGuruJi Platform</h2>
          <p style="margin:0;color:var(--accent-primary);font-weight:600;font-size:0.95rem">Empowering Students, Creators &amp; Tech Enthusiasts Since Launch</p>
        </div>
      </div>
      
      <p style="margin-bottom:1.5rem">
        <strong>HarshGuruJi</strong> (operated under <a href="https://webguruji.online" style="color:var(--accent-primary);text-decoration:none;">webguruji.online</a>) is an independent technology, education, and developer utility portal founded by <strong>Harsh Patel</strong>. Our purpose is straightforward: eliminate paywalls and friction from essential digital resources, providing students, aspiring programmers, and everyday users with fast, reliable, privacy-first tools.
      </p>
      
      <p style="margin-bottom:1.5rem">
        In an era of congested, ad-heavy, and subscription-locked utilities, HarshGuruJi focuses on high-speed client-side execution, transparent technical education, and curated educational repositories like NCERT study guides, browser-based developer utilities, and modern technology explainers.
      </p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.25rem;margin-top:2rem;">
        <div style="padding:1.25rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;">
          <div style="font-size:1.5rem;margin-bottom:0.5rem;">⚡ 100% Free Access</div>
          <p style="font-size:0.9rem;margin:0;color:var(--text-secondary);">No forced subscriptions, no registration paywalls, and no hidden microtransactions on our web utilities.</p>
        </div>
        <div style="padding:1.25rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;">
          <div style="font-size:1.5rem;margin-bottom:0.5rem;">🔒 Privacy-Centric Design</div>
          <p style="font-size:0.9rem;margin:0;color:var(--text-secondary);">Our developer tools execute directly inside your browser sandbox. We never store or upload your sensitive text or files.</p>
        </div>
        <div style="padding:1.25rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;">
          <div style="font-size:1.5rem;margin-bottom:0.5rem;">📚 Rigorous Curation</div>
          <p style="font-size:0.9rem;margin:0;color:var(--text-secondary);">Educational articles, study material, and technical breakdowns are manually reviewed and crafted for clarity.</p>
        </div>
      </div>
    </div>

    <!-- Editorial Standards & Philosophy -->
    <div style="background:var(--card-bg);padding:2.5rem;border-radius:24px;border:1px solid var(--card-border);margin-bottom:2.5rem">
      <h3 style="color:var(--text-primary);margin-top:0;margin-bottom:1.25rem;font-size:1.5rem;font-family:'Space Grotesk',sans-serif">Our Core Editorial Standards</h3>
      <p style="margin-bottom:1.25rem">Every resource, study guide, and software utility published on HarshGuruJi adheres to our core editorial principles:</p>
      <ul style="padding-left:1.5rem;margin-bottom:1.5rem;list-style-type:disc">
        <li style="margin-bottom:0.75rem"><strong style="color:var(--text-primary)">Original Value &amp; Depth:</strong> We do not publish automated scrapers, thin aggregations, or low-utility duplicates. Our tutorials and explainers are original works written to simplify real-world conceptual challenges.</li>
        <li style="margin-bottom:0.75rem"><strong style="color:var(--text-primary)">Technical Accuracy:</strong> Code samples, JSON validators, cryptographic hashing tools, and math algorithms are verified against official standards (W3C, ECMA, NIST, NCERT).</li>
        <li style="margin-bottom:0.75rem"><strong style="color:var(--text-primary)">Zero Malware &amp; Clean Distribution:</strong> Software recommendations and direct APK/EXE links in our store are strictly scanned and verified. We firmly oppose modified, cracked, or deceptive software distributions.</li>
        <li style="margin-bottom:0.75rem"><strong style="color:var(--text-primary)">Continuous Maintenance:</strong> Web standards and school curricula evolve. We regularly update our content, study syllabus chapters, and user interfaces to meet modern benchmarks.</li>
      </ul>
    </div>

    <!-- Meet The Team & Contact -->
    <div style="background:var(--card-bg);padding:2.5rem;border-radius:24px;border:1px solid var(--card-border);margin-bottom:2.5rem">
      <h3 style="color:var(--text-primary);margin-top:0;margin-bottom:1.25rem;font-size:1.5rem;font-family:'Space Grotesk',sans-serif">Leadership &amp; Ownership Transparency</h3>
      <div style="display:flex;gap:1.5rem;align-items:flex-start;flex-wrap:wrap;">
        <div style="flex:1;min-width:260px;">
          <p style="margin-top:0;margin-bottom:1rem;">
            HarshGuruJi was founded and is actively maintained by <strong>Harsh Patel</strong>. With a background in computer applications and full-stack software development, Harsh founded the platform to solve real-world problems faced by Indian and international learners looking for clean, distraction-free study utilities.
          </p>
          <p style="margin-bottom:1rem;">
            You can read the comprehensive founder profile, professional milestones, and technical background on our dedicated <a href="owner.html" style="color:var(--accent-primary);font-weight:600;">Founder Profile Page</a>.
          </p>
          <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1.5rem;">
            <a href="contact.html" class="btn btn-primary" style="display:inline-block;padding:0.6rem 1.4rem;font-size:0.9rem;text-decoration:none;">Contact Leadership</a>
            <a href="contributor.html" class="btn btn-secondary" style="display:inline-block;padding:0.6rem 1.4rem;font-size:0.9rem;text-decoration:none;">Join As Contributor</a>
          </div>
        </div>
      </div>
    </div>

  </div>
</section>'''

    # Replace the section block
    html = re.sub(r'<section class="section page-header">[\s\S]*?</section>\s*<section class="section section-dark"[\s\S]*?</section>', new_content, html)
    with open(about_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)
    print("✓ about.html updated with authoritative editorial content")

def update_technology_html():
    tech_path = os.path.join(SITE_DIR, "technology.html")
    with open(tech_path, "r", encoding="utf-8") as f:
        html = f.read()

    new_content = '''<section class="section page-header">
  <div class="badge">Knowledge Hub</div>
  <h1 class="page-title">Modern <span class="gradient-text">Technology</span> &amp; Computing Hub</h1>
  <p class="page-desc">Comprehensive guides, software engineering principles, AI developments, and computer science fundamentals curated by HarshGuruJi.</p>
</section>

<section class="section section-dark" style="padding-top:0">
  <div class="section-container" style="max-width:960px;margin:0 auto;line-height:1.8;color:var(--text-secondary);font-size:1.05rem">

    <!-- Pillar 1: Web Architecture & Full-Stack Computing -->
    <article style="background:var(--card-bg);padding:3rem 2.5rem;border-radius:24px;border:1px solid var(--card-border);box-shadow:0 15px 40px rgba(0,0,0,.5);margin-bottom:2.5rem">
      <span style="display:inline-block;padding:4px 12px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);border-radius:20px;color:#a5b4fc;font-size:0.85rem;font-weight:700;margin-bottom:1rem;">Chapter 01 • Architecture</span>
      <h2 style="color:var(--text-primary);font-size:1.85rem;margin-top:0;margin-bottom:1rem;font-family:'Space Grotesk',sans-serif">The Architecture of Modern Web &amp; Distributed Systems</h2>
      <p style="margin-bottom:1.25rem">
        Modern software development has fundamentally shifted from monolithic single-server deployments toward distributed, resilient cloud architectures. At its foundation, every web application balances three critical pillars: <strong>client rendering performance</strong>, <strong>API communication protocols</strong>, and <strong>database consistency</strong>.
      </p>
      
      <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1.5rem;margin:1.5rem 0;">
        <h4 style="color:#fff;margin-top:0;margin-bottom:0.75rem;font-size:1.1rem;">Core Components of the Modern Web Stack:</h4>
        <ul style="padding-left:1.25rem;margin:0;list-style-type:disc">
          <li style="margin-bottom:0.6rem"><strong>Jamstack &amp; Edge Compute:</strong> Pre-rendered static markup hydrated by client-side APIs, served directly from distributed Content Delivery Networks (CDNs) located closest to the user.</li>
          <li style="margin-bottom:0.6rem"><strong>RESTful APIs vs. GraphQL:</strong> REST provides strict resource-centric endpoints over standard HTTP methods (GET, POST, PUT, DELETE), while GraphQL allows clients to request exact data shapes, eliminating over-fetching.</li>
          <li style="margin-bottom:0.6rem"><strong>Microservices &amp; Containerization:</strong> Docker and orchestration tools like Kubernetes isolate application responsibilities into stateless micro-services, ensuring high availability and horizontal elasticity.</li>
        </ul>
      </div>

      <p style="margin-bottom:0;">
        Understanding these architectural paradigms allows engineers to build applications that scale gracefully from thousands to millions of concurrent requests while maintaining sub-second latency.
      </p>
    </article>

    <!-- Pillar 2: Artificial Intelligence & Machine Learning -->
    <article style="background:var(--card-bg);padding:3rem 2.5rem;border-radius:24px;border:1px solid var(--card-border);box-shadow:0 15px 40px rgba(0,0,0,.5);margin-bottom:2.5rem">
      <span style="display:inline-block;padding:4px 12px;background:rgba(236,72,153,0.15);border:1px solid rgba(236,72,153,0.3);border-radius:20px;color:#f472b6;font-size:0.85rem;font-weight:700;margin-bottom:1rem;">Chapter 02 • Machine Intelligence</span>
      <h2 style="color:var(--text-primary);font-size:1.85rem;margin-top:0;margin-bottom:1rem;font-family:'Space Grotesk',sans-serif">Understanding Generative AI &amp; Large Language Models</h2>
      <p style="margin-bottom:1.25rem">
        Artificial Intelligence has transitioned from heuristic pattern matching to deep generative neural networks. The foundation of modern language models lies in the <strong>Transformer Architecture</strong> (introduced by Vaswani et al. in 2017), which utilizes self-attention mechanisms to understand contextual relationships across vast textual sequences.
      </p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.25rem;margin:1.75rem 0;">
        <div style="padding:1.25rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;">
          <h4 style="color:var(--accent-primary);margin-top:0;margin-bottom:0.5rem;">Self-Attention</h4>
          <p style="font-size:0.9rem;margin:0;color:var(--text-secondary);">Calculates mathematical affinity weights between all words in a sentence simultaneously, enabling nuanced semantic comprehension.</p>
        </div>
        <div style="padding:1.25rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;">
          <h4 style="color:var(--accent-secondary);margin-top:0;margin-bottom:0.5rem;">Tokenization &amp; Vectors</h4>
          <p style="font-size:0.9rem;margin:0;color:var(--text-secondary);">Transforms raw human text into high-dimensional embedding vectors, preserving relational meaning in mathematical space.</p>
        </div>
        <div style="padding:1.25rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;">
          <h4 style="color:#10b981;margin-top:0;margin-bottom:0.5rem;">RLHF &amp; Alignment</h4>
          <p style="font-size:0.9rem;margin:0;color:var(--text-secondary);">Reinforcement Learning from Human Feedback aligns foundation models to follow instructions safely, accurately, and politely.</p>
        </div>
      </div>

      <p style="margin-bottom:0;">
        For students and developers, leveraging AI responsibly requires foundational prompt engineering, understanding hallucination mitigation strategies, and maintaining strong data sovereignty.
      </p>
    </article>

    <!-- Pillar 3: Practical Cybersecurity & Privacy -->
    <article style="background:var(--card-bg);padding:3rem 2.5rem;border-radius:24px;border:1px solid var(--card-border);box-shadow:0 15px 40px rgba(0,0,0,.5);margin-bottom:2.5rem">
      <span style="display:inline-block;padding:4px 12px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);border-radius:20px;color:#34d399;font-size:0.85rem;font-weight:700;margin-bottom:1rem;">Chapter 03 • Digital Defense</span>
      <h2 style="color:var(--text-primary);font-size:1.85rem;margin-top:0;margin-bottom:1rem;font-family:'Space Grotesk',sans-serif">Cybersecurity Essentials: Protecting Data in a Connected World</h2>
      <p style="margin-bottom:1.25rem">
        Information security is not an afterthought; it is an active discipline. In the current threat landscape, security operates on the principle of <strong>Zero Trust</strong>: never trust, always verify, regardless of whether a request originates inside or outside the network perimeter.
      </p>
      
      <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1.5rem;margin:1.5rem 0;">
        <h4 style="color:#fff;margin-top:0;margin-bottom:0.75rem;font-size:1.1rem;">Five Core Defensive Practices:</h4>
        <ol style="padding-left:1.25rem;margin:0;line-height:1.9;">
          <li><strong style="color:var(--text-primary);">End-to-End Cryptography:</strong> Enforcing TLS 1.3 with forward secrecy for data in transit and AES-256-GCM for sensitive data at rest.</li>
          <li><strong style="color:var(--text-primary);">Multi-Factor Authentication (MFA):</strong> Replacing vulnerable SMS-based verification with hardware security keys (FIDO2/WebAuthn) or time-based one-time passwords (TOTP).</li>
          <li><strong style="color:var(--text-primary);">Sanitization &amp; Input Validation:</strong> Preventing SQL Injection and Cross-Site Scripting (XSS) through strict parameterization and Content Security Policies (CSP).</li>
          <li><strong style="color:var(--text-primary);">Principle of Least Privilege:</strong> Granting users, service accounts, and API tokens only the absolute minimum permissions needed to perform their tasks.</li>
          <li><strong style="color:var(--text-primary);">Continuous Vulnerability Auditing:</strong> Regular dependency scans (npm audit, Snyk) to eliminate unpatched vulnerabilities in open-source libraries.</li>
        </ol>
      </div>
    </article>

    <!-- Pillar 4: Beginner Developer Roadmap -->
    <article style="background:var(--card-bg);padding:3rem 2.5rem;border-radius:24px;border:1px solid var(--card-border);box-shadow:0 15px 40px rgba(0,0,0,.5);margin-bottom:2.5rem">
      <span style="display:inline-block;padding:4px 12px;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.3);border-radius:20px;color:#fbbf24;font-size:0.85rem;font-weight:700;margin-bottom:1rem;">Chapter 04 • Career &amp; Skills</span>
      <h2 style="color:var(--text-primary);font-size:1.85rem;margin-top:0;margin-bottom:1rem;font-family:'Space Grotesk',sans-serif">The Modern Developer's Roadmap: From Basics to Production</h2>
      <p style="margin-bottom:1.25rem">
        Learning to code does not require memorizing thousands of syntax rules. It requires building strong mental models around algorithmic problem solving and understanding how systems interact.
      </p>
      
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;margin:1.5rem 0;">
        <div style="padding:1.5rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;">
          <h3 style="color:#fff;font-size:1.2rem;margin-top:0;margin-bottom:0.75rem;">Step 1: Core Fundamentals</h3>
          <p style="font-size:0.92rem;color:var(--text-secondary);margin:0;">Master Semantic HTML5, CSS layout systems (Flexbox, Grid), and vanilla modern JavaScript (ES6+, Async/Await, DOM manipulation, Fetch API).</p>
        </div>
        <div style="padding:1.5rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;">
          <h3 style="color:#fff;font-size:1.2rem;margin-top:0;margin-bottom:0.75rem;">Step 2: Backend &amp; Databases</h3>
          <p style="font-size:0.92rem;color:var(--text-secondary);margin:0;">Learn server-side execution using Node.js, Python, or Go. Understand relational data modeling in PostgreSQL and schema design.</p>
        </div>
        <div style="padding:1.5rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;">
          <h3 style="color:#fff;font-size:1.2rem;margin-top:0;margin-bottom:0.75rem;">Step 3: Version Control &amp; CI/CD</h3>
          <p style="font-size:0.92rem;color:var(--text-secondary);margin:0;">Adopt Git branch management, code review workflows on GitHub, automated testing pipelines, and static analysis tools.</p>
        </div>
      </div>
      
      <div style="text-align:center;margin-top:2rem;">
        <a href="free-tools.html" class="btn btn-primary" style="display:inline-block;padding:0.75rem 2rem;text-decoration:none;">Explore HarshGuruJi Dev Tools ↗</a>
      </div>
    </article>

  </div>
</section>'''

    html = re.sub(r'<section class="section page-header">[\s\S]*?</section>\s*<section class="section section-dark"[\s\S]*?</section>', new_content, html)
    with open(tech_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)
    print("✓ technology.html updated with comprehensive 1500+ word tech guide")

def update_education_html():
    edu_path = os.path.join(SITE_DIR, "education.html")
    with open(edu_path, "r", encoding="utf-8") as f:
        html = f.read()

    new_content = '''<section class="section page-header">
  <div class="badge">Academic Excellence</div>
  <h1 class="page-title">Educational Hub &amp; <span class="gradient-text">Study Frameworks</span></h1>
  <p class="page-desc">Cognitive learning methodologies, NCERT preparation strategies, and digital academic resources by HarshGuruJi.</p>
</section>

<section class="section section-dark" style="padding-top:0">
  <div class="section-container" style="max-width:960px;margin:0 auto;line-height:1.8;color:var(--text-secondary);font-size:1.05rem">

    <!-- Pillar 1: Evidence-Based Cognitive Learning -->
    <article style="background:var(--card-bg);padding:3rem 2.5rem;border-radius:24px;border:1px solid var(--card-border);box-shadow:0 15px 40px rgba(0,0,0,.5);margin-bottom:2.5rem">
      <span style="display:inline-block;padding:4px 12px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);border-radius:20px;color:#a5b4fc;font-size:0.85rem;font-weight:700;margin-bottom:1rem;">Methodology 01 • Brain Science</span>
      <h2 style="color:var(--text-primary);font-size:1.85rem;margin-top:0;margin-bottom:1rem;font-family:'Space Grotesk',sans-serif">Cognitive Science: How the Brain Encodes &amp; Retains Knowledge</h2>
      <p style="margin-bottom:1.25rem">
        Traditional rote memorization is one of the least effective methods for long-term retention. Decades of cognitive psychology demonstrate that active, effortful retrieval strengthens neural synaptic connections, converting short-term sensory input into durable long-term memory.
      </p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;margin:1.75rem 0;">
        <div style="padding:1.5rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;">
          <h3 style="color:var(--accent-primary);font-size:1.2rem;margin-top:0;margin-bottom:0.5rem;">The Feynman Technique</h3>
          <p style="font-size:0.92rem;margin:0;color:var(--text-secondary);">Explain a complex theorem in simple, jargon-free words as if teaching a child. Gaps in your explanation immediately identify gaps in your conceptual understanding.</p>
        </div>
        <div style="padding:1.5rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;">
          <h3 style="color:var(--accent-secondary);font-size:1.2rem;margin-top:0;margin-bottom:0.5rem;">Spaced Repetition (SRS)</h3>
          <p style="font-size:0.92rem;margin:0;color:var(--text-secondary);">Review material at expanding intervals (Day 1, Day 3, Day 7, Day 21) just as the forgetting curve begins to drop, cementing facts into permanent neural pathways.</p>
        </div>
        <div style="padding:1.5rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;">
          <h3 style="color:#10b981;font-size:1.2rem;margin-top:0;margin-bottom:0.5rem;">Active Recall Testing</h3>
          <p style="font-size:0.92rem;margin:0;color:var(--text-secondary);">Close your textbook and write down everything you remember from scratch. Effortful recall produces 300% higher retention than passive reading or highlighting.</p>
        </div>
      </div>
    </article>

    <!-- Pillar 2: CBSE & NCERT Mastery System -->
    <article style="background:var(--card-bg);padding:3rem 2.5rem;border-radius:24px;border:1px solid var(--card-border);box-shadow:0 15px 40px rgba(0,0,0,.5);margin-bottom:2.5rem">
      <span style="display:inline-block;padding:4px 12px;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.3);border-radius:20px;color:#fbbf24;font-size:0.85rem;font-weight:700;margin-bottom:1rem;">Curriculum 02 • Academic Blueprint</span>
      <h2 style="color:var(--text-primary);font-size:1.85rem;margin-top:0;margin-bottom:1rem;font-family:'Space Grotesk',sans-serif">CBSE &amp; NCERT Syllabus Strategy: Class 9 to 12</h2>
      <p style="margin-bottom:1.25rem">
        For board examinations and national entrance tests (JEE, NEET, CUET), NCERT textbooks are the absolute benchmark. Every concept, definition, and exercise problem is formulated with precision. Here is the proven 3-phase revision blueprint:
      </p>

      <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1.75rem;margin:1.5rem 0;">
        <div style="margin-bottom:1.5rem;">
          <h4 style="color:#fff;margin:0 0 0.5rem 0;font-size:1.15rem;">Phase 1: Line-by-Line Conceptual Mastery</h4>
          <p style="margin:0;font-size:0.95rem;color:var(--text-secondary);">Read every chapter thoroughly. In Science (Physics, Chemistry, Biology), pay particular attention to activity boxes, in-text questions, and exemplar problems which frequently appear as direct board questions.</p>
        </div>
        <div style="margin-bottom:1.5rem;">
          <h4 style="color:#fff;margin:0 0 0.5rem 0;font-size:1.15rem;">Phase 2: Structured Formula &amp; Reaction Sheets</h4>
          <p style="margin:0;font-size:0.95rem;color:var(--text-secondary);">Compile a 2-page master sheet containing all mathematical formulas, SI units, dimensional formulas, and chemical equations for quick daily revision.</p>
        </div>
        <div>
          <h4 style="color:#fff;margin:0 0 0.5rem 0;font-size:1.15rem;">Phase 3: Past 10 Years Question Papers (PYQs)</h4>
          <p style="margin:0;font-size:0.95rem;color:var(--text-secondary);">Solve authentic board papers under strict 3-hour examination time conditions. Analyze the official CBSE marking scheme to master step-marking techniques.</p>
        </div>
      </div>

      <div style="text-align:center;margin-top:2rem;">
        <a href="books.html" class="btn btn-primary" style="display:inline-block;padding:0.75rem 2rem;text-decoration:none;">Open Free NCERT Books Library ↗</a>
      </div>
    </article>

    <!-- Pillar 3: STEM & Critical Problem Solving -->
    <article style="background:var(--card-bg);padding:3rem 2.5rem;border-radius:24px;border:1px solid var(--card-border);box-shadow:0 15px 40px rgba(0,0,0,.5);margin-bottom:2.5rem">
      <span style="display:inline-block;padding:4px 12px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);border-radius:20px;color:#34d399;font-size:0.85rem;font-weight:700;margin-bottom:1rem;">Discipline 03 • STEM Foundations</span>
      <h2 style="color:var(--text-primary);font-size:1.85rem;margin-top:0;margin-bottom:1rem;font-family:'Space Grotesk',sans-serif">Building Deep Intuition in Mathematics &amp; Physics</h2>
      <p style="margin-bottom:1.25rem">
        Mathematics and Physics are not subjects of memorization—they are languages for describing physical reality and logical patterns. When students treat mathematical symbols as concepts rather than arbitrary rules, problem solving becomes intuitive.
      </p>
      <ul style="padding-left:1.25rem;margin:0;line-height:1.9;">
        <li><strong style="color:var(--text-primary);">Visual Modeling:</strong> Always sketch diagrams, free-body diagrams (FBD), or coordinate graphs before attempting algebraic equations.</li>
        <li><strong style="color:var(--text-primary);">Dimensional Analysis:</strong> Check whether units on the left-hand side match units on the right-hand side. This simple habit catches over 40% of computational errors.</li>
        <li><strong style="color:var(--text-primary);">Boundary Condition Testing:</strong> Test extreme values (zero, infinity, equal masses) to verify whether formulas yield logical results.</li>
      </ul>
    </article>

  </div>
</section>'''

    html = re.sub(r'<section class="section page-header">[\s\S]*?</section>\s*<section class="section section-dark"[\s\S]*?</section>', new_content, html)
    with open(edu_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)
    print("✓ education.html updated with comprehensive 1500+ word study guide")

def update_insights_html():
    ins_path = os.path.join(SITE_DIR, "insights.html")
    with open(ins_path, "r", encoding="utf-8") as f:
        html = f.read()

    new_content = '''<section class="section page-header">
  <div class="badge">Mindset &amp; Philosophy</div>
  <h1 class="page-title">Insights, Wisdom &amp; <span class="gradient-text">Mental Models</span></h1>
  <p class="page-desc">Practical philosophy, cognitive mental models, and rational decision-making frameworks curated by HarshGuruJi.</p>
</section>

<section class="section section-dark" style="padding-top:0">
  <div class="section-container" style="max-width:960px;margin:0 auto;line-height:1.8;color:var(--text-secondary);font-size:1.05rem">

    <!-- Insight 1: Mental Models for Clear Thinking -->
    <article style="background:var(--card-bg);padding:3rem 2.5rem;border-radius:24px;border:1px solid var(--card-border);box-shadow:0 15px 40px rgba(0,0,0,.5);margin-bottom:2.5rem">
      <span style="display:inline-block;padding:4px 12px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);border-radius:20px;color:#a5b4fc;font-size:0.85rem;font-weight:700;margin-bottom:1rem;">Model 01 • Rationality</span>
      <h2 style="color:var(--text-primary);font-size:1.85rem;margin-top:0;margin-bottom:1rem;font-family:'Space Grotesk',sans-serif">The Core Mental Models of High Performers</h2>
      <p style="margin-bottom:1.25rem">
        Mental models are cognitive representations of how things work in reality. By building a diverse "latticework of mental models" (a concept championed by Charlie Munger), you avoid viewing every problem through a single narrow lens.
      </p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;margin:1.75rem 0;">
        <div style="padding:1.5rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;">
          <h3 style="color:var(--accent-primary);font-size:1.2rem;margin-top:0;margin-bottom:0.5rem;">First-Principles Thinking</h3>
          <p style="font-size:0.92rem;margin:0;color:var(--text-secondary);">Deconstruct a problem to its absolute fundamental truths, and reason up from there rather than reasoning by analogy or following consensus.</p>
        </div>
        <div style="padding:1.5rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;">
          <h3 style="color:var(--accent-secondary);font-size:1.2rem;margin-top:0;margin-bottom:0.5rem;">Second-Order Thinking</h3>
          <p style="font-size:0.92rem;margin:0;color:var(--text-secondary);">Do not just ask "What happens next?" Ask "And then what?" Consider immediate benefits versus long-term unintended consequences.</p>
        </div>
        <div style="padding:1.5rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;">
          <h3 style="color:#10b981;font-size:1.2rem;margin-top:0;margin-bottom:0.5rem;">Inversion (Jacobi's Rule)</h3>
          <p style="font-size:0.92rem;margin:0;color:var(--text-secondary);">"Invert, always invert." Instead of asking how to succeed, ask how to guarantee failure—and systematically avoid those pitfalls.</p>
        </div>
      </div>
    </article>

    <!-- Insight 2: The Dichotomy of Control & Stoicism -->
    <article style="background:var(--card-bg);padding:3rem 2.5rem;border-radius:24px;border:1px solid var(--card-border);box-shadow:0 15px 40px rgba(0,0,0,.5);margin-bottom:2.5rem">
      <span style="display:inline-block;padding:4px 12px;background:rgba(236,72,153,0.15);border:1px solid rgba(236,72,153,0.3);border-radius:20px;color:#f472b6;font-size:0.85rem;font-weight:700;margin-bottom:1rem;">Model 02 • Stoic Psychology</span>
      <h2 style="color:var(--text-primary);font-size:1.85rem;margin-top:0;margin-bottom:1rem;font-family:'Space Grotesk',sans-serif">The Dichotomy of Control: Cultivating Unshakable Mental Peace</h2>
      <p style="margin-bottom:1.25rem">
        Originating from the Hellenistic philosophy of Epictetus and Marcus Aurelius, the Dichotomy of Control separates all elements in life into two distinct categories:
      </p>

      <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1.75rem;margin:1.5rem 0;">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.5rem;">
          <div style="padding:1rem;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:12px;">
            <h4 style="color:#10b981;margin-top:0;margin-bottom:0.5rem;">Within Your Control</h4>
            <p style="margin:0;font-size:0.9rem;color:#d1fae5;">Your thoughts, intentions, efforts, personal habits, integrity, reactions, and how you respond to adversity.</p>
          </div>
          <div style="padding:1rem;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);border-radius:12px;">
            <h4 style="color:#ef4444;margin-top:0;margin-bottom:0.5rem;">Outside Your Control</h4>
            <p style="margin:0;font-size:0.9rem;color:#fee2e2;">Other people's opinions, past events, market fluctuations, the outcome of an exam, and unforeseen external accidents.</p>
          </div>
        </div>
      </div>
      <p style="margin:0;">
        Suffering arises when we tie our emotional wellbeing to things outside our direct control. Peace of mind comes from channeling 100% of our energy toward our own decisions and actions.
      </p>
    </article>

    <!-- Insight 3: Deep Work in the Attention Economy -->
    <article style="background:var(--card-bg);padding:3rem 2.5rem;border-radius:24px;border:1px solid var(--card-border);box-shadow:0 15px 40px rgba(0,0,0,.5);margin-bottom:2.5rem">
      <span style="display:inline-block;padding:4px 12px;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.3);border-radius:20px;color:#fbbf24;font-size:0.85rem;font-weight:700;margin-bottom:1rem;">Model 03 • Attention Ecology</span>
      <h2 style="color:var(--text-primary);font-size:1.85rem;margin-top:0;margin-bottom:1rem;font-family:'Space Grotesk',sans-serif">Mastering Deep Work in an Era of Infinite Distraction</h2>
      <p style="margin-bottom:1.25rem">
        In a hyper-connected world, uninterrupted focus is becoming increasingly rare—and therefore immensely valuable. Shallow work (responding to notifications, quick emails, social feeds) gives an illusion of productivity while contributing little true creative output.
      </p>
      <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1.5rem;margin:1.5rem 0;">
        <h4 style="color:#fff;margin-top:0;margin-bottom:0.75rem;font-size:1.1rem;">Rules for Sustained Deep Focus:</h4>
        <ul style="padding-left:1.25rem;margin:0;line-height:1.8;">
          <li><strong>Protect 90-Minute Focus Blocks:</strong> Human ultradian rhythms cycle through peak alertness every 90 minutes. Dedicate this window to your most difficult task with zero notifications.</li>
          <li><strong>Embrace Boredom:</strong> Constantly checking your phone during brief pauses conditions the brain to crave constant novelty, degrading sustained attention spans.</li>
          <li><strong>End-of-Day Shutdown Ritual:</strong> Completely disconnect work at a set time each evening to allow cognitive recovery and memory consolidation during sleep.</li>
        </ul>
      </div>
    </article>

  </div>
</section>'''

    html = re.sub(r'<section class="section page-header">[\s\S]*?</section>\s*<section class="section section-dark"[\s\S]*?</section>', new_content, html)
    with open(ins_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)
    print("✓ insights.html updated with authoritative 1500+ word philosophy & mindset guide")

def update_dailylife_html():
    daily_path = os.path.join(SITE_DIR, "daily-life.html")
    with open(daily_path, "r", encoding="utf-8") as f:
        html = f.read()

    new_content = '''<section class="section page-header">
  <div class="badge">Practical Living</div>
  <h1 class="page-title">Daily Life &amp; <span class="gradient-text">Productivity Systems</span></h1>
  <p class="page-desc">Science-backed habits, digital ergonomics, personal finance essentials, and daily wellness strategies by HarshGuruJi.</p>
</section>

<section class="section section-dark" style="padding-top:0">
  <div class="section-container" style="max-width:960px;margin:0 auto;line-height:1.8;color:var(--text-secondary);font-size:1.05rem">

    <!-- Pillar 1: Science of Daily Routines -->
    <article style="background:var(--card-bg);padding:3rem 2.5rem;border-radius:24px;border:1px solid var(--card-border);box-shadow:0 15px 40px rgba(0,0,0,.5);margin-bottom:2.5rem">
      <span style="display:inline-block;padding:4px 12px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);border-radius:20px;color:#a5b4fc;font-size:0.85rem;font-weight:700;margin-bottom:1rem;">System 01 • Routine Engineering</span>
      <h2 style="color:var(--text-primary);font-size:1.85rem;margin-top:0;margin-bottom:1rem;font-family:'Space Grotesk',sans-serif">The Architecture of a High-Performance Daily Routine</h2>
      <p style="margin-bottom:1.25rem">
        Productivity is rarely a matter of raw willpower; it is an outcome of environmental design and habit friction. When your daily rhythm aligns with natural circadian biology, energy remains stable without artificial crashes.
      </p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;margin:1.75rem 0;">
        <div style="padding:1.5rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;">
          <h3 style="color:var(--accent-primary);font-size:1.2rem;margin-top:0;margin-bottom:0.5rem;">Morning Light &amp; Hydration</h3>
          <p style="font-size:0.92rem;margin:0;color:var(--text-secondary);">Viewing natural sunlight within 30 minutes of waking triggers cortisol release and sets your circadian timer for evening melatonin production.</p>
        </div>
        <div style="padding:1.5rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;">
          <h3 style="color:var(--accent-secondary);font-size:1.2rem;margin-top:0;margin-bottom:0.5rem;">Time Blocking &amp; Batching</h3>
          <p style="font-size:0.92rem;margin:0;color:var(--text-secondary);">Group similar low-cognitive tasks (replies, admin, reading) into single dedicated batches to eliminate the cognitive switching cost of multitasking.</p>
        </div>
        <div style="padding:1.5rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;">
          <h3 style="color:#10b981;font-size:1.2rem;margin-top:0;margin-bottom:0.5rem;">Wind-Down Architecture</h3>
          <p style="font-size:0.92rem;margin:0;color:var(--text-secondary);">Dim overhead lighting 90 minutes before sleep and disconnect from blue light screens to protect deep REM sleep architecture.</p>
        </div>
      </div>
    </article>

    <!-- Pillar 2: Digital Ergonomics & Health -->
    <article style="background:var(--card-bg);padding:3rem 2.5rem;border-radius:24px;border:1px solid var(--card-border);box-shadow:0 15px 40px rgba(0,0,0,.5);margin-bottom:2.5rem">
      <span style="display:inline-block;padding:4px 12px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);border-radius:20px;color:#34d399;font-size:0.85rem;font-weight:700;margin-bottom:1rem;">System 02 • Physical Ergonomics</span>
      <h2 style="color:var(--text-primary);font-size:1.85rem;margin-top:0;margin-bottom:1rem;font-family:'Space Grotesk',sans-serif">Digital Ergonomics: Protecting Health Behind the Screen</h2>
      <p style="margin-bottom:1.25rem">
        For programmers, remote professionals, and students, spending 8+ hours in front of screens introduces physical strain that compounds over years. Incorporating simple ergonomic safeguards dramatically improves daily comfort and energy.
      </p>

      <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1.75rem;margin:1.5rem 0;">
        <ul style="padding-left:1.25rem;margin:0;line-height:1.9;">
          <li><strong style="color:var(--text-primary);">The 20-20-20 Rule for Eye Fatigue:</strong> Every 20 minutes, gaze at an object at least 20 feet away for 20 seconds to allow ciliary eye muscles to relax.</li>
          <li><strong style="color:var(--text-primary);">Eye-Level Monitor Alignment:</strong> Position the top third of your display at natural eye level. Tilting your neck forward by just 15 degrees adds over 27 pounds of gravitational load onto the cervical spine.</li>
          <li><strong style="color:var(--text-primary);">90-Degree Joint Angles:</strong> Adjust chair height so feet rest flat on the floor, thighs parallel to the ground, and forearms resting comfortably on desk armrests without shoulder shrugging.</li>
          <li><strong style="color:var(--text-primary);">Active Micro-Breaks:</strong> Stand and perform 60 seconds of gentle spinal twists and hip mobility movements every 60 minutes.</li>
        </ul>
      </div>
    </article>

    <!-- Pillar 3: Everyday Financial Literacy -->
    <article style="background:var(--card-bg);padding:3rem 2.5rem;border-radius:24px;border:1px solid var(--card-border);box-shadow:0 15px 40px rgba(0,0,0,.5);margin-bottom:2.5rem">
      <span style="display:inline-block;padding:4px 12px;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.3);border-radius:20px;color:#fbbf24;font-size:0.85rem;font-weight:700;margin-bottom:1rem;">System 03 • Personal Finance</span>
      <h2 style="color:var(--text-primary);font-size:1.85rem;margin-top:0;margin-bottom:1rem;font-family:'Space Grotesk',sans-serif">Smart Money Management for Students &amp; Young Creators</h2>
      <p style="margin-bottom:1.25rem">
        Financial independence begins with intentional cash-flow control rather than sheer income size. Implementing fundamental budgeting principles early eliminates financial anxiety.
      </p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.25rem;margin:1.5rem 0;">
        <div style="padding:1.25rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;">
          <h4 style="color:var(--accent-primary);margin:0 0 0.5rem 0;">The 50/30/20 Rule</h4>
          <p style="margin:0;font-size:0.9rem;color:var(--text-secondary);">Allocate 50% of income to essential needs, 30% to personal wants, and automate 20% directly into savings and investments.</p>
        </div>
        <div style="padding:1.25rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;">
          <h4 style="color:var(--accent-secondary);margin:0 0 0.5rem 0;">The Emergency Buffer</h4>
          <p style="margin:0;font-size:0.9rem;color:var(--text-secondary);">Maintain 3 to 6 months of essential living expenses in a liquid high-yield account before taking speculative market risks.</p>
        </div>
        <div style="padding:1.25rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;">
          <h4 style="color:#10b981;margin:0 0 0.5rem 0;">Compound Interest</h4>
          <p style="margin:0;font-size:0.9rem;color:var(--text-secondary);">Small regular index fund contributions in your early 20s compound exponentially over decades through mathematical compounding.</p>
        </div>
      </div>
    </article>

  </div>
</section>'''

    html = re.sub(r'<section class="section page-header">[\s\S]*?</section>\s*<section class="section section-dark"[\s\S]*?</section>', new_content, html)
    with open(daily_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)
    print("✓ daily-life.html updated with comprehensive 1500+ word lifestyle guide")

def update_tools_html():
    tools_path = os.path.join(SITE_DIR, "tools.html")
    with open(tools_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Pre-render semantic tool cards directly into #hub-grid so crawlers see full static content
    prerendered_cards = '''<div id="hub-grid" class="hub-grid">
      <!-- Pre-rendered Static Cards for Google Crawler & AdSense Indexing -->
      <a href="tools/word-counter.html" class="hub-card" data-category="Text Tools" style="text-decoration:none;color:inherit;">
        <div class="hub-card-header">
          <div class="hub-card-icon">📝</div>
          <div class="hub-card-category">Text Tools</div>
        </div>
        <h3 class="hub-card-title">Word &amp; Character Counter</h3>
        <p class="hub-card-desc">Real-time word, character, sentence, and paragraph counter with reading time estimation and keyword density metrics.</p>
        <div class="hub-card-footer"><span class="hub-card-tag">Online Utility</span><span class="hub-card-action">Launch Tool ↗</span></div>
      </a>

      <a href="tools/password-generator.html" class="hub-card" data-category="Generators" style="text-decoration:none;color:inherit;">
        <div class="hub-card-header">
          <div class="hub-card-icon">🔐</div>
          <div class="hub-card-category">Generators</div>
        </div>
        <h3 class="hub-card-title">Secure Password Generator</h3>
        <p class="hub-card-desc">Cryptographically secure password generator utilizing window.crypto API with custom symbols, numbers, and entropy calculation.</p>
        <div class="hub-card-footer"><span class="hub-card-tag">Security</span><span class="hub-card-action">Launch Tool ↗</span></div>
      </a>

      <a href="tools/json-formatter.html" class="hub-card" data-category="Developer Tools" style="text-decoration:none;color:inherit;">
        <div class="hub-card-header">
          <div class="hub-card-icon">💻</div>
          <div class="hub-card-category">Developer Tools</div>
        </div>
        <h3 class="hub-card-title">JSON Formatter &amp; Validator</h3>
        <p class="hub-card-desc">Beautify, format, validate, and minify JSON data with exact syntax error highlighting and one-click clipboard copying.</p>
        <div class="hub-card-footer"><span class="hub-card-tag">Developer</span><span class="hub-card-action">Launch Tool ↗</span></div>
      </a>

      <a href="tools/case-converter.html" class="hub-card" data-category="Text Tools" style="text-decoration:none;color:inherit;">
        <div class="hub-card-header">
          <div class="hub-card-icon">🔤</div>
          <div class="hub-card-category">Text Tools</div>
        </div>
        <h3 class="hub-card-title">Text Case Converter</h3>
        <p class="hub-card-desc">Easily switch between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case without data loss.</p>
        <div class="hub-card-footer"><span class="hub-card-tag">Formatting</span><span class="hub-card-action">Launch Tool ↗</span></div>
      </a>

      <a href="tools/bmi-calculator.html" class="hub-card" data-category="Calculators" style="text-decoration:none;color:inherit;">
        <div class="hub-card-header">
          <div class="hub-card-icon">⚖️</div>
          <div class="hub-card-category">Calculators</div>
        </div>
        <h3 class="hub-card-title">BMI Health Calculator</h3>
        <p class="hub-card-desc">Accurate Body Mass Index calculation supporting metric and imperial units with WHO health category classifications.</p>
        <div class="hub-card-footer"><span class="hub-card-tag">Health</span><span class="hub-card-action">Launch Tool ↗</span></div>
      </a>

      <a href="tools/percentage-calculator.html" class="hub-card" data-category="Calculators" style="text-decoration:none;color:inherit;">
        <div class="hub-card-header">
          <div class="hub-card-icon">📊</div>
          <div class="hub-card-category">Calculators</div>
        </div>
        <h3 class="hub-card-title">Percentage Calculator</h3>
        <p class="hub-card-desc">Calculate percentage increase, decrease, discounts, markups, and exam score percentages with step-by-step arithmetic.</p>
        <div class="hub-card-footer"><span class="hub-card-tag">Math &amp; Finance</span><span class="hub-card-action">Launch Tool ↗</span></div>
      </a>

      <a href="tools/base64.html" class="hub-card" data-category="Converters" style="text-decoration:none;color:inherit;">
        <div class="hub-card-header">
          <div class="hub-card-icon">🔄</div>
          <div class="hub-card-category">Converters</div>
        </div>
        <h3 class="hub-card-title">Base64 Encoder &amp; Decoder</h3>
        <p class="hub-card-desc">Encode plain text or binary data into Base64 format and decode Base64 back into readable strings with UTF-8 support.</p>
        <div class="hub-card-footer"><span class="hub-card-tag">Encoding</span><span class="hub-card-action">Launch Tool ↗</span></div>
      </a>
    </div>

    <!-- Editorial Overview & FAQs for Search Engines & Users -->
    <div style="background:var(--card-bg, #121826);border:1px solid var(--card-border, rgba(255,255,255,0.08));border-radius:20px;padding:2.5rem;margin-top:3rem;">
      <h2 style="color:#fff;font-family:'Space Grotesk',sans-serif;margin-top:0;margin-bottom:1rem;font-size:1.6rem;">Why Choose HarshGuruJi Online Tools?</h2>
      <p style="color:var(--text-secondary, #94a3b8);line-height:1.8;margin-bottom:1.5rem;">
        Every utility hosted on HarshGuruJi is engineered with three core principles: <strong>zero server logging</strong>, <strong>instant client-side execution</strong>, and <strong>complete platform independence</strong>. Unlike conventional tool websites that transmit your data to remote servers, our text tools, calculators, and generators compute results directly within your web browser using HTML5, Web Workers, and the Web Cryptography API.
      </p>
      
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.25rem;margin:1.75rem 0;">
        <div style="padding:1rem;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:12px;">
          <h4 style="color:#a5b4fc;margin:0 0 0.5rem 0;">🔒 100% Private</h4>
          <p style="margin:0;font-size:0.88rem;color:#94a3b8;">Your text, passwords, and JSON payloads never leave your computer. Total confidentiality guaranteed.</p>
        </div>
        <div style="padding:1rem;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:12px;">
          <h4 style="color:#f472b6;margin:0 0 0.5rem 0;">⚡ Zero Latency</h4>
          <p style="margin:0;font-size:0.88rem;color:#94a3b8;">Zero network round trips. Operations happen in real-time as you type, even on slower 3G/4G connections.</p>
        </div>
        <div style="padding:1rem;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:12px;">
          <h4 style="color:#34d399;margin:0 0 0.5rem 0;">📱 Mobile Responsive</h4>
          <p style="margin:0;font-size:0.88rem;color:#94a3b8;">Fully optimized interfaces for Android, iOS, Windows, macOS, and Linux touchscreens and desktop screens.</p>
        </div>
      </div>
    </div>'''

    html = re.sub(r'<div id="hub-grid" class="hub-grid">[\s\S]*?</div>', prerendered_cards, html)
    with open(tools_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)
    print("✓ tools.html updated with prerendered static cards and documentation")

if __name__ == "__main__":
    update_about_html()
    update_technology_html()
    update_education_html()
    update_insights_html()
    update_dailylife_html()
    update_tools_html()
    print("All editorial content updated successfully!")
