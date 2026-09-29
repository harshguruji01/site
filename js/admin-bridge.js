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

  const HG_ADMIN_PERSIST_KEY = 'hg_master_admin_authenticated';
  const HG_ADMIN_TIMESTAMP_KEY = 'hg_admin_auth_timestamp';
  const HG_ADMIN_SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

  /**
   * Sets all admin session credentials in sessionStorage AND localStorage for seamless multi-tab access.
   */
  function setAllAdminSessions() {
    try {
      sessionStorage.setItem('hg_master_admin_authenticated', 'true');
      sessionStorage.setItem('admin_contacts_auth', 'true');
      sessionStorage.setItem('hg_contributor_admin_unlocked', 'true');
      sessionStorage.setItem('admin_apk_email', HG_ADMIN_EMAIL);
      sessionStorage.setItem('admin_chatbase_auth', 'true');

      // Persistent cross-tab storage
      localStorage.setItem(HG_ADMIN_PERSIST_KEY, 'true');
      localStorage.setItem('admin_chatbase_auth', 'true');
      localStorage.setItem('admin_contacts_auth', 'true');
      localStorage.setItem('hg_contributor_admin_unlocked', 'true');
      localStorage.setItem('admin_apk_email', HG_ADMIN_EMAIL);
      localStorage.setItem(HG_ADMIN_TIMESTAMP_KEY, Date.now().toString());
    } catch (e) {
      console.warn('Admin storage error:', e);
    }
  }

  /**
   * Called from admin pages once unlocked.
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
                         href.includes('admin-requests') ||
                         href.includes('admin.html');

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

    // Capture mousedown, touchstart, and click
    document.addEventListener('mousedown', function (e) {
      const link = e.target.closest('a');
      if (link) prepareLink(link);
    }, true);

    document.addEventListener('touchstart', function (e) {
      const link = e.target.closest('a');
      if (link) prepareLink(link);
    }, { capture: true, passive: true });

    document.addEventListener('click', function (e) {
      const link = e.target.closest('a');
      if (link) prepareLink(link);
    }, true);
  }

  /**
   * Checks if the user should be granted immediate admin access:
   * 1. Already authenticated in this browser tab session or localStorage.
   * 2. Navigated from any admin page via one-time bridge token.
   * 3. Referrer from any verified admin page.
   */
  function checkAdminAccess() {
    // 1. Check tab session
    if (sessionStorage.getItem('hg_master_admin_authenticated') === 'true' ||
        sessionStorage.getItem('admin_chatbase_auth') === 'true' ||
        sessionStorage.getItem('admin_contacts_auth') === 'true' ||
        sessionStorage.getItem('hg_contributor_admin_unlocked') === 'true' ||
        sessionStorage.getItem('admin_apk_email') === HG_ADMIN_EMAIL) {
      setAllAdminSessions();
      return true;
    }

    // 2. Check persistent cross-tab localStorage
    try {
      const isStoredAuth = localStorage.getItem(HG_ADMIN_PERSIST_KEY) === 'true' ||
                           localStorage.getItem('admin_chatbase_auth') === 'true' ||
                           localStorage.getItem('admin_contacts_auth') === 'true' ||
                           localStorage.getItem('admin_apk_email') === HG_ADMIN_EMAIL;
      if (isStoredAuth) {
        setAllAdminSessions();
        return true;
      }
    } catch (e) {}

    // 3. Check for active bridge token in URL or localStorage
    const params = new URLSearchParams(window.location.search);
    const bridgeParam = params.get('admin_bridge');
    if (bridgeParam) {
      setAllAdminSessions();
      return true;
    }

    try {
      const rawBridge = localStorage.getItem(HG_BRIDGE_STORAGE_KEY);
      if (rawBridge) {
        const data = JSON.parse(rawBridge);
        const isFresh = (Date.now() - (data.created || 0)) < 300000; // 5-minute window
        if (isFresh) {
          setAllAdminSessions();
          return true;
        }
      }
    } catch (e) {}

    // 4. Referrer fallback check across all admin subpages
    if (document.referrer && (
      document.referrer.includes('admin') ||
      document.referrer.includes('chatbase')
    )) {
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
    setupAdminMasterLinks();
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
      localStorage.removeItem(HG_ADMIN_PERSIST_KEY);
      localStorage.removeItem(HG_ADMIN_TIMESTAMP_KEY);
      localStorage.removeItem('admin_apk_email');
      localStorage.removeItem(HG_BRIDGE_STORAGE_KEY);
    } catch (e) {}
  }

  // Auto-listen to bridge links if already authenticated
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
      if (checkAdminAccess()) {
        setupAdminMasterLinks();
      }
    });
  }

  // Export functions to global window object
  window.setAllAdminSessions = setAllAdminSessions;
  window.setupAdminMasterLinks = setupAdminMasterLinks;
  window.checkAdminAccess = checkAdminAccess;
  window.grantDirectAdminAccess = grantDirectAdminAccess;
  window.clearAdminSessions = clearAdminSessions;
})();
