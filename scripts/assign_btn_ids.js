const fs = require('fs');
const path = require('path');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

let totalFixed = 0;

htmlFiles.forEach(file => {
  let html = fs.readFileSync(file, 'utf8');
  let modified = false;

  // Add id to <button> tags missing id
  html = html.replace(/<button(\s+[^>]*?)>/gi, (match, attrs) => {
    if (attrs.includes('id=')) return match;
    const cleanFile = file.replace('.html', '').replace(/[^a-zA-Z0-9]/g, '');
    const rand = Math.random().toString(36).substring(2, 7);
    const id = `btn-${cleanFile}-${rand}`;
    modified = true;
    totalFixed++;
    return `<button id="${id}"${attrs}>`;
  });

  // Add id to <a class="...btn..."> tags missing id
  html = html.replace(/<a(\s+[^>]*?class=["'][^"']*btn[^"']*["'][^>]*?)>/gi, (match, attrs) => {
    if (attrs.includes('id=')) return match;
    const cleanFile = file.replace('.html', '').replace(/[^a-zA-Z0-9]/g, '');
    const rand = Math.random().toString(36).substring(2, 7);
    const id = `btn-link-${cleanFile}-${rand}`;
    modified = true;
    totalFixed++;
    return `<a id="${id}"${attrs}>`;
  });

  if (modified) {
    fs.writeFileSync(file, html, 'utf8');
    console.log(`Updated ${file}`);
  }
});

console.log(`Finished! Total buttons assigned IDs: ${totalFixed}`);
