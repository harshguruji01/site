const fs = require('fs');

const html = fs.readFileSync('explore/index.html', 'utf8');
const hrefs = [];
const re = /href=["']([^"']+)["']/g;
let m;
while ((m = re.exec(html)) !== null) {
  hrefs.push(m[1]);
}
console.log('Links in explore/index.html:');
console.log([...new Set(hrefs)]);
