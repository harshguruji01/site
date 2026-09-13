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
        
        <!-- Mobile Hamburger -->
        <button type="button" class="hg-hamburger" id="hg-hamburger" aria-label="Toggle Navigation" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        
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
            <li class="hg-nav-item"><a href="${prefix}chat.html" class="hg-nav-link" id="nav-link-chat">Chat</a></li>
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
          <li><a href="${prefix}chat.html" class="hg-mobile-link" id="mob-link-chat">Chat</a></li>
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

    <!-- Global Floating Bottom-Middle Chat Button (Phone, Laptop, Desktop) -->
    <a href="${prefix}chat.html" class="hg-floating-chat-btn" id="hg-floating-chat-btn" aria-label="HarshGuruJi Chat" title="Open Chat">
      <div class="hg-chat-btn-inner">
        <svg class="hg-chat-btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <span class="hg-chat-btn-text">Chat</span>
        <span class="hg-chat-unread-badge" id="hg-chat-unread-badge" style="display:none;">0</span>
      </div>
    </a>
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
    // Tools
    { title: 'Case Converter', desc: 'Convert text to UPPERCASE, lowercase, Title Case, Sentence case', url: 'tools/case-converter.html', type: 'tool', icon: '🔤' },
    { title: 'Word Counter', desc: 'Real-time word, character, sentence and reading time counter', url: 'tools/word-counter.html', type: 'tool', icon: '📝' },
    { title: 'Password Generator', desc: 'Generate ultra-secure random passwords with custom rules', url: 'tools/password-generator.html', type: 'tool', icon: '🔑' },
    { title: 'JSON Formatter & Validator', desc: 'Format, validate, beautify and minify JSON data online', url: 'tools/json-formatter.html', type: 'tool', icon: '📦' },
    { title: 'Base64 Encoder & Decoder', desc: 'Encode and decode strings and files in Base64 format', url: 'tools/base64.html', type: 'tool', icon: '🔄' },
    { title: 'Free Tools Hub', desc: 'Collection of 50+ developer, SEO, student and productivity tools', url: 'free-tools.html', type: 'tool', icon: '🛠️' },
    { title: 'Tools Directory', desc: 'Browse all free web utilities and developer instruments', url: 'tools.html', type: 'tool', icon: '⚙️' },

    // Games
    { title: 'Snake Game', desc: 'Classic retro arcade snake game with score leaderboards', url: 'games/snake.html', type: 'game', icon: '🐍' },
    { title: 'Tic Tac Toe', desc: 'Play Tic Tac Toe against intelligent AI or with a friend', url: 'games/tic-tac-toe.html', type: 'game', icon: '❌' },
    { title: 'Memory Match Game', desc: 'Brain training memory card matching game', url: 'games/memory.html', type: 'game', icon: '🧠' },
    { title: 'Gaming Hub', desc: 'Play free online browser games, arcade and puzzle challenges', url: 'gaming-hub.html', type: 'game', icon: '🎮' },
    { title: 'Gaming Directory', desc: 'Curated arcade games and interactive web entertainment', url: 'gaming.html', type: 'game', icon: '🕹️' },

    // Store & Apps
    { title: 'Store Catalog', desc: 'Discover & download curated Android APKs, PC software and games', url: 'store.html', type: 'store', icon: '🛍️' },
    { title: 'Daily Special', desc: 'Today’s top featured tools, trending apps and exclusive updates', url: 'daily-special.html', type: 'store', icon: '✨' },
    { title: 'Store Applications', desc: 'Browse latest verified applications and utility APKs', url: 'app.html', type: 'store', icon: '📱' },

    // Learning & Education
    { title: 'Learning Hub', desc: 'NCERT solutions, study notes, question banks and exam prep', url: 'learning-hub.html', type: 'learning', icon: '📚' },
    { title: 'Education Hub', desc: 'Comprehensive study materials, subjects and revision guides', url: 'education.html', type: 'learning', icon: '🎓' },
    { title: 'GK Quiz Challenge', desc: 'Test your general knowledge with interactive multi-topic quizzes', url: 'learning/gk-quiz.html', type: 'learning', icon: '💡' },
    { title: 'Class 10 NCERT Solutions', desc: 'Complete Class 10 Science, Mathematics and Social Science notes', url: 'learning/class.html?id=10', type: 'learning', icon: '📖' },
    { title: 'Class 9 NCERT Solutions', desc: 'Class 9 chapters, video tutorials and question papers', url: 'learning/class.html?id=9', type: 'learning', icon: '📘' },
    { title: 'PDF Library & Books', desc: 'Download syllabus textbooks, previous year papers and guides', url: 'learning/pdf-library.html', type: 'learning', icon: '📄' },
    { title: 'Quiz India', desc: 'Interactive competitive examination quizzes for Indian students', url: 'Quiz India/index.html', type: 'learning', icon: '🇮🇳' },

    // AI Hub
    { title: 'AI Hub', desc: 'Explore top Artificial Intelligence models, prompts and tools', url: 'ai-hub.html', type: 'ai', icon: '🤖' },
    { title: 'AI Directory', desc: 'Curated list of generative AI tools for writing, coding and design', url: 'ai.html', type: 'ai', icon: '⚡' },

    // Community & Contributor
    { title: 'Contributor Hub', desc: 'Explore top platform contributors and submit your applications', url: 'contributor.html', type: 'page', icon: '🌟' },
    { title: 'Apply as Contributor', desc: 'Submit your creator or developer application for verification', url: 'apply-contributor.html', type: 'page', icon: '📝' },
    { title: 'Join Contributor Program', desc: 'Join HarshGuruJi creator network and earn golden badges', url: 'join-contributor.html', type: 'page', icon: '🤝' },

    // Pages & Info
    { title: 'Explore & Search', desc: 'Explore all subjects, programming languages and web tools', url: 'explore.html', type: 'page', icon: '🔍' },
    { title: 'About HarshGuruJi', desc: 'Learn more about our mission, creator story and team', url: 'about.html', type: 'page', icon: 'ℹ️' },
    { title: 'Contact & Support', desc: 'Send feedback, ask questions or report issues to the team', url: 'contact.html', type: 'page', icon: '📬' },
    { title: 'Dashboard', desc: 'User profile, activity tracking and saved preferences', url: 'dashboard.html', type: 'page', icon: '📊' },
    { title: 'Settings', desc: 'Manage account settings, profile and security', url: 'settings.html', type: 'page', icon: '⚙️' },
    { title: 'Privacy Policy', desc: 'HarshGuruJi privacy policy, cookies and data guidelines', url: 'privacy-policy.html', type: 'page', icon: '🔒' },
    { title: 'Terms & Conditions', desc: 'Platform terms of service and usage regulations', url: 'terms-and-conditions.html', type: 'page', icon: '📜' }
  ];

  let dynamicStoreApps = [];
  async function fetchLiveStoreApps() {
    try {
      const { supabase } = await import('./js/supabase.js');
      const { data, error } = await supabase
        .from('store_apps')
        .select('id, name, title, short_description, description, icon_url, category')
        .limit(60);
      if (!error && Array.isArray(data)) {
        dynamicStoreApps = data.map(app => {
          const appTitle = app.title || app.name || 'Store App';
          const appDesc = app.short_description || app.description || (app.category ? `Category: ${app.category}` : 'Verified Store Application');
          const hasImg = app.icon_url && app.icon_url.startsWith('http');
          return {
            title: appTitle,
            desc: appDesc,
            url: `store-detail.html?id=${encodeURIComponent(app.id)}`,
            type: 'store',
            icon: hasImg ? `<img src="${app.icon_url}" alt="${escapeNavHtml(appTitle)}" onerror="this.onerror=null;this.parentElement.innerHTML='📱';">` : '📱'
          };
        });
      }
    } catch (e) {
      // Ignore if Supabase is unavailable
    }
  }
  fetchLiveStoreApps();

  function performSearch(query) {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const combined = [...dynamicStoreApps, ...SITE_SEARCH_INDEX];
    const scored = [];

    for (const item of combined) {
      const titleLower = item.title.toLowerCase();
      const descLower = (item.desc || '').toLowerCase();
      const typeLower = (item.type || '').toLowerCase();
      
      let score = 0;
      if (titleLower === q) score += 100;
      else if (titleLower.startsWith(q)) score += 60;
      else if (titleLower.includes(q)) score += 35;

      if (descLower.includes(q)) score += 15;
      if (typeLower.includes(q)) score += 10;

      if (score > 0) {
        scored.push({ item, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 8).map(s => s.item);
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
          <div>No exact match for <strong>"${escapeNavHtml(query)}"</strong></div>
          <div style="margin-top:6px; font-size:0.75rem; color:#a1a1aa;">Press Enter to search entire database on Explore page</div>
        </div>
        <div class="hg-search-dropdown-footer">
          <span>Search entire site</span>
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
              <span class="hg-search-item-badge ${item.type}">${item.type}</span>
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
        <span>${results.length} results</span>
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
      }, 150);
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
    if (!e.target.closest('.hg-search-wrapper') && !e.target.closest('.hg-mobile-search-strip') && !e.target.closest('.hg-mobile-drawer-search')) {
      document.querySelectorAll('.hg-search-dropdown.show').forEach(el => el.classList.remove('show'));
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

      // Update Bottom Bar Auth Tab to Profile
      if (bottomAuthItem) {
        bottomAuthItem.href = prefix + 'dashboard.html';
        const p = (window.location.pathname || '').toLowerCase();
        if (p.includes('dashboard') || p.includes('settings')) {
          bottomAuthItem.classList.add('active');
        }
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

      // Update Bottom Bar Auth Tab to Login
      if (bottomAuthItem) {
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
