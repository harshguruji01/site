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

// Normalize spacing in CSS files
cssFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;

  let css = fs.readFileSync(filePath, 'utf8');

  // Fix 100vh issues (massive white space when content is small)
  css = css.replace(/min-height:\s*100vh/g, 'min-height: max(100vh, 100%)');
  css = css.replace(/height:\s*100vh/g, 'min-height: max(100vh, 100%); height: auto');

  // Normalize excessive padding and margins
  // Change things like padding: 8rem 5% 4rem to padding: clamp(4rem, 5vw, 6rem) 5% clamp(2rem, 3vw, 4rem)
  css = css.replace(/padding:\s*([4-9])rem\s+([0-9%a-z]+)\s+([3-9])rem/g, (match, p1, p2, p3) => {
    return `padding: clamp(${Math.max(2, p1-2)}rem, 5vw, ${p1}rem) ${p2} clamp(${Math.max(1, p3-2)}rem, 3vw, ${p3}rem)`;
  });
  
  // Replace large fixed margins
  css = css.replace(/margin-top:\s*[4-9]rem/g, 'margin-top: clamp(2rem, 4vw, 4rem)');
  css = css.replace(/margin-bottom:\s*[4-9]rem/g, 'margin-bottom: clamp(2rem, 4vw, 4rem)');
  
  // Normalize button heights and padding
  css = css.replace(/padding:\s*0\.8rem 1\.5rem;/g, 'padding: clamp(0.6rem, 2vw, 0.8rem) clamp(1rem, 3vw, 1.5rem); min-height: 44px;');
  
  // Clean up any remaining extra blank whitespace
  css = css.replace(/\n\s*\n\s*\n/g, '\n\n');

  fs.writeFileSync(filePath, css, 'utf8');
  console.log(`Normalized ${file}`);
});
