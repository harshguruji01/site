/**
 * ============================================================================
 * HarshGuruJi Books Engine (js/books-engine.js)
 * Official NCERT Digital Library & Universal Search Engine
 * Features:
 * - 1,246+ Official NCERT Textbooks for Classes 1 to 12
 * - Dual-sync: Supabase `ncert_books` + localStorage['wg_admin_books'] + Master NCERT Catalog
 * - Real-time Chapter PDF Viewer & Full Book ZIP Downloader
 * - URL deep links (?class=10, ?q=maths) for Google Search Console indexing
 * ============================================================================
 */
(function () {
  'use strict';

  // Master published books catalog
  let allBooks = [];
  let filteredBooks = [];
  let visibleLimit = 48;

  // Local Offline PDF Cache (Pre-downloaded Core Textbooks)
  const LOCAL_PDFS = {
    'jemh1': 'pdf/jemh101.pdf',
    'jesc1': 'pdf/jesc101.pdf',
    'leph1': 'pdf/leph101.pdf',
    'lech1': 'pdf/lech101.pdf',
    'kebo1': 'pdf/kebo101.pdf',
    'jeff1': 'pdf/jeff101.pdf',
    'iemh1': 'pdf/iemh101.pdf',
    'hesc1': 'pdf/hesc101.pdf',
    'gesc1': 'pdf/gesc101.pdf',
    'aemr1': 'pdf/aemr101.pdf',
    'eemm1': 'pdf/eemm101.pdf',
    'keph1': 'pdf/keph101.pdf',
    'kech1': 'pdf/kech101.pdf',
    'kemh1': 'pdf/kemh101.pdf',
    'lemh1': 'pdf/lemh101.pdf',
    'lebo1': 'pdf/lebo101.pdf'
  };

  // DOM Elements - Finder & Search
  const searchInput = document.getElementById('book-search-input');
  const searchClear = document.getElementById('book-search-clear');
  const searchTagsHint = document.getElementById('search-tags-hint');
  const searchLiveStatus = document.getElementById('search-live-status');
  const searchStatusText = document.getElementById('search-status-text');
  const btnClearSearchStatus = document.getElementById('btn-clear-search-status');

  const selectClass = document.getElementById('select-class');
  const selectSubject = document.getElementById('select-subject');
  const selectBook = document.getElementById('select-book');
  const selectSubbook = document.getElementById('select-subbook');
  const classPillsRow = document.getElementById('class-pills-row');
  const btnReset = document.getElementById('btn-reset-finder');
  const finderSummary = document.getElementById('finder-summary');
  const summaryText = document.getElementById('summary-text');
  const catalogTitle = document.getElementById('catalog-title');

  // Step box wrappers
  const stepBoxClass = document.getElementById('step-box-class');
  const stepBoxSubject = document.getElementById('step-box-subject');
  const stepBoxBook = document.getElementById('step-box-book');
  const stepBoxSubbook = document.getElementById('step-box-subbook');

  // Grid & Counter
  const booksGrid = document.getElementById('books-grid');
  const resultsCount = document.getElementById('results-count');

  // Modal Elements
  const pdfModal = document.getElementById('pdf-modal-overlay');
  const pdfModalTitle = document.getElementById('pdf-modal-book-title');
  const pdfViewerFrame = document.getElementById('pdf-viewer-frame');
  const pdfModalNewtab = document.getElementById('pdf-modal-newtab');
  const pdfModalDownload = document.getElementById('pdf-modal-download');
  const pdfModalZip = document.getElementById('pdf-modal-zip');
  const pdfModalClose = document.getElementById('pdf-modal-close');
  const pdfModalChapterSelect = document.getElementById('pdf-modal-chapter-select');

  // --- INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', async () => {
    setupEventListeners();
    await loadPublishedBooks();
    refreshClassControls();

    // Check URL parameters for SEO and direct deep linking (e.g. ?class=10 or ?q=maths)
    const urlParams = new URLSearchParams(window.location.search);
    const qClass = urlParams.get('class');
    const qSearch = urlParams.get('q') || urlParams.get('search');
    
    if (qSearch && searchInput) {
      searchInput.value = qSearch;
      if (searchClear) searchClear.style.display = 'flex';
    }

    if (qClass) {
      if (selectClass) selectClass.value = qClass;
      onClassSelected(qClass);
    } else {
      applyFilters();
    }
  });

  // Listen for storage events (if admin publishes/uploads a book in another tab)
  window.addEventListener('storage', async (e) => {
    if (e.key === 'wg_admin_books') {
      await loadPublishedBooks();
      refreshClassControls();
      applyFilters();
    }
  });

  // Listen for BroadcastChannel instant cross-tab live sync
  try {
    const bc = new BroadcastChannel('harshguruji_books_sync');
    bc.onmessage = async () => {
      await loadPublishedBooks();
      refreshClassControls();
      applyFilters();
    };
  } catch(e) {}

  // Helper to obtain initialized Supabase client
  function getSupabase() {
    return window.supabaseClient || (window.supabase && typeof window.supabase.createClient === 'function' ?
      window.supabase.createClient(window.SUPABASE_URL || 'https://wumdbpyhpblvgjttsbpv.supabase.co', window.SUPABASE_ANON_KEY || 'sb_publishable_xLqKY9N62MXb6ELG-5trig_RlJs_n-l') : null);
  }

  // --- 1. LOAD MASTER PUBLISHED BOOKS ---
  async function loadPublishedBooks() {
    let published = [];
    let localBooks = [];

    // 1. Read LocalStorage (cached/synced admin books)
    try {
      const local = localStorage.getItem('wg_admin_books');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) localBooks = parsed;
      }
    } catch (e) {
      console.warn('[BooksEngine] Error reading local admin books:', e);
    }

    // 2. Fetch from Supabase `ncert_books` table
    try {
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase.from('ncert_books').select('*').order('created_at', { ascending: false });
        if (!error && Array.isArray(data) && data.length > 0) {
          published = data.map(item => ({
            id: item.id,
            class: String(item.class),
            subject: item.subject,
            book: item.book_title || item.book,
            book_title: item.book_title || item.book,
            code: item.code || '',
            chapters_count: item.chapters_count || 14,
            subbook: item.subbook || item.chapter_name || 'Full Book',
            chapter_name: item.chapter_name || item.subbook || 'Full Book',
            edition: item.edition || 'Rationalised 2024-25 Edition',
            language: item.language || 'English',
            pdf_url: item.pdf_url || item.download_url,
            zip_url: item.zip_url || '',
            cover_url: item.cover_url || '',
            color: item.color || '#6366f1',
            file_size: item.file_size || 'PDF Document',
            created_at: item.created_at
          }));
        }
      }
    } catch (err) {
      console.warn('[BooksEngine] Supabase fetch notice:', err);
    }

    // 3. Merge: Local books (latest admin uploads) take top priority
    let merged = [];
    const seenIds = new Set();

    localBooks.forEach(b => {
      if (b && b.id && !seenIds.has(String(b.id))) {
        seenIds.add(String(b.id));
        merged.push({
          ...b,
          book: b.book || b.book_title,
          subbook: b.subbook || b.chapter_name || 'Full Book'
        });
      }
    });

    published.forEach(b => {
      if (b && b.id && !seenIds.has(String(b.id))) {
        seenIds.add(String(b.id));
        merged.push(b);
      }
    });

    // 4. Merge Official NCERT Master Catalog (1,246+ Textbooks across Classes 1 to 12)
    if (Array.isArray(window.NCERT_MASTER_CATALOG)) {
      window.NCERT_MASTER_CATALOG.forEach(b => {
        if (b && b.id && !seenIds.has(String(b.id))) {
          seenIds.add(String(b.id));
          const localPdf = LOCAL_PDFS[b.code];
          if (localPdf) {
            merged.push({
              ...b,
              local_pdf: localPdf,
              pdf_url: localPdf
            });
          } else {
            merged.push(b);
          }
        }
      });
    }

    allBooks = merged;
  }

  // --- 2. DYNAMICALLY REFRESH CLASS CONTROLS ---
  function refreshClassControls() {
    if (selectClass) {
      const previousValue = selectClass.value;
      selectClass.innerHTML = '<option value="">All Classes (Choose Class)...</option>';

      if (allBooks.length === 0) {
        selectClass.innerHTML = '<option value="">No published books yet</option>';
        selectClass.disabled = true;
      } else {
        selectClass.disabled = false;
        const classCounts = {};
        allBooks.forEach(b => {
          const c = String(b.class).trim();
          classCounts[c] = (classCounts[c] || 0) + 1;
        });

        // Numeric sort classes: 12, 11, 10 ... 1
        const sortedClasses = Object.keys(classCounts).sort((a, b) => {
          const numA = parseInt(a, 10);
          const numB = parseInt(b, 10);
          if (!isNaN(numA) && !isNaN(numB)) return numB - numA;
          return a.localeCompare(b);
        });

        sortedClasses.forEach(cls => {
          const opt = document.createElement('option');
          opt.value = cls;
          opt.textContent = `Class ${cls} (${classCounts[cls]} book${classCounts[cls] > 1 ? 's' : ''})`;
          selectClass.appendChild(opt);
        });

        if (previousValue && classCounts[previousValue]) {
          selectClass.value = previousValue;
        }
      }
    }

    // Refresh Quick Class Pills Row
    if (classPillsRow) {
      if (allBooks.length === 0) {
        classPillsRow.innerHTML = `<button type="button" class="class-pill active" data-class="all">All Classes (0)</button>`;
      } else {
        const classCounts = {};
        allBooks.forEach(b => {
          const c = String(b.class).trim();
          classCounts[c] = (classCounts[c] || 0) + 1;
        });

        const sortedClasses = Object.keys(classCounts).sort((a, b) => {
          const numA = parseInt(a, 10);
          const numB = parseInt(b, 10);
          if (!isNaN(numA) && !isNaN(numB)) return numB - numA;
          return a.localeCompare(b);
        });

        let pillsHtml = `<button type="button" class="class-pill active" data-class="all">All Books (${allBooks.length})</button>`;
        sortedClasses.forEach(cls => {
          pillsHtml += `<button type="button" class="class-pill" data-class="${escapeHtml(cls)}">Class ${escapeHtml(cls)} (${classCounts[cls]})</button>`;
        });
        classPillsRow.innerHTML = pillsHtml;
      }
    }
  }

  // --- 3. EVENT LISTENERS ---
  function setupEventListeners() {
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim();
        if (searchClear) searchClear.style.display = q ? 'flex' : 'none';
        visibleLimit = 48;
        applyFilters();
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          visibleLimit = 48;
          applyFilters();
        }
      });
    }

    const btnBookSearch = document.getElementById('btn-book-search');
    if (btnBookSearch) {
      btnBookSearch.addEventListener('click', () => {
        visibleLimit = 48;
        applyFilters();
        if (booksGrid) {
          booksGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        searchClear.style.display = 'none';
        visibleLimit = 48;
        applyFilters();
        if (searchInput) searchInput.focus();
      });
    }

    if (searchTagsHint) {
      searchTagsHint.addEventListener('click', (e) => {
        const chip = e.target.closest('.search-chip');
        if (!chip) return;
        const queryTerm = chip.getAttribute('data-search') || chip.textContent.trim();
        if (searchInput) {
          searchInput.value = queryTerm;
          if (searchClear) searchClear.style.display = 'flex';
          visibleLimit = 48;
          applyFilters();
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }

    if (btnClearSearchStatus) {
      btnClearSearchStatus.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (searchClear) searchClear.style.display = 'none';
        visibleLimit = 48;
        applyFilters();
      });
    }

    if (selectClass) {
      selectClass.addEventListener('change', () => {
        visibleLimit = 48;
        onClassSelected(selectClass.value);
      });
    }

    if (selectSubject) {
      selectSubject.addEventListener('change', () => {
        visibleLimit = 48;
        onSubjectSelected(selectSubject.value);
      });
    }

    if (selectBook) {
      selectBook.addEventListener('change', () => {
        visibleLimit = 48;
        onBookSelected(selectBook.value);
      });
    }

    if (selectSubbook) {
      selectSubbook.addEventListener('change', () => {
        visibleLimit = 48;
        applyFilters();
      });
    }

    if (classPillsRow) {
      classPillsRow.addEventListener('click', (e) => {
        const pill = e.target.closest('.class-pill');
        if (!pill) return;
        document.querySelectorAll('.class-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const cVal = pill.dataset.class;
        visibleLimit = 48;
        if (selectClass) selectClass.value = (cVal === 'all') ? '' : cVal;
        onClassSelected(selectClass ? selectClass.value : '');
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        window.resetBookFinder();
      });
    }

    if (pdfModalClose) pdfModalClose.addEventListener('click', closePdfModal);
    if (pdfModal) {
      pdfModal.addEventListener('click', (e) => {
        if (e.target === pdfModal) closePdfModal();
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && pdfModal && pdfModal.classList.contains('active')) {
        closePdfModal();
      }
    });
  }

  // --- STEP 1: CLASS SELECTION ---
  function onClassSelected(classVal) {
    if (classVal) {
      if (stepBoxClass) stepBoxClass.classList.add('completed');
      if (stepBoxSubject) stepBoxSubject.classList.add('active');
    } else {
      if (stepBoxClass) stepBoxClass.classList.remove('completed');
      if (stepBoxSubject) stepBoxSubject.classList.remove('active', 'completed');
      if (stepBoxBook) stepBoxBook.classList.remove('active', 'completed');
      if (stepBoxSubbook) stepBoxSubbook.classList.remove('active', 'completed');
    }

    if (selectSubject) {
      selectSubject.innerHTML = '<option value="">All Subjects...</option>';
    }
    if (selectBook) {
      selectBook.innerHTML = '<option value="">Choose Subject First</option>';
      selectBook.disabled = true;
    }
    if (selectSubbook) {
      selectSubbook.innerHTML = '<option value="">Choose Book First</option>';
      selectSubbook.disabled = true;
    }

    if (!classVal) {
      if (selectSubject) {
        selectSubject.disabled = true;
        selectSubject.innerHTML = '<option value="">Choose Class First</option>';
      }
      syncPillState('all');
    } else {
      if (selectSubject) {
        selectSubject.disabled = false;
        const subjects = getUniqueValues(allBooks.filter(b => String(b.class) === String(classVal)), 'subject');
        subjects.forEach(sub => {
          const opt = document.createElement('option');
          opt.value = sub;
          opt.textContent = sub;
          selectSubject.appendChild(opt);
        });
      }
      syncPillState(classVal);
    }

    applyFilters();
  }

  // --- STEP 2: SUBJECT SELECTION ---
  function onSubjectSelected(subjectVal) {
    if (subjectVal) {
      if (stepBoxSubject) stepBoxSubject.classList.add('completed');
      if (stepBoxBook) stepBoxBook.classList.add('active');
    } else {
      if (stepBoxSubject) stepBoxSubject.classList.remove('completed');
      if (stepBoxBook) stepBoxBook.classList.remove('active', 'completed');
      if (stepBoxSubbook) stepBoxSubbook.classList.remove('active', 'completed');
    }

    if (selectBook) {
      selectBook.innerHTML = '<option value="">All Books...</option>';
    }
    if (selectSubbook) {
      selectSubbook.innerHTML = '<option value="">Choose Book First</option>';
      selectSubbook.disabled = true;
    }

    if (!subjectVal) {
      if (selectBook) selectBook.disabled = true;
    } else {
      if (selectBook) {
        selectBook.disabled = false;
        const classVal = selectClass ? selectClass.value : '';
        const booksInSub = getUniqueValues(allBooks.filter(b => (!classVal || String(b.class) === String(classVal)) && b.subject === subjectVal), 'book');
        booksInSub.forEach(bk => {
          const opt = document.createElement('option');
          opt.value = bk;
          opt.textContent = bk;
          selectBook.appendChild(opt);
        });
      }
    }

    applyFilters();
  }

  // --- STEP 3: BOOK SELECTION ---
  function onBookSelected(bookVal) {
    if (bookVal) {
      if (stepBoxBook) stepBoxBook.classList.add('completed');
      if (stepBoxSubbook) stepBoxSubbook.classList.add('active');
    } else {
      if (stepBoxBook) stepBoxBook.classList.remove('completed');
      if (stepBoxSubbook) stepBoxSubbook.classList.remove('active', 'completed');
    }

    if (selectSubbook) {
      selectSubbook.innerHTML = '<option value="">All Chapters / Sub-books...</option>';
      if (!bookVal) {
        selectSubbook.disabled = true;
      } else {
        selectSubbook.disabled = false;
        const classVal = selectClass ? selectClass.value : '';
        const subjectVal = selectSubject ? selectSubject.value : '';
        const subbooks = getUniqueValues(allBooks.filter(b =>
          (!classVal || String(b.class) === String(classVal)) &&
          (!subjectVal || b.subject === subjectVal) &&
          b.book === bookVal
        ), 'subbook');

        subbooks.forEach(sb => {
          const opt = document.createElement('option');
          opt.value = sb;
          opt.textContent = sb;
          selectSubbook.appendChild(opt);
        });
      }
    }

    applyFilters();
  }

  // --- 4. UNIVERSAL SEARCH & FILTER ENGINE ---
  function applyFilters() {
    const rawQuery = (searchInput ? searchInput.value : '').trim();
    const query = rawQuery.toLowerCase();
    const isSearching = !!query;

    const selectedClass = selectClass ? selectClass.value : '';
    const selectedSubject = selectSubject ? selectSubject.value : '';
    const selectedBook = selectBook ? selectBook.value : '';
    const selectedSubbook = selectSubbook ? selectSubbook.value : '';

    filteredBooks = allBooks.filter(item => {
      if (isSearching) {
        return matchesUniversalSearch(item, query);
      }
      if (selectedClass && String(item.class) !== String(selectedClass)) return false;
      if (selectedSubject && item.subject !== selectedSubject) return false;
      if (selectedBook && (item.book !== selectedBook && item.book_title !== selectedBook)) return false;
      if (selectedSubbook && (item.subbook !== selectedSubbook && item.chapter_name !== selectedSubbook)) return false;
      return true;
    });

    if (searchLiveStatus && searchStatusText) {
      if (isSearching) {
        searchLiveStatus.style.display = 'flex';
        searchStatusText.innerHTML = `🔍 Universal Search: <strong>"${escapeHtml(rawQuery)}"</strong> &mdash; <span>${filteredBooks.length} book${filteredBooks.length !== 1 ? 's' : ''} found across entire library</span>`;
      } else {
        searchLiveStatus.style.display = 'none';
      }
    }

    updateSummaryBar(selectedClass, selectedSubject, selectedBook, selectedSubbook, isSearching, rawQuery);
    renderGrid(filteredBooks);
  }

  function matchesUniversalSearch(item, query) {
    if (!query) return true;

    const cls = String(item.class || '').trim();
    const sub = String(item.subject || '').trim().toLowerCase();
    const bk = String(item.book || item.book_title || '').trim().toLowerCase();
    const ch = String(item.subbook || item.chapter_name || '').trim().toLowerCase();
    const ed = String(item.edition || '').trim().toLowerCase();
    const lang = String(item.language || '').trim().toLowerCase();
    const code = String(item.code || '').trim().toLowerCase();

    const classAliases = [
      cls,
      `class ${cls}`,
      `class-${cls}`,
      `class${cls}`,
      `grade ${cls}`,
      `std ${cls}`,
      `${cls}th`,
      `${cls}st`,
      `${cls}nd`,
      `${cls}rd`
    ].join(' ').toLowerCase();

    let extraSubjectAliases = '';
    if (sub.includes('math') || bk.includes('math')) extraSubjectAliases += ' maths mathematics math arithmetic algebra geometry ganit';
    if (sub.includes('science') || bk.includes('science')) extraSubjectAliases += ' sci science natural science vigyan';
    if (sub.includes('physics') || bk.includes('physics')) extraSubjectAliases += ' phy physics bhautiki';
    if (sub.includes('chemistry') || bk.includes('chemistry')) extraSubjectAliases += ' chem chemistry rasayan';
    if (sub.includes('biology') || bk.includes('biology')) extraSubjectAliases += ' bio biology jeev vigyan';
    if (sub.includes('social') || sub.includes('history') || sub.includes('geography')) extraSubjectAliases += ' sst social science history civics geography economics';
    if (sub.includes('english') || bk.includes('english')) extraSubjectAliases += ' eng english honeycomb beehive hornbill flamingo first flight footprint';
    if (sub.includes('hindi') || bk.includes('hindi')) extraSubjectAliases += ' hin hindi sparsh sanchayan kshitij kritika vasant rimjhim';

    const haystack = `${classAliases} ${sub} ${extraSubjectAliases} ${bk} ${ch} ${ed} ${lang} ${code}`.toLowerCase();

    if (haystack.includes(query)) return true;

    const tokens = query.split(/\s+/).filter(Boolean);
    if (tokens.length > 1) {
      return tokens.every(tok => {
        if (tok === 'class' || tok === 'book' || tok === 'ncert' || tok === 'cbse') return true;
        return haystack.includes(tok);
      });
    }

    return false;
  }

  function updateSummaryBar(c, s, b, sb, isSearching, query) {
    if (!resultsCount) return;
    resultsCount.textContent = `${filteredBooks.length} book${filteredBooks.length !== 1 ? 's' : ''} available`;

    const parts = [];
    if (c) parts.push(`Class ${c}`);
    if (s) parts.push(`Subject: ${s}`);
    if (b) parts.push(`Book: ${b}`);
    if (sb) parts.push(`Chapter: ${sb}`);

    if (isSearching) {
      if (catalogTitle) catalogTitle.textContent = `Search Results for "${query}"`;
      if (finderSummary) {
        finderSummary.style.display = 'block';
        summaryText.textContent = `Searching entire library for "${query}"` + (parts.length ? ` in ${parts.join(' ➔ ')}` : '');
      }
    } else if (parts.length > 0) {
      if (finderSummary) {
        finderSummary.style.display = 'block';
        summaryText.textContent = parts.join(' ➔ ');
      }
      if (catalogTitle) catalogTitle.textContent = `Results for ${parts[0]}` + (s ? ` (${s})` : '');
    } else {
      if (finderSummary) finderSummary.style.display = 'none';
      if (catalogTitle) catalogTitle.textContent = 'All Official NCERT Textbooks (Classes 1 to 12)';
    }
  }

  // --- 5. RENDER BOOKS GRID WITH BATCH PAGINATION ---
  function renderGrid(books) {
    if (!booksGrid) return;

    if (allBooks.length === 0) {
      booksGrid.innerHTML = `
        <div class="empty-books-state">
          <div class="icon">📚</div>
          <h4>Loading Official NCERT Books Library...</h4>
          <p>Connecting to master textbook repository for Classes 1 to 12.</p>
        </div>
      `;
      return;
    }

    if (books.length === 0) {
      booksGrid.innerHTML = `
        <div class="empty-books-state">
          <div class="icon">🔍</div>
          <h4>No matching books found</h4>
          <p>We couldn't find any textbooks matching your search criteria. Try a different class number, book name, or reset your filters.</p>
          <button type="button" class="btn-book-read" style="display:inline-flex; width:auto; margin:0 auto;" onclick="window.resetBookFinder()">
            ↺ Clear Filters &amp; Show All Books
          </button>
        </div>
      `;
      return;
    }

    const visibleBooks = books.slice(0, visibleLimit);

    booksGrid.innerHTML = visibleBooks.map(book => {
      const coverHtml = book.cover_url ?
        `<div class="book-cover-art" style="background-image:url('${escapeHtml(book.cover_url)}');" referrerpolicy="no-referrer"></div>` :
        `<div class="book-cover-art" style="background: linear-gradient(135deg, ${book.color || '#4f46e5'}, #1e1b4b);">
           <span class="book-cover-badge">NCERT • Class ${escapeHtml(book.class)}</span>
           <div class="book-cover-title">${escapeHtml(book.book)}</div>
         </div>`;

      const zipBtnHtml = book.zip_url ? `
        <a href="${escapeHtml(book.zip_url)}" download target="_blank" rel="noopener noreferrer" class="btn-book-download" style="padding: 0.65rem 0.5rem; font-size: 0.8rem;" title="Download Complete Official Book ZIP">
          📦 Full ZIP
        </a>
      ` : '';

      return `
        <article class="book-card" data-id="${escapeHtml(book.id)}">
          <div class="book-cover-area">
            ${coverHtml}
            <span class="book-badge-verified">✓ Official NCERT</span>
          </div>

          <div class="book-body">
            <div class="book-tags">
              <span class="tag-chip class-tag">Class ${escapeHtml(book.class)}</span>
              <span class="tag-chip subject-tag">${escapeHtml(book.subject)}</span>
              <span class="tag-chip">${escapeHtml(book.language || 'English')}</span>
            </div>

            <h4 class="book-title">${escapeHtml(book.book)}</h4>
            <div class="book-chapter-name">${escapeHtml(book.subbook)}</div>

            <div class="book-meta-footer">
              <span>📅 ${escapeHtml(book.edition || 'NCERT 2024-25')}</span>
              <span>💾 ${escapeHtml(book.file_size || 'Official PDF')}</span>
            </div>

            <div class="book-actions">
              <button type="button" class="btn-book-read" onclick="window.openBookReader('${escapeHtml(book.id)}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                Read Online
              </button>
              <a href="${escapeHtml(book.pdf_url)}" target="_blank" rel="noopener noreferrer" download class="btn-book-download" onclick="window.onBookDownload(event, '${escapeHtml(book.id)}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                PDF
              </a>
              ${zipBtnHtml}
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Load More Button
    if (books.length > visibleLimit) {
      const loadMoreContainer = document.createElement('div');
      loadMoreContainer.style.gridColumn = '1 / -1';
      loadMoreContainer.style.textAlign = 'center';
      loadMoreContainer.style.padding = '2rem 0 3rem';
      loadMoreContainer.innerHTML = `
        <button type="button" id="btn-load-more-books" class="btn-book-read" style="margin: 0 auto; padding: 0.85rem 2.2rem; font-size: 0.95rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(99,102,241,0.3);">
          <span>📚 Load More Books (Showing ${visibleLimit} of ${books.length})</span>
        </button>
      `;
      booksGrid.appendChild(loadMoreContainer);

      const btnLoadMore = document.getElementById('btn-load-more-books');
      if (btnLoadMore) {
        btnLoadMore.addEventListener('click', () => {
          visibleLimit += 48;
          renderGrid(books);
        });
      }
    }
  }

  // --- 6. ADVANCED PDF READER & DIRECT DOWNLOAD MODAL ---
  window.openBookReader = function (bookId) {
    const book = allBooks.find(b => b.id === bookId);
    if (!book) return;

    const bookTitle = book.book_title || book.book || 'NCERT Textbook';
    const bookClass = book.class || '';
    const chapterCount = Math.max(book.chapters_count || 14, 1);
    const code = book.code || '';

    if (pdfModalTitle) {
      pdfModalTitle.textContent = `Class ${bookClass} • ${bookTitle}`;
    }

    const pdfModalChapterSelect = document.getElementById('pdf-modal-chapter-select');
    const pdfModalNewtab = document.getElementById('pdf-modal-newtab');
    const pdfModalDownload = document.getElementById('pdf-modal-download');
    const pdfModalZip = document.getElementById('pdf-modal-zip');
    const pdfViewerFrame = document.getElementById('pdf-viewer-frame');
    const pdfFallbackBanner = document.getElementById('pdf-fallback-banner');
    const fallbackBookHeading = document.getElementById('fallback-book-heading');
    const fallbackBtnRead = document.getElementById('fallback-btn-read');
    const fallbackBtnDownload = document.getElementById('fallback-btn-download');
    const fallbackBtnZip = document.getElementById('fallback-btn-zip');

    if (pdfModalChapterSelect) {
      pdfModalChapterSelect.innerHTML = '';
      
      const optPrelims = document.createElement('option');
      optPrelims.value = 'ps';
      optPrelims.textContent = 'Prelims (Index & Syllabus)';
      pdfModalChapterSelect.appendChild(optPrelims);

      for (let ch = 1; ch <= chapterCount; ch++) {
        const opt = document.createElement('option');
        const chFormatted = String(ch).padStart(2, '0');
        opt.value = chFormatted;
        opt.textContent = `Chapter ${ch}`;
        if (ch === 1) opt.selected = true;
        pdfModalChapterSelect.appendChild(opt);
      }

      pdfModalChapterSelect.onchange = function() {
        const chosen = pdfModalChapterSelect.value;
        updateModalUrls(chosen);
      };
    }

    function updateModalUrls(chapterSuffix) {
      let currentPdfUrl = book.pdf_url;
      if (code) {
        if (chapterSuffix === 'ps') {
          currentPdfUrl = `https://ncert.nic.in/textbook/pdf/${code}ps.pdf`;
        } else {
          if (chapterSuffix === '01' && book.local_pdf) {
            currentPdfUrl = book.local_pdf;
          } else {
            currentPdfUrl = `https://ncert.nic.in/textbook/pdf/${code}${chapterSuffix}.pdf`;
          }
        }
      }

      const zipUrl = book.zip_url || (code ? `https://ncert.nic.in/textbook/pdf/${code}dd.zip` : '');

      if (pdfModalNewtab) pdfModalNewtab.href = currentPdfUrl;
      if (pdfModalDownload) pdfModalDownload.href = currentPdfUrl;
      if (pdfModalZip) {
        if (zipUrl) {
          pdfModalZip.href = zipUrl;
          pdfModalZip.style.display = 'inline-flex';
        } else {
          pdfModalZip.style.display = 'none';
        }
      }

      const chapterName = (pdfModalChapterSelect && pdfModalChapterSelect.options[pdfModalChapterSelect.selectedIndex]) ?
        pdfModalChapterSelect.options[pdfModalChapterSelect.selectedIndex].text : `Chapter ${chapterSuffix}`;

      if (fallbackBookHeading) fallbackBookHeading.textContent = `Class ${bookClass} • ${bookTitle} (${chapterName})`;
      if (fallbackBtnRead) fallbackBtnRead.href = currentPdfUrl;
      if (fallbackBtnDownload) fallbackBtnDownload.href = currentPdfUrl;
      if (fallbackBtnZip) fallbackBtnZip.href = zipUrl || '#';

      if (book.local_pdf && (chapterSuffix === '01' || !chapterSuffix)) {
        if (pdfViewerFrame) {
          pdfViewerFrame.src = book.local_pdf;
          pdfViewerFrame.style.display = 'block';
        }
        if (pdfFallbackBanner) pdfFallbackBanner.style.display = 'none';
      } else {
        if (pdfViewerFrame) {
          pdfViewerFrame.src = currentPdfUrl;
          pdfViewerFrame.style.display = 'block';
        }
        if (pdfFallbackBanner) {
          pdfFallbackBanner.style.display = 'none';
        }
      }
    }

    updateModalUrls('01');

    if (pdfModal) pdfModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function closePdfModal() {
    if (pdfModal) pdfModal.classList.remove('active');
    if (pdfViewerFrame) pdfViewerFrame.src = 'about:blank';
    document.body.style.overflow = '';
  }

  window.onBookDownload = function (e, bookId) {
    showToast('Download started for official NCERT PDF!');
  };

  // --- 7. RESET FILTERS ---
  window.resetBookFinder = function () {
    visibleLimit = 48;
    if (selectClass) selectClass.value = '';
    if (selectSubject) {
      selectSubject.innerHTML = '<option value="">Choose Class First</option>';
      selectSubject.disabled = true;
    }
    if (selectBook) {
      selectBook.innerHTML = '<option value="">Choose Subject First</option>';
      selectBook.disabled = true;
    }
    if (selectSubbook) {
      selectSubbook.innerHTML = '<option value="">Choose Book First</option>';
      selectSubbook.disabled = true;
    }

    if (stepBoxClass) stepBoxClass.className = 'step-box active';
    if (stepBoxSubject) stepBoxSubject.className = 'step-box';
    if (stepBoxBook) stepBoxBook.className = 'step-box';
    if (stepBoxSubbook) stepBoxSubbook.className = 'step-box';

    if (searchInput) searchInput.value = '';
    if (searchClear) searchClear.style.display = 'none';

    syncPillState('all');
    applyFilters();
  };

  function syncPillState(classVal) {
    if (!classPillsRow) return;
    document.querySelectorAll('.class-pill').forEach(p => {
      if (p.dataset.class === classVal) p.classList.add('active');
      else p.classList.remove('active');
    });
  }

  function getUniqueValues(list, key) {
    const set = new Set();
    list.forEach(item => {
      if (item[key]) set.add(item[key]);
    });
    return Array.from(set).sort();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

})();
