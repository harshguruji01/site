/**
 * HarshGuruJi Premium Navbar JavaScript
 * Handles Scroll behavior, Mobile Drawer, Search interactivity, and Dropdowns.
 */

document.addEventListener('DOMContentLoaded', () => {
  /* --- 1. SCROLL BEHAVIOR --- */
  const navbar = document.getElementById('main-navbar');
  let lastScrollY = window.scrollY;
  const SCROLL_THRESHOLD = 50;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Add shadow and reduce height when scrolled
    if (currentScrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide navbar on scroll down, show on scroll up
    if (currentScrollY > lastScrollY && currentScrollY > SCROLL_THRESHOLD) {
      // Scrolling down
      navbar.classList.add('hidden');
    } else {
      // Scrolling up
      navbar.classList.remove('hidden');
    }
    
    lastScrollY = currentScrollY;
  }, { passive: true });

  /* --- 2. MOBILE DRAWER --- */
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const closeDrawerBtn = document.getElementById('close-drawer');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');

  const openDrawer = () => {
    mobileDrawer.classList.add('active');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeDrawer = () => {
    mobileDrawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  };

  if (hamburgerMenu) hamburgerMenu.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  // Close on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  // Swipe to close functionality
  let touchStartX = 0;
  let touchEndX = 0;
  
  if (mobileDrawer) {
    mobileDrawer.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    mobileDrawer.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    // If swiped right to left (more than 50px)
    if (touchEndX - touchStartX > 50) {
      closeDrawer();
    }
  }

  /* --- 3. SEARCH INTERACTIVITY --- */
  const searchInput = document.getElementById('global-search');
  const clearSearchBtn = document.getElementById('clear-search');
  const searchContainer = document.querySelector('.nav-search-container');
  const searchShortcut = document.querySelector('.search-shortcut');

  if (searchInput) {
    // Show/hide clear button and dropdown
    searchInput.addEventListener('input', (e) => {
      if (e.target.value.length > 0) {
        if(clearSearchBtn) clearSearchBtn.style.display = 'flex';
        if(searchShortcut) searchShortcut.style.display = 'none';
      } else {
        if(clearSearchBtn) clearSearchBtn.style.display = 'none';
        if(searchShortcut) searchShortcut.style.display = 'inline-block';
      }
    });

    searchInput.addEventListener('focus', () => {
      if (searchContainer) searchContainer.classList.add('active');
    });

    // Handle Keyboard Shortcut (Cmd+K or Ctrl+K)
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if(searchInput) {
        searchInput.value = '';
        searchInput.focus();
        clearSearchBtn.style.display = 'none';
        if(searchShortcut) searchShortcut.style.display = 'inline-block';
      }
    });
  }

  // Click outside to close search dropdown
  document.addEventListener('click', (e) => {
    if (searchContainer && !searchContainer.contains(e.target)) {
      searchContainer.classList.remove('active');
    }
  });

  /* --- 4. AUTH MOCK TOGGLING (For demonstration) --- */
  // In a real scenario, this would be handled by your auth state
  const btnLogin = document.getElementById('btn-login');
  const userProfile = document.getElementById('user-profile');
  const btnLogout = document.getElementById('btn-logout');
  const mobileAuthItem = document.getElementById('mobile-auth-item');

  let isLoggedIn = true; // Set to true to show avatar, false to show Login button

  const updateAuthState = () => {
    if (isLoggedIn) {
      if (btnLogin) btnLogin.style.display = 'none';
      if (userProfile) userProfile.style.display = 'block';
    } else {
      if (btnLogin) btnLogin.style.display = 'block';
      if (userProfile) userProfile.style.display = 'none';
    }
  };

  updateAuthState();

  if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      isLoggedIn = false;
      updateAuthState();
    });
  }

  if (btnLogin) {
    btnLogin.addEventListener('click', (e) => {
      e.preventDefault();
      isLoggedIn = true;
      updateAuthState();
    });
  }
});