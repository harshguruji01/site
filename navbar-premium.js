document.addEventListener('DOMContentLoaded', () => {

  // --- Context-Aware Path Resolver ---
  // The prefix helps correctly link assets/pages if we are currently inside a subdirectory (e.g. /games/snake.html)
  const depth = (window.location.pathname.match(/\//g) || []).length;
  const isSubDir = window.location.pathname.includes('/tools/') || window.location.pathname.includes('/games/') || window.location.pathname.includes('/learning/') || window.location.pathname.includes('/oauth/');
  const prefix = isSubDir ? '../' : '';

  // Remove old implementations if present
  const oldNav = document.getElementById('hg-global-navbar');
  const oldMobile = document.getElementById('hg-mobile-nav');
  if (oldNav) oldNav.remove();
  if (oldMobile) oldMobile.remove();
  
  // Legacy cleanup
  document.querySelectorAll('.premium-navbar, .premium-mobile-nav').forEach(el => el.remove());

  const navHTML = `
    <!-- Global Header -->
    <header class="hg-header" id="hg-global-navbar" aria-label="Main Navigation">
      <div class="hg-nav-container">
        
        <!-- Mobile Hamburger -->
        <button type="button" class="hg-hamburger" id="hg-hamburger" aria-label="Toggle Navigation" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        
        <!-- Brand / Logo -->
        <a href="${prefix}index.html" class="hg-nav-logo" aria-label="HarshGuruJi Home">
          <img src="${prefix}logo.png" alt="HarshGuruJi Logo" fetchpriority="high">
          <span class="hg-brand-text">HarshGuruJi</span>
        </a>

        <!-- Desktop Navigation -->
        <nav class="hg-desktop-nav">
          <ul class="hg-nav-list">
            <li class="hg-nav-item"><a href="${prefix}index.html" class="hg-nav-link">Home</a></li>
            <li class="hg-nav-item"><a href="${prefix}daily-special.html" class="hg-nav-link">Daily Special</a></li>
            
            <li class="hg-nav-item hg-has-dropdown">
              <a href="${prefix}free-tools.html" class="hg-nav-link">Tools <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg></a>
              <div class="hg-dropdown">
                <a href="${prefix}free-tools.html" class="hg-dropdown-link">All Tools</a>
                <a href="${prefix}tools/case-converter.html" class="hg-dropdown-link">Case Converter</a>
                <a href="${prefix}tools/word-counter.html" class="hg-dropdown-link">Word Counter</a>
                <a href="${prefix}tools/password-generator.html" class="hg-dropdown-link">Password Generator</a>
                <a href="${prefix}tools/json-formatter.html" class="hg-dropdown-link">JSON Formatter</a>
              </div>
            </li>

            <li class="hg-nav-item"><a href="${prefix}ai-hub.html" class="hg-nav-link">AI</a></li>

            <li class="hg-nav-item hg-has-dropdown">
              <a href="${prefix}learning-hub.html" class="hg-nav-link">Learning <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg></a>
              <div class="hg-dropdown">
                <a href="${prefix}learning-hub.html" class="hg-dropdown-link">Learning Hub</a>
                <a href="${prefix}education.html" class="hg-dropdown-link">Education Hub</a>
                <a href="${prefix}learning/gk-quiz.html" class="hg-dropdown-link">GK Quiz</a>
                <a href="${prefix}learning/class-10-science.html" class="hg-dropdown-link">Class 10 Science</a>
                <a href="${prefix}learning/class-9-math.html" class="hg-dropdown-link">Class 9 Math</a>
              </div>
            </li>

            <li class="hg-nav-item hg-has-dropdown">
              <a href="${prefix}games-and-apps.html" class="hg-nav-link">Games & Apps <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg></a>
              <div class="hg-dropdown">
                <a href="${prefix}gaming-hub.html" class="hg-dropdown-link">Gaming Hub</a>
                <a href="${prefix}games-and-apps.html" class="hg-dropdown-link">Games & Apps</a>
                <a href="${prefix}store.html" class="hg-dropdown-link">Store</a>
                <a href="${prefix}games/snake.html" class="hg-dropdown-link">Snake Game</a>
                <a href="${prefix}games/tic-tac-toe.html" class="hg-dropdown-link">Tic Tac Toe</a>
              </div>
            </li>
            
            <li class="hg-nav-item hg-has-dropdown">
              <a href="#" class="hg-nav-link">More <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg></a>
              <div class="hg-dropdown">
                <a href="${prefix}about.html" class="hg-dropdown-link">About Us</a>
                <a href="${prefix}contact.html" class="hg-dropdown-link">Contact</a>
                <a href="${prefix}contributor.html" class="hg-dropdown-link">Contributors</a>
                <a href="${prefix}privacy-policy.html" class="hg-dropdown-link">Privacy Policy</a>
                <a href="${prefix}terms-and-conditions.html" class="hg-dropdown-link">Terms & Conditions</a>
              </div>
            </li>
          </ul>
        </nav>

        <!-- Right Side Actions -->
        <div class="hg-nav-actions">
          
          <div class="hg-search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>
            <input type="text" id="hg-search-input" placeholder="Search HarshGuruJi..." aria-label="Search the website">
          </div>
          
          <!-- Auth (Dynamic via JS) -->
          <a href="${prefix}login.html" id="hg-login-btn" class="hg-btn hg-btn-primary">Login</a>
          
          <div class="hg-user-menu" id="hg-user-profile" style="display:none;">
            <div class="hg-user-trigger" tabindex="0" role="button" aria-haspopup="true">
              <img src="${prefix}logo.png" alt="User" id="hg-user-avatar">
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
    </header>

    <!-- Mobile Navigation Overlay -->
    <div class="hg-mobile-nav" id="hg-mobile-nav" aria-hidden="true">
      <div class="hg-mobile-scroll">
        <ul class="hg-mobile-list">
          <li><a href="${prefix}index.html" class="hg-mobile-link">Home</a></li>
          <li><a href="${prefix}daily-special.html" class="hg-mobile-link">Daily Special</a></li>
          
          <li class="hg-mobile-item hg-has-accordion">
            <button class="hg-mobile-accordion-toggle">Tools <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg></button>
            <div class="hg-mobile-accordion-content">
              <a href="${prefix}free-tools.html" class="hg-mobile-sublink">All Tools</a>
              <a href="${prefix}tools/case-converter.html" class="hg-mobile-sublink">Case Converter</a>
              <a href="${prefix}tools/password-generator.html" class="hg-mobile-sublink">Password Generator</a>
            </div>
          </li>

          <li><a href="${prefix}ai-hub.html" class="hg-mobile-link">AI Hub</a></li>
          
          <li class="hg-mobile-item hg-has-accordion">
            <button class="hg-mobile-accordion-toggle">Learning <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg></button>
            <div class="hg-mobile-accordion-content">
              <a href="${prefix}learning-hub.html" class="hg-mobile-sublink">Learning Hub</a>
              <a href="${prefix}learning/class-10-science.html" class="hg-mobile-sublink">Class 10 Science</a>
              <a href="${prefix}learning/class-9-math.html" class="hg-mobile-sublink">Class 9 Math</a>
            </div>
          </li>

          <li class="hg-mobile-item hg-has-accordion">
            <button class="hg-mobile-accordion-toggle">Games & Apps <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg></button>
            <div class="hg-mobile-accordion-content">
              <a href="${prefix}gaming-hub.html" class="hg-mobile-sublink">Gaming Hub</a>
              <a href="${prefix}store.html" class="hg-mobile-sublink">Store</a>
              <a href="${prefix}games/snake.html" class="hg-mobile-sublink">Snake Game</a>
            </div>
          </li>
          
          <li class="hg-mobile-item hg-has-accordion">
            <button class="hg-mobile-accordion-toggle">More <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg></button>
            <div class="hg-mobile-accordion-content">
              <a href="${prefix}about.html" class="hg-mobile-sublink">About Us</a>
              <a href="${prefix}contact.html" class="hg-mobile-sublink">Contact</a>
              <a href="${prefix}privacy-policy.html" class="hg-mobile-sublink">Privacy Policy</a>
            </div>
          </li>
        </ul>
        
        <div class="hg-mobile-footer-actions">
           <!-- Mobile Auth fallback in case it's needed inside menu -->
           <a href="${prefix}login.html" class="hg-btn hg-btn-primary" style="width: 100%; text-align:center;">Sign In to HarshGuruJi</a>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('afterbegin', navHTML);

  // --- Logic Bindings ---
  
  const header = document.getElementById('hg-global-navbar');
  const hamburger = document.getElementById('hg-hamburger');
  const mobileNav = document.getElementById('hg-mobile-nav');
  const searchInput = document.getElementById('hg-search-input');
  
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

  // 3. Mobile Accordions
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

  // 4. Search Implementation
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = prefix + 'explore.html?search=' + encodeURIComponent(query);
        }
      }
    });
  }

  // 5. Active Page Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const allLinks = document.querySelectorAll('.hg-nav-link, .hg-dropdown-link, .hg-mobile-link, .hg-mobile-sublink');
  
  allLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.endsWith(currentPath)) {
      link.classList.add('active');
      
      // Highlight parent dropdown in desktop
      const parentDropdown = link.closest('.hg-has-dropdown');
      if (parentDropdown) {
        parentDropdown.querySelector('.hg-nav-link').classList.add('active');
      }

      // Open parent accordion in mobile
      const parentAccordion = link.closest('.hg-mobile-item');
      if (parentAccordion) {
        parentAccordion.classList.add('open');
        parentAccordion.querySelector('.hg-mobile-accordion-toggle').classList.add('active');
      }
    }
  });

  // 6. Handle Auth State Changes
  const updateNavUI = (user, profile) => {
    const loginBtn = document.getElementById('hg-login-btn');
    const userMenu = document.getElementById('hg-user-profile');
    const userAvatar = document.getElementById('hg-user-avatar');

    if (user) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (userMenu) userMenu.style.display = 'block';
      
      const displayName = (profile && profile.display_name) || user.email.split('@')[0];
      if (userAvatar) {
        userAvatar.src = (profile && profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;
      }
    } else {
      if (loginBtn) loginBtn.style.display = 'inline-flex';
      if (userMenu) userMenu.style.display = 'none';
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
