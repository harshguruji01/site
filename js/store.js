/**
 * store.js - HarshGuruJi Store Logic
 * Handles data fetching, searching, filtering, and UI rendering.
 */

// --- DATA ABSTRACTION LAYER ---
// This mock dataset can later be replaced by fetching from an API.
const MOCK_APPS = [
  {
    id: "app-telegram",
    name: "Telegram",
    slug: "telegram",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg",
    description: "Fast messaging app that syncs across all your devices.",
    longDescription: "Telegram is a cloud-based mobile and desktop messaging app with a focus on security and speed. It is free to use and lets you send messages, photos, videos and files of any type.",
    category: "Communication",
    platform: "Android",
    type: "App",
    developer: "Telegram FZ-LLC",
    version: "10.6.1",
    size: "45 MB",
    rating: 4.7,
    tags: ["messaging", "chat", "secure", "social"],
    featured: true,
    trending: true,
    verified: true,
    openSource: false,
    license: "Free",
    updatedAt: "2026-08-01",
    officialUrl: "https://telegram.org/",
    downloadUrl: "https://telegram.org/dl"
  },
  {
    id: "app-vscode",
    name: "Visual Studio Code",
    slug: "vscode",
    icon: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg",
    description: "Code editing. Redefined. Free. Built on open source.",
    longDescription: "Visual Studio Code is a streamlined code editor with support for development operations like debugging, task running, and version control.",
    category: "Development",
    platform: "Windows",
    type: "Software",
    developer: "Microsoft",
    version: "1.90.0",
    size: "95 MB",
    rating: 4.8,
    tags: ["coding", "ide", "editor", "programming"],
    featured: true,
    trending: false,
    verified: true,
    openSource: true,
    license: "Free",
    updatedAt: "2026-07-15",
    officialUrl: "https://code.visualstudio.com/",
    downloadUrl: "https://code.visualstudio.com/Download"
  },
  {
    id: "app-claude",
    name: "Claude",
    slug: "claude",
    icon: "ai.png", // using existing local asset as fallback
    description: "Next generation AI assistant by Anthropic.",
    longDescription: "Claude is an AI assistant created by Anthropic. It is designed to be helpful, honest, and harmless. Use it for writing, analysis, coding, and more.",
    category: "AI",
    platform: "Web",
    type: "AI Tool",
    developer: "Anthropic",
    version: "3.5 Sonnet",
    size: "Online",
    rating: 4.9,
    tags: ["ai", "chatbot", "writing", "coding"],
    featured: true,
    trending: true,
    verified: true,
    openSource: false,
    license: "Freemium",
    updatedAt: "2026-06-20",
    officialUrl: "https://claude.ai",
    downloadUrl: "https://claude.ai"
  },
  {
    id: "app-minecraft",
    name: "Minecraft",
    slug: "minecraft",
    icon: "https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png",
    description: "Explore infinite worlds and build everything from the simplest of homes to the grandest of castles.",
    longDescription: "Minecraft is a sandbox video game developed by Mojang Studios. The game was created by Markus 'Notch' Persson in the Java programming language.",
    category: "Adventure",
    platform: "Windows",
    type: "Game",
    developer: "Mojang Studios",
    version: "1.21",
    size: "500 MB",
    rating: 4.8,
    tags: ["game", "sandbox", "building", "survival"],
    featured: false,
    trending: true,
    verified: true,
    openSource: false,
    license: "Paid",
    updatedAt: "2026-05-10",
    officialUrl: "https://www.minecraft.net/",
    downloadUrl: "https://www.minecraft.net/store"
  },
  {
    id: "app-khan",
    name: "Khan Academy",
    slug: "khan-academy",
    icon: "logo.png", // fallback
    description: "Free, world-class education for anyone, anywhere.",
    longDescription: "Learn for free about math, art, computer programming, economics, physics, chemistry, biology, medicine, finance, history, and more.",
    category: "Learning",
    platform: "Android",
    type: "Education",
    developer: "Khan Academy",
    version: "8.1.0",
    size: "25 MB",
    rating: 4.9,
    tags: ["education", "learning", "school", "math"],
    featured: true,
    trending: false,
    verified: true,
    openSource: false,
    license: "Free",
    updatedAt: "2026-08-05",
    officialUrl: "https://www.khanacademy.org/",
    downloadUrl: "https://play.google.com/store/apps/details?id=org.khanacademy.android"
  },
  {
    id: "app-vlc",
    name: "VLC Media Player",
    slug: "vlc",
    icon: "https://upload.wikimedia.org/wikipedia/commons/3/38/VLC_icon.png",
    description: "VLC is a free and open source cross-platform multimedia player.",
    longDescription: "VLC plays most multimedia files as well as DVDs, Audio CDs, VCDs, and various streaming protocols.",
    category: "Media",
    platform: "Windows",
    type: "Software",
    developer: "VideoLAN",
    version: "3.0.21",
    size: "40 MB",
    rating: 4.6,
    tags: ["video", "audio", "player", "media"],
    featured: false,
    trending: false,
    verified: true,
    openSource: true,
    license: "Free",
    updatedAt: "2026-02-15",
    officialUrl: "https://www.videolan.org/",
    downloadUrl: "https://www.videolan.org/vlc/"
  }
];

// In a real scenario, this would be an API call
async function fetchStoreApps() {
  // Simulate network delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(MOCK_APPS);
    }, 400);
  });
}

// --- STATE MANAGEMENT ---
let allApps = [];
let filteredApps = [];
let displayedApps = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 12;

let currentFilters = {
  search: "",
  category: "All",
  platform: "All",
  license: "All",
  sort: "featured"
};

// --- DOM ELEMENTS ---
const elements = {
  grid: document.getElementById('store-grid'),
  searchInput: document.getElementById('store-search'),
  resultsCount: document.getElementById('results-count'),
  loadMoreBtn: document.getElementById('load-more-btn'),
  sortSelect: document.getElementById('sort-select'),
  filterRadios: document.querySelectorAll('.filter-label input[type="radio"]'),
  quickCatBtns: document.querySelectorAll('.quick-cat-btn'),
  
  // Modal Elements
  modalOverlay: document.getElementById('app-modal-overlay'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  mIcon: document.getElementById('modal-icon'),
  mTitle: document.getElementById('modal-title'),
  mDev: document.getElementById('modal-dev'),
  mChips: document.getElementById('modal-chips'),
  mDesc: document.getElementById('modal-desc'),
  mDownload: document.getElementById('modal-download-btn'),
  mOfficial: document.getElementById('modal-official-btn'),
  mShare: document.getElementById('modal-share-btn'),
  mInfoGrid: document.getElementById('modal-info-grid'),
  
  // Mobile Filter
  mobileFilterBtn: document.getElementById('mobile-filter-btn'),
  sidebar: document.getElementById('store-sidebar'),
  sidebarClose: document.getElementById('sidebar-close')
};

// --- INITIALIZATION ---
async function initStore() {
  if (!elements.grid) return;
  
  showLoading();
  
  try {
    allApps = await fetchStoreApps();
    applyFilters();
    setupEventListeners();
  } catch (error) {
    showError("Failed to load store data. Please try again later.");
    console.error("Store init error:", error);
  }
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
  // Search (Debounced)
  let searchTimeout;
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentFilters.search = e.target.value.toLowerCase().trim();
        applyFilters();
      }, 300);
    });
  }

  // Sidebar Filters
  elements.filterRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const type = e.target.name;
      const value = e.target.value;
      currentFilters[type] = value;
      
      // Sync quick category buttons if category changed
      if (type === 'category') {
        syncQuickCategories(value);
      }
      
      applyFilters();
    });
  });

  // Quick Category Buttons (Hero section)
  elements.quickCatBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const category = e.currentTarget.dataset.cat;
      currentFilters.category = category;
      
      // Sync sidebar radios
      const radio = document.querySelector(`input[name="category"][value="${category}"]`);
      if (radio) radio.checked = true;
      
      applyFilters();
      
      // Scroll to grid smoothly
      document.querySelector('.store-layout').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Sort
  if (elements.sortSelect) {
    elements.sortSelect.addEventListener('change', (e) => {
      currentFilters.sort = e.target.value;
      applyFilters();
    });
  }

  // Load More
  if (elements.loadMoreBtn) {
    elements.loadMoreBtn.addEventListener('click', () => {
      currentPage++;
      renderGrid(true); // append
    });
  }
  
  // Mobile Sidebar Toggle
  if (elements.mobileFilterBtn && elements.sidebar) {
    elements.mobileFilterBtn.addEventListener('click', () => {
      elements.sidebar.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }
  if (elements.sidebarClose && elements.sidebar) {
    elements.sidebarClose.addEventListener('click', () => {
      elements.sidebar.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  
  // Modal Close
  if (elements.modalCloseBtn) {
    elements.modalCloseBtn.addEventListener('click', closeModal);
    elements.modalOverlay.addEventListener('click', (e) => {
      if (e.target === elements.modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }
  
  // Share Button
  if (elements.mShare) {
    elements.mShare.addEventListener('click', async () => {
      const url = window.location.href;
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'HarshGuruJi Store',
            text: 'Check out this app!',
            url: url
          });
        } catch (err) {
          console.error("Share failed:", err);
        }
      } else {
        navigator.clipboard.writeText(url).then(() => {
          alert('Link copied to clipboard!');
        });
      }
    });
  }
}

function syncQuickCategories(category) {
  elements.quickCatBtns.forEach(btn => {
    if (btn.dataset.cat === category) {
      btn.style.background = 'rgba(255, 255, 255, 0.1)';
      btn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    } else {
      btn.style.background = 'transparent';
      btn.style.borderColor = 'var(--store-border)';
    }
  });
}

// --- FILTERING & SORTING ---
function applyFilters() {
  currentPage = 1;
  
  filteredApps = allApps.filter(app => {
    // Search Filter
    if (currentFilters.search) {
      const query = currentFilters.search;
      const matchName = app.name.toLowerCase().includes(query);
      const matchDesc = app.description.toLowerCase().includes(query);
      const matchDev = app.developer.toLowerCase().includes(query);
      const matchTags = app.tags.some(t => t.toLowerCase().includes(query));
      if (!matchName && !matchDesc && !matchDev && !matchTags) return false;
    }
    
    // Category Filter
    if (currentFilters.category !== "All" && currentFilters.category !== "Trending" && currentFilters.category !== "Featured") {
       if (app.category !== currentFilters.category && app.type !== currentFilters.category) return false;
    }
    if (currentFilters.category === "Trending" && !app.trending) return false;
    if (currentFilters.category === "Featured" && !app.featured) return false;
    
    // Platform Filter
    if (currentFilters.platform !== "All") {
      if (app.platform !== currentFilters.platform) return false;
    }
    
    // License Filter
    if (currentFilters.license !== "All") {
      if (currentFilters.license === "Open Source" && !app.openSource) return false;
      if (currentFilters.license === "Free" && app.license !== "Free" && app.license !== "Freemium") return false;
      if (currentFilters.license === "Paid" && app.license !== "Paid") return false;
    }
    
    return true;
  });
  
  // Sorting
  filteredApps.sort((a, b) => {
    switch (currentFilters.sort) {
      case 'latest':
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      case 'rating':
        return b.rating - a.rating;
      case 'az':
        return a.name.localeCompare(b.name);
      case 'za':
        return b.name.localeCompare(a.name);
      case 'featured':
      default:
        // Featured first, then rating
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating;
    }
  });
  
  updateResultsCount();
  renderGrid(false); // replace
}

// --- RENDERING ---
function renderGrid(append = false) {
  if (!elements.grid) return;
  
  if (filteredApps.length === 0) {
    elements.grid.innerHTML = '<div class="store-message">No applications found matching your criteria.<br>Try adjusting your filters or search term.</div>';
    elements.loadMoreBtn.style.display = 'none';
    return;
  }
  
  if (!append) {
    elements.grid.innerHTML = '';
  }
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  displayedApps = filteredApps.slice(0, endIndex);
  
  const appsToRender = append ? displayedApps.slice(startIndex, endIndex) : displayedApps;
  
  appsToRender.forEach((app, index) => {
    const card = document.createElement('div');
    card.className = 'app-card animate-fade-in';
    card.style.animationDelay = `${index * 0.05}s`;
    
    // Build badges
    let verifiedHtml = app.verified ? `<div class="verified-badge">✓ Verified</div>` : '';
    let featuredHtml = app.featured ? `<span class="app-badge" style="color:#ff3366; background: rgba(255, 51, 102, 0.1);">Featured</span>` : '';
    
    card.innerHTML = `
      ${verifiedHtml}
      <div class="app-card-top">
        <img src="${app.icon}" alt="${app.name}" class="app-card-icon" loading="lazy">
        <div class="app-card-info">
          <h3 class="app-card-title">${app.name}</h3>
          <div class="app-card-dev">${app.developer}</div>
          <div class="app-card-rating">
            ★ ${app.rating.toFixed(1)}
          </div>
        </div>
      </div>
      <div class="app-card-desc">
        ${app.description}
      </div>
      <div class="app-card-meta">
        <div class="app-platform">
          ${getPlatformIcon(app.platform)} ${app.platform}
        </div>
        ${featuredHtml || `<span class="app-badge">${app.category}</span>`}
      </div>
    `;
    
    // Event listener to open details
    card.addEventListener('click', () => openAppDetails(app));
    
    elements.grid.appendChild(card);
  });
  
  // Toggle Load More button
  if (elements.loadMoreBtn) {
    elements.loadMoreBtn.style.display = endIndex < filteredApps.length ? 'inline-block' : 'none';
  }
}

function updateResultsCount() {
  if (elements.resultsCount) {
    elements.resultsCount.textContent = `Showing ${filteredApps.length} result${filteredApps.length !== 1 ? 's' : ''}`;
  }
}

function showLoading() {
  if (elements.grid) {
    elements.grid.innerHTML = '<div class="store-message">Loading store applications...</div>';
  }
}

function showError(msg) {
  if (elements.grid) {
    elements.grid.innerHTML = `<div class="store-message" style="color: #ef4444;">${msg}</div>`;
  }
}

// --- MODAL / DETAILS VIEW ---
function openAppDetails(app) {
  if (!elements.modalOverlay) return;
  
  // Populate data
  elements.mIcon.src = app.icon;
  elements.mTitle.textContent = app.name;
  elements.mDev.textContent = app.developer;
  elements.mDesc.textContent = app.longDescription;
  
  // Chips
  let chipsHtml = `
    <span class="app-badge" style="background: rgba(255,255,255,0.1)">${app.category}</span>
    <span class="app-badge" style="background: rgba(255,255,255,0.1)">${getPlatformIcon(app.platform)} ${app.platform}</span>
    <span class="app-badge" style="background: rgba(255,255,255,0.1)">★ ${app.rating.toFixed(1)}</span>
  `;
  if (app.license) {
    chipsHtml += `<span class="app-badge" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">${app.license}</span>`;
  }
  if (app.verified) {
    chipsHtml += `<span class="app-badge" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">✓ Verified Source</span>`;
  }
  elements.mChips.innerHTML = chipsHtml;
  
  // Info Grid
  elements.mInfoGrid.innerHTML = `
    <div class="info-item">
      <div class="info-label">Version</div>
      <div class="info-value">${app.version || 'Varies'}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Size</div>
      <div class="info-value">${app.size || 'Varies'}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Updated</div>
      <div class="info-value">${app.updatedAt ? new Date(app.updatedAt).toLocaleDateString() : 'Unknown'}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Type</div>
      <div class="info-value">${app.type || 'App'}</div>
    </div>
  `;
  
  // Buttons
  elements.mDownload.href = app.downloadUrl || '#';
  elements.mDownload.textContent = app.platform === 'Web' ? 'Open App' : 'Download';
  
  if (app.officialUrl) {
    elements.mOfficial.href = app.officialUrl;
    elements.mOfficial.style.display = 'grid';
  } else {
    elements.mOfficial.style.display = 'none';
  }
  
  // Show modal
  elements.modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Update URL purely for visual/sharing (doesn't trigger reload)
  if (window.history.pushState) {
    window.history.pushState({ path: `store.html?app=${app.slug}` }, '', `store.html?app=${app.slug}`);
  }
}

function closeModal() {
  if (elements.modalOverlay) {
    elements.modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Revert URL
    if (window.history.pushState) {
      window.history.pushState({ path: 'store.html' }, '', 'store.html');
    }
  }
}

// --- UTILS ---
function getPlatformIcon(platform) {
  switch (platform.toLowerCase()) {
    case 'windows': return '🪟';
    case 'android': return '🤖';
    case 'macos':
    case 'mac': return '🍎';
    case 'linux': return '🐧';
    case 'web': return '🌐';
    default: return '📱';
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initStore);
