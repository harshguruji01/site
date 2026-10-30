const fs = require('fs');

const jsPath = 'navbar-premium.js';
let js = fs.readFileSync(jsPath, 'utf8');

// 1. In navHTML generation: hide or omit #hg-login-btn on isStorePage
const oldNavActionAuth = `<!-- Auth (Dynamic via JS) -->
          <a href="\${loginUrl}" id="hg-login-btn" class="hg-btn hg-btn-primary">Login</a>`;

const newNavActionAuth = `<!-- Auth (Dynamic via JS) -->
          \${isStorePage ? '' : \`<a href="\${loginUrl}" id="hg-login-btn" class="hg-btn hg-btn-primary">Login</a>\`}`;

if (js.includes(oldNavActionAuth)) {
  js = js.replace(oldNavActionAuth, newNavActionAuth);
  console.log('[OK] Replaced top navbar login button for store page');
} else {
  console.log('[WARN] oldNavActionAuth pattern not found');
}

// 2. In isStorePage bottomBarHTML: Replace Login tab with Tools tab
const oldStoreBottomAuth = `      <a href="\${loginUrl}" class="hg-bottom-item" id="bottom-nav-auth" title="Profile / Account">
        <span class="hg-bottom-icon" id="bottom-auth-icon-wrap">
          <svg id="bottom-auth-default-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <img id="bottom-auth-avatar" src="\${prefix}logo.png" alt="Profile" style="display:none;" />
          <span id="bottom-golden-tick" class="bottom-golden-tick" style="display:none;">✓</span>
        </span>
        <span class="hg-bottom-label" id="bottom-auth-label">Login</span>
      </a>`;

const newStoreBottomTools = `      <a href="\${portalUrl}free-tools.html" class="hg-bottom-item" id="bottom-nav-tools" title="Free Developer Tools">
        <span class="hg-bottom-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
          </svg>
        </span>
        <span class="hg-bottom-label">Tools</span>
      </a>`;

if (js.includes(oldStoreBottomAuth)) {
  js = js.replace(oldStoreBottomAuth, newStoreBottomTools);
  console.log('[OK] Replaced bottom bar login tab with Tools tab for store page');
} else {
  console.log('[WARN] oldStoreBottomAuth pattern not found');
}

// 3. In mobileNav drawer footer actions: hide on store page
const oldDrawerAuth = `<div class="hg-mobile-footer-actions">
           <a href="\${loginUrl}" id="hg-mobile-drawer-auth" class="hg-btn hg-btn-primary" style="width: 100%; text-align:center;">Sign In to HarshGuruJi</a>
        </div>`;

const newDrawerAuth = `\${isStorePage ? '' : \`<div class="hg-mobile-footer-actions">
           <a href="\${loginUrl}" id="hg-mobile-drawer-auth" class="hg-btn hg-btn-primary" style="width: 100%; text-align:center;">Sign In to HarshGuruJi</a>
        </div>\`}`;

if (js.includes(oldDrawerAuth)) {
  js = js.replace(oldDrawerAuth, newDrawerAuth);
  console.log('[OK] Replaced mobile drawer login button for store page');
} else {
  console.log('[WARN] oldDrawerAuth pattern not found');
}

// 4. In updateNavUI: ensure if isStorePage, do not display loginBtn or bottomAuthItem if they don't apply
const oldUpdateNavUI = `    if (user) {
      if (loginBtn) loginBtn.style.display = 'none';`;

const newUpdateNavUI = `    if (isStorePage) {
      if (loginBtn) loginBtn.style.display = 'none';
      const mDrawerAuth = document.getElementById('hg-mobile-drawer-auth');
      if (mDrawerAuth) mDrawerAuth.style.display = 'none';
    }
    if (user) {
      if (loginBtn) loginBtn.style.display = 'none';`;

if (js.includes(oldUpdateNavUI)) {
  js = js.replace(oldUpdateNavUI, newUpdateNavUI);
  console.log('[OK] Guarded updateNavUI for isStorePage');
}

// 5. In updateNavUI else branch:
const oldUpdateNavUIElse = `    } else {
      if (loginBtn) { loginBtn.href = loginUrl; loginBtn.style.display = 'inline-flex'; }`;

const newUpdateNavUIElse = `    } else {
      if (loginBtn) { 
        loginBtn.href = loginUrl; 
        loginBtn.style.display = isStorePage ? 'none' : 'inline-flex'; 
      }`;

if (js.includes(oldUpdateNavUIElse)) {
  js = js.replace(oldUpdateNavUIElse, newUpdateNavUIElse);
  console.log('[OK] Guarded updateNavUI else branch for isStorePage');
}

fs.writeFileSync(jsPath, js, 'utf8');
console.log('Finished updating navbar-premium.js');
