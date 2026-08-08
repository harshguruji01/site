document.addEventListener('DOMContentLoaded', () => {
    // Add specific filters for AI Hub
    const filterContainer = document.querySelector('.hub-filters');
    const categories = ['Chat', 'Image', 'Coding', 'Productivity'];
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'hub-filter-btn';
        btn.dataset.filter = cat;
        btn.textContent = cat;
        filterContainer.appendChild(btn);
    });

    const aiHub = new HubManager({
        dataPath: 'data/ai.json',
        gridId: 'hub-grid',
        renderCard: (item) => 
            <a href="$" target="_blank" class="hub-card">
                <div class="hub-card-icon">
                    <img src="$" alt="$ icon">
                </div>
                <div class="hub-card-content">
                    <span class="hub-card-badge">$ • $</span>
                    <h3 class="hub-card-title">$</h3>
                    <p class="hub-card-desc">$</p>
                    <div class="hub-card-footer">
                        <span class="hub-btn primary">Open Tool ?</span>
                    </div>
                </div>
            </a>
        
    });
});
