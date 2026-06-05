const fs = require('fs');
const path = require('path');

// Simple script to add basic SEO meta to HTML files that are missing description/OG tags.
const ROOT = path.join(__dirname, '..');

function isHtmlFile(name) { return name.endsWith('.html'); }

function processFile(filePath) {
  let s = fs.readFileSync(filePath, 'utf8');
  const headOpen = s.indexOf('<head');
  const headClose = s.indexOf('</head>');
  if (headOpen === -1 || headClose === -1) return;
  const head = s.substring(headOpen, headClose + 7);
  // Skip if already has meta description and og:title
  if (head.includes('name="description"') && head.includes('property="og:title"')) return;

  // Build meta block
  const titleMatch = s.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'HarshGuruJi';
  const description = `Explore ${title} on HarshGuruJi — tools, learning resources and insights.`;
  const meta = `\n  <!-- Auto SEO meta -->\n  <meta name="description" content="${description}" />\n  <meta property="og:title" content="${title}" />\n  <meta property="og:description" content="${description}" />\n  <meta property="og:type" content="website" />\n  <meta name="twitter:card" content="summary_large_image" />\n  <link rel="canonical" href="${path.basename(filePath)}" />\n`;

  // Insert after opening <head> tag
  const injected = s.slice(0, headClose) + meta + s.slice(headClose);
  fs.writeFileSync(filePath, injected, 'utf8');
  console.log('Updated meta in', filePath);
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) continue; // skip directories
    if (isHtmlFile(f)) processFile(p);
  }
}

walk(ROOT);
console.log('SEO meta injector finished.');
