/**
 * store.js - HarshGuruJi Store Logic (AN1.com Inspired System)
 * Strictly displays only apps published through the Admin Panel (store_apps table).
 * Zero mock apps. 100% database driven.
 */

import { supabase } from './supabase.js';
import { AuthManager } from './auth.js';

// --- SECTIONS CONFIGURATION (MATCHES ADMIN UPLOAD CATEGORIES 1:1) ---
const STORE_SECTIONS = [
  {
    id: "sec-featured",
    title: "Featured & Editor's Choice",
    subtitle: "Curated applications and tools across all platforms",
    icon: "⭐",
    badge: "Featured",
    filterType: "category",
    filterValue: "Featured",
    filterFn: (app) => app.featured === true
  },
  {
    id: "sec-games",
    title: "Games & Entertainment",
    subtitle: "Action, adventure, simulation and modified game releases",
    icon: "🎮",
    badge: "Games",
    filterType: "category",
    filterValue: "Game",
    filterFn: (app) => (app.category || '').toLowerCase() === 'game' || (app.category || '').toLowerCase() === 'games' || (app.type || '').toLowerCase() === 'game' || app.is_mod
  },
  {
    id: "sec-android",
    title: "Android Applications (APK/XAPK)",
    subtitle: "Verified packages for smartphones and tablets",
    icon: "📱",
    badge: "Android",
    filterType: "platform",
    filterValue: "Android",
    filterFn: (app) => (app.platform || '').toLowerCase() === 'android' || (app.app_type || '').toLowerCase() === 'apk' || (app.category || '').toLowerCase() === 'apps'
  },
  {
    id: "sec-windows",
    title: "Windows Software & PC Tools",
    subtitle: "Desktop software, setup installers (.exe, .msi) and tools for PC",
    icon: "💻",
    badge: "Windows",
    filterType: "platform",
    filterValue: "Windows",
    filterFn: (app) => (app.platform || '').toLowerCase() === 'windows' || (app.category || '').toLowerCase() === 'software' || (app.app_type || '').toLowerCase() === 'exe'
  },
  {
    id: "sec-ai",
    title: "AI Tools & Web Applications",
    subtitle: "Smart AI assistants, creative models, and web tools",
    icon: "🤖",
    badge: "AI & Web",
    filterType: "category",
    filterValue: "AI",
    filterFn: (app) => (app.category || '').toLowerCase() === 'ai' || (app.platform || '').toLowerCase() === 'web'
  },
  {
    id: "sec-education",
    title: "Education & Learning",
    subtitle: "Courses, educational platforms and study resources",
    icon: "📚",
    badge: "Education",
    filterType: "category",
    filterValue: "Education",
    filterFn: (app) => (app.category || '').toLowerCase() === 'education'
  },
  {
    id: "sec-dev-tools",
    title: "Developer Tools & Utilities",
    subtitle: "Development environments, system utilities, and productivity software",
    icon: "🛠️",
    badge: "Development",
    filterType: "category",
    filterValue: "Development",
    filterFn: (app) => ['development', 'utility'].includes((app.category || '').toLowerCase())
  }
];

// --- POPULAR CATEGORIES FOR THUMBNAIL CLUSTERS (AN1 cat-apps) ---
const AN1_CATEGORY_CLUSTERS = [
  { name: "Games & Entertainment", icon: "🎮", filterType: "category", filterVal: "Game" },
  { name: "Android Applications", icon: "📱", filterType: "category", filterVal: "Apps" },
  { name: "Windows Software", icon: "💻", filterType: "category", filterVal: "Software" },
  { name: "AI & Cloud Tools", icon: "🤖", filterType: "category", filterVal: "AI" },
  { name: "Education & Books", icon: "📚", filterType: "category", filterVal: "Education" },
  { name: "Developer & Tools", icon: "🛠️", filterType: "category", filterVal: "Development" },
  { name: "Utilities & System", icon: "⚙️", filterType: "category", filterVal: "Utility" }
];

// --- DATABASE FETCHING (ONLY REAL APPS FROM SUPABASE) ---
async function fetchStoreApps() {
  try {
    const { data, error } = await supabase
      .from('store_apps')
      .select('*')
      .eq('status', 'Published')
      .order('featured', { ascending: false })
      .order('updated_at', { ascending: false });
      
    if (error) {
      console.error("Supabase Store Fetch Error:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }

    // Map Supabase rows to our frontend format
    return data.map(app => {
      let plat = app.platform;
      if (!plat) {
        if (app.download_url && (app.download_url.endsWith('.exe') || app.download_url.endsWith('.msi'))) {
          plat = 'Windows';
        } else if (app.download_url && app.download_url.endsWith('.dmg')) {
          plat = 'Mac';
        } else if (app.download_url && (app.download_url.startsWith('http') && !app.download_url.includes('/storage/'))) {
          plat = 'Web';
        } else {
          plat = 'Android';
        }
      }

      let appType = app.app_type;
      if (!appType) {
        if (plat === 'Windows') appType = 'EXE';
        else if (plat === 'Mac') appType = 'DMG';
        else if (plat === 'Web') appType = 'Web App';
        else if (plat === 'Linux') appType = 'AppImage';
        else appType = 'APK';
      }

      return {
        id: app.id,
        name: app.name,
        slug: app.slug,
        icon: app.logo_url || "logo.png",
        description: app.short_description || "",
        longDescription: app.description || "",
        category: Array.isArray(app.category) ? (app.category[0] || "Apps") : (app.category || "Apps"),
        subcategory: app.subcategory || "",
        platform: plat,
        app_type: appType,
        type: appType,
        license: app.license || "Free",
        rating: Number(app.rating) || 4.8,
        is_mod: !!app.is_mod,
        mod_info: app.mod_info || "",
        developer: app.developer_name || "HarshGuruJi",
        version: app.version || "1.0",
        size: app.file_size || "Varies",
        whats_new: app.whats_new || "",
        tags: [],
        featured: !!app.featured,
        trending: false,
        verified: app.verified !== false,
        openSource: (app.license || '').toLowerCase() === 'open source',
        updatedAt: app.updated_at || app.created_at,
        officialUrl: null,
        downloadUrl: app.download_url
      };
    });

  } catch (err) {
    console.error("Store Fetch Exception:", err);
    return [];
  }
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
  sectionsView: document.getElementById('store-sections-view'),
  filteredView: document.getElementById('store-filtered-view'),
  btnResetFilter: document.getElementById('btn-reset-filter'),
  searchInput: document.getElementById('store-search'),
  searchClearBtn: document.getElementById('search-clear-btn'),
  resultsCount: document.getElementById('results-count'),
  loadMoreBtn: document.getElementById('load-more-btn'),
  sortSelect: document.getElementById('sort-select'),
  filterRadios: document.querySelectorAll('.filter-label input[type="radio"]'),
  quickCatBtns: document.querySelectorAll('.quick-cat-btn'),
  
  // AN1 Specific Components
  showcaseSection: document.getElementById('an1-showcase-section'),
  bannerBtnGames: document.getElementById('banner-btn-games'),
  bannerBtnPrograms: document.getElementById('banner-btn-programs'),
  gamesCarouselBlock: document.getElementById('games-carousel-block'),
  programsCarouselBlock: document.getElementById('programs-carousel-block'),
  gamesCarouselTrack: document.getElementById('games-carousel-track'),
  programsCarouselTrack: document.getElementById('programs-carousel-track'),
  gamesPrevBtn: document.getElementById('games-prev-btn'),
  gamesNextBtn: document.getElementById('games-next-btn'),
  programsPrevBtn: document.getElementById('programs-prev-btn'),
  programsNextBtn: document.getElementById('programs-next-btn'),
  linkAllGames: document.getElementById('link-all-games'),
  linkAllPrograms: document.getElementById('link-all-programs'),
  clustersGrid: document.getElementById('an1-clusters-grid'),

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
  if (!elements.grid && !elements.sectionsView) return;
  
  showLoading();
  
  try {
    allApps = await fetchStoreApps();
    renderAn1Showcase();
    renderCategoryClusters();
    applyFilters();
    setupEventListeners();
  } catch (error) {
    showError("Failed to load store data. Please try again later.");
    console.error("Store init error:", error);
  }
}

// --- RENDER AN1 CAROUSELS (Games & Programs from real apps only) ---
function renderAn1Showcase() {
  if (allApps.length === 0) {
    if (elements.showcaseSection) elements.showcaseSection.style.display = 'none';
    return;
  }

  if (elements.showcaseSection) elements.showcaseSection.style.display = 'block';

  // 1. Games Carousel
  const gamesList = allApps.filter(a => 
    (a.category || '').toLowerCase() === 'game' || 
    (a.category || '').toLowerCase() === 'games' || 
    (a.type || '').toLowerCase() === 'game' ||
    a.is_mod
  );

  if (elements.gamesCarouselBlock && elements.gamesCarouselTrack) {
    if (gamesList.length > 0) {
      elements.gamesCarouselBlock.style.display = 'block';
      elements.gamesCarouselTrack.innerHTML = '';
      gamesList.forEach(app => {
        elements.gamesCarouselTrack.appendChild(createCarouselItem(app));
      });
    } else {
      elements.gamesCarouselBlock.style.display = 'none';
    }
  }

  // 2. Programs / Software Carousel
  const programsList = allApps.filter(a => 
    (a.category || '').toLowerCase() !== 'game' && 
    (a.category || '').toLowerCase() !== 'games' && 
    (a.type || '').toLowerCase() !== 'game'
  );

  if (elements.programsCarouselBlock && elements.programsCarouselTrack) {
    if (programsList.length > 0) {
      elements.programsCarouselBlock.style.display = 'block';
      elements.programsCarouselTrack.innerHTML = '';
      programsList.forEach(app => {
        elements.programsCarouselTrack.appendChild(createCarouselItem(app));
      });
    } else {
      elements.programsCarouselBlock.style.display = 'none';
    }
  }
}

function createCarouselItem(app) {
  const item = document.createElement('a');
  item.href = `app.html?slug=${encodeURIComponent(app.slug)}`;
  item.className = 'an1-carousel-item animate-fade-in';
  
  const badgeHtml = app.is_mod 
    ? `<span class="badge-tag">MOD</span>` 
    : (app.verified ? `<span class="badge-tag badge-verified">VERIFIED</span>` : '');

  item.innerHTML = `
    <div class="carousel-icon-wrap">
      <img src="${app.icon}" alt="${app.name}" class="carousel-app-icon" loading="lazy">
      ${badgeHtml}
    </div>
    <h3 class="carousel-app-title" title="${app.name}">${app.name}</h3>
    <div class="carousel-app-dev">${app.developer}</div>
    <div class="carousel-app-rating">
      ★ ${(app.rating || 4.8).toFixed(1)}
    </div>
  `;

  return item;
}

// --- RENDER POPULAR CATEGORY THUMBNAIL CLUSTERS (AN1 cat-apps) ---
function renderCategoryClusters() {
  if (!elements.clustersGrid) return;
  elements.clustersGrid.innerHTML = '';

  AN1_CATEGORY_CLUSTERS.forEach(cluster => {
    // Find matching apps from real uploaded apps
    const matchingApps = allApps.filter(app => {
      if (cluster.filterType === 'category') {
        const c = (app.category || '').toLowerCase();
        const f = cluster.filterVal.toLowerCase();
        return c === f || c.includes(f);
      } else if (cluster.filterType === 'platform') {
        return (app.platform || '').toLowerCase() === cluster.filterVal.toLowerCase();
      }
      return false;
    });

    const card = document.createElement('div');
    card.className = 'an1-cat-cluster-card animate-fade-in';
    card.setAttribute('role', 'button');
    card.tabIndex = 0;

    // Pick top thumbnails from real apps
    const thumbs = matchingApps.slice(0, 4);
    let thumbsHtml = '';
    if (thumbs.length > 0) {
      thumbs.forEach(tApp => {
        thumbsHtml += `<img src="${tApp.icon}" alt="${tApp.name}" class="cat-mini-thumb" loading="lazy" title="${tApp.name}">`;
      });
    } else {
      thumbsHtml = `<span style="font-size: 1.4rem; opacity: 0.6;">${cluster.icon}</span>`;
    }

    card.innerHTML = `
      <div class="cat-cluster-top">
        <div class="cat-cluster-title">${cluster.icon} ${cluster.name}</div>
        <span class="cat-cluster-count">${matchingApps.length} ${matchingApps.length === 1 ? 'app' : 'apps'}</span>
      </div>
      <div class="cat-cluster-thumbs">
        ${thumbsHtml}
        <div class="cat-cluster-more-btn" title="View All in ${cluster.name}">...</div>
      </div>
    `;

    const selectCluster = () => {
      if (cluster.filterType === 'category') {
        currentFilters.category = cluster.filterVal;
        currentFilters.platform = "All";
        const catRadio = document.querySelector(`input[name="category"][value="${cluster.filterVal}"]`);
        if (catRadio) catRadio.checked = true;
        const platRadio = document.querySelector('input[name="platform"][value="All"]');
        if (platRadio) platRadio.checked = true;
      } else {
        currentFilters.platform = cluster.filterVal;
        currentFilters.category = "All";
        const platRadio = document.querySelector(`input[name="platform"][value="${cluster.filterVal}"]`);
        if (platRadio) platRadio.checked = true;
        const catRadio = document.querySelector('input[name="category"][value="All"]');
        if (catRadio) catRadio.checked = true;
      }
      syncQuickCategories(cluster.filterVal);
      applyFilters();
      scrollToStoreLayout();
    };

    card.addEventListener('click', selectCluster);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectCluster();
      }
    });

    elements.clustersGrid.appendChild(card);
  });
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
  // Search (Debounced)
  let searchTimeout;
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase().trim();
      if (elements.searchClearBtn) {
        elements.searchClearBtn.style.display = val ? 'grid' : 'none';
      }
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentFilters.search = val;
        applyFilters();
      }, 300);
    });
  }

  // Clear Search button
  if (elements.searchClearBtn) {
    elements.searchClearBtn.addEventListener('click', () => {
      elements.searchInput.value = '';
      elements.searchClearBtn.style.display = 'none';
      currentFilters.search = '';
      applyFilters();
    });
  }

  // Dual Catalog Banners
  if (elements.bannerBtnGames) {
    elements.bannerBtnGames.addEventListener('click', () => {
      currentFilters.category = "Game";
      currentFilters.platform = "All";
      const catRadio = document.querySelector('input[name="category"][value="Game"]');
      if (catRadio) catRadio.checked = true;
      syncQuickCategories("Game");
      applyFilters();
      scrollToStoreLayout();
    });
  }

  if (elements.bannerBtnPrograms) {
    elements.bannerBtnPrograms.addEventListener('click', () => {
      currentFilters.category = "Software";
      currentFilters.platform = "All";
      const catRadio = document.querySelector('input[name="category"][value="Software"]');
      if (catRadio) catRadio.checked = true;
      syncQuickCategories("Software");
      applyFilters();
      scrollToStoreLayout();
    });
  }

  // "All Games →" and "All Programs →" links
  if (elements.linkAllGames) {
    elements.linkAllGames.addEventListener('click', () => {
      currentFilters.category = "Game";
      applyFilters();
      scrollToStoreLayout();
    });
  }

  if (elements.linkAllPrograms) {
    elements.linkAllPrograms.addEventListener('click', () => {
      currentFilters.category = "Apps";
      applyFilters();
      scrollToStoreLayout();
    });
  }

  // Carousel Scroll Navigation Buttons
  if (elements.gamesPrevBtn && elements.gamesCarouselTrack) {
    elements.gamesPrevBtn.addEventListener('click', () => {
      elements.gamesCarouselTrack.scrollBy({ left: -360, behavior: 'smooth' });
    });
  }
  if (elements.gamesNextBtn && elements.gamesCarouselTrack) {
    elements.gamesNextBtn.addEventListener('click', () => {
      elements.gamesCarouselTrack.scrollBy({ left: 360, behavior: 'smooth' });
    });
  }
  if (elements.programsPrevBtn && elements.programsCarouselTrack) {
    elements.programsPrevBtn.addEventListener('click', () => {
      elements.programsCarouselTrack.scrollBy({ left: -360, behavior: 'smooth' });
    });
  }
  if (elements.programsNextBtn && elements.programsCarouselTrack) {
    elements.programsNextBtn.addEventListener('click', () => {
      elements.programsCarouselTrack.scrollBy({ left: 360, behavior: 'smooth' });
    });
  }

  // Reset Filter button
  if (elements.btnResetFilter) {
    elements.btnResetFilter.addEventListener('click', () => {
      currentFilters.category = "All";
      currentFilters.platform = "All";
      currentFilters.license = "All";
      currentFilters.search = "";
      if (elements.searchInput) elements.searchInput.value = "";
      if (elements.searchClearBtn) elements.searchClearBtn.style.display = 'none';
      
      const catAllRadio = document.querySelector('input[name="category"][value="All"]');
      if (catAllRadio) catAllRadio.checked = true;
      const platAllRadio = document.querySelector('input[name="platform"][value="All"]');
      if (platAllRadio) platAllRadio.checked = true;
      const licAllRadio = document.querySelector('input[name="license"][value="All"]');
      if (licAllRadio) licAllRadio.checked = true;
      
      syncQuickCategories("All");
      applyFilters();
    });
  }

  // Sidebar Filters
  elements.filterRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const type = e.target.name;
      const value = e.target.value;
      currentFilters[type] = value;
      
      if (type === 'category' || type === 'platform') {
        syncQuickCategories(value);
      }
      
      applyFilters();
    });
  });

  // Quick Category Buttons
  elements.quickCatBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cat = e.currentTarget.dataset.cat;
      
      if (cat === "All") {
        currentFilters.category = "All";
        currentFilters.platform = "All";
        const catRadio = document.querySelector('input[name="category"][value="All"]');
        if (catRadio) catRadio.checked = true;
        const platRadio = document.querySelector('input[name="platform"][value="All"]');
        if (platRadio) platRadio.checked = true;
      } else if (cat === "Android" || cat === "Windows" || cat === "Mac" || cat === "Web") {
        currentFilters.platform = cat;
        currentFilters.category = "All";
        const platRadio = document.querySelector(`input[name="platform"][value="${cat}"]`);
        if (platRadio) platRadio.checked = true;
        const catRadio = document.querySelector('input[name="category"][value="All"]');
        if (catRadio) catRadio.checked = true;
      } else {
        currentFilters.category = cat;
        currentFilters.platform = "All";
        const catRadio = document.querySelector(`input[name="category"][value="${cat}"]`);
        if (catRadio) catRadio.checked = true;
        const platRadio = document.querySelector('input[name="platform"][value="All"]');
        if (platRadio) platRadio.checked = true;
      }
      
      syncQuickCategories(cat);
      applyFilters();
      scrollToStoreLayout();
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
      renderFilteredGrid(true);
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

function scrollToStoreLayout() {
  const target = document.getElementById('store-main-layout');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function syncQuickCategories(val) {
  elements.quickCatBtns.forEach(btn => {
    if (btn.dataset.cat === val) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// --- FILTERING & ROUTING ---
function applyFilters() {
  currentPage = 1;

  const isDefaultView = (
    currentFilters.category === "All" &&
    currentFilters.platform === "All" &&
    currentFilters.license === "All" &&
    !currentFilters.search
  );

  if (isDefaultView && elements.sectionsView) {
    if (elements.showcaseSection) {
      elements.showcaseSection.style.display = allApps.length > 0 ? 'block' : 'none';
    }
    elements.sectionsView.style.display = 'flex';
    if (elements.filteredView) elements.filteredView.style.display = 'none';
    if (elements.btnResetFilter) elements.btnResetFilter.style.display = 'none';
    if (elements.resultsCount) {
      elements.resultsCount.textContent = `Showing all releases (${allApps.length} ${allApps.length === 1 ? 'application' : 'applications'} available)`;
    }
    renderSections();
    return;
  }

  // Switch to Filtered Grid View
  if (elements.sectionsView) elements.sectionsView.style.display = 'none';
  if (elements.filteredView) elements.filteredView.style.display = 'block';
  if (elements.btnResetFilter) elements.btnResetFilter.style.display = 'inline-block';

  filteredApps = allApps.filter(app => {
    // Search Filter
    if (currentFilters.search) {
      const query = currentFilters.search;
      const matchName = (app.name || '').toLowerCase().includes(query);
      const matchDesc = (app.description || '').toLowerCase().includes(query);
      const matchDev = (app.developer || '').toLowerCase().includes(query);
      const matchPlat = (app.platform || '').toLowerCase().includes(query);
      const matchType = (app.app_type || '').toLowerCase().includes(query);
      const matchMod = (app.mod_info || '').toLowerCase().includes(query);
      if (!matchName && !matchDesc && !matchDev && !matchPlat && !matchType && !matchMod) return false;
    }
    
    // Category Filter
    if (currentFilters.category !== "All" && currentFilters.category !== "Featured") {
       const cat = (app.category || '').toLowerCase();
       const filterCat = currentFilters.category.toLowerCase();
       const appType = (app.type || '').toLowerCase();
       if (cat !== filterCat && appType !== filterCat && !cat.includes(filterCat)) return false;
    }
    if (currentFilters.category === "Featured" && !app.featured) return false;
    
    // Platform Filter
    if (currentFilters.platform !== "All") {
      const plat = (app.platform || '').toLowerCase();
      const filterPlat = currentFilters.platform.toLowerCase();
      if (plat !== filterPlat) return false;
    }
    
    // License Filter
    if (currentFilters.license !== "All") {
      const appLicense = (app.license || 'Free').toLowerCase();
      const filterLicense = currentFilters.license.toLowerCase();
      if (appLicense !== filterLicense) return false;
    }
    
    return true;
  });
  
  // Sorting
  sortApps(filteredApps);
  
  updateResultsCount();
  renderFilteredGrid(false);
}

function sortApps(list) {
  list.sort((a, b) => {
    switch (currentFilters.sort) {
      case 'latest':
        return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'az':
        return (a.name || '').localeCompare(b.name || '');
      case 'za':
        return (b.name || '').localeCompare(a.name || '');
      case 'featured':
      default:
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.rating || 0) - (a.rating || 0);
    }
  });
}

// --- RENDER CATEGORY SECTIONS ---
function renderSections() {
  if (!elements.sectionsView) return;
  elements.sectionsView.innerHTML = '';

  if (allApps.length === 0) {
    elements.sectionsView.innerHTML = `
      <div class="store-empty-state animate-fade-in">
        <div class="empty-icon">📦</div>
        <h2>No Applications Published Yet</h2>
        <p>Apps uploaded through the Admin Panel will appear here instantly. Log in to the Admin Dashboard to publish your first application or software.</p>
        <a href="adminapkupload.html" class="btn-admin-link">Open Admin Upload Panel &rarr;</a>
      </div>
    `;
    return;
  }

  let renderedSectionCount = 0;

  STORE_SECTIONS.forEach(section => {
    const sectionApps = allApps.filter(section.filterFn);
    if (sectionApps.length === 0) return;

    renderedSectionCount++;
    const sectionEl = document.createElement('section');
    sectionEl.className = 'store-category-section animate-fade-in';
    sectionEl.id = section.id;

    // Header bar
    const headerBar = document.createElement('div');
    headerBar.className = 'section-header-bar';
    headerBar.innerHTML = `
      <div class="section-title-wrap">
        <span class="section-icon">${section.icon}</span>
        <div class="section-title-text">
          <h2>${section.title} <span class="section-badge">${sectionApps.length}</span></h2>
          <p>${section.subtitle}</p>
        </div>
      </div>
      <button type="button" class="section-view-all-btn" data-filter-type="${section.filterType}" data-filter-value="${section.filterValue}">
        View All &rarr;
      </button>
    `;

    const viewAllBtn = headerBar.querySelector('.section-view-all-btn');
    viewAllBtn.addEventListener('click', () => {
      const type = viewAllBtn.dataset.filterType;
      const val = viewAllBtn.dataset.filterValue;
      currentFilters[type] = val;

      const radio = document.querySelector(`input[name="${type}"][value="${val}"]`);
      if (radio) radio.checked = true;

      syncQuickCategories(val);
      applyFilters();
      scrollToStoreLayout();
    });

    sectionEl.appendChild(headerBar);

    // Cards Grid
    const gridEl = document.createElement('div');
    gridEl.className = 'section-cards-grid';
    const topApps = sectionApps.slice(0, 6);

    topApps.forEach((app, idx) => {
      const card = createAppCard(app, idx);
      gridEl.appendChild(card);
    });

    sectionEl.appendChild(gridEl);
    elements.sectionsView.appendChild(sectionEl);
  });

  // Fallback if none of the specific sections matched but apps exist
  if (renderedSectionCount === 0) {
    const sectionEl = document.createElement('section');
    sectionEl.className = 'store-category-section animate-fade-in';
    sectionEl.innerHTML = `
      <div class="section-header-bar">
        <div class="section-title-wrap">
          <span class="section-icon">📦</span>
          <div class="section-title-text">
            <h2>All Published Releases <span class="section-badge">${allApps.length}</span></h2>
            <p>Recently uploaded applications</p>
          </div>
        </div>
      </div>
    `;
    const gridEl = document.createElement('div');
    gridEl.className = 'section-cards-grid';
    allApps.forEach((app, idx) => {
      gridEl.appendChild(createAppCard(app, idx));
    });
    sectionEl.appendChild(gridEl);
    elements.sectionsView.appendChild(sectionEl);
  }
}

// --- RENDER FILTERED GRID ---
function renderFilteredGrid(append = false) {
  if (!elements.grid) return;
  
  if (filteredApps.length === 0) {
    elements.grid.innerHTML = '<div class="store-message">No applications found matching your selected filters.<br>Try adjusting keywords or selecting "All Items".</div>';
    if (elements.loadMoreBtn) elements.loadMoreBtn.style.display = 'none';
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
    const card = createAppCard(app, index);
    elements.grid.appendChild(card);
  });
  
  if (elements.loadMoreBtn) {
    elements.loadMoreBtn.style.display = endIndex < filteredApps.length ? 'inline-block' : 'none';
  }
}

// --- AN1 APP CARD COMPONENT ---
function createAppCard(app, index) {
  const card = document.createElement('a');
  card.href = `app.html?slug=${encodeURIComponent(app.slug)}`;
  card.className = 'app-card animate-fade-in';
  card.style.animationDelay = `${index * 0.03}s`;
  card.style.textDecoration = 'none';
  card.style.color = 'inherit';
  
  const isMod = app.is_mod || app.name.toLowerCase().includes('mod');
  let badgeHtml = isMod 
    ? `<div class="verified-badge" style="background: rgba(255, 119, 0, 0.15); color: #ff7700;">MOD</div>` 
    : (app.verified ? `<div class="verified-badge">✓ Verified</div>` : '');

  const platIcon = getPlatformIcon(app.platform);
  const appFormat = app.app_type || (app.platform === 'Android' ? 'APK' : (app.platform === 'Windows' ? 'EXE' : 'APP'));

  card.innerHTML = `
    ${badgeHtml}
    <div class="app-card-top">
      <img src="${app.icon}" alt="${app.name}" class="app-card-icon" loading="lazy" onerror="this.src='logo.png'">
      <div class="app-card-info">
        <h3 class="app-card-title">${app.name}</h3>
        <div class="app-card-dev">${app.developer}</div>
        <div class="app-card-rating">
          ★ ${(app.rating || 4.8).toFixed(1)} &bull; <span style="color: var(--an1-text-muted); font-size: 0.75rem;">v${app.version || '1.0'}</span>
        </div>
      </div>
    </div>
    <div class="app-card-desc">
      ${app.description || 'Verified fast download package available on HarshGuruJi Store.'}
    </div>
    <div class="app-card-meta">
      <div style="display:flex; align-items:center; gap: 5px; flex-wrap: wrap;">
        <span class="app-platform-pill">
          ${platIcon} ${app.platform}
        </span>
        <span class="app-type-badge">${appFormat}</span>
        ${app.license && app.license !== 'Free' ? `<span class="app-type-badge" style="background: rgba(59,130,246,0.15); color: #60a5fa;">${app.license}</span>` : ''}
      </div>
      <span class="app-btn-download-tag">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        Download
      </span>
    </div>
  `;

  return card;
}

function updateResultsCount() {
  if (!elements.resultsCount) return;
  const activeLabel = currentFilters.search 
    ? `"${currentFilters.search}"`
    : (currentFilters.platform !== "All" ? `${currentFilters.platform} Packages` : currentFilters.category);
  elements.resultsCount.textContent = `Showing ${filteredApps.length} result${filteredApps.length !== 1 ? 's' : ''} for ${activeLabel}`;
}

function showLoading() {
  if (elements.sectionsView) {
    elements.sectionsView.innerHTML = '<div class="store-message">Loading verified store releases...</div>';
  }
}

function showError(msg) {
  if (elements.sectionsView) {
    elements.sectionsView.innerHTML = `<div class="store-message" style="color: #ef4444;">${msg}</div>`;
  }
}

// --- MODAL / DETAILS VIEW ---
function openAppDetails(app) {
  if (!elements.modalOverlay) return;
  
  elements.mIcon.src = app.icon;
  elements.mTitle.textContent = app.name;
  elements.mDev.textContent = app.developer;

  let descContent = app.longDescription || app.description;
  if (app.is_mod && app.mod_info) {
    descContent = `<div style="background: rgba(255, 119, 0, 0.12); border: 1px solid rgba(255, 119, 0, 0.35); padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1rem; color: #ff9933;"><strong>⚡ MOD Features:</strong> ${app.mod_info}</div>` + descContent;
  }
  elements.mDesc.innerHTML = descContent;
  
  const platIcon = getPlatformIcon(app.platform);
  let chipsHtml = `
    <span class="app-badge" style="background: rgba(255,255,255,0.1)">${app.category}</span>
    <span class="app-badge" style="background: rgba(84, 178, 71, 0.15); color: var(--an1-green);">${platIcon} ${app.platform}</span>
    <span class="app-badge" style="background: rgba(255, 255, 255, 0.08);">${app.app_type || 'Package'}</span>
    <span class="app-badge" style="background: rgba(255,255,255,0.1)">★ ${(app.rating || 4.8).toFixed(1)}</span>
  `;
  if (app.license) {
    chipsHtml += `<span class="app-badge" style="background: rgba(84, 178, 71, 0.15); color: var(--an1-green);">${app.license}</span>`;
  }
  if (app.is_mod) {
    chipsHtml += `<span class="app-badge" style="background: rgba(255, 119, 0, 0.2); color: #ff7700;">⚡ MOD Edition</span>`;
  }
  if (app.verified) {
    chipsHtml += `<span class="app-badge" style="background: rgba(84, 178, 71, 0.15); color: var(--an1-green);">✓ Verified</span>`;
  }
  elements.mChips.innerHTML = chipsHtml;
  
  elements.mInfoGrid.innerHTML = `
    <div class="info-item">
      <div class="info-label">Version</div>
      <div class="info-value">${app.version || 'Latest'}</div>
    </div>
    <div class="info-item">
      <div class="info-label">File Size</div>
      <div class="info-value">${app.size || 'Varies'}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Platform</div>
      <div class="info-value">${platIcon} ${app.platform}</div>
    </div>
    <div class="info-item">
      <div class="info-label">App Format</div>
      <div class="info-value">${app.app_type || 'Standard'}</div>
    </div>
  `;
  
  elements.mDownload.href = app.downloadUrl || '#';
  const actionText = app.platform === 'Web' 
    ? 'Open Web App' 
    : (app.platform === 'Windows' ? 'Download for Windows' : 'Download APK');
    
  elements.mDownload.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
    ${actionText}
  `;
  
  elements.mDownload.onclick = async (e) => {
    e.preventDefault();
    if (!app.downloadUrl || app.downloadUrl === '#') {
      alert("Download link not available for this app.");
      return;
    }

    let user = AuthManager.currentUser;
    if (!user) {
      const today = new Date().toISOString().split('T')[0];
      let guestData = JSON.parse(localStorage.getItem('guest_downloads') || '{"date":"","count":0}');
      
      if (guestData.date !== today) {
          guestData = { date: today, count: 0 };
      }
      
      if (guestData.count >= 5) {
          alert("You have reached your free limit of 5 downloads per day. Please log in to download more apps!");
          return;
      }
      
      guestData.count += 1;
      localStorage.setItem('guest_downloads', JSON.stringify(guestData));
    }

    const link = document.createElement('a');
    link.href = app.downloadUrl;
    link.target = '_blank';
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (app.id) {
      try {
        const { data } = await supabase.from('store_apps').select('downloads').eq('id', app.id).single();
        if (data) {
          await supabase.from('store_apps').update({ downloads: (data.downloads || 0) + 1 }).eq('id', app.id);
        }
        
        if (user) {
            await supabase.from('app_downloads').insert({
                user_id: user.id,
                app_id: app.id
            });
        }
      } catch (err) {
        console.error("Failed to track download:", err);
      }
    }
  };
  
  if (app.officialUrl) {
    elements.mOfficial.href = app.officialUrl;
    elements.mOfficial.style.display = 'grid';
  } else {
    elements.mOfficial.style.display = 'none';
  }
  
  elements.modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  if (window.history.pushState) {
    window.history.pushState({ path: `store.html?app=${app.slug}` }, '', `store.html?app=${app.slug}`);
  }
}

function closeModal() {
  if (elements.modalOverlay) {
    elements.modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    if (window.history.pushState) {
      window.history.pushState({ path: 'store.html' }, '', 'store.html');
    }
  }
}

// --- UTILS ---
function getPlatformIcon(platform) {
  switch ((platform || '').toLowerCase()) {
    case 'windows': return '🪟';
    case 'android': return '🤖';
    case 'macos':
    case 'mac': return '🍎';
    case 'linux': return '🐧';
    case 'web': return '🌐';
    case 'ios': return '🍏';
    case 'cross-platform': return '⚡';
    default: return '📦';
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initStore);
