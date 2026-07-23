const fs = require('fs');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'index.html');

let count = 0;

htmlFiles.forEach(file => {
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('<picture>') && html.includes('srcset="logo.webp"') && html.includes('nav-logo')) {
    html = html.replace(
      /<picture>\s*<source srcset="logo\.webp" type="image\/webp">\s*<img src="logo\.png" alt="HarshGuruJi Logo"[^>]*>\s*<\/picture>/gi,
      '<img src="logo.png" alt="HarshGuruJi Logo" class="nav-logo-img" fetchpriority="high" onerror="this.src=\'logo.png\'">'
    );
    fs.writeFileSync(file, html, 'utf8');
    count++;
  }
});

console.log(`Updated navbar logo markup in ${count} HTML files.`);
