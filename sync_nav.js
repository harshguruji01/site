const fs = require('fs');
const path = require('path');

// The ultimate responsive navbar with Loading state, Mobile Profile in menu, and Desktop Profile
const navbarHTML = `
<nav class="premium-navbar" aria-label="Main Navigation">
  <div class="nav-container">
    <!-- Mobile Hamburger -->
    <button class="hamburger" aria-label="Toggle Menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>

    <!-- Logo -->
    <a href="index.html" class="nav-logo" aria-label="HarshGuruJi Home">
      <img src="logo.png" alt="HarshGuruJi Logo" style="height: 35px; width: auto; margin-right: 8px;" /> <span class="nav-brand-text">HarshGuruJi</span>
    </a>

    <!-- Center Menu -->
    <ul class="nav-menu" id="nav-menu">
      <!-- Mobile Auth Item (Hidden on Desktop) -->
      <li class="nav-item mobile-auth-item" id="mobile-auth-item" style="display: none; padding: 1rem; border-bottom: 1px solid var(--nav-border-dark);">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <img src="" alt="Profile" id="mobile-user-avatar" style="width: 40px; height: 40px; border-radius: 50%;">
          <div>
            <div id="mobile-user-name" style="font-weight: 700; color: white;">User</div>
            <a href="dashboard.html" style="font-size: 0.8rem; color: var(--store-primary); text-decoration: none;">View Dashboard</a>
          </div>
        </div>
      </li>

      <li class="nav-item">
        <a href="index.html" class="nav-link">Home</a>
      </li>
      <li class="nav-item">
        <a href="daily-special.html" class="nav-link">Daily Special</a>
      </li>
      <li class="nav-item">
        <a href="store.html" class="nav-link">Store</a>
      </li>
      <li class="nav-item">
        <a href="contributor.html" class="nav-link">Contributors</a>
      </li>
      <li class="nav-item has-mega-menu">
        <a href="#" class="nav-link" aria-haspopup="true" aria-expanded="false">
          Categories <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-top:2px;"><path d="M6 9l6 6 6-6"/></svg>
        </a>
        <div class="mega-menu" aria-label="Categories Dropdown">
          <div class="mega-menu-container">
            <!-- Column 1: Education & Learning -->
            <div class="mega-column">
              <div class="mega-column-title">🎓 Education</div>
              <ul>
                <li><a href="#" class="mega-link">HTML & CSS</a></li>
                <li><a href="#" class="mega-link">JavaScript</a></li>
                <li><a href="#" class="mega-link">Python & Java</a></li>
                <li><a href="#" class="mega-link">C / C++</a></li>
                <li><a href="#" class="mega-link">AI & Machine Learning</a></li>
                <li><a href="#" class="mega-link">Cyber Security</a></li>
              </ul>
              <div class="mega-column-title" style="margin-top: 1.5rem;">📚 Learning</div>
              <ul>
                <li><a href="#" class="mega-link">Courses & Tutorials</a></li>
                <li><a href="#" class="mega-link">Notes & Cheat Sheets</a></li>
                <li><a href="#" class="mega-link">Interview Questions</a></li>
                <li><a href="#" class="mega-link">Roadmaps</a></li>
              </ul>
            </div>

            <!-- Column 2: Free Tools & Utilities -->
            <div class="mega-column">
              <div class="mega-column-title">🛠️ Free Tools</div>
              <ul>
                <li><a href="#" class="mega-link">Image Compressor</a></li>
                <li><a href="#" class="mega-link">PDF Tools</a></li>
                <li><a href="#" class="mega-link">QR & Password Generator</a></li>
                <li><a href="#" class="mega-link">Color Picker</a></li>
                <li><a href="#" class="mega-link">JSON Formatter</a></li>
                <li><a href="#" class="mega-link">Base64 Tool</a></li>
                <li><a href="#" class="mega-link">Text Compare</a></li>
                <li><a href="#" class="mega-link">Unit Converter & Calculator</a></li>
              </ul>
            </div>

            <!-- Column 3: Useful Websites -->
            <div class="mega-column">
              <div class="mega-column-title">🌐 Useful Websites</div>
              <ul>
                <li><a href="https://aistudio.google.com" target="_blank" class="mega-link">Google AI Studio</a></li>
                <li><a href="https://github.com" target="_blank" class="mega-link">GitHub</a></li>
                <li><a href="https://developer.mozilla.org" target="_blank" class="mega-link">MDN Docs</a></li>
                <li><a href="https://w3schools.com" target="_blank" class="mega-link">W3Schools</a></li>
                <li><a href="https://stackoverflow.com" target="_blank" class="mega-link">Stack Overflow</a></li>
                <li><a href="https://caniuse.com" target="_blank" class="mega-link">Can I Use</a></li>
                <li><a href="https://codepen.io" target="_blank" class="mega-link">CodePen / JSFiddle</a></li>
                <li><a href="https://photopea.com" target="_blank" class="mega-link">Photopea / Figma</a></li>
                <li><a href="https://remove.bg" target="_blank" class="mega-link">Remove.bg / TinyPNG</a></li>
                <li><a href="https://unsplash.com" target="_blank" class="mega-link">Unsplash / Pexels</a></li>
              </ul>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <!-- Right Side -->
    <div class="nav-right">
      <div class="nav-search">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input type="text" placeholder="Search articles, tools..." aria-label="Search">
      </div>
      
      <!-- AUTH STATE CONTAINER -->
      <div id="auth-container">
        
        <!-- Loading Skeleton (Anti-Flicker) -->
        <div id="auth-loading" class="auth-loading-skeleton"></div>

        <!-- Logged Out State -->
        <a href="login.html" id="btn-login" class="nav-login-btn" style="display: none;">Login</a>
        
        <!-- Logged In State (Desktop) -->
        <div id="user-profile-dropdown" class="profile-dropdown-container" style="display: none;">
          <button class="profile-btn" id="profile-btn" aria-haspopup="true" aria-expanded="false">
            <img src="" alt="Profile" id="nav-user-avatar" class="nav-user-avatar">
            <span id="nav-user-name" class="nav-user-name">User</span>
            <svg class="dropdown-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          
          <div class="profile-dropdown-menu">
            <div class="profile-dropdown-header">
              <strong id="dropdown-user-name">User</strong>
              <span id="dropdown-user-email">user@example.com</span>
            </div>
            <div class="profile-dropdown-divider"></div>
            <a href="dashboard.html" class="profile-dropdown-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> Dashboard</a>
            <a href="profile.html" class="profile-dropdown-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> My Profile</a>
            <a href="settings.html" class="profile-dropdown-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Settings</a>
            <a href="bookmarks.html" class="profile-dropdown-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg> Bookmarks</a>
            <div class="profile-dropdown-divider"></div>
            <button onclick="logoutUser()" class="profile-dropdown-item text-danger" style="width: 100%; text-align: left; background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg> Logout</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>
`;

const files = fs.readdirSync(__dirname);

files.forEach(file => {
  if (file.endsWith('.html')) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace existing <nav class="premium-navbar">...</nav> with the new master navbarHTML
    if (content.includes('<nav class="premium-navbar"')) {
      content = content.replace(/<nav class="premium-navbar"[\s\S]*?<\/nav>/, navbarHTML.trim());
      
      // Ensure <script type="module" src="js/auth.js"></script> is injected before </body> if not present
      if (!content.includes('src="js/auth.js"')) {
        content = content.replace('</body>', '  <script type="module" src="js/auth.js"></script>\n</body>');
      }

      fs.writeFileSync(file, content);
      console.log(`Updated ${file}`);
    }
  }
});
