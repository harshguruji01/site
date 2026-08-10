document.addEventListener('DOMContentLoaded', () => {

  // --- Context-Aware Navbar System ---
  function detectPageType() {
      const path = window.location.pathname;
      const normalPages = [
          '/', '/index.html', 'ai-hub.html', 'tool-hub.html', 'free-tools.html', 
          'gaming-hub.html', 'learning-hub.html', 'store.html', 
          'daily-special.html', 'about.html', 'contact.html', 'login.html', 'signup.html', 'dashboard.html'
      ];
      if (normalPages.some(p => path.endsWith(p))) return 'normal';
      if (path.includes('/tools/') || path.includes('/games/')) return 'content';
      const metaType = document.querySelector('meta[name="hg-page-type"]');
      if (metaType && metaType.content === 'content') return 'content';
      return 'normal';
  }

  function getPageTitle() {
      const metaTitle = document.querySelector('meta[name="hg-page-title"]');
      if (metaTitle) return metaTitle.content;
      const h1 = document.querySelector('h1');
      if (h1) return h1.innerText.trim();
      const title = document.title;
      if (title) return title.split('|')[0].split('–')[0].split('-')[0].trim();
      return "Content Page";
  }

  
  const oldNav = document.getElementById('premium-navbar');
  const oldMobile = document.getElementById('premium-mobile-nav');
  if (oldNav) oldNav.remove();
  if (oldMobile) oldMobile.remove();
  
  const title = getPageTitle();
  const prefix = (window.location.pathname.includes('/tools/') || window.location.pathname.includes('/games/') || window.location.pathname.includes('/learning/')) ? '../' : '';

  if (detectPageType() === 'content') {
      const navHTML = `
        <nav class="premium-navbar content-navbar" id="premium-navbar" aria-label="Main Navigation">
          <div class="premium-nav-container" style="justify-content: flex-start; gap: 1rem;">
            <button type="button" class="premium-hamburger" id="premium-hamburger" aria-label="Toggle Menu" aria-expanded="false" style="margin-right: 1rem;">
              <span></span><span></span><span></span>
            </button>
            
            <a href="${prefix}index.html" class="premium-nav-logo" aria-label="HarshGuruJi Home">
              <img src="${prefix}favicon.ico" alt="HarshGuruJi Logo" fetchpriority="high" class="navbar-favicon">
              <span class="premium-brand-text">HarshGuruJi</span>
            </a>
            
            <div class="content-nav-links" style="display: flex; align-items: center; gap: 0.5rem; margin-left: 1rem;">
              <a href="${prefix}index.html" class="content-nav-item">Home</a>
              <a href="${prefix}daily-special.html" class="content-nav-item">DailySpecial</a>
              <a href="${prefix}store.html" class="content-nav-item">Store</a>
            </div>
            
            <div class="content-page-title" title="${title}">${title}</div>
            
            <div class="premium-nav-actions" style="margin-left: auto;">
              <div class="premium-search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>
                <input type="text" id="premium-search-input" placeholder="Search HarshGuruJi..." aria-label="Search">
              </div>
              
              <a href="${prefix}login.html" id="premium-login-btn" class="premium-btn-primary">Login</a>
              <div id="premium-user-profile" class="premium-user-profile" style="display:none;">
                <img src="${prefix}logo.png" alt="User" id="premium-user-avatar">
                <span class="premium-user-name" id="premium-user-name">User</span>
              </div>
            </div>
          </div>
        </nav>
        
        <div class="premium-mobile-nav" id="premium-mobile-nav">
          <div class="mobile-menu-container">
            <div class="mobile-nav-item"><a href="${prefix}index.html" class="mobile-nav-link">Home</a></div>
            <div class="mobile-nav-item"><a href="${prefix}daily-special.html" class="mobile-nav-link">DailySpecial</a></div>
            <div class="mobile-nav-item"><a href="${prefix}store.html" class="mobile-nav-link">Store</a></div>
            <div class="mobile-nav-item"><a href="#" class="mobile-nav-link active" style="color: var(--hub-accent);">${title}</a></div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('afterbegin', navHTML);
  } else {
      const navHTML = `
<nav class="premium-navbar" id="premium-navbar" aria-label="Main Navigation">
  <div class="premium-nav-container">
    <!-- Mobile Hamburger -->
    <button class="premium-hamburger" id="premium-hamburger" aria-label="Toggle Menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>

    <!-- Brand / Logo -->
    <a href="${prefix}index.html" class="premium-nav-logo" aria-label="HarshGuruJi Home">
      <img src="${prefix}favicon.ico" alt="HarshGuruJi Logo" fetchpriority="high" class="navbar-favicon">
      <span class="premium-brand-text">HarshGuruJi</span>
    </a>

    <!-- Desktop Nav Links -->
    <ul class="premium-nav-links">
      <li class="premium-nav-item"><a href="${prefix}index.html" class="premium-nav-link">Home</a></li>
      <li class="premium-nav-item"><a href="${prefix}daily-special.html" class="premium-nav-link">Daily Special</a></li>
      
      <!-- AI Hub Mega Menu -->
      <li class="premium-nav-item has-mega-menu">
        <a href="${prefix}ai-hub.html" class="premium-nav-link">AI Hub <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg></a>
        <div class="premium-mega-menu">
          <div class="mega-grid">
            <div class="mega-column">
              <div class="mega-column-title">🤖 Conversational AI</div>
              <ul>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">💬</div><span>ChatGPT</span></a></li>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">✨</div><span>Gemini</span></a></li>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">🧠</div><span>Claude</span></a></li>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">⚡</div><span>DeepSeek</span></a></li>
              </ul>
            </div>
            <div class="mega-column">
              <div class="mega-column-title">🎨 Generative AI</div>
              <ul>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">🖼️</div><span>Image AI</span></a></li>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">🎥</div><span>Video AI</span></a></li>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">💻</div><span>Coding AI</span></a></li>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">🚀</div><span>Productivity AI</span></a></li>
              </ul>
            </div>
          </div>
        </div>
      </li>

      <!-- Tools Hub Mega Menu -->
      <li class="premium-nav-item has-mega-menu">
        <a href="${prefix}free-tools.html" class="premium-nav-link">Tools Hub <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg></a>
        <div class="premium-mega-menu">
          <div class="mega-grid">
            <div class="mega-column">
              <div class="mega-column-title">🛠️ Utilities</div>
              <ul>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">👨‍💻</div><span>Developer</span></a></li>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">🌐</div><span>Network</span></a></li>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">📈</div><span>SEO</span></a></li>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">🎨</div><span>Design</span></a></li>
              </ul>
            </div>
            <div class="mega-column">
              <div class="mega-column-title">⚙️ Processors</div>
              <ul>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">🔄</div><span>Converters</span></a></li>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">⚡</div><span>Generators</span></a></li>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">🧰</div><span>Utilities</span></a></li>
              </ul>
            </div>
          </div>
        </div>
      </li>

      <!-- Learning Mega Menu -->
      <li class="premium-nav-item has-mega-menu">
        <a href="${prefix}learning-hub.html" class="premium-nav-link">Learning <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg></a>
        <div class="premium-mega-menu">
          <div class="mega-grid">
            <div class="mega-column">
              <div class="mega-column-title">📚 Subjects</div>
              <ul>
                <li><a href="${prefix}learning/class-10-science.html" class="mega-link"><div class="mega-link-icon">🔬</div><span>Class 10 Science</span></a></li>
                <li><a href="${prefix}learning-hub.html?class=Class+10&subject=Mathematics" class="mega-link"><div class="mega-link-icon">📐</div><span>Mathematics</span></a></li>
                <li><a href="${prefix}learning-hub.html?class=Class+10&subject=English" class="mega-link"><div class="mega-link-icon">📖</div><span>English</span></a></li>
                <li><a href="${prefix}learning-hub.html" class="mega-link"><div class="mega-link-icon">📚</div><span>View All Subjects</span></a></li>
              </ul>
            </div>
            <div class="mega-column">
              <div class="mega-column-title">🚀 Advanced</div>
              <ul>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">📱</div><span>Technology</span></a></li>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">🛡️</div><span>Cybersecurity</span></a></li>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">📖</div><span>Tutorials</span></a></li>
              </ul>
            </div>
          </div>
        </div>
      </li>

      <!-- Gaming Mega Menu -->
      <li class="premium-nav-item has-mega-menu">
        <a href="${prefix}gaming-hub.html" class="premium-nav-link">Gaming <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg></a>
        <div class="premium-mega-menu">
          <div class="mega-grid">
            <div class="mega-column">
              <div class="mega-column-title">🎮 Platforms</div>
              <ul>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">💻</div><span>PC Games</span></a></li>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">📱</div><span>Android Games</span></a></li>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">🔥</div><span>Free Fire</span></a></li>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">🧱</div><span>Minecraft</span></a></li>
              </ul>
            </div>
            <div class="mega-column">
              <div class="mega-column-title">🏆 Competitive</div>
              <ul>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">🎯</div><span>Esports</span></a></li>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">⚙️</div><span>Game Tools</span></a></li>
              </ul>
            </div>
          </div>
        </div>
      </li>

      <!-- Store Mega Menu -->
      <li class="premium-nav-item has-mega-menu">
        <a href="${prefix}store.html" class="premium-nav-link">Store <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg></a>
        <div class="premium-mega-menu">
          <div class="mega-grid">
            <div class="mega-column">
              <div class="mega-column-title">🛒 Platforms</div>
              <ul>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">🪟</div><span>Windows</span></a></li>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">🤖</div><span>Android</span></a></li>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">🐧</div><span>Linux</span></a></li>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">🍎</div><span>Mac</span></a></li>
              </ul>
            </div>
            <div class="mega-column">
              <div class="mega-column-title">📦 Digital</div>
              <ul>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">📱</div><span>Apps</span></a></li>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">🧩</div><span>Extensions</span></a></li>
                <li><a href="#" class="mega-link"><div class="mega-link-icon">💾</div><span>Software</span></a></li>
              </ul>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <!-- Search & Actions -->
    <div class="premium-nav-actions">
      <!-- Search Bar -->
      <div class="premium-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="M21 21l-4.35-4.35"></path>
        </svg>
        <input type="text" id="premium-search-input" placeholder="Search..." aria-label="Search">
        <div class="search-shortcut">CTRL K</div>
      </div>
      
      <!-- Theme Toggle -->
      <button class="action-btn" aria-label="Toggle Theme">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      </button>

      <!-- Notification -->
      <button class="action-btn" aria-label="Notifications">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
      </button>

      <!-- Auth (Dynamic via JS) -->
      <a href="${prefix}login.html" id="premium-login-btn" class="premium-btn-primary">Login</a>
      <div id="premium-user-profile" class="premium-user-profile" style="display:none;">
        <img src="${prefix}logo.png" alt="User" id="premium-user-avatar">
        <span class="premium-user-name" id="premium-user-name">User</span>
      </div>
    </div>
  </div>
</nav>

<div class="premium-mobile-nav" id="premium-mobile-nav">
  <div class="mobile-menu-container">
    <div class="mobile-nav-item">
      <a href="${prefix}index.html" class="mobile-nav-link">Home</a>
    </div>
    <div class="mobile-nav-item">
      <a href="#" class="mobile-nav-link">AI Hub <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg></a>
      <div class="mobile-submenu">
        <div class="mobile-submenu-inner">
          <a href="#" class="mobile-sub-link">ChatGPT</a>
          <a href="#" class="mobile-sub-link">Gemini</a>
          <a href="#" class="mobile-sub-link">Claude</a>
          <a href="#" class="mobile-sub-link">Image AI</a>
        </div>
      </div>
    </div>
    <div class="mobile-nav-item">
      <a href="#" class="mobile-nav-link">Tools Hub <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg></a>
      <div class="mobile-submenu">
        <div class="mobile-submenu-inner">
          <a href="#" class="mobile-sub-link">Developer</a>
          <a href="#" class="mobile-sub-link">SEO</a>
          <a href="#" class="mobile-sub-link">Design</a>
        </div>
      </div>
    </div>
    <div class="mobile-nav-item">
      <a href="#" class="mobile-nav-link">Learning <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg></a>
      <div class="mobile-submenu">
        <div class="mobile-submenu-inner">
          <a href="#" class="mobile-sub-link">Programming</a>
          <a href="#" class="mobile-sub-link">Science</a>
          <a href="#" class="mobile-sub-link">Cybersecurity</a>
        </div>
      </div>
    </div>
    <div class="mobile-nav-item">
      <a href="${prefix}store.html" class="mobile-nav-link">Store</a>
    </div>
    <div class="mobile-nav-item">
      <a href="${prefix}about.html" class="mobile-nav-link">About Us</a>
    </div>
  </div>
</div>
      `;
      document.body.insertAdjacentHTML('afterbegin', navHTML);
  }

  // --- End Context-Aware Navbar System ---

  // Re-select elements in case they were replaced
  const navbar = document.getElementById('premium-navbar');
  const hamburger = document.getElementById('premium-hamburger');
  const mobileNav = document.getElementById('premium-mobile-nav');
  const searchInput = document.getElementById('premium-search-input');
  
  // 1. Scroll Effect (Shrink & Blur)
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // 2. Mobile Full-Screen Menu Toggle
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      
      // Prevent body scroll when menu is open
      if (mobileNav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  // 3. Mobile Mega Menu Accordions
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  mobileNavItems.forEach(item => {
    const link = item.querySelector('.mobile-nav-link');
    const submenu = item.querySelector('.mobile-submenu');
    
    if (link && submenu) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Close others (optional accordion style)
        mobileNavItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('open')) {
            otherItem.classList.remove('open');
          }
        });
        
        // Toggle current
        item.classList.toggle('open');
      });
    }
  });

  // 4. Keyboard Shortcut for Search (CTRL+K / CMD+K)
  if (searchInput) {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInput.focus();
      }
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          const depth = (window.location.pathname.match(/\//g) || []).length;
          const prefix = (window.location.pathname.includes('/tools/') || window.location.pathname.includes('/games/') || window.location.pathname.includes('/learning/')) ? '../' : '';
          window.location.href = prefix + 'explore.html?search=' + encodeURIComponent(query);
        }
      }
    });
  }

  // 5. Active Page Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.premium-nav-link, .mega-link, .mobile-sub-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href === currentPath) {
      link.classList.add('active');
      
      // If it's a mobile sub-link, open its parent accordion automatically
      const parentItem = link.closest('.mobile-nav-item');
      if (parentItem) {
        parentItem.classList.add('open');
      }
    }
  });

  // 6. Handle Auth State Changes
  const updateNavUI = (user, profile) => {
    const loginBtn = document.getElementById('premium-login-btn');
    const userProfile = document.getElementById('premium-user-profile');
    const userName = document.getElementById('premium-user-name');
    const userAvatar = document.getElementById('premium-user-avatar');

    if (user) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (userProfile) userProfile.style.display = 'flex';
      
      const displayName = (profile && profile.display_name) || user.email.split('@')[0];
      if (userName) userName.textContent = displayName;
      
      if (userAvatar) {
        userAvatar.src = (profile && profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;
      }
    } else {
      if (loginBtn) loginBtn.style.display = 'inline-flex';
      if (userProfile) userProfile.style.display = 'none';
    }
  };

  window.addEventListener('auth-state-changed', (e) => {
    updateNavUI(e.detail.user, e.detail.profile);
  });

  // Also check immediately in case the event fired before this listener was added
  if (window.AuthManager && window.AuthManager.currentUser) {
      updateNavUI(window.AuthManager.currentUser, window.AuthManager.currentProfile);
  } else {
      // Fallback: manually check supabase session if AuthManager isn't globally exposed
      import('./js/supabase.js').then(async ({ supabase }) => {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
              import('./js/profile.js').then(async ({ getProfile }) => {
                  const profile = await getProfile(session.user.id);
                  updateNavUI(session.user, profile);
              });
          }
      }).catch(err => console.log('Auth check deferred to event listener.'));
  }

  // Profile Dropdown logic
  const profileToggle = document.getElementById("premium-user-profile");
  if (profileToggle) {
    profileToggle.addEventListener('click', () => {
      window.location.href = "dashboard.html"; 
    });
  }
});
