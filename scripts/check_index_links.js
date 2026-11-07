const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const hrefs = [];
const re = /href=["']([^"']+)["']/g;
let m;
while ((m = re.exec(html)) !== null) {
  const h = m[1];
  if (h.includes('tools') || h.includes('games') || h.includes('ai') || h.includes('explore')) {
    hrefs.push(h);
  }
}
console.log('Relevant links in index.html:');
console.log([...new Set(hrefs)]);
