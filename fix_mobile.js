const fs = require('fs');
const path = require('path');

// 1. Fix mobile horizontal overflow in style.css
const stylePath = path.join(__dirname, 'style.css');
let styleContent = fs.readFileSync(stylePath, 'utf8');
if (!styleContent.includes('overflow-x:hidden')) {
  styleContent += '\nhtml,body{overflow-x:hidden;max-width:100%;}';
  fs.writeFileSync(stylePath, styleContent);
  console.log('Fixed mobile overflow in style.css');
}

// 2. Replace ai.png / ai.png with ai.png in HTML/JS files
function replaceInFiles(dir, ext) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git') continue;
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInFiles(fullPath, ext);
    } else if (fullPath.endsWith(ext)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      if (content.includes('ai.png')) {
        content = content.replace(/ailogo\.png/g, 'ai.png');
        changed = true;
      }
      if (content.includes('ai.png')) {
        content = content.replace(/ailogo\.webp/g, 'ai.png');
        changed = true;
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Replaced chatbot logo in ${file}`);
      }
    }
  }
}

replaceInFiles(__dirname, '.html');
replaceInFiles(__dirname, '.js');
console.log('All fixes applied successfully.');
