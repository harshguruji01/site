const fs = require('fs');

const jsPath = 'navbar-premium.js';
let js = fs.readFileSync(jsPath, 'utf8');

// Target store block
const startMarker = '} else if (isStorePage) {';
const endMarker = '} else {\r\n    // Default Portal Navigation';
const endMarkerLF = '} else {\n    // Default Portal Navigation';

const sIdx = js.indexOf(startMarker);
let eIdx = js.indexOf(endMarker);
if (eIdx === -1) eIdx = js.indexOf(endMarkerLF);

if (sIdx === -1 || eIdx === -1) {
  console.error('Markers not found! sIdx:', sIdx, 'eIdx:', eIdx);
  process.exit(1);
}

const newStoreBlock = `} else if (isStorePage) {
    desktopNavListHTML = \`
      <!-- ReUI / 21st.dev Style Navigation Menu Trigger with Mega Menu Panel -->
      <li class="hg-nav-item hg-has-dropdown hg-reui-nav-item" id="nav-item-store-getting-started">
        <button type="button" class="hg-nav-link hg-reui-trigger active" id="nav-link-store-main" aria-expanded="false">
          <span>🛍️ GuruStore</span>
          <svg class="hg-reui-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"></path></svg>
        </button>
        <!-- ReUI / 21st.dev Card Panel with Description Previews -->
        <div class="hg-dropdown hg-reui-mega-panel">
          <div class="hg-reui-mega-grid">
            <a href="\${storeUrl}" class="hg-reui-card" id="reui-card-all">
              <div class="hg-reui-card-icon" style="background:rgba(56,189,248,0.12); color:#38bdf8;">📦</div>
              <div class="hg-reui-card-body">
                <div class="hg-reui-card-title">GuruStore Catalog</div>
                <div class="hg-reui-card-desc">Browse complete verified inventory of games, applications, and tools.</div>
              </div>
            </a>
            <a href="#sec-games" class="hg-reui-card" onclick="window.selectStoreNavFilter && window.selectStoreNavFilter('category', 'Game'); return false;">
              <div class="hg-reui-card-icon" style="background:rgba(236,72,153,0.12); color:#f472b6;">🎮</div>
              <div class="hg-reui-card-body">
                <div class="hg-reui-card-title">Web &amp; PC Games</div>
                <div class="hg-reui-card-desc">Play instant browser games like Chess, Snake, and Tic-Tac-Toe.</div>
              </div>
            </a>
            <a href="#sec-android" class="hg-reui-card" onclick="window.selectStoreNavFilter && window.selectStoreNavFilter('platform', 'Android'); return false;">
              <div class="hg-reui-card-icon" style="background:rgba(16,185,129,0.12); color:#34d399;">📱</div>
              <div class="hg-reui-card-body">
                <div class="hg-reui-card-title">Android APK Releases</div>
                <div class="hg-reui-card-desc">Direct high-speed downloads scanned across multi-engine antivirus.</div>
              </div>
            </a>
            <a href="#store-sections-view" class="hg-reui-card" onclick="window.selectStoreNavFilter && window.selectStoreNavFilter('platform', 'Windows'); return false;">
              <div class="hg-reui-card-icon" style="background:rgba(99,102,241,0.12); color:#818cf8;">💻</div>
              <div class="hg-reui-card-body">
                <div class="hg-reui-card-title">Windows Software</div>
                <div class="hg-reui-card-desc">Verified desktop utilities, emulators, and productive installers.</div>
              </div>
            </a>
          </div>
          <div class="hg-reui-mega-footer">
            <span class="hg-reui-footer-label">🛡️ 100% Cryptographically Verified &amp; Sandboxed Downloads</span>
            <a href="\${portalUrl}free-tools.html" class="hg-reui-footer-link">Developer Tools Hub &rarr;</a>
          </div>
        </div>
      </li>

      <!-- ReUI Secondary Trigger: Categories -->
      <li class="hg-nav-item hg-has-dropdown hg-reui-nav-item" id="nav-item-categories">
        <button type="button" class="hg-nav-link hg-reui-trigger" id="nav-link-categories" aria-expanded="false">
          <span>Categories</span>
          <svg class="hg-reui-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"></path></svg>
        </button>
        <div class="hg-dropdown hg-reui-dropdown-panel">
          <a href="#store-sections-view" class="hg-dropdown-link" onclick="window.selectStoreNavFilter && window.selectStoreNavFilter('category', 'Featured'); return false;">
            <span class="reui-link-icon">⭐</span>
            <div class="reui-link-text">
              <span class="reui-link-title">Editor's Choice</span>
              <span class="reui-link-desc">Featured handpicked apps &amp; games</span>
            </div>
          </a>
          <a href="#sec-games" class="hg-dropdown-link" onclick="window.selectStoreNavFilter && window.selectStoreNavFilter('category', 'Game'); return false;">
            <span class="reui-link-icon">🎮</span>
            <div class="reui-link-text">
              <span class="reui-link-title">Games &amp; Play</span>
              <span class="reui-link-desc">Interactive web games &amp; brain puzzles</span>
            </div>
          </a>
          <a href="#sec-android" class="hg-dropdown-link" onclick="window.selectStoreNavFilter && window.selectStoreNavFilter('category', 'Apps'); return false;">
            <span class="reui-link-icon">📱</span>
            <div class="reui-link-text">
              <span class="reui-link-title">Mobile Applications</span>
              <span class="reui-link-desc">Android APK packages &amp; utilities</span>
            </div>
          </a>
          <a href="#store-sections-view" class="hg-dropdown-link" onclick="window.selectStoreNavFilter && window.selectStoreNavFilter('category', 'Software'); return false;">
            <span class="reui-link-icon">💻</span>
            <div class="reui-link-text">
              <span class="reui-link-title">Desktop Software</span>
              <span class="reui-link-desc">Windows EXE &amp; utility tools</span>
            </div>
          </a>
          <a href="#store-sections-view" class="hg-dropdown-link" onclick="window.selectStoreNavFilter && window.selectStoreNavFilter('category', 'AI'); return false;">
            <span class="reui-link-icon">🤖</span>
            <div class="reui-link-text">
              <span class="reui-link-title">AI &amp; Productivity</span>
              <span class="reui-link-desc">Next-gen AI assistant tools</span>
            </div>
          </a>
          <div class="hg-dropdown-divider"></div>
          <a href="#store-sections-view" class="hg-dropdown-link" onclick="window.selectStoreNavFilter && window.selectStoreNavFilter('category', 'All'); return false;">
            <span class="reui-link-icon">🔄</span>
            <div class="reui-link-text">
              <span class="reui-link-title">View All Releases</span>
              <span class="reui-link-desc">Clear filters and show full inventory</span>
            </div>
          </a>
        </div>
      </li>

      <!-- ReUI Standard Direct Links -->
      <li class="hg-nav-item"><a href="\${homeUrl}" class="hg-nav-link" id="nav-link-home">Home</a></li>
      <li class="hg-nav-item"><a href="\${booksUrl}" class="hg-nav-link" id="nav-link-books" target="\${isLocal ? '_self' : '_blank'}" rel="noopener noreferrer">Books</a></li>
      <li class="hg-nav-item"><a href="\${chatUrl}" class="hg-nav-link" id="nav-link-chat" target="\${isLocal ? '_self' : '_blank'}" rel="noopener noreferrer">Chat</a></li>
      <li class="hg-nav-item"><a href="\${portalUrl}free-tools.html" class="hg-nav-link" id="nav-link-tools">Tools</a></li>
    \`;

    mobileNavListHTML = \`
      <li>
        <a href="\${storeUrl}" class="hg-mobile-link active" id="mob-link-store">
          <span>🛍️ GuruStore</span>
          <span style="font-size:0.75rem; background:rgba(56,189,248,0.2); color:#38bdf8; padding:2px 8px; border-radius:12px; font-weight:700;">LIVE</span>
        </a>
      </li>

      <li class="hg-mobile-item hg-has-accordion open" id="mob-item-store-cats">
        <button type="button" class="hg-mobile-accordion-toggle">
          <span>📂 Store Categories</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg>
        </button>
        <div class="hg-mobile-accordion-content">
          <a href="#sec-games" class="hg-mobile-sublink" onclick="window.selectStoreNavFilter && window.selectStoreNavFilter('category', 'Game'); return false;">
            <div style="font-weight:600; color:#fff;">🎮 Web Games</div>
            <div style="font-size:0.78rem; color:#94a3b8;">Chess, Snake, Tic-Tac-Toe &amp; Arcade</div>
          </a>
          <a href="#sec-android" class="hg-mobile-sublink" onclick="window.selectStoreNavFilter && window.selectStoreNavFilter('platform', 'Android'); return false;">
            <div style="font-weight:600; color:#fff;">📱 Android APKs</div>
            <div style="font-size:0.78rem; color:#94a3b8;">Direct verified APK installers</div>
          </a>
          <a href="#store-sections-view" class="hg-mobile-sublink" onclick="window.selectStoreNavFilter && window.selectStoreNavFilter('platform', 'Windows'); return false;">
            <div style="font-weight:600; color:#fff;">💻 Windows (PC)</div>
            <div style="font-size:0.78rem; color:#94a3b8;">Desktop software &amp; emulators</div>
          </a>
          <a href="#store-sections-view" class="hg-mobile-sublink" onclick="window.selectStoreNavFilter && window.selectStoreNavFilter('category', 'AI'); return false;">
            <div style="font-weight:600; color:#fff;">🤖 AI &amp; Web Apps</div>
            <div style="font-size:0.78rem; color:#94a3b8;">ChatBase, AI Hub &amp; productive tools</div>
          </a>
          <a href="#store-sections-view" class="hg-mobile-sublink" onclick="window.selectStoreNavFilter && window.selectStoreNavFilter('category', 'All'); return false;">
            <div style="font-weight:600; color:#38bdf8;">🔄 View All Releases</div>
            <div style="font-size:0.78rem; color:#94a3b8;">Browse complete catalog</div>
          </a>
        </div>
      </li>

      <li><a href="\${homeUrl}" class="hg-mobile-link" id="mob-link-home">🏠 HarshGuruJi Home</a></li>
      <li><a href="\${booksUrl}" class="hg-mobile-link" id="mob-link-books" target="\${isLocal ? '_self' : '_blank'}" rel="noopener noreferrer">📚 NCERT Books Library</a></li>
      <li><a href="\${chatUrl}" class="hg-mobile-link" id="mob-link-chat" target="\${isLocal ? '_self' : '_blank'}" rel="noopener noreferrer">💬 Community Chat</a></li>
      <li><a href="\${portalUrl}free-tools.html" class="hg-mobile-link">🛠️ Free Developer Tools</a></li>
      <li><a href="\${portalUrl}contact.html" class="hg-mobile-link">📬 Contact &amp; Support</a></li>
    \`;

    bottomBarHTML = \`
      <a href="\${homeUrl}" class="hg-bottom-item" id="bottom-nav-home" title="Portal Home">
        <span class="hg-bottom-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </span>
        <span class="hg-bottom-label">Home</span>
      </a>

      <a href="#sec-games" class="hg-bottom-item" id="bottom-nav-games" title="Web Games" onclick="window.selectStoreNavFilter && window.selectStoreNavFilter('category', 'Game'); return false;">
        <span class="hg-bottom-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="6 12 10 8 14 12 10 16 6 12"></polygon>
            <path d="M18 11l-2-2 2-2"></path>
            <circle cx="16" cy="16" r="2"></circle>
          </svg>
        </span>
        <span class="hg-bottom-label">Games</span>
      </a>

      <a href="\${storeUrl}" class="hg-bottom-item hg-bottom-item-home active" id="bottom-nav-store" title="GuruStore">
        <span class="hg-bottom-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </span>
        <span class="hg-bottom-label">GuruStore</span>
      </a>

      <a href="#sec-android" class="hg-bottom-item" id="bottom-nav-apks" title="Android APKs" onclick="window.selectStoreNavFilter && window.selectStoreNavFilter('platform', 'Android'); return false;">
        <span class="hg-bottom-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
          </svg>
        </span>
        <span class="hg-bottom-label">APKs</span>
      </a>

      <a href="\${booksUrl}" class="hg-bottom-item" id="bottom-nav-books" target="\${isLocal ? '_self' : '_blank'}" rel="noopener noreferrer" title="NCERT Books">
        <span class="hg-bottom-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </span>
        <span class="hg-bottom-label">Books</span>
      </a>

      <a href="\${loginUrl}" class="hg-bottom-item" id="bottom-nav-auth" title="Profile / Account">
        <span class="hg-bottom-icon" id="bottom-auth-icon-wrap">
          <svg id="bottom-auth-default-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <img id="bottom-auth-avatar" src="\${prefix}logo.png" alt="Profile" style="display:none;" />
          <span id="bottom-golden-tick" class="bottom-golden-tick" style="display:none;">✓</span>
        </span>
        <span class="hg-bottom-label" id="bottom-auth-label">Login</span>
      </a>
    \`;
  `;

js = js.substring(0, sIdx) + newStoreBlock + js.substring(eIdx);
fs.writeFileSync(jsPath, js, 'utf8');
console.log('[OK] navbar-premium.js store navigation updated!');
