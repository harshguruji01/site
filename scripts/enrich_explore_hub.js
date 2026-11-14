const fs = require('fs');
const path = require('path');

const EXPLORE_SOURCES = {
  education: [
    { id: 'edu1', title: 'MIT OpenCourseWare', desc: 'Free access to thousands of MIT course materials for self-learners and educators worldwide.', category: 'Education', icon: '🎓', source: 'MIT', url: 'https://ocw.mit.edu/' },
    { id: 'edu2', title: 'Khan Academy', desc: 'Free world-class online courses, interactive practice lessons, and personalized learning dashboard.', category: 'Education', icon: '🏫', source: 'Khan Academy', url: 'https://www.khanacademy.org/' },
    { id: 'edu3', title: 'Coursera', desc: 'Build job-relevant skills with courses, certificates, and degree programs from leading universities.', category: 'Education', icon: '💻', source: 'Coursera', url: 'https://www.coursera.org/' },
    { id: 'edu4', title: 'edX', desc: 'Access 2,000+ free online courses from over 140 premier global institutions including Harvard and MIT.', category: 'Education', icon: '📚', source: 'edX', url: 'https://www.edx.org/' },
    { id: 'edu-quiz-india', title: 'Quiz India Game', desc: 'Interactive General Knowledge quiz & trivia game testing your Indian history, geography, science, polity, and world GK.', category: 'Education', icon: '🇮🇳', source: 'HarshGuruJi', url: 'Quiz India/index.html' }
  ],
  ai: [
    { id: 'ai1', title: 'ChatGPT', desc: "OpenAI's flagship conversational generative AI model for coding, brainstorming, and productivity.", category: 'AI', icon: '🤖', source: 'OpenAI', url: 'https://chat.openai.com/' },
    { id: 'ai2', title: 'Google Gemini', desc: "Google's advanced multimodal AI foundation model built from the ground up for cross-modal reasoning.", category: 'AI', icon: '✨', source: 'Google', url: 'https://gemini.google.com/' },
    { id: 'ai3', title: 'Hugging Face', desc: 'The leading open-source AI platform and hub for pre-trained machine learning models and datasets.', category: 'AI', icon: '🤗', source: 'Hugging Face', url: 'https://huggingface.co/' },
    { id: 'ai4', title: 'Anthropic Claude', desc: 'Next-generation constitutional AI assistant focused on safe, helpful, and reliable enterprise dialogue.', category: 'AI', icon: '🧠', source: 'Anthropic', url: 'https://claude.ai/' }
  ],
  technology: [
    { id: 'tech1', title: 'MDN Web Docs', desc: 'Comprehensive, battle-tested documentation and resources for web developers, maintained by Mozilla.', category: 'Technology', icon: '🌐', source: 'Mozilla', url: 'https://developer.mozilla.org/' },
    { id: 'tech2', title: 'GitHub', desc: "The world's leading software development and version control platform powered by Git.", category: 'Technology', icon: '🐙', source: 'GitHub', url: 'https://github.com/' },
    { id: 'tech3', title: 'Stack Overflow', desc: 'The premier global knowledge base where software engineers learn, share knowledge, and solve bugs.', category: 'Technology', icon: '💻', source: 'Stack Exchange', url: 'https://stackoverflow.com/' },
    { id: 'tech4', title: 'W3Schools', desc: "The world's largest web developer learning platform with interactive tutorials and live code sandboxes.", category: 'Technology', icon: '🛠️', source: 'W3Schools', url: 'https://www.w3schools.com/' }
  ],
  science: [
    { id: 'sci1', title: 'Nature', desc: "The world's foremost peer-reviewed weekly scientific journal covering all disciplines.", category: 'Science', icon: '🔬', source: 'Nature', url: 'https://www.nature.com/' },
    { id: 'sci2', title: 'ScienceDaily', desc: 'Breaking science news, latest research findings, and scientific discoveries updated daily.', category: 'Science', icon: '📰', source: 'ScienceDaily', url: 'https://www.sciencedaily.com/' },
    { id: 'sci3', title: 'Scientific American', desc: 'Authoritative coverage of the most remarkable discoveries and advancements in science and technology.', category: 'Science', icon: '🌎', source: 'Scientific American', url: 'https://www.scientificamerican.com/' },
    { id: 'sci4', title: 'CERN', desc: 'European Organization for Nuclear Research probing fundamental particles and laws of the universe.', category: 'Science', icon: '⚛️', source: 'CERN', url: 'https://home.cern/' }
  ],
  space: [
    { id: 'spc1', title: 'NASA', desc: 'National Aeronautics and Space Administration leading human exploration of the Moon and Mars.', category: 'Space', icon: '🚀', source: 'NASA', url: 'https://www.nasa.gov/' },
    { id: 'spc2', title: 'SpaceX', desc: 'Designing, manufacturing, and launching revolutionary orbital rockets and interplanetary spacecraft.', category: 'Space', icon: '🛰️', source: 'SpaceX', url: 'https://www.spacex.com/' },
    { id: 'spc3', title: 'ESA', desc: 'European Space Agency coordinating gateway space exploration and Earth observation programs.', category: 'Space', icon: '🌌', source: 'ESA', url: 'https://www.esa.int/' },
    { id: 'spc4', title: 'Hubble & James Webb', desc: "Deep cosmic imagery and monumental discoveries from humanity's most powerful space telescopes.", category: 'Space', icon: '🔭', source: 'HubbleSite', url: 'https://hubblesite.org/' }
  ],
  cybersecurity: [
    { id: 'cyb1', title: 'OWASP Foundation', desc: 'Open Web Application Security Project setting industry benchmarks for secure web applications.', category: 'Cybersecurity', icon: '🔐', source: 'OWASP', url: 'https://owasp.org/' },
    { id: 'cyb2', title: 'NIST Cybersecurity', desc: 'Standardized federal guidelines, best practices, and risk management frameworks for modern security.', category: 'Cybersecurity', icon: '🛡️', source: 'NIST', url: 'https://www.nist.gov/cybersecurity' },
    { id: 'cyb3', title: 'Hack The Box', desc: 'Gamified cybersecurity training platform with real-world hands-on pentesting challenges and labs.', category: 'Cybersecurity', icon: '🏴‍☠️', source: 'Hack The Box', url: 'https://www.hackthebox.com/' },
    { id: 'cyb4', title: 'Cybrary', desc: 'Interactive cybersecurity and IT career training platform with guided lab workflows.', category: 'Cybersecurity', icon: '💻', source: 'Cybrary', url: 'https://www.cybrary.it/' }
  ]
};

function buildHtmlCards(items) {
  return items.map(item => `
        <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="explore-card" aria-label="${item.title} - ${item.category}">
          <div class="card-header-row">
            <div class="card-icon">${item.icon}</div>
            <span class="card-badge">${item.category}</span>
          </div>
          <h3 class="card-title">${item.title}</h3>
          <p class="card-desc">${item.desc}</p>
          <div class="card-meta">
            <span class="card-source">${item.source}</span>
            <span class="card-action">Explore ↗</span>
          </div>
        </a>`).join('\n');
}

const exploreEditorial = `
    <!-- Comprehensive Editorial & Directory Methodology Guide -->
    <div class="hg-guide-section" style="margin-top:3.5rem;">
      <h2>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
        HarshGuruJi Global Knowledge Directory: Editorial Curation &amp; Methodology
      </h2>
      <p>
        The <strong>HarshGuruJi Explore Hub</strong> is a hand-curated educational and technological knowledge index. 
        In an internet saturated with algorithmic clickbait, content farms, and unverified AI aggregators, finding authoritative primary sources, peer-reviewed scientific journals, and industry-standard developer platforms has become increasingly difficult.
        HarshGuruJi maintains strict editorial guidelines to connect students, researchers, developers, and educators with verified, high-authority digital resources across science, AI, technology, cybersecurity, space exploration, and open literature.
      </p>

      <div class="hg-trust-banner">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        <div>
          <strong>Strict Editorial Quality Standards:</strong> Every resource listed on the HarshGuruJi Explore directory is manually audited for academic validity, HTTPS security standards, absence of malicious adware, and ongoing structural maintenance.
        </div>
      </div>

      <h3>Our 4-Point Curation Standard</h3>
      <div class="hg-guide-grid">
        <div class="hg-guide-card">
          <h4>1. Primary Authority &amp; Trust</h4>
          <p>We prioritize foundational institutions and creators: universities (MIT, Harvard), national space agencies (NASA, ESA), official standards organizations (NIST, W3C), and established peer-reviewed journals (Nature).</p>
        </div>
        <div class="hg-guide-card">
          <h4>2. Open Access &amp; Educational Equity</h4>
          <p>We champion free and open-source learning. Platforms providing open courseware, free public APIs, open scientific preprints (arXiv), and public domain books receive top editorial priority.</p>
        </div>
        <div class="hg-guide-card">
          <h4>3. Zero Malware &amp; Commercial Independence</h4>
          <p>We never accept sponsored paid placements that compromise editorial integrity. Every link is verified to be free of deceptive downloads, paywall traps, or predatory tracking scripts.</p>
        </div>
        <div class="hg-guide-card">
          <h4>4. Continuous Verification &amp; Freshness</h4>
          <p>Links and APIs are audited on a weekly schedule. Broken endpoints, decommissioned tools, or outdated platforms are purged or updated promptly to maintain an accurate directory.</p>
        </div>
      </div>

      <h2>Frequently Asked Questions (FAQ)</h2>
      <div class="hg-faq-item">
        <h4>How can I suggest a new resource or scientific tool for the Explore directory?</h4>
        <p>If you have authored or discovered a premier educational resource, developer utility, or scientific database that aligns with our standards, submit a recommendation via our official contact channel at <a href="mailto:contact@webguruji.online" style="color:#60a5fa;">contact@webguruji.online</a>. Our editorial team reviews submissions on a rolling monthly basis.</p>
      </div>
      <div class="hg-faq-item">
        <h4>Are external platforms linked in Explore affiliated with HarshGuruJi?</h4>
        <p>All trademarks, logos, and external resources belong to their respective creators and organizations. HarshGuruJi provides independent editorial curation to assist users in navigating verified digital knowledge bases.</p>
      </div>
      <div class="hg-faq-item">
        <h4>Does HarshGuruJi charge fees for accessing listed resources?</h4>
        <p>No. Access to the HarshGuruJi Explore directory is 100% free. The vast majority of featured destinations offer substantial free learning tiers, open-access research papers, and public code repositories.</p>
      </div>
    </div>
`;

const exploreFiles = [
  path.join(__dirname, '../explore.html'),
  path.join(__dirname, '../explore/index.html')
];

for (const file of exploreFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Pre-render static cards for each category if container is currently empty
  for (const [cat, items] of Object.entries(EXPLORE_SOURCES)) {
    const gridRegex = new RegExp(`<div id="${cat}-grid" class="explore-grid">([\\s\\S]*?)<\\/div>`, 'i');
    const cardsHtml = buildHtmlCards(items);
    content = content.replace(gridRegex, `<div id="${cat}-grid" class="explore-grid">${cardsHtml}\n      </div>`);
  }

  // Append editorial section before </main>
  if (!content.includes('HarshGuruJi Global Knowledge Directory: Editorial Curation &amp; Methodology')) {
    content = content.replace(/(<\/main>)/i, exploreEditorial + '\n  $1');
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Enriched ' + file);
}
