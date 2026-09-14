document.addEventListener('DOMContentLoaded', () => {
    const filterContainer = document.querySelector('.hub-filters');
    const categories = ['Programming', 'Science', 'Web Development'];
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
        const learningHub = new HubManager({
            dataPath: 'data/learning.json',
            gridId: 'hub-grid',
            renderCard: (item) => `
                <a href="${item.url || '#'}" class="hub-card">
                    <div class="hub-card-content">
                        <span class="hub-card-badge">${item.category || ''} • ${item.level || ''}</span>
                        <h3 class="hub-card-title">${item.title || ''}</h3>
                        <p class="hub-card-desc">${item.description || ''}</p>
                        <div class="hub-card-footer">
                            <span style="font-size:0.85rem; color:var(--hub-text-secondary)">${item.duration || ''}</span>
                            <span class="hub-btn primary">Start Learning →</span>
                        </div>
                    </div>
                </a>
            `
        });
    }
});
