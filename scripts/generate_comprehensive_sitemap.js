const fs = require('fs');
const path = require('path');

const TODAY = '2026-11-08';

const pages = [
  // ── Core Landing & Central Hubs (1.0 - 0.95) ──
  { loc: 'https://webguruji.online/', priority: '1.0', changefreq: 'daily', title: 'HarshGuruJi — Official Multi-Utility Platform & Technology Ecosystem', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/explore/', priority: '0.95', changefreq: 'daily', title: 'HarshGuruJi Explore & Discover - Directory of Top Web Knowledge', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/free-tools/', priority: '0.95', changefreq: 'daily', title: 'HarshGuruJi Free Online Tools - Calculators, Converters & Formatters', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/tools/', priority: '0.95', changefreq: 'daily', title: 'HarshGuruJi Tools Hub - Developer Utilities & Browser Tools', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/ai-hub/', priority: '0.95', changefreq: 'daily', title: 'HarshGuruJi AI Directory - Curated AI Tools, Prompts & Resources', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/ai/', priority: '0.95', changefreq: 'daily', title: 'HarshGuruJi AI Directory - Official Artificial Intelligence Hub', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/gaming-hub/', priority: '0.95', changefreq: 'daily', title: 'HarshGuruJi Gaming Hub - Play Free Browser Games Online', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/gaming/', priority: '0.95', changefreq: 'daily', title: 'HarshGuruJi Gaming Portal - Free Online Web Games', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/games/', priority: '0.95', changefreq: 'daily', title: 'HarshGuruJi Games Arcade - Play Instant Browser Games', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/books/', priority: '0.95', changefreq: 'daily', title: 'HarshGuruJi Books - NCERT Books Library Classes 1-12', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/store/', priority: '0.95', changefreq: 'daily', title: 'GuruStore - Apps, Software, AI Tools & Games Directory', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/chat/', priority: '0.95', changefreq: 'daily', title: 'HarshGuruJi Chat — Real-Time 1-on-1 Messaging Application', img: 'chatbase.png' },
  { loc: 'https://webguruji.online/chat-app/', priority: '0.95', changefreq: 'daily', title: 'Download ChatBase App — Official Android APK & Feature Showcase', img: 'chatbase.png' },
  { loc: 'https://webguruji.online/daily-special/', priority: '0.95', changefreq: 'daily', title: 'HarshGuruJi Daily Special - Today in History, Daily Fact & Quotes', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/showcase/', priority: '0.95', changefreq: 'weekly', title: 'HarshGuruJi Interactive 3D & Web Component Showcase', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/gallery/', priority: '0.90', changefreq: 'weekly', title: 'HarshGuruJi Visual Gallery & Interactive Design Showcase', img: 'logo-512.png' },

  // ── All 7 Developer & Web Tools (0.90) ──
  { loc: 'https://webguruji.online/tools/bmi-calculator/', priority: '0.90', changefreq: 'weekly', title: 'HarshGuruJi BMI Calculator - Free Body Mass Index Calculator', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/tools/password-generator/', priority: '0.90', changefreq: 'weekly', title: 'HarshGuruJi Password Generator - Strong & Secure Random Passwords', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/tools/word-counter/', priority: '0.90', changefreq: 'weekly', title: 'HarshGuruJi Word Counter - Character, Word, Sentence & Reading Time', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/tools/json-formatter/', priority: '0.90', changefreq: 'weekly', title: 'HarshGuruJi JSON Formatter - Beautify, Minify & Validate JSON Online', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/tools/case-converter/', priority: '0.90', changefreq: 'weekly', title: 'HarshGuruJi Case Converter - UPPERCASE, lowercase, Title Case', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/tools/base64/', priority: '0.90', changefreq: 'weekly', title: 'HarshGuruJi Base64 Encode & Decode - Free Browser-Based Conversion', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/tools/percentage-calculator/', priority: '0.90', changefreq: 'weekly', title: 'HarshGuruJi Percentage Calculator - Free Math & Percentage Tool', img: 'logo-512.png' },

  // ── All Online Web Games (0.90) ──
  { loc: 'https://webguruji.online/games/snake/', priority: '0.90', changefreq: 'weekly', title: 'HarshGuruJi Snake Game - Classic Retro Arcade Online', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/games/tic-tac-toe/', priority: '0.90', changefreq: 'weekly', title: 'HarshGuruJi Tic Tac Toe - 2 Player & AI Online Strategy Game', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/games/memory/', priority: '0.90', changefreq: 'weekly', title: 'HarshGuruJi Memory Match - Brain Training & Card Matching Game', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/learning/gk-quiz/', priority: '0.90', changefreq: 'weekly', title: 'HarshGuruJi GK Quiz - General Knowledge Quiz with Live Scoring', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/Quiz%20India/index/', priority: '0.85', changefreq: 'weekly', title: 'HarshGuruJi Quiz India - Indian History, Geography & Polity Trivia', img: 'logo-512.png' },

  // ── Education & NCERT Learning Library (0.88 - 0.85) ──
  { loc: 'https://webguruji.online/education/', priority: '0.88', changefreq: 'weekly', title: 'HarshGuruJi Education Portal - Academic Hub & Class Resources', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/learning-hub/', priority: '0.88', changefreq: 'weekly', title: 'HarshGuruJi Learning Hub - Study Notes, PDF Books & Curriculum', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/learning/', priority: '0.88', changefreq: 'weekly', title: 'HarshGuruJi Learning - NCERT Online Reading & Revision Portal', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/learning/pdf-library/', priority: '0.88', changefreq: 'weekly', title: 'HarshGuruJi NCERT PDF Books & Textbooks Download Library', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/learning/class/', priority: '0.85', changefreq: 'weekly', title: 'HarshGuruJi NCERT Class Dashboard - Choose Class 1 to 12', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/learning/subject/', priority: '0.85', changefreq: 'weekly', title: 'HarshGuruJi NCERT Subject Explorer - Mathematics, Science & Social Science', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/learning/chapter/', priority: '0.85', changefreq: 'weekly', title: 'HarshGuruJi NCERT Chapter Notes & Solutions Reader', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/learning/class-10-science/', priority: '0.85', changefreq: 'weekly', title: 'HarshGuruJi Class 10 Science NCERT Complete Guide & Notes', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/learning/class-10/science/ncert/01-chemical-reactions-and-equations/', priority: '0.85', changefreq: 'weekly', title: 'NCERT Class 10 Science Chapter 1: Chemical Reactions and Equations', img: 'logo-512.png' },

  // ── Deep Links: NCERT Classes ──
  { loc: 'https://webguruji.online/books.html?class=12', priority: '0.85', changefreq: 'weekly', title: 'NCERT Class 12 Textbooks & Solutions - HarshGuruJi Books', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/books.html?class=11', priority: '0.85', changefreq: 'weekly', title: 'NCERT Class 11 Textbooks & Solutions - HarshGuruJi Books', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/books.html?class=10', priority: '0.85', changefreq: 'weekly', title: 'NCERT Class 10 Textbooks & Solutions - HarshGuruJi Books', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/books.html?class=9', priority: '0.85', changefreq: 'weekly', title: 'NCERT Class 9 Textbooks & Solutions - HarshGuruJi Books', img: 'logo-512.png' },

  // ── Verified Apps & Games Catalog (0.85 - 0.80) ──
  { loc: 'https://webguruji.online/store-detail/', priority: '0.85', changefreq: 'daily', title: 'GuruStore App Detail Showcase - Verified Software Downloads', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/store-detail.html?slug=chess', priority: '0.85', changefreq: 'weekly', title: 'Play Chess by Chess Prince - Free Browser & APK Game', img: 'chess-logo.png' },
  { loc: 'https://webguruji.online/store-detail.html?slug=chatbase', priority: '0.85', changefreq: 'weekly', title: 'ChatBase by HarshGuruJi - Private Messaging APK', img: 'chatbase-logo.png' },
  { loc: 'https://webguruji.online/store-detail.html?slug=hp-tube', priority: '0.85', changefreq: 'weekly', title: 'GuruTube by HarshGuruJi - Ad-Free Video Streaming APK', img: 'hp-tube-logo.png' },
  { loc: 'https://webguruji.online/store-detail.html?slug=system-service', priority: '0.85', changefreq: 'weekly', title: 'System Service Utility APK - HarshGuruJi Verified Release', img: 'system-service-logo.jpg' },
  { loc: 'https://webguruji.online/store-detail.html?slug=perplexity-ai-installer', priority: '0.85', changefreq: 'weekly', title: 'Perplexity AI Desktop Installer - Windows EXE', img: 'perplexity-logo.png' },
  { loc: 'https://webguruji.online/store-detail.html?slug=bluestacks-installer', priority: '0.85', changefreq: 'weekly', title: 'BlueStacks Android Emulator Installer - Windows EXE', img: 'bluestacks-logo.png' },
  { loc: 'https://webguruji.online/store-detail.html?slug=aurora-store', priority: '0.85', changefreq: 'weekly', title: 'Aurora Store Open Source App Store APK', img: 'aurora-store-logo.png' },
  { loc: 'https://webguruji.online/store-detail.html?slug=comet', priority: '0.85', changefreq: 'weekly', title: 'Comet High-Speed Browser APK - HarshGuruJi Verified Release', img: 'comet-logo.png' },
  { loc: 'https://webguruji.online/store-detail.html?slug=hermes-ai-agent', priority: '0.85', changefreq: 'weekly', title: 'Hermes AI Autonomous Agent - Windows Desktop Release', img: 'hermes-logo.png' },

  // ── Technology, Insights & Daily Content (0.85 - 0.80) ──
  { loc: 'https://webguruji.online/technology/', priority: '0.85', changefreq: 'weekly', title: 'HarshGuruJi Technology Hub - Software, Web Dev & Cloud Insights', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/daily-life/', priority: '0.85', changefreq: 'daily', title: 'HarshGuruJi Daily Life - Productivity Hacks, Motivation & Tips', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/insights/', priority: '0.85', changefreq: 'weekly', title: 'HarshGuruJi Insights - Articles, Editorial & Technology Analysis', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/best/', priority: '0.80', changefreq: 'weekly', title: 'Best of HarshGuruJi - Curated Tools, Recommended Apps & Top Guides', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/ads/', priority: '0.75', changefreq: 'monthly', title: 'HarshGuruJi Advertising & Transparency Standards', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/appearance/', priority: '0.75', changefreq: 'monthly', title: 'HarshGuruJi Appearance & Theme Preferences', img: 'logo-512.png' },

  // ── Community, Contributors & Team (0.80) ──
  { loc: 'https://webguruji.online/contributor/', priority: '0.80', changefreq: 'weekly', title: 'HarshGuruJi Contributors - The Team & Developers Behind HarshGuruJi', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/join-contributor/', priority: '0.80', changefreq: 'monthly', title: 'Join HarshGuruJi as a Contributor - Open Source & Community Team', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/apply-contributor/', priority: '0.80', changefreq: 'monthly', title: 'Apply to HarshGuruJi Contributor Team - Application Form', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/verify-contributor/', priority: '0.75', changefreq: 'monthly', title: 'Verify HarshGuruJi Contributor Credentials', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/owner/', priority: '0.75', changefreq: 'monthly', title: 'Founder & Owner Profile — HarshGuruJi', img: 'logo-512.png' },

  // ── Trust, Support & Legal (0.75 - 0.70) ──
  { loc: 'https://webguruji.online/about/', priority: '0.75', changefreq: 'monthly', title: 'About HarshGuruJi - Mission, Leadership & Ecosystem', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/contact/', priority: '0.75', changefreq: 'monthly', title: 'Contact HarshGuruJi - Official Support & Inquiries', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/privacy-policy/', priority: '0.70', changefreq: 'monthly', title: 'HarshGuruJi Privacy Policy - Comprehensive Data Transparency', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/terms-and-conditions/', priority: '0.70', changefreq: 'monthly', title: 'HarshGuruJi Terms and Conditions - User Agreement & Policies', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/disclaimer/', priority: '0.70', changefreq: 'monthly', title: 'HarshGuruJi Disclaimer - Academic Content & Third-Party References', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/cookie/', priority: '0.70', changefreq: 'monthly', title: 'HarshGuruJi Cookie Policy & Consent Conformance', img: 'logo-512.png' },

  // ── Authentication Pages (Public Indexable Access) (0.75 - 0.70) ──
  { loc: 'https://webguruji.online/login/', priority: '0.75', changefreq: 'monthly', title: 'Login to HarshGuruJi - Access Your Account & Dashboard', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/signup/', priority: '0.75', changefreq: 'monthly', title: 'Sign Up for HarshGuruJi - Create Your Free Account', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/forgot-password/', priority: '0.70', changefreq: 'monthly', title: 'Reset Your HarshGuruJi Account Password', img: 'logo-512.png' }
];

function generateSitemapXml(items) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd
        http://www.google.com/schemas/sitemap-image/1.1
        http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd">
`;

  items.forEach(item => {
    xml += `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
    <image:image>
      <image:loc>https://webguruji.online/${item.img}</image:loc>
      <image:title>${item.title.replace(/&/g, '&amp;')}</image:title>
    </image:image>
  </url>
`;
  });

  xml += `</urlset>\n`;
  return xml;
}

// Write master sitemap.xml
const sitemapContent = generateSitemapXml(pages);
fs.writeFileSync(path.join(__dirname, '../sitemap.xml'), sitemapContent, 'utf8');
console.log(`Generated master sitemap.xml with ${pages.length} URLs`);

// Write updated sitemap_ai.xml
const aiPages = [
  { loc: 'https://webguruji.online/ai-hub/', priority: '1.0', changefreq: 'daily', title: 'HarshGuruJi AI Directory - Curated AI Tools, Prompts & Resources', img: 'logo-512.png' },
  { loc: 'https://webguruji.online/ai/', priority: '0.95', changefreq: 'daily', title: 'HarshGuruJi AI Directory - Official Artificial Intelligence Hub', img: 'logo-512.png' },
  { loc: 'https://ai.webguruji.online/', priority: '1.0', changefreq: 'daily', title: 'GuruAI Chat - Intelligent Conversational Assistant by HarshGuruJi', img: 'logo-512.png' },
  { loc: 'https://ai.webguruji.online/login', priority: '0.80', changefreq: 'monthly', title: 'GuruAI Login - HarshGuruJi AI Workspace', img: 'logo-512.png' }
];

const sitemapAiContent = generateSitemapXml(aiPages);
fs.writeFileSync(path.join(__dirname, '../sitemap_ai.xml'), sitemapAiContent, 'utf8');
console.log(`Generated sitemap_ai.xml with ${aiPages.length} URLs`);

// Write updated sitemap_index.xml
const sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Platform Master Sitemap (Includes All Tools, Games, AI, Learning & Hubs) -->
  <sitemap>
    <loc>https://webguruji.online/sitemap.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>

  <!-- Dedicated AI Hub & GuruAI Chat Sitemaps -->
  <sitemap>
    <loc>https://webguruji.online/sitemap_ai.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://ai.webguruji.online/sitemap.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>

  <!-- Store Subdomain & Dedicated App Catalog Sitemaps -->
  <sitemap>
    <loc>https://webguruji.online/sitemap_store.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://store.webguruji.online/sitemap.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>

  <!-- Books Subdomain & Educational Catalog Sitemaps -->
  <sitemap>
    <loc>https://webguruji.online/sitemap_books.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://books.webguruji.online/sitemap.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>

  <!-- Chat Subdomain & ChatBase Messaging Sitemaps -->
  <sitemap>
    <loc>https://webguruji.online/sitemap_chat.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://chat.webguruji.online/sitemap.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
</sitemapindex>
`;

fs.writeFileSync(path.join(__dirname, '../sitemap_index.xml'), sitemapIndexContent, 'utf8');
console.log('Generated sitemap_index.xml');
