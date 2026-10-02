/**
 * ============================================================================
 * WebGuruJi AdShield — AdSense Click-Bombing & Invalid Traffic Protector
 * ============================================================================
 * Prevents invalid clicks, competitor sabotage, and click-bombing attacks on
 * Google AdSense ads by limiting clicks per user/device.
 *
 * Rule:
 *  - Maximum 3 ad clicks allowed within 3 hours.
 *  - If limit is exceeded, all Google Ads are hidden and blocked for 24 hours.
 * ============================================================================
 */
(function() {
  'use strict';

  var CONFIG = {
    maxClicks: 3,            // Max clicks allowed in window
    clickWindowHours: 3,     // Timeframe for tracking clicks (hours)
    banDurationHours: 24,    // Ban duration once limit reached (hours)
    storageKeyClicks: '_wg_ad_clicks',
    storageKeyBan: '_wg_ad_banned_until',
    debug: false             // Set to true in console to view activity
  };

  // Safe Storage Wrapper (handles private browsing / blocked localStorage)
  var Storage = {
    get: function(key) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    },
    set: function(key, val) {
      try {
        localStorage.setItem(key, val);
      } catch (e) {}
    },
    remove: function(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {}
    }
  };

  // Check if current user is under active ban
  function isBanned() {
    var bannedUntil = parseInt(Storage.get(CONFIG.storageKeyBan), 10);
    if (!bannedUntil || isNaN(bannedUntil)) return false;
    if (Date.now() < bannedUntil) {
      return true;
    } else {
      // Ban has expired, clean up
      Storage.remove(CONFIG.storageKeyBan);
      Storage.remove(CONFIG.storageKeyClicks);
      return false;
    }
  }

  // Get active click history (filtered within click window)
  function getRecentClicks() {
    var raw = Storage.get(CONFIG.storageKeyClicks);
    if (!raw) return [];
    try {
      var list = JSON.parse(raw);
      if (!Array.isArray(list)) return [];
      var cutoff = Date.now() - (CONFIG.clickWindowHours * 60 * 60 * 1000);
      return list.filter(function(ts) { return typeof ts === 'number' && ts > cutoff; });
    } catch (e) {
      return [];
    }
  }

  // Save click history
  function saveClicks(clicks) {
    Storage.set(CONFIG.storageKeyClicks, JSON.stringify(clicks));
  }

  // Suppress all ads completely from DOM and memory
  function enforceAdBlock() {
    if (CONFIG.debug) console.warn('[AdShield] User is restricted from viewing ads. Suppressing all ad containers.');

    // 1. Inject blocking stylesheet to instantly hide any current and future ad elements
    var styleId = 'wg-adshield-blocker-css';
    if (!document.getElementById(styleId)) {
      var style = document.createElement('style');
      style.id = styleId;
      style.textContent = [
        '.adsbygoogle,',
        'ins.adsbygoogle,',
        'iframe[id*="google_ads"],',
        'iframe[id*="aswift"],',
        'div[id*="aswift"],',
        '.google-auto-placed,',
        '[id^="google_ads_iframe"],',
        'div[id^="google_ads"] {',
        '  display: none !important;',
        '  visibility: hidden !important;',
        '  pointer-events: none !important;',
        '  width: 0 !important;',
        '  height: 0 !important;',
        '  max-height: 0 !important;',
        '  overflow: hidden !important;',
        '  opacity: 0 !important;',
        '}'
      ].join('\n');
      (document.head || document.documentElement).appendChild(style);
    }

    // 2. Overwrite adsbygoogle push queue so no ad requests are sent
    try {
      window.adsbygoogle = {
        loaded: true,
        push: function() {
          // Block ad push
          if (CONFIG.debug) console.log('[AdShield] adsbygoogle.push() blocked.');
        }
      };
    } catch (e) {}

    // 3. Remove all existing ad containers from the DOM
    function purgeAdElements() {
      var selectors = [
        'ins.adsbygoogle',
        '.google-auto-placed',
        'iframe[id*="google_ads"]',
        'iframe[id*="aswift"]',
        'div[id*="aswift"]'
      ];
      selectors.forEach(function(sel) {
        var elements = document.querySelectorAll(sel);
        elements.forEach(function(el) {
          try {
            el.innerHTML = '';
            el.remove();
          } catch (e) {
            el.style.display = 'none';
          }
        });
      });
    }

    purgeAdElements();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', purgeAdElements);
    }
    window.addEventListener('load', purgeAdElements);

    // 4. MutationObserver to catch auto ads if they try to mount dynamically
    if (window.MutationObserver) {
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
          m.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // ELEMENT_NODE
              if (
                node.classList && (node.classList.contains('adsbygoogle') || node.classList.contains('google-auto-placed')) ||
                (node.tagName === 'IFRAME' && (node.id.indexOf('google_ads') !== -1 || node.id.indexOf('aswift') !== -1))
              ) {
                try { node.remove(); } catch(e) { node.style.display = 'none'; }
              }
            }
          });
        });
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  // Trigger Ban when threshold is exceeded
  function triggerBan() {
    var banUntil = Date.now() + (CONFIG.banDurationHours * 60 * 60 * 1000);
    Storage.set(CONFIG.storageKeyBan, banUntil);
    enforceAdBlock();
    if (CONFIG.debug) {
      console.warn('[AdShield] Protection activated: Click limit exceeded. Ads hidden for ' + CONFIG.banDurationHours + ' hours.');
    }
  }

  // Record an ad click
  function recordAdClick() {
    if (isBanned()) return;

    var clicks = getRecentClicks();
    clicks.push(Date.now());
    saveClicks(clicks);

    if (CONFIG.debug) {
      console.log('[AdShield] Ad click registered (' + clicks.length + '/' + CONFIG.maxClicks + ').');
    }

    if (clicks.length >= CONFIG.maxClicks) {
      triggerBan();
    }
  }

  // --- IMMEDIATE CHECK ---
  if (isBanned()) {
    enforceAdBlock();
  }

  // --- INTERACTION TRACKING (Active Protection) ---
  var isPointerOverAd = false;
  var lastTouchTime = 0;

  function isAdElement(el) {
    if (!el) return false;
    return !!(
      el.closest && (
        el.closest('ins.adsbygoogle') ||
        el.closest('.google-auto-placed') ||
        el.closest('iframe[id*="google_ads"]') ||
        el.closest('iframe[id*="aswift"]') ||
        el.closest('div[id*="aswift"]')
      )
    );
  }

  // Desktop Mouse Events
  document.addEventListener('mouseover', function(e) {
    if (isAdElement(e.target)) {
      isPointerOverAd = true;
    }
  }, true);

  document.addEventListener('mouseout', function(e) {
    if (isAdElement(e.target)) {
      isPointerOverAd = false;
    }
  }, true);

  // Mobile Touch Events
  document.addEventListener('touchstart', function(e) {
    if (isAdElement(e.target)) {
      isPointerOverAd = true;
      lastTouchTime = Date.now();
    }
  }, { passive: true, capture: true });

  // Window Blur Event: Fires when user clicks an external iframe
  window.addEventListener('blur', function() {
    if (isBanned()) return;

    var now = Date.now();
    var touchedRecently = (now - lastTouchTime < 1200);

    if (isPointerOverAd || touchedRecently) {
      recordAdClick();
      isPointerOverAd = false;
      lastTouchTime = 0;
    }
  });

  // Re-focus tracking
  window.addEventListener('focus', function() {
    isPointerOverAd = false;
  });

  // Expose API for inspection / admin testing
  window.AdShield = {
    getStatus: function() {
      var banned = isBanned();
      var clicks = getRecentClicks();
      var bannedUntil = parseInt(Storage.get(CONFIG.storageKeyBan), 10);
      return {
        isBanned: banned,
        clicksInWindow: clicks.length,
        maxAllowed: CONFIG.maxClicks,
        bannedUntil: banned ? new Date(bannedUntil).toLocaleString() : null
      };
    },
    reset: function() {
      Storage.remove(CONFIG.storageKeyBan);
      Storage.remove(CONFIG.storageKeyClicks);
      var el = document.getElementById('wg-adshield-blocker-css');
      if (el) el.remove();
      console.log('[AdShield] Reset complete. Ads will show normally on next refresh.');
    },
    recordClick: function() {
      recordAdClick();
    },
    setDebug: function(enable) {
      CONFIG.debug = !!enable;
    }
  };

})();
