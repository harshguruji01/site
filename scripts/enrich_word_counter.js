const fs = require('fs');
const path = require('path');

const guideHtml = `
<section class="hg-guide-section">
  <h2>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
    Complete Guide: Text Analytics, Readability Metrics & Publishing Limits
  </h2>
  <p>
    In professional writing, journalism, academia, and search engine optimization (SEO), word and character limits govern editorial impact. 
    A title tag that exceeds 60 characters gets truncated on Google search engine results pages (SERPs); an academic research grant application with a strict 1,000-word ceiling will be disqualified for a single surplus word; and an email newsletter that exceeds 600 words sees dramatic drops in user click-through rates.
    The <strong>HarshGuruJi Word &amp; Character Counter</strong> provides instantaneous, real-time lexical analysis, sentence tracking, and speech pacing estimations right inside your browser.
  </p>

  <div class="hg-trust-banner">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <div>
      <strong>100% Confidential In-Browser Analysis:</strong> Your documents, essays, private manuscripts, and blog drafts are analyzed exclusively in local browser RAM. No text is ever uploaded to remote servers or third-party analytical endpoints.
    </div>
  </div>

  <h3>1. Platform Character &amp; Word Limits Cheat Sheet</h3>
  <div class="hg-table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Platform / Medium</th>
          <th>Standard Limit</th>
          <th>Recommended Best Practice</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Google Search Title Tag</strong></td>
          <td>~60 characters (600px)</td>
          <td>Keep primary target keywords within the first 50 characters to avoid mobile truncation.</td>
        </tr>
        <tr>
          <td><strong>Google Meta Description</strong></td>
          <td>~155 to 160 characters</td>
          <td>Include a clear call-to-action (CTA) and relevant entity keywords within 150 characters.</td>
        </tr>
        <tr>
          <td><strong>X (Twitter) Post</strong></td>
          <td>280 characters</td>
          <td>Leave 20-30 characters of buffer for mentions and high-engagement replies.</td>
        </tr>
        <tr>
          <td><strong>LinkedIn Article / Post</strong></td>
          <td>3,000 characters</td>
          <td>Place the key hook in the first 140 characters before the "see more" line break.</td>
        </tr>
        <tr>
          <td><strong>Instagram Caption</strong></td>
          <td>2,200 characters</td>
          <td>Front-load value in the first 125 characters; place hashtags at the bottom.</td>
        </tr>
        <tr>
          <td><strong>SEO Pillar Article</strong></td>
          <td>1,800 – 3,500 words</td>
          <td>Thoroughly resolve user search intent with structured headings (H2, H3), tables, and FAQs.</td>
        </tr>
        <tr>
          <td><strong>College Admissions Essay</strong></td>
          <td>500 – 650 words</td>
          <td>Focus on authentic narrative depth rather than filler adjectives.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h3>2. Readability Formulas: How Text Complexity Is Measured</h3>
  <p>
    Linguistic researchers have engineered mathematical formulas to quantify how easily readers can comprehend a written passage:
  </p>
  <div class="hg-guide-grid">
    <div class="hg-guide-card">
      <h4>Flesch Reading Ease Formula</h4>
      <div class="hg-formula-box" style="font-size:0.9rem;">Score = 206.835 - 1.015(Total Words / Total Sentences) - 84.6(Total Syllables / Total Words)</div>
      <p>Scores from 90–100 indicate 5th-grade reading level (very easy). Scores from 60–70 represent standard plain English suitable for general audiences. Scores below 30 denote complex academic literature.</p>
    </div>
    <div class="hg-guide-card">
      <h4>Flesch-Kincaid Grade Level</h4>
      <div class="hg-formula-box" style="font-size:0.9rem;">Grade = 0.39(Total Words / Total Sentences) + 11.8(Total Syllables / Total Words) - 15.59</div>
      <p>Translates reading ease directly into US school grade levels. Most commercial copywriters target an 8th-grade level (Grade 7.0–8.5) for optimal public conversion rates.</p>
    </div>
  </div>

  <h3>3. Speech and Reading Pacing Benchmarks</h3>
  <p>
    When converting written drafts into oral presentations, podcast scripts, or video voiceovers, word counts directly translate into runtime duration:
  </p>
  <ul>
    <li><strong>Silent Reading (Average Adult):</strong> 200 – 250 words per minute (WPM). A 1,000-word article takes ~4 to 5 minutes to read.</li>
    <li><strong>Audiobook Narrator Cadence:</strong> 150 – 160 WPM. Professional voice talent speaks deliberately to ensure diction clarity.</li>
    <li><strong>Public Keynote Speaking:</strong> 130 – 150 WPM. Pauses for visual slides, audience reactions, and emphasis require lower word density.</li>
    <li><strong>Podcast Discussion:</strong> 160 – 180 WPM. Energetic conversational back-and-forth moves slightly faster than prepared speeches.</li>
  </ul>

  <h2>Frequently Asked Questions (FAQ)</h2>
  <div class="hg-faq-item">
    <h4>Does this word counter count numbers and symbols as words?</h4>
    <p>Isolated standalone numbers (such as "2024" or "100") separated by spaces are counted as words, consistent with the counting algorithms in Google Docs and Microsoft Word. Punctuation attached to words (like commas, periods, or quotation marks) is not counted as independent words.</p>
  </div>
  <div class="hg-faq-item">
    <h4>How are hyphenated words handled?</h4>
    <p>Hyphenated compounds (such as "cutting-edge" or "user-friendly") are counted as a single word by default. If separated by spaces, they are registered as individual words.</p>
  </div>
  <div class="hg-faq-item">
    <h4>Can this tool count characters without spaces?</h4>
    <p>Yes. The tool tracks both total raw characters (including whitespace, tabs, and line breaks) and net characters, allowing you to comply with publishing guidelines that specify non-whitespace limits.</p>
  </div>
  <div class="hg-faq-item">
    <h4>How does sentence counting work with abbreviations like "Dr." or "e.g."?</h4>
    <p>Our sentence detection algorithm checks for terminal punctuation (periods, question marks, exclamation marks) followed by whitespace and capital letters, while accounting for common honorifics and academic abbreviations to prevent false sentence splits.</p>
  </div>
  <div class="hg-faq-item">
    <h4>Is there a maximum text limit I can paste?</h4>
    <p>Because processing occurs purely in local browser memory without network latency, you can comfortably paste complete novels, master's theses, or 100,000-word manuscripts for instantaneous statistical analysis.</p>
  </div>
</section>
`;

const schemaJson = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Does this word counter count numbers and symbols as words?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Standalone numbers separated by spaces are counted as individual words, mirroring the standard counting behavior of Google Docs and Microsoft Word."
      }
    },
    {
      "@type": "Question",
      "name": "How are hyphenated words handled?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Hyphenated compound words like 'cutting-edge' are counted as a single word according to standard publishing guidelines."
      }
    },
    {
      "@type": "Question",
      "name": "Can this tool count characters without spaces?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, both total characters with spaces and net characters without spaces are tracked simultaneously."
      }
    },
    {
      "@type": "Question",
      "name": "How does speech time estimation work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Speech duration is estimated at 130 to 150 words per minute, the standard comfortable pacing for public keynotes and presentations."
      }
    },
    {
      "@type": "Question",
      "name": "Is my pasted text saved on any server?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. All text parsing is 100% client-side in your browser's private memory sandbox with zero server uploads."
      }
    }
  ]
};

const schemaScript = `  <script type="application/ld+json">\n${JSON.stringify(schemaJson, null, 2)}\n  </script>\n`;

const files = [
  path.join(__dirname, '../tools/word-counter.html'),
  path.join(__dirname, '../tools/word-counter/index.html')
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Replace existing short hg-guide-section
  const regexGuide = /<section class="hg-guide-section">[\s\S]*?<\/section>/i;
  if (regexGuide.test(content)) {
    content = content.replace(regexGuide, guideHtml.trim());
  } else {
    content = content.replace('</main>', guideHtml.trim() + '\n</main>');
  }

  // Add FAQ schema if not present
  if (!content.includes('"@type": "FAQPage"')) {
    content = content.replace('</head>', schemaScript + '</head>');
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Enriched ' + file);
}
