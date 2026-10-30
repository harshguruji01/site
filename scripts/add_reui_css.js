const fs = require('fs');

const cssPath = 'navbar-premium.css';
let css = fs.readFileSync(cssPath, 'utf8');

const reuiStyles = `
/* ==========================================================================
   REUI / 21ST.DEV NAVIGATION MENU STYLES (MATCHING @SEAN0205 NAVIGATION-MENU-1)
   ========================================================================== */

/* Navigation Trigger Buttons */
.hg-reui-trigger {
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  background: transparent !important;
  border: none !important;
  color: var(--hg-text-secondary, #94a3b8) !important;
  font-family: inherit !important;
  font-size: 0.92rem !important;
  font-weight: 500 !important;
  padding: 0.5rem 0.85rem !important;
  border-radius: 8px !important;
  cursor: pointer !important;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
  outline: none !important;
}

.hg-reui-trigger:hover,
.hg-reui-trigger.active,
.hg-reui-nav-item:hover .hg-reui-trigger {
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.08) !important;
}

.hg-reui-chevron {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 0.7;
}

.hg-reui-nav-item:hover .hg-reui-chevron,
.hg-reui-nav-item.open .hg-reui-chevron {
  transform: rotate(180deg);
  opacity: 1;
}

/* ReUI Mega Menu Panel Container (21st.dev / Shadcn NavigationMenuContent) */
.hg-reui-mega-panel {
  min-width: 480px !important;
  max-width: 540px !important;
  padding: 1rem !important;
  background: rgba(13, 17, 27, 0.97) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 16px !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(99, 102, 241, 0.15) !important;
}

.hg-reui-mega-grid {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
  gap: 8px !important;
}

/* ReUI Individual Card Item */
.hg-reui-card {
  display: flex !important;
  align-items: flex-start !important;
  gap: 12px !important;
  padding: 0.75rem 0.85rem !important;
  border-radius: 12px !important;
  text-decoration: none !important;
  background: transparent !important;
  border: 1px solid transparent !important;
  transition: all 0.2s ease !important;
}

.hg-reui-card:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  transform: translateY(-1px) !important;
}

.hg-reui-card-icon {
  width: 36px !important;
  height: 36px !important;
  border-radius: 10px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 1.15rem !important;
  flex-shrink: 0 !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.hg-reui-card-body {
  display: flex !important;
  flex-direction: column !important;
  gap: 2px !important;
}

.hg-reui-card-title {
  color: #ffffff !important;
  font-weight: 600 !important;
  font-size: 0.88rem !important;
  line-height: 1.3 !important;
}

.hg-reui-card-desc {
  color: #94a3b8 !important;
  font-size: 0.76rem !important;
  line-height: 1.4 !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
}

/* ReUI Mega Panel Footer */
.hg-reui-mega-footer {
  margin-top: 0.85rem !important;
  padding-top: 0.75rem !important;
  border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  font-size: 0.75rem !important;
  padding-left: 0.5rem !important;
  padding-right: 0.5rem !important;
}

.hg-reui-footer-label {
  color: #64748b !important;
  font-weight: 500 !important;
}

.hg-reui-footer-link {
  color: #38bdf8 !important;
  font-weight: 600 !important;
  text-decoration: none !important;
  transition: color 0.2s ease !important;
}

.hg-reui-footer-link:hover {
  color: #7dd3fc !important;
}

/* ReUI Dropdown Panel (Single Column list with icon + description) */
.hg-reui-dropdown-panel {
  min-width: 290px !important;
  padding: 0.5rem !important;
  border-radius: 14px !important;
  background: rgba(13, 17, 27, 0.98) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5) !important;
}

.hg-reui-dropdown-panel .hg-dropdown-link {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  padding: 0.65rem 0.85rem !important;
  border-radius: 10px !important;
}

.reui-link-icon {
  font-size: 1.15rem !important;
  width: 28px !important;
  height: 28px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: rgba(255, 255, 255, 0.04) !important;
  border-radius: 8px !important;
  border: 1px solid rgba(255, 255, 255, 0.06) !important;
  flex-shrink: 0 !important;
}

.reui-link-text {
  display: flex !important;
  flex-direction: column !important;
  gap: 2px !important;
}

.reui-link-title {
  color: #ffffff !important;
  font-weight: 600 !important;
  font-size: 0.86rem !important;
}

.reui-link-desc {
  color: #94a3b8 !important;
  font-size: 0.74rem !important;
  line-height: 1.3 !important;
}

/* ==========================================================================
   MOBILE STORE SPECIFIC STABILITY & ZERO HORIZONTAL SHAKE ENFORCEMENT
   ========================================================================== */
@media (max-width: 1024px) {
  /* Enforce exact zero margin/overflow on store headers */
  .store-page-body .hg-header,
  .store-page-body #hg-global-navbar {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100vw !important;
    max-width: 100vw !important;
    margin: 0 !important;
    box-sizing: border-box !important;
    z-index: 99999 !important;
    transform: none !important;
    overflow-x: hidden !important;
  }

  .store-page-body .hg-bottom-bar,
  .store-page-body #hg-bottom-bar {
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100vw !important;
    max-width: 100vw !important;
    margin: 0 !important;
    box-sizing: border-box !important;
    z-index: 99999 !important;
    transform: none !important;
    overflow-x: hidden !important;
  }

  .store-page-body .hg-mobile-nav {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    max-width: 100vw !important;
    height: 100vh !important;
    box-sizing: border-box !important;
    overflow-x: hidden !important;
  }

  .store-page-body .hg-nav-container {
    padding-left: 12px !important;
    padding-right: 12px !important;
    width: 100% !important;
    max-width: 100vw !important;
    box-sizing: border-box !important;
  }
}
`;

if (!css.includes('REUI / 21ST.DEV NAVIGATION MENU STYLES')) {
  css += '\n' + reuiStyles;
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('[OK] navbar-premium.css updated with ReUI styles and store mobile stability!');
} else {
  console.log('[INFO] ReUI styles already present in navbar-premium.css');
}
