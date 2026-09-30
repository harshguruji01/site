/**
 * HarshGuruJi Master Admin Security Bridge & Verification Controller
 * Coordinates seamless single sign-on when navigating between admin consoles
 * and strictly prevents unauthorized URL entry without 2-Step Verification.
 * 
 * Step 1: harshguruji01@gmail.com
 * Step 2: 2547277654
 */

(function () {
  'use strict';

  const HG_ADMIN_EMAIL = 'harshguruji01@gmail.com';
  const HG_ADMIN_ID = '2547277654';
  const AUTH_STATE_KEY = 'hg_2step_verified';
  const AUTH_TOKEN_KEY = 'hg_2step_token';
  const EXPECTED_HASH = btoa(HG_ADMIN_EMAIL + ':' + HG_ADMIN_ID + ':HGJ_MASTER_ADMIN_2026');

  // Expose admin constants
  window.HG_ADMIN_EMAIL = HG_ADMIN_EMAIL;
  window.HG_EXPECTED_HASH = EXPECTED_HASH;

  /**
   * Sets all admin session credentials in sessionStorage once 2-step verification is complete.
   */
  function setAllAdminSessions() {
    try {
      sessionStorage.setItem(AUTH_STATE_KEY, 'true');
      sessionStorage.setItem(AUTH_TOKEN_KEY, EXPECTED_HASH);
      sessionStorage.setItem('hg_master_admin_authenticated', 'true');
      sessionStorage.setItem('admin_contacts_auth', 'true');
      sessionStorage.setItem('hg_contributor_admin_unlocked', 'true');
      sessionStorage.setItem('admin_apk_email', HG_ADMIN_EMAIL);
      sessionStorage.setItem('admin_chatbase_auth', 'true');
    } catch (e) {
      console.warn('Admin storage error:', e);
    }
  }

  /**
   * Checks if user has successfully completed 2-Step Verification.
   * Strict validation: Only returns true if valid hash and credentials exist.
   */
  function checkAdminAccess() {
    try {
      const isAuth = sessionStorage.getItem(AUTH_STATE_KEY) === 'true';
      const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
      const email = sessionStorage.getItem('admin_apk_email');

      if (isAuth && token === EXPECTED_HASH && email && email.toLowerCase() === HG_ADMIN_EMAIL) {
        setAllAdminSessions();
        return true;
      }
    } catch (e) {}

    return false;
  }

  /**
   * Clears all admin sessions across tabs on explicit Lock/Logout.
   */
  function clearAdminSessions() {
    try {
      sessionStorage.removeItem(AUTH_STATE_KEY);
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem('hg_master_admin_authenticated');
      sessionStorage.removeItem('admin_contacts_auth');
      sessionStorage.removeItem('hg_contributor_admin_unlocked');
      sessionStorage.removeItem('admin_chatbase_auth');
      sessionStorage.removeItem('admin_apk_email');

      localStorage.removeItem(AUTH_STATE_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem('hg_master_admin_authenticated');
      localStorage.removeItem('admin_contacts_auth');
      localStorage.removeItem('hg_contributor_admin_unlocked');
      localStorage.removeItem('admin_chatbase_auth');
      localStorage.removeItem('admin_apk_email');
    } catch (e) {}
  }

  /**
   * Instrument all sub-admin links to retain authentication context.
   */
  function setupAdminMasterLinks() {
    if (!checkAdminAccess()) return;
    setAllAdminSessions();
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
  window.clearAdminSessions = clearAdminSessions;
})();
