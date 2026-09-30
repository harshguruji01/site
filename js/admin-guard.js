/**
 * HarshGuruJi Master Admin Security Guard
 * Enforces strict 2-Step Verification from admin.html
 * 1. Step 1: harshguruji01@gmail.com
 * 2. Step 2: 2547277654
 * 
 * Direct URL access to this page without completing 2-Step Verification on admin.html is strictly forbidden.
 */
(function () {
  'use strict';

  var REQUIRED_EMAIL = 'harshguruji01@gmail.com';
  var REQUIRED_ID = '2547277654';
  var AUTH_STATE_KEY = 'hg_2step_verified';
  var AUTH_TOKEN_KEY = 'hg_2step_token';
  var EXPECTED_HASH = btoa(REQUIRED_EMAIL + ':' + REQUIRED_ID + ':HGJ_MASTER_ADMIN_2026');

  function isVerified() {
    try {
      var isAuth = sessionStorage.getItem(AUTH_STATE_KEY) === 'true';
      var token = sessionStorage.getItem(AUTH_TOKEN_KEY);
      var email = sessionStorage.getItem('admin_apk_email');

      if (isAuth && token === EXPECTED_HASH && email && email.toLowerCase() === REQUIRED_EMAIL) {
        return true;
      }
    } catch (e) {}
    return false;
  }

  if (!isVerified()) {
    // 1. Immediately hide the entire page DOM before browser renders any administrative elements
    if (document.documentElement) {
      document.documentElement.style.display = 'none';
    }

    // 2. Wipe any unauthorized partial session keys
    try {
      sessionStorage.removeItem(AUTH_STATE_KEY);
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem('admin_contacts_auth');
      sessionStorage.removeItem('admin_chatbase_auth');
      sessionStorage.removeItem('hg_contributor_admin_unlocked');
      sessionStorage.removeItem('admin_apk_email');
      sessionStorage.removeItem('hg_master_admin_authenticated');
    } catch (e) {}

    // 3. Block direct entry and redirect immediately to admin.html 2-Step Gate
    var currentFile = window.location.pathname.split('/').pop() || 'admin-dashboard';
    alert("⛔ Access Denied — Direct URL Entry Blocked\n\nThis command console cannot be accessed directly via URL.\nIt is strictly protected and can only be opened from the Master Admin Command Center (admin.html) after completing 2-Step Verification.\n\nRedirecting to Master Admin (admin.html)...");
    
    window.location.replace('admin.html?from=' + encodeURIComponent(currentFile));
  } else {
    // Authorized: Ensure all sub-page specific keys are populated for seamless operation
    try {
      sessionStorage.setItem('admin_chatbase_auth', 'true');
      sessionStorage.setItem('admin_contacts_auth', 'true');
      sessionStorage.setItem('hg_contributor_admin_unlocked', 'true');
      sessionStorage.setItem('admin_apk_email', REQUIRED_EMAIL);
      sessionStorage.setItem('hg_master_admin_authenticated', 'true');
    } catch (e) {}
  }
})();
