const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// 1. Remove light theme from CSS
const cssFiles = [
  'style.css',
  'navbar.css',
  'signup.css',
  'login.css',
  'premium.css',
  'css/store.css',
  'css/dashboard-theme.css'
];

cssFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;

  let css = fs.readFileSync(filePath, 'utf8');
  css = css.replace(/\[data-theme="?light"?\]\s*\{[^}]+\}/g, '');
  css = css.replace(/\[data-theme="?light"?\]\s*\.[a-zA-Z0-9_-]+\s*\{[^}]+\}/g, '');
  css = css.replace(/@media\s*\(prefers-color-scheme:\s*light\)\s*\{[^}]+\}\s*\}/g, '');
  css = css.replace(/\[data-theme=light\][^}]+}/g, '');

  fs.writeFileSync(filePath, css, 'utf8');
  console.log(`Removed light theme from ${file}`);
});

// 2. Remove theme toggle logic from JS
const jsFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.js'));
const jsSubFiles = fs.existsSync(path.join(__dirname, 'js')) ? fs.readdirSync(path.join(__dirname, 'js')).filter(f => f.endsWith('.js')).map(f => path.join('js', f)) : [];
const allJsFiles = [...jsFiles, ...jsSubFiles];

allJsFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;

  let js = fs.readFileSync(filePath, 'utf8');
  js = js.replace(/const themeToggle = document.getElementById\('theme-toggle'\);/g, '');
  
  // also find any code checking localstorage for theme
  js = js.replace(/localStorage\.setItem\('theme',\s*'light'\);/g, '');
  js = js.replace(/document\.documentElement\.setAttribute\('data-theme',\s*'light'\);/g, '');

  fs.writeFileSync(filePath, js, 'utf8');
  console.log(`Cleaned JS from ${file}`);
});

// 3. Remove theme toggle button from all HTML files
const htmlFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const html = fs.readFileSync(filePath, 'utf8');
  
  const $ = cheerio.load(html, { recognizeSelfClosing: true });
  
  let modified = false;

  // Remove theme toggle button
  if ($('#theme-toggle').length > 0) {
    $('#theme-toggle').remove();
    modified = true;
  }
  
  // Hardcode data-theme="dark" on html/body if needed (not strictly required if default is dark, but just in case)
  // Actually, removing light makes dark the only theme, so we're good.

  if (modified) {
    fs.writeFileSync(filePath, $.html(), 'utf8');
    console.log(`Removed theme toggle from ${file}`);
  }
});
