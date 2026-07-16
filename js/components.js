// js/components.js
export function renderSidebar(activePageId) {
  return `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <a href="index.html" class="sidebar-logo">
          <img src="logo.png" alt="HarshGuruJi Logo">
          <span>HarshGuruJi</span>
        </a>
      </div>
      <nav class="nav-links">
        <a href="dashboard.html" class="nav-item ${activePageId === 'dashboard' ? 'active' : ''}">
          <span class="nav-icon">📊</span> <span>Dashboard</span>
        </a>
        <a href="profile.html" class="nav-item ${activePageId === 'profile' ? 'active' : ''}">
          <span class="nav-icon">👤</span> <span>My Profile</span>
        </a>
        <a href="bookmarks.html" class="nav-item ${activePageId === 'bookmarks' ? 'active' : ''}">
          <span class="nav-icon">🔖</span> <span>Bookmarks</span>
        </a>
        <a href="achievements.html" class="nav-item ${activePageId === 'achievements' ? 'active' : ''}">
          <span class="nav-icon">🏆</span> <span>Achievements</span>
        </a>
        <a href="activity.html" class="nav-item ${activePageId === 'activity' ? 'active' : ''}">
          <span class="nav-icon">📈</span> <span>Activity</span>
        </a>
        
        <div class="nav-section-title">PREFERENCES</div>
        
        <a href="settings.html" class="nav-item ${activePageId === 'settings' ? 'active' : ''}">
          <span class="nav-icon">⚙️</span> <span>Settings</span>
        </a>
        <a href="security.html" class="nav-item ${activePageId === 'security' ? 'active' : ''}">
          <span class="nav-icon">🛡️</span> <span>Security</span>
        </a>
        <a href="privacy.html" class="nav-item ${activePageId === 'privacy' ? 'active' : ''}">
          <span class="nav-icon">🔒</span> <span>Privacy</span>
        </a>
        <a href="appearance.html" class="nav-item ${activePageId === 'appearance' ? 'active' : ''}">
          <span class="nav-icon">🎨</span> <span>Appearance</span>
        </a>
        <a href="notifications.html" class="nav-item ${activePageId === 'notifications' ? 'active' : ''}">
          <span class="nav-icon">🔔</span> <span>Notifications</span>
        </a>
        <a href="billing.html" class="nav-item ${activePageId === 'billing' ? 'active' : ''}">
          <span class="nav-icon">💳</span> <span>Billing</span>
        </a>
        <a href="support.html" class="nav-item ${activePageId === 'support' ? 'active' : ''}">
          <span class="nav-icon">💬</span> <span>Support</span>
        </a>
      </nav>
    </aside>
  `;
}

export function renderHeader() {
  return `
    <header class="top-header">
      <div class="header-left">
        <button class="mobile-menu-btn" id="mobileMenuBtn">☰</button>
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="Search resources, courses...">
        </div>
      </div>
      <div class="header-actions">
        <button class="action-btn" id="theme-toggle" aria-label="Toggle Theme">🌙</button>
        <button class="action-btn" aria-label="Messages">💬</button>
        <button class="action-btn" aria-label="Notifications">
          🔔<span class="notification-dot"></span>
        </button>
        <div class="profile-dropdown-wrapper">
          <div class="header-avatar" id="headerAvatar">H</div>
          <div class="profile-dropdown" id="profileDropdown">
            <div class="dropdown-header">
              <strong id="dropdownName">User Name</strong>
              <span id="dropdownEmail">user@example.com</span>
            </div>
            <a href="profile.html">My Profile</a>
            <a href="dashboard.html">Dashboard</a>
            <a href="settings.html">Settings</a>
            <a href="billing.html">Billing</a>
            <a href="support.html">Support</a>
            <div class="dropdown-divider"></div>
            <a href="#" id="logoutBtn" style="color: var(--error-color);">Log Out</a>
          </div>
        </div>
      </div>
    </header>
  `;
}

export function initSidebarLogic() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('sidebar');
  
  if (!document.getElementById('sidebarOverlay')) {
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.id = 'sidebarOverlay';
    document.body.appendChild(overlay);
  }
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  if(mobileMenuBtn && sidebar && sidebarOverlay) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.add('active');
      sidebarOverlay.classList.add('active');
    });
    sidebarOverlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
    });
  }

  // Profile Dropdown
  const avatar = document.getElementById('headerAvatar');
  const dropdown = document.getElementById('profileDropdown');
  if (avatar && dropdown) {
    avatar.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !avatar.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  }
}
