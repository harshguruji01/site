const fs = require('fs');
const path = require('path');

const headerRegex = /<!-- ═══════════════════ PREMIUM NAVIGATION ═══════════════════ -->[\s\S]*?<\/header>/g;
const searchModalRegex = /<!-- ═══════════════════ GLOBAL SEARCH MODAL ═══════════════════ -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;
const mobileDrawerRegex = /<!-- ═══════════════════ MOBILE DRAWER ═══════════════════ -->[\s\S]*?<div class="drawer-backdrop" id="drawer-backdrop"><\/div>/g;
const oldNavbarRegex = /<nav id="navbar">[\s\S]*?<\/nav>/g;

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

let successCount = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(headerRegex, '');
  content = content.replace(searchModalRegex, '');
  content = content.replace(mobileDrawerRegex, '');
  content = content.replace(oldNavbarRegex, ''); // Also wipe any lingering old navbars just in case

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Removed navbar from ${file}`);
    successCount++;
  }
}

console.log(`Finished removing navbar from ${successCount} HTML files.`);
