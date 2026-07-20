const fs = require('fs');
const path = require('path');

const cssFiles = [
  'style.css',
  'navbar.css',
  'signup.css',
  'login.css',
  'premium.css',
  'css/store.css',
  'css/dashboard-theme.css'
];

const ultraDarkBg = '#050505'; // Ultra dark premium background
const cardBg = 'rgba(15, 15, 20, 0.6)'; // Slightly lighter for cards to stand out
const textPrimary = '#ffffff';
const textSecondary = '#a1a1aa';

cssFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;

  let css = fs.readFileSync(filePath, 'utf8');

  // Replace background color variables
  css = css.replace(/--bg-dark:\s*#[a-fA-F0-9]{3,6}/g, `--bg-dark: ${ultraDarkBg}`);
  css = css.replace(/--store-bg:\s*#[a-fA-F0-9]{3,6}/g, `--store-bg: ${ultraDarkBg}`);
  css = css.replace(/--bg-primary:\s*#[a-fA-F0-9]{3,6}/g, `--bg-primary: ${ultraDarkBg}`);
  css = css.replace(/--bg-secondary:\s*#[a-fA-F0-9]{3,6}/g, `--bg-secondary: #0a0a0c`); // slightly different for sidebar

  // Replace text color variables to ensure readability
  css = css.replace(/--text-primary:\s*#[a-fA-F0-9]{3,6}/g, `--text-primary: ${textPrimary}`);
  css = css.replace(/--text-secondary:\s*#[a-fA-F0-9]{3,6}/g, `--text-secondary: ${textSecondary}`);
  css = css.replace(/--store-text:\s*#[a-fA-F0-9]{3,6}/g, `--store-text: ${textPrimary}`);
  css = css.replace(/--store-text-muted:\s*#[a-fA-F0-9]{3,6}/g, `--store-text-muted: ${textSecondary}`);

  // Replace surface/card backgrounds to ensure they contrast with the ultra-dark bg
  css = css.replace(/--surface-color:\s*rgba\([^)]+\)/g, `--surface-color: ${cardBg}`);
  css = css.replace(/--store-card-bg:\s*rgba\([^)]+\)/g, `--store-card-bg: ${cardBg}`);
  css = css.replace(/--bg-surface:\s*rgba\([^)]+\)/g, `--bg-surface: ${cardBg}`);

  // Remove radial/linear gradients from hero sections that act as backgrounds
  css = css.replace(/background:\s*radial-gradient\([^)]+\)/g, `background: transparent`);
  
  // Specific fix for .hero and .store-hero if they have fixed backgrounds
  css = css.replace(/\.store-hero\s*\{[^}]*background:[^}]+}/g, match => {
      return match.replace(/background:\s*radial-gradient\([^)]+\);?/, 'background: transparent;');
  });

  // Ensure body backgrounds are explicitly set if not using variables
  css = css.replace(/body\s*\{([^}]*)background-color:\s*#[a-fA-F0-9]{3,6}/g, `body {$1background-color: ${ultraDarkBg}`);
  css = css.replace(/body\.store-body\s*\{([^}]*)background-color:\s*#[a-fA-F0-9]{3,6}/g, `body.store-body {$1background-color: ${ultraDarkBg}`);

  fs.writeFileSync(filePath, css, 'utf8');
  console.log(`Updated theme to Ultra Dark in ${file}`);
});
