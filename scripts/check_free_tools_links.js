const fs = require('fs');

const html = fs.readFileSync('free-tools/index.html', 'utf8');
const hrefs = [];
const re = /href=["']([^"']+)["']/g;
let m;
while ((m = re.exec(html)) !== null) {
  const h = m[1];
  if (h.includes('tools') || h.includes('games') || h.includes('ai')) {
    hrefs.push(h);
  }
}
console.log('Links in free-tools/index.html:');
console.log([...new Set(hrefs)]);
