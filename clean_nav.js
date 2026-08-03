const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

let navbarHTML = fs.readFileSync('sync_nav.js', 'utf8').match(/const navbarHTML = `([\s\S]*?)`\.trim\(\);/)[1];

let updatedCount = 0;
files.forEach(file => {
  if (file === 'index.html') return; // index.html is perfect
  let content = fs.readFileSync(file, 'utf8');
  
  // Find where navbar starts
  let navStart = content.indexOf('<nav class="premium-navbar"');
  if (navStart === -1) navStart = content.indexOf('<nav id="navbar"');
  
  if (navStart !== -1) {
    let contentStart = content.indexOf('<div id="scroll-progress">', navStart);
    if (contentStart === -1) contentStart = content.indexOf('<canvas id="particleCanvas">', navStart);
    if (contentStart === -1) contentStart = content.indexOf('<section', navStart);
    if (contentStart === -1) contentStart = content.indexOf('<div class="hero">', navStart);
    if (contentStart === -1) {
      // Find the first <div class="..."> after a bit
      const searchFrom = navStart + 1000;
      contentStart = content.indexOf('<div class="', searchFrom);
    }
    
    if (contentStart !== -1 && contentStart > navStart) {
      let before = content.substring(0, navStart);
      let after = content.substring(contentStart);
      content = before + navbarHTML + '\n' + after;
      
      // Ensure CSS is linked
      if (!content.includes('navbar-premium.css')) {
        content = content.replace('</head>', '  <link rel="stylesheet" href="navbar-premium.css">\n</head>');
      }

      // Ensure JS is linked
      if (!content.includes('navbar-premium.js')) {
        content = content.replace('</body>', '  <script src="navbar-premium.js"></script>\n</body>');
      }

      fs.writeFileSync(file, content, 'utf8');
      updatedCount++;
      console.log('Fixed ' + file);
    } else {
      console.log('Could not find end of navbar for ' + file);
    }
  }
});
console.log('Total fixed: ' + updatedCount);
