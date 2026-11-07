const fs = require('fs');
const path = require('path');

function updateCssFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let css = fs.readFileSync(filePath, 'utf8');

  // Replace dropdown styling with Origin UI animation
  const oldDropdownPattern = /\.hg-nav-link\s*\{[\s\S]*?\.hg-dropdown-divider\s*\{[^}]*\}/;
  const newDropdownCss = `.hg-nav-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--hg-text-secondary);
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.hg-nav-link:hover {
  color: var(--hg-text-primary);
  background: rgba(255, 255, 255, 0.06);
}

.hg-nav-link.active {
  color: #ef4444 !important;
  font-weight: 600 !important;
  background: rgba(239, 68, 68, 0.12) !important;
  border-radius: 8px;
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.25) !important;
}

.hg-nav-link svg, .hg-reui-chevron {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.hg-has-dropdown:hover > .hg-nav-link svg,
.hg-has-dropdown.open > .hg-nav-link svg,
.hg-reui-nav-item:hover .hg-reui-chevron {
  transform: rotate(180deg);
}

/* Origin UI Dropdown Animation */
.hg-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) translateY(8px) scale(0.96);
  background: rgba(15, 17, 23, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 0.5rem;
  min-width: 220px;
  box-shadow: 0 16px 36px -10px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.2s;
  z-index: 100;
}

.hg-nav-item:hover .hg-dropdown,
.hg-user-menu:hover .hg-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0) scale(1);
  pointer-events: auto;
}

.hg-user-menu .hg-dropdown {
  left: auto;
  right: 0;
  transform: translateX(0) translateY(8px) scale(0.96);
}
.hg-user-menu:hover .hg-dropdown {
  transform: translateX(0) translateY(0) scale(1);
}

.hg-dropdown-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  color: var(--hg-text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  border-radius: 8px;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.hg-dropdown-link:hover {
  background: rgba(255, 255, 255, 0.06);
  color: var(--hg-text-primary);
  transform: translateX(3px);
}

.hg-dropdown-link.active {
  color: #ef4444 !important;
  font-weight: 600 !important;
  background: rgba(239, 68, 68, 0.12) !important;
  border-radius: 6px;
}

.hg-dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0.4rem 0;
}`;

  if (oldDropdownPattern.test(css)) {
    css = css.replace(oldDropdownPattern, newDropdownCss);
  }

  // Update mobile active styles to Red
  css = css.replace(/\.hg-mobile-link\.active,\s*\.hg-mobile-accordion-toggle\.active\s*\{[^}]*\}/g,
    `.hg-mobile-link.active, .hg-mobile-accordion-toggle.active {
  color: #ef4444 !important;
  font-weight: 600;
  background: rgba(239, 68, 68, 0.1) !important;
  border-left: 3px solid #ef4444;
  padding-left: 1rem;
}`);

  // Update bottom bar active styles to Red
  css = css.replace(/\.hg-bottom-item\.active\s*\{[\s\S]*?color:\s*#ff6b4a;[\s\S]*?\}/g,
    `.hg-bottom-item.active {
  color: #ef4444 !important;
}`);

  css = css.replace(/\.hg-bottom-item\.active\s*\.hg-bottom-icon\s*svg\s*\{[\s\S]*?stroke:\s*#ff6b4a;[\s\S]*?\}/g,
    `.hg-bottom-item.active .hg-bottom-icon svg {
  stroke: #ef4444 !important;
  filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.7));
  transform: translateY(-2px);
}`);

  css = css.replace(/\.hg-bottom-item\.active\s*\.hg-bottom-label\s*\{[\s\S]*?color:\s*#ff6b4a;[\s\S]*?\}/g,
    `.hg-bottom-item.active .hg-bottom-label {
  color: #ef4444 !important;
  font-weight: 700;
}`);

  css = css.replace(/\.hg-bottom-item\.active::before\s*\{[\s\S]*?background:\s*linear-gradient\(90deg,\s*#ff6b4a,\s*#ec4899\);[\s\S]*?\}/g,
    `.hg-bottom-item.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2.5px;
  border-radius: 0 0 4px 4px;
  background: #ef4444 !important;
  box-shadow: 0 2px 10px rgba(239, 68, 68, 0.8) !important;
}`);

  css = css.replace(/\.hg-bottom-item-home\.active\s*\.hg-bottom-icon\s*\{[\s\S]*?background:\s*linear-gradient\(135deg,\s*#ff6b4a\s*0%,\s*#ec4899\s*100%\);[\s\S]*?\}/g,
    `.hg-bottom-item-home.active .hg-bottom-icon {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
  border-color: #ef4444 !important;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.7) !important;
  transform: translateY(-2px);
}`);

  css = css.replace(/\.hg-bottom-item-home\.active\s*\.hg-bottom-label\s*\{[\s\S]*?color:\s*#ff6b4a;[\s\S]*?\}/g,
    `.hg-bottom-item-home.active .hg-bottom-label {
  color: #ef4444 !important;
  font-weight: 700;
}`);

  const activeGlobalOverride = `
/* ==========================================================================
   ORIGIN UI ACTIVE NAVBAR RED ACCENT - GLOBAL SPECIFICITY
   ========================================================================== */
.hg-nav-link.active,
.hg-reui-trigger.active {
  color: #ef4444 !important;
  font-weight: 600 !important;
  background: rgba(239, 68, 68, 0.12) !important;
  border-radius: 8px !important;
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.25) !important;
}
.hg-nav-link.active svg,
.hg-reui-trigger.active svg {
  stroke: #ef4444 !important;
}
.hg-dropdown-link.active,
.hg-reui-card.active {
  color: #ef4444 !important;
  font-weight: 600 !important;
  background: rgba(239, 68, 68, 0.12) !important;
  border-radius: 6px !important;
}
.hg-mobile-link.active,
.hg-mobile-sublink.active {
  color: #ef4444 !important;
  font-weight: 600 !important;
  background: rgba(239, 68, 68, 0.1) !important;
  border-left: 3px solid #ef4444 !important;
  padding-left: 1rem !important;
}
.hg-bottom-item.active {
  color: #ef4444 !important;
}
.hg-bottom-item.active .hg-bottom-icon svg {
  stroke: #ef4444 !important;
  filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.7)) !important;
}
.hg-bottom-item.active .hg-bottom-label {
  color: #ef4444 !important;
  font-weight: 700 !important;
}
`;

  if (!css.includes('ORIGIN UI ACTIVE NAVBAR RED ACCENT - GLOBAL SPECIFICITY')) {
    css += activeGlobalOverride;
  }

  fs.writeFileSync(filePath, css, 'utf8');
  console.log('Updated:', filePath);
}

// Update site and siblings
const targets = [
  path.join(__dirname, '../navbar-premium.css'),
  path.join(__dirname, '../../login/navbar-premium.css'),
  path.join(__dirname, '../../books/navbar-premium.css'),
  path.join(__dirname, '../../store/navbar-premium.css'),
];

targets.forEach(t => updateCssFile(t));
