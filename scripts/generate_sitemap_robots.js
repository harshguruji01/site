const fs = require('fs');
const path = require('path');

const today = '2026-10-20';
const baseUrl = 'https://webguruji.online';

// ============================================================================
// 1. COMPREHENSIVE URL DEFINITIONS FOR MAIN SITE (webguruji.online)
// ============================================================================
const pages = [
  // A. Flagship Homepage & Direct Portals
  {
    loc: `${baseUrl}/`,
    lastmod: today,
    changefreq: 'daily',
    priority: '1.0',
    title: 'HarshGuruJi — Official Multi-Utility Platform & Technology Ecosystem',
    image: `${baseUrl}/logo-512.png`
  },
  {
    loc: `${baseUrl}/index.html`,
    lastmod: today,
    changefreq: 'daily',
    priority: '1.0',
    title: 'HarshGuruJi Official Portal',
    image: `${baseUrl}/logo.png`
  },

  // B. ChatBase Ecosystem (Downloads & Messaging)
  {
    loc: `${baseUrl}/chat-app.html`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.95',
    title: 'Download ChatBase App — Official Android APK & Feature Showcase',
    image: `${baseUrl}/chatbase.png`
  },
  {
    loc: `${baseUrl}/chat.html`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.90',
    title: 'HarshGuruJi Chat — Real-Time 1-on-1 Messaging Application',
    image: `${baseUrl}/chatbase.png`
  },

  // C. App Store & Software Catalog
  {
    loc: `${baseUrl}/store.html`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.95',
    title: 'HarshGuruJi Store — Curated Android APK & Premium Mod Games Catalog',
    image: `${baseUrl}/logo-512.png`
  },
  {
    loc: `${baseUrl}/store-detail.html`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.85',
    title: 'Application Details & Direct APK Downloader — HarshGuruJi Store'
  },
  {
    loc: `${baseUrl}/store-detail.html?slug=chess`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.90',
    title: 'Master Chess 3D — HarshGuruJi Store'
  },
  {
    loc: `${baseUrl}/store-detail.html?slug=chatbase`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.95',
    title: 'ChatBase Android App APK — HarshGuruJi Store'
  },
  {
    loc: `${baseUrl}/store-detail.html?slug=hp-tube`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.90',
    title: 'GuruTube — HarshGuruJi Store'
  },
  {
    loc: `${baseUrl}/store-detail.html?slug=system-service`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'System Service Utility — HarshGuruJi Store'
  },
  {
    loc: `${baseUrl}/store-detail.html?slug=perplexity-ai-installer`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'Perplexity AI Installer — HarshGuruJi Store'
  },
  {
    loc: `${baseUrl}/store-detail.html?slug=bluestacks-installer`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'BlueStacks Android Emulator — HarshGuruJi Store'
  },
  {
    loc: `${baseUrl}/store-detail.html?slug=aurora-store`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'Aurora Store Client — HarshGuruJi Store'
  },
  {
    loc: `${baseUrl}/store-detail.html?slug=comet`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'Comet Browser & Productivity — HarshGuruJi Store'
  },
  {
    loc: `${baseUrl}/store-detail.html?slug=hermes-ai-agent`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'Hermes AI Agent — HarshGuruJi Store'
  },
  {
    loc: `${baseUrl}/app.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'HarshGuruJi Mobile Ecosystem & APK Downloader'
  },

  // D. Books & Education Library (NCERT Digital Curriculum)
  {
    loc: `${baseUrl}/books.html`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.95',
    title: 'NCERT Books & Chapter Library Classes 1-12 — Free PDF Downloads'
  },
  {
    loc: `${baseUrl}/books.html?class=12`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'NCERT Class 12 Textbooks & Chapter PDFs'
  },
  {
    loc: `${baseUrl}/books.html?class=11`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'NCERT Class 11 Textbooks & Chapter PDFs'
  },
  {
    loc: `${baseUrl}/books.html?class=10`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.90',
    title: 'NCERT Class 10 Science, Maths & Social Textbooks'
  },
  {
    loc: `${baseUrl}/books.html?class=9`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'NCERT Class 9 Textbooks & Chapter PDFs'
  },
  {
    loc: `${baseUrl}/education.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'Education Center & Academic Study Portal — HarshGuruJi'
  },
  {
    loc: `${baseUrl}/learning-hub.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'Learning Hub — Comprehensive Study Curriculums'
  },
  {
    loc: `${baseUrl}/learning.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.80',
    title: 'Interactive Learning & Skill Building Portal'
  },
  {
    loc: `${baseUrl}/learning/pdf-library.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.80',
    title: 'Official NCERT PDF Library & Offline Reader'
  },
  {
    loc: `${baseUrl}/learning/class.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.80',
    title: 'Class-Wise Curriculum Index'
  },
  {
    loc: `${baseUrl}/learning/subject.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.80',
    title: 'Subject Index — Science, Mathematics, Humanities'
  },
  {
    loc: `${baseUrl}/learning/chapter.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.80',
    title: 'Chapter Explorer & Summary Reader'
  },
  {
    loc: `${baseUrl}/learning/class-10-science.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.80',
    title: 'Class 10 Science Complete Chapter Notes & NCERT Solutions'
  },
  {
    loc: `${baseUrl}/learning/class-10/science/ncert/01-chemical-reactions-and-equations.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.75',
    title: 'Chapter 1: Chemical Reactions and Equations NCERT Guide'
  },
  {
    loc: `${baseUrl}/learning/gk-quiz.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.80',
    title: 'General Knowledge & Competitive Exam Quiz'
  },
  {
    loc: `${baseUrl}/Quiz%20India/index.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'Quiz India National Trivia Portal'
  },

  // E. Free Tools & Online Productivity Utilities
  {
    loc: `${baseUrl}/free-tools.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.90',
    title: 'Free Web Utilities & Online Developer Tools — HarshGuruJi'
  },
  {
    loc: `${baseUrl}/tools.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'Full Online Tools Directory'
  },
  {
    loc: `${baseUrl}/tools/password-generator.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'Secure Password Generator Tool — 256-Bit Strong Encryption'
  },
  {
    loc: `${baseUrl}/tools/word-counter.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'Real-Time Word & Character Counter Tool'
  },
  {
    loc: `${baseUrl}/tools/json-formatter.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'JSON Formatter, Validator & Beautifier Tool'
  },
  {
    loc: `${baseUrl}/tools/case-converter.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.80',
    title: 'Text Case Converter — Uppercase, Lowercase, Title Case'
  },
  {
    loc: `${baseUrl}/tools/base64.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.80',
    title: 'Base64 Encoder & Decoder Utility'
  },
  {
    loc: `${baseUrl}/tools/bmi-calculator.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'Body Mass Index (BMI) Health Calculator'
  },
  {
    loc: `${baseUrl}/tools/percentage-calculator.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'Comprehensive Percentage & Discount Calculator'
  },

  // F. AI & Emerging Technology Hubs
  {
    loc: `${baseUrl}/ai-hub.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.90',
    title: 'Artificial Intelligence Innovation Hub — HarshGuruJi',
    image: `${baseUrl}/ai.png`
  },
  {
    loc: `${baseUrl}/ai.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.80',
    title: 'AI Tools & Assistant Innovations'
  },
  {
    loc: `${baseUrl}/technology.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'Technology Insights, Software & Computing Guides'
  },

  // G. Gaming Arcade & Mini-Games
  {
    loc: `${baseUrl}/gaming-hub.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'Gaming Hub — Browser Games & Android Game APKs'
  },
  {
    loc: `${baseUrl}/gaming.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.80',
    title: 'Gaming Portal & Classic Mini-Games'
  },
  {
    loc: `${baseUrl}/games/snake.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.80',
    title: 'Classic Retro Snake Game — Play Online'
  },
  {
    loc: `${baseUrl}/games/tic-tac-toe.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.80',
    title: 'Tic Tac Toe 2-Player & AI Game'
  },
  {
    loc: `${baseUrl}/games/memory.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.80',
    title: 'Memory Card Flip Puzzle Challenge'
  },

  // H. Editorial, Daily Specials, Insights & Showcase
  {
    loc: `${baseUrl}/daily-special.html`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.90',
    title: 'Daily Special — Curated Daily Apps, Quotes & Insights'
  },
  {
    loc: `${baseUrl}/daily-life.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.80',
    title: 'Daily Life Hacks, Productive Habits & Lifestyle'
  },
  {
    loc: `${baseUrl}/insights.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.80',
    title: 'Technical Insights, Articles & Tech Editorial'
  },
  {
    loc: `${baseUrl}/explore.html`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.85',
    title: 'Explore HarshGuruJi Ecosystem'
  },
  {
    loc: `${baseUrl}/ads.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.80',
    title: 'Partner Network & Advertisements — HarshGuruJi Curated Directory',
    image: `${baseUrl}/logo-512.png`
  },
  {
    loc: `${baseUrl}/appearance.html`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.75',
    title: 'Platform Theme & Appearance Customizer — HarshGuruJi'
  },

  // I. Founder, Community & Contributor Network
  {
    loc: `${baseUrl}/owner.html`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.95',
    title: 'About Harsh Patel — Founder & Lead Architect of HarshGuruJi'
  },
  {
    loc: `${baseUrl}/about.html`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.80',
    title: 'About HarshGuruJi Platform Vision & Team'
  },
  {
    loc: `${baseUrl}/contributor.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'Verified Contributors & Creators Network — HarshGuruJi'
  },
  {
    loc: `${baseUrl}/join-contributor.html`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.80',
    title: 'Join HarshGuruJi as an Open Contributor'
  },
  {
    loc: `${baseUrl}/apply-contributor.html`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.80',
    title: 'Apply for Contributor Role & Claim Golden Tick Verification'
  },
  {
    loc: `${baseUrl}/verify-contributor.html`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.80',
    title: 'Verify Contributor Badge & Credentials — HarshGuruJi'
  },
  {
    loc: `${baseUrl}/contact.html`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.80',
    title: 'Contact HarshGuruJi Support Desk & Direct Inquiry'
  },

  // J. Authentication Portals (Publicly Indexable)
  {
    loc: `${baseUrl}/login.html`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.70',
    title: 'Login to HarshGuruJi Account'
  },
  {
    loc: `${baseUrl}/signup.html`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.70',
    title: 'Create Free HarshGuruJi Account'
  },
  {
    loc: `${baseUrl}/forgot-password.html`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.50',
    title: 'Forgot Password Recovery'
  },

  // K. Legal, Compliance & AdSense Required Policies
  {
    loc: `${baseUrl}/privacy-policy.html`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.60',
    title: 'Privacy Policy — HarshGuruJi'
  },
  {
    loc: `${baseUrl}/terms-and-conditions.html`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.60',
    title: 'Terms and Conditions of Use'
  },
  {
    loc: `${baseUrl}/cookie.html`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.50',
    title: 'Cookie Consent & Tracking Policy'
  }
];

// XML Builder Helper
function buildXml(urlList) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd
        http://www.google.com/schemas/sitemap-image/1.1
        http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd">
`;

  urlList.forEach(p => {
    xml += `  <url>\n`;
    xml += `    <loc>${p.loc}</loc>\n`;
    xml += `    <lastmod>${p.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
    xml += `    <priority>${p.priority}</priority>\n`;
    if (p.image) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${p.image}</image:loc>\n`;
      if (p.title) {
        const safeTitle = p.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        xml += `      <image:title>${safeTitle}</image:title>\n`;
      }
      xml += `    </image:image>\n`;
    }
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;
  return xml;
}

// ============================================================================
// 2. SUBDOMAINS DEDICATED SITEMAP DEFINITIONS
// ============================================================================

// A. Store Subdomain (store.webguruji.online)
const storePages = [
  { loc: 'https://store.webguruji.online/', lastmod: today, changefreq: 'daily', priority: '1.0' },
  { loc: 'https://store.webguruji.online/store.html', lastmod: today, changefreq: 'daily', priority: '1.0' },
  { loc: 'https://store.webguruji.online/store-detail.html', lastmod: today, changefreq: 'daily', priority: '0.85' },
  { loc: 'https://store.webguruji.online/app.html', lastmod: today, changefreq: 'daily', priority: '0.90' },
  { loc: 'https://store.webguruji.online/owner.html', lastmod: today, changefreq: 'weekly', priority: '0.90' },
  { loc: 'https://store.webguruji.online/login.html', lastmod: today, changefreq: 'monthly', priority: '0.70' },
  { loc: 'https://store.webguruji.online/signup.html', lastmod: today, changefreq: 'monthly', priority: '0.70' },
  { loc: 'https://store.webguruji.online/store-detail.html?slug=chess', lastmod: today, changefreq: 'daily', priority: '0.90' },
  { loc: 'https://store.webguruji.online/store-detail.html?slug=chatbase', lastmod: today, changefreq: 'daily', priority: '0.95' },
  { loc: 'https://store.webguruji.online/store-detail.html?slug=hp-tube', lastmod: today, changefreq: 'daily', priority: '0.90' },
  { loc: 'https://store.webguruji.online/store-detail.html?slug=system-service', lastmod: today, changefreq: 'weekly', priority: '0.85' },
  { loc: 'https://store.webguruji.online/store-detail.html?slug=aurora-store', lastmod: today, changefreq: 'weekly', priority: '0.85' },
  { loc: 'https://store.webguruji.online/store-detail.html?slug=perplexity-ai-installer', lastmod: today, changefreq: 'weekly', priority: '0.85' },
  { loc: 'https://store.webguruji.online/store-detail.html?slug=bluestacks-installer', lastmod: today, changefreq: 'weekly', priority: '0.85' },
  { loc: 'https://store.webguruji.online/store-detail.html?slug=comet', lastmod: today, changefreq: 'weekly', priority: '0.85' },
  { loc: 'https://store.webguruji.online/store-detail.html?slug=hermes-ai-agent', lastmod: today, changefreq: 'weekly', priority: '0.85' },
  { loc: 'https://store.webguruji.online/data/apps.json', lastmod: today, changefreq: 'daily', priority: '0.80' }
];

// B. Books Subdomain (books.webguruji.online)
const booksPages = [
  { loc: 'https://books.webguruji.online/', lastmod: today, changefreq: 'daily', priority: '1.0' },
  { loc: 'https://books.webguruji.online/books.html', lastmod: today, changefreq: 'daily', priority: '1.0' },
  { loc: 'https://books.webguruji.online/owner.html', lastmod: today, changefreq: 'weekly', priority: '0.90' },
  { loc: 'https://books.webguruji.online/login.html', lastmod: today, changefreq: 'monthly', priority: '0.70' },
  { loc: 'https://books.webguruji.online/books.html?class=12', lastmod: today, changefreq: 'daily', priority: '0.95' },
  { loc: 'https://books.webguruji.online/books.html?class=11', lastmod: today, changefreq: 'daily', priority: '0.95' },
  { loc: 'https://books.webguruji.online/books.html?class=10', lastmod: today, changefreq: 'daily', priority: '0.95' },
  { loc: 'https://books.webguruji.online/books.html?class=9', lastmod: today, changefreq: 'daily', priority: '0.90' },
  { loc: 'https://books.webguruji.online/books.html?class=8', lastmod: today, changefreq: 'daily', priority: '0.90' },
  { loc: 'https://books.webguruji.online/books.html?class=7', lastmod: today, changefreq: 'daily', priority: '0.85' },
  { loc: 'https://books.webguruji.online/books.html?class=6', lastmod: today, changefreq: 'daily', priority: '0.85' },
  { loc: 'https://books.webguruji.online/books.html?class=5', lastmod: today, changefreq: 'daily', priority: '0.80' },
  { loc: 'https://books.webguruji.online/books.html?class=4', lastmod: today, changefreq: 'daily', priority: '0.80' },
  { loc: 'https://books.webguruji.online/books.html?class=3', lastmod: today, changefreq: 'daily', priority: '0.80' },
  { loc: 'https://books.webguruji.online/books.html?class=2', lastmod: today, changefreq: 'daily', priority: '0.75' },
  { loc: 'https://books.webguruji.online/books.html?class=1', lastmod: today, changefreq: 'daily', priority: '0.75' }
];

// C. Chat Subdomain (chat.webguruji.online)
const chatPages = [
  { loc: 'https://chat.webguruji.online/', lastmod: today, changefreq: 'daily', priority: '1.0' },
  { loc: 'https://chat.webguruji.online/chat.html', lastmod: today, changefreq: 'daily', priority: '1.0' },
  { loc: 'https://chat.webguruji.online/chat-app.html', lastmod: today, changefreq: 'daily', priority: '0.95' }
];

// D. AI Subdomain (ai.webguruji.online)
const aiPages = [
  { loc: 'https://ai.webguruji.online/', lastmod: today, changefreq: 'daily', priority: '1.0' },
  { loc: 'https://ai.webguruji.online/login', lastmod: today, changefreq: 'monthly', priority: '0.80' }
];

// ============================================================================
// 3. GENERATE SITEMAPS FOR MAIN SITE
// ============================================================================
const siteDir = path.join(__dirname, '..');

// 1. sitemap.xml (Main site)
const mainXml = buildXml(pages);
fs.writeFileSync(path.join(siteDir, 'sitemap.xml'), mainXml, 'utf8');
console.log(`Generated site/sitemap.xml with ${pages.length} URLs!`);

// 2. sitemap_store.xml
const storeXml = buildXml(storePages);
fs.writeFileSync(path.join(siteDir, 'sitemap_store.xml'), storeXml, 'utf8');

// 3. sitemap_books.xml
const booksXml = buildXml(booksPages);
fs.writeFileSync(path.join(siteDir, 'sitemap_books.xml'), booksXml, 'utf8');

// 4. sitemap_chat.xml
const chatXml = buildXml(chatPages);
fs.writeFileSync(path.join(siteDir, 'sitemap_chat.xml'), chatXml, 'utf8');

// 5. sitemap_ai.xml
const aiXml = buildXml(aiPages);
fs.writeFileSync(path.join(siteDir, 'sitemap_ai.xml'), aiXml, 'utf8');

// 6. sitemap_index.xml (Master index linking all sub-sitemaps)
const sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Platform Master Sitemap -->
  <sitemap>
    <loc>https://webguruji.online/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

  <!-- Store Subdomain & Dedicated App Catalog Sitemaps -->
  <sitemap>
    <loc>https://webguruji.online/sitemap_store.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://store.webguruji.online/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

  <!-- Books Subdomain & Educational Catalog Sitemaps -->
  <sitemap>
    <loc>https://webguruji.online/sitemap_books.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://books.webguruji.online/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

  <!-- Chat Subdomain & ChatBase Messaging Sitemaps -->
  <sitemap>
    <loc>https://webguruji.online/sitemap_chat.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://chat.webguruji.online/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

  <!-- AI Subdomain Sitemaps -->
  <sitemap>
    <loc>https://webguruji.online/sitemap_ai.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://ai.webguruji.online/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>
`;
fs.writeFileSync(path.join(siteDir, 'sitemap_index.xml'), sitemapIndexContent, 'utf8');
console.log(`Generated site/sitemap_index.xml linking all platform sitemaps!`);

// ============================================================================
// 4. GENERATE ROBOTS.TXT FOR MAIN SITE
// ============================================================================
const robotsContent = `# ═══════════════════════════════════════════════════════════════════════════
# robots.txt — HarshGuruJi Platform Ecosystem (webguruji.online)
# Full Google Search Console (GSC) & verified search bot crawl directives
# Last Updated: ${today}
# ═══════════════════════════════════════════════════════════════════════════

User-agent: *
Allow: /

# ── Primary Public Portals & Hubs ─────────────────────────────────────────
Allow: /index.html
Allow: /store.html
Allow: /store-detail.html
Allow: /books.html
Allow: /chat.html
Allow: /chat-app.html
Allow: /app.html
Allow: /ads.html
Allow: /free-tools.html
Allow: /tools.html
Allow: /ai-hub.html
Allow: /ai.html
Allow: /gaming-hub.html
Allow: /gaming.html
Allow: /learning-hub.html
Allow: /learning.html
Allow: /education.html
Allow: /technology.html
Allow: /daily-special.html
Allow: /daily-life.html
Allow: /insights.html
Allow: /explore.html
Allow: /owner.html
Allow: /about.html
Allow: /contact.html
Allow: /contributor.html
Allow: /join-contributor.html
Allow: /apply-contributor.html
Allow: /verify-contributor.html
Allow: /appearance.html
Allow: /login.html
Allow: /signup.html
Allow: /forgot-password.html
Allow: /privacy-policy.html
Allow: /terms-and-conditions.html
Allow: /cookie.html

# ── Interactive Subdirectories & Individual Utility Pages ──────────────────
Allow: /tools/
Allow: /tools/password-generator.html
Allow: /tools/word-counter.html
Allow: /tools/json-formatter.html
Allow: /tools/case-converter.html
Allow: /tools/base64.html
Allow: /tools/bmi-calculator.html
Allow: /tools/percentage-calculator.html

# ── Games ─────────────────────────────────────────────────────────────────
Allow: /games/
Allow: /games/snake.html
Allow: /games/tic-tac-toe.html
Allow: /games/memory.html

# ── Educational & Learning Pages ──────────────────────────────────────────
Allow: /learning/
Allow: /learning/pdf-library.html
Allow: /learning/class.html
Allow: /learning/subject.html
Allow: /learning/chapter.html
Allow: /learning/class-10-science.html
Allow: /learning/class-10/science/ncert/01-chemical-reactions-and-equations.html
Allow: /learning/gk-quiz.html
Allow: /Quiz India/
Allow: /Quiz India/index.html
Allow: /Quiz%20India/
Allow: /Quiz%20India/index.html

# ── Static Media, Stylesheets, Scripts & Fonts (Essential for GSC Rendering)
Allow: /css/
Allow: /js/
Allow: /*.css$
Allow: /*.js$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.webp$
Allow: /*.svg$
Allow: /*.ico$
Allow: /*.woff2$
Allow: /data/apps.json

# ── Disallow: Admin Operations, Private Portals & Internal Source Code ────
Disallow: /admin*
Disallow: /admin.html
Disallow: /admin/
Disallow: /admin-*.html
Disallow: /adminapkupload.html
Disallow: /adminbooks.html
Disallow: /admincontributors.html
Disallow: /admin-chatbase.html
Disallow: /admin-contacts.html
Disallow: /admin-requests.html
Disallow: /dashboard.html
Disallow: /settings.html
Disallow: /reset-password.html
Disallow: /backend/
Disallow: /backend_legacy/
Disallow: /oauth/
Disallow: /scripts/
Disallow: /.agents/
Disallow: /.git/
Disallow: /.github/
Disallow: /*.py$
Disallow: /*.sql$
Disallow: /*.md$
Disallow: /*.groovy$

# ── Googlebot Dedicated Group (Web Crawling) ──────────────────────────────
User-agent: Googlebot
Allow: /
Allow: /index.html
Allow: /chat-app.html
Allow: /store.html
Allow: /store-detail.html
Allow: /books.html
Allow: /chat.html
Allow: /app.html
Allow: /free-tools.html
Allow: /tools/
Allow: /games/
Allow: /learning/
Allow: /Quiz India/
Allow: /Quiz%20India/
Allow: /css/
Allow: /js/
Allow: /*.css$
Allow: /*.js$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.webp$
Disallow: /admin*
Disallow: /dashboard.html
Disallow: /settings.html
Disallow: /reset-password.html
Disallow: /backend/
Disallow: /oauth/

# ── Google Search Console Live Inspection Tool ────────────────────────────
User-agent: Google-InspectionTool
Allow: /
Allow: /index.html
Allow: /chat-app.html
Allow: /store.html
Allow: /store-detail.html
Allow: /books.html
Allow: /chat.html
Allow: /app.html
Allow: /free-tools.html
Allow: /tools/
Allow: /games/
Allow: /learning/
Allow: /Quiz India/
Allow: /Quiz%20India/
Allow: /css/
Allow: /js/
Allow: /*.css$
Allow: /*.js$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.webp$
Disallow: /admin*
Disallow: /dashboard.html
Disallow: /settings.html
Disallow: /reset-password.html

# ── Google Images Crawler ─────────────────────────────────────────────────
User-agent: Googlebot-Image
Allow: /
Allow: /logo.png
Allow: /logo-512.png
Allow: /chatbase.png
Allow: /chatbase-logo.png
Allow: /harshlogo.png
Allow: /harshlogo.webp
Allow: /ai.png
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.webp$

# ── Bingbot Group ─────────────────────────────────────────────────────────
User-agent: Bingbot
Allow: /
Disallow: /admin*
Disallow: /dashboard.html
Disallow: /settings.html
Disallow: /reset-password.html
Disallow: /backend/

# ── Polite Crawl-Delays for Third-Party SEO Scrapers ──────────────────────
User-agent: AhrefsBot
Crawl-delay: 10

User-agent: SemrushBot
Crawl-delay: 10

User-agent: DotBot
Crawl-delay: 10

# ── Official Sitemaps for Google Search Console ───────────────────────────
Sitemap: https://webguruji.online/sitemap.xml
Sitemap: https://webguruji.online/sitemap_index.xml
Sitemap: https://webguruji.online/sitemap_store.xml
Sitemap: https://webguruji.online/sitemap_books.xml
Sitemap: https://webguruji.online/sitemap_chat.xml
Sitemap: https://webguruji.online/sitemap_ai.xml
Sitemap: https://store.webguruji.online/sitemap.xml
Sitemap: https://books.webguruji.online/sitemap.xml
Sitemap: https://chat.webguruji.online/sitemap.xml
Sitemap: https://ai.webguruji.online/sitemap.xml
`;
fs.writeFileSync(path.join(siteDir, 'robots.txt'), robotsContent, 'utf8');
console.log(`Generated site/robots.txt (${robotsContent.length} bytes)!`);

// ============================================================================
// 5. DIRECT SYNC TO SUBDOMAIN REPOSITORIES
// ============================================================================
const subdomains = {
  store: path.join(__dirname, '..', '..', 'HarshGuruJi', 'store'),
  books: path.join(__dirname, '..', '..', 'HarshGuruJi', 'books'),
  chatbase: path.join(__dirname, '..', '..', 'HarshGuruJi', 'chatbase'),
  ai: path.join(__dirname, '..', '..', 'HarshGuruJi', 'ai'),
};

// 1. Sync Store
if (fs.existsSync(subdomains.store)) {
  fs.writeFileSync(path.join(subdomains.store, 'sitemap.xml'), storeXml, 'utf8');
  fs.writeFileSync(path.join(subdomains.store, 'sitemap_index.xml'), sitemapIndexContent, 'utf8');
  
  const storeRobots = `# robots.txt — store.webguruji.online
User-agent: *
Allow: /
Allow: /store.html
Allow: /store-detail.html
Allow: /app.html
Allow: /owner.html
Allow: /login.html
Allow: /signup.html
Allow: /data/apps.json
Disallow: /admin*
Disallow: /dashboard.html
Disallow: /settings.html
Disallow: /reset-password.html
Disallow: /forgot-password.html

Sitemap: https://store.webguruji.online/sitemap.xml
Sitemap: https://store.webguruji.online/sitemap_index.xml
Sitemap: https://webguruji.online/sitemap_index.xml
Sitemap: https://webguruji.online/sitemap.xml
Sitemap: https://books.webguruji.online/sitemap.xml
Sitemap: https://chat.webguruji.online/sitemap.xml
Sitemap: https://ai.webguruji.online/sitemap.xml
`;
  fs.writeFileSync(path.join(subdomains.store, 'robots.txt'), storeRobots, 'utf8');
  console.log(`Synchronized Store subdomain sitemaps and robots.txt!`);
}

// 2. Sync Books
if (fs.existsSync(subdomains.books)) {
  fs.writeFileSync(path.join(subdomains.books, 'sitemap.xml'), booksXml, 'utf8');
  fs.writeFileSync(path.join(subdomains.books, 'sitemap_index.xml'), sitemapIndexContent, 'utf8');

  const booksRobots = `# robots.txt — books.webguruji.online
User-agent: *
Allow: /
Allow: /books.html
Allow: /owner.html
Allow: /login.html
Disallow: /admin*
Disallow: /dashboard.html
Disallow: /settings.html

Sitemap: https://books.webguruji.online/sitemap.xml
Sitemap: https://books.webguruji.online/sitemap_index.xml
Sitemap: https://webguruji.online/sitemap_index.xml
Sitemap: https://webguruji.online/sitemap.xml
Sitemap: https://store.webguruji.online/sitemap.xml
Sitemap: https://chat.webguruji.online/sitemap.xml
Sitemap: https://ai.webguruji.online/sitemap.xml
`;
  fs.writeFileSync(path.join(subdomains.books, 'robots.txt'), booksRobots, 'utf8');
  console.log(`Synchronized Books subdomain sitemaps and robots.txt!`);
}

// 3. Sync Chatbase
if (fs.existsSync(subdomains.chatbase)) {
  fs.writeFileSync(path.join(subdomains.chatbase, 'sitemap.xml'), chatXml, 'utf8');
  if (fs.existsSync(path.join(subdomains.chatbase, 'public'))) {
    fs.writeFileSync(path.join(subdomains.chatbase, 'public', 'sitemap.xml'), chatXml, 'utf8');
  }
  if (fs.existsSync(path.join(subdomains.chatbase, 'dist'))) {
    fs.writeFileSync(path.join(subdomains.chatbase, 'dist', 'sitemap.xml'), chatXml, 'utf8');
  }

  const chatRobots = `# robots.txt — chat.webguruji.online
User-agent: *
Allow: /
Allow: /chat.html
Allow: /chat-app.html
Disallow: /admin*

Sitemap: https://chat.webguruji.online/sitemap.xml
Sitemap: https://webguruji.online/sitemap_index.xml
Sitemap: https://webguruji.online/sitemap.xml
Sitemap: https://store.webguruji.online/sitemap.xml
Sitemap: https://books.webguruji.online/sitemap.xml
Sitemap: https://ai.webguruji.online/sitemap.xml
`;
  fs.writeFileSync(path.join(subdomains.chatbase, 'robots.txt'), chatRobots, 'utf8');
  if (fs.existsSync(path.join(subdomains.chatbase, 'public'))) {
    fs.writeFileSync(path.join(subdomains.chatbase, 'public', 'robots.txt'), chatRobots, 'utf8');
  }
  if (fs.existsSync(path.join(subdomains.chatbase, 'dist'))) {
    fs.writeFileSync(path.join(subdomains.chatbase, 'dist', 'robots.txt'), chatRobots, 'utf8');
  }
  console.log(`Synchronized Chatbase subdomain sitemaps and robots.txt!`);
}

// 4. Sync AI
if (fs.existsSync(subdomains.ai)) {
  fs.writeFileSync(path.join(subdomains.ai, 'sitemap.xml'), aiXml, 'utf8');
  if (fs.existsSync(path.join(subdomains.ai, 'public'))) {
    fs.writeFileSync(path.join(subdomains.ai, 'public', 'sitemap.xml'), aiXml, 'utf8');
  }

  const aiRobots = `# robots.txt — ai.webguruji.online
User-agent: *
Allow: /
Allow: /login
Disallow: /admin*
Disallow: /api/
Disallow: /auth/

Sitemap: https://ai.webguruji.online/sitemap.xml
Sitemap: https://webguruji.online/sitemap_index.xml
Sitemap: https://webguruji.online/sitemap.xml
Sitemap: https://store.webguruji.online/sitemap.xml
Sitemap: https://books.webguruji.online/sitemap.xml
Sitemap: https://chat.webguruji.online/sitemap.xml
`;
  fs.writeFileSync(path.join(subdomains.ai, 'robots.txt'), aiRobots, 'utf8');
  if (fs.existsSync(path.join(subdomains.ai, 'public'))) {
    fs.writeFileSync(path.join(subdomains.ai, 'public', 'robots.txt'), aiRobots, 'utf8');
  }
  console.log(`Synchronized AI subdomain sitemaps and robots.txt!`);
}

console.log('All platform sitemaps and robots.txt generated and synchronized successfully!');
