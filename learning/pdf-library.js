document.addEventListener('DOMContentLoaded', () => {
    // Top Bar Elements
    const classSelect = document.getElementById('class-select');
    const subjectSelect = document.getElementById('subject-select');
    const bookSelect = document.getElementById('book-select');
    const goBtn = document.getElementById('go-btn');
    
    // Viewer Elements
    const sidebar = document.getElementById('sidebar');
    const chapterList = document.getElementById('chapter-list');
    const sidebarTitle = document.getElementById('sidebar-title');
    const pdfFrame = document.getElementById('pdf-frame');
    const placeholderMsg = document.getElementById('placeholder-msg');
    const mobileToggle = document.getElementById('mobile-toggle');

    let allPdfs = [];

    // Fetch the JSON Index
    async function fetchIndex() {
        try {
            const response = await fetch(`ncert_index.json?t=${new Date().getTime()}`);
            if (response.ok) {
                allPdfs = await response.json();
            } else {
                console.error("Failed to load ncert_index.json");
            }
        } catch (error) {
            console.error("Error fetching PDFs:", error);
        }
    }

    // 1. When Class is selected -> Populate Subjects
    classSelect.addEventListener('change', () => {
        const selectedClass = classSelect.value;
        
        // Reset cascading dropdowns
        subjectSelect.innerHTML = '<option value="" disabled selected>-- Select Subject --</option>';
        bookSelect.innerHTML = '<option value="" disabled selected>-- Select Book Title --</option>';
        bookSelect.disabled = true;
        goBtn.disabled = true;
        
        if (!selectedClass) return;
        
        // Find available subjects for this class
        const classPdfs = allPdfs.filter(pdf => String(pdf.class) === String(selectedClass));
        const subjects = [...new Set(classPdfs.map(p => p.subject))].sort();
        
        if (subjects.length > 0) {
            subjectSelect.disabled = false;
            subjects.forEach(sub => {
                const opt = document.createElement('option');
                opt.value = sub;
                opt.textContent = sub;
                subjectSelect.appendChild(opt);
            });
        } else {
            subjectSelect.disabled = true;
        }
    });

    // 2. When Subject is selected -> Populate Books
    subjectSelect.addEventListener('change', () => {
        const selectedClass = classSelect.value;
        const selectedSubject = subjectSelect.value;
        
        // Reset Book dropdown
        bookSelect.innerHTML = '<option value="" disabled selected>-- Select Book Title --</option>';
        goBtn.disabled = true;
        
        if (!selectedSubject) return;
        
        // Find available books for this class + subject
        const classSubPdfs = allPdfs.filter(pdf => 
            String(pdf.class) === String(selectedClass) && 
            pdf.subject === selectedSubject
        );
        const books = [...new Set(classSubPdfs.map(p => p.book))].sort();
        
        if (books.length > 0) {
            bookSelect.disabled = false;
            books.forEach(bk => {
                const opt = document.createElement('option');
                opt.value = bk;
                opt.textContent = bk;
                bookSelect.appendChild(opt);
            });
        } else {
            bookSelect.disabled = true;
        }
    });

    // 3. When Book is selected -> Enable GO button
    bookSelect.addEventListener('change', () => {
        if (bookSelect.value) {
            goBtn.disabled = false;
        } else {
            goBtn.disabled = true;
        }
    });

    // 4. When GO is clicked -> Load Sidebar
    goBtn.addEventListener('click', () => {
        const selectedClass = classSelect.value;
        const selectedSubject = subjectSelect.value;
        const selectedBook = bookSelect.value;
        
        // Get all chapters for this book
        const bookChapters = allPdfs.filter(pdf => 
            String(pdf.class) === String(selectedClass) && 
            pdf.subject === selectedSubject && 
            pdf.book === selectedBook
        ).sort((a, b) => {
            // Try to sort by chapter number if it exists
            const numA = parseInt(a.chapter_number) || 999;
            const numB = parseInt(b.chapter_number) || 999;
            return numA - numB;
        });
        
        sidebarTitle.textContent = selectedBook;
        chapterList.innerHTML = '';
        pdfFrame.src = '';
        placeholderMsg.style.display = 'block';
        
        if (bookChapters.length === 0) {
            chapterList.innerHTML = '<li style="padding: 1rem; color: #f87171;">No chapters found.</li>';
            return;
        }
        
        // Render Chapters
        bookChapters.forEach((chapter, index) => {
            const li = document.createElement('li');
            li.className = 'chapter-item';
            
            // Format chapter name
            const chTitle = chapter.chapter_number ? `Chapter ${chapter.chapter_number}` : chapter.chapter_name;
            li.innerHTML = `📄 <span>${chTitle}</span>`;
            
            // Adjust filepath correctly
            let filePath = chapter.pdf_path;
            if (filePath.startsWith('learning/')) {
                filePath = filePath.replace('learning/', '');
            }
            
            // Add click listener to load into iframe
            li.addEventListener('click', () => {
                // Remove active class from all
                document.querySelectorAll('.chapter-item').forEach(item => item.classList.remove('active'));
                li.classList.add('active');
                
                // Load PDF in iframe
                pdfFrame.src = filePath + "#toolbar=0"; // Attempt to hide toolbar if supported by browser native viewer
                placeholderMsg.style.display = 'none';
                
                // On mobile, auto-collapse sidebar when a chapter is clicked
                if (window.innerWidth <= 768) {
                    sidebar.classList.add('collapsed');
                }
            });
            
            chapterList.appendChild(li);
        });
        
        // Add a "Download Book" button if needed at the bottom
        // You could check if a single full-book PDF exists, but for now we just show a placeholder
        const downloadBtn = document.createElement('a');
        downloadBtn.className = 'download-all-btn';
        downloadBtn.textContent = 'Download Complete Book';
        downloadBtn.href = '#';
        downloadBtn.onclick = (e) => {
            e.preventDefault();
            alert("To download individual chapters, right-click the chapter PDF or use the browser's save option in the viewer!");
        };
        chapterList.appendChild(downloadBtn);
        
        // Show sidebar on mobile if it was collapsed
        sidebar.classList.remove('collapsed');
    });

    // Mobile sidebar toggle
    mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // Initialize
    fetchIndex();
});
