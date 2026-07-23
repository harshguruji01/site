const fs = require("fs");
const path = require("path");

const navbarHTML = `
<nav class="premium-navbar" aria-label="Main Navigation">
  <div class="nav-container">
    <button class="hamburger" aria-label="Toggle Menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <a href="index.html" class="nav-logo" aria-label="HarshGuruJi Home">
      <picture>
        <source srcset="logo.webp" type="image/webp">
        <img src="logo.png" alt="HarshGuruJi Logo" style="height:35px;width:auto;margin-right:8px" fetchpriority="high">
      </picture>
      <span class="nav-brand-text">HarshGuruJi</span>
    </a>
    <ul class="nav-menu" id="nav-menu">
      <li class="nav-item mobile-auth-item" id="mobile-auth-item" style="display:none;padding:1rem;border-bottom:1px solid var(--nav-border-dark)">
        <div style="display:flex;align-items:center;gap:1rem">
          <img src="" alt="Profile" id="mobile-user-avatar" style="width:40px;height:40px;border-radius:50%" loading="lazy">
          <div>
            <div id="mobile-user-name" style="font-weight:700;color:#fff">User</div>
            <a href="dashboard.html" style="font-size:.8rem;color:var(--store-primary);text-decoration:none">View Dashboard</a>
          </div>
        </div>
      </li>
      <li class="nav-item"><a href="index.html" class="nav-link">Home</a></li>
      <li class="nav-item"><a href="daily-special.html" class="nav-link">Daily Special</a></li>
      <li class="nav-item"><a href="contributor.html" class="nav-link">Contributors</a></li>
      <li class="nav-item"><a href="store.html" class="nav-link">Store</a></li>
    </ul>
    <div class="nav-right">
      <div class="nav-search">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="M21 21l-4.35-4.35"></path>
        </svg>
        <input type="text" id="site-search" placeholder="Search entire site..." aria-label="Search">
      </div>
      <a href="https://guruai.zapier.app" target="_blank" class="btn btn-ai-nav" style="padding:.4rem .8rem;background:linear-gradient(45deg,var(--accent-primary),var(--accent-secondary));border-radius:50px;color:#fff;font-weight:600;font-size:.85rem;margin-right:1rem;display:flex;align-items:center;gap:.3rem" rel="noopener noreferrer">✦ GuruAI</a>
      <div id="auth-container">
        <div id="auth-loading" class="auth-loading-skeleton"></div>
        <a href="login.html" id="btn-login" class="nav-login-btn" style="display:none">Login</a>
        <div id="user-profile-dropdown" class="profile-dropdown-container" style="display:none">
          <button class="profile-btn" id="profile-btn" aria-haspopup="true" aria-expanded="false">
            <img src="" alt="Profile" id="nav-user-avatar" class="nav-user-avatar" loading="lazy">
            <span id="nav-user-name" class="nav-user-name">User</span>
            <svg class="dropdown-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg>
          </button>
          <div class="profile-dropdown-menu">
            <div class="profile-dropdown-header"><strong id="dropdown-user-name">User</strong> <span id="dropdown-user-email">user@example.com</span></div>
            <a href="dashboard.html" class="profile-dropdown-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> Dashboard</a>
            <a href="profile.html" class="profile-dropdown-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> My Profile</a>
            <a href="settings.html" class="profile-dropdown-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Settings</a>
            <a href="bookmarks.html" class="profile-dropdown-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg> Bookmarks</a>
            <button onclick="logoutUser()" class="profile-dropdown-item text-danger" style="width:100%;text-align:left;background:0 0;border:none;cursor:pointer;font-family:Inter,sans-serif"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg> Logout</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>
`.trim();

const files = fs.readdirSync(__dirname);
let updatedCount = 0;

files.forEach(file => {
  if (file.endsWith(".html")) {
    let content = fs.readFileSync(file, "utf8");
    if (content.includes('<nav class="premium-navbar"')) {
      content = content.replace(/<nav class="premium-navbar"[\s\S]*?<\/nav>/, navbarHTML);
      fs.writeFileSync(file, content, "utf8");
      updatedCount++;
    }
  }
});

console.log(`Successfully updated navbar in ${updatedCount} HTML files.`);