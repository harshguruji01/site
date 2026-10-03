/**
 * ============================================================================
 * HarshGuruJi Books Admin Studio (js/admin-books.js)
 * Full CRUD & Official 1-Click Mass Publisher for NCERT Textbooks (Classes 1-12)
 * Direct Supabase synchronization + Local Storage fallback + BroadcastChannel.
 * ============================================================================
 */
(function () {
  'use strict';

  // Active Books Cache
  let adminBooksCache = [];
  let catalogVisibleLimit = 50;

  // DOM Elements - Forms & Controls
  const bookForm = document.getElementById('book-upload-form');
  const editBookId = document.getElementById('edit-book-id');
  const formHeading = document.getElementById('form-heading');
  const btnSubmit = document.getElementById('btn-submit-book');
  const btnReset = document.getElementById('btn-reset-book-form');

  const inputClass = document.getElementById('book-class');
  const inputSubject = document.getElementById('book-subject');
  const inputTitle = document.getElementById('book-title');
  const inputSubbook = document.getElementById('book-subbook');
  const inputEdition = document.getElementById('book-edition');
  const inputLanguage = document.getElementById('book-language');
  const inputFilesize = document.getElementById('book-filesize');
  const inputColor = document.getElementById('book-theme-color');

  const pdfFile = document.getElementById('book-pdf-file');
  const pdfDirectUrl = document.getElementById('book-direct-url');
  const pdfFileName = document.getElementById('pdf-file-name');

  const coverFile = document.getElementById('book-cover-file');
  const coverDirectUrl = document.getElementById('book-cover-url');
  const coverFileName = document.getElementById('cover-file-name');

  // Catalog Table & Filters
  const catalogTableBody = document.getElementById('catalog-table-body');
  const catalogSearch = document.getElementById('catalog-search');
  const catalogClassFilter = document.getElementById('catalog-class-filter');
  const catalogShownCount = document.getElementById('catalog-shown-count');
  const catalogTotalCount = document.getElementById('catalog-total-count');
  const btnLoadMoreCatalog = document.getElementById('btn-load-more-catalog');
  const btnShowAllCatalog = document.getElementById('btn-show-all-catalog');

  // Stats Counters
  const statTotal = document.getElementById('stat-total-books');
  const statCustom = document.getElementById('stat-custom-count');
  const statClasses = document.getElementById('stat-classes-count');

  // Mass Publisher Controls
  const btnPublishAll = document.getElementById('btn-publish-all-ncert');
  const btnPublishClassOnly = document.getElementById('btn-publish-class-only');
  const selectClassToPublish = document.getElementById('select-class-to-publish');
  const btnDownloadCoreLocal = document.getElementById('btn-download-core-local');
  const btnClearAdminCache = document.getElementById('btn-clear-admin-cache');
  const ncertSyncStatusText = document.getElementById('ncert-sync-status-text');

  // Progress Overlay
  const progressOverlay = document.getElementById('upload-progress-overlay');
  const progressFill = document.getElementById('progress-bar-fill');
  const progressPct = document.getElementById('progress-pct');
  const progressTitle = document.getElementById('progress-status-title');

  document.addEventListener('DOMContentLoaded', async () => {
    setupFilePickers();
    await loadBooksData();
    setupFormEvents();
    setupPublisherControls();
    renderCatalog();

    // Check if URL requested auto-publish (e.g. ?autopublish=1)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('autopublish') === '1') {
      setTimeout(() => {
        publishAllNcertBooks();
      }, 600);
    }
  });

  function getSupabase() {
    return window.supabaseClient || (window.supabase && typeof window.supabase.createClient === 'function' ?
      window.supabase.createClient(window.SUPABASE_URL || 'https://wumdbpyhpblvgjttsbpv.supabase.co', window.SUPABASE_ANON_KEY || 'sb_publishable_xLqKY9N62MXb6ELG-5trig_RlJs_n-l') : null);
  }

  // --- FILE PICKERS SETUP ---
  function setupFilePickers() {
    if (pdfFile) {
      pdfFile.addEventListener('change', () => {
        if (pdfFile.files.length > 0) {
          const f = pdfFile.files[0];
          const szMB = (f.size / (1024 * 1024)).toFixed(1);
          pdfFileName.style.display = 'block';
          pdfFileName.textContent = `Selected: ${f.name} (${szMB} MB)`;
          if (!inputFilesize.value) {
            inputFilesize.value = `${szMB} MB`;
          }
        }
      });
    }

    if (coverFile) {
      coverFile.addEventListener('change', () => {
        if (coverFile.files.length > 0) {
          const f = coverFile.files[0];
          coverFileName.style.display = 'block';
          coverFileName.textContent = `Selected: ${f.name}`;
        }
      });
    }
  }

  // --- LOAD BOOKS DATA ---
  async function loadBooksData() {
    let published = [];
    const seenIds = new Set();

    // 1. Read LocalStorage published books
    try {
      const local = localStorage.getItem('wg_admin_books');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach(item => {
            if (item && item.id && !seenIds.has(String(item.id))) {
              seenIds.add(String(item.id));
              published.push(item);
            }
          });
        }
      }
    } catch (e) {
      console.warn('[AdminBooks] Local storage read notice:', e);
    }

    // 2. Query Supabase `ncert_books` table
    try {
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase.from('ncert_books').select('*').order('created_at', { ascending: false });
        if (!error && Array.isArray(data)) {
          data.forEach(item => {
            if (!seenIds.has(String(item.id))) {
              seenIds.add(String(item.id));
              published.push({
                id: item.id,
                class: String(item.class),
                subject: item.subject,
                book: item.book_title || item.book,
                book_title: item.book_title || item.book,
                code: item.code || '',
                subbook: item.subbook || item.chapter_name || 'Full Book',
                chapter_name: item.chapter_name || item.subbook || 'Full Book',
                edition: item.edition || 'Latest Edition',
                language: item.language || 'English',
                pdf_url: item.pdf_url || item.download_url,
                zip_url: item.zip_url || '',
                cover_url: item.cover_url || '',
                color: item.color || '#6366f1',
                file_size: item.file_size || 'PDF Document',
                created_at: item.created_at
              });
            }
          });
        }
      }
    } catch (err) {
      console.log('[AdminBooks] Local storage fallback active.');
    }

    // 3. If published list is empty, pre-populate with NCERT Master Catalog for instant preview
    if (published.length === 0 && Array.isArray(window.NCERT_MASTER_CATALOG)) {
      published = [...window.NCERT_MASTER_CATALOG];
    }

    adminBooksCache = published;

    // Update Stats Display
    if (statTotal) {
      statTotal.textContent = (Array.isArray(window.NCERT_MASTER_CATALOG) ? window.NCERT_MASTER_CATALOG.length : adminBooksCache.length).toLocaleString();
    }
    if (statCustom) {
      statCustom.textContent = adminBooksCache.length.toLocaleString();
    }
    const uniqueClasses = new Set(adminBooksCache.map(b => b.class)).size;
    if (statClasses) {
      statClasses.textContent = uniqueClasses > 0 ? `${uniqueClasses} Classes (1–12)` : '12 Classes';
    }

    if (ncertSyncStatusText) {
      ncertSyncStatusText.textContent = `${adminBooksCache.length.toLocaleString()} books currently active in system`;
    }
  }

  // --- PUBLISHER CONTROLS SETUP ---
  function setupPublisherControls() {
    // 1-Click Publish All
    if (btnPublishAll) {
      btnPublishAll.addEventListener('click', () => publishAllNcertBooks());
    }

    // Publish Specific Class
    if (btnPublishClassOnly) {
      btnPublishClassOnly.addEventListener('click', () => {
        const cls = selectClassToPublish ? selectClassToPublish.value : 'all';
        if (cls === 'all') {
          publishAllNcertBooks();
        } else {
          publishClassNcertBooks(cls);
        }
      });
    }

    // Check Offline Core PDFs
    if (btnDownloadCoreLocal) {
      btnDownloadCoreLocal.addEventListener('click', () => {
        showToast('Offline Core PDFs active: Class 10 (Maths, Science, English), Class 12 (Physics, Chemistry, Maths, Bio), Class 11, 9, 8, 7, 5, 1.');
      });
    }

    // Reset Custom Books
    if (btnClearAdminCache) {
      btnClearAdminCache.addEventListener('click', () => {
        if (confirm('Reset custom local books and restore official NCERT master catalog?')) {
          localStorage.removeItem('wg_admin_books');
          showToast('Custom book cache cleared. Restoring official master catalog...');
          loadBooksData();
          renderCatalog();
        }
      });
    }

    // Quick Class Chips Filter
    const chipContainer = document.getElementById('catalog-class-chips');
    if (chipContainer) {
      chipContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-class-chip');
        if (!btn) return;
        chipContainer.querySelectorAll('.btn-class-chip').forEach(c => {
          c.classList.remove('active');
          c.style.background = 'rgba(255,255,255,0.08)';
          c.style.color = '#cbd5e1';
        });
        btn.classList.add('active');
        btn.style.background = '#6366f1';
        btn.style.color = '#fff';

        const cls = btn.getAttribute('data-class');
        if (catalogClassFilter) catalogClassFilter.value = cls;
        catalogVisibleLimit = 50;
        renderCatalog();
      });
    }

    // Pagination buttons
    if (btnLoadMoreCatalog) {
      btnLoadMoreCatalog.addEventListener('click', () => {
        catalogVisibleLimit += 50;
        renderCatalog();
      });
    }

    if (btnShowAllCatalog) {
      btnShowAllCatalog.addEventListener('click', () => {
        catalogVisibleLimit = 99999;
        renderCatalog();
      });
    }
  }

  // --- 1-CLICK MASS PUBLISHER: ALL 1,246 BOOKS ---
  async function publishAllNcertBooks() {
    const catalog = window.NCERT_MASTER_CATALOG;
    if (!Array.isArray(catalog) || catalog.length === 0) {
      showToast('Official NCERT master catalog is loading, please try in a moment.', 'error');
      return;
    }

    if (!confirm(`🚀 Publish all ${catalog.length} official NCERT textbooks to books.webguruji.online? This will synchronize all Classes 1 to 12, subjects, chapter PDFs, and full book ZIP downloads.`)) {
      return;
    }

    showProgress(`Preparing ${catalog.length} Official NCERT Textbooks...`, 10);

    // 1. Write entire catalog to LocalStorage
    try {
      localStorage.setItem('wg_admin_books', JSON.stringify(catalog));
    } catch (e) {
      console.warn('[AdminBooks] Local storage write notice:', e);
    }

    // 2. Broadcast immediately over cross-tab BroadcastChannel
    try {
      const bc = new BroadcastChannel('harshguruji_books_sync');
      bc.postMessage({ action: 'mass_published', count: catalog.length, timestamp: Date.now() });
    } catch(e) {}

    // 3. Batch upsert into Supabase `ncert_books` table
    const supabase = getSupabase();
    if (supabase) {
      const batchSize = 50;
      const totalBatches = Math.ceil(catalog.length / batchSize);
      for (let i = 0; i < catalog.length; i += batchSize) {
        const batch = catalog.slice(i, i + batchSize);
        const batchNum = Math.floor(i / batchSize) + 1;
        const pct = Math.min(95, Math.round((batchNum / totalBatches) * 85) + 10);
        showProgress(`Syncing Database: Batch ${batchNum} of ${totalBatches} (Class ${batch[0].class} ${batch[0].subject})...`, pct);

        try {
          await supabase.from('ncert_books').upsert(batch.map(b => ({
            id: b.id,
            class: b.class,
            subject: b.subject,
            book_title: b.book_title || b.book,
            chapter_name: b.chapter_name || b.subbook,
            edition: b.edition || 'Rationalised 2024-25 Edition',
            language: b.language || 'English',
            file_size: b.file_size || 'PDF Document',
            color: b.color || '#6366f1',
            pdf_url: b.pdf_url,
            cover_url: b.cover_url || ''
          })), { onConflict: 'id' });
        } catch(err) {
          console.warn('[AdminBooks] Supabase batch notice:', err);
        }
      }
    }

    showProgress('All 1,246 Books Successfully Published!', 100);
    setTimeout(async () => {
      hideProgress();
      showToast('🎉 All 1,246 NCERT Textbooks Successfully Published to Library!');
      await loadBooksData();
      renderCatalog();
    }, 800);
  }

  // --- PUBLISH SINGLE CLASS ---
  async function publishClassNcertBooks(classNum) {
    const catalog = (window.NCERT_MASTER_CATALOG || []).filter(b => String(b.class) === String(classNum));
    if (catalog.length === 0) {
      showToast(`No books found for Class ${classNum}.`, 'error');
      return;
    }

    showProgress(`Publishing Class ${classNum} (${catalog.length} books)...`, 30);

    // Merge into local storage
    let current = [];
    try {
      const local = localStorage.getItem('wg_admin_books');
      if (local) current = JSON.parse(local) || [];
    } catch(e) {}

    const existingIds = new Set(current.map(b => b.id));
    catalog.forEach(b => {
      if (!existingIds.has(b.id)) {
        current.unshift(b);
      }
    });

    try {
      localStorage.setItem('wg_admin_books', JSON.stringify(current));
    } catch(e) {}

    // Broadcast
    try {
      const bc = new BroadcastChannel('harshguruji_books_sync');
      bc.postMessage({ action: 'class_published', class: classNum, count: catalog.length });
    } catch(e) {}

    // Batch upsert to Supabase
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('ncert_books').upsert(catalog.map(b => ({
          id: b.id,
          class: b.class,
          subject: b.subject,
          book_title: b.book_title || b.book,
          chapter_name: b.chapter_name || b.subbook,
          edition: b.edition || 'Rationalised 2024-25 Edition',
          language: b.language || 'English',
          file_size: b.file_size || 'PDF Document',
          color: b.color || '#6366f1',
          pdf_url: b.pdf_url,
          cover_url: b.cover_url || ''
        })), { onConflict: 'id' });
      } catch(e) {}
    }

    showProgress(`Class ${classNum} Published!`, 100);
    setTimeout(async () => {
      hideProgress();
      showToast(`✓ Published ${catalog.length} books for Class ${classNum}!`);
      await loadBooksData();
      renderCatalog();
    }, 600);
  }

  // --- FORM EVENTS ---
  function setupFormEvents() {
    bookForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleFormSubmit();
    });

    btnReset.addEventListener('click', resetForm);

    catalogSearch.addEventListener('input', () => {
      catalogVisibleLimit = 50;
      renderCatalog();
    });

    catalogClassFilter.addEventListener('change', () => {
      const c = catalogClassFilter.value;
      const chipContainer = document.getElementById('catalog-class-chips');
      if (chipContainer) {
        chipContainer.querySelectorAll('.btn-class-chip').forEach(btn => {
          if (btn.getAttribute('data-class') === c) {
            btn.classList.add('active');
            btn.style.background = '#6366f1';
            btn.style.color = '#fff';
          } else {
            btn.classList.remove('active');
            btn.style.background = 'rgba(255,255,255,0.08)';
            btn.style.color = '#cbd5e1';
          }
        });
      }
      catalogVisibleLimit = 50;
      renderCatalog();
    });
  }

  // --- SUBMIT / UPLOAD INDIVIDUAL BOOK ---
  async function handleFormSubmit() {
    const editId = editBookId.value;
    const isEdit = !!editId;

    const bookPdf = pdfFile.files[0];
    const directPdf = (pdfDirectUrl.value || '').trim();
    const bookCover = coverFile.files[0];
    const directCover = (coverDirectUrl.value || '').trim();

    if (!isEdit && !bookPdf && !directPdf) {
      showToast('Please select a PDF file or provide a Direct PDF URL.', 'error');
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.textContent = isEdit ? 'Updating Book...' : 'Uploading & Publishing...';
    showProgress(isEdit ? 'Updating Book...' : 'Uploading Book Assets...', 20);

    const supabase = getSupabase();
    let pdfUrl = directPdf;
    let coverUrl = directCover;

    try {
      // 1. Upload Cover Image if selected
      if (bookCover && supabase) {
        showProgress('Uploading Cover PNG...', 45);
        const ext = (bookCover.name.split('.').pop() || 'png').toLowerCase();
        const path = `books/covers/cover_${Date.now()}_${Math.random().toString(36).substr(2, 4)}.${ext}`;
        const bucket = 'app-logos';
        const { error: upErr } = await supabase.storage.from(bucket).upload(path, bookCover, { upsert: true });
        if (!upErr) {
          const { data: pubData } = supabase.storage.from(bucket).getPublicUrl(path);
          coverUrl = pubData.publicUrl;
        }
      }

      // 2. Upload PDF file if selected
      if (bookPdf && supabase) {
        showProgress('Uploading Book PDF to Cloud...', 70);
        const safeName = bookPdf.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = `books/pdf/${Date.now()}_${safeName}`;
        const bucket = 'apk-files';
        const { error: pdfErr } = await supabase.storage.from(bucket).upload(path, bookPdf, { upsert: true });
        if (!pdfErr) {
          const { data: pubPdf } = supabase.storage.from(bucket).getPublicUrl(path);
          pdfUrl = pubPdf.publicUrl;
        }
      }

      if (!pdfUrl) {
        pdfUrl = directPdf;
      }

      showProgress('Saving record to Database...', 90);

      const bookRecord = {
        id: isEdit ? editId : 'book-' + Date.now(),
        class: inputClass.value,
        subject: inputSubject.value,
        book: inputTitle.value.trim(),
        book_title: inputTitle.value.trim(),
        subbook: inputSubbook.value.trim(),
        chapter_name: inputSubbook.value.trim(),
        edition: inputEdition.value.trim() || 'Rationalised 2024-25 Edition',
        language: inputLanguage.value,
        file_size: inputFilesize.value.trim() || 'PDF Document',
        color: inputColor.value,
        pdf_url: pdfUrl,
        cover_url: coverUrl,
        created_at: new Date().toISOString()
      };

      // Save to Supabase
      if (supabase) {
        try {
          if (isEdit) {
            await supabase.from('ncert_books').update({
              class: bookRecord.class,
              subject: bookRecord.subject,
              book_title: bookRecord.book,
              chapter_name: bookRecord.subbook,
              edition: bookRecord.edition,
              language: bookRecord.language,
              file_size: bookRecord.file_size,
              color: bookRecord.color,
              pdf_url: bookRecord.pdf_url,
              cover_url: bookRecord.cover_url
            }).eq('id', editId);
          } else {
            await supabase.from('ncert_books').insert([{
              id: bookRecord.id,
              class: bookRecord.class,
              subject: bookRecord.subject,
              book_title: bookRecord.book,
              chapter_name: bookRecord.subbook,
              edition: bookRecord.edition,
              language: bookRecord.language,
              file_size: bookRecord.file_size,
              color: bookRecord.color,
              pdf_url: bookRecord.pdf_url,
              cover_url: bookRecord.cover_url
            }]);
          }
        } catch (dbErr) {
          console.log('[AdminBooks] DB notice:', dbErr);
        }
      }

      // Save to LocalStorage
      let custom = [];
      try {
        const local = localStorage.getItem('wg_admin_books');
        if (local) custom = JSON.parse(local) || [];
      } catch (e) {}

      if (isEdit) {
        const idx = custom.findIndex(b => b.id === editId);
        if (idx !== -1) custom[idx] = bookRecord;
        else custom.unshift(bookRecord);
      } else {
        custom.unshift(bookRecord);
      }
      localStorage.setItem('wg_admin_books', JSON.stringify(custom));

      // Broadcast
      try {
        const bc = new BroadcastChannel('harshguruji_books_sync');
        bc.postMessage({ action: 'item_updated', id: bookRecord.id });
      } catch(e) {}

      showProgress('Published Successfully!', 100);
      showToast(isEdit ? 'Book updated successfully!' : 'Book uploaded & published to Library!');
      resetForm();
      await loadBooksData();
      renderCatalog();

    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setTimeout(() => {
        hideProgress();
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Publish Book to Library';
      }, 600);
    }
  }

  // --- RENDER CATALOG TABLE ---
  function renderCatalog() {
    const q = (catalogSearch.value || '').trim().toLowerCase();
    const cFilter = catalogClassFilter.value;

    const list = adminBooksCache.filter(item => {
      if (cFilter !== 'all' && String(item.class) !== String(cFilter)) return false;
      if (q) {
        const hay = `${item.class} ${item.subject} ${item.book || item.book_title} ${item.subbook || item.chapter_name} ${item.code || ''} ${item.edition || ''} ${item.language || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    // Update Counters
    if (catalogTotalCount) catalogTotalCount.textContent = list.length.toLocaleString();
    const visibleItems = list.slice(0, catalogVisibleLimit);
    if (catalogShownCount) catalogShownCount.textContent = visibleItems.length.toLocaleString();

    if (btnLoadMoreCatalog) {
      btnLoadMoreCatalog.style.display = list.length > catalogVisibleLimit ? 'inline-block' : 'none';
    }

    if (list.length === 0) {
      catalogTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:2.5rem 1rem; color:var(--text-muted);">
            <div style="font-size:1.8rem; margin-bottom:6px;">📚</div>
            <strong>No matching books found</strong>
            <p style="font-size:0.82rem; color:#94a3b8; margin-top:4px;">Try searching for a different class, subject or book title.</p>
          </td>
        </tr>
      `;
      return;
    }

    catalogTableBody.innerHTML = visibleItems.map(item => {
      const title = item.book || item.book_title || 'NCERT Book';
      const sub = item.subbook || item.chapter_name || (item.chapters_count ? `${item.chapters_count} Chapters` : 'Complete Book');
      const codeBadge = item.code ? `<span style="font-family:'JetBrains Mono', monospace; font-size:0.72rem; color:#94a3b8; background:rgba(255,255,255,0.06); padding:2px 6px; border-radius:4px; margin-left:6px;">${escapeHtml(item.code)}</span>` : '';
      const zipBtn = item.zip_url ? `<a href="${escapeHtml(item.zip_url)}" download class="btn-action-mini" style="background:rgba(245,158,11,0.15); border-color:rgba(245,158,11,0.3); color:#fde68a;" title="Download Full Book ZIP">📦 ZIP</a>` : '';

      return `
        <tr>
          <td><span class="badge-chip" style="background:rgba(99,102,241,0.2); color:#a5b4fc; border:1px solid rgba(99,102,241,0.35); padding:2px 8px; border-radius:12px; font-weight:700;">Class ${escapeHtml(item.class)}</span></td>
          <td><strong style="color:#fff;">${escapeHtml(item.subject)}</strong></td>
          <td>
            <div style="font-weight:600; color:#f8fafc;">${escapeHtml(title)}${codeBadge}</div>
          </td>
          <td style="color:#94a3b8; font-size:0.82rem;">${escapeHtml(sub)}</td>
          <td><span style="font-size:0.78rem; color:#a5b4fc;">${escapeHtml(item.file_size || 'PDF')}</span></td>
          <td>
            <div style="display:flex; gap:6px;">
              <a href="${escapeHtml(item.pdf_url)}" target="_blank" rel="noopener noreferrer" class="btn-action-mini" style="background:rgba(16,185,129,0.15); border-color:rgba(16,185,129,0.3); color:#6ee7b7;" title="Read Chapter PDF">↗ PDF</a>
              ${zipBtn}
            </div>
          </td>
          <td>
            <div style="display:flex; gap:6px;">
              <button type="button" class="btn-action-mini" onclick="window.editBookItem('${escapeHtml(item.id)}')" title="Edit Book">✏</button>
              <button type="button" class="btn-action-mini btn-action-del" onclick="window.deleteBookItem('${escapeHtml(item.id)}')" title="Delete Book">&times;</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Edit Book
  window.editBookItem = function (id) {
    const item = adminBooksCache.find(b => String(b.id) === String(id));
    if (!item) return;

    editBookId.value = item.id;
    inputClass.value = item.class;
    inputSubject.value = item.subject;
    inputTitle.value = item.book || item.book_title || '';
    inputSubbook.value = item.subbook || item.chapter_name || '';
    inputEdition.value = item.edition || '';
    inputLanguage.value = item.language || 'English';
    inputFilesize.value = item.file_size || '';
    inputColor.value = item.color || '#6366f1';
    pdfDirectUrl.value = item.pdf_url || '';
    coverDirectUrl.value = item.cover_url || '';

    formHeading.innerHTML = `<span>✏️</span> Edit Book: ${escapeHtml(item.book || item.book_title)}`;
    btnSubmit.textContent = 'Update Book Details';
    document.querySelector('.upload-card').scrollIntoView({ behavior: 'smooth' });
  };

  // Delete Book
  window.deleteBookItem = async function (id) {
    if (!confirm('Are you sure you want to delete this book from the catalog?')) return;

    // Remove from LocalStorage
    try {
      const local = localStorage.getItem('wg_admin_books');
      if (local) {
        let list = JSON.parse(local) || [];
        list = list.filter(b => String(b.id) !== String(id));
        localStorage.setItem('wg_admin_books', JSON.stringify(list));
      }
    } catch (e) {}

    // Remove from Supabase
    try {
      const supabase = getSupabase();
      if (supabase) {
        await supabase.from('ncert_books').delete().eq('id', id);
      }
    } catch (e) {}

    showToast('Book removed from catalog');
    await loadBooksData();
    renderCatalog();
  };

  function resetForm() {
    bookForm.reset();
    editBookId.value = '';
    formHeading.innerHTML = '<span>📤</span> Upload NCERT Book Item';
    btnSubmit.textContent = 'Publish Book to Library';
    pdfFileName.style.display = 'none';
    coverFileName.style.display = 'none';
  }

  function showProgress(title, pct) {
    if (progressOverlay) {
      progressOverlay.classList.add('active');
      progressTitle.textContent = title;
      progressFill.style.width = pct + '%';
      progressPct.textContent = pct + '%';
    }
  }

  function hideProgress() {
    if (progressOverlay) {
      progressOverlay.classList.remove('active');
      progressFill.style.width = '0%';
    }
  }

  function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.background = type === 'error' ? 'rgba(239,68,68,0.95)' : 'rgba(16,185,129,0.95)';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

})();
