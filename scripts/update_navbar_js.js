const fs = require('fs');
const path = require('path');

function updateNavbarJsFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('Skipping non-existent:', filePath);
    return;
  }
  let js = fs.readFileSync(filePath, 'utf8');

  // Replace desktopNavListHTML, mobileNavListHTML, bottomBarHTML logic (from 'let desktopNavListHTML = \'\';' to 'let brandLogoHTML = \'\';')
  const navBlockRegex = /let desktopNavListHTML = '';[\s\S]*?let brandLogoHTML = '';/;
  
  const unifiedNavBlock = `// Unified Clean Navigation Menu (Consistent across Main Page and all Pages/Subdomains)
  const desktopNavListHTML = \`
    <li class="hg-nav-item"><a href="\${homeUrl}" class="hg-nav-link" id="nav-link-home">Home</a></li>
    <li class="hg-nav-item"><a href="\${booksUrl}" class="hg-nav-link" id="nav-link-books">Books</a></li>
    <li class="hg-nav-item"><a href="\${portalUrl}daily-special/" class="hg-nav-link" id="nav-link-dailyspecial">Daily Special</a></li>
    <li class="hg-nav-item"><a href="\${storeUrl}" class="hg-nav-link" id="nav-link-store">Store</a></li>
    <li class="hg-nav-item"><a href="\${chatUrl}" class="hg-nav-link" id="nav-link-chat">Chat</a></li>
    <li class="hg-nav-item"><a href="\${portalUrl}contributor/" class="hg-nav-link" id="nav-link-contributor">Contributor</a></li>
    <li class="hg-nav-item hg-has-dropdown" id="nav-item-more">
      <a href="#" class="hg-nav-link" id="nav-link-more" onclick="return false;">More <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg></a>
      <div class="hg-dropdown">
        <a href="\${portalUrl}showcase/" class="hg-dropdown-link" id="drop-link-showcase">✨ Interactive Showcase</a>
        <a href="\${portalUrl}free-tools/" class="hg-dropdown-link" id="drop-link-tools">🛠️ Tools Hub</a>
        <a href="\${portalUrl}ai-hub/" class="hg-dropdown-link" id="drop-link-ai">🤖 AI Hub</a>
        <a href="\${portalUrl}learning-hub/" class="hg-dropdown-link" id="drop-link-learning">📚 Learning Hub</a>
        <a href="\${portalUrl}gaming-hub/" class="hg-dropdown-link" id="drop-link-gaming">🎮 Gaming Hub</a>
        <div class="hg-dropdown-divider"></div>
        <a href="\${portalUrl}about/" class="hg-dropdown-link" id="drop-link-about">About Us</a>
        <a href="\${portalUrl}contact/" class="hg-dropdown-link" id="drop-link-contact">Contact</a>
        <a href="\${portalUrl}privacy-policy/" class="hg-dropdown-link" id="drop-link-privacy">Privacy Policy</a>
        <a href="\${portalUrl}terms-and-conditions/" class="hg-dropdown-link" id="drop-link-terms">Terms &amp; Conditions</a>
      </div>
    </li>
  \`;

  const mobileNavListHTML = \`
    <li><a href="\${homeUrl}" class="hg-mobile-link" id="mob-link-home">Home</a></li>
    <li><a href="\${booksUrl}" class="hg-mobile-link" id="mob-link-books">Books</a></li>
    <li><a href="\${portalUrl}daily-special/" class="hg-mobile-link" id="mob-link-dailyspecial">Daily Special</a></li>
    <li><a href="\${storeUrl}" class="hg-mobile-link" id="mob-link-store">Store</a></li>
    <li><a href="\${chatUrl}" class="hg-mobile-link" id="mob-link-chat">Chat</a></li>
    <li><a href="\${portalUrl}contributor/" class="hg-mobile-link" id="mob-link-contributor">Contributor</a></li>
    <li class="hg-mobile-item hg-has-accordion" id="mob-item-more">
      <button type="button" class="hg-mobile-accordion-toggle">More <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg></button>
      <div class="hg-mobile-accordion-content">
        <a href="\${portalUrl}showcase/" class="hg-mobile-sublink" id="mob-sublink-showcase">✨ Interactive Showcase</a>
        <a href="\${portalUrl}free-tools/" class="hg-mobile-sublink" id="mob-sublink-tools">🛠️ Tools Hub</a>
        <a href="\${portalUrl}ai-hub/" class="hg-mobile-sublink" id="mob-sublink-ai">🤖 AI Hub</a>
        <a href="\${portalUrl}learning-hub/" class="hg-mobile-sublink" id="mob-sublink-learning">📚 Learning Hub</a>
        <a href="\${portalUrl}gaming-hub/" class="hg-mobile-sublink" id="mob-sublink-gaming">🎮 Gaming Hub</a>
        <div class="hg-dropdown-divider" style="margin:0.5rem 0;"></div>
        <a href="\${portalUrl}about/" class="hg-mobile-sublink" id="mob-sublink-about">About Us</a>
        <a href="\${portalUrl}contact/" class="hg-mobile-sublink" id="mob-sublink-contact">Contact</a>
        <a href="\${portalUrl}privacy-policy/" class="hg-mobile-sublink" id="mob-sublink-privacy">Privacy Policy</a>
        <a href="\${portalUrl}terms-and-conditions/" class="hg-mobile-sublink" id="mob-sublink-terms">Terms &amp; Conditions</a>
      </div>
    </li>
  \`;

  const bottomBarHTML = \`
    <a href="\${booksUrl}" class="hg-bottom-item" id="bottom-nav-books" title="NCERT Books">
      <span class="hg-bottom-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      </span>
      <span class="hg-bottom-label">Books</span>
    </a>

    <a href="\${portalUrl}daily-special/" class="hg-bottom-item" id="bottom-nav-dailyspecial" title="Daily Special">
      <span class="hg-bottom-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </span>
      <span class="hg-bottom-label">Daily Special</span>
    </a>

    <a href="\${storeUrl}" class="hg-bottom-item" id="bottom-nav-store" title="GuruStore">
      <span class="hg-bottom-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      </span>
      <span class="hg-bottom-label">Store</span>
    </a>

    <a href="\${homeUrl}" class="hg-bottom-item hg-bottom-item-home" id="bottom-nav-home" title="Home">
      <span class="hg-bottom-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </span>
      <span class="hg-bottom-label">Home</span>
    </a>

    <a href="\${chatUrl}" class="hg-bottom-item" id="bottom-nav-chat" title="Chat App">
      <span class="hg-bottom-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <span class="hg-bottom-chat-dot" id="bottom-chat-unread-dot" style="display:none;"></span>
      </span>
      <span class="hg-bottom-label">Chat</span>
    </a>

    <a href="\${portalUrl}contributor/" class="hg-bottom-item" id="bottom-nav-contributor" title="Contributors">
      <span class="hg-bottom-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      </span>
      <span class="hg-bottom-label">Contributor</span>
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

  let brandLogoHTML = '';`;

  if (navBlockRegex.test(js)) {
    js = js.replace(navBlockRegex, unifiedNavBlock);
    console.log('Replaced navigation HTML block successfully');
  } else {
    console.warn('Could not match navigation HTML block regex');
  }

  // Update setupNavigationState()
  const setupNavRegex = /function setupNavigationState\(\) \{[\s\S]*?setupNavigationState\(\);/;
  const unifiedSetupNav = `function setupNavigationState() {
    const navHost = window.location.hostname.toLowerCase();
    const navPath = (window.location.pathname || '').toLowerCase();
    const navFile = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

    // Helper to safely activate desktop, mobile and bottom items
    function activateItem(desktopId, mobId, bottomId) {
      if (desktopId) document.getElementById(desktopId)?.classList.add('active');
      if (mobId) document.getElementById(mobId)?.classList.add('active');
      if (bottomId) document.getElementById(bottomId)?.classList.add('active');
    }

    // Clear all existing active marks
    document.querySelectorAll('.hg-bottom-item.active, .hg-nav-link.active, .hg-mobile-link.active, .hg-dropdown-link.active, .hg-mobile-sublink.active').forEach(el => el.classList.remove('active'));

    // Route matching for active state
    if (navHost.startsWith('books.') || navHost.includes('books') || navPath.includes('/books') || navFile.includes('book')) {
      activateItem('nav-link-books', 'mob-link-books', 'bottom-nav-books');
    } else if (navHost.startsWith('store.') || navHost.includes('store') || navPath.includes('/store') || navFile.includes('store') || navFile === 'app.html') {
      activateItem('nav-link-store', 'mob-link-store', 'bottom-nav-store');
    } else if (navHost.startsWith('chat.') || navHost.includes('chat') || navPath.includes('/chat') || navFile.includes('chat')) {
      activateItem('nav-link-chat', 'mob-link-chat', 'bottom-nav-chat');
      if (navFile === 'chat.html') document.body.classList.add('is-chat-page');
    } else if (navPath.includes('daily-special') || navFile.includes('daily-special')) {
      activateItem('nav-link-dailyspecial', 'mob-link-dailyspecial', 'bottom-nav-dailyspecial');
    } else if (navPath.includes('contributor') || navFile.includes('contributor')) {
      activateItem('nav-link-contributor', 'mob-link-contributor', 'bottom-nav-contributor');
    } else if (navPath.includes('login') || navPath.includes('signup') || navPath.includes('dashboard') || navPath.includes('profile') || navPath.includes('settings')) {
      activateItem(null, null, 'bottom-nav-auth');
    } else if (navPath === '/' || navPath === '' || navFile === 'index.html' || navFile === '') {
      activateItem('nav-link-home', 'mob-link-home', 'bottom-nav-home');
    } else {
      // More dropdown route matching (Clean URLs supported: /showcase/, /free-tools/, /ai-hub/, etc.)
      const dropdownRoutes = [
        { key: 'showcase', dropId: 'drop-link-showcase', mobId: 'mob-sublink-showcase' },
        { key: 'free-tools', dropId: 'drop-link-tools', mobId: 'mob-sublink-tools' },
        { key: 'tools', dropId: 'drop-link-tools', mobId: 'mob-sublink-tools' },
        { key: 'ai-hub', dropId: 'drop-link-ai', mobId: 'mob-sublink-ai' },
        { key: 'learning-hub', dropId: 'drop-link-learning', mobId: 'mob-sublink-learning' },
        { key: 'gaming-hub', dropId: 'drop-link-gaming', mobId: 'mob-sublink-gaming' },
        { key: 'about', dropId: 'drop-link-about', mobId: 'mob-sublink-about' },
        { key: 'contact', dropId: 'drop-link-contact', mobId: 'mob-sublink-contact' },
        { key: 'privacy-policy', dropId: 'drop-link-privacy', mobId: 'mob-sublink-privacy' },
        { key: 'privacy', dropId: 'drop-link-privacy', mobId: 'mob-sublink-privacy' },
        { key: 'terms-and-conditions', dropId: 'drop-link-terms', mobId: 'mob-sublink-terms' },
        { key: 'terms', dropId: 'drop-link-terms', mobId: 'mob-sublink-terms' },
      ];

      let matched = false;
      for (const r of dropdownRoutes) {
        if (navPath.includes(r.key) || navFile.includes(r.key)) {
          document.getElementById(r.dropId)?.classList.add('active');
          document.getElementById(r.mobId)?.classList.add('active');
          document.getElementById('nav-link-more')?.classList.add('active');
          document.getElementById('mob-item-more')?.classList.add('open');
          matched = true;
          break;
        }
      }
      if (!matched) {
        // Fallback matching by href
        document.querySelectorAll('.hg-dropdown-link, .hg-mobile-sublink').forEach(link => {
          const href = link.getAttribute('href') || '';
          if (href && (href.includes(navPath) || (navFile && href.endsWith(navFile)))) {
            link.classList.add('active');
            document.getElementById('nav-link-more')?.classList.add('active');
          }
        });
      }
    }

    // Instant Red Active State on Click for all Navbar Links
    document.querySelectorAll('.hg-nav-link, .hg-dropdown-link, .hg-mobile-link, .hg-mobile-sublink, .hg-bottom-item').forEach(link => {
      link.addEventListener('click', function(e) {
        if (this.getAttribute('onclick') && this.getAttribute('onclick').includes('return false')) return;
        document.querySelectorAll('.hg-nav-link.active, .hg-dropdown-link.active, .hg-mobile-link.active, .hg-mobile-sublink.active, .hg-bottom-item.active').forEach(el => el.classList.remove('active'));
        this.classList.add('active');
        if (this.classList.contains('hg-dropdown-link')) {
          document.getElementById('nav-link-more')?.classList.add('active');
        }
      });
    });
  }
  setupNavigationState();`;

  if (setupNavRegex.test(js)) {
    js = js.replace(setupNavRegex, unifiedSetupNav);
    console.log('Replaced setupNavigationState successfully');
  } else {
    console.warn('Could not match setupNavigationState regex');
  }

  // Update checkNavAuth() with instant hydration from hg_user_session cookie and shared storage
  const checkAuthRegex = /function checkNavAuth\(\) \{[\s\S]*?checkNavAuth\(\);/;
  const unifiedCheckAuth = `function checkNavAuth() {
    // 0. Zero-Latency SSR/Cookie Instant Hydration
    try {
      let rawSummary = null;
      if (typeof window.getSharedCookie === 'function') {
        rawSummary = window.getSharedCookie('hg_user_session');
      }
      if (!rawSummary) {
        const m = document.cookie.match(/(?:^|;\\s*)hg_user_session=([^;]+)/);
        if (m) rawSummary = decodeURIComponent(m[1]);
      }
      if (!rawSummary && window.HG_SHARED_STORAGE) {
        rawSummary = window.HG_SHARED_STORAGE.getItem('hg_user_session');
      }
      if (rawSummary) {
        const u = JSON.parse(rawSummary);
        if (u && u.id) {
          updateNavUI(
            { id: u.id, email: u.email, user_metadata: { full_name: u.name, avatar_url: u.avatar_url, golden_tick: u.golden_tick } },
            { display_name: u.name, avatar_url: u.avatar_url, golden_tick: u.golden_tick }
          );
        }
      }
    } catch(e) {}

    // 1. Check existing AuthManager singleton
    if (window.AuthManager && window.AuthManager.currentUser) {
      updateNavUI(window.AuthManager.currentUser, window.AuthManager.currentProfile);
      return;
    }

    // 2. Query Supabase client
    const client = window.supabaseClient || (window.AuthManager && window.AuthManager.supabase);
    if (client && client.auth) {
      client.auth.getSession().then(({ data }) => {
        const session = data && data.session;
        if (session && session.user) {
          import(\`\${prefix}js/profile.js\`).then(({ getProfile }) => {
            getProfile(session.user.id).then(profile => updateNavUI(session.user, profile));
          }).catch(() => updateNavUI(session.user, null));
        } else {
          // If no active session and no shared cookies exist, show guest
          const hasCookie = document.cookie.includes('sb-wumdbpyhpblvgjttsbpv-auth-token') || document.cookie.includes('hg_user_session');
          if (!hasCookie) updateNavUI(null, null);
        }
      }).catch(() => {});

      if (typeof client.auth.onAuthStateChange === 'function') {
        client.auth.onAuthStateChange((event, newSession) => {
          if (newSession && newSession.user) {
            import(\`\${prefix}js/profile.js\`).then(({ getProfile }) => {
              getProfile(newSession.user.id).then(profile => updateNavUI(newSession.user, profile));
            }).catch(() => updateNavUI(newSession.user, null));
          } else if (event === 'SIGNED_OUT') {
            updateNavUI(null, null);
          }
        });
      }
      return;
    }

    // 3. Fallback dynamic import of supabase module
    import(\`\${prefix}js/supabase.js\`).then(({ supabase }) => {
      supabase.auth.getSession().then(({ data }) => {
        const session = data && data.session;
        if (session && session.user) {
          import(\`\${prefix}js/profile.js\`).then(({ getProfile }) => {
            getProfile(session.user.id).then(profile => updateNavUI(session.user, profile));
          }).catch(() => updateNavUI(session.user, null));
        } else {
          const hasCookie = document.cookie.includes('sb-wumdbpyhpblvgjttsbpv-auth-token') || document.cookie.includes('hg_user_session');
          if (!hasCookie) updateNavUI(null, null);
        }
      }).catch(() => {});
    }).catch(() => {});
  }
  checkNavAuth();`;

  if (checkAuthRegex.test(js)) {
    js = js.replace(checkAuthRegex, unifiedCheckAuth);
    console.log('Replaced checkNavAuth successfully');
  } else {
    console.warn('Could not match checkNavAuth regex');
  }

  fs.writeFileSync(filePath, js, 'utf8');
  console.log('Updated JS:', filePath);
}

const targets = [
  path.join(__dirname, '../navbar-premium.js'),
  path.join(__dirname, '../../login/navbar-premium.js'),
  path.join(__dirname, '../../books/navbar-premium.js'),
  path.join(__dirname, '../../store/navbar-premium.js'),
];

targets.forEach(t => updateNavbarJsFile(t));
