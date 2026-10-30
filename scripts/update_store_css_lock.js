const fs = require('fs');

let css = fs.readFileSync('css/store.css', 'utf8');

const fixRule = `
/* ═══════════════════════════════════════════════════════════════════════════
   STRICT MOBILE NAVIGATION POSITION LOCK & ZERO HORIZONTAL SHIFT FIX
   ═══════════════════════════════════════════════════════════════════════════ */
html, body.store-page-body, .store-page-body {
  width: 100% !important;
  max-width: 100vw !important;
  overflow-x: hidden !important;
  position: relative !important;
  -webkit-overflow-scrolling: touch !important;
}

.store-page-body #hg-global-navbar,
.store-page-body .hg-header {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  z-index: 99999 !important;
  transform: none !important;
}

.store-page-body #hg-bottom-bar,
.store-page-body .hg-bottom-bar {
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  z-index: 99999 !important;
  transform: none !important;
}

/* Prevent any child section in store layout from blowing out the viewport */
.store-top-center-hero,
.store-layout,
.store-universal-search-box,
.an1-section {
  max-width: 100% !important;
  box-sizing: border-box !important;
  overflow-x: hidden !important;
}

/* Allow horizontal scroll ONLY inside the dedicated pill rows, never the page */
.store-pills-scroll,
.an1-chips-scroll,
.an1-tabs-row {
  max-width: 100% !important;
  overflow-x: auto !important;
  -webkit-overflow-scrolling: touch !important;
}
`;

if (!css.includes('STRICT MOBILE NAVIGATION POSITION LOCK')) {
  css += '\n' + fixRule;
  fs.writeFileSync('css/store.css', css, 'utf8');
  console.log('[OK] css/store.css updated with strict mobile navigation lock!');
} else {
  console.log('[INFO] Lock already present in store.css');
}
