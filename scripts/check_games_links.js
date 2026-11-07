const fs = require('fs');

['games/index.html', 'gaming-hub/index.html'].forEach(p => {
  const html = fs.readFileSync(p, 'utf8');
  const hrefs = [];
  const re = /href=["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (m[1].includes('games') || m[1].includes('gaming')) {
      hrefs.push(m[1]);
    }
  }
  console.log('Links in', p, ':', [...new Set(hrefs)]);
});
