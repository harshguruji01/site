const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync('index.html', 'utf8');

// Regex patterns to extract components from index.html
const headerRegex = /<!-- ═══════════════════ PREMIUM NAVIGATION ═══════════════════ -->[\s\S]*?<\/header>/;
const searchModalRegex = /<!-- ═══════════════════ GLOBAL SEARCH MODAL ═══════════════════ -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
const mobileDrawerRegex = /<!-- ═══════════════════ MOBILE DRAWER ═══════════════════ -->[\s\S]*?<div class="drawer-backdrop" id="drawer-backdrop"><\/div>/;

const premiumHeader = indexHtml.match(headerRegex)[0];
const searchModal = indexHtml.match(searchModalRegex)[0];
const mobileDrawer = indexHtml.match(mobileDrawerRegex)[0];

const fullNewNav = premiumHeader + '\n\n  ' + searchModal + '\n\n  ' + mobileDrawer + '\n';

// Regex to find old navbar
const oldNavbarRegex = /<nav id="navbar">[\s\S]*?<\/nav>/;

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'index.html');

let successCount = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('premium-header')) {
    console.log(`Skipping ${file} - already has premium header`);
    continue;
  }

  // Find the old navbar
  if (oldNavbarRegex.test(content)) {
    content = content.replace(oldNavbarRegex, fullNewNav);
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
    successCount++;
  } else {
    console.log(`Could not find old navbar in ${file}, maybe it has a different structure.`);
  }
}

console.log(`Finished updating ${successCount} files.`);
