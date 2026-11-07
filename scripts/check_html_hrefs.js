const fs = require('fs');

const hubs = [
  'tools/index.html',
  'free-tools/index.html',
  'games/index.html',
  'gaming-hub/index.html',
  'ai-hub/index.html',
  'explore/index.html',
  'index.html'
];

hubs.forEach(f => {
  if (!fs.existsSync(f)) return;
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.match(/href=["'][^"']+\.html["']/g) || [];
  const internal = matches.filter(m => !m.includes('http') && !m.includes('mailto'));
  console.log(f, 'internal .html links:', internal);
});
