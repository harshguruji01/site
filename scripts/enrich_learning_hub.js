const fs = require('fs');
const path = require('path');

// ==========================================
// 1. LEARNING SUBJECT ENRICHMENT
// ==========================================
const subjectGuide = `
    <!-- Comprehensive Subject Syllabus & Board Blueprint -->
    <section class="hg-guide-section" style="max-width:1000px; margin:3rem auto 2rem;">
      <h2>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
        CBSE Class 10 Science: Board Exam Blueprint, Unit Weightage &amp; Study Guide
      </h2>
      <p>
        The <strong>NCERT Class 10 Science Curriculum</strong> is thoughtfully engineered to bridge foundational secondary science with advanced higher secondary disciplines (Physics, Chemistry, and Biology). 
        Under the Central Board of Secondary Education (CBSE) assessment guidelines, the annual board theory examination carries <strong>80 marks</strong>, supported by <strong>20 marks</strong> of internal school assessments (practicals, periodic tests, and portfolio activities).
        Below is the detailed chapter breakdown, unit-wise marks distribution, and revision recommendations curated by HarshGuruJi educators.
      </p>

      <h3>1. Unit-Wise Marks Distribution (Annual Board Examination)</h3>
      <div class="hg-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Unit No.</th>
              <th>Unit Title &amp; Core Disciplines</th>
              <th>Key Chapters Included</th>
              <th>Marks Allocation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Unit I</strong></td>
              <td>Chemical Substances &ndash; Nature and Behaviour (Chemistry)</td>
              <td>Chapters 1, 2, 3, and 4 (Reactions, Acids &amp; Bases, Metals, Carbon)</td>
              <td><strong>25 Marks</strong></td>
            </tr>
            <tr>
              <td><strong>Unit II</strong></td>
              <td>World of Living (Biology &amp; Physiology)</td>
              <td>Chapters 5, 6, 7, and 8 (Life Processes, Control, Reproduction, Heredity)</td>
              <td><strong>25 Marks</strong></td>
            </tr>
            <tr>
              <td><strong>Unit III</strong></td>
              <td>Natural Phenomena (Physics: Optics)</td>
              <td>Chapters 9 and 10 (Light Reflection/Refraction, Human Eye)</td>
              <td><strong>12 Marks</strong></td>
            </tr>
            <tr>
              <td><strong>Unit IV</strong></td>
              <td>Effects of Current (Physics: Electromagnetism)</td>
              <td>Chapters 11 and 12 (Electricity, Magnetic Effects of Electric Current)</td>
              <td><strong>13 Marks</strong></td>
            </tr>
            <tr>
              <td><strong>Unit V</strong></td>
              <td>Natural Resources (Environmental Science)</td>
              <td>Chapter 13 (Our Environment)</td>
              <td><strong>05 Marks</strong></td>
            </tr>
            <tr>
              <td colspan="3"><strong>Total Theory Board Examination</strong></td>
              <td><strong>80 Marks</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>2. High-Yield Board Revision Strategies</h3>
      <div class="hg-guide-grid">
        <div class="hg-guide-card">
          <h4>Master Chemical Balancing</h4>
          <p>Always practice the algebraic or hit-and-trial balancing method. State symbols (solid <em>(s)</em>, liquid <em>(l)</em>, gas <em>(g)</em>, aqueous <em>(aq)</em>) and catalyst conditions above the yield arrow carry explicit grading marks.</p>
        </div>
        <div class="hg-guide-card">
          <h4>Ray Optics &amp; Sign Conventions</h4>
          <p>Strictly follow the Cartesian sign convention for spherical mirrors and lenses. Diagrams must clearly illustrate incident ray arrows and virtual image dashed extensions.</p>
        </div>
        <div class="hg-guide-card">
          <h4>Biological Flowcharts</h4>
          <p>Memorize step-by-step pathways (e.g. breakdown of glucose via aerobic vs anaerobic respiration, nephron filtration in kidneys, and double circulation in the human heart).</p>
        </div>
        <div class="hg-guide-card">
          <h4>Circuit Law Formulas</h4>
          <p>Ohm's Law ($V = IR$), series vs parallel equivalent resistance ($R_s = R_1 + R_2$, $1/R_p = 1/R_1 + 1/R_2$), and Joule's heating effect ($H = I^2Rt$) account for crucial numerical problems.</p>
        </div>
      </div>

      <h2>Frequently Asked Questions (FAQ)</h2>
      <div class="hg-faq-item">
        <h4>Are NCERT textbooks sufficient to score 95%+ in CBSE Class 10 Science?</h4>
        <p>Yes. Over 90% of board examination theory questions directly test concepts, in-text activities, and chapter-end exercises from official NCERT textbooks. Solving NCERT Exemplar problems alongside previous 5 years' CBSE question papers guarantees comprehensive preparation.</p>
      </div>
      <div class="hg-faq-item">
        <h4>How often are the study materials updated on HarshGuruJi?</h4>
        <p>All chapter notes, summaries, and digital textbook references are aligned with the latest rationalized NCERT edition published in accordance with the National Education Policy (NEP 2020).</p>
      </div>
      <div class="hg-faq-item">
        <h4>Can I download PDF copies of the chapter notes for offline reading?</h4>
        <p>Yes. HarshGuruJi provides direct access to digital chapter PDFs, summaries, and revision guides that can be saved locally on your laptop, tablet, or smartphone for offline revision.</p>
      </div>
    </section>
`;

const subjectFiles = [
  path.join(__dirname, '../learning/subject.html'),
  path.join(__dirname, '../learning/subject/index.html')
];

for (const file of subjectFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('CBSE Class 10 Science: Board Exam Blueprint')) {
    content = content.replace(/(<\/main>)/i, subjectGuide + '\n$1');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Enriched ' + file);
  }
}

// ==========================================
// 2. LEARNING CLASS ENRICHMENT
// ==========================================
const classGuide = `
    <!-- Academic Structure & Class 10 Foundation Guide -->
    <section class="hg-guide-section" style="max-width:1000px; margin:3rem auto 2rem;">
      <h2>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
        Class 10 CBSE &amp; NCERT Curriculum: Roadmap to Board Examination Excellence
      </h2>
      <p>
        Class 10 marks a monumental educational milestone in secondary school education across India. 
        It culminates in the nationwide All India Secondary School Examination (AISSE) conducted by the Central Board of Secondary Education (CBSE) and respective state boards.
        The performance achieved in Class 10 sets the foundation for choosing senior secondary academic streams—Science (PCM/PCB), Commerce, or Humanities/Arts.
        HarshGuruJi provides structured, chapter-by-chapter revision portals, interactive quizzes, and verified NCERT textbook libraries to empower independent learning.
      </p>

      <h3>1. Core Academic Pillars for Class 10 Students</h3>
      <div class="hg-guide-grid">
        <div class="hg-guide-card">
          <h4>🔬 Science (Physics, Chem, Bio)</h4>
          <p>Emphasizes scientific inquiry, chemical reactions, human physiology, genetics, optics, and electrical energy. Focuses heavily on application-based case study questions.</p>
        </div>
        <div class="hg-guide-card">
          <h4>📐 Mathematics (Standard &amp; Basic)</h4>
          <p>Real numbers, polynomials, quadratic equations, arithmetic progressions, coordinate geometry, trigonometry, circles, and statistics. Demands rigorous daily problem solving.</p>
        </div>
        <div class="hg-guide-card">
          <h4>🌍 Social Science (SST)</h4>
          <p>Four distinct disciplines: History (Nationalism in India/Europe), Geography (Resources &amp; Agriculture), Democratic Politics (Federalism &amp; Power Sharing), and Economics.</p>
        </div>
        <div class="hg-guide-card">
          <h4>📖 Languages (English &amp; Hindi)</h4>
          <p>Cultivates reading comprehension, formal writing skills (letters, analytical paragraphs), grammar proficiency, and deep literary textual analysis.</p>
        </div>
      </div>

      <h3>2. Effective 4-Phase Study Timeline for Class 10</h3>
      <ul>
        <li><strong>Phase 1 (April &ndash; August): Comprehensive Concept Mastery.</strong> Read every NCERT chapter thoroughly, underline key definitions, complete all in-text examples, and maintain organized handwritten notes.</li>
        <li><strong>Phase 2 (September &ndash; November): Problem Solving &amp; Midterms.</strong> Solve chapter-end exercises, NCERT Exemplar problems, and school half-yearly test papers to identify weak areas.</li>
        <li><strong>Phase 3 (December &ndash; January): Pre-Board Drills.</strong> Complete timed 3-hour mock board papers, review CBSE official marking schemes, and master diagram drawing and equation formatting.</li>
        <li><strong>Phase 4 (February &ndash; March): High-Yield Revision.</strong> Focus on short-formula sheets, biological reaction summaries, map work, and high-frequency previous-year questions (PYQs).</li>
      </ul>

      <h2>Frequently Asked Questions (FAQ)</h2>
      <div class="hg-faq-item">
        <h4>What is the difference between Mathematics Standard and Mathematics Basic in Class 10?</h4>
        <p>Mathematics Basic is designed for students who do not intend to pursue Mathematics in Class 11 and 12, featuring simpler, direct conceptual questions. Mathematics Standard is intended for students planning to study Engineering, Physics, Computer Science, or Economics, featuring higher-order analytical problems.</p>
      </div>
      <div class="hg-faq-item">
        <h4>Are internal assessments important for the final grade?</h4>
        <p>Yes. Internal assessments contribute 20% (20 marks out of 100) toward your final subject grade. They evaluate periodic tests, lab practicals, notebooks, and project portfolios.</p>
      </div>
      <div class="hg-faq-item">
        <h4>How can I use HarshGuruJi to prepare for exams?</h4>
        <p>Use our Subject Portals for structured chapter overviews, review Chapter Notes for concise summaries, test your conceptual clarity with our interactive General Knowledge &amp; Science Quizzes, and download official NCERT textbooks from our PDF Library.</p>
      </div>
    </section>
`;

const classFiles = [
  path.join(__dirname, '../learning/class.html'),
  path.join(__dirname, '../learning/class/index.html')
];

for (const file of classFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('Class 10 CBSE &amp; NCERT Curriculum: Roadmap')) {
    content = content.replace(/(<\/main>)/i, classGuide + '\n$1');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Enriched ' + file);
  }
}

// ==========================================
// 3. LEARNING INDEX (HUB) ENRICHMENT
// ==========================================
const learningHubGuide = `
    <!-- Comprehensive Learning Hub Academic Mission -->
    <section class="hg-guide-section" style="max-width:1000px; margin:3.5rem auto 2rem;">
      <h2>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
        HarshGuruJi Learning Hub: Educational Vision, Open Resources &amp; Methodology
      </h2>
      <p>
        Education is the most transformative catalyst for personal growth, intellectual empowerment, and societal progress. 
        The <strong>HarshGuruJi Learning Hub</strong> is an open-access educational portal engineered to deliver high-quality academic notes, NCERT textbooks, syllabus roadmaps, and interactive revision aids completely free of charge to students, educators, and independent learners across India and the globe.
        Whether preparing for critical board examinations, competitive entrance tests, or expanding your intellectual horizons, our curated resources provide clear, verified, and accessible pathways to excellence.
      </p>

      <div class="hg-trust-banner">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        <div>
          <strong>Free &amp; Open Education Pledge:</strong> HarshGuruJi never places foundational educational notes, NCERT textbooks, or study guides behind paywalls. Quality learning belongs to all.
        </div>
      </div>

      <h3>Core Educational Modules Available on HarshGuruJi</h3>
      <div class="hg-guide-grid">
        <div class="hg-guide-card">
          <h4>📘 NCERT Textbook Portals</h4>
          <p>Direct chapter-by-chapter portals covering Classes 6 through 12, featuring verified curriculum summaries, in-text solutions, and key concept outlines.</p>
        </div>
        <div class="hg-guide-card">
          <h4>📝 Digital Chapter Notes</h4>
          <p>Concise, highly structured revision sheets synthesizing 50-page textbook chapters into readable revision points, equations, and diagrams.</p>
        </div>
        <div class="hg-guide-card">
          <h4>🧠 Interactive Knowledge Quizzes</h4>
          <p>Gamified quizzes covering General Knowledge, Indian History, Geography, Polity, and Science to reinforce active recall and test-taking speed.</p>
        </div>
        <div class="hg-guide-card">
          <h4>📥 Offline PDF Library</h4>
          <p>Clean, virus-scanned PDF editions of official educational books and reference guides that can be saved for offline revision on any digital device.</p>
        </div>
      </div>

      <h2>Frequently Asked Questions (FAQ)</h2>
      <div class="hg-faq-item">
        <h4>Are these learning materials aligned with the latest CBSE/NCERT rationalized syllabus?</h4>
        <p>Yes. All chapter guides, topic breakdowns, and study aids reflect the latest NCERT editions published under the National Curriculum Framework (NCF) and National Education Policy (NEP 2020).</p>
      </div>
      <div class="hg-faq-item">
        <h4>Do I need to create an account or sign in to access study notes?</h4>
        <p>No. All public learning materials, chapter notes, and textbook portals are freely accessible without mandatory registration or login walls.</p>
      </div>
    </section>
`;

const learningIndexFiles = [
  path.join(__dirname, '../learning.html'),
  path.join(__dirname, '../learning/index.html')
];

for (const file of learningIndexFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('HarshGuruJi Learning Hub: Educational Vision')) {
    content = content.replace(/(<\/main>)/i, learningHubGuide + '\n$1');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Enriched ' + file);
  }
}

// ==========================================
// 4. LEARNING PDF LIBRARY ENRICHMENT
// ==========================================
const pdfLibraryGuide = `
    <!-- Comprehensive Digital Library & Study Strategies Guide -->
    <section class="hg-guide-section" style="max-width:1000px; margin:3rem auto 2rem;">
      <h2>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        Digital Textbook Library: Open Educational Resources &amp; Study Strategies
      </h2>
      <p>
        Digital textbooks and Open Educational Resources (OER) have democratized access to world-class learning materials. 
        The <strong>HarshGuruJi PDF Library</strong> provides structured, high-resolution digital editions of official National Council of Educational Research and Training (NCERT) textbooks spanning secondary and higher secondary grades.
        Whether studying on an iPad, Android tablet, e-reader, or desktop computer, digital PDF textbooks enable searchable keyword navigation, instant bookmarking, and offline study anytime, anywhere.
      </p>

      <h3>Effective Digital Reading &amp; Note-Taking Strategies</h3>
      <div class="hg-guide-grid">
        <div class="hg-guide-card">
          <h4>Active Recall with Split Screen</h4>
          <p>Read a digital chapter section, close the PDF viewer, and summarize the key concepts from memory into your digital notebook before checking accuracy.</p>
        </div>
        <div class="hg-guide-card">
          <h4>The Cornell Note-Taking System</h4>
          <p>Divide your notebook page into three sections: Cues/Questions (left), Lecture Notes (right), and Chapter Summary (bottom) for maximum retention.</p>
        </div>
        <div class="hg-guide-card">
          <h4>Searchable Keyword Navigation</h4>
          <p>Use <code>Ctrl + F</code> (or <code>Cmd + F</code>) inside digital PDF viewers to locate specific scientific terms, historical dates, or mathematical formulas instantly.</p>
        </div>
        <div class="hg-guide-card">
          <h4>Eye Care &amp; Night Reading</h4>
          <p>When studying for extended periods on digital displays, enable dark mode or blue-light filters, and follow the 20-20-20 rule to prevent digital eye strain.</p>
        </div>
      </div>

      <h2>Frequently Asked Questions (FAQ)</h2>
      <div class="hg-faq-item">
        <h4>Are these PDF textbooks legal and free to download?</h4>
        <p>Yes. The National Council of Educational Research and Training (NCERT), Government of India, provides textbook digital editions under non-commercial open public educational terms to support Indian students worldwide.</p>
      </div>
      <div class="hg-faq-item">
        <h4>Can I print copies of these chapters for personal study?</h4>
        <p>Yes. Students and teachers are permitted to print digital PDF pages for individual educational revision, classroom assignments, and personal reference.</p>
      </div>
    </section>
`;

const pdfFiles = [
  path.join(__dirname, '../learning/pdf-library.html'),
  path.join(__dirname, '../learning/pdf-library/index.html')
];

for (const file of pdfFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('Digital Textbook Library: Open Educational Resources')) {
    content = content.replace(/(<\/main>)/i, pdfLibraryGuide + '\n$1');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Enriched ' + file);
  }
}

// ==========================================
// 5. QUIZ INDIA ENRICHMENT
// ==========================================
const quizIndiaGuide = `
    <!-- Comprehensive GK & Competitive Exam Preparation Guide -->
    <section class="hg-guide-section" style="max-width:900px; margin:3rem auto 2rem;">
      <h2>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        General Knowledge &amp; Competitive Exam Mastery Guide for India
      </h2>
      <p>
        General Knowledge (GK) and Current Affairs form a mandatory scoring section in virtually every major competitive examination across India, including 
        <strong>UPSC Civil Services Examination (CSE)</strong>, <strong>SSC CGL / CHSL</strong>, <strong>State Public Service Commissions (PSC)</strong>, 
        <strong>Banking (IBPS, SBI PO)</strong>, <strong>Railways (RRB NTPC)</strong>, and <strong>Defence Services (CDS, NDA)</strong>.
        The <strong>HarshGuruJi Quiz India Challenge</strong> is designed to test your knowledge across Indian history, constitution and polity, physical geography, general science, economics, and international affairs.
      </p>

      <h3>1. Key General Knowledge Disciplines Tested</h3>
      <div class="hg-guide-grid">
        <div class="hg-guide-card">
          <h4>🏛️ Indian History &amp; Heritage</h4>
          <p>Ancient Indus Valley Civilization, Vedic period, Mauryan and Gupta empires, Delhi Sultanate, Mughal era, and the 1857–1947 Indian Freedom Struggle.</p>
        </div>
        <div class="hg-guide-card">
          <h4>⚖️ Indian Polity &amp; Constitution</h4>
          <p>Preamble, Fundamental Rights (Articles 12–35), Directive Principles, Parliament, Supreme Court, constitutional amendments, and democratic governance.</p>
        </div>
        <div class="hg-guide-card">
          <h4>🗺️ Physical &amp; Economic Geography</h4>
          <p>Himalayan ranges, peninsular river drainage systems (Ganga, Brahmaputra, Godavari), monsoon climate patterns, national parks, and mineral reserves.</p>
        </div>
        <div class="hg-guide-card">
          <h4>🔬 General Science &amp; Innovation</h4>
          <p>Everyday physics, chemical reactions, environmental ecology, human biology, space missions (ISRO Chandrayaan &amp; Gaganyaan), and digital technology.</p>
        </div>
      </div>

      <h3>2. Cognitive Benefits of Gamified Quiz Practice</h3>
      <p>
        Psychological research demonstrates that <strong>testing yourself (the "Testing Effect")</strong> produces significantly higher long-term memory retention than passively re-reading textbooks. 
        By challenging your brain to recall facts under time pressure, quiz sessions strengthen neural retrieval pathways, reduce examination anxiety, and expose conceptual knowledge blind spots.
      </p>

      <h2>Frequently Asked Questions (FAQ)</h2>
      <div class="hg-faq-item">
        <h4>How often are the questions in Quiz India updated?</h4>
        <p>The question bank is regularly curated with verified questions spanning static general knowledge and recent Indian national milestones, space achievements, and sports events.</p>
      </div>
      <div class="hg-faq-item">
        <h4>Can I play Quiz India on mobile devices?</h4>
        <p>Yes. The interface is 100% mobile responsive with large tap targets, immediate feedback on correct/incorrect selections, and celebratory confetti upon completing rounds.</p>
      </div>
    </section>
`;

const quizFiles = [
  path.join(__dirname, '../Quiz India/index.html')
];

for (const file of quizFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('General Knowledge &amp; Competitive Exam Mastery Guide')) {
    content = content.replace(/(<\/body>)/i, quizIndiaGuide + '\n$1');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Enriched ' + file);
  }
}
