window.CurriculumEngine = (function() {
    
    // Core state
    let curriculumData = null;
    
    // Utility to get URL parameters
    function getParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }
    
    // Load JSON data
    async function loadData() {
        if(curriculumData) return curriculumData;
        try {
            const res = await fetch(`data/curriculum.json?t=${new Date().getTime()}`);
            if(!res.ok) throw new Error("Failed to fetch curriculum");
            curriculumData = await res.json();
            return curriculumData;
        } catch(e) {
            console.error(e);
            return null;
        }
    }
    
    // --- CLASS DASHBOARD ---
    async function initClassDashboard() {
        const classId = getParam('id');
        const data = await loadData();
        
        if(!data || !data.classes[classId]) {
            document.getElementById('page-title').textContent = "Class Not Found";
            return;
        }
        
        const classObj = data.classes[classId];
        
        document.getElementById('bc-class').textContent = `Class ${classId}`;
        document.getElementById('page-title').textContent = classObj.name;
        document.getElementById('page-subtitle').textContent = classObj.description;
        
        // Render Subjects
        const subjectList = document.getElementById('subject-list');
        subjectList.innerHTML = '';
        
        classObj.subjects.forEach(sub => {
            const a = document.createElement('a');
            a.className = 'subject-card';
            a.href = `subject.html?class=${classId}&sub=${sub.id}`;
            a.innerHTML = `
                <div class="subject-icon">${sub.icon}</div>
                <div class="subject-name">${sub.name}</div>
            `;
            subjectList.appendChild(a);
        });
        
        // Dummy Progress (Would come from localStorage)
        const progress = Math.floor(Math.random() * 40) + 10; 
        document.getElementById('progress-text').textContent = progress + "%";
        document.getElementById('progress-fill').style.width = progress + "%";
    }

    // --- SUBJECT DASHBOARD ---
    async function initSubjectDashboard() {
        const classId = getParam('class');
        const subId = getParam('sub');
        const data = await loadData();
        
        if(!data || !data.classes[classId]) {
            document.getElementById('page-title').textContent = "Data Not Found";
            return;
        }
        
        const classObj = data.classes[classId];
        const subjectObj = classObj.subjects.find(s => s.id === subId);
        
        if(!subjectObj) {
            document.getElementById('page-title').textContent = "Subject Not Found";
            return;
        }
        
        // Breadcrumbs
        const bc = document.getElementById('breadcrumbs');
        bc.innerHTML = `
            <a href="../index.html">Home</a> &gt; 
            <a href="../learning.html">Learning Hub</a> &gt; 
            <a href="class.html?id=${classId}">Class ${classId}</a> &gt; 
            <span>${subjectObj.name}</span>
        `;
        
        document.getElementById('page-title').textContent = subjectObj.name;
        
        const container = document.getElementById('book-container');
        container.innerHTML = '';
        
        if(!subjectObj.books || subjectObj.books.length === 0) {
            container.innerHTML = `<p style="text-align: center; color: var(--hub-text-secondary);">No books found for this subject yet.</p>`;
            return;
        }
        
        // Render Books and Chapters
        subjectObj.books.forEach(book => {
            const bSec = document.createElement('div');
            bSec.className = 'book-section';
            
            bSec.innerHTML = `
                <div class="book-header">
                    <div class="book-title">📘 ${book.title}</div>
                </div>
                <div class="chapter-list">
                    ${book.chapters.map(ch => `
                        <div class="chapter-card">
                            <div class="chap-info">
                                <h3>${ch.chapterNumber ? 'Chapter ' + ch.chapterNumber + ': ' : ''}${ch.title}</h3>
                                <p>Topics: ${ch.topics || 0} | Status: ${ch.verified ? '✅ Verified NCERT' : 'Draft'}</p>
                            </div>
                            <div class="chap-actions">
                                <a href="chapter.html?id=${ch.id}&c=${classId}&s=${subId}&pdf=${encodeURIComponent(ch.pdf_link || '')}" class="action-btn study">📖 Study</a>
                                <a href="#" class="action-btn" onclick="alert('Practice module coming soon!')">📝 Practice</a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            container.appendChild(bSec);
        });
    }

    // --- CHAPTER LEARNING INTERFACE ---
    async function initChapterLearning() {
        const chapterId = getParam('id');
        const classId = getParam('c');
        const subId = getParam('s');
        const pdfLink = getParam('pdf');
        
        const data = await loadData();
        
        if(!data || !data.classes[classId]) return;
        
        const classObj = data.classes[classId];
        const subjectObj = classObj.subjects.find(s => s.id === subId);
        
        // Find chapter title from tree
        let chapterTitle = "Chapter";
        subjectObj.books.forEach(b => {
            b.chapters.forEach(c => {
                if(c.id === chapterId) {
                    chapterTitle = (c.chapterNumber ? `Ch ${c.chapterNumber}: ` : '') + c.title;
                }
            });
        });
        
        document.getElementById('chapter-title').textContent = chapterTitle;
        
        // Breadcrumbs
        const bc = document.getElementById('bc-container');
        bc.innerHTML = `
            <a href="class.html?id=${classId}">Class ${classId}</a> &gt; 
            <a href="subject.html?class=${classId}&sub=${subId}">${subjectObj.name}</a>
        `;
        
        // Sidebar Navigation Logic
        const navItems = document.querySelectorAll('.nav-item');
        const contentBoxes = document.querySelectorAll('.content-box');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navItems.forEach(n => n.classList.remove('active'));
                contentBoxes.forEach(b => b.classList.remove('active'));
                
                item.classList.add('active');
                document.getElementById('sec-' + item.dataset.target).classList.add('active');
                
                // If PDF is selected, load the iframe if it's not loaded
                if(item.dataset.target === 'pdf') {
                    const iframe = document.getElementById('pdf-viewer');
                    if(pdfLink && !iframe.src.includes(pdfLink)) {
                        let path = decodeURIComponent(pdfLink);
                        if(path.startsWith('learning/')) path = path.replace('learning/', '');
                        iframe.src = path;
                    }
                }
            });
        });
        
        // Load Chapter Content Data (from chapter_content block)
        if(data.chapter_content && data.chapter_content[chapterId]) {
            const chData = data.chapter_content[chapterId];
            
            document.getElementById('content-overview').innerHTML = `<p>${chData.overview}</p>`;
            
            const objUl = document.getElementById('content-objectives');
            objUl.innerHTML = chData.objectives.map(o => `<li>${o}</li>`).join('');
            
            const topicsDiv = document.getElementById('content-topics');
            topicsDiv.innerHTML = chData.topics.map(t => `
                <div style="background: rgba(59,130,246,0.05); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--hub-border);">
                    <h3 style="color: var(--hub-text-primary); margin-bottom: 0.75rem;">${t.title}</h3>
                    <p style="color: var(--hub-text-secondary); line-height: 1.6;">${t.content}</p>
                </div>
            `).join('');
            
            const impUl = document.getElementById('content-important');
            impUl.innerHTML = chData.important_points.map(i => `<li style="margin-bottom: 0.5rem;">${i}</li>`).join('');
        } else {
            // Placeholder for chapters without detailed data in json yet
            document.getElementById('content-overview').innerHTML = `<p>Detailed text content for this chapter is being digitized. Please use the <strong>Read Official PDF</strong> tab to view the NCERT textbook directly.</p>`;
        }
    }

    // Return public API
    return {
        initClassDashboard,
        initSubjectDashboard,
        initChapterLearning
    };

})();
