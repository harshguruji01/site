/**
 * hub-core.js
 * Shared logic for the AI, Tools, Learning, and Gaming Hubs.
 */

class HubManager {
    constructor(config) {
        this.dataPath = config.dataPath;
        this.gridId = config.gridId;
        this.renderCard = config.renderCard; // Function to render a specific type of card
        
        this.data = [];
        this.filteredData = [];
        this.activeFilter = 'All';
        this.searchQuery = '';

        this.initDOM();
        this.bindEvents();
        this.loadData();
    }

    initDOM() {
        this.grid = document.getElementById(this.gridId);
        this.searchInput = document.getElementById('hub-search');
        this.clearBtn = document.getElementById('hub-search-clear');
        this.filterBtns = document.querySelectorAll('.hub-filter-btn');
    }

    bindEvents() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', this.debounce((e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.updateClearButton();
                this.applyFilters();
            }, 300));

            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.clearSearch();
            });
        }

        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearSearch());
        }

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active state visually
                this.filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                this.activeFilter = e.target.dataset.filter;
                this.applyFilters();
            });
        });
    }

    async loadData() {
        this.showSkeletons();
        try {
            const response = await fetch(this.dataPath);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const json = await response.json();
            this.data = json.data || [];
            this.filteredData = [...this.data];
            this.render();
        } catch (error) {
            console.error(`Error loading data from ${this.dataPath}:`, error);
            this.showError();
        }
    }

    applyFilters() {
        this.filteredData = this.data.filter(item => {
            // Check Category Filter
            const matchesFilter = this.activeFilter === 'All' || item.category === this.activeFilter || (item.tags && item.tags.includes(this.activeFilter));
            
            // Check Search Query
            const searchableText = `${item.title} ${item.description} ${item.category} ${(item.tags || []).join(' ')}`.toLowerCase();
            const matchesSearch = this.searchQuery === '' || searchableText.includes(this.searchQuery);

            return matchesFilter && matchesSearch;
        });

        this.render();
    }

    render() {
        if (!this.grid) return;
        
        this.grid.innerHTML = ''; // Clear current

        if (this.filteredData.length === 0) {
            this.showEmptyState();
            return;
        }

        const fragment = document.createDocumentFragment();
        this.filteredData.forEach(item => {
            const cardHTML = this.renderCard(item);
            const div = document.createElement('div');
            div.innerHTML = cardHTML.trim();
            fragment.appendChild(div.firstChild);
        });

        this.grid.appendChild(fragment);
    }

    clearSearch() {
        if (!this.searchInput) return;
        this.searchInput.value = '';
        this.searchQuery = '';
        this.updateClearButton();
        this.applyFilters();
        this.searchInput.focus();
    }

    updateClearButton() {
        if (this.clearBtn) {
            this.clearBtn.style.display = this.searchQuery.length > 0 ? 'block' : 'none';
        }
    }

    showSkeletons(count = 6) {
        if (!this.grid) return;
        this.grid.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'hub-skeleton skeleton-card';
            this.grid.appendChild(skeleton);
        }
    }

    showEmptyState() {
        if (!this.grid) return;
        this.grid.innerHTML = `
            <div class="hub-empty-state">
                <div class="hub-empty-icon">🔍</div>
                <h3>No results found</h3>
                <p>We couldn't find anything matching your search or filter.</p>
                <button class="hub-btn" onclick="document.getElementById('hub-search-clear').click()">Clear Search</button>
            </div>
        `;
    }

    showError() {
        if (!this.grid) return;
        this.grid.innerHTML = `
            <div class="hub-empty-state">
                <div class="hub-empty-icon">⚠️</div>
                <h3>Unable to load content</h3>
                <p>There was a problem connecting to the server. Please try again later.</p>
                <button class="hub-btn primary" onclick="location.reload()">Try Again</button>
            </div>
        `;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}
