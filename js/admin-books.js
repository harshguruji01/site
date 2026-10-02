/**
 * ============================================================================
 * WebGuruJi Books Admin Studio (js/admin-books.js)
 * Full CRUD for NCERT Textbooks, Chapters, PDFs, and Covers.
 * Direct Supabase synchronization + Local Storage fallback.
 * Strictly displays ONLY books published from this admin page.
 * ============================================================================
 */
(function () {
  'use strict';

  // Only books published from adminbooks.html will be stored and displayed
  let adminBooksCache = [];

  // DOM Elements
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

  const catalogTableBody = document.getElementById('catalog-table-body');
  const catalogSearch = document.getElementById('catalog-search');
  const catalogClassFilter = document.getElementById('catalog-class-filter');

  const statTotal = document.getElementById('stat-total-books');
  const statCustom = document.getElementById('stat-custom-count');
  const statClasses = document.getElementById('stat-classes-count');

  const progressOverlay = document.getElementById('upload-progress-overlay');
  const progressFill = document.getElementById('progress-bar-fill');
  const progressPct = document.getElementById('progress-pct');
  const progressTitle = document.getElementById('progress-status-title');

  document.addEventListener('DOMContentLoaded', async () => {
    setupFilePickers();
    await loadBooksData();
    setupFormEvents();
    renderCatalog();
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

  // --- LOAD BOOKS DATA (Strictly published from Admin) ---
  async function loadBooksData() {
    let published = [];

    // 1. Check LocalStorage published books
    try {
      const local = localStorage.getItem('wg_admin_books');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) published = parsed;
      }
    } catch (e) {}

    // 2. Query Supabase `ncert_books` table
    try {
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase.from('ncert_books').select('*').order('created_at', { ascending: false });
        if (!error && Array.isArray(data)) {
          const existingIds = new Set(published.map(c => c.id));
          data.forEach(item => {
            if (!existingIds.has(item.id)) {
              published.push({
                id: item.id,
                class: String(item.class),
                subject: item.subject,
                book: item.book_title || item.book,
                subbook: item.subbook || item.chapter_name || 'Full Book',
                edition: item.edition || 'Latest Edition',
                language: item.language || 'English',
                pdf_url: item.pdf_url || item.download_url,
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

    // ONLY published books from admin!
    adminBooksCache = published;

    if (statTotal) statTotal.textContent = adminBooksCache.length;
    if (statCustom) statCustom.textContent = adminBooksCache.length;

    // Calculate unique classes covered
    const uniqueClasses = new Set(adminBooksCache.map(b => b.class)).size;
    if (statClasses) statClasses.textContent = uniqueClasses;
  }

  // --- FORM EVENTS ---
  function setupFormEvents() {
    bookForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleFormSubmit();
    });

    btnReset.addEventListener('click', resetForm);

    catalogSearch.addEventListener('input', renderCatalog);
    catalogClassFilter.addEventListener('change', renderCatalog);
  }

  // --- SUBMIT / UPLOAD ---
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
        const bucket = 'app-logos'; // Reliable public bucket
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
        const bucket = 'apk-files'; // Reliable public bucket
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
        subbook: inputSubbook.value.trim(),
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
      if (cFilter !== 'all' && item.class !== cFilter) return false;
      if (q) {
        const hay = `${item.class} ${item.subject} ${item.book} ${item.subbook} ${item.edition}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (list.length === 0) {
      catalogTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:2.5rem 1rem; color:var(--text-muted);">
            <div style="font-size:1.8rem; margin-bottom:6px;">📚</div>
            <strong>No books published yet</strong>
            <p style="font-size:0.82rem; color:#94a3b8; margin-top:4px;">Upload your first NCERT book or chapter from the form on the left. It will instantly appear here and on the live book store.</p>
          </td>
        </tr>
      `;
      return;
    }

    catalogTableBody.innerHTML = list.map(item => `
      <tr>
        <td><span class="badge-chip">Class ${escapeHtml(item.class)}</span></td>
        <td><strong style="color:#fff;">${escapeHtml(item.subject)}</strong></td>
        <td>${escapeHtml(item.book)}</td>
        <td style="color:#94a3b8; font-size:0.82rem;">${escapeHtml(item.subbook)}</td>
        <td><span style="font-size:0.78rem; color:#a5b4fc;">${escapeHtml(item.file_size || 'PDF')}</span></td>
        <td>
          <div style="display:flex; gap:6px;">
            <a href="${escapeHtml(item.pdf_url)}" target="_blank" class="btn-action-mini" title="Preview PDF">↗ View</a>
            <button type="button" class="btn-action-mini" onclick="window.editBookItem('${escapeHtml(item.id)}')" title="Edit Book">✏ Edit</button>
            <button type="button" class="btn-action-mini btn-action-del" onclick="window.deleteBookItem('${escapeHtml(item.id)}')" title="Delete Book">&times;</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // Edit Book
  window.editBookItem = function (id) {
    const item = adminBooksCache.find(b => b.id === id);
    if (!item) return;

    editBookId.value = item.id;
    inputClass.value = item.class;
    inputSubject.value = item.subject;
    inputTitle.value = item.book;
    inputSubbook.value = item.subbook;
    inputEdition.value = item.edition || '';
    inputLanguage.value = item.language || 'English';
    inputFilesize.value = item.file_size || '';
    inputColor.value = item.color || '#6366f1';
    pdfDirectUrl.value = item.pdf_url || '';
    coverDirectUrl.value = item.cover_url || '';

    formHeading.innerHTML = `<span>✏️</span> Edit Book: ${escapeHtml(item.book)}`;
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
        list = list.filter(b => b.id !== id);
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
    progressOverlay.classList.add('active');
    progressTitle.textContent = title;
    progressFill.style.width = pct + '%';
    progressPct.textContent = pct + '%';
  }

  function hideProgress() {
    progressOverlay.classList.remove('active');
    progressFill.style.width = '0%';
  }

  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

})();
