const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (f === 'node_modules' || f === '.git' || f === '.next') continue;
    if (fs.statSync(full).isDirectory()) getFiles(full, files);
    else if (f.endsWith('.html')) files.push(full);
  }
  return files;
}

const allHtml = getFiles('.');
const report = [];

for (const file of allHtml) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('ca-pub-7706204118195419')) {
    // Strip HTML tags and scripts/styles to estimate visible text
    const text = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
                        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
                        .replace(/<[^>]+>/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();
    const words = text.split(/\s+/).filter(Boolean).length;
    report.push({ file: path.relative('.', file).replace(/\\/g, '/'), words });
  }
}

report.sort((a,b) => a.words - b.words);
console.log('--- PAGES WITH ADSENSE TAG (SORTED BY WORD COUNT) ---');
report.forEach(r => console.log(r.words.toString().padStart(5) + ' words | ' + r.file));
