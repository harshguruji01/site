const fs = require('fs');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

let extNewTabCount = 0;
let extSameTabCount = 0;
let intTabCount = 0;

htmlFiles.forEach(file => {
  const html = fs.readFileSync(file, 'utf8');
  const tagRegex = /<a\s+[^>]*>/gi;
  let match;
  while ((match = tagRegex.exec(html)) !== null) {
    const tagStr = match[0];
    if (tagStr.includes('class=') && /class=["'][^"']*btn[^"']*["']/i.test(tagStr)) {
      const isExt = tagStr.includes('http://') || tagStr.includes('https://');
      const isBlank = tagStr.includes('target="_blank"') || tagStr.includes("target='_blank'");
      if (isExt) {
        if (isBlank) extNewTabCount++;
        else extSameTabCount++;
      } else {
        intTabCount++;
      }
    }
  }
});

console.log('Button Links - External (Opens in New Tab):', extNewTabCount);
console.log('Button Links - External (Same Tab):', extSameTabCount);
console.log('Button Links - Internal Navigation:', intTabCount);
