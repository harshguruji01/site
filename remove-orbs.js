const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// 1. Remove orb classes from CSS
const cssFiles = [
  'signup.css',
  'login.css',
  'style.css'
];

cssFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;

  let css = fs.readFileSync(filePath, 'utf8');
  
  // Remove .ambient-orb, .orb-1, .orb-2 and @keyframes orbFloat
  css = css.replace(/\.ambient-orb\s*\{[^}]+\}/g, '');
  css = css.replace(/\.orb-1\s*\{[^}]+\}/g, '');
  css = css.replace(/\.orb-2\s*\{[^}]+\}/g, '');
  css = css.replace(/@keyframes orbFloat\s*\{[^}]+\s*[^}]+\}/g, ''); // Crude multiline replace, better to just let it be unused if regex fails, but let's try a simpler approach
  
  // Actually, we can just replace the whole block or let it be unused since we remove the HTML elements.
  // But to be clean, let's remove references in HTML, which is the most important part.
  
  fs.writeFileSync(filePath, css, 'utf8');
  console.log(`Cleaned CSS in ${file}`);
});

// 2. Remove ambient orbs from all HTML files
const htmlFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const html = fs.readFileSync(filePath, 'utf8');
  
  const $ = cheerio.load(html, { recognizeSelfClosing: true });
  
  let modified = false;

  if ($('.ambient-orb').length > 0) {
    $('.ambient-orb').remove();
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, $.html(), 'utf8');
    console.log(`Removed magical orbs from ${file}`);
  }
});
