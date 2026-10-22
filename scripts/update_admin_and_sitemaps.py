import os
import re

# 1. Update js/admin-bridge.js
def update_admin_bridge():
    bridge_path = "js/admin-bridge.js"
    with open(bridge_path, "r", encoding="utf-8") as f:
        code = f.read()

    new_bridge = """/**
 * WebGuruJi / HarshGuruJi Master Admin Security Bridge & Verification Controller
 * Enforces 1-Hour Session Security & Gate Pass Authorization across all admin consoles.
 * 
 * Gate Pass Credentials:
 * Email: harshguruji01@gmail.com
 * Code No.: 2547277654
 * Auto-Logout: 1 Hour (3,600,000 ms)
 */

(function () {
  'use strict';

  const HG_ADMIN_EMAIL = 'harshguruji01@gmail.com';
  const HG_ADMIN_ID = '2547277654';
  const AUTH_STATE_KEY = 'hg_2step_verified';
  const AUTH_TOKEN_KEY = 'hg_2step_token';
  const AUTH_TIME_KEY = 'hg_admin_login_time';
  const SESSION_MAX_MS = 60 * 60 * 1000; // 1 hour (3,600,000 ms)
  const EXPECTED_HASH = btoa(HG_ADMIN_EMAIL + ':' + HG_ADMIN_ID + ':HGJ_MASTER_ADMIN_2026');

  window.HG_ADMIN_EMAIL = HG_ADMIN_EMAIL;
  window.HG_EXPECTED_HASH = EXPECTED_HASH;
  window.HG_SESSION_MAX_MS = SESSION_MAX_MS;

  function setAllAdminSessions() {
    try {
      const now = Date.now().toString();
      sessionStorage.setItem(AUTH_STATE_KEY, 'true');
      sessionStorage.setItem(AUTH_TOKEN_KEY, EXPECTED_HASH);
      if (!sessionStorage.getItem(AUTH_TIME_KEY)) {
        sessionStorage.setItem(AUTH_TIME_KEY, now);
      }
      sessionStorage.setItem('hg_master_admin_authenticated', 'true');
      sessionStorage.setItem('admin_contacts_auth', 'true');
      sessionStorage.setItem('hg_contributor_admin_unlocked', 'true');
      sessionStorage.setItem('admin_apk_email', HG_ADMIN_EMAIL);
      sessionStorage.setItem('admin_chatbase_auth', 'true');
    } catch (e) {
      console.warn('Admin storage error:', e);
    }
  }

  function checkAdminAccess() {
    try {
      const isAuth = sessionStorage.getItem(AUTH_STATE_KEY) === 'true';
      const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
      const email = sessionStorage.getItem('admin_apk_email');
      const loginTimeStr = sessionStorage.getItem(AUTH_TIME_KEY);

      if (!isAuth || !token || !email || !loginTimeStr) {
        return false;
      }

      const loginTime = parseInt(loginTimeStr, 10);
      const now = Date.now();
      if (isNaN(loginTime) || (now - loginTime) >= SESSION_MAX_MS) {
        clearAdminSessions();
        return false;
      }

      if (token === EXPECTED_HASH && email.toLowerCase() === HG_ADMIN_EMAIL.toLowerCase()) {
        return true;
      }
    } catch (e) {}

    return false;
  }

  function clearAdminSessions() {
    try {
      sessionStorage.clear();
      localStorage.removeItem(AUTH_STATE_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_TIME_KEY);
      localStorage.removeItem('hg_master_admin_authenticated');
      localStorage.removeItem('admin_contacts_auth');
      localStorage.removeItem('hg_contributor_admin_unlocked');
      localStorage.removeItem('admin_chatbase_auth');
      localStorage.removeItem('admin_apk_email');
    } catch (e) {}
  }

  function setupAdminMasterLinks() {
    if (!checkAdminAccess()) return;
    setAllAdminSessions();
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
      if (checkAdminAccess()) {
        setupAdminMasterLinks();
      }
    });
  }

  window.setAllAdminSessions = setAllAdminSessions;
  window.setupAdminMasterLinks = setupAdminMasterLinks;
  window.checkAdminAccess = checkAdminAccess;
  window.clearAdminSessions = clearAdminSessions;
})();
"""
    with open(bridge_path, "w", encoding="utf-8") as f:
        f.write(new_bridge)
    print("Updated js/admin-bridge.js with 1-hour session limits.")

# 2. Update admin.html
def update_admin_html():
    admin_path = "admin.html"
    with open(admin_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Gate Pass Overlay HTML
    new_gate_html = """  <!-- MASTER ADMIN SECURITY GATE PASS -->
  <div class="gate-overlay" id="security-gate">
    <div class="gate-card">
      <div class="gate-icon">🛡️</div>
      <h2 class="gate-title">Admin Gate Pass Verification</h2>
      <p class="gate-subtitle">Please enter your Master Admin credentials to access the Command Center.<br><span style="color: #f59e0b; font-size: 0.82rem; font-weight: 600;">⏱️ 1-Hour Session (Auto-Logout Enforced)</span></p>

      <!-- Gate Pass Form -->
      <form id="admin-gate-pass-form">
        <div class="gate-form-group">
          <label class="gate-label" for="input-admin-email">Admin Email Address</label>
          <div class="gate-input-wrapper">
            <input 
              type="email" 
              id="input-admin-email" 
              class="gate-input" 
              placeholder="harshguruji01@gmail.com" 
              required 
              autofocus 
              autocomplete="username"
            >
          </div>
        </div>

        <div class="gate-form-group">
          <label class="gate-label" for="input-admin-id">Gate Pass Code No.</label>
          <div class="gate-input-wrapper">
            <input 
              type="password" 
              id="input-admin-id" 
              class="gate-input" 
              placeholder="Enter Code No. (2547277654)" 
              required 
              autocomplete="current-password"
            >
          </div>
          <div class="gate-error" id="gate-error-msg" style="display: none;"></div>
        </div>

        <button type="submit" class="gate-btn" id="btn-submit-gate-pass">
          <span>Verify Gate Pass &amp; Unlock</span>
          <span>🔓</span>
        </button>
      </form>

      <div style="margin-top: 1.5rem; border-top: 1px solid var(--border); padding-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
        <a href="index.html" style="color: var(--text-muted); font-size: 0.82rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem;">
          <span>&larr;</span> Back to Public Site
        </a>
        <span style="font-size: 0.75rem; color: #94a3b8;">Policy: Auto-Logout every 1 Hour</span>
      </div>
    </div>
  </div>"""

    # Replace old gate HTML
    gate_start = html.find('<!-- 2-STEP SECURITY VERIFICATION GATE -->')
    if gate_start == -1:
        gate_start = html.find('<div class="gate-overlay" id="security-gate">')
    gate_end = html.find('<div id="admin-dashboard">')

    if gate_start != -1 and gate_end != -1:
        html = html[:gate_start] + new_gate_html + "\n\n  " + html[gate_end:]
        print("Replaced Gate Pass markup in admin.html")
    else:
        print("Could not locate gate bounds in admin.html")

    # Add countdown pill to navbar if not already there
    countdown_pill = """          <div class="realtime-clock-pill" id="session-countdown-pill" style="border: 1px solid rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.12); color: #fca5a5; display: inline-flex; align-items: center; gap: 6px; padding: 0.4rem 0.8rem; border-radius: 999px; font-size: 0.82rem;">
            <span>⏳</span>
            <span>Auto-Logout:</span>
            <span id="session-countdown" style="font-weight: 700; color: #fff; font-family: 'JetBrains Mono', monospace;">60:00</span>
          </div>"""

    if 'id="session-countdown-pill"' not in html:
        live_clock_marker = '<div class="realtime-clock-pill">'
        if live_clock_marker in html:
            html = html.replace(live_clock_marker, countdown_pill + "\n          " + live_clock_marker, 1)
            print("Added session countdown pill to admin navbar.")

    # Now replace the script gate controller
    new_script_controller = """    // Master Admin Security Gate & 1-Hour Auto-Logout Controller
    const REQUIRED_EMAIL = "harshguruji01@gmail.com";
    const REQUIRED_ID = "2547277654";
    const AUTH_STATE_KEY = "hg_2step_verified";
    const AUTH_TOKEN_KEY = "hg_2step_token";
    const AUTH_TIME_KEY = "hg_admin_login_time";
    const SESSION_MAX_MS = 60 * 60 * 1000; // 1 hour (3,600,000 ms)
    const EXPECTED_HASH = btoa(REQUIRED_EMAIL + ":" + REQUIRED_ID + ":HGJ_MASTER_ADMIN_2026");

    let sessionCountdownInterval = null;

    function clearAllAdminAuth() {
      try {
        sessionStorage.clear();
        localStorage.removeItem(AUTH_STATE_KEY);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_TIME_KEY);
        localStorage.removeItem('admin_apk_email');
        localStorage.removeItem('hg_master_admin_authenticated');
      } catch(e) {}
    }

    function checkActiveSession() {
      try {
        const isAuth = sessionStorage.getItem(AUTH_STATE_KEY) === 'true';
        const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
        const email = sessionStorage.getItem('admin_apk_email');
        const loginTimeStr = sessionStorage.getItem(AUTH_TIME_KEY);

        if (!isAuth || !token || !email || !loginTimeStr) {
          return false;
        }

        const loginTime = parseInt(loginTimeStr, 10);
        const now = Date.now();
        if (isNaN(loginTime) || (now - loginTime) >= SESSION_MAX_MS) {
          clearAllAdminAuth();
          return false;
        }

        if (token === EXPECTED_HASH && email.toLowerCase() === REQUIRED_EMAIL.toLowerCase()) {
          return true;
        }
      } catch(e) {}
      return false;
    }

    // Application Master State
    let storeAppsData = [];
    let booksData = [];
    let messagesData = [];
    let contributorsData = [];
    let usersData = [];

    // Filter states
    let currentMasterTab = 'store';
    let storeCatFilter = 'ALL';
    let booksClassFilter = 'ALL';
    let messagesFilter = 'ALL';
    let contribFilter = 'ALL';
    let userFilter = 'ALL';

    document.addEventListener('DOMContentLoaded', () => {
      initSecurityGate();
      startLiveClock();
      bindMasterModalEvents();
    });

    function initSecurityGate() {
      const securityGate = document.getElementById('security-gate');
      const adminDashboard = document.getElementById('admin-dashboard');
      const gateForm = document.getElementById('admin-gate-pass-form');
      const emailInput = document.getElementById('input-admin-email');
      const idInput = document.getElementById('input-admin-id');
      const errorEl = document.getElementById('gate-error-msg');
      const btnLock = document.getElementById('btn-lock-session');

      // Check if there is an active session under 1 hour
      if (checkActiveSession()) {
        unlockDashboard();
      } else {
        // Enforce Gate Pass on every fresh visit / expired session
        clearAllAdminAuth();
        securityGate.style.display = 'flex';
        adminDashboard.style.display = 'none';
      }

      // Handle Gate Pass Submission
      if (gateForm) {
        gateForm.addEventListener('submit', (e) => {
          e.preventDefault();
          if (errorEl) errorEl.style.display = 'none';
          const enteredEmail = (emailInput.value || '').trim().toLowerCase();
          const enteredId = (idInput.value || '').trim();

          if (enteredEmail === REQUIRED_EMAIL.toLowerCase() && enteredId === REQUIRED_ID) {
            // Success! Store session with current timestamp
            const now = Date.now();
            sessionStorage.setItem(AUTH_STATE_KEY, 'true');
            sessionStorage.setItem(AUTH_TOKEN_KEY, EXPECTED_HASH);
            sessionStorage.setItem(AUTH_TIME_KEY, now.toString());
            sessionStorage.setItem('admin_apk_email', REQUIRED_EMAIL);
            sessionStorage.setItem('hg_master_admin_authenticated', 'true');
            sessionStorage.setItem('admin_chatbase_auth', 'true');
            sessionStorage.setItem('admin_contacts_auth', 'true');
            sessionStorage.setItem('hg_contributor_admin_unlocked', 'true');

            if (window.setAllAdminSessions) window.setAllAdminSessions();
            if (window.setupAdminMasterLinks) window.setupAdminMasterLinks();

            unlockDashboard();

            // Handle query redirect if present
            const fromParam = new URLSearchParams(window.location.search).get('from');
            if (fromParam) {
              if (fromParam === 'adminbooks.html' || fromParam === 'books') {
                setTimeout(() => openMasterModal('books'), 400);
              } else if (fromParam === 'adminapkupload.html' || fromParam === 'store') {
                setTimeout(() => openMasterModal('store'), 400);
              } else if (fromParam === 'admin-contacts.html' || fromParam === 'messages') {
                setTimeout(() => openMasterModal('messages'), 400);
              } else if (fromParam === 'admincontributors.html' || fromParam === 'contributors') {
                setTimeout(() => openMasterModal('contributors'), 400);
              } else if (fromParam === 'admin-chatbase.html' || fromParam === 'chatbase') {
                setTimeout(() => openMasterModal('goldentick'), 400);
              }
            }
          } else {
            if (errorEl) {
              errorEl.textContent = '❌ Access Denied: Invalid Email or Gate Pass Code No.';
              errorEl.style.display = 'block';
            }
            if (idInput) {
              idInput.value = '';
              idInput.focus();
            }
          }
        });
      }

      // Lock / Logout button
      if (btnLock) {
        btnLock.addEventListener('click', () => {
          triggerSessionLogout('Session manually locked. Enter Gate Pass to re-login.');
        });
      }

      function unlockDashboard() {
        securityGate.style.display = 'none';
        adminDashboard.style.display = 'block';
        startLiveSessionCountdown();
        if (window.setupAdminMasterLinks) window.setupAdminMasterLinks();
        loadAllMasterData();
      }

      function startLiveSessionCountdown() {
        if (sessionCountdownInterval) clearInterval(sessionCountdownInterval);
        const countdownEl = document.getElementById('session-countdown');

        function update() {
          const loginTime = parseInt(sessionStorage.getItem(AUTH_TIME_KEY) || '0', 10);
          const now = Date.now();
          const elapsed = now - loginTime;
          const remaining = SESSION_MAX_MS - elapsed;

          if (remaining <= 0) {
            clearInterval(sessionCountdownInterval);
            triggerSessionLogout('⚠️ 1 Hour Session Expired: Auto-logout triggered. Please enter Gate Pass to log in again.');
            return;
          }

          const totalSeconds = Math.floor(remaining / 1000);
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = totalSeconds % 60;
          if (countdownEl) {
            countdownEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
          }
        }

        update();
        sessionCountdownInterval = setInterval(update, 1000);
      }

      function triggerSessionLogout(reason) {
        if (sessionCountdownInterval) clearInterval(sessionCountdownInterval);
        clearAllAdminAuth();
        if (window.clearAdminSessions) window.clearAdminSessions();
        adminDashboard.style.display = 'none';
        securityGate.style.display = 'flex';
        if (idInput) idInput.value = '';
        if (errorEl) {
          errorEl.textContent = reason || '1 hour auto-logout triggered. Enter Gate Pass to log in again.';
          errorEl.style.display = 'block';
        }
      }

      // Automatically verify remaining time on window focus and tab visibility change
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && adminDashboard.style.display === 'block') {
          if (!checkActiveSession()) {
            triggerSessionLogout('⚠️ 1 Hour Session Expired: Auto-logout triggered. Please re-enter your Gate Pass.');
          }
        }
      });
      window.addEventListener('focus', () => {
        if (adminDashboard.style.display === 'block') {
          if (!checkActiveSession()) {
            triggerSessionLogout('⚠️ 1 Hour Session Expired: Auto-logout triggered. Please re-enter your Gate Pass.');
          }
        }
      });
    }"""

    # Replace from `// CREDENTIALS REQUIRED BY MASTER SECURITY GATE` to `// 2. Bind Master Modal`
    ctrl_start = html.find('// CREDENTIALS REQUIRED BY MASTER SECURITY GATE')
    if ctrl_start == -1:
        ctrl_start = html.find('const REQUIRED_EMAIL = "harshguruji01@gmail.com";')
    ctrl_end = html.find('// 2. Bind Master Modal & Stat Tile Click Events')

    if ctrl_start != -1 and ctrl_end != -1:
        html = html[:ctrl_start] + new_script_controller + "\n\n    " + html[ctrl_end:]
        print("Replaced script controller in admin.html with 1-Hour Auto Logout & Gate Pass.")
    else:
        print("Could not find script controller bounds in admin.html")

    with open(admin_path, "w", encoding="utf-8") as f:
        f.write(html)
    print("Saved updated admin.html successfully.")

# 3. Generate sitemap.xml with all 65 HTML pages
def generate_complete_sitemap():
    sitemap_path = "sitemap.xml"
    origin = "https://webguruji.online"

    html_files = []
    for root, dirs, files in os.walk('.'):
        if any(p in root for p in ['.git', '.agents', 'node_modules']):
            continue
        for f in files:
            if f.endswith('.html'):
                p = os.path.normpath(os.path.join(root, f))
                rel = p.replace('\\', '/')
                if rel.startswith('./'): rel = rel[2:]
                html_files.append(rel)

    html_files = sorted(list(set(html_files)))
    print(f"Generating sitemap for {len(html_files)} HTML files...")

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"',
        '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9',
        '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd',
        '        http://www.google.com/schemas/sitemap-image/1.1',
        '        http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd">'
    ]

    # Add homepage root
    lines.append('  <url>')
    lines.append(f'    <loc>{origin}/</loc>')
    lines.append('    <lastmod>2026-10-16</lastmod>')
    lines.append('    <changefreq>daily</changefreq>')
    lines.append('    <priority>1.0</priority>')
    lines.append('    <image:image>')
    lines.append(f'      <image:loc>{origin}/logo-512.png</image:loc>')
    lines.append('      <image:title>WebGuruJi Official Platform &amp; Multi-Utility Ecosystem</image:title>')
    lines.append('    </image:image>')
    lines.append('  </url>')

    priority_map = {
        "index.html": ("daily", "1.0"),
        "login.html": ("daily", "0.95"),
        "signup.html": ("daily", "0.90"),
        "store.html": ("daily", "0.95"),
        "store-detail.html": ("daily", "0.90"),
        "books.html": ("daily", "0.95"),
        "learning-hub.html": ("daily", "0.90"),
        "learning.html": ("daily", "0.85"),
        "ai-hub.html": ("daily", "0.90"),
        "ai.html": ("daily", "0.85"),
        "free-tools.html": ("daily", "0.90"),
        "tools.html": ("daily", "0.90"),
        "chat-app.html": ("weekly", "0.90"),
        "chat.html": ("daily", "0.85"),
        "gaming-hub.html": ("weekly", "0.85"),
        "gaming.html": ("weekly", "0.85"),
        "Quiz India/index.html": ("weekly", "0.85"),
        "admin.html": ("weekly", "0.80")
    }

    for file_rel in html_files:
        # URL encode spaces if any
        url_path = file_rel.replace(" ", "%20")
        loc = f"{origin}/{url_path}"

        freq, prio = priority_map.get(file_rel, ("weekly", "0.80"))

        lines.append('  <url>')
        lines.append(f'    <loc>{loc}</loc>')
        lines.append('    <lastmod>2026-10-16</lastmod>')
        lines.append(f'    <changefreq>{freq}</changefreq>')
        lines.append(f'    <priority>{prio}</priority>')
        lines.append('  </url>')

    lines.append('</urlset>')

    with open(sitemap_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print(f"Generated complete sitemap.xml with all {len(html_files) + 1} URLs!")

# 4. Update robots.txt to ensure Googlebot & Google-InspectionTool can index ALL pages
def update_robots_txt():
    robots_path = "robots.txt"
    robots_content = """# ═══════════════════════════════════════════════════════════════════════════
# robots.txt — WebGuruJi / HarshGuruJi Platform Ecosystem (webguruji.online)
# Full Google Search Console (GSC) & search crawler indexing directives
# All public pages, login, store, tools, learning, and hubs fully indexable
# Last Updated: 2026-10-16
# ═══════════════════════════════════════════════════════════════════════════

User-agent: *
Allow: /
Allow: /index.html
Allow: /login.html
Allow: /signup.html
Allow: /forgot-password.html
Allow: /reset-password.html
Allow: /store.html
Allow: /store-detail.html
Allow: /books.html
Allow: /chat.html
Allow: /chat-app.html
Allow: /app.html
Allow: /ads.html
Allow: /free-tools.html
Allow: /tools.html
Allow: /ai-hub.html
Allow: /ai.html
Allow: /gaming-hub.html
Allow: /gaming.html
Allow: /learning-hub.html
Allow: /learning.html
Allow: /education.html
Allow: /technology.html
Allow: /daily-special.html
Allow: /daily-life.html
Allow: /insights.html
Allow: /explore.html
Allow: /owner.html
Allow: /about.html
Allow: /contact.html
Allow: /contributor.html
Allow: /join-contributor.html
Allow: /apply-contributor.html
Allow: /verify-contributor.html
Allow: /dashboard.html
Allow: /settings.html
Allow: /appearance.html
Allow: /privacy-policy.html
Allow: /terms-and-conditions.html
Allow: /cookie.html
Allow: /Quiz India/
Allow: /Quiz%20India/
Allow: /tools/
Allow: /games/
Allow: /learning/
Allow: /admin.html
Allow: /css/
Allow: /js/
Allow: /*.css$
Allow: /*.js$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.webp$
Allow: /*.svg$
Allow: /*.ico$
Allow: /*.woff2$
Allow: /data/apps.json

# Disallow internal backend source code and raw configuration files
Disallow: /backend/
Disallow: /backend_legacy/
Disallow: /oauth/
Disallow: /scripts/
Disallow: /.agents/
Disallow: /.git/
Disallow: /.github/
Disallow: /node_modules/
Disallow: /*.py$
Disallow: /*.sql$
Disallow: /*.md$
Disallow: /*.groovy$

# ── Googlebot Dedicated Directives ─────────────────────────────────────────
User-agent: Googlebot
Allow: /
Allow: /index.html
Allow: /login.html
Allow: /signup.html
Allow: /store.html
Allow: /store-detail.html
Allow: /books.html
Allow: /chat-app.html
Allow: /chat.html
Allow: /free-tools.html
Allow: /tools.html
Allow: /ai-hub.html
Allow: /ai.html
Allow: /gaming-hub.html
Allow: /gaming.html
Allow: /learning-hub.html
Allow: /learning.html
Allow: /Quiz India/
Allow: /Quiz%20India/
Allow: /tools/
Allow: /games/
Allow: /learning/
Allow: /dashboard.html
Allow: /settings.html
Allow: /appearance.html
Allow: /css/
Allow: /js/
Allow: /*.css$
Allow: /*.js$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.webp$
Disallow: /backend/
Disallow: /oauth/
Disallow: /scripts/
Disallow: /.git/

# ── Google Search Console Live Inspection Tool ────────────────────────────
User-agent: Google-InspectionTool
Allow: /
Allow: /index.html
Allow: /login.html
Allow: /signup.html
Allow: /store.html
Allow: /store-detail.html
Allow: /books.html
Allow: /chat.html
Allow: /app.html
Allow: /free-tools.html
Allow: /tools/
Allow: /games/
Allow: /learning/
Allow: /Quiz India/
Allow: /Quiz%20India/
Allow: /dashboard.html
Allow: /settings.html
Allow: /appearance.html
Allow: /css/
Allow: /js/
Allow: /*.css$
Allow: /*.js$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.webp$

# ── Google Images Crawler ─────────────────────────────────────────────────
User-agent: Googlebot-Image
Allow: /
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.webp$

# ── Bingbot Group ─────────────────────────────────────────────────────────
User-agent: Bingbot
Allow: /
Disallow: /backend/
Disallow: /scripts/
Disallow: /.git/

# ── Sitemaps for Google Search Console ────────────────────────────────────
Sitemap: https://webguruji.online/sitemap.xml
Sitemap: https://webguruji.online/sitemap_index.xml
Sitemap: https://webguruji.online/sitemap_store.xml
Sitemap: https://webguruji.online/sitemap_books.xml
Sitemap: https://webguruji.online/sitemap_chat.xml
"""
    with open(robots_path, "w", encoding="utf-8") as f:
        f.write(robots_content)
    print("Updated robots.txt successfully for Google Search Console & Googlebot.")

def main():
    update_admin_bridge()
    update_admin_html()
    generate_complete_sitemap()
    update_robots_txt()
    print("\nAll updates completed successfully!")

if __name__ == "__main__":
    main()
