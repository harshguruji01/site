document.addEventListener('DOMContentLoaded', () => {
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
});
