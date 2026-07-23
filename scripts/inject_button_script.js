const fs = require('fs');
const path = require('path');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

let injectedCount = 0;

htmlFiles.forEach(file => {
  let html = fs.readFileSync(file, 'utf8');

  // Check if button_handlers.js is already included
  if (!html.includes('button_handlers.js')) {
    // Inject before </body> or </head> or end of file
    if (html.includes('</body>')) {
      html = html.replace('</body>', '  <script src="js/button_handlers.js" defer></script>\n</body>');
    } else if (html.includes('</head>')) {
      html = html.replace('</head>', '  <script src="js/button_handlers.js" defer></script>\n</head>');
    } else {
      html += '\n<script src="js/button_handlers.js" defer></script>';
    }

    fs.writeFileSync(file, html, 'utf8');
    injectedCount++;
    console.log(`Injected script into ${file}`);
  }
});

console.log(`Injected button_handlers.js into ${injectedCount} HTML files.`);
