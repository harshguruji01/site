const fs = require('fs');
const path = require('path');

const siteNavJs = path.join(__dirname, '../navbar-premium.js');
const siteNavCss = path.join(__dirname, '../navbar-premium.css');
const siteSupaJs = path.join(__dirname, '../js/supabase.js');
const siteSupaHeadJs = path.join(__dirname, '../js/supabase-head.js');

const destinations = ['login', 'books', 'store'];

destinations.forEach(dest => {
  const destDir = path.join(__dirname, '../../', dest);
  if (!fs.existsSync(destDir)) return;

  // Sync navbar JS & CSS
  fs.copyFileSync(siteNavJs, path.join(destDir, 'navbar-premium.js'));
  fs.copyFileSync(siteNavCss, path.join(destDir, 'navbar-premium.css'));
  console.log(`Synced navbar to ${dest}`);

  // Sync supabase.js & supabase-head.js
  const destJsDir = path.join(destDir, 'js');
  if (!fs.existsSync(destJsDir)) {
    fs.mkdirSync(destJsDir, { recursive: true });
  }
  fs.copyFileSync(siteSupaJs, path.join(destJsDir, 'supabase.js'));
  fs.copyFileSync(siteSupaHeadJs, path.join(destJsDir, 'supabase-head.js'));
  console.log(`Synced supabase auth to ${dest}/js`);
});
