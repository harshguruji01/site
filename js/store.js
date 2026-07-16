// js/store.js
let appsData = [];
let displayedCount = 0;
const BATCH_SIZE = 6; // Load 6 at a time for pagination/lazy loading
let currentFilteredApps = [];

document.addEventListener('DOMContentLoaded', () => {
  // Fetch apps
  fetch('data/apps.json')
    .then(res => res.json())
    .then(data => {
      appsData = data;
      currentFilteredApps = [...appsData];
      renderApps();
    })
    .catch(err => console.error('Error loading apps:', err));

  // Search Listener
  const searchInput = document.getElementById('store-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterApps();
    });
  }

  // Filter Checkbox Listeners
  const checkboxes = document.querySelectorAll('.filter-checkbox');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      filterApps();
    });
  });
  
  // Load More Button
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      renderApps(true);
    });
  }

  // Back to top scroll listener
  const fabToTop = document.getElementById('fab-totop');
  if (fabToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        fabToTop.classList.add('visible');
      } else {
        fabToTop.classList.remove('visible');
      }
    });
  }
});

function filterApps() {
  const searchTerm = document.getElementById('store-search').value.toLowerCase();
  
  // Get active filters
  const platformBoxes = Array.from(document.querySelectorAll('.filter-checkbox.platform:checked')).map(cb => cb.value.toLowerCase());
  const licenseBoxes = Array.from(document.querySelectorAll('.filter-checkbox.license:checked')).map(cb => cb.value.toLowerCase());
  const categoryBoxes = Array.from(document.querySelectorAll('.filter-checkbox.category:checked')).map(cb => cb.value.toLowerCase());

  currentFilteredApps = appsData.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm) || 
                          app.developer.toLowerCase().includes(searchTerm) ||
                          app.description.toLowerCase().includes(searchTerm);
                          
    let matchesPlatform = true;
    if (platformBoxes.length > 0) {
      matchesPlatform = platformBoxes.some(p => Object.keys(app.platforms).includes(p));
    }

    let matchesLicense = true;
    if (licenseBoxes.length > 0) {
      matchesLicense = licenseBoxes.includes(app.license.toLowerCase());
    }

    let matchesCategory = true;
    if (categoryBoxes.length > 0) {
      matchesCategory = categoryBoxes.includes(app.category.toLowerCase());
    }

    return matchesSearch && matchesPlatform && matchesLicense && matchesCategory;
  });

  // Reset display
  displayedCount = 0;
  document.getElementById('app-grid').innerHTML = '';
  renderApps();
}

function renderApps(append = false) {
  const grid = document.getElementById('app-grid');
  const loadMoreBtn = document.getElementById('load-more-btn');
  
  if (!append) {
    grid.innerHTML = '';
    displayedCount = 0;
  }

  const nextBatch = currentFilteredApps.slice(displayedCount, displayedCount + BATCH_SIZE);
  
  if (nextBatch.length === 0 && displayedCount === 0) {
    grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--store-text-muted);">No apps found matching your criteria.</div>';
    loadMoreBtn.style.display = 'none';
    return;
  }

  nextBatch.forEach(app => {
    // Generate platform badges
    let platformBadges = '';
    for (const [os, link] of Object.entries(app.platforms)) {
      platformBadges += <span class="badge-os">\</span>;
    }

    const card = document.createElement('div');
    card.className = 'app-card';
    card.innerHTML = 
      <div class="app-header">
        <img src="\" class="app-icon" alt="\ icon" loading="lazy">
        <div class="app-info">
          <h3>\</h3>
          <div class="dev">\</div>
        </div>
      </div>
      <div class="app-meta">
        \
        <span class="badge-os" style="background: rgba(251, 188, 5, 0.1); color: var(--store-premium); border-color: rgba(251, 188, 5, 0.2);">\</span>
      </div>
      <div class="app-meta">
        \
      </div>
      <p class="app-desc">\</p>
      <div class="app-footer">
        <div class="app-rating">? \ <span>(\)</span></div>
        <button class="btn-view-app" onclick="openAppModal('\')">View Details</button>
      </div>
    ;
    grid.appendChild(card);
  });

  displayedCount += nextBatch.length;
  
  document.getElementById('results-count').textContent = (\ of \);

  if (displayedCount >= currentFilteredApps.length) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'inline-flex';
  }
}

function openAppModal(id) {
  const app = appsData.find(a => a.id === id);
  if (!app) return;

  document.getElementById('modal-app-icon').src = app.icon;
  document.getElementById('modal-title').textContent = app.name;
  document.getElementById('modal-dev').textContent = app.developer;
  document.getElementById('modal-license').textContent = app.license;
  document.getElementById('modal-rating').innerHTML = ? \ <span>(\ Downloads)</span>;
  document.getElementById('modal-desc').textContent = app.description;
  
  // Features
  const featuresList = document.getElementById('modal-features');
  featuresList.innerHTML = '';
  app.features.forEach(f => {
    const li = document.createElement('li');
    li.textContent = f;
    featuresList.appendChild(li);
  });

  // Screenshots
  const ssGallery = document.getElementById('modal-screenshots');
  ssGallery.innerHTML = '';
  if (app.screenshots && app.screenshots.length > 0) {
    app.screenshots.forEach(ss => {
      const img = document.createElement('img');
      img.src = ss;
      img.loading = 'lazy';
      ssGallery.appendChild(img);
    });
  } else {
    ssGallery.innerHTML = '<p style="color: var(--store-text-muted);">No screenshots available.</p>';
  }

  // Requirements
  document.getElementById('req-os').textContent = app.requirements.OS || 'N/A';
  document.getElementById('req-ram').textContent = app.requirements.RAM || 'N/A';
  document.getElementById('req-storage').textContent = app.requirements.Storage || 'N/A';

  // App Info
  document.getElementById('modal-version').textContent = app.version;
  document.getElementById('modal-updated').textContent = app.updatedDate;
  document.getElementById('modal-size').textContent = app.size;
  document.getElementById('modal-category').textContent = app.category;

  // Dynamic Downloads
  const dlContainer = document.getElementById('modal-downloads');
  dlContainer.innerHTML = '';
  
  for (const [os, link] of Object.entries(app.platforms)) {
    const btn = document.createElement('a');
    btn.href = link;
    btn.target = '_blank';
    btn.className = 'btn-os-dl';
    if (os.toLowerCase() === 'windows' || os.toLowerCase() === 'macos') {
      btn.classList.add('primary'); // Highlight desktop OS usually
    }
    btn.innerHTML = Download for \ <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
    btn.onclick = () => showToast(Opening verified official download for \...);
    dlContainer.appendChild(btn);
  }

  document.getElementById('store-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('store-modal').classList.remove('active');
  document.body.style.overflow = 'auto';
}

function showToast(message) {
  const toast = document.getElementById('store-toast');
  if(!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function toggleMobileFilters() {
  const sidebar = document.getElementById('store-sidebar');
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
}

// Close modal on outside click or ESC
window.addEventListener('click', (e) => {
  const modal = document.getElementById('store-modal');
  if (e.target === modal) closeModal();
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

window.openAppModal = openAppModal;
window.closeModal = closeModal;
window.showToast = showToast;
window.toggleMobileFilters = toggleMobileFilters;
