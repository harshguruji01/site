document.addEventListener('DOMContentLoaded', () => {
    const filterContainer = document.querySelector('.hub-filters');
    const categories = ['Action', 'Adventure', 'Sports'];
    if (filterContainer) {
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'hub-filter-btn';
            btn.dataset.filter = cat;
            btn.textContent = cat;
            filterContainer.appendChild(btn);
        });
    }

    if (typeof HubManager !== 'undefined') {
        const gamingHub = new HubManager({
            dataPath: 'data/gaming.json',
            gridId: 'hub-grid',
            renderCard: (item) => `
                <a href="${item.url || '#'}" class="hub-card">
                    <img src="${item.image || ''}" alt="${item.title || ''}" class="hub-card-image">
                    <div class="hub-card-content">
                        <span class="hub-card-badge">${item.category || ''} • ${item.platform || ''}</span>
                        <h3 class="hub-card-title">${item.title || ''}</h3>
                        <p class="hub-card-desc">${item.description || ''}</p>
                        <div class="hub-card-footer">
                            <span class="hub-btn primary">View Details</span>
                        </div>
                    </div>
                </a>
            `
        });
    }
});
