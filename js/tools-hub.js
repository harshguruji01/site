document.addEventListener('DOMContentLoaded', () => {
    // Tools Hub logic
    const filterContainer = document.querySelector('.hub-filters');
    const categories = ['Text', 'Utilities', 'Developer'];
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'hub-filter-btn';
        btn.dataset.filter = cat;
        btn.textContent = cat;
        filterContainer.appendChild(btn);
    });

    // Create the functional tool modal/container area
    const mainContent = document.querySelector('.hub-container');
    const toolArea = document.createElement('div');
    toolArea.id = 'functional-tool-area';
    toolArea.className = 'tool-interface';
    toolArea.innerHTML = 
        <h2 id="ft-title" style="margin-top:0">Tool</h2>
        <p id="ft-desc" style="color:var(--hub-text-secondary); margin-bottom:1.5rem;"></p>
        <textarea id="ft-input" class="tool-textarea" placeholder="Enter text here..."></textarea>
        <div id="ft-actions" class="tool-actions"></div>
        <div id="ft-result" style="margin-top:1.5rem; white-space:pre-wrap; word-break:break-all;"></div>
        <button id="ft-close" class="hub-btn" style="margin-top:1.5rem">Close Tool</button>
    ;
    mainContent.insertBefore(toolArea, document.querySelector('.hub-search-section'));

    document.getElementById('ft-close').addEventListener('click', () => {
        toolArea.classList.remove('active');
        document.getElementById('ft-input').value = '';
        document.getElementById('ft-result').textContent = '';
    });

    window.openFunctionalTool = (toolId) => {
        const tool = toolsHub.data.find(t => t.id === toolId);
        if(!tool) return;
        
        toolArea.classList.add('active');
        document.getElementById('ft-title').textContent = tool.title;
        document.getElementById('ft-desc').textContent = tool.description;
        
        const actionsDiv = document.getElementById('ft-actions');
        actionsDiv.innerHTML = '';
        const input = document.getElementById('ft-input');
        const result = document.getElementById('ft-result');
        input.value = '';
        result.innerHTML = '';

        if(tool.action === 'openTextCounter') {
            const countBtn = document.createElement('button');
            countBtn.className = 'hub-btn primary';
            countBtn.textContent = 'Count';
            countBtn.onclick = () => {
                const text = input.value;
                result.innerHTML = <strong>Characters:</strong>  + text.length +  <br><strong>Words:</strong>  + (text.trim() === '' ? 0 : text.trim().split(/\s+/).length);
            };
            actionsDiv.appendChild(countBtn);
        } else if(tool.action === 'openCaseConverter') {
            const upBtn = document.createElement('button');
            upBtn.className = 'hub-btn primary'; upBtn.textContent = 'UPPERCASE';
            upBtn.onclick = () => { input.value = input.value.toUpperCase(); };
            
            const lowBtn = document.createElement('button');
            lowBtn.className = 'hub-btn primary'; lowBtn.textContent = 'lowercase';
            lowBtn.onclick = () => { input.value = input.value.toLowerCase(); };
            
            actionsDiv.appendChild(upBtn);
            actionsDiv.appendChild(lowBtn);
        } else if(tool.action === 'openBase64') {
            const encBtn = document.createElement('button');
            encBtn.className = 'hub-btn primary'; encBtn.textContent = 'Encode';
            encBtn.onclick = () => { try { result.textContent = btoa(input.value); } catch(e){ result.textContent = 'Error encoding'; } };
            
            const decBtn = document.createElement('button');
            decBtn.className = 'hub-btn primary'; decBtn.textContent = 'Decode';
            decBtn.onclick = () => { try { result.textContent = atob(input.value); } catch(e){ result.textContent = 'Error decoding'; } };
            
            actionsDiv.appendChild(encBtn);
            actionsDiv.appendChild(decBtn);
        }
        
        toolArea.scrollIntoView({behavior: 'smooth', block: 'start'});
    };

    const toolsHub = new HubManager({
        dataPath: 'data/tools.json',
        gridId: 'hub-grid',
        renderCard: (item) => 
            <div class="hub-card" onclick="window.openFunctionalTool('$')" style="cursor:pointer">
                <div class="hub-card-icon" style="font-size:2rem; padding-bottom:1rem">??</div>
                <div class="hub-card-content">
                    <span class="hub-card-badge">$</span>
                    <h3 class="hub-card-title">$</h3>
                    <p class="hub-card-desc">$</p>
                    <div class="hub-card-footer">
                        <span class="hub-btn primary">Use Tool</span>
                    </div>
                </div>
            </div>
        
    });
});
