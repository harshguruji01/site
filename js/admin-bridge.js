/**
 * HarshGuruJi Admin Security Bridge & Access Controller
 * Coordinates seamless single sign-on when navigating from admin.html
 * and enforces Email Password verification for direct URL entries.
 */

(function () {
  const HG_ADMIN_EMAIL = 'harshguruji01@gmail.com';
  const HG_BRIDGE_STORAGE_KEY = 'hg_admin_bridge_token';

  // Expose admin email constant
  window.HG_ADMIN_EMAIL = HG_ADMIN_EMAIL;

  /**
   * Sets all admin session credentials in sessionStorage for current tab.
   */
  function setAllAdminSessions() {
    try {
      sessionStorage.setItem('hg_master_admin_authenticated', 'true');
      sessionStorage.setItem('admin_contacts_auth', 'true');
      sessionStorage.setItem('hg_contributor_admin_unlocked', 'true');
      sessionStorage.setItem('admin_apk_email', HG_ADMIN_EMAIL);
      sessionStorage.setItem('admin_chatbase_auth', 'true');
    } catch (e) {
      console.warn('sessionStorage error:', e);
    }
  }

  /**
   * Called from admin.html once the master admin is unlocked.
   * Keeps sessionStorage updated and dynamically instruments all sub-admin links.
   */
  function setupAdminMasterLinks() {
    setAllAdminSessions();

    function prepareLink(link) {
      if (!link || !link.href) return;
      const href = link.getAttribute('href') || '';
      const isSubAdmin = href.includes('adminapkupload') ||
                         href.includes('admin-contacts') ||
                         href.includes('admincontributors') ||
                         href.includes('admin-chatbase') ||
                         href.includes('admin-requests');

      if (isSubAdmin) {
        const token = 'hg_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
        try {
          localStorage.setItem(HG_BRIDGE_STORAGE_KEY, JSON.stringify({
            token: token,
            created: Date.now()
          }));
        } catch (e) {}

        try {
          const u = new URL(link.href, window.location.href);
          u.searchParams.set('admin_bridge', token);
          link.href = u.toString();
        } catch (e) {}
      }
    }

    // Capture mousedown and click to catch regular clicks, ctrl/cmd clicks, middle clicks, and right clicks
    document.addEventListener('mousedown', function (e) {
      const link = e.target.closest('a');
      if (link) prepareLink(link);
    }, true);

    document.addEventListener('click', function (e) {
      const link = e.target.closest('a');
      if (link) prepareLink(link);
    }, true);
  }

  /**
   * Checks if the user should be granted immediate admin access:
   * 1. Already authenticated in this browser tab session.
   * 2. Navigated from admin.html via one-time bridge token (in URL / localStorage).
   * 3. Same-origin navigation from admin.html (document.referrer).
   * 
   * Returns true if access is granted (no password required).
   * Returns false if this is a direct URL entry requiring password.
   */
  function checkAdminAccess() {
    // 1. Check if already authenticated in this tab session
    if (sessionStorage.getItem('hg_master_admin_authenticated') === 'true' ||
        sessionStorage.getItem('admin_contacts_auth') === 'true' ||
        sessionStorage.getItem('hg_contributor_admin_unlocked') === 'true' ||
        sessionStorage.getItem('admin_chatbase_auth') === 'true' ||
        sessionStorage.getItem('admin_apk_email') === HG_ADMIN_EMAIL) {
      setAllAdminSessions();
      return true;
    }

    // 2. Check for active bridge token from admin.html
    const params = new URLSearchParams(window.location.search);
    const bridgeParam = params.get('admin_bridge');

    let validBridge = false;
    try {
      const rawBridge = localStorage.getItem(HG_BRIDGE_STORAGE_KEY);
      if (rawBridge) {
        const data = JSON.parse(rawBridge);
        const isFresh = (Date.now() - (data.created || 0)) < 60000; // 60-second window
        if (isFresh) {
          if (bridgeParam && bridgeParam === data.token) {
            validBridge = true;
          } else if (document.referrer && document.referrer.includes('admin.html')) {
            validBridge = true;
          }
        }
      }
    } catch (e) {}

    if (validBridge) {
      // Save authenticated session in this tab
      setAllAdminSessions();

      // Clean up token from localStorage and address bar
      try {
        localStorage.removeItem(HG_BRIDGE_STORAGE_KEY);
      } catch (e) {}

      if (bridgeParam) {
        params.delete('admin_bridge');
        const cleanSearch = params.toString() ? '?' + params.toString() : '';
        try {
          window.history.replaceState(null, '', window.location.pathname + cleanSearch + window.location.hash);
        } catch (e) {}
      }

      return true;
    }

    // 3. Referrer fallback check
    if (document.referrer && document.referrer.includes('admin.html')) {
      setAllAdminSessions();
      return true;
    }

    return false;
  }

  /**
   * Called when user enters the correct password on direct URL entry.
   */
  function grantDirectAdminAccess() {
    setAllAdminSessions();
  }

  /**
   * Clears all admin sessions across tabs on explicit Lock/Logout.
   */
  function clearAdminSessions() {
    try {
      sessionStorage.removeItem('hg_master_admin_authenticated');
      sessionStorage.removeItem('admin_contacts_auth');
      sessionStorage.removeItem('hg_contributor_admin_unlocked');
      sessionStorage.removeItem('admin_chatbase_auth');
      sessionStorage.removeItem('admin_apk_email');
      localStorage.removeItem(HG_BRIDGE_STORAGE_KEY);
    } catch (e) {}
  }

  // Export functions to global window object
  window.setupAdminMasterLinks = setupAdminMasterLinks;
  window.checkAdminAccess = checkAdminAccess;
  window.grantDirectAdminAccess = grantDirectAdminAccess;
  window.clearAdminSessions = clearAdminSessions;
})();
