const fs = require('fs');
const path = require('path');

// ==========================================
// 1. BMI CALCULATOR EXPANSION
// ==========================================
const bmiExpansion = `
  <h3>1. Mathematical Formulas: Metric vs. Imperial Calculations</h3>
  <div class="hg-guide-grid">
    <div class="hg-guide-card">
      <h4>Metric BMI Formula</h4>
      <div class="hg-formula-box">BMI = Weight (kg) / [Height (m)]&sup2;</div>
      <p>Example: An adult weighing 72 kg with a height of 1.78 meters: <code>72 / (1.78 &times; 1.78) = 22.72 kg/m&sup2;</code> (Normal Weight category).</p>
    </div>
    <div class="hg-guide-card">
      <h4>Imperial BMI Formula</h4>
      <div class="hg-formula-box">BMI = 703 &times; Weight (lbs) / [Height (inches)]&sup2;</div>
      <p>Example: An individual weighing 160 lbs with a height of 5'10" (70 inches): <code>703 &times; 160 / 4900 = 22.95</code>.</p>
    </div>
  </div>

  <h3>2. WHO Asian Population Health Cut-Offs</h3>
  <p>
    Clinical research spearheaded by the World Health Organization demonstrated that individuals of Asian descent tend to develop elevated cardiovascular and metabolic risks (including type-2 diabetes and hypertension) at lower BMI thresholds due to higher average percentages of visceral body fat. 
    As a result, specialized clinical criteria for Asian adults recommend:
  </p>
  <ul>
    <li><strong>Underweight:</strong> BMI &lt; 18.5 kg/m&sup2;</li>
    <li><strong>Healthy Weight:</strong> BMI 18.5 &ndash; 22.9 kg/m&sup2;</li>
    <li><strong>Overweight:</strong> BMI 23.0 &ndash; 27.4 kg/m&sup2;</li>
    <li><strong>Obese:</strong> BMI &ge; 27.5 kg/m&sup2;</li>
  </ul>

  <h3>3. Complementary Health Metrics Beyond BMI</h3>
  <p>
    Physicians recommend pairing BMI measurements with other diagnostic metrics for a complete cardiovascular profile:
  </p>
  <ul>
    <li><strong>Waist-to-Height Ratio (WHtR):</strong> A simple, effective health indicator. Maintaining your waist circumference at less than half your height (WHtR &lt; 0.5) correlates strongly with lower cardiovascular mortality.</li>
    <li><strong>Waist-to-Hip Ratio (WHR):</strong> Measures android (apple-shaped) versus gynoid (pear-shaped) fat distribution. Abdominal obesity is clinically defined as WHR &gt; 0.90 in men and &gt; 0.85 in women.</li>
    <li><strong>DEXA Body Composition Scan:</strong> The clinical gold standard for directly measuring bone density, lean muscle mass, and exact body fat percentage.</li>
  </ul>
`;

const bmiFiles = [
  path.join(__dirname, '../tools/bmi-calculator.html'),
  path.join(__dirname, '../tools/bmi-calculator/index.html')
];

for (const file of bmiFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('WHO Asian Population Health Cut-Offs')) {
    content = content.replace('<h3>The Mathematical Formula Behind BMI</h3>', bmiExpansion + '\n  <h3>The Mathematical Formula Behind BMI</h3>');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Enriched ' + file);
  }
}

// ==========================================
// 2. LEARNING CHAPTER EXPANSION
// ==========================================
const chapterExpansion = `
    <!-- Comprehensive NCERT Class 10 Science Chapter 1 Study Notes -->
    <section class="hg-guide-section" style="max-width:1000px; margin:3rem auto 2rem;">
      <h2>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
        NCERT Class 10 Chapter 1: Comprehensive Study Notes &amp; Chemical Reactions
      </h2>
      <p>
        In chemistry, a <strong>chemical reaction</strong> is a process wherein one or more substances (reactants) undergo bond cleavage and atomic rearrangement to form new chemical entities (products) with entirely distinct chemical and physical properties. 
        Chemical transformations can be verified in laboratory settings through observable indicators: 
        <strong>evolution of a gas</strong>, <strong>change in color</strong>, <strong>formation of a precipitate</strong>, or <strong>change in temperature</strong> (exothermic vs. endothermic reactions).
      </p>

      <h3>1. The 5 Fundamental Types of Chemical Reactions</h3>
      <div class="hg-guide-grid">
        <div class="hg-guide-card">
          <h4>1. Combination Reaction</h4>
          <p>Two or more reactants combine to yield a single product: <code>A + B &rarr; AB</code>. Example: Quicklime reacting with water to form slaked lime: <code>CaO(s) + H₂O(l) &rarr; Ca(OH)₂(aq) + Heat</code>.</p>
        </div>
        <div class="hg-guide-card">
          <h4>2. Decomposition Reaction</h4>
          <p>A single reactant breaks down into multiple simpler products via thermal, electrolytic, or photochemical energy. Example: Photolytic decomposition of silver chloride: <code>2AgCl(s) &rarr; 2Ag(s) + Cl₂(g)</code>.</p>
        </div>
        <div class="hg-guide-card">
          <h4>3. Displacement Reaction</h4>
          <p>A more reactive element displaces a less reactive element from its salt solution: <code>A + BC &rarr; AC + B</code>. Example: Iron nail in copper sulphate solution: <code>Fe(s) + CuSO₄(aq) &rarr; FeSO₄(aq) + Cu(s)</code>.</p>
        </div>
        <div class="hg-guide-card">
          <h4>4. Double Displacement</h4>
          <p>Mutual exchange of ions between two compounds forming an insoluble precipitate. Example: Sodium sulphate and barium chloride: <code>Na₂SO₄(aq) + BaCl₂(aq) &rarr; BaSO₄(s)&darr; + 2NaCl(aq)</code>.</p>
        </div>
      </div>

      <h3>2. Oxidation, Reduction &amp; Redox Reactions</h3>
      <p>
        In classical chemistry:
      </p>
      <ul>
        <li><strong>Oxidation:</strong> The gain of oxygen or loss of hydrogen (or loss of electrons in modern electronic theory).</li>
        <li><strong>Reduction:</strong> The loss of oxygen or gain of hydrogen (or gain of electrons).</li>
        <li><strong>Redox Reaction:</strong> Simultaneous occurrence of oxidation and reduction within the same reaction. For example, heating copper(II) oxide with hydrogen gas: <code>CuO(s) + H₂(g) &rarr; Cu(s) + H₂O(l)</code>. Here, CuO is reduced to Cu, while H₂ is oxidized to H₂O.</li>
      </ul>

      <h3>3. Everyday Oxidation: Corrosion &amp; Rancidity</h3>
      <p>
        <strong>Corrosion of Metals:</strong> When refined metals are attacked by atmospheric moisture, oxygen, and acids. The rusting of iron creates hydrated ferric oxide (<code>Fe₂O₃&middot;xH₂O</code>). Prevention includes galvanization (zinc coating), painting, electroplating, and alloying (stainless steel).
      </p>
      <p>
        <strong>Rancidity:</strong> When fats and oils oxidize over time, producing foul odors, unpleasant tastes, and toxic peroxides. Prevention techniques include packing snack foods in unreactive nitrogen gas, hermetic vacuum sealing, and adding natural antioxidants (such as Vitamin E or BHA/BHT).
      </p>

      <h2>Frequently Asked Questions (FAQ)</h2>
      <div class="hg-faq-item">
        <h4>Why should a magnesium ribbon be cleaned before burning in air?</h4>
        <p>Magnesium is a reactive alkaline earth metal that slowly oxidizes upon contact with ambient air, forming a protective, inert layer of basic magnesium oxide (MgO). Rubbing the ribbon with sandpaper removes this oxide barrier, allowing ignition to proceed smoothly with a characteristic dazzling white flame.</p>
      </div>
      <div class="hg-faq-item">
        <h4>Why is respiration considered an exothermic reaction?</h4>
        <p>During cellular respiration, glucose molecules from digested carbohydrates combine with inhaled oxygen in cells, releasing biological energy stored in ATP: <code>C₆H₁₂O₆ + 6O₂ &rarr; 6CO₂ + 6H₂O + Energy</code>. Because thermal and chemical energy is released, respiration is classified as an exothermic process.</p>
      </div>
      <div class="hg-faq-item">
        <h4>What is the difference between slaked lime and quicklime?</h4>
        <p>Quicklime is pure calcium oxide (<code>CaO</code>), produced by thermally roasting limestone (calcium carbonate). When water is vigorously added to quicklime, a slaking reaction forms slaked lime (calcium hydroxide, <code>Ca(OH)₂</code>), releasing substantial heat.</p>
      </div>
    </section>
`;

const chapterFiles = [
  path.join(__dirname, '../learning/chapter.html'),
  path.join(__dirname, '../learning/chapter/index.html')
];

for (const file of chapterFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('NCERT Class 10 Chapter 1: Comprehensive Study Notes')) {
    content = content.replace(/(<\/main>)/i, chapterExpansion + '\n$1');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Enriched ' + file);
  }
}

// ==========================================
// 3. THE BEST OF HARSHGURUJI EXPANSION
// ==========================================
const bestExpansion = `
    <!-- Editorial Standards & Showcase Methodology -->
    <section class="hg-guide-section" style="max-width:1200px; margin:4rem auto 2.5rem; width:100%;">
      <h2>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        HarshGuruJi Curated Flagships: Editorial Selection &amp; Standards
      </h2>
      <p>
        The <strong>Best of HarshGuruJi</strong> showcase represents the crown jewels of our digital ecosystem. 
        Each featured application, AI tool, educational portal, and developer utility undergoes rigorous quality benchmarks before inclusion in our flagship directory.
        Our mission is to engineer software that is <strong>lightning-fast</strong>, <strong>privacy-respecting</strong>, <strong>100% free</strong>, and accessible across every operating system.
      </p>

      <div class="hg-trust-banner">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        <div>
          <strong>Our Flagship Quality Promise:</strong> Zero adware, zero forced subscriptions, zero deceptive countdown timers, and full compatibility across mobile and desktop displays.
        </div>
      </div>

      <h3>The 4 Pillars of HarshGuruJi Excellence</h3>
      <div class="hg-guide-grid">
        <div class="hg-guide-card">
          <h4>1. Verified Software Safety</h4>
          <p>Every application distributed on GuruStore undergoes multi-engine antivirus validation through VirusTotal. We guarantee cryptographically clean, untampered installation packages.</p>
        </div>
        <div class="hg-guide-card">
          <h4>2. Ethical &amp; Uncapped AI</h4>
          <p>GuruAI delivers advanced conversational intelligence and multimodal image generation with generous daily allowances and no aggressive paywalls.</p>
        </div>
        <div class="hg-guide-card">
          <h4>3. Democratized Education</h4>
          <p>Our NCERT digital portals and chapter study guides provide complete, verified CBSE curriculums to empower independent learning for every student.</p>
        </div>
        <div class="hg-guide-card">
          <h4>4. Client-Side Engineering</h4>
          <p>All developer formatters, text tools, and cryptographic generators compute in local browser RAM, upholding absolute zero-knowledge privacy.</p>
        </div>
      </div>

      <h2>Frequently Asked Questions (FAQ)</h2>
      <div class="hg-faq-item">
        <h4>Are all the tools listed in "The Best" free to use?</h4>
        <p>Yes. Every service showcased on this page is completely free to access. We believe in providing open, high-quality digital utilities without requiring paid subscriptions or premium memberships.</p>
      </div>
      <div class="hg-faq-item">
        <h4>How frequently are flagship tools updated?</h4>
        <p>Our engineering team performs continuous structural maintenance, security updates, and performance tuning weekly across all web services, store packages, and AI models.</p>
      </div>
    </section>
`;

const bestFiles = [
  path.join(__dirname, '../best.html'),
  path.join(__dirname, '../best/index.html')
];

for (const file of bestFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('HarshGuruJi Curated Flagships: Editorial Selection')) {
    content = content.replace(/(<\/main>)/i, bestExpansion + '\n$1');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Enriched ' + file);
  }
}

// ==========================================
// 4. JOIN CONTRIBUTOR EXPANSION
// ==========================================
const contributorExpansion = `
    <!-- Contributor Guidelines & Peer Review Protocols -->
    <section class="hg-guide-section" style="max-width:900px; margin:3rem auto 2.5rem;">
      <h2>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        HarshGuruJi Contributor Network: Guidelines &amp; Community Standards
      </h2>
      <p>
        The HarshGuruJi ecosystem thrives through collaborative innovation. 
        Whether you are an open-source software developer submitting an original APK or desktop application to GuruStore, an educator crafting NCERT study notes, or a technical writer publishing developer guides, 
        our Contributor Network provides a recognized, high-visibility platform to showcase your work to thousands of daily visitors.
      </p>

      <h3>Contributor Code of Conduct &amp; Submission Criteria</h3>
      <div class="hg-guide-grid">
        <div class="hg-guide-card">
          <h4>Original Content Only</h4>
          <p>All submitted articles, study notes, and educational materials must be 100% original, academically accurate, and properly cited. Plagiarized submissions are immediately rejected.</p>
        </div>
        <div class="hg-guide-card">
          <h4>Clean &amp; Safe Software</h4>
          <p>Applications submitted to GuruStore must be free of hidden adware, unauthorized crypto-mining scripts, or telemetry trackers. Submissions undergo automated VirusTotal scans.</p>
        </div>
        <div class="hg-guide-card">
          <h4>Community Attribution</h4>
          <p>Verified contributors receive public attribution, custom developer profile badges, and direct links to their GitHub repositories, LinkedIn, or personal portfolios.</p>
        </div>
        <div class="hg-guide-card">
          <h4>Rapid Editorial Review</h4>
          <p>Our editorial team reviews all contributor submissions within 3 to 5 business days, providing detailed constructive feedback and publishing approved releases.</p>
        </div>
      </div>

      <h2>Frequently Asked Questions (FAQ)</h2>
      <div class="hg-faq-item">
        <h4>Is there any fee to become a contributor on HarshGuruJi?</h4>
        <p>No. Joining the HarshGuruJi Contributor Network is 100% free. We celebrate open knowledge, developer innovation, and educational collaboration.</p>
      </div>
      <div class="hg-faq-item">
        <h4>What types of contributions are currently being accepted?</h4>
        <p>We welcome submissions in four major categories: Android APKs &amp; Windows tools, NCERT Chapter Revision Notes, General Knowledge Quizzes, and Technical Articles on web development and AI.</p>
      </div>
    </section>
`;

const contributorFiles = [
  path.join(__dirname, '../join-contributor.html'),
  path.join(__dirname, '../join-contributor/index.html'),
  path.join(__dirname, '../apply-contributor.html'),
  path.join(__dirname, '../apply-contributor/index.html')
];

for (const file of contributorFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('HarshGuruJi Contributor Network: Guidelines')) {
    content = content.replace(/(<\/main>)/i, contributorExpansion + '\n$1');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Enriched ' + file);
  }
}
