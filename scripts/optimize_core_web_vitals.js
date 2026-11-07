const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const IGNORE_DIRS = new Set([
  '.agents',
  '.git',
  '.gemini',
  '.vscode',
  'backend',
  'backend_legacy',
  'node_modules',
  'interactive-components'
]);

function getHtmlFiles(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getHtmlFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function optimizeHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Defer error-shield.js
  if (content.includes('<script src="error-shield.js"></script>')) {
    content = content.replace('<script src="error-shield.js"></script>', '<script src="error-shield.js" defer></script>');
    changed = true;
  }

  // 2. Defer ad-shield.js
  if (content.includes('<script src="js/ad-shield.js"></script>')) {
    content = content.replace('<script src="js/ad-shield.js"></script>', '<script src="js/ad-shield.js" defer></script>');
    changed = true;
  }

  // 3. Defer supabase scripts
  if (content.includes('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>')) {
    content = content.replace('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>', '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2" defer></script>');
    changed = true;
  }
  if (content.includes('<script src="js/supabase-head.js"></script>')) {
    content = content.replace('<script src="js/supabase-head.js"></script>', '<script src="js/supabase-head.js" defer></script>');
    changed = true;
  }

  // 4. Defer navbar-premium.js and footer-premium.js
  if (content.includes('<script src="navbar-premium.js"></script>')) {
    content = content.replace('<script src="navbar-premium.js"></script>', '<script src="navbar-premium.js" defer></script>');
    changed = true;
  }
  if (content.includes('<script src="footer-premium.js"></script>')) {
    content = content.replace('<script src="footer-premium.js"></script>', '<script src="footer-premium.js" defer></script>');
    changed = true;
  }

  // 5. Asynchronous non-critical footer-premium.css (eliminates render-blocking on mobile)
  if (content.includes('<link rel="stylesheet" href="footer-premium.css">')) {
    content = content.replace(
      '<link rel="stylesheet" href="footer-premium.css">',
      '<link rel="stylesheet" href="footer-premium.css" media="print" onload="this.media=\'all\'">\n  <noscript><link rel="stylesheet" href="footer-premium.css"></noscript>'
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

const files = getHtmlFiles(ROOT_DIR);
let count = 0;
for (const f of files) {
  if (optimizeHtml(f)) count++;
}
console.log(`⚡ Optimized Core Web Vitals for ${count} HTML files!`);
