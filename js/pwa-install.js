/**
 * HarshGuruJi - PWA Install & Home Screen Shortcut Manager
 * Seamlessly triggers native browser install prompt / shortcut creation tab.
 */
(function () {
  'use strict';

  // Prevent multiple initializations
  if (window.__HG_PWA_INITIALIZED__) return;
  window.__HG_PWA_INITIALIZED__ = true;

  // --- Configuration ---
  // Fast prompt display: 3.5s default, 1.5s if prompt ready immediately
  const DISPLAY_DELAY_MS = 3500;
  const DISMISS_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours cooldown after dismissal

  // Global prompt holder (preserve from early capture in head or navbar-premium.js)
  window.deferredPwaPrompt = window.deferredPwaPrompt || window.__hgDeferredPrompt || null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPwaPrompt = e;
    window.__hgDeferredPrompt = e;
    window.dispatchEvent(new CustomEvent('hg-pwa-ready'));
    scheduleQuickBanner();
  });

  // Listen for successful install
  window.addEventListener('appinstalled', () => {
    localStorage.setItem('hg_pwa_installed', 'true');
    hideBanner();
    closeModal();
    showToast('HarshGuruJi Shortcut created on your home screen! 🎉');
  });

  // Calculate path prefix for subdirectories (/tools/, /games/, /learning/, etc.)
  function getPathPrefix() {
    const p = window.location.pathname;
    if (p.includes('/tools/') || p.includes('/games/') || p.includes('/learning/') || p.includes('/oauth/') || p.includes('/Quiz')) {
      return '../';
    }
    return '';
  }

  const prefix = getPathPrefix();

  // Ensure manifest is linked
  function ensureManifest() {
    if (!document.querySelector('link[rel="manifest"]')) {
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = prefix + 'manifest.json';
      document.head.appendChild(link);
    }
  }

  // Ensure Service Worker is registered
  function registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker
        .register(prefix + 'service-worker.js', { scope: prefix || './' })
        .then((reg) => {
          console.debug('HarshGuruJi PWA: Service worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.debug('HarshGuruJi PWA: Service worker registration notice:', err);
        });
    }
  }

  // Check if user is already running the app in standalone shortcut mode
  function isRunningStandalone() {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://')
    );
  }

  // Check if device is iOS (iPhone/iPad/iPod)
  function isIOS() {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
  }

  // Check dismissal timestamp
  function isDismissedRecently() {
    const isTestMode = new URLSearchParams(window.location.search).has('test_install');
    if (isTestMode) return false;

    const dismissedTime = localStorage.getItem('hg_pwa_dismissed');
    if (!dismissedTime) return false;
    const elapsed = Date.now() - parseInt(dismissedTime, 10);
    return elapsed < DISMISS_COOLDOWN_MS;
  }

  // Build and inject Banner DOM
  function createBannerDOM() {
    if (document.getElementById('hg-pwa-banner')) return;

    const banner = document.createElement('aside');
    banner.id = 'hg-pwa-banner';
    banner.className = 'hg-pwa-banner';
    banner.setAttribute('role', 'alert');
    banner.setAttribute('aria-label', 'Install HarshGuruJi App');

    banner.innerHTML = `
      <div class="hg-pwa-inner">
        <div class="hg-pwa-left" id="hg-pwa-banner-click" title="Click to install HarshGuruJi Shortcut">
          <div class="hg-pwa-icon-wrap">
            <img src="${prefix}logo-192.png" alt="HarshGuruJi App Icon" loading="eager" width="48" height="48">
            <span class="hg-pwa-badge-pulse" aria-hidden="true"></span>
          </div>
          <div class="hg-pwa-content">
            <div class="hg-pwa-title-row">
              <h4 class="hg-pwa-title">HarshGuruJi Shortcut</h4>
              <span class="hg-pwa-tag">Direct Access ⚡</span>
            </div>
            <p class="hg-pwa-desc">Home Screen par shortcut banayein aur bina browser direct open karein!</p>
          </div>
        </div>
        <div class="hg-pwa-actions">
          <button type="button" class="hg-pwa-install-btn" id="hg-pwa-install-action" aria-label="Add shortcut to home screen">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Install / Shortcut</span>
          </button>
          <button type="button" class="hg-pwa-close-btn" id="hg-pwa-dismiss-btn" aria-label="Dismiss banner" title="Baad me">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // Setup event handlers
    const installBtn = document.getElementById('hg-pwa-install-action');
    const bannerClick = document.getElementById('hg-pwa-banner-click');
    const closeBtn = document.getElementById('hg-pwa-dismiss-btn');

    if (installBtn) installBtn.addEventListener('click', handleInstallClick);
    if (bannerClick) bannerClick.addEventListener('click', handleInstallClick);
    if (closeBtn) closeBtn.addEventListener('click', handleDismissClick);
  }

  // Build and inject Instruction Modal (for iOS & unsupported browsers)
  function createModalDOM() {
    if (document.getElementById('hg-pwa-modal')) return;

    const overlay = document.createElement('div');
    overlay.id = 'hg-pwa-modal';
    overlay.className = 'hg-pwa-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'How to add to Home Screen');

    const isApple = isIOS();

    overlay.innerHTML = `
      <div class="hg-pwa-modal-card">
        <button type="button" class="hg-pwa-modal-close" id="hg-pwa-modal-close-btn" aria-label="Close guide">✕</button>
        <div class="hg-pwa-modal-header">
          <img src="${prefix}logo-192.png" alt="HarshGuruJi" class="hg-pwa-modal-logo" width="52" height="52">
          <div class="hg-pwa-modal-title-wrap">
            <h3 class="hg-pwa-modal-title">Home Screen Par Add Karein</h3>
            <p class="hg-pwa-modal-subtitle">${isApple ? 'iPhone / iPad Safari 1-Tap Shortcut' : 'Direct Home Screen Shortcut Guide'}</p>
          </div>
        </div>

        <div class="hg-pwa-steps">
          ${
            isApple
              ? `
            <div class="hg-pwa-step-item">
              <div class="hg-pwa-step-number">1</div>
              <p class="hg-pwa-step-text">Safari browser ke bottom par <strong>Share</strong> button <span class="hg-pwa-step-badge">⎋ Share</span> par tap karein.</p>
            </div>
            <div class="hg-pwa-step-item">
              <div class="hg-pwa-step-number">2</div>
              <p class="hg-pwa-step-text">Menu scroll karke <strong>'Add to Home Screen'</strong> <span class="hg-pwa-step-badge">➕ Add</span> par click karein.</p>
            </div>
            <div class="hg-pwa-step-item">
              <div class="hg-pwa-step-number">3</div>
              <p class="hg-pwa-step-text">Top-right corner par <strong>'Add'</strong> dabayein. HarshGuruJi shortcut Home Screen par turant ban jayega!</p>
            </div>
          `
              : `
            <div class="hg-pwa-step-item">
              <div class="hg-pwa-step-number">1</div>
              <p class="hg-pwa-step-text">Browser me direct popup nahi dikha toh top-right me <strong>Menu (3 dots ⋮)</strong> dabayein.</p>
            </div>
            <div class="hg-pwa-step-item">
              <div class="hg-pwa-step-number">2</div>
              <p class="hg-pwa-step-text">Menu list me se <strong>'Install App'</strong> ya <strong>'Add to Home screen'</strong> chunein.</p>
            </div>
            <div class="hg-pwa-step-item">
              <div class="hg-pwa-step-number">3</div>
              <p class="hg-pwa-step-text"><strong>'Install'</strong> par click karein aur direct shortcut app ke roop me chalayein!</p>
            </div>
          `
          }
        </div>

        <div style="display: flex; gap: 10px; margin-top: 15px;">
          <button type="button" class="hg-pwa-modal-done-btn" id="hg-pwa-modal-done-btn" style="flex: 1;">Theek Hai (Got it!)</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Event listeners
    const closeBtn = document.getElementById('hg-pwa-modal-close-btn');
    const doneBtn = document.getElementById('hg-pwa-modal-done-btn');

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (doneBtn) doneBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  function openModal() {
    createModalDOM();
    const modal = document.getElementById('hg-pwa-modal');
    if (modal) {
      modal.classList.add('hg-pwa-modal-open');
    }
  }

  function closeModal() {
    const modal = document.getElementById('hg-pwa-modal');
    if (modal) {
      modal.classList.remove('hg-pwa-modal-open');
    }
  }

  // Toast notification helper
  function showToast(message) {
    let toast = document.getElementById('hg-pwa-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'hg-pwa-toast';
      toast.className = 'hg-pwa-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>⚡</span><span>${message}</span>`;
    toast.classList.add('hg-pwa-toast-show');
    setTimeout(() => {
      toast.classList.remove('hg-pwa-toast-show');
    }, 4500);
  }

  // Show Banner smoothly sliding from top
  function showBanner() {
    if (isRunningStandalone() || localStorage.getItem('hg_pwa_installed') === 'true') {
      return;
    }
    createBannerDOM();
    const banner = document.getElementById('hg-pwa-banner');
    if (banner) {
      requestAnimationFrame(() => {
        banner.classList.add('hg-pwa-visible');
      });
    }
  }

  // Hide Banner sliding back up
  function hideBanner() {
    const banner = document.getElementById('hg-pwa-banner');
    if (banner) {
      banner.classList.remove('hg-pwa-visible');
    }
  }

  // Dismiss button clicked
  function handleDismissClick(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    localStorage.setItem('hg_pwa_dismissed', Date.now().toString());
    hideBanner();
  }

  // Install button clicked - opens native browser shortcut/install prompt directly
  async function handleInstallClick(e) {
    if (e && e.target && e.target.closest('#hg-pwa-dismiss-btn')) {
      return;
    }
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    let promptEvent = window.deferredPwaPrompt || window.__hgDeferredPrompt;

    // If prompt is not yet ready, show brief loading animation while awaiting beforeinstallprompt
    if (!promptEvent) {
      const installBtn = document.getElementById('hg-pwa-install-action');
      const originalHtml = installBtn ? installBtn.innerHTML : '';
      if (installBtn) {
        installBtn.classList.add('hg-pwa-loading');
        installBtn.innerHTML = `
          <svg class="hg-pwa-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25" stroke="currentColor"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
          </svg>
          <span>Opening Shortcut...</span>
        `;
      }

      // Wait up to 1000ms for browser beforeinstallprompt
      await new Promise((resolve) => {
        const handler = () => {
          window.removeEventListener('hg-pwa-ready', handler);
          resolve();
        };
        window.addEventListener('hg-pwa-ready', handler);
        setTimeout(resolve, 1000);
      });

      promptEvent = window.deferredPwaPrompt || window.__hgDeferredPrompt;
      if (installBtn) {
        installBtn.classList.remove('hg-pwa-loading');
        installBtn.innerHTML = originalHtml;
      }
    }

    // Direct Browser Prompt Trigger!
    if (promptEvent) {
      try {
        // Triggers the native browser install popup (Install HarshGuruJi app dialog)
        promptEvent.prompt();
        const choiceResult = await promptEvent.userChoice;
        if (choiceResult && choiceResult.outcome === 'accepted') {
          localStorage.setItem('hg_pwa_installed', 'true');
          hideBanner();
          showToast('HarshGuruJi Shortcut created on your home screen! 🎉');
        } else {
          hideBanner();
          localStorage.setItem('hg_pwa_dismissed', Date.now().toString());
        }
        window.deferredPwaPrompt = null;
        window.__hgDeferredPrompt = null;
        return;
      } catch (err) {
        console.debug('Prompt execution notice:', err);
      }
    }

    // If browser does not support programmatic beforeinstallprompt (e.g. iOS Safari)
    openModal();
  }

  // Fast trigger when prompt is ready
  function scheduleQuickBanner() {
    if (isRunningStandalone() || localStorage.getItem('hg_pwa_installed') === 'true' || isDismissedRecently()) {
      return;
    }
    setTimeout(() => {
      showBanner();
    }, 1500);
  }

  // Public debug/test trigger
  window.showHarshGuruJiInstallBanner = function () {
    showBanner();
  };

  // Main init routine
  function init() {
    ensureManifest();
    registerServiceWorker();

    // If already installed or running as standalone app, don't show banner
    if (isRunningStandalone()) {
      return;
    }

    if (localStorage.getItem('hg_pwa_installed') === 'true') {
      return;
    }

    if (isDismissedRecently()) {
      return;
    }

    // Check if test parameter is passed for immediate preview (?test_install=1)
    const isTestMode = new URLSearchParams(window.location.search).has('test_install');
    const delay = isTestMode ? 500 : DISPLAY_DELAY_MS;

    setTimeout(() => {
      // Double check before showing
      if (!isRunningStandalone() && localStorage.getItem('hg_pwa_installed') !== 'true') {
        showBanner();
      }
    }, delay);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
