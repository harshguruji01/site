const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// Preload the main logo
if (!content.includes('<link rel="preload" href="logo.png"')) {
  content = content.replace('</head>', '  <link rel="preload" href="logo.png" as="image" type="image/png">\n</head>');
}

// Add loading=lazy to ai.png
content = content.replace(/<img src="ai\.png"/g, '<img src="ai.png" loading="lazy"');

// Add loading=lazy to harshlogo.png
content = content.replace(/<img src="harshlogo\.png"/g, '<img src="harshlogo.png" loading="lazy"');

// Add defer to scripts
content = content.replace(/<script src="script\.js"><\/script>/g, '<script src="script.js" defer></script>');
content = content.replace(/<script src="navbar-premium\.js"><\/script>/g, '<script src="navbar-premium.js" defer></script>');

fs.writeFileSync('index.html', content, 'utf8');
console.log('Optimized index.html');
