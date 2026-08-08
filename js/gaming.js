document.addEventListener('DOMContentLoaded', () => {
    const filterContainer = document.querySelector('.hub-filters');
    const categories = ['Action', 'Adventure', 'Sports'];
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'hub-filter-btn';
        btn.dataset.filter = cat;
        btn.textContent = cat;
        filterContainer.appendChild(btn);
    });

    const gamingHub = new HubManager({
        dataPath: 'data/gaming.json',
        gridId: 'hub-grid',
        renderCard: (item) => 
            <a href="#" class="hub-card">
                <img src="$" alt="$" class="hub-card-image">
                <div class="hub-card-content">
                    <span class="hub-card-badge">$ • $</span>
                    <h3 class="hub-card-title">$</h3>
                    <p class="hub-card-desc">$</p>
                    <div class="hub-card-footer">
                        <span class="hub-btn primary">View Details</span>
                    </div>
                </div>
            </a>
        
    });
});
