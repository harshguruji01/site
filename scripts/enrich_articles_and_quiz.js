const fs = require('fs');
const path = require('path');

// ==========================================
// 1. INSIGHTS ARTICLES ENRICHMENT
// ==========================================
const insightsArticles = `
    <!-- Insight 4: Mental Models for Clear Decision Making -->
    <article style="background:var(--card-bg);padding:3rem 2.5rem;border-radius:24px;border:1px solid var(--card-border);box-shadow:0 15px 40px rgba(0,0,0,.5);margin-bottom:2.5rem">
      <span style="display:inline-block;padding:4px 12px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);border-radius:20px;color:#a5b4fc;font-size:0.85rem;font-weight:700;margin-bottom:1rem;">Model 04 • Decision Architecture</span>
      <h2 style="color:var(--text-primary);font-size:1.85rem;margin-top:0;margin-bottom:1rem;font-family:'Space Grotesk',sans-serif">The Power of Inversion &amp; Second-Order Thinking</h2>
      <p style="margin-bottom:1.25rem">
        Most people approach complex life decisions by asking, "How can I achieve success?" The ancient stoics and mathematician Carl Gustav Jacob Jacobi offered a profoundly more powerful framework: <em>"Invert, always invert."</em>
        Instead of seeking brilliance, focus systematically on avoiding stupidity, catastrophic mistakes, and unforced errors.
      </p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.25rem;margin:1.5rem 0;">
        <div style="padding:1.25rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;">
          <h4 style="color:var(--accent-primary);margin:0 0 0.5rem 0;">Inversion Strategy</h4>
          <p style="margin:0;font-size:0.9rem;color:var(--text-secondary);">Ask: "What actions would guarantee failure in this project?" Make a list of those exact behaviors and systematically eliminate them.</p>
        </div>
        <div style="padding:1.25rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;">
          <h4 style="color:var(--accent-secondary);margin:0 0 0.5rem 0;">Second-Order Consequences</h4>
          <p style="margin:0;font-size:0.9rem;color:var(--text-secondary);">First-order thinking asks: "What happens next?" Second-order thinking asks: "And then what happens 6 months, 2 years, or 5 years after that?"</p>
        </div>
        <div style="padding:1.25rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;">
          <h4 style="color:#10b981;margin:0 0 0.5rem 0;">Occam's Razor</h4>
          <p style="margin:0;font-size:0.9rem;color:var(--text-secondary);">When evaluating competing explanations for an event, the hypothesis with the fewest unverified assumptions is most likely correct.</p>
        </div>
      </div>
    </article>

    <!-- Insight 5: The Flow State & Mihaly Csikszentmihalyi -->
    <article style="background:var(--card-bg);padding:3rem 2.5rem;border-radius:24px;border:1px solid var(--card-border);box-shadow:0 15px 40px rgba(0,0,0,.5);margin-bottom:2.5rem">
      <span style="display:inline-block;padding:4px 12px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);border-radius:20px;color:#34d399;font-size:0.85rem;font-weight:700;margin-bottom:1rem;">Model 05 • Cognitive Neurobiology</span>
      <h2 style="color:var(--text-primary);font-size:1.85rem;margin-top:0;margin-bottom:1rem;font-family:'Space Grotesk',sans-serif">The Neurobiology of Flow State: Operating at Peak Creative Capacity</h2>
      <p style="margin-bottom:1.25rem">
        Pioneered by psychologist Mihaly Csikszentmihalyi, <strong>flow state</strong> is defined as an optimal psychological state where a person is fully immersed in an activity with energized focus, full involvement, and enjoyment. 
        During flow, transient hypofrontality temporarily quiets the inner critic of the prefrontal cortex, leading to a loss of self-consciousness and a distortion of subjective time.
      </p>
      <ul style="padding-left:1.25rem;margin:0;line-height:1.9;">
        <li><strong style="color:var(--text-primary);">The Challenge-Skill Balance:</strong> Flow emerges when the challenge of a task sits approximately 4% beyond your current comfort zone—demanding enough to prevent boredom, yet within reach to avoid crippling anxiety.</li>
        <li><strong style="color:var(--text-primary);">Immediate Sensory Feedback:</strong> Whether writing code, playing a musical instrument, or playing competitive chess, instant feedback allows continuous micro-adjustments.</li>
        <li><strong style="color:var(--text-primary);">Elimination of Cognitive Multitasking:</strong> Flow requires complete attentional monopoly. Task-switching incurs an "attention residue" that takes up to 23 minutes to purge.</li>
      </ul>
    </article>
`;

const insightsFiles = [
  path.join(__dirname, '../insights.html'),
  path.join(__dirname, '../insights/index.html')
];

for (const file of insightsFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('Model 04 • Decision Architecture')) {
    content = content.replace(/(<\/div>\s*<\/section>)/i, insightsArticles + '\n  $1');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Enriched ' + file);
  }
}

// ==========================================
// 2. DAILY LIFE ENRICHMENT
// ==========================================
const dailyLifeArticles = `
    <!-- System 4: Digital Minimalism & Attention Hygiene -->
    <article style="background:var(--card-bg);padding:3rem 2.5rem;border-radius:24px;border:1px solid var(--card-border);box-shadow:0 15px 40px rgba(0,0,0,.5);margin-bottom:2.5rem">
      <span style="display:inline-block;padding:4px 12px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);border-radius:20px;color:#a5b4fc;font-size:0.85rem;font-weight:700;margin-bottom:1rem;">System 04 • Attention Hygiene</span>
      <h2 style="color:var(--text-primary);font-size:1.85rem;margin-top:0;margin-bottom:1rem;font-family:'Space Grotesk',sans-serif">Digital Minimalism: Reclaiming Mental Bandwidth</h2>
      <p style="margin-bottom:1.25rem">
        Smartphones and social algorithms are designed by teams of behavioral psychologists to harvest human attention. 
        Applying <strong>Digital Minimalism</strong> is not about rejecting technology; it is about choosing your digital inputs with radical intentionality to protect your mental energy for what truly matters.
      </p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.25rem;margin:1.5rem 0;">
        <div style="padding:1.25rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;">
          <h4 style="color:var(--accent-primary);margin:0 0 0.5rem 0;">Grayscale Display</h4>
          <p style="margin:0;font-size:0.9rem;color:var(--text-secondary);">Switching your mobile screen to grayscale removes hyper-stimulating dopamine colors, reducing habitual mindless phone unlocking by up to 40%.</p>
        </div>
        <div style="padding:1.25rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;">
          <h4 style="color:var(--accent-secondary);margin:0 0 0.5rem 0;">Notification Auditing</h4>
          <p style="margin:0;font-size:0.9rem;color:var(--text-secondary);">Disable all notifications except direct real-time human communications (calls and urgent direct messages). Silence badges and promo pings.</p>
        </div>
        <div style="padding:1.25rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;">
          <h4 style="color:#10b981;margin:0 0 0.5rem 0;">Batching Communication</h4>
          <p style="margin:0;font-size:0.9rem;color:var(--text-secondary);">Check emails and messages only twice a day at set windows (e.g., 11:30 AM and 4:30 PM) rather than continually context-switching.</p>
        </div>
      </div>
    </article>

    <!-- System 5: Sleep Architecture & Recovery -->
    <article style="background:var(--card-bg);padding:3rem 2.5rem;border-radius:24px;border:1px solid var(--card-border);box-shadow:0 15px 40px rgba(0,0,0,.5);margin-bottom:2.5rem">
      <span style="display:inline-block;padding:4px 12px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);border-radius:20px;color:#34d399;font-size:0.85rem;font-weight:700;margin-bottom:1rem;">System 05 • Circadian Biology</span>
      <h2 style="color:var(--text-primary);font-size:1.85rem;margin-top:0;margin-bottom:1rem;font-family:'Space Grotesk',sans-serif">Mastering Sleep Architecture for Cognitive Longevity</h2>
      <p style="margin-bottom:1.25rem">
        Sleep is the single most effective physiological reset mechanism known to science. During slow-wave deep sleep and rapid eye movement (REM) cycles, the brain activates the glymphatic system to flush metabolic waste (including beta-amyloid plaques) and consolidates new learning into permanent long-term memory.
      </p>
      <ul style="padding-left:1.25rem;margin:0;line-height:1.9;">
        <li><strong style="color:var(--text-primary);">Morning Sunlight Anchor:</strong> View natural outdoor sunlight within 30 minutes of waking to trigger cortisol release and set your master circadian clock (suprachiasmatic nucleus).</li>
        <li><strong style="color:var(--text-primary);">Caffeine Half-Life Discipline:</strong> Caffeine possesses an average half-life of 5 to 7 hours and a quarter-life of 12 hours. Avoid caffeinated beverages past 1:00 PM to protect deep restorative slow-wave sleep.</li>
        <li><strong style="color:var(--text-primary);">Cool Sleep Temperature:</strong> Core body temperature must drop by 1&deg;C to 1.5&deg;C to initiate deep sleep. Maintain your bedroom environment cool (~18&deg;C to 20&deg;C) for optimal sleep efficiency.</li>
      </ul>
    </article>
`;

const dailyLifeFiles = [
  path.join(__dirname, '../daily-life.html'),
  path.join(__dirname, '../daily-life/index.html')
];

for (const file of dailyLifeFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('System 04 • Attention Hygiene')) {
    content = content.replace(/(<\/div>\s*<\/section>)/i, dailyLifeArticles + '\n  $1');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Enriched ' + file);
  }
}

// ==========================================
// 3. EDUCATION PILLARS ENRICHMENT
// ==========================================
const educationArticles = `
    <!-- Pillar 4: Artificial Intelligence & Future of Learning -->
    <article style="background:var(--card-bg);padding:3rem 2.5rem;border-radius:24px;border:1px solid var(--card-border);box-shadow:0 15px 40px rgba(0,0,0,.5);margin-bottom:2.5rem">
      <span style="display:inline-block;padding:4px 12px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);border-radius:20px;color:#a5b4fc;font-size:0.85rem;font-weight:700;margin-bottom:1rem;">Discipline 04 • AI in Education</span>
      <h2 style="color:var(--text-primary);font-size:1.85rem;margin-top:0;margin-bottom:1rem;font-family:'Space Grotesk',sans-serif">Leveraging Artificial Intelligence as a Personalized Socratic Tutor</h2>
      <p style="margin-bottom:1.25rem">
        Generative Artificial Intelligence is redefining education from passive one-size-fits-all lecturing to dynamic, personalized Socratic tutoring. 
        When students use AI models like HarshGuruJi GuruAI not to copy answers, but to interrogate complex ideas, learning velocity accelerates exponentially.
      </p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.25rem;margin:1.5rem 0;">
        <div style="padding:1.25rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;">
          <h4 style="color:var(--accent-primary);margin:0 0 0.5rem 0;">The Feynman Technique</h4>
          <p style="margin:0;font-size:0.9rem;color:var(--text-secondary);">Prompt the AI: "Explain quantum superposition or photosynthesis as if I were a 12-year-old using simple real-world analogies."</p>
        </div>
        <div style="padding:1.25rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;">
          <h4 style="color:var(--accent-secondary);margin:0 0 0.5rem 0;">Adaptive Quiz Generation</h4>
          <p style="margin:0;font-size:0.9rem;color:var(--text-secondary);">Ask the AI to generate 5 challenging case-study multiple choice questions based on a specific textbook chapter to test application skills.</p>
        </div>
        <div style="padding:1.25rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;">
          <h4 style="color:#10b981;margin:0 0 0.5rem 0;">Code & Logic Debugging</h4>
          <p style="margin:0;font-size:0.9rem;color:var(--text-secondary);">Paste problematic code or chemical equations and ask the AI to explain the underlying conceptual bug rather than simply giving the solution.</p>
        </div>
      </div>
    </article>

    <!-- Pillar 5: Scientific Writing & Research Literacy -->
    <article style="background:var(--card-bg);padding:3rem 2.5rem;border-radius:24px;border:1px solid var(--card-border);box-shadow:0 15px 40px rgba(0,0,0,.5);margin-bottom:2.5rem">
      <span style="display:inline-block;padding:4px 12px;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.3);border-radius:20px;color:#fbbf24;font-size:0.85rem;font-weight:700;margin-bottom:1rem;">Discipline 05 • Research Literacy</span>
      <h2 style="color:var(--text-primary);font-size:1.85rem;margin-top:0;margin-bottom:1rem;font-family:'Space Grotesk',sans-serif">Developing Scientific Writing, Data Literacy &amp; Critical Thinking</h2>
      <p style="margin-bottom:1.25rem">
        Beyond raw factual knowledge, modern education requires rigorous scientific literacy—the ability to evaluate claims, interpret empirical charts, identify statistical biases, and construct persuasive evidence-based arguments.
      </p>
      <ul style="padding-left:1.25rem;margin:0;line-height:1.9;">
        <li><strong style="color:var(--text-primary);">Distinguish Correlation from Causation:</strong> Two variables rising together does not imply that one causes the other. Always investigate lurking confounding variables.</li>
        <li><strong style="color:var(--text-primary);">Peer Review &amp; Reproducibility:</strong> Look for findings replicated across multiple independent studies rather than relying on a single sensationalized headline.</li>
        <li><strong style="color:var(--text-primary);">Structured Analytical Writing:</strong> Master the Claim-Evidence-Reasoning (CER) framework in lab reports and essays to build airtight academic arguments.</li>
      </ul>
    </article>
`;

const educationFiles = [
  path.join(__dirname, '../education.html'),
  path.join(__dirname, '../education/index.html')
];

for (const file of educationFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('Discipline 04 • AI in Education')) {
    content = content.replace(/(<\/div>\s*<\/section>)/i, educationArticles + '\n  $1');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Enriched ' + file);
  }
}

// ==========================================
// 4. LEARNING GK QUIZ ENRICHMENT
// ==========================================
const gkQuizGuide = `
    <!-- Comprehensive GK Mastery & Competitive Exam Strategy Guide -->
    <section class="hg-guide-section" style="max-width:800px; margin:3rem auto 2.5rem;">
      <h2>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        Mastering General Knowledge: Active Recall &amp; Competitive Exam Strategies
      </h2>
      <p>
        General Knowledge is the backbone of Indian competitive testing. 
        Whether you are preparing for civil service examinations (UPSC CSE, State PSCs), graduate aptitude tests (SSC CGL), railway boards (RRB), or national eligibility tests, 
        consistent multiple-choice question (MCQ) practice trains speed, accuracy, and elimination intuition.
      </p>

      <h3>The 3-Step MCQ Elimination Technique</h3>
      <div class="hg-guide-grid">
        <div class="hg-guide-card">
          <h4>1. Rule Out Extreme Language</h4>
          <p>Options containing absolute words like "Always", "Never", "Exclusively", or "Under all circumstances" in humanities and geography questions are statistically incorrect in 85%+ of cases.</p>
        </div>
        <div class="hg-guide-card">
          <h4>2. Pairwise Contradiction</h4>
          <p>If two answer choices directly contradict each other (e.g. Option A: "Causes inflation" vs Option B: "Causes deflation"), one of those two choices is almost certainly the correct answer.</p>
        </div>
        <div class="hg-guide-card">
          <h4>3. Spaced Daily Repetition</h4>
          <p>Review missed questions within 24 hours and again after 7 days. This spaced repetition protocol transfers facts from fragile working memory to durable cortical storage.</p>
        </div>
      </div>

      <h2>Frequently Asked Questions (FAQ)</h2>
      <div class="hg-faq-item">
        <h4>How many questions are in this daily quiz?</h4>
        <p>This quick evaluation quiz presents 10 high-yield questions covering Indian history, constitution, physical geography, and general science with instant scoring and performance grading.</p>
      </div>
      <div class="hg-faq-item">
        <h4>Where can I find more in-depth quizzes?</h4>
        <p>For an expanded full-length trivia challenge with hundreds of rotating questions across regional history, sports milestones, and national awards, explore our dedicated <a href="/Quiz%20India/" style="color:#60a5fa;">Quiz India Game</a>.</p>
      </div>
    </section>
`;

const gkFiles = [
  path.join(__dirname, '../learning/gk-quiz.html'),
  path.join(__dirname, '../learning/gk-quiz/index.html')
];

for (const file of gkFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('Mastering General Knowledge: Active Recall')) {
    content = content.replace(/(<\/main>)/i, gkQuizGuide + '\n$1');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Enriched ' + file);
  }
}
