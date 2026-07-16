// navbar.js
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.premium-navbar');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const megaMenuParent = document.querySelector('.has-mega-menu');

  // Handle Scroll Effect for Glassmorphism
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Init on load

  // Mobile Menu Toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Mobile Mega Menu Accordion
  if (megaMenuParent && window.innerWidth <= 992) {
    const megaMenuLink = megaMenuParent.querySelector('.nav-link');
    megaMenuLink.addEventListener('click', (e) => {
      e.preventDefault();
      megaMenuParent.classList.toggle('active');
    });
  }

  // Active Link Highlighting based on current page
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });

  // Ripple Effect for Login Button
  const loginBtn = document.querySelector('.nav-login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('mousedown', function (e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.background = 'rgba(255, 255, 255, 0.4)';
      ripple.style.width = '100px';
      ripple.style.height = '100px';
      ripple.style.borderRadius = '50%';
      ripple.style.transform = 'translate(-50%, -50%) scale(0)';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.animation = 'ripple 0.6s linear';
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }
});
