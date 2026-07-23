const fs = require('fs');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const catalog = [];

htmlFiles.forEach(file => {
  const html = fs.readFileSync(file, 'utf8');
  // Match buttons and links with btn class
  const tagRegex = /<(button|a)\s+[^>]*>/gi;
  let match;
  while ((match = tagRegex.exec(html)) !== null) {
    const tagStr = match[0];
    const isButton = match[1].toLowerCase() === 'button';
    const isBtnClass = tagStr.includes('class=') && /class=["'][^"']*btn[^"']*["']/i.test(tagStr);

    if (isButton || isBtnClass) {
      const idMatch = tagStr.match(/id=["']([^"']+)["']/i);
      const hrefMatch = tagStr.match(/href=["']([^"']+)["']/i);
      const onclickMatch = tagStr.match(/onclick=["']([^"']+)["']/i);
      const targetMatch = tagStr.match(/target=["']([^"']+)["']/i);

      catalog.push({
        file,
        tag: match[1],
        id: idMatch ? idMatch[1] : null,
        href: hrefMatch ? hrefMatch[1] : null,
        onclick: onclickMatch ? onclickMatch[1] : null,
        target: targetMatch ? targetMatch[1] : null,
        rawTag: tagStr
      });
    }
  }
});

console.log('Total Buttons cataloged:', catalog.length);
console.log('Sample:', JSON.stringify(catalog.slice(0, 10), null, 2));
