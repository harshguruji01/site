// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initCustomAuth();
});

let appsCache = []; // Global cache for loaded apps
let downloadsCache = []; // Cache for user downloads

function initCustomAuth() {
    // 1. Check if entering from admin.html or already authenticated in session
    if (window.checkAdminAccess && window.checkAdminAccess()) {
        grantAdminAccess("harshguruji01@gmail.com");
        return;
    }

    const cachedEmail = sessionStorage.getItem('admin_apk_email');
    if (cachedEmail === "harshguruji01@gmail.com") {
        grantAdminAccess(cachedEmail);
        return;
    }

    // Direct URL entry: Show in-page password gate card
    const unauthBox = document.getElementById('unauthorized-msg');
    const authForm = document.getElementById('apk-auth-gate-form');
    const passInput = document.getElementById('apk-admin-pass-input');
    const authErr = document.getElementById('apk-auth-error');

    if (unauthBox) unauthBox.style.display = 'flex';
    const adminContent = document.getElementById('admin-content');
    if (adminContent) adminContent.style.display = 'none';

    if (authForm && passInput) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = passInput.value.trim();
            if (val.toLowerCase() === "harshguruji01@gmail.com") {
                if (window.grantDirectAdminAccess) {
                    window.grantDirectAdminAccess();
                } else {
                    sessionStorage.setItem('admin_apk_email', "harshguruji01@gmail.com");
                }
                grantAdminAccess("harshguruji01@gmail.com");
            } else {
                if (authErr) {
                    authErr.style.display = 'block';
                    setTimeout(() => { if (authErr) authErr.style.display = 'none'; }, 3500);
                }
                passInput.value = '';
                passInput.focus();
            }
        });
    }
}

function grantAdminAccess(email) {
    document.getElementById('admin-user-email').textContent = email;
    document.getElementById('unauthorized-msg').style.display = 'none';
    document.getElementById('admin-content').style.display = 'block';

    let checkInterval = setInterval(() => {
        if (window.supabaseClient) {
            clearInterval(checkInterval);
            initAdmin();
        }
    }, 100);
}

function initAdmin() {
    // Load initial stats & apps
    loadStats();

    // Setup File Handlers
    setupFileHandlers();

    // Setup Form
    const uploadForm = document.getElementById('apk-upload-form');
    uploadForm.addEventListener('submit', handleUpload);
    document.getElementById('btn-reset').addEventListener('click', resetFormMode);

    // Slug generation
    document.getElementById('app-name').addEventListener('input', (e) => {
        const editId = document.getElementById('edit-app-id').value;
        if (!editId) {
            const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            document.getElementById('app-slug').value = slug;
        }
    });

    document.getElementById('btn-logout').addEventListener('click', () => {
        if (window.clearAdminSessions) {
            window.clearAdminSessions();
        } else {
            sessionStorage.removeItem('admin_apk_email');
        }
        window.location.href = 'index.html';
    });

    // Copy URL button in success banner
    const copyUrlBtn = document.getElementById('btn-copy-url');
    if (copyUrlBtn) {
        copyUrlBtn.addEventListener('click', () => {
            const urlInput = document.getElementById('success-app-url');
            if (urlInput && urlInput.value) {
                navigator.clipboard.writeText(urlInput.value).then(() => {
                    showToast("Dedicated URL copied to clipboard!", "success");
                }).catch(() => {
                    urlInput.select();
                    document.execCommand('copy');
                    showToast("Link copied!", "success");
                });
            }
        });
    }

    // Dashboard Cards Interaction
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.stat-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            renderAppList(card.dataset.filter);
        });
    });

    document.getElementById('btn-close-list').addEventListener('click', () => {
        document.getElementById('app-list-section').style.display = 'none';
        document.querySelectorAll('.stat-card').forEach(c => c.classList.remove('active'));
    });
}

async function loadStats() {
    const supabase = window.supabaseClient;
    if (!supabase) return;

    try {
        const { data: apps, error } = await supabase.from('store_apps').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error("Failed to load apps:", error);
            return;
        }

        appsCache = apps || [];

        let total = appsCache.length;
        let published = appsCache.filter(a => a.status === 'Published').length;
        let drafts = appsCache.filter(a => a.status === 'Draft').length;
        let downloads = appsCache.reduce((sum, a) => sum + (a.downloads || 0), 0);

        document.getElementById('stat-total').textContent = total;
        document.getElementById('stat-published').textContent = published;
        document.getElementById('stat-drafts').textContent = drafts;
        document.getElementById('stat-downloads').textContent = downloads;

        // Fetch recent logged-in downloads
        const { data: dlData, error: dlError } = await supabase.from('app_downloads').select('*').order('downloaded_at', { ascending: false }).limit(100);
        if (!dlError && dlData) {
            const userIds = [...new Set(dlData.map(d => d.user_id).filter(Boolean))];
            let profileMap = {};
            if (userIds.length > 0) {
                const { data: profData } = await supabase.from('profiles').select('*').in('id', userIds);
                if (profData) {
                    profData.forEach(p => profileMap[p.id] = p);
                }
            }

            downloadsCache = dlData.map(d => {
                const app = appsCache.find(a => a.id === d.app_id);
                const profile = profileMap[d.user_id];
                return {
                    ...d,
                    app_name: app ? app.name : 'Unknown App',
                    app_logo: app ? (app.logo_url || 'logo.png') : 'logo.png',
                    user_name: profile ? (profile.display_name || profile.email || 'User') : 'Anonymous User',
                    user_avatar: profile ? (profile.avatar_url || 'ai.png') : 'ai.png',
                    user_email: profile ? (profile.email || '') : ''
                };
            });
        }

        // Refresh table if open
        const activeCard = document.querySelector('.stat-card.active');
        if (activeCard) renderAppList(activeCard.dataset.filter);
    } catch (err) {
        console.error("loadStats error:", err);
    }
}

function renderAppList(filter) {
    const section = document.getElementById('app-list-section');
    const thead = document.getElementById('app-list-head');
    const tbody = document.getElementById('app-list-body');
    const title = document.getElementById('list-section-title');

    section.style.display = 'block';

    if (filter === 'downloads') {
        title.textContent = 'Recent User Downloads';
        thead.innerHTML = `
            <tr>
                <th style="width: 50px;">User</th>
                <th>Name / Email</th>
                <th>App Downloaded</th>
                <th>Time</th>
            </tr>
        `;

        if (downloadsCache.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No logged-in user downloads yet</td></tr>';
            return;
        }

        tbody.innerHTML = downloadsCache.map(d => `
            <tr>
                <td><img src="${d.user_avatar}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border);"></td>
                <td><strong>${d.user_name}</strong><br><span style="font-size: 0.8rem; color: var(--text-muted);">${d.user_email}</span></td>
                <td>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <img src="${d.app_logo}" style="width: 24px; height: 24px; border-radius: 4px; object-fit: cover;">
                        <span>${d.app_name}</span>
                    </div>
                </td>
                <td style="color: var(--text-muted); font-size: 0.9rem;">${new Date(d.downloaded_at).toLocaleString()}</td>
            </tr>
        `).join('');
        return;
    }

    // Default App List View
    thead.innerHTML = `
        <tr>
            <th style="width: 50px;">Icon</th>
            <th>Name & Details</th>
            <th>Category & Platform</th>
            <th>License & Rating</th>
            <th>Status</th>
            <th>Downloads</th>
            <th>Dedicated URL</th>
            <th>Actions</th>
        </tr>
    `;

    let filtered = appsCache;

    if (filter === 'published') {
        filtered = appsCache.filter(a => a.status === 'Published');
        title.textContent = 'Published Apps';
    } else if (filter === 'drafts') {
        filtered = appsCache.filter(a => a.status === 'Draft');
        title.textContent = 'Draft Apps';
    } else {
        title.textContent = 'All Apps';
    }

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--text-muted);">No apps found</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(app => {
        const platformIcon = getPlatformIcon(app.platform || 'Android');
        const platform = app.platform || 'Android';
        const appType = app.app_type || 'APK';
        const category = Array.isArray(app.category) ? (app.category[0] || 'Apps') : (app.category || 'Apps');
        const modBadge = app.is_mod ? `<span style="background: rgba(255, 119, 0, 0.2); color: #ff7700; border: 1px solid rgba(255,119,0,0.4); padding: 1px 5px; border-radius: 4px; font-size: 0.65rem; font-weight: 700; margin-left: 4px;">MOD</span>` : '';
        const featuredBadge = app.featured ? `<span style="color: #f59e0b; font-size: 0.75rem;" title="Featured">⭐</span>` : '';

        return `
        <tr>
            <td><img src="${app.logo_url || 'logo.png'}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;"></td>
            <td>
                <strong>${app.name}</strong> ${modBadge} ${featuredBadge}<br>
                <span style="font-size: 0.8rem; color: var(--text-muted);">v${app.version || '1.0'} &bull; ${app.file_size || 'N/A'}</span>
            </td>
            <td>
                <div style="display:flex; flex-direction: column; gap: 3px;">
                    <span style="font-size: 0.75rem; color: #cbd5e1; font-weight: 600;">${category}</span>
                    <div style="display:flex; gap: 4px;">
                        <span class="platform-pill">${platformIcon} ${platform}</span>
                        <span class="type-pill">${appType}</span>
                    </div>
                </div>
            </td>
            <td>
                <span style="font-size: 0.8rem; color: #10b981; font-weight: 600;">${app.license || 'Free'}</span><br>
                <span style="font-size: 0.75rem; color: #f59e0b;">★ ${Number(app.rating || 4.8).toFixed(1)}</span>
            </td>
            <td>
                <span style="color: ${app.status === 'Published' ? 'var(--success)' : '#f59e0b'}; font-size: 0.85rem; padding: 2px 8px; border-radius: 12px; background: rgba(255,255,255,0.05);">
                    ${app.status}
                </span>
            </td>
            <td>${app.downloads || 0}</td>
            <td>
                <div style="display:flex; align-items:center; gap: 6px;">
                    <a href="app.html?slug=${encodeURIComponent(app.slug)}" target="_blank" style="color:#38bdf8; font-size: 0.85rem; text-decoration:none; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        /app.html?slug=${app.slug}
                    </a>
                    <button class="action-btn" onclick="copyAppUrl('${app.slug}')" title="Copy App Link" style="color: var(--primary);">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                </div>
            </td>
            <td>
                <button class="action-btn edit" onclick="editApp('${app.id}')" title="Edit App">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="action-btn delete" onclick="deleteApp('${app.id}', '${app.name}')" title="Delete App">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </td>
        </tr>
    `}).join('');
}

function getPlatformIcon(platform) {
    switch ((platform || '').toLowerCase()) {
        case 'windows': return '🪟';
        case 'android': return '🤖';
        case 'mac':
        case 'macos': return '🍎';
        case 'linux': return '🐧';
        case 'web': return '🌐';
        case 'ios': return '🍏';
        case 'cross-platform': return '⚡';
        default: return '📦';
    }
}

window.copyAppUrl = function(slug) {
    const fullUrl = `${window.location.origin}/app.html?slug=${encodeURIComponent(slug)}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
        showToast("App URL copied: " + fullUrl, "success");
    }).catch(() => {
        showToast("Failed to copy URL", "error");
    });
};

window.editApp = function(id) {
    const app = appsCache.find(a => a.id === id);
    if (!app) return;

    // Set fields
    document.getElementById('edit-app-id').value = app.id;
    document.getElementById('app-name').value = app.name;
    document.getElementById('app-slug').value = app.slug;
    document.getElementById('app-short-desc').value = app.short_description || '';
    document.getElementById('app-full-desc').value = app.description || '';
    
    if (document.getElementById('app-platform')) {
        document.getElementById('app-platform').value = app.platform || 'Android';
    }
    if (document.getElementById('app-type')) {
        document.getElementById('app-type').value = app.app_type || 'APK';
    }

    document.getElementById('app-category').value = Array.isArray(app.category) ? (app.category[0] || 'Apps') : (app.category || 'Apps');
    document.getElementById('app-subcategory').value = app.subcategory || '';
    
    if (document.getElementById('app-license')) {
        document.getElementById('app-license').value = app.license || 'Free';
    }
    if (document.getElementById('app-rating')) {
        document.getElementById('app-rating').value = app.rating || 4.8;
    }
    if (document.getElementById('app-is-mod')) {
        document.getElementById('app-is-mod').checked = !!app.is_mod;
    }
    if (document.getElementById('app-mod-info')) {
        document.getElementById('app-mod-info').value = app.mod_info || '';
    }
    if (document.getElementById('app-custom-size')) {
        document.getElementById('app-custom-size').value = app.file_size || '';
    }

    document.getElementById('app-developer').value = app.developer_name || '';
    document.getElementById('app-package').value = app.package_name || '';
    document.getElementById('app-version').value = app.version || '1.0';
    document.getElementById('app-version-code').value = app.version_code || 1;
    document.getElementById('app-whats-new').value = app.whats_new || '';
    document.getElementById('app-featured').checked = !!app.featured;
    document.getElementById('app-verified').checked = app.verified !== false;
    document.getElementById('app-status').value = app.status || 'Published';

    const directUrlInput = document.getElementById('app-direct-url');
    if (directUrlInput) {
        directUrlInput.value = app.download_url || '';
    }

    // Set file boxes (to optional for update)
    document.getElementById('logo-filename').textContent = "Upload new logo (Optional - current kept)";
    document.getElementById('apk-filename').textContent = "Upload new file package (Optional - current kept)";
    document.getElementById('app-logo').removeAttribute('required');

    // Scroll and show UI
    document.getElementById('upload-form-title').textContent = `Edit Application: ${app.name}`;
    document.getElementById('btn-submit').textContent = "Update Application";
    document.querySelector('.upload-container').scrollIntoView({ behavior: 'smooth' });
};

window.deleteApp = async function(id, name) {
    if (!confirm(`Are you sure you want to completely delete "${name}"? This action cannot be undone.`)) return;

    const supabase = window.supabaseClient;
    const overlay = document.getElementById('progress-overlay');

    try {
        overlay.classList.add('active');
        document.getElementById('progress-title').textContent = "Deleting Application...";
        document.querySelectorAll('.progress-track, .progress-text').forEach(el => el.style.display = 'none');
        document.getElementById('progress-item-db').querySelector('.pct').textContent = "Deleting from database...";

        const { error } = await supabase.from('store_apps').delete().eq('id', id);
        if (error) throw new Error("Delete failed: " + error.message);

        showToast("Application deleted successfully", "success");
        await loadStats(); // Reload list and stats
    } catch (err) {
        showToast(err.message, "error");
    } finally {
        overlay.classList.remove('active');
        document.getElementById('progress-title').textContent = "Processing Upload...";
        document.querySelectorAll('.progress-track, .progress-text').forEach(el => el.style.display = '');
    }
};

function resetFormMode() {
    document.getElementById('apk-upload-form').reset();
    document.getElementById('edit-app-id').value = '';
    document.getElementById('upload-form-title').textContent = "Publish New Application / Software";
    document.getElementById('btn-submit').textContent = "Upload & Publish";
    document.getElementById('btn-submit').disabled = false;
    document.getElementById('app-logo').setAttribute('required', 'true');
    resetFileBoxes();
}

// --- FILE HANDLERS ---
function setupFileHandlers() {
    setupDropzone('logo-dropzone', 'app-logo', 'logo-filename');
    setupDropzone('apk-dropzone', 'app-apk', 'apk-filename');
    setupDropzone('screenshots-dropzone', 'app-screenshots', 'screenshots-filename', true);
}

function setupDropzone(zoneId, inputId, textId, isMultiple = false) {
    const zone = document.getElementById(zoneId);
    const input = document.getElementById(inputId);
    const text = document.getElementById(textId);
    if (!zone || !input || !text) return;

    zone.addEventListener('click', (e) => {
        if (e.target !== input) {
            input.click();
        }
    });

    input.addEventListener('change', () => {
        if (input.files.length > 0) {
            if (isMultiple) {
                text.textContent = `${input.files.length} file(s) selected`;
            } else {
                const f = input.files[0];
                const sizeMB = (f.size / (1024 * 1024)).toFixed(1);
                text.textContent = `${f.name} (${sizeMB} MB)`;
                
                // Auto-detect platform and type from file extension
                if (inputId === 'app-apk') {
                    const ext = (f.name.split('.').pop() || '').toLowerCase();
                    const platformSelect = document.getElementById('app-platform');
                    const typeSelect = document.getElementById('app-type');

                    if (['exe', 'msi'].includes(ext)) {
                        if (platformSelect) platformSelect.value = 'Windows';
                        if (typeSelect) typeSelect.value = ext.toUpperCase();
                    } else if (['apk', 'xapk', 'aab'].includes(ext)) {
                        if (platformSelect) platformSelect.value = 'Android';
                        if (typeSelect) typeSelect.value = ext === 'apk' ? 'APK' : 'XAPK';
                    } else if (['dmg', 'pkg'].includes(ext)) {
                        if (platformSelect) platformSelect.value = 'Mac';
                        if (typeSelect) typeSelect.value = ext === 'dmg' ? 'DMG' : 'PKG';
                    } else if (['deb', 'appimage', 'rpm', 'tar.gz'].includes(ext)) {
                        if (platformSelect) platformSelect.value = 'Linux';
                        if (typeSelect) typeSelect.value = 'AppImage';
                    } else if (ext === 'ipa') {
                        if (platformSelect) platformSelect.value = 'iOS';
                        if (typeSelect) typeSelect.value = 'IPA';
                    } else if (['zip', 'rar', '7z'].includes(ext)) {
                        if (typeSelect) typeSelect.value = 'ZIP';
                    }

                    // Warn if file > 50MB (Supabase free storage limit)
                    if (f.size > 50 * 1024 * 1024) {
                        showToast("Notice: File is over 50MB. If Supabase storage rejects it, paste a direct mirror link below.", "warning");
                    }
                }
            }
            zone.style.borderColor = 'var(--success)';
        }
    });

    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.style.borderColor = 'var(--primary)';
    });

    zone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        if (input.files.length === 0) zone.style.borderColor = 'var(--border)';
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) {
            input.files = e.dataTransfer.files;
            const event = new Event('change');
            input.dispatchEvent(event);
        }
    });
}

function resetFileBoxes() {
    document.getElementById('logo-filename').textContent = "Drag & Drop or Click to Select (PNG/WebP)";
    document.getElementById('apk-filename').textContent = "Drag & Drop or Select File (.apk, .exe, .zip, .dmg, .msi, etc.)";
    document.getElementById('screenshots-filename').textContent = "Select multiple screenshot images";
    document.querySelectorAll('.file-upload-box').forEach(b => b.style.borderColor = 'var(--border)');
    const directUrl = document.getElementById('app-direct-url');
    if (directUrl) directUrl.value = '';
}

// --- UPLOAD LOGIC ---
async function handleUpload(e) {
    e.preventDefault();

    const supabase = window.supabaseClient;
    if (!supabase) {
        showToast("Database client not initialized. Please refresh.", "error");
        return;
    }

    const submitBtn = document.getElementById('btn-submit');
    const editId = document.getElementById('edit-app-id').value;
    const isUpdate = !!editId;

    let rawSlug = document.getElementById('app-slug').value.trim();
    // Sanitize slug strictly
    let slug = rawSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/(^-|-$)/g, '');
    if (!slug) {
        slug = 'app-' + Date.now();
    }

    // Check slug collision
    const existingApp = appsCache.find(a => a.slug === slug);
    if (existingApp && (!isUpdate || existingApp.id !== editId)) {
        // Automatically make unique so upload doesn't fail
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
        document.getElementById('app-slug').value = slug;
    }

    // Get Files & Direct Link
    const logoFile = document.getElementById('app-logo').files[0];
    const apkFile = document.getElementById('app-apk').files[0];
    const directUrl = (document.getElementById('app-direct-url')?.value || '').trim();
    const screenshots = document.getElementById('app-screenshots').files;

    if (!isUpdate) {
        if (!logoFile) {
            showToast("App Logo / Icon is required.", "error");
            return;
        }
        if (!apkFile && !directUrl) {
            showToast("Please select an application file or provide a Direct Download / Web URL.", "error");
            return;
        }
    }

    // Disable button to prevent double-submit
    submitBtn.disabled = true;
    submitBtn.textContent = isUpdate ? "Updating..." : "Uploading...";

    // Get existing data if updating
    let targetApp = isUpdate ? (appsCache.find(a => a.id === editId) || {}) : {};

    // UI Progress Setup
    const overlay = document.getElementById('progress-overlay');
    overlay.classList.add('active');
    document.getElementById('progress-title').textContent = isUpdate ? "Updating Application..." : "Processing Upload...";

    let logoUrl = targetApp.logo_url || '';
    let apkPath = targetApp.apk_storage_path || '';
    let downloadUrl = targetApp.download_url || '';
    let screenshotUrls = targetApp.screenshots || [];

    try {
        // 1. Upload Logo (if changed)
        if (logoFile) {
            updateProgress('logo', 40);
            const logoExt = (logoFile.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
            const logoPath = `${slug}/icon_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.${logoExt}`;
            const { error: logoErr } = await supabase.storage.from('app-logos').upload(logoPath, logoFile, { upsert: true });
            if (logoErr) throw new Error("Logo upload failed: " + logoErr.message);
            const { data: logoPub } = supabase.storage.from('app-logos').getPublicUrl(logoPath);
            logoUrl = logoPub.publicUrl;
            updateProgress('logo', 100);
        } else {
            updateProgress('logo', 100);
        }

        // 2. Upload Application File or use direct URL
        if (apkFile) {
            updateProgress('apk', 30);
            const version = document.getElementById('app-version').value || '1.0';
            const cleanFileName = apkFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            apkPath = `${slug}/${version}/${Date.now()}_${cleanFileName}`;

            const { error: apkErr } = await supabase.storage.from('apk-files').upload(apkPath, apkFile, { upsert: true });
            if (apkErr) {
                // If storage failed due to size and direct URL is available
                if (directUrl) {
                    downloadUrl = directUrl;
                    apkPath = 'external:' + directUrl;
                    showToast("File storage limit reached, using provided direct link instead.", "warning");
                } else {
                    throw new Error("File upload failed: " + apkErr.message + " (If file is >50MB, paste an external direct link)");
                }
            } else {
                const { data: apkPub } = supabase.storage.from('apk-files').getPublicUrl(apkPath);
                downloadUrl = apkPub.publicUrl;
            }
            updateProgress('apk', 100);
        } else if (directUrl) {
            downloadUrl = directUrl;
            apkPath = 'external:' + directUrl;
            updateProgress('apk', 100);
        }

        // 3. Upload Screenshots (append if new provided)
        if (screenshots && screenshots.length > 0) {
            let scCount = 0;
            screenshotUrls = [];
            for (let i = 0; i < screenshots.length; i++) {
                const sc = screenshots[i];
                const scExt = (sc.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
                const scPath = `${slug}/sc_${Date.now()}_${i}.${scExt}`;
                const { error: scErr } = await supabase.storage.from('app-screenshots').upload(scPath, sc, { upsert: true });
                if (!scErr) {
                    const { data: scPub } = supabase.storage.from('app-screenshots').getPublicUrl(scPath);
                    screenshotUrls.push(scPub.publicUrl);
                }
                scCount++;
                updateProgress('screenshots', Math.round((scCount / screenshots.length) * 100));
            }
        } else {
            updateProgress('screenshots', 100);
        }

        // 4. Save to DB
        document.getElementById('progress-item-db').querySelector('.pct').textContent = "Saving...";

        const status = document.getElementById('app-status').value || 'Published';
        const selectedCat = document.getElementById('app-category').value || 'Apps';
        const platform = document.getElementById('app-platform')?.value || 'Android';
        const appType = document.getElementById('app-type')?.value || 'APK';
        const license = document.getElementById('app-license')?.value || 'Free';
        const rating = parseFloat(document.getElementById('app-rating')?.value) || 4.8;
        const isMod = document.getElementById('app-is-mod')?.checked || false;
        const modInfo = (document.getElementById('app-mod-info')?.value || '').trim();
        const customSize = (document.getElementById('app-custom-size')?.value || '').trim();

        let calculatedSize = "Unknown";
        if (customSize) {
            calculatedSize = customSize;
        } else if (apkFile) {
            calculatedSize = (apkFile.size / (1024 * 1024)).toFixed(1) + " MB";
        } else if (targetApp.file_size) {
            calculatedSize = targetApp.file_size;
        }

        const appData = {
            name: document.getElementById('app-name').value.trim(),
            slug: slug,
            short_description: document.getElementById('app-short-desc').value.trim(),
            description: document.getElementById('app-full-desc').value.trim() || '',
            logo_url: logoUrl || targetApp.logo_url || "logo.png",
            category: [selectedCat], // Array format
            subcategory: document.getElementById('app-subcategory').value.trim() || '',
            platform: platform,
            app_type: appType,
            license: license,
            rating: rating,
            is_mod: isMod,
            mod_info: modInfo,
            developer_name: document.getElementById('app-developer').value.trim() || 'HarshGuruJi',
            package_name: document.getElementById('app-package').value.trim() || '',
            version: document.getElementById('app-version').value.trim() || '1.0',
            version_code: parseInt(document.getElementById('app-version-code').value) || 1,
            file_size: calculatedSize,
            whats_new: document.getElementById('app-whats-new').value.trim() || '',
            apk_storage_path: apkPath,
            download_url: downloadUrl,
            screenshots: Array.isArray(screenshotUrls) ? screenshotUrls : [],
            featured: document.getElementById('app-featured').checked,
            verified: document.getElementById('app-verified').checked,
            status: status
        };

        if (!isUpdate && status === 'Published') {
            appData.published_at = new Date().toISOString();
        } else if (isUpdate && status === 'Published' && targetApp.status !== 'Published') {
            appData.published_at = new Date().toISOString();
        }

        if (isUpdate) {
            appData.updated_at = new Date().toISOString();
            const { error: dbErr } = await supabase.from('store_apps').update(appData).eq('id', editId);
            if (dbErr) throw new Error("Update database error: " + dbErr.message);
        } else {
            const { error: dbErr } = await supabase.from('store_apps').insert(appData);
            if (dbErr) throw new Error("Insert database error: " + dbErr.message);
        }

        document.getElementById('progress-item-db').querySelector('.pct').textContent = "Done!";
        document.getElementById('progress-item-db').querySelector('.pct').style.color = "var(--success)";

        // Dedicated URL for this app
        const appDedicatedUrl = `${window.location.origin}/store-detail.html?slug=${encodeURIComponent(slug)}`;

        setTimeout(async () => {
            overlay.classList.remove('active');
            showToast(isUpdate ? "Application updated successfully!" : "Application published successfully!", "success");

            // Show dedicated URL banner
            const successCard = document.getElementById('upload-success-card');
            const urlInput = document.getElementById('success-app-url');
            const visitBtn = document.getElementById('btn-visit-app');

            if (successCard && urlInput && visitBtn) {
                urlInput.value = appDedicatedUrl;
                visitBtn.href = `store-detail.html?slug=${encodeURIComponent(slug)}`;
                successCard.style.display = 'block';
                successCard.scrollIntoView({ behavior: 'smooth' });
            }

            resetFormMode();
            await loadStats();
        }, 1200);

    } catch (err) {
        overlay.classList.remove('active');
        console.error("Upload error:", err);
        showToast(err.message, "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = isUpdate ? "Update Application" : "Upload & Publish";
    }
}

function updateProgress(id, pct) {
    const item = document.getElementById(`progress-item-${id}`);
    if (item && item.querySelector('.progress-fill')) {
        item.querySelector('.progress-fill').style.width = `${pct}%`;
        item.querySelector('.pct').textContent = `${Math.round(pct)}%`;
    }
}

function showToast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s forwards reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4500);
}
