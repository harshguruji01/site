document.addEventListener('DOMContentLoaded', () => {
    const filterContainer = document.querySelector('.hub-filters');
    const categories = ['Text', 'Utilities', 'Developer'];
    if (filterContainer) {
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'hub-filter-btn';
            btn.dataset.filter = cat;
            btn.textContent = cat;
            filterContainer.appendChild(btn);
        });
    }

    const modal = document.getElementById('functional-tool-modal');
    if (!modal) {
        const m = document.createElement('div');
        m.id = 'functional-tool-modal';
        m.className = 'tool-modal-overlay';
        m.style.display = 'none';
        m.innerHTML = `
            <div class="tool-modal-content">
                <h2 id="ft-title" style="margin-top:0">Tool</h2>
                <p id="ft-desc" style="color:var(--hub-text-secondary); margin-bottom:1.5rem;"></p>
                <textarea id="ft-input" class="tool-textarea" placeholder="Enter text here..."></textarea>
                <div id="ft-actions" class="tool-actions"></div>
                <div id="ft-result" style="margin-top:1.5rem; white-space:pre-wrap; word-break:break-all;"></div>
                <button id="ft-close" class="hub-btn" style="margin-top:1.5rem">Close Tool</button>
            </div>
        `;
        document.body.appendChild(m);

        document.getElementById('ft-close').addEventListener('click', () => {
            m.style.display = 'none';
        });
    }

    window.openFunctionalTool = function(toolId) {
        const m = document.getElementById('functional-tool-modal');
        const title = document.getElementById('ft-title');
        const desc = document.getElementById('ft-desc');
        const input = document.getElementById('ft-input');
        const actions = document.getElementById('ft-actions');
        const result = document.getElementById('ft-result');

        m.style.display = 'flex';
        input.value = '';
        result.innerHTML = '';
        actions.innerHTML = '';

        if (toolId === 'tl-001' || toolId === 'word-counter') {
            title.textContent = 'Word & Character Counter';
            desc.textContent = 'Count words, characters, and spaces in real-time.';
            input.placeholder = 'Type or paste text to count...';
            input.oninput = () => {
                const text = input.value;
                result.innerHTML = '<strong>Characters:</strong> ' + text.length + '<br><strong>Words:</strong> ' + (text.trim() === '' ? 0 : text.trim().split(/\s+/).length);
            };
        } else {
            title.textContent = 'Utility Tool';
            desc.textContent = 'Interactive tool utility.';
        }
    };

    if (typeof HubManager !== 'undefined') {
        const toolsHub = new HubManager({
            dataPath: 'data/tools.json',
            gridId: 'hub-grid',
            renderCard: (item) => `
                <div class="hub-card" onclick="window.openFunctionalTool('${item.id || ''}')" style="cursor:pointer">
                    <div class="hub-card-icon" style="font-size:2rem; padding-bottom:1rem">🛠️</div>
                    <div class="hub-card-content">
                        <span class="hub-card-badge">${item.category || ''}</span>
                        <h3 class="hub-card-title">${item.title || ''}</h3>
                        <p class="hub-card-desc">${item.description || ''}</p>
                        <div class="hub-card-footer">
                            <span class="hub-btn primary">Use Tool</span>
                        </div>
                    </div>
                </div>
            `
        });
    }
});
