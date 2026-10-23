import os

SITE_DIR = r"c:\Users\harsh\OneDrive\Desktop\HarshGuruJi\site"

CLASS_10_SCIENCE_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="google-adsense-account" content="ca-pub-7706204118195419">

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HarshGuruJi Class 10 Science NCERT Notes, Formulas & Chapter Revision Guide</title>
  <meta name="description" content="Master CBSE Class 10 Science with HarshGuruJi: complete chapter-wise NCERT revision notes, balanced chemical equations, physics formulas, and biology concept guides.">
  <meta name="keywords" content="harshguruji class 10 science, ncert class 10 science notes, cbse class 10 science syllabus, chemical reactions formulas, class 10 physics formulas, harshguruji learning">
  <meta name="author" content="HarshGuruJi">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="https://webguruji.online/learning/class-10-science.html">
  <link rel="icon" type="image/png" href="../logo.png">
  <link rel="apple-touch-icon" href="../logo-192.png">

  <!-- Open Graph -->
  <meta property="og:site_name" content="HarshGuruJi">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://webguruji.online/learning/class-10-science.html">
  <meta property="og:title" content="HarshGuruJi Class 10 Science NCERT Notes, Formulas & Chapter Revision Guide">
  <meta property="og:description" content="Complete NCERT Class 10 Science revision notes, balanced equations, key formulas, and exam preparation material.">
  <meta property="og:image" content="https://webguruji.online/logo-512.png">
  <meta property="og:locale" content="en_US">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@harshguruji1">
  <meta name="twitter:title" content="HarshGuruJi Class 10 Science NCERT Notes & Chapter Guide">
  <meta name="twitter:description" content="Complete NCERT Class 10 Science revision notes, balanced equations, key formulas, and exam preparation material.">
  <meta name="twitter:image" content="https://webguruji.online/logo-512.png">

  <!-- Structured Data: BreadcrumbList -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://webguruji.online/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Learning Hub",
        "item": "https://webguruji.online/learning-hub.html"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Class 10 Science",
        "item": "https://webguruji.online/learning/class-10-science.html"
      }
    ]
  }
  </script>

  <!-- Structured Data: FAQPage -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are the core units in CBSE Class 10 Science?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The CBSE Class 10 Science curriculum is divided into five core units: Chemical Substances - Nature and Behaviour (Chemistry), World of Living (Biology), Natural Phenomena (Physics), Effects of Current (Physics), and Natural Resources."
        }
      },
      {
        "@type": "Question",
        "name": "How to score high marks in CBSE Class 10 Science board examinations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To achieve high marks: practice balancing chemical equations regularly, memorize ray diagrams with proper arrows in optics, master circuit diagrams and numericals with correct SI units in Electricity, practice neat labelled biology diagrams, and solve previous 5-year question papers."
        }
      },
      {
        "@type": "Question",
        "name": "Are NCERT textbooks sufficient for Class 10 Science board exams?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, NCERT textbooks form the primary syllabus blueprint for CBSE exams. Over 90% of board questions are directly derived from in-text exercises, chapter-end questions, and NCERT Exemplar problems."
        }
      }
    ]
  }
  </script>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="../style.css">
  <link rel="stylesheet" href="../cookie.css">
  <link rel="stylesheet" href="../navbar-premium.css">
  <link rel="stylesheet" href="../footer-premium.css">
  <link rel="stylesheet" href="../responsive-patch.css">

  <!-- Google AdSense -->
  <script src="../js/ad-shield.js"></script>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7706204118195419" crossorigin="anonymous"></script>

  <style>
    body.science-page {
      background: #090d16;
      color: #f1f5f9;
      font-family: 'Inter', sans-serif;
      line-height: 1.75;
    }

    .science-container {
      max-width: 1100px;
      margin: 3rem auto 5rem;
      padding: 0 1.5rem;
    }

    .science-hero {
      text-align: center;
      margin-bottom: 3.5rem;
    }

    .science-badge {
      display: inline-block;
      padding: 6px 16px;
      background: rgba(14, 165, 233, 0.15);
      border: 1px solid rgba(14, 165, 233, 0.35);
      border-radius: 20px;
      color: #38bdf8;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 1rem;
    }

    .science-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(2rem, 4.5vw, 3.2rem);
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #ffffff 40%, #7dd3fc 70%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .science-desc {
      color: #94a3b8;
      font-size: 1.1rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .chapter-card {
      background: rgba(17, 24, 39, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 2rem;
      margin-bottom: 2rem;
      transition: all 0.3s;
    }

    .chapter-card:hover {
      border-color: rgba(56, 189, 248, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }

    .chapter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .chapter-num {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.4rem;
      font-weight: 700;
      color: #fff;
    }

    .chapter-tag {
      font-size: 0.78rem;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 12px;
      text-transform: uppercase;
    }

    .tag-chem { background: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.3); }
    .tag-bio { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .tag-phy { background: rgba(14, 165, 233, 0.15); color: #38bdf8; border: 1px solid rgba(14, 165, 233, 0.3); }

    .formula-box {
      background: rgba(0, 0, 0, 0.4);
      border-left: 4px solid #38bdf8;
      padding: 1rem 1.25rem;
      border-radius: 0 10px 10px 0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9rem;
      color: #e2e8f0;
      margin: 1rem 0;
    }

    .read-notes-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 0.55rem 1.25rem;
      background: #0284c7;
      color: #fff;
      font-weight: 600;
      font-size: 0.9rem;
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.2s;
    }

    .read-notes-btn:hover {
      background: #0369a1;
    }
  </style>
</head>

<body class="science-page dark-mode">

  <main class="science-container">
    
    <!-- Hero -->
    <header class="science-hero">
      <div class="science-badge">🔬 NCERT Syllabus Guide</div>
      <h1 class="science-title">CBSE Class 10 Science Master Guide</h1>
      <p class="science-desc">
        Comprehensive chapter-by-chapter revision notes, essential chemical reactions, physics formulas, and high-yield concepts curated for CBSE board exam success.
      </p>
    </header>

    <!-- Chapter 1: Chemical Reactions and Equations -->
    <article class="chapter-card">
      <div class="chapter-header">
        <h2 class="chapter-num">Chapter 1: Chemical Reactions and Equations</h2>
        <span class="chapter-tag tag-chem">Chemistry</span>
      </div>
      <p>
        A chemical reaction is a process where one or more substances (reactants) undergo transformation to produce new substances with different physical and chemical properties (products). Evidence of reactions includes change in state, color, evolution of gas, or temperature variation.
      </p>
      
      <div class="formula-box">
        <strong>Key Reaction Types:</strong><br>
        1. Combination: CaO(s) + H₂O(l) → Ca(OH)₂(aq) + Heat (Slaking of lime)<br>
        2. Decomposition: 2FeSO₄(s) --Δ--> Fe₂O₃(s) + SO₂(g) + SO₃(g)<br>
        3. Displacement: Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s)<br>
        4. Double Displacement: Na₂SO₄(aq) + BaCl₂(aq) → BaSO₄(s)↓ + 2NaCl(aq)<br>
        5. Redox: CuO + H₂ --Δ--> Cu + H₂O (CuO is reduced, H₂ is oxidized)
      </div>

      <a href="class-10/science/ncert/01-chemical-reactions-and-equations.html" class="read-notes-btn">
        <span>Read Full Chapter Study Notes</span> ➔
      </a>
    </article>

    <!-- Chapter 2: Acids, Bases and Salts -->
    <article class="chapter-card">
      <div class="chapter-header">
        <h2 class="chapter-num">Chapter 2: Acids, Bases and Salts</h2>
        <span class="chapter-tag tag-chem">Chemistry</span>
      </div>
      <p>
        Acids produce H⁺ (or H₃O⁺) ions in aqueous solution and turn blue litmus red. Bases produce OH⁻ ions and turn red litmus blue. The pH scale measures hydrogen ion concentration from 0 (highly acidic) to 14 (highly basic), with 7 being neutral.
      </p>

      <div class="formula-box">
        <strong>Key Chemical Compounds:</strong><br>
        • Bleaching Powder: Ca(OH)₂ + Cl₂ → CaOCl₂ + H₂O<br>
        • Baking Soda: NaCl + H₂O + CO₂ + NH₃ → NH₄Cl + NaHCO₃<br>
        • Washing Soda: Na₂CO₃ + 10H₂O → Na₂CO₃·10H₂O<br>
        • Plaster of Paris: CaSO₄·½H₂O + 1½H₂O → CaSO₄·2H₂O (Gypsum)
      </div>
    </article>

    <!-- Chapter 3: Metals and Non-Metals -->
    <article class="chapter-card">
      <div class="chapter-header">
        <h2 class="chapter-num">Chapter 3: Metals and Non-Metals</h2>
        <span class="chapter-tag tag-chem">Chemistry</span>
      </div>
      <p>
        Metals are electropositive elements with high ductility, malleability, and electrical conductivity. The reactivity series arranges metals in descending order of reactivity: K > Na > Ca > Mg > Al > Zn > Fe > Pb > [H] > Cu > Hg > Ag > Au. Extraction methods vary according to position: electrolytic reduction for high reactivity, roasting and calcination for moderate reactivity.
      </p>
    </article>

    <!-- Chapter 6: Life Processes -->
    <article class="chapter-card">
      <div class="chapter-header">
        <h2 class="chapter-num">Chapter 5/6: Life Processes</h2>
        <span class="chapter-tag tag-bio">Biology</span>
      </div>
      <p>
        The essential physiological mechanisms maintaining living organisms: nutrition (autotrophic photosynthesis vs heterotrophic), respiration (aerobic yielding 38 ATP vs anaerobic yielding lactic acid or ethanol), internal circulation/transportation via human heart and xylem/phloem, and excretion via nephrons in kidneys.
      </p>
      
      <div class="formula-box">
        <strong>Photosynthesis Equation:</strong><br>
        6CO₂ + 12H₂O --[Chlorophyll &amp; Sunlight]--> C₆H₁₂O₆ + 6O₂ + 6H₂O
      </div>
    </article>

    <!-- Chapter 9/10: Light - Reflection and Refraction -->
    <article class="chapter-card">
      <div class="chapter-header">
        <h2 class="chapter-num">Chapter 9/10: Light – Reflection and Refraction</h2>
        <span class="chapter-tag tag-phy">Physics</span>
      </div>
      <p>
        Mastering geometric optics: laws of reflection, spherical mirror formulas, Snell's law of refraction, refractive index, lens formulas, and optical power.
      </p>

      <div class="formula-box">
        <strong>Core Physics Formulas:</strong><br>
        • Mirror Formula: 1/f = 1/v + 1/u &nbsp;|&nbsp; Magnification m = -v/u = h'/h<br>
        • Lens Formula: 1/f = 1/v - 1/u &nbsp;&nbsp;|&nbsp; Magnification m = +v/u = h'/h<br>
        • Snell's Law: n = sin(i) / sin(r) = c / v<br>
        • Power of Lens: P = 1 / f(in meters) [Expressed in Dioptres, D]
      </div>
    </article>

    <!-- Chapter 11/12: Electricity -->
    <article class="chapter-card">
      <div class="chapter-header">
        <h2 class="chapter-num">Chapter 11/12: Electricity</h2>
        <span class="chapter-tag tag-phy">Physics</span>
      </div>
      <p>
        Electric charge, potential difference, electric current, and resistance. Ohm's Law states that electric current through a conductor between two points is directly proportional to voltage across the points, provided temperature remains constant.
      </p>

      <div class="formula-box">
        <strong>Electrical Equations:</strong><br>
        • Current: I = Q / t<br>
        • Ohm's Law: V = I × R<br>
        • Resistance: R = ρ(L / A)<br>
        • Resistors in Series: R_eq = R₁ + R₂ + R₃<br>
        • Resistors in Parallel: 1/R_eq = 1/R₁ + 1/R₂ + 1/R₃<br>
        • Joule's Heating: H = I²Rt = VIt = (V²/R)t<br>
        • Electrical Power: P = VI = I²R = V²/R
      </div>
    </article>

    <!-- Quick Navigation -->
    <div style="text-align: center; margin-top: 3rem;">
      <a href="../books.html" class="read-notes-btn" style="padding: 0.8rem 2rem; font-size: 1rem;">
        <span>📚 Download Full NCERT Class 10 Science PDF</span>
      </a>
      <a href="../learning-hub.html" class="read-notes-btn" style="padding: 0.8rem 2rem; font-size: 1rem; background: rgba(255,255,255,0.08); margin-left: 1rem;">
        <span>Explore All Classes</span>
      </a>
    </div>

  </main>

  <script src="../script.js" defer></script>
  <script src="../cookie.js" defer></script>
  <script src="../navbar-premium.js"></script>
  <script src="../footer-premium.js"></script>
</body>
</html>
"""

with open(os.path.join(SITE_DIR, "learning", "class-10-science.html"), "w", encoding="utf-8", newline="\n") as f:
    f.write(CLASS_10_SCIENCE_HTML)
print("[OK] learning/class-10-science.html updated without meta-refresh.")

GK_QUIZ_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="google-adsense-account" content="ca-pub-7706204118195419">

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HarshGuruJi General Knowledge Quiz - Interactive Trivia & Exam Test</title>
  <meta name="description" content="Test your knowledge with HarshGuruJi GK Quiz: interactive questions across Indian history, geography, science, polity, and world current affairs with instant scoring.">
  <meta name="keywords" content="harshguruji gk quiz, general knowledge test, online gk quiz, competitive exam trivia, indian history quiz, harshguruji learning">
  <meta name="author" content="HarshGuruJi">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="https://webguruji.online/learning/gk-quiz.html">
  <link rel="icon" type="image/png" href="../logo.png">
  <link rel="apple-touch-icon" href="../logo-192.png">

  <!-- Open Graph -->
  <meta property="og:site_name" content="HarshGuruJi">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://webguruji.online/learning/gk-quiz.html">
  <meta property="og:title" content="HarshGuruJi General Knowledge Quiz - Interactive Trivia & Exam Test">
  <meta property="og:description" content="Test your knowledge with HarshGuruJi GK Quiz: interactive questions with instant scoring.">
  <meta property="og:image" content="https://webguruji.online/logo-512.png">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700;800&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="../style.css">
  <link rel="stylesheet" href="../cookie.css">
  <link rel="stylesheet" href="../navbar-premium.css">
  <link rel="stylesheet" href="../footer-premium.css">
  <link rel="stylesheet" href="../responsive-patch.css">

  <!-- Google AdSense -->
  <script src="../js/ad-shield.js"></script>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7706204118195419" crossorigin="anonymous"></script>

  <style>
    body.quiz-page {
      background: #090d16;
      color: #f1f5f9;
      font-family: 'Inter', sans-serif;
      line-height: 1.7;
    }

    .quiz-container {
      max-width: 860px;
      margin: 3rem auto 5rem;
      padding: 0 1.5rem;
    }

    .quiz-card {
      background: rgba(17, 24, 39, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 2.5rem;
      box-shadow: 0 15px 40px rgba(0,0,0,0.5);
    }

    .quiz-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .quiz-badge {
      display: inline-block;
      padding: 5px 15px;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.35);
      border-radius: 20px;
      color: #fbbf24;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 1rem;
    }

    .quiz-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(1.8rem, 4vw, 2.6rem);
      font-weight: 800;
      color: #fff;
      margin-top: 0;
      margin-bottom: 0.5rem;
    }

    .quiz-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      margin-bottom: 1.5rem;
      font-size: 0.95rem;
      color: #94a3b8;
    }

    .question-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 1.5rem;
    }

    .options-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 2rem;
    }

    .option-btn {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #e2e8f0;
      padding: 1rem 1.25rem;
      border-radius: 12px;
      text-align: left;
      font-family: inherit;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .option-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: #38bdf8;
    }

    .option-btn.correct {
      background: rgba(16, 185, 129, 0.2) !important;
      border-color: #10b981 !important;
      color: #34d399 !important;
      font-weight: 700;
    }

    .option-btn.wrong {
      background: rgba(239, 68, 68, 0.2) !important;
      border-color: #ef4444 !important;
      color: #fca5a5 !important;
    }

    .quiz-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .next-btn {
      background: #3b82f6;
      color: #fff;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 10px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .next-btn:hover {
      background: #2563eb;
    }

    .score-banner {
      display: none;
      text-align: center;
      padding: 2rem;
    }

    .score-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(59, 130, 246, 0.15);
      border: 3px solid #3b82f6;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      font-size: 2rem;
      font-weight: 800;
      color: #fff;
    }
  </style>
</head>

<body class="quiz-page dark-mode">

  <main class="quiz-container">
    
    <div class="quiz-card">
      <header class="quiz-header">
        <div class="quiz-badge">🧠 Interactive Trivia</div>
        <h1 class="quiz-title">HarshGuruJi General Knowledge Quiz</h1>
        <p style="color:#94a3b8; margin:0;">Test your mastery across Indian History, Geography, Indian Constitution, and Science.</p>
      </header>

      <div id="quiz-active-view">
        <div class="quiz-meta">
          <span>Question <strong id="q-current" style="color:#fff;">1</strong> of <strong id="q-total" style="color:#fff;">10</strong></span>
          <span>Score: <strong id="q-score" style="color:#10b981;">0</strong></span>
        </div>

        <h2 class="question-title" id="q-text">Loading question...</h2>

        <div class="options-grid" id="q-options">
          <!-- Populated by JS -->
        </div>

        <div class="quiz-footer">
          <span id="q-feedback" style="font-weight:600; font-size:0.95rem;"></span>
          <button class="next-btn" id="btn-next" onclick="nextQuestion()" style="display:none;">Next Question ➔</button>
        </div>
      </div>

      <!-- Result Screen -->
      <div id="quiz-result-view" class="score-banner">
        <div class="score-circle">
          <span id="final-score">0</span>
          <span style="font-size:0.8rem; font-weight:500; color:#94a3b8;">/ 10</span>
        </div>
        <h2 style="color:#fff; font-size:1.8rem; margin-bottom:0.5rem;" id="result-message">Quiz Completed!</h2>
        <p style="color:#94a3b8; max-width:500px; margin:0 auto 2rem;" id="result-detail">Great effort! Review the detailed explanations and continue testing your knowledge on Quiz India.</p>
        
        <div style="display:flex; gap:1rem; justify-content:center; flex-wrap:wrap;">
          <button class="next-btn" onclick="restartQuiz()">Restart Quiz</button>
          <a href="../Quiz India/index.html" class="next-btn" style="text-decoration:none; background:#10b981;">Play Quiz India Game 🏆</a>
          <a href="../learning-hub.html" class="next-btn" style="text-decoration:none; background:rgba(255,255,255,0.08);">Learning Hub</a>
        </div>
      </div>

    </div>

  </main>

  <script>
    const QUESTIONS = [
      {
        q: "Who is known as the 'Father of the Indian Constitution'?",
        options: ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Vallabhbhai Patel"],
        answer: 1,
        exp: "Dr. B.R. Ambedkar was the Chairman of the Drafting Committee of the Constituent Assembly."
      },
      {
        q: "Which gas is primarily responsible for the greenhouse effect on Earth?",
        options: ["Nitrogen", "Oxygen", "Carbon Dioxide", "Argon"],
        answer: 2,
        exp: "Carbon dioxide (CO₂) traps infrared radiation in the troposphere, driving the greenhouse effect."
      },
      {
        q: "What is the capital city of Australia?",
        options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
        answer: 2,
        exp: "Canberra was chosen as a compromise location between Sydney and Melbourne in 1908."
      },
      {
        q: "Which article of the Indian Constitution guarantees the 'Right to Equality'?",
        options: ["Article 14-18", "Article 19-22", "Article 23-24", "Article 25-28"],
        answer: 0,
        exp: "Articles 14 to 18 of the Indian Constitution guarantee equality before law and prohibition of discrimination."
      },
      {
        q: "What is the SI unit of electric potential difference (Voltage)?",
        options: ["Ampere", "Volt", "Ohm", "Watt"],
        answer: 1,
        exp: "Volt (V) is the SI unit of electric potential difference, named in honor of Alessandro Volta."
      },
      {
        q: "In which year did India launch its historic Mars Orbiter Mission (Mangalyaan)?",
        options: ["2011", "2013", "2015", "2017"],
        answer: 1,
        exp: "ISRO launched Mangalyaan on November 5, 2013, successfully entering Martian orbit in September 2014."
      },
      {
        q: "Which is the highest peak in the Western Ghats of India?",
        options: ["Doda Betta", "Anamudi", "Kalsubai", "Guru Shikhar"],
        answer: 1,
        exp: "Anamudi (2,695 m) in Kerala is the highest peak in the Western Ghats and South India."
      },
      {
        q: "Which enzyme present in human saliva breaks down complex starches into sugars?",
        options: ["Pepsin", "Salivary Amylase (Ptyalin)", "Trypsin", "Lipase"],
        answer: 1,
        exp: "Salivary amylase breaks down dietary starches into maltose and simpler dextrins."
      },
      {
        q: "Which planet in our solar system has the highest density?",
        options: ["Jupiter", "Saturn", "Earth", "Mercury"],
        answer: 2,
        exp: "Earth is the densest planet in the Solar System, with an average density of ~5.51 g/cm³."
      },
      {
        q: "Who was the founder of the Maurya Empire in ancient India?",
        options: ["Ashoka the Great", "Chandragupta Maurya", "Bindusara", "Samudragupta"],
        answer: 1,
        exp: "Chandragupta Maurya established the Maurya Empire in 322 BCE with guidance from Chanakya (Kautilya)."
      }
    ];

    let currentIndex = 0;
    let score = 0;
    let answered = false;

    function renderQuestion() {
      answered = false;
      const q = QUESTIONS[currentIndex];
      document.getElementById('q-current').textContent = currentIndex + 1;
      document.getElementById('q-total').textContent = QUESTIONS.length;
      document.getElementById('q-score').textContent = score;
      document.getElementById('q-text').textContent = q.q;
      document.getElementById('q-feedback').textContent = '';
      document.getElementById('btn-next').style.display = 'none';

      const optionsBox = document.getElementById('q-options');
      optionsBox.innerHTML = '';

      q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = `${String.fromCharCode(65 + idx)}. ${opt}`;
        btn.onclick = () => selectOption(idx);
        optionsBox.appendChild(btn);
      });
    }

    function selectOption(idx) {
      if (answered) return;
      answered = true;
      const q = QUESTIONS[currentIndex];
      const buttons = document.querySelectorAll('.option-btn');

      if (idx === q.answer) {
        buttons[idx].classList.add('correct');
        score++;
        document.getElementById('q-score').textContent = score;
        document.getElementById('q-feedback').innerHTML = `<span style="color:#34d399;">✓ Correct!</span> ${q.exp}`;
      } else {
        buttons[idx].classList.add('wrong');
        buttons[q.answer].classList.add('correct');
        document.getElementById('q-feedback').innerHTML = `<span style="color:#fca5a5;">✗ Incorrect.</span> ${q.exp}`;
      }

      document.getElementById('btn-next').style.display = 'inline-block';
    }

    function nextQuestion() {
      currentIndex++;
      if (currentIndex < QUESTIONS.length) {
        renderQuestion();
      } else {
        showResults();
      }
    }

    function showResults() {
      document.getElementById('quiz-active-view').style.display = 'none';
      document.getElementById('quiz-result-view').style.display = 'block';
      document.getElementById('final-score').textContent = score;

      const msg = document.getElementById('result-message');
      const det = document.getElementById('result-detail');

      if (score >= 9) {
        msg.textContent = "Outstanding Performance! 🏆";
        det.textContent = "You demonstrated mastery across history, science, and constitution topics!";
      } else if (score >= 6) {
        msg.textContent = "Well Done! 🌟";
        det.textContent = "Strong knowledge foundation. Review the missed questions and try Quiz India!";
      } else {
        msg.textContent = "Good Effort! 📚";
        det.textContent = "Keep practicing. Regular study of NCERT materials will boost your score!";
      }
    }

    function restartQuiz() {
      currentIndex = 0;
      score = 0;
      document.getElementById('quiz-result-view').style.display = 'none';
      document.getElementById('quiz-active-view').style.display = 'block';
      renderQuestion();
    }

    document.addEventListener('DOMContentLoaded', () => {
      renderQuestion();
    });
  </script>

  <script src="../script.js" defer></script>
  <script src="../cookie.js" defer></script>
  <script src="../navbar-premium.js"></script>
  <script src="../footer-premium.js"></script>
</body>
</html>
"""

with open(os.path.join(SITE_DIR, "learning", "gk-quiz.html"), "w", encoding="utf-8", newline="\n") as f:
    f.write(GK_QUIZ_HTML)
print("[OK] learning/gk-quiz.html updated with full interactive quiz without meta-refresh.")
