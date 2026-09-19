// Global early PWA install prompt capture across all pages
if (typeof window !== 'undefined' && !window.__hgPromptCaptured) {
  window.__hgPromptCaptured = true;
  window.__hgDeferredPrompt = window.__hgDeferredPrompt || null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.__hgDeferredPrompt = e;
    window.deferredPwaPrompt = e;
    window.dispatchEvent(new CustomEvent('hg-pwa-ready'));
  });
}

document.addEventListener('DOMContentLoaded', () => {

  // --- Context-Aware Path Resolver ---
  // The prefix helps correctly link assets/pages if we are currently inside a subdirectory (e.g. /games/snake.html)
  const isSubDir = window.location.pathname.includes('/tools/') || 
                   window.location.pathname.includes('/games/') || 
                   window.location.pathname.includes('/learning/') || 
                   window.location.pathname.includes('/oauth/') || 
                   window.location.pathname.includes('/Quiz');
  const prefix = isSubDir ? '../' : '';

  // Remove old implementations if present
  const oldNav = document.getElementById('hg-global-navbar');
  const oldMobile = document.getElementById('hg-mobile-nav');
  const oldBottom = document.getElementById('hg-bottom-bar');
  const oldFloatingChat = document.getElementById('hg-floating-chat-btn');
  if (oldNav) oldNav.remove();
  if (oldMobile) oldMobile.remove();
  if (oldBottom) oldBottom.remove();
  if (oldFloatingChat) oldFloatingChat.remove();
  
  // Legacy cleanup
  document.querySelectorAll('.premium-navbar, .premium-mobile-nav').forEach(el => el.remove());

  // Ensure PWA Install & Shortcut resources are loaded across all pages
  if (!document.getElementById('hg-pwa-css')) {
    const pwaLink = document.createElement('link');
    pwaLink.id = 'hg-pwa-css';
    pwaLink.rel = 'stylesheet';
    pwaLink.href = `${prefix}css/pwa-install.css`;
    document.head.appendChild(pwaLink);
  }
  if (!window.__HG_PWA_INITIALIZED__ && !document.getElementById('hg-pwa-js')) {
    const pwaScript = document.createElement('script');
    pwaScript.id = 'hg-pwa-js';
    pwaScript.src = `${prefix}js/pwa-install.js`;
    pwaScript.defer = true;
    document.body.appendChild(pwaScript);
  }

  const navHTML = `
    <!-- Global Header -->
    <header class="hg-header" id="hg-global-navbar" aria-label="Main Navigation">
      <div class="hg-nav-container">
        
        <!-- Brand / Logo (Left untouched) -->
        <a href="${prefix}index.html" class="hg-nav-logo" aria-label="HarshGuruJi Home">
          <img src="${prefix}logo.png" alt="HarshGuruJi Logo" fetchpriority="high">
          <span class="hg-brand-text">HarshGuruJi</span>
        </a>

        <!-- Desktop Navigation: Home | Daily Special | Store | Contributor | More -->
        <nav class="hg-desktop-nav">
          <ul class="hg-nav-list">
            <li class="hg-nav-item"><a href="${prefix}index.html" class="hg-nav-link" id="nav-link-home">Home</a></li>
            <li class="hg-nav-item"><a href="${prefix}daily-special.html" class="hg-nav-link" id="nav-link-dailyspecial">Daily Special</a></li>
            <li class="hg-nav-item"><a href="${prefix}store.html" class="hg-nav-link" id="nav-link-store">Store</a></li>
            <li class="hg-nav-item"><a href="https://chat.webguruji.online" class="hg-nav-link" id="nav-link-chat" target="_blank" rel="noopener noreferrer">Chat</a></li>
            <li class="hg-nav-item"><a href="${prefix}contributor.html" class="hg-nav-link" id="nav-link-contributor">Contributor</a></li>
            
            <li class="hg-nav-item hg-has-dropdown" id="nav-item-more">
              <a href="#" class="hg-nav-link" id="nav-link-more" onclick="return false;">More <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg></a>
              <div class="hg-dropdown">
                <a href="${prefix}free-tools.html" class="hg-dropdown-link">🛠️ Tools Hub</a>
                <a href="${prefix}ai-hub.html" class="hg-dropdown-link">🤖 AI Hub</a>
                <a href="${prefix}learning-hub.html" class="hg-dropdown-link">📚 Learning Hub</a>
                <a href="${prefix}gaming-hub.html" class="hg-dropdown-link">🎮 Gaming Hub</a>
                <div class="hg-dropdown-divider"></div>
                <a href="${prefix}about.html" class="hg-dropdown-link">About Us</a>
                <a href="${prefix}contact.html" class="hg-dropdown-link">Contact</a>
                <a href="${prefix}privacy-policy.html" class="hg-dropdown-link">Privacy Policy</a>
                <a href="${prefix}terms-and-conditions.html" class="hg-dropdown-link">Terms &amp; Conditions</a>
              </div>
            </li>
          </ul>
        </nav>

        <!-- Right Side Actions -->
        <div class="hg-nav-actions">
          
          <!-- Desktop Searchbox with autocomplete dropdown -->
          <div class="hg-search-wrapper">
            <div class="hg-search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>
              <input type="text" id="hg-search-input" placeholder="Search entire site..." aria-label="Search the website" autocomplete="off">
            </div>
            <div class="hg-search-dropdown" id="hg-search-dropdown-desktop"></div>
          </div>

          <!-- Mobile Search Trigger Button -->
          <button type="button" class="hg-mobile-search-btn" id="hg-mobile-search-btn" aria-label="Search Site" title="Search HarshGuruJi">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>
          </button>
          
          <!-- Auth (Dynamic via JS) -->
          <a href="${prefix}login.html" id="hg-login-btn" class="hg-btn hg-btn-primary">Login</a>

          <!-- Notifications Bell & Feedback Dropdown (For Logged In Users) -->
          <div class="hg-notif-container" id="hg-notif-container" style="display:none;">
            <button type="button" class="hg-notif-btn" id="hg-notif-btn" aria-label="Feedback & Messages" title="My Feedback & Messages">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span class="hg-notif-badge" id="hg-notif-badge" style="display:none;">0</span>
            </button>
            
            <div class="hg-notif-dropdown" id="hg-notif-dropdown" style="display:none;">
              <div class="hg-notif-header">
                <div class="hg-notif-header-title">
                  <span>🔔</span>
                  <span>Feedback &amp; Messages</span>
                </div>
                <button type="button" class="hg-notif-refresh-btn" id="hg-notif-refresh" title="Refresh Messages">↻</button>
              </div>
              <div class="hg-notif-list" id="hg-notif-list">
                <div class="hg-notif-empty">Loading messages...</div>
              </div>
              <div class="hg-notif-footer">
                <a href="${prefix}contact.html">Send New Feedback / Message &rarr;</a>
                <div style="font-size:0.72rem; color:#71717a; margin-top:4px;">⏱️ Messages auto-clear after 1 to 2 weeks</div>
              </div>
            </div>
          </div>
          
          <div class="hg-user-menu" id="hg-user-profile" style="display:none;">
            <div class="hg-user-trigger" tabindex="0" role="button" aria-haspopup="true">
              <div class="hg-avatar-wrap" id="hg-user-avatar-wrap">
                <img src="${prefix}logo.png" alt="User" id="hg-user-avatar">
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg>
            </div>
            <div class="hg-dropdown hg-dropdown-right">
              <a href="${prefix}dashboard.html" class="hg-dropdown-link">Dashboard</a>
              <a href="${prefix}settings.html" class="hg-dropdown-link">Settings</a>
              <div class="hg-dropdown-divider"></div>
              <button id="hg-logout-btn" class="hg-dropdown-link" style="width:100%; text-align:left; border:none; background:none; cursor:pointer; font-family:inherit;">Logout</button>
            </div>
          </div>
        </div>

      </div>

      <!-- Mobile Expandable Search Strip (Revealed when tapping search icon on phone) -->
      <div class="hg-mobile-search-strip" id="hg-mobile-search-strip" style="display:none;">
        <div class="hg-search-box" style="display:flex; width:100%;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>
          <input type="text" id="hg-search-input-strip" placeholder="Search entire site..." aria-label="Search website" autocomplete="off" style="width:100%;">
        </div>
        <div class="hg-search-dropdown" id="hg-search-dropdown-strip"></div>
      </div>
    </header>

    <!-- Mobile Navigation Overlay -->
    <div class="hg-mobile-nav" id="hg-mobile-nav" aria-hidden="true">
      <div class="hg-mobile-scroll">

        <!-- Mobile Drawer Search -->
        <div class="hg-mobile-drawer-search">
          <div class="hg-search-box" style="display:flex; width:100%;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>
            <input type="text" id="hg-search-input-mobile" placeholder="Search entire site..." aria-label="Search website" autocomplete="off" style="width:100%;">
          </div>
          <div class="hg-search-dropdown" id="hg-search-dropdown-mobile"></div>
        </div>

        <ul class="hg-mobile-list">
          <li><a href="${prefix}index.html" class="hg-mobile-link" id="mob-link-home">Home</a></li>
          <li><a href="${prefix}daily-special.html" class="hg-mobile-link" id="mob-link-dailyspecial">Daily Special</a></li>
          <li><a href="${prefix}store.html" class="hg-mobile-link" id="mob-link-store">Store</a></li>
          <li><a href="https://chat.webguruji.online" class="hg-mobile-link" id="mob-link-chat" target="_blank" rel="noopener noreferrer">Chat</a></li>
          <li><a href="${prefix}contributor.html" class="hg-mobile-link" id="mob-link-contributor">Contributor</a></li>
          
          <li class="hg-mobile-item hg-has-accordion" id="mob-item-more">
            <button type="button" class="hg-mobile-accordion-toggle">More <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg></button>
            <div class="hg-mobile-accordion-content">
              <a href="${prefix}free-tools.html" class="hg-mobile-sublink">🛠️ Tools Hub</a>
              <a href="${prefix}ai-hub.html" class="hg-mobile-sublink">🤖 AI Hub</a>
              <a href="${prefix}learning-hub.html" class="hg-mobile-sublink">📚 Learning Hub</a>
              <a href="${prefix}gaming-hub.html" class="hg-mobile-sublink">🎮 Gaming Hub</a>
              <a href="${prefix}about.html" class="hg-mobile-sublink">About Us</a>
              <a href="${prefix}contact.html" class="hg-mobile-sublink">Contact</a>
              <a href="${prefix}privacy-policy.html" class="hg-mobile-sublink">Privacy Policy</a>
              <a href="${prefix}terms-and-conditions.html" class="hg-mobile-sublink">Terms &amp; Conditions</a>
            </div>
          </li>
        </ul>
        
        <div class="hg-mobile-footer-actions">
           <a href="${prefix}login.html" id="hg-mobile-drawer-auth" class="hg-btn hg-btn-primary" style="width: 100%; text-align:center;">Sign In to HarshGuruJi</a>
        </div>
      </div>
    </div>

    <!-- Mobile & Tablet Bottom Navigation Bar (Low-Ratio Devices Only) -->
    <nav class="hg-bottom-bar" id="hg-bottom-bar" aria-label="Mobile Navigation">
      <a href="${prefix}index.html" class="hg-bottom-item" id="bottom-nav-home">
        <span class="hg-bottom-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </span>
        <span class="hg-bottom-label">Home</span>
      </a>

      <a href="${prefix}daily-special.html" class="hg-bottom-item" id="bottom-nav-dailyspecial">
        <span class="hg-bottom-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </span>
        <span class="hg-bottom-label">Daily Special</span>
      </a>

      <a href="${prefix}store.html" class="hg-bottom-item" id="bottom-nav-store">
        <span class="hg-bottom-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </span>
        <span class="hg-bottom-label">Store</span>
      </a>

      <a href="${prefix}login.html" class="hg-bottom-item" id="bottom-nav-auth">
        <span class="hg-bottom-icon" id="bottom-auth-icon-wrap">
          <svg id="bottom-auth-default-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <img id="bottom-auth-avatar" src="${prefix}logo.png" alt="Profile" style="display:none;" />
          <span id="bottom-golden-tick" class="bottom-golden-tick" style="display:none;">✓</span>
        </span>
        <span class="hg-bottom-label" id="bottom-auth-label">Login</span>
      </a>
    </nav>

    <!-- Mobile Bottom Profile Sheet (<= 1024px) -->
    <div class="hg-bottom-profile-overlay" id="hg-bottom-profile-overlay" style="display:none;" aria-hidden="true">
      <div class="hg-bottom-profile-sheet" id="hg-bottom-profile-sheet">
        <div class="hg-bottom-sheet-handle"></div>
        <div class="hg-bottom-profile-header">
          <div class="hg-bottom-profile-avatar-wrap">
            <img id="hg-bottom-sheet-avatar" src="${prefix}logo.png" alt="User">
          </div>
          <div class="hg-bottom-profile-meta">
            <div class="hg-bottom-profile-name" id="hg-bottom-sheet-name">User</div>
            <div class="hg-bottom-profile-email" id="hg-bottom-sheet-email">user@example.com</div>
          </div>
          <button class="hg-bottom-sheet-close" id="hg-bottom-sheet-close" aria-label="Close Profile Menu">&times;</button>
        </div>
        <div class="hg-bottom-profile-links">
          <a href="${prefix}dashboard.html" class="hg-bottom-sheet-link">
            <span class="hg-sheet-icon">📊</span>
            <span>Dashboard</span>
          </a>
          <a href="${prefix}settings.html" class="hg-bottom-sheet-link">
            <span class="hg-sheet-icon">⚙️</span>
            <span>Settings</span>
          </a>
          <div class="hg-bottom-sheet-divider"></div>
          <button id="hg-bottom-sheet-logout-btn" class="hg-bottom-sheet-link hg-bottom-sheet-logout">
            <span class="hg-sheet-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('afterbegin', navHTML);

  // --- Logic Bindings ---
  
  const header = document.getElementById('hg-global-navbar');
  const hamburger = document.getElementById('hg-hamburger');
  const mobileNav = document.getElementById('hg-mobile-nav');
  
  // 1. Scroll Effect (Sticky Header shadow)
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('hg-scrolled');
      } else {
        header.classList.remove('hg-scrolled');
      }
    }, { passive: true });
  }

  // 2. Mobile Menu Toggle
  function closeMobileMenu() {
    if (!hamburger || !mobileNav) return;
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('active');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = hamburger.classList.contains('active');
      if (isActive) {
        closeMobileMenu();
      } else {
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        mobileNav.classList.add('active');
        mobileNav.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      }
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (mobileNav.classList.contains('active') && !mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  // Highlight active bottom navigation tab based on URL path
  const currentNavPath = (window.location.pathname || '').toLowerCase();
  const isHomePath = currentNavPath.endsWith('/') || currentNavPath.endsWith('/index.html') || currentNavPath.endsWith('site/') || currentNavPath === '';
  const isDailySpecialPath = currentNavPath.includes('daily-special');
  const isStorePath = currentNavPath.includes('store') || currentNavPath.includes('app.html');
  const isAuthPath = currentNavPath.includes('login') || currentNavPath.includes('signup') || currentNavPath.includes('dashboard') || currentNavPath.includes('settings');
  const isChatPath = currentNavPath.includes('chat');

  if (isHomePath) {
    document.getElementById('bottom-nav-home')?.classList.add('active');
  } else if (isDailySpecialPath) {
    document.getElementById('bottom-nav-dailyspecial')?.classList.add('active');
  } else if (isStorePath) {
    document.getElementById('bottom-nav-store')?.classList.add('active');
  } else if (isAuthPath) {
    document.getElementById('bottom-nav-auth')?.classList.add('active');
  }

  if (isChatPath) {
    document.getElementById('nav-link-chat')?.classList.add('active');
    document.getElementById('mob-link-chat')?.classList.add('active');
    document.body.classList.add('is-chat-page');
  }

  // 3. Mobile Accordions (for More section)
  const accordions = document.querySelectorAll('.hg-mobile-accordion-toggle');
  accordions.forEach(acc => {
    acc.addEventListener('click', () => {
      const parent = acc.parentElement;
      const isOpen = parent.classList.contains('open');
      
      // Close all others
      document.querySelectorAll('.hg-mobile-item.open').forEach(item => {
        if (item !== parent) item.classList.remove('open');
      });
      
      // Toggle current
      if (isOpen) {
        parent.classList.remove('open');
      } else {
        parent.classList.add('open');
      }
    });
  });

  // =========================================================================
  // 4. ENTIRE SITE SEARCH IMPLEMENTATION (Tools, Apps, Games, Learning, Pages)
  // =========================================================================

  const SITE_SEARCH_INDEX = [
    // --- AUTH & ACCOUNT ---
    { 
      title: 'Login / Sign In', 
      desc: 'Sign in to your account, access dashboard, tools, and manage saved preferences', 
      url: 'login.html', 
      type: 'auth', 
      icon: '🔐', 
      keywords: 'login log in signin sign in account auth authentication user portal password access enter' 
    },
    { 
      title: 'Sign Up / Register', 
      desc: 'Create your free HarshGuruJi account to access tools, bookmark apps and join community', 
      url: 'signup.html', 
      type: 'auth', 
      icon: '✨', 
      keywords: 'signup sign up register create account registration join new user' 
    },
    { 
      title: 'User Dashboard', 
      desc: 'Holographic user profile, tool activity logs, bookmarks and saved preferences', 
      url: 'dashboard.html', 
      type: 'page', 
      icon: '📊', 
      keywords: 'dashboard profile my account stats history bookmarks user account' 
    },
    { 
      title: 'Account Settings', 
      desc: 'Manage account security, profile details, preferences and notifications', 
      url: 'settings.html', 
      type: 'page', 
      icon: '⚙️', 
      keywords: 'settings preferences config security profile account password' 
    },
    { 
      title: 'Appearance & Theme', 
      desc: 'Customize dark mode, system themes, vibrant accent colors and visual display', 
      url: 'appearance.html', 
      type: 'page', 
      icon: '🎨', 
      keywords: 'appearance theme dark mode light mode colors display ui styling' 
    },

    // --- FEATURED APPLICATIONS (APKs, PC Software & Web Apps) ---
    { 
      title: 'Visual Studio Code', 
      desc: 'Lightweight and powerful source code editor by Microsoft for Windows, macOS and Linux', 
      url: 'store-detail.html?id=app-001', 
      type: 'app', 
      icon: '💻', 
      keywords: 'visual studio code vscode vs code code editor ide microsoft development programming app application' 
    },
    { 
      title: 'VLC Media Player', 
      desc: 'Free, open source universal multimedia player and framework for video and audio by VideoLAN', 
      url: 'store-detail.html?id=app-002', 
      type: 'app', 
      icon: '🎬', 
      keywords: 'vlc media player videolan video audio movie mp4 mkv music player app application' 
    },
    { 
      title: 'Figma', 
      desc: 'Leading collaborative web & desktop interface design, UI/UX prototyping and vector graphics tool', 
      url: 'store-detail.html?id=app-003', 
      type: 'app', 
      icon: '🎨', 
      keywords: 'figma design ui ux prototyping wireframe vector graphics designer app application' 
    },
    { 
      title: 'ChatGPT', 
      desc: 'Leading conversational AI model and assistant by OpenAI for answering, writing and coding', 
      url: 'store-detail.html?id=app-004', 
      type: 'app', 
      icon: '🤖', 
      keywords: 'chatgpt chat gpt openai ai artificial intelligence chatbot assistant bot app application' 
    },
    { 
      title: 'Brave Browser', 
      desc: 'Ultra-fast, privacy-oriented web browser with built-in ad blocker and shields by Brave Software', 
      url: 'store-detail.html?id=app-005', 
      type: 'app', 
      icon: '🦁', 
      keywords: 'brave browser web internet privacy adblock shield secure chromium app application' 
    },
    { 
      title: 'Bitwarden', 
      desc: 'Zero-knowledge open source password management and encrypted credential vault', 
      url: 'store-detail.html?id=app-006', 
      type: 'app', 
      icon: '🛡️', 
      keywords: 'bitwarden password manager passwords credentials vault security login app application' 
    },

    // --- STORE & DOWNLOADS ---
    { 
      title: 'App & Game Store', 
      desc: 'Discover and download verified Android APKs, PC software installers, games and tools', 
      url: 'store.html', 
      type: 'store', 
      icon: '🛍️', 
      keywords: 'store app store games download apk software apps windows android pc packages catalog' 
    },
    { 
      title: 'Store Applications Catalog', 
      desc: 'Browse all verified utilities, mobile applications and productivity programs', 
      url: 'app.html', 
      type: 'store', 
      icon: '📱', 
      keywords: 'applications apps android apk software program store downloads utility' 
    },
    { 
      title: 'Daily Special Station', 
      desc: 'Fresh daily wisdom, inspiring quotes, productivity tips, and historical facts updated daily', 
      url: 'daily-special.html', 
      type: 'store', 
      icon: '🌅', 
      keywords: 'daily special daily facts wisdom tips quotes inspiration trending' 
    },
    { 
      title: 'Daily Life Hacks & Lifestyle', 
      desc: 'Practical life hacks, health tips, mental productivity and daily routine guides', 
      url: 'daily-life.html', 
      type: 'page', 
      icon: '🌱', 
      keywords: 'daily life lifestyle productivity life hacks habits routines tips' 
    },

    // --- TOOLS & UTILITIES ---
    { 
      title: 'Free Tools Hub', 
      desc: 'Curated collection of 50+ developer, SEO, student, converter and productivity utilities', 
      url: 'free-tools.html', 
      type: 'tool', 
      icon: '🛠️', 
      keywords: 'tools hub free tools online utilities productivity converters instruments' 
    },
    { 
      title: 'Tools Directory', 
      desc: 'Complete index of all free online tools, text formatters and developer instruments', 
      url: 'tools.html', 
      type: 'tool', 
      icon: '⚙️', 
      keywords: 'tools directory utilities list instruments collection' 
    },
    { 
      title: 'Case Converter', 
      desc: 'Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase and kebab-case', 
      url: 'tools/case-converter.html', 
      type: 'tool', 
      icon: '🔤', 
      keywords: 'case converter uppercase lowercase title sentence text capitalize case' 
    },
    { 
      title: 'Word Counter', 
      desc: 'Real-time word, character, sentence, paragraph and estimated reading time counter', 
      url: 'tools/word-counter.html', 
      type: 'tool', 
      icon: '📝', 
      keywords: 'word counter character count length text statistics sentences reading time' 
    },
    { 
      title: 'Password Generator', 
      desc: 'Generate ultra-secure random passwords with custom symbols, numbers and entropy rules', 
      url: 'tools/password-generator.html', 
      type: 'tool', 
      icon: '🔑', 
      keywords: 'password generator random strong password security credentials pass generator' 
    },
    { 
      title: 'JSON Formatter & Validator', 
      desc: 'Format, validate, beautify, tree-view and minify JSON data online in real time', 
      url: 'tools/json-formatter.html', 
      type: 'tool', 
      icon: '📦', 
      keywords: 'json formatter validator beautifier minify parse format json parser dev' 
    },
    { 
      title: 'Base64 Encoder & Decoder', 
      desc: 'Encode and decode strings and files in Base64 format with instant preview', 
      url: 'tools/base64.html', 
      type: 'tool', 
      icon: '🔄', 
      keywords: 'base64 encode decode encoder decoder binary string text convert' 
    },

    // --- GAMES & ARCADE ---
    { 
      title: 'Gaming Hub', 
      desc: 'Play free online browser games, retro arcade, brain teasers and multiplayer challenges', 
      url: 'gaming-hub.html', 
      type: 'game', 
      icon: '🎮', 
      keywords: 'gaming hub play games arcade browser games fun play' 
    },
    { 
      title: 'Gaming Directory', 
      desc: 'Curated arcade games and interactive web entertainment experiences', 
      url: 'gaming.html', 
      type: 'game', 
      icon: '🕹️', 
      keywords: 'gaming arcade entertainment interactive play game' 
    },
    { 
      title: 'Snake Game', 
      desc: 'Classic retro arcade snake game with smooth controls and high-score leaderboards', 
      url: 'games/snake.html', 
      type: 'game', 
      icon: '🐍', 
      keywords: 'snake game retro arcade classic 8bit arcade fun score' 
    },
    { 
      title: 'Tic Tac Toe', 
      desc: 'Play Tic Tac Toe against intelligent AI bot or challenge a friend locally', 
      url: 'games/tic-tac-toe.html', 
      type: 'game', 
      icon: '❌', 
      keywords: 'tic tac toe zero kata noughts crosses board game multiplayer ai' 
    },
    { 
      title: 'Memory Match Game', 
      desc: 'Brain-boosting card memory matching challenge with timer and flip animations', 
      url: 'games/memory.html', 
      type: 'game', 
      icon: '🧠', 
      keywords: 'memory game card match brain training puzzle cards concentration' 
    },

    // --- LEARNING & EDUCATION ---
    { 
      title: 'Learning Hub', 
      desc: 'NCERT solutions, study notes, question banks and comprehensive exam preparation', 
      url: 'learning-hub.html', 
      type: 'learning', 
      icon: '📚', 
      keywords: 'learning hub study notes education ncert exams questions syllabus school' 
    },
    { 
      title: 'Education Hub', 
      desc: 'Comprehensive study materials, academic subjects and subject revision guides', 
      url: 'education.html', 
      type: 'learning', 
      icon: '🎓', 
      keywords: 'education hub learning school college subjects syllabus study' 
    },
    { 
      title: 'Class 10 NCERT Solutions', 
      desc: 'Complete Class 10 Science, Mathematics and Social Science chapter-wise notes', 
      url: 'learning/class.html?id=10', 
      type: 'learning', 
      icon: '📖', 
      keywords: 'class 10 ncert science maths 10th standard notes cbse class10' 
    },
    { 
      title: 'Class 9 NCERT Solutions', 
      desc: 'Class 9 chapters, video tutorials, question papers and key formula guides', 
      url: 'learning/class.html?id=9', 
      type: 'learning', 
      icon: '📘', 
      keywords: 'class 9 ncert science maths 9th class notes cbse class9' 
    },
    { 
      title: 'Class 10 Science Notes', 
      desc: 'Chapter-wise Class 10 Science notes, chemical formulas, physics and biology guides', 
      url: 'learning/class-10-science.html', 
      type: 'learning', 
      icon: '🔬', 
      keywords: 'class 10 science physics chemistry biology notes cbse science' 
    },
    { 
      title: 'Chemical Reactions & Equations', 
      desc: 'Class 10 Science Chapter 1 detailed NCERT solutions, types of reactions and equations', 
      url: 'learning/class-10/science/ncert/01-chemical-reactions-and-equations.html', 
      type: 'learning', 
      icon: '🧪', 
      keywords: 'chemical reactions equations chapter 1 class 10 chemistry ncert science' 
    },
    { 
      title: 'GK Quiz Challenge', 
      desc: 'Test your general knowledge with interactive multi-topic quizzes and scoring', 
      url: 'learning/gk-quiz.html', 
      type: 'learning', 
      icon: '💡', 
      keywords: 'gk quiz general knowledge quiz questions trivia test competitive' 
    },
    { 
      title: 'Quiz India', 
      desc: 'Interactive competitive examination quizzes for Indian students (UPSC, SSC, Railway)', 
      url: 'Quiz India/index.html', 
      type: 'learning', 
      icon: '🇮🇳', 
      keywords: 'quiz india indian exams ssc upsc gk competition railway competitive' 
    },
    { 
      title: 'PDF Library & Books', 
      desc: 'Download syllabus textbooks, previous year question papers and revision guides', 
      url: 'learning/pdf-library.html', 
      type: 'learning', 
      icon: '📄', 
      keywords: 'pdf library books download textbooks pyq papers syllabus ncert pdf' 
    },

    // --- AI PAGES (Under Construction) ---
    { 
      title: 'AI Hub (Under Construction)', 
      desc: 'Next-generation Artificial Intelligence tools, prompt engines and assistants (under active construction)', 
      url: 'ai-hub.html', 
      type: 'ai', 
      icon: '🤖', 
      keywords: 'ai hub artificial intelligence models ai tools under construction machine learning' 
    },
    { 
      title: 'AI Directory (Under Construction)', 
      desc: 'Curated generative AI tools directory (currently undergoing fine-tuning and construction)', 
      url: 'ai.html', 
      type: 'ai', 
      icon: '⚡', 
      keywords: 'ai directory artificial intelligence tools under construction generative ai' 
    },

    // --- COMMUNITY, CREATORS & PAGES ---
    { 
      title: 'Contributor Hub', 
      desc: 'Explore top platform creators, contributors and verified software authors', 
      url: 'contributor.html', 
      type: 'page', 
      icon: '🌟', 
      keywords: 'contributor creators community authors partners team network' 
    },
    { 
      title: 'Apply as Contributor', 
      desc: 'Submit your creator or developer application for verification and golden badge', 
      url: 'apply-contributor.html', 
      type: 'page', 
      icon: '📝', 
      keywords: 'apply contributor application creator form badge golden verification' 
    },
    { 
      title: 'Join Contributor Program', 
      desc: 'Join HarshGuruJi creator network, share tools and earn verified golden badges', 
      url: 'join-contributor.html', 
      type: 'page', 
      icon: '🤝', 
      keywords: 'join contributor program rewards community creators network' 
    },
    { 
      title: 'Verify Contributor Badge', 
      desc: 'Verify the authenticity and status of verified developers and contributors', 
      url: 'verify-contributor.html', 
      type: 'page', 
      icon: '✅', 
      keywords: 'verify contributor badge check status authenticity valid creator' 
    },
    { 
      title: 'HarshGuruJi Chat', 
      desc: 'Community chat, discussion channels and interactive peer support', 
      url: 'https://chat.webguruji.online', 
      type: 'page', 
      icon: '💬', 
      keywords: 'chat harshguruji chat community discussion messages talk' 
    },
    { 
      title: 'Explore Knowledge', 
      desc: 'Explore all subjects, programming languages, technologies and web tools', 
      url: 'explore.html', 
      type: 'page', 
      icon: '🔍', 
      keywords: 'explore search discover all subjects topics search site everything' 
    },
    { 
      title: 'About HarshGuruJi', 
      desc: 'Learn more about our educational mission, creator story, values and team', 
      url: 'about.html', 
      type: 'page', 
      icon: 'ℹ️', 
      keywords: 'about harshguruji creator team mission story who we are about us' 
    },
    { 
      title: 'Contact & Support', 
      desc: 'Send feedback, ask questions or report issues to the HarshGuruJi support team', 
      url: 'contact.html', 
      type: 'page', 
      icon: '📬', 
      keywords: 'contact support help feedback report issue email customer message' 
    },
    { 
      title: 'Daily Insights & Wisdom', 
      desc: 'Inspiring knowledge, daily wisdom articles and self-improvement thoughts', 
      url: 'insights.html', 
      type: 'page', 
      icon: '💡', 
      keywords: 'insights wisdom knowledge articles learning philosophy thought' 
    },
    { 
      title: 'Technology Hub', 
      desc: 'Insights into modern computing, technology developments and web trends', 
      url: 'technology.html', 
      type: 'page', 
      icon: '💻', 
      keywords: 'technology tech computers software trends development innovation' 
    },
    { 
      title: 'Partner Ads & Sponsorships', 
      desc: 'Official advertising and sponsorship partners of HarshGuruJi platform', 
      url: 'ads.html', 
      type: 'page', 
      icon: '📢', 
      keywords: 'ads partner advertising sponsor promotions partner ads' 
    },
    { 
      title: 'Privacy Policy', 
      desc: 'HarshGuruJi privacy policy, cookies, data safety and user security guidelines', 
      url: 'privacy-policy.html', 
      type: 'page', 
      icon: '🔒', 
      keywords: 'privacy policy safety data security personal info terms privacy' 
    },
    { 
      title: 'Terms & Conditions', 
      desc: 'Platform terms of service, acceptable usage guidelines and regulations', 
      url: 'terms-and-conditions.html', 
      type: 'page', 
      icon: '📜', 
      keywords: 'terms conditions terms of service legal rules acceptable usage' 
    },
    { 
      title: 'Cookie Policy', 
      desc: 'Information regarding cookie consent, tracking preferences and local data', 
      url: 'cookie.html', 
      type: 'page', 
      icon: '🍪', 
      keywords: 'cookie cookies policy tracking consent preferences storage' 
    },

    // --- ADMIN PORTAL ---
    { 
      title: 'Admin Dashboard', 
      desc: 'System management center, analytics, content controls and app publishing', 
      url: 'admin.html', 
      type: 'admin', 
      icon: '🛡️', 
      keywords: 'admin administrator panel control center dashboard management system' 
    },
    { 
      title: 'Admin APK Upload', 
      desc: 'Upload, manage and publish Android APK packages and software to the Store', 
      url: 'adminapkupload.html', 
      type: 'admin', 
      icon: '📤', 
      keywords: 'upload apk admin app upload publish store admin software installer' 
    },
    { 
      title: 'Admin Contributors', 
      desc: 'Review contributor requests, manage verification statuses and assign badges', 
      url: 'admincontributors.html', 
      type: 'admin', 
      icon: '👥', 
      keywords: 'admin contributors manage creators approval verify badge admin' 
    },
    { 
      title: 'Admin Contacts & Inquiries', 
      desc: 'Manage incoming user inquiries, support feedback and message submissions', 
      url: 'admin-contacts.html', 
      type: 'admin', 
      icon: '📬', 
      keywords: 'admin contacts messages feedback inquiries support tickets' 
    }
  ];

  let dynamicStoreApps = [];

  // Robust multi-source apps fetcher (Local JSON + Supabase Database)
  async function fetchLiveStoreApps() {
    // 1. Fetch static apps.json to ensure all packaged apps are loaded
    try {
      const resp = await fetch(`${prefix}data/apps.json`);
      if (resp.ok) {
        const jsonApps = await resp.json();
        if (Array.isArray(jsonApps)) {
          jsonApps.forEach(app => {
            const appTitle = app.name || app.title || 'Store App';
            const exists = dynamicStoreApps.some(a => a.id === app.id || a.title.toLowerCase() === appTitle.toLowerCase());
            if (!exists) {
              const iconSrc = app.icon || 'logo.png';
              const hasImg = iconSrc && (iconSrc.startsWith('http') || iconSrc.endsWith('.png') || iconSrc.endsWith('.svg') || iconSrc.endsWith('.webp'));
              dynamicStoreApps.push({
                id: app.id,
                title: appTitle,
                desc: app.description ? (app.description.slice(0, 110) + '...') : (app.category || 'Store Application'),
                url: `store-detail.html?id=${encodeURIComponent(app.id)}`,
                type: 'app',
                keywords: `${appTitle} ${app.developer || ''} ${app.category || ''} ${app.id} app application software download ${app.platforms ? Object.keys(app.platforms).join(' ') : ''}`.toLowerCase(),
                icon: hasImg ? `<img src="${iconSrc}" alt="${escapeNavHtml(appTitle)}" onerror="this.onerror=null;this.parentElement.innerHTML='📱';">` : '📱'
              });
            }
          });
        }
      }
    } catch (e) {
      // Local apps.json fallback handled gracefully
    }

    // 2. Fetch live store_apps table from Supabase
    try {
      const { supabase } = await import(`${prefix}js/supabase.js`);
      if (supabase && typeof supabase.from === 'function') {
        const { data, error } = await supabase
          .from('store_apps')
          .select('id, name, title, short_description, description, icon_url, logo_url, category, platform, app_type')
          .limit(100);
        if (!error && Array.isArray(data)) {
          data.forEach(app => {
            const appTitle = app.title || app.name || 'Store App';
            const iconImg = app.icon_url || app.logo_url;
            const hasImg = iconImg && (iconImg.startsWith('http') || iconImg.endsWith('.png') || iconImg.endsWith('.svg'));
            const appObj = {
              id: app.id,
              title: appTitle,
              desc: app.short_description || (app.description ? app.description.slice(0, 110) + '...' : (app.category ? `Category: ${app.category}` : 'Verified Store Application')),
              url: `store-detail.html?id=${encodeURIComponent(app.id)}`,
              type: 'app',
              keywords: `${appTitle} ${app.category || ''} ${app.platform || ''} ${app.app_type || ''} store app application software download`.toLowerCase(),
              icon: hasImg ? `<img src="${iconImg}" alt="${escapeNavHtml(appTitle)}" onerror="this.onerror=null;this.parentElement.innerHTML='📱';">` : '📱'
            };
            const existingIdx = dynamicStoreApps.findIndex(a => a.id === app.id || a.title.toLowerCase() === appTitle.toLowerCase());
            if (existingIdx >= 0) {
              dynamicStoreApps[existingIdx] = appObj;
            } else {
              dynamicStoreApps.push(appObj);
            }
          });
        }
      }
    } catch (e) {
      // Supabase fetch error ignored (handled by local apps and static index)
    }
  }

  fetchLiveStoreApps();

  // High-accuracy multi-tier search matching engine
  function performSearch(query) {
    const raw = (query || '').trim();
    if (!raw) return [];
    const q = raw.toLowerCase();
    const queryTokens = q.split(/\s+/).filter(t => t.length > 0);

    const combined = [...SITE_SEARCH_INDEX, ...dynamicStoreApps];
    const seenUrls = new Set();
    const scored = [];

    for (const item of combined) {
      // Deduplicate by URL or title
      const uniqueKey = (item.url || item.title).toLowerCase();
      if (seenUrls.has(uniqueKey)) continue;
      seenUrls.add(uniqueKey);

      const titleLower = (item.title || '').toLowerCase();
      const descLower = (item.desc || '').toLowerCase();
      const typeLower = (item.type || '').toLowerCase();
      const keywordsLower = (item.keywords || '').toLowerCase();
      
      let score = 0;

      // 1. Exact match on title (e.g. "login", "vlc", "vscode")
      if (titleLower === q) {
        score += 200;
      } else if (titleLower.startsWith(q)) {
        score += 120;
      } else if (titleLower.includes(q)) {
        score += 70;
      }

      // 2. High priority for Auth queries (e.g. "login", "signin", "signup")
      if (q === 'login' || q === 'log in' || q === 'signin' || q === 'sign in') {
        if (item.url === 'login.html') score += 250;
      } else if (q === 'signup' || q === 'sign up' || q === 'register') {
        if (item.url === 'signup.html') score += 250;
      }

      // 3. Keywords matching
      if (keywordsLower.includes(q)) {
        score += 80;
      }

      // 4. Token-by-token scoring (handles "vs code", "case convert", "science 10")
      let allTokensMatch = queryTokens.length > 1;
      for (const token of queryTokens) {
        const inTitle = titleLower.includes(token);
        const inKw = keywordsLower.includes(token);
        const inDesc = descLower.includes(token);

        if (inTitle) score += 30;
        else if (inKw) score += 20;
        else if (inDesc) score += 10;
        else allTokensMatch = false;
      }
      if (allTokensMatch && queryTokens.length > 1) {
        score += 50;
      }

      // 5. Description & Type matching
      if (descLower.includes(q)) score += 15;
      if (typeLower === q) score += 25;

      if (score > 0) {
        scored.push({ item, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 10).map(s => s.item);
  }

  function renderSearchResults(results, container, query) {
    if (!container) return;

    if (!query) {
      container.innerHTML = '';
      container.classList.remove('show');
      return;
    }

    if (results.length === 0) {
      container.innerHTML = `
        <div class="hg-search-no-results">
          <div style="font-size:1.6rem; margin-bottom:4px;">🔍</div>
          <div>No exact match found for <strong>"${escapeNavHtml(query)}"</strong></div>
          <div style="margin-top:6px; font-size:0.75rem; color:#a1a1aa;">Press Enter to search all resources on the Explore page</div>
        </div>
        <div class="hg-search-dropdown-footer">
          <span>Search entire catalog</span>
          <a href="${prefix}explore.html?search=${encodeURIComponent(query)}">Search on Explore &rarr;</a>
        </div>
      `;
      container.classList.add('show');
      return;
    }

    const itemsHtml = results.map(item => {
      const isImgIcon = typeof item.icon === 'string' && item.icon.startsWith('<img');
      const iconHtml = isImgIcon ? item.icon : `<span>${item.icon || '🔗'}</span>`;
      const linkUrl = item.url.startsWith('http') ? item.url : `${prefix}${item.url}`;

      return `
        <a href="${linkUrl}" class="hg-search-item">
          <div class="hg-search-item-icon">${iconHtml}</div>
          <div class="hg-search-item-info">
            <div class="hg-search-item-title">
              <span>${escapeNavHtml(item.title)}</span>
              <span class="hg-search-item-badge ${item.type}">${item.type.toUpperCase()}</span>
            </div>
            <div class="hg-search-item-desc">${escapeNavHtml(item.desc)}</div>
          </div>
        </a>
      `;
    }).join('');

    container.innerHTML = `
      <div class="hg-search-results-list">
        ${itemsHtml}
      </div>
      <div class="hg-search-dropdown-footer">
        <span>${results.length} results matching "${escapeNavHtml(query)}"</span>
        <a href="${prefix}explore.html?search=${encodeURIComponent(query)}">View on Explore &rarr;</a>
      </div>
    `;
    container.classList.add('show');
  }

  function setupSearchField(inputId, dropdownId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    if (!input || !dropdown) return;

    let debounceTimer = null;

    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const query = input.value.trim();
        const results = performSearch(query);
        renderSearchResults(results, dropdown, query);
      }, 120);
    });

    input.addEventListener('focus', () => {
      const query = input.value.trim();
      if (query) {
        const results = performSearch(query);
        renderSearchResults(results, dropdown, query);
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = input.value.trim();
        if (!query) return;
        const results = performSearch(query);
        if (results.length > 0) {
          const first = results[0];
          const dest = first.url.startsWith('http') ? first.url : `${prefix}${first.url}`;
          window.location.href = dest;
        } else {
          window.location.href = `${prefix}explore.html?search=${encodeURIComponent(query)}`;
        }
      } else if (e.key === 'Escape') {
        dropdown.classList.remove('show');
      }
    });
  }

  // Setup desktop search, mobile strip search, and mobile drawer search
  setupSearchField('hg-search-input', 'hg-search-dropdown-desktop');
  setupSearchField('hg-search-input-strip', 'hg-search-dropdown-strip');
  setupSearchField('hg-search-input-mobile', 'hg-search-dropdown-mobile');
  setupSearchField('hero-search-input', 'hero-search-dropdown');

  // Hero Search Submit Button Binding
  const heroBtn = document.getElementById('hero-search-btn');
  const heroInput = document.getElementById('hero-search-input');
  if (heroBtn && heroInput) {
    heroBtn.addEventListener('click', () => {
      const query = heroInput.value.trim();
      if (!query) return;
      const results = performSearch(query);
      if (results.length > 0) {
        const first = results[0];
        const dest = first.url.startsWith('http') ? first.url : `${prefix}${first.url}`;
        window.location.href = dest;
      } else {
        window.location.href = `${prefix}explore.html?search=${encodeURIComponent(query)}`;
      }
    });
  }

  // Also expose globally for hero or dynamic search inputs
  window.__hgPerformSearch = performSearch;
  window.__hgSetupSearchField = setupSearchField;

  // Mobile Search Strip Toggle Button
  const mobileSearchBtn = document.getElementById('hg-mobile-search-btn');
  const mobileSearchStrip = document.getElementById('hg-mobile-search-strip');
  const mobileSearchInputStrip = document.getElementById('hg-search-input-strip');

  if (mobileSearchBtn && mobileSearchStrip) {
    mobileSearchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = mobileSearchStrip.style.display !== 'none';
      if (isVisible) {
        mobileSearchStrip.style.display = 'none';
        mobileSearchBtn.classList.remove('active');
      } else {
        mobileSearchStrip.style.display = 'block';
        mobileSearchBtn.classList.add('active');
        if (mobileSearchInputStrip) mobileSearchInputStrip.focus();
      }
    });
  }

  // Close search dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.hg-search-wrapper') && 
        !e.target.closest('.hg-mobile-search-strip') && 
        !e.target.closest('.hg-mobile-drawer-search') &&
        !e.target.closest('.hero-search-container')) {
      document.querySelectorAll('.hg-search-dropdown.show, .hero-search-dropdown.show').forEach(el => el.classList.remove('show'));
    }
  });

  // 5. Active Page Highlighting (Accurate for Home, Daily Special, Store, Contributor, More)
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  if (currentPath === 'index.html' || currentPath === '') {
    document.getElementById('nav-link-home')?.classList.add('active');
    document.getElementById('mob-link-home')?.classList.add('active');
  } else if (currentPath === 'daily-special.html') {
    document.getElementById('nav-link-dailyspecial')?.classList.add('active');
    document.getElementById('mob-link-dailyspecial')?.classList.add('active');
  } else if (currentPath === 'store.html' || currentPath === 'store-detail.html' || currentPath === 'app.html') {
    document.getElementById('nav-link-store')?.classList.add('active');
    document.getElementById('mob-link-store')?.classList.add('active');
  } else if (currentPath === 'contributor.html' || currentPath === 'apply-contributor.html' || currentPath === 'join-contributor.html' || currentPath === 'admincontributors.html') {
    document.getElementById('nav-link-contributor')?.classList.add('active');
    document.getElementById('mob-link-contributor')?.classList.add('active');
  } else {
    // Check if current page is inside More dropdown
    const allLinks = document.querySelectorAll('.hg-dropdown-link, .hg-mobile-sublink');
    let matchedMore = false;
    allLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.endsWith(currentPath)) {
        link.classList.add('active');
        matchedMore = true;
      }
    });
    if (matchedMore) {
      document.getElementById('nav-link-more')?.classList.add('active');
      const mobMoreItem = document.getElementById('mob-item-more');
      if (mobMoreItem) {
        mobMoreItem.classList.add('open');
        mobMoreItem.querySelector('.hg-mobile-accordion-toggle')?.classList.add('active');
      }
    }
  }

  // --- NOTIFICATION CENTER & USER FEEDBACK LOGIC ---
  let userMessagesCache = [];
  let isNotifDropdownOpen = false;

  const notifContainer = document.getElementById('hg-notif-container');
  const notifBtn = document.getElementById('hg-notif-btn');
  const notifBadge = document.getElementById('hg-notif-badge');
  const notifDropdown = document.getElementById('hg-notif-dropdown');
  const notifList = document.getElementById('hg-notif-list');
  const notifRefreshBtn = document.getElementById('hg-notif-refresh');

  function toggleNotifDropdown(forceState) {
    if (!notifDropdown) return;
    const shouldOpen = typeof forceState === 'boolean' ? forceState : !isNotifDropdownOpen;
    isNotifDropdownOpen = shouldOpen;

    if (shouldOpen) {
      notifDropdown.style.display = 'block';
      if (notifBtn) notifBtn.classList.add('active');

      // If user had unread replies, mark them as read in DB so badge clears
      markRepliesAsRead();
    } else {
      notifDropdown.style.display = 'none';
      if (notifBtn) notifBtn.classList.remove('active');
    }
  }

  if (notifBtn) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNotifDropdown();
    });
  }

  if (notifRefreshBtn) {
    notifRefreshBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentUserId = window._currentNavUserId;
      if (currentUserId) loadUserNotifications(currentUserId);
    });
  }

  // Close notification dropdown on click outside
  document.addEventListener('click', (e) => {
    if (isNotifDropdownOpen && notifContainer && !notifContainer.contains(e.target)) {
      toggleNotifDropdown(false);
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isNotifDropdownOpen) {
      toggleNotifDropdown(false);
    }
  });

  async function loadUserNotifications(userId) {
    if (!userId || !notifList) return;
    window._currentNavUserId = userId;

    try {
      const { supabase } = await import('./js/supabase.js');

      // Auto-clear threshold: Maximum 14 days (2 weeks).
      const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', fourteenDaysAgo)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) {
        console.warn("Could not load notifications:", error);
        return;
      }

      const now = Date.now();
      const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
      const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

      // Auto-clear: read replies clear after 1 week (7 days); all messages clear after 2 weeks maximum (14 days)
      userMessagesCache = (data || []).filter(m => {
        const createdMs = new Date(m.created_at).getTime();
        if (now - createdMs > TWO_WEEKS_MS) return false; // Max 2 weeks

        if (m.admin_reply && m.user_read && m.replied_at) {
          const repliedMs = new Date(m.replied_at).getTime();
          if (now - repliedMs > ONE_WEEK_MS) return false; // Read replies clear after 1 week
        }

        return true;
      });

      // Check unread count (admin replied but user hasn't seen it yet)
      const unreadCount = userMessagesCache.filter(m => m.admin_reply && !m.user_read).length;
      if (notifBadge) {
        if (unreadCount > 0) {
          notifBadge.textContent = unreadCount > 9 ? '9+' : unreadCount;
          notifBadge.style.display = 'flex';
        } else {
          notifBadge.style.display = 'none';
        }
      }

      renderNotificationList();

    } catch (err) {
      console.warn("Notification error:", err);
    }
  }

  function renderNotificationList() {
    if (!notifList) return;

    if (userMessagesCache.length === 0) {
      notifList.innerHTML = `
        <div class="hg-notif-empty">
          <div style="font-size: 1.8rem; margin-bottom: 0.35rem;">💬</div>
          <strong style="color: #fff; display: block; margin-bottom: 0.25rem;">No Messages Yet</strong>
          <span>Send feedback or questions from the Contact page and admin replies will appear here!</span>
        </div>
      `;
      return;
    }

    notifList.innerHTML = userMessagesCache.map(msg => {
      const isReplied = !!msg.admin_reply;
      const isUnread = isReplied && !msg.user_read;
      const dateStr = msg.created_at ? new Date(msg.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
      const replyDate = msg.replied_at ? new Date(msg.replied_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

      return `
        <div class="hg-notif-item ${isUnread ? 'has-unread-reply' : ''}">
          <div class="hg-notif-item-top">
            <span>Feedback / Query</span>
            <span>${dateStr}</span>
          </div>
          <p class="hg-notif-user-msg">${escapeNavHtml(msg.message)}</p>

          ${isReplied ? `
            <div class="hg-notif-admin-reply">
              <div class="hg-notif-admin-meta">💬 ${msg.replied_by || 'Admin (HarshGuruJi)'} • ${replyDate}</div>
              <div>${escapeNavHtml(msg.admin_reply)}</div>
            </div>
          ` : `
            <div class="hg-notif-pending-status">
              <span>⏳ Status: Received &amp; in review by team</span>
            </div>
          `}
        </div>
      `;
    }).join('');
  }

  async function markRepliesAsRead() {
    const unread = userMessagesCache.filter(m => m.admin_reply && !m.user_read);
    if (unread.length === 0) return;

    const unreadIds = unread.map(m => m.id);
    // Optimistically update local
    unread.forEach(m => m.user_read = true);
    if (notifBadge) notifBadge.style.display = 'none';

    try {
      const { supabase } = await import('./js/supabase.js');
      await supabase
        .from('contact_messages')
        .update({ user_read: true })
        .in('id', unreadIds);
    } catch (err) {
      console.warn("Could not mark replies as read:", err);
    }
  }

  function escapeNavHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Listen for feedback submission from contact.html
  window.addEventListener('feedback-submitted', () => {
    const currentUserId = window._currentNavUserId;
    if (currentUserId) loadUserNotifications(currentUserId);
  });

  // Chat Unread Count Sync for Global Floating Button
  async function syncChatUnreadBadge(userId) {
    if (!userId) return;
    try {
      const { supabase } = await import('./js/supabase.js');
      const { count, error } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('receiver_id', userId)
        .neq('status', 'seen');

      const badge = document.getElementById('hg-chat-unread-badge');
      if (badge) {
        if (!error && count && count > 0) {
          badge.textContent = count > 9 ? '9+' : count;
          badge.style.display = 'inline-flex';
        } else {
          badge.style.display = 'none';
        }
      }
    } catch (e) {
      console.warn("Chat badge sync notice:", e);
    }
  }

  function subscribeToChatRealtimeBadge(userId) {
    if (!userId || window.__chatBadgeSubscribed) return;
    window.__chatBadgeSubscribed = true;
    try {
      import('./js/supabase.js').then(({ supabase }) => {
        supabase
          .channel('nav_chat_badge')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${userId}`
          }, () => {
            syncChatUnreadBadge(userId);
          })
          .subscribe();
      }).catch(() => {});
    } catch (e) {}
  }

  // 6. Handle Auth State Changes
  const updateNavUI = (user, profile) => {
    const loginBtn = document.getElementById('hg-login-btn');
    const userMenu = document.getElementById('hg-user-profile');
    const userAvatar = document.getElementById('hg-user-avatar');
    const notifBox = document.getElementById('hg-notif-container');

    const bottomAuthItem = document.getElementById('bottom-nav-auth');
    const bottomAuthLabel = document.getElementById('bottom-auth-label');
    const bottomAuthDefaultIcon = document.getElementById('bottom-auth-default-icon');
    const bottomAuthAvatar = document.getElementById('bottom-auth-avatar');
    const bottomGoldenTick = document.getElementById('bottom-golden-tick');
    const mobileDrawerAuth = document.getElementById('hg-mobile-drawer-auth');

    if (user) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (userMenu) userMenu.style.display = 'block';
      if (notifBox) notifBox.style.display = 'flex';
      
      const displayName = (profile && profile.display_name) || user.email.split('@')[0];
      const avatarUrl = (profile && profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;
      if (userAvatar) {
        userAvatar.src = avatarUrl;
      }

      // Update Bottom Bar Auth Tab to Profile & sync bottom sheet
      const sheetAvatar = document.getElementById('hg-bottom-sheet-avatar');
      if (sheetAvatar) sheetAvatar.src = avatarUrl;
      const sheetName = document.getElementById('hg-bottom-sheet-name');
      if (sheetName) sheetName.textContent = displayName;
      const sheetEmail = document.getElementById('hg-bottom-sheet-email');
      if (sheetEmail) sheetEmail.textContent = user.email || '';

      if (bottomAuthItem) {
        bottomAuthItem.href = prefix + 'dashboard.html';
        const p = (window.location.pathname || '').toLowerCase();
        if (p.includes('dashboard') || p.includes('settings')) {
          bottomAuthItem.classList.add('active');
        }
        bottomAuthItem.onclick = (e) => {
          if (window.innerWidth <= 1024) {
            e.preventDefault();
            const overlay = document.getElementById('hg-bottom-profile-overlay');
            if (overlay) {
              if (overlay.classList.contains('active')) {
                overlay.classList.remove('active');
                setTimeout(() => { if (!overlay.classList.contains('active')) overlay.style.display = 'none'; }, 250);
              } else {
                overlay.style.display = 'flex';
                void overlay.offsetWidth;
                overlay.classList.add('active');
              }
            }
          }
        };
      }
      if (bottomAuthLabel) {
        bottomAuthLabel.textContent = 'Profile';
      }
      if (bottomAuthDefaultIcon) {
        bottomAuthDefaultIcon.style.display = 'none';
      }
      if (bottomAuthAvatar) {
        bottomAuthAvatar.src = avatarUrl;
        bottomAuthAvatar.style.display = 'block';
      }
      if (bottomGoldenTick) {
        bottomGoldenTick.style.display = (profile && profile.golden_tick === true) ? 'flex' : 'none';
      }
      if (mobileDrawerAuth) {
        mobileDrawerAuth.href = prefix + 'dashboard.html';
        mobileDrawerAuth.textContent = 'My Profile & Dashboard';
      }

      // Left-corner Golden Tick on user profile avatar
      const avatarWrap = document.getElementById('hg-user-avatar-wrap');
      if (avatarWrap) {
        let tick = document.getElementById('hg-nav-golden-tick');
        if (profile && profile.golden_tick === true) {
          if (!tick) {
            tick = document.createElement('span');
            tick.id = 'hg-nav-golden-tick';
            tick.className = 'golden-tick-badge';
            tick.title = 'Golden Verified Contributor';
            tick.textContent = '✓';
            avatarWrap.appendChild(tick);
          }
        } else if (tick) {
          tick.remove();
        }
      }

      loadUserNotifications(user.id);
      syncChatUnreadBadge(user.id);
      subscribeToChatRealtimeBadge(user.id);
    } else {
      if (loginBtn) loginBtn.style.display = 'inline-flex';
      if (userMenu) userMenu.style.display = 'none';
      if (notifBox) notifBox.style.display = 'none';
      toggleNotifDropdown(false);
      window._currentNavUserId = null;

      const chatBadge = document.getElementById('hg-chat-unread-badge');
      if (chatBadge) chatBadge.style.display = 'none';

      const overlay = document.getElementById('hg-bottom-profile-overlay');
      if (overlay) {
        overlay.classList.remove('active');
        overlay.style.display = 'none';
      }

      // Update Bottom Bar Auth Tab to Login
      if (bottomAuthItem) {
        bottomAuthItem.onclick = null;
        bottomAuthItem.href = prefix + 'login.html';
        const p = (window.location.pathname || '').toLowerCase();
        if (p.includes('login') || p.includes('signup')) {
          bottomAuthItem.classList.add('active');
        }
      }
      if (bottomAuthLabel) {
        bottomAuthLabel.textContent = 'Login';
      }
      if (bottomAuthDefaultIcon) {
        bottomAuthDefaultIcon.style.display = 'block';
      }
      if (bottomAuthAvatar) {
        bottomAuthAvatar.style.display = 'none';
      }
      if (bottomGoldenTick) {
        bottomGoldenTick.style.display = 'none';
      }
      if (mobileDrawerAuth) {
        mobileDrawerAuth.href = prefix + 'login.html';
        mobileDrawerAuth.textContent = 'Sign In to HarshGuruJi';
      }
    }
  };

  // Mobile bottom profile sheet interactions
  const bottomSheetClose = () => {
    const overlay = document.getElementById('hg-bottom-profile-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => {
        if (!overlay.classList.contains('active')) overlay.style.display = 'none';
      }, 250);
    }
  };

  const sheetCloseBtn = document.getElementById('hg-bottom-sheet-close');
  if (sheetCloseBtn) {
    sheetCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      bottomSheetClose();
    });
  }

  const bottomOverlay = document.getElementById('hg-bottom-profile-overlay');
  if (bottomOverlay) {
    bottomOverlay.addEventListener('click', (e) => {
      if (e.target === bottomOverlay) {
        bottomSheetClose();
      }
    });
  }

  const bottomSheetLogout = document.getElementById('hg-bottom-sheet-logout-btn');
  if (bottomSheetLogout) {
    bottomSheetLogout.addEventListener('click', () => {
      bottomSheetClose();
      import('./js/supabase.js').then(async ({ supabase }) => {
        await supabase.auth.signOut();
        window.location.href = prefix + "index.html";
      }).catch(err => console.log('Supabase signout not available on this page.'));
    });
  }

  // Logout listener
  const logoutBtn = document.getElementById('hg-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      import('./js/supabase.js').then(async ({ supabase }) => {
        await supabase.auth.signOut();
        window.location.href = prefix + "index.html";
      }).catch(err => console.log('Supabase signout not available on this page.'));
    });
  }

  // Subscribe to auth events if available
  window.addEventListener('auth-state-changed', (e) => {
    updateNavUI(e.detail.user, e.detail.profile);
  });

  // Check auth state immediately
  if (window.AuthManager && window.AuthManager.currentUser) {
      updateNavUI(window.AuthManager.currentUser, window.AuthManager.currentProfile);
  } else {
      import('./js/supabase.js').then(async ({ supabase }) => {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
              import('./js/profile.js').then(async ({ getProfile }) => {
                  const profile = await getProfile(session.user.id);
                  updateNavUI(session.user, profile);
              }).catch(()=>updateNavUI(session.user, null));
          }
      }).catch(err => {
         // Supabase not present on page, ignore
      });
  }
});
