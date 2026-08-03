/**
 * choose-website.js
 * Premium Floating Button & Modal for GuruJi Platforms
 */

(function() {
  'use strict';

  // 1. Inject HTML into the DOM
  function injectUI() {
    // Check if already injected
    if (document.getElementById('cwFloatingBtn')) return;

    // Create a container for our UI
    const container = document.createElement('div');
    container.id = 'cw-widget-container';

    container.innerHTML = `
      <!-- Floating Button -->
      <button class="cw-floating-btn" id="cwFloatingBtn" aria-label="Choose Website" aria-haspopup="dialog" aria-expanded="false">
        <span class="cw-btn-icon">🌐</span>
        Choose Website
      </button>

      <!-- Modal Overlay -->
      <div class="cw-modal-overlay" id="cwModal" role="dialog" aria-modal="true" aria-labelledby="cwModalTitle">
        <div class="cw-modal" id="cwModalContent">
          <button class="cw-close-btn" id="cwCloseBtn" aria-label="Close modal">&times;</button>
          
          <h2 id="cwModalTitle" class="cw-modal-title">Choose Your Website</h2>
          <p class="cw-modal-subtitle">Select the GuruJi platform you want to visit.</p>
          
          <div class="cw-cards">
            <!-- Card 1: Main Site -->
            <div class="cw-card">
              <div class="cw-card-logo cw-logo-1">GuruJi</div>
              <p class="cw-card-desc">Main educational platform with Notes, AI Tools, Daily Special, Community, Store and Learning Resources.</p>
              <!-- Stays on current site, can also be a button that just closes if already on main -->
              <a href="https://www.webguruji.online" class="cw-card-btn cw-btn-primary" aria-label="Visit Main Website">Visit Website</a>
            </div>
            
            <!-- Card 2: Second Site -->
            <div class="cw-card">
              <div class="cw-card-logo cw-logo-2">GuruJi Next</div>
              <p class="cw-card-desc">Experimental platform with latest features, testing environment and upcoming updates.</p>
              <a href="https://harshguruji01.github.io/guruji/" target="_blank" rel="noopener noreferrer" class="cw-card-btn cw-btn-secondary" aria-label="Open GuruJi Next in new tab">Open Website</a>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);
  }

  // 2. Setup Event Listeners & Logic
  function setupLogic() {
    const btn = document.getElementById('cwFloatingBtn');
    const modal = document.getElementById('cwModal');
    const closeBtn = document.getElementById('cwCloseBtn');
    const modalContent = document.getElementById('cwModalContent');

    if (!btn || !modal) return;

    // Ripple Effect Logic
    function createRipple(event) {
      const button = event.currentTarget;
      
      const circle = document.createElement('span');
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;

      const rect = button.getBoundingClientRect();
      
      // Calculate click coordinates relative to button
      let clientX = event.clientX;
      let clientY = event.clientY;

      // Handle keyboard trigger (Enter/Space) where clientX/Y might be 0
      if (clientX === 0 && clientY === 0) {
        clientX = rect.left + radius;
        clientY = rect.top + radius;
      }

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${clientX - rect.left - radius}px`;
      circle.style.top = `${clientY - rect.top - radius}px`;
      circle.classList.add('cw-ripple');

      const ripple = button.getElementsByClassName('cw-ripple')[0];
      if (ripple) {
        ripple.remove();
      }

      button.appendChild(circle);
    }

    // Open Modal
    function openModal(e) {
      if(e) createRipple(e);
      
      modal.classList.add('cw-active');
      document.body.classList.add('cw-modal-open');
      btn.setAttribute('aria-expanded', 'true');
      
      // Accessibility focus management
      setTimeout(() => {
        closeBtn.focus();
      }, 100);
    }

    // Close Modal
    function closeModal() {
      modal.classList.remove('cw-active');
      document.body.classList.remove('cw-modal-open');
      btn.setAttribute('aria-expanded', 'false');
      
      // Return focus to button
      btn.focus();
    }

    // Listeners
    btn.addEventListener('click', openModal);
    
    closeBtn.addEventListener('click', closeModal);
    
    // Click outside to close
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Keyboard accessibility (ESC to close)
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('cw-active')) {
        closeModal();
      }
    });

    // Trap focus inside modal when open
    modal.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        const focusableElements = modal.querySelectorAll('a[href], button, textarea, input, select');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }

  // Initialize
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        injectUI();
        setupLogic();
      });
    } else {
      injectUI();
      setupLogic();
    }
  }

  init();

})();
