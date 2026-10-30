const fs = require('fs');
let css = fs.readFileSync('navbar-premium.css', 'utf8');

const storeLoginHideCSS = `
/* ═══════════════════════════════════════════════════════════════════════════
   STORE LOGIN BUTTON REMOVAL (ZERO LOGIN TRACES ON GURUSTORE)
   ═══════════════════════════════════════════════════════════════════════════ */
.store-page-body #hg-login-btn,
.store-page-body #hg-mobile-drawer-auth,
.store-page-body .hg-mobile-footer-actions,
.store-page-body #bottom-nav-auth {
  display: none !important;
  visibility: hidden !important;
  pointer-events: none !important;
}
`;

if (!css.includes('STORE LOGIN BUTTON REMOVAL')) {
  css += '\n' + storeLoginHideCSS;
  fs.writeFileSync('navbar-premium.css', css, 'utf8');
  console.log('[OK] navbar-premium.css updated with store login removal rules!');
} else {
  console.log('[INFO] Rules already present in navbar-premium.css');
}
