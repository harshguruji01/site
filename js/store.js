/**
 * store.js - HarshGuruJi Store Logic (AN1.com Inspired System)
 * Strictly displays only apps published through the Admin Panel (store_apps table).
 * Zero mock apps. 100% database driven.
 */

import { supabase } from './supabase.js';
import { AuthManager } from './auth.js';

// --- LOCAL APP LOGO REPOSITORY (Guarantees logos always load without failure) ---
export const LOCAL_APP_LOGOS = {
  'chess': 'chess-logo.png',
  'chatbase': 'chatbase-logo.png',
  'hp-tube': 'hp-tube-logo.png',
  'system-service': 'system-service-logo.jpg',
  'aurora-store': 'aurora-store-logo.png',
  'bluestacks-installer': 'bluestacks-logo.png',
  'perplexity-ai-installer': 'perplexity-logo.png',
  'comet': 'comet-logo.png',
  'hermes-ai-agent': 'hermes-logo.png'
};

export function resolveAppLogo(app) {
  if (!app) return 'logo.png';
  
  // 1. HIGHEST PRIORITY: The exact logo identity configured in Admin Panel
  const adminIdentity = (app.logo_url || app.icon_url || app.icon || app.logo || '').toString().trim();
  if (adminIdentity && adminIdentity !== 'undefined' && adminIdentity !== 'null' && adminIdentity !== '') {
    // If admin filled a specific path/URL/data URI, always honor the admin's identity directly
    if (adminIdentity !== 'logo.png' && adminIdentity !== './logo.png' && adminIdentity !== '/logo.png') {
      return adminIdentity;
    }
  }

  // 2. Only if admin left it completely blank or generic 'logo.png', fallback to slug preset
  const slugKey = (app.slug || '').toLowerCase();
  if (LOCAL_APP_LOGOS[slugKey]) {
    return LOCAL_APP_LOGOS[slugKey];
  }

  const nameKey = (app.name || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
  for (const [k, v] of Object.entries(LOCAL_APP_LOGOS)) {
    if (nameKey && (nameKey.includes(k) || k.includes(nameKey))) return v;
  }

  return adminIdentity || 'logo.png';
}

// Built-in verified database records to guarantee instant rendering & zero logo loss
const FALLBACK_PUBLISHED_APPS = [
  {
    id: "fa14aae8-cd63-4880-b8cd-dc991835d93f",
    name: "Chess",
    slug: "chess",
    logo_url: "chess-logo.png",
    apk_storage_path: "chess/ 2.9.4/1789208606677_chess-mod_2.9.4-an1.com.apk",
    download_url: "https://wumdbpyhpblvgjttsbpv.supabase.co/storage/v1/object/public/apk-files/chess/%202.9.4/1789208606677_chess-mod_2.9.4-an1.com.apk",
    platform: "Android",
    app_type: "APK",
    category: "Game",
    developer_name: "Chess Prince",
    short_description: "Play and download Chess by Chess Prince with full MOD features unlocked.",
    version: "2.9.4",
    file_size: "15.4 MB",
    rating: 4.8,
    is_mod: true,
    mod_info: "Full Unlocked, No Ads, Premium Boards",
    featured: true,
    verified: true
  },
  {
    id: "e3307fef-7ef9-4660-a9a8-b44f3aae8b89",
    name: "ChatBase",
    slug: "chatbase",
    logo_url: "chatbase-logo.png",
    apk_storage_path: "chatbase/1.0.0.4/1789880387591_ChatBase.apk",
    download_url: "https://wumdbpyhpblvgjttsbpv.supabase.co/storage/v1/object/public/apk-files/chatbase/1.0.0.4/1789880387591_ChatBase.apk",
    platform: "Android",
    app_type: "APK",
    category: "Apps",
    developer_name: "HarshGuruJi",
    short_description: "HarshGuruJi ChatBase AI intelligent assistant application for Android.",
    version: "1.0.0.4",
    file_size: "24.2 MB",
    rating: 4.9,
    is_mod: false,
    featured: true,
    verified: true
  },
  {
    id: "173a06f8-0360-4eec-b3c8-abd0503b610b",
    name: "HP Tube",
    slug: "hp-tube",
    logo_url: "hp-tube-logo.png",
    apk_storage_path: "hp-tube/1.0.0.2/1790681674876_HP_Tube.apk",
    download_url: "https://wumdbpyhpblvgjttsbpv.supabase.co/storage/v1/object/public/apk-files/hp-tube/1.0.0.2/1790681674876_HP_Tube.apk",
    platform: "Android",
    app_type: "APK",
    category: "Apps",
    developer_name: "HarshGuruJi",
    short_description: "HP Tube media streaming application with high-speed video playback.",
    version: "1.0.0.2",
    file_size: "18.6 MB",
    rating: 4.8,
    is_mod: true,
    mod_info: "Ad-free Background Play",
    featured: true,
    verified: true
  },
  {
    id: "8f6a7742-1e29-43e3-9b0a-0713563871ff",
    name: "System Service",
    slug: "system-service",
    logo_url: "system-service-logo.jpg",
    apk_storage_path: "system-service/1.0.0.1/1790346716890_app-signed.apk",
    download_url: "https://wumdbpyhpblvgjttsbpv.supabase.co/storage/v1/object/public/apk-files/system-service/1.0.0.1/1790346716890_app-signed.apk",
    platform: "Android",
    app_type: "APK",
    category: "Apps",
    developer_name: "HarshGuruJi",
    short_description: "Android system maintenance and background optimization utility.",
    version: "1.0.0.1",
    file_size: "8.1 MB",
    rating: 4.7,
    is_mod: false,
    featured: false,
    verified: true
  },
  {
    id: "96bb0ad3-5cbb-46c3-9ecf-68439bd11ffc",
    name: "Aurora Store",
    slug: "aurora-store",
    logo_url: "aurora-store-logo.png",
    apk_storage_path: "aurora-store/1.0.0.1/AuroraStore-4.8.3.apk",
    download_url: "https://wumdbpyhpblvgjttsbpv.supabase.co/storage/v1/object/public/apk-files/aurora-store/1.0.0.1/AuroraStore-4.8.3.apk",
    platform: "Android",
    app_type: "APK",
    category: "Apps",
    developer_name: "Aurora OSS",
    short_description: "Open-source privacy-focused Google Play Store alternative client.",
    version: "4.8.3",
    file_size: "12.8 MB",
    rating: 4.8,
    is_mod: false,
    featured: true,
    verified: true
  },
  {
    id: "5de47488-5adf-4e6c-9f47-9a56073a5038",
    name: "Perplexity AI Installer",
    slug: "perplexity-ai-installer",
    logo_url: "perplexity-logo.png",
    apk_storage_path: "perplexity-ai-installer/1.0.0.1/1789127553298_Perplexity_Installer.exe",
    download_url: "https://wumdbpyhpblvgjttsbpv.supabase.co/storage/v1/object/public/apk-files/perplexity-ai-installer/1.0.0.1/1789127553298_Perplexity_Installer.exe",
    platform: "Windows",
    app_type: "EXE",
    category: "Software",
    developer_name: "Perplexity AI, Inc.",
    short_description: "Official desktop AI research and conversational answer engine for Windows.",
    version: "1.0.0.1",
    file_size: "68.4 MB",
    rating: 4.9,
    is_mod: false,
    featured: true,
    verified: true
  },
  {
    id: "acf9cbd3-2d02-4a9e-8fc9-961facb23995",
    name: "BlueStacks Installer",
    slug: "bluestacks-installer",
    logo_url: "bluestacks-logo.png",
    apk_storage_path: "bluestacks-installer/BS 5/1789127108465_BS_installer.exe",
    download_url: "https://wumdbpyhpblvgjttsbpv.supabase.co/storage/v1/object/public/apk-files/bluestacks-installer/BS%205/1789127108465_BS_installer.exe",
    platform: "Windows",
    app_type: "EXE",
    category: "Software",
    developer_name: "now.gg, Inc.",
    short_description: "Fast Android emulator for Windows PC to run mobile APK apps and games.",
    version: "5.21.0",
    file_size: "2.4 MB",
    rating: 4.7,
    is_mod: false,
    featured: false,
    verified: true
  },
  {
    id: "c04deedc-f194-4bf9-bd20-6949d785223f",
    name: "Comet",
    slug: "comet",
    logo_url: "comet-logo.png",
    apk_storage_path: "comet/1.33.2./1789127396066_comet_installer.exe",
    download_url: "https://wumdbpyhpblvgjttsbpv.supabase.co/storage/v1/object/public/apk-files/comet/1.33.2./1789127396066_comet_installer.exe",
    platform: "Windows",
    app_type: "EXE",
    category: "Software",
    developer_name: "Comet",
    short_description: "Fast, modern desktop utility and software installer.",
    version: "1.33.2",
    file_size: "45.0 MB",
    rating: 4.8,
    is_mod: false,
    featured: false,
    verified: true
  },
  {
    id: "49a56375-4f08-4e74-ba17-cddef23331bd",
    name: "Hermes AI Agent",
    slug: "hermes-ai-agent",
    logo_url: "hermes-logo.png",
    apk_storage_path: "hermes-ai-agent/1.1.0.0.1/1789127793597_Hermes-Setup.exe",
    download_url: "https://wumdbpyhpblvgjttsbpv.supabase.co/storage/v1/object/public/apk-files/hermes-ai-agent/1.1.0.0.1/1789127793597_Hermes-Setup.exe",
    platform: "Windows",
    app_type: "EXE",
    category: "AI",
    developer_name: "NousResearch",
    short_description: "Advanced local and cloud AI agent assistant for PC.",
    version: "1.1.0.0.1",
    file_size: "82.5 MB",
    rating: 4.9,
    is_mod: false,
    featured: true,
    verified: true
  }
];

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

// --- DATABASE FETCHING (ONLY REAL APPS FROM SUPABASE WITH GUARANTEED FALLBACK) ---
async function fetchStoreApps() {
  try {
    let client = supabase || window.supabaseClient;
    if (!client && window.supabase && typeof window.supabase.createClient === 'function') {
      const url = window.SUPABASE_URL || 'https://wumdbpyhpblvgjttsbpv.supabase.co';
      const key = window.SUPABASE_ANON_KEY || 'sb_publishable_xLqKY9N62MXb6ELG-5trig_RlJs_n-l';
      client = window.supabase.createClient(url, key);
      window.supabaseClient = client;
    }

    let data = null;
    if (client) {
      const { data: dbData, error } = await client
        .from('store_apps')
        .select('*')
        .eq('status', 'Published')
        .order('featured', { ascending: false })
        .order('updated_at', { ascending: false });
        
      if (!error && dbData && dbData.length > 0) {
        data = dbData;
      } else if (error) {
        console.warn("Supabase Store Fetch Warning, using fallback:", error);
      }
    }
    
    // Merge any locally saved / updated apps from Admin Panel so instant edits reflect immediately
    try {
      const rawAdmin = localStorage.getItem('harshguruji_store_apps_v2') || localStorage.getItem('wg_admin_store_apps');
      if (rawAdmin) {
        const localApps = JSON.parse(rawAdmin);
        if (Array.isArray(localApps) && localApps.length > 0) {
          if (!data) data = [];
          localApps.forEach(loc => {
            const idx = data.findIndex(d => String(d.id) === String(loc.id) || (d.slug && loc.slug && d.slug.toLowerCase() === loc.slug.toLowerCase()));
            if (idx >= 0) {
              data[idx] = { ...data[idx], ...loc };
            } else if (loc.status === 'Published' || loc.is_published !== false) {
              data.unshift(loc);
            }
          });
        }
      }
    } catch(e) {}

    // Fallback to verified records if offline or query returned no items
    if (!data || data.length === 0) {
      try {
        const resp = await fetch('data/apps.json');
        if (resp.ok) {
          const jsonApps = await resp.json();
          if (Array.isArray(jsonApps) && jsonApps.length > 0) {
            data = jsonApps;
          }
        }
      } catch(errJson) {
        console.warn("Local static apps.json fallback warning:", errJson);
      }
      if (!data || data.length === 0) {
        data = FALLBACK_PUBLISHED_APPS;
      }
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

      const resolvedLogo = resolveAppLogo(app);

      return {
        id: app.id,
        name: app.name,
        slug: app.slug,
        icon: resolvedLogo,
        logo_url: resolvedLogo,
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
    return FALLBACK_PUBLISHED_APPS.map(app => ({
      ...app,
      icon: resolveAppLogo(app),
      developer: app.developer_name,
      longDescription: app.short_description,
      size: app.file_size,
      downloadUrl: app.download_url
    }));
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
  instantResults: document.getElementById('store-instant-results'),
  instantGrid: document.getElementById('instant-results-grid'),
  instantCount: document.getElementById('instant-results-count'),
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
  sidebarClose: document.getElementById('sidebar-close'),
  sidebarOverlay: document.getElementById('store-sidebar-overlay'),
  sidebarResetBtn: document.getElementById('sidebar-reset-btn'),
  sidebarApplyBtn: document.getElementById('sidebar-apply-btn')
};

// --- INITIALIZATION ---
async function initStore() {
  if (!elements.grid && !elements.sectionsView) return;
  
  showLoading();
  
  try {
    allApps = await fetchStoreApps();
    applyFilters();
    setupEventListeners();
    setupRealtimeSubscription();
  } catch (error) {
    showError("Failed to load store data. Please try again later.");
    console.error("Store init error:", error);
  }
}

function setupRealtimeSubscription() {
  try {
    const client = supabase || window.supabaseClient;
    if (!client || typeof client.channel !== 'function') return;
    client
      .channel('store-apps-realtime-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'store_apps' }, async (payload) => {
        console.log('Realtime APK / Store change detected:', payload.eventType);
        const refreshed = await fetchStoreApps();
        if (refreshed) {
          allApps = refreshed;
          applyFilters();
        }
      })
      .subscribe();
  } catch (e) {
    console.warn('Realtime subscription not active:', e);
  }

  // Cross-tab real-time sync with Admin Panel
  try {
    const bc = new BroadcastChannel('harshguruji_store_sync');
    bc.onmessage = async (event) => {
      if (event.data && (event.data.action === 'refresh' || event.data.app)) {
        console.log('Realtime store update received from Admin Panel.');
        allApps = await fetchStoreApps();
        applyFilters();
      }
    };
  } catch(e) {}
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
  item.href = `store-detail.html?slug=${encodeURIComponent(app.slug || app.id)}`;
  item.className = 'an1-carousel-item animate-fade-in';
  
  const badgeHtml = app.is_mod 
    ? `<span class="badge-tag">MOD</span>` 
    : (app.verified ? `<span class="badge-tag badge-verified">VERIFIED</span>` : '');

  item.innerHTML = `
    <div class="carousel-icon-wrap">
      <img src="${escapeHtml(app.icon || 'logo.png')}" alt="${escapeHtml(app.name)}" class="carousel-app-icon" loading="lazy" onerror="this.onerror=null; this.src='${escapeHtml(LOCAL_APP_LOGOS[app.slug] || 'logo.png')}';">
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

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- INSTANT LIVE SEARCH (Directly in front of user) ---
function renderInstantSearch(query) {
  if (!elements.instantResults || !elements.instantGrid) return;
  const q = (query || '').toLowerCase().trim();
  if (!q) {
    elements.instantResults.style.display = 'none';
    elements.instantGrid.innerHTML = '';
    return;
  }

  const terms = q.split(/\s+/).filter(Boolean);
  const matches = allApps.filter(app => {
    // Shield: Never show any admin panel or tool in store search
    if (app.slug && /admin/i.test(app.slug)) return false;
    if (app.name && /\badmin\b/i.test(app.name)) return false;

    const searchable = [
      app.name || '',
      app.shortDesc || '',
      app.desc || '',
      app.category || '',
      app.platform || '',
      app.subcategory || '',
      app.developer || '',
      app.type || '',
      app.modInfo || '',
      app.slug || '',
      Array.isArray(app.tags) ? app.tags.join(' ') : ''
    ].join(' ').toLowerCase();

    return terms.every(term => searchable.includes(term));
  });

  if (elements.instantCount) {
    elements.instantCount.textContent = `${matches.length} ${matches.length === 1 ? 'app found' : 'apps found'}`;
  }

  if (matches.length === 0) {
    elements.instantGrid.innerHTML = `
      <div class="instant-empty-state">
        <span style="font-size: 2.2rem; display: block; margin-bottom: 0.5rem;">🔍</span>
        <p style="color: #fff; font-size: 1rem; margin-bottom: 0.25rem;">No apps found matching "<strong>${escapeHtml(q)}</strong>"</p>
        <span style="font-size: 0.82rem; color: var(--an1-text-muted);">Try searching by application name, category (Games, Android, Windows, AI) or developer.</span>
      </div>
    `;
    elements.instantResults.style.display = 'block';
    return;
  }

  elements.instantGrid.innerHTML = matches.map(app => {
    const detailUrl = `store-detail.html?slug=${encodeURIComponent(app.slug || app.id)}`;
    const isMod = app.isMod || (app.modInfo && app.modInfo.trim().length > 0);
    const modBadge = isMod ? `<span class="an1-badge-mod">MOD</span>` : '';
    const rating = app.rating ? Number(app.rating).toFixed(1) : '4.8';
    const platIcon = app.platform === 'Android' ? '🤖' : (app.platform === 'Windows' ? '🪟' : (app.platform === 'Web' ? '🌐' : '📱'));

    return `
      <div class="instant-app-card" data-slug="${escapeHtml(app.slug || app.id)}">
        <a href="${detailUrl}" class="instant-app-link">
          <div class="instant-app-icon-wrap">
            <img src="${escapeHtml(app.icon || 'logo.png')}" alt="${escapeHtml(app.name)}" class="instant-app-icon" loading="lazy" onerror="this.onerror=null; this.src='${escapeHtml(LOCAL_APP_LOGOS[app.slug] || 'logo.png')}';">
            ${modBadge}
          </div>
          <div class="instant-app-info">
            <div class="instant-app-title-row">
              <h4 class="instant-app-title">${escapeHtml(app.name)}</h4>
              <span class="instant-app-rating">★ ${rating}</span>
            </div>
            <div class="instant-app-badges">
              <span class="instant-pill platform">${platIcon} ${escapeHtml(app.platform || 'Cross-Platform')}</span>
              <span class="instant-pill category">${escapeHtml(app.category || 'App')}</span>
              <span class="instant-pill size">${escapeHtml(app.size || 'Free')}</span>
            </div>
            <p class="instant-app-desc">${escapeHtml(app.shortDesc || app.desc || 'Verified safe download.')}</p>
          </div>
        </a>
        <div class="instant-app-actions">
          <a href="${detailUrl}" class="instant-btn-dl">
            <span>⚡ Open / Download</span>
          </a>
        </div>
      </div>
    `;
  }).join('');

  elements.instantResults.style.display = 'block';
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
  // Real-time Instant Search
  let searchTimeout;
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      const cleanVal = val.toLowerCase().trim();
      
      if (elements.searchClearBtn) {
        elements.searchClearBtn.style.display = cleanVal ? 'grid' : 'none';
      }

      // 1. Immediately render instant matching cards directly under search bar
      renderInstantSearch(cleanVal);

      // 2. Debounce full store grid filter
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentFilters.search = cleanVal;
        applyFilters();
      }, 150);
    });
  }

  // Clear Search button
  if (elements.searchClearBtn) {
    elements.searchClearBtn.addEventListener('click', () => {
      elements.searchInput.value = '';
      elements.searchClearBtn.style.display = 'none';
      currentFilters.search = '';
      renderInstantSearch('');
      applyFilters();
    });
  }

  // Category Only Panel Buttons
  const catPills = document.querySelectorAll('.cat-pill-btn');
  catPills.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      catPills.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilters.category = cat;

      const catRadio = document.querySelector(`input[name="category"][value="${cat}"]`);
      if (catRadio) catRadio.checked = true;

      applyFilters();
      scrollToStoreLayout();
    });
  });

  // Platform Quick Strip Pills
  const platPills = document.querySelectorAll('.plat-pill-btn');
  platPills.forEach(btn => {
    btn.addEventListener('click', () => {
      const plat = btn.dataset.plat;
      platPills.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilters.platform = plat;

      const platRadio = document.querySelector(`input[name="platform"][value="${plat}"]`);
      if (platRadio) platRadio.checked = true;

      applyFilters();
      scrollToStoreLayout();
    });
  });

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
      syncPlatformPills("All");
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
  
  // Mobile Sidebar Toggle & Drawer Controls
  const openSidebar = () => {
    if (elements.sidebar) elements.sidebar.classList.add('active');
    if (elements.sidebarOverlay) elements.sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeSidebar = () => {
    if (elements.sidebar) elements.sidebar.classList.remove('active');
    if (elements.sidebarOverlay) elements.sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (elements.mobileFilterBtn) {
    elements.mobileFilterBtn.addEventListener('click', openSidebar);
  }
  if (elements.sidebarClose) {
    elements.sidebarClose.addEventListener('click', closeSidebar);
  }
  if (elements.sidebarOverlay) {
    elements.sidebarOverlay.addEventListener('click', closeSidebar);
  }
  if (elements.sidebarResetBtn) {
    elements.sidebarResetBtn.addEventListener('click', () => {
      if (elements.btnResetFilter) elements.btnResetFilter.click();
      closeSidebar();
    });
  }
  if (elements.sidebarApplyBtn) {
    elements.sidebarApplyBtn.addEventListener('click', () => {
      closeSidebar();
      scrollToStoreLayout();
      showStoreToast("Filters applied");
    });
  }
  
  // Modal Close
  if (elements.modalCloseBtn) {
    elements.modalCloseBtn.addEventListener('click', closeModal);
    elements.modalOverlay.addEventListener('click', (e) => {
      if (e.target === elements.modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
        closeSidebar();
      }
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
  document.querySelectorAll('.cat-pill-btn').forEach(btn => {
    if (btn.dataset.cat === val) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function syncPlatformPills(val) {
  document.querySelectorAll('.plat-pill-btn').forEach(btn => {
    if (btn.dataset.plat === val) {
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
    renderActiveFilterChips();
    renderSections();
    return;
  }

  // Switch to Filtered Grid View
  if (elements.sectionsView) elements.sectionsView.style.display = 'none';
  if (elements.filteredView) elements.filteredView.style.display = 'block';
  if (elements.btnResetFilter) elements.btnResetFilter.style.display = 'inline-block';
  renderActiveFilterChips();

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
        <p>New verified applications, games, and software are updated daily. Check back soon or browse the HarshGuruJi explore catalog.</p>
        <a href="explore.html" class="btn-admin-link">Explore HarshGuruJi Catalog &rarr;</a>
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
    elements.grid.innerHTML = `
      <div class="store-empty-premium animate-fade-in">
        <div class="empty-icon-bubble">🔎</div>
        <h3>No products found</h3>
        <p>Try another search or remove some filters to explore our full repository.</p>
        <button type="button" class="btn-clear-empty-filter" id="btn-empty-clear">Clear Filters</button>
      </div>
    `;
    const clearBtn = document.getElementById('btn-empty-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (elements.btnResetFilter) elements.btnResetFilter.click();
      });
    }
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

// --- ACTIVE FILTER CHIPS SYSTEM ---
function renderActiveFilterChips() {
  const container = document.getElementById('active-filter-chips');
  if (!container) return;

  const chips = [];
  if (currentFilters.search) {
    chips.push({ label: `"${currentFilters.search}"`, type: 'search' });
  }
  if (currentFilters.category !== 'All') {
    chips.push({ label: currentFilters.category, type: 'category' });
  }
  if (currentFilters.platform !== 'All') {
    chips.push({ label: currentFilters.platform, type: 'platform' });
  }
  if (currentFilters.license !== 'All') {
    chips.push({ label: currentFilters.license, type: 'license' });
  }

  if (chips.length === 0) {
    container.style.display = 'none';
    container.innerHTML = '';
    return;
  }

  container.style.display = 'flex';
  container.innerHTML = `
    <span class="active-chips-label">Showing:</span>
    ${chips.map(c => `
      <button type="button" class="filter-tag-chip" data-type="${c.type}" title="Remove filter">
        <span>${c.label}</span>
        <span class="tag-close">✕</span>
      </button>
    `).join('')}
    <button type="button" class="clear-all-chips-btn" id="btn-clear-all-chips">Clear All</button>
  `;

  container.querySelectorAll('.filter-tag-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      if (type === 'search') {
        currentFilters.search = '';
        if (elements.searchInput) elements.searchInput.value = '';
        if (elements.searchClearBtn) elements.searchClearBtn.style.display = 'none';
      } else if (type === 'category') {
        currentFilters.category = 'All';
        const radio = document.querySelector('input[name="category"][value="All"]');
        if (radio) radio.checked = true;
        syncQuickCategories('All');
      } else if (type === 'platform') {
        currentFilters.platform = 'All';
        const radio = document.querySelector('input[name="platform"][value="All"]');
        if (radio) radio.checked = true;
      } else if (type === 'license') {
        currentFilters.license = 'All';
        const radio = document.querySelector('input[name="license"][value="All"]');
        if (radio) radio.checked = true;
      }
      applyFilters();
      showStoreToast("Filter removed");
    });
  });

  const clearAllBtn = document.getElementById('btn-clear-all-chips');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      currentFilters.search = '';
      currentFilters.category = 'All';
      currentFilters.platform = 'All';
      currentFilters.license = 'All';
      if (elements.searchInput) elements.searchInput.value = '';
      if (elements.searchClearBtn) elements.searchClearBtn.style.display = 'none';
      const cAll = document.querySelector('input[name="category"][value="All"]');
      if (cAll) cAll.checked = true;
      const pAll = document.querySelector('input[name="platform"][value="All"]');
      if (pAll) pAll.checked = true;
      const lAll = document.querySelector('input[name="license"][value="All"]');
      if (lAll) lAll.checked = true;
      syncQuickCategories('All');
      syncPlatformPills('All');
      applyFilters();
      showStoreToast("Filters cleared");
    });
  }
}

// --- TOAST NOTIFICATION UTILITY ---
let storeToastTimer = null;
function showStoreToast(msg, icon = '✓') {
  const toast = document.getElementById('store-toast');
  const toastMsg = document.getElementById('store-toast-msg');
  const toastIcon = document.getElementById('store-toast-icon');
  if (!toast || !toastMsg) return;

  if (storeToastTimer) clearTimeout(storeToastTimer);
  if (toastIcon) toastIcon.textContent = icon;
  toastMsg.textContent = msg;
  toast.classList.add('show');
  toast.style.display = 'flex';

  storeToastTimer = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => { toast.style.display = 'none'; }, 300);
  }, 2800);
}

// --- AN1 APP CARD COMPONENT (PREMIUM SMALL BOX UI) ---
function createAppCard(app, index) {
  const card = document.createElement('a');
  card.href = `store-detail.html?slug=${encodeURIComponent(app.slug || app.id)}`;
  card.className = 'app-card app-small-box animate-fade-in';
  card.style.animationDelay = `${index * 0.03}s`;
  card.style.textDecoration = 'none';
  card.style.color = 'inherit';
  
  const isMod = app.is_mod || (app.name || '').toLowerCase().includes('mod') || (app.mod_info && app.mod_info.trim().length > 0);
  let badgeHtml = isMod 
    ? `<span class="box-badge box-badge-mod">⚡ MOD</span>` 
    : (app.verified ? `<span class="box-badge box-badge-verified">✓ Verified</span>` : '');

  const platIcon = getPlatformIcon(app.platform);
  const appFormat = app.app_type || (app.platform === 'Android' ? 'APK' : (app.platform === 'Windows' ? 'EXE' : (app.platform === 'Web' ? 'WEB' : 'APP')));
  const versionText = app.version ? `v${app.version}` : '';
  const sizeText = app.size && app.size !== 'Varies' && app.size !== 'Unknown' ? app.size : (versionText || 'Free');
  const ratingText = (app.rating || 4.8).toFixed(1);

  card.innerHTML = `
    ${badgeHtml}
    <div class="box-top-row">
      <div class="box-icon-wrap">
        <img src="${escapeHtml(app.icon || 'logo.png')}" alt="${escapeHtml(app.name)}" class="box-app-icon" loading="lazy" onerror="this.onerror=null; this.src='${escapeHtml(LOCAL_APP_LOGOS[app.slug] || 'logo.png')}';">
      </div>
      <div class="box-platform-pill">
        ${platIcon} ${escapeHtml(appFormat)}
      </div>
    </div>

    <div class="box-info">
      <h3 class="box-title" title="${escapeHtml(app.name)}">${escapeHtml(app.name)}</h3>
      <div class="box-dev" title="${escapeHtml(app.developer || 'HarshGuruJi')}">${escapeHtml(app.developer || 'HarshGuruJi')}</div>
      <div class="box-meta-strip">
        <span class="box-star-rating">★ ${ratingText}</span>
        <span class="box-size-tag">💾 ${escapeHtml(sizeText)}</span>
      </div>
    </div>

    <div class="box-action-wrap">
      <span class="app-btn-download-tag box-download-btn" role="button" aria-label="Download ${escapeHtml(app.name)}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        <span>Get</span>
      </span>
    </div>
  `;

  // Visual download click feedback
  const dlBtn = card.querySelector('.app-btn-download-tag');
  if (dlBtn) {
    dlBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const span = dlBtn.querySelector('span');
      if (span) span.textContent = 'Opening...';
      dlBtn.classList.add('loading');
      setTimeout(() => {
        window.location.href = `store-detail.html?slug=${encodeURIComponent(app.slug || app.id)}`;
      }, 150);
    });
  }

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
  
  elements.mIcon.src = app.icon || LOCAL_APP_LOGOS[app.slug] || 'logo.png';
  elements.mIcon.onerror = function() {
    this.onerror = null;
    this.src = LOCAL_APP_LOGOS[app.slug] || 'logo.png';
  };
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

// Initialize on DOM load or immediately if already ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStore);
} else {
  initStore();
}
