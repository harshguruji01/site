const fs = require('fs');
const path = require('path');

const today = '2026-10-13';
const baseUrl = 'https://www.webguruji.online';

// Comprehensive URL definitions with SEO weights, change frequencies, and metadata
const pages = [
  // 1. Homepage & Primary Flagship Portals
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

  // 2. ChatBase Ecosystem (High Traffic Download & Showcase)
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

  // 3. HarshGuruJi App Store (High Priority)
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
    title: 'HP Tube — HarshGuruJi Store'
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

  // 4. Books & Educational Library (NCERT Catalog)
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
    loc: `${baseUrl}/Quiz%20India/`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'Quiz India — Interactive Knowledge & Trivia Challenge'
  },
  {
    loc: `${baseUrl}/Quiz%20India/index.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'Quiz India National Trivia Portal'
  },

  // 5. Free Tools & Productivity Hubs
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

  // 6. AI, Technology, Gaming & Special Features
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
    loc: `${baseUrl}/app.html`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.80',
    title: 'HarshGuruJi Mobile Ecosystem & Web Progressive App'
  },

  // 7. Community, Creator & Contributor Pages
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
    loc: `${baseUrl}/contact.html`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.80',
    title: 'Contact HarshGuruJi Support Desk & Direct Inquiry'
  },

  // 8. Authentication & Account Access
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
  {
    loc: `${baseUrl}/reset-password.html`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.50',
    title: 'Reset Account Password'
  },

  // 9. Legal, Compliance & AdSense Policies
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

// Build XML document
let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd
        http://www.google.com/schemas/sitemap-image/1.1
        http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd">
`;

pages.forEach(p => {
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

const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf8');
console.log(`Generated sitemap.xml with ${pages.length} verified URLs! (${xml.length} bytes)`);

// Build sitemap_index.xml
const sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Platform Sitemap -->
  <sitemap>
    <loc>https://www.webguruji.online/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

  <!-- Cross-Domain Subdomain Sitemaps -->
  <sitemap>
    <loc>https://store.webguruji.online/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://books.webguruji.online/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://chat.webguruji.online/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>
`;

const sitemapIndexPath = path.join(__dirname, '..', 'sitemap_index.xml');
fs.writeFileSync(sitemapIndexPath, sitemapIndexContent, 'utf8');
console.log(`Generated sitemap_index.xml (${sitemapIndexContent.length} bytes)`);

// Build state-of-the-art robots.txt
const robotsContent = `# ═══════════════════════════════════════════════════════════════════════════
# robots.txt — HarshGuruJi Platform Ecosystem (www.webguruji.online)
# Clean, indexable directives for Googlebot, Bingbot & verified search crawlers
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
Allow: /login.html
Allow: /signup.html
Allow: /forgot-password.html
Allow: /reset-password.html
Allow: /privacy-policy.html
Allow: /terms-and-conditions.html
Allow: /cookie.html

# ── Interactive Subdirectories (Tools, Games, Quizzes) ────────────────────
Allow: /tools/
Allow: /games/
Allow: /learning/
Allow: /Quiz%20India/

# ── Static Media & Asset Indexing (Googlebot-Image & Rich Snippets) ───────
Allow: /css/
Allow: /js/
Allow: /logo.png
Allow: /logo-512.png
Allow: /chatbase.png
Allow: /chatbase-logo.png
Allow: /favicon.ico
Allow: /harshlogo.png
Allow: /harshlogo.webp
Allow: /ai.png
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
Disallow: /appearance.html
Disallow: /verify-contributor.html
Disallow: /ads.html
Disallow: /backend/
Disallow: /backend_legacy/
Disallow: /oauth/
Disallow: /scripts/
Disallow: /.agents/
Disallow: /.git/
Disallow: /.github/
Disallow: /data/
Disallow: /*.py$
Disallow: /*.sql$
Disallow: /*.md$
Disallow: /*.json$
Disallow: /*.groovy$

# ── Googlebot Specific Allowances ─────────────────────────────────────────
User-agent: Googlebot
Allow: /
Allow: /chat-app.html
Allow: /store.html
Allow: /books.html
Allow: /tools/
Allow: /games/
Disallow: /admin*
Disallow: /dashboard.html
Disallow: /settings.html

User-agent: Googlebot-Image
Allow: /
Allow: /logo.png
Allow: /logo-512.png
Allow: /chatbase.png
Allow: /chatbase-logo.png
Allow: /ai.png

# ── Polite Crawl-Delays for Aggressive SEO Scrapers ───────────────────────
User-agent: AhrefsBot
Crawl-delay: 10

User-agent: SemrushBot
Crawl-delay: 10

User-agent: DotBot
Crawl-delay: 10

# ── Official Production Sitemaps ──────────────────────────────────────────
Sitemap: https://www.webguruji.online/sitemap.xml
Sitemap: https://www.webguruji.online/sitemap_index.xml

# ── Cross-Domain Subdomain Sitemaps ───────────────────────────────────────
Sitemap: https://store.webguruji.online/sitemap.xml
Sitemap: https://books.webguruji.online/sitemap.xml
Sitemap: https://chat.webguruji.online/sitemap.xml
`;

const robotsPath = path.join(__dirname, '..', 'robots.txt');
fs.writeFileSync(robotsPath, robotsContent, 'utf8');
console.log(`Generated robots.txt (${robotsContent.length} bytes)`);
