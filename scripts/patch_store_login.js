const fs = require('fs');

const jsPath = 'navbar-premium.js';
let js = fs.readFileSync(jsPath, 'utf8');

// Replace top header login button
const targetLogin = '<a href="${loginUrl}" id="hg-login-btn" class="hg-btn hg-btn-primary">Login</a>';
const repLogin = '${isStorePage ? \'\' : `<a href="${loginUrl}" id="hg-login-btn" class="hg-btn hg-btn-primary">Login</a>`}';

if (js.includes(targetLogin)) {
  js = js.replace(targetLogin, repLogin);
  console.log('[OK] Replaced targetLogin in navbar-premium.js');
}

// Replace mobile drawer footer auth
const targetDrawer = `<div class="hg-mobile-footer-actions">
           <a href="\${loginUrl}" id="hg-mobile-drawer-auth" class="hg-btn hg-btn-primary" style="width: 100%; text-align:center;">Sign In to HarshGuruJi</a>
        </div>`;

const repDrawer = `\${isStorePage ? '' : \`<div class="hg-mobile-footer-actions">
           <a href="\${loginUrl}" id="hg-mobile-drawer-auth" class="hg-btn hg-btn-primary" style="width: 100%; text-align:center;">Sign In to HarshGuruJi</a>
        </div>\`}`;

if (js.includes(targetDrawer)) {
  js = js.replace(targetDrawer, repDrawer);
  console.log('[OK] Replaced targetDrawer in navbar-premium.js');
} else {
  // Try CRLF
  const targetDrawerCRLF = targetDrawer.replace(/\n/g, '\r\n');
  const repDrawerCRLF = repDrawer.replace(/\n/g, '\r\n');
  if (js.includes(targetDrawerCRLF)) {
    js = js.replace(targetDrawerCRLF, repDrawerCRLF);
    console.log('[OK] Replaced targetDrawerCRLF in navbar-premium.js');
  }
}

// Ensure updateNavUI guards against displaying login on store page
const oldUpdateNavUI = `  const updateNavUI = (user, profile) => {
    const loginBtn = document.getElementById('hg-login-btn');`;

const newUpdateNavUI = `  const updateNavUI = (user, profile) => {
    const loginBtn = document.getElementById('hg-login-btn');
    if (isStorePage) {
      if (loginBtn) loginBtn.style.display = 'none';
      const mDrawerAuth = document.getElementById('hg-mobile-drawer-auth');
      if (mDrawerAuth) mDrawerAuth.style.display = 'none';
    }`;

if (js.includes(oldUpdateNavUI)) {
  js = js.replace(oldUpdateNavUI, newUpdateNavUI);
  console.log('[OK] Guarded updateNavUI start for isStorePage');
} else {
  const oldUpdateNavUICRLF = oldUpdateNavUI.replace(/\n/g, '\r\n');
  const newUpdateNavUICRLF = newUpdateNavUI.replace(/\n/g, '\r\n');
  if (js.includes(oldUpdateNavUICRLF)) {
    js = js.replace(oldUpdateNavUICRLF, newUpdateNavUICRLF);
    console.log('[OK] Guarded updateNavUICRLF start for isStorePage');
  }
}

// In updateNavUI unauthenticated branch:
const oldUnauth = `if (loginBtn) { loginBtn.href = loginUrl; loginBtn.style.display = 'inline-flex'; }`;
const newUnauth = `if (loginBtn) { loginBtn.href = loginUrl; loginBtn.style.display = isStorePage ? 'none' : 'inline-flex'; }`;
if (js.includes(oldUnauth)) {
  js = js.replace(oldUnauth, newUnauth);
  console.log('[OK] Guarded oldUnauth for isStorePage');
}

fs.writeFileSync(jsPath, js, 'utf8');
console.log('Update complete!');
