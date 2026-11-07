const fs = require('fs');
const path = require('path');

function checkPageSeo(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const hasNoindex = /content=['"][^'"]*noindex/i.test(content);
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'NO TITLE';
  const canonicalMatch = content.match(/<link[^>]*rel=['"]canonical['"][^>]*href=['"]([^'"]*)['"]/i);
  const canonical = canonicalMatch ? canonicalMatch[1] : 'NO CANONICAL';
  const robotsMatch = content.match(/<meta[^>]*name=['"]robots['"][^>]*content=['"]([^'"]*)['"]/i);
  const robots = robotsMatch ? robotsMatch[1] : 'DEFAULT';
  return { filePath, hasNoindex, title, canonical, robots };
}

const cleanPages = [
  'index.html',
  'explore/index.html',
  'free-tools/index.html',
  'tools/index.html',
  'tools/bmi-calculator/index.html',
  'tools/base64/index.html',
  'tools/json-formatter/index.html',
  'tools/password-generator/index.html',
  'tools/case-converter/index.html',
  'tools/percentage-calculator/index.html',
  'tools/word-counter/index.html',
  'games/index.html',
  'games/snake/index.html',
  'games/tic-tac-toe/index.html',
  'games/memory/index.html',
  'gaming-hub/index.html',
  'gaming/index.html',
  'ai-hub/index.html',
  'ai/index.html',
  'books/index.html',
  'daily-special/index.html',
  'daily-life/index.html',
  'insights/index.html',
  'showcase/index.html',
  'gallery/index.html',
  'technology/index.html',
  'education/index.html',
  'contributor/index.html',
  'about/index.html',
  'contact/index.html',
  'disclaimer/index.html',
  'privacy-policy/index.html',
  'terms-and-conditions/index.html',
  'login/index.html',
  'signup/index.html',
  'learning/index.html',
  'learning/class/index.html',
  'learning/subject/index.html',
  'learning/chapter/index.html',
  'learning/pdf-library/index.html',
  'learning/gk-quiz/index.html'
];

let issues = 0;
cleanPages.forEach(p => {
  if (fs.existsSync(p)) {
    const res = checkPageSeo(p);
    const isProblem = res.hasNoindex || res.canonical === 'NO CANONICAL';
    if (isProblem) issues++;
    console.log(`${isProblem ? '❌' : '✔'} ${p.padEnd(45)} | Robots: ${res.robots.padEnd(25)} | Canonical: ${res.canonical}`);
  } else {
    console.log('⚠️ MISSING:', p);
    issues++;
  }
});
console.log('\nTotal issues found:', issues);
