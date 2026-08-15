// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initCustomAuth();
});

let appsCache = []; // Global cache for loaded apps

function initCustomAuth() {
    // 1st Password
    const pass1 = prompt("Step 1: Enter Admin Password");
    if (pass1 !== "AdminHarsh@StoreApk") {
        alert("Access Denied.");
        window.location.href = "index.html";
        return;
    }
    
    // 2nd Password
    const pass2 = prompt("Step 2: Enter Secondary Password");
    if (pass2 !== "RealAdminHarsh@StoreApk") {
        alert("Access Denied.");
        window.location.href = "index.html";
        return;
    }
    
    // Email
    const email = prompt("Step 3: Enter Admin Email");
    if (email !== "harshguruji01@gmail.com") {
        alert("Access Denied.");
        window.location.href = "index.html";
        return;
    }
    
    // Auth Success
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
    // Load Stats
    loadStats();
    
    // Setup File Handlers
    setupFileHandlers();
    
    // Setup Form
    document.getElementById('apk-upload-form').addEventListener('submit', handleUpload);
    document.getElementById('btn-reset').addEventListener('click', resetFormMode);
    
    // Slug generation
    document.getElementById('app-name').addEventListener('input', (e) => {
        const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        document.getElementById('app-slug').value = slug;
    });

    document.getElementById('btn-logout').addEventListener('click', () => {
        window.location.reload();
    });

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
    
    const { data: apps, error } = await supabase.from('store_apps').select('*').order('created_at', { ascending: false });
    if (error || !apps) return;
    
    appsCache = apps; // Cache for edit/delete
    
    let total = apps.length;
    let published = apps.filter(a => a.status === 'Published').length;
    let drafts = apps.filter(a => a.status === 'Draft').length;
    let downloads = apps.reduce((sum, a) => sum + (a.downloads || 0), 0);
    
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-published').textContent = published;
    document.getElementById('stat-drafts').textContent = drafts;
    document.getElementById('stat-downloads').textContent = downloads;
    
    // Refresh table if open
    const activeCard = document.querySelector('.stat-card.active');
    if (activeCard) renderAppList(activeCard.dataset.filter);
}

function renderAppList(filter) {
    const section = document.getElementById('app-list-section');
    const tbody = document.getElementById('app-list-body');
    const title = document.getElementById('list-section-title');
    
    section.style.display = 'block';
    let filtered = appsCache;
    
    if (filter === 'published') {
        filtered = appsCache.filter(a => a.status === 'Published');
        title.textContent = 'Published Apps';
    } else if (filter === 'drafts') {
        filtered = appsCache.filter(a => a.status === 'Draft');
        title.textContent = 'Draft Apps';
    } else if (filter === 'downloads') {
        filtered = [...appsCache].sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        title.textContent = 'Apps by Downloads';
    } else {
        title.textContent = 'All Apps';
    }
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No apps found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(app => `
        <tr>
            <td><img src="${app.logo_url || 'logo.png'}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;"></td>
            <td><strong>${app.name}</strong><br><span style="font-size: 0.8rem; color: var(--text-muted);">${app.version}</span></td>
            <td>
                <span style="color: ${app.status === 'Published' ? 'var(--success)' : '#f59e0b'}; font-size: 0.85rem; padding: 2px 8px; border-radius: 12px; background: rgba(255,255,255,0.05);">
                    ${app.status}
                </span>
            </td>
            <td>${app.downloads || 0}</td>
            <td>
                <button class="action-btn edit" onclick="editApp('${app.id}')" title="Edit App">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="action-btn delete" onclick="deleteApp('${app.id}', '${app.name}')" title="Delete App">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </td>
        </tr>
    `).join('');
}

window.editApp = function(id) {
    const app = appsCache.find(a => a.id === id);
    if (!app) return;
    
    // Set fields
    document.getElementById('edit-app-id').value = app.id;
    document.getElementById('app-name').value = app.name;
    document.getElementById('app-slug').value = app.slug;
    document.getElementById('app-short-desc').value = app.short_description;
    document.getElementById('app-full-desc').value = app.description || '';
    document.getElementById('app-category').value = app.category;
    document.getElementById('app-subcategory').value = app.subcategory || '';
    document.getElementById('app-developer').value = app.developer_name || '';
    document.getElementById('app-package').value = app.package_name || '';
    document.getElementById('app-version').value = app.version;
    document.getElementById('app-version-code').value = app.version_code || 1;
    document.getElementById('app-whats-new').value = app.whats_new || '';
    document.getElementById('app-featured').checked = app.featured;
    document.getElementById('app-verified').checked = app.verified;
    document.getElementById('app-status').value = app.status;
    
    // Set file boxes (to optional for update)
    document.getElementById('logo-filename').textContent = "Upload new logo (Optional)";
    document.getElementById('apk-filename').textContent = "Upload new APK (Optional)";
    document.getElementById('app-logo').removeAttribute('required');
    document.getElementById('app-apk').removeAttribute('required');
    
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
        
        // In a real scenario we'd also delete files from storage.
        // For now, we'll just delete the DB record.
        const { error } = await supabase.from('store_apps').delete().eq('id', id);
        if (error) throw new Error("Delete failed: " + error.message);
        
        showToast("Application deleted successfully", "success");
        await loadStats(); // Reload list and stats
    } catch (err) {
        showToast(err.message, "error");
    } finally {
        overlay.classList.remove('active');
        // reset UI
        document.getElementById('progress-title').textContent = "Processing Upload...";
        document.querySelectorAll('.progress-track, .progress-text').forEach(el => el.style.display = '');
    }
};

function resetFormMode() {
    document.getElementById('apk-upload-form').reset();
    document.getElementById('edit-app-id').value = '';
    document.getElementById('upload-form-title').textContent = "Publish New Application";
    document.getElementById('btn-submit').textContent = "Upload & Publish";
    document.getElementById('app-logo').setAttribute('required', 'true');
    document.getElementById('app-apk').setAttribute('required', 'true');
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
    
    zone.addEventListener('click', () => input.click());
    
    input.addEventListener('change', (e) => {
        if (input.files.length > 0) {
            if (isMultiple) {
                text.textContent = `${input.files.length} file(s) selected`;
            } else {
                text.textContent = input.files[0].name;
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
    document.getElementById('apk-filename').textContent = "Drag & Drop or Click to Select (.apk)";
    document.getElementById('screenshots-filename').textContent = "Select multiple screenshot images";
    document.querySelectorAll('.file-upload-box').forEach(b => b.style.borderColor = 'var(--border)');
}

// --- UPLOAD LOGIC ---
async function handleUpload(e) {
    e.preventDefault();
    
    const supabase = window.supabaseClient;
    const slug = document.getElementById('app-slug').value.trim();
    
    const editId = document.getElementById('edit-app-id').value;
    const isUpdate = !!editId;
    
    // Check if slug exists (only if new app or updating slug)
    const existingApp = appsCache.find(a => a.slug === slug);
    if (existingApp && (!isUpdate || existingApp.id !== editId)) {
        showToast("Error: An app with this slug already exists.", "error");
        return;
    }
    
    // Get Files
    const logoFile = document.getElementById('app-logo').files[0];
    const apkFile = document.getElementById('app-apk').files[0];
    const screenshots = document.getElementById('app-screenshots').files;
    
    if (!isUpdate && (!logoFile || !apkFile)) {
        showToast("Logo and APK are required for new apps.", "error");
        return;
    }
    
    // Get existing data if updating
    let targetApp = isUpdate ? appsCache.find(a => a.id === editId) : {};
    
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
            updateProgress('logo', 50);
            const logoExt = logoFile.name.split('.').pop();
            const logoPath = `${slug}/icon.${logoExt}`;
            const { error: logoErr } = await supabase.storage.from('app-logos').upload(logoPath, logoFile, { upsert: true });
            if (logoErr) throw new Error("Logo upload failed: " + logoErr.message);
            const { data: logoPub } = supabase.storage.from('app-logos').getPublicUrl(logoPath);
            logoUrl = logoPub.publicUrl;
            updateProgress('logo', 100);
        } else {
            updateProgress('logo', 100);
        }
        
        // 2. Upload APK (if changed)
        if (apkFile) {
            updateProgress('apk', 30);
            const version = document.getElementById('app-version').value;
            apkPath = `${slug}/${version}/${apkFile.name}`;
            const { error: apkErr } = await supabase.storage.from('apk-files').upload(apkPath, apkFile, { upsert: true });
            if (apkErr) throw new Error("APK upload failed: " + apkErr.message);
            
            const { data: apkPub } = supabase.storage.from('apk-files').getPublicUrl(apkPath);
            downloadUrl = apkPub.publicUrl;
            updateProgress('apk', 100);
        } else {
            updateProgress('apk', 100);
        }
        
        // 3. Upload Screenshots (append if new provided)
        if (screenshots.length > 0) {
            let scCount = 0;
            // Optionally clear old ones or append. We will overwrite/append for simplicity
            screenshotUrls = []; // Clear old if new uploaded
            for (let i = 0; i < screenshots.length; i++) {
                const sc = screenshots[i];
                const scExt = sc.name.split('.').pop();
                const scPath = `${slug}/sc_${i}_${Date.now()}.${scExt}`;
                const { error: scErr } = await supabase.storage.from('app-screenshots').upload(scPath, sc, { upsert: true });
                if (!scErr) {
                    const { data: scPub } = supabase.storage.from('app-screenshots').getPublicUrl(scPath);
                    screenshotUrls.push(scPub.publicUrl);
                }
                scCount++;
                updateProgress('screenshots', (scCount / screenshots.length) * 100);
            }
        } else {
            updateProgress('screenshots', 100);
        }
        
        // 4. Save to DB
        document.getElementById('progress-item-db').querySelector('.pct').textContent = "Saving...";
        
        const status = document.getElementById('app-status').value;
        const appData = {
            name: document.getElementById('app-name').value,
            slug: slug,
            short_description: document.getElementById('app-short-desc').value,
            description: document.getElementById('app-full-desc').value,
            logo_url: logoUrl,
            category: document.getElementById('app-category').value,
            subcategory: document.getElementById('app-subcategory').value,
            developer_name: document.getElementById('app-developer').value,
            package_name: document.getElementById('app-package').value,
            version: document.getElementById('app-version').value,
            version_code: parseInt(document.getElementById('app-version-code').value) || 1,
            file_size: apkFile ? ((apkFile.size / (1024 * 1024)).toFixed(1) + " MB") : targetApp.file_size,
            whats_new: document.getElementById('app-whats-new').value,
            apk_storage_path: apkPath,
            download_url: downloadUrl,
            screenshots: screenshotUrls,
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
        
        setTimeout(() => {
            overlay.classList.remove('active');
            showToast(isUpdate ? "Application updated successfully!" : "Application uploaded successfully!", "success");
            resetFormMode();
            loadStats();
        }, 1500);
        
    } catch (err) {
        overlay.classList.remove('active');
        console.error(err);
        showToast(err.message, "error");
    }
}

function updateProgress(id, pct) {
    const item = document.getElementById(`progress-item-${id}`);
    if(item && item.querySelector('.progress-fill')) {
        item.querySelector('.progress-fill').style.width = `${pct}%`;
        item.querySelector('.pct').textContent = `${Math.round(pct)}%`;
    }
}

function showToast(msg, type) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s forwards reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
