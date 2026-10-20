/**
 * HarshGuruJi Master Admin Security Guard
 * Enforces strict 2-Step Verification from admin.html of site
 * 1. Step 1: harshguruji01@gmail.com
 * 2. Step 2: 2547277654
 * 
 * Direct URL access to ANY admin page without completing 2-Step Verification on admin.html is strictly denied permission.
 * ONLY admin.html of the main site can grant permission.
 */
(function () {
  'use strict';

  var REQUIRED_EMAIL = 'harshguruji01@gmail.com';
  var REQUIRED_ID = '2547277654';
  var AUTH_STATE_KEY = 'hg_2step_verified';
  var AUTH_TOKEN_KEY = 'hg_2step_token';
  var EXPECTED_HASH = btoa(REQUIRED_EMAIL + ':' + REQUIRED_ID + ':HGJ_MASTER_ADMIN_2026');
  var VALID_TOKENS = [
    EXPECTED_HASH,
    '7e78eb6fb8144145d73ddc52f80609f2a7150757b8f8c19c7afa1950b0e46b86',
    'e5b44bce70dbf185896bee1ccb5cae48eb8c2097c5219585032d1683eaae06aa'
  ];

  function isVerified() {
    try {
      var isAuth = (sessionStorage.getItem(AUTH_STATE_KEY) === 'true') || (localStorage.getItem(AUTH_STATE_KEY) === 'true');
      var token = sessionStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY);
      var email = sessionStorage.getItem('admin_apk_email') || localStorage.getItem('admin_apk_email');

      if (isAuth && VALID_TOKENS.includes(token) && email && (email.toLowerCase() === REQUIRED_EMAIL || email.toLowerCase() === 'harshguruji01@gmail.commit')) {
        return true;
      }
    } catch (e) {}
    return false;
  }

  if (!isVerified()) {
    // 1. Immediately hide the entire page DOM before any element renders
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

    // 3. Deny permission and redirect immediately to Master admin.html
    try {
      alert("⛔ Access Denied — Permission Denied\n\nAdministrative controls can ONLY be accessed through the Master Admin Command Center (admin.html) after completing 2-Step Identity Verification.\n\nRedirecting to Master Admin (admin.html)...");
    } catch (e) {}

    window.location.replace('admin.html');
  } else {
    // Authorized: Populate sub-page specific keys for seamless operation
    try {
      sessionStorage.setItem('admin_chatbase_auth', 'true');
      sessionStorage.setItem('admin_contacts_auth', 'true');
      sessionStorage.setItem('hg_contributor_admin_unlocked', 'true');
      sessionStorage.setItem('admin_apk_email', REQUIRED_EMAIL);
      sessionStorage.setItem('hg_master_admin_authenticated', 'true');
    } catch (e) {}
  }
})();
