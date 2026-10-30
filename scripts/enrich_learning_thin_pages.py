import os

SITE_DIR = r"c:\Users\harsh\OneDrive\Desktop\HarshGuruJi\site"

def enrich_gk_quiz():
    path = os.path.join(SITE_DIR, "learning", "gk-quiz.html")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    guide_html = """
    <!-- Comprehensive GK Study Guide & Curriculum Review (AdSense & Quality Standards) -->
    <section class="gk-editorial-guide" style="margin-top: 3.5rem; padding: 2.5rem 2rem; background: rgba(17, 24, 39, 0.85); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; color: #cbd5e1; line-height: 1.85;">
      
      <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 1.25rem; margin-bottom: 1.75rem;">
        <span style="display:inline-block; padding: 4px 14px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 20px; color: #fbbf24; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">
          General Studies &amp; Exam Strategy
        </span>
        <h2 style="color: #fff; font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.6rem, 3.2vw, 2.2rem); margin: 0.75rem 0 0.5rem 0;">
          General Knowledge Mastery: Essential Topics for Competitive Examinations
        </h2>
        <p style="color: #94a3b8; margin: 0; font-size: 1rem;">
          How strategic active recall and syllabus categorization power performance in UPSC, SSC, Banking, and State PSC exams.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
        <div>
          <h3 style="color: #fff; font-size: 1.25rem; margin-top: 0; margin-bottom: 0.85rem; font-family: 'Space Grotesk', sans-serif;">1. Indian Constitution &amp; Polity Fundamentals</h3>
          <p>
            Understanding the constitutional framework of India is indispensable for any competitive test. Key topics tested across examinations include:
          </p>
          <ul style="padding-left: 1.25rem; margin-bottom: 0; list-style-type: disc;">
            <li><strong>Preamble &amp; Key Amendments:</strong> The 42nd Constitutional Amendment Act of 1976 added the terms <em>Secular</em>, <em>Socialist</em>, and <em>Integrity</em>.</li>
            <li><strong>Fundamental Rights (Part III):</strong> Articles 12 to 35, notably Article 21 (Right to Life and Personal Liberty) and Article 32 (Constitutional Remedies).</li>
            <li><strong>Directive Principles (Part IV):</strong> Non-justiciable socioeconomic ideals guiding state governance.</li>
          </ul>
        </div>

        <div>
          <h3 style="color: #fff; font-size: 1.25rem; margin-top: 0; margin-bottom: 0.85rem; font-family: 'Space Grotesk', sans-serif;">2. Physical &amp; Environmental Geography</h3>
          <p>
            Geography questions frequently examine physical landforms, climate phenomena, and biodiversity conventions:
          </p>
          <ul style="padding-left: 1.25rem; margin-bottom: 0; list-style-type: disc;">
            <li><strong>Atmospheric Layers:</strong> The Troposphere (where weather occurs) and Stratosphere (containing the protective Ozone layer).</li>
            <li><strong>River Drainage Systems:</strong> Himalayan perennial rivers (Ganga, Brahmaputra, Indus) versus Peninsular rivers (Godavari, Krishna, Narmada).</li>
            <li><strong>Monsoon Dynamics:</strong> Southwest summer monsoon moisture flow driven by Tibetan plateau thermal differentials.</li>
          </ul>
        </div>
      </div>

      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 16px; padding: 1.75rem; margin-bottom: 2rem;">
        <h3 style="color: #fff; font-size: 1.25rem; margin-top: 0; margin-bottom: 1rem; font-family: 'Space Grotesk', sans-serif;">The 4-Step Spaced Repetition Technique for GK</h3>
        <p style="margin-bottom: 1rem;">
          Memorizing thousands of historical facts and chemical elements requires scientific spaced repetition rather than passive reading:
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
          <div style="background: rgba(0,0,0,0.25); padding: 1rem; border-radius: 10px; border-left: 3px solid #3b82f6;">
            <strong style="color: #60a5fa; display: block; margin-bottom: 0.25rem;">Day 1: First Exposure</strong>
            <span style="font-size: 0.88rem;">Solve the quiz questions and read the explanatory notes carefully.</span>
          </div>
          <div style="background: rgba(0,0,0,0.25); padding: 1rem; border-radius: 10px; border-left: 3px solid #10b981;">
            <strong style="color: #34d399; display: block; margin-bottom: 0.25rem;">Day 3: Active Recall</strong>
            <span style="font-size: 0.88rem;">Retake the quiz without checking answers to test memory retention.</span>
          </div>
          <div style="background: rgba(0,0,0,0.25); padding: 1rem; border-radius: 10px; border-left: 3px solid #f59e0b;">
            <strong style="color: #fbbf24; display: block; margin-bottom: 0.25rem;">Day 7: Cross-Subject Synthesis</strong>
            <span style="font-size: 0.88rem;">Connect historical events with geographic maps and constitutional dates.</span>
          </div>
          <div style="background: rgba(0,0,0,0.25); padding: 1rem; border-radius: 10px; border-left: 3px solid #ec4899;">
            <strong style="color: #f472b6; display: block; margin-bottom: 0.25rem;">Day 30: Benchmark Test</strong>
            <span style="font-size: 0.88rem;">Simulate real exam pressure on our full-length Quiz India game.</span>
          </div>
        </div>
      </div>

      <div>
        <h3 style="color: #fff; font-size: 1.25rem; margin-bottom: 1rem; font-family: 'Space Grotesk', sans-serif;">Frequently Asked Questions</h3>
        <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
          <h4 style="color: #fff; font-size: 1rem; margin: 0 0 0.35rem 0;">Are these questions aligned with real government competitive exam patterns?</h4>
          <p style="margin: 0; font-size: 0.92rem;">Yes. Every question is curated from standard UPSC, SSC CGL, Railways RRB, and State Public Service Commission previous year question papers.</p>
        </div>
        <div>
          <h4 style="color: #fff; font-size: 1rem; margin: 0 0 0.35rem 0;">Where can I access more subject-specific educational tests?</h4>
          <p style="margin: 0; font-size: 0.92rem;">Visit our <a href="learning-hub.html" style="color: #38bdf8;">Learning Hub</a> for chapter-by-chapter Science and Mathematics syllabus materials, or test your speed on <a href="../Quiz India/index.html" style="color: #38bdf8;">Quiz India</a>.</p>
        </div>
      </div>

    </section>
    """

    if "gk-editorial-guide" not in content:
        content = content.replace("</main>", guide_html + "\n  </main>")
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print("[OK] learning/gk-quiz.html editorial guide added!")
    else:
        print("[INFO] learning/gk-quiz.html already has editorial guide.")

def enrich_pdf_library():
    path = os.path.join(SITE_DIR, "learning", "pdf-library.html")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    guide_html = """
    <!-- Comprehensive PDF Study Library Guide & Textbook Index -->
    <section class="pdf-editorial-guide" style="margin-top: 3.5rem; padding: 2.5rem 2rem; background: rgba(17, 24, 39, 0.85); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; color: #cbd5e1; line-height: 1.85;">
      
      <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 1.25rem; margin-bottom: 1.75rem;">
        <span style="display:inline-block; padding: 4px 14px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 20px; color: #34d399; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">
          Academic Open Access Repository
        </span>
        <h2 style="color: #fff; font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.6rem, 3.2vw, 2.2rem); margin: 0.75rem 0 0.5rem 0;">
          NCERT Digital PDF Library: Classes 1 to 12 Rationalized Curriculum Guide
        </h2>
        <p style="color: #94a3b8; margin: 0; font-size: 1rem;">
          How digital textbooks and streamlined academic syllabi support inclusive, equitable quality education across India.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
        <div>
          <h3 style="color: #fff; font-size: 1.25rem; margin-top: 0; margin-bottom: 0.85rem; font-family: 'Space Grotesk', sans-serif;">Rationalized Curriculum &amp; National Education Policy</h3>
          <p>
            Under the National Education Policy (NEP 2020), NCERT undertook a comprehensive syllabus rationalization initiative to alleviate content overload and foster experiential learning. The rationalized textbooks prioritize core concepts, high-order thinking skills, and practical problem-solving.
          </p>
          <p>
            HarshGuruJi's PDF library indexes these official rationalized publications, ensuring that students, educators, and competitive exam aspirants study exclusively from authorized, updated educational materials.
          </p>
        </div>

        <div>
          <h3 style="color: #fff; font-size: 1.25rem; margin-top: 0; margin-bottom: 0.85rem; font-family: 'Space Grotesk', sans-serif;">Subject Coverage &amp; Educational Utility</h3>
          <ul style="padding-left: 1.25rem; margin-bottom: 0; list-style-type: disc;">
            <li><strong>Science (Physics, Chemistry, Biology):</strong> Detailed reaction mechanisms, optical ray diagrams, genetics, and thermodynamic laws.</li>
            <li><strong>Mathematics:</strong> Structured theorems, calculus derivations, coordinate geometry, and algebraic proofs.</li>
            <li><strong>Social Sciences (History, Civics, Geography, Economics):</strong> Chronological timelines, cartographic mapping, and constitutional governance.</li>
            <li><strong>Languages (English, Hindi, Sanskrit):</strong> Literature anthologies, grammar rules, and prose analysis.</li>
          </ul>
        </div>
      </div>

      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 16px; padding: 1.75rem;">
        <h3 style="color: #fff; font-size: 1.25rem; margin-top: 0; margin-bottom: 1rem; font-family: 'Space Grotesk', sans-serif;">Frequently Asked Questions</h3>
        <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
          <h4 style="color: #fff; font-size: 1rem; margin: 0 0 0.35rem 0;">Can I view and download these PDFs on mobile phones?</h4>
          <p style="margin: 0; font-size: 0.92rem;">Yes. Our digital library supports both inline browser streaming and direct PDF file downloads for seamless offline reading on any smartphone or tablet.</p>
        </div>
        <div>
          <h4 style="color: #fff; font-size: 1rem; margin: 0 0 0.35rem 0;">Are there any subscription or access charges?</h4>
          <p style="margin: 0; font-size: 0.92rem;">None. HarshGuruJi is dedicated to free educational access. All textbook downloads and chapter viewers are 100% free of charge.</p>
        </div>
      </div>

    </section>
    """

    if "pdf-editorial-guide" not in content:
        content = content.replace("</main>", guide_html + "\n  </main>")
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print("[OK] learning/pdf-library.html editorial guide added!")
    else:
        print("[INFO] learning/pdf-library.html already has editorial guide.")

if __name__ == "__main__":
    enrich_gk_quiz()
    enrich_pdf_library()
    print("Phase 3 enrichment completed!")
