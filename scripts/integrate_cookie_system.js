const fs = require('fs');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'cookie.html');

let injectedCount = 0;

htmlFiles.forEach(file => {
  let html = fs.readFileSync(file, 'utf8');
  let modified = false;

  // Add cookie.css link before </head> if missing
  if (!html.includes('cookie.css')) {
    if (html.includes('</head>')) {
      html = html.replace('</head>', '  <link rel="stylesheet" href="cookie.css">\n</head>');
      modified = true;
    }
  }

  // Add cookie.js script before </body> if missing
  if (!html.includes('cookie.js')) {
    if (html.includes('</body>')) {
      html = html.replace('</body>', '  <script src="cookie.js" defer></script>\n</body>');
      modified = true;
    }
  }

  // Add Cookie Policy link in legal section of footer if missing
  if (!html.includes('cookie.html')) {
    if (html.includes('href="privacy-policy.html"')) {
      html = html.replace(
        'href="privacy-policy.html"',
        'href="privacy-policy.html"\n            <a href="cookie.html">Cookie Policy</a>'
      );
      modified = true;
    } else if (html.includes('href="privacy-policy.html"')) {
      html = html.replace(
        'href="privacy-policy.html"',
        'href="privacy-policy.html"</a></li>\n        <li><a href="cookie.html">Cookie Policy'
      );
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(file, html, 'utf8');
    injectedCount++;
  }
});

console.log(`Successfully integrated Cookie system into ${injectedCount} HTML files.`);
